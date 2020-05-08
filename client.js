const now = require("performance-now");
const _ = require("underscore");

module.exports = function() {
  const client = this;
  //ovject will be added at runtime
  this.init = function() {
    //send connection handshake packet
    try {
      client.socket.write(packet.build(["HELLO", now().toString()]));
      client.socket.write(
        packet.build(["MSG", client.user.username + " : connected"])
      );
    } catch (e) {
      console.log(e);
    }
    console.log("client init");
  };
  //client methods
  this.enterRoom = function(selectedRoom) {
    global.maps.get(selectedRoom).clients.map(otherClient => {
      otherClient.socket.write(
        packet.build([
          "ENTER",
          client.user.username,
          client.user.pos_x,
          client.user.pos_y
        ])
      );
    });
    maps.get(selectedRoom).clients.push(client);
  };
  this.broadcastRoom = function(packetData) {
    global.maps.get(client.user.currentRoom).clients.map(otherClients => {
      if (otherClients.user.username != client.user.username) {
        otherClients.socket.write(packetData);
      }
    });
  };
  this.broadcastEveryone = function(packetData) {
    global.maps.get(client.user.currentRoom).clients.map(otherClients => {
      otherClients.socket.write(packetData);
    });
  };
  //socket stuff
  this.error = function(err) {
    console.log("socket error" + err);
  };
  this.end = function() {
    try {
      client.broadcastEveryone(
        packet.build(["DISCONNECT", client.user.username])
      );
    } catch (e) {
      console.log(e);
    }

    console.log("socket closed");
  };
  this.data = function(data) {
    console.log("socket data" + data.toString());
    packet.parse(client, data);
  };
};
