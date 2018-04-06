const electron = require('electron');
const {BrowserWindow} = require('electron')
const app = electron.app;
app.setName('VMon');

const defaultMenu = require('electron-default-menu');
const { Menu, shell } = electron;
const storage = require('electron-json-storage');
const process = require('process');
const { spawn } = require('child_process');


app.on('ready', function () {
	storage.set('vagrant', { path: 'C:/Users/douelle/Vms/vvv' }, function(error) {
	  if (error) throw error;
	});
	

  /********************************
   * WINDOW
   *******************************/
  const mainWindow = new electron.BrowserWindow({
    show: false
  });
  var settingsWindow;
  var consoleWindow; 
  
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('ready-to-show', function () {
      mainWindow.maximize();
      //mainWindow.show();
     // mainWindow.focus();
  });
    
  const { menu } = require('./src/menu');
	Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    
  
  
});
