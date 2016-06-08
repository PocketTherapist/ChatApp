var socketR = io('/receptionChat').connect();
var socketT = io('/therapistChat').connect();
var socketB = io('/bookingChat').connect();
var activeForm;


//### 受付フォーム ##################

//=== ボットとのチャット =============

$(document).ready(function(){

   startChat($('#room').val(),$('#name').val());
   socketR.on("showMessage",function(data){addMessage(data)});
   socketR.on("showOption",function(data){showOptionButton(data)});
   socketR.on("showBackPainTypeOfUser",function(data){showBackPainTypeButton(data)});
   socketR.on("activateForm",function(data){showFormButton(data)});
   socketR.on("showClinicForUser",function(data){showClinicButton(data)});
   socketR.on("removeNowComment",function(data){removeNowComment(data)});

   //専門家との会話
   socketT.on("message2U",function(data){showMessageT2U(data)});


});

function addMessageFromT(data){
   console.log("addMessage:" + data.Message );
   $('#reception_chatlogs').append($('<li>').text(data.Message));
}

function sendMessageU2T(){
   var message = $('#sendU2T-message').val();
   console.log('Therapist Chat MessageU2T:' + message);

   socketT.emit('messageU2T',{Message:message});


   $('#therapist_chatlogs').append($('<li>').text(message));
   $('#therapist_chatlogs').scrollTop($('therapist_chatlogs').prop('scrollHeight'));

   $('#sendU2T-message').val('');
}

function showMessageT2U(data){
   console.log("showMessageT2U:"+ data.Message);
   var message = data.Message;
   $('#therapist_chatlogs').append($('<li>').text(message));
   $('#therapist_chatlogs').scrollTop($('therapist_chatlogs').prop('scrollHeight'));
}


function startChat(room,name){
   console.log("connected to ReceptionChat Name:" + name + ",Room:" + room);
   socketR.emit("connect2ReceptionNameSpace",{ Name:name});
   console.log("SocketID of User(client)after connection:" + socket.id);
   socketT.emit("connect2TherapistNameSpace",{Name:name});
   //socketB.emit("connect2BookingNameSpace",{Name:name});

   activeForm = [1 , 0 , 0 , 0 , 0 , 0 , 0 , 1];
}

function addMessage(data){
   console.log("addMessage:" + data.Message );
   $('#reception_chatlogs').append($('<li>').text(data.Message));
}

function showOptionButton(data){
   var addComment = '<li> <div id=OptionButton>';
   console.log(data.Option.length);
   for(var i=0; i < data.Option.length; i++){
      console.log(data.Option[i]);
     addComment += '<button type="button" onclick="answer(\''+ data.Qid + '\',\''+ data.Option[i] + '\',\''+ data.NextID[i] + '\')" >' + data.Option[i] +'</button><br>';
   }
   addComment += '</div>';
   $('#reception_chatlogs').append($(addComment));
}

function answer(questionId,selectedOption,nextId){
   socketR.emit("answer",{QuestionID: questionId,
                         SelectedOption:selectedOption,
                         NextID: nextId});
   $('#OptionButton').parent().remove();
   addMessage({Message:selectedOption});
   console.log("Socket(TherapistChat) Information:");
   console.log(therapistChatIO.adapter.rooms);
}

var livelink;
function showFormButton(data){
   if(data.Fid === "4"){
      $('#ClinicButton').parent().prev().remove();
      $('#ClinicButton').parent().remove();
   }
   var addComment = '<li> <div id=FormButton>';
   addComment += '<button type="button" onclick="openForm(\''+ data.Fid + '\')" >' + data.Formname +'</button><br>';
   addComment += '</div>';
   $('#reception_chatlogs').append($(addComment));
   livelink = true;
}

