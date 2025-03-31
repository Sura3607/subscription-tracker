import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Subscription name is required"],
        trim: true,
        minLength :2,
        maxLength :100,
    },
    price:{
        type : Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price must be greater than 0"],
    },
    currency:{
        type: String,
        enum: ["USD", "EUR", "GBP", "VND"],
        default : "USD",
    },
    frequency:{
        type: String,
        enum: ["daily", "weekly", "monthly","yearly"],
    },
    category:{
        type: String,
        enum:["sports", "news", "entertainment", "lifestyle", "technology", "finance", "politics", "other"],
        required: true,
    },
    paymentMethod:{
        type: String,
        required:true,
        trim: true,
    },
    status:{
        type:String,
        enum:["active", "cancelled", "expired"],
        default: "active",
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator :(value) => value <= new Date(),
            message: "Start date must be in the past",
        }
    },
    renawalDate:{
        type:Date,
        required:true,
        validate:{
            validator : function (value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after the start day",
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
        index:true,

    }
    
},{timestamps: true});

subscriptionSchema.pre("save", function(next){
    if(!this.renawalDate){
        const renawalPeriods = {
            daily : 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renawalDate = new Date(this.startDate);
        this.renawalDate.setDate(this.renawalDate.getDate() + renawalPeriods[this.frequency])
    }
    if (this.renawalDate < this.startDate){
        this.status = "expired"
    }
    next()
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;