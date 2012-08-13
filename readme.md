# Panorama
This is an experimental prototype for a new user interface for [Firefox Panorama](http://support.mozilla.org/en-US/kb/tab-groups-organize-tabs) in the form of a Firefox add-on. Code is based on [cleercode/mozaic](https://github.com/cleercode/mozaic).

## Usage
Note that for this add-on to populate with tab groups, tab group data needs to be initialized by opening the current implementation of Panorama first.

## Compatibility
This add-on uses the `PageThumbsStorage` API available only in Firefox 16+. In my brief testing, I wasn't able to get it to work in 17. Seems to work only in 16 at this point.