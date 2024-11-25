const mongoose = require("mongoose");

let appointmentsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  physio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "physio"
  },
  diagnosis: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  treatment:{
    type: String,
    required: true
  },
  observations:{
    type: String, 
    maxlength: 500
  }
});

let recordsSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patients",
    required: true,
    unique: true
  },
  medicalRecord: {
    type: String,
    maxlength: 1000,
  },
  appointments: [appointmentsSchema]
});

let Record = mongoose.model("records", recordsSchema);
/* No es necesario el Appointment, pero lo dejo creado por si más adelante le tengo que dar utilidad. */
let Appointment = mongoose.model("appointments", appointmentsSchema);
 
module.exports = { Record, Appointment };
