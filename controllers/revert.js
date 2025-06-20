const fs=require("fs");
const path=require("path");
const {promisify}=require("util");
const readdir=promisify(fs.readdir);
const copyFile=promisify(fs.copyFile);
async function revertRepo(commitId){
  
      const repoPath=path.resolve(process.cwd(),".ShivangiGit");
      const commitsPath=path.join(repoPath,"commits");
      try{
         const commitsDir=path.join(commitsPath,commitId);
         const files=await readdir(commitsDir);
         const parentDir=path.resolve(repoPath,".."); 
         for(const file of files){
            await copyFile(path.join(commitsDir,file),path.join(parentDir,file));
         }
         console.log(`commit ${commitId} reverted`);
      }catch(err){
        console.log(err);
      }
}
module.exports={revertRepo};