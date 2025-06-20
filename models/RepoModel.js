const mongoose=require("mongoose");
const { string } = require("yargs");
const {Schema}=mongoose;
const RepoSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    description:{
        type:String,
    },
    content:[
        {
           type:String,
        },
    ],
    visibility:{
        type:Boolean,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    issues:[
        {
            default:[],
            type:Schema.Types.ObjectId,
            ref:"Issue",
        },
    ],
});
const Repository=mongoose.model("Repository",RepoSchema);
module.exports=Repository;