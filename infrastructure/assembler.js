var Logger        = require("devnull");
var Configuration = require("./configuration");

function Assembler(App, configurationPath) {
  if (!App)
    throw new Error("Missing app constructor");
  if (!configurationPath)
    throw new Error("Missing configuration file path");

  this.App               = App;
  this.configurationPath = configurationPath;
  this.logger            = new Logger();
  this.env               = process.env.NODE_ENV || "development";
};

Assembler.prototype.loadConfiguration = function () {
  this.configuration = new Configuration(this.configurationPath, this.env);
};

Assembler.prototype.assembleApp = function (callback) {
  if (this.app)
    return callback(new Error("An app was assembled already."));

  this.loadConfiguration();

  var appOptions = {
    logger    : this.logger,
    assembler : this,
    env       : this.env
  };

  if (this.configuration.app) {
    for (var key in this.configuration.app) {
      appOptions[key] = this.configuration.app[key];
    }
  }

  this.app = new this.App(appOptions);
  callback();
}

module.exports = Assembler;
