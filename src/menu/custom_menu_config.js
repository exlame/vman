import { app, BrowserWindow } from "electron";
const menu_helper = require("../helpers/menu_actions");

module.exports = {
  label: "Configs",
  submenu: [
    {
      label: 'Vagranfile',
      click: (item, focusedWindow) => {
        menu_helper.open_vagrant_file('Vagrantfile');
      }
    },
    {
      label: 'vvv-custom',
      click: (item, focusedWindow) => {
        menu_helper.open_vagrant_file('vvv-custom.yml');
      }
    }
  ]
};
