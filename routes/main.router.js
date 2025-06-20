const express=require("express");
const mainRouter=express.Router();
const userRouter=require("./user.router.js");
const repoRouter=require("./repository.router.js");
const issueRouter=require("./issue.router.js");
mainRouter.use("/repo",repoRouter);
mainRouter.use(userRouter);

mainRouter.use(issueRouter);
mainRouter.get("/",(req,res)=>{
    console.log("Welcome Everybody");
})
module.exports=mainRouter;