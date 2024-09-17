import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { AiFillHome, AiOutlineHistory, AiFillSetting } from 'react-icons/ai'; // Importing React Icons
import { GiWaterDrop, GiChemicalDrop } from 'react-icons/gi'; // Icons for Soil Moisture and pH
import { WiHumidity, WiThermometer } from 'react-icons/wi'; // Icons for Air Humidity and Temperature
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles


function Dashboard() {
  const [sensorData, setSensorData] = useState({
    soil_moisture: 0,
    pH: 0,
    humidity: 0,
    temperature: 0,
  });
  const [graphData, setGraphData] = useState({
    soilMoistureDataPoints: [],
    pHDataPoints: [],
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api-simotan.online/api/data');
      if (response.data.length > 0) {
        const latestData = response.data[0];
        setSensorData({
          soil_moisture: latestData.soil_moisture,
          pH: latestData.pH,
          humidity: latestData.humidity,
          temperature: latestData.temperature,
        });

        // Prepare data points for multi-series chart
        const newSoilMoistureDataPoints = response.data.map((dataPoint, index) => ({
          x: index + 1,
          y: dataPoint.soil_moisture,
        }));

        const newPHDataPoints = response.data.map((dataPoint, index) => ({
          x: index + 1,
          y: dataPoint.pH,
        }));

        setGraphData({
          soilMoistureDataPoints: newSoilMoistureDataPoints,
          pHDataPoints: newPHDataPoints,
        });

        // Check conditions for notifications
        checkConditions(latestData.soil_moisture, latestData.pH);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to check conditions and show toast notifications
  const checkConditions = (soilMoisture, pH) => {
    if (soilMoisture < 30) {
      toast.error("Warning: Soil moisture is below 30%");
    } 
    if (pH < 6) {
      toast.warning("Warning: Soil pH is too low (below 6)");
    } 
  };

  // Multi-Series Chart options for Soil Moisture and pH
  const multiSeriesOptions = {
    title: {
      text: "Chart Data ",
    },
    axisY: {
      title: "Kelembapan Tanah (%)",
    },
    axisY2: {
      title: "pH Tanah",
    },
    data: [
      {
        type: "line",
        name: "Kelembapan Tanah",
        showInLegend: true,
        dataPoints: graphData.soilMoistureDataPoints,
      },
      {
        type: "line",
        name: "pH Tanah",
        axisYType: "secondary", // Uses the second Y axis
        showInLegend: true,
        dataPoints: graphData.pHDataPoints,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      
      <header className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-1xl font-bold">
          SIMOTAN
          <br />
          Sistem Monitoring Tanaman Kedelai
        </h1>
        <h2 className="text-md">Monitoring dan Kontrol Pompa Penyiraman</h2>
      </header>

      <main className="flex-grow p-4 pt-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          {/* Soil Moisture */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transform transition-transform duration-300 sm:scale-90 sm:opacity-80 hover:scale-105 hover:opacity-100">
            <GiWaterDrop
              className="w-20 h-20 transition-transform duration-300 sm:w-14 sm:h-14"
              style={{
                color: sensorData.soil_moisture < 30 ? "red" : "blue",
              }}
            />
            <div>
              <h3 className="text-lg font-semibold mb-2">Kelembapan Tanah</h3>
              <p
                className={`text-2xl font-bold truncate overflow-hidden sm:text-4xl ${
                  sensorData.soil_moisture < 30 ? "text-red-500" : ""
                }`}
              >
                {sensorData.soil_moisture}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${
                    sensorData.soil_moisture < 30
                      ? "bg-red-500"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${sensorData.soil_moisture}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Soil pH */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transform transition-transform duration-300 sm:scale-90 sm:opacity-80 hover:scale-105 hover:opacity-100">
            <GiChemicalDrop className="w-20 h-20 text-green-500 transition-transform duration-300 sm:w-14 sm:h-14" />
            <div>
              <h3 className="text-lg font-semibold mb-2">pH Tanah</h3>
              <p className="text-2xl font-bold truncate overflow-hidden sm:text-4xl">
                {sensorData.pH}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(sensorData.pH / 14) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Air Humidity */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transform transition-transform duration-300 sm:scale-90 sm:opacity-80 hover:scale-105 hover:opacity-100">
            <WiHumidity className="w-20 h-20 text-blue-500 transition-transform duration-300 sm:w-14 sm:h-14" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Kelembapan Udara</h3>
              <p className="text-2xl font-bold truncate overflow-hidden sm:text-4xl">
                {sensorData.humidity}%
              </p>
            </div>
          </div>

          {/* Air Temperature */}
          <div className="bg-white rounded-lg shadow-md p-4  flex items-center space-x-4 transform transition-transform duration-300 sm:scale-90 sm:opacity-80 hover:scale-105 hover:opacity-100">
            <WiThermometer className="w-20 h-20 text-red-500 transition-transform duration-300 sm:w-14 sm:h-14" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Suhu Udara</h3>
              <p className="text-2xl font-bold truncate overflow-hidden sm:text-4xl">
                {sensorData.temperature}°C
              </p>
            </div>
          </div>
        </div>

       
      </main>

      <footer className="bg-green-600 p-[20px] fixed bottom-0 left-0 w-full">
        <div className="flex justify-around">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white font-semibold flex items-center space-x-2 transition-colors duration-300 ${
                isActive ? "text-yellow-300" : "hover:text-gray-300"
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
                isActive ? "text-yellow-300" : "hover:text-gray-300"
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
                isActive ? "text-yellow-300" : "hover:text-gray-300"
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

export default Dashboard;
