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
  
  mainWindow.loadURL('file://' + __dirname + '/electron-tabs.html');
  mainWindow.on('ready-to-show', function () {
      mainWindow.maximize();
      //mainWindow.show();
     // mainWindow.focus();
  });
    
    
	/********************************
   * MENU
   *******************************/
	const menu = defaultMenu(app, shell);
	var submenuVagrant = [];
	var submenuVVV = [];
  
	function tab_open(title, url, icon){
		mainWindow.send('open', {url: url, title: title, icon:icon});
	}
	
	
	
	
	function tab_register(title, url, icon){
		// Add custom menu 
	  submenuVVV.push({
		label: title,
		click: (item, focusedWindow) => {
		  tab_open(title,url, icon);
		}
	  });
	}
	
	tab_register('phpMyAdmin','http://vvv.test/database-admin/','fas fa-database');
	tab_register('MailCatcher','http://vvv.test:1080/','fas fa-envelope');
	tab_register('PHP Status','http://vvv.test/php-status?html&full','fas fa-thermometer-three-quarters');
	
	
	submenuVVV.push({type: 'separator'});
	
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
		  exec(getCommandLine() + ' "cd ' + data.path+' && '+cmd+'"');
		});
	}
	
    
	

	submenuVVV.push({
		label: 'Vagranfile',
		click: (item, focusedWindow) => {
			//open_vagrant_file('Vagranfile');
      settingsWindow = new BrowserWindow(new electron.BrowserWindow({
        show : false
      }));
			settingsWindow.loadURL('file://' + __dirname + '/settings.html');
			settingsWindow.on('ready-to-show', function () {
				settingsWindow.show();
				settingsWindow.focus();
			});
		}
	  });
	submenuVVV.push({
		label: 'vvv-custom',
		click: (item, focusedWindow) => {
			open_vagrant_file('vvv-custom.yml');
		}
	  });
	
	menu.push({
		label: 'VVV',
		submenu: submenuVVV
	  });
    
  
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
			vagrant_run(['reload', '--provision']);
		}
	});
   submenuVagrant.push({
		label: 'Status',
		click: (item, focusedWindow) => {
			vagrant_run(['status']);
		}
	});
  menu.push({
		label: 'Vagrant',
		submenu: submenuVagrant
	  });

	Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    
    
	/**********************************
  * VAGRANT FUNCTIONS
  **********************************/
  
  /*function vagrant_run(command){
    consoleWindow = new electron.BrowserWindow({
      show : false,
      closable : false
    });
    consoleWindow.loadURL('file://' + __dirname + '/console.html');
    consoleWindow.on('ready-to-show', function () {
        consoleWindow.show();
        consoleWindow.focus();
    });
    
    const vagrant = spawn('vagrant',command,{
      cwd : 'C:/Users/douelle/Vms/vvv',
      env: process.env
    });

    vagrant.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      consoleWindow.send('log', {message: `${data}`});
    });

    vagrant.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      consoleWindow.send('log', {message: `stderr: ${data}`});
    });

    vagrant.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      consoleWindow.send('log', {message: `child process exited with code ${code}`});
      consoleWindow.setClosable(true);
    });
  }*/
  function vagrant_run(command){
    start_cmd('vagrant '+command+' -f');
  }
  
  
});
