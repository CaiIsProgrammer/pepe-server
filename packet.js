const zeroBuffer = new Buffer.from("00", "hex");
const { checkCollision } = require("./resources/gameData/gameScripts/tag.js");
module.exports = packet = {
  //write a packet to be sent to a client
  build: function(params) {
    const packetParts = [];
    let packetSize = 0;
    params.map(param => {
      let buffer;
      if (typeof param === "string") {
        //do this..
        buffer = new Buffer.from(param, "utf8");
        buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
      } else if (typeof param === "number") {
        //do this..
        buffer = new Buffer.alloc(2);
        buffer.writeUInt16LE(param, 0);
      } else {
        console.log("warning: unkown data type in packet builder");
      }
      packetSize += buffer.length;
      packetParts.push(buffer);
    });
    const dataBuffer = Buffer.concat(packetParts, packetSize);

    // SIZE -> DATA
    let size = new Buffer.alloc(1);
    size.writeUInt8(dataBuffer.length + 1, 0);

    const finalPacket = Buffer.concat(
      [size, dataBuffer],
      size.length + dataBuffer.length
    );
    return finalPacket;
  },
  //parse a packet to be handled for a client
  parse: function(c, data) {
    let idx = 0;
    while (idx < data.length) {
      const packetSize = data.readUInt8(idx);
      const extractedPacket = new Buffer.alloc(packetSize);
      data.copy(extractedPacket, 0, idx, idx + packetSize);
      this.interpret(c, extractedPacket);
      idx += packetSize;
    }
  },
  interpret: async function(c, dataPacket) {
    const header = PacketModels.header.parse(dataPacket);
    //console.log("interpret: " + header.command);
    let data;
    switch (header.command.toUpperCase()) {
      case "LOGIN":
        // do something;
        data = PacketModels.auth.parse(dataPacket);
        User.login(data.username, data.password, (res, user) => {
          if (res) {
            c.user = user;
            c.enterRoom(c.user.currentRoom);
            c.socket.write(
              packet.build([
                "LOGIN",
                "TRUE",
                c.user.currentRoom,
                c.user.pos_x,
                c.user.pos_y,
                c.user.username
              ])
            );
            let connectionString = "ANON : connected";
            if (c.user) {
              connectionString = `${c.user.username} : connected`;
            }
            c.broadcastRoom(packet.build(["MSG", connectionString]));
          } else {
            c.socket.write(packet.build(["LOGIN", "FALSE"]));
          }
        });

        break;
      case "REGISTER":
        data = PacketModels.auth.parse(dataPacket);
        User.register(data.username, data.password, res => {
          if (res) {
            c.socket.write(packet.build(["REGISTER", "TRUE"]));
          } else {
            c.socket.write(packet.build(["REGISTER", "FALSE"]));
          }
        });
        break;
      case "POS":
        data = PacketModels.pos.parse(dataPacket);
        c.user.pos_x = data.x;
        c.user.pos_y = data.y;
        let tagboss = await c.getTagged();
        if (c.tagBoss) {
          if (c.tagImmune) {
            let collisionData = await checkCollision(c);
            if (collisionData.length) {
              console.log("TAGGED PLAYER", collisionData);
              await c.setTagged(collisionData);
              await c.setTaggedImmune(collisionData);
              await c.setTaggedImmune(c.user.username);
              c.broadcastEveryone(
                packet.build(["TAGGED", collisionData, c.user.username])
              );
            }
          }
        }
        c.broadcastRoom(packet.build(["POS", c.user.username, data.x, data.y]));
        break;

      case "MSG":
        data = PacketModels.msg.parse(dataPacket);
        console.log("MSG", data);
        c.broadcastEveryone(packet.build(["MSG", data.message]));
        break;

      case "ALIVE":
        console.log("alive test");
        data = PacketModels.msg.parse(dataPacket);
        c.socket.write(packet.build(["ALIVE", "TRUE"]));
        break;

      case "GETTAG":
        c.playingTag = "TRUE";
        let username = await c.getTagged();
        if (!username) {
          username = c.user.username;
          c.tagBoss = true;
        } else if (username.user) {
          username = username.user.username;
        }
        c.broadcastEveryone(packet.build(["TAGGED", username, "GETTAGGED"]));
        break;

      case "TAGIMMUNE":
        await c.setTaggedImmune(c.user.username);
        c.broadcastRoom(packet.build(["TAGIMMUNE", c.user.username]));
        break;
    }
  }
};
