const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");
const { exec } = require("child_process");
const fs = require('fs');

let appWindow
let rawdata = fs.readFileSync('setup.json');
const setup = JSON.parse(rawdata);


function startService() {
  // start main service
  try {
    cmdStartPython = setup.startMainService
    // cmdStartPython = '@cd main service && @start "main server(python)" run.exe'
    exec(cmdStartPython, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      if (stderr) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    });
  }
  catch (err) {
    alert("Can not close main service, please manually start!!")
  }

  try {
    // start  glex service
    cmdStartGo = setup.startGoService
    exec(cmdStartGo, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      if (stderr) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    });
  }
  catch (err) {
    alert("Can not close glex server, please manually start!!")
  }
}

function closeService() {
  // kill main server python
  try {
    cmdKillPython = setup.killMainService
    exec(cmdKillPython, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      if (stderr) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    });
  }
  catch (err) {
    alert("Can not close main service, please manually close!!")
  }

  // kill glex server golang
  try {
    cmdKillGo = setup.killGlexService
    exec(cmdKillGo, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      if (stderr) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    });

  }
  catch (err) {
    alert("Can not close glex service, please manually close!!")
  }

}

function trimString(x) {
  return x.replace(/^\s+|\s+$/gm, '');
}

function startCommand() {
  if (trimString(setup.startProgram) != "") {
    try {
      cmdWhenStart = setup.startProgram
      exec(cmdWhenStart, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          return;
        }
        if (stderr) {
          console.log(stderr);
          return;
        }
        console.log(stdout);
      });
    }
    catch (err) {
      alert("Can not start command when start !!")
    }
  }

}

function initWindow() {
  appWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // start all service,is glex and main service
  startService()
  // command for first time start
  startCommand()

  // Initialize the DevTools.
  // appWindow.webContents.openDevTools()
}

app.on('closed', function (event) {
  appWindow = null
})


app.on('ready', initWindow)

// Close when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    initWindow()
  }
})

app.on('before-quit', () => {
  closeService()
  app.removeAllListeners('close');
  app.close();
});