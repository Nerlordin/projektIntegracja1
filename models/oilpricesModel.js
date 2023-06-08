const mongoose = require('mongoose');

const krajSchema = new mongoose.Schema({
  kraj: String,
  cena_paliwa: Number,
});

const daneSchema = new mongoose.Schema({
  rok: Number,
  kraje: [krajSchema],
});

const DaneModel = mongoose.model('Dane', daneSchema);

module.exports = DaneModel;





