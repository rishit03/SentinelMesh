from pathlib import Path
import logging
from typing import List, Dict, Any, Optional

import aiosqlite

DB_PATH = "logs/sentinelmesh.db"
Path("logs").mkdir(parents=True, exist_ok=True)

# Configure logging
logger = logging.getLogger(__name__)


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS logs (
                id TEXT PRIMARY KEY,
                sender TEXT,
                receiver TEXT,
                context TEXT,
                payload TEXT,
                timestamp TEXT,
                received_at TEXT,  -- Added
                org TEXT,          -- Added
                risk INTEGER
            )
        """
        )
        
        # Create users table with role support
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                hashed_password TEXT NOT NULL,
                org TEXT NOT NULL,
                role TEXT DEFAULT 'user'
            )
        """
        )
        
        # Add role column to existing users table if it doesn't exist
        try:
            await db.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'")
        except Exception:
            # Column already exists, ignore the error
            pass
        
        await db.commit()


async def insert_log(log_id, data):
    print(f"📝 Inserting log with ID {log_id}")
    try:
        print(f"📦 Data: {data}")
    except Exception as e:
        print("❌ INSERT ERROR:", e)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            INSERT OR REPLACE INTO logs (id, sender, receiver, context, payload, timestamp, received_at, org, risk)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            (
                log_id,
                data.get("sender"),
                data.get("receiver"),
                data.get("context"),
                data.get("payload"),
                data.get("timestamp"),
                data.get("received_at"),  # Added
                data.get("org"),          # Added
                int(data.get("risk", 0)),
            ),
        )
        await db.commit()
        print("✅ Log committed to database")


async def get_logs(min_risk=0):
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT id, sender, receiver, context, payload, timestamp, received_at, org, risk FROM logs WHERE risk >= ? ORDER BY timestamp DESC", (min_risk,)
        )
        rows = await cursor.fetchall()
        print(f"📥 Queried {len(rows)} logs from DB")
        
        # Map rows to dictionary, adding missing fields for LogEntry model
        logs_data = []
        for row in rows:
            log_dict = dict(zip([column[0] for column in cursor.description], row))
            log_dict["rule_matches"] = [] # Add rule_matches as an empty list
            logs_data.append(log_dict)
            
        return logs_data


async def get_agent_stats():
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """
            SELECT 
                sender,
                COUNT(*) as message_count,
                AVG(risk) as avg_risk
            FROM logs
            GROUP BY sender
            ORDER BY avg_risk DESC
        """
        )
        rows = await cursor.fetchall()
        return [dict(zip([col[0] for col in cursor.description], row)) for row in rows]


# Basic user management functions (existing)
async def create_user(username: str, hashed_password: str, org: str):
    """Create a user with default 'user' role."""
    logger.debug(f"Creating user: {username} with hashed_password: {hashed_password}")
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO users (username, hashed_password, org, role) VALUES (?, ?, ?, ?)",
            (username, hashed_password, org, 'user')
        )
        await db.commit()
        logger.debug(f"User {username} created successfully.")


async def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Get a user by username."""
    logger.debug(f"Retrieving user: {username}")
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT username, hashed_password, org, role FROM users WHERE username = ?",
            (username,)
        )
        row = await cursor.fetchone()
        if row:
            user_data = dict(zip([column[0] for column in cursor.description], row))
            logger.debug(f"User {username} found: {user_data}")
            return user_data
        else:
            logger.debug(f"User {username} not found.")
            return None


# Extended user management functions for comprehensive user management
async def create_user_with_role(username: str, hashed_password: str, org: str, role: str = 'user'):
    """Create a user with a specific role."""
    logger.debug(f"Creating user: {username} with role: {role}")
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO users (username, hashed_password, org, role) VALUES (?, ?, ?, ?)",
            (username, hashed_password, org, role)
        )
        await db.commit()
        logger.debug(f"User {username} created successfully with role {role}.")


async def get_all_users() -> List[Dict[str, Any]]:
    """Get all users."""
    logger.debug("Retrieving all users")
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT username, hashed_password, org, role FROM users ORDER BY username"
        )
        rows = await cursor.fetchall()
        users = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
        logger.debug(f"Retrieved {len(users)} users")
        return users


async def get_users_by_org(org: str) -> List[Dict[str, Any]]:
    """Get all users in a specific organization."""
    logger.debug(f"Retrieving users for org: {org}")
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT username, hashed_password, org, role FROM users WHERE org = ? ORDER BY username",
            (org,)
        )
        rows = await cursor.fetchall()
        users = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
        logger.debug(f"Retrieved {len(users)} users for org {org}")
        return users


async def update_user(username: str, update_data: Dict[str, Any]):
    """Update a user's information."""
    logger.debug(f"Updating user: {username} with data: {update_data}")
    
    if not update_data:
        logger.debug("No update data provided")
        return
    
    # Build the SET clause dynamically
    set_clauses = []
    values = []
    
    for field, value in update_data.items():
        if field == 'username':
            set_clauses.append("username = ?")
        elif field == 'hashed_password':
            set_clauses.append("hashed_password = ?")
        elif field == 'org':
            set_clauses.append("org = ?")
        elif field == 'role':
            set_clauses.append("role = ?")
        else:
            continue  # Skip unknown fields
        values.append(value)
    
    if not set_clauses:
        logger.debug("No valid fields to update")
        return
    
    # Add the WHERE clause parameter
    values.append(username)
    
    query = f"UPDATE users SET {', '.join(set_clauses)} WHERE username = ?"
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(query, values)
        await db.commit()
        logger.debug(f"User {username} updated successfully")


async def delete_user(username: str):
    """Delete a user."""
    logger.debug(f"Deleting user: {username}")
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("DELETE FROM users WHERE username = ?", (username,))
        await db.commit()
        if cursor.rowcount > 0:
            logger.debug(f"User {username} deleted successfully")
        else:
            logger.debug(f"User {username} not found for deletion")


async def get_users_by_role(role: str) -> List[Dict[str, Any]]:
    """Get all users with a specific role."""
    logger.debug(f"Retrieving users with role: {role}")
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "SELECT username, hashed_password, org, role FROM users WHERE role = ? ORDER BY username",
            (role,)
        )
        rows = await cursor.fetchall()
        users = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
        logger.debug(f"Retrieved {len(users)} users with role {role}")
        return users


async def count_users_by_org(org: str) -> int:
    """Count users in a specific organization."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT COUNT(*) FROM users WHERE org = ?", (org,))
        row = await cursor.fetchone()
        return row[0] if row else 0


async def count_users_by_role(role: str) -> int:
    """Count users with a specific role."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("SELECT COUNT(*) FROM users WHERE role = ?", (role,))
        row = await cursor.fetchone()
        return row[0] if row else 0


async def get_user_stats() -> Dict[str, Any]:
    """Get user statistics."""
    async with aiosqlite.connect(DB_PATH) as db:
        # Total users
        cursor = await db.execute("SELECT COUNT(*) FROM users")
        total_users = (await cursor.fetchone())[0]
        
        # Users by role
        cursor = await db.execute(
            "SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role"
        )
        role_counts = dict(await cursor.fetchall())
        
        # Users by org
        cursor = await db.execute(
            "SELECT org, COUNT(*) FROM users GROUP BY org ORDER BY COUNT(*) DESC LIMIT 10"
        )
        org_counts = dict(await cursor.fetchall())
        
        return {
            "total_users": total_users,
            "users_by_role": role_counts,
            "users_by_org": org_counts
        }

