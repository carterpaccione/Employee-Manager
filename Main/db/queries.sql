[
    {
        "name": "get_all_users",
        "sql": "SELECT * FROM users"
    },
    {
        "name": "get_user_by_id",
        "sql": "SELECT * FROM users WHERE id = $1"
    },
    {
        "name": "create_user",
        "sql": "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *"
    },
    {
        "name": "update_user",
        "sql": "UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *"
    },
    {
        "name": "delete_user",
        "sql": "DELETE FROM users WHERE id = $1"
    }
]