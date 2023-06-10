import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Wykres = ({ data, yearsToShow, }) => {
  const filteredData = data.filter((item) => yearsToShow.includes(item.rok));

  return (
    <LineChart width={800} height={400} data={filteredData}>
      <XAxis dataKey="rok" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      {loading && filteredData[0].kraje.map((kraj) => (
        <Line key={kraj.kraj} type="monotone" dataKey={`kraje.${kraj.kraj}.cena_paliwa`} name={kraj.kraj} />
      ))}
    </LineChart>
  );
};

export default Wykres;