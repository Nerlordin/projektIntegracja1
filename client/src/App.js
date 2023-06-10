import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';

const App = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [dane, setDane] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2022);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const array = [];
      const response = await axios.get('/api/salary');
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

  const filteredData = sortedData.filter(item => item[0].rok >= startYear && item[0].rok <= endYear);

  const chartData = filteredData.map((item) => ({
    rok: item[0].rok,
    ...item.reduce((acc, curr) => {
      acc[curr.kraj] = curr.srednia_wyplata;
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
        {loaded && sortedData[0].map((item) => (
          <Line key={item.kraj} type="monotone" dataKey={item.kraj} name={item.kraj} />
        ))}
      </LineChart>

      <Footer />
    </div>
  );
};

export default App;
