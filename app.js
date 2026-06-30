const express = require("express");
const app = express();

const mongoose = require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/airbnb"
main().then(()=>{
    console.log("Data Base Connected")
}).catch((error)=>{
    console.log("Error in Data Base")
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
console.log("App started");

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(8080, () => {
    console.log("Server is Listening on port 8080");
});