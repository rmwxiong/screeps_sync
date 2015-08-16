nodejs synchronization script for screeps.com game

run
===
node sync.js

customization
===

change veriables at begin of script
---

var port = 9090; // port
var host = 'localhost.doomcalc.com'; // A 127.0.0.1
var watchDir = '.'; // dir with your scripts
var includeRegexp = /\.js$/; // only *.js
var excludeRegexp = /^sync\d*\.js$/; // exclude same name(sync.js)
var replaceRegexp = /\..+$/; // strip extensions from modules names
