var fs = require('fs');
var path = require('path');
var Robot = require('pomelo-robot').Robot;

var config = require('./config/config.json');
config.account = require('./config/account/' + config.account);
config.server = require('./config/server.json')[config.server];

config['scripts'] = [];
fs.readdirSync('./app/script').forEach(function (filename) {
    if (/\.js$/.test(filename)) {
        var script = {
            selected: false,
            itemtext: filename,
            itemvalue: path.basename(filename, '.js')
        };

        if (config.script === filename) {
            script.selected = true;
        }

        config['scripts'].push(script);
    }
});

var robot = new Robot(config);
var mode = 'master';

if (process.argv.length > 2) {
    mode = process.argv[2];
}

if (mode !== 'master' && mode !== 'client') {
    throw new Error(' mode must be master or client');
}

if (mode === 'master') {
    robot.runMaster(__filename);
} else {
    robot.runAgent();
}

process.on('uncaughtException', function (err) {
    /* temporary code */
    console.error(' Caught exception: ' + err.stack);
    if (!!robot && !!robot.agent) {
        // robot.agent.socket.emit('crash', err.stack);
    }
    fs.appendFile('./log/.log', err.stack, function (err) {
    });
    /* temporary code */
});