const path = require("path");
const express = require("express");
const server = express();
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
const { sync } = require("sync-files-cipher");
const fs = require("fs");
const Store = require("electron-store");
const store = new Store();

const SYNC_PATH_KEY = "sync-path";
const USERNAME_SYNC_PATH_KEY = "username";

var win = null;
var watcher = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      allowpopups: true,
      nativeWindowOpen: true,
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");
  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    server.use("/", express.static("build"));
    const infos = server.listen(0, "localhost", () =>
      win.loadURL(`http://localhost:${infos.address().port}/index.html`)
    );
  }
  //win.loadURL("https://streamsforlab.bucaramanga.upb.edu.co");
  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools({ mode: "detach" });
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await createWindow();
  checkIfPathToSynExist();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// --- utils ---
const sendError = (message) => {
  win.webContents.send("sync-error", message);
};

const startToSync = async (path) => {
  try {
    const username = await store.get(USERNAME_SYNC_PATH_KEY);

    watcher = await sync(
      path,
      async function (eventType, pathChanged) {
        console.log(eventType, pathChanged);

        // get type
        let type = getMymeTypeByExtension(eventType, pathChanged)


        // if change file
        if (eventType === "CHANGE") {
          console.log("CHANGE!");
          win.webContents.send(
            "sync-change",
            `The file ${pathChanged.split("/").pop()} was synced`
          );

          //  if add file
        } else if (eventType === "ADD_FILE") {
          console.log("ADD_FILE!");
          const weight = fs.statSync(pathChanged).size;
          const file = {
            path: `/home/streams-for-lab.co/${username}${pathChanged}`,
            name: pathChanged.split("/").pop(),
            weight,
            type,
            sync: true,
          };

          // Ad dato to database
          win.webContents.send("sync-add-file", file);

          // if remove file
        } else if (eventType === "REMOVE_FILE") {
          console.log(REMOVE_FILE);
          win.webContents.send(
            "sync-change",
            `The file ${pathChanged.split("/").pop()} was removed`
          );
          // remove dato from database
        }
      },

      function (error) {
        console.log("Sync error: ", error);
        sendError("An error occurred while syncing: ", error.message);
      },
      `/home/streams-for-lab.co/${username}`
    );

    // catch any error
  } catch (error) {
    console.log(error);
    sendError(error.message);
  }
};

const getMymeTypeByExtension = (eventType, pathChanged) => {

  const imageExtensions = ["png", "jpeg", "gif"]
  let type = 'file'

  if (eventType.includes('FILE')) {
    const extension = pathChanged.split(".").pop().toLocaleLowerCase();
    if (imageExtensions.includes(extension)) type = "photo";
    if (extension === "mp4") type = "video";
  }

  console.log("TYPE: ", type);
  return type
}

// ---- IPC ----
ipcMain.on("sync", async (event, username) => {
  paths = dialog.showOpenDialogSync(win, {
    title: "Select a directory to sync",
    buttonLabel: "Select folder",
    properties: ["openDirectory"],
  });

  console.log("Path elegido: ", paths);

  if (paths) {
    await store.set(SYNC_PATH_KEY, paths[0]);
    await store.set(USERNAME_SYNC_PATH_KEY, username);
    startToSync(paths[0]);
    event.reply("sync-success-dir", paths[0]);
    return;
  }

  console.log("Despues xcd");
  event.reply("sync-success-dir", paths);
});

// remove sync folder
ipcMain.on("desynchronize", async (event, arg) => {
  watcher.close().then(async () => {
    await store.delete(SYNC_PATH_KEY);
    await store.delete(USERNAME_SYNC_PATH_KEY);
    event.reply("desynchronize-success", null);
  })
  .catch(err => sendError("Close watcher error: ", err.message));
});


// get path sync if exiots and send to react sync section
ipcMain.on("get-path-syncronized", (event, arg) => {
  const path = store.get(SYNC_PATH_KEY);
  console.log("Path exist ->", path);
  if(path)event.reply("path-syncronized", path);
});


// electon check if exist a dir synced for stat to sync
const checkIfPathToSynExist = () => {
  const path = store.get(SYNC_PATH_KEY);
  if (path) startToSync(path);
};
