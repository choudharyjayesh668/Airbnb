const express = require("express");
const path = require("path");
const Listing = require("./models/listing");
const app = express();
const PORT = 8080;
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError");

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
app.get("/listing",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//Create Route
app.get("/listing/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));
 //Create Route
app.post("/listing/new", wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data For Listing");
    }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing")
}));
//Edit Route
app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update  Route
app.put("/listing/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data For Listing");
    }
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id ,req.body.listing);
    res.redirect("/listing")
}));


//Delete route
app.delete("/listing/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));


//Show Route
app.get("/listing/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));
app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let { status = 500, message = "Something went wrong" } = err;
    res.render("error.ejs",{message});
});

