const fs=require("fs").promises;
const path=require("path");
const {v4:uuid}=require("uuid");
async function commitRepo(message){
    const repoPath=path.resolve(process.cwd(),".ShivangiGit");
    const staging=path.join(repoPath,"staging");
    const commitPath=path.join(repoPath,"commits");
    try{
       const commitId=uuid();
       const commitdir=path.join(commitPath,commitId);
       await fs.mkdir(commitdir,{recursive:true});
       const files=await fs.readdir(staging);
       console.log(files);
       for(file of files){
           await fs.copyFile(path.join(staging,file),path.join(commitdir,file));
       }
        await fs.writeFile(
            path.join(commitdir, "commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() }, null, 2)
        );
       console.log(`Commit ${commitId} created with message ${message}`);
    }catch(err){
        console.log(err);
    }
}
module.exports={commitRepo};