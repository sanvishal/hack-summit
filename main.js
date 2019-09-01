const electron = require("electron");
const path = require("path");
const url = require("url");
const { app, BrowserWindow, Menu, ipcMain, Tray } = electron;
const db = require("./db");
const notifs = require("./notifs");

let MainWindow;
let TrayWindow;
let traywintop = false,
  done = false;

// const UserReg = async (data) => {
//   const obj = await db.userinfo.insert({data})
//   return obj;
// }

app.on("ready", () => {
  // let isfirst = window.localStorage.getItem("isfirst", true);
  //if (!isfirst) {
  //MainWindow.webContents.send("isfirst:prompt", true);
  // }
  let tray = new Tray(path.join(__dirname, "logo.png"));
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  MainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 1200,
    height: 900
  });

  TrayWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    width: 800,
    height: 500,
    x: width - 800,
    y: height - 500
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
      pathname: path.join(__dirname, "notification.html"),
      protocol: "file",
      slashes: true
    })
  );

  show = () => {
    setTimeout(() => {
      TrayWindow.webContents.send("exercise-details", notifs.getNormalPlan());
      TrayWindow.setAlwaysOnTop(true);
      TrayWindow.show();
    }, 6000);
  };

  TrayWindow.webContents.openDevTools();
  TrayWindow.hide();
  show();

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
    traywintop = true;
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

ipcMain.on("isfirst:submit", (err, data) => {
  if (data) {
    console.log(data);
    window.localStorage.setItem("isfirst", true);
  }
});

ipcMain.on("yes:clicked", (err, item) => {
  TrayWindow.hide();
  show();
});

ipcMain.on("no:clicked", (err, item) => {
  // alert("YOU WILL BE FACING THE CONSEQUENCES!");
  TrayWindow.hide();
  show();
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
