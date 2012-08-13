function renderGroup(group) {
  var html = '<div class="group" id="' + group.id + '"><h1>' + group.title + '</h1><ul class="items"></ul></div>';
  var el = $(html);
  $('.groups').append(el);
}

function renderItem(item) {
  var html = '<li><a href="' + item.location + '" target="_blank" style="background-image: url(' + item.thumb + ')"><span class="title">' + item.title + '</span></a></li>'
  var el = $(html);
  if (item.icon) {
    el.find('.icon').css({ backgroundImage: "url(" + item.icon + ")" });
  }
  el.data('item', item);

  $('#' + item.group + ' .items').append(el);
}

self.port.on('group', renderGroup);
self.port.on('item', renderItem);
