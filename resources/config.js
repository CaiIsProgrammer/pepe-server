//imported
const args = require("minimist")(process.argv.slice(2));
const extend = require("extend");

//store env
const enviroment = args.env || "test";
console.log(enviroment);

//common config
const common_conf = {
  name: "pepe club game server",
  version: "1.0.0",
  enviroment,
  max_player: 100,
  data_paths: {
    items: __dirname + "/gameData/" + "items/",
    maps: __dirname + "/gameData/" + "maps/"
  },
  starting_zone: "rm_map_home"
};

//env config
const conf = {
  production: {
    ip: args.ip || "0.0.0.0",
    port: args.port || 8081,
    database: "mongodb://127.0.0.1/pepe_prod"
  },
  test: {
    ip: args.ip || "0.0.0.0",
    port: args.port || 8082,
    database:
      "mongodb+srv://***:******0-xgpxc.mongodb.net/test?retryWrites=true&w=majority"
  }
};

extend(false, conf.production, common_conf);
extend(false, conf.test, common_conf);

module.exports = config = conf[enviroment];
