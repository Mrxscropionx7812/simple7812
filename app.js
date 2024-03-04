const express = require("express");
const bphars = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
const port = 30012;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Hello");
});


app.use(bphars.urlencoded({ extended: false }));
app.use(bphars.json());



const welcome = require("./routes/Welcome");
const home = require("./routes/Home");
app.use("/welcome", welcome);
app.use("/home", home);
