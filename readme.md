screeps sync
===

nodejs synchronization script for screeps.com game

### run

1. `node sync.js`

2. copy output code to browser console or use extensions like chrome cjs

### default behavior

* **existing modules be overwrited!**
* sync all `*.js` files at same folder exclude `sync\d*\.js`
* using WoSign certificate and my 127.0.0.1 aliased name to supress mixed content security exception

### or change veriables at begin of script

`var port = 9090; // port`

`var host = 'localhost.doomcalc.com'; // A 127.0.0.1`

`var watchDir = '.'; // dir with your scripts`

`var includeRegexp = /\.js$/; // only *.js`

`var excludeRegexp = /^sync\d*\.js$/; // exclude same name(sync.js)`

`var replaceRegexp = /\..+$/; // strip extensions from modules names`

### testing

| OS      | result  | comment     |
|---------|---------|-------------|
| linux   | pass    |             |
| windows |         | planned     |
| mac     |         |             |

### planned features

* command to console from script
* memory switches in panel
* test stand alone creep mouse control(move) if supported in ai memory switch
* debug overlay in browser (controlled from memory)

