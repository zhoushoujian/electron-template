/* eslint-disable global-require */
// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  globalShortcut,
} = require("electron");
const path = require("path");
require("console-format");

const appIconPath = path.join(__dirname, "./public/favicon.ico");
let mainWindow = null,
  tray = null;
const debug = process.env.NODE_ENV === "development";

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
      nodeIntegration: true,
    },
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  if (debug) {
    //if you want to debug electron, set debug to true
    mainWindow.loadURL("http://localhost:9000");
    mainWindow.webContents.openDevTools();
    require("devtron").install();
    mainWindow.maximize();
  } else {
    mainWindow.loadURL(`file://${__dirname}/public/index.html`);
    if (process.env.NODE_ENV === "develop") {
      mainWindow.webContents.openDevTools();
      require("devtron").install();
      mainWindow.maximize();
    }
  }

  mainWindow.setOverlayIcon(path.join(__dirname, "./public/favicon.png"), 'Description for overlay')

  app.setUserTasks([
    {
      program: process.execPath,
      arguments: '--new-window',
      iconPath: process.execPath,
      iconIndex: 0,
      title: 'New Window',
      description: 'Create a new window'
    }
  ])

  globalShortcut.register("ESC", function () {
    mainWindow.setFullScreen(false);
  });
  globalShortcut.register("F11", function () {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.setFullScreen(true);
    }
  });

  //接收渲染进程的信息
  ipcMain.on("min", function () {
    mainWindow.minimize();
  });
  ipcMain.on("max", function () {
    mainWindow.maximize();
  });

  ipcMain.on("quit", function () {
    mainWindow.destroy();
  });

  mainWindow.setAppDetails({
    appId: "app",
    appIconPath,
    appIconIndex: 0,
  });
  mainWindow.setIcon(appIconPath);
  mainWindow.setThumbnailToolTip("electron-template");
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on("closed", (_event) => {
    mainWindow = null;
  });

  tray = new Tray(appIconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "退出",
      click: () => {
        mainWindow.destroy();
      },
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
  app.on("second-instance", (_event, _commandLine, _workingDirectory) => {
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
