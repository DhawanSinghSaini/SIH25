import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import india from "../custom.geo.json";

const Map = () => {
  const indiaStyle = {
    fillColor: "transparent",
    color: "red",
    weight: 2,
  };

  return (
    <div style={{ height: "50vh", width: "50%" }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        minZoom={4} // cannot zoom out beyond this
        maxZoom={10} // cannot zoom in beyond this
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=a583310ad97248b8873271116d89deef"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
        />
        <GeoJSON data={india} style={indiaStyle} />
      </MapContainer>
    </div>
  );
};

export default Map;
