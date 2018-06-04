var http = require('https');

const requestParticle = postData => particle => {
    var options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/' + particle.deviceId + '/led?access_token=' + particle.accessToken,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    return new Promise(function (resolve, reject) {
        var bufferData = [];

        var req = http.request(options, function (res) {
            console.log('Got response: ' + res.statusCode);

            res.on('data', function (chunk) {
                bufferData.push(chunk);
            });

            res.on('end', function () {
                resolve(Buffer.concat(bufferData).toString());
            });

            res.on('error', function (err) {
                reject(err);
            });
        });
        req.write(postData);
        req.end();
    });
};

# Add your Slack and Particle access tokens below, as well as each Photon device ID

exports.handler = function (event, context, callback) {
    var slackToken = 'SLACK_TOKEN';
    var particles = [
        {
            deviceId: 'DEVICE_ID_1',
            accessToken: 'PARTICLE_ACCESS_TOKEN'
        },
        {
            deviceId: 'DEVICE_ID_2',
            accessToken: 'PARTICLE_ACCESS_TOKEN'
        }
    ];

    console.log('Event', event);

    if (event.token != slackToken) {
        context.fail('Token was incorrect');
        return;
    }

    console.log('Token', event.token);
    console.log('Text', event.text);

    var text = event.text.toLowerCase();
    var allowed = ['on', 'off', 'green', 'blue', 'red', 'purple', 'yellow'];

    if (allowed.indexOf(text) === -1) {
        context.fail(
            'The sign can be ' + allowed.join(', ') + ' you are not allowed to be ' + text + ' air!'
        );
        return;
    }

    console.log('Making call to Particle');

    var postData = JSON.stringify({
        args: text
    });

    console.log('Post data', postData);

    var finishedBuffer = Promise.all(particles.map(requestParticle(postData)));

    finishedBuffer.then( function() {
            context.done(null, 'You are now ' + text + ' air.');
        }
    );
};
