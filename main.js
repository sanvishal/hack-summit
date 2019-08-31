const electron = require("electron");
const path = require("path");
const url = require("url");
const { app, BrowserWindow, Menu, ipcMain, Tray } = electron;
const db = require("./db");

let MainWindow;
let TrayWindow;

app.on("ready", () => {
  let tray = new Tray(path.join(__dirname, "logo.png"));
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  MainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  TrayWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    width: 600,
    height: 600,
    x: width - 600,
    y: height - 600
  });

  MainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file",
      slashes: true
    })
  );

  TrayWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "trayWindow.html"),
      protocol: "file",
      slashes: true
    })
  );

  MainWindow.webContents.openDevTools();
  TrayWindow.hide();

  const mainMenu = new Menu.buildFromTemplate(mainMenTemplate);
  Menu.setApplicationMenu(mainMenu);

  let contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => {
        MainWindow.maximize();
        MainWindow.setAlwaysOnTop(true);
      }
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("right-click", () => {
    tray.popUpContextMenu();
  });
  tray.on("click", () => {
    // MainWindow.maximize();
    // MainWindow.setAlwaysOnTop(true);
    TrayWindow.show();
  });

  MainWindow.on("minimize", function(event) {
    event.preventDefault();
    MainWindow.hide();
  });

  MainWindow.on("close", function(event) {
    if (!app.isQuiting) {
      event.preventDefault();
      MainWindow.hide();
    }

    return false;
  });

  TrayWindow.on("close", function(event) {
    if (!app.isQuiting) {
      event.preventDefault();
      TrayWindow.hide();
    }

    return false;
  });
});

ipcMain.on("tray:open", (err, item) => {
  MainWindow.maximize();
  MainWindow.setAlwaysOnTop(true);
});

const mainMenTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];
