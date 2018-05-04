import { app, BrowserWindow } from "electron";
const menu_helper = require("../helpers/menu_actions");

module.exports = {
  label: "Vagrant",
  submenu: [
    {
		label: 'Up',
		click: (item, focusedWindow) => {
			menu_helper.vagrant_run(['up']);
		}
	},
  {
		label: 'Reload',
		click: (item, focusedWindow) => {
			menu_helper.vagrant_run(['reload']);
		}
	},
  {
		label: 'Reload --provison',
		click: (item, focusedWindow) => {
			menu_helper.vagrant_run(['reload --provision']);
		}
	},
  {
		label: 'Status',
		click: (item, focusedWindow) => {
			menu_helper.vagrant_run(['status']);
		}
	},
  {
		label: 'Console',
		click: (item, focusedWindow) => {
		  //menu_helper.start_cmd('');
      menu_helper.vagrant_run(['ssh']);
		}
	}
  ]
};