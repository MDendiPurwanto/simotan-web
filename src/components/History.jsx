import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { AiFillHome, AiOutlineHistory, AiFillSetting } from 'react-icons/ai'; // Importing React Icons
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'; // Importing Excel and PDF icons
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Loading spinner icon
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For auto-table in PDF

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); // Define how many rows to display per page

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setLoading(true); // Show the spinner while data is being fetched
    try {
      const response = await axios.get('https://api-simotan.online/api/data'); // Replace with actual history endpoint
      setHistoryData(response.data);
      setLoading(false); // Hide the spinner once the data is fetched
    } catch (error) {
      console.error('Error fetching history data:', error);
      setLoading(false); // Hide the spinner in case of an error
    }
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = historyData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(historyData.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(historyData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'History Data');
    XLSX.writeFile(workbook, 'history_data.xlsx');
  };

  // Function to export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Sensor History', 20, 10);
    doc.autoTable({
      head: [['Timestamp', 'Kelembapan Tanah', 'pH Tanah', 'Kelembapan Udara', 'Suhu Udara']],
      body: historyData.map(data => [
        new Date(data.timestamp).toLocaleString(),
        `${data.soil_moisture}%`,
        data.pH,
        `${data.humidity}%`,
        `${data.temperature}°C`
      ]),
    });
    doc.save('history_data.pdf');
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <header className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">History Sensor</h1>
      </header>

      <main className="flex-grow p-4">
        {/* Display loading spinner while data is being fetched */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <AiOutlineLoading3Quarters className="animate-spin text-6xl text-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Sensor History</h3>
            {/* Export buttons with icons */}
            <div className="mt-4 mb-4 flex justify-center space-x-4">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-2"
              >
                <FaFileExcel className="w-5 h-5" /> <span>Export to Excel</span>
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-2"
              >
                <FaFilePdf className="w-5 h-5" /> <span>Export to PDF</span>
              </button>
            </div>
            {/* Scrollable Table */}
            <div className="overflow-x-auto overflow-y-auto max-h-50">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">Kelembapan Tanah</th>
                    <th className="px-4 py-2">pH Tanah</th>
                    <th className="px-4 py-2">Kelembapan Udara</th>
                    <th className="px-4 py-2">Suhu Udara</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((data, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        {new Date(data.timestamp).toLocaleString('id-ID', {
                          timeZone: 'Asia/Jakarta'
                        })}
                      </td>
                      <td className="border px-4 py-2">{data.soil_moisture}%</td>
                      <td className="border px-4 py-2">{data.pH}</td>
                      <td className="border px-4 py-2">{data.humidity}%</td>
                      <td className="border px-4 py-2">{data.temperature}°C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
<div className="mt-4 flex justify-center items-center space-x-2">
  {/* Previous Button */}
  <button
    onClick={() => paginate(currentPage - 1)}
    className={`px-3 py-1 m-1 border rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
    disabled={currentPage === 1}
  >
    Previous
  </button>

      {/* Page Number Buttons */}
      {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
        // Calculate the correct page numbers to show
        const pageNumber = Math.max(1, currentPage - 2) + i;
        return (
          pageNumber <= totalPages && (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`px-3 py-1 m-1 border rounded ${
                currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {pageNumber}
            </button>
          )
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => paginate(currentPage + 1)}
        className={`px-3 py-1 m-1 border rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>


            
          </div>
        )}
      </main>

<footer className="bg-green-600 p-[20px] fixed bottom-0 left-0 w-full">
  <div className="flex justify-around">
    <NavLink
      to="/"
      className={({ isActive }) =>
        `text-white font-semibold flex items-center space-x-2 transition-colors duration-300 ${
          isActive ? 'text-yellow-300' : 'hover:text-gray-300'
        }`
      }
    >
      <AiFillHome className="w-6 h-6" />
      <span>Home</span>
    </NavLink>

    <NavLink
      to="/history"
      className={({ isActive }) =>
        `text-white font-semibold flex items-center space-x-2 transition-colors duration-300 ${
          isActive ? 'text-yellow-300' : 'hover:text-gray-300'
        }`
      }
    >
      <AiOutlineHistory className="w-6 h-6" />
      <span>History Sensor</span>
    </NavLink>

    <NavLink
      to="/pompa"
      className={({ isActive }) =>
        `text-white font-semibold flex items-center space-x-2 transition-colors duration-300 ${
          isActive ? 'text-yellow-300' : 'hover:text-gray-300'
        }`
      }
    >
      <AiFillSetting className="w-6 h-6" />
      <span>Pompa</span>
    </NavLink>
  </div>
</footer>
    </div>
  );
}

export default History;
