from pathlib import Path

import aiosqlite

DB_PATH = "logs/sentinelmesh.db"
Path("logs").mkdir(parents=True, exist_ok=True)


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