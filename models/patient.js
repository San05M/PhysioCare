const mongoose = require("mongoose");

let patientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  surname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  address:{
    type: String,
    required: true,
    maxlength: 100,
  },
  insuranceNumber:{
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9]{9}$/
  }
});

let Patient = mongoose.model('patients', patientsSchema);

module.exports = Patient;