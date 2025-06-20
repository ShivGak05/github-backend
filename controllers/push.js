const fs=require("fs").promises;
const path=require("path");
const {s3,S3_BUCKET}=require("../config/aws-config.js");
async function pushRepo(){
    const repoPath=path.resolve(process.cwd(),".ShivangiGit");
    const commitsPath=path.join(repoPath,"commits");
    try{
        const commitdirs=await fs.readdir(commitsPath);
        for(commitdir of commitdirs){
            const commitpath=path.join(commitsPath,commitdir);
            const files=await fs.readdir(commitpath);
            for(file of files){
                const filepath=path.join(commitpath,file);
                const filecontent=await fs.readFile(filepath);
                const params={
                    Bucket:S3_BUCKET,
                    Key:`commitspath/${commitdir}/${file}`,
                    Body:filecontent,
                };
                await s3.upload(params).promise();
            }
        }
        console.log("All commits pushed to S3");
    }catch(err){
        console.log(err);
    }
}
module.exports={pushRepo};