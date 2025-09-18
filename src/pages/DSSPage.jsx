import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import { getVillageData } from '../../dssUpload';

const DSSPage = () => {
  const [selectedState, setSelectedState] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [approvedSchemes, setApprovedSchemes] = useState([]);
  const [rejectedSchemes, setRejectedSchemes] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const handleRunAnalysis = async () => {
    if (!selectedState || !uploadedFile || uploadedFile.type !== 'application/pdf') {
      alert('Please select a state and upload a valid PDF file.');
      return;
    }

    try {
      const result = await getVillageData(uploadedFile.name);
      console.log('DSS Analysis Result:', result);

      const eligibleSchemes = Object.entries(result.schemes_eligibility)
  .filter(([_, value]) => value.qualifies === 'Yes')
  .map(([schemeKey, value]) => ({
    name: result.claimant_information.name_of_the_claimant,
    village: result.claimant_information.village,
    district: result.claimant_information.district,
    gram_panchayat: result.claimant_information.gram_panchayat,
    tehsil_taluka: result.claimant_information.tehsil_taluka,
    scheme: schemeKey.replace(/_/g, ' ').toUpperCase(),
    reason: value.reason,
  }));


      setRecommendations(eligibleSchemes);
    } catch (error) {
      console.error('Error running DSS analysis:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md space-y-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">DSS Analysis</h1>

      {/* State Selection and Upload Trigger */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/3"
        >
          <option value="">Select State</option>
          <option value="Tripura">Tripura</option>
        </select>

        <button
          onClick={() => setShowUpload(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full md:w-1/3"
        >
          Upload File
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div
          className={`mt-6 border-2 rounded-md p-6 bg-blue-100 transition ${
            isDragging ? 'border-dashed border-blue-600 bg-blue-200' : 'border-blue-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
              setUploadedFile(file);
              setUploadedFileName(file.name);
            } else {
              alert('Please upload a valid PDF file.');
            }
          }}
        >
          <label className="block text-sm font-medium text-blue-800 mb-2">
            Drag & drop your PDF here or click to select
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type === 'application/pdf') {
                setUploadedFile(file);
                setUploadedFileName(file.name);
              } else {
                alert('Please upload a valid PDF file.');
              }
            }}
            className="block w-full px-4 py-2 border rounded-md bg-blue-50 text-blue-900 cursor-pointer"
          />
          {uploadedFileName && (
            <p className="mt-2 text-sm text-blue-700">
              📄 Uploaded: <strong>{uploadedFileName}</strong>
            </p>
          )}
          <button
            onClick={handleRunAnalysis}
            disabled={!uploadedFile}
            className={`mt-4 px-5 py-2 rounded transition ${
              uploadedFile
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            Run Analysis
          </button>
        </div>
      )}

      {/* DSS Recommendation Panel */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">DSS Recommendation Panel</h2>
          <p className="text-sm text-gray-600 mb-4">
            Displays AI/Rule-based recommendations per FRA household/village
          </p>

          <table className="min-w-full bg-white border rounded-md text-md">
  <thead className="bg-blue-800 text-white">
    <tr>
      <th className="px-6 py-3 text-left">FRA Holder Name</th>
      <th className="px-6 py-3 text-left">Village</th>
      <th className="px-6 py-3 text-left">District</th>
      <th className="px-6 py-3 text-left">Gram Panchayat</th>
      <th className="px-6 py-3 text-left">Tehsil/Taluka</th>
      <th className="px-6 py-3 text-left">Suggested Scheme</th>
      <th className="px-6 py-3 text-left">Status</th>
      <th className="px-6 py-3 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {recommendations.map((rec, idx) => (
      <tr key={idx} className="hover:bg-blue-100 transition">
        <td className="px-6 py-4 border-b">{rec.name}</td>
        <td className="px-6 py-4 border-b">{rec.village}</td>
        <td className="px-6 py-4 border-b">{rec.district}</td>
        <td className="px-6 py-4 border-b">{rec.gram_panchayat}</td>
        <td className="px-6 py-4 border-b">{rec.tehsil_taluka}</td>
        <td className="px-6 py-4 border-b">{rec.scheme}</td>
        <td className="px-6 py-4 border-b">Recommended</td>
        <td className="px-6 py-4 border-b">
          <div className="flex flex-col space-y-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              onClick={() => {
                setApprovedSchemes((prev) => [...prev, rec]);
                setRecommendations((prev) => prev.filter((_, i) => i !== idx));
              }}
            >
              Approve
            </button>
            <button
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              onClick={() => {
                setRecommendations((prev) => prev.filter((_, i) => i !== idx));
              }}
            >
              Defer
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              onClick={() => {
                setRejectedSchemes((prev) => [...prev, rec]);
                setRecommendations((prev) => prev.filter((_, i) => i !== idx));
              }}
            >
              Reject
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}

      {/* Interactive DSS Map */}
<div>
  <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Interactive DSS Map (WebGIS Overlay)</h2>
  <p className="text-sm text-gray-600 mb-4">
    Map with layers showing scheme recommendations. Color codes by scheme type.
  </p>

  <div className="border rounded-md overflow-hidden mb-6">
    <MapComponent onVillageClick={(villageData) => setSelectedVillage(villageData)} />
  </div>

  {/* Scheme Eligibility Popup */}
  {selectedVillage && (
    <div className="bg-gray-50 border border-blue-300 rounded-md p-4">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">
        Scheme Eligibility for {selectedVillage.name}
      </h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>District:</strong> {selectedVillage.district}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Assets:</strong> {selectedVillage.assets}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Recommended Schemes:</strong>
      </p>
      <ul className="list-disc pl-5 text-sm text-blue-700">
        {selectedVillage.schemes.map((scheme, idx) => (
          <li key={idx}>{scheme}</li>
        ))}
      </ul>
    </div>
  )}
</div>


      {/* Scheme Approval Status */}
{(approvedSchemes.length > 0 || rejectedSchemes.length > 0) && (
  <div>
    <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Scheme Approval Status</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Approved Schemes */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 mb-2">Approved Schemes</h3>
        <table className="min-w-full bg-white border rounded-md text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Beneficiary</th>
              <th className="px-4 py-2 text-left">Village</th>
              <th className="px-4 py-2 text-left">Scheme</th>
            </tr>
          </thead>
          <tbody>
            {approvedSchemes.map((item, idx) => (
              <tr key={idx} className="hover:bg-green-50">
                <td className="px-4 py-2 border-b">{item.name}</td>
                <td className="px-4 py-2 border-b">{item.village}</td>
                <td className="px-4 py-2 border-b">{item.scheme}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejected Schemes */}
      <div>
        <h3 className="text-lg font-semibold text-red-700 mb-2">Rejected Schemes</h3>
        <table className="min-w-full bg-white border rounded-md text-sm">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Beneficiary</th>
              <th className="px-4 py-2 text-left">Village</th>
              <th className="px-4 py-2 text-left">Scheme</th>
            </tr>
          </thead>
          <tbody>
            {rejectedSchemes.map((item, idx) => (
              <tr key={idx} className="hover:bg-red-50">
                <td className="px-4 py-2 border-b">{item.name}</td>
                <td className="px-4 py-2 border-b">{item.village}</td>
                <td className="px-4 py-2 border-b">{item.scheme}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex flex-wrap gap-4 justify-center">
      <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Download DSS Analysis
      </button>
      <button className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        Approve All Eligible
      </button>
      <button className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
        Generate Report
      </button>
      <button className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
        Send to Ministry
      </button>
    </div>
  </div>
)}
</div> 
);
};

export default DSSPage;
