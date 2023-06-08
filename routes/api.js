const express = require('express');
const ExampleModel = require('../models/oilpricesModel');

const router = express.Router();

// Pobierz dane
router.get('/dane', async (req, res) => {
  try {
    const dane = await ExampleModel.find();
    res.json(dane);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

module.exports = router;