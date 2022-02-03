var express = require('express');
var router = express.Router();
var Sensor = require('../models/Sensor');


/**
 * @swagger
 * definitions:
 *   Sensor:
 *     type: object
 *     required:
 *       -address
 *     properites:
 *       address:
 *         type: string
 *       room:
 *         type: string
 *       lastTemp:
 *         type: float
 *       lastHumidity:
 *         type: float
 *       lastBattery:
 *         type: integer
 *       highAlert:
 *         type: float
 *       lowAlert:
 *         type: float
 */

/**
 * @swagger
 * /climate/sensors:
 *   get:
 *     desription: return all sensors
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:  JSON array of all sensors
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Sensor'
 */

router.get('/sensors', function(req,res,next) {
    Sensor.find({}, (err,sensors) => {
        if(err) {
            return res.status(500).send({error: "db error"});
        }
        return res.send(sensors);
    });
});

/**
 * @swagger
 * /climate/sensors/unassigned:
 *   get:
 *     description: return sensors not assigned to a room
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:  JSON array of all sensors
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Sensor'
 */
router.get('/sensors/unassigned', function(req,res,next) {
    Sensor.find({room: null},  (err, sensors) => {
        if(err) {
            return res.status(500).send({error: "db error"});
        }
        return res.send(sensors);
    })
})

/**
 * @swagger
 * /climate/sensors/{sensor}:
 *   get:
 *     description: return a specific sensor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sensor
 *         description: MAC address of sensor
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: sensor
 *         schema:
 *           $ref: '#/definitions/Sensor'
 */
router.get('/sensors/:address', function(req,res,next) {
    Sensor.findOne({address: req.params.address}, function(err, sensor) {
        if(err) {
            return res.status(500).send({error: "db error"});
        }
        if(sensor) {
            return res.send(sensor);
        }
        return res.status(404).send({error: "sensor not found"});
    })
});

/**
 * @swagger
 * /climate/sensors/{sensor}/room:
 *   put:
 *     description: assing a sensor to a room
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sensor
 *         description: MAC address of sensor
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *       - name: value
 *         description: name of room
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: sensor
 *         schema:
 *           $ref: '#/definitions/Sensor'
 */
router.put('/sensors/:address/room', function(req,res,next) {
    Sensor.findOne({address: req.params.address}, function(err, sensor) {
        if(err) {
            return res.status(500).send({error: "db error"});
        }
        if(sensor) {
            sensor.room = req.body.room;
            sensor.save();
            return res.send(sensor);
        }
        return res.status(404).send({error: "sensor not found"});
    })
})

/**
 * @swagger
 * /climate/sensors/{sensor}:
 *   patch:
 *     description: modify editable fields for sensor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sensor
 *         description: MAC address of a sensor
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *       - name: value
 *         description: sensor data to update
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: sensor
 *         schema:
 *           $ref: '#/definitions/Sensor'
 * 
 */
router.patch('/sensors/:address', function(req, res, next) {
    console.log("in patch");
    Sensor.findOne({address: req.params.address}, function(err, sensor) {
        if(err) {
            return res.status(500).send({error: "db error"});
        }
        if(sensor) {
            if(req.body.room) {
                sensor.room = req.body.room;
            }
            if(req.body.highAlert) {
                sensor.highAlert = req.body.highAlert;
            }
            if(req.body.lowAlert) {
                sensor.lowAlert = req.body.lowAlert;
            }
            sensor.save();
            return res.send(sensor);
        }
        return res.status(404).send({error: "sensor not found"});
    })
    console.log(req.body);
})

  
module.exports = router;
