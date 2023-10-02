const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const positionRoutes = require("./routes/position");
const keys = require("./config/keys");

const helmet = require("helmet");

const app = express();

mongoose.set("strictQuery", false);

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected."))
  .catch((error) => console.log(error));

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Maded with love");
  next();
});
app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // это пакет Node.js, который обеспечивает связь между различными доменами.

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/order", orderRoutes);

module.exports = app;
