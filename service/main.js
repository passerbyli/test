const express = require("express");
const app = express();

app.get("/version", (req, res) => {
  res.send({
    latest_version: "1.2",
    update_url: "https://example.com/update",
  });
});

app.listen(8080, () => {
  console.log("http://127.0.0.1:8080");
});
