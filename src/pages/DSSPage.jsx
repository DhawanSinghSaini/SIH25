import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import OCRComponent from '../components/OCRComponent';
import { Toaster, toast } from 'react-hot-toast';

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

const AnalysisReport = ({ data, onAnalyze, onHide }) => {
  if (!data) return null;
  const { 'Claimant Information': claimant, 'Nature Of Claim On Land': land } = data;
  const InfoPair = ({ label, value }) =>
    value ? (
      <p>
        <strong>{label}:</strong> {value}
      </p>
    ) : null;

  return (
    <div
      id="report-section"
      className="p-6 bg-white border rounded-lg shadow-lg print:shadow-none print:border-none print:p-0 animate-fade-in"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Claimant Profile & Land Claim Details
      </h1>
      <p className="text-center text-gray-500 mb-6 print:hidden">
        This report is generated based on the uploaded document.
      </p>
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
            Claimant Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
            <InfoPair label="Name of Claimant" value={claimant?.['Name Of The Claimant']} />
            <InfoPair label="Name of Spouse" value={claimant?.['Name Of The Spouse']} />
            <InfoPair label="Name of Father/Mother" value={claimant?.['Name Of Father Mother']} />
            <InfoPair
              label="Tribe Status"
              value={claimant?.['Scheduled Tribe'] === 'Yes' ? 'Scheduled Tribe' : 'N/A'}
            />
            <InfoPair label="Address" value={claimant?.['Address']} />
            <InfoPair label="Village" value={claimant?.['Village']} />
            <InfoPair label="Gram Panchayat" value={claimant?.['Gram Panchayat']} />
            <InfoPair label="District" value={claimant?.['District']} />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
            Nature of Claim on Land
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
            <InfoPair
              label="Land in Forest Villages"
              value={land?.['Extent Of Land In Forest Villages If Any']}
            />
            <InfoPair label="Land for Habitation" value={land?.['- For Habitation']} />
            <InfoPair label="Land for Cultivation" value={land?.['- For Self Cultivation']} />
            <InfoPair label="Land Title Status" value={land?.['Pattas Leases Grants If Any']} />
            <InfoPair
              label="Traditional Rights"
              value={land?.['Any Other Traditional Right If Any']}
            />
            <InfoPair label="Evidence Submitted" value={land?.['Evidence In Support']} />
          </div>
        </section>
      </div>

      <div className="mt-6 pt-4 border-t flex justify-end items-center gap-4 print:hidden">
        <button
          onClick={onHide}
          className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95"
        >
          Hide Details
        </button>
        <button
          onClick={onAnalyze}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95"
        >
          DSS Analyze
        </button>
      </div>
    </div>
  );
};

