var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){

   io = socketio.listen(server);

   io.sockets.on('connection',function(socket){
   /*----------------------------
   ---         Therapist      ---
   ----------------------------*/
      //Therapistルームへ入室した時の処理
      socket.on("Therapist_connected",function(data){
         socket.join(data.Room);
         TherapistUserHash[socket.id] = data.Name;
      });

      //あるチャットルームへ書き込む時の処理
      socket.on("Therapist_publish",function(data){
         var msg = '[' + data.name + ']' + data.msg;
         console.log(msg);
         socket.to(data.room).emit("Therapist_publish",{value:msg});
         socket.emit("Therapist_publish",{value:msg});
      });// socket.on("publish")

      //ユーザーがあるチャットルームから出る時の処理
      socket.on("Therapist_disconnect",function(data){
         if(TherapistUserHash[socket.id]){
            msg = TherapistUserHash[socket.id] + "が退出しました。";
            delete TherapistUserHash[socket.id];
            socket.to(data.room).emit("Therapist_publish", {value: msg});
         }else{
            console.error("[Error]Failed to Exit Therapist Room!!")
         }
      });
   });
/*
   //io.set('log level', 1);
   io.sockets.on('connection',function(socket){//各ユーザー接続の処理方法を定義
      //ユーザーの接続時にゲスト名を割り当てる
      guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed);

      //接続したユーザーをロビーに入れる。
      joinRoom(socket, 'Lobby');

      //ユーザーのメッセージ、名前変更とルーム作成/変更の要求を処理する
      handleMessageBroadcasting(socket,nickNames);
      handleNameChangeAttempts(socket, nickNames, namesUsed);
      handleRoomJoining(socket);

      //ユーザーの要求に応じて、使用されているルームのリストを提供
      socket.on('rooms',function(){
         socket.emit('rooms',io.of('/').adapter.rooms);
      });

      //ユーザーが接続を断った時のためにクリーンアップロジックを定義する。
      handleClientDisconnection(socket, nickNames, namesUsed);
   });
*/
};

/*
function assignGuestName(socket,guestNumber,nickNames,namesUsed){
   console.log("[Start]assignGuestName(chat_server.js)");
   var name = 'Guest' + guestNumber;
   nickNames[socket.id] = name;

   socket.emit('nameResult',{
      success: true,
      name: name
   });
   namesUsed.push(name);
   console.log("[Finish]assignGuestName(chat_server.js)");
   return guestNumber + 1;
}

function joinRoom(socket,room){
  console.log("[Start] joinRoom(chat_server.js)");
   socket.join(room);

   currentRoom[socket.id] = room;
   socket.emit('joinResult',{room: room});

   socket.broadcast.to(room).emit('message',{
      text: nickNames[socket.id] + 'has joined ' + room + '.'
   });

   var usersInRoom = io.of('/').in(room).clients;
   console.log("[Hoge] joinRoom(chat_server.js)");
   if(usersInRoom.length > 1){
      var usersInRoomSummary = 'Users currently in ' + room + ': ';
      for(var index in usersInRoom){
         var userSocketId = usersInRoom[index].id;
         if(userSocketId != socket.id){
            if(index > 0){
               usersInRoomSummary += ',';
            }
            usersInRoomSummary += nickNmes[userSocketId];
         }
      }
      usersInRoomSummary += '.';
      soket.emit('message',{text: usersInRoomSummary});
   }

   console.log("[Finish] joinRoom(chat_server.js)");
}
*/
