const yargs=require("yargs");
const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const http=require("http");
const {Server}=require("socket.io");
const {hideBin}=require("yargs/helpers");
const {initRepo}=require("./controllers/init.js");
const {addRepo}=require("./controllers/add.js");
const {pullRepo}=require("./controllers/pull.js");
const {pushRepo}=require("./controllers/push.js");
const {commitRepo}=require("./controllers/commit.js");
const {revertRepo}=require("./controllers/revert.js");
const mainRouter=require("./routes/main.router.js");
dotenv.config();
yargs(hideBin(process.argv))
.command("start","Start a new server",{},StartServer)
.command("init","Initialize a new Git Repository",{},initRepo)
.command("add <file>","Add a file to the Staging Area",(yargs)=>{
    yargs.positional("file",{
        describe:"Add a file to staging area",
        type:"string",
    });
},
(argv)=>{
    addRepo(argv.file);
}
)
.command("commit <message>","Commit changes to the Repository",(yargs)=>{
    yargs.positional("message",{
        describe:"Add a commit message",
        type:"string",
    });
},(argv)=>{
    commitRepo(argv.message);
})
.command("push","New update pushed to repo",{},pushRepo)
.command("pull","Upadated pulled from repo",{},pullRepo)
.command("revert <commitId>","Add a commitId to revert back to",(yargs)=>{
    yargs.positional("commitId",{
        descrite:"Add a commit id",
        type:"string",
    });
},(argv)=>{
    revertRepo(argv.commitId);
})
.demandCommand(1,"You need to add atleast one command to initiale Repository").help().argv;
function StartServer(){
    const app=express();
    const port=process.env.PORT || 3000;
    app.use(bodyParser.json());
    app.use(express.json());
    const MongoURL=process.env.MONGO_URL;
    console.log(MongoURL);
    mongoose.connect(MongoURL).then(()=>console.log("MongoDB connected")).catch((err)=>console.log(err));
   app.use(cors({
    origin: "https://main.d8o2b9f0dihlu.amplifyapp.com", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options('*', cors());
    app.use("/",mainRouter);
    const httpServer=http.createServer(app);
   const io = new Server(httpServer, {
    cors: {
        origin: "https://main.d8o2b9f0dihlu.amplifyapp.com",
        methods: ["GET", "POST"],
        credentials: true
    }
});
    io.on("connection",(socket)=>{
        socket.on("joinRoom",(userId)=>{
            user=userId;
            socket.join(userId);
        })
    })
    const db=mongoose.connection;
    db.once("open",async()=>{
        //CRUD operations
    })
    httpServer.listen(port,()=>{
        console.log("Server is listening to port 3000");
    })
}