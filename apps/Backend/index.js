const express = require("express");
const port = 3000;
const port1 = 3001;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db");
require("./models/User");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authRoutes);

app.listen(port, () => {
  console.log("Server is running on post " + port);
});
