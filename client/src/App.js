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
  const [lastChart, setLastChart] = useState([])
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
      setFuelPriceData(fuelArray)
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }
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
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFF00']; // Przykładowe kolory
  const chartData = filteredData.map((item) => ({
    rok: item[0].rok,
    ...item.reduce((acc, curr) => {
      acc[curr.kraj] = curr.srednia_wyplata;
      return acc;
    }, {}),
  }));
  const fuelchartData = fuelPriceData.map((item) => ({
    rok: item[0].rok,
    ...item.reduce((acc, curr) => {
      acc[curr.kraj] = curr.cena_paliwa;
      return acc;
    }, {}),
  }));
  return (
    <div className="container">
      <Header />
      <h2>Salary Data:</h2>

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
      <h2>Wykres cen paliwa</h2>
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
      <h2>Wykres zmian:</h2>

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
        stroke={colors[index % colors.length]} // Przypisanie koloru na podstawie indeksu
      />
    ))}
</LineChart>
      <h2>Wykres zmian ceny paliwa:</h2>

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
        stroke={`#${index % 2 === 0 ? 'FF0000' : '00FF00'}`} // Przykładowe kolory czerwony i zielony na zmianę
      />
    ))}
</LineChart>
      

      <Footer />
    </div>
  );
};

export default App;
