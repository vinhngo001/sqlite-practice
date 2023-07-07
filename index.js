const express = require("express");

const { connectDB } = require("./db");
const webRouter = require("./routes");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();
webRouter(app);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});