var iotpipe = require('../');


iotpipe.IoTPipe("deviceid");
iotpipe.addDigitalInputPort(7,"garage_door");
iotpipe.addDigitalInputPort(14,"sliding_door");
iotpipe.addDigitalOutputPort(15,"lightbulb");

var payload = iotpipe.scan();
console.log(payload);
