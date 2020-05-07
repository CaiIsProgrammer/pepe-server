const now = require("performance-now");
const _ = require("underscore");

module.exports = function() {
  const client = this;
  //ovject will be added at runtime
  //this.socket = {}
  //this.user = {}

  this.init = function() {
    //send connection handshake packet
    client.socket.write(packet.build(["HELLO", now().toString()]));
    console.log("client init");
  };
  this.error = function(err) {
    console.log("socket error" + err);
  };
  this.end = function() {
    console.log("socket closed");
  };
  this.data = function(data) {
    console.log("socket data" + data.toString());
    packet.parse(client, data);
  };
};
