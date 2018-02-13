const server = require("http").Server();
const port = process.ENV.PORT || 10001;

var io = require("socket.io")(server);

var usernames = [];
var msgs = [];

io.on("connection", function(socket){
    console.log("user is connected");
    
    socket.on("username", function(data){
        console.log("user is giving username:"+data);
        usernames.push(data);
        
       io.emit("usersjoined", usernames); 
    })
    
    socket.on("sendChat", function(data){
        console.log("user sent a msg for chat");
        msgs.push(data);
        
        io.emit("msgsent", msgs);
    })
    
    
    socket.on("disconnect", function(){
        console.log("user has disconnected");
        
    })
    
    
    
    
});

server.listen(port, (err)=>{
    if(err){
        console.log("Error: " +err);
        return false;
        
    }
    console.log("Socket port is running");
    
});