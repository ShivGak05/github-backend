const fs=require("fs").promises;
const path=require("path");
const {S3,S3_BUCKET}=require("../config/aws-config.js");
const { mkdir } = require("fs");
async function pullRepo(){
     const repoPath=path.resolve(process.cwd(),".ShivangiGit");
     const commitspath=path.join(repoPath,"commits");
     try{
        const data=S3.listObjectsV2({Bucket:S3_BUCKET,prefix:"commits/"}).promise();
        const objects=data.Contents();
        for(const object of objects){
            const key=object.key;
            const commitDir=path.join(commitspath,path.dirname(key).split("/").pop());
            await mkdir(commitDir,{recursive:true});
            const params={
                Bucket:S3_BUCKET,
                Key:key,
            };
            const filecontent=await S3.getObject(params).promise();
            await fs.writeFile(path.join(repoPath,key),filecontent);
            console.log("All commits pulled from S3");
        }
     }catch(err){
        console.log(err);
     }
     console.log("All commits pulled from S3");
}
module.exports={pullRepo};