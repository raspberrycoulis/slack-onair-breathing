var http = require ('https');

exports.handler = function (event, context, callback) {

  // Add your tokens below for Slack, Photon and Particle
  var slackToken = "[SLACK_TOKEN]";
  var particleDeviceId = "[PARTICLE_DEVICE_ID]";
  var particleAccessToken = "[PARTICLE_ACCESS_TOKEN]";

  console.log("Event", event);

  if (event.token != slackToken) {
    context.fail('Token was incorrect');
    return;
  }

  console.log("Token", event.token);
  console.log("Text", event.text);
  var text = event.text.toLowerCase();

  var allowed = [
    'on', 'off', 'green', 'blue', 'red', 'purple', 'yellow'
  ];

  if (allowed.indexOf(text)===-1) {
    context.fail('The sign can be ' + allowed.join(', ') + ' you are not allowed to be '+text+' air!');
    return;
  }

  console.log("Making call to Particle");

  var postData = JSON.stringify({
    "args": text
  });

  console.log("Post data", postData);

  var options = {
    hostname: "api.particle.io",
    port: 443,
    path: '/v1/devices/'+particleDeviceId+'/led?access_token='+particleAccessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  console.log("Options", options);

  var bufferData = [];
  var req = http.request(options, function(res) {
    console.log("Got response: " + res.statusCode);

    res.on("data", function(chunk) {
      bufferData.push(chunk);
    });

    res.on("end", function() {
      var buffer = Buffer.concat(bufferData).toString();
      console.log(buffer);
      context.done(null, 'You are now '+text+' air.');
    });
  }).on('error', function(e) {
    context.fail("Error from particle");
  });
  req.write(postData);
  req.end();
};
