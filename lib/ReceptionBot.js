//ReceptionBot

//---質問事項に関するjson　データベースを作るまで。
var MessageDB = [{"mid":"0",
                  "message":"ご記入ありがとうございます。あなたの腰痛タイプTOP3は下記になります。",
                  "nextId":"linkId0"},
                  {"mid":"1",
                   "message":"お疲れ様でした。支払い画面からお支払いをお願いします。",
                   "nextId":"formId4"},
                   {"mid":"2",
                   "message":"ご記入ありがとうございます。あなたにオススメの優良治療院は下記になります。",
                   "nextId":"linkId1"},
                   {"mid":"3",
                   "message":"お支払いありがとうございました。",
                   "nextId":"questionId0"},
];

var QuestionDB = [{"qid":"0",
                   "question":"いかがなさいますか？",
                   "option":["腰痛タイプチェックをする",
                              "専門家に相談したい",
                              "優良治療院を紹介してほしい"],
                     "nextId":["questionId1","questionId2","questionId3"]},
                  {"qid":"1",
                  "question":"「腰痛タイプチェック」ですね。腰痛タイプチェックは。。。よろしければ、ご利用規約に同意の上「腰痛タイプチェックを開始する」ボタンを押して先にすすんでください。",
                  "option":["腰痛タイプチェックを開始する","やめる"],
                  "nextId":["formId1","questionId0"]},
                  {"qid":"2",
                  "question":"「専門家に相談したい」ですね。専門家と相談は。。。よろしければ、ご利用規約に同意の上「専門家に相談を開始する」ボタンを押して先にすすんでください。",
                  "option":["専門家に相談を開始する","やめる"],
                  "nextId":["formId2","questionId0"]},
                  {"qid":"3",
                  "question":"「優良治療院紹介ですね」ですね。優良治療院紹介は。。。よろしければ、ご利用規約に同意の上「優良治療院紹介を開始する」ボタンを押して先にすすんでください。",
                  "option":["優良治療院紹介へ","やめる"],
                  "nextId":["formId3","questionId0"]}
];

var FormDB = [ {"fid":"0",
                "formname":"受付",
                "nextId":""},
               {"fid":"1",
                "formname":"腰痛タイプチェック用紙記入",
                "nextId":"messageId0"},
               {"fid":"2",
                "formname":"専門家とチャットルーム",
                "nextId":"messageId1"},
               {"fid":"3",
                "formname":"優良治療院紹介用紙記入",
                "nextId":"messageId2"},
               {"fid":"4",
                "formname":"お支払い",
                "nextId":"messageId3"}
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

var UserRecommendedClinicTop3 = [{"cid": "0",
                                  "name": "松村正隆",
                                  "shopname": "まつむら鍼灸整骨院",
                                  "postalcode": "662-0913",
                                  "address": "兵庫県西宮市染殿町3-13",
                                  "tel":"0798-38-8455",
                                  "consultationhours":"月・火・水・金：11:00~21:00、土・祝日：9:00~13:00"}


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
   this.socket.emit("message",{Message:msg,
                               NextID:""});
   msg = "[RBot]受付ボットの吉木りさです。";
   console.log(msg);
   this.socket.emit("message",{Message:msg,
                               NextID:""});
   this.askQuestionSet(0);
}

ReceptionBot.prototype.start2 = function(){
   this.askQuestionSet(0);
}

ReceptionBot.prototype.showMessage = function(messageIdNum){
   console.log("showMessage arg:" + messageIdNum);
   this.socket.emit("message",{Message: MessageDB[messageIdNum].message,
                              NextID: MessageDB[messageIdNum].nextId});
   this.nextId = MessageDB[messageIdNum].nextId;
}

//ユーザーに選択肢のある質問をする
ReceptionBot.prototype.askQuestionSet = function(questionId){
   console.log("askQuestionSet arg:" + questionId);
   var Q_DB = QuestionDB[questionId];
   var msg = "[RBot]" + Q_DB.question;
   this.socket.emit("message",{Message: msg,
                               NextID: ""});
   this.socket.emit("option",{Qid: questionId,
                              Option: Q_DB.option,
                              NextID: Q_DB.nextId});
   this.nextId = Q_DB.nextId;
}

//Formを有効にする（腰痛タイプなど）
ReceptionBot.prototype.activateForm = function(formId){
   console.log("activateForm arg:" + formId);
   var F_DB = FormDB[formId];
   console.log("FormNext:"+F_DB.next);
   this.socket.emit("form",{Fid: F_DB.fid,
                           Formname: F_DB.formname,
                           Next: F_DB.nextId});
   this.nextId = F_DB.nextId;
}

//腰痛タイプを表示する
ReceptionBot.prototype.showUserBackPainTypeType = function(){
   var UT_DB = UserBackPainTypeTop3;
   this.socket.emit("backpain_type",{Type: UT_DB});
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
   this.NextAction("userType");
}

//引数ありでもなしでもよい。
ReceptionBot.prototype.NextAction = function(nextId){
   if(nextId){
      this.nextId = nextId;
   }
   console.log(this.nextId);
   if(this.nextId.indexOf("question") !== -1){
      var temp = this.nextId.split("Id");
      this.askQuestionSet(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("userType") !== -1){
      this.showUserBackPainTypeType();
   }else if(this.nextId.indexOf("message") !== -1){
      var temp = this.nextId.split("Id");
      this.showMessage(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("form") !== -1){
      var temp = this.nextId.split("Id");
      this.activateForm(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else{
      console.error("nextが間違っています。")
   }
}

module.exports = ReceptionBot;
