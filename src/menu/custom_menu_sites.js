import { app, BrowserWindow } from "electron";
const menu_helper = require("../helpers/menu_actions");
const Store = require('electron-store');
const store = new Store();
const vagrant_path = store.get('vagrant.path');

var yaml = require('js-yaml');
var fs   = require('fs');
var file = vagrant_path + '/vvv-custom.yml';

var submenuSites = [];
    // Get document, or throw exception on error
    try {
      var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      //console.log(doc.sites);
      Object.keys(doc.sites).forEach(function(key) {
        var val = doc.sites[key];
        var submenuHosts = [];
        Object.keys(val.hosts).forEach(function(host_key) {
          submenuHosts.push({
            label: 'http://'+val.hosts[host_key],
            //submenu: 
            click: (item, focusedWindow) => {
              menu_helper.open_file('http://'+val.hosts[host_key]);
            }
          });
          
        });
        submenuHosts.push({type: 'separator'});
        submenuHosts.push({
          label: 'Open folder (' + vagrant_path+'/www/'+key + ')',
          //submenu: 
          click: (item, focusedWindow) => {
            menu_helper.open_file(vagrant_path+'/www/'+key);
          }
        });
        submenuSites.push({
          label: key,
          submenu: submenuHosts
        });
        //logic();
      });
    } catch (e) {
      console.log(e);
    }
  
  
  
module.exports = {
  label: 'Sites',
  submenu: submenuSites
};