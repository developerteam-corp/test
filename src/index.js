import http from "http";
import express from "express";
import bodyParser from "body-parser";
import glob from "glob";
import path from "path";
import cors from "cors";
import environment from "./environment";
import db from "./models";

const app = express();
app.server = http.createServer(app);

app.use(
  bodyParser.json({
    limit: environment.config.bodyLimit
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors());
app.use(
  cors({
    exposedHeaders: ["Link"]
  })
);
app.use("*", (req, res, next) => {
  if (req.method == "OPTIONS") {
    res.json();
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  db.financeEvents
    .find({})
    .sort({ createdAt: -1 })
    .then(response => {
      res.json(response);
    });
});

const initRoutes = app => {
  // including all routes
  glob(
    "./routes/*.js",
    {
      cwd: path.resolve("./src")
    },
    (err, routes) => {
      if (err) {
        return;
      }
      routes.forEach(routePath => {
        require(routePath).default(app); // eslint-disable-line
      });
    }
  );
};

initRoutes(app);

app.server.listen(process.env.PORT || 8000, function() {
  console.log("Started on port " + (process.env.PORT || 8000));
});

export default app;
