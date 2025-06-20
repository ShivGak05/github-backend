const mongoose=require("mongoose");
const Repository=require("../models/RepoModel.js");
const User=require("../models/UserModel.js");
const Issue=require("../models/IssueModel.js");
//!--------------Create Repository-----------------------------------!//
const createRepository=async (req,res)=>{
    //console.log("Received payload:", req.body);

    const {name,description,content=[],visibility,owner}=req.body;
    try{
        if(!name){
            return res.status(400).json({message:"Repo name is required!"});
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
           return res.status(400).json({message:"Invalid user id!"})
        }
        const newRepo=new Repository({
              name,
              description,
              content,
              visibility,
              owner,
        })
        const result=await newRepo.save();
         return res.status(201).json({
            message:"New Repo created!",
            RepositoryId:result._id,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
//!------------------------------getAllRepos-----------------------!//
const getAllRepositories=async (req,res)=>{
    try{
        const repositories=await Repository.find({}).populate("owner").populate("issues");
        return res.json(repositories);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
//!----------------Fetch Repo By ID-----------------!//
const fetchRepositoryById=async (req,res)=>{
    const {id}=req.params;
    try{
        const repository=await Repository.findById(id).populate("owner").populate("issues");
        if(!repository){
            return res.status(400).json({messgae:"NO repository found!"});
        }
       // console.log("We are by id repo",repository);
        return res.json({repository});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
//!---------------Fetch Repo By Name----------------------!//
const fetchRepositoryByName=async (req,res)=>{
    const {name}=req.params;
    try{
       const repository=await Repository.find({name}).populate("owner").populate("issues");
       if(!repository){
        return res.status(400).json({message:"Repository not found"});
       }
      return res.json(repository);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server error"});
    }
}
//!-----------------FetchRepositoriesForCurrentuser-----------------------------!//
const fetchRepositoriesForCurrentuser=async (req,res)=>{
    const {userId}=req.params;
    console.log(userId);
    try{
    const repositories=await Repository.find({owner:userId});
    // if(!repositories || repositories.length==0){
    //     return res.status(400).json({error:"error finding repositories"});
    // }
    return res.json({message:"Repositories of the current user found!",repositories});
}catch(err){
    console.log(err);
    return res.status(500).json({message:"Internal Server error!"});
}
}
//!------------------update RepoBYId-----------------------!//
const updateRepositoryById=async (req,res)=>{
    const {id}=req.params;
    const {content,description}=req.body;
    console.log(content,description);
    try{
        const repository=await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found!"});
        }
        repository.content.push(...content);
        repository.description=description;
        const updatedRepository=await repository.save();
        return res.json({message:"Repo updated successfully!",repository:updatedRepository});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server error"});
    }
}
//!----------------toggleVisibility----------------------------!//
const toggleVisibilityById=async (req,res)=>{
    const {id}=req.params;
    try{
        const repository=await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"});
        }
        repository.visibility=!repository.visibility;
        const updatedRepository=await repository.save();
        return res.status(201).json({message:"Repository visibility toggled successfully",repository:updatedRepository});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
//!-------------------------delete Repository by id-----------------------------!//
const deleteRepositoryById=async (req,res)=>{
    const {id}=req.params;
    try{
        const repository=await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({message:"Repository requested for deletion not found"});
        }
       return res.json({message:"Repository Deleted Successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
module.exports={
    createRepository,
    updateRepositoryById,
    deleteRepositoryById,
    toggleVisibilityById,
    fetchRepositoriesForCurrentuser,
    fetchRepositoryById,
    fetchRepositoryByName,
    getAllRepositories,
}