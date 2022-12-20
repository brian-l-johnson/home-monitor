const mqtt = require('mqtt');
const Sensor = require('../models/Sensor');
const Influx = require('influx');
require('dotenv').config();


function startMonitor() {
    console.log("here");

    const influx = new Influx.InfluxDB({
        host: process.env.INFLUXDB_HOST,
        database: process.env.INFLUXDB_DB,
        port: process.env.INFLUXDB_PORT,
        username: process.env.INFLUXDB_USER,
        password: process.env.INFLUXDB_PASS,
        schema: [
            {
                measurement: 'climate',
                fields: {temperature: Influx.FieldType.FLOAT,
                         humidity: Influx.FieldType.FLOAT,
                         battery: Influx.FieldType.INTEGER},
                tags: ['sensor']
            }
        ]
    });

    const client = mqtt.connect(process.env.MQTT_URL, {username: process.env.MQTT_USER, password: process.env.MQTT_PASS});

    const accountSid = process.env.TWILIO_SID; 
    const authToken = process.env.TWILIO_TOKEN; 
    const srcNumber = process.env.TWILIO_NUMBER;
    const alertNumber = process.env.ALERT_NUMBER;
    
    const twilio = require('twilio');
    const twilioClient = new twilio(accountSid, authToken);

    client.on('connect', () => {
        console.log("Connected to mqtt broker");
        client.subscribe(process.env.MQTT_TOPIC+"/#");
    })
    client.on('message', (topic, payload) => {
        console.log("got message on %s: %s", topic, payload.toString());
        let data = topic.split('/');
        let sensorAddress = data[1];
        let sensorData = JSON.parse(payload);
        console.log(sensorData);
        Sensor.findOne({address: sensorAddress}, (error, sensor) => {
            if(error) {
                console.log("database error");
            }
            else {
                if(sensor) {
                    console.log("sensor found");

                    sensor.lastBattery = sensorData['battery'];
                    sensor.lastTemp = sensorData['temperature'];
                    sensor.lastHumidity = sensorData['humidity'];
                    sensor.save();
                    if(sensor.room) {
                        if(sensorData['temperature'] < sensor.lowAlert || sensorData['temperature'] > sensor.highAlert) {
                            console.log("sensor out of range, need to alert");
                            currTime = Date.now();
                            alertTime = Date(sensor.lastAlert).getTime();
                            if(currTime - lastAlert > 1000*60*10) {
                                messageBody = "Sensor in room: "+sensor.room+" is out of range: "+sensorData['temperature']
                                twilioClient.messages
                                    .create({
                                        body: messageBody,
                                        to: alertNumber,
                                        from: srcNumber,
                                    })
                                    .then((message) => console.log(message.sid));
                                sensor.lastAlert = Date.now();
                            }
                            else {
                                console.log("alerted to recently, waiting");
                            }
                            
                            
                            

                        }

                        console.log("sensor is assigned to room, will send to influx");
                        try {
                            influx.writePoints([
                                {
                                    measurement: "climate",
                                    tags: { sensor: sensor.room},
                                    fields: {temperature: sensorData['temperature'], humidity: sensorData['humidity'], battery: sensorData['battery']}
                                }
                            ])
                        }
                        catch(error) {
                            console.error("failed to write to influx: ");
                            console.error(error);

                        }

                    }
                    else {
                        console.log("no room assigned to sensor, not logging to influx");
                    }

                }
                else {
                    console.log("sensor not found");
                    Sensor.create({address: sensorAddress, lastTemp: sensorData["temperature"], lastHumidity: sensorData["humidity"], lastBattery: sensorData["battery"]}, (err, sensor) => {
                        if(err) {
                            if(err.code === 11000) {
                                console.log("sensor already exists, this should be fine");
                            }
                            else {
                                console.log("error creating sensor");
                            }
                        }
                        else {
                            console.log("created sensor");
                        }

                    })
                }
            }
        })

    })
    client.on('error', (error) => {
        console.log(error);
    })

    
}


exports.startMonitor = startMonitor;