import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Importowanie pliku CSS
import DaneComponent from './DaneComponent';
const App = () => {
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/salary');
      
   
     
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
                <td key={d.rok}>{d.srednia_wyplata}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <DaneComponent />
    </div>
    
  );
};

export default App;