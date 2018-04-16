// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
import env from "env";
import { app, Menu, Tray } from "electron";
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}
/**
 * TEMP TEMP TEMP TEMP TEMP
 */
const Store = require('electron-store');
const store = new Store();
store.set('vagrant.path', 'C:/Users/douelle/Vms/vvv');

/**
 * /TEMP
 */

import path from "path";
import url from "url";

import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { customMenu } from "./menu/custom_menu";
import createWindow from "./helpers/window";





// Special module holding environment variables which you declared
// in config/env_xxx.json file.





const setApplicationMenu = () => {
  const menus = customMenu();
   menus.unshift(editMenuTemplate);
  //if (env.name !== "production") {
    menus.push(devMenuTemplate);
  //}
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};





app.on("ready", () => {
  setApplicationMenu();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    show: false
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
  



});

  let appIcon = null
  app.on('ready', () => {
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
  })

app.on("window-all-closed", () => {
  app.quit();
});
