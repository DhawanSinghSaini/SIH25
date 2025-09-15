import React from "react";

const Reports = () => {
  // Expanded static data
  const reports = [
    {
      reportId: "RPT001",
      uploadDate: "2025-09-10",
      reportName: "Forest Coverage Summary",
      reportType: "Environmental",
      reportFile: "#",
    },
    {
      reportId: "RPT002",
      uploadDate: "2025-09-12",
      reportName: "Land Use Analysis",
      reportType: "Geospatial",
      reportFile: "#",
    },
    {
      reportId: "RPT003",
      uploadDate: "2025-09-14",
      reportName: "Tribal Welfare Assessment",
      reportType: "Social",
      reportFile: "#",
    },
    {
      reportId: "RPT004",
      uploadDate: "2025-09-15",
      reportName: "Water Resource Mapping",
      reportType: "Hydrological",
      reportFile: "#",
    },
    {
      reportId: "RPT005",
      uploadDate: "2025-09-16",
      reportName: "Biodiversity Index",
      reportType: "Environmental",
      reportFile: "#",
    },
    {
      reportId: "RPT006",
      uploadDate: "2025-09-17",
      reportName: "Agricultural Yield Trends",
      reportType: "Agricultural",
      reportFile: "#",
    },
  ];

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <h2 className="text-3xl font-semibold mb-6">Report History</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Report ID</th>
              <th className="px-6 py-3 text-left">Upload Date</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId} className="hover:bg-blue-100 transition">
                <td className="px-6 py-4 border-b">{report.reportId}</td>
                <td className="px-6 py-4 border-b">
                  {new Date(report.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b">{report.reportName}</td>
                <td className="px-6 py-4 border-b">{report.reportType}</td>
                <td className="px-6 py-4 border-b">
                  <a
                    href={report.reportFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                  No reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
