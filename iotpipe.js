
var gpio = require('./lib/iotpipe_gpio');


exports.samplingTopic = "";
exports.outputTopic = "";
exports.deviceId = "";

exports.IoTPipe = function(deviceId)
{
        exports.samplingTopic = "sampling/" + deviceId;
        exports.outputTopic = "outputport/" + deviceId;
	exports.deviceId = deviceId;
}


//Adds a GPIO to a list of input ports
exports.addDigitalInputPort = function(portNum,portName)
{
	gpio.setPortAsDigitalInput(portNum,portName);	
}

//Adds a GPIO to a list of output ports
exports.addDigitalOutputPort = function(portNum, portName)
{
	gpio.setPortAsDigitalOutput(portNum,portName);	
}

//Scans all input ports and creates a JSON payload of thier values which can be read by IoT Pipe web service
exports.scan = function()
{
	var payload = gpio.jsonifyInputScan();
	return payload;
}

//Reads a JSON payload from IoT Pipe web service that contains the desired values of output ports.
exports.updateOutputs = function(topic, msg)
{
  if( topic.equals(exports.outputTopic) )
	throw {name : "NotImplementedError", message : "Not implemented yet"};
  else
	return true;    
}

//Generates the topic to which the device subscribes to receive updates to its output ports
exports.getOutputTopic = function()
{
	return exports.outputTopic;  
}

//Generates the topic to which the device publishes when sampling input ports
exports.getSamplingTopic = function()
{
	return exports.samplingTopic;   
}
