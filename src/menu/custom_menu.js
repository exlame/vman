/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const { app, BrowserWindow } = require("electron");
const Store = require('electron-store');
const store = new Store();
const vagrant_path = store.get('vagrant.path');

const menu_helper = require("../helpers/menu_actions");


module.exports.customMenu = function(){
/********************************
   * MENU
   *******************************/
	//const menu = defaultMenu(app, shell);
  //menu.splice(2,2);
  var menu = [];
	var submenuWindows = [];
	function tab_open(title, url, icon){
		BrowserWindow.getFocusedWindow().send('open', {url: url, title: title, icon:icon});
	}
	
	
	
	////////////////////////
  //Windows
	function tab_register(title, url, icon){
		// Add custom menu 
	  submenuWindows.push({
		label: title,
		click: (item, focusedWindow) => {
		  tab_open(title,url, icon);
		}
	  });
	}
	
  submenuWindows.push({
		label: 'Dashboard (Web)',
		click: (item, focusedWindow) => {
		  menu_helper.open_file('http://vvv.test');
		}
	});
	tab_register('phpMyAdmin','http://vvv.test/database-admin/','fas fa-database');
	tab_register('MailCatcher','http://vvv.test:1080/','fas fa-envelope');
	tab_register('PHP Status','http://vvv.test/php-status?html&full','fas fa-thermometer-three-quarters');
	tab_register('Console','http://vvv.test:3000','fas fa-terminal');
	
	
    
	
  
  
  
  

	
	

  
  
  
  const submenuVagrant = require("../menu/custom_menu_vagrant");
  menu.push(submenuVagrant);
  
  
	const submenuConfigs = require("../menu/custom_menu_config");
  menu.push(submenuConfigs);
  
  menu.push({
		label: 'Tools',
		submenu: submenuWindows
	});
  
  const submenuSites = require("../menu/custom_menu_sites");
   menu.push(submenuSites);
  
  return menu;
};