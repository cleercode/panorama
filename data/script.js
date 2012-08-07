function stickyScroll() {
  $('.group h1').each(function(index, el) {
    var $el = $(el);
    var elOffset = $el.offset().top - $('.groups').scrollTop();
    var elHeight = $el.height();

    // Container must have position: relative;
    var $container = $($el.parent());
    var containerOffset = $container.offset().top; - $('.groups').scrollTop()
    var containerHeight = $container.height();

    var padding = 10;
    var pageOffset = 60;

    $('.groups').scroll(function() {

      var top = $('.groups').scrollTop();
      var position = top + pageOffset + padding;

      $el.removeClass();

      // Below container
      if (position > (containerOffset + containerHeight - elHeight)) {
        $el.addClass('bottom');
      }
      // Within container
      else if (position >= elOffset) {
        $el.addClass('sticky');
      }
      // Before container
      else if (position < elOffset) {
      }
    });
  });
}

function keyboardControl() {
  var index = -1;
  var headerHeight = 60;
  Mousetrap.bind('down', function() {
    if (!$('ul.bookmarks li')[index + 1]) return;

    var $active = $('ul.bookmarks li.active');
    var $next = $($('ul.bookmarks li')[++index]);

    $active.removeClass('active');
    $next.addClass('active');

    var nextTop = $next.offset().top;
    var docBottom = $('.groups').scrollTop() + $(window).height();
    if (nextTop > docBottom) {
      $('.groups').scrollTop($next.offset().top - $(window).height() + headerHeight);
    }

    return false;
  });
  Mousetrap.bind('up', function() {
    if (!$('ul.bookmarks li')[index - 1]) return;

    var $active = $('ul.bookmarks li.active');
    var $next = $($('ul.bookmarks li')[--index]);

    $active.removeClass('active');
    $next.addClass('active');

    var nextTop = $next.offset().top;
    var docTop = $('.groups').scrollTop() + headerHeight;

    if (nextTop < docTop) {
      // $('.groups').scrollTop($next.offset().top - headerHeight);
    }
    return false;
  });
  Mousetrap.bind('enter', function() {
    var $active = $('ul.bookmarks li.active');
    var link = $active.find('a').attr('href');
    window.open(link);
  });
}

function infoToggle() {
  var visible = false;
  $('#info-toggle').click(function() {
    if (visible) $('body').removeClass('info-visible');
    else $('body').addClass('info-visible');
    visible = !visible;
  });
}

function viewToggle() {
  $('#list').click(function() {
    $('body').removeClass('grid').addClass('list');
  });
  $('#grid').click(function() {
    $('body').removeClass('list').addClass('grid');
  });
}

function formatDate(dateString) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var d = new Date(dateString);
  var month = months[d.getMonth()];
  var date = d.getDate();
  var year = d.getFullYear();
  if (year < 1970) return 'Never';
  return month + ' ' + date + ', ' + year;
}

function hoverInfo() {
  $('.groups li').hover(function() {
    var infoEl = $('#info');
    if (infoEl.hasClass('editing')) return;

    var item = $(this).data('item');
    var folder = $(this).parent().parent().find('.name h1').text();
    infoEl.find('.thumb').attr('src', item.thumb);
    infoEl.find('.title').text(item.title);
    infoEl.find('.url a').attr('href', item.location).text(item.location);
    infoEl.find('.folder').text(folder);
    infoEl.find('.added').text(formatDate(item.added));
    infoEl.find('.visited').text(formatDate(item.visited));
    infoEl.find('.visits').text(item.visits);
    infoEl.find('.tags').empty();
    if (item.tags) {
      item.tags.forEach(function(tag) {
        var html = '<li>' + tag + '</li>';
        var el = $(html);
        el.appendTo(infoEl.find('.tags'));
      });
    }
  });
}

function editInfo() {
  $('.edit').click(function(e) {
    $('body').addClass('info-visible');
    var infoEl = $('#info');
    var itemEl = $(this).parent().parent();
    var item = itemEl.data('item');
    infoEl.addClass('editing');
    infoEl.find('.thumb').attr('src', item.thumb);
    infoEl.find('.title').text(item.title);
    infoEl.find('.url a').attr('href', item.location).text(item.location);
    infoEl.find('.folder').text(item.folder);
    infoEl.find('#edit-title').val(item.title);
    infoEl.find('#edit-url').val(item.location);
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
  $('.done').click(function() {
    $('#info').removeClass('editing');
  })
}

function clearContent() {
  $('.groups').empty();
}

function contentToggle() {
  $('#bookmarks').click(function() {
    clearContent();
    $('ul.nav li').removeClass('active');
    document.title = 'Bookmarks';
    $(this).addClass('active');
    self.port.emit('bookmarks');
  });
  $('#tabs').click(function() {
    clearContent();
    $('ul.nav li').removeClass('active');
    document.title = 'Current Tabs';
    $(this).addClass('active');
    self.port.emit('tabs');
  });
  $('#history').click(function() {
    clearContent();
    $('ul.nav li').removeClass('active');
    document.title = 'History';
    $(this).addClass('active');
    self.port.emit('history');
  });
}

function bindItems() {
  // stickyScroll();
  // keyboardControl();
  hoverInfo();
  editInfo();
}

$(function() {
  infoToggle();
  viewToggle();
  contentToggle();
});
