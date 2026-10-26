---
title: "Test "
date: "2026-06-12"
tags: ["AI TESTs"]
excerpt: "Exposing database schemas, SQL query runners, and table metrics securely to large language models using the Model Context Protocol."
---

Large language models (LLMs) are incredibly capable, but they are limited by their static training data. To perform actual workflows on your system, they require **tools**. The Model Context Protocol (MCP), created by Anthropic, has emerged as the standard system for defining how AI models connect securely to local or remote database endpoints, APIs, and file systems.

In this post, we'll walk through building a high-performance MCP server in Python that exposes database schemas, SQL query execution capabilities, and table statistics to your agentic coding environment.

## Why Model Context Protocol?

Before MCP, every developer had to define their own custom JSON schemas for tool calling. MCP unifies tool hosts and client systems. When an AI client (like Antigravity or Claude Desktop) starts up, it reads the available tools, descriptions, and input schemas from the MCP server automatically, enabling plug-and-play integrations.

## Writing the MCP Server

We can use the lightweight `FastMCP` framework in Python to initialize our server. It handles transport bindings (STDIO or SSE) and JSON schema generation automatically.

```python
from mcp.server.fastmcp import FastMCP
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Initialize FastMCP Server
mcp = FastMCP("PostgreSQL Helper")

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "postgres"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASS", "secret")
    )

@mcp.tool()
def get_table_schema(table_name: str) -> str:
    """Retrieve columns, datatypes, and primary keys for a database table."""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = %s;
            """, (table_name,))
            columns = cur.fetchall()
            return str(columns)
    finally:
        conn.close()

@mcp.tool()
def run_read_query(query: str) -> str:
    """Execute a read-only SELECT query against the database (max 50 rows)."""
    # Guard against write queries
    clean_query = query.strip().lower()
    if not clean_query.startswith("select"):
        return "Error: Only read-only (SELECT) queries are allowed."
        
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            rows = cur.fetchmany(50)
            return str(rows)
    except Exception as e:
        return f"Database Error: {str(e)}"
    finally:
        conn.close()
```

## Registering and Testing the Server

To expose this server to your AI desktop client, you can add it to your client's settings configuration file (usually located under `~/.config/Claude/claude_desktop_config.json` or your AGY settings):

```json
{
  "mcpServers": {
    "postgres-helper": {
      "command": "python",
      "args": ["-m", "postgres_mcp_server"],
      "env": {
        "DB_HOST": "127.0.0.1",
        "DB_NAME": "production_database",
        "DB_USER": "readonly_user",
        "DB_PASS": "securepassword"
      }
    }
  }
}
```

## Security Best Practices

When granting AI models write or read access to a database, you must follow the principle of least privilege:

- **Read-Only Credentials:** Connect the MCP server with a read-only PostgreSQL role. Do not use the superuser account.
- **Command White-listing:** Validate queries programmatically to ensure only SELECT operations are accepted.
- **Limit Rows:** Cap response rows to prevent token context floods or denial of service issues.

Implementing these layers transforms raw data sources into secure, reliable tools that your LLMs can query dynamically during multi-turn agents architectures.
