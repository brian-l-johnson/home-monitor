var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = mongoose.Schema({
    address: {type: String, unique: true},
    room: String,
    lastSeen: {type: Date, default: Date.now},
    lastTemp: Number,
    lastHumidity: Number,
    lastBattery: Number
})

var Sensor = mongoose.model('Sensor', sensorSchema);
module.exports = Sensor;