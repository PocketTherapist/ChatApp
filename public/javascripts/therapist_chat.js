var socket = io('/therapistChat').connect();
var activeForm;


//### ユーザーとのチャット ##################

//=== ボットとのチャット =============

$(document).ready(function(){

   startTherapistChat($('#name').val());

   socket.on("rooms",function(data){showRoomlists(data)});
   socket.on("message2T",function(data){showMessageU2T(data)});

   //現在いるユーザーを表示
   setInterval(function(){
      socket.emit('rooms');
   },1000);

});

function startTherapistChat(name){
   console.log("connect to TherapistChat Name:" + name);
   socket.emit('connect2TherapistNameSpace',{Name:name});
}

function showRoomlists(data){
   $('#room-list').empty();
/*
   for(key in Object.keys(data)){
      console.log(Object.keys(data));
      $('#room-list').append($('<li>')).text(key);
   }
*/
   for(var ir = 0; ir < Number(Object.keys(data).length); ir++){
      $('#room-list').append($('<li>')).text(ir);
      $('#room-list').append($('<li>')).text(Object.keys(data)[ir]);
      console.log(ir);
      console.log(Object.keys(data)[ir]);
   }

   $('#send-list div').click(function(){
      socket.on('join',{Room:$(this).text()});
      var addComment = $(this).text();
      $('#info').append($(addComment));
      $('#send-message').focus();
   });
}

function showMessage(data){
   console.log("addMessage:" + data.Message );
   $('#therapist_chatlogs').append($('<li>').text(data.Message));
}


function sendMessageT2U(){
   var message = $('#sendT2U-message').val();
   console.log('Therapist Chat MessageT2U:' + message);

   socket.emit('messageT2U',{Message:message});

   $('#therapist_chatlogs').append($('<li>').text(message));
   $('#therapist_chatlogs').scrollTop($('therapist_chatlogs').prop('scrollHeight'));

   $('#sendT2U-message').val('');
}

function showMessageU2T(data){
   console.log("showMessageU2T:" + data.Message);
   var message = data.Message;
   $('#therapist_chatlogs').append($('<li>').text(message));
   $('#therapist_chatlogs').scrollTop($('therapist_chatlogs').prop('scrollHeight'));
}
