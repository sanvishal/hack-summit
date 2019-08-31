const abi = require("node-abi");
const fs = require("fs");
const path = require("path");

var data1 = fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8");
var obj = JSON.parse(data1);

let nodever = process.versions.node;
let electronver = obj.devDependencies.electron.substring(
  1,
  obj.devDependencies.electron.length
);

let nodeabi = abi.getAbi(nodever, "node");
let electronabi = abi.getAbi(electronver, "electron");

ioHookObj = obj.iohook;

if (ioHookObj) {
  obj.iohook.targets = ["node-" + nodeabi, "electron-" + electronabi];
  fs.writeFileSync(
    path.resolve(__dirname, "package.json"),
    JSON.stringify(obj),
    "utf8"
  );
} else {
  obj["iohook"] = {
    targets: ["node-" + nodeabi, "electron-" + electronabi],
    platforms: ["win32", "darwin", "linux"],
    arches: ["x64", "ia32"]
  };
  fs.writeFileSync(
    path.resolve(__dirname, "package.json"),
    JSON.stringify(obj),
    "utf8"
  );
}
