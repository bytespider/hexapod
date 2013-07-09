var ee    = require('events').EventEmitter;
var round = Math.round;
var abs   = Math.abs;

function ServoController(pin_count) {
    this.servos = new Array(pin_count);
    this.open = false;
    this.id = null;

    ee.call(this);
}

ServoController.prototype = new ee;

ServoController.prototype.start = function () {
    this.open = true;
    this.emit('ready');
};
ServoController.prototype.setBounds = function (pin, min_pulse, max_pulse) {
    this.servos[pin - 1] = {min: min_pulse, max: max_pulse};
    console.log('Configuring pin ' + pin + ' to pulse range ' + min_pulse + ' - ' + max_pulse);
};
ServoController.prototype.setPosition = function (pin, pulse) {
    pulse = pulse < this.servos[pin - 1].min ? this.servos[pin - 1].min : (pulse > this.servos[pin - 1].max ? this.servos[pin - 1].max : pulse);
    pulse = abs(round(pulse));
    
    console.log('Setting pulse of pin ' + pin + ' to ' + pulse);

    var cmd = '#' + pin + 'P' + pulse;
    console.log('Sending: ' + cmd);
};

module.exports = ServoController;
