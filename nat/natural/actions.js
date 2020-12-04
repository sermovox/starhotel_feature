
/* management summary 
	each time a intent was fired a bot kit loop was fired :

.intent_(/,f) will register the injected behaviour in a map then we executed
some method will take care of behavior f(some param)

	.f(conv){// or f(in,out)
		input= conv.input;
		ret=bl(input);
		conv.resp(ret);
	}






	.f(conv){// or f(in,out)
		input= conv.input;
		ret=bl(input);
		conv.resp(ret);
	}

if we call a external loop : input > bl > ret 
loop=get();
	.f(conv){
		input= conv.input;
		loop.in(input,function(ret){
			conv.resp(ret);
			});

	}

that is :

function get(){return {in:function(in,ret){ret=in;}}

loop=get();
	.f(conv){
		input= conv.input;
		aret=function(ret){// on object with a method 
			conv.resp(ret);
			});
		loop.in(input,aret);

	}

that is :
function get(){return {in:function(in,ret){ret=in;}}

loop=get();
	for(i++)
	.f(conv){
		input= conv.input;
		aret=function(ret){
			conv.resp(ret);
			});
		function(k){// a closure that keep fields of function launched 
			loop.in(k,input,aret);
			}(i)

	}
that is :
function get(){return {in:function(in,ret){ret=in;}}

loop=get();
	for(i++)
	.f(conv){
		input= conv.input;
		aret=function(ret){
			conv.resp(ret);
			});
		function(k){// a closure that keep fields of function launched 
			loop.in(k,input,aret);
			}(i)
	}
that is :
function get(){return {in:function(in,ret){ret=in;}}

loop=get();
	for(i++)
	.f(conv){
		input= conv.input;
		aret=function(ret){
			conv.resp(ret);
			});
		loopx=function(k){// a closure that keep private fields of function 
			return loop.in(k,input,aret);
			}(i)
		lookx();
		
	}
that is :
function get(){return {in:function(in,ret){ret=in;}}

loop=get();
	for(i++)
	.f(conv){
		input= conv.input;
		aret=function(ret){
			conv.resp(ret);
			});
		loopx=function(k){// a closure that keep private fields of function 
			return loop.in(k,input,aret);
			}(i)
		lookx();
		
	}

*/

var myconv;

/*
var return2user=function (bot,message,next){
	myconv.ask(message.text);
	// no 
	next();
}*/



	const bodyParser = require('body-parser');
	// ... app code here
	// Import the appropriate service and chosen wrappers
	const {
 		 actionssdk,
  		Image,
	} = require('actions-on-google');




module.exports ={createact,getactctl};// call createact, then getactctl
var send2bot;				

function getactctl(usrsay_){// must be associated to one page conversation so to one specific user that open the page request and ask for a 2 way channel to interact till the page success 
// instaed of many aiax on the same page we have a single ws to communicate) 

	send2bot=usrsay_;// the function to call that send the message to bot : send2bot(text)

	return return2user;//(an object containing) the function to call when the bot has a message to send
}

var Promise = require('promise');

/*
router.post('/Registration',function(req,res,next) {
    function username() {
        console.log("agyaaa");
        return new Promise(function(resolve,reject) {
            User.findOne({"username":req.body.username}, function(err,user) {
                if (err) {
                    reject(err)
                } else {
                    console.log("yaha b agyaaa");
                    var errorsArr = [];
                    errorsArr.push({"msg":"Username already been taken."});
                    resolve(errorsArr);
                }
            });
        });
    }
    username().then(function(data) {
        console.log(data);
        next();
    });
});

var promise = new Promise(function (resolve, reject) {
  get('http://www.google.com', function (err, res) {
    if (err) reject(err);
    else resolve(res);
  });
});
*/

var return2user={};

/*
function run(userutt,cb2ga){// con be condense in calling 

	send2bot(userutt);// will call return2user as call back
	// register the listener
	return2user=cb2ga;
}
*/

