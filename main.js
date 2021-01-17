/* eslint-disable global-require */
// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray, ipcMain, protocol } = require("electron");
const path = require("path");

const appIconPath = path.join(__dirname, "./public/favicon.ico");
let mainWindow = null, tray = null;
const debug = process.env.NODE_ENV === "development"

Menu.setApplicationMenu(null);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    minWidth: 375,
    height: 768,
    minHeight: 600,
    icon: appIconPath,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      nodeIntegration: true
    }
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  if (debug) {
    //if you want to debug electron, set debug to true
    mainWindow.loadURL("http://localhost:9000");
    mainWindow.webContents.openDevTools();
    require('devtron').install();
    mainWindow.maximize();
  } else {
    mainWindow.loadURL(`file://${__dirname}/public/index.html`);
    // mainWindow.loadURL("https://www.zhoushoujian.com/");
  }

  //接收渲染进程的信息
  ipcMain.on('min', function () {
    mainWindow.minimize();
  });
  ipcMain.on('max', function () {
    mainWindow.maximize();
  });

  ipcMain.on("quit", function () {
    mainWindow.destroy();
  });

  mainWindow.setAppDetails({
    appId: 'app',
    appIconPath,
    appIconIndex: 0,
  });
  mainWindow.setIcon(appIconPath);
  mainWindow.setThumbnailToolTip('electron-template');
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('closed', (_event) => {
    mainWindow = null;
  });

  tray = new Tray(appIconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开",
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: "退出",
      click: () => {
        mainWindow.destroy();
      }
    },
  ]);
  tray.setToolTip("electron-template");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    mainWindow.show();
  });
  tray.on("double-click", () => {
    mainWindow.show();
  });

}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  });
  // 创建 myWindow, 加载应用的其余部分, etc...
  app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Quit when all windows are closed.
    app.on("window-all-closed", function (_event) {
      if (process.platform !== "darwin") app.quit();
    });

  });
}

{
  const colors = {
    Reset: "\x1b[0m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m"
  };
  "debug:debug:FgBlue,info:info:FgGreen,warn:warn:FgYellow,error:error:FgRed".split(",").forEach(function (logColor) {
    const [log, info, color] = logColor.split(':');
    const logger = function (...args) {
      console.log(...args);
    };
    console[log] = (...args) => logger.apply(this, [`${colors[color]}[${getTime()}] [${info.toUpperCase()}]${colors.Reset} `, ...args, colors.Reset]);
  });
}

function getTime() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  let hour = new Date().getHours();
  let minute = new Date().getMinutes();
  let second = new Date().getSeconds();
  let mileSecond = new Date().getMilliseconds();
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  if (mileSecond < 10) {
    mileSecond = "00" + mileSecond;
  }
  if (mileSecond < 100) {
    mileSecond = "0" + mileSecond;
  }
  const time = `${year}-${month}-${day} ${hour}:${minute}:${second}.${mileSecond}`;
  return time;
}
