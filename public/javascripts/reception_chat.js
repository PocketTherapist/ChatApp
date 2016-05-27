var socket = io.connect();
var activeForm;

$(document).ready(function(){

   startChat($('#room').val(),$('#name').val());
   socket.on("message",function(data){addMessage(data)});
   socket.on("option",function(data){showOptionButton(data)});
   socket.on("backpain_type",function(data){showBackPainTypeButton(data)});
   socket.on("form",function(data){showFormButton(data)});
});

function startChat(room,name){
   console.log("connected to ReceptionChat Name:" + name + ",Room:" + room);
   socket.emit("connected",{ Name:name});
   activeForm = [1 , 0 , 0 , 0 , 0 , 0 , 1];
}

function addMessage(data){
   console.log("addMessage:" + data.Message );
   $('#logs').append($('<li>').text(data.Message));
   /*
   if(data.NextID){
      console.log("addMessage NextID:" + data.NextID);
      pass_next = data.NextID;
   }
   */
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
   var addComment = '<li> <div id=FormButton>'
   addComment += '<button type="button" onclick="openForm(\''+ data.Fid + '\',\''+ data.NextID + '\')" >' + data.Formname +'</button><br>';
   addComment += '</div>'
   console.log(addComment);
   $('#logs').append($(addComment));
   livelink = true;
}

function openForm(fid,nextId){
   if(livelink){
      $('.content').children('li').css('display','none');
      $('.content').children('li').eq(Number(fid)).css('display','block');
      $('.tab li').removeClass('select');
      $('.tab li').eq(Number(fid)).addClass('select');
      activeForm[Number(fid)] =  1;
      pass_nextId = nextId;
   }else{
      $('#FormButton').parent().remove();
      addMessage({Message:"期限がきれました"});
      //socekt.emit("nextOfForm",{Next:next});
   }
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

function finishTherapistChat(data){
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

function finishPayment(data){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[4] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"支払い完了しました"});
      //＃＃アンケート用紙の回答結果をサーバーに送る
   console.log(":" + pass_nextId);
   socket.emit("nextOfTherapistChatPayment");
}


function finishToFill_RecommendClinicForm(data){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[3] = 0;
   $('#FormButton').parent().remove();
   addMessage({Message:"優良治療院紹介記入用紙提出"});
   //＃＃アンケート用紙の回答結果をサーバーに送る
   console.log("finishToFill_RecommendClinicForm:" + pass_nextId);
   socket.emit("nextOfRecommendClinicForm");
}


//現在の会話を終わらせて、ホーム画面に戻る
function closeConversation(){
   if(confirm("会話がリセットされます。リセットされた会話は、ログで見ることができます。よろしいですか？")){
      //## logに現在の会話を入れる。
      return true;
   }else{
      return false;
   }
}
