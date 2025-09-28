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


const apiKey="AIzaSyDgQYkhs5Kf8_o3Nw6533ZNiJ7rQDYUIJQ";
// ----------------- API ENDPOINTS -----------------

// Get all assets
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
app.get("/states", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT gid, state, ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom FROM state_boundary"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Get districts by state name
app.get("/states/:stateName/districts", async (req, res) => {
  const { stateName } = req.params;
  try {
    const result = await pool.query(
      "SELECT gid, district, district_boundary.state_lgd, state_ut, ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geom FROM district_boundary WHERE district_boundary.state_ut = $1",
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
      "SELECT gid As id, vill_name As name, ST_AsGeoJSON(ST_Transform(geom, 4326)) as geom FROM gomati WHERE UPPER(district) = UPPER($1)", 
      [districtName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching villages:", err);
    res.status(500).send("Database error");
  }
});

// Get all tribals
app.get("/api/tribals", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        name,
        village,
        state,
        district,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json as geom
      FROM tribals;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tribals:", err);
    res.status(500).send("Database error");
  }
});

// Tripura assets
app.get("/tipuraAssets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT district, village, vegetation_index, soil_index, n_water_index, geographic_rationale FROM tripura_geo_data"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tripura assets:", err);
    res.status(500).send("Database error");
  }
});

function parseNumber(value) {
  if (!value) return null;
  const match = value.match(/[\d.]+/); // extract numbers with decimal
  return match ? parseFloat(match[0]) : null;
}



// ----------------- OCR DATA INSERTION & DSS ANALYSIS LOGIC -----------------

