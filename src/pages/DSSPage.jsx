import React from 'react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import OCRComponent from '../components/OCRComponent';

// --- LEAFLET ICON FIX ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


// --- HELPER COMPONENTS ---
const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// UPDATED: AnalysisReport now accepts an 'onHide' prop for the new button
const AnalysisReport = ({ data, onAnalyze, onHide }) => {
    if (!data) return null;
    const { "Claimant Information": claimant, "Nature Of Claim On Land": land, "Schemes Eligibility": schemes } = data;
    const InfoPair = ({ label, value }) => value ? <p><strong>{label}:</strong> {value}</p> : null;

    return (
        <div id="report-section" className="p-6 bg-white border rounded-lg shadow-sm print:shadow-none print:border-none print:p-0">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Claimant Profile & Eligibility Analysis</h1>
            <p className="text-center text-gray-500 mb-6 print:hidden">This report is generated based on the analysis of the uploaded document.</p>
            <div className="space-y-6">
                <section>
                    <h2 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">Claimant Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                        <InfoPair label="Name of Claimant" value={claimant?.["Name Of The Claimant"]} />
                        <InfoPair label="Name of Spouse" value={claimant?.["Name Of The Spouse"]} />
                        <InfoPair label="Name of Father/Mother" value={claimant?.["Name Of Father Mother"]} />
                        <InfoPair label="Tribe Status" value={claimant?.["Scheduled Tribe"] === "Yes" ? "Scheduled Tribe" : "N/A"} />
                        <InfoPair label="Address" value={claimant?.["Address"]} />
                        <InfoPair label="Village" value={claimant?.["Village"]} />
                        <InfoPair label="Gram Panchayat" value={claimant?.["Gram Panchayat"]} />
                        <InfoPair label="District" value={claimant?.["District"]} />
                    </div>
                </section>
                <section>
                    <h2 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">Nature of Claim on Land</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                        <InfoPair label="Land in Forest Villages" value={land?.["Extent Of Land In Forest Villages If Any"]} />
                        <InfoPair label="Land for Habitation" value={land?.["- For Habitation"]} />
                        <InfoPair label="Land for Cultivation" value={land?.["- For Self Cultivation"]} />
                        <InfoPair label="Land Title Status" value={land?.["Pattas Leases Grants If Any"]} />
                        <InfoPair label="Traditional Rights" value={land?.["Any Other Traditional Right If Any"]} />
                        <InfoPair label="Evidence Submitted" value={land?.["Evidence In Support"]} />
                    </div>
                </section>
                <section>
                    <h2 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">Scheme Eligibility Status</h2>
                     <ul className="space-y-2 text-sm">
                        {schemes && Object.entries(schemes).map(([schemeName, status]) => (
                            <li key={schemeName} className="flex items-center text-gray-700">
                                {status.Qualifies === "Yes" ? <span className="text-green-500 mr-2 font-bold">✅ Eligible:</span> : <span className="text-red-500 mr-2 font-bold">❌ Not Eligible:</span>}
                                {schemeName}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* UPDATED: Container for both buttons */}
            <div className="mt-6 pt-4 border-t flex justify-end items-center gap-4 print:hidden">
                 <button
                    onClick={onHide}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                >
                    Hide Details
                </button>
                <button
                    onClick={onAnalyze}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    DSS Analyze
                </button>
            </div>
        </div>
    );
};

const PreviousSubmissions = ({ claimants, onViewDetails }) => {
    if (!claimants || claimants.length === 0) {
        return <p className="text-center text-gray-500 mt-4">No previous submissions found.</p>;
    }
    return (
        <div className="mt-8 print:hidden">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Previously Submitted Claims</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Claimant Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Village</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">District</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Date Submitted</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {claimants.map((claimant) => (
                            <tr key={claimant.claimant_id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{claimant.name}</td>
                                <td className="px-4 py-3">{claimant.village}</td>
                                <td className="px-4 py-3">{claimant.district}</td>
                                <td className="px-4 py-3">{new Date(claimant.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onViewDetails(claimant.claimant_id)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- MAIN DSSPAGE COMPONENT ---
const DSSPage = () => {
    const [ocrJson, setOcrJson] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [plotData, setPlotData] = useState(null);
    const [previousClaimants, setPreviousClaimants] = useState([]);
    const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

    const fetchPreviousClaimants = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/claimants');
            if (!response.ok) throw new Error('Could not fetch previous submissions.');
            const data = await response.json();
            setPreviousClaimants(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPreviousClaimants();
    }, []);

    const handleOcrComplete = (text, parsedJson) => {
        setOcrJson(parsedJson);
        handleRunAnalysisAndSave(text, parsedJson);
    };

    const handleRunAnalysisAndSave = async (textToAnalyze, parsedJson) => {
        setIsAnalyzing(true);
        setAnalysisResults([]);
        setPlotData(null);
        setShowAnalysisPanel(false);
        try {
            const saveResponse = await fetch('http://localhost:5000/api/save-ocr-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ocrText: textToAnalyze }),
            });
            if (!saveResponse.ok) {
                const errorData = await saveResponse.json();
                throw new Error(`Failed to save OCR data: ${errorData.error || saveResponse.statusText}`);
            }
            const { claimantId } = await saveResponse.json();
            console.log("✅ Data saved. New Claimant ID:", claimantId);

            const analysisResponse = await fetch('http://localhost:5000/dss-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claimantId, jsonData: parsedJson }),
            });
            if (!analysisResponse.ok) throw new Error(`API Error during analysis: ${analysisResponse.statusText}`);
            
            const results = await analysisResponse.json();
            setAnalysisResults(results);
            setShowAnalysisPanel(true);
            fetchPreviousClaimants(); 
        } catch (error) {
            console.error('Error during DSS process:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleViewDetails = async (claimantId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/claimant/${claimantId}`);
            if (!response.ok) throw new Error('Failed to fetch claimant details.');
            
            const data = await response.json();
            const formattedOcrJson = {
                "Claimant Information": {
                    "Name Of The Claimant": data.name, "Name Of The Spouse": data.spouse_name, "Name Of Father Mother": data.father_mother_name,
                    "Scheduled Tribe": data.is_scheduled_tribe ? "Yes" : "No", "Address": data.address, "Village": data.village,
                    "Gram Panchayat": data.gram_panchayat, "District": data.district,
                },
                "Nature Of Claim On Land": {
                    "Extent Of Land In Forest Villages If Any": data.land_in_forest_villages_acres, "- For Habitation": data.land_for_habitation_acres,
                    "- For Self Cultivation": data.land_for_cultivation_acres, "Pattas Leases Grants If Any": data.land_title_status,
                    "Any Other Traditional Right If Any": data.traditional_rights, "Evidence In Support": data.evidence_submitted,
                },
                "Schemes Eligibility": (data.schemes || []).reduce((acc, scheme) => {
                    acc[scheme.scheme_name] = { Qualifies: scheme.status === 'Eligible' ? 'Yes' : 'No' };
                    return acc;
                }, {}),
            };
             const formattedAnalysisResult = [{
                id: data.claimant_id, name: data.name, village: data.village,
                schemes: (data.schemes || []).map(s => ({ name: s.scheme_name, qualifies: s.status === 'Eligible' ? 'Yes' : 'No' })),
                geometry: { center: [23.95, 91.78] }
            }];

            setOcrJson(formattedOcrJson);
            setAnalysisResults(formattedAnalysisResult);
            setShowAnalysisPanel(false);

            document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error viewing details:', error);
            alert(error.message);
        }
    };
    
    // NEW: Function to hide the details report and analysis panel
    const handleHideDetails = () => {
        setOcrJson(null);
        setAnalysisResults([]);
        setShowAnalysisPanel(false);
        setPlotData(null);
    };
    
    const handlePlotOnMap = (person) => {
        if (person.geometry && person.geometry.center) {
            setPlotData(person);
            document.getElementById('dss-map-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('No geographical data available for this person.');
        }
    };
    
    const handleGenerateReport = () => {
      const printContents = document.getElementById('report-section').innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    };

    const handleUpdateStatus = async (claimantId, schemeName, status) => {
      try {
        const response = await fetch('http://localhost:5000/api/update-scheme-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claimantId, schemeName, status }),
        });
        if (!response.ok) throw new Error('Failed to update status.');
        alert(`Status for ${schemeName} updated to ${status}.`);
      } catch (error) {
        console.error('Error updating status:', error);
        alert(error.message);
      }
    };


    return (
        <div className="bg-gray-50 p-6 rounded-md space-y-6">
            <div className="print:hidden">
                <h1 className="text-3xl font-bold text-blue-800 mb-4">Decision Support System</h1>
            </div>
            
            <div className="mt-4 border-2 rounded-md p-6 bg-white transition print:hidden border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Document for Analysis</h2>
                <OCRComponent onOcrComplete={handleOcrComplete} isAnalyzing={isAnalyzing} />
            </div>

            <PreviousSubmissions claimants={previousClaimants} onViewDetails={handleViewDetails} />

            {isAnalyzing && (
                <div className="mt-4 flex items-center justify-center text-blue-800 font-semibold">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Saving and Analyzing... Please wait.</span>
                </div>
            )}
            
            {ocrJson && !isAnalyzing && (
                <AnalysisReport 
                    data={ocrJson} 
                    onAnalyze={() => setShowAnalysisPanel(true)} 
                    onHide={handleHideDetails} 
                />
            )}

            {showAnalysisPanel && analysisResults.length > 0 && !isAnalyzing && (
                <div className="print:hidden">
                    <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">DSS Recommendation Panel</h2>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                         <table className="min-w-full text-sm">
                             <thead className="bg-gray-100">
                                 <tr>
                                     <th className="px-4 py-3 text-left font-semibold text-gray-600">FRA Holder</th>
                                     <th className="px-4 py-3 text-left font-semibold text-gray-600">Village</th>
                                     <th className="px-4 py-3 text-left font-semibold text-gray-600">Scheme Eligibility</th>
                                     <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {analysisResults.map((person) => (
                                     <tr key={person.id} className="border-t hover:bg-gray-50">
                                         <td className="px-4 py-2 font-medium">{person.name}</td>
                                         <td className="px-4 py-2">{person.village}</td>
                                         <td className="px-4 py-2">
                                             <ul className="flex flex-wrap gap-2">
                                                 {person.schemes.map(scheme => (
                                                     <li key={scheme.name} className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${scheme.qualifies === 'Yes' ? 'text-green-600 bg-green-200' : 'text-red-600 bg-red-200'}`}>
                                                         {scheme.name}
                                                     </li>
                                                 ))}
                                             </ul>
                                         </td>
                                         <td className="px-4 py-2">
                                             <div className="flex space-x-2">
                                                 <button onClick={() => handleUpdateStatus(person.id, "Jal Jeevan Mission", "Approved")} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">Approve</button>
                                                 <button onClick={() => handleUpdateStatus(person.id, "Jal Jeevan Mission", "Rejected")} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">Reject</button>
                                                 <button onClick={() => handlePlotOnMap(person)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs">Plot Map</button>
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                    </div>
                </div>
            )}
            
            {(analysisResults.length > 0 || plotData) && (
                <div id="dss-map-section" className="mt-8 print:hidden">
                    <MapContainer center={plotData?.geometry?.center || [23.8313, 91.2754]} zoom={plotData ? 14 : 9} style={{ height: '500px', width: '100%' }}>
                        <ChangeMapView center={plotData?.geometry?.center} zoom={plotData ? 14 : 9} />
                        <LayersControl position="topright">
                            <LayersControl.BaseLayer checked name="OpenStreetMap">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                            </LayersControl.BaseLayer>
                            <LayersControl.BaseLayer name="Esri Satellite">
                                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='Tiles &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, SWISSTOPO, and the GIS User Community' />
                            </LayersControl.BaseLayer>
                        </LayersControl>
                        {plotData && (
                            <Marker position={plotData.geometry.center}>
                                <Popup>
                                    <strong>{plotData.name}</strong><br />
                                    Village: {plotData.village}<br />
                                    Eligible for: {plotData.schemes.filter(s => s.qualifies === 'Yes').map(s => s.name).join(', ')}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            )}

            {/* This div contains the three bottom buttons and will always be at the end */}
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-4 justify-center print:hidden">
                <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto">Download Analysis Data</button>
                <button onClick={handleGenerateReport} className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition w-full sm:w-auto">Generate Report</button>
                <button className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition w-full sm:w-auto">Send to Ministry</button>
            </div>
        </div>
    );
};

export default DSSPage;