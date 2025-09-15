import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaFilter } from 'react-icons/fa';
import MapApp from '../components/MapApp';

// Hardcoded 30 coordinates across India
const coordinates = [
  [77.1025, 28.7041], [72.8777, 19.0760], [88.3639, 22.5726], [80.2707, 13.0827], [75.8577, 22.7196],
  [76.9366, 8.5241], [78.4867, 17.3850], [73.8567, 18.5204], [85.8245, 20.2961], [74.7810, 15.2993],
  [76.6413, 12.2958], [79.1325, 10.7867], [77.5946, 12.9716], [78.9629, 20.5937], [74.1240, 16.7050],
  [81.6346, 21.2514], [75.3433, 31.3260], [76.7794, 30.7333], [73.2081, 22.3072], [79.0193, 21.1458],
  [78.6569, 10.7905], [76.9558, 11.0168], [74.5120, 13.6288], [77.4126, 23.2599], [80.9462, 26.8467],
  [83.2185, 17.6868], [84.8746, 19.0760], [85.1376, 25.5941], [91.7539, 26.1445], [92.9376, 26.2006]
];

// Generate 30 features with randomized claim data
const allFeatures = coordinates.map((coord, index) => {
  const approved = Math.floor(Math.random() * 50);
  const pending = Math.floor(Math.random() * 20);
  const rejected = Math.floor(Math.random() * 10);
  const schemes = ['PMAY', 'MGNREGA', 'NRLM', 'NSAP', 'Jal Jeevan', 'Digital India'];
  const linkedSchemes = schemes.sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');

  return {
    type: 'Feature',
    properties: {
      name: `Village ${String.fromCharCode(65 + (index % 26))}${index + 1}`,
      approved,
      pending,
      rejected,
      schemes: linkedSchemes,
    },
    geometry: {
      type: 'Point',
      coordinates: coord,
    },
  };
});

const WebMap = () => {
  const [showLayers, setShowLayers] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showFraClaims, setShowFraClaims] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    tribe: '',
    status: '',
  });

  const position = [20.5937, 78.9629]; // India center

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const showRandomFeatures = () => {
    const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
    setVisibleFeatures(shuffled.slice(0, 7));
    setShowFraClaims(true);
  };


  const applyFilter = () => {
    console.log('Filter applied', filters);
    setShowFilter(false);
    showRandomFeatures(); // 👈 refresh points
  };


  const toggleLayers = () => {
    setShowLayers(!showLayers);
    showRandomFeatures();
  };

  return (
  <div className="w-full h-[600px] rounded-md overflow-hidden shadow-md relative">
    {/* <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showFraClaims && (
        <GeoJSON
          data={{ type: 'FeatureCollection', features: visibleFeatures }}
          onEachFeature={(feature, layer) => {
            const props = feature.properties;
            const popupContent = `
              <div style="
                font-family: Arial, sans-serif;
                padding: 12px;
                max-width: 260px;
                border-radius: 8px;
                background-color: #f9f9f9;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              ">
                <h3 style="margin-top: 0; color: #2c3e50;">${props.name}</h3>
                <ul style="list-style: none; padding: 0; margin: 8px 0;">
                  <li><strong>Approved:</strong> ${props.approved}</li>
                  <li><strong>Pending:</strong> ${props.pending}</li>
                  <li><strong>Rejected:</strong> ${props.rejected}</li>
                  <li><strong>Schemes Linked:</strong> ${props.schemes}</li>
                </ul>
              </div>
            `;
            layer.bindPopup(popupContent);
            layer.on('click', () => layer.openPopup());
          }}
        />
      )}
    </MapContainer> */}
    <MapApp />

    {/* Filter Button + Panel */}
    <div className="absolute top-4 left-4 z-[1000]">
      <div className="relative">
        <button
          onClick={() => {
            setShowFilter(!showFilter);
            showRandomFeatures();
          }}
          className="w-10 h-10 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition flex items-center justify-center"
        >
          <FaFilter className="text-lg" />
        </button>

        {showFilter && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-4 z-[1000]">
            {['state', 'district', 'tribe', 'status'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <select
                  value={filters[field]}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select {field}</option>
                  {field === 'state' && (
                    <>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="MH">Maharashtra</option>
                    </>
                  )}
                  {field === 'district' && (
                    <>
                      <option value="Guntur">Guntur</option>
                      <option value="Nagpur">Nagpur</option>
                    </>
                  )}
                  {field === 'tribe' && (
                    <>
                      <option value="Gond">Gond</option>
                      <option value="Koya">Koya</option>
                    </>
                  )}
                  {field === 'status' && (
                    <>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </>
                  )}
                </select>
              </div>
            ))}

            <button
              onClick={applyFilter}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition text-sm font-medium"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Layers Button + Panel */}
    <div className="absolute bottom-4 left-4 z-[1000] flex items-center">
      <div className={`flex items-center transition-all duration-300 ${showLayers ? 'w-[300px]' : 'w-[60px]'} h-[60px] bg-blue-600 rounded-md shadow overflow-hidden`}>
        <button
          onClick={toggleLayers}
          className="w-[60px] h-[60px] flex items-center justify-center text-white font-bold text-xl hover:bg-blue-700 transition"
        >
          ☰
        </button>

        {showLayers && (
          <div className="flex gap-4 px-4">
            <button
              onClick={showRandomFeatures}
              className="text-white text-sm hover:bg-white hover:text-blue-600"
            >
              FRA Claims
            </button>

            <button
              onClick={showRandomFeatures}
              className="text-white text-sm hover:bg-white hover:text-blue-600"
            >
              Village Boundaries
            </button>
            <button
              onClick={showRandomFeatures}
              className="text-white text-sm hover:bg-white hover:text-blue-600"
            >
              Assets
            </button>
            
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default WebMap;
