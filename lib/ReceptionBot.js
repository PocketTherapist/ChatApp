//ReceptionBot

//---質問事項に関するjson　データベースを作るまで。
var MessageDB = [{"mid":"0",
                  "message":"ご記入ありがとうございます。あなたの腰痛タイプTOP3は下記になります。",
                  "next":"link0"}
];

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

var BackPainTypeDB = [ {"tid":"0",
                        "typename":"筋・筋膜性腰痛",
                        "typelink":"/KinmakuSei"},
                       {"tid":"1",
                        "typename":"椎間関節性",
                        "typelink":"/TsuikankansetsuSei"},
                       {"tid":"2",
                        "typename":"椎間板性腰痛",
                        "typelink":"/TsuikanbanSei"},
                       {"tid":"3",
                        "typename":"仙腸関節性腰痛",
                        "typelink":"/SenchokansetuSei"},
                       {"tid":"4",
                        "typename":"心因性腰痛",
                        "typelink":"/ShininSei"},
                       {"tid":"5",
                        "typename":"ヘルニア",
                        "typelink":"/Herunia"},
                        {"tid":"6",
                         "typename":"脊柱管狭窄症",
                         "typelink":"/SekichukankyosakuSho"},
                        {"tid":"7",
                         "typename":"腰椎分離症",
                         "typelink":"/YoutsuibunriSho"},
                        {"tid":"8",
                         "typename":"変形性腰椎症",
                         "typelink":"/HenkeiseiYoutuiSho"}
];

var UserBackPainTypeTop3 = [{"tid":"0",
                           "typename":"筋・筋膜性腰痛",
                           "typelink":"/KinmakuSei"},
                           {"tid":"4",
                            "typename":"心因性",
                            "typelink":"/ShininSei"},
                            {"tid":"8",
                             "typename":"変形性腰椎症",
                             "typelink":"/HenkeiseiYoutuiSho"}
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

ReceptionBot.prototype.start2 = function(){
   this.askQuestionSet(0);
}

ReceptionBot.prototype.showMessage = function(messageId){
   console.log("showMessage arg:" + messageId);
   this.socket.emit("message",{message: MessageDB[messageId].message});
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

//腰痛タイプを表示する
ReceptionBot.prototype.showUserType = function(){
   var UT_DB = UserBackPainTypeTop3;
   this.socket.emit("type",{Type: UT_DB});
}

//ユーザーからの返信を取得する。
ReceptionBot.prototype.getAnswer = function(questionId,selectedOption,nextId){
   this.nextId = nextId;
   this.questionId = questionId;
   this.selectedOption = selectedOption;
   this.NextAction();
}

ReceptionBot.prototype.getQResult = function(nextId){
   console.log("getResult"+nextId);
   this.nextId = nextId;
   this.NextAction();
   this.nextId = "userType";
   this.NextAction();
}

ReceptionBot.prototype.NextAction = function(){
   console.log(this.nextId);
   if(this.nextId.indexOf("question") !== -1){
      var temp = this.nextId.split("Id");
      this.askQuestionSet(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("userType") !== -1){
      this.showUserType();
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
