const { app, BrowserWindow } = require("electron");
const Store = require('electron-store');
const store = new Store();
const vagrant_path = store.get('vagrant.path');

module.exports = {
  open_vagrant_file : function (file){
    
    this.open_file(vagrant_path+'/'+file);
			
	},
  open_file : function (file){
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
	},
  start_cmd : function(cmd){
    function getCommandLine() {
		   switch (process.platform) { 
			  case 'darwin' : return 'open';
			  case 'win32' : return 'start cmd.exe /K';
			  case 'win64' : return 'start cmd.exe /K';
			  default : return 'xdg-open';
		   }
		}
    var exec = require('child_process').exec;
		exec(getCommandLine() + ' "cd ' + vagrant_path+' '+cmd+'"');
	},
	
    
	vagrant_run: function(command){
    this.start_cmd('&& vagrant '+command);
  }
};