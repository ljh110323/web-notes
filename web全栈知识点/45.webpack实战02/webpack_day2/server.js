// ! mock接口 mock数据

const express = require("express");

const app = express();

app.get("/api/info", (req, res) => {
  res.json({
    name: "webpack"
  });
});

app.listen("9092");
