const express = require("express");
const path = require("path");
const Chat = require("./models/chat");
const app = express();
const PORT = 8080;
const methodOverride=require("method-override");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const mongoose = require("mongoose");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main()
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.log(err));
app.get("/", (req, res) => {
    res.send("Root is working");
});
