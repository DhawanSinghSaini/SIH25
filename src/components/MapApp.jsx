import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/sidebar.css";

// 🔹 Component to zoom to feature bounds
const FitBounds = ({ feature }) => {
  const map = useMap();
  useEffect(() => {
    if (feature) {
      console.log("🔍 Zooming to feature:", feature);
      const layer = new L.GeoJSON(feature);
      map.fitBounds(layer.getBounds());
    }
  }, [feature, map]);
  return null;
};

// ====================================================================
// ✅ MAIN APP COMPONENT
// ====================================================================
const MapApp = ({ filters }) => {
  // --- STATE MANAGEMENT ---
  const [states, setStates] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [villages, setVillages] = useState(null);
  const [tribals, setTribals] = useState(null); // Tribal data for a village
  const [view, setView] = useState("states");
  const [selectedFeature, setSelectedFeature] = useState(null); // For admin boundaries
  const [selectedTribalFeature, setSelectedTribalFeature] = useState(null); // For tribal boundaries

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedTribal, setSelectedTribal] = useState("");

  // --- STYLES ---
  const defaultStyle = {
    color: "black",
    weight: 1,
    fillColor: "green",
    fillOpacity: 0.2,
  };

  const highlightStyle = {
    color: "blue",
    weight: 3,
    fillColor: "transparent",
    fillOpacity: 0,
  };

  const tribalHighlightStyle = {
    color: "red",
    weight: 3,
    fillColor: "orange",
    fillOpacity: 0.6,
  };


  // --- DATA FETCHING ---

  // 🌍 Load States
  useEffect(() => {
    if (view === "states") {
      console.log("🌍 Fetching states...");
      let url = "http://localhost:5000/states";
      const queryParams = new URLSearchParams(
        Object.entries(filters || {}).filter(([_, v]) => v)
      );
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ States fetched:", data);
          setStates({
            type: "FeatureCollection",
            features: data.map((s) => ({
              type: "Feature",
              geometry:
                typeof s.geom === "string" ? JSON.parse(s.geom) : s.geom,
              properties: { id: s.gid, name: s.state },
            })),
          });
          setDistricts(null);
          setVillages(null);
          setSelectedFeature(null);
        })
        .catch((err) => console.error("❌ Error fetching states:", err));
    }
  }, [view, filters]);
  
  // 🌳 Load Tribals based on selected village
  useEffect(() => {
    // If a village is selected, fetch its tribals
    if (selectedVillage) {
      console.log(`🌳 Fetching tribals for village ID: ${selectedVillage}`);
      // NOTE: This endpoint is an assumption. Replace with your actual API endpoint.
      fetch(`http://localhost:5000/api/tribals`)
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Tribals for village fetched:", data);
          setTribals({
            type: "FeatureCollection",
            features: data.map((t) => ({
              type: "Feature",
              geometry: t.geom, // assuming geometry is already a JSON object
              properties: { 
                name: t.name,
                village: t.village,
                district: t.district,
                state: t.state,
              },
            })),
          });
        })
        .catch((err) => {
            console.error("❌ Error fetching tribals for village:", err);
            setTribals(null); // Clear tribals on error
        });
    } else {
      // Clear tribal data if no village is selected
      setTribals(null);
      setSelectedTribal("");
      setSelectedTribalFeature(null);
    }
  }, [selectedVillage]); // This effect runs whenever the selectedVillage changes

  // 📌 Load Districts
  const loadDistricts = (stateName, feature) => {
    console.log(`📌 Loading districts for stateName=${stateName}`);
    setSelectedFeature({ type: "FeatureCollection", features: [feature] });
    fetch(`http://localhost:5000/states/${stateName}/districts`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Districts fetched:", data);
        setDistricts({
          type: "FeatureCollection",
          features: data.map((d) => ({
            type: "Feature",
            geometry:
              typeof d.geom === "string" ? JSON.parse(d.geom) : d.geom,
            properties: { id: d.gid, name: d.district },
          })),
        });
        setView("districts");
        setVillages(null);
      })
      .catch((err) => console.error("❌ Error fetching districts:", err));
  };

  // 📌 Load Villages
  const loadVillages = (districtName, feature) => {
    console.log(`📌 Loading villages for districtName=${districtName}`);
    setSelectedFeature({ type: "FeatureCollection", features: [feature] });
    fetch(`http://localhost:5000/districts/${districtName}/gomati`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Villages fetched:", data);
        setVillages({
          type: "FeatureCollection",
          features: data.map((v) => ({
            type: "Feature",
            geometry: typeof v.geom === "string" ? JSON.parse(v.geom) : v.geom,
            properties: { id: v.id, name: v.name },
          })),
        });
        setView("villages");
      })
      .catch((err) => console.error("❌ Error fetching villages:", err));
  };


  // --- HANDLERS ---

  const clearTribalSelection = () => {
    setSelectedTribal("");
    setSelectedTribalFeature(null);
  };

  // Handlers for map clicks (drill-down)
  const onEachState = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => {
      clearTribalSelection();
      setSelectedState(feature.properties.id);
      loadDistricts(feature.properties.name, feature);
    });
  };

  const onEachDistrict = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => {
      setSelectedDistrict(feature.properties.name);
      loadVillages(feature.properties.name, feature);
    });
  };

  const onEachVillage = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => {
        setSelectedVillage(feature.properties.id);
        setSelectedFeature({ type: "FeatureCollection", features: [feature] });
    });
  };

  // Handlers for dropdown changes
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedDistrict("");
    setSelectedVillage(""); // Also clears tribals via useEffect
    clearTribalSelection();

    if (stateId) {
      const feature = states.features.find(
        (s) => s.properties.id.toString() === stateId
      );
      if (feature) {
        loadDistricts(feature.properties.name, feature);
      }
    } else {
      handleBackToStates();
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setSelectedDistrict(districtName);
    setSelectedVillage(""); // Also clears tribals via useEffect

    if (districtName) {
      const feature = districts.features.find(
        (d) => d.properties.name === districtName
      );
      if (feature) {
        loadVillages(districtName, feature);
      }
    }
  };

  const handleVillageChange = (e) => {
    const villageId = e.target.value;
    setSelectedVillage(villageId); // This will trigger the useEffect to fetch tribals

    if (villageId) {
      const feature = villages.features.find(
        (v) => v.properties.id.toString() === villageId
      );
      if (feature) {
        setSelectedFeature({ type: "FeatureCollection", features: [feature] });
      }
    }
  };

  const handleTribalChange = (e) => {
    const tribalName = e.target.value;
    setSelectedTribal(tribalName);

    // When a tribal land is selected, we NO LONGER clear the village selection.
    // We only update the tribal feature to be displayed.

    if (tribalName && tribals) {
        const feature = tribals.features.find(
            (t) => t.properties.name === tribalName
        );
        if (feature) {
            setSelectedTribalFeature({ type: "FeatureCollection", features: [feature] });
        }
    } else {
        setSelectedTribalFeature(null);
    }
  };

  const handleBackToStates = () => {
    setView("states");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setDistricts(null);
    setVillages(null);
    setSelectedFeature(null);
    clearTribalSelection(); // This is already being done
  };

  // --- RENDER ---
  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar">
        <h3>Navigation</h3>
        <button onClick={handleBackToStates}>🏠 Back to States View</button>

        <label htmlFor="state-select">State</label>
        <select
          id="state-select"
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">-- Select a State --</option>
          {states &&
            states.features.map((s) => (
              <option key={s.properties.id} value={s.properties.id}>
                {s.properties.name}
              </option>
            ))}
        </select>

        {districts && (
          <>
            <label htmlFor="district-select">District</label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
            >
              <option value="">-- Select a District --</option>
              {districts.features.map((d) => (
                <option key={d.properties.id} value={d.properties.name}>
                  {d.properties.name}
                </option>
              ))}
            </select>
          </>
        )}

        {villages && (
          <>
            <label htmlFor="village-select">Village</label>
            <select
              id="village-select"
              value={selectedVillage}
              onChange={handleVillageChange}
            >
              <option value="">-- Select a Village --</option>
              {villages.features.map((v) => (
                <option key={v.properties.id} value={v.properties.id}>
                  {v.properties.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Tribal dropdown now appears only after a village is selected */}
        {selectedVillage && tribals && (
          <>
            <label htmlFor="tribal-select">Tribal Lands</label>
            <select
                id="tribal-select"
                value={selectedTribal}
                onChange={handleTribalChange}
            >
                <option value="">-- Select a Tribal Land --</option>
                {tribals.features.map((t) => (
                    <option key={t.properties.name} value={t.properties.name}>
                        {t.properties.name}
                    </option>
                ))}
            </select>
          </>
        )}
      </div>

      <MapContainer
        center={[23.5, 78.5]}
        zoom={5}
        style={{ height: "100vh", flex: 1 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=9G8Kn8KFRnxmtCrPc5Do`}
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://www.geoapify.com/">Geoapify</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url={`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=3yNjmy7R73qOlG1VYmTN`}
              attribution='Powered by <a href="https://www.geoapify.com/">Geoapify</a>'
              maxZoom={40}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* --- LAYER RENDERING LOGIC --- */}
        
        {view === "states" && states && (
          <GeoJSON
            data={states}
            style={defaultStyle}
            onEachFeature={onEachState}
          />
        )}

        {view === "districts" && districts && (
          <>
            <GeoJSON
              data={districts}
              style={defaultStyle}
              onEachFeature={onEachDistrict}
            />
          </>
        )}

        {view === "villages" && villages && (
  <GeoJSON
    data={villages}
    style={(feature) =>
      feature.properties.id.toString() === selectedVillage
        ? highlightStyle   // highlight selected village
        : defaultStyle     // others stay normal
    }
    onEachFeature={onEachVillage}
  />
)}
        
        {/* --- HIGHLIGHTING LOGIC --- */}

        {/* This will now persist and show the selected State, District, OR Village */}
        {selectedFeature && (
          <>
            <GeoJSON data={selectedFeature} style={highlightStyle} />
            <FitBounds feature={selectedFeature} />
          </>
        )}

        {/* This is the new tribal land overlay */}
       {selectedTribalFeature && (
  <>
    <GeoJSON data={selectedTribalFeature} style={tribalHighlightStyle} />
    <FitBounds feature={selectedTribalFeature} />   {/* ✅ Now zooms to tribal */}
  </>
)}

      </MapContainer>
    </div>
  );
};

export default MapApp;