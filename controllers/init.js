const fs=require("fs").promises;
const path=require("path");
async function initRepo() {
    const repoPath=path.resolve(process.cwd(),".ShivangiGit");
    const commitPath=path.join(repoPath,"commits");
    try{
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitPath,{recursive:true});
        await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({bucket:"hi all!"}));
        console.log("New Git Repositiory initialized");
    }catch(err){
        console.log(err);
    }
}
module.exports={initRepo};