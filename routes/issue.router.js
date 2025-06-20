const express=require("express");
const issueRouter=express.Router();
const issueController=require("../controllers/issueController.js");
issueRouter.post("/issue/create/:id",issueController.createissue);
issueRouter.get("/issue/repo/:id",issueController.getallissues);
issueRouter.put("/issue/update/:id",issueController.updateissuebyid);
issueRouter.delete("/issue/delete/:id",issueController.deleteissuebyid);
issueRouter.get("/issue/:id",issueController.getissuebyid);
module.exports=issueRouter;