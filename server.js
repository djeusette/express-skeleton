var Assembler = require("./infrastructure/assembler");
var App       = require("./app/app");
var path      = require("path");

var configurationPath = path.resolve(__dirname, "config", "configuration.js");

var assembler = new Assembler(App, configurationPath);

assembler.assembleApp(function(err) {
  if (err) throw(err);
  assembler.logger.info("Application assembled");
  assembler.app.start(function() {
    assembler.logger.info("Application started in " + assembler.env + " mode (listening on port " + assembler.app.port + ")");
  });
});
