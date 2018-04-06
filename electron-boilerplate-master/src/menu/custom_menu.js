/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const { app, BrowserWindow } = require("electron");
const storage = require('electron-json-storage');
module.exports.customMenu = function(){
  
  
/********************************
   * MENU
   *******************************/
	//const menu = defaultMenu(app, shell);
  //menu.splice(2,2);
  var menu = [];
	var submenuVagrant = [];
	var submenuWindows = [];
	var submenuConfigs = [];
	var submenuSites = [];
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
		  open_file('http://vvv.test');
		}
	});
	tab_register('phpMyAdmin','http://vvv.test/database-admin/','fas fa-database');
	tab_register('MailCatcher','http://vvv.test:1080/','fas fa-envelope');
	tab_register('PHP Status','http://vvv.test/php-status?html&full','fas fa-thermometer-three-quarters');
	tab_register('Console','http://vvv.test:3000','fas fa-terminal');
	
	
    
	function open_vagrant_file(file){
    
		
		storage.get('vagrant', function(error, data) {
		  if (error) throw error;
      open_file(data.path+'/'+file);
		});
			
	}
  
  function open_file(file){
		function getCommandLine() {
		   switch (process.platform) { 
			  case 'darwin' : return 'open';
			  case 'win32' : return 'start';
			  case 'win64' : return 'start';
			  default : return 'xdg-open';
		   }
		}
		var exec = require('child_process').exec;
		  exec(getCommandLine() + ' ' + file);
	}
  
  function start_cmd(cmd){
    function getCommandLine() {
		   switch (process.platform) { 
			  case 'darwin' : return 'open';
			  case 'win32' : return 'start cmd.exe /K';
			  case 'win64' : return 'start cmd.exe /K';
			  default : return 'xdg-open';
		   }
		}
    var exec = require('child_process').exec;
		storage.get('vagrant', function(error, data) {
		  if (error) throw error;
		  exec(getCommandLine() + ' "cd ' + data.path+' '+cmd+'"');
		});
	}
	
    
	function vagrant_run(command){
    start_cmd('&& vagrant '+command);
  }

	
	
  ////////////////////////
  //Configs
  submenuConfigs.push({
		label: 'Vagranfile',
		click: (item, focusedWindow) => {
			open_vagrant_file('Vagrantfile');
		}
	  });
	submenuConfigs.push({
		label: 'vvv-custom',
		click: (item, focusedWindow) => {
			open_vagrant_file('vvv-custom.yml');
		}
	  });
	
  
  
  
  ////////////////////////
  //Sites
  //const storage = require('electron-json-storage');
  storage.getAll(function(error, data) {
  if (error) throw error;
    var yaml = require('js-yaml');
    var fs   = require('fs');
    var file = data.vagrant.path + '/vvv-custom.yml';
    // Get document, or throw exception on error
    try {
      var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      //console.log(doc.sites);
      Object.keys(doc.sites).forEach(function(key) {
        var val = doc.sites[key];
        //console.log(key);
       // console.log(val);
        submenuSites.push({
          label: key,
          click: (item, focusedWindow) => {
            //vagrant_run(['reload']);
          }
        });
        //logic();
      });
    } catch (e) {
      console.log(e);
    }
  });
  
  
  ////////////////////////
  //Vagrant
	submenuVagrant.push({
		label: 'Up',
		click: (item, focusedWindow) => {
			vagrant_run(['up']);
		}
	});
  submenuVagrant.push({
		label: 'Reload',
		click: (item, focusedWindow) => {
			vagrant_run(['reload']);
		}
	});
  submenuVagrant.push({
		label: 'Reload --provison',
		click: (item, focusedWindow) => {
			vagrant_run(['reload --provision']);
		}
	});
  submenuVagrant.push({
		label: 'Status',
		click: (item, focusedWindow) => {
			vagrant_run(['status']);
		}
	});
  submenuVagrant.push({
		label: 'Console',
		click: (item, focusedWindow) => {
			start_cmd('');
		}
	});
  
  menu.push({
		label: 'Vagrant',
		submenu: submenuVagrant
  });
  
  menu.push({
		label: 'Configs',
		submenu: submenuConfigs
	});
  
  menu.push({
		label: 'Open',
		submenu: submenuWindows
	});
  
  menu.push({
		label: 'Sites',
		submenu: submenuSites
	});
  
  return menu;
};