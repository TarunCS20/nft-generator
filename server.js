const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const app = express();
const fs = require("fs");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const db = lowDb(new FileSync("./src/traffic.json"));

const width = 400;
const height = 400;

const canvas = createCanvas(width, height);
//const rect = canvas.getBoundingClientRect();
const context = canvas.getContext("2d", { quality: "best" });

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
const port = 8080;

const dirTree = require("directory-tree");
const tree = dirTree("src/EditingPage/layers");

app.get("/getFolderTree", (req, res) => {
  console.log(JSON.stringify(tree));
  res.send(JSON.stringify(tree));
});

app.get("/getTotalUsers", (req, res) => {
  const data = db.get("TotalUsers").value();
  return res.json(data);
});

app.get("/getTotalItems", (req, res) => {
  const data = db.get("TotalItems").value();
  return res.json(data);
});

app.post("/submitDetails", (request, response) => {
  var startDate = new Date();

  const data = request.body;

  console.log(JSON.stringify(data));

  const layerData = [];

  data &&
    data.objects.map((obj) => {
      layerData.push(obj);
    });

  var values = data.total.value;

  if (values > 10000) {
    return;
  }

  while (values) {
    var hash = 0;
    // eslint-disable-next-line no-loop-func
    tree.children.forEach(async (item, index) => {
      const idx = Math.floor(Math.random() * item.children.length);
      const obj = item.children[idx];

      const image = await loadImage(`./${obj.path}`);

      // const exact_x = layerData[index].x - rect.left;
      // const exact_y = layerData[index].y - rect.top;

      context.drawImage(
        image,
        JSON.parse(layerData[index].x),
        JSON.parse(layerData[index].y),
        JSON.parse(layerData[index].width),
        JSON.parse(layerData[index].height)
      );
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(__dirname + `/generated/${hash}.png`, buffer);

      if (tree.children.length === index + 1) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        hash += 1;
      }
    });
    hash += 1;
    values -= 1;
  }
  var endDate = new Date();
  var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  console.log("The total Time Taken was : ", seconds);
  const totalUsers = db.get("TotalUsers").value() + 1;
  const totalItems = db.get("TotalItems").value();

  db.set("TotalUsers", totalUsers).write();
  db.set("TotalItems", data.total.value + totalItems).write();

  console.log(db.get("TotalUsers").value(), db.get("TotalItems").value());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
