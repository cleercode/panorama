const PageMod = require('page-mod').PageMod;
const Widget = require('widget').Widget;
const tabs = require('tabs');
const addontab = require('addon-page');
const runtime = require('runtime');
const data = require('self').data;

const currentTabs = require('current-tabs');

function detectOS() {
  switch (runtime.OS) {
    case 'WINNT':  return 'windows';
    case 'Darwin': return 'mac';
    default:       return 'linux';
  }
}

exports.main = function() {

  var url = data.url('index.html');
  var widget = new Widget({
    id: 'panorama',
    label: 'Panorama',
    contentURL: data.url('img/icon.png'),
    onClick: function(event) {
      if (tabs.activeTab.url == url) {
        tabs.activeTab.close();
      }
      else {
        tabs.open(url);
      }
    }
  });
  
  var pageMod = PageMod({
    include: [url],
    contentScriptWhen: 'end',
    contentScriptFile: [data.url('jquery.min.js'),
                        data.url('stylist.js'),
                        data.url('script.js'),
                        data.url('populator.js')],
    onAttach: function(worker) {
      worker.port.emit('os', detectOS());
      currentTabs.get(worker);
    }
  });
};
