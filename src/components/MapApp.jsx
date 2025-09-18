import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
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
  const [assets, setAssets] = useState([]);
  const [view, setView] = useState("states");
  const [selectedFeature, setSelectedFeature] = useState(null);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // --- STYLES ---
  const defaultStyle = {
    color: "black",
    weight: 1,
    fillColor: "green",
    fillOpacity: 0.3,
  };

  const highlightStyle = {
    color: "green",
    weight: 3,
    fillColor: "lightyellow",
    fillOpacity: 0.1,
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
          setAssets([]);
          setSelectedFeature(null);
        })
        .catch((err) => console.error("❌ Error fetching states:", err));
    }
  }, [view, filters]);

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
        setAssets([]);
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
          // The 'geom' property from the API is now correctly used
          geometry: typeof v.geom === "string" ? JSON.parse(v.geom) : v.geom,
          // The API now sends 'id' and 'name', which solves the key warning
          properties: { id: v.id, name: v.name },
        })),
      });
      setView("villages");
      setAssets([]);
    })
    .catch((err) => console.error("❌ Error fetching villages:", err));
};

  // 📌 Load Assets
  const loadAssets = (villageId, feature) => {
    console.log(`📌 Loading assets for villageId=${villageId}`);
    setSelectedFeature({ type: "FeatureCollection", features: [feature] });
    fetch(`http://localhost:5000/villages/${villageId}/assets`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Assets fetched:", data);
        setAssets(data);
        setView("assets");
      })
      .catch((err) => console.error("❌ Error fetching assets:", err));
  };

  // --- HANDLERS ---

  // Handlers for map clicks (drill-down)
  const onEachState = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => {
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
      loadAssets(feature.properties.id, feature);
    });
  };

  // Handlers for dropdown changes
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedDistrict("");
    setSelectedVillage("");

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
    setSelectedVillage("");

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
    setSelectedVillage(villageId);

    if (villageId) {
      const feature = villages.features.find(
        (v) => v.properties.id.toString() === villageId
      );
      if (feature) {
        loadAssets(villageId, feature);
      }
    }
  };

  const handleBackToStates = () => {
    setView("states");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setDistricts(null);
    setVillages(null);
    setAssets([]);
    setSelectedFeature(null);
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
      </div>

      <MapContainer
        center={[23.5, 78.5]}
        zoom={5}
        style={{ height: "100vh", flex: 1 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url={`https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?apiKey=a583310ad97248b8873271116d89deef`}
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, © <a href="https://www.geoapify.com/">Geoapify</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url={`https://maps.geoapify.com/v1/tile/satellite/{z}/{x}/{y}.png?apiKey=a583310ad97248b8873271116d89deef`}
              attribution='Powered by <a href="https://www.geoapify.com/">Geoapify</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* --- MODIFIED LAYER RENDERING LOGIC --- */}
        
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
            {selectedFeature && (
              <>
                <GeoJSON data={selectedFeature} style={highlightStyle} />
                <FitBounds feature={selectedFeature} />
              </>
            )}
          </>
        )}

        {view === "villages" && villages && (
          <>
            <GeoJSON
              data={villages}
              style={defaultStyle}
              onEachFeature={onEachVillage}
            />
            {selectedFeature && (
              <>
                <GeoJSON data={selectedFeature} style={highlightStyle} />
                <FitBounds feature={selectedFeature} />
              </>
            )}
          </>
        )}

        {view === "assets" && assets.length > 0 && (
          <>
            {assets.map((a, idx) => {
              let geom;
              try {
                geom =
                  typeof a.geom === "string" ? JSON.parse(a.geom) : a.geom;
              } catch (err) {
                console.error("❌ Error parsing asset geom:", a.geom, err);
                return null;
              }
              return (
                <Marker
                  key={idx}
                  position={[geom.coordinates[1], geom.coordinates[0]]}
                >
                  <Popup>
                    <b>{a.name}</b> <br />
                    Type: {a.type}
                  </Popup>
                </Marker>
              );
            })}
            {selectedFeature && (
              <>
                <GeoJSON data={selectedFeature} style={highlightStyle} />
                <FitBounds feature={selectedFeature} />
              </>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapApp;