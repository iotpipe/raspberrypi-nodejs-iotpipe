
/*
 * This Tutorial will allow you to turn an LED on and off from the IoT Pipe website.  The tutorial can be found at http://www.iotpipe.io/raspberrypi
*/

var iotpipe = require('../');
var mqtt = require('mqtt');

var ssid="PLACEHOLDER";
var password="PLACEHOLDER";
var deviceId="PLACEHOLDER";
var mqtt_user="PLACEHOLDER";
var mqtt_pass="PLACEHOLDER";
var mqtt_server="mqtt://broker.iotpipe.io";


//Setup IoT Pipe , and designate GPIO17 as an output port with the name "LED"
iotpipe.IoTPipe(deviceId);
iotpipe.addDigitalOutputPort(17,"LED");

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
