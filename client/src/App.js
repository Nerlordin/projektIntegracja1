import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

const App = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [dane, setDane] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const array = [];
      const response = await axios.get('/api/salary');
      const response2 = await axios.get('http://localhost:5000/dane');
      setDane(response2.data);
      for (let i = 0; i < 3; i++) {
        const grouped = response.data.dane.filter((kraj) => kraj.rok === 2020 + i);
        array.push(grouped);
      }
      setSalaryData(array);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  const filteredSalaryData = selectedYear ? salaryData.filter((item) => item[0].rok === selectedYear) : salaryData;

  return (
    <div className="container">
      <h1>MERN Starter</h1>
      <h2>Salary Data:</h2>

      <label htmlFor="year-select">Select Year:</label>
      <select id="year-select" value={selectedYear || ''} onChange={handleYearChange}>
        <option value="">All</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Kraj</th>
            {loaded &&
              filteredSalaryData[0].map((item) => <th key={item.rok}>{item.kraj}</th>)}
          </tr>
        </thead>
        <tbody>
          {filteredSalaryData.map((item, index) => (
            <tr key={index}>
              <td>{item[0].rok}</td>
              {item.map((kraj) => (
                <td key={kraj.kraj}>{kraj.srednia_wyplata}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Wykres zmian:</h2>
    </div>
  );
};

export default App;