function createact(express){
console.log(" congig fulfillment for google actions");

	const app = actionssdk();// an instance ?


/*
	// Register handlers for Actions SDK intents
	app.intent('actions.intent.MAIN', conv => {
 
  		//conv.ask(`Here's a picture of a cat`)


		console.log("  google actions actionssdk receiving a intent main from google ");
		//conv.ask('Hi, how is it going?')
		  register(conv); // used by the bot cb=return2user
		  send2bot('starting actions convo');
			// seems that returning with no promise and wthout called conv.ask will fire an error on google actions sdk


		// return a promise 
		// a promise when .then(resolve, err) will run the corpus that will define when call the resolve or the err with related param. 

  		//  function ga() {// the promise factory
        	console.log("agyaaa");
		// will live in its 
        	return new Promise(function(resolve,reject) {// WILL RUN 	when .then(res,rej) , resolve will have 2 param and can return a value or a promise that will be chained
			var time_=0;// set a timer
			run('starting actions convo',function (bot,message,next){


			if(err){
				reject(-1);
			}else {
				conv.ask(message.text);
				next();
				resolve();
			}
		});

		
        });
      });
*/

// timer that will launch return2user.mygactions(null,{text:'pippo'},function(){})

function testretfrombot(int){
//setTimeout(return2user.mygactions,int,null,{text:'pippo'},function(){});
}
function fact(conv){

 var cases = 0;

 if(cases==0){
	       	console.log("actions : promise creating ");
        var prom= new Promise(function(resolve) {// WILL RUN 	when .then() , resolve will have 2 param and can return a value or a promise that will be chained
			var time_=0;// set a timer
			//run('starting actions convo',acc);


//	send2bot(' from googleactions ');// will call return2user as call back
	// register the listener on return2user.mygactions that will be passed to bot kit send middleware 
	/* potrei anche ritornare il cb return2user.mygactions=function(){
		resolve()// devo assegnare resolve=res in fact() al momento del messaggio
				}*/
	return2user.mygactions=function (message){// aggancio il cb che verra chiamato al termine del bot in adapter.processactivity()
			console.log('actions : promise, to return to actions http call, fired ,message is :',message);
				//if(err){reject(-1);}else {
					conv.ask(message);
					//if(next)next();
					resolve();// or resolve();next();
			}



		});
	       	console.log("promise created ");
	//conv.ask('Hi, how is it going pippo ?');
	return prom;
 }else{

 	conv.ask('Hi, how is it going on ?');
 	return null;

 }

}


	// Register handlers for Actions SDK intents
	app.intent('actions.intent.MAIN', (conv, input)=> {
 
  		//conv.ask(`Here's a picture of a cat`)
 		 /*conv.ask(new Image({
    		url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
   		 alt: 'A cat',
 		 }))*/

		console.log("  google actions actionssdk receiving a intent main from google \n conv: ",conv,'\n input : ',input);
		//conv.ask('Hi, how is it going?')
		 // register(conv); // used by the bot cb=return2user

		 // >>> pass to botkit input  on an alredy started ws bot
		 //	TODO :
		 // as different client will start (a new ) ws connection that will start botkit session putting a message of type hello in ingest input chain
		 //	 it would be better to send a type hello message x the main actions intent, 
		 //	then following we can send message-received type x TEXT intent or a more specific message setting also a session intent var 
		  send2bot(input,conv,true);
			// seems that returning with no promise and wthout called conv.ask will fire an error on google actions sdk


		// return a promise 
		// a promise when .then(resolve, err) will run the corpus that will define when call the resolve or the err with related param. 

  		//  function ga() {// the promise factory
        	console.log("agyaaa");//testretfrombot(500);
		// will live in its 
		
		
		var rprom=fact(conv);//;// return a promise so the fw will run the cb then if see no call to the param launch the return if it is a promise but what to do with the result ?
		testretfrombot(1500);
		let rprom1=rprom.then(function (){console.log("bot sent its hello responses ");return '';});
		// just see if there is a resolve or reject ?? 
		//return2user.mygactions(null,{text:'pippo'},function(){})
		return rprom1;//rprom;// ?? seems useless

      });


	app.intent('actions.intent.TEXT', (conv, input) => {

		// ADD CODE ENANCEMENT as MAIN INTENT ( now there is a bug) 

  		if (input === 'bye' || input === 'goodbye') {
  		  return conv.close('See you later!')
		  };
		  
		  //register(conv); // used by the bot cb=return2user
			send2bot(input,conv,false);
			
			// >>>>>>>>>>>>>>>>>    SEMPLIFICARE LO SCAMBIO quasi INUTILE (vedi intercette nei vari passaggi) DI REFERENCE CB ricevendo indietro da send2bot il promise rprom come return di :
			//	async processactivity(){ ... return text }
			// e qui : let rprom=send2bot(input,false).then(function(text){conv.ask(text);});


			// EXIT without wait for the conv to call, different from MAIN !!!

		//conv.ask(`I didn't understand. Can you tell me something else?`)
		
		var rprom=fact(conv);//;// return a promise so the fw will run the cb then if see no call to the param launch the return if it is a promise but what to do with the result ?
		
		let rprom1=rprom.then(function (){console.log("bot sent its hello responses ");return '';});
		// just see if there is a resolve or reject ?? 
		//return2user.mygactions(null,{text:'pippo'},function(){})
		return rprom1;//rprom;// ?? seems useless




	});
	
	//actions();

	// express is not a function
	const expressApp = express.use(bodyParser.json());
	expressApp.post('/fulfill', app);
}




function register(conv){
	myconv=conv;
}