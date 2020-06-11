const checkCollision = client => {
  let clients = global.maps.get(client.user.currentRoom).clients;
  let rect1 = {
    x: client.user.pos_x,
    y: client.user.pos_y,
    width: 16,
    height: 16
  };

  for (let i = 0, l = clients.length; i < l; i++) {
    if (clients[i].user.username !== client.user.username) {
      if (clients[i].playingTag === "TRUE") {
        if (!clients[i].tagImmune) {
          let rect2 = {
            x: clients[i].pos_x,
            y: clients[i].pos_y,
            width: 16,
            height: 16
          };
          if (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
          ) {
            return clients[i].user.username;
          }
        }
      }
    }
  }
  return false;
};

exports.checkCollision = checkCollision;
