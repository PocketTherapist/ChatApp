//ReceptionBot



var QuestionDB = [{"qid":"0",
                   "question":"いかがなさいますか？",
                   "option":["腰痛タイプチェックをする",
                              "専門家に相談したい",
                              "優良治療院を紹介してほしい"],
                  "nextId":["questionId1","questionId2","questionId3"],
                  "nextTurn":"user"},
                  {"qid":"1",
                  "question":"「腰痛タイプチェック」ですね。腰痛タイプチェックは。。。よろしければ、ご利用規約に同意の上「腰痛タイプチェックを開始する」ボタンを押して先にすすんでください。",
                  "option":["腰痛タイプチェックを開始する","やめる"],
                  "nextId":["formId1","questionId0"],
                  "nextTurn":"user"},
                  {"qid":"2",
                  "question":"「専門家に相談したい」ですね。専門家と相談は。。。よろしければ、ご利用規約に同意の上「専門家に相談を開始する」ボタンを押して先にすすんでください。",
                  "option":["専門家に相談を開始する","やめる"],
                  "nextId":["formId2","questionId0"],
                  "nextTurn":"user"},
                  {"qid":"3",
                  "question":"「優良治療院紹介ですね」ですね。優良治療院紹介は。。。よろしければ、ご利用規約に同意の上「優良治療院紹介を開始する」ボタンを押して先にすすんでください。",
                  "option":["優良治療院紹介へ","やめる"],
                  "nextId":["formId3","questionId0"],
                  "nextTurn":"user"},
                  {"qid":"4",
                  "question":"優良治療院の予約を終了してよろしいですか？",
                  "option":["優良治療院の予約を終了する","やっぱり続ける"],
                  "nextId":["questionId0","back"],
                  "nextTurn":"user"},
                  {"qid":"5",
                  "question":"**に予約でよろしいですか？",
                  "option":["**に予約する","やっぱりやめる"],
                  "nextId":["formId4","back"],
                  "nextTurn":"user"}
               ];


var ReceptionBot = function(socket){
   this.socket = socket;
   this.userId = "";
   this.room = "";
   this.nextId = "";
   this.lastId = "";
}

ReceptionBot.prototype.setParam = function(userId,room){
   this.userId = userId;
   this.room = room;
}

ReceptionBot.prototype.start = function(){
   var msg = "[RBot]いらっしゃいませ、" + this.userId + " 様";
   console.log(msg);
   this.socket.emit("showMessage",{Message:msg});
   msg = "[RBot]受付ボットの吉木りさです。";
   console.log(msg);
   this.socket.emit("showMessage",{Message:msg});
   this.askQuestionSet(0);
}

ReceptionBot.prototype.start2 = function(){
   this.askQuestionSet(0);
}

//ユーザーからの返信を取得する。
ReceptionBot.prototype.getAnswer = function(questionId,selectedOption,nextId,userId){
   this.questionId = questionId;
   this.selectedOption = selectedOption;
   this.NextAction(nextId,userId);
}


//引数ありでもなしでもよい。
ReceptionBot.prototype.NextAction = function(nextId,userId){
   var realNextId;
   if(nextId !== undefined){
      //this.lastId = this.nextId;
      realNextId = nextId;
   }else{
      realNextId = this.nextId;
   }

   console.log("RealNextID:"+ realNextId +",NextID:"+this.nextId+",LastID:"+this.lastId);
   if(realNextId.indexOf("message") !== -1){
      var temp = realNextId.split("Id");
      this.showMessage(Number(temp[1]));
   }else if(realNextId.indexOf("question") !== -1){
      var temp = realNextId.split("Id");
      this.askQuestionSet(Number(temp[1]));
   }else if(realNextId.indexOf("form") !== -1){
      var temp = realNextId.split("Id");
      this.activateForm(Number(temp[1]));
   }else if(realNextId.indexOf("userType") !== -1){
      this.showUserBackPainType();
   }else if(realNextId.indexOf("userClinic") !== -1){
      this.showUserClinic();
   }else if(realNextId.indexOf("back") !== -1){
      this.removeNowComment();
   }else{
      console.error("nextが間違っています。next:"+realNextId);
   }
}

//現在のコメントを消して、前の状況に戻す
ReceptionBot.prototype.removeNowComment = function(){
   this.socket.emit("removeNowComment");
}

//メッセージを表示する
ReceptionBot.prototype.showMessage = function(messageIdNum){
   console.log("showMessage arg:" + messageIdNum);
   //if(this.lastId === this.nextId)
   //this.lastId = this.nextId;
   this.nextId = MessageDB[messageIdNum].nextId;
   this.nextTurn = MessageDB[messageIdNum].nextTurn;
   this.socket.emit("showMessage",{Message: MessageDB[messageIdNum].message});
}

//ユーザーに選択肢のある質問をする
ReceptionBot.prototype.askQuestionSet = function(questionId){
   console.log("askQuestionSet arg:" + questionId);
   var Q_DB = QuestionDB[questionId];
   var msg = "[RBot]" + Q_DB.question;
   this.socket.emit("showMessage",{Message: msg});
   this.lastId = this.nextId;
   this.nextId = Q_DB.nextId;
   this.nextTurn = Q_DB.nextTurn;
   this.socket.emit("showOption",{Qid: questionId,
                              Option: Q_DB.option,
                              NextID: Q_DB.nextId});
}


//Formを有効にする（腰痛タイプチェック、専門家チャット、支払い、治療院紹介）
ReceptionBot.prototype.activateForm = function(formId){
   console.log("activateForm arg:" + formId);
   if(formId === "6"){formId = "5"}//予約の支払いの時
   var F_DB = FormDB[formId];
   console.log("FormNext:"+F_DB.nextId);
   var msg = "[RBot]" + F_DB.formmessage;
   this.socket.emit("showMessage",{Message: msg});
   this.lastId = this.nextId;
   this.nextId = F_DB.nextId;
   this.nextTurn = F_DB.nextTurn;
   this.socket.emit("activateForm",{Fid: F_DB.fid,
                           Formname: F_DB.formname,
                           Next: F_DB.nextId,
                           UserID: this.userId});
}

//腰痛タイプを表示する
ReceptionBot.prototype.showUserBackPainType = function(){
   var UT_DB = UserBackPainTypeTop3.Top3;
   this.lastId = this.nextId;
   this.nextId = UserBackPainTypeTop3.nextId;
   this.nextTurn = UserBackPainTypeTop3.nextTurn;
   this.socket.emit("showMessage",{Message: UserBackPainTypeTop3.message});
   this.socket.emit("showBackPainTypeOfUser",{Type: UT_DB});
}

//紹介治療を紹介する
ReceptionBot.prototype.showUserClinic = function(){
   var C_DB4U = UserRecommendedClinicTop3.Top3;
   if(!this.nextId.indexOf('back')){
      this.lastId = this.nextId;
   }
   this.nextId = UserRecommendedClinicTop3.nextId;
   this.nextTurn = UserRecommendedClinicTop3.nextTurn;
   this.socket.emit("showMessage",{Message: UserRecommendedClinicTop3.message});
   this.socket.emit("showClinicForUser",{Clinic: C_DB4U});

}

module.exports = ReceptionBot;
