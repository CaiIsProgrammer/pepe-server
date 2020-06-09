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
  this.getTagged = function() {
    try {
      return global.maps.get(client.user.currentRoom).clients.find(Clients => {
        console.log(Clients);
        if (Clients.playingTag === "TRUE") {
          if (Clients.tagBoss) {
            return Clients.user.username;
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  this.setTagged = function(username) {
    try {
      return global.maps.get(client.user.currentRoom).clients.map(Clients => {
        console.log(Clients);
        if (Clients.playingTag === "TRUE") {
          if (Clients.user.username === username) {
            Clients.tagBoss = true;
            return Clients.user.username;
          } else {
            Clients.tagBoss = false;
          }
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

  this.end = async function() {
    try {
      await client.user.save();
      client.broadcastEveryone(
        packet.build(["DISCONNECT", client.user.username])
      );
      client.broadcastEveryone(
        packet.build([
          "MSG",
          (client.user.username + " : disconnected").toString()
        ])
      );
      let mapToEdit = await global.maps.get(client.user.currentRoom);
      console.log(mapToEdit);
      let filtered = await mapToEdit.clients.filter(otherClients => {
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
