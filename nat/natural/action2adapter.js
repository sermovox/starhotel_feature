
// voice project : config google actions 
var myactions=require("./actions.js");
var myadapter;//=require("./actions_adapter.js");
var ctl,bot_,

//  in this simple ex we start the session from a hello message from ws bot,so waith a MAIN intent from gactions to use the session ( type=message_received)
//  TODO in future a MAIN will send to bot a hello type message starting a session 
newconv=true;// waiting  a new actions request (MAIN intent) . if false a req is pending and a response from bot is coming
var only1Response=0;// flag , 0 :  means waiting for the resp , 1: response alredy sent 

/* newconv mngment : todo 

?? is true :
newconv become false when main comes from actions ( A NEW channel/SESSION  START ) : after a main intent ga will send text intent till convo break 
	> so newconv shound test ga intent got 

 but is also used to tell if the bot send msg can go as response  to the ga 
	>>>  so in // TR33
      >>> bot should call actionscb() only for end convo response (sendxNewInt() ) 
 
 TODO :
	- bot will send the last message of the complete dialog  using a flag that will force disconnect the ga main intent/session 


	- made automatic the following single turn return message for ga and voice enabler  :
        ga and voice enabler wont bother  message.waitEnd messages >>> THEY are added messages (only to web) 
        so > apply this rule:
        - convo can send more response to a user request but only the last message has waitEnd false
            and the will be the end convo event message if the convo will ends 

        >> only end turn messsages will be directed to voice enabler and ga interface and will consolidate all previous text messager
        >> the end turn will alse be sent to bot channel with no consolidation 

	- RESOLVE THIS :
		waitEnd messages are stored and consolidated in end turn message ( without card) so can be sent also to web 
		in other word  web will receive the waitend messages each with its card or just as ga and voice enabler only the last consolidated message ????????


*/

function setActions(webserver,logic){// ritorna il ctl delle actions  setMsgTempl;

function usransware(testo,conv,main){// REALLY a user Request !, this will be called with client text , not a answer but a request after a bot prompt
  // conv reference : see https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/actionssdk/conversation/conversation.ts
  // or node_modules/actions-on-google/dist/service/actionssdk/conversation/conversation.js
// a msg coming from user 
  console.log(' ga , a msg coming from ga user : ',testo,' main is : ',main);
//  var message=clone(msgTempl);
// ADD :
// if is main intent newconv =true;
  newconv =main;// 
let type,user;
if(main){ console.log(' ga , new conv is starting from actions so fire a welcome_back : ');
  type='hello';//'welcome_back';
  //newconv=false;
}else {type='message';
	console.log(' ga ,conv is already started from actions so fire a message_received : ',testo);
}
  //user=Math.floor(Math.random() * 10000);// random
  user=conv.id;
  only1Response=0;// TODO : how wrks it ??????????????
  // ctl.ingest(bot_, message, bot_.ws);
  let req={body:testo,user,type},
  res={send:actionscb};// will be convo.ask();

  // better return following promise that where returns/fullfill the msg to send to googleactions
  let promisewithtext=myadapter.processActivity(req,res,logic);// return a promise so promisewithtext.then(function(text){conv.ask(text)})
}


  //ctl=controller;
  // ??? bot=controller.worker;
  //console.log(' worker is   bot ?, worker is : ',controller.worker);
  myactions.createact(webserver);// pass webserver so that myactions can configure a entry poit for voice http

  // *** management summary 022019 
  //  actions interface : user calls usrquestion/usransware that interface botkit input interface 
  //  bot use botResponse , in middleware.send,  to send bot response to the user 
  let botResponse=myactions.getactctl(usransware);// // BEST interpret  AS USER REQUEST !! .. exchange listener/cbs,  bot will call botresponse to send the response 



  // WARNING : following ref will be set by the new Promise in intent.MAIN controller  so check the flag newconv
  // SENT A MESSAGE BY END CONVO will call this function in sendxNewInt
  let actionscb=function (message){//bot,message,next){// next is null
    console.log(' ga , bot got END CONVO  and trying sending 1 response x turn  to user ga  msg: ',message,'\n newconv : ',newconv,' , only1Response : ',only1Response);


	// TR33
      if(!newconv&&only1Response==0){ console.log(' ga , bot  sending to user gactions ');
        botResponse.mygactions(message);//.mygactions(message);//bot,message,next);
        console.log(' ga , bot  sent to user gactions   ');
	only1Response=1;
        // NO  :   newconv=true;// only 1 msg x turm 
       // next();// or called by botresponse
    }
    else {
      //setTempl(mess);
      botResponse.mygactions(message);//bot,message,next);
      //next();}
    }
  }

  //controller.setAppCtl.actionscb=botResponse;// in appCtl.sendxNewInt(bot, message) will call botResponse.mygactions(bot,message,null)

  /* OR

   // SENT A MESSAGE BY a convo say  BUT not the message.waitEnd messages >>> THEY are added messages (only to web) FOLLOWED ever by signe end turn message 
	// that can be the last message convo.say() in the middle of a  convo  or the end message sent at convo end event 

  controller.middleware.send.use(function(bot,message,next){
    var sbool=!newconv&&!message.waitEnd&&only1Response==0;
  console.log(' middleware.send : ga , if :',sbool,' bot try sending to user ga  : ',message.text);
    if(sbool){ 
	console.log(' ga , bot in middle of a convo  sending (1 max) response to user gactions  because convo has started on google actions  ');
      botResponse.mygactions(bot,message,next);
      // newconv=true;// 
	only1Response=1;// only 1 msg x turm 
	    next();// or called by botresponse
	}
	else {
    //setTempl(mess);
  
    next();}

  });  */



 // ????  return setMsgTempl;
}// ends setActions

 var msgTempl;
 /*function setMsgTempl(bot, mess){// from hello handler
  console.log('*** connection_events  , msgTempl set: ',bot);
    bot_=bot;setTempl(mess);
 }
 function setTempl(mess){// set the msgTempl if null
 
   if(msgTempl)return;
  // msgTempl={};
   msgTempl=clone(mess);
   msgTempl.type='message_received';
   msgTempl.text='tbf';
   console.log(' msg template (single user) is set to : ',msgTempl);
 }*/

function clone(i){
  var msgTempl={};
for(var p in i){
  msgTempl[p]=i[p];    
  }
  return msgTempl;
}

function init (webserver,ad,logic) {// was passed also controller=aiv3
  myadapter=ad;
  return setActions(webserver,logic);// webserver
}
module.exports = init;