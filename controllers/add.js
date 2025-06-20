const fs=require("fs").promises;
const path=require("path");
async function addRepo(filepath){
    const repoPath=path.resolve(process.cwd(),".ShivangiGit");
    const staging=path.join(repoPath,"Staging");
    try{
        await fs.mkdir(staging,{recursive:true});
        const tempfile=path.basename(filepath);
        await fs.copyFile(filepath,path.join(staging,tempfile));
        console.log(`file ${tempfile} added to staging area`);
    }catch(err){
        console.log(err);
    }
}
module.exports={addRepo};