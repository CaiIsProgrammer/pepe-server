const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  sprite: {
    type: String
  },
  currentRoom: {
    type: String
  },
  pos_x: {
    type: Number
  },
  pos_y: {
    type: Number
  }
});
UserSchema.statics.register = async (username, password, cb) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  let new_user = new User({
    username: username,
    password: hash,
    sprite: "obj_player",
    currentRoom: global.maps.get(config.starting_zone).room,
    pos_x: global.maps.get(config.starting_zone).start_x,
    pos_y: global.maps.get(config.starting_zone).start_y
  });
  let savedUser = await new_user.save();
  if (savedUser) {
    cb(true);
  } else {
    cb(false);
  }
};

UserSchema.statics.login = async (username, password, cb) => {
  const get_user = await User.findOne({ username });
  if (get_user && bcrypt.compareSync(password, get_user.password)) {
    cb(true, get_user);
  } else {
    cb(false, get_user);
  }
};

module.exports = User = mongoose.model("User", UserSchema);
