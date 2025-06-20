const express=require("express");
const repoRouter=express.Router();
const repoController=require("../controllers/repoController.js");
repoRouter.post("/create",repoController.createRepository);
repoRouter.get("/all",repoController.getAllRepositories);
repoRouter.put("/update/:id",repoController.updateRepositoryById);
repoRouter.delete("/delete/:id",repoController.deleteRepositoryById);
repoRouter.patch("/toggle/:id",repoController.toggleVisibilityById);
repoRouter.get("/name/:name",repoController.fetchRepositoryByName);
repoRouter.get("/user/:userId",repoController.fetchRepositoriesForCurrentuser);
repoRouter.get("/:id",repoController.fetchRepositoryById);


module.exports=repoRouter;


