import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from models import User, UserInDB, Token, TokenData, UserCreate, UserResponse
from sqlite import create_user, get_user_by_username

logger = logging.getLogger(__name__)

auth_router = APIRouter()

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions for authentication
def verify_password(plain_password, hashed_password):
    logger.debug(f"Verifying password: Plain=\"{plain_password}\" Hashed=\"{hashed_password}\"")
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    hashed_password = pwd_context.hash(password)
    logger.debug(f"Generated hash for password: {hashed_password}")
    return hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(username: str):
    user_data = await get_user_by_username(username)
    if user_data:
        logger.debug(f"User retrieved from DB: {user_data.get("username")} Hashed_password: {user_data.get("hashed_password")}")
        return UserInDB(**user_data)
    logger.debug(f"User {username} not found in DB.")
    return None

async def authenticate_user(username: str, password: str):
    logger.debug(f"Attempting to authenticate user: {username}")
    user = await get_user(username)
    if not user:
        logger.debug(f"Authentication failed: User {username} not found.")
        return False
    if not verify_password(password, user.hashed_password):
        logger.debug(f"Authentication failed: Password mismatch for user {username}.")
        return False
    logger.debug(f"Authentication successful for user: {username}")
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_org(current_user: User = Depends(get_current_user)):
    return current_user.org

# User registration endpoint
@auth_router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        existing_user = await get_user(user.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        hashed_password = get_password_hash(user.password)
        await create_user(user.username, hashed_password, user.org)
        return UserResponse(username=user.username, org=user.org)
    except Exception as e:
        logger.exception(f"Error during user registration: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

# User login endpoint
@auth_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "org": user.org},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as http_exc:
        # Re-raise HTTPException directly so it\"s handled by http_exception_handler
        raise http_exc
    except Exception as e:
        logger.exception(f"Error during token generation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Token generation failed: {str(e)}"
        )


