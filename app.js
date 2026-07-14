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
const { wrap } = require("module");
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


const validatelisting=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

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
app.get("/listings/new",wrapAsync( async (req,res)=>{
    res.render("listings/new.ejs");
})
);
 //Create Route
app.post("/listings",validatelisting,wrapAsync( async (req,res,next)=>{
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);


//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);


//update  Route
app.put("/listings/:id",validatelisting,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Enter the data")
    }
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id ,req.body.listing);
    res.redirect(`/listings/${id}`)
})
);

//Delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
);

//Show Route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page is invalid"));
});

app.use((err,req,res,next)=>{
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
})