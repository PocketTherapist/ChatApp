//ReceptionBot

//---質問事項に関するjson　データベースを作るまで。
var MessageDB = [{"mid":"0",
                  "message":"ご記入ありがとうございます。",
                  "next":""}]

var QuestionDB = [{"qid":"0",
                     "question":"本日はいかがなさいますか？",
                     "option":["腰痛タイプチェックをする",
                              "専門家に相談したい",
                              "優良治療院を紹介してほしい"],
                     "next":["questionId1","questionId2","questionId3"]},
                  {"qid":"1",
                  "question":"「腰痛タイプチェック」ですね。腰痛タイプチェックは。。。よろしければ、ご利用規約に同意の上「腰痛タイプチェックを開始する」ボタンを押して先にすすんでください。",
                  "option":["腰痛タイプチェックを開始する","やめる"],
                  "next":["formId1","questionId0"]},
                  {"qid":"2",
                  "question":"「専門家に相談したい」ですね。専門家と相談は。。。よろしければ、ご利用規約に同意の上「専門家に相談を開始する」ボタンを押して先にすすんでください。",
                  "option":["専門家に相談を開始する","やめる"],
                  "next":["formId2","questionId0"]},
                  {"qid":"3",
                  "question":"「優良治療院紹介ですね」ですね。優良治療院紹介は。。。よろしければ、ご利用規約に同意の上「優良治療院紹介を開始する」ボタンを押して先にすすんでください。",
                  "option":["優良治療院紹介へ","やめる"],
                  "next":["formId3","questionId0"]}
                  ];

var FormDB = [ {"fid":"0",
                "formname":"受付",
                "form":"/Reception",
                "next":""},
               {"fid":"1",
                "formname":"腰痛タイプチェック用紙記入",
                "form":"/BackPainTypeCheck",
                "next":"messageId0"},
                {"fid":"2",
                 "formname":"専門家とチャットルーム",
                 "form":"/TheapistChat",
                 "next":"messageId1"},
                 {"fid":"3",
                  "formname":"治療員紹介用紙記入",
                  "form":"/RecommendedClininc",
                  "next":"messageId2"}
               ];

var LinkDB = [ {"lid":"0",
                "linkname":"腰痛タイプチェック用紙記入",
                "link":"/BackPainTypeCheck",
                "next":"messageId0"},
                {"lid":"1",
                 "linkname":"専門家とチャットルーム",
                 "link":"/TheapistChat",
                 "next":"messageId1"},
                 {"lid":"2",
                  "linkname":"治療員紹介用紙記入",
                  "link":"/RecommendedClininc",
                  "next":"messageId2"}
               ];


var ReceptionBot = function(socket){
   this.socket = socket;
}

ReceptionBot.prototype.setParam = function(name,room){
   this.name = name;
   this.room = room;
}

ReceptionBot.prototype.start = function(){
   var msg = "[RBot]いらっしゃいませ、" + this.name + " 様";
   console.log(msg);
   this.socket.emit("message",{message:msg});
   msg = "[RBot]受付ボットの吉木りさです。";
   console.log(msg);
   this.socket.emit("message",{message:msg});
   this.askQuestionSet(0);
}

//ユーザーに選択肢のある質問をする
ReceptionBot.prototype.askQuestionSet = function(questionId){
   console.log("askQuestionSet arg:" + questionId);
   var Q_DB = QuestionDB[questionId];
   var msg = "[RBot]" + Q_DB.question;
   this.socket.emit("message",{message: msg});
   this.socket.emit("option",{Qid: questionId,
                              Option: Q_DB.option,
                              Next: Q_DB.next});
}

//Formを有効にする（腰痛タイプなど）
ReceptionBot.prototype.activateForm = function(formId){
   console.log("activateForm arg:" + formId);
   var F_DB = FormDB[formId];
   this.socket.emit("form",{fid: F_DB.fid,
                           formname: F_DB.formname,
                           form: F_DB.form,
                           next: F_DB.next});
}

//リンクを提示する（腰痛タイプなど）
ReceptionBot.prototype.showLink = function(linkId){
   console.log("showLink arg:" + linkId);
   var L_DB = LinkDB[linkId];
   this.socket.emit("link",{lid: L_DB.lid,
                           linkname: L_DB.linkname,
                           link: L_DB.link,
                           next: L_DB.next});
}

//ユーザーからの返信を取得する。
ReceptionBot.prototype.getAnswer = function(questionId,selectedOption,nextId){
   this.nextId = nextId;
   this.questionId = questionId;
   this.selectedOption = selectedOption;
   this.NextAction();
}

ReceptionBot.prototype.NextAction = function(){
   console.log(this.nextId);
   if(this.nextId.indexOf("question") !== -1){
      var temp = this.nextId.split("Id");
      this.askQuestionSet(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("link") !== -1){
      var temp = this.nextId.split("Id");
      this.showLink(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("message") !== -1){
      var temp = this.nextId.split("Id");
      this.showMessage(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("form") !== -1){
      var temp = this.nextId.split("Id");
      this.activateForm(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else{
      console.error("nextIDが間違っています。")
   }
}

module.exports = ReceptionBot;
