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
var receptionChat = require('./lib/reception_chat_server.js');
receptionChat.listen(server);

//セラピストとのチャット用
//var therapistChat = require('./lib/therapist_chat_server.js');
//therapistChat.listen(server);

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

app.get("/UserHome",function(req,res){
   res.render('index.ejs');
   return;
});

app.post("/ReceptionChat",function(req,res){
   console.log('name:' + req.body.name);
   res.render('ReceptionChat.ejs',{ Name: req.body.name,
                                    Room: req.body.name});
});

app.get("/TherapistChat",function(req,res){
   res.render('TherapistChat.ejs',{Room: 'TherapistRoom', Name: "hoge"});
});


//Receptionからホーム画面へ戻る　＆　Receptionの会話を終わらせたとき(こっちは別途作る必要あり)
app.get("/ToHome",function(req,res){
   console.log('Back to Home');
   res.render('index.ejs');
});


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
