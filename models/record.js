const mongoose = require("mongoose");

let appointmentsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    }
})

let recordsSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients'
  },
  medicalRecord: {
    type: String,
    maxlength: 1000,
  },
  appointments:{
  }
});

let Record = mongoose.model('records', recordsSchema);
module.exports = Record;