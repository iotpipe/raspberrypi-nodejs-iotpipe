
/*
Much thanks to knolleary for his PubSubClient, from which much of this example was built.
*/


/*
 * This Tutorial will allow you to turn an LED on and off from the IoT Pipe website.  The tutorial can be found at http://localhost:3000/esp8266arduinointro
*/

var iotpipe = require('../');
var mqtt = require('mqtt');

var ssid="CenturyLink0638";
var password="5nesxjf5kym5nd";
var deviceId="a75dfbb18d71a7f";
var mqtt_user="e59ab9c78622f2689e1f533ffbdf78d";
var mqtt_pass="5cf3f075d166cea7e59e8116c65185e";
var mqtt_server="mqtt://broker.iotpipe.io";



iotpipe.IoTPipe(deviceId);
iotpipe.addDigitalOutputPort(17,"GPIO");

var client  = mqtt.connect(mqtt_server);
client.subscribe(iotpipe.getOutputTopic());

console.log("Subscribed to " + iotpipe.getOutputTopic());

client.on('message', function (topic, message) {
	console.log("Message arrived [");
	console.log(topic.toString());
	console.log("]");
	console.log(message.toString());	
	iotpipe.updateOutputs(topic,message);
});
