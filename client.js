const now = require("performance-now");
const _ = require("underscore");

module.exports = function() {
  const client = this;
  //ovject will be added at runtime
  this.init = function() {
    //send connection handshake packet
    try {
      client.socket.write(packet.build(["HELLO", now().toString()]));
    } catch (e) {
      console.log(e);
    }
    console.log("client init");
  };
  //client methods
  this.enterRoom = function(selectedRoom) {
    try {
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
    } catch (e) {
      console.log(e);
    }
  };
  this.broadcastRoom = function(packetData) {
    try {
      global.maps.get(client.user.currentRoom).clients.map(otherClients => {
        if (otherClients.user.username != client.user.username) {
          otherClients.socket.write(packetData);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  this.broadcastEveryone = function(packetData) {
    try {
      global.maps.get(client.user.currentRoom).clients.map(otherClients => {
        otherClients.socket.write(packetData);
      });
    } catch (e) {
      console.log(e);
    }
  };
  //socket stuff
  this.error = function(err) {
    console.log("socket error" + err);
  };

  this.end = function() {
    try {
      client.user.save();
      client.broadcastRoom(packet.build(["DISCONNECT", client.user.username]));
      client.broadcastRoom(
        packet.build([
          "MSG",
          (client.user.username + " : disconnected").toString()
        ])
      );
      let mapToEdit = global.maps.get(client.user.currentRoom);
      console.log(mapToEdit);
      let filtered = mapToEdit.clients.filter(otherClients => {
        return otherClients.user.username !== client.user.username;
      });
      console.log(filtered);
      mapToEdit.clients = filtered;
      global.maps.set(client.user.currentRoom, mapToEdit);
      console.log(global.maps.get(client.user.currentRoom));
    } catch (e) {
      console.log(e);
    }

    console.log("socket closed");
  };
  this.data = function(data) {
    try {
      packet.parse(client, data);
    } catch (e) {
      console.log(e);
    }
  };
};
