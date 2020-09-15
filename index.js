const store = require("./store");
const express = require("express");
const morgan = require("morgan");
const { allowedNodeEnvironmentFlags } = require("process");
const { sort } = require("./store");

let apps = [...store];
const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("welcome home");
});

app.get("/apps", (req, res) => {
  let { sort, genres } = req.query;
  if (sort && sort !== "Rating" && sort !== "App") {
    return res
      .status(400)
      .json({ message: "Sort must be either rating or app" });
  } else if (sort) {
    apps = apps.sort((a, b) => {
      if (a[sort] < b[sort]) {
        return -1;
      } else if (a[sort] > b[sort]) {
        return 1;
      } else return 0;
    });
  }
  let allowedGenres = [
    "Action",
    "Puzzle",
    "Strategy",
    "Casual",
    "Arcade",
    "Card",
  ];
  if (genres && !allowedGenres.includes(genres)) {
    return res.status(400).json({ message: "Genre must be something else" });
  } else if (genres) {
    apps = apps.filter((app) => {
      return app.Genres.includes(genres);
    });
  }

  res.json(apps);
});
app.listen(8080, () => {
  console.log("Express server is listening on port 8080");
});
