const net = require("net");
const { execSync } = require("child_process");

function checkPort(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(400);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function main() {
  const isRunning = await checkPort(27018, "127.0.0.1");
  if (isRunning) {
    console.log("[db] MongoDB is already running on port 27018.");
    return;
  }

  console.log("[db] Starting local MongoDB on port 27018...");
  try {
    execSync(
      "mongod --dbpath .data/db --port 27018 --bind_ip 127.0.0.1 --setParameter diagnosticDataCollectionEnabled=false --fork --logpath .data/mongod.log",
      { stdio: "inherit" }
    );
    console.log("[db] MongoDB started successfully.");
  } catch (err) {
    console.warn("[db] Note: MongoDB could not be started automatically (" + err.message + "). Application will use fallback data.");
  }
}

main().catch(() => {});
