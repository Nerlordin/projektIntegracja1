const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const axios = require('axios');
// Połączenie z bazą danych MongoDB
const cors = require('cors');
app.use(express.json());
// Używanie CORS
app.use(cors());
mongoose.connect('mongodb://localhost:27017/Oil', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


/* // Definicja schematu danych
const daneSchema = new mongoose.Schema({
  rok: Number,
  kraje: [{
    kraj: String,
    cena_paliwa: Number,
  }],
});
 */
const daneSchema = new mongoose.Schema({
  rok: Number,
  kraj: String,
  cena_paliwa: Number,
});
// Tworzenie modelu danych na podstawie schematu
const Dane = mongoose.model('Dane', daneSchema);

// Definicja endpointu do pobrania danych
app.get('/dane', async (req, res) => {
  try {
    const dane = await Dane.find({});
    res.json(dane);
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});
app.post('/dane', async (req, res) => {
  try {
    const dane = req.body;
    const createdDane = await Dane.create(dane);
    res.json(createdDane);
  } catch (error) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

app.get('/api/salary', async (req, res) => {
  try {
    const response = await axios.get('https://salarybycountry.uncreative.dev/dane.json');
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