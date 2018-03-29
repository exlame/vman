const electron = require('electron');
const {BrowserWindow} = require('electron')
const app = electron.app;
app.setName('VMon');

const defaultMenu = require('electron-default-menu');
const { Menu, shell } = electron;
const storage = require('electron-json-storage');



app.on('ready', function () {
	
	

	storage.set('vagrant', { path: 'C:/Users/douelle/Vms/vvv' }, function(error) {
	  if (error) throw error;
	});
	

    const mainWindow = new electron.BrowserWindow();
    mainWindow.loadURL('file://' + __dirname + '/electron-tabs.html');
    mainWindow.on('ready-to-show', function () {
        mainWindow.show();
        mainWindow.focus();
    });
	
	const menu = defaultMenu(app, shell);
	
	
	function tab_open(title, url, icon){
		mainWindow.send('open', {url: url, title: title, icon:icon});
	}
	
	
	var submenu = [];
	
	function tab_register(title, url, icon){
		// Add custom menu 
	  submenu.push({
		label: title,
		click: (item, focusedWindow) => {
		  tab_open(title,url, icon);
		}
	  });
	}
	
	tab_register('phpMyAdmin','http://vvv.test/database-admin/','fas fa-database');
	tab_register('MailCatcher','http://vvv.test:1080/','fas fa-envelope');
	tab_register('PHP Status','http://vvv.test/php-status?html&full','fas fa-thermometer-three-quarters');
	
	
	submenu.push({type: 'separator'});
	
	function open_vagrant_file(file){
		function getCommandLine() {
		   switch (process.platform) { 
			  case 'darwin' : return 'open';
			  case 'win32' : return 'start';
			  case 'win64' : return 'start';
			  default : return 'xdg-open';
		   }
		}
		var exec = require('child_process').exec;
		storage.get('vagrant', function(error, data) {
		  if (error) throw error;
		  exec(getCommandLine() + ' ' + data.path+'/'+file);
		});
			
	}
	
	
    
	
	var settings;
	submenu.push({
		label: 'Vagranfile',
		click: (item, focusedWindow) => {
			//open_vagrant_file('Vagranfile');
			settings = new BrowserWindow();
			settings.loadURL('file://' + __dirname + '/settings.html');
			settings.on('ready-to-show', function () {
				settings.show();
				settings.focus();
			});
		}
	  });
	submenu.push({
		label: 'vvv-custom',
		click: (item, focusedWindow) => {
			open_vagrant_file('vvv-custom.yml');
		}
	  });
	  
	
	
	menu.push({
		label: 'VVV',
		submenu: submenu
	  })
	  
	

	Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
});
