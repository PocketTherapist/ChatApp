var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs')
var http = require('http');
var io = require('socket.io');
var logger = require('morgan');
var port = process.env.PORT || 1338;

var app = express();
var server = http.createServer(app);

//受付用のチャット
var receptionChat = require('./lib/chat_server.js');
receptionChat.listen(server);


server.listen(port,function(){
   console.log("server start...");
});

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//middleware
app.use(bodyParser());
app.use(logger());

app.use(express.static(path.join(__dirname, '/public')));
//app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
//Error処理　自作middleware
/*
app.use(function(){//logErrors
   console.error(err.stack);
   next(err);
});
app.use(function(err, req, res, next) {// clientErrorHand
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
});
app.use(function(err, req, res, next) { //errorHandler
   res.status(500);
   res.render('error', { error: err });
});
*/

/*###############################
###         画面遷移           ###
###############################*/
app.get("/",function(req,res){
   res.render('PreHome.ejs');
   return;
});

//== ユーザーサイド

app.get("/UserLogin",function(req,res){
   res.render('UserLogin.ejs');
   return;
});

app.post("/UserHome",function(req,res){
   console.log('name:' + req.body.name);
   res.render('UserHome.ejs',{ Name: req.body.name,
                                    Room: req.body.name});
});

//Receptionからホーム画面へ戻る　＆　Receptionの会話を終わらせたとき(こっちは別途作る必要あり)
app.get("/ToHome",function(req,res){
   console.log('Back to Home');
   res.render('UserHome.ejs',{Name: req.body.name,
                              Room: req.body.name});
});

// ↓　埋め込む内容が違うだけで、同じejsでDBから何を取り出してきて、
//そのボタン・人に対して何を表示するかといった対応するようにしたい。
//腰痛タイプ説明ページ
//筋・筋膜性腰痛
app.get("/KinmakuSei",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/KinmakuSei.ejs');
});
//椎間関節性腰痛
app.get("/TsuikankansetsuSei",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/TsuikankansetsuSei.ejs');
});
//椎間板腰痛
app.get("/TsuikanbanSei",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/TsuikanbanSei.ejs');
});
//仙腸関節性腰痛
app.get("/SenchokansetuSei",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/SenchokansetuSei.ejs');
});
//心因性腰痛
app.get("/ShininSei",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/ShininSei.ejs');
});
//ヘルニア
app.get("/Herunia",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/Herunia.ejs');
});
//脊柱管狭窄症
app.get("/SekichukankyosakuSho",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/SekichukankyosakuSho.ejs');
});
//椎間関節性腰痛
app.get("/YoutsuibunriSho",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/YoutsuibunriSho.ejs');
});
//変形性腰椎症
app.get("/HenkeiseiYoutuiSho",function(req,res){
   console.log('Back to Home');
   res.render('BackPainType/HenkeiseiYoutuiSho.ejs');
});


//=== 専門家サイド
app.get("/TherapistLogin",function(req,res){
   res.render('TherapistLogin.ejs');
   return;
});

app.post("/TherapistHome",function(req,res){
   console.log('name:' + req.body.name);
   res.render('TherapistHome.ejs',{ Name: req.body.name,
                                    Room: req.body.name});
});

//=== 管理者サイト
app.get("/AdministratorLogin",function(req,res){
   res.render('AdministratorLogin.ejs');
   return;
});

app.post("/AdministratorHome",function(req,res){
   console.log('name:' + req.body.name);
   res.render('AdministratorHome.ejs',{ Name: req.body.name,
                                    Room: req.body.name});
});