function openForm(fid){
   if(livelink){
      $('.content').children('li').css('display','none');
      $('.content').children('li').eq(Number(fid)).css('display','block');
      $('.tab li').removeClass('select');
      $('.tab li').eq(Number(fid)).addClass('select');
      activeForm[Number(fid)] =  1;
   }else{
      $('#FormButton').parent().remove();
      addMessage({Message:"期限がきれました"});
      //socekt.emit("nextOfForm",{Next:next});
   }
}

function showClinicButton(data){
   var addComment = '<li> <div id=ClinicButton>';
   console.log(data.Clinic.length);
   // TODO: insert GOOGLE MAP with pointer!
   addComment += '<p>（マップ表示する！！）</p>';
   for(var i=0; i < data.Clinic.length; i++){
      console.log(data.Clinic[i].shopname + data.Clinic[i].consultationhours);
      addComment += '<button type="button" onclick="window.open(\''+ data.Clinic[i].url + '\')" >' + data.Clinic[i].shopname +'</button>';
      addComment += '<button type="button" onclick="selectClinic(\''+ data.Clinic[i].shopname + '\')" >予約する</button><br>';
   }
   addComment += '<button type="button" onclick="selectClinic()" > 予約しない </button>';
   addComment += '</div>';
   $('#reception_chatlogs').append($(addComment));
   //initMap();
}

function selectClinic(data){
//予約する、やめるのボタンで確認
   socketR.emit("nextOfSelectClinic",{shopname:data});
}

function removeNowComment(data){
   $('#reception_chatlogs').find(':last').remove();
   $('#reception_chatlogs').find(':last').remove();
   socketR.emit("backNextId");
}

function initMap() {
  var myLatLng = {lat: -25.363, lng: 131.044};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}


function finishToFill_BackPainTypeCheckForm(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[1] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"腰痛タイプチェック用紙提出"});
   //＃＃アンケート用紙の回答結果をサーバーに送る
   socketR.emit("nextOfBackPainTypeQForm");
}

function showBackPainTypeButton(data){
   var addComment = '<li> <div id=TypeButton>';
   console.log(data.Type.length);
   for(var i=0; i < data.Type.length; i++){
      console.log(data.Type[i].typename + data.Type[i].typelink);
      addComment += '<button type="button" onclick="window.open(\''+ data.Type[i].typelink + '\')" >' + data.Type[i].typename +'</button><br>';
   }
   addComment += '</div>';
   $('#reception_chatlogs').append($(addComment));
   socketR.emit("nextOfBackPainType");
}

//=== １度チャットを終わらせて、会話のログ画面へ移すためのボタン
function closeConversation(){
   if(confirm("会話がリセットされます。リセットされた会話は、ログで見ることができます。よろしいですか？")){
      //## logに現在の会話を入れる。
      return true;
   }else{
      return false;
   }
}

//### 腰痛タイプチェック記入用紙のフォーム #########
function finishToFill_BackPainTypeCheckForm(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[1] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"腰痛タイプチェック用紙提出"});
   //＃＃アンケート用紙の回答結果をサーバーに送る
   socketR.emit("nextOfBackPainTypeQForm");
}

//### 専門家チャットのフォーム ###################
function finishTherapistChat(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[2] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"専門家とのチャット終了"});
      //＃＃アンケート用紙の回答結果をサーバーに送る
   socketR.emit("nextOfTherapistChat");
}
//### 治療院紹介用紙のフォーム ######################
function finishToFill_RecommendClinicForm(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[3] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"優良治療院紹介記入用紙提出"});
   //＃＃アンケート用紙の回答結果をサーバーに送る
   socketR.emit("nextOfRecommendClinicForm");
}

//### 治療院予約チャットのフォーム ######################
function finishBooking(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[4] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"優良治療院予約終了"});
   //＃＃アンケート用紙の回答結果をサーバーに送る
   socketR.emit("nextOfBookingChat");
}


//### 支払いのフォーム ###################
function finishPayment(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[5] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"支払い完了しました"});
   socketR.emit("nextOfTherapistChatPayment");
}

//＊＊＊＊＊＊＊＊＊　専門家とのチャット部分　＊＊＊＊
