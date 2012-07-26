var PageMod = require("page-mod").PageMod;
var Widget = require("widget").Widget;
var tabs = require('tabs');
var windows = require("windows").browserWindows;
var addontab = require("addon-page");
var data = require("self").data;
var places = require("places.js");

exports.main = function() {

  var url = data.url("index.html");
  var widget = new Widget({
    id: "cleer-bookmarks",
    label: "Bookmarks",
    contentURL: data.url("icon.png"),
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
    contentScriptFile: [data.url('jquery-1.7.2.min.js'), data.url('populator.js')],
    onAttach: function(worker) {
      queryFolder(places.bookmarks.menu, worker);
    }
  });
};

function queryFolder(folderId, worker) {
  var search = places.bookmarks.search({
    bookmarked: {
      folder: folderId
    },
    onResult: function(result) {
      if (result.type == "folder") {
        var folder = {
          id: result._itemId,
          title: result.title || result.location || result.folder
        };
        worker.port.emit("folder", folder);
        queryFolder(folder.id, worker);
      }
      else if (result.type == "bookmark") {
        var bookmark = {
          folder: result.folder,
          location: result.location,
          title: result.title,
          icon: result.icon
        };
        worker.port.emit("bookmark", bookmark);
      }
    }
  });
}