var socket = io.connect();
var activeForm;


//### 受付フォーム ##################

//=== ボットとのチャット =============

$(document).ready(function(){

   startChat($('#room').val(),$('#name').val());
   socket.on("showMessage",function(data){addMessage(data)});
   socket.on("showOption",function(data){showOptionButton(data)});
   socket.on("showBackPainTypeOfUser",function(data){showBackPainTypeButton(data)});
   socket.on("activateForm",function(data){showFormButton(data)});
   socket.on("showClinicForUser",function(data){showClinicButton(data)});
});

function startChat(room,name){
   console.log("connected to ReceptionChat Name:" + name + ",Room:" + room);
   socket.emit("connected",{ Name:name});
   activeForm = [1 , 0 , 0 , 0 , 0 , 0 , 0 , 1];
}

function addMessage(data){
   console.log("addMessage:" + data.Message );
   $('#logs').append($('<li>').text(data.Message));
}

function showOptionButton(data){
   var addComment = '<li> <div id=OptionButton>';
   console.log(data.Option.length);
   for(var i=0; i < data.Option.length; i++){
      console.log(data.Option[i]);
     addComment += '<button type="button" onclick="answer(\''+ data.Qid + '\',\''+ data.Option[i] + '\',\''+ data.NextID[i] + '\')" >' + data.Option[i] +'</button><br>';
   }
   addComment += '</div>';
   $('#logs').append($(addComment));
}

function answer(questionId,selectedOption,nextId){
   socket.emit("answer",{QuestionID: questionId,
                         SelectedOption:selectedOption,
                         NextID: nextId});
   $('#OptionButton').parent().remove();
   addMessage({Message:selectedOption});
}

var livelink;
function showFormButton(data){
   var addComment = '<li> <div id=FormButton>';
   addComment += '<button type="button" onclick="openForm(\''+ data.Fid + '\')" >' + data.Formname +'</button><br>';
   addComment += '</div>';
   $('#logs').append($(addComment));
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
   addComment += '<p>（マップ表示する！！）</p>';
   for(var i=0; i < data.Clinic.length; i++){
      console.log(data.Clinic[i].shopname + data.Clinic[i].consultationhours);
      addComment += '<button type="button" onclick="window.open(\''+ data.Clinic[i].url + '\')" >' + data.Clinic[i].shopname +'</button>';
      addComment += '<button type="button" onclick="selectClinic(\''+data.Clinic[i].shopname'\')"> 予約する </button><br>';
   }
   addComment += '</div>';
   $('#logs').append($(addComment));
   socket.emit("nextOfBackPainType");
   //initMap();
}

function selectClinic(){
//予約する、やめるのボタンで確認

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
   socket.emit("nextOfBackPainTypeQForm");
}

function showBackPainTypeButton(data){
   var addComment = '<li> <div id=TypeButton>';
   console.log(data.Type.length);
   for(var i=0; i < data.Type.length; i++){
      console.log(data.Type[i].typename + data.Type[i].typelink);
      addComment += '<button type="button" onclick="window.open(\''+ data.Type[i].typelink + '\')" >' + data.Type[i].typename +'</button><br>';
   }
   addComment += '</div>';
   $('#logs').append($(addComment));
   socket.emit("nextOfBackPainType");
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
   socket.emit("nextOfBackPainTypeQForm");
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
   socket.emit("nextOfTherapistChat");
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
   socket.emit("nextOfRecommendClinicForm");
}

//### 治療院予約チャットのフォーム ######################
function finishToFill_RecommendClinicForm(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[4] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"優良治療院紹介記入用紙提出"});
   //＃＃アンケート用紙の回答結果をサーバーに送る
   socket.emit("nextOfRecommendClinicForm");
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
   socket.emit("nextOfTherapistChatPayment");
}
