export async function up(db) {
  // Cabinet Part Types
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabinet_part_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      default_width_formula TEXT,
      default_height_formula TEXT
    );
  `);

  // Material Types
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabinet_material_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  // Material Thicknesses
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabinet_material_thicknesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL UNIQUE
    );
  `);

  // Edge Thicknesses
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabinet_edge_thicknesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL UNIQUE
    );
  `);

  // Accessories
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabinet_accessories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  // Cabinet Parts
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cabinet_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_type_id INTEGER NOT NULL,
      material_type_id INTEGER NOT NULL,
      material_thickness_id INTEGER NOT NULL,
      edge_thickness_id INTEGER NOT NULL,
      accessories TEXT, -- JSON array of accessory IDs
      edge_banding TEXT, -- JSON object {front, back, top, bottom}
      width_formula TEXT,
      height_formula TEXT,
      custom_width_formula TEXT,
      custom_height_formula TEXT,
      FOREIGN KEY (part_type_id) REFERENCES cabinet_part_types(id),
      FOREIGN KEY (material_type_id) REFERENCES cabinet_material_types(id),
      FOREIGN KEY (material_thickness_id) REFERENCES cabinet_material_thicknesses(id),
      FOREIGN KEY (edge_thickness_id) REFERENCES cabinet_edge_thicknesses(id)
    );
  `);
}

export async function down(db) {
  await db.exec('DROP TABLE IF EXISTS cabinet_parts;');
  await db.exec('DROP TABLE IF EXISTS cabinet_accessories;');
  await db.exec('DROP TABLE IF EXISTS cabinet_edge_thicknesses;');
  await db.exec('DROP TABLE IF EXISTS cabinet_material_thicknesses;');
  await db.exec('DROP TABLE IF EXISTS cabinet_material_types;');
  await db.exec('DROP TABLE IF EXISTS cabinet_part_types;');
} 