const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const axios = require('axios');
// Połączenie z bazą danych MongoDB
const cors = require('cors');

// Używanie CORS
app.use(cors());
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


app.get('/api/salary', async (req, res) => {
  try {
    const response = await axios.get('https://salarybycountry.uncreative.dev/salarybycountry.json');
    const data = response.data;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Pobieranie danych z zewnętrznego API

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});