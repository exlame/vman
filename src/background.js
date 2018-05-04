// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
import env from "env";
import { app, Menu, Tray, ipcMain } from "electron";

const storage = require("./helpers/storage");
const vagrant_path = storage.get('vagrant.path');

import path from "path";
import url from "url";

import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { customMenu } from "./menu/custom_menu";
import createWindow from "./helpers/window";
import download from "download-git-repo";
const menu_helper = require("./helpers/menu_actions");



// Special module holding environment variables which you declared
// in config/env_xxx.json file.


var appIcon = null


const setApplicationMenu = () => {
  const menus = customMenu();
   menus.unshift(editMenuTemplate);
  //if (env.name !== "production") {
    menus.push(devMenuTemplate);
  //}
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
  
  
    const iconPath = path.join(__dirname, 'resources/icon.ico');
    appIcon = new Tray(iconPath);
    const submenuVagrant = require("./menu/custom_menu_vagrant");
    const submenuSites = require("./menu/custom_menu_sites");
    const submenuConfigs = require("./menu/custom_menu_config");
    const contextMenu = Menu.buildFromTemplate([
      submenuSites,
      submenuVagrant,
      submenuConfigs
    ]);

    // Call this again for Linux because we modified the context menu
    appIcon.setContextMenu(contextMenu)
};


ipcMain.on('install', (event, arg) => {
  const { spawn,exec } = require('child_process');
  var progress = 0;
  
  function install_vvv(){
    var fs = require('fs');
    event.sender.send('log','Downloading VVV');
    download('exlame/vvv', vagrant_path, function (err) {
      if(err){
        event.sender.send('error', 'Error downloading VVV');
      } else {
        progress = 2;
        event.sender.send('progress',progress);
        fs.createReadStream(vagrant_path+'/vvv-config.yml').pipe(fs.createWriteStream(vagrant_path+'/vvv-custom.yml')); 
        install_plugins();
      }
    });
  }
  
  function install_plugins(){
      /**
      * Plugins Vagrant
      */
     var allUp = true;
      event.sender.send('log', 'Installing Vagrant Dependencies');
      const exec_plugins = spawn('vagrant', ['plugin','install','vagrant-hostmanager','vagrant-hostsupdater','vagrant-triggers','vagrant-vbguest'], {cwd : vagrant_path, env: process.env });

      exec_plugins.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        event.sender.send('log', data);
      });

      exec_plugins.stderr.on('data', (data) => {
        event.sender.send('error', data);
        console.log(`stderr: ${data}`);
        event.sender.send('log', 'ERR: ' + data);
        allUp = false;
      });

      exec_plugins.on('close', (code) => {
        progress = 10;
        event.sender.send('progress',progress);
        if (allUp){
          install_up();
        }
      });
    }
  
  function install_up(){
    /**
      * Vagrant UP
      */
     var allUp = true;
      event.sender.send('log', 'Starting Vagrant...');
        const exec_up = spawn('vagrant', ['up'], {cwd : vagrant_path, env: process.env });
        exec_up.stdout.on('data', (data) => {
          
          if (progress<90){
            progress +=80/7000; // Around 7k lines for vagrant up
          }
          else {
            progress = 90;
          }
          event.sender.send('progress',progress);
          console.log(`stdout: ${data}`);
          event.sender.send('log', data);
        });

        exec_up.stderr.on('data', (data) => {
          //allUp = false;
          console.log(`stderr: ${data}`);
          event.sender.send('log', 'ERR: ' + data);
          //event.sender.send('error', data);
        });

        exec_up.on('close', (code) => {
          if (allUp){
            app.relaunch();
            app.exit(0);
          }
        });
  }
  
  /**
   * VVV
   */
  event.sender.send('progress',progress);
  install_vvv();
});


app.on("ready", () => {
  var fs = require('fs');
  if (!fs.existsSync(vagrant_path)) {
    //Installation
      
    const mainWindow = createWindow("install", {
      width: 800,
      height: 300,
      show: false
    });

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "install.html"),
        protocol: "file:",
        slashes: true
      })
    );

    if (env.name === "development") {
      mainWindow.openDevTools();
    }
    
  } else {
    
    fs.watchFile(vagrant_path+'/vvv-custom.yml', (curr, prev) => {
        const {dialog} = require('electron');
        dialog.showMessageBox({
          type : 'question',
          message : 'vvv-custom.yml changes. vagrant reload --provision?',
          buttons : [
            'Cancel',
            'Yes'
          ]
        }, function(response){
          if(response){
            
          }
        });
    });
    setApplicationMenu();

    const mainWindow = createWindow("main", {
      width: 1000,
      height: 600,
      show: false
    });

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "app.html"),
        //pathname: path.join(__dirname, "install.html"),
        protocol: "file:",
        slashes: true
      })
    );

    if (env.name === "development") {
      mainWindow.openDevTools();
    }



  }


});



app.on("window-all-closed", () => {
  app.quit();
});
