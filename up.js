var compulsive = require('compulsive');
var torque = require('torque');
var board = new torque.Board({port: '/dev/tty.usbmodemfa131'});

var LF_COXA  = 3;
var LF_FEMUR = 2;
var LF_TIBIA = 1;

var LM_COXA  = 7;
var LM_FEMUR = 6;
var LM_TIBIA = 5;

var LR_COXA  = 11;
var LR_FEMUR = 10;
var LR_TIBIA = 9;

var RF_COXA  = 23;
var RF_FEMUR = 22;
var RF_TIBIA = 21;

var RM_COXA  = 27;
var RM_FEMUR = 26;
var RM_TIBIA = 25;

var RR_COXA  = 31;
var RR_FEMUR = 30;
var RR_TIBIA = 29;

var LEFT  = 0;
var RIGHT = 1;

var FRONT  = 0;
var MIDDLE = 1;
var REAR   = 2;


var legs = [
    [ [3, 2, 1], [7, 6, 5], [11, 10, 9] ],
    [ [23, 22, 21], [27, 26, 25], [31, 30, 29] ]
];

board.on('ready', function () {
    setup();
});


function setup() {
    for (var leg = 0; leg < 3; leg++) {
        for (var joint = 0; joint < 3; joint++) {
            legs[LEFT][leg][joint] = new torque.Servo({
                pin: legs[LEFT][leg][joint],
                range: [ 10, 170 ],
                pwmRange: [ 750, 2300 ],
                startAngle: joint == 0 ? 90 : 180
            });
        }
    }
    for (var leg = 0; leg < 3; leg++) {
        for (var joint = 0; joint < 3; joint++) {
            legs[RIGHT][leg][joint] = new torque.Servo({
                pin: legs[RIGHT][leg][joint],
                range: [ 10, 170 ],
                pwmRange: [ 750, 2300 ],
                startAngle: joint == 0 ? 90 : 0
            });
        }
    }
}
