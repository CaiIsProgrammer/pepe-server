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
        return true;
      });
      return maps.get(selectedRoom).clients.push(client);
    } catch (e) {
      return e;
      console.log(e);
    }
  };
  this.broadcastRoom = function(packetData) {
    try {
      return global.maps
        .get(client.user.currentRoom)
        .clients.map(otherClients => {
          if (otherClients.user.username != client.user.username) {
            otherClients.socket.write(packetData);
          }
          return true;
        });
    } catch (e) {
      return e;
      console.log(e);
    }
  };
  this.getTagged = function() {
    try {
      return global.maps.get(client.user.currentRoom).clients.find(Clients => {
        if (Clients.playingTag === "TRUE") {
          if (Clients.tagBoss) {
            return Clients.user.username;
          }
        }
        return true;
      });
    } catch (e) {
      return e;
      console.log(e);
    }
  };
  this.setTagged = function(username) {
    try {
      return global.maps.get(client.user.currentRoom).clients.map(Clients => {
        if (Clients.playingTag === "TRUE") {
          if (Clients.user.username === username) {
            Clients.tagBoss = true;
            console.log(Clients.user);
            return Clients.user.username;
          } else {
            Clients.tagBoss = false;
          }
        }
        return true;
      });
    } catch (e) {
      return e;
      console.log(e);
    }
  };
  this.broadcastEveryone = function(packetData) {
    try {
      return global.maps
        .get(client.user.currentRoom)
        .clients.map(otherClients => {
          otherClients.socket.write(packetData);
          return true;
        });
    } catch (e) {
      return e;
      console.log(e);
    }
  };
  this.endTag = function() {
    try {
      return global.maps.get(client.user.currentRoom).clients.map(clients => {
        clients.playingTag = "FALSE";
        clients.tagBoss = false;
        return true;
      });
    } catch (e) {
      return e;
      console.log();
    }
  };
  //socket stuff
  this.error = function(err) {
    console.log("socket error" + err);
  };

  this.end = async function() {
    try {
      await client.user.save();
      client.endTag();
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
