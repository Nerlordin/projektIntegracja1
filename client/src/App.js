import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css'; // Importowanie pliku CSS
import DaneComponent from './DaneComponent';

const App = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [dane, setDane] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/salary');
      const response2 = await axios.get('http://localhost:5000/dane');
      setDane(response2.data);
      setSalaryData(response.data.dane);
    } catch (error) {
      console.error(error);
    }
  };

  const removeDuplicates = (data, key) => {
    return data.filter((item, index, self) => {
      return index === self.findIndex((i) => i[key] === item[key]);
    });
  };

  return (
    <div className="container">
      <h1>MERN Starter</h1>
      <h2>Salary Data:</h2>

      <table>
        <thead>
          <tr>
            <th>Kraj</th>
            {salaryData.map((item) => (
              <th key={item.rok}>{item.kraj}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {salaryData.map((item) => (
            <tr key={item.kraj}>
              <td>{item.rok}</td>
              {salaryData.map((d) => (
                <td key={d.rok}>
                  {d.srednia_wyplata}
                  {dane.map((daneItem) => {
                    const krajData = daneItem.kraje.find(
                      (kraj) => kraj.kraj === d.kraj
                    );
                    return krajData && krajData.cena_paliwa;
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Wykres zmian:</h2>
      <LineChart width={800} height={400} data={salaryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rok" />
        <YAxis />
        <Tooltip />
        <Legend />
        {salaryData.map((item) => (
          <Line
            key={item.kraj}
            type="monotone"
            dataKey={item.kraj}
            name={item.kraj}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default App;