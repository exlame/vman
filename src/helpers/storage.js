import { app } from "electron";
import env from "env";


if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}


/**
 * TEMP TEMP TEMP TEMP TEMP
 */
const Store = require('electron-store');
const store = new Store();
store.set('vagrant.path', app.getPath("home")+'/vmon/vvv');

/**
 * /TEMP
 */
module.exports = {
  get : function(name){
    return store.get(name);
  },
  set : function(name, value){
    return store.get(name, value);
  }
};