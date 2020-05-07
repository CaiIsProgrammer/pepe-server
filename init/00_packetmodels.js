const { Parser } = require("binary-parser");
const stringOptions = { length: 99, zeroTerminated: true };

module.exports = PacketModels = {
  header: new Parser().skip(1).string("command", stringOptions),
  auth: new Parser()
    .skip(1)
    .string("command", stringOptions)
    .string("username", stringOptions)
    .string("password", stringOptions)
};
