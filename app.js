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
  
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('ready-to-show', function () {
      mainWindow.maximize();
      //mainWindow.show();
     // mainWindow.focus();
  });
    
    
	/********************************
   * MENU
   *******************************/
	//const menu = defaultMenu(app, shell);
  //menu.splice(2,2);
  var menu = [];
	var submenuVagrant = [];
	var submenuWindows = [];
	var submenuConfigs = [];
	function tab_open(title, url, icon){
		mainWindow.send('open', {url: url, title: title, icon:icon});
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
		storage.get('vagrant', function(error, data) {
		  if (error) throw error;
		  exec(getCommandLine() + ' ' + file);
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
  
  menu.push({
		label: 'Vagrant',
		submenu: submenuVagrant
  });
    menu.push(
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  }
  );
  menu.push({
		label: 'Configs',
		submenu: submenuConfigs
	});
  
  menu.push({
		label: 'Open',
		submenu: submenuWindows
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
    start_cmd('vagrant '+command);
  }
  
  
});
