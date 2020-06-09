const { Parser } = require("binary-parser");
const stringOptions = { length: 99, zeroTerminated: true };

module.exports = PacketModels = {
  header: new Parser().skip(1).string("command", stringOptions),
  auth: new Parser()
    .skip(1)
    .string("command", stringOptions)
    .string("username", stringOptions)
    .string("password", stringOptions),
  pos: new Parser()
    .skip(1)
    .string("command", stringOptions)
    .int32le("x", stringOptions)
    .int32le("y", stringOptions),
  msg: new Parser()
    .skip(1)
    .string("command", stringOptions)
    .string("message", stringOptions),
  alive: new Parser()
    .skip(1)
    .string("command", stringOptions)
    .string("message", stringOptions),
  updatetag: new Parser()
    .skip(1)
    .string("command", stringOptions)
    .string("username", stringOptions),
  gettag: new Parser().skip(1).string("command", stringOptions)
};
