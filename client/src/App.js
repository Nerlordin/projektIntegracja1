import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';

const App = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [fuelPriceData, setFuelPriceData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2021);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const salaryArray = [];
    const fuelArray = [];
    try {
      const response = await axios.get('/api/salary');
      for (let i = 0; i < 22; i++) {
        const grouped = response.data.dane.filter((kraj) => kraj.rok === 2000 + i);
        salaryArray.push(grouped);
      }
      setSalaryData(salaryArray);
    } catch (error) {
      console.error(error);
    }

    try {
      const fuelPriceResponse = await axios.get('http://localhost:5000/dane');
      for (let i = 0; i < 22; i++) {
        const groupedFuel = fuelPriceResponse.data.filter((kraj) => kraj.rok === 2000 + i);
        fuelArray.push(groupedFuel);
      }
      setFuelPriceData(fuelArray);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortClick = () => {
    setSortAscending((prevState) => !prevState);
  };

  const handleStartYearChange = (event) => {
    setStartYear(parseInt(event.target.value));
  };

  const handleEndYearChange = (event) => {
    setEndYear(parseInt(event.target.value));
  };

  const sortedData = [...salaryData].sort((a, b) => {
    if (sortAscending) {
      return a[0].rok - b[0].rok;
    } else {
      return b[0].rok - a[0].rok;
    }
  });

  const filteredData = sortedData.filter((item) => item[0].rok >= startYear && item[0].rok <= endYear);
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFF00']; // Example colors

  const chartData = filteredData.map((item) => {
    const rowData = {
      rok: item[0].rok,
    };

    item.forEach((kraj) => {
      rowData[kraj.kraj] = kraj.srednia_wyplata;
    });

    return rowData;
  });

  const fuelchartData = fuelPriceData.map((item) => {
    const rowData = {
      rok: item[0].rok,
    };

    item.forEach((kraj) => {
      rowData[kraj.kraj] = kraj.cena_paliwa;
    });

    return rowData;
  });

  // Calculate the ratio between average salary and fuel price
  const ratioChartData = filteredData.map((item) => {
    const rowData = {
      rok: item[0].rok,
    };

    item.forEach((kraj) => {
      const averageSalary = kraj.srednia_wyplata;
      const fuelPrice = fuelPriceData.find((data) => data[0].rok === kraj.rok)?.find((data) => data.kraj === kraj.kraj)?.cena_paliwa;
      const ratio = averageSalary / fuelPrice;
      rowData[kraj.kraj] = ratio;
    });

    return rowData;
  });

  return (
    <div className="container">
      <Header />
      <div className="content">
        <div className="table-container">
          <h2>Tabela ze średnią wypłatą roczną(USD)</h2>
          {/* Render the salary table */}
          <table>
            <thead>
              <tr>
                <th>Kraj</th>
                {loaded &&
                  sortedData[0].map((item) => (
                    <th key={item.kraj}>{item.kraj}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item[0].rok}</td>
                  {item.map((kraj) => (
                    <td key={kraj.kraj}>{kraj.srednia_wyplata}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSortClick}>
            {sortAscending ? 'Sortuj malejąco' : 'Sortuj rosnąco'}
          </button>
          <h2>Tabela z cenami paliwa(USD)</h2>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Kraj</th>
                  {loaded &&
                    fuelPriceData[0].map((item) => (
                      <th key={item.kraj}>{item.kraj}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {fuelPriceData.map((item, index) => (
                  <tr key={index}>
                    <td>{item[0].rok}</td>
                    {item.map((kraj) => (
                      <td key={kraj.kraj}>{kraj.cena_paliwa}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-container">
          <h2>Wykres zmian srednich rocznych wypłat:</h2>
          {/* Render the salary-to-fuel-price ratio chart */}
          <div>
            <label htmlFor="startYear">Początkowy rok:</label>
            <input
              type="number"
              id="startYear"
              value={startYear}
              onChange={handleStartYearChange}
            />

            <label htmlFor="endYear">Końcowy rok:</label>
            <input
              type="number"
              id="endYear"
              value={endYear}
              onChange={handleEndYearChange}
            />
          </div>
          <LineChart width={800} height={400} data={chartData}>
            <XAxis dataKey="rok" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {loaded &&
              sortedData[0].map((item, index) => (
                <Line
                  key={item.kraj}
                  type="monotone"
                  dataKey={item.kraj}
                  name={item.kraj}
                  stroke={colors[index % colors.length]} // Assign color based on index
                />
              ))}
          </LineChart>

          <h2>Wykres zmian ceny paliwa:</h2>
          {/* Render the fuel price chart */}
          <LineChart width={800} height={400} data={fuelchartData}>
            <XAxis dataKey="rok" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {loaded &&
              fuelPriceData[0].map((item, index) => (
                <Line
                  key={item.kraj}
                  type="monotone"
                  dataKey={item.kraj}
                  name={item.kraj}
                  stroke={`#${index % 2 === 0 ? 'FF0000' : '00FF00'}`} // Example colors, alternate between red and green
                />
              ))}
          </LineChart>

          <LineChart width={800} height={400} data={ratioChartData}>
            <XAxis dataKey="rok" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {loaded &&
              sortedData[0].map((item, index) => (
                <Line
                  key={item.kraj}
                  type="monotone"
                  dataKey={item.kraj}
                  name={item.kraj}
                  stroke={colors[index % colors.length]} // Assign color based on index
                />
              ))}
          </LineChart>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