const PreviousSubmissions = ({ claimants, onViewDetails, onDelete }) => {
  if (!claimants || claimants.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No pending submissions found.</p>;
  }
  return (
    <div className="mt-8 print:hidden">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Pending Submissions</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
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
              <tr key={claimant.claimant_id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 py-3 font-medium">{claimant.name}</td>
                <td className="px-4 py-3">{claimant.village}</td>
                <td className="px-4 py-3">{claimant.district}</td>
                <td className="px-4 py-3">
                  {new Date(claimant.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(claimant.claimant_id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs transition-all transform hover:scale-105 active:scale-95"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onDelete(claimant.claimant_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs transition-all transform hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SchemeDetailsModal = ({ isOpen, onClose, schemeData }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-md transition-all duration-300 transform ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{schemeData.schemeName}</h2>
        <div className="space-y-4 text-sm">
          <p>
            <strong className="text-gray-600">Status:</strong>
            <span
              className={`ml-2 font-semibold py-1 px-2 rounded-md ${
                schemeData.qualifies === 'Yes'
                  ? 'text-green-800 bg-green-100'
                  : 'text-red-800 bg-red-100'
              }`}
            >
              {schemeData.qualifies === 'Yes' ? 'Eligible' : 'Not Eligible'}
            </span>
          </p>
          <div>
            <strong className="text-gray-600">Reason:</strong>
            <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md border">
              {schemeData.reason || 'No reason provided.'}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 font-semibold transition-all transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const ApprovedRequests = ({ claimants }) => {
  if (!claimants || claimants.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Approved Requests</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-green-700">Claimant Name</th>
              <th className="px-4 py-3 text-left font-semibold text-green-700">Village</th>
              <th className="px-4 py-3 text-left font-semibold text-green-700">District</th>
              <th className="px-4 py-3 text-left font-semibold text-green-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {claimants.map((claimant) => (
              <tr key={claimant.claimant_id} className="hover:bg-green-50 transition-colors duration-200">
                <td className="px-4 py-3 font-medium">{claimant.name}</td>
                <td className="px-4 py-3">{claimant.village}</td>
                <td className="px-4 py-3">{claimant.district}</td>
                <td className="px-4 py-3">
                  <span className="bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Approved</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RejectedRequests = ({ claimants }) => {
  if (!claimants || claimants.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Rejected Requests</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-red-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-red-700">Claimant Name</th>
              <th className="px-4 py-3 text-left font-semibold text-red-700">Village</th>
              <th className="px-4 py-3 text-left font-semibold text-red-700">District</th>
              <th className="px-4 py-3 text-left font-semibold text-red-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {claimants.map((claimant) => (
              <tr key={claimant.claimant_id} className="hover:bg-red-50 transition-colors duration-200">
                <td className="px-4 py-3 font-medium">{claimant.name}</td>
                <td className="px-4 py-3">{claimant.village}</td>
                <td className="px-4 py-3">{claimant.district}</td>
                <td className="px-4 py-3">
                  <span className="bg-red-200 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Rejected</span>
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
  const [currentClaimantId, setCurrentClaimantId] = useState(null);
  const [ocrRawText, setOcrRawText] = useState(null);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);

  const fetchPreviousClaimants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/claimants');
      if (!response.ok) throw new Error('Could not fetch previous submissions.');
      const data = await response.json();
      const claimantsWithStatus = data.map(c => ({
        ...c,
        dssRecommendationStatus: c.dss_recommendation_status || 'pending',
      }));
      setPreviousClaimants(claimantsWithStatus);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPreviousClaimants();
  }, []);

  const handleOcrComplete = async (text, parsedJson) => {
    setOcrJson(parsedJson);
    setOcrRawText(text);
    setAnalysisResults([]);
    setShowAnalysisPanel(false);
    setPlotData(null);
    setIsAnalyzing(true);
    const toastId = toast.loading('Saving document data...');

    try {
      const saveResponse = await fetch('http://localhost:5000/api/save-ocr-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ocrText: text }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(`Failed to save OCR data: ${errorData.error || saveResponse.statusText}`);
      }

      const { claimantId } = await saveResponse.json();
      setCurrentClaimantId(claimantId);
      fetchPreviousClaimants();
      toast.success('Document saved! You can now run the DSS analysis.', { id: toastId });
    } catch (error) {
      console.error('Error during save process:', error);
      toast.error(`Save failed: ${error.message}`, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTriggerDssAnalysis = async () => {
    if (!currentClaimantId || !ocrRawText) {
      toast.error('No claimant data loaded. Please upload or select a submission.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults([]);
    const toastId = toast.loading('Running DSS analysis...');

    try {
      const analysisResponse = await fetch('http://localhost:5000/dss-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimantId: currentClaimantId, ocrText: ocrRawText }),
      });

      if (!analysisResponse.ok) {
        throw new Error(`API Error during analysis: ${analysisResponse.statusText}`);
      }

      const results = await analysisResponse.json();
      const formattedResults = results.map(person => ({
        ...person,
        dssRecommendationStatus: 'pending',
      }));

      setAnalysisResults(formattedResults);
      setShowAnalysisPanel(true);
      toast.success('Analysis complete!', { id: toastId });
    } catch (error) {
      console.error('Error during DSS process:', error);
      toast.error(`Analysis failed: ${error.message}`, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewDetails = async (claimantId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/claimant/${claimantId}`);
      if (!response.ok) throw new Error('Failed to fetch claimant details.');
      const data = await response.json();

      setCurrentClaimantId(data.claimant_id);
      setOcrRawText(data.ocr_text);

      const formattedOcrJson = {
        'Claimant Information': {
          'Name Of The Claimant': data.name,
          'Name Of The Spouse': data.spouse_name,
          'Name Of Father Mother': data.father_mother_name,
          'Scheduled Tribe': data.is_scheduled_tribe ? 'Yes' : 'No',
          Address: data.address,
          Village: data.village,
          'Gram Panchayat': data.gram_panchayat,
          District: data.district,
        },
        'Nature Of Claim On Land': {
          'Extent Of Land In Forest Villages If Any': data.land_in_forest_villages_acres,
          '- For Habitation': data.land_for_habitation_acres,
          '- For Self Cultivation': data.land_for_cultivation_acres,
          'Pattas Leases Grants If Any': data.land_title_status,
          'Any Other Traditional Right If Any': data.traditional_rights,
          'Evidence In Support': data.evidence_submitted,
        },
      };

      const formattedAnalysisResult = [
        {
          id: data.claimant_id,
          name: data.name,
          village: data.village,
          schemes: (data.schemes || []).map((s) => ({
            schemeName: s.scheme_name,
            qualifies: s.status && s.status.startsWith('Eligible') ? 'Yes' : 'No',
            reason: s.reason,
          })),
          dssRecommendation: data.dss_recommendation || 'No recommendation available.',
          dssRecommendationStatus: previousClaimants.find(c => c.claimant_id === data.claimant_id)?.dssRecommendationStatus || 'pending',
          geometry: { center: [23.8313, 91.2754] },
        },
      ];

      setOcrJson(formattedOcrJson);
      setAnalysisResults(formattedAnalysisResult);
      setShowAnalysisPanel(true);
      setPlotData(null);

      document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error viewing details:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (claimantId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/claimant/${claimantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete claimant.');
      }

      if (currentClaimantId === claimantId) {
        handleHideDetails();
      }

      fetchPreviousClaimants();
      toast.success('Submission deleted successfully.');
    } catch (error) {
      console.error('Error deleting claimant:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleHideDetails = () => {
    setOcrJson(null);
    setAnalysisResults([]);
    setShowAnalysisPanel(false);
    setPlotData(null);
    setCurrentClaimantId(null);
    setOcrRawText(null);
  };

  const handlePlotOnMap = (person) => {
    if (person.geometry && person.geometry.center) {
      setPlotData(person);
      document.getElementById('dss-map-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast.warn('No geographical data available for this person.');
    }
  };

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme);
    setIsSchemeModalOpen(true);
  };

  const handleCloseSchemeModal = () => {
    setIsSchemeModalOpen(false);
  };

  const updateLocalClaimantStatus = (claimantId, newStatus) => {
    setPreviousClaimants(prevClaimants =>
      prevClaimants.map(claimant =>
        claimant.claimant_id === claimantId
          ? { ...claimant, dssRecommendationStatus: newStatus }
          : claimant
      )
    );
    setAnalysisResults(prevResults =>
      prevResults.map(claimant =>
        claimant.id === claimantId
          ? { ...claimant, dssRecommendationStatus: newStatus }
          : claimant
      )
    );
    toast.success(`Claimant marked as '${newStatus}'.`);
  };

  const handleApproveClaimant = (claimantId) => {
    updateLocalClaimantStatus(claimantId, 'approved');
  };

  const handleRejectClaimant = (claimantId) => {
    updateLocalClaimantStatus(claimantId, 'rejected');
  };

  const handleGenerateReport = () => {
    if (!ocrJson) {
      toast.error('Please view a claimant\'s details to generate a report.');
      return;
    }
    window.print();
  };

  const handleDownloadData = () => {
    if (analysisResults.length === 0) {
      toast.error('No analysis data to download.');
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(analysisResults, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'dss_analysis_results.json';
    link.click();
    link.remove();
  };

  const handleSendToMinistry = () => {
    if (analysisResults.length === 0) {
      toast.error('No analysis data to send.');
      return;
    }
    console.log('Simulating sending data to Ministry:', analysisResults);
    setIsSentSuccessfully(true);
    toast.success('Data has been sent to the Ministry!');
    setTimeout(() => {
      setIsSentSuccessfully(false);
    }, 4000);
  };

  const pendingClaimants = previousClaimants.filter(c => c.dssRecommendationStatus === 'pending');
  const approvedClaimants = previousClaimants.filter(c => c.dssRecommendationStatus === 'approved');
  const rejectedClaimants = previousClaimants.filter(c => c.dssRecommendationStatus === 'rejected');

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="print:hidden">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Decision Support System</h1>
        </div>

        <div className="p-6 bg-white transition print:hidden border-2 border-dashed border-gray-300 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Document for Analysis</h2>
          <OCRComponent onOcrComplete={handleOcrComplete} isAnalyzing={isAnalyzing} />
        </div>

        <PreviousSubmissions
          claimants={pendingClaimants}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
        
        <ApprovedRequests claimants={approvedClaimants} />
        <RejectedRequests claimants={rejectedClaimants} />

        {isAnalyzing && !ocrJson && (
          <div className="mt-4 flex items-center justify-center text-blue-800 font-semibold">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing... Please wait.</span>
          </div>
        )}

        {ocrJson && !isAnalyzing && (
          <AnalysisReport data={ocrJson} onAnalyze={handleTriggerDssAnalysis} onHide={handleHideDetails} />
        )}

        {showAnalysisPanel && analysisResults.length > 0 && !isAnalyzing && (
          <div className="print:hidden animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-800 mt-8 mb-4">DSS Recommendation Panel</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">FRA Holder</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Village</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Scheme Eligibility</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Overall Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analysisResults.map((person) => (
                    <tr key={person.id} className="border-t hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-2 font-medium">{person.name}</td>
                      <td className="px-4 py-2">{person.village}</td>
                      <td className="px-4 py-2">
                        <ul className="flex flex-wrap gap-2">
                          {(person.schemes || []).map((scheme, index) => (
                            <li
                              key={`${person.id}-${scheme.schemeName}-${index}`}
                              onClick={() => handleSchemeClick(scheme)}
                              className={`cursor-pointer text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full transition-all transform hover:scale-105 ${
                                scheme.qualifies === 'Yes'
                                  ? 'text-green-600 bg-green-200 hover:bg-green-300'
                                  : 'text-red-600 bg-red-200 hover:bg-red-300'
                              }`}
                            >
                              {scheme.schemeName}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full
                          ${person.dssRecommendationStatus === 'approved' ? 'bg-green-200 text-green-800' :
                            person.dssRecommendationStatus === 'rejected' ? 'bg-red-200 text-red-800' :
                            'bg-gray-200 text-gray-800'}`}>
                          {person.dssRecommendationStatus.charAt(0).toUpperCase() + person.dssRecommendationStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePlotOnMap(person)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs transition-all transform hover:scale-105 active:scale-95"
                          >
                            Plot Map
                          </button>
                          {person.dssRecommendationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveClaimant(person.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition-all transform hover:scale-105 active:scale-95"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectClaimant(person.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs transition-all transform hover:scale-105 active:scale-95"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {plotData && (
          <div id="dss-map-section" className="mt-8 print:hidden rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={plotData?.geometry?.center || [23.8313, 91.2754]}
              zoom={plotData ? 14 : 9}
              style={{ height: '500px', width: '100%' }}
            >
              <ChangeMapView center={plotData?.geometry?.center} zoom={plotData ? 14 : 9} />
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Esri Satellite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, SWISSTOPO, and the GIS User Community"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              {plotData && (
                <Marker position={plotData.geometry.center}>
                  <Popup>
                    <strong>{plotData.name}</strong>
                    <br />
                    Village: {plotData.village}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}
        
        <SchemeDetailsModal
          isOpen={isSchemeModalOpen}
          onClose={handleCloseSchemeModal}
          schemeData={selectedScheme}
        />

        <div className="mt-8 pt-6 border-t flex flex-wrap gap-4 justify-center print:hidden">
          <button
            onClick={handleDownloadData}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            Download Analysis Data
          </button>
          <button
            onClick={handleGenerateReport}
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            Generate Report
          </button>
          
          {isSentSuccessfully ? (
            <div className="flex items-center justify-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg transition-all w-full sm:w-auto animate-fade-in">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Sent Successfully</span>
            </div>
          ) : (
            <button
              onClick={handleSendToMinistry}
              className="px-5 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              Send to Ministry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSSPage;