var socket = io.connect();
var activeForm;

$(document).ready(function(){

   startChat($('#room').val(),$('#name').val());
   socket.on("message",function(data){addMessage(data.message)});
   socket.on("option",function(data){showOptionButton(data)});
   socket.on("type",function(data){showTypeButton(data)});
   socket.on("form",function(data){showFormButton(data)});
});

function startChat(room,name){
   console.log("connected to ReceptionChat Name:" + name + ",Room:" + room);
   socket.emit("connected",{ Name:name});
   activeForm = [1 , 0 , 0 , 0];
}

function addMessage(msg){
   console.log(msg);
   $('#logs').append($('<li>').text(msg));
}

function showOptionButton(data){
   var addComment = '<li> <div id=OptionButton>';
   console.log(data.Option.length);
   for(var i=0; i < data.Option.length; i++){
      console.log(data.Option[i]);
     addComment += '<button type="button" onclick="answer(\''+ data.Qid + '\',\''+ data.Option[i] + '\',\''+ data.Next[i] + '\')" >' + data.Option[i] +'</button><br>';
   }
   addComment += '</div>';
   $('#logs').append($(addComment));
}

function answer(questionId,selectedOption,nextId){
   socket.emit("answer",{QuestionID: questionId,
                         SelectedOption:selectedOption,
                         NextID: nextId});
   $('#OptionButton').parent().remove();
   addMessage(selectedOption);
}

var livelink;
function showFormButton(data){
   var addComment = '<li> <div id=FormButton>'
   addComment += '<button type="button" onclick="openForm(\''+ data.fid + '\',\''+ data.form + '\',\''+ data.next + '\')" >' + data.formname +'</button><br>';
   addComment += '</div>'
   $('#logs').append($(addComment));
   livelink = true;
}

function openForm(fid,form,next){
   if(livelink){
      $('.content').children('li').css('display','none');
      $('.content').children('li').eq(Number(fid)).css('display','block');
      $('.tab li').removeClass('select');
      $('.tab li').eq(Number(fid)).addClass('select');
      activeForm[Number(fid)] =  1;
      var addInfo = '<input type="text" id="next" value="' + next + '" hidden>';
      $('#hide_info').append($(addInfo));
   }else{
      $('#FormButton').parent().remove();
      addMessage("期限がきれました");
      //socekt.emit("nextOfForm",{Next:next});
   }
}

function finishQuestionnaire(){
   $('.content').children('li').css('display','none');
   $('.content').children('li').eq(0).css('display','block');
   $('.tab li').removeClass('select');
   $('.tab li').eq(0).addClass('select');
   activeForm[1] = 0;
   $('#FormButton').parent().remove();
   addMessage("腰痛タイプチェック用紙提出");
   var next = $('#next').val();
   //＃＃アンケート用紙の回答結果をサーバーに送る
   console.log("firstQuestionnaire:" + next);
   socket.emit("nextOfQForm",{Next:next});
}

function showTypeButton(data){
   var addComment = '<li> <div id=TypeButton>';
   console.log(data.Type.length);
   for(var i=0; i < data.Type.length; i++){
      console.log(data.Type[i].typename + data.Type[i].typelink);
      addComment += '<button type="button" onclick="window.open(\''+ data.Type[i].typelink + '\')" >' + data.Type[i].typename +'</button><br>';
   }
   addComment += '</div>';
   $('#logs').append($(addComment));
   socket.emit("nextOfType");
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
