require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.POST || 3000;

app.use(express.static("/public"));
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const flash = require("connect-flash");
app.use(flash());

const sessions = require("express-session");
app.use(
  sessions({
    secret: "LogNote",
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
  })
);

app.use(function (req, res, next) {
  res.locals.userId = req.session.userId;
  res.locals.username = req.session.username;
  res.locals.role = req.session.role;
  next();
});

const routes = require("./routes");
app.use(routes);

app.listen(port, () => {
  console.log(`App is listening port ${port}`);
});
