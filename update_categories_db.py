import sqlite3

try:
    conn = sqlite3.connect('backend/zoovita.db')
    cursor = conn.cursor()
    
    print("Adding name_ru column to categories...")
    cursor.execute("ALTER TABLE categories ADD COLUMN name_ru VARCHAR DEFAULT '';")
    
    print("Adding name_en column to categories...")
    cursor.execute("ALTER TABLE categories ADD COLUMN name_en VARCHAR DEFAULT '';")
    
    conn.commit()
    print("Database columns added successfully.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Columns already exist.")
    else:
        print(f"Error modifying database: {e}")
finally:
    if conn:
        conn.close()