// Helper function to parse key-value pairs from OCR text
async function analyzeEligibilityWithAI(ocrText, claimantName) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a specialized Legal Analyst for the Ministry of Tribal Affairs, focused on the Forest Rights Act (FRA), 2006. Your task is to analyze the provided OCR document text. Your output MUST be a clean JSON array summarizing eligibility for "Jal Jeevan Mission", "PM Kisan", and "MGNREGA". Each object in the array must have three keys: "schemeName", "qualifies" (with a value of "Yes" or "No"), and "reason".`;

    const userQuery = `Analyze the following OCR text for a claimant named ${claimantName}. Based on the details in the text, determine their eligibility for the schemes and provide a reason for each decision.

    OCR Text to Analyze:
    ---
    ${ocrText}
    ---

    Output ONLY the JSON array as instructed, with no other text or markdown formatting.`;

    // ✅ **FIXED PAYLOAD STRUCTURE**
    const payload = {
      // The `systemInstruction` object does not have a 'role' key.
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        role: "user",
        parts: [{ text: userQuery }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API returned status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
          throw new Error("No valid JSON response from AI model.");
        }

        return JSON.parse(jsonText);
    } catch (err) {
        console.error("❌ CRITICAL ERROR in analyzeEligibilityWithAI:", err.message);
        // Return an empty array or throw to let the caller handle it
        throw err;
    }
}

app.post("/dss-analysis", async (req, res) => {
    const { claimantId, ocrText } = req.body;
    console.log(`\n📊 Running DSS Analysis for claimantId: ${claimantId}`);
    console.log(`📊 OCR Text length: ${ocrText ? ocrText.length : 'NULL'}`);

    if (!claimantId || !ocrText) {
        console.log("❌ Missing required parameters");
        return res.status(400).json({ error: "Missing claimantId or ocrText in request." });
    }

    // Get a client from the pool
    const client = await pool.connect();

    try {
        // ---- START TRANSACTION ----
        await client.query('BEGIN');
        console.log("🚀 Transaction started.");

        console.log("🔍 Fetching claimant data from database...");
        const claimantRes = await client.query("SELECT name, village FROM claimants WHERE claimant_id = $1", [claimantId]);
        
        if (claimantRes.rows.length === 0) {
            console.log("❌ Claimant not found in database");
            // No need to commit or rollback if nothing happened yet
            return res.status(404).json({ error: "Claimant not found." });
        }
        
        const { name, village } = claimantRes.rows[0];
        console.log(`✅ Found claimant: ${name} from ${village}`);

        // 1. Get AI Eligibility Results
        console.log("🤖 Calling AI analysis...");
        const schemesResults = await analyzeEligibilityWithAI(ocrText, name);
        
        if (!schemesResults) {
            throw new Error("AI analysis returned no results.");
        }
        
        console.log("✅ AI Analysis Results:", JSON.stringify(schemesResults, null, 2));

        // 2. Update DB with AI results
        console.log("💾 Updating database with AI results...");
        for (const scheme of schemesResults) {
            const status = scheme.qualifies === 'Yes' ? 'Eligible (AI)' : 'Not Eligible (AI)';
            const upsertQuery = `
                INSERT INTO eligibility_status (claimant_id, scheme_name, status, reason)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (claimant_id, scheme_name)
                DO UPDATE SET status = EXCLUDED.status, reason = EXCLUDED.reason;
            `;
            await client.query(upsertQuery, [claimantId, scheme.schemeName, status, scheme.reason]);
            console.log(`✅ Updated scheme: ${scheme.schemeName} - ${status}`);
        }
        
        // ---- COMMIT TRANSACTION ----
        await client.query('COMMIT');
        console.log("✅ Transaction committed successfully.");

        // 3. Send final response to frontend
        const finalResponse = [{
            id: claimantId,
            name,
            village,
            schemes: schemesResults,
            geometry: { center: [23.8313, 91.2754] } // Mock geometry
        }];

        console.log("✅ DSS Analysis completed successfully");
        res.status(200).json(finalResponse);

    } catch (err) {
        // ---- ROLLBACK TRANSACTION ON ERROR ----
        await client.query('ROLLBACK');
        console.error('❌ Transaction rolled back due to an error.');

        console.error('❌ CRITICAL ERROR in /dss-analysis endpoint:', err.message);
        console.error('❌ Error stack:', err.stack);
        res.status(500).json({ error: "DSS analysis failed.", details: err.message });
    } finally {
        // ---- RELEASE CLIENT BACK TO POOL ----
        client.release();
        console.log("🔌 Client connection released.");
    }
});


function parseOcrData(ocrText) {
  const extract = (key) => {
    const regex = new RegExp(`${key}\\s*:?\\s*(.*?)\\s*(?=\\n|$)`, "i");
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
    gram_panchayat: extract("Gram Panchayat"),
    scheduled_tribe: /yes/i.test(extract("Scheduled Tribe") || ""),

    // ✅ match keys exactly as OCR JSON produces
    forestVillagesLand: parseNumber(extract("Extent Of Land In Forest Villages If Any")),
    habitationLand: parseNumber(extract("- For Habitation")),
    cultivationLand: parseNumber(extract("- For Self Cultivation")),
    StatusTitle: extract("Pattas Leases Grants If Any"),
    TraditionalRights: extract("Any Other Traditional Right If Any"),
    EvidenceSubmitted: extract("Evidence In Support"),
  };
}


// Endpoint to SAVE claimant data from OCR
// Endpoint to SAVE claimant data from OCR
app.post("/api/save-ocr-data", async (req, res) => {
    console.log("✅ Hit /api/save-ocr-data endpoint");

    const { ocrText } = req.body;
    if (!ocrText) {
        return res.status(400).json({ error: "OCR text is missing from the request." });
    }

    console.log("📄 Received OCR text length:", ocrText.length);
    console.log("📄 First 200 chars of OCR text:", ocrText.substring(0, 200));

    try {
        const data = parseOcrData(ocrText);
        console.log("📄 Parsed OCR data:", data);

        if (!data.name || !data.village) {
            return res.status(400).json({ error: "Could not extract required fields (Name or Village) from OCR text." });
        }

        const query = `
            INSERT INTO claimants (name, spouse_name, father_mother_name, address, village, district, is_scheduled_tribe, ocr_text)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING claimant_id, ocr_text;
        `;
        const values = [
            data.name, data.spouse_name, data.father_mother_name,
            data.address, data.village, data.district, data.scheduled_tribe,
            ocrText
        ];

        const result = await pool.query(query, values);
        const newClaimantId = result.rows[0].claimant_id;
        const storedOcrText = result.rows[0].ocr_text;

        console.log("✅ Stored OCR text length in database:", storedOcrText.length);

        const query2 = `
            INSERT INTO land_claims(claimant_id, land_in_forest_villages_acres, land_for_cultivation_acres, land_for_habitation_acres, land_title_status, traditional_rights, evidence_submitted)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING claim_id;
        `;
        const values2 = [
            newClaimantId, data.forestVillagesLand, data.habitationLand, data.cultivationLand, data.StatusTitle, data.TraditionalRights, data.EvidenceSubmitted
        ];

        const result2 = await pool.query(query2, values2);
        const newClaimId = result2.rows[0].claim_id;

        console.log("💾 Data inserted successfully. New claimant_id:", newClaimantId);
        
        // ✅ Return the correct claimantId and also return the OCR text for verification
        res.status(201).json({ 
            message: "OCR data saved successfully.", 
            claimantId: newClaimantId, 
            claim_id: newClaimId,
            ocrText: storedOcrText // Return for debugging
        });

    } catch (err) { 
        console.error("❌ Database insertion error:", err);
        res.status(500).json({ error: "Database error during data insertion.", details: err.message });
    }
});

// Fetches all claimant records for the main list view
app.get("/api/claimants", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT claimant_id, name, village, district, created_at 
       FROM claimants 
       ORDER BY created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching claimants:", err);
    res.status(500).json({ error: "Database query failed." });
  }
});

// Fetches detailed information for one specific claimant
// Fetches detailed information for one specific claimant
app.get("/api/claimant/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT c.*, lc.*, 
             (SELECT json_agg(es.*) FROM eligibility_status es WHERE es.claimant_id = c.claimant_id) as schemes
      FROM claimants c
      LEFT JOIN land_claims lc ON c.claimant_id = lc.claimant_id
      WHERE c.claimant_id = $1;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Claimant not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`❌ Error fetching claimant ${id}:`, err);
    res.status(500).json({ error: "Database query failed." });
  }
});

// Handles the deletion of a claimant's record
app.delete("/api/claimant/:id", async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Start a transaction

        // The 'ON DELETE CASCADE' in your database schema should handle deleting
        // related records in land_claims and eligibility_status automatically.
        const deleteQuery = 'DELETE FROM claimants WHERE claimant_id = $1 RETURNING name;';
        const result = await client.query(deleteQuery, [id]);

        await client.query('COMMIT'); // Commit the transaction

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Claimant not found." });
        }

        console.log(`🗑️ Deleted claimant: ${result.rows[0].name}`);
        res.status(200).json({ message: "Claimant deleted successfully." });

    } catch (err) {
        await client.query('ROLLBACK'); // Roll back on error
        console.error(`Error deleting claimant ${id}:`, err);
        res.status(500).json({ error: "Database error during deletion." });
    } finally {
        client.release(); // Release the client
    }
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