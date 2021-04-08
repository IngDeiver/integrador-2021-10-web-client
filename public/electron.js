const path = require("path");
const express = require('express');
const server = express();
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
const  { sync } = require('sync-files-cipher')
const fs = require('fs')
const  encrypt  = require ('./encrypt')
const Store = require('electron-store');
const store = new Store();
const SYNC_PATH_KEY = "sync-path";
const USERNAME_SYNC_PATH_KEY = "username"

var  win = null
var  watcher = null

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
      preload: path.join(__dirname, "preload.js") 
    }
  });

  
  // and load the index.html of the app.
  win.loadFile("index.html");
  if(isDev){
    win.loadURL("http://localhost:3000");
  }else{
    server.use('/', express.static('build'));
    const infos = server.listen(0, 'localhost', () => win.loadURL(`http://localhost:${infos.address().port}/index.html`));
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
  await createWindow()
  checkIfPathToSynExist()
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


const checkIfPathToSynExist = () => {
  const  path = store.get(SYNC_PATH_KEY)
  if(path) startToSync(path)
}

const startToSync = async (path) => {
  const username =  await store.get(USERNAME_SYNC_PATH_KEY)
  console.log("Username: ", username);

  watcher = await sync(
    path,
    function (eventType, pathChanged) {
      console.log("Succes sync: Aqui el client hace algo");
      console.log(eventType, pathChanged);

      if(eventType === 'CHANGE'){
        win.webContents.send('sync-change', `The file ${pathChanged.split('/').pop()} was synced`)
      }else if(eventType === 'ADD_FILE'){
        win.webContents.send('sync-change', `The file ${pathChanged.split('/').pop()} was added`)
        // Ad dato to database
      } else if(eventType === 'REMOVE_FILE'){
        win.webContents.send('sync-change', `The file ${pathChanged.split('/').pop()} was removed`)
        // remove dato from database
      }

      // Prueba de sincronización
      (async () => {
        if (fs.existsSync(pathChanged) && !fs.statSync(pathChanged).isDirectory()) {
          const decryptedFile = await encrypt.decryptFile(`/home/streams-for-lab.co/${username}${pathChanged}`,
          '8BZ3pCTp71LX5I//QsBYdz7w4JHXNVehSBXuXnScdqg=',
          'AAAAAAAAAAAAAAAAAAAAAA==');
          console.log("Nuevo contenido: ", decryptedFile.toString());
        } else {
          console.log(`${pathChanged} not exist`);
        }
      })();
    },
    function (error) {
      console.log("Sync error: ", error);
      win.webContents.send('sync-error', 'An error occurred while syncing')
    },
    `/home/streams-for-lab.co/${username}`
  );
}

// IPC
ipcMain.on('sync', async  (event, username) => {
      paths = dialog.showOpenDialogSync(win, {title: 'Select a directory to sync', 
        buttonLabel: 'Select folder',
        properties:['openDirectory']
      })

      console.log("Path elegido: ", paths)

      if(paths) {
        await store.set(SYNC_PATH_KEY, paths[0] );
        await store.set(USERNAME_SYNC_PATH_KEY, username);
        startToSync(paths[0])
        event.reply('sync-success', paths[0])
        return
      } 

      event.reply('sync-success', paths)
})


ipcMain.on('desynchronize', async (event, arg) => {
  watcher.close()
    .then(async () => {
      await store.delete(SYNC_PATH_KEY)
      await store.delete(USERNAME_SYNC_PATH_KEY)
      event.reply('desynchronize-success', null)
    })
})

ipcMain.on('get-path-syncronized', (event, arg) => {
  const  path = store.get(SYNC_PATH_KEY)
  console.log("Path exist ->", path);
  event.reply('path-syncronized', path)
})