const express = require("express");
const bphars = require("body-parser");

const app = express();

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.use(bphars.urlencoded({extended:false}));
app.use(bphars.json());



const welcome = require("./routes/Welcome");
const signup = require("./routes/Signup");
app.use("/welcome", welcome);
app.use("/signup", signup);

