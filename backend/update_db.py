import sqlite3

try:
    conn = sqlite3.connect('zoovita.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE ads ADD COLUMN telegram_message_id VARCHAR;")
    conn.commit()
    print("Database updated successfully!")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("Column already exists!")
    else:
        print(f"Error: {e}")
finally:
    conn.close()
