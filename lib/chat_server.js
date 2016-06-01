var socketio = require('socket.io');
var io;
var guestNumber = 1;
var namesUsed = [];
var currentRoom = {};
var ReceptionBot = require('./ReceptionBot.js');

exports.listen = function(server){

   io = socketio.listen(server);

   //io.set('log level', 1);
   io.sockets.on('connection',function(socket){

      var botApp = new ReceptionBot(socket);
      var b_midstream = false;//途中の会話存在するか？DBに問い合わせる。
      //チャットに入ったときの処理
      socket.on("connected",function(data){
         //socket.join(data.Name);
         botApp.setParam(data.Name,data.Room);
         if(b_midstream){
            displayMidstream();
         }else{
            botApp.start();
         }
      });

      //ボタンを押した時の反応
      socket.on("answer",function(data){
         console.log("get answer");
         botApp.getAnswer(data.QuestionID, data.SelectedOption, data.NextID, data.Name);
         console.log("socket.on(answer) NextID:" + data.NextID);
      });

      socket.on("nextOfBackPainTypeQForm",function(data){
         do{
           botApp.NextAction();
         }while(botApp.nextTurn === "bot");
      });

      socket.on("nextOfBackPainType",function(data){
         do{
           botApp.NextAction();
         }while(botApp.nextTurn === "bot");
      });

      socket.on("nextOfTherapistChat",function(data){
         socket.leave(botApp.name);
         do{
           botApp.NextAction();
         }while(botApp.nextTurn === "bot");
      });

      socket.on("nextOfTherapistChatPayment",function(data){
         do{
           botApp.NextAction();
         }while(botApp.nextTurn === "bot");
      });

      socket.on("nextOfRecommendClinicForm",function(data){
         do{
           botApp.NextAction();
         }while(botApp.nextTurn === "bot");
      });

      socket.on("nextOfSelectClinic",function(data){
         console.log("shopname:" + data.shopname);
            if(data.shopname === undefined){
               botApp.NextAction(botApp.nextId[0]);
            }else{
               botApp.NextAction(botApp.nextId[1]);
            }
      });

      socket.on("backNextId",function(data){
         //console.log("Before:nextID:"+botApp.nextId +", lastID:" + botApp.lastId);
         botApp.nextId = botApp.lastId;
         //console.log("After:nextID:"+botApp.nextId +", lastID:" + botApp.lastId);
      });

      socket.on("nextOfBookingChat",function(data){
         do{
           botApp.NextAction();
         }while(botApp.nextTurn === "bot");
      });


      //ユーザーがあるチャットルームから出る時の処理
      socket.on("Reception_disconnect",function(data){
         if(ReceptionUserHash[socket.id]){
            var msg = ReceptionUserHash[socket.id] + "が退出しました。";
            delete ReceptionUserHash[socket.id];
         }else{
            //エラー処理
         }
      });// "Reception_disconnect"

      //専門家とのチャット
      socket.on('connected2T',function(){

      });

      //専門家に入室中のユーザールームのリストを提供
      socket.on('rooms',function(){
         socket.emit('rooms',io.sockets.manager.rooms);
      });
      //専門家をそのユーザールームに入室させる。
      socket.on('join',function(data){
         socket.join(data);
      });

      socket.on('messageU2T',function(data){
         socket.emit('message2T',{Message:data.Message});
         console.log("socket.on:messageU2T:"+ data.Message);
         console.log("socketID:"+socket.id);
      });
      socket.on('messageT2U',function(data){
         socket.emit('message2U',{Message:data.Message});
         console.log("socket.on:messageT2U:"+ data.Message);
         console.log("socketID:"+socket.id);         
      });




   });
}

function displayMidstream(){

}
