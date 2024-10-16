const express = require("express");
const { body, query, validationResult } = require("express-validator");
const crypto = require("crypto");
const session = require("express-session");
const nocache = require("nocache");
const pug = require("pug");
const app = express();
const port = 3000;

const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(nocache());
app.set("trust proxy", 1);
app.use(
  session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
    saveUninitialized: true,
  }),
);

app.use((req, res, next) => {
  if (req.session.films === undefined) {
    req.session.films = [];
    req.session.count = 0;
  }
  next();
});

app.get("/", (req, res) => {
  const compiled = pug.compileFile(path.join(__dirname, "public", "index.pug"));
  res.send(
    compiled({
      films: req.session.films,
    }),
  );
});

app.get("/add", (req, res) => {
  const compiled = pug.compileFile(path.join(__dirname, "public", "add.pug"));
  res.send(compiled());
});

app.post(
  "/add",
  body("title").isString().isLength({ min: 1, max: 255 }),
  body("description").isString().isLength({ min: 1, max: 255 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Bad Request");
    }

    const title = req.body.title;
    const description = req.body.description;

    req.session.films.push({
      id: req.session.count,
      title: title,
      description: description,
    });
    req.session.count += 1;
    res.sendStatus(200);
  },
);

app.get(
  "/search",
  query("filter").isString().isLength({ min: 1, max: 255 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Bad Request");
    }

    let films = req.session.films;
    let filter = req.query.filter;
    let filtered = films.filter((x) => {
      return x.title.includes(filter) || x.description.includes(filter);
    });
    const compiled = pug.compileFile(
      path.join(__dirname, "public", "search.pug"),
    );
    res.send(
      compiled({
        query: filter,
        result: filtered,
      }),
    );
  },
);

app.get("/film", query("id").isInt(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send("Bad Request");
  }

  let result = req.session.films.filter((x) => x.id == req.query.id);
  if (result.length == 0) {
    res.sendStatus(404);
  }

  let film = result[0];
  const compiled = pug.compileFile(
    path.join(__dirname, "public", "details.pug"),
  );
  res.send(
    compiled({
      film: film,
    }),
  );
});

app.listen(port, () => {
  console.log("App started");
});
