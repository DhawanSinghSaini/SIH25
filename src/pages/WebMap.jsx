import { useState } from "react";
import MapApp from "../components/MapApp";

const WebMap = () => {
  const [showLayers, setShowLayers] = useState(false);
  const [showFraClaims, setShowFraClaims] = useState(false);

  const toggleLayers = () => {
    setShowLayers(!showLayers);
  };

  return (
    <div className="w-full h-[600px] rounded-md overflow-hidden shadow-md relative">
      <MapApp />

      {/* Layers Button + Panel */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center">
        <div
          className={`flex items-center transition-all duration-300 ${
            showLayers ? "w-[300px]" : "w-[60px]"
          } h-[60px] bg-blue-600 rounded-md shadow overflow-hidden`}
        >
          <button
            onClick={toggleLayers}
            className="w-[60px] h-[60px] flex items-center justify-center text-white font-bold text-xl hover:bg-blue-700 transition"
          >
            ☰
          </button>

          {showLayers && (
            <div className="flex gap-4 px-4">
              <button
                onClick={() => setShowFraClaims(true)}
                className="text-white text-sm hover:bg-white hover:text-blue-600"
              >
                FRA Claims
              </button>
              <button
                onClick={() => setShowFraClaims(false)}
                className="text-white text-sm hover:bg-white hover:text-blue-600"
              >
                Village Boundaries
              </button>
              <button
                onClick={() => setShowFraClaims(false)}
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
