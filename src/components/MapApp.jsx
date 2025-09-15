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

// 🔹 Component to zoom to feature bounds
const FitBounds = ({ feature }) => {
  const map = useMap();
  useEffect(() => {
    if (feature) {
      const layer = new L.GeoJSON(feature);
      map.fitBounds(layer.getBounds());
    }
  }, [feature, map]);
  return null;
};

const MapApp = () => {
  const [states, setStates] = useState(null);
  const [districts, setDistricts] = useState(null);
  const [villages, setVillages] = useState(null);
  const [assets, setAssets] = useState([]);
  const [view, setView] = useState("states");
  const [selectedFeature, setSelectedFeature] = useState(null);

  // 🎨 Styles
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

  // 🌍 Load States
  useEffect(() => {
    if (view === "states") {
      fetch("http://localhost:5000/states")
        .then((res) => res.json())
        .then((data) => {
          setStates({
            type: "FeatureCollection",
            features: data.map((s) => ({
              type: "Feature",
              geometry: JSON.parse(s.geom),
              properties: { id: s.gid, name: s.state_name },
            })),
          });
          setDistricts(null);
          setVillages(null);
          setAssets([]);
          setSelectedFeature(null);
        })
        .catch((err) => console.error("Error fetching states:", err));
    }
  }, [view]);

  // 📌 Load Districts
  const loadDistricts = (stateId, feature) => {
    setSelectedFeature({ type: "FeatureCollection", features: [feature] });

    fetch(`http://localhost:5000/states/${stateId}/districts`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts({
          type: "FeatureCollection",
          features: data.map((d) => ({
            type: "Feature",
            geometry: JSON.parse(d.geom),
            properties: { id: d.gid, name: d.district },
          })),
        });
        setView("districts");
        setVillages(null);
        setAssets([]);
      })
      .catch((err) => console.error("Error fetching districts:", err));
  };

  // 📌 Load Villages
  const loadVillages = (districtId, feature) => {
    setSelectedFeature({ type: "FeatureCollection", features: [feature] });

    fetch(`http://localhost:5000/districts/${districtId}/villages`)
      .then((res) => res.json())
      .then((data) => {
        setVillages({
          type: "FeatureCollection",
          features: data.map((v) => ({
            type: "Feature",
            geometry: JSON.parse(v.geom),
            properties: { id: v.gid, name: v.village },
          })),
        });
        setView("villages");
        setAssets([]);
      })
      .catch((err) => console.error("Error fetching villages:", err));
  };

  // 📌 Load Assets
  const loadAssets = (villageId, feature) => {
    setSelectedFeature({ type: "FeatureCollection", features: [feature] });

    fetch(`http://localhost:5000/villages/${villageId}/assets`)
      .then((res) => res.json())
      .then((data) => {
        setAssets(data);
        setView("assets");
      })
      .catch((err) => console.error("Error fetching assets:", err));
  };

  // 🔹 Handlers
  const onEachState = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => loadDistricts(feature.properties.id, feature));
  };

  const onEachDistrict = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => loadVillages(feature.properties.id, feature));
  };

  const onEachVillage = (feature, layer) => {
    layer.bindPopup(feature.properties.name);
    layer.on("click", () => loadAssets(feature.properties.id, feature));
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", padding: "10px", background: "#f4f4f4" }}>
        <h3>Navigation</h3>
        <button onClick={() => setView("states")}>🏠 Back to States</button>

        {states &&
          states.features.map((s) => (
            <button
              key={s.properties.id}
              onClick={() => loadDistricts(s.properties.id, s)}
            >
              {s.properties.name}
            </button>
          ))}

        {districts &&
          districts.features.map((d) => (
            <button
              key={d.properties.id}
              onClick={() => loadVillages(d.properties.id, d)}
            >
              {d.properties.name}
            </button>
          ))}

        {villages &&
          villages.features.map((v) => (
            <button
              key={v.properties.id}
              onClick={() => loadAssets(v.properties.id, v)}
            >
              {v.properties.name}
            </button>
          ))}
      </div>

      {/* Map */}
      <MapContainer
        center={[23.5, 78.5]}
        zoom={5}
        style={{ height: "100vh", flex: 1 }}
      >
        <LayersControl position="topright">
          {/* 🌍 Street Map */}
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url={`https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?apiKey=a583310ad97248b8873271116d89deef`}
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://www.geoapify.com/">Geoapify</a>'
            />
          </LayersControl.BaseLayer>

          {/* 🛰️ Satellite Map */}
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url={`https://maps.geoapify.com/v1/tile/satellite/{z}/{x}/{y}.png?apiKey=a583310ad97248b8873271116d89deef`}
              attribution='Powered by <a href="https://www.geoapify.com/">Geoapify</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Show States / Districts / Villages */}
        {view === "states" && states && (
          <GeoJSON data={states} style={defaultStyle} onEachFeature={onEachState} />
        )}

        {view === "districts" && districts && (
          <GeoJSON
            data={districts}
            style={defaultStyle}
            onEachFeature={onEachDistrict}
          />
        )}

        {view === "villages" && villages && (
          <GeoJSON
            data={villages}
            style={defaultStyle}
            onEachFeature={onEachVillage}
          />
        )}

        {/* Show Assets */}
        {view === "assets" &&
          assets.map((a, idx) => {
            const geom = JSON.parse(a.geom);
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

        {/* Highlight + Zoom */}
        {selectedFeature && (
          <>
            <GeoJSON data={selectedFeature} style={highlightStyle} />
            <FitBounds feature={selectedFeature} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapApp;
