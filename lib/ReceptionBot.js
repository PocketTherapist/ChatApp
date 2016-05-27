//ReceptionBot

//---質問事項に関するjson　データベースを作るまで。
var MessageDB = [{"mid":"0",
                  "message":"ご記入ありがとうございます。あなたの腰痛タイプTOP3は下記になります。",
                  "nextId":"userType",
                  "nextTurn":"bot"},
                  {"mid":"1",
                   "message":"お疲れ様でした。支払い画面からお支払いをお願いします。",
                   "nextId":"formId4",
                   "nextTurn":"bot"},
                   {"mid":"2",
                   "message":"ご記入ありがとうございます。あなたにオススメの優良治療院は下記になります。",
                   "nextId":"userClinic",
                   "nextTurn":"bot"
                   },
                   {"mid":"3",
                   "message":"お支払いありがとうございました。",
                   "nextId":"questionId0",
                   "nextTurn":"bot"},
];

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
                  "nextTurn":"user"}
];

var FormDB = [ {"fid":"0",
                "formname":"受付",
                "formmessage":"",
                "nextId":"",
                "nextTurn":"user"},
               {"fid":"1",
                "formname":"腰痛タイプチェック用紙記入",
                "formmessage":"下の「腰痛タイプチェック用紙記入」ボタンを押して、腰痛タイプチェック用紙に記入してください。",
                "nextId":"messageId0",
                "nextTurn":"user"},
               {"fid":"2",
                "formmessage":"下の「専門家とチャットルーム」ボタンを押して、専門家とチャットを開始してください。",
                "formname":"専門家とチャットルーム",
                "nextId":"messageId1",
                "nextTurn":"user"},
               {"fid":"3",
                "formmessage":"下の「優良治療院紹介用紙記入」ボタンを押して、優良治療院紹介用紙に記入してください。",
                "formname":"優良治療院紹介用紙記入",
                "nextId":"messageId2",
                "nextTurn":"user"},
               {"fid":"4",
                "formmessage":"下の「支払い」ボタンを押して、支払い手続きを開始してください。",
                "formname":"お支払い",
                "nextId":"messageId3",
                "nextTurn":"user"}
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

var ClinicDB = [{"cid":"0",
                 "shopname":"TN整体院",
                 "postalcode":"577-0022",
                 "address":"大阪府東大阪市荒本新町3-4-303",
                 "tel":"072-968-7559",
                 "consultationhours":"8:00-20:00",
                 "noconsultaionhours":"不定休",
                 "url":"http://www.tnseitai.com//"},
                 {"cid":"1",
                 "shopname":"グッポコンディショニングルーム",
                 "postalcode":"589-0006",
                 "address":"大阪府狭山市金剛1-3-5宮崎ビル3階",
                 "tel":"072-367-3244",
                 "consultationhours":"10:00-20:00",
                 "noconsultaionhours":"不定休",
                 "url":"http://goopconditioning.com/"},
                 {"cid":"2",
                 "shopname":"健康いちばん整骨院",
                 "postalcode":"653-0856",
                 "address":"兵庫県神戸市長田区高取山町1-3-12",
                 "tel":"078-641-8893",
                 "consultationhours":"月・日・木・金 8:50~19:00, 土 8:50~14:00, 第2・4日曜 8:50~12:00",
                 "noconsultaionhours":"水曜・祝日・第2・4以外の日曜日",
                 "url":"http://kenkou-no1.com"},
                 {"cid":"3",
                 "shopname":"つつじ整骨院",
                 "postalcode":"569-1142",
                 "address":"大阪府高槻市宮田町2－5－30－103",
                 "tel":"072－691-5171",
                 "consultationhours":"月・水・金・土 9:00~17:00, 火・木 9:00~17:00　20:00~22:00",
                 "noconsultaionhours":"日・祝日",
                 "url":"https://www.facebook.com/tutuji224"},
                 {"cid":"4",
                 "shopname":"じとう接骨院",
                 "postalcode":"607-8077",
                 "address":"京都市山科区音羽沢町10-7",
                 "tel":"075-595-0889",
                 "consultationhours":"午前診 月～土 8:30~12:30, 午後診 月~金 16:00~20:00",
                 "noconsultaionhours":"土曜日午後、日曜日、祝祭日",
                 "url":""},
                 {"cid":"5",
                 "shopname":"鍼灸・整体院　ひわたし",
                 "postalcode":"650-0001",
                 "address":"兵庫県神戸市中央区加納町3-2-1　ICOビル５階",
                 "tel":"078-381-5635",
                 "consultationhours":"10：00～21：00",
                 "noconsultaionhours":"木・日・祝",
                 "url":"http://acu-hiwatashi.com/"},
                 {"cid":"6",
                 "shopname":"タニマチ整骨院",
                 "postalcode":"542-0012",
                 "address":"大阪市中央区谷町6-3-13",
                 "tel":"06-6764-1190",
                 "consultationhours":"月〜金　午前診9:00〜13:00  午後診16:00〜20:00　土9:00〜13:00",
                 "noconsultaionhours":"日・祝日",
                 "url":"http://yamashita18.com/cure/seitai/"},
                 {"cid":"7",
                 "shopname":"もり鍼灸整骨院",
                 "postalcode":"603-8326",
                 "address":"京都市北区北野下白梅町47",
                 "tel":"075-432-7079",
                 "consultationhours":"月・火・水・金9:00~20:00 木・土9:00~13:00",
                 "noconsultaionhours":"日・祝日",
                 "url":"http://mori18.com/"},
                 {"cid":"8",
                 "shopname":"国分寺整骨院",
                 "postalcode":"769-0101",
                 "address":"香川県高松市国分寺町新居516-1",
                 "tel":"087-899-5500",
                 "consultationhours":"8:00~20:00",
                 "noconsultaionhours":"なし（年中無休）",
                 "url":"http://kokubunji.co"},
                 {"cid":"9",
                 "shopname":"中尾接骨院",
                 "postalcode":"651-2111",
                 "address":"兵庫県神戸市西区池上2丁目30-4",
                 "tel":"078-976-0043",
                 "consultationhours":"月〜金 午前診9:00~12:30 午後診16:00~20:00, 土 9:00~12:30",
                 "noconsultaionhours":"日曜・祝日・土曜午後",
                 "url":"https://www.facebook.com/nakao.sekkotsuin/"},
                 {"cid":"10",
                 "shopname":"フジイ整骨院",
                 "postalcode":"679-4122",
                 "address":"兵庫県たつの市龍野町日飼341-7",
                 "tel":"0791−62−4339",
                 "consultationhours":"月・火・水・金 8:30~12:30 15:00~19:00,木 8:30~12:30, 土 8:30~13:00",
                 "noconsultaionhours":"日曜・祝日",
                 "url":"http://www.fujii-hone.com/"},
                 {"cid":"11",
                 "shopname":"長山整骨院",
                 "postalcode":"660-0085",
                 "address":"兵庫県尼崎市元浜町２－１０６三和不動産ビル１Ｆ",
                 "tel":"06-6411-2200",
                 "consultationhours":"月～土／8:30～12:30 月・火・水・金／16:00～20:00",
                 "noconsultaionhours":"木曜・土曜午後、日曜、祝日",
                 "url":"https://www.facebook.com/nagayma.seikotsuin/"},
                 {"cid":"12",
                 "shopname":"まつむら鍼灸整骨院",
                 "postalcode":"662-0913",
                 "address":"兵庫県西宮市染殿町3-13",
                 "tel":"0798-38-8455",
                 "consultationhours":"月・火・水・金 11:00〜21:00, 土・祝 9:00~13:00",
                 "noconsultaionhours":"木曜・日曜",
                 "url":"http://matsumura-jtac.com/"},
                 {"cid":"13",
                 "shopname":"ふじい整骨院",
                 "postalcode":"675-0122",
                 "address":"兵庫県加古川市別府町別府967-17",
                 "tel":"079-437-3789",
                 "consultationhours":"月～金 午前診8:30~11:30, 午後診15:30~19:30　土 8:30〜12:30",
                 "noconsultaionhours":"木曜・土曜午後・日曜・祝日",
                 "url":"http://fujii-seikotsuin.com/"},
                 {"cid":"14",
                  "shopname":"あやた接骨院",
                  "postalcode":"615-8227",
                  "address":"京都市西京区上桂宮ノ後町31-14",
                  "tel":"075-393-5436",
                  "consultationhours":"午前診8:00~12:30, 午後診16:30~20:00",
                  "noconsultaionhours":"土曜午後・日・祝",
                  "url":"http://www.ayata-s.com"}


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

var UserRecommendedClinicTop3 = [                 {"cid":"12",
                 "shopname":"まつむら鍼灸整骨院",
                 "postalcode":"662-0913",
                 "address":"兵庫県西宮市染殿町3-13",
                 "tel":"0798-38-8455",
                 "consultationhours":"月・火・水・金 11:00〜21:00, 土・祝 9:00~13:00",
                 "noconsultaionhours":"木曜・日曜",
                 "url":"http://matsumura-jtac.com/"},
                 {"cid":"13",
                 "shopname":"ふじい整骨院",
                 "postalcode":"675-0122",
                 "address":"兵庫県加古川市別府町別府967-17",
                 "tel":"079-437-3789",
                 "consultationhours":"月～金 午前診8:30~11:30, 午後診15:30~19:30　土 8:30〜12:30",
                 "noconsultaionhours":"木曜・土曜午後・日曜・祝日",
                 "url":"http://fujii-seikotsuin.com/"},
                 {"cid":"14",
                  "shopname":"あやた接骨院",
                  "postalcode":"615-8227",
                  "address":"京都市西京区上桂宮ノ後町31-14",
                  "tel":"075-393-5436",
                  "consultationhours":"午前診8:00~12:30, 午後診16:30~20:00",
                  "noconsultaionhours":"土曜午後・日・祝",
                  "url":"http://www.ayata-s.com"}


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
   var msg = "[RBot]" + F_DB.formmessage;
   this.socket.emit("message",{Message: msg});
   this.socket.emit("form",{Fid: F_DB.fid,
                           Formname: F_DB.formname,
                           Next: F_DB.nextId});
   this.nextId = F_DB.nextId;
}

//腰痛タイプを表示する

ReceptionBot.prototype.showUserBackPainType = function(){
   var UT_DB = UserBackPainTypeTop3;
   var msg = "[RBot]あなたの腰痛TOP3";
   this.socket.emit("message",{Message: msg});
   this.socket.emit("backpain_type",{Type: UT_DB});
}

//ユーザーからの返信を取得する。
ReceptionBot.prototype.getAnswer = function(questionId,selectedOption,nextId){
   this.nextId = nextId;
   this.questionId = questionId;
   this.selectedOption = selectedOption;
   this.NextAction();
}
/*
ReceptionBot.prototype.getQResult = function(){
   this.NextAction("userType");
}

ReceptionBot.prototype.getCResult = function(){
   this.NextAction("userClinic");
}
*/

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
      this.showUserBackPainType();
   }else if(this.nextId.indexOf("message") !== -1){
      var temp = this.nextId.split("Id");
      this.showMessage(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("form") !== -1){
      var temp = this.nextId.split("Id");
      this.activateForm(Number(temp[1]));
      console.log(temp[0] + "Id" + temp[1]);
   }else if(this.nextId.indexOf("userClinic") !== -1){
      this.showUserClinic();
   }else {
      console.error("nextが間違っています。")
   }
}

module.exports = ReceptionBot;
