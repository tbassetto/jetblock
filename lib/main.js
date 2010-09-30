var pageMod = require("page-mod");
var self = require("self");

pageMod.add(new pageMod.PageMod({
  include: "*",
  contentScriptWhen: 'start',
  contentScriptURL: self.data.url("jetblock.js")
}));