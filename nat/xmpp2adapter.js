
// voice project : config google actions 
//var myactions=require("./actions.js");


//xmpp
// see : https://www.npmjs.com/package/@xmpp
//	
const { client, xml, jid } = require("@xmpp/client");

const debug = require("@xmpp/debug");

var myadapter;//=require("./actions_adapter.js");
var ctl,bot_,


//  in this simple ex we start the session from a hello message from ws bot,so waith a MAIN intent from gactions to use the session ( type=message_received)
//  TODO in future a MAIN will send to bot a hello type message starting a session 
newconv=true;// waiting  a new actions request (MAIN intent) . if false a req is pending and a response from bot is coming
var only1Response=0;// flag , 0 :  means waiting for the resp , 1: response alredy sent 

let usrPrefix='xmpp',sep='|';



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
const test=false;//true;

// ***************** should be put in a xmpp server obj 
let xmpp;
// xmpp message stanza in :
let userResponse;// userResponse can be called by webserver OR xmpp stanza
// xmpp message out  :
let sendXmppMsg=	function (message,status,user){// this is called by bot 
let text=message.text;
// user=message.recipient.id
const isxml=false;//true;
// split user
let [user_,text_]=split_(user,text);

let mes ;
mes= xml(
	  "message",
	  { to: user_ ,type:'chat'},// { to: cli },
	  xml("body", {}, text_)
	);
	

if(!send_http[user]){//  user is not waiting a  http post respond

	// we can also take trace if a xmpp request is having respond for a user ( like http), use different  like : send_xmpp[user], reset after 15 sec with a sorry not und prompt
  
	// can also refuse tu send bot the request if it was not alredy responded

	//await
	console.log(' xmpp_ sending a response/ bot answering prompt , xml : ',mes.toString);
	xmpp.send(mes);

}else{// is waiting a http post on url=...._text

	if(isxml){
		let txt=mes.toString();
	send_http[user].text(txt,status);
	}else{
		message.xml=mes.toString();
		send_http[user].json(message,status);
	}
	send_http[user]=null;

}
};
let send_http=[];

// ******************+



// ############################à test 





// #############################

/*
<script>
function myFunction() {


function split_(user,msg){//output case :  msg='answere' user='luigi|Sip77'
	let uio=user.indexOf(sep);
//if(uio >= 0&&uio<10){}
let arr;
if(uio >= 0){
	var lim=user.indexOf(sep);
	return    [ user.substring(0, lim),user.substring(lim+sep.length)+sep+msg];// user='luigi' msg='Sip77|answere'
}else return  [sep,user,msg];
}


function split__(user,msg){//the opposite, imput case :  msg='Sip77|text' user='luigi
	let uio=msg.indexOf(sep);
if(uio >= 0&& uio<15){

	return    [user+sep+msg.substring(0, uio),msg.substring(uio+sep.length)];// 'luigi|Sip77' 'text'
}else return [user,msg];

}



  var  sep='|',client='luigi';

      let testo="sip77|Hello world!";
      
    //  /*
   let[user,testo_]=split__(client,testo);   
   
   let xuser=user,xtext='answere';
      
     let [xuser_,xtext_]=split_(xuser,xtext);
    
	  document.getElementById("demo").innerHTML = client +'      '+testo;
	  document.getElementById("demox").innerHTML = user +'      '+testo_;
	  document.getElementById("demo1").innerHTML = xuser_ +'      '+xtext_;
	  }
	  </script>
      
*/

function split_(user,msg){//output case :  msg='answere' user='luigi|Sip77'
	let uio=user.indexOf(sep);
//if(uio >= 0&&uio<10){}
let arr;
if(uio >= 0){
	var lim=user.indexOf(sep);
	return    [ user.substring(0, lim),user.substring(lim+sep.length)+sep+msg];// user='luigi' msg='Sip77|answere'
}else return  [user,msg];
}





function split__(user,msg){//the opposite, imput case :  msg='Sip77|text' user='luigi
	let uio=msg.indexOf(sep);
if(uio >= 0&& uio<65){

	return    [user+sep+msg.substring(0, uio),msg.substring(uio+sep.length)];// 'luigi|Sip77' 'text'
}else return [user,msg];

}








