from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from models import User, UserCreate, UserUpdate, UserResponse, UserRole, UserInDB
from auth import get_current_user, get_password_hash, verify_password
from storage import create_user, get_user_by_username, get_all_users, update_user, delete_user

users_router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure the current user is an admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin role required."
        )
    return current_user


@users_router.get("/", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(get_current_admin_user)):
    """
    Retrieve all users. Admin only.
    """
    try:
        users = get_all_users()
        return [UserResponse(username=user.username, org=user.org, role=user.role) for user in users]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve users: {str(e)}"
        )


@users_router.get("/{username}", response_model=UserResponse)
async def get_user(username: str, current_user: User = Depends(get_current_admin_user)):
    """
    Retrieve a specific user by username. Admin only.
    """
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(username=user.username, org=user.org, role=user.role)


@users_router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_new_user(user_data: UserCreate, current_user: User = Depends(get_current_admin_user)):
    """
    Create a new user. Admin only.
    """
    # Check if user already exists
    existing_user = get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    try:
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user in database
        new_user = UserInDB(
            username=user_data.username,
            org=user_data.org,
            role=user_data.role,
            hashed_password=hashed_password
        )
        
        created_user = create_user(new_user)
        return UserResponse(username=created_user.username, org=created_user.org, role=created_user.role)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


@users_router.put("/{username}", response_model=UserResponse)
async def update_existing_user(
    username: str, 
    user_data: UserUpdate, 
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing user. Admin can update any user, users can update themselves.
    """
    # Check if user exists
    existing_user = get_user_by_username(username)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check permissions: admin can update anyone, users can only update themselves
    if current_user.role != UserRole.ADMIN and current_user.username != username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. You can only update your own profile."
        )
    
    # Non-admin users cannot change their role
    if current_user.role != UserRole.ADMIN and user_data.role is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. You cannot change your role."
        )
    
    try:
        # Prepare update data
        update_data = {}
        if user_data.username is not None:
            # Check if new username is already taken
            if user_data.username != username:
                existing_username = get_user_by_username(user_data.username)
                if existing_username:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Username already taken"
                    )
            update_data["username"] = user_data.username
        
        if user_data.org is not None:
            update_data["org"] = user_data.org
        
        if user_data.role is not None:
            update_data["role"] = user_data.role
        
        if user_data.password is not None:
            update_data["hashed_password"] = get_password_hash(user_data.password)
        
        # Update user in database
        updated_user = update_user(username, update_data)
        return UserResponse(username=updated_user.username, org=updated_user.org, role=updated_user.role)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )


@users_router.delete("/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_user(username: str, current_user: User = Depends(get_current_admin_user)):
    """
    Delete a user. Admin only.
    """
    # Check if user exists
    existing_user = get_user_by_username(username)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deleting themselves
    if current_user.username == username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account"
        )
    
    try:
        delete_user(username)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        )


@users_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user's information.
    """
    return UserResponse(username=current_user.username, org=current_user.org, role=current_user.role)

