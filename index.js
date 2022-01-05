
const helmet = require("helmet");
const express = require("express");
const compression = require("compression");
const config = require("config");
const app = express();
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const users = require("./routes/users");
const auth = require("./routes/auth");
const my = require("./routes/my");
const expoPushTokens = require("./routes/expoPushTokens");



app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/api/categories", categories);
app.use("/api/listings", listings);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/my", my);
app.use("/api/expoPushTokens", expoPushTokens);

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
app.listen(port, function () {
	console.log(`Server started on port ${port}...`);
});

