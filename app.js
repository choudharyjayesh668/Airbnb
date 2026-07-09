const express = require("express");
const path = require("path");
const Listing = require("./models/listing");
const app = express();
const PORT = 8080;
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs',ejsMate);
const mongoose = require("mongoose");
const { read } = require("fs");
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
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new Route
app.get("/listings/new", async (req,res)=>{
    res.render("listings/new.ejs");
});
 //Create Route
app.post("/listings/new", async (req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
});


//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


//update  Route
app.put("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id ,req.body.listing);
    res.redirect(`/listings/${id}`)
});

//Delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//Show Route
app.get("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});