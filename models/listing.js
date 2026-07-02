const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        default:
            "https://unsplash.com/photos/warm-light-glowing-behind-silhouetted-leaves-in-darkness-caeHJR-c0Do",
            set:(value)=>
                value===""
            ?
            "https://unsplash.com/photos/warm-light-glowing-behind-silhouetted-leaves-in-darkness-caeHJR-c0Do"
            :
            value,
    },
    price:{
        type:Number,
        require:true,
    },
    location:{
        type:String,
        require:true,
    },
    country:{
        type:String,
        require:true,
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;