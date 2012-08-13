let Panorama = {
  MAX_GROUPS_PER_ROW: 3,
  groups: 0,

  /**
   * Initializes the Panorama UI, sizing the groups/pages and binding elements
   */
  init: function(numGroups) {
    this.groups = numGroups;
    this.resizeGroups();

    // TODO: Disable CSS animation on .group until after initial resize

    let add = document.getElementById("add");
    add.addEventListener("click", this.addGroup);
  },

  /**
   * Calculates the appropriate number of rows to use for the grid layout
   * @param items Number of items
   * @param columns Number of columns, if already known (otherwise calculated)
   */
  rows: function(items, columns) {
    columns = columns || this.columns(items);
    return Math.ceil(items / columns);
  },

  /** 
   * Calculates the appropriate number of columns to use for the grid layout
   * @param items Number of items
   */
  columns: function(items) {
    return Math.min(items, this.MAX_GROUPS_PER_ROW);
  },

  /**
   * Add a group
   */
  addGroup: function() {
    self.port.emit('group', {});
    Panorama.resizeGroups();
  },

  /**
   * Resize the groups to fit the window
   */
  resizeGroups: function() {
    if (!this.style) {
      this.style = document.createElement("style");
      this.style.type = "text/css";
      document.getElementsByTagName('head')[0].appendChild(this.style);
    }
    let s = document.styleSheets[document.styleSheets.length - 1];
    this.style.textContent = ".group { width: -moz-calc(100% / " + this.columns(this.groups) + " - 10px); height: -moz-calc(100% / " + this.rows(this.groups) + " - 10px); }";

    let groupEls = document.getElementsByClassName("group");
    let groupsInLastRow = groupEls.length % this.MAX_GROUPS_PER_ROW || this.MAX_GROUPS_PER_ROW;

    for (let i = 0; i < groupEls.length; i++) {
      let groupEl = groupEls[i];
      // this.resizePagesInGroup(groupEl);
      if (i >= groupEls.length - groupsInLastRow) {
        groupEl.style.width = "-moz-calc(100% / " + groupsInLastRow + " - 10px)";
      }
    }
  },

  /**
   * Resize pages in a group to fit the group
   * @param groupEl The DOM element of the group
   */
  resizePagesInGroup: function(groupEl) {
    let pageEls = groupEl.querySelectorAll(".items li");
    let columns = this.columns(pageEls.length);
    let rows = this.rows(pageEls.length, columns);
    for (let l = 0; l < pageEls.length; l++) {
      let pageEl = pageEls[l];
      pageEl.style.width = "-moz-calc(100% / " + columns + " - 12px)";
      pageEl.style.height = "-moz-calc(100% / " + rows + " - 12px)";
    }
  }
}

self.port.on('complete', function(numGroups) {
  Panorama.init(numGroups);
});