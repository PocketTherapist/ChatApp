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
         socket.join(data.Name);
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
         botApp.getAnswer(data.QuestionID, data.SelectedOption, data.NextID);
         console.log("socket.on(answer) NextID:" + data.NextID);
      });

      socket.on("nextOfBackPainTypeQForm",function(data){
          botApp.NextAction();
          botApp.NextAction();
      });

      socket.on("nextOfBackPainType",function(data){
         botApp.NextAction();
      });

      socket.on("nextOfTherapistChat",function(data){
         botApp.NextAction();
         botApp.NextAction();
      });

      socket.on("nextOfTherapistChatPayment",function(data){
         botApp.NextAction();
         botApp.NextAction();
      });

      socket.on("nextOfRecommendClinicForm",function(data){
         botApp.NextAction();
         botApp.NextAction();
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

   });
}

function displayMidstream(){

}