function setActions(webserver,logic_,uri,dsIndex){// ritorna il ctl delle actions  setMsgTempl;
										




// xmpp Entry 

// xmpp start service

const istesting=false;
if(!istesting)xmpp=stXmpp();








/* ora devo fasri che come nel caso di webserver dove registro ( con ws.post(endpoint,handler(req,res,next))) l'handler:
	 this.adapter.processActivity(req, res, this.handleTurn.bind(this))
	 e torna subito lasciando in res.send il cb x il return

, cosi quando il ws riceve post :
- il web server chiama il handler del  post registrato,  formendo req e res 
- il handler chiama il logic passando req per ottenere il text e il res.send come call back per dare la risposa con send(text) 
 nel caso webserver il handler e' ( vedi core.configureWebhookEndpoint()):
	 this.adapter.processActivity(req, res, logic=this.handleTurn.bind(this)) :
	 		 yield this.runMiddleware(context, logic);
	 dove si vede che manda il msg al bot logic chiamando il middleware aspettando il return dello stesso 
	 dopo che il bot termina ritorna dal  wait/yield , recupera il bot answere :
		  	context.turnState.get('httpBody')
	e da istruzione al cb di procedere con la risposta 
		res.json(context.turnState.get('httpBody'));

	 
*/

// qui non si registra l'handler che c'e' gia (usransware) , ma lo si configura settando il logic 
// in modo che chiami , come il handler nel webserver .post , :
// this.adapter.processActivity(req, res, logic=this.handleTurn.bind(this)) 
logic=logic_;//this.handleTurn.bind(this)








// configure userA the entry of stanza msg 
userResponse=

//function usransware(testo,conv,main){(testo,{id:user},isconnected)// REALLY a user Request !, this will be called with client text , not a answer but a request after a bot prompt
  function usransware(testo,client,type_,main)// (testo,{id:user},main) // useranswere is a bad name , user inputs is better !!
  {// (testo,{id:user},isconnected,cb)// REALLY a user Request !, this will be called with client text , not a answer but a request after a bot prompt
  	// conv reference : see https://github.com/actions-on-google/actions-on-google-nodejs/blob/master/src/service/actionssdk/conversation/conversation.ts
  	// or node_modules/actions-on-google/dist/service/actionssdk/conversation/conversation.js
  	// a msg coming from user 
  	console.log(' xmpp , a msg = ',testo,', is coming from  user : ',client,' main is : ',main);
  	//  var message=clone(msgTempl);
  	// ADD :
  	// if is main intent newconv =true;
  	newconv =main;// 
  	let type;
	  if(main){ console.log(' ga , new conv is starting from actions so fire a welcome_back : ');
	  // to do 
  		type='hello';//'welcome_back';
  		//newconv=false;
  	}else {type='message';// =type_
		console.log(' ga ,conv is already started from actions so fire a message_received : ',testo);
  	}
  	//user=Math.floor(Math.random() * 10000);// random
	  
	  // compose user using also text :
	  let[user,testo_]=split__(client,testo);// see sep='|';
  	only1Response=0;// TODO : how wrks it ??????????????
  	// ctl.ingest(bot_, message, bot_.ws);
  	let req={body:{text:testo_,user,type,dsIndex}},// OK
  	//res={send:actionscb};// will be convo.ask();
	//res={send:actionscb};// will be convo.ask();
	res={send:actionscb_};// will be convo.ask();
	function actionscb_(message,status,user){actionscb(message,status,user)}// just relay , useless
  	// better return following promise that where returns/fullfill the msg to send to googleactions
	  // let promisewithtext=myadapter.processActivity(req,res,logic);// return a promise so promisewithtext.then(function(text){conv.ask(text)})
	let promisex=myadapter.processActivity(req,res,logic);// processActivity in xmpp_adapter has same req then web_adapter , but res={send:function(text,status ){}
	  // returns a promise but we dont care
	  // in processactivity we call midleware on logic , wait the result then call the local cb=res.send=  to respond with actionscb_(botTextResponse
}

let post=false;
// userResponse can be calle by webserver OR xmpp stanza
if (webserver&&post) {// testing only 
	console.log('call ws test url:',uri);
	webserver.post(uri, (req, res) => {
		// Allow the Botbuilder middleware to fire.
		// this middleware is responsible for turning the incoming payload into a BotBuilder Activity
		// which we can then use to turn into a BotkitMessage
		console.log('wekhook got a request  :',req.body);
		send_http[req.body.user]={text:function(text,status){res.status(status);res.send(text);},
								json:function(msg,status){res.status(status);res.json(msg);}
								}
		userResponse(req.body.text,req.body.user,req.body.type,false);


		/*
		this.adapter.processActivity(req, res, this.handleTurn.bind(this)).catch((err) => {
			// todo: expose this as a global error handler?
			console.error('Experienced an error inside the turn handler', err);
			throw err;
		});*/
		});

	}

/* ACTION CONTROLLER :
  //ctl=controller;
  // ??? bot=controller.worker;
  //console.log(' worker is   bot ?, worker is : ',controller.worker);
  myactions.createact(webserver);// pass webserver so that myactions can configure a entry poit for voice http

  // *** management summary 022019 
  //  actions interface : user calls usrquestion/usransware that interface botkit input interface 
  //  bot use botResponse , in middleware.send,  to send bot response to the user 
  let botResponse=myactions.getactctl(usransware);// // BEST interpret  AS USER REQUEST !! .. exchange listener/cbs,  bot will call botresponse to send the response 
*/
// XMPP CONTROLLER :

function request(){



}








  // WARNING : following ref will be set by the new Promise in intent.MAIN controller  so check the flag newconv
  // SENT A MESSAGE BY END CONVO will call this function in sendxNewInt
  //let actionscb=function (message){//bot,message,next){// next is null
  let actionscb=function (message,status,user){//bot,message,next){// next is the xmpp resolve (=botResponse....)
    console.log(' xmpp , bot got END CONVO  and trying sending 1 response x turn  to user with  msg: ',message,'\n newconv : ',newconv,' , only1Response : ',only1Response,' user ',user);
	// user=message.recipient.id or message.conversation.id

	// TR33
      if(!newconv&&only1Response==0){ console.log(' ga , bot  sending to user gactions ');
        // botResponse.mygactions(message);//.mygactions(message);//bot,message,next);
		sendXmppMsg(message,status,user);
        console.log(' ga , bot  sent to user xmpp/gactions   ');
	only1Response=1;
        // NO  :   newconv=true;// only 1 msg x turm 
       // next();// or called by botresponse
    }
    else {
      //setTempl(mess);
      // botResponse.mygactions(message);//bot,message,next);
	  sendXmppMsg(message,status,user);
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


/*
function clone(i){
  	var msgTempl={};
	for(var p in i){
  		msgTempl[p]=i[p];    
  	}
  	return msgTempl;
}
*/

function init (xmpp_cfg_,webserver,ad,logic,uri,dsIndex) {// was passed also controller=aiv3

	/* >>>>>>>>>>>>>   management summary 102019
	aiv3 will call setAtion(logic) (logic is the aiv3 incoming listener) . it will
	- get actions (A)  controller myaction
	- call myaction.createactct to register action2adapter listener ,useranswere, for incoming actions msg and receiving the cb (to actions)  container botResponce
  		containing the cb function botResponse.mygaction to return bot response to actions

	- in action2adapter listener ,useranswere, we call incoming action adapter listener actionadapter.processActivity 
  		actionadapter.processActivity params :
    		in req the incoming msg and 
    		in res the res.send cb that will chain the   botResponse.mygaction cb to  actions
    		in logic the bot incoming method 
	- processActivity(req,res,) will
  		req  > message > activity > turncontext > middlewarerun(turncontext,logic) 
  	-  middlewarerun will run middleware on context so call logic (bot incoming)
      	- bot will run and send responses calling sendActivities(context, activities) that 
       		will add message to turnstate :  context.turnState.set('httpBody', message = this.activityToMessage(activity))
  	-when bot finish turn we exit from middlewarerun and 
    		> call back  (res.send=botResponse.mygaction)(msg=context.turnState.get('httpBody')) so we are  cb to  actions (A)



	*/

  myadapter=ad;// web/action/xmpp adapter 




if(xmpp_cfg_)xmpp_cfg=xmpp_cfg_;



  let xy= setActions(webserver,logic,uri);// useless , just relay . webserver useless in xmpp
  return xy;
}

let xmpp_cfg={
	/*
	  service: "ws://localhost:5280/xmpp-websocket",
	  domain: "localhost",
	  resource: "example",
	  username: "username",
	  password: "password",
	  */

	  service: "wss://visionmeet.beevoip.it:7443/ws/",
	  domain: "visionmeet.beevoip.it",
	  resource: "testresource",
	  username: "test",
	  password: "testmarson01"

/*
service: "wss://404.city:5222/xmpp-websocket/",
	 // service: "http://404.city:5222",
	  domain: "404.city",
	 // resource: "testresource",
	  username: "mmarson",
	  password: "zq7MG7xcGE8jPTP",
*/


};

function stXmpp(){// stXmpp



	let xmpp = client(xmpp_cfg);

	debug(xmpp, true);

	xmpp.on("error", (err) => {
  		console.error(' xmpp_ received on error ,err: '+err);
	});

	xmpp.on("offline", () => {
 		 console.log(" xmpp_ received on offline");
	});


/* ONLINE 

Event online

Emitted when connected, authenticated and ready to receive/send stanzas.

    <Jid>

xmpp.on("online", (address) => {
  console.log("online as", address.toString());
});



start

Starts the connection. Attempts to reconnect will automatically happen if it cannot connect or gets disconnected.

xmpp.start().catch(console.error);
xmpp.on("online", (address) => {
  console.log("online", address.toString());
});

Returns a promise that resolves if the first attempt succeed or rejects if the first attempt fails.
stop

Stops the connection and prevent any further auto reconnect/retry.

xmpp.stop().catch(console.error);
xmpp.on("offline", () => {
  console.log("offline");
});

*/








	// STANZA
	xmpp.on("stanza", async (stanza) => {
		// ipotesi stanza={is:"message",attrs:{type:'sometype',from:'someone cli'},getChild}
		//				stanza.getChild('body')={text:'the user text'}
/*
  		if (stanza.is("message")) {
    			await xmpp.send(xml("presence", { type: "unavailable" }));
    			await xmpp.stop();
  		}
*/
	 console.log(' xmpp_ received on stanza ( sending 2  bot if is message: ',stanza.is("message"),' ) : ' ,stanza.toString());
  	if (!stanza.is("message")) return;

	if(stanza.attrs) console.log('  stanza, type: ',stanza.attrs.type);
	let mes,cli= stanza.attrs.from,
		  body=stanza.getChild("body");
	if(body){
	let text=body.text(); // message.getChildText("body"); 

	  if(test){
		mes = xml(
  			"message",
  			{ to: cli ,type:'chat'},// { to: cli },
  			xml("body", {}, 'ciao, hai detto '+text)
			);
			console.log(' xmpp_ sending auto loop xml : ',mes.toString);
  		xmpp.send(mes);
	  }else{
		let type='message';
		// e' l'equivalente del l'handler nel web.post(url,handler)
		let handler=
		userResponse(text,cli,type,false);// usransware(testo,conv,main)// (testo,{id:user},main)
	

		// function botP(resolve,reject) { usransware(text,{id:cli},false,resolve)};// delegate useranswere to call resolve( aval/apromise)

		 /*
		new Promise (botP).then(function(botr){
			mes = xml(
  				"message",
  				{ to: cli ,type:'chat'},// { to: cli },
  				xml("body", {}, botr));
  			xmpp.send(mes);
			}, rejected); }
		 */
		// OR better in case we wait for xmpp.send to chain other staff before return


			/*

		let botR= await new Promise (botP);
		mes = xml(
  				"message",
  				{ to: cli ,type:'chat'},// { to: cli },
  				xml("body", {}, botR));
  		// await //?? if ather thing before return
		xmpp.send(mes);
		*/



	  }
	}else console.error(' XMPP IN ,  xmpp_ received a message without a BODY : DISCARDED ');

	function send(text){// ????????????????''''''  delete
		let mes = xml(
  			"message",
  			{ to: cli ,type:'chat'},// { to: cli },
  			xml("body", {}, 'ciao, hai detto '+text)
			);
  		xmpp.send(mes);
	}

	});
// function rejected(){console.log(' xmpp stanza bot promise rejected !')};




/* Simple echo bot example
xmpp.on("stanza", (stanza) => {
  console.log(stanza.toString());
  if (!stanza.is("message")) return;

  const message = stanza.clone();
  message.attrs.to = stanza.attrs.from;
  xmpp.send(message);
});*/



	xmpp.on("online", async (address) => {
		  // Makes itself available
		  
		  console.log(' xmpp_ received a online, from address.tostring: ' ,address.toString());

  		await xmpp.send(xml("presence"));

		let message,hello= "hello world";

		if(test&&false){
  			// Sends a chat message to itself
  			message = xml(
    				"message",
    				{ type: "chat", to: address },
    					xml("body", {},hello),
				  );
				  console.log(' xmpp_  ,after a on online.  sending xml : ',message);
  			await xmpp.send(message);
		}else{

			// to do 

	  }




	});

	xmpp.start().catch(console.error);
	return xmpp;



}// ends stXmpp


module.exports = init;
