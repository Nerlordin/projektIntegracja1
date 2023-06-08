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
      <h1>Dane</h1>
      {dane.map((item) => (
        <div key={item._id}>
          <h2>Rok: {item.rok}</h2>
          <ul>
            {item.kraje.map((kraj) => (
              <li key={kraj.kraj}>
                Kraj: {kraj.kraj}, Cena paliwa: {kraj.cena_paliwa}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DaneComponent;