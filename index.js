const app = require("./app");
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Server has been started on " + port + " port");
})