import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",       // your username
  host: "localhost",      // or your server IP
  database: "sih",        // your db name
  password: "15484519",   // your password
  port: 5433,             // your port (default is 5432)
});

// Example API: get all assets
app.get("/assets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT type, name, ST_AsGeoJSON(geom) as geom FROM assets"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Get all states
// Get all states
app.get("/states", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT gid, state , ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom FROM state_boundary"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.get("/states/:stateName/districts", async (req, res) => {
  const { stateName } = req.params;
  try {
    const result = await pool.query(
      "SELECT gid, district, district_boundary.state_lgd, state_ut,ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geom  FROM district_boundary WHERE district_boundary.state_ut = $1",
      [stateName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }

});



// Get villages by district name
app.get("/districts/:districtName/gomati", async (req, res) => {
  const { districtName } = req.params;
  try {
    const result = await pool.query(
      "SELECT gid As id, vill_name As name, ST_AsGeoJSON(ST_Transform(geom, 4326)) FROM gomati WHERE UPPER(district) = UPPER($1)",  // ✅ normalize case
      [districtName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching villages:", err);
    res.status(500).send("Database error");
  }
});






const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
