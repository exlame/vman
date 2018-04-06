// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import storage from 'electron-json-storage';
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import { customMenu } from "./menu/custom_menu";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const setApplicationMenu = () => {
  const menus = customMenu();
   menus.unshift(editMenuTemplate);
  //if (env.name !== "production") {
    menus.push(devMenuTemplate);
  //}
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

/**
 * TEMP TEMP TEMP TEMP TEMP
 */
storage.set('vagrant', { path: 'C:/Users/douelle/Vms/vvv' }, function(error) {
	  if (error) throw error;
	});
/**
 * /TEMP
 */



// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}
/**
 * TEMP TEMP TEMP TEMP TEMP
 */
storage.set('vagrant', { path: 'C:/Users/douelle/Vms/vvv' }, function(error) {
	  if (error) throw error;
	});
/**
 * /TEMP
 */

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

app.on("window-all-closed", () => {
  app.quit();
});
