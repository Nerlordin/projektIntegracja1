import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  return (
    <div>
      <h1>MERN Starter</h1>
      <h2>Salary Data:</h2>
      <ul>
        {salaryData.map((item) => (
          <li key={item.kraj}>
            {item.kraj}: {item.rok}: {item.srednia_wyplata}
          </li>
        ))}
      </ul>
      <table>
  <tr>
    <th>{item.kraj}</th>
   
  </tr>
  <tr>
    <td>{item.rok}</td>
    
  </tr>
  <tr>
    <td>{item.srednia_wyplata}</td>
   
  </tr>
</table>
    </div>
  );
};

export default App;