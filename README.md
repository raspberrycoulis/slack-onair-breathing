# slack-onair-breathing
Contains code for controlling NeoPixels connected to Particle Photon(s) via slash commands in Slack.

This requies the `breathing-slack-on-air.ino` being installed on each Photon (easiest via the Particle IDE) and then utilising Amazon Web Services for the LAMBDA function - us the `multiOnAirSlackLambda.js` if you want to control multiple Photons with the same command.

## Setup
You'll need to create a Slack integration and use the Slack Token in the relevant parts on the LAMBDA functions, as well as to add your Photo device ID(s) and Particle access token too.
