var ee = require('events').EventEmitter;
var round = Math.round;
var abs   = Math.abs;

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

function ServoController(pin_count) {
    this.servos = new Array(pin_count);
    this.serialPort = new SerialPort('/dev/tty.usbmodemfa131', {
        baudrate: 9600,
        parser: serialport.parsers.readline("\n"),
        openImmediately: false
    });
    this.open = false;
    this.id = null;

    ee.call(this);
}

ServoController.prototype = new ee;

ServoController.prototype.start = function () {
    var controller = this;
    this.serialPort.on('open', function () {
        controller.open = true;
        controller.emit('ready');
    });
    this.serialPort.open();
};
ServoController.prototype.setBounds = function (pin, min_pulse, max_pulse) {
    console.log('Configuring pin ' + pin + ' to pulse range ' + min_pulse + ' - ' + max_pulse);
    this.servos[pin - 1] = {min: min_pulse, max: max_pulse, pulse: 0};
};
ServoController.prototype.setPosition = function (pin, pulse) {
    if (isNaN(pulse)) {
        pulse = this.servos[pin - 1].min;
    }
    pulse = pulse < this.servos[pin - 1].min ? this.servos[pin - 1].min : (pulse > this.servos[pin - 1].max ? this.servos[pin - 1].max : pulse);
    pulse = abs(round(pulse));
    this.servos[pin - 1].pulse = pulse;
    console.log('Setting pulse of pin ' + pin + ' to ' + pulse);

    if (this.id) {
        clearImmediate(this.id);
    }

    var controller = this;
    this.id = setImmediate(function () {
        process.nextTick(controller.send.bind(controller));
    });
};

ServoController.prototype.send = function () {
    var cmd = this.servos.reduce(function (previousValue, currentValue, index) {
        if (!currentValue) {
            return previousValue;
        }
        return previousValue + '#' + (index + 1) + 'P' + currentValue.pulse + 'T5';
    }, '');

    if (this.open) {
        console.log('Sending: ' + cmd);
        this.serialPort.write(cmd + "\n\r");
    } else {
        console.error('Failed to send. Serial port not open.')
    }
};

module.exports = ServoController;
