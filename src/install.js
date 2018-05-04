  import { app, Menu, Tray, ipcMain } from "electron";
  const ipcRenderer = require('electron').ipcRenderer; 
  
  
  
  document.getElementById("install").addEventListener('click', function(){
    //ipcRenderer.send('install');
    console.log(app.getPath("home"));
  });