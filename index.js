
const server = require("http").Server();
const port = process.env.PORT || 10000;

var io = require("socket.io")(server);

var usernames = [];

var msgs = [];

var allRooms= {};

var allStickers = {};

io.on("connection", function(socket){
    console.log("user is connected");
    
    socket.on("username", function(data){
        console.log("user is giving username:"+data);
        usernames.push(data);
        
        io.emit("usersjoined", usernames);

    })
	//BACKGROUND APP
    socket.on('change color', (color) => {
        console.log('Color Changed to: ', color)
        io.sockets.emit('change color', color)
  })
     socket.on('disconnect', () => {
    console.log('user disconnected')
  })
    
    //CHATROOM
    socket.on("sendChat", function(data){
        console.log("user sent a msg for chat");
        msgs.push(data);
        
        io.emit('msgsent', msgs); 
    });
    
    socket.on("disconnect", function(){
        console.log("user is disconnected");
    })
    
	//STICKER PAGE
	socket.on("joinroom", function(data){
		socket.emit("yourid", socket.id);
		socket.join(data);
		socket.myRoom = data;
		
		if(!allRooms[data]){
			allRooms[data]=[];
			allStickers[data] = [];
		}
		
		allRooms[data].push(socket.id);
		io.to(data).emit("createimage", allRooms[data]);
		
		console.log(data);	
	});

	
socket.on("mymove", function(data){
		socket.to(this.myRoom).emit("usermove", data);
	});
	
	
	socket.on("sticker", function(data){
		allStickers[this.myRoom].push(data);
		io.to(this.myRoom).emit("newsticker", allStickers[this.myRoom]);
	});
	
	
	socket.on("disconnect", function(){
	
	});
	


//QUIZ PAGE

socket.on("joinroom2", function(data){
	socket.join(data);
	socket.myRoom = data;
	
	if(!allRooms[data]){
		allRooms[data] = {
			users:[],
			q:{}
	};
	}
	console.log(data,"Join Room")
});

socket.on("qsubmit", function(data){
	console.log(data);
	allRooms[socket.myRoom].q = data;
	socket.to(socket.myRoom).emit("newq", data);
	
});

socket.on("answer", function(data){
	var msg = "Wrong!"
	
	if(allRooms[socket.myRoom].q.a == data){
		msg = "You're Right! ";
	}
	socket.emit("result", msg)
});	
	
socket.on("disconnect", function(){
	
});

});

server.listen(port, (err)=>{
    if(err){
        console.log("Error "+err);
        return false;
    }
    
    console.log("sockets port running");
})
