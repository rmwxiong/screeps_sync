                                            
                    --\    /---             
        ___            \\//                 
          \_____________ |                  
         /__            \ \                 
    ___ //               \_\_               
   /  /\/                /\| \              
  |  /  |               |  \  |             
   \___/                 \___/              

REPOSITORY IT DON'T WANT YOU READ
=================================

screeps sync
===

nodejs synchronization script for screeps.com game

### run

1. create scripts folder(or change location in script)

2. run

3. copy output code to browser console or use extensions like chrome cjs

4. click *SYNC MENU* in top menu

5. click *enable sync* in new left menu

### default behavior

* **existing modules be overwrited!**
* sync all `*.js` files in `scripts`(or own folder if scripts does not exists) folder exclude `sync\d*\.js`
* using WoSign certificate and my 127.0.0.1 aliased name to supress mixed content security exception

### or change veriables at begin of script

`var port = 9090; // port`

`var host = 'localhost.doomcalc.com'; // A 127.0.0.1`

`var watchDir = 'scripts'; // dir with your scripts`

`var includeRegexp = /\.js$/; // only *.js`

`var excludeRegexp = /^sync\d*\.js$/; // exclude same name(sync.js)`

`var replaceRegexp = /\..+$/; // strip extensions from modules names`

`var showDebug = true;`

### testing

| OS      | result  | comment     |
|---------|---------|-------------|
| linux   | pass    |             |
| windows |         | planned     |
| mac     |         |             |

### planned features

* command to console from script
* memory switches in panel
* test control(move, simple commands) standalone creep by mouse if supported in ai memory switch (add interface to set targets in memory)
* debug game overlay in browser (controlled from memory)

