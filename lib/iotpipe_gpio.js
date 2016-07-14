var Gpio = require('onoff').Gpio; // Constructor function for Gpio objects.

exports.type = {

	digitalInput: 0,
	digitalOutput: 1
};


exports.nodes = {};


function addNode(portNumber, portName, gpio, type) 
{
	exports.nodes[portNumber]=[];
	if( portName == "" )
	{
		var autoName = "GPIO" + portNumber;
		exports.nodes[portNumber].portName = autoName;
	}
	else
	{
		exports.nodes[portNumber].portName = portName;
	}
	exports.nodes[portNumber].gpio = gpio;
	exports.nodes[portNumber].gpio_type = type;
	exports.nodes[portNumber].active = true;

	print();

}



//GPIOs of the same type cannot have the same name
function isPortNameValid(portName, type)
{
	//if portname is empty then user is asking for one to be auto-assigned.
	if( portName=="" )
		return true;

	for(var key in exports.nodes)
	{
		if(exports.nodes.hasOwnProperty(key))
		{
			if(exports.nodes[key].portName==portName & exports.nodes[key].gpio_type == type)
			{
				return false;
			}
		}
	}

	return true;
}

//TODO: Make private later
function print()
{
	console.log("--------------------------------------------");
	for(var key in exports.nodes)
	{
		if(exports.nodes.hasOwnProperty(key))
		{
			var type = (exports.nodes[key].gpio_type == exports.type.digitalInput) ? "INPUT" : "OUTPUT";
			console.log( type + " GPIO" + key + ": " + exports.nodes[key].portName );
		}
	}
}

exports.setPortAsDigitalInput = function(portNum, portName)
{	

	var gpio = new Gpio(portNum,'in');
	if ( !isPortNameValid(portName,exports.type.digitalInput) )	
	{
		console.log("Failed to set GPIO" + portNum + " as input.  Portname of (" + portName + ") is already assigned to a port of type digitalInput");
	}		
	addNode(portNum, portName, gpio, exports.type.digitalInput);
}

exports.setPortAsDigitalOutput = function(portNum, portName)
{
	var gpio = new Gpio(portNum,'out');
	if ( !isPortNameValid(portName,exports.type.digitalOutput) )	
	{
		console.log("Failed to set GPIO" + portNum + " as Output.  Portname of (" + portName + ") is already assigned to a port of type digitalOuput");
	}		
	addNode(portNum, portName, gpio, exports.type.digitalOutput);
}

exports.jsonifyInputScan = function()
{
	var payload={};
	for(var key in exports.nodes)
	{
		if(exports.nodes.hasOwnProperty(key))
		{
			var node = exports.nodes[key];
			if (node.gpio_type!=exports.type.digitalInput)
				continue;
			
			var value = node.gpio.readSync();	
			payload[node.portName] = value;
		}
	}

	payload.timestamp=Date.now();
	return JSON.stringify(payload);
} 





//Scans MQTT payload and checks if any OUTPUT port is mentioned
exports.gpio_update_outputs = function(msg)
{

	var root = JSON.parse(msg);

	for(var key in exports.nodes)
	{
		if(exports.nodes.hasOwnProperty(key))
		{
			var node = exports.nodes[key];
			if (node.gpio_type==exports.type.digitalOutput)
			{
				//If the message has information about the current gpio
				if( root.hasOwnProperty( node.portName ) )
				{
					var newValue = root[node.portName];
					var g = node.gpio;
					exports.updateOutput(g,newValue);
				}
			}			
		}
	}
}


exports.updateOutput = function(gpio, newValue)
{
	console.log("updating");
	var curValue = gpio.readSync();
	if( newValue.toLowerCase()=="low" )
	{
		gpio.writeSync(0);	
	}
	else if( newValue.toLowerCase()=="high" )
	{
		gpio.writeSync(1);
	}	
  	else if( newValue.toLowerCase()=="flip" )
  	{
    		if(curValue==1)
    		{      
			gpio.writeSync(0);
    		}
    		else
    		{
			gpio.writeSync(1);
    		}
  	}
}

