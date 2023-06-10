import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dane.css';

const DaneComponent = () => {
  const [dane, setDane] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dane');
        setDane(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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

export default DaneComponent;