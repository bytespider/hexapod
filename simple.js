var ServoController = require('./ServoController');
//var ServoController = require('./FakeServoController');
var fs = require('fs');

var coxa_servo  = 1;
var femur_servo = 2;
var tibia_servo = 3;

var servos = new ServoController(32);
var coxa = 24;
var femur = 84;
var tibia = 125;

var atan2 = Math.atan2;
var acos = Math.acos;
var atan = Math.atan;
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var PI = Math.PI;
var hPI = Math.PI/2;

var degrees = function (radians) { return 57.29577951308232 * radians; };
var radians = function (degrees) { return 0.017453292519943 * degrees; };

function setup() {
    servos.setBounds(coxa_servo,  600, 2400);
    servos.setBounds(femur_servo, 600, 2400);
    servos.setBounds(tibia_servo, 600, 2400);

    servos.on('ready', function () {
        setArm(0, 10, 50);
    });
    servos.start();
}

var mode = 1;
function loop() {
    //line();
    circle();
    /*if (mode == 1) {
        setArm(80, 0, 35);
    }

    if (mode == 2) {
        setArm(80, 0, 60);
    })*/

    setTimeout(function() {
        process.nextTick(loop);
    }, 50);

    
    mode = mode == 1 ? 2 : 1;
}


function setArm(x, y, z) {
    var coxa_angle = 0;
    var femur_angle = 0;
    var tibia_angle = 0;

    var a = femur;
    var a2 = femur * femur;

    var b = tibia;
    var b2 = tibia * tibia;

    var h2 = x * x + z * z;
    var h = sqrt(h2);

    var α = acos((a2 + h2 - b2) / (2 * a * h));
    var γ = atan2(x, z);
    var β = α + γ;
    var δ = acos((a2 + b2 - h2) / (2 * a * b));

    coxa_angle = hPI - atan2(y, x);
    femur_angle = PI - β;
    tibia_angle = δ;

    servos.setPosition(1, degrees(coxa_angle) * 10 + 600);
    servos.setPosition(2, degrees(femur_angle) * 10 + 600);
    servos.setPosition(3, degrees(tibia_angle) * 10 + 600);

    console.log(degrees(coxa_angle), degrees(femur_angle), degrees(tibia_angle));
}


var RADIUS = 50;
var angle  = 0;
var center = {x: 80, y: 1, z: 50};
function circle() {
  var x = center.x + RADIUS * cos(radians( angle ));
  var y = center.y + RADIUS * sin(radians( angle ));
  var z = center.z;
  setArm(x, y, z);

  fs.appendFile('angles.txt', [x, y, z].join(',') + "\n", function (err) {
        if (err) throw err;
  });
  
  angle+=10;
}

var a = 0;
var direction = 1;
function line() {
    console.log(a);
    if (a > 125) {
        direction = -1;
    }
    if (a < 1) {
        direction = 1;
    }

    a += direction;
    setArm(10 + a, 0, 100);
}

setup();
loop();
