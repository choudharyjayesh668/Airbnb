const express = require("express");
const path = require("path");
const Listing = require("./models/listing");
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

//Routes
app.get("/", (req, res) => {
    res.send("Root is working");
});

//Index Route
app.get("/listing",async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//Create Route
app.get("/listing/new",async (req,res)=>{
    res.render("listings/new.ejs");
});
 //Create Route
app.post("/listing/new",async (req,res)=>{
    let{title,description,image,price,location,country}=req.body;
    // console.log(title,description,image,price,location,country);
    let newlisting=new Listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country
    });
    try{
        await newlisting.save();
        res.redirect("/listing")
    }catch(error){
        console.log(error);
        return res.status(500).send("Data was not saved");
    }
});
//Edit Route
app.get("/listing/:id/edit",async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//Edit Route
app.put("/listing/:id",async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id ,req.body.listing);
    res.redirect("/listing")
});

//Show Route
app.get("/listing/:id",async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});







//testing 
// app.get("/testing",async (req,res)=>{
//     let sample=new Listing({
//         title:"TESTING NEW DATA",
//         description:"JUST THA RANDOM DATA",
//         price:100,
//         location:"Banglore",
//         country:"India"
//     });
//     await sample.save();
//     console.log("SAVED TO DB");
//     res.send("SAVED IN DBBB")
// });