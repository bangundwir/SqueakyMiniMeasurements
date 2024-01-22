import sqlite3
import os
import json


def insert_data(cursor, table_name, data, filename):
  data['source_file'] = filename  # Add the filename to the data dictionary
  placeholders = ', '.join(['?'] * len(data))
  columns = ', '.join(data.keys())
  sql = f"INSERT OR IGNORE INTO {table_name} ({columns}) VALUES ({placeholders})"
  cursor.execute(sql, list(data.values()))


def process_json_file(cursor, file_path):
  filename = os.path.basename(file_path)  # Get the filename from the file path
  with open(file_path, 'r') as file:
    data = json.load(file)

    # Insert dataumum
    insert_data(cursor, 'dataumum', data['dataumum'], filename)

    # Insert datastatuskuliah
    for item in data.get('datastatuskuliah', []):
      item['nm_pd'] = data['dataumum']['nm_pd']
      insert_data(cursor, 'datastatuskuliah', item, filename)

    # Insert datastudi
    for item in data.get('datastudi', []):
      item['nm_pd'] = data['dataumum']['nm_pd']
      insert_data(cursor, 'datastudi', item, filename)


conn = sqlite3.connect('datascrape.db')
cursor = conn.cursor()

# Create or update tables with the necessary columns and a column for the source file
cursor.execute('''CREATE TABLE IF NOT EXISTS dataumum (
    nm_pd TEXT PRIMARY KEY,
    jk TEXT,
    nipd TEXT,
    namapt TEXT,
    namajenjang TEXT,
    namaprodi TEXT,
    reg_pd TEXT,
    mulai_smt TEXT,
    nm_jns_daftar TEXT,
    nm_pt_asal TEXT,
    nm_prodi_asal TEXT,
    ket_keluar TEXT,
    tgl_keluar TEXT,
    no_seri_ijazah TEXT,
    sert_prof TEXT,
    link_pt TEXT,
    link_prodi TEXT,
    source_file TEXT
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS datastatuskuliah (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_smt TEXT,
    sks_smt INTEGER,
    nm_stat_mhs TEXT,
    nm_pd TEXT,
    source_file TEXT,
    UNIQUE(nm_pd, id_smt, source_file)
)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS datastudi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kode_mk TEXT,
    nm_mk TEXT,
    sks_mk INTEGER,
    id_smt TEXT,
    nilai_huruf TEXT,
    nm_pd TEXT,
    source_file TEXT,
    UNIQUE(kode_mk, nm_pd, id_smt, source_file)
)''')

# Process JSON files
for root, dirs, files in os.walk('./datascrape'):
  for file in files:
    if file.endswith('.json'):
      file_path = os.path.join(root, file)
      process_json_file(cursor, file_path)

# Commit changes and close the database connection
conn.commit()
conn.close()
