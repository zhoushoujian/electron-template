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
const os = require('os');
const path = require("path");
const fs = require('fs');
const Logger = require('beauty-logger');

const isWindows = os.type() === 'Windows_NT';
const isLinux = process.platform === 'linux';
const slash = isWindows ? '\\' : '/';
let appDirectory = '';
if (isWindows) {
  appDirectory = process.env.APPDATA + '\\electron-template\\';
} else {
  appDirectory = process.env.HOME + '/electron-template/';
}
if (!fs.existsSync(appDirectory)) {
  fs.mkdirSync(appDirectory);
}
if (!fs.existsSync(appDirectory + 'logs')) {
  fs.mkdirSync(appDirectory + 'logs');
}
const logger = new Logger({
  logFileSize: 1024 * 1024 * 50,
  logFilePath: appDirectory + 'logs' + slash + 'electron-template.log',
});

const appIconPath = path.join(__dirname, `./my-app/build/${isWindows ? 'favicon.ico' : '64x64.png'}`);
let mainWindow = null
const debug = process.env.NODE_ENV === 'development';

Menu.setApplicationMenu(null);

function createWindow() {
  try {
    if (process.platform === 'darwin') {
      const template = [
        {
          label: 'Application',
          submenu: [
            {
              label: '退出',
              accelerator: 'Command+Q',
              click() {
                app.quit();
              },
            },
          ],
        },
        {
          label: '编辑',
          submenu: [
            { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
            { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          ],
        },
      ];
      Menu.setApplicationMenu(Menu.buildFromTemplate(template));
    } else {
      Menu.setApplicationMenu(null);
    }

    mainWindow = new BrowserWindow({
      width: 1366,
      minWidth: 375,
      height: 768,
      minHeight: 600,
      icon: appIconPath,
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
    if (debug) {
    //if you want to debug electron, set debug to true
    mainWindow.loadURL("http://localhost:9999");
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
    } else {
      mainWindow.loadURL(`file://${__dirname}/my-app/build/index.html`);
    }

    mainWindow.on('blur', function () {
      const win = BrowserWindow.getFocusedWindow();
      if (win) return;
      globalShortcut.unregisterAll();
    });

    mainWindow.on('focus', function () {
      globalShortcut.register('ESC', function () {
        mainWindow.setFullScreen(false);
      });
      globalShortcut.register('F11', function () {
        if (mainWindow.isFullScreen()) {
          mainWindow.setFullScreen(false);
        } else {
          mainWindow.setFullScreen(true);
        }
      });
      globalShortcut.register('F10', function () {
        mainWindow.webContents.openDevTools();
        mainWindow.maximize();
      });
      if (process.platform === 'darwin') {
        const contents = mainWindow.webContents;
        globalShortcut.register('CommandOrControl+C', () => {
          contents.copy();
        });
        globalShortcut.register('CommandOrControl+V', () => {
          contents.paste();
        });
      }
    });

    //接收渲染进程的信息
    ipcMain.on('min', function () {
      mainWindow.minimize();
    });
    ipcMain.on('max', function () {
      mainWindow.maximize();
    });
    ipcMain.on('quit', function () {
      mainWindow.destroy();
    });

    mainWindow.setIcon(appIconPath);
    let willQuitApp = false; // 控制退出方式
    mainWindow.on('close', e => {
      logger.info('on close willQuitApp', willQuitApp);
      if (willQuitApp) {
        mainWindow.destroy();
      } else {
        e.preventDefault();
        mainWindow.hide();
      }
    });

    app.on('before-quit', () => {
      logger.info('on before-quit');
      willQuitApp = true;
    });
    mainWindow.on('closed', _event => {
      logger.info('on closed');
      mainWindow = null;
    });

    if (isWindows || isLinux) {
      if (isWindows) {
        mainWindow.setThumbnailToolTip('electron-template');
      }
      const tray = new Tray(appIconPath);
      const contextMenu = Menu.buildFromTemplate([
        {
          label: '打开',
          click: () => {
            mainWindow.show();
          },
        },
        {
          label: '退出',
          click: () => {
            mainWindow.destroy();
          },
        },
      ]);
      tray.setToolTip("electron-template");
      tray.setContextMenu(contextMenu);
      tray.on('click', () => {
        mainWindow.show();
      });
      tray.on('double-click', () => {
        mainWindow.show();
      });
    }
  } catch (err) {
    logger.error('createWindow happened an error');
    logger.error('createWindow err', err.stack || err.toString());
  }
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
  const id = null;
  if (app.dock && app.dock.bounce && app.dock.bounce()) {
    app.dock.bounce();
  }
  app.whenReady().then(() => {
    createWindow();
    if (id) {
      app.dock.cancelBounce(id);
    }

    app.on('activate', function () {
      logger.info('on activate');
      mainWindow.show();
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
      mainWindow.show();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', function (_event) {
      logger.info('on window-all-closed');
      if (process.platform !== 'darwin') app.quit();
    });
  });
}
