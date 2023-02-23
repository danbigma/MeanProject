const app = require("./app");
const port = process.env.PORT || 4200;

app.listen(port, function() {
    console.log("Server has been started on " + port + " port");
})