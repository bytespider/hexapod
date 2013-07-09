var compulsive = require('compulsive');
var torque = require('torque');
var board = new torque.Board({port: '/dev/tty.usbmodemfa131'});

board.on('ready', function () {
    var servo;
    var i = 1;
    var angle = 0;
    compulsive.repeat(31, 30, function () {
        var left = i >= 0 && i <= 12;
        var right = i >= 21 && i <= 32;

        if (left || right) {

            angle = (i % 4 == 3 ? 90 : 0);
            if (left) {
                angle = 180 - angle;
            }

            servo = new torque.Servo({
                pin: i,
                range: [ 10, 170 ],
                pwmRange: [ 750, 2300 ], // configures the servo's internal pulse duration calculation
                startAngle: angle
            });
        }

        i += 1;
    });
});
