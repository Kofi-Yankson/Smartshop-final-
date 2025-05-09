# generate_catalog.py
import sqlite3
import json
import os

DATABASE_PATH = os.path.abspath("prisma/dev.db")

OUTPUT_FILE = "catalog.json"

def export_catalog():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products")
    columns = [col[0] for col in cursor.description]
    products = [dict(zip(columns, row)) for row in cursor.fetchall()]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    conn.close()
    print(f"Catalog exported to {OUTPUT_FILE}")

if __name__ == "__main__":
    export_catalog()
