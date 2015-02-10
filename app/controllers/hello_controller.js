var Controller = require("../../infrastructure/controller");
var inherits   = require("util").inherits;

inherits(HelloController, Controller);

function HelloController(options) {
  Controller.call(this, options);

  var self = this;

  this.get("hello", function(req, res) {
    self.hello(req, res);
  });
}

HelloController.prototype.hello = function(req, res) {
  res.json({msg: "Hello"});
}

module.exports = HelloController;
