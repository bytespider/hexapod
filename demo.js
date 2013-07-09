var torque = require('torque');
var board = new torque.Board({
    port: '/dev/tty.usbmodemfd121',
    debug: true
});

board.on('ready', function () {
    var servo = new torque.Servo({
        pin: 1,
        startAngle: 0
    });

    board.wait(1000, function () {
        servo.move(180, 1000);
    });
});
