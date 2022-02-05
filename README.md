# home-monitor
nodejs project to log and view home information

## Climate information
Read temperature and humidity information from a MQTT broker that was source from LYWSD03MMC thermometers flashed with the firmware from https://github.com/pvvx/ATC_MiThermometer and write them to mongo and influxdb for graphing with Grafana.  Also has an API to read the current data from monogo and assign the sensors to a room.  Note that this will not log data to influxdb if it has not been assigned to a room.

To get the data from the thermometer to the MQTT broker, you can use the code on https://github.com/brian-l-johnson/thermometer-bridge on a ESP32 or similiar controller.
