import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { AiFillHome, AiOutlineHistory, AiFillSetting } from 'react-icons/ai'; // Importing React Icons
import { GrHostMaintenance } from "react-icons/gr";
function Pompa() {
  const [pumpStatus, setPumpStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    fetchPumpStatus();
  }, []);

  const fetchPumpStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/pump'); // Replace with actual pump status endpoint
      setPumpStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching pump status:', error);
    }
  };

  const togglePump = () => {
    setIsModalOpen(true); // Open modal when the pump toggle is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <header className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Kontrol Pompa Penyiraman</h1>
      </header>

      <main className="flex-grow p-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Status Pompa</h3>
          <p className="text-3xl font-bold mb-4">{pumpStatus ? 'ON' : 'OFF'}</p>
          <button
            onClick={togglePump}
            className={`text-white font-semibold p-4 rounded ${pumpStatus ? 'bg-red-600' : 'bg-green-600'}`}
          >
            {pumpStatus ? 'Matikan Pompa' : 'Nyalakan Pompa'}
          </button>
        </div>
      </main>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/3">
          <div className="flex justify-center items-center">
                <GrHostMaintenance className="w-[50px] h-[50px]" />
                </div>

            <h2 className="text-xl font-semibold mb-4 text-center">Fitur Dalam Pengembangan</h2>
            <p className="text-center mb-4">
                
              Maaf, fitur kontrol pompa penyiraman ini masih dalam tahap pengembangan.
              developer masih mengembangkan fitur untuk komunikasi LoRa transimter dan Device untuk komunikasi 2 arah
            </p>
            <div className="text-center">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-green-600 p-[20px]">
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

export default Pompa;
