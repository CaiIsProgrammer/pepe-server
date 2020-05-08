//import
const path = require("path");
const fs = require("fs").promises; // or if you're node 14 check the new syntax
const net = require("net");
const cluster = require("cluster");
const mongoose = require("mongoose");
require(path.join(__dirname, "resources/config.js"));
require("./packet");

const numCPUs = 0;
global.maps = {};

(async function main() {
  // load init
  const initPath = path.join(__dirname, "init");
  console.log(initPath);
  const initFiles = await fs.readdir(initPath);

  for (const name of initFiles) require(path.join(initPath, name));

  // load models
  const modelsPath = path.join(__dirname, "models");
  const modelFiles = await fs.readdir(modelsPath);
  for (const name of modelFiles) require(path.join(modelsPath, name));

  // load maps
  const mapsPath = config.data_paths.maps;
  const mapFiles = await fs.readdir(mapsPath);
  for (const name of mapFiles) {
    const map = require(path.join(mapsPath, name));
    global.maps.set(map.room, map);
  }
})().catch(console.error);
//CREATE CLUSTERS

mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => {
    console.log("Could not connect to MongoDB...");
    console.log(err);
  });

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i <= numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  //listen
  net
    .createServer(socket => {
      console.log("socket connected");
      const c_inst = new require("./client");
      const thisClient = new c_inst();

      thisClient.socket = socket;
      thisClient.init();
      socket.on("error", thisClient.error);
      socket.on("end", thisClient.end);
      socket.on("data", thisClient.data);
    })
    .listen(config.port);
}
//

//server logic
