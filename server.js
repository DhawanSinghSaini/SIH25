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

// ----------------- API ENDPOINTS -----------------

app.get("/states", async (req, res) => {
  try {
    const result = await pool.query("SELECT gid, state, ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom FROM state_boundary");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// ----------------- OCR DATA INSERTION & DSS ANALYSIS LOGIC -----------------

// Helper function to parse key-value pairs from OCR text
function parseOcrData(ocrText) {
  const extract = (key) => {
    const regex = new RegExp(`${key}:\\s*(.*?)\\s*(?=\\n|$)`, "i");
    const match = ocrText.match(regex);
    return match ? match[1].trim() : null;
  };

  return {
    name: extract("Name Of The Claimant"),
    spouse_name: extract("Name Of The Spouse"),
    father_mother_name: extract("Name Of Father Mother"),
    address: extract("Address"),
    village: extract("Village"),
    district: extract("District"),
    scheduled_tribe: extract("Scheduled Tribe") === "Yes",
    // Add other fields you want to parse
  };
}

// Endpoint to SAVE claimant data from OCR
app.post("/api/save-ocr-data", async (req, res) => {
    console.log("✅ Hit /api/save-ocr-data endpoint");

    const { ocrText } = req.body;
    if (!ocrText) {
        return res.status(400).json({ error: "OCR text is missing from the request." });
    }

    try {
        const data = parseOcrData(ocrText);
        console.log("📄 Parsed OCR data:", data);

        if (!data.name || !data.village) {
            return res.status(400).json({ error: "Could not extract required fields (Name or Village) from OCR text." });
        }

        const query = `
            INSERT INTO claimants (name, spouse_name, father_mother_name, address, village, district, is_scheduled_tribe)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING claimant_id;
        `;
        const values = [
            data.name, data.spouse_name, data.father_mother_name,
            data.address, data.village, data.district, data.is_scheduled_tribe
        ];

        const result = await pool.query(query, values);
        const newClaimantId = result.rows[0].claimant_id;

        console.log("💾 Data inserted successfully. New claimant_id:", newClaimantId);
        res.status(201).json({ message: "OCR data saved successfully.", claimantId: newClaimantId });

    } catch (err) {
        console.error("❌ Database insertion error:", err);
        res.status(500).json({ error: "Database error during data insertion.", details: err.message });
    }
});


// Endpoint for DSS Analysis (now receives claimantId)
app.post("/dss-analysis", (req, res) => {
  const { claimantId, jsonData } = req.body;
  console.log(`📊 Hit /dss-analysis endpoint for claimantId: ${claimantId}`);

  const claimantInfo = jsonData?.["Claimant Information"] || {};
  const name = claimantInfo["Name Of The Claimant"] || "Unknown Claimant";
  const village = claimantInfo["Village"] || "Unknown Village";

  // Mock analysis result using data from the frontend
  const mockAnalysisResults = [{
      id: claimantId, // Use the real ID from the database
      name: name,
      village: village,
      schemes: [
          { name: "Jal Jeevan Mission", qualifies: jsonData["Schemes Eligibility"]["Jal Jeevan Mission"].Qualifies },
          { name: "PM Kisan", qualifies: jsonData["Schemes Eligibility"]["Pm Kisan"].Qualifies },
          { name: "Mgnrega", qualifies: jsonData["Schemes Eligibility"]["Mgnrega"].Qualifies },
      ],
      geometry: { // Mock geometry for plotting
        center: [23.95, 91.78],
        land: {"type":"Polygon","coordinates":[[[91.77,23.95],[91.78,23.95],[91.78,23.94],[91.77,23.94],[91.77,23.95]]]},
        forest: {"type":"Polygon","coordinates":[[[91.785,23.955],[91.795,23.955],[91.795,23.945],[91.785,23.945],[91.785,23.955]]]},
      }
  }];
  
  res.status(200).json(mockAnalysisResults);
});


// Endpoint to update scheme status
app.post("/api/update-scheme-status", async (req, res) => {
  const { claimantId, schemeName, status } = req.body;

  if (!claimantId || !schemeName || !status) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // This is a simplified example. You might need a more robust query.
    // For instance, using INSERT ... ON CONFLICT DO UPDATE for new entries.
    const result = await pool.query(
      `UPDATE eligibility_status SET status=$1 WHERE claimant_id=$2 AND scheme_name=$3`,
      [status, claimantId, schemeName]
    );

    if (result.rowCount === 0) {
      // If no row was updated, it might not exist, so we can insert it.
      await pool.query(
          `INSERT INTO eligibility_status (claimant_id, scheme_name, status) VALUES ($1, $2, $3)`,
          [claimantId, schemeName, status]
      );
      console.log(`👍 Inserted status for claimant ${claimantId}`);
    } else {
        console.log(`👍 Updated status for claimant ${claimantId}`);
    }

    res.status(200).json({ message: "Status updated successfully." });
  } catch (err) {
    console.error("❌ Error updating scheme status:", err.message);
    res.status(500).json({ error: "Database error.", dbError: err.message });
  }
});

// ----------------- START SERVER -----------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));