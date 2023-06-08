import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DaneComponent = () => {
  const [dane, setDane] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dane');
        setDane(response.data.dane);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dane z MongoDB:</h2>
      {dane.map((item) => (
        <div key={item.rok}>
          <h3>Rok: {item.rok}</h3>
          <ul>
            {item.kraje.map((kraj) => (
              <li key={kraj.kraj}>
                {kraj.kraj} - {kraj.cena_paliwa}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DaneComponent;