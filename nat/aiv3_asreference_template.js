// avoid  AconstructorF.prototype=function....  inside constructor but adding a code ouside   AconstructorF.prototype=function..  see https://stackoverflow.com/questions/22123965/class-prototype-method-vs-this-prototype-method
// 012020 todo ? .prototype??????

/*const {Wit, log} = require('node-wit');

const client = new Wit({
  accessToken: MY_TOKEN,
  logger: new log.Logger(log.DEBUG) // optional
});*/




const cnfl = {
    sayInMoustache: true,// prepromt ( the say to canfirm/ give details after a ask is put in convo.vars['trans_prompt'] to be embedded in next message 
    intDataModels: 'skill/intent_Data_Models',
    userExpressCtls: 'skill/userCtls',
    addCond:true,//addConditionInMessage
     condPre: '$X',
    useAddedField2cuustomizesupport_oraddaprefixtofieldname: true,
    aiEntExtr: true//false// rest 2 ai intents

};
var aiclients={};//  filled by inplementation of witai2activity 

async function witai2activity(text,tokenurl,field,aiserv,aiclients){    // helper func: wit compatible ai service
// aiclients={aiserv.token:new aiserv.Wit({accessToken: aiserv.token}),tokenurl1:new aiserv.Wit({accessToken: tokenurl1}),,,}
// do a ai query on registered ai endpoint (aiclients),registering if the tokenurl=intDataModels.dialog.static[field] is new .
    /*
    returns {name:field,
            conf:confidence,
            entities:{
                ask1:val1,
                ,,,
                }
            }
 base implementation of wit compatible ai service: used a wit.ai compatible agent given (see bot.js) as :
         aiserv={Witcompatible ai agent factory, token:(std token for all intent in app  : process.env.AiToken)}; 

 interface/usage is  : 
    client= // ai agent 
    new aiserv.Wit({accessToken: token (std token is aiserv.token ),
        logger: new log.Logger(logu.DEBUG) // optional
      });
      data=client.message('set an alarm tomorrow at 7am');

  
        
 
    tokenurl: if we give tokenurl from  this url or token will be used to get/create the subsection/intent_specific entity matcher agent  (instead of aiclient)
             tokenurl=intDataModels.dialog.static[field];// url or token , field is vector field !

    aiclients: the map to storage created ai agent for specific token 


here assume that aiserv services used here has the normalized format choosen as wit.ai api 
curl \ -H 'Authorization: Bearer SCRIXYSXGYQCNLZGMPJGCFZQ3YNHANMB' \ 'https://api.wit.ai/message?v=20191024&q=how%20many%20operas%20between%20Tuesday%20and%20Friday'

data=
{
"_text":"how many operas between Tuesday and Friday",
"entities":{"datetime":[{"confidence":0.96018125,"values":[
                {"to":{"value":"2019-10-26T00:00:00.000-07:00","grain":"day"},"from":{"value":"2019-10-22T00:00:00.000-07:00","grain":"day"},"type":"interval"},
                 {"to":{"value":"2019-11-02T00:00:00.000-07:00","grain":"day"},"from":{"value":"2019-10-29T00:00:00.000-07:00","grain":"day"},"type":"interval"},
                {"to":{"value":"2019-11-09T00:00:00.000-08:00","grain":"day"},"from":{"value":"2019-11-05T00:00:00.000-08:00","grain":"day"},"type":"interval"}
                ],
                "to":{"value":"2019-10-26T00:00:00.000-07:00","grain":"day"},"from":{"value":"2019-10-22T00:00:00.000-07:00","grain":"day"},"type":"interval"}],
            "intent":[{"confidence":0.73231058973678,"value":"infoOpereAutori"}]},
            "msg_id":"1q9dgHiSm8vlbyp9n"
}
or old version :  https://github.com/wit-ai/node-wit or https://wit.ai/docs/http/20160330#get-intent-via-text-link :
{
  "msg_id" : "e86468e5-b9e8-4645-95ce-b41a66fda88d",
  "_text" : "hello",
  "entities" : {
    "intent" : [ {
      "confidence" : 0.9753469589149633,
      "value" : "greetings"
        } ].
    "wikipedia_search_query": [
            {
                "suggested": true,
                "confidence": 0.93807,
                "value": "pertini",
                "type": "value"
            }
        ],
    aentity:[{
                "suggested": true,
                "confidence": 0.93807,
                "value": "pertini",
                "type": "value"
            },
            {},,,]
  }
}

see also prop[best].value



let data=await  aiserv.message(text, {});// e intnam in {}??
console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
return data;
*/
    let client,// is the wit compatible agent to rest x intent/entity match 
    intents={},//activity.channelData.intents={};
    best=0;// first intent is max conf ????

    if(tokenurl){// adds token  in map if dont exists 
        if(!aiclients[tokenurl])
            aiclients[tokenurl]=new aiserv.Wit({accessToken: tokenurl});// aiserv.token });
        client= aiclients[tokenurl];
    }else{    
        tokenurl=aiserv.token;// base token 
        if(!aiclients[tokenurl])
        aiclients[tokenurl]=new aiserv.Wit({accessToken: tokenurl});// aiserv.token });
    client= aiclients[tokenurl];
    }
    let data=await client.message(text, {}),// e intnam in {}??
    myint;// 
    // new version :
    console.log(' aiv3. witai2activity witai returned intent data: ',JSON.stringify(data, null, 4));
    if(data.entities.intent){
        test=data.entities.intent[best].value==field;// should be true if there is intents 
    // if so : 
    myint=intents[field]={name:field,conf:data.entities.intent[best].confidence};// command.luis.intents[0];// check cms intents format ,  DDWE
    // if we adopt for entities the cms format forvariable shoul be simply : 
    //   myint.entities=command.variables;
    }else{
        myint=intents[field]={name:field,conf:0.99};// command.luis.intents[0];// check cms intents format ,  DDWE

    }
    myint.entities={};
    for (var prop in data.entities) {
        if (data.entities.hasOwnProperty(prop)&&prop!='intent') {
            // if is a string : prop[best].type=='value';
            console.log(' aiv3. witai2activity data.entities.prop: ', data.entities[prop]);
            if(Array.isArray( data.entities[prop])){
                console.log(' aiv3. witai2activity data.entities.prop[0]: ', data.entities[prop][best]);
                myint.entities[prop]= data.entities[prop][best].value;// , best =0?
            }
            // else entities[prop.name]=prop;// ex msg_id    is a string , no confidence,type ....
        }
    }
    return myint;
}






// const  { ActionsAdapter } =require('./actions_adapter.js');let actions_adapter;
const action2adapter=require('./action2adapter.js');
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function waitAsync(pArr_){// not used !!
    //console.log('promstack start with array on  ',pArr.length);
    if(pArr_&&pArr_.length==0)return;
    var job=pArr_.length,counter=14,i;
    for(i=0;i<pArr_.length;i++){
       // console.log('promise fullfillment registration ',i);
      pArr_[i].then(function(val){
              console.log('promise resolved ',val);job--;}
                   ,
                   function(err){
              console.log('promise failed ',err);}
                  );
     
    }

   
  // check every second to see if callstack is empty
  var interval = setInterval(function() {
    counter--;
    if (job<=0||counter==0) {
      clearInterval(interval);
       if(counter==0) console.log('aiv3.init() timeout : do not complete async funcs  in assigned time');
      //doSomething()
    }
    //console.log('1 sec l check job is ',job);
  }, 300);
}

function propof(objj,context){
    console.log(' aiv3 find a property on context: ',objj);
    for (var name in context) {
        if (context.hasOwnProperty(name)) {
            console.log(' adaptermw find a property on obj : ',objj,' property: ',name);
        }
      }
}


//const userState_1 = require("./userState");// todo 
const { UserState } = require('botbuilder-core');
const util = require('util');
const adapter_mw=require('./adapter_mw.js');// static ? or as instance property ?

// from config :


//const  intentskill=require('../skill/intentskillsxcms')(this._controller,this);
var intDataModels, dialog, root,services// set in init() , intDataModels={ dialog, root,services}
    userExpressCtls,

    expressCtl// expressCtl will be returned userExpressCtls
/*      
    20092019 expressCtl ( ctls middleware associated with after and onchange) will :
         support onchange and after botkit cb with model matching 
         so after it runs :
           - set some var that can be used by cms condition and message templates context
           - set session that will be inserted on msg to send when send middleware will be called 
                    specifically will set ctx that will be added in msg  by send middleware when bot.say will be called
           - launched some convo x dialog rooting and bot.say ( if cms complete and not  goto to some other cmd)


*/
;

var botkithandleturn = function (turncontext) {
    // pay attention this is by middleware so i must set the same on last call  
    // surely it will call  from botkit obj , botkit.handleturn() so this is botkit itself 

    // get updates status property from accessor , like as done in  async dialogSet.createContext(context) with  async createContext(context) 
    const session = this.sessionAccessor.get(turncontext, defval = lastsession);// from accessor get the updated state property (tc x what ???)
    //const session1 = this.sessionAccessor.get(turncontext, defval = lastsession);
    session.turn = session.turn++ || 0;
    console.log('appctl, handleturn,  new message coming , turn ', session.turn, 'session : ', session, '\n session1 :', session1);
    turncontext.session = session;// add to turncontext instead of dc that dont get touch 
    // turncontext is available from conversation as :
    // dc.context.session

    // return this.handleturn(turncontext)// will run with this this obj !!!

    //    return this.handleturn.call(controller_,turncontext)// will run with this= controller_ and not this obj  !!!

    // but what is this set by the botkit caller ( a middleware !)
}
var repl = function (replace) {  //  see https://stackoverflow.com/questions/10057931/how-to-replace-javascript-prototype-with-custom-function
    // Cache the original method
    botkit.prototype.handleturn = async function () {  // Redefine the method
        // Extra function logic here
        botkithandleturn(arguments);
        // Now, call the original method
        return replace.apply(this, arguments);
    };
};//)(botkit.prototype.handleturn);

const Merge_LastMessage_CompleteNextPageHelloVui_ = function (bot, msg, next) {
    // TODO
    next();
}

const injectAIonVars = function (bot, msg, next) {// see in there are msg.query. set by botkitmiddlewares v 0.7 

    // not used here !!! INFACT :using cms the ingest middleware for ai intent matchwill be run on cms server !!

    // middleware can be used in ingest to try match for a new user dialog with a external ai . if use cms it will try to match incoming hears calling ai.
    //      >> so if using cms th middleware will be run on cms server .

    // inside a convo , after a ask we usually set the next ask/goto message so the next entity to match belongs a mandatory intent and will be the 
    // onchange of the manadatory intent msg to  rest a ai to resolve the entities of the current intent . 
    //      >> so the same middleware of pevious case will be launch by onchange of the mandatoryIntent/askField  




    // or better botkit-cms package api.js api.enrichMessage(msg:text) returning :
    let query = {
        text: msg.text,
        intents: [int1, int2],
        entities: [ent1, ent2],
        luis: originalobjreturnedbyluiss
    };

    /* 20082019 
        if message has nowaiting convo to progress is sent to cms server  x hears or intent detection according to inserted cms triggers
            see cms.testTrigger ( and .evaluatetriggers )  called by event handle set on controller.ready() in bot.js : 
                    testTrigger calls evaluatetriggers :
                      -if a trigger match (best) we insert on triggered.variables all entities not alredy in the predefined variables list :
                        triggered.variables=[{name,value,type},... + luis:query ]
                    that return command=triggered=scripts['matchedintent'] + {luis} 
                    so if not command returned  bot.beginDialog(command.command) will be called that process the msg set by handleTurn THAT
                        is not aware of entities returned in command 
        TODO TODO
                        >> so trasfer the entities to msg in order that onchange of the just engaged convo can transfert the entities on local .vars matches

                        >> also in injectAIonVars() do the same call to cms.apy.richmessage to do the same thing when receiving a msg that will be assign to the engaged convo
    
    */

    let msg_text = msg.text;
    return query;
};
//let actions_adapter;

class appCtl {//spostare in modulo esterno e settare in index un export a questo file
    constructor(config, ctlopn) {
        /**
         * Botkit Plugin name
        idea base fare 
        askconvo[colore,taglia],,handler([giallo,medio],convo,bot)) 
        will receive this entities request , then askconvo with a cb that add resolving of entities and then pass to user cb
        
        */
        this.name = 'appctl';//'Botkit AppCtl';
        this._config = config;
        this.ctlopn = ctlopn;
        this._controller = null;// will be set in init(botkit)
        this.intentskill = null;
        this.initAppF=[];// exclude from loadHandl()
        // old staff ? 
        //              this.onChange_dynField = _onChange_dynField;// is a function so add as prototype !!!!!!!!!!!
        //this.addConditionInMessage = false;
        if (config.addConditionInMessage) this.addConditionInMessage = addConditionInMessage;
        // 20082019 middlewares see 
        // in  registerPlugin will be registered on this.middleware[endpoint].use()
        /*
        this.middlewares={};
        let endpoint='receive';// 'ingest','send'
        let midfunc1= injectAIonVars;//function(bot,message,next){next();};
        let midf={};midf[endpoint]=[midfunc1];
        this.middlewares={};*/

        this.routeMid=routeMid;
        this.middlewares = {};
        let endpoint = 'send';// 'ingest','send','receive'
        let midfunc1 = Merge_LastMessage_CompleteNextPageHelloVui_;//function(bot,message,next){next();};
        let midf = {}; midf[endpoint] = [midfunc1];

        if(config.actions_adapter)this.actions_adapter=config.actions_adapter;
        if(config.ai){this.aiserv=config.ai;// wit.ai compatible agent created on bot.js (normalized api ) :
            //      aiserv={Witcompatible ai agent factory, token:process.env.AiToken}; // token is : app std/base agent, token is an attribute from wich build the agent x specific intent section 
            //  >> see bot.js


          //  this.aiclients={};//  filled by inplementation of witai2activity 
           // no more : this.aiclient=this.aiclients[aiserv.token]=new Wit({accessToken: aiserv.token });// base ai, mapped by token
             // data=client.message('set an alarm tomorrow at 7am');
        }
        
    }
   
    // just x study :
    //getbdhttphelper(_db,_http){var extended=Object.assign(this,that);return this.onChange_dynField.bind(extend);}

    // just x study :
    // like a plugin but here we are shure that the function is available only when db and http are set ( plugin set)
    // getbdhttphelper1(db,http){var extended=Object.assign(this,{db,http});
    //     extended.onChange_dynField=_onChange_dynField;return extended;}

    setDbHttphelp_in_res(db, http) {// make this fw ( will be provided model support) implementation of a service helper,FwHelpers, available  in intent_data_models  
        // so in  intent_data_models  we can se this fw helper in defining service 
        //              >>> for example  intent_data_models  is used in httpService (set in service) to do rest and mongo query


        //FwHelpers=FwHelpersMaker(db,http,this);
        // or 

        //  here FwHelpers (generated by dynServHelperConstr()  ) can be a module  , available as  ref (to be upgrade by developers) 
        //      it will be put in res.dynServHelper  and is returned in intent_data_models (the caller)    that make it avaible in dataservice 
        //      so  dataservice can call direclty  FwHelpers with its refImplementation and aiv3 api
        // nb dynServHelper can be moved in any alone module as not use any of var in this module scope 
        return FwHelpers = new DynServHelperConstr(db, http, this);// FwHelpers can have this=aiv3 functions available , db connection and model schemas available are configur by user in intent_data_models
        //  FwHelpers={DynServHelperConstr+aiv3+refImplementation:{ onChange_dynField:functiontoextractdynfield}}, have assigned aiv3+refImplementation references !
    }





    // no good
    //onChange_dynField_Fact(db,http){var that=this;
    //    return {db:_db,http:_http,onChange_dynField:_onChange_dynField};}

    /* example AiaxMongoConstr see : https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    function Product(name, price) {
      this.name = name;
      this.price = price;}

        function Food(name, price) {
            var ext={db:'mydb'};
             var extended=Object.assign(this,ext);// or simply extended=this;
            Product.call(extended, name, price);
            this.category = 'food';
            }*/
    /*  OK : 
        onChange_dynField_Fact () {// return a constructor that extend another constructor
            that=this;
            return function(_db,_http,param){// well call new obj.onChange_dynField_Fact(db,http,null);onChange_dynField_Fact will be called with this creating instance
            var ext={db:_db,http:_http};// useless
            var extended=that;//Object.assign(that,this,ext);// ext is useless !
            (function(_db,_http){
                this.db=_db;this.http=_http;
                this.onChange_dynField=_onChange_dynField;// this in the function is this,that and db + http
            }).call(extended,_db,_http);
            this.category = param;
            }*/

    //  onChange_dynField(x,y,z) {return _onChange_dynField(x,y,z).call(this);}
    // appCtl.prototype.onChange_dynField=_onChange_dynField;

    setsession(tc, message) {// dont need anymore
        message.session = this.userstate.get(message.context, defval = lastsession);

    }
    // 
    configureActionsEndpoint() {
        let webserver=this._controller.webserver;
        if (webserver&&this.actions_adapter) {
           
            /*
            this.webserver.post(this._config.webhook_uri, (req, res) => {
                // Allow the Botbuilder middleware to fire.
                // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
                // which we can then use to turn into a BotkitMessage
                this.adapter.processActivity(req, res, this.handleTurn.bind(this)).catch((err) => {
                    // todo: expose this as a global error handler?
                    console.error('Experienced an error inside the turn handler', err);
                    throw err;
                });
            });*/
           let logic=this._controller.handleTurn.bind(this._controller);
           // let logic=this.handleTurn.bind(this);
            action2adapter(webserver, this.actions_adapter,logic);
        }
        else {
            throw new Error('Cannot configure webhook endpoints when webserver is disabled');
        }
    }

    init(botkit) {
        // not async func  so as cant wait all asyncfunc fired we must laer check the staff are done by async function that cant be waited here  
        this._controller = botkit;
        //this.cms=botkit.plugins.cms
        console.log(' appctl, init called');
        // this._controller.addDep('appctl');followed by :
        //debug('Dialogs loaded from Botkit appctl');
        //this._controller.completeDep('appctl');

        // add actions adapter like bot added webadapter 
        //actions_adapter=new ActionsAdapter();//
        if (this.actions_adapter) {
            // MAGIC: Treat the adapter as a botkit plugin
            // which allows them to be carry their own platform-specific behaviors
            console.log(' appctl, init loading actions adapter plugin ');
            botkit.usePlugin(this.actions_adapter);
            
           // run after changed the botkit handleTurn   
           // if(this.actions_adapter) this.configureActionsEndpoint();
        }
        



        // Extend the controller object with controller.plugins.cms
        botkit.addPluginExtension('appctl', this);
        console.log(' appctl, exiting addPluginExtension ');
        intDataModels = require('../' + cnfl.intDataModels)(this, this._controller);// returns intDataModels= {dialog,'root':{rootcfg},,,,,}
        console.log(' appctl, exiting intdatamodels ');
        if (intDataModels){ dialog = intDataModels.dialog; root = intDataModels.root;services=intDataModels.services;}
      // var  { dialog,root,services}=intDataModels;

        expressCtl = require('../' + cnfl.userExpressCtls)(this, this._controller);// set intdatamodels ref  .  return expressCtl=middlSet(midlConfig);

        var that = this;

        /* middlSet
        
                var expressCtl = routeMid();
                expressCtl.use('cfg', userExpressCtls.mng.endCmd_Bl_Routing_Cfg);// cfg the following
        
                expressCtl.use('endAsk_Cmd', userExpressCtls.mng._Route_On_AskConvoEnd);
                
                // 		 29072019 , ehnancements:
                //	TODO > call directly the user config  BUT MOVE ALL middleware build configuration on expressCtl BECAUSE 
                //		it is there to put the user config 2 level middleware chain!!!
                
                intDataModels[page].Route_On_AskConvoEnd[req.cmd].forEach(value > expressCtl.use('endAsk_Cmd',value))
        
                //		so as .use is called on the same name 'endAsk_Cmd':
                //			will build a array of ctl that will be chained 
                //			we can add a fulfill value to the controlling loop promise  es -2 tosay goon to next 2.2 level
                //	Details :
                // probably the userctl passage is useless so i can call directly 
                //		intDataModels[page].Route_On_AskConvoEnd[req.cmd](req, res, next);
                // but as a array , so the express ctl .use,.get.post are a chain of ctl that can visited 
                //		if i call next() (cb version , how to do using promises ?)
                // so this middleware has 2 level level 1 is 2 level 2 middleware :
                //		l2.1 : the middleware that manage the view of a ask (accept match, confirm or do info about the match )
                //				 or the controller of a ask What to do with the ask matched 
                //					( a aiax after a button press or the angular controller level)
                //				usually just a controller ( so the chain is a [] of 1 element) .get in express that return a json to a aiax call 
                //				after ended the 2.1 chain :
                //				return to level1 1 that call level 2.2
                //						or just manage the level 2.2 ( that set the param to call the rendering function : send,render,convo)
                //		l2.2 : the middleware that manage the end of a transaction/form/dialog so process it as in post or a angular service
                //				this level will complete the bl and routing level so can set the  right  :
                //				> param to call the rendering function : send,render,convo
                
                //		nb each ctrl will return the controlling loop promise that fullfill with : ( nb we changed 0 with -1)
                //				-1:stop any chain ctl and final cb(send_), the rendering function are called in the current ctl 
                //						(also no call)
                //				1: go on next step
                //				0: stop and call the final cb that usually fills the rendering function with the param set
                //				-2 : see above
                //				
                //				the level 2.2 has :
                //					- post bl+routings that works on action proposed by level 2.1 , 
                //						usually is the name of the ask/cmdif is a after
                //						if null means it must do all staff without the 2.1 indication/suggestion
                //						if action = done , means all staff are done by lev 2.1 ( ask or after) so do nothing
                //				 	- fills data x external vui/ai modules so can be sent on next message on msg.data (by send middleware ?)
                // 			last cb will usually chech if it must send the rendering function looking at the params that must be set 
        
                // 30072019
                  //function cmsSend(
                  //function cmsRender(
                  //function send_(// will use cmssend and cmsrender
                  // so :
                  // formatting response helper : 
                  //	res.convobot obj (passed to all chains 1.x and 2.x) with 
                  //			res.convobot.set({convogoto:'',botstrnewcom:''}) and res.convobot.send() (usually fired by lastcb if see good params)
                  //	res.cmscondition obj (passed to all chains 1.x and 2.x) with 
                  //			res.cmscondition.set(cmscondparm) and res.cmscondition.send() (usually fired by lastcb if see good params)
                  // run ctl chain on onchange or after cb (2.1 level):
                  //		- do bl and build routing and say to 2.2 action or setaction(x='done') 
                  //			set also desidered results setting the formatting helpers param in order to let 2.2 and 1.1 to
                  //				complete the param setting and 
                  //					> let the lastcb to fulfill the response according that param or
                  //					> call youself bot.  and convo. ( but unless you need to run some 2.2 and 1.1 lev ctl !)and 
                  //							return -1 that means stop the chains with or without the lastcb=send_
                  
                  //		- or ask next 2.2 to do that setting condition or setcondition(x='action/theaskorcmdname')
                  //		- let lev 2.2 to add dyn automatically according to dialog
                  //		- let 2.2 to fullfill ctx data x external service passsing the same dyn field as used in dialog
                  // b) let lastcb=send_ to fullfill the request completed previous ctls and returns 
                  //		usually send_ will return using    see xxx  
                  
                expressCtl.use('pageDisp', userExpressCtls.mng._Route_onPageEnd);// move here the dyn part and make it available to vui ctl
                expressCtl.use('dyn_vui', rout_insdyn_insvui);
        
        */  // end middlSet

        /* overview to start convo : 

        * The bot can add dialogs or prompts to the set using the [add()](#add) method:
        *
        * ```JavaScript
        * class GreetingDialog extends Dialog {
        *     async beginDialog(dc, options) {
        *         await dc.context.sendActivity(`Hi! I'm a bot.`);
        *         return await dc.endDialog();
        *     }
        * }
        *
        * dialogs.add(new GreetingDialog('greeting'));
        * ```
        *
        * To interact with the sets dialogs you can call [createContext()](#createcontext) with the
        * current `TurnContext`. That will create a `DialogContext` that can be used to start or continue
        * execution of the sets dialogs:
        *
        * ```JavaScript
        * // Create DialogContext for the current turn
        * const dc = await dialogs.createContext(turnContext);
        *
        * // Try to continue executing an active multi-turn dialog
        * const result = await dc.continueDialog();
        *
        * // Send greeting if no other dialogs active
        * if (result.status == DialogTurnStatus.empty && dc.context.activity.type == ActivityTypes.Message) {
        *     await dc.beginDialog('greeting');
        * }
        * ```
        
        // from controller accessor
        //  as in case of :
        // contoller.handleturn(incoming turncontext message)  > createcontext > dc=newdc(dialogs=dialogset,state=dialogstate.get(turncontext,defval),turncontext) > 
        //  bot=spaw(dc)


  
        when in bot we create  botkit=controller intantiation we create in controller : 
          conversationState,its accessor dialogState and dialogSet = new DialogSet(dialogState) 
            and the adapter (wss=new botbuilder-adapter-web) set via config obj 
                that, as is a plugin, calls usePlugin(adapter):
                    that as adapter.middleware=new MiddlewareSet()
                        will add all middlewere in adapter.middleware[mw].x into controller.middleware[mw]
            
        so when a channel ws connects calls wss.createSocketServer() 
            that set up a ws connection that as message got calls :
            on('message',cb(payload){

                    message = JSON.parse(payload);
                    // note the websocket connection for this user
                    ws.user = message.user;
                    clients[message.user] = ws;
                    // this stuff normally lives inside Botkit.congfigureWebhookEndpoint
                    const activity = {
                        timestamp: new Date(),
                        channelId: 'websocket',
                        conversation: {
                            id: message.user
                        },
                        from: {
                            id: message.user
                        },
                        recipient: {
                            id: 'bot'
                        },
                        channelData: message,
                        text: message.text,
                        type: message.type === ....
                    };
                    // set botkit's event type
                    if (activity.type !== botbuilder_1.ActivityTypes.Message) {
                        activity.channelData.botkitEventType = message.type;
                    }
                    tc=context = new TurnContext(this, activity);
                    this.runMiddleware(context, logic)

                    where in super BotAdapter the middleware = new middlewareSet_1.MiddlewareSet();
                        was added calling wss.add(middleware handlers)
                
            })
               
        
        
            ...... we have the related status in dialogState accessor

        
        , 
        //  add a accessor in this controller plugin : sessionAccessor with key 'session'

        - now when message comes to ctl controller.hundleturn() will be called : 
 
                (see https://github.com/microsoft/BotBuilder-Samples/blob/master/samples/javascript_nodejs/45.state-management/index.js
                  that is like in example statemanagementbot where 
                    in bot.js we declare 2 status manager to use : conversationalstate and userstate
                  the controller statemanagementbot when instantiated register 2 accessor on  conversionstate and userstate :

                        const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');

                        // Create conversation and user state with in-memory storage provider.
                        const conversationState = new ConversationState(memoryStorage);
                        const userState = new UserState(memoryStorage);





                        userprofile=userstate.createproperty('userprofile')
                        conversationdata=userstate.createproperty('conversationaldata')
                  
                  when a message calls statemanagementbot.onMessage() 
                   where we recovered  the status  calling the accessors
                         conversionData (with key 'conversionalData'
                                conversionData=conversionalData.get(turncontext,init/default  obj)
                          userprofile (with key 'userprofile'
                                userprofile=userprofile.get(turncontext,init/default  obj)                               
                   so use  conversionData.somefield and userprofile.somefield in read or write
                   before answer to user with turnContext.sendActivity(msg)

                )


            - to start convo contained in dialogs of dialogsets we need to create a dc asking dialogset :
                
                        controller 
                        /// BBB :  message.session=userstate.get(turncontext,ifVoidSetInitstate=appctl.getlastusersession(user.id)})


                        this.dialogset.createcontext(turncontext) { AAA}
                
                
                
                    that create  dc, setting dc.stack  (is the property dialogstack of the status obj={dialogstack:[]})that is  used to contain the status of a running convo : stack[i]=instance{id,statusofarunningconvo}
                        so stack is the status of the dc running convos ( convos are listed on dialogset.dialogs)
                            stack=state.dialogstack was set using the dialogstate accessor  dialogstate : state=dialogstate.get(turncontext,ifVoidSetInitstate={dialogstack:[]})
              
                            todo : add also a users status var recovered with userstatus accessor ( in AAA or BBB) in its caller  :
                                     session =userstate.session was get/set using the userstate accessor  : session=userstate.get(turncontext,ifVoidSetInitstate=appctl.getlastusersession(user.id)})
                                    where appctl.getlastusersession(user.id) is not void if there was a previuous page/dialogset that chained in appctl the user to a new page      

                                and add for semplicity session to message !


                            so when dc was asked to start one of the dialogset.dialogs : dc.begindialog() 
                    a instance will be added on top of the stack: stack[top]=instance{id:id,state:statusofarunningconvo={}}
                    and a botkit conversation can start using as status_ the status of top instance(active  convo)  in dc.stack : status_=stack[top].status as a status obj 
                    conversation.beginDialog(this=dc,options) {status_=status_; ...}

                    in std conversation state was so used :
                        at start :
                                        state.options = options || {};
                                        state.values = Object.assign({}, options);
                                            options={
                                                    thread:x,
                                                    stepIndex:0,
                                            }






                 when a convo was resumed the status recovered .....  



                 .......
                
            ??? >>>>>>> so if we need session var we can  inject session recovered on last channel used by uset 
                    into a session var inside 

        //   

        //  calling session=sessionAccessor.get(turncontext,init/default  obj) in ....
        
        conversation....
            */


        // create a accessor from conversationStete as done in core/botkit with
        //      dialogState = this.conversationState.createProperty(this.getConfig('dialogStateProperty')); 

        // async  init(botkit) {
        // 
        this.sessionAccessor = botkit.conversationState.createProperty('session');// will be used after

        // OR
        // from userState , but is the same as in bot kit convarsation is with 1 user
        // var userState = new BotkitUserState(botkit.storage);// todo
        // this.sessionAccessor = userState.createProperty('session');// error because alredy used ??
        // but need to add in core await this.userState.saveChanges(turnContext, false);




        this.lastsession = null;// starting session for first msg
        // is null this.handleturn=botkit.handleturn;
        /*
        var botkithandleturn=function(turncontext){
            // pay attention this is by middleware so i must set the same on last call  
            // surely it will call  from botkit obj , botkit.handleturn() so this is botkit itself 
            const session =this.sessionAccessor.get(turncontext,defval=lastsession);

            session.turn=session.turn++||0;
            console.log('appctl, handleturn,  new message coming , turn ',message.turn,'session : ',session,'\n session1 :',session1);
                turncontext.session=session;// add to turncontext instead of dc that dont get touch 
         // turncontext is available from conversation as :
         // dc.context.session

               // return this.handleturn(turncontext)// will run with this this obj !!!

            //    return this.handleturn.call(controller_,turncontext)// will run with this= controller_ and not this obj  !!!

                // but what is this set by the botkit caller ( a middleware !)
            }
           
// ciao    
(function(replace) {  //  see https://stackoverflow.com/questions/10057931/how-to-replace-javascript-prototype-with-custom-function
    // Cache the original method
    botkit.prototype.handleturn = async function() {  // Redefine the method
        // Extra function logic here
        botkithandleturn(arguments);
        // Now, call the original method
        return replace.apply(this, arguments);
    };
})(botkit.prototype.handleturn);
 */

    // extend botkit.handleturn adding a overture than call it . we could also just copy then modify then redefine : botkit.handleTurn={}
        //repl(botkit.prototype.handleturn);
        var bkhtp = botkit.__proto__;
        var bkht = bkhtp.handleTurn;// intercepted method 
        var gthy = async function (turncontext) {  // Redefine the method
            // this must be botkit 
            // Extra function logic here
            console.log('appctl, handleturn,  new message coming , turncontext ', turncontext);


            // pay attention this is by middleware so i must set the same on last call  
            // surely it will call  from botkit obj , botkit.handleturn() so this is botkit itself 
            var session = await that.sessionAccessor.get(turncontext, { session: {} });// that also will init the accessor if null

            /*  session.then(function(res,rej){gthy2.apply(this,turncontext,res)});
           
               }
               var  gthy2= function(turncontext,session) { 
           */
            session.turn = session.turn++ || 0;


            turncontext.session = session;// add to turncontext instead of dc ? what is better  modify ?
            // turncontext.session is available from conversation as  dc.context.session

            console.log('appctl, handleturn,  new message coming , user ',turncontext._activity.from.id,', session.turn: ', session.turn, ' turncontext: ', turncontext);

            if(turncontext.activity.channelData)  propof('channelData',turncontext.activity.channelData);

            // Now, call the original method
            // in return await is useless 
            return await bkht.call(this, turncontext);// as known return await is the same as return ( both if the value is a promise or a object)
        }
        var gthy1 = function (turncontext) {  // old , Redefine the method
            // this must be botkit 
            // Extra function logic here
            var that2 = this;
            console.log('appctl, handleturn,  new message coming , turncontext ', turncontext);


            //var sessionp =  that.sessionAccessor.get(turncontext,{session:{context:turncontext,conversation:turncontext.conversation}});




            /* session mngment
            each turn we recover state with 2 state accessor :
            using dislogState we recover sate obj and set stack=state.stack into dc 
                            const state = await this.dialogState.get(context, { dialogStack: [] });// so state was init to state={ dialogStack: [] }

                                    nb state was used also by conversation in onstep and runStep :
                                    
                                    state.stepIndex = index;
                                    state.thread = thread_name;
                                    state.values 
                                    state.options 

                                    state attr are used in      runStep(dc, index, thread_name, reason, result) :
                                    step.results=result // result The result of the previous turn if any , can be a previous thread vars o after a ask prompt the user speech
                                    state.values > step.values=state.values > convo.vars in onChange(convo,,,,,,)
                                    state.options > step.options=state.options
                                    also step was added to step.state=state

                                    nb when change thread usually start a runstep with result=current step.values


            using sessionAccessor here we recover settion obj and attach in tc to make available to conversation.step staff 

            // session will take user sesssion across all channel dialoges (ws channel)
            session{            copied to vars.session
                     matched :{
                                cmd:{
                                        field: {value:  'red'} copied to vars.field=field.value on ask key=_field
                                        or 
                                        field: {ents:   {color:'red',number:'34'}} copied to vars.field=field.ents  on ask key=__field
                     }

                     }
            }
            session.matched.command.field={value:null};// example session.matched.colorcmd.name.value
       // if scalar asksessionmatch={value:'red'}  if vector asksessionmatch={entities:{color:'red',number:'34'}};

            */


            var sessionp = that.sessionAccessor.get(turncontext, { session: {} });// a promise 
            var session;


            var pp = new Promise(function (resolve, reject) {
                // new Promise (function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }

                function fulfilled(value) {
                    console.log(' aiv3.handleturn(), user ',turncontext._activity.user,'   recoved session ',value);
                    try {
                        session = value;// the session obj is recovered from status  by sessionAccessor.get()


                        session.turn = session.turn++ || 0;
                        turncontext.session = session;// add to turncontext instead of dc that dont get touch 
                        // turncontext is available from conversation as :
                        // dc.context.session

                        console.log('appctl, handleturn,  new message coming , turn: ', session.turn, ' turncontext: ', turncontext);

                        var retfromctl = bkht.apply(that2, turncontext);// call botkit part
                        console.log('appctl, handleturn,  ctl ret : ', retfromctl);

                        resolve(retfromctl);// pp is fulfilled with the original botkit promise
                    }
                    catch (e) { reject(e); }
                }
                function unfulfilled(e) {
            console.log(' aiv3.handleturn() user ',turncontext._activity.user,'  cant recover status ',e);reject(e);
            }

                //sessionp.then(fulfilled, reject);// chain  the promise fulfillment (the session in status) with this one (pp) staring the  , 
                sessionp.then(fulfilled, unfulfilled);// chain  the promise fulfillment (the session in status) with this one (pp) staring the  , 


                 // >>can return  sessionp.then(fulfilled, reject) , were in fulfilled i return retfromctl 
            }

                //step((generator = generator.apply(thisArg, _arguments || [])).next());
            );
            return pp;

        }
        //

        /*
                var checkgthy = function () {  // Redefine the method
        
        
                    var sessionp = that.sessionAccessor.get(turncontext, { session: {} });
                    var session;
                    function fullfilled(value) { console.log(' session ok ', value); }
                    function reject(value) { console.log(' session no ok ', value); }
                    sessionp.then(fulfilled, reject);
                }*/

        //console.log(' session check lauched ');


        botkit.__proto__.handleTurn = gthy;// overwrite  botkit.handleturn with the new one 
        // botkit.__proto__.handleTurn =gthy1;
        //checkgthy();

        if(this.actions_adapter) this.configureActionsEndpoint();// using  as logic the overwritten handleTurn : gthy 

        

        // done in ctl  botkit.addPluginExtension('appctl', this);// will be available with  botkit/controller.plugin.appctl
        // not necessary  this._controller.completeDep('appctl');


//  SET MESSAGE MIDDLEWARE BOTKIT + ADAPTER ,
//  probably just adapter can be enough in case web_adapter.sendActivities would be called after the await next() in adapter_mw : not happend !!!
//      otherwise we must add session to message in turnContext.sendActivity  extending it as done for handleTurn ? or just modify turnContext.sendActivity() on its js source

        botkit.middleware.send.use(function(bot, message, next) {// temporarely  then TODO : add session to message in turnContext.sendActivity extending 
            // register send middleware 
            // problem : seems this botkit middleware is called only in bot.say before call  dc.context.sendActivity that calls web_adapter.sendActivities
            // but if the message is sent direcly by conversation in onstep()that calls direcly dc.context.sendActivity(this.makeOutgoing(line, step.values))  without fire botkit middleware 
            //   > so send middleware cant work in that case so is better to add code in  turnContext.sendActivity !!!! 
            // QUESTION : but is here message or activity ?????????????????  see botworker.say()

            let tc = bot.getConfig('context'), session = tc.session;
            // log it
            console.log('send middleware called , channelData : ', message.channelData);
        
            // modify the message
           // message.session = session;// will be put in activity. ......
        
            // continue processing the message
            next();
        
        });

        // TODO adds receive middleware in adapter not in bot kit , see BotBuilder Adapter Middleware in botkit docs


    // set adapter middleware , here or in   initAppFw ?, 
    var adaptercont;// a fw var or definition to pass as param to middleware adapter_mw
    // botkit.adapter.use(adapter_mw(adaptercont));
     adaptercont=1;
    // botkit.actions_adapter.use(adapter_mw(adaptercont));
 
    }// ends init()

   
    initAppFw(initAppF_) {// here define field ctl  must exclude field to load with loadHandl() :      initAppF=['actltoionsertherte',,,,]
       // this.initAppF.push('_problemtosolve');this.initAppF.push('nome');this.initAppF.push('sportello');// temporary 
       // initAppF_ starti<ng list on onchange set alredy in bot.js , as onchange defined here wont be added by   loadHandl
       if( initAppF_)this.initAppF= initAppF_; else  this.initAppF=[];
        var cms = this._controller.plugins.cms;
        console.log('pppppppppppppppppppppppppppppppppppppp manual onchange',this.initAppF);
        //  this.intentskill=require('../skill/intentskillsxcms')(this._controller,this);

        /* from cms loaded copy models to user intentskill (def file )
        // if using the voice support the user do not use build dialog using feature file because use cms to build dialog
        //  + before, after, and onchange handler that will receive fw supprt at first level:
                - m2using onFWchange ( like convoask)  if we want only entities support models
                - a mi resolver  handler if want also fooc support m2 
                - m1 to auto get intent and entities in new convo match and in in-convo entities resolver
                        (in convo named preferred intent )

        */

        ///*

        // part one : register a hears manually that will search for session.intents 
        // if found start a convo that dont have a resolver default thread
        // that can be a cms or normal convo with name=intentname caling find convo(intentmatched)
        // if was a std convo in pass entities to convoask handler ....



        var usrname = 'usrname';// set by aiv3 when loading from cms server : for all fields on convo )
        this.initAppF.push( usrname);
        cms.onChange('whatcolor', usrname, async (new_value, convo, bot) => {
 


            /*
            27062019
            cms when load will provide to load also register a std onchange with name of convo and field on  closure so 
            that 
            when find in a thread a collect with multiple fields key=fields='field1,field2'=intentx_fields
                instead of do a convo ask on 1 field 
                    so ask for a key repeating till it 
                        onchange will resolve the condition say sometrhing ( a:ask conf or b:calc directly the query) and goon on this thread leaving  condition gotothread
                            so if the condition see a match will 
                                a:continue on this thread on next ask we can ask confimation and process the key got putting in a field used in next thread 
                                b: goto next tread to present the query result without ask confirm
                                read
                        or onchange will b:calc directly the query and goon on next thread directly

                in case of many entities i can go to a childconvo that 
                        1 calc theentities with a chain of mixed initiative
                            fw will support the extraction of entitiy using the model          
                        2 calc all entities whit a fw onchange that resolves all entities then just end convo or overwrite the collected user
                             to manage end in condition 

                        3 no any childconvo because the .. intercept in session the intent filled set the subconvo vars and goon with the main thread 
  




                        
                        resolves a condition than goto next message that reply last key got and do some 
            general aiv4.fwOnChange(async(convo_name,fieldnames,new_value, convo, bot)) will be called
                        that will look for entities on msg or try to match all fields in the fields order 
                            fields='field1,field2'              
                            - if not found . ask for fields prompt then set repeat index -1 after ovewrite the prompt
              
                            - if found goon with the user part of handler with the entities matched in session
            
            */

            var answ = true;
            if (answ == null) {
                console.log('no answer found ', usrname);
                bot.say('Sorry, I\'m not sure what you mean');
            }
            else {
                console.log('testing fw support answer found ', answ);
                convo.vars.colorgot = 'xxcod';//overwrite the user speech to force condition to default continue or index++
                bot.say('ok you got answare :' + answ);
                // try to add dyn a new trhread that can dispatch at a thread or script dynamically 
                // depending on answ

            }
        });

        usrname = '_problemtosolve';// set by aiv3 when loading from cms server : for all fields on convo )
        this.initAppF.push( usrname);
        cms.onChange('whatservice', usrname, async (new_value, convo, bot) => {

            // just print vars adds a say and 
            // - goon with registered handrle 
            // - or goto tread or goto script 
            // -or change index -1 to redo this index


            var step = convo.step;
            var answ = null;
            if (answ == null) {
                console.log('onchange x ' + usrname + 'vars are ' + JSON.stringify(convo.vars, null, 4) + '\n step is : ' + JSON.stringify(convo.step, null, 4));
                bot.say('onchange x ' + usrname + 'vars are ' + JSON.stringify(convo.vars, null, 4) + '\n step is : ' + JSON.stringify(convo.step, null, 4));
            }
            else {
                console.log('answer found ', answ);
                convo.vars.colorgot = answ;
                bot.say('ok you got answare :' + answ);
                // try to add dyn a new trhread that can dispatch at a thread or script dynamically 
                // depending on answ

            }

            //   if(step.index>0)step.index--;

        });
        var usrname = 'sportello';
        this.initAppF.push( usrname);
        cms.onChange('whatservice', usrname, async (new_value, convo, bot) => {

            // just print vars adds a say and 
            // - goon with registered handrle 
            // - or goto tread or goto script 
            // -or change index -1 to redo this index


            var step = convo.step;
            var answ = null;
            if (answ == null) {
                console.log('onchange x ' + usrname + ' vars are ' + util.inspect(convo.vars, { depth: null }) + '\n step is : ' + util.inspect(convo.step, { depth: null }));
                bot.say('onchange x ' + usrname + ' vars are ' + util.inspect(convo.vars, { depth: null }) + '\n step is : ' + util.inspect(convo.step, { depth: null }));
            }
            else {
                console.log('answer found ', answ);
                convo.vars.colorgot = answ;
                bot.say('ok you got answare :' + answ);
                // try to add dyn a new trhread that can dispatch at a thread or script dynamically 
                // depending on answ

            }

            convo.vars.goon = true;

        });


    }

    loadHandl(command, message, bot) {// called by cms.testTrigger(bot, message) after got a match
       // this.initAppF.push('_problemtosolve');this.initAppF.push('nome');this.initAppF.push('sportello');
        console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',this.initAppF);

        /* remember here we come from cms.testTrigger
            so if in message are intents onchange in intentskill for the first message in default thread must not call 
            related childdialog to resolve the entities

         so we will register in command script/convo onchange that will then support a useronChange  in intentskills.convo.command.fields.field/collectname.onchange

        // if command.fields.field/collectname.entities exist means there can be a message.intent.entities that contains the scalar vector model for the 
            field(key) so before passing control to user onchage the registering onchange will copy the entities into vars.fw.matched.field.entities 
                    better indicate a model field/key with field* (vector) or field_ (scalar) so must be present a structure in intentskill or a log will warn

                so  , first thing it will do is that if there are entities in message can avoid to run child dialog
                or better :
                    if the field is xx* change the script to have a child dialog so jump into the child
                        that will be a chain of wf that in fwonchange will check if entities are in  vars.fw.matched.field.entities if so 
                        goto index+1 to test next entity till et the final check of the intent that return to parent dialog
                            first check also vars.fw.matched.field.entities.complete to go directly to final check
                    if the field is xx_ scalar just add a fwonchange that will resolve the model in intentskill then gotothread index++ so avoid 
                        to do the cms condition that really can be used to set the model and insert voice directive ( use also fields) 

        nb if we have entities in the middle of the thread means tht the intent is mandatory/alredyresolved/apreferredintent and has the name of the field

        nb the message in a ask with a scalr/vector field will nsert in text or use a session.pref_intent field that will say to ve that next intent will be
            mandatory/preferred as in case of a next context convointent/convo/command

        // problem who will load vars._command getting from intent.entites ?  a middleware or just a mano ?
        // for a std format of entiies the onchange can use a function here : appctl.tranferEntities(msg,convo.vars)


        >> scalar field_ :
        this.fwOnChange('whatservice', usrname, async (new_value, convo, bot) => {

            if usrname*_ is in intentskills.convo.command.fields.field/collectname.onchange
            session=
            

             cms.onChange('whatservice', usrname, async (new_value, convo, bot) => {// check this
                transferenttovars(new_value,name,intent=name,convo.vars.fw.matched.entities);// (transfer msg/session.intent to vars or) match scalar field
                return (await) intentskills.convo.command.fields.field/collectname.onchange(new_value, convo, bot,matched);// must be async 
                    usuall user onchange will just say ok get 'x' and skip to next index eventually do a aiax with values in vars
                    only in after a command we can use appctl dyn resolver so use  fwAfter() call 

             });
        }


         for ask that are not the first in default we can give support on model 
         for all ask in convo
            if ask(scalar or vector) is in resolver if want support of model 
            we can 
                cms.onChange('whatservice', usrname, async (new_value, convo, bot) => {

                    if usrname is in resolver :model=model.usrname
                    matched=match(new_value,model);
                    transfermatchedtovars(matched,name,convo.vars);
                    return (await) resolver.usrname(new_value, convo, bot);// must be async , will find the values as received by a childdialog

                }


            messages cannot be sent apart the initial new page prompt and the end convo respose ( next turn will be intent matched also preferred matched)

        */




        /* first : find each of cases 
         - this is a trigger default launch so copy the intent in mes to vars that will be available to all convo threads
                so vars.entity1  means vars.command.entity1
                infact if intents is null i usually will launch anyway the thirst goto command as a child command with name command_
                and also if exist the intent so i can fill missing entity  or if found an entity complete i can avoid any missing also the non
                mandatory and goto the final child confirm/ask that in its onchange will set a preprompt  in a preprompt field so that can be used 
                in returning first ask of parent as handlebars var in the ask message

                remember also to ad a fwafter and fwbegin supporting the user intentskill cb

         - is a intermediate ask vector field key=field* . 
            in cms is represented by a goto command call returming to next ask or ending after 
            so i lanch the child field dialog that will fill the vars.matched.field.entities and return to next ask message or after with the 
            vars.field.entities filled and a final child text prepromt in a preprompt field to be used in next message

         - is a ask scalar field so key=field_ 
            in cms is a usual ask message so i just search in msg entity if there is the match or go to a match functin to fill the
            vars.matched.field  key as the vars.field_ is alredy filled by user speech so i can call the user onchange that can add a preprompt
            for next ask and set index++ or add to user speech  a starting x$code so that the condition of the ask on matching the start x$code 
            can continue or do whatever it wants 

         examining the command i find that whatservice is whatservice_ or _whatservice so it has model scalar support supported by a user intentskill onchange 

        >>> see  save01072019.txt  :
            Json format received by cmd rest :
            scripts: [cmd1,cmd2] // cmd1.command='commandname', cmdx==$SCRIPT  is a command !
                cmdx={
                    "command": "whatcolor",
                     "description": "ask name and color",
                     "script": [
                                 {
                                     "topic": "default",
                                     "script": [
                                             {
                                             },,,
                                            ] 
                                    }
                                ]
                        }

            so  

                cmdx={
                    "command": "whatcolor",
                     "description": "ask name and color",
                     "script": [ script1,script2,,,] // : $THREADS=[ script1,script2,,,]
                        }


                        script1= // ==$THREAD=$SCRIPT.script[i]={topic:'default',script:[$LINE1,$LINE2,,]}
                                {// thread 1
                                  "topic": "default",
                                  "script": [
                                        {  // $LINE
                                        "text": [
                                          "dammi il tuo nome",
                                          "esempio luigi o francesco"
                                            ],
                                        "collect": {
                                             "key": "nome",
                                             "options": [
                                                     {
                                                        "default": true,
                                                         "pattern": "default",
                                                        "action": "repeat"
                                                      },
                                                      {
                                                         "pattern": "^\\w+$",
                                                         "type": "regex",
                                                         "action": "favorite_color"
                                                        },
                                                        {
                                                    "pattern": "^\\w+\\s\\w+\\s*$",
                                                    "type": "regex",
                                                    "action": "next"
                                                        }
                                                 ]
                                                }
                                  }// ends thread 1

            so dialogs in dialogSet is filled with that json but after mapped each line=
            dialog=dialogSet.dialogs[anamederivedby_script.topic]
            dialog.script={athreadtopic:[$_LINE1,$_LINE2,,]} 
            where $_LINEx is the json  $LINEx modified by  $_LINEx=mapFields( $LINEx)
                                  
            */

        // find TRIGGERED dialog :


        var dialog = this._controller.dialogSet.find(command);// NB NB local var (= name in  closure var ! ) 
        // cmdFields : for all threads, check all ask messages (steps), and add a onchange cb if declared in dialog

        // TODO  so i can also record this structure cmdFields  (cmd-threads-fields structure)  into dialog
        // Question : needs ?  when run this parser :here at run time ( bot prompt was answered by user and matched  a cmd) at botload 
        //			now: we	( download dialogs from cms) or in future :  offline ? 

        for (var thread in dialog.script) {
            if (dialog.script.hasOwnProperty(thread)){
                dialog.script[thread].forEach((line) => {
                console.log(' line called');
                if (line.collect
                    && (this.initAppF.indexOf(line.collect.key) <0)// not already set 
                    ) { this.fwOnChange(command, line.collect.key); }// add onchage fw cb each ask , each thread  of the matched cmd
            });
        }
        }

        /*
    var useronchange = intentskills.convo.command.fields.field / collectname.onchange;
    var userAfter = intentskills.convo.command.after;
    var field = usrname;
    //let tc=bot.getConfig('context'), session=tc.session;
    // var asksessionmatch=session.matched.command.field={value:null};// example session.matched.colorcmd.name.value
    // get session from cms.testTrigger ???
    // if scalar asksessionmatch={value:'red'}  if vector asksessionmatch={entities:{color:'red',number:'34'}};
    this.fwOnChange('whatservice', field);

    //072019 TODO ( in an upgraede : a Rel 2 on pay )
    //  for dyn field we provide a simple ask that must be managed by a onchange fw to select the item on query !!

        */


        // 072019 TODO : HERE OR WHERE ?????  this.fwAfter('whatservice', userAfter);






    }// ends loadHandl

    /*
    var fram_ctl; nb port all get-post fram_ctl inside fwafter 
    // infact the getpost  fram_ctl ctl is called by browser when it ends collecting form data to calc new page routing and new dyn param for next page ;
 
 
    // appctl excerpt:

 endconvo2: function (vuimessage, results) {
     // old to review :
     //  will :
     // build the waiting convo messages of the ended convo with 
     // * case a : (get ctl part) get a new page ( page intents resolvers ) after the hello comvo with start prompt
     //		- vui dyn + 
     // 		- gui rendered html card + 
     // 		- .vui dialog template

     // * case b  : action=0 : store intent results in session , goon this page with the already sent message or sent a consolidate msg  if asked to wai

     //		- store intent results in session 
     // 		- goon this page with the already sent message or sent a consolidate msg  if asked to wai
     // 		- .vui dialog template

     // * case c : action = 1, route (post ctl part)
     //		- do bl and route to next page , 
     // 		- start new page convo hello : calc(hbs) the page prompt


     var session;
     if (vuimessage && vuimessage.session) session = vuimessage.session;
     if (session&&results.action!=2) {// should be if gooon to framework ctl
         console.log(' endconvo2 , have session from bot, message is : ', vuimessage);

         // new 24122018 , frameWCtl() will : 
         // - after a last convo , route a successfull master intent , so  relay to a new page hello
         // - after a hello convo , calc dyn then goon new page calling bot.send 
         // - after a intermediate convo , see if we can fill a aiaxdyn then goon to complete some sub intent  calling bot.send 

         // updates intent resolved in session 
         // should be already done in endconvo :
         // if (!session.get)mergeResp(session, results.convoResp);// better do outside frameWCtl in case it will be put in rest service 

         frameWCtl(vuimessage, results);// put in rest service as patent pend.

     }

 }
 

    function frameWCtl(msg, results) {

         var action = results.action, session = msg.session,lastcmd=results.command;

     
         voiceEnabler.getPage(msg,lastcmd, { info: '' }, function (vuimsg_) {// adds some vui staff on session.ctx
             console.log(' appctl, frameWCtl , calling back from getPage ready to send vui message to client , msg : ',  vuimsg_,'\n   dyn : ',vuimsg_.dyn);
     
             // ****  copy the dynfield impacting navigator convo in dialog.dynamic[thedynnavigatorfield]
         
             sendxNewInt(results.bot, vuimsg_)
         });


 var voiceEnabler = {
      //  getPage SINTETIZED
 getPage: function (vuimsg, lastcmd, frameWInfo, cb) {// passare cb(mastercontext = map of dynmatrixs); 
     // will cb adding to vuimsg.session.dyn the vui data and dyn context 

     // >>>>  test if a entity with the dyn not resolved at get page to calc 
     //		 from current session state data(page,intent/form already processed)

     // >>>  rifatto updateDyn , x fare simile al postroute
     var session = vuimsg.session;


     var req = { cmd: lastcmd, msg: vuimsg };// session.curpage= is the new page !


     console.log('** getPage , calling gettings [curpage] , curpage : ', session.curpage, '\n msg is : ', req.msg);

     var restBank = null;
     
     getter_(session.curpage, req,// use intentskills.gettings and also cmd intentskills.skills_OnEnd routings
         function (skillcb) {

             // >>>  newpage is the action expected todo in buildVuiFram :

             console.log('** getpage, getter_ callingback  (intentskills.gettings ) :', skillcb);
                 newpage = skillcb.newpage||session.curpage;// can be curpage 

             session = vuimsg.session;// can be changed 

             // update session
             session.dyn = null;//reset
             session.prfInt = skillcb.pref;
             session.actContext = session.actContext || {};

             // >>>> The req1 : param needed by buildVuiFram :
             var req1 = { session: session, text: vuimsg.text, 
                 url: skillcb.newpageurl, // must be ever specified also if newpage=curpage ( or '' that's the same)
                 newpage: newpage, // if =curpage and has alredy called before means just add dyns of curpage 
                 cmd: lastcmd, 
                 rest: skillcb.dyncontent };


             fram_ctl.buildVuiFram(req1, function (fwCont) {// if newpage=null or curpage just do aiax on restBank

                 console.log('** getpage,calling  cnt_wk1/buildVuiFram(req) req: ', req1,
                     ' \n  buildVuiFram returned cb  param (the fw cont=hbscontext) : ', fwCont);

                 // set the client device :
                 if (voicebot) {
                 vuimsg.voiceEnabler = true;
                     var ctx;
                     if (fwCont) {
                         ctx = new Ctx(session.curpage, newpage, vuimsg.text, fwCont.vuidialogue, fwCont.json, session.dfContext,fwCont.vui);
                         if (guivui && fwCont.guivui) ctx.guivui = fwCont.guivui;// the form context x rendering (dyn+static)
                     } else ctx = new Ctx(session.curpage, newpage, vuimsg.text, null, null, session.dfContext,null);

                 } else {

                     vuimsg.voiceEnabler = false;
                 }

                 console.log('** ctx details :\n ', tree(ctx));

                 // ************  management symmary : dynamic/static declare fields and changing the curpage
                 if (session.newpage) session.curpage = session.newpage;// reset if we are in new page  

                 session.ctx = ctx;// add new page ctx to session x vui engine use , so at getpost we can clear this part of session 	
                 console.log('** getPage , callingback after add some vui to session ', session);

                 // >>>>  dynprompt :

                 var chkses = false;
                 if (chkses)// do not run 
                     checksession(vuimsg, function (updsession) {
                         vuimsg.session = updsession;// session will be used by vuiengine
                         cb(vuimsg)
                     });
                 else cb(vuimsg);
             });
         });// the get post ctl of cur page !
 }



// DETAILS of getPage

 getPage: function (vuimsg, lastcmd, frameWInfo, cb) {// passare cb(mastercontext = map of dynmatrixs); 
     // will cb adding to vuimsg.session.dyn the vui data and dyn context 

     // >>>>  test if a entity with the dyn not resolved at get page to calc 
     //		 from current session state data(page,intent/form already processed)
     // frameWInfo : seems useless !

     // call getWhereField ??? 

     // >>>  rifatto updateDyn , x fare simile al postroute
     var session = vuimsg.session;
     // or a session clone ? , if not, req shoud be enought and set also session !


     /* MNG SUMMARY 042019 : VUI data reference  
              ******************************** 
                  
                   ingest msg
                      v
                  | getpost() |
                          v	< session using msg.user set by user cli or (type + bot ws connection instance id)
                         msg , msg.session
                    |resolverconvos() > navigatorcnvos()|
                      v
                  results{lastmessages=sent say with waitEnd}
                      v
                  | endconvo > skills|
                        v
                       cmd , msg  > session updated 
                            v
                  |getter_() > gettings > route| 
                      v
                  skillcb={ dyncontent: start_dynFields, newpage: newpage, newpageurl: newpageurl, 
                             pref: dfContext,outContext:outContext}
                      v
                 req1 = { session: session, text: vuimsg.text, url: skillcb.newpageurl, 
                                   cmd: mastercmd, newpage: newpage, rest: skillcb.dyncontent };
                      v
                 |buildVuiFram()|
                      v	> store session updates
                   msg + session.ctx
             ********************************
                 details : 

              vuimsg (vuimsg.session vuimsg.text , ...) , has been update by getter_ ctl  !!!
                          skillcb are used to calc params used by app fw ctl to calc vui staff :

             session.ctx  fields used by veEngine :
             {
                 - pageprompt // =vuimsg.text used ?
                 - json // the json dyn matrix map x dyntab dynprompt and vui engine params
                     // >>>>  dynprompt , cam be set by buildVuiFram or added in client.js (dynprompt=msg.text):
                     // vui engine will expect hello prompt in its .vui  but it add also a dyn param dynprompt 
                     // the client using session.ctx ,or session.data, will call vuiengine vuiBuild()
                     // so it will add to json the param  dynprompt of value ctx.dynprompt set here in 
                     //			new Ctx( ,this.pageprompt=vuimsg.text
                 - curpage // = session.curpage ( newpage>curpage)
                 - newpage // not used 
                 - vuidialogue // vui template , not used 
                 - vui // vui rendered 
                 - dfContext // contex mng , ........
                 - guivui;// the form context x rendering (dyn+static)
             }
             session. fields  also used by client.js to call veEngine.BuildVUI():
             - voiceEnabler = true;

             So client.js or mycroft java  will use session.ctx  to call veEngine :

             veEngine.BuildVUI(vui,...............) // TODO to complete


      ******  SESSION UPDATE :
      gettingSkill=intentskills.gettings will add :
         vuimsg.text = vuimsg.text+skillcb.text
         session.prfInt
         session.actContext

     fram_ctl.buildVuiFram will add :
         ctx.curpage=session.curpage;
         ctx.newpage=newpage;
         ctx.vuidialogue = fwCont.vuidialogue;// the dialog html/xml description 
         ctx.guivui = fwCont.guivui;// the form context x rendering (dyn+static)
         ctx.json = fwCont.json;// the json add some new dyn for next curpage retry
         ctx.blacklst=[];
         ctx.pageprompt = vuimsg.text;// overwrite , keep vuimsg= consolidated waiting msg + end convo ctl prompt 
         ctx.dfContext = session.dfContext;
     ***** END MNG SUMMARY 
     */
    /*

    var req = { cmd: lastcmd, msg: vuimsg };// session.curpage= is the new page !

    // 	req : DATA USED BY Cnt_wk1
    //	session.newpagevar , session.curpage
    // 	req.session   .intents=[intentmastername:{	entity1:{},,,} , intentdetail1:{},,,

    console.log('** getPage , calling gettings [curpage] , curpage : ', session.curpage, '\n msg is : ', req.msg);



    // new instead of oldmyboundf run the user controller to do bl and define the cb restBank
    // to give the dyn query results to framework ctl so can insert in dyn matrix passed to voice engine or rendered in bot/webgui interface :

    // now call the registered user controller x the currentpage ( looking mostly at last cmd)

    var restBank = null;
    
    //if (gettingSkill && gettingSkill[session.curpage]) restBank = gettingSkill[session.curpage](req,
    // gettingSkill=intentskills.gettings : the user success (post) page controller:
    // will do some bl after the cmd end successfully ( a form submitted/posted) , and do routing iterpage or page routing
    // 	after that we call the fw get next page controller ( can be the same page or a next page)
    //		that will try to get/complete all the dyn field that can be resolved at the time 
    //		so all the cmd/intent with all dyn tab resolved can be available for next match 

    // todo add in dialog.context also a black list version of  : tat intents cant be matched currently 


    // skillcb=({ dyncontent: start_dynFields, newpage: newpage, newpageurl: newpageurl, pref: dfContext,
    //	outContext:outContext});// if newpage=null  start_dynFields is the list of requesting rest cb 

    getter_(session.curpage, req,// use intentskills.gettings and also cmd intentskills.skills_OnEnd routings
        function (skillcb) {






            // >>>  newpage is the action expected todo in buildVuiFram :
            // 		- newpage= 'somepagedifferentthencurrent' means get a new page,
            //		- newpage='' means just get some dyn rest on curpage,
            //			> in this case set newpage=curpage as   
            //		- newpage='info_...'  get info
        	
            console.log('** getpage, getter_ callingback  (intentskills.gettings ) :', skillcb);
            //var mastercmd = null,//lastcmd,// probably USELESS in  buildVuiFram
                pippo = 'pippo',
                newpage = skillcb.newpage||session.curpage;// can be curpage 

            session = vuimsg.session;// can be changed 

            // update session
            session.dyn = null;//reset
            session.prfInt = skillcb.pref;

            // update session.actContext:
            // mngcontext(skillcb.outContext,session.actContext);// skillcb.outContext,session.actContext , discard old ones
            session.actContext = session.actContext || {};


            // // if newpage=null just do aiax on restBank fields that is expected to be resolved as their where field just matched
            // cmd : the master form/intent/cmd/convo submitted 
            // newpage:  getpage ctl x a new page,  if null relay to rest fields in curpage on restBank
            // if newpage=info_tab return fw info tab obj .....

            // >>>> The req1 : param needed by buildVuiFram :
            var req1 = { session: session, text: vuimsg.text, 
                url: skillcb.newpageurl, // must be ever specified also if newpage=curpage ( or '' that's the same)
                newpage: newpage, // if =curpage and has alredy called before means just add dyns of curpage 
                cmd: lastcmd, 
                rest: skillcb.dyncontent };
            // now having the params/sessionb for new page render html or passi the context to vui engine or studio skill generated/compiled convo: 
            console.log('req1 ', req1);
            // buildVuiFram in Cnt_wrk1 vuiengine_v2 controller
            // >>>>>  session ( status,msg.text,....) should be available read only !, all returns in cb !



            fram_ctl.buildVuiFram(req1, function (fwCont) {// if newpage=null or curpage just do aiax on restBank
                // >>>   add vui content to vuimsg using fwCont :
                // fwCont=dialogueMng.getCont(guicont,thispage,pageDynEnt)= 
                // 	- {guicont}={title:'title',...} 
                //		++ 
                // 	- {guivui:dialogueMng.tempCont[page],
                // 		dyns:pageDynEnt, // if some dyn exists
                //		vuidialogue:dialogueMng.getDialogDef(),
                //			//	following is the page dyns ( newpage not null ) 
                //			//		or 
                //			//	just the new  resolved dyn field x a retry cur page
                //			//			 ( is like a rest aiax but push in a page retry get , not pull)
                //		json: the json of (dyns=dynMap)[i].curDyn
                //}


                console.log('** getpage,calling  cnt_wk1/buildVuiFram(req) req: ', req1,
                    ' \n  buildVuiFram returned cb  param (the fw cont=hbscontext) : ', fwCont);

                // set the client device :
                if (voicebot) {
                vuimsg.voiceEnabler = true;
                    var ctx;
                    if (fwCont) {
                        ctx = new Ctx(session.curpage, newpage, vuimsg.text, fwCont.vuidialogue, fwCont.json, session.dfContext,fwCont.vui);
                        if (guivui && fwCont.guivui) ctx.guivui = fwCont.guivui;// the form context x rendering (dyn+static)
                    } else ctx = new Ctx(session.curpage, newpage, vuimsg.text, null, null, session.dfContext,null);

                } else {

                    vuimsg.voiceEnabler = false;
                }

                console.log('** ctx details :\n ', tree(ctx));

                // ************  management symmary : dynamic/static declare fields and changing the curpage

                // - ctx staff will be inserted only if have vui enabler BUT  dyn are anyway  in dyn structure in botkit model in dynamic.field.dyn,
                //	 both  static and dyn will impact the dyn table 
                //	 >> todo HERE : load static def in intentskills.declare.root.static (from framework guivui when change page  )
                // 		nb  and declare.root.dynamic.field.dyn are directly loaded from
                // - SET curpage=newpage will now instruct  getpost ingest to change PAGE :
                //			so will be matched newpage intents and entities/asks 

                //		> TODO : controllare che le def dei fiels non sono page dependant !!!!!!!!
                //			se no :
                //			 when changing page in gettings we calc the NEW PAGE dyn ( TO PUT IN 	DECLARE.NEWPAGE.)
                //			 from curpage params/entityMatches

                if (session.newpage) session.curpage = session.newpage;// reset if we are in new page  

                session.ctx = ctx;// add new page ctx to session x vui engine use , so at getpost we can clear this part of session 	
                console.log('** getPage , callingback after add some vui to session ', session);

                // >>>>  dynprompt :
                // vui engine will expect hello prompt in ots .vui  but it add also a dyn param dynprompt 
                // the client using session.ctx ,or session.data, will call vuiengine vuiBuild()
                // so it will add to json the param  dynprompt of value ctx.dynprompt set here in 
                //			new Ctx( ,this.dynprompt=vuimsg.text

                var chkses = false;
                if (chkses)// do not run 
                    checksession(vuimsg, function (updsession) {
                        vuimsg.session = updsession;// session will be used by vuiengine
                        cb(vuimsg)
                    });
                else cb(vuimsg);
            });
        });// the get post ctl of cur page !
}



        
*/



// 09092019 TODO keep a super convostatus on top of bokit dc to trace the convo story for fw scope ( known last ask asked )
//          that can be done adding a convostory property on session and populating it fron before and onChange and after cb !!
//  let convoStatus={}: session.convost=convoStatus;

    fwBefore(command, thread, userAfter) {// call  thread in a command to add session to vars
        var cms = this._controller.plugins.cms;
        // TODO goon coding  like in fwOnChange till .run()

        // here we must copy in covo.vars some covo related models static and dyn data  in this convo like 
        // dialog  into vars.dialog or vars.fw.dialog   (ed into session) ,  see session definition 

        // NB SESSION will survive among different convo for all session 
        // so in a convo span session info can be put in convo.vars
        cms.before(command, thread, async (convo, bot) => {
            let tc = bot.getConfig('context'), session = tc.session;
            // do stuff
            console.log('starting thread ', thread, 'of script ', command);
            // other stuff including convo.setVar convo.gotoThread
            convo.vars.session = session;
            // 16072019 remember status data in a convo are  convo.vars (convo scope) or session.dyn or session.command.Mathc_
            var curpage = session.curpage || 'root';
            /*
            req = {
                convo, bot, cmd: command, thread, curpage,
               // msg: msg, ?? 
                session
            };// session.curpage= is the new page !??
            */

            req = new ReqBefore(convo, bot,command, thread,
                session,curpage); 




            /*
            function send(text, vui, dyn, lastctlname) {// dyn alredy put in intentskill by expressctls
                if (lastctlname && lastctlname != 'pageDisp') console.log(' in after convo you must next() to the dispatch ctl (pageDisp) !');
                if (cnfl.sayInMoustache) convo.vars['trans_prompt'] = text;
            }*/
            res = null;//{};// no res in this type of cb //new ResConst(newpage,channelData,nextpreprompt,dyncontent ,newpageurl); 
           //  res.send = send;
            //expressCtl.run(req, res, send);// 


            if (userExpressCtls.mng._before)
                // new promise 
               await userExpressCtls.mng._before(req, res);// res not used 



        });
    }// ends fwBefore

    fwAfter(command, userAfter) {
        var cms = this._controller.plugins.cms;
        // TODO goon coding  like in fwOnChange till .run()

        /* 26092019 questions :we can nd a convo 
        
        - after a ask message 
        
            if we goto that will attach the first massage so we mast wait that bot.say to attach the session data  x vui
                question : this after is fired before the goto cmd/dialog starts ? anyway the msg will besend by goto cmd so some middleware must add the session prepared here  
            if we complete the convo we can here send a msg with thw session attatched 


            >>>>>>>>>>>   anyway we must set a global flag so a send meddleware can add it no bother of the previous case apply
                            what is global ?? must be seen by send middleware : probably a closure var of the middleware function ???

        - after a last message

        */

        // will start with 
        // all 

        /*
            convo.after(async(results, bot) => {
                // TODO
                if (results._status === 'completed') {
                    // any variable set with convo.setVar
                    // and any response to convo.ask or convo.addQuestion
                    // is present as results[keyname]
            
                    // can do things like
                    // await bot.beginDialog(NEXT_DIALOG);
                }
            });*/
        // cms.after('onboarding', async(results, bot) => {
        cms.after(command, async (results, bot) => {

            // as in cms.onChange : 
            let runningConvo=this,
             dc= bot.getConfig( 'dialogContext'),//dc= bot.getConfig().dialogContext,
            state = dc.activeDialog.state,index=state.stepIndex,// so last ask field was
             thread=state.thread ;


            // do something like store results in the db
            // can do things like
            // await bot.beginDialog(NEXT_DIALOG);
            // take the next step...
            // await bot.say('ONBOARDING COMPLETE!');

            // results==bot.vars  ?????

            var lastcmd = command;

            let tc = bot.getConfig('context'), session = tc.session;

            // TODO : START CHAIN IN EXPRESS FORMAT !!!
            //start the chain with the std req,res that propagate  
            // the express ctl will do 
            // - Fill and check view/ forms or single list on behave of browser
            // - do mini aiax and fills some dyn 
            // - do post and a get 
            // returns to after and onchange calls :
            // - fills dyn in fw intentskiils (and related copied vars.matched skills)
            // - calc preprompt afted mini aiax and bl on recent matching
            //      preprompt can then here be .say or put in a hbs field to be in next message
            // - calc gotothread if onchange and next page/preferredintent if convo.after()
            //      if gotothread , HERE, can be add enbedded in a gotothread var in user speech to be
            //          extracted on condition regex and then we can recover the model match and the goto
            //          indication from onchange
            //              regex on condition ^Xaitem means the item matched
            //                                  ^Yagoto means goto thread
            //                                  ^Zagotocmd  means goto script
            //              nb the addex X... can be cancelled by middleware or .... 
            // - calc vui data

            // >>>> about to do rest and so resolvingdyn in post after have got the new page ( so in redirect get) 
            // NNBB keep in mind that i can do rest in post just after end convo so resolving some dyn 
            //  ( calc a param as a where field of 
            //       of some other dyn or as a param to calc the new page / preferred intent )  then do 
            //          in getting of new page ( so in vui get fw ctl) all get  dyns (from querystring)  having all where param resolved !!!  




            var 
            
            //req = { cmd: lastcmd, msg: msg, session, curpage: curpage },// session.curpage= is the new page !


            resparam = { newpage, vuidata: data, nextpreprompt },
            //   getPage.run(req,resparam, atend=function () {// runs i=0,1 on getPage.stepx(req,resparm,next) then pass to atend

            //delete:
            //getPage(msg, lastcmd, { info: '' }, function (vuimsg_) {// adds some vui staff on session.ctx
            //   console.log(' appctl, frameWCtl , calling back from getPage ready to send vui message to client , msg : ', vuimsg_, '\n   dyn : ', vuimsg_.dyn);

            // ****  copy the dynfield impacting navigator convo in dialog.dynamic[thedynnavigatorfield]

            // no more send a msg so  sendxNewInt(results.bot, vuimsg_)
            // but 
            // vuimsg_ ={preprompt ,data=vuidata }
            // goto a right cmd/thread after setted the preprompt field 
            // and to insert the  data (vui content) in next messagewe can send just msg.data
            // and have a send middleware that wait next message and merge with vui data or 
            // add data to session then use session when send next message or in send middleware ????......  
            // or just at receiving client if data='cont' wait x naext message in 1 sec 

            //});


            // PROBLEM : study conversation.switch (path.action) {
            // to understand if i do begindialog in ending a convo end() (and so after())
            //  will be called or not at the end of the chained dialog 
            // anyway it seems that if at end of convo in cms i do a goto script the convo after()
            // is not called before the next dialog so i cant do the bl in endingcurrent convo after() !!! 
            // so to start do goto dialog only in after()  !!!

            // if we think we do not change page for example we just try another preferred outcontex intent
            //  in the chain of ctl we stop at endAsk_Cmd ctl calling 
            //      res.send(thepreprompt,thedyntoadd) 
            //  or goto last step next(4)// skip 3rd or expressCtl.chainPageAfterRoutings=false then true




           //  req = { results, bot, cmd: lastcmd, msg: msg, session, curpage: null };// session.curpage= is the new page !

            req = new ReqAfter(results, bot,lastcmd, // msg ??
                session,null);

            function send(text, vui, dyn, lastctlname) {// dyn alredy put in intentskill by expressctls
                if (lastctlname && lastctlname != 'pageDisp') console.log(' in after convo you must next() to the dispatch ctl (pageDisp) !');
                if (cnfl.sayInMoustache) convo.vars['trans_prompt'] = text;// next message preprompt
                /*
                see at     ensureMessageFormat :
            activity = {
                type: message.type || 'message',
                text: message.text,
                attachmentLayout: message.attachmentLayout,
                attachments: message.attachments,
                suggestedActions: message.suggestedActions,
                speak: message.speak,
                inputHint: message.inputHint,
                summary: message.summary,
                textFormat: message.textFormat,
                importance: message.importance,
                deliveryMode: message.deliveryMode,
                expiration: message.expiration,
                value: message.value,
                channelData: Object.assign({}, message.channelData)
                };
                
                so any msg.prop with prop not in message format will be put in msg.channelData
                
                */



                bot.say({ text, vui });// so we'd have to merge this text  + next msg prompt : do using send middleware or receiving client must merge them
            }
     // res = { send, newpage, vuidata: null, say: 'nextpreprompt ?', dyncontent: '?', newpageurl: null };
            // res = { send, newpage, channelData: null, say: 'nextpreprompt ?', dyncontent: '?', newpageurl: null };
            //res= new ResConst(newpage,channelData,nextpreprompt,dyncontent ,newpageurl); 

            var res = new ResConst(null, null, null, null, null);// ,req);
            res.send = send;



            expressCtl.run(req, res, send);// a promise 

        });// ends after

    }//  ends fwAfter



    // TODO : vector(intent) STATIC field + DYN Field matching 
    fwOnChange(command, field) {//,useronchange){// scalar STATIC field
        var cms = this._controller.plugins.cms;
        // QUESTION : can be personalized from some var added in cmd as added field ? for example if i want a support or not a can insert the firld/ param in cms and here i can read and customize
        //    the support ( ax  support for scalar or vector field supported in cms by a child command)


// >>> arrows functions are  "lexically scoped" AND is NOT overset by a call(this,,,) ! so not true : https://www.codementor.io/dariogarciamoya/understanding-this-in-javascript-with-arrow-functions-gcpjwfyuc
        //cms.onChange(command, field, async (new_value, convo, bot) => {// check this. nb if special call x ai convo=bot=null
        cms.onChange(command, field, async function (new_value, convo, bot) {// check this. nb if special call x ai convo=bot=null
            // a better solution to bring in a conversation reference is , like done with the child reference bot and convo , add a param used only in this fw
            //     >>  cms.onChange(command, field, async (new_value, convo, bot,runningConvo) => {// convo is a delegated convo , runningConvo the running convo
            // this is this appctl obj IF there is an arrow function !!!!!
            let runningConvo=this;
            console.log('aiv3.fwonchange , 07112019 this is NOT lexically scoped but set in conversation.runOnChange) handler.call(this)?),  ', this);
            // 07102019 : 
            //  : to process in matcher(msg) intent in msg we need the full activity 
            // new_value now is the user response if the ask has a msg text and is not begin dialog , the child values if the ask with condition has a begindialog action 
            //       SO ITS BETTER TO USE TEXT instead of new_value

            // see  conversation.runAfter, ( see also  :  BotWorker  constructor and  getConfig(key) ) : 
                    // dc= dialogContext= bot.getConfig( dialogContext)=bot._config.dialogContext;
                    // const state = dc.activeDialog.state;state.stepIndex = index; state.thread = thread_name;

            let activity=bot.getConfig( 'activity');//dc.context.activity,text=activity.text,// last activity received from user 

            let matchval=session.Match_Param // == smp  ,  = session.Match_Param || {};

            var item, isVector_ = false, mandIntent_;

            if (field.charAt(0)=='_') {// isVector field
                isVector_ = true;
                mandIntent_ = field;// field.substring(1);//  leave starting _ ( Vector entities) is the child cmd that resolves the vector field staticF
            }else{}

            // (P1)
            if(!convo){// >>>  added 112019: (P1) this calls a vector ask wants  run ai x the mandatory intent ask, must return smp completed 
                // not used :     let activity=bot;// take care 
                console.log('aiv3.onchange , field : ',field,' call ai on text ',new_value);
                if(field.charAt(0)=='_'&& this.aiserv){
                // the fw activity intent  format , see also session definition 
                //console.log('aiv3.onchange , intDataModels.dialog.static[field] : ',tkurl);
                // let curIntent;



                if(!matchval[mandIntent_]||!matchval[mandIntent_].complete||matchval[mandIntent_].complete!='nomatch_retry'){// first time vector is called  .complete!='nomatch_retry..'

                let items;
                // 
                if(activity.channelData.intents&&activity.channelData.intents[0]){// there is alredy run a ai and got some   entities  !!
                    // ai was alredy done and have channelData.intents ... .entities , 
                    //  just check if the mandatory intent entities are complete and anyway fills session.command.Match_Param according to entities  
                    // so return the param options={complete:true} so conversation wont call resolver child

                items=activity.channelData.intents[0].entities;// TODO conversion !!!
                if (allEnt1(mandIntent_, items,null)) {// will set matchval[mandIntent_]

                    // fw info inserted on message and model  objs 
                    // no more used : activity.channelData.intents[0].options={complete:true} ;// fw info embedded : used by convo to see if the intent needs eventually be completed by a vector resolver child
                    // allEnt added a 'complete'  entity : the vectorfield match as a whole ( if a scalar it will be the matched item name ) :
                    // will be used in condition looking at model results, or added as onchange condition suggestion &X in text
                    // session.Match_Param[mandInten].complete=true;

                    return 1
                    }
                }// else call rest ai 
               // activity.channelData.intents=activity.channelData.intents||[];if(activity.channelData.intents.length==0)activity.channelData.intents.push(null);
 
                // no more used activity.channelData.intents[0]=await witai2activity(new_value,tkurl,field,this.aiserv,aiclients);// witai2activity(text,tokenurl,field,aiserv,aiclients,aiclient)
                var tkurl=intDataModels.dialog.static[field];// url or token , field is vector field so the model is the ai service url !
                if(tkurl){
                let ints=await witai2activity(new_value,tkurl,field,this.aiserv,aiclients);// witai2activity(text,tokenurl,field,aiserv,aiclients,aiclient)
                // console.log('aiv3.onchange , test6 : ',this.curInt);
                if(ints&&ints.entities){
                items=ints.entities;//activity.channelData.intents[0].entities;
                if (allEnt1(mandIntent_, items,matchval)) // will set/complete  matchval[mandIntent_]

                return 1;
                }}
                return 0//true/false ?curIntent;// 

                }else{// matchval[mandIntent_].complete=='nomatch_retry'): retrying 

                       if(matchval[mandIntent_].text)// text is passed to retry > must be passed to child x resolution :
                        return matchval[mandIntent_].text; // conversation will start child
                        else return null    // conversation will prompt 

                        

                }



            }
            }
            
            
            // else : normal cb from handle previous step in conversation.onstep()
            
            
            
            //console.log('aiv3.onchange , field : ',field);

            let dc= bot.getConfig( 'dialogContext');//dc= bot.getConfig().dialogContext,
    


             // nb activity was the last previous cmd/thread user response 
             // - if there was a goto and this is step 0 
             // - also if coming back from a child and at last in a ask condition we complete , 

            state = dc.activeDialog.state,index=state.stepIndex,// so last ask field was
             thread=state.thread ;// threadname !!!



            // here is a std onchange on  scalar or vector field 





            /* management summary 25062019
            // this will return a promise whose fullfillment is used to .............
            // assume the fullfillment is just for contol and that togoon with botkit convo and bot call must be terminated/resolved 
            // this will start  return (await) expressCtl.run(req, res, send_) middleware 
            // it will run use ctl then end with send_(req,res) ,all promise
            //	the middleware will effect on botkit using convo and bot calls  ( only ? no effect from returnung fullfillment of onchange ??
            //			or formating helper  res.send   or better call it res.render ? that will use some data prepared by the middleware chain (middleware chain status data)
            //			nb middleware chain status data can individual field on req o res or can be put in a status var or in session but prefer the first that is more clear
            
            //	when finished to do processing the last ctl or send_ will return :
                         null or 0 : goto next index
                  -1 : so the middleware will exit without do remaining ctl  but run last cb send_=lastcb so 
                             return format (renderCms or send orsendOnChange)  will be called if thier param are not null
                  -2 : user managed oncms returns so the middleware chain will exit without do remaining ctl and last cb send_=lastcb so 
            
            
            //			if call res.send we can automatically end the chain ?? 
            
            
            
            // 			usually the send_ lasct middleware ctl ( probably ASSUMING THAT IF NOT NULL THE PREVIOUS CTL DO NOT RETURNED with convo and bot )
            //			will just check that some chain status var are not void then use th associated req.someformatterhelp to send the return using that vars and convo and bot
            
            // *****************  template example 
                                             req = {
                      convo, bot, cmd: command, askey: field,match:item,			>>>>>>  MOVE convo and bot to res ????????????????
                     msg: new_value, session, curpage: null
                 };// session.curpage= is the new page !
                 var condition;
     
               // no  async // ?? 
                 function renderCms(msg_text_data,condition, dyn, lastctlname) {// dyn already put in intentskill by expressctls
                 // this call is equivalent to a POST root ctl :
                 //				if change page also a redirect GET terminating with a res.render(teemplateaccording2GetPageurl&GETqs,contextdyns)
                 //				otherwise can be thought as a AIAX GET that serve a dyn or a returning prompt after amatch calls aiax to have updates on template next field/ask
                                  from server
                 // where 
                 // CONDITION={newpage:'newpage or curpage',gotokey:'a key to be processed by cmds condition , if null will be the match itself',newcms='',gotothread:''}			
                 
                     if (lastctlname && lastctlname != 'pageDisp') console.log(' in after convo you must next() to the dispatch ctl (pageDisp) !');
                     if (cnfl.sayInMoustache) convo.vars['trans_prompt'] = text;
                     else { // try to avoid this way to respond , just fill in trans-prompt}
                         await bot.say({text,vui});// 2 msg set this + next msg prompt : so send middleware or recieving client must merge
                    // make available to conditions handler regex also the result of useronchange condition, or just the matching item if null:
                 if (addConditionInMessage){if(!condition) condition= session.Match_Param;
                     new_value = '_x' + condition + '=' + new_value;// example onchange=asksessionmatch
                   }
                
                 }
                 function sendOnChange(msg_text_data,newthread,newcmd) {// dyn already put in intentskill by expressctls
                                 if(newcmd){}
                                 else if(newcmd){if(msg){bot.say(msg);convo.gotothread(nextthread);}}
                                 else if(msg){bot.say(msg);}
                
                 }
     
                 // see ref : res={send(){},newpage,channelData,nextpreprompt,dyncontent ,newpageurl,
                 //          dynServHelper=FwHelpers    }
                // res = { send, newpage, channelData: null, say: 'nextpreprompt ?', dyncontent: '?', newpageurl: null };
                //res= new ResConst(newpage,channelData,nextpreprompt,dyncontent ,newpageurl); 
     
                 res= new ResConst(newpage,null,null,null ,null); 
                 res.send=send;
                 let lastcb=send_=send;// provvisoriamente , to complete code
                 // 
                 var lastcbret=await expressCtl.run(req, res, send_=lastcb);
                 
         // *****************  fine example     				 
            
            */



            // recover tc so session
            // check if the field is managed my a dialog model 

            // if there is a model  set session match attributes ( no copy in vars.match ??? )
            // do matching 
            // assign in session match the result of matching the msg with the model

            // if there is a dyn copy the dyn in dialog ( previously filled by some  ask end convo cb)
            // in session.dyn (current dyn )...... so that in next message i can propose the list of content in 
            // ' so you got following proposal {{vars.dyn}} '



            /* find if there is a model 

            intDataModels={
            root:{// page root 
    
                Route_On_AskConvoEnd: 

                Route_onPageEnd:
            },
            dialog:dialog
            }
            var dialog = {// dialog static fields . dyn fields are listed on session.dyn 
                // management summary :
                //  these obj will be parse to build pages.js and dialogues.js .......  fw config
                // can also be used a alexa language description format !!!
              
              
                declare: {// static list of  cmd's model items defined in static or dynamic
                  help: [//the ask keys in a cmdname='help' to load as entity x matcher() support ( hbs will get {{convo.vars.entPrompt.help}})
                    'help'// a ask key value
                  ]
                },
                static: {// static list of  model items ( entity in some intent on curpage that will use these field in ask/question )
                 help: 
                   [
                    ['docs', 'documentation'],
                    ['community', 'community'],
                    ['contact', 'contact']
                  ]          
                },
                dynamic: {
                  adynfield: {cmd:'cmd1',
                      dynparam:['awherefield'],// duplicated value , also in framework ( pages.js), 
                      query:null,// the current valid dyn model ( view data model) extraction from some db query or aiax 
                        map:null,// mapping .additional info to map rest json field to itemname and item description  ,usually null
                     schema_url:'http://82.48.217.202:3000',
                     isHttpRest_mongo:true// or db mongo model query          
                    }
                }
            }*/

            /* checks:
            intDataModels[page].Route_On_AskConvoEnd[cmd-field]
            intDataModels[page].Route_onPageEnd
            intDataModels.dialog.static[field]
            intDataModels.dialog.dynamic[field]
            */

            let tc = bot.getConfig('context'), session = tc.session;
            // will remain in status x next convo/command

            var page = session.curpage || 'root';
            let isStat,isDyn=false;// convenience var
            if(intDataModels.dialog.static && intDataModels.dialog.static[field]){isStat=true;}
            else{
                isStat=false;
                if(intDataModels.dialog.dyn && intDataModels.dialog.static[field]){isDyn=true;}
            }

            /*
            let curInts;
            activity.channelData.intents= activity.channelData.intents||[];
           curInts=activity.channelData.intents;??
            */

            if (isVector_||isStat||isDyn) {// UIU
                // 10112019 : we can alredy filled sess


                // both scalar and vector ? if vector (intDataModels.dialog.static[field]) contains null or the ai rest uri) needs a check that this vectorfield is a vector ?
                
                
                
                
        // 102019    TODO            anchesenonc'e model posso lo stesso lanciare onchange che mi estrae custom qualche field sucui fare quache cosa ' o posso anche lancirare una bl in corrispondenza di un ask e poi gestirmi il condition senza model
                
                
                
                // is there a model x this scalar field , or there is info bout this vector feld ? 
                //  var model=intDataModels.dialog.static[field];



                // >>>>>  SESSION : session x cmd will be attached to session by conversation at begindialog()
                //session.command = session.command || {};

                //session.command.Match_Param = session.command.Match_Param || {};
 //               const itemmat = { value: null };// why embed value in a obj ? .....

 //               session.command.Match_Param[field] = itemmat;// example session.matched.colorcmd.name.value
                // 16072019 better copy also as current command in :
                
                // no , session.Match_Param[field] = asksessionmatch;// =itemmat = { value: null } , current convo matches updated
               //  session.command.Match_Param[field]=session.Match_Param[field]=matchval;






               // if(){}else {}  



                /* 08102019
                se e' vector field  allora sparo un child x le entity resolving a al ritorno 
                    al return del child analizzo il last msg del child e le values filld in child per  
                    dare  istruzioni al condition x routing
                se non e vector field e il cmd e' vector allora cerco i resolver in msg.intent se e' il primo call al step chain 
                    poi faccio check sui singoli step scalar per trovare il match da msg.intent o via model match
                se non e vector field e il cmd e' vector allora .....

                */



                // ***************   if this is a child check if a match was alredy set in father on the same field :
                let ind=-1;
                if(dc.stack.length > 1)ind=dc.stack.length-2;// the father index
                let 
                inst,chmatched=false;
                fathername,
                fatherstatus;
                if(ind>=0){// also x vector and dyn ???
                    inst=dc.stack[ind];
                    fathername=mystack.id.substring(0, mystack.id.length-15);// as stack.id.substring(nam.length-15, nam.length)==':botkit-wrapper')
                    fatherstatus=inst.status;

                    // 012020 todo : check the step interrupted has the vectorname = to this cmd 

                    let chMatch=inst.status.sessStatus.Match_Param;// current match status 
                    if(chMatch[field]&&chMatch[field].complete.substring(0,15)=='match'){
                        matchval[field]=chMatch[field];// import alredy matched field in father
                        chmatched=true;
                    }

                }


                // if the father has alredy set in history : 
                // intentalreadymatched=session.match[fathername].Match_Parm[field]
                // or 








                // if (item = await matcher(new_value, field)) {// both ai or a local static regex in config dialog
                if (!chmatched)item = await matcher(activity, field,new_value,curInts,command,thread); // nb items === entities or a scalar matched model item name . both ai or a local static regex in config dialog
                    
                    // a succesfull match , we got some intent entity or a scalar item match so can evaluate to  goon with process this semantic data gathered 

                    // remember matcher() returns : if scalar a string , if vector the entities in FE format : entities=[{name: e.type,value: e.entity,type: 'entity'},,,]

                    if (matchval[field].complete.substring(0,5)=='match') {// this ask is a vector ask , must check if all mandatory entities are got
                        if (isVector_){

                        /* 092019 questions : 
                            - how begin dialog is called ?
                                - cms will change in testtrigger the msg.action so condition will not run ( do not work because onchange and condition will not called )
                                                    also : will onchange called in a msg with ask also if msg.action='beginDialog' ?
                                -  cms will change in testtrigger the condition.action in case  condPre + 'gotChild matches ? > SEEMS TO WORK 

                        */
                        //a vector field will be no processed in the ctl chain: the scope is to relay to a 
                        // specialized child dialog just to get the entities, so no bl in this layer 

                        // example in case of first vector field of a cmd :
                        // we make sure to have all entities so in cmscondition we can continue so 
                        //       first message prompts x entities resolution will be avoided 
                        //  but if the entities are not complete anyway we do not replay the step 0 message with entities prompt but goon 
                        //  a child that will bespecialized to extract the missing (or all) entities 


                        // >>>>>>>>>>  besure that returning from child we goon with step 1 or retry the parent in this case using the step 0 entities prompt text
                       // if (allEnt(mandIntent_, item,matchval[mandIntent_])) {}// item is really a map so should be called  items,
                            // allEnt() will fill items=session.Match_Param[fieldwn_]={childfield1:'matchentity,,,,,}

                            // if we dont call child so vars[mandIntent_] must befilled manually :
                            convo.vars[mandIntent_] = new_value;// isnt that done by conversation anyway ????

                            /* do c) case !
                            now if all mandatory entities matched can
                             - a) run ctl chain to process incoming intent like in scalar case putting result in a dyn field then (using cms or directly ) goto nextstep/ new tread with a message prompting the dyn result to select
                             - b) consider done the job (just get the intent with no process) so return here without run ctl chain routing via cms 
                                    cms will 
                                    - go to next step that will summary the intent got , asking confim and in case yes will run a ctl chain to get the query dyn to select on next step ...
                                    - goto a tread that will process the intent , so in begin do aiax , then in step 0 message can say we got some result that in a dyn  field so please select one
 			                >>> c) both a and b : after set the model match :
					                 scalar : session.Match_Param[scalarstaticordynfield]=the item matched or null if do not match 
					                vector : session.Match_Param[_vectorfield]=entities;session.Match_Param[_vectorfield].complete=true/false;// true if succeeded
				                    and let ctlchain to change default model match that will be used (directly or embedded in text with $X ) by condition cmd to routing  match  
                            */
                            //let gtcase=0;
                            //if(gtcase==0){// a case
                             //new_value = condPre + 'gotChild' + ' ' + new_value;// cms condition see that the vector field is fullfilledwith all mandatory items so wont start childdialog
 
                             // in case we do not run ctl chain (as_because we do not have any ctl applying) : reset user answere x cmd condition 
                             if(addCond)new_value = condPre + matchval[mandIntent_].complete;// 'success' ;//+ ' ' + new_value;// cms condition see that the vector field is fullfilledwith all mandatory items so wont start childdialog

                            
                            // >>>>>>>>> todo  remember to retry in ctl or in cms  if complete='nomatch_retry'




                            //}else {// b case   }

                        if(true){}
                         else {// dont use 
                            
                            if(true){// same as successfull, 
                                convo.vars[mandIntent_] = new_value;// ??
                                if(addCond)new_value = condPre + matchval[mandIntent_].complete;
                            }else{old 
                        
                            
                            // AS DO NOT RUN CTL CHAIN , SET  instruction x cms condition and return
                            new_value = condPre + 'StrChild';// + ' ' + new_value; // will sttar the child entity resolver dialog , see conversation.handleaction()
                            // pass the step 0 user result =new_value alredy got here 
                            let child=field;// same name 
                            session.vector_result[child]=new_value;// serves as status to  pass to child
                            
                            // .....

                            // cms condition will start  child (so if a null/incomplete   ai intent was in msg) to complete/fill then returns here in next step with 
                            // vars.field={all child field user speech collected}
                            // AAWER 
                            /* + TODO 

                            after the match we set current convo match in session.Match_Param[??]
                                - the field name if is scalar 
                                - if is vector we can plane all sub field as a field of session.Match_Param :
                                             session.Match_Param[child_field1],,,,,
                                    + optionally add a map as vector field :
                                             session.Match_Param[vectorfield_]={child_field1=session.Match_Param[child_field1],,,,} 
                            
                             in case of a subdialog :
                                    that independent by methodto match : subdialog or using AI rest call or see the ai done on client in result in message 
                                      set a after in child dialog that must copy its match session.Match_Param[child_field1] :
                                          session.Match_Param[mandIntent_]={child_field1=session.Match_Param[child_field1],,,,} 
                                          as were done in case we find entities by ai in session...entities[]


                             QUESTION : where in code the child fields are copied into vars.field ??????????????????  in dc.endDialog ????
                            */
                            }
                        }}


                    
                    else {// this ask is  scalar


                    if(isDyn){// todo define isDyn 
                       // in case of dyn, the dyn matching success item must be set in dynfield ctl  matchval[field]=item;// =dynSes
                        // todo 
                        // alredy done in conversation ??    convo.vars[mandIntent_] = new_value;// the user speech go into vars field anyway
                        // now what other session dyn var we put in vars ? dyn prompt , dynquery ,....
                        //   or in hbs we can refears to  value.session.dyn[dynfield]=dynSes=session.dyn[field]= session.dyn[field]||{idspace:[],query:[],complete:'start',prompt:[]};

/* 122019               call httpService :
                        the matching algo is getVoiceModel : that fill pdyn session status Match_Parm  using text to do fts, using dialog info to get where match and db/http info. 
                        the algo is described in httpService.getVoiceModel(pDyn_, req, options) > aiv3...onChange_dynField where specifically : 
                        in onChange_dynField   
                            - we get the idspace with patt and descr field fron db/rest join on where field (cb are in future available to customize the db/rest call) and 
                            - launch the userCtls cb to fill the dyn status var req.session.Match_Param
                            
*/
//delete , alredy done in matcher the update of matching status :  await  intDataModels.service.httpService.getVoiceModel(pDyn_, req, options) ;// in this are available others services !, will set matchval[field]
 
                    }else;
                }


                        
                       // alredy fille by matcher  matchval[field]=item;//  matchval=session.Match_Param,  OR ={value:item};
                        
                       /* nb 	if dyn item=  dynSes=session.dyn[field]= session.dyn[field]||{idspace:[],query:[],complete:'start',prompt:[]};// complete:matchingstatus/result, query:[] the query dyn result [[itempattern,shortdescr],,,,]
                        >>>>>     x example in dyn fts matching we need to test the fts matching  complete :  1 val ,no match , space match , space reduced ,,,,,,
   
                        if static, item is the matcing item name or can be the reason of a not matching process , in this case is starting with % 
                       */



                        //if(item){// the model matches so goon
                      // await scalarFieldCtl();// will fire express middleware multilevel on matched field and use session  to do fw staff
                    }



                    

                await scalarFieldCtl();// will fire express middleware multilevel on matched field and use session  to do fw staff


                // }// ends matcher call 



                /* todo dym mng :
                // reference current convo dyn to dyn in dialog : >>> clear at begin or after convo/thread if needed 
                session.dyn=intDataModels.dialog.dynamic[field].query;
                */
                
            }// ends // UIU
            // copy 
            
            if(session.command.Match_Param){
                session.command=session.command||{};
                session.command.Match_Param=session.command.Match_Param||{};
                session.command.Match_Param[field]=matchval[field];// copy also here x future reference 
            }
            if(convo){

                // make available the scalar match (dyn or static ) as convo.vars.match[field]=session.Match_Parm[field]=matchval[field]           that's x template context ,
                //              but seems  we already put session into var : convo.vars.session=session
                // remember : convo.vars[field]  is usr text !

                if(isStat){
                    convo.vars.match=convo.vars.match||{};
                    if (field.charAt(0)=='%')  convo.vars.match[field]='';// info bout not mach
                    else  convo.vars.match[field]=matchval[field];// regular match 

                }else{
                    if(isDyn){// make available the scalar match (dyn or static ) as convo.vars.match[field] x template context , convo.vars.match[field]  is usr text !
                        convo.vars.match=convo.vars.match||{};
                        if (matchval[field].query.length>0)  convo.vars.match[field]=matchval[field].query;// i
                        else  convo.vars.match[field]='';// 

                }
            }
        }
            return ;// cb return (onchange cb() )  

            function allEnt1(mandIntent, entities,partMatch) {// mandIntent=vector field name matchval=session.Match_Param

                // 012020 : correct version for a incoming text with activity.channelData.intents (case !convo)
                // allEnt will set entity of the vector/intent field match: smp=Match_Param[]=partMatch
                //          accepts entities coming from entities , to match all declared entites must be inserted from entities
                // if entities alredy present in smp.entities let them as is but not cont x match complete
                 
            // 11112019  entities in format curInt[0].entities that is a simple map : 
            //          sets session.Match_Param[mandInten]={entities,complete:'match/no_match'/+_code} where entities={ent1name:val1,,,,,} 
            //              and check if all declared entities is present in declare[mandIntent]
            //          if partMatch is provided let its entities

                // old :
                // ...s   format FE : entities=[{name: e.type,value: e.entity,type: 'entity'},,,]
            // from entities fills session.Match_Param[mandInten] and session.command.Match_Param[mandIntent] then say if it is complete looking to intent entity declaration in dialog.cmds[mandIntent];

                // dothisjustafterreturning from matcher()
                let allEnt_ = true,// intent has got all mandatory entities as defined in dialog.cmds
                    childF = partMatch||{};//partial entities , to complete 


                    matchval[mandInten] = childF;// re set,  duplicate all intent entities reference on container session.Match_Param[mandInten]

                /*  if want to flatten all entities at base level :
                session.Match_Param=Object.assign{session.Match_Param,partMatch};// add all property in childf ,flattening all vectorentity
                session.command.Match_Param[mandIntent] = childF;
                */

               matchval[mandInten].complete='no_match';//+'_opcode'

                if (entities) {


                    /* first version : copy only if declared in dialog.cmds[mandIntent];
                    // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                    // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))
                    let childfields = dialog.cmds[mandIntent];// cmds={mandIntent:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}

                    for (ent in childfields) {// test entities has all entities that are in  child cmd fields childfields
                        if (ent.pri && ent.pri == 'm') {// is declared mandatory 
                            var ij; for (ij = 0; ij < entities.length; ij++) {

                                if (entities[ij].name == ent) {
                                    // a field in child cmd matches so register it in local cmd stATUS VAR  :
                                    childF[ent] = entities[ij].value;
                                    break;
                                }
                            }
                            if (ij == entities.length) {
                                // was not found so
                                allEnt = false;//break;

                            }

                        }

                    }
                    */

                   // second version : copy also  if not declared in dialog.cmds[mandIntent];

                    // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                    // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))

                    // old idea : dialog.cmds[mandIntent];// cmds={mandIntent:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}
                    // new idea : dialog.declare[mandIntent];// declare={mandIntent:[childfield1/vectorEnt1,childfield2/vectorEnt2,,,],,}
                    //                                          static={childfield1={,,,pri:'m',,,}}    / the child field can declare additional priority but it is not used here  
                                        let childfields = dialog.declare[mandIntent];

                    let mand_found=0,mand_tot=0;
                    childF.entities=childF.entities||{};
                    //if(childfields){



// new 
if(childfields)
{childfields.forEach(function myFunction(item, index) {
        if(childF.entities[item])mand_found++;
        else{if(fromFields[item].complete.substring(0,5)=='match'){
            childF.entities[item]=entities[item];
            mand_found++;
        }

        }

});



/*
if(childfields)for (ent in childfields) {// test entities has all entities that are in  child cmd fields childfields
    if (ent.pri && ent.pri == 'm') {// is declared mandatory 
        mand_tot++;
}}*/
//return allEnt

let successful=true;if(childfields.length!= mand_found)successful=false;
// matchval[mandInten].complete=successful// the vectorfield match as a whole ( if a scalar it will be the matched item name ) :used in condition looking at model results
if(successful) childF.complete='match';else childF.complete='no_match';//+'_opcode'
return successful;
}else {
childF.complete='no_match';// anyway
return false;
}


























                
            }}

            function allEnt2(mandIntent,fromFields,partMatch) {// mandIntent=vector field name matchval=session.Match_Param
                // call :  allEnt2(vectorfieldname,fromFields=childsmp,partMatch=smp[vectorfield])

                // 012020 : correct version x inserting entities from matched (smp.complete='match_...' ) convo field/asks
                //           allEnt scan dialog.declare[mandIntent] and 
                //          using matching fromFields (child asks fromFields=child Match_Param)  
                //          add unresolved entity in smp.entities ,  smp=Match_Param[]=partMatch
                //          we have match only if all declered entities are in smp.entities
                 
            // 11112019  entities in format curInt[0].entities that is a simple map : 
            //          sets session.Match_Param[mandInten]={entities,complete:'match/no_match'/+_code} where entities={ent1name:val1,,,,,} 
            //              and check if all declared entities is present in declare[mandIntent]
            //          if partMatch is provided let its entities

                // old :
                // ...s   format FE : entities=[{name: e.type,value: e.entity,type: 'entity'},,,]
            // from entities fills session.Match_Param[mandInten] and session.command.Match_Param[mandIntent] then say if it is complete looking to intent entity declaration in dialog.cmds[mandIntent];

                // dothisjustafterreturning from matcher()
                let allEnt_ = true,// intent has got all mandatory entities as defined in dialog.cmds
                    childF = partMatch||{};//smp partial entities , to complete 


                    matchval[mandInten] = childF;// re set,  duplicate all intent entities reference on container session.Match_Param[mandInten]

                /*  if want to flatten all entities at base level :
                session.Match_Param=Object.assign{session.Match_Param,partMatch};// add all property in childf ,flattening all vectorentity
                session.command.Match_Param[mandIntent] = childF;
                */

              //  if (entities)
                 {


                    /* first version : copy only if declared in dialog.cmds[mandIntent];
                    // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                    // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))
                    let childfields = dialog.cmds[mandIntent];// cmds={mandIntent:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}

                    for (ent in childfields) {// test entities has all entities that are in  child cmd fields childfields
                        if (ent.pri && ent.pri == 'm') {// is declared mandatory 
                            var ij; for (ij = 0; ij < entities.length; ij++) {

                                if (entities[ij].name == ent) {
                                    // a field in child cmd matches so register it in local cmd stATUS VAR  :
                                    childF[ent] = entities[ij].value;
                                    break;
                                }
                            }
                            if (ij == entities.length) {
                                // was not found so
                                allEnt = false;//break;

                            }

                        }

                    }
                    */

                   // second version : copy also  if not declared in dialog.cmds[mandIntent];

                    // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                    // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))

                    // old idea : dialog.cmds[mandIntent];// cmds={mandIntent:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}
                    // new idea : dialog.declare[mandIntent];// declare={mandIntent:[childfield1/vectorEnt1,childfield2/vectorEnt2,,,],,}
                    //                                          static={childfield1={,,,pri:'m',,,}}    / the child field can declare additional priority but it is not used here  
                                        let childfields = dialog.declare[mandIntent];

                    let mand_found=0,mand_tot=0;
                    childF.entities=childF.entities||{};
                    //if(childfields){


 
                    if(childfields)
                    {childfields.forEach(function myFunction(item, index) {
                            if(childF.entities[item])mand_found++;
                            else{if(fromFields[item].complete.substring(0,5)=='match'){
                                childF.entities[item]=fromFields[item].match;
                                mand_found++;
                            }

                            }

                    });



                    /*
                    if(childfields)for (ent in childfields) {// test entities has all entities that are in  child cmd fields childfields
                        if (ent.pri && ent.pri == 'm') {// is declared mandatory 
                            mand_tot++;
                    }}*/
                    //return allEnt
                    
                    let successful=true;if(childfields.length!= mand_found)successful=false;
                   // matchval[mandInten].complete=successful// the vectorfield match as a whole ( if a scalar it will be the matched item name ) :used in condition looking at model results
                    if(successful) childF.complete='match';else childF.complete='no_match';//+'_opcode'
                    return successful;
                }else {
                    childF.complete='no_match';// anyway
                    return false;
                }
            }}

            function allEnt(mandIntent, entities,partMatch) {//old ,  mandIntent=vector field name matchval=session.Match_Param


            // 11112019  entities in format curInt[0].entities that is a simple map : 
            //          sets session.Match_Param[mandInten]={entities,complete:'match/no_match'/+_code} where entities={ent1name:val1,,,,,} 
            //              and check if all declared entities is present in declare[mandIntent]
            //          if partMatch is provided let its entities

                // old :
                // ...s   format FE : entities=[{name: e.type,value: e.entity,type: 'entity'},,,]
            // from entities fills session.Match_Param[mandInten] and session.command.Match_Param[mandIntent] then say if it is complete looking to intent entity declaration in dialog.cmds[mandIntent];

                // dothisjustafterreturning from matcher()
                let allEnt_ = true,// intent has got all mandatory entities as defined in dialog.cmds
                    childF = partMatch||{};//partial entities , to complete 


                    matchval[mandInten] = childF;// re set,  duplicate all intent entities reference on container session.Match_Param[mandInten]

                /*  if want to flatten all entities at base level :
                session.Match_Param=Object.assign{session.Match_Param,partMatch};// add all property in childf ,flattening all vectorentity
                session.command.Match_Param[mandIntent] = childF;
                */

                if (entities) {


                    /* first version : copy only if declared in dialog.cmds[mandIntent];
                    // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                    // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))
                    let childfields = dialog.cmds[mandIntent];// cmds={mandIntent:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}

                    for (ent in childfields) {// test entities has all entities that are in  child cmd fields childfields
                        if (ent.pri && ent.pri == 'm') {// is declared mandatory 
                            var ij; for (ij = 0; ij < entities.length; ij++) {

                                if (entities[ij].name == ent) {
                                    // a field in child cmd matches so register it in local cmd stATUS VAR  :
                                    childF[ent] = entities[ij].value;
                                    break;
                                }
                            }
                            if (ij == entities.length) {
                                // was not found so
                                allEnt = false;//break;

                            }

                        }

                    }
                    */

                   // second version : copy also  if not declared in dialog.cmds[mandIntent];

                    // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                    // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))

                    // old idea : dialog.cmds[mandIntent];// cmds={mandIntent:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}
                    // new idea : dialog.declare[mandIntent];// declare={mandIntent:[childfield1/vectorEnt1,childfield2/vectorEnt2,,,],,}
                    //                                          static={childfield1={,,,pri:'m',,,}}    / the child field can declare additional priority but it is not used here  
                                        let childfields = dialog.declare[mandIntent];

                    let mand_found=0,mand_tot=0;
                    childF.entities=childF.entities||{};
                    //if(childfields){

                   //  
                    for (ent in entities) {// copy from entities to childF.entities   also if is not declared . but test entities has all entities that are declared in  child cmd fields childfields


                        if(childfields&&childfields.indexOf(ent)>=0){//if(childfields&&childfields[ent]){
                       // old :  if (childfields[ent].pri && childfields[ent].pri == 'm') {// is declared mandatory ?
                            mand_found++;
                           
                        
                    }
                    childF.entities[ent] = entities[ent];//entities[ent].value;
                    }
                    
                    /*
                    if(childfields)for (ent in childfields) {// test entities has all entities that are in  child cmd fields childfields
                        if (ent.pri && ent.pri == 'm') {// is declared mandatory 
                            mand_tot++;
                    }}*/
                    //return allEnt
                    
                    let successful=true;if(childfields)if(childfields.length!= mand_found)successful=false;
                   // matchval[mandInten].complete=successful// the vectorfield match as a whole ( if a scalar it will be the matched item name ) :used in condition looking at model results
                    if(successful) matchval[mandInten].complete='match';else matchval[mandInten].complete='no_match';//+'_opcode'
                    return successful;
                
            }}
            async function scalarFieldCtl() {//  if scaler matches or not, if vector matches 
                // mng overview : fire ctl chain, manage new page if reset , insert $X in user text x cms condition management 


                /* before call conversation.onstep(step,,,,) sets convo = new dialogWrapper():
                  convo.vars = step.values;
    
                  but onstep is called by runStep(dc, index, thread_name, reason, result) {
    
                    that sets some step attr with state attr :
    
                     step = {
                        state: state,
                        options: state.options,
                        values: state.values,   ,,,,}
    
                        where state is get from dc.state
    
                        so we complete state info available to user  onchange() adding some session vars to convo.vars:
                        convo.setvars() that will add attributes to state.values available in onchange and after as convo.vars
    
    
    
    
             */
                // add to state.values=step.values=convo.vars
                // copy to some state attribute updates session info that are really stored as session state var  
                // convo.setVars() or


                // transferenttovar will update session info about current matches
                // session.matched

                // (transfer msg.intent.entities.[field] to session:
                //  asksessionmatch.value= msg.intent.entities.[field];

                // 
                // let found = transferenttovar(new_value, field, intent = name, asksessionmatch);// ???
                //todo transferenttovars(new_value,name,intent=name,convo.vars.fw.matched.entities);//for entities

                // or : match scalar field using model in intentskills ..............

                /* seems do no necessary as using session.command.Match_Param.field
                var cvars = convo.vars;
                var matched = cvars.matched || {};// matched field in convo.vars
                var clonedvar = matched[field] = asksessionmatch.value;// to clone ??
                //return await useronchange(new_value, convo, convo.vars.matched[field]);// must be async 
                */



                // >>>>>>> it=useronchange(onchange part in intent_data_models ) . it will send the next msg after set the handlebars preprompt
                //  next message will be the first msg if it gotothread or the message set by following 
                // condition also using the param set by it 
                // it can also do some dyn resolver cb if the query depend on the just matched  where field 
                //  or a where field that is a param calculated by it bl from fields static or dyn
                // it is both a view ctl that build the model and the ctl that used the model to do bl 
                //  - useronchange interthread ask can be seen as aiax calls managed by browser
                //      and sub menu view  prompt using aiax result 
                //          ( sub view need some param got from previous matched field and relative aiax/query result)
                //  - useronchange model scalar/vector/dyn ask can be seen as view ctl mngment
                //  - after can be seen as ctl action on model received by a view 
                // > the important is that any ask is managed by a express like ctl
                //      the ctl will send 
                //          - in msg.data the vui page dialog if a new page to vui browser 
                //                ( it will manage in device a lot of view staff ro resolve vector-field/entities)
                //
                //          - the message to user :
                //               >  setting a bot.say concatenating with a next message defined 
                //                   merging  its gotothread and associated ask conditions
                //                   OR BETTER 
                //                   set a preprompt field of next message defined
                //                   merging  its gotothread and associated ask conditions
                //                  + hears space ( or mandatori inter thread step) 
                //                      to manage the user response (view/useronchange) and then do bl ( userafter)
                //                          
                //      useronchange: usually just check the partial form just compiled do aiax
                //          present  sub form preprompt setting next message/thread and its preprompt hbs field
                //      userafter : do complex aiax dyn , do bl and calc next preprompt  to prepare for next (sub/preferred)intent/majorform on current page 
                //          or change page 


                //  let onchange = useronchange(new_value, convo, convo.vars.matched[field], session);// must be async
                // BL staff can be added after done the convo ask matching and goto thread as in after()
                // infact after done convo ask management we can do some bl with aiax/dyn without heavvy routing
                // so i can do a little routing(choose a different gotothread)  depending on aiax results 
                //  having back the dyn resolved and a next prompt and a nextthread instead of a next page or preferred next intent
                // NNBB keep in mind that i can do rest in post ( postctl is like after() ):
                //      to resolve some dyn 
                //          ( calc a param used as where field of  some other dyn or 
                //               a param to calc the new page / preferred intent )  
                //      then after got new page  i can response the post by redirecting to a new page  
                //       , usually a  get of new page with dyns calc having all where param  passed in get/post qs!!!  

                // >>>>  using a express like ctl will calc next gotothread(or confirm goon current thread )
                //       + fill next message preprompt:
                //      useronchange(new_value, convo, convo.vars.matched[field],session,data);

                // X= 'endAsk_Cmd',Y='pageDisp',Z='dyn_vui'

                //    ex: gotoPage(req,{newpage=null})
                //      the controller chain that manage a user speech starts :
                //          in case of a hears space exposed ( forms in a on focus windows frame)
                //      - a) start with the match of filling form then start thread as b)
                //          in case of a user speech directed to a thread ask
                //      - b) start with a ctl that manage the collecting of user entity ( view staff) of entities
                //               > this is the onchange part that do the entity/entities resolution
                //          after done entity resolution ( fwonchange()) 
                //              we can ask for completation of other entities ( browser or view staff) and
                //                  ( X ctl will just forward ) 
                //                  say a next entity prompt (the step ask message) to user returning into the next  b) level ctl
                //              or
                //              we can go into next chain ctl level c ( X the user part of onChange())

                //      - c) after got some entity the thread ask can got enought data to do some aiax 
                //                  aiax will fill a list of selectable entity  that is a query on a full entity model 
                //              in ask(onchange) controller (that chain the   X ctl)    or 
                //      - d) process the whole form/convo in a after controller that chain X , Y ctl
                //      Z ctl will anyway close the chain because it will 
                //          - download the form(fre or mandatory) completation dialog that the vui will take care 
                //              on behalf of b) level controller
                //          - inform the vui of the dynamic filling of dyn fields ( aiax filling of a browser list ) 
                //          - automatically try to fill dyn fields not yet filled  if it found that the params it depend on are 
                //              provided in a qs list (or a req param list)
                //              > infact it try to find the dyns to fill, look if there are the param in qs list then
                //                  cals a std aiax/db call that do query and rest as provided (configured) 
                //                  db schema and rest qs format and json receiving map allows the std call to do the calls  
                //  
                // will fill (vui)data + calc preprompt set using  session and new_value 

                //      and setting  next handler ( hears  space if a new intent or the next threadmessage that will handle next user speech)  
                //      using a chain of ctl managing the user speech managed in a thread ask
                //      that in onchange is (just itself!)  only the onfield handler will set preprompt and nextgotothread


                // do only onCmd/field-AfterRoutings chain ctl 
                //function next(scb) {
                //var scb={ dyncontent: null, newpage: null, newpageurl: null, pref: null,outContext:null};
                // scb has filled 
                //}
                //intents[page].skills_OnEnd[req.cmd](req, goon, next);// calls goon if want goon with gettings
                /*
              acmd: function (req, nextupd, next) {// next can be chain with other scb updater :  nextupd(req,scb,next)
                var scb={ dyncontent: null, newpage: null, newpageurl: null, pref: null,outContext:null};
                // usually if some give nextupd he wants goon updatings before end with next(scb)
                if(nextupd)nextupd(req,scb,next);//but as you likes
                else next(scb);// or nextupd(req,scb,next) if i want to chain also general rooting x page
              }*/


                /* 072019 
                better
                we can call usual middleware chain of controller inserting into req both convo.vars and session
                so in skills_OnEnd after done some aiax and filled dyn fields in model and so availabe n convo and session
                 we can see if there is convo that this is a ask message and not the end of a convo 
                 so that we can goon to the middleware ctl chain 
                   setting current page so the vui ctl will only  send a vui message with :
                    - a preferred or mandatory intent/form for the next form ( scalar o vector field) to match
                           inserting the related dyn model in vui message (only if the dyn is used bu vui forms!)
    
    
    
                */

                // if we think we do not change page 
                //       for example we just try another preferred outcontex intent
                //           .........
                //       or we just change thread :
                //           ...............
                //       or we just goto another cmd (child or not )
                //           bot.say   bot.gotocmd in ctl then here just close
                //  in the chain of ctl we stop at endAsk_Cmd ctl calling 
                //      res.send(thepreprompt,thedyntoadd) 
                //  or ?? goto last step next(4)// skip 3rd ,or expressCtl.chainPageAfterRoutings=false then true



                // 11112019 now also vbector resolved can launch a ctl chain to prosess vector/intent result !
                // only scalar field will fire express user controller chain. vector will launch a child cmd that can have express ctl on its scalar field
                /*
                req = {convo, bot, cmd: command, askey: field, match: item,thread,
                        //msg: new_value, session, curpage: null
                        msg: text, session, curpage: null};// session.curpage= is the new page !
                    */
                req =  new ReqOnChange(text, convo, bot,command,field,item,thread,  // onchange cb param 
                            session,curpage);

                res = new ResConst(null, null, null, null, null,req);
                // senders   will be added to res.send on  expressCtl.run() 


                if (intDataModels[page] && intDataModels[page].Route_On_AskConvoEnd && intDataModels[page].Route_On_AskConvoEnd[field]) {






                    // no  async // ?? 


                    /* old
                                function send(text,condition, vui, dyn, lastctlname) {// dyn already put in intentskill by expressctls
                                    if (lastctlname && lastctlname != 'pageDisp') console.log(' in after convo you must next() to the dispatch ctl (pageDisp) !');
                                    if (cnfl.sayInMoustache) convo.vars['trans_prompt'] = text;
                                    else { // try to avoid this way to respond , just fill in trans-prompt}
                                        await bot.say({text,vui});// 2 msg set this + next msg prompt : so send middleware or recieving client must merge
                                     }
                      
                                // make available to conditions handler regex also the result of useronchange condition, or just the matching item if null:
                                if (addConditionInMessage){if(!condition) condition= session.Match_Param;
                                    new_value = '_x' + condition + '=' + new_value;// example onchange=asksessionmatch
                                  }
                                  
                                  
                                }*/



                    // ========================= put in intentdatamodrel*/

                    // ========================= ends put in intentdatamodrel  */      


                    //function send(req,res){//},usrSendcb) {// dyn already put in intentskill by expressctls,usrSendcb has registered in expressCtl 
                    //}

                    // see ref : res={send(){},newpage,channelData,nextpreprompt,dyncontent ,newpageurl,
                    //          dynServHelper=FwHelpers    }
                    // res = { send, newpage, channelData: null, say: 'nextpreprompt ?', dyncontent: '?', newpageurl: null };
                    //res= new ResConst(newpage,channelData,nextpreprompt,dyncontent ,newpageurl); 

                    // res = new ResConst(newpage, null, null, null, null);
                    // res.send=send;// result formatter  will be added on userctls

                    // send_ has registered in expressCtl 
                    // WQD 
                    var lastcbret = await expressCtl.run(req, res);//,send_);// TODO must return a promise so return/await expressCtl.run(req, res, send);



                    /* will RETURN a return code of middleware process, usually the return of middleware  lastcb or 0 
                    - std behaviour of custon cmmiddlew ctl x scalar field
                        here il onchange we run only the one field ctl : 
                        - endAsk_Cmd and eventually the vui ctl to update the vui dyn if used there
                            - so in that user field ctl you can find the matches of field in session.Match_Param 
                                > so you can insert a dyn confirm/inform preprompt in the next message , see.....convo.vars['trans_prompt'] 
                                > if the ask just gor  resolve a dyn field you can also ask dataservice to get the query using fw helpers
                                    that will also fill the dyn structure foe dyn so the user can find after in session.dyn  vars when
                                    try to match a dyn field :
                                        the message can use muostache to read the dyn query items and then the fw ,here, will resolve by match or by
                                        position the item selected so the user ctl will find the match as in the static scalar field case
                                        usually the condition in a dyn field can be managed only by a goto from onchange that will ovewrite the cms condition
        
                            - in case of iwf with a message asking for more fields after the first field match we can check the next message ( the following in the same 
                                thread without to prompt back with the next message field as the user has alredy given the answere to fill next field)
        
                            - you have prepared in cmd condition the goto in base of the item selected working on regex but you can insert in user msg 
                                a field from the user ctl that can be used to do a more precise or extend the condition according to  matches passed
                                > see below :  if (onchange) new_value = '_x' + onchange + '=' + new_value;
        
                    - std behaviour of custon cmmiddlew ctl x vector field
                        find all entities from message.intent or using the single entities model , then if not all matched goon with the child wf that will ask 
                        only the non present matches loaded as usual in session.Match_Param.entityx
                        so the first message collect data onchange evaluate intent and dialogmatch then goto child that is a wf will complete the missing and return with all intent entities 
                            ...........
                    */




                }
                //  ?? 
                //    usuall user onchange will just say ok get 'x' and skip to next index eventually do a aiax with values in vars ??
                //    only in after a command we can use appctl dyn resolver so use  fwAfter() call 

                else{
                    // in case we do not have any field ctl we can run a default senders that just add a std delegate with the item matched 


                    // in case we do not have any ask/field ctl we can run  the chain setting a default behaviour to instruct following :
                    //      - x the renderCms sender set  res.route.send.renderCms.condition.match=item matched ( so if there is no ask ctl we have set already
                    //              a def )
                    //      - x the onEnd routing ctl with res.action='cmd.field' so if we rtegister a routing at that end point it will be executed
                    //          if we do not register any  the senders will just add $Xitem to user speech to be used in the cms condition


                    //  $xiTEM SO THAT THE  cms condition can use the resolved item instead of do a match with a regex
                    //      so we can do the cms routing without match the item with a regex but usingf the matcher match
                    //      >> we could also run the middleware injecting a ask ctl that  just ask the std senders to set std $x +
                    //          rrequest the end ctl to run on a defalut action res.action='cmd.field' so that if we register a end ctl on the cur page
                    //              it can be interpelled if can give a bl+routing on that res.action in order to run bl and ovewritten the default
                    //              senders action that is just to pass routing info (as before , the matching item) to cms routing for the ask field


                    //      >>
                    

                    // update 09092019 : fire the same the middleware that run doing fw staff without a user onchange ctl x related field
                    // WQD 
                    var lastcbret = await expressCtl.run(req, res);//,send_);// TODO must return a promise so return/await expressCtl.run(req, res, send);
                }

                /* 092019 >>>>>  AFTER expressCtl returned after the middleware worked on req and res to do their job
                    usually all req and res updates in middleware are used as local middleware vars but can be used also after expressCtl returns to do some staff here
                    TRY to use only session status to recover all middleware output/results 
                    specifically in session we have all fw staff (ctx, newpage, actcontext,.... ) so use it :
                     - session (all or in part) will be added by botkit send middleware in channelData , set in aiv3,
                                                ( or by adapter (ex using its middleware,  see BotBuilder Adapter Middleware in botkit docs) 
                                                if the send fron conversation.handlemessage do not call send middleware )
                          the client will use session to perform some action on local device , specifically get in  session.ctx the data for vui engine (newpagevui + dyn (also updates)) 
                        >  so in middleware ctl we must set session data to be sent before exit middleware of before call bot.say
                    - newpage : if found we know that
                        - a bot.say sends a msg with the prompt for next dialogset and session.ctx x vui definition 
                            > so  a new cms url server dialogs  must be loaded cms.loadAllScripts(,newcmsurl,) just expressctl returns because when user send the response cms.testtrigger()
                                 will be called so be sure to have all current download finished before ask new cms server to test the trigger
                          
                    - actContext will be used by testTrigger to give preference in matching   

                // only in After:




                */

                if(session.newpage){
                    let newcmsurl=newpage;// change only a part of url !!!!
                    cms.loadAllScripts(this._controller,newcmsurl,null)// same password
                    // is sync so at return all dialog are loaded and added to dialogset !!

                }


                let condition;// TODO      condition=.....

                // INSERT ON user SPEECH (new_value) a var to be used in cms condition x cms routings  
                // make available to conditions handler regex also the result of useronchange condition, or just the matching item if null:
                if (addConditionInMessage&&session.Match_Param) {
                    if (!condition) {
                            if(typeofsession.Match_Param === 'string' || session.Match_Param instanceof String)condition = session.Match_Param;// current ask match
                            else condition = session.Match_Param.complete;// the result of res child or a dyn field is this 
                            new_value = condPre + condition + ' ' + new_value;// example insert on user speech : 'onchange=' + asksessionmatch
                }}
                // before returnong make available to next message template var also session state :
                convo.vars.session = session; // non basta giusto al primo begin ??? tanto il convo.vars si passa da command a command per tutta la sessione !
                return;
            }// ends  scalarFieldCtl()


        });//  ends OnChange
    }// ends fwOnChange



}// ends appCtl class



// *** following  the appCtl class CLOSURE : their prop are available to appctl instances 









/* why we copied this here ??? 

class BotkitUserState extends UserState {
    getStorageKey(context) {
        
        */ /* todo
const activity = context.activity;
const channelId = activity.channelId;
if (!activity.conversation || !activity.conversation.id) {
    throw new Error('missing activity.conversation');
}
// create a combo key by sorting all the fields in the conversation address and combining them all
// mix in user id as well, because conversations are between the bot and a single user
const conversationId = Object.keys(activity.conversation).sort().map((key) => activity.conversation[key]).filter((val) => val !== '' && val !== null && typeof val !== 'undefined').join('-') + '-' + activity.from.id;
if (!channelId) {
    throw new Error('missing activity.channelId');
}
if (!conversationId) {
    throw new Error('missing activity.conversation.id');
}
// @ts-ignore namespace is technically private
*/ /*
return `${channelId}/conversations/${conversationId}/${this.namespace}`;// that is x conversation state, change to get user state ?
}
}*/




/*
original awaiter and a new version x ....... ?

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator,lastpromise) {// generator is a bank of promise
    return new (P || (P = Promise))(function (resolve, reject) {
        // bank promise if fullfilled call with param void or desidered i : was the next() param !!
        var i=0,imax=generator.length;
        function fulfilled(j) { try {if (j) step(j);else step(i++) } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(i) { if(i<maxi){ if(lastpromise){lastpromise.then(fulfilled, rejected)}else{resolve(i) }}
                                    else{ bank[i].then(fulfilled, rejected);} }
        step(0);
    });
};
*/
function runProm(req, res, cb) {// res={cb,par1,par2,...}
    _res = res; _req = req; _cb = cb;
    step = 0; // or set a step corresponding to a initial 
    if (nf > 0)
        //bank[0](req, res, next);
        __awaiter((this, void 0, void 0, function* () {
            // trigger a special shutdown event
            yield this.trigger('shutdown');
            if (this.http) {
                this.http.close();
            }
        }));
}
var routeMid=
function routeMid() {// an object definition inside a private closure ( module ). IS THE middleware configurable factory


// 20092019 : decidere cosa passare come context alle funioni bank[i]


    /* usual ctls added by use :
        expressCtl.use('cfg',userExpressCtls.mng.endCmd_Bl_Routing_Cfg);// cfg the following
        expressCtl.use('endAsk_Cmd',userExpressCtls.mng._Route_On_AskConvoEnd)
        expressCtl.use('pageDisp',userExpressCtls.mng.__Route_onPageEnd);// move here the dyn part and make it available to vui ctl
        expressCtl.use('dyn_vui',rout_insdyn_insvui);

    todo https://dev.to/geoff/writing-asyncawait-middleware-in-express-6i0 + 
        http://www.acuriousanimal.com/2018/02/15/express-async-middleware.html
    app.get('/hello', async (req, res, next) => {
  try {
    // Do something
        next();
    } catch (error) {
    next(error);}});
    app.get('/', asyncMiddleware, (req,res) => {
    const { title, body } = req.data;
    req.render('post', { title, body });})


    example of use : shutdown==middleware.run
     * in a async function :
     * await controller.shutdown();
     * controller.on('shutdown', async() => {
     *      console.log('Bot is shutting down!');
     * });
     * ```
     
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            // trigger a special shutdown event
            yield this.trigger('shutdown');
            if (this.http) {
                this.http.close();
            }
        });
    }
    */
    
    // in case i want to pass some context to bank functions, example:
    var myctl=this;// make available the calling context ( suppose call aiv3.routeMid(()) as myctl .. or better pass conversation as this in bank function ? 
    
    
    var bank = [];
    var ind = {};
    var nf = 0;
    var _cb;/// called at the end of registered ctl chain . will CB TO : ..................... resuming bot process
    //var _res, _req;will be  set in spaw instance

    // >>>>>>>>>>>>  ref Reference for req and res :
    //  NB req will relay to session status. remember that x convenience status on convo scope are set in convo.vars and 
    //      status on middleware span are x convenience named as authonomus var in req.xx and res.yy 

    //  >> req is created by ReqConst()  see it 
    //  req = {msg:textresponse, convo, bot, cmd: command,askey:field,match:session.Match_Param  // onchange cb param 
    //          results, bot // cmd ?  After cb param (isAfter=true) ,  ( nb bot is also in onchange)
    //           convo, bot, cmd: command, thread: field?, // before  ( nb convo,bot,cmd are also in onchange)
    //           session,curpage };// session.curpage= is the new page !,  msg is text or std botbuilder msg format ??
/*
    /* 
    use : 
    req =  new ReqOnChange(text, convo, bot,command,field,match,thread,  // onchange req
                            session,curpage);

    req = new ReqBefore(convo, bot,command, thread, //  before  req
                            session,curpage); 

    req = new ReqAfter(results, bot,cmd, // msg ??  after req 
                            session,null);
*/




    //  >> res is created by ResConst()  see it 
    // res={    ( {senders:{convo_bot_fb,renderCms}};,( see usrSendcb) ,) // solution  adopted , see run() and usrSendcb()  code
    //          channelData, // needs ?
    // 
    //          GROUP A : middleware status var exposed as is but all  them are packaged into a unique rooting proposal res.route.routings  to be examined by last cb , the sender : 
    //          newpage, // duplicated on route.routings.nextpage, just to say some ctl of chain, or more often lastcb_cb and its senders,  that there is a page changing (the channelData.vui setter)
    //          nextpreprompt, // duplicated on route.routings.msg (to say in this cb) or in route.routings.conText
    //          newpageurl, // useless ?

    //          we choose to do duplication of GROUP A in  unique rooting proposal res.route.routings  to check in ctls in alternative to group A and expecially  in senders 
    //                     infact is  better uniformize routing info 
    //                          that can be used insted of set a sender params with :
    //                              res.senders.conditioncms.set(conition=....) or  res.route.send.sender.condition=...
    //          route, (alternative or) duplicated of GROUP A put all routing vars inside , 2 format : 
    //                          -res.route.routings =
    //                          { newpage, actContext, next=[nextcmd,nextthread], msg (to say in this cb) ,conText (to insert preprompt as a known context on next message),actionCms (2inserton_$X)}
                                                     // senders independent format : converted in  senders 
    //                          - old format : can use this if want to select the sender to use in cb : res.route.send.sendernamelike_renderCms.condition={newpage,msg,actContext,next=[nextcmd,nextthread]}  // senders dependent format 


    //          dyncontent ={adyn:[[],,,]},   used in rout_insdyn_insvui    to pass dyn to vui ctl 
    //          res.isAfter will be added , send will be added before call routeMid.run in begin after and onchange
    //             curdynmap,//filled usually by fillDepending(),curdynmap={curConvoResolvedEntity1:} added 10082019 : now the dyns are risolved on the lev 1 ctl (type=endAsk_Cmd) of this middleware , so fill curdynmap so vui fw can add dyn in vui json x ve engine
    //          dynServHelper=FwHelpers  ,// it is alredy ref in aiv3 functions 
    //          action // the routing post ctl entry requested x Route_onPageEnd (unique x all cb) page rooting middleware ctl 
    //          }// 





    function Spaw(req_, res_) {// no cb (in param), because is the same class for all run !!

        // a generator function  use as new Spaw, can return promise ? 
        // this is the running middleware  process controller obj : will cycle req and res on configured ctls
        //		2 way to implement :
        //		1: like __awaiter with a function that store the req res and index in the closure and 
        //				run other function next that iterates using the closure data 
        //		2: using an object that store req,res,index as obj properties and 
        //				launch a iterating method that iterates sing the object properties
        
        // implement way n 2 :
        
        
       // var req, res, step;
        const async_=true,// in bank put async function assuming this is ......... ex myctl
        here_=true;
        this.res = res_; this.req = req_;// called when next finish eventually after run cb
        this.step = 0;
        // used in KHR : creates a promise to fullfill calling the chained reference this.resolve when the middleware chain will end
        // the promise constructor   launch a function that wiil garantee tha sometime the promise resolve and reject cbs will be called using reference this.resolve and this.reject
        //  >> as middleware _cb return promise is resolved , this.resolve will be called , see in  KHT )
        this.rProm=new Promise(function(resolve,reject){this.resolve=resolve;this.reject=reject}.bind(this));// creates a promise that launch a function that wiil garantee tha sometime the promise resolve and reject cbs will be called (as middleware cb return resolve will be called )
        // this.getP=function(){return rProm}
        this.getP=function(){return this.rProm}// not prototype function ????


        this.prototype.next__ = function (i) {// use  with this.next__  , MAIN FUNCTION
            // so  we pass this object as context to next__ so can use the local step,res,req  vars

            // no async :
           if(!asinc_) {
               if(!here_){
                // use a static ext func but pass this    
                next.call(this, i);
            
               }else{
            
            	// or better 
            	// 1 : just copy next here , using this naturally
            
            	this.step++;
            	var j = this.step;
            	if (i) {// i is a step > step
                	if (i > j) {
                   	 if (i < nf) j = i;//  j=i
                   	 else j = nf - 1;// last
             	  	 }
            	}
            	if (j < nf) {
            	this.step = j;
               	 	// can provide cb to access info to complete the middleware function s if info not in req ????
                	// but i can put the cb in res , so res. cb giving a reference to a obj function i can 
                 	// no async :  
                 	bank[this.step](this.req, this.res, this.next);// bank[this.step].call(myctl,this.req, this.res, this.next);
                 	// using  async in bank : ??      bank[this.step](req, res).then(fulfilled,rejected);
            	}
            	else _cb(this.req, this.res);
            
            
            
            	// or 2: relay to a same instance func  :  this.prototype.next_(i);
            }

        }else{// async 
            if(!here_){//??
            // error , not permitted 
            
               }else{// here 

                // IMPLEMENTED HERE 

                this.step++;
                var j = this.step;// the next current index step
                if (i) {// i is a desidered step  so is (> step < nf)  or is 0
                    if (i > j) {
                        if (i < nf) j = i;
                        else j = nf - 1;// last
                    }else

                        if(i==0){// is starting 

                            //bank[0](req, res).then(this.prototype.fulfilled.bind(this),this.prototype.rejected.bind(this));// not pass static function !! , question : what is the context passed by promise ?
                            j=0;// start at beginning

                        }else

                        if(i==-1){// next 

                            j=this.step;
                        }
                        else

                        if(i==-2){// go to end cb 

                            j=nf;
                        }else j=this.step;// residual


                    
                }
                // so goon step j
                if (j < nf) {
                this.step = j;
                    // can provide cb to access info to complete the middleware function s if info not in req ????
                    // but i can put the cb in res , so res. cb giving a reference to a obj function i can 

                     // using  async in bank , similar to conversation.runAfter() techique where we pass conversation as context to promise builder: 
                    //  bank[this.step].call(myctl,req, res).then(this.fulfilled.bound(this),this.rejected.bound(this);// fulfilled will iterates with next__() .  do not pass static function !!
                     // se context myctl , the cb are spawn function that when called by resolved promise must be bound to this instance 
                    // bank[this.step].call(myctl,req, res).then(this.fulfilled.bound(this),this.rejected.bound(this));// fulfilled will iterates with next__() .  do not pass static function !!
 
                     bank[this.step].call(myctl,req, res).then(this.next__.bound(this),this.rejected.bound(this));// fulfilled will iterates with next__() .  do not pass static function !!
        
                     // QUESTION : use Promise.bound(myctl) : WHEN ??? 
                     // 			this.fulfilled are called with some context ?? 
                     
                     
                     
                }else {
                    
                    // KHT 
                    // _cb.call(this,req,res)=usrSendcb(req,res) returns the  promise =renderCms.send() 
                    // that when fullfilled,  here calls this.resolve(fullfilled value) 
                    // this.resolve is the resolve cb of the promise this.rProm returned  when launched the chain in WQD : this.rProm=expressCtl.run(req, res)
                    // so await this.rProm is fullfilled and the bot process can goon 

                    // see WQD :  in aiv3.fwonchange >  
                    //          ... register  onchange  ....  
                    //                  if succesful matched calls  scalarFieldCtl() >
                    //                       ....  await rProm=expressCtl.run(req, res) rProm will be fullfilled calling its resolve func 
		             //					 when in KHT :
		            //					 - (calling the middleware cb) , the promise _cb.call(this,req,res)=usrSendcb(req,res) , that is the  promise =renderCms.send(), fullfils
		            //					 - OR the chain stops 
		            //						 , so bot can goon )
                    if(_cb)_cb.call(myctl,this.req, this.res).then(this.resolve,this.reject);// pass myctl context  to _cb , return the middleware results fullfilling the promise with cb return value 
                    else this.resolve(0);// the last ctl returned a resolved promise 
                
                }
               }
            }


        }// ends next__()
        
        this.prototype.next_ = function (i) {// no async case, this will be the spaw controlling ... !!
            this.step++;
            var j = this.step;
            if (i) {// i is a step > step
                if (i > j) {
                    if (i < nf) j = i;
                    else j = nf - 1;// last
                }
            }
            if (j < nf) {
            this.step = j;
                // can provide cb to access info to complete the middleware function s if info not in req ????
                // but i can put the cb in res , so res. cb giving a reference to a obj function i can 
                 // no async :  bank[this.step](this.req, this.res, this.next);
                 // using  async in bank :
                 bank[this.step](req, res).then(fulfilled,rejected);
            }
            else _cb(this.req, this.res);
        };

        function next_Static(i) {//is this visible ? no because here is a static function (true ?) 
        
        	// so here this is windows !!!  to correct
            this.step++;
            var j = this.step;
            if (i) {// i is a step > step
                if (i > j) {
                    if (i < nf) j = i;
                    else j = nf - 1;// last
                }
            }
            if (j < nf) {
            this.step = j;
                // can provide cb to access info to complete the middleware function s if info not in req ????
                // but i can put the cb in res , so res. cb giving a reference to a obj function i can 
                 // no async :  bank[this.step](this.req, this.res, this.next);
                 // using  async in bank :
                 bank[this.step](req, res).then(fulfilled,rejected);
            }
            else _cb(this.req, this.res);
        };

                // instance function  : called by this.prototype function passing this context 
               this.prototype.fulfilled= function 
                fulfilled(value) { try { // value is the resolved ctl promise , -2 meanc stop chaining other midleware ctls , -1 goon next , i goon jumping to i step
                    
                                            /*
                                             if(value==-2){// stop other ctls, go to cb 


                                                //_cb(this.req, this.res);
                                                this.next__(nf);// exit afyer cb if exists 
        
                                             }
                                            // else this.next_(value);// goon
                                            // or  
                                            else  if(value==-1) this.next__();// goon
                                            else this.next__(value);// goon
                                            */
                                                // or simply 
                                                this.next__(value);
                
                                        } catch (e) { this.rejected(e); } 
        
            }
            this.prototype.rejected=function rejected(err){
                // todo   _cb(this.req, this.res,err);
                
            }


        // static : called by this.prototype function without pass this context 
        function 
        fulfilled_Static(value) { try { 
            
            
                                     if(value==1){// stop other ctls, go to cb 
                                        _cb(this.req, this.res);

                                     }
                                    else aspaw.next();// goon
        
        
                                } catch (e) { rejected(e); } 

    }
    function rejected_Static(){
        
    }


    return rProm;
    }// ends spaw

    function next(i) {// this will be the spaw controlling instance in case we want use noasync nohere!!
        this.step++;
        var j = this.step;
        if (i) {// i is a step > step
            if (i > j) {
                if (i < nf) j = i;
                else j = nf - 1;// last
            }
        }
        if (j < nf) {
        this.step = j;
            // can provide cb to access info to complete the middleware function s if info not in req ????
            // but i can put the cb in res , so res. cb giving a reference to a obj function i can 
             // no async :  
             bank[this.step](this.req, this.res, this.next);
             // using  async in bank : ???  bank[this.step](req, res).then(fulfilled,rejected);
        }
        else _cb(this.req, this.res);
    };


    let cb, // the last cb on a .run call . if cb is the same on all .run we can register with senders in .cb call
        //              so next cancall al last the static cb recovering with   this.cb
        // if last cb will be set on .run then must be added on res  !!!  >> TODO if so wanted 
        senders;
    var route = {
        run: function (req, res) {// }, cb) {// new run without cb that is unique x all middleware .run calls . nb :  res={cb,par1,par2,...}
            res = Object.assign(res, senders); // add senders on res .  _cb = cb;
            step = 0; // or set a step corresponding to a initial 

            if (nf > 0) {
                aspaw = new spaw(req, res);
                var prom=aspaw.getP();// return  this.rProm : the promise to fullfill when the ctl chain will be done
                // no async : bank[0](req, res, aspaw.next);
                // using  async in bank :
                bank[0](req, res).then(fulfilled,rejected);
                return prom; // KHR:  return  this.rProm : the promise to fullfill when the ctl chain will be done
            }

            // FULLFILL FROM BANK
            function 
                fulfilled(value) { try { 
                    
                    
                                             if(value==1){// stop other ctls, go to cb 
                                                _cb(this.req, this.res);

                                             }
                                            else aspaw.next();// goon
                
                
                                        } catch (e) { rejected(e); } 

            }
            function rejected(err){
                console.log(' aiv3 middleware ctl resolving with a reject' );
                this.reject(0);
            }
        },
        // old not used any more
        runProm: function (req, res, cb) {// res={cb,par1,par2,...} , cb is the run cb (not the senders that will be tested on cb)
            _res = res; _req = req;
            _cb = cb;
            //step = 0; // or set a step corresponding to a initial 
            if (nf > 0) {
                aspaw = new spaw(req, res);
                bank[0](req, res, aspaw.next);
            }
        },
        use: function (name, fu) {
            bank.push(fu);
            ind[name] = nf++;
        },
        cb: function (cb_, senders_) {// senders registration , will be tested on _cb > so put senders on res OR make senders available in _cb this
            _cb = cb_; senders = senders_;// 
        }
    };
    return route
}

var FwHelpers;// FwHelpers={db,http,refImplementation:{ onChange_dynField:functiontoextractdynfield}} .  is not a factory is the obj !!!  set+get by intent_data_models that use it in httpService to do rest and mongo query
// filled in  done in appctl setDbHttphelp_in_res(db,http) with :
//FwHelpers=DynServHelper(db,http,this);//  done in appctl setDbHttphelp_in_res(db,http){
//or
// FwHelpers=new DynServHelperConstr(db,http,this);

function ResFactMaker(param) {// not used
    param_ = param;
    // res={send(){},newpage,channelData,nextpreprompt,dyncontent ,newpageurl,dynServHelper=FwHelpers;
    return function (newpage, channelData, nextpreprompt, dyncontent, newpageurl) {
        this.newpage = newpage, this.nextpreprompt = nextpreprompt, this.dyncontent = dyncontent,
            this.newpageurl = newpageurl,
            this.channelData = channelData;
        this.param = param_;
        this.dynServHelper = FwHelpers;// fw support to user cbs, in obj are db http and 
        // plus add then in the obj the send() function when start the controller 

    }
}


ReqOnChange = function (text, convo, bot,command,field,match,  // onchange cb param 
                        session,curpage) {
    // see  >>>>>>>>>>>>  Reference for req and res :

    //  req = {msg:textresponse, convo, bot, cmd: command,askey:field,match:session.Match_Param  // onchange cb param 
    //          results, bot // After cb param (isAfter=true) ,  ( nb bot is also in onchange)
    //           convo, bot, cmd: command, thread: field, // before  ( nb convo,bot,cmd are also in onchange)
    //           session,curpage };// session.curpage= is the new page !,  msg is text or std botbuilder msg format ?
    /* use : req =  new ReqOnChange(text, convo, bot,command,field,match,thread,  // onchange cb param 
    session,curpage);
    */
this.msg=text;
this.convo=convo;
this.bot=bot;
this.cmd=command;
this.askey=field;
this.thread=thread;
this.match=match;
this.session=session;
this.curpage=curpage;
}

ReqBefore = function (convo, bot,command, field,
                        session,curpage) {
// see  >>>>>>>>>>>>  Reference for req and res :

//  req = {msg:textresponse, convo, bot, cmd: command,askey:field,match:session.Match_Param  // onchange cb param 
//          results, bot // After cb param (isAfter=true) ,  ( nb bot is also in onchange)
//           convo, bot, cmd: command, thread: field, // before  ( nb convo,bot,cmd are also in onchange)
//           session,curpage };// session.curpage= is the new page !,  msg is text or std botbuilder msg format ?
/* use : req = new ReqBefore(convo, bot,command, thread,
    session,curpage); */
this.convo=convo;
this.bot=bot;
this.cmd=command;
this.thread=thread;
this.session=session;
this.curpage=curpage;
}

ReqAfter = function (results, bot,cmd, // cmd ?  msg ?
                        session,curpage) {
    // see  >>>>>>>>>>>>  Reference for req and res :

    //  req = {msg:textresponse, convo, bot, cmd: command,askey:field,match:session.Match_Param  // onchange cb param 
    //          results, bot // After cb param (isAfter=true) ,  ( nb bot is also in onchange)
    //           convo, bot, cmd: command, thread: field, // before  ( nb convo,bot,cmd are also in onchange)
    //           session,curpage };// session.curpage= is the new page !,  msg is text or std botbuilder msg format ??

    /* use : req = new ReqAfter(results, bot,cmd, // msg ??
                session,null);
 
    */
    this.results=results;
    this.bot=bot;
    this.cmd=cmd;
    this.session=session;
    this.curpage=curpage;
}

var ResConst;// must create a obj res as specifieds in routeMid (excluse send that will be appended after ):
//res={send(){},newpage,channelData,nextpreprompt,dyncontent ,newpageurl,dynServHelper=FwHelpers    }

// ResConstr=ResFactMaker(param);
// o simply
ResConst_ = function (newpage, channelData, nextpreprompt, dyncontent, newpageurl,req) {// version with a func creation  in each instance can absorb many params with req obj !
    // see  >>>>>>>>>>>>  Reference for req and res :

    // decidere se usare route or group A or BOTH (duplicated vars , route used only in final senders , ther used in all ctls of the middleware)
    this.route={};// here the param used by res.send senders 

    this.nextpreprompt = nextpreprompt;
        this.newpageurl = newpageurl;
        this.channelData = channelData;
        this.newpage = newpage, 
        this.route={routings:{}};// main routing complete info ,consolidates some other res properties like newpage,,,) x sender (or ctl)

        this.dyncontent = dyncontent||{};

   // this.dynServHelper = FwHelpers;// fw support to user cbs, in obj are db http and 
   this.services=intDataModels.services;
   if(intDataModels.dialog.dynamic[req.askey]){
    if(intDataModels.dialog.dynamic[req.askey].qeA)
        this.prototype.qeA=
                        /*  >>> THE CLOSURE IS THE constructor ITSELF !!!
                        (function(msg){let msg=req.msg;
                                   // return function(){intDataModels.dialog.dynamic[req.askey].qeA(msg);}})(req.msg);
                                    return function(){intDataModels.dialog.dynamic[req.askey].qeA(msg,intDataModels.services);}})(req.msg);// one shot
                        */
                       // > so simply :
                       function(){intDataModels.dialog.dynamic[req.askey].qeA(req,intDataModels.services);};

    let services_=services;//intDataModels.services_; // or services

    if(services_){

     //for (let key in services_) {// bind all services_ to dyn field descr 
       // services_[key] = services_[key].bind(intDataModels.dialog.dynamic[req.askey]);        }

        this.prototype.myservices_=function(serv){// only the services_ called here will be bound to dyn field descr , 

            services_[serv].bind(intDataModels.dialog.dynamic[req.askey],req,services_);// inside i can call services_.somegeneralserv(req,,,) that is bound to services_ !


        }


    }
}






/*
this.services=intDataModels.services;
this.prototype.qeA=  function(){intDataModels.dialog.dynamic[req.askey].qeA_func(req.msg,intDataModels.services);};
this.services_=intDataModels.services_;


this.prototype.services_=function(){intDataModels.service_;};
   this.prototype.services_=function(qx){intDataModels.service_[qx].call(intDataModels.dialog.dynamic[req.askey],req,null(noservice_AsIsThis);};
         this.prototype.services_=function(){intDataModels.service_[qx].call(intDataModels.dialog.dynamic[req.askey],req,null(noservice_AsIsThis);};
*/





                        

    // plus add then in the obj the send() function when start the controller 


    
}
ResConst = function (newpage, channelData, nextpreprompt, dyncontent, newpageurl,req) {// can absorb many params with req obj !
    // see  >>>>>>>>>>>>  Reference for req and res :

    // decidere se usare route or group A or BOTH (duplicated vars , route used only in final senders , ther used in all ctls of the middleware)
    this.route={};// here the param used by res.send senders 

    this.nextpreprompt = nextpreprompt;
        this.newpageurl = newpageurl;
        this.channelData = channelData;
        this.newpage = newpage, 
        this.route={routings:{}};// main routing complete info ,consolidates some other res properties like newpage,,,) x sender (or ctl)
        this.services=services;
        this.dyncontent = dyncontent||{};
        this.req=req;

   // this.dynServHelper = FwHelpers;// fw support to user cbs, in obj are db http and 


    
}


ResConst.prototype.qeA=async function(){
this.services=services;// this.services_=
if(intDataModels.dialog.dynamic[this.req.askey]){
 if(intDataModels.dialog.dynamic[this.req.askey].qeA)
return intDataModels.dialog.dynamic[this.req.askey].qeA(this.req,this.services);};
}


ResConst.prototype.myservices_= async function(serv){
    let services_=services;
     if(services_[serv]&&intDataModels.dialog.dynamic[this.req.askey]){
    
      //for (let key in services_) {// bind all services_ to dyn field descr 
        // services_[key] = services_[key].bind(intDataModels.dialog.dynamic[req.askey]);        }
    
        // only the services_ called here will be bound to dyn field descr , 
    
             return services_[serv].bind(intDataModels.dialog.dynamic[this.req.askey],this.req,services_);// inside i can call services_.somegeneralserv(req,,,) that is bound to services_ !
         }
    
     }
    
    

// so res= new ResConst(newpage,channelData,nextpreprompt,dyncontent ,newpageurl); then will be  addded : res.send=function....





//var dynServHelper;// filled calling DynServHelper(db_,http_,aiv3_);or new DynServHelper_constr in 


function DynServHelper(db_, http_, aiv3_) {// an object definition inside a private closure ( module )
    // because it not use any other var in this module scope

    // THIS helper staff can be put in a module . user can use/change  the implementation according its needs 

    //onChange_dynField: helps preparing the rest/db call starting with its param
    // rest : a reference rest caller using a http compatible with 

    // like botkit function but here we create :
    //      - a object with manu functions  working in the closure ! 
    //         - not a simple function inside the closure
    // like a object function(closure) that return or pass a ref cb of a function working on the closure
    /* create an object supportinf std func to do  db query or a rest to get a param or a voiice dyn query on a entity space
    */

    // TODO aiv3 ????

    let aiv3 = aiv3_;


    var dynServHelper = Object.assign({// aiv3 is in closure ce get from api like getFwCtl;
        db: db_, http: _http,
        getFwCtl: function () { return aiv3 },// aiv3 api 
        getDialog: function () { return aiv3.intDataModels.dialog },//aiv3 api {dialog,{rootcfg},,,,,}// 
        getRoot: function () { return aiv3.intDataModels.root },
        getIntDataModels: function () { return aiv3.intDataModels }
    }, refImplementation);
    /* or
    var dynServHelper =
    onChange_dynField: refImplementation.onChange_dynField,
    rest:refImplementation.rest,
    db:db_,http:_http,
    getFwCtl:function (){return aiv3}
    
    */

    // if want a instance return  new DynServHelperConstr(db,http)

    return dynServHelper;
}

// probaly better then DynServHelper

function DynServHelperConstr(db_, http_,aiv3) {// db & http manager , receives from user cfg the managers, add refernce od aiv3 and refIplementation beginning a inner of them.  an object to new   returning FwHelpers :a obj with methods 

//09092019 put in aiv3, 
// warning here we extend the calling this with refImplementation (aiv3 aswe call aiv3.DynServHelperConstr() )
//  DynServHelperConstr and refImplementation can be put in a separate module 

    // THIS helper staff can be put in a module . user can use/change  the implementation according its needs 

    //onChange_dynField: helps preparing the rest/db call starting with its param
    // rest : a reference rest caller using a http compatible with 

    // like botkit function but here we create :
    //      - a object with manu functions  working in the closure ! 
    //         - not a simple function inside the closure
    // like a object function(closure) that return or pass a ref cb of a function working on the closure
    /* create an object supportinf std func to do  db query or a rest to get a param or a voiice dyn query on a entity space
    */

    //this.db = db_; this.http = http_;

    Object.assign(this,aiv3,refImplementation);// this=DynServHelperConstr,  user can modify this example
    this.db = db_; this.http = http_;
    // or
    // this.onChange_dynField=_onChange_dynField;this.rest=rest;
};

var refImplementation = {// examples where user can see how to use aiv3 fw api to do call to its db and http service to have convo.vars dyn_models/param loaded  
    // seem for customization is better to find user db and http set before as object and find api also as members that
    // can use aiv3 staff put in the obj closing , or as object temporarely 

    // user var : db, ....... decide if put in param or in this that will be set by caller (so put in appCtl class class ?)

    onChange_dynField: async function 
                        
                        (req, isDb_Aiax, schema_url, sess_clone, sess_dyn, paramList, prefill, map, afterallDyncalc) {// a inner of main ctl code, req has different  std ctl chain format !


        /* 12122019 Summary 
           fw db/rest dyn query x tfs/autocomplete join query on std entity model x view/voice + bl : instance={id,value,patt,data,,......}// value is the voice name of the entity instance 
           will do db/rest query on db collection schema associated to field dyn req.askey described in dialog  with where map paramList and 
                join on qs.join_1_m or qs.join_n_m if have  matched values in session.Match_Param
:
            PARAMS:
                     req=  { convo, session, askey,qs }
                              qs : {term=qs.term,regex_=qs.regex,full=qs.full,inter=qs.int;join_1_m=qs.join_1_m,join_n_m=qs._join_n_m,fts=qs.fts} // vui gui gui+ ossia solo id o id+fields

            RETURNS        
            - a promise that fullfilled call a function res: promise.then(res,rej) res called with  1 param: {rows,reason}. 
                - reason give the reason of why rows is void 
                - rows is array that is field map of a master db projection deoending by qs.inter and qs.full 
                        if !full 
                            if paramList : the rows are filtered on where field (view or bl fields) according to  paramList map 
                            if qs.join_1_m or qs.join_n_m   the rows are joined the rel ref  with id of join_x_m row  selected on col match wherex=value = current join_x_m match (look in Match_Param[join_x_m].match)
                            if qs.term  findClause={patt: regex=new RegExp(term, 'i')}, if qs.regex  findClause={patt: regex)}
                        nb  is  the same rows format served in page and aiax ctl of project vuiengine_v2

            - null if cant do its job of the query is null



            > so the calling ctl in ctl chain must set the dyn status Match_Parm[]....  from the received resolved value {rows,reason} (see res={}):
            reason  json > rows= a json map of master field query rows
                    err > rows=  error message  
                    byte > rows= array of coded numbers       

          
        */

        // DETAILS : 
        //          ...........................
        //  caller to set paramList will   uses session.Match_Param to set paramList (wheres) map with values=matches got  in previous steps/turns (no join just where on specific col)
        //      nb : dont setany value in  session.Match_Param for dyn askey 
        // TODO  we can add also user text req.msg to do a fts too in db, now only where join query on paramlist but with a IN clause if a idspace=prefill is specified 
        // prefill is not void if previously turn fts on dyn algo selected a id space from where to do refining 
        //      a prefill if effective only id have dimension <20 (tobe checked before call this)
        //      otherwise the previous fts is not good, and we goon from a query on full space  with only where join  then a new fts will will try to match 
        //var dialog = this.getDialog();
        // we have alredy 




        // >>>>>>>>>>>>    req is custom obj :  
        //   req = { convo, session, askey,qs } , 
        //   qs : {term=qs.term,exec_=qs.exec,full=qs.full,inter=qs.int;join_1_m=qs.join_1_m,join_n_m=qs._join_n_m,fts=qs.fts} // vui gui gui+ ossia solo id o id+fields
        var { convo, session, askey,qs } = req;// askey : the dyn field to query with where on paramList



        //  req = {............ };// is a different fron ctl chain req !

        /* >>>>>    onChange_dynField()  122019 management SUMMARY 

        using a db connection do 
        - query on mongoose schemas using db 
        OR   
        - relay by a GET/POST AIAX (TO DO ) using PARAM SET .( in post ctl  url will refears to  local db schema ( url comes from  dialog.dynamic[].schema_url) ) 

        * db case : cols : 
            dyn voice fields  { "patt": 1,"value": 1,"descr": 1,"data": 1 } ( patt is pattern, value is the entity (voice/gui) name )
            + its bl fields on db table/collection

         PHASE 0
             Recover matched values and set a where map to query : qs=wm={where0:value,where1:value2}

         PHASE 1 
             preset the  query on master field : choosing fields/cols to get ( from full and inter) and the search term on what fts field to serch (patt) 
    
                        see https://mongoosejs.com/docs/queries.html

                     dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >  query=mymodel.find({patt: regex=new RegExp(term, 'i'),col_served= {'_id':0,'patt': 1,'descr':1 }})

                     findClouse={},selClouse={}
                     if term  findClause={patt: regex=new RegExp(term, 'i')}
                     if regex  findClause={patt: regex)}
                    col_served :
                    gui :  selClouse={'_id':0,'patt': 1,'descr':1 }  , if term  findClause={patt: regex=new RegExp(term, 'i')}
                    deb :   nothig to do , serving all cols + '_id'
                    vui :   full:   selClouse={ "patt": 1,"value": 1,"descr": 1,"data": 1 } ( comprende  + 'id')
                            else :  chain with .distinct('_id') too , query=mymodel.find(findClouse,selClouse);
                    bl  : return a row (or get rows[0]) with business field to consume x bl, no join  just paraList (usually :{value:'amatch'} or {id:'anumber'})




         PHASE 2
              add where in voice field{ "patt": 1,"value": 1,"descr": 1,"data": 1 }; or bl fields   
                         for promise modesee https://stackoverflow.com/questions/33645570/nested-query-with-mongoose
                         : https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
                         : http://mongoosejs.com/docs/queries.html

                query.select(['patt', 'data']);
                  OR (??????????)
                query=query.where(wm)            

         PHASE 3  
                add join clause if there is specified join_1_m and join_n_m , then run queries  

                         query the main dynfield1 using a 
                            - where clause on wherefield ( usually on 'patt' and some bl fields )
                            AND 
                            - join by id on ref_1_m , recovered by dynfield1 schema, 
                               on the id of  match (value=Match_Param[join_...].match) of related table join_1_m and join_n_m 

                   nb TODO : join on join_n_m  

         EXAMPLE : 
                                            dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >
                                            >  query=mymodel.find({patt: regex=new RegExp(term, 'i'), {'_id':0,'patt': 1,'descr':1 }}) >
                                            > query=query.where(wm)     
                                             ...... match on join table getting mycity._id
                                            >  query.where(ref_1_m).equals(mycity._id);   
     
                                            
         RETURNS        
            a promise that fullfilled call a function res: promise.then(res,rej) res has 2 param: res(rows,reason). reason give the reason of why rows is void 
            query result fullfilled by promise must return rows array that is field map of a master db projection deoending by qs.inter and qs.full
                        the case depend on other params 


                      
            query result fullfilled by promise must return the same rows format depending from served in page and aiax ctl of project vuiengine_v2
                      > so the calling ctl in ctl chain must set the dyn status  from the received rows that has format :
                null if cant do its job of the query is null
                  ...........................
            nb 
                dont set session.Match_Param for dyn askey but uses those to get paramlist (wheres) matches 
                    TODO  we can add also user text req.msg to do a fts too in db, now only where join query on paramlist but with a IN clause if a idspace=prefill is specified 

         SQLITE DB with MATCH case to do FTS  
            TODO : use the same schema , just change the case formatting using functions 

                                            
         FTS COMMENT 
            if want to do fts match on db you cam map a query case using  ( qs.term is used for simple entity query for get bl fields ) qs.term1/fts  param that will set a fts case on db (TODO)
            or
            receiving the returns  we can do FTS qea locally using a duplicated ( id,patt,value ) db or obj structure 
                     training must be done on  patt field  or in some section of a partitioned wherejoin param  space (x less common where values)
                 example partition the training set in 10 parts each covering a where space segment
                 after qea result do a join with the where in the section to get the final qea list 
                 or do a fts whith match and where join then ?
                

         PARAM SET 
            ( TODO  FIND a set of param to relay the db search with a  GET/POST AIAX) are :
                 // req = {............ };// express req  is  different from fw ctl chain req !
         sess_dyn : seems no more used !!
         dynfield1 =req.askey = dyn field name 
         req.session = session
         req.convo = no more used to set convo.vars.
          req.qs;//param and qs coming/going to a rest endpoint ( insert into http if do rest call, not db query )
          term=req.qs.term;
          exec_=req.qs.exec
          full=req.qs.full
          inter=req,qs.int // vui gui gui+ ossia solo id o id+fields
          fts.req.fts
          id=req.id : simple extraction cx bl access of any  row fields 
         paramList the list of column to do where (max 2, beginning with 1)
         req.qs.join_1_m the join on 1_m rel wherefield  : where field is so called in all doc , different from  paramList that is column to do (where)selection
         req.qs.join_n_m the join on n_m rel wherefield 
         schema_url  is the schema name . if null (usually) will be deduced by schema_url=dialog.dynamic[dynfield1].schema_url
         prefill=Match_Param[].idspace if is not void if previously turn fts on dyn algo selected a id space from where to do refining .
               TODO use a cookey mantained on server table to avoid transmit all idset

          nb 
           this service has been ported from ve project 
              project : vuiengine_v2  or autoass
              ctlfile  :  indexcontroller_rest.js   
              controller serving page root
              controller autocoplete (x city) autocompl_city ( no where many format starting term x search)   ,autocompl_rest ( no where, ...)
                  on which we served from a db mono server  some page/rest request to give 
                  on page ctl serving  the db query produced the rows of patt, short descr  column 
                  on autocomplete ctl  the db call recovered rows  ( which obj/jsonformat of a row  ?) then sent as json 
           > now from ctl in ctl chain middleware we mast get some services to implement :
                  these services   must got same rows served by above ctl so do rest aiax to those service point or get the rows using tha same  db service call if the db service is local  

         122019 now depending if we have fts on host or  locally:
                     - fts/Q&A in db server :  
                            send the user text , idlist , where  param  
                            receive : id,descr, patt ( to give user prompt to refine idspace list ) so user can have a list of last match and can refine using suggestion calculated from patt list  
                                then   at success bl can got all item properties (row with all fields )  with a  query by id 
                     - fts/Q&A in local :  
                            send  ( idlist, if intersection is easier do in host ) , (AAA) where param if there is new where matches 
                            receive : idSp2 ( the join on where fields) with row = (id, (patt,) descr ) (AAA)  : to be effective that where join  must have dim < 50 !!! 
                                then if idlist not sent : fron local intersection fron idSp2 and previous idspace got new tempidspace (AAA)
                                then do 
                                    - position match if list has dim < 5 or ask x new where param or fts match 
                                     or
                                    - Q&A on section relative to the where param matched using user text , so intersecting with  tempidspace  got new  idspace and relative rows with descr, patt ( to give user prompt to refine idspace list ) 
                                    so user can have a list of last match and can refine using suggestion calculated from patt list  .... soon iterating tiill got success
                >> so in this first simple demo we start just do case (AAA)
        */
       let matches = session.Match_Param;// not convo.vars;

       // if(session.Match_Param)matches = session.Match_Param;// not convo.vars
         //    else return null;
        
        let dynfield1 = askey;// var ?

        /* old :
        let join_1_m,join_n_m,// : join_1_m=dialog.dynamic[dynfield1].join_1_m  field name of field corresponding to relation in master table . can be also static . 
                                // the matched value is found in join_1_m  Match_Parm ,.Match_Parm[join_1_m].match, then the id is found with a query on schema  dialog.dynamic[join_1_m].schema_url  
                                // so the id is used to find the join in master looking at corresponding join ref col (ref_1_m) in master schema of master dyn field dynfield1
        ref_1_m,ref_n_m;        // ref id col in join_1_m

        let term,regex_,fts,// term is a param reserved for col 'patt' (the master fts col ) , fts : match fts clause data
        full,inter; // vui gui gui+ ossia solo id o id+fields: define the result row column
        */

// added 25012020 >
let {msg,
    wheres_jRef,
    isRef,
    join,
    is_n_m,
    schema_url,
    regex,// what is this ? , should be a template to create regex !
    full,inter,
    fts,
    isHttpRest_mongo,
    matchWhere// calc match in this retry turn , otherwise must be done in previous field msg with collect match
    //  map, ......
    }=qs;//  qs eredited from dynamic[field]: , se X2
    let text=msg.text;

function getMatch(field) {
	if(matches[field]&&matches[field].match)return matches[field].match;
	else return null;
		 
     }
     /*
 { 
	 }


 
qeAdata= { 
	consW=[],// consolidated where matched = prevW||newW
	prevW=[],// prev where matched = prevW||newW
	newW=[],// prev where matched = prevW||newW
	matched=[
		[copyofMatch_Param[where[0]].match , itsId_ifisRef[0]]
	  		,,,,
		],// copy of mathcher + id if , to join , we use ref in schema 
	curRows=[],// current query result on consW ( + fts)


 } 
*/

function initWC(len) { // init qeAdata data
if(!prevW)
	 { 
	prevW=(new Array(where.length)).fill(false);
	newW=(new Array(where.length)).fill(false);// or just clone, which is fast ?
	consW=(new Array(where.length)).fill(false);
	matched=new Array(where.length);

	 }
 }

function getMatch(i) { // can be a static or dyn 
// return the match of ask field join[i] that is related to present dyn field
//	- the cur match value 
//	or , if  is a join field , isRef=[i] ,  
//	- [match,id]

	 let field=join[i],id,value; 
    if(matches[field].match){// it matched on previous step (that cant retry !!) (see the AKU case) on this turn (but after last turn that set prevW[i])
                            // >>> so usually the matcher is lauched directly here in this dyn field without a step that collect/match that dyn!!  with matchProc(i) 
        if(matches[field].qeAdata&&matches[field].qeAdata.matched){return matches[field].qeAdata.matched; }// unusual : a join[i] loop dyn step  that probably calc also id , so pass it
        else return matches[field].match;
    }else return null;

 }
 async function singleTurnGenM(i) { 
    // Relay to dyn field matcher : relay to a db or rest service. In future also to a static matcher 
    // can be a static or dynamic declared field that we. match in this dyn step calling directly a matcher without insert the field in a specific step

// specify if , in case of a db model ,  it returns a value or [id,value] ..........

// 20012020 . simple 1 turn dyn db matcher , filosofia : smp=matcher(req) 
//  this matcher run as join field ,( name join[i]), ( field related with main dynfield)  partial matcher inside the main dyn (onChange) loop matcher
// as a matcher,singleTurnGenM,  will fill (the minimum) its Match_Param[join[i]] but without a loop status qeAdata (because is a single turn matcher)
//  because the loop status is mantained on the main Match_Param[thisdynfield] ( as thisdynfield=mainfield is a multiturn dyn with related field)
//  so can match 
//  - a static field using regex or 
//  - match a dyn using a schema with a regex on term=this user speech ( no loop to refine just match 
//      ( also a array so many values matched( ctl could choose one ) , but usually just a single match ) or not )



// return smp , really a dyn smp with smp.matched:[id,value], can be a matrix ? anyway in matches (complete=match) .match must point to first best value

let field=join[i],id,value; 
let qs=dialog.dynamic[field];
if(qs)
    return dodyn(qs);// a matcher for dynfield
else {
    qs=dialog.static[field];// a matcher for static field
    if(qs)return dostatic(qs);    else return null;
}

async function dodyn(qs){// dyn field matcher : relay to a db or rest service
    // rename http_db_rest(qs) , really do a single turn dyn selection in a unrelated dyn or in a related dyn join to prepare the join in the master dyn
    // try to use the same param as in httpservice , just leave out any field pointing to related entities 

    if(qs.isHttpRest_mongo) 
    // qs clone with only the single entity query without the related staff 
        return http_db(qs);
    // else ;//return http_rest_relay(qs);
    return null;
}

async function   http_db(qs){ 
                            // can be also the wrapper/relay  for any pattern selection ( like db/fts,qea algo ? )
                            // this will fill the Match_patt of the related field in session so 
                            // this is a base matcher , not a onchange matcher that mast start a ctl chain to do bl and routings 
                            // > add in qs some policy/filter/order directive to let algo some flexibility in doing its staff 
                            //          like fts db match algo in ve ??

                            // qs will have only the  entity staff part ( the query do not have join field, just term matching patterns) 
let {msg,
    wheres_jRef,
    isRef,
    join,
    is_n_m,
    schema_url,
    regex,
    full,inter,
    fts,
    isHttpRest_mongo,
    matchWhere// calc match in this retry turn , otherwise must be done in previous field msg with collect match
    //  map, ......
    }=qs;//  qs eredited from dynamic[field]: , se X2
    let term=text=msg.text;
    if(!db||schema_url)return null;
    let model0=db.model(schema_url);

    if(model0) return null;
// ....
// from .... try to use with a promise :


                            // 20012020 
                            
                            
                            console.log('setting the where clause on tab model ',model0,' (',join_1_m,
                                    ')but  not found a previous city_lastValue so go on to find the id of a record with a value= where0   ' , where0);
                                 // var queryc=model0.findOne({"value":where0},{_id: 1 });// returns a objectid or a string ? 
        
                                // lower case search : performance issue ???
                                 //var queryc=model0.findOne({"value":"/^"+where0+"$/i"},{"value": 1 });// returning just value col { $search: thename } 
                                // i = no capital 


                                var queryc;


                // >>>>>>>>><<  following just in case we lost id and have only value . but recently dyn smp will ever put results in :
                                //              match ( values only ) + matched=[id,value]
                                 queryc=model0.findOne({"value":{'$regex': where0,$options:'i'}},{"value": 1 });// returning just value col { $search: thename } 
 
 
 
// >>>>>> or if where0 was not matched before directly try to match using present speech (term) 
// 
let regex_;
if(term)regex_= new RegExp(term, 'i');// todo : use as template regex  : else if(regex_)regex=regex_;else regex=null;//  RegExp('searchel', 'i');

  

                                queryc=model0.findOne({patt: regex_}, { 'fullname': 1 });
 
 
                                 //var queryc=model0.find({},{"value": 1 });// returning just value col
                                queryc.exec(   // get the the city entity  to join fron the city.value=where0 
                                    function(err,mycity) {// return a octal _id?
                                    // IF SYNC we can use all nesting function var as unchanged ( like final ) 
                                    // Create a new ObjectID	var objectId = new ObjectID();
                                    // Verify that the hex string is 24 characters long		assert.equal(24, objectId.toHexString().length);
                                              if (!err) {	console.log(' 1: queryc returned results , expected record with where0 : ',where0,' ,are : ',mycity);
                                                //,' is objectid ',assert.equal(24, mycity.toHexString().length));
                                                if(mycity){city_lastObjkey=mycity._id;
                                                    console.log('1.1 set a where cond for field ',ref_1_m, ' , value ',city_lastObjkey,' where is ',query.where);
                                                    query.where(ref_1_m).equals(mycity._id);// add to query : a where/join clause  _id=city_lastObjkey
        
                                                    exec(query);// exec async > calls exec function
                                                }else {	res.send('find no restaurant based on city :'+where0);// return no result 
                                                    console.log('1.2 get here only if query do not return result ');
                                                }
                                                console.log(' 2 , ');
                                        }else         	 res.send(JSON.stringify(err), { 'Content-Type': 'application/json'}, 404);
                                });









// ....


    }

    async function dostatic(){return null;}
 }

function doMatch(i) { 
	if(!prevW)initWC( where.length);

    if(!prevW[i]) { // in previous turn join[i] were not already matched so 
                    // - this is the first main turn trying to match main dyn or 
                    // - there was a new main loop with a prompt that suggest also to  match with  join[i]
                    // the where  join[i] match can be controlled by a step with its controller managing the match detail after a std matcher 
                    // but it cant interrupt the main loop (with a vector), unless i manage the call back from the child resolver into the main loop 

		let theM;// will be 'amatchval' or [id,value]
		if(theM=getMatch(where[field])) { // return null, or the match found on this turn  : string or array
			newW[i]=true;
			matched[i]=theM;

         }else{ // in this turn I can have no  specific step matcher in main loop (onChange matcher of join[i] step )run or calculed any match 
                // so I can call the where matcher from this main dyn matcher , if config allowed
                // here we can use matchProc() that as step matcher called in onchange() fill a Match_Param[] but inside and controlled by this main loop dyn matcher
 
                if(matchWhere){theM=matchProc(i);// a matching procedure that launch join[i] matchers returning a match value  , but if this  join[i] is dyn 
                                            //  and isRef[i] we know the this master will use id to join , so the join[i]  must return the id too
                                            // if join[i]  will not return id this master dyn must calc id from the join[i] match value !!
                            if(theM){ 
                                newW[i]=true;
                                matched[i]=theM;
                            }else newW[i]=false;

			 }else{
                newW[i]=false;
			 }
	 	}
	 }





       // old  if(qs){term=qs.term,regex_=qs.regex;full=qs.full,inter=qs.int;join_1_m=qs.join_1_m,join_n_m=qs._join_n_m,ref_1_m=qs.ref_1_m,ref_n_m=qs.ref_n_m,fts=qs.fts} // vui gui gui+ ossia solo id o id+fields
        
        var prefill = true;
        // recover from intent_data_models if rest or mongo 
        // var dialog = this.getDialog();/// ?? aiv3 seems not be in this context!!

        // 112019 dialog is alredy defined as closure var !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! todo

       //  var dialog = this.intDataModels.dialog;//  dialog is alredy defined as closure var


       /* old 
        if (isDb_Aiax == null && dialog.dynamic[dynfield1]) isDb_Aiax = !dialog.dynamic[dynfield1].isHttpRest_mongo;// true is http, false is a mongoose query on model
        if (!schema_url && dialog.dynamic[dynfield1]) schema_url = dialog.dynamic[dynfield1].schema_url;// if not provided by lazy user. or use fwctl pages ??? 
     */




        // todo review : ???????????????????????????????????
        // if (map && dialog.dynamic[dynfield1]) map = dialog.dynamic[dynfield1].schema_url;

        // PHASE 0 Recover matched values and set a where map to query : qs=wm={where0:vaue,where1:value2}

  

        var uri;
        let wm={};// map of paramList with  current matches 
        // fill qs=wp  from  associated where matches 
        // debug : 
        let mWhere=2;// max where with master column (no ref x join)
        if(paramList)
            {if(paramList.length<mWhere)mWhere=paramList.length;

        let nWhere=0;
        if(join_1_m)nWhere=1;
        if(join_n_m)nWhere++;

        let where=matches.qeAdata.where;
        if(nWhere>0){
            if(join_1_m){
            if(where.prev==10||where.prev==11){// previous contains join_1_m so neednt to do anything
                
                where.new=0;
            }else{// no previous 1_m , so look if there was a match  previously 
                if(match[join_1_m]);
            }

        }


    }
//:: do as before : 

         // for (var i = 0; i <mWhere; i++) { if (matches[paramList[i]]&&matches[paramList[i]].match&&!Array.isArray(matches[paramList[i]].match)) { wm[paramList[i]] = matches[paramList[i]].match } else { wm = null; break; } }
 
        if(matches.qeAdata.where.prev[]
         // wm[paramList[i]] =   matches[join_1_m].match  //a where col in master entity is related to the join_1_m , alternative to join with a reference field ref_1_m !
            
        wm=paramList;
            }
        else mWhere=0;
        var myschemaname1 = schema_url;// the master dyn fild schema

        // difference with start_dynFields :
        // - that was thought as a cb in user skill that find in the cb param the ifo needed to do the rest 
        //      that info was  put in the vui config by himself and recovered  accordingly 
        //       as param of this call by the framework

        // BUT here 
        // - we reciive the general order by cliento to do the rest , so here in this supporting helpings
        //     use the framework info to build a std format data
        //          x aiax : build the qs and a std reveived json mapping ( jon sopposed with plain property object)
        //          db : require the schema according with the info recorded in the config then 
        //              format the qs x the find db  call for a reference base dtat format in dbmongoose
        //       to do the query/aiax with std db/rest service
        //  - after calculated the basic reference data format to do the query it 
        //            -passes that data   back to user  so can  personalize the format prepared  do the call to db and http
        //            - or do the standard calls
        //  SO TODO 
        //   calc here the or better receive a cb in the callimf fwonchange and run from that context this obk containing the helpers 


        //todo;// calc from param using cfg ://  isDb_Aiax,  prefill, ),  afterallDyncalc no more because return a promise

        // very like to start_dynField !
        // >>> HAVE aiv3 IN SPACE !!! but private 
        // db=this._db;http=this._http;
        /* the dynamic constructor for a rest builded by framework 
      
            TODO the aiax call 
      
         it will set dyn cb :
         start_dynFields[adynfield] is a f :
         - default : will be called by framework passing cfg params to perform a user db query , expecting to be cb with (field,arr)
              start_dynField(dynfield1, recp, sess_clone,sess_dyn, setquerywhere_, prefill, afterallDyncalc)ù
              dynfield1= the dynfield name
    
              recp=cfg_info(10,dynfield1)= pages...fields[dynfield] :
                    myschemaname1 = recp.schema,
                    ......................
    
              sess_clone = never used 
                    was thought coming from buildvuifram call :
                      session in cnt_wk1=buildvuifram cloned as received in req :  buildvuifram(req,,,
              sess_dyn : the dyn query must be stored in session.dyn . its the same in the whole session ( the same also after a page changed) 
              setquerywhere_=  the dynfield query where field name map = {field1:matchedval,param1:calculatedval,,,}
                                OR
                            = the querystring attributes in a std GET AIAX ( or POST) 
              prefill = true
              afterallDyncalc= function(field,arr){pageDynEnt[field]=arr;afterallDyncalc(1);} to be called back with (field,arr) 
                    field = the dynfield got ,
                    arr = the query got in matrix format 
      
      clone copy just some session fields :
      
            Param from appCtl	Cloned and used 
            req.session  	>	cloned session
      
                          >	parm
                            body=null
                            text=null
                            curpage=req.newpage
                            frompage=null; the page where last form was submitted 
      
      GENERAL MASTER LOGIC :
      
        can be called from skills if we need to get 1 dyn  during a resolver convo or navigator convo 
         eventually can call framework just to get the wherefield list 
      
        myschemaname1 = recp.schema
        mymodel = db.model(myschemaname1);
        qsmap = session   // no : qsmap = req.query;
        fqu[urlqsParam[ii]] = qsmap[urlqsParam[ii]];// fqu is the where condition : fqu={param1:qsmap.param1}// the mongoose find param obj
        query = mymodel.find(fqu);// 
      
      
      
      */



        //  todo : we can add some user out of framework rest function/query  x model filling callable from gettings controller ( and not from fw cnt_wrk1 controller)
        // >>   start_dynField, async launch the query exec on dyn field  ',dynfield1

        /* framework will cb with (start_dynFields[dynfield1]=start_dynField, session is a clone):
        start_dynFields[dynfield1](dynfield1,cfg_info(10,dynfield1),session,null,true,function(field,arr){
          pageDynEnt[field]=arr;afterallDyncalc(1);}  );*/

        // setquerywhere_ : NOT USED 

        // >> std func will :
        //	- ask a schema from dbschemabunch with modelname get in cfg : field.schema
        //	- add where using as fieldnames the fieldnames get in cfg : field.urlparam=recp.urlparam
        //				as values (session=sess_clone).urlparam[i]
        //	if db schema returned a std model  : ( id,patt,descr,name,data) 
        //	the function cb : afterallDyncalc(dynfield1,dynitems)  a re cb , the param dynitems returns the  ( max row=maxItems) the array of models got formatted from the db query

        // the mapping   ' urlparam > the join fieldname '  is identity !!! so view field  'state' with value req.query.state will be the value of field (== identity ) 'state' in masted db table/field
        // prefill : process the dyn to set the handlebars context x the dyn field in this GET new page 
        // aiax : process the dyn to set the js that will calc the the handlebars context x the dyn field precompiled template in browser
        // urlsqsParm , sono i qs  attributes, se null ci si rifa ai url param :
        //		if null urlsqsParm =urlparam , then calc mongoose find query trying to match req.query  : find(fqu) : fqu[urlsqsParm[ii]]=req.query[urlsqsParm[ii]]  !
        // setquerywhere_ : query find clause calc from the param in end point ,  alternative to urlsqsParm and have the priority : if setquerywhere_=null manage urlsqsParm ( null or not null) 

        //	2019
        //	gui dyn 
        //		with autoselect entity name (by qs) and where param
        //		- autoselect will aiax with a qs param and where param using a rest to a db server that has querryed ( using q/search param) at get time 
        //			and will give ( view field : viewname and descr) aiax refinement ( with qs param) to independent autocomplete js rendering sys
        //	vui dyn 
        //		the same above result is got using rest server giving the entity id of query on q and qs param to fts copied db that will refine the qs with FTS query
        //		
        //		- so the internal copied will fts select on view field and the rest server will do the same query giving to autocomplete and to dbtab the same entity with
        //			different format ( id or the fields of selected entities)
        //	>>> if we wont use aix after the get we must give at get the dyn :
        //		- gui will do a select by click on a max 20 item list
        //		. vui can  select the full table or a preselect idset if has  has the full table , 
        //			> BUT if not is like the gui :  must download a preselect of max 20 item and the do as gui a selection by position ( click) or build at runtime the fts .
        //	>>>> gui aiax is like autoselect but is managed by a hbs rendering managed by the framework ( so more control on thetemplate to fill with aiax ???) 

        //	>>>> se non prefill ( ax city) at get time or server can  do selection :
        //		- in webserver by rest aiax o
        //		- in browser/vui doing a selection on full idset received statically ( a db copy or a list inside a template)

        // BOTKIT : this will be run on master app controller as callback
        //	 - al posto di dynfield1 si passa per comodità anche il :
        //		recp=cfg_info(10,dynfield1);//recover pages...fields[dynfield] cfg obj
        //	- urlqsParam and setquerywhere_ is unneeded as param  as can use the available session param with previous result, see below 
        //	>>>>>>>>>>>>>> so pass session on sess_clone ( session with framework info) !!!!




        // SDF:
        //	a dyn field can be filled at page GET (the gui template use the dynmap data to fill the field and the vui engine use the dynmap also(do not do query just refinement)) OR
        //	a dyn field can be filled after with a rest aiax(the gui template are download and a js will use the browserDynCfg data to aiax rest a url also 
        //	if db schema returned a std model : 
        //	

        //		with a where field previuoly matched at run time
        //		the vui engine will query the internal FTS db (copied(init full)  from db at GET PAGE from the db url )or using the same url (FTS presetted) 


       // var dynitems = [];
        const maxItems = 5;

        var prefill = true;

        /* remember : 
    var dialog = {
      
      
        declare: {// static list of  cmd's model items defined in static or dynamic
          help: [//the ask keys in a cmdname='help' to load as entity x matcher() support ( hbs will get {{convo.vars.entPrompt.help}})
            'help'// a ask key value
         ]
        },
        static: {// static list of  model items ( entity in some intent on curpage that will use these field in ask/question )
            // std model item =dialog.static[afield][i]=['item name', 'item gui short descr '] 
            // or (todo)
            // std model item =dialog.static[afield][i]=['item name', 'item gui short descr ', 'item vui short descr '] 
          help: 
             [
                 ['docs', 'documentation'],
                 ['community', 'community'],
                  ['contact', 'contact']
             ]
      
        },
        dynamic: {// list of  model items ( entity in some intent on curpage that need a rest query to fill ) 
          // model items or  PARAM ( single row value = text column) 
          // if user rest function see restPool rest function to fill this field
          // ?? using this we can in appctl  build a blacklist and sent in appctl to vuiengine and use here to black list in testfunction of hears_() 
          adynfield: {cmd:'cmd1',
              dynparam:['awherefield'],// duplicated value , also in framework ( pages.js), 
               //  > so usually as with static , can be loaded in framework then use framework to get info 
              // no , put in session.dyn.dynfield :   ,dyn:null} // the dyn as run time query using dynparam where field }
              query:null,// the current valid dyn model ( view data model) extraction from some db query or aiax 
             map:null,// mapping .additional info to map rest json field to itemname and item description  ,usually null
             schema_url:'http://82.48.217.202:3000',
             isHttpRest_mongo:true// or db mongo model query 
    
        }
            ........  */




        var prom;// promise to return 
        if (prefill) {//  a not void dynmap (SDF : at new page GET we fill the dynmap pageDynEnt
            // SAA : fill a not void specific dyn :
            //  dyn has a ( can only be virtual) schema (item model is menu_items[].dyn constructor function ) known at run time as master table
            // bl selection can be done on master table with where join with previous matches so we got a queryed result table from which to select an item 
            // if there is no join we start from the full master table and we can optionally download the full table to vui just to copy in internal db table 
            //		(probably the same if we have a table with rel table we can donload the file cvs that are used ti init the internal db )

            // each dyn field dynfield1 has a mongoose schema usually with same name 
            //	can surely be a specific vui param (example a http resolver specific view implementation param x merging when vui cb to Browser 
            // 		( http resolver can also  call back with a rest to the related page POST directly from android  !!)







            // SAA1 : try to get schema from config 
            //	if(dynschema[dynfield1])myschemaname1=dynschema[dynfield1];
            // better : recover the dyn fields obj in tabs, not just the schema name !

            // STDINJ BB : ................


            if (isDb_Aiax) {// call db restapi
                //if (schema_url) myschemaname1 = recp.schema; else myschemaname1 = 'somename';
                var mymodel;
                // if urlqsParam is null we can take the field in cfg :
                // fqu is the where condition : fqu={param1:qsmap.param1}// the mongoose find param obj
                //  ( in Financial Times rest api  have following query param :
                //	q  usualy is a search string passed from browser after a search field input is filled or is calculated from passed form fields or session var
                //		is the prefill (initial space)table from which do a refine  selection using master keyword ( pattern/autocomplete) or 
                //		do refine selection using 
                //			- relation association doing join with dbjoin column 
                //			-  gui :  row selection looking the table rows content ( select by visual inspection of the relation on the rows ) 
                //			   vui :  fts on destructured multi concept columns (descr)  so ( here 'Concepts' are concepts that are in relation with the master concept):
                //					try to find 'Concepts' from speech , try to extract 'Concepts' from descr fields , 
                //					try to match ( some 'Concept' may be in only some descr fields) choosing the row with the most matched Concepts matching the user speech Concepts

                //	qs  params are :
                //		- master keyword ( the param value can be : 
                //				(gui only) the keyboard initial master keyword on autocomplete called term or 
                //				(vui only) the part of speech we want to use to match the master keywords/grammar ( that is the master concept extraction in ai) 
                //		- the column to join ( the value can be a specific field matched by autonomous concept extraction 
                //			( usually the dbtab input can have speech filtered to have the part concept related)
                //			THIS iterative refine joins can be done using server join on prefill space ( the prefill space is rescricted by following join condition)
                //				or also in the browser ( no practical)  or vui engine if we have duplicated db or do the join using dedicated and fileld on the rows 
                //		-  vui only : the concept name (example a session period :'sessione estiva' ) to find with fts Practically is the algo dedicated to match FTS the Concept related to the master item
                //				usually the Concept is also generic and we try to find FTS match from relevant part of user speech with relevant part in descr column 



                console.log(' start_dynField, schema named  ', myschemaname1, ' query params : ', urlqsParam);
                //test : myschemaname1='citie';
                if (myschemaname1) mymodel = this.db.model(myschemaname1);

                if (!mymodel) { console.log('start_dynField ERROR , recover a null schema for name ', myschemaname1); return; }// process error ......
                // following mymodel is not null 






                /* old staff : 
                var query;
                var fqu = {};
                var qsmap = req.query;
          
                // botkit : if 	setquerywhere={id:session.sametabid} do a findById , otherwise do a std query using the session attributes specified on recp.urlparam
                //setquerywhere=setquerywhere_;
                setquerywhere = null; qsmap = session;// session on appCtl  ,.   sess_clone;
          
          
                if (setquerywhere) {// no in botkit
                  fqu = setquerywhere;
                  query = mymodel.findById(fqu);// priority is serve setquerywhere
          
                } else { // here botkit will add whereparam=dynfield.urlparam find in config as where query  using value got in session.whereparam
          
                  // build fqu={param1:qsmap.param1}// the mongoose find param obj
                  if (qsmap) {
                    var up;
                    if (!urlqsParam) up = recp.urlparam; else up = urlqsParam;// if not provided take the std in pages conf
          
                    // webkit : 
                    // - take the where query param from config ,
                    // - copy every param that is in query string qsmap
                    //  - in the db query obj  fqu
          
                    if (urlqsParam) {// find if in qs there are some params to set x find where clouse 
                      for (var ii = 0; ii < up.length; ii++) {
                        fqu[urlqsParam[ii]] = qsmap[urlqsParam[ii]];
                      }
                    }
         
                  }
          
                  query = mymodel.find(fqu);// use the cb here OR in exec  
                }*/

                // todo: calc setquerywhere like qs in rest aiax

                var dojointrue;
                // let setquerywhere = qs;// ok? no todo 

                /* PHASE 1  preset the  query on master field : choosing fields to get ( from full and inter) and the search term on what fts field to serch (patt) 

                        see https://mongoosejs.com/docs/queries.html
                     dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >  query=mymodel.find({patt: regex=new RegExp(term, 'i'),col_served= {'_id':0,'patt': 1,'descr':1 }})

                     findClouse={},selClouse={}
                    col_served =
                    gui :  selClouse={'_id':0,'patt': 1,'descr':1 }  , if term  findClause={patt: regex=new RegExp(term, 'i')}
                    deb :   nothig to do , serving all cols + '_id'
                    vui :   full:  selClouse={ "patt": 1,"value": 1,"descr": 1,"data": 1 } ( comprende  + 'id')
                            else : chain with .distinct('_id') too !

                            query=mymodel.find(findClouse,selClouse);
                */

                var query, regex ,
                findClouse={},selClouse={},aggrClause=null,distClause=false;


                if(term)regex= new RegExp(term, 'i');else if(regex_)regex=regex_;else regex=null;//  RegExp('searchel', 'i');

                //if(fts)findClouse={}.....TODO 

                //console.log('got a schema : ' , User);
                   //var query = User.find({fullname: regex}, { 'fullname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
                   if(inter=='bl'){// serving autocomplete with 'patt' +'descr' cols 
                   console.log('B4A bl : setting query ' );

                   if(regex){findClouse.patt=regex;// {'_id':0, 'patt': 1,'descr':1 } result fields are patt + descr , _id must forced to be excluded !
                   }else;
                   //selClouse={'_id':0,'patt': 1,'descr':1 };
                }else if(inter=='gui'){// serving autocomplete with 'patt' +'descr' cols 
                    console.log('B4A gui : setting query ' );
                    // >>> a aiax resolving starting keywords ( term) + join relation 
                    // now set the find {}: search the patt starting letter : use regex !
                    if(term){findClouse.patt=regex;// {'_id':0, 'patt': 1,'descr':1 } result fields are patt + descr , _id must forced to be excluded !
                    }else;
                    selClouse={'_id':0,'patt': 1,'descr':1 };
                }else if(inter=='deb'){// serving autocomplete with 'patt' +'descr' cols 
                    console.log('B4A deb : setting query ' );
                    
                }else{ // >>> vui and full   serving vui ( a full db request (returns json) or a join request (returns idspace)
            
                    // >>> a 'vui' aiax to get the join if we do not do internally with a column dedicated to the rel field
                    // 	vui aiax needs only the id of the restaurant results , because we can query the local db with this id ( must be the same ) to have all restaurant voice related  fields 
            
                    // >>>>>>> indeed if in the local db we duplicate the 1:n relation in a city column then we can do the join in the local db without to do this aiax ( can be slower but we spare a rest call)
                    //	 ( we must know the city id from the value field , both are keys ! )
            
                    // https://stackoverflow.com/questions/30677879/mongoose-get-list-of-ids-instead-of-array-of-objects-with-id
                    // Group.find({program: {$in: [...]}})  .distinct('_id')
                    // query = User.find({}, { '_id': 1 });// result fields are just  obj with key _id 
            
                    // >>>>>>> REMEMBER THAT THE JOIN IN VUI ENGINE DBTAB can be done internally in the db manager if we have a column with the relation of the join field 
                    // 	( so value(s) or name or data is the relation value of  the relation entity in relation 1:m or n:m )
            
                    // FULL table,  result fields are just  array of _id strings !!!! are also the id on vui copied db ????????????????????????????? città:	2
                    if(full){
                       // var cols={ "patt": 1,"value": 1,"descr": 1,"data": 1 }; console.log('B4A full : setting query ',cols );

                        // mymodel.find({},cols);// serving all cols
                                    // better do a select (aggregate), see http://excellencenodejsblog.com/mongoose-aggregation-count-group-match-project/
                                    //  	and https://stackoverflow.com/questions/41703657/how-do-i-rename-fields-in-the-outputs-of-a-mongo-query
            
                                    // use following because we want id and not _id as col name 
                                    aggrClause=[];
                                    aggrClause.push ({$project: {_id: 0,'id':'$_id',
                                                    'pattern':'$patt',
                                                    'descr': '$descr', //aliasing
                                                    'value':'$value',
                                                    //'città':'$j_1_m',
                                                    'data':'$data'
                                                    // manca match ( the were condition !!!)
                                                        }		
                                        });

            
            
                    }else{ 	//no bl, no gui , no deb, is vui
                        console.log('B4A gui : setting vui and anyelse ' );
                        distClause=true;// serving just id list
                    // NO term here !! matching with master pattern is done by FTS in internal db of vui engine !!!
                    }
                }



                //  INSERT Mongoose clause . 
                // if(mongo)
                if(aggrClause){
                    query = mymodel.aggregate(aggrClause, function (err, recs) {
                                                         if (err) {  console.log('err ',err);} else 	{    console.log('recs ',recs);}
                                                         });
                }else{
                    query = mymodel.find(findClouse,selClouse);
                    if(distClause) query.distinct('_id');
                }

                //  INSERT Mongoose clause . Sqlite Clause to do , fts clause todo for mongoose and sqlite  )
                // else if (sql)  .........

                // query.limit(20); 

                    /*  PHASE 2  add where in voice field{ "patt": 1,"value": 1,"descr": 1,"data": 1 }; or bl fields            query=query.where(wm)                                                                                                     
                */
                // alredy done ?
                if(!full&&mWhere>0&&wm)
                 query.where(wm)   ;// ok ?


                let where0,where1,model0,model1;//join values
                if(!full&&!bl){
                // get matches where0 on join field join_1_m with model0 schema
                if (join_1_m) {
                    if (dialog.dynamic[join_1_m]) {
                        schema_url = dialog.dynamic[join_1_m].schema_url;
                        if (schema_url) {
                            model0 = db.model(schema_url);
                            if (model0) {
                                if (matches[join_1_m]&&matches[join_1_m].match&&!Array.isArray(matches[join_1_m].match)) {where0 = matches[join_1_m].match } 
                                else { }
                            } else return null;

                        } else return null;
                    } else return null;
                }
                 // get matches where1 on join field join_n_m with model1 schema
                if (join_n_m) {
                    if (dialog.dynamic[join_n_m]) {
                        schema_url = dialog.dynamic[join_n_m].schema_url;
                        if (schema_url) {
                            model1 = db.model(schema_url);
                            if (model1) {
                                if (matches[join_n_m]&&matches[join_n_m].match&&!Array.isArray(matches[join_n_m].match)) {where1 = matches[join_n_m].match } 
                                else { }
                            } else return null;

                        } else return null;
                    } else return null;
                }
            }




                // debug 
                    if(where0=='dwl')where0=null;where1=null;// debug , max 1 join : the where0
                    city_lastValue=null;// add in session.Match_Parm[].alredy[join_1_m] status to not query a alredy resolved join   
                

                                // TODO where1 ......

                // TODO get col name containing the reference for 1_m join in the schema of master schema=dialog.dynamic[dynfield].schema_url
                //ref_1_m='j_1_m';//the reference for relation in master field rest (rest aurant)  Model 'j_1_m',// not model0=getSchema(urlparam0,fCfg)  (that is J1_m the master model of the where field city !) !!!


               /*  PHASE 3  add join clause if there is specified join_1_m and join_n_m , then run queries  

                         query the main dynfield1 using a 
                            - where clause on wherefield ( usually on 'patt' and some bl fields )
                            AND 
                            - join by id on ref_1_m , recovered by dynfield1 schema, 
                               on the id of  match (value=Match_Param[join_...].match) of related table join_1_m and join_n_m 

                   nb TODO : join on join_n_m  

                               example : 
                                            dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >
                                            >  query=mymodel.find({patt: regex=new RegExp(term, 'i'), {'_id':0,'patt': 1,'descr':1 }}) >
                                            > query=query.where(wm)     
                                             ...... match on join table getting mycity._id
                                            >  query.where(ref_1_m).equals(mycity._id);                                                                                                
                */

                if(where0){// NOW ADD to query (till now JUST A SINGLE) WHERE CONDITION !! , here where0 ='milano' : Insert  the join clause in query  for both guiautocomplete  and vui 
                console.log('B5 where is not null');
                // TODO set this mapping on pages config !!! . MAPPING the where field to internal db field name 
                    var mastermap={};
        
                    console.log('setting the where clause if any : ' , where0);
                    var doany=false;// choose this choice
                    if(doany&&dojoin&&where0==rest_lastjoin){// just keep last id set  SEEMS WORST CHOICE

::lidset ??

                        if(lidset)query.where('_in').in(lidset);
                        // or  , see https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
                            /*
                            model.find({
                                '_id': { $in: [
                                        mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
                                        mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
        
                                    ]}*/
                    }else{ // redo the query every call :
                        if(city_lastValue&&city_lastValue.equals(where0)){// the id of the city was the same as before so id known 
                            console.log('setting the where clause found a previous city_lastValue : ' , city_lastValue ,' id was ',city_lastObjkey);
                                
                            // where('_id') and not where('city') 
                            // yes because when do a join i set  the idspace city_lastObjkey as the list  of items satisfying that join 
        
                            // error query.where('_id').equals(city_lastObjkey); // add to query : a where clause  _id=city_lastObjkey
                            query.where(ref_1_m).equals(city_lastObjkey);

                            exec(query);// exec now 
                        }else{	
                            




                            
                            // 20012020 
                            
                            
                            console.log('setting the where clause on tab model ',model0,' (',join_1_m,
                                    ')but  not found a previous city_lastValue so go on to find the id of a record with a value= where0   ' , where0);
                                 // var queryc=model0.findOne({"value":where0},{_id: 1 });// returns a objectid or a string ? 
        
                                // lower case search : performance issue ???
                                 //var queryc=model0.findOne({"value":"/^"+where0+"$/i"},{"value": 1 });// returning just value col { $search: thename } 
                                // i = no capital 
                                 var queryc=model0.findOne({"value":{'$regex': where0,$options:'i'}},{"value": 1 });// returning just value col { $search: thename } 
 
 
 
// >>>>>> or if where0 was not matched before directly try to match using present speech (term) 
 
 
                                 //var queryc=model0.find({},{"value": 1 });// returning just value col
                                queryc.exec(   // get the the city entity  to join fron the city.value=where0 
                                    function(err,mycity) {// return a octal _id?
                                    // IF SYNC we can use all nesting function var as unchanged ( like final ) 
                                    // Create a new ObjectID	var objectId = new ObjectID();
                                    // Verify that the hex string is 24 characters long		assert.equal(24, objectId.toHexString().length);
                                              if (!err) {	console.log(' 1: queryc returned results , expected record with where0 : ',where0,' ,are : ',mycity);
                                                //,' is objectid ',assert.equal(24, mycity.toHexString().length));
                                                if(mycity){city_lastObjkey=mycity._id;
                                                    console.log('1.1 set a where cond for field ',ref_1_m, ' , value ',city_lastObjkey,' where is ',query.where);
                                                    query.where(ref_1_m).equals(mycity._id);// add to query : a where/join clause  _id=city_lastObjkey
        
                                                    exec(query);// exec async > calls exec function
                                                }else {	res.send('find no restaurant based on city :'+where0);// return no result 
                                                    console.log('1.2 get here only if query do not return result ');
                                                }
                                                console.log(' 2 , ');
                                        }else         	 res.send(JSON.stringify(err), { 'Content-Type': 'application/json'}, 404);
                                });






                        }// end else
        
                    }// end else{ // redo 
                // ?? query.where('descr').equals(where);
            }else{
                
                console.log('B6 where is really null');
                   
                //var query = User.find({}).limit(20);    
                      // Execute query in a callback and return users list
                exec(query);// full table query with no where clause
            } // end if(where0){... else .... 
        

// DELETE 
// TODO  correct in above the returns : no re.json .... , merge the following  OLD procedure and use the promise as following: 


                // if the askey is a dyn field then fw
                //              sets      session.dyn[field]= session.dyn[field]||{idspace:[],query:[],complete:'start',prompt:[]};// complete:matchingstatus/result, query:[] the query dyn result [[itempattern,shortdescr],,,,]       
                //              and returns current status/result in  matches[field] = session.Match_Param[field]= dynSes={query:session.dyn[field],complete=session.dyn.complete};// complete= matching result exposed in conversations,,,, > will be set in session.Match_Param[field]
                // so :
                let dynSes=matches[field]=matches[field]||{complete:'start'};// dynSes={query:session.dyn[field],complete=session.dyn.complete};
                // where the training must be done on  mymodel.find({}}) or in some section of a partitioned where space (x less common where values)
                // example partition the training set in 10 parts each covering a where space segment
                // after qea result do a join with the where in the section to get the final qea list 
                // or do a fts whith match and where join then ?

                // let queryres=dynSes.query;// if no where field updates mantain current dynSes status

                // if there are where updates :
                //let spaceid=session.dyn[field]= session.dyn[field].idspace;// if not null only 
                let spaceid;
                const sendIds=false;// if i have a idspace from previous fts  match and a new join i intersect/restrict  the join result space with the current idspace
                                        // that can be done adding a  IN on idspac  clause ( > dbServer) or just by a local intersection on the join result in local dyn matching algo 
                                        // thumb rule : so tranmit to db server only if idspace have a limited dimension ( fts idspace is ever limited to max 20)  or not transmit if the join has a linited dimension                            
                if(dynSes.idspace&&sendIds) spaceid=session.dyn[field].idspace;// if not null only 


                if(spaceid)setquerywhere=mergeIds(setquerywhere,spaceid);// // TODO insert a IN clause in query , example : if(lidset)query.where('_in').in(lidset); . ? after the query update idSpace


                /* 

                */ 

                let prType=0;
                if(prType)query=addProject(query,prType);// see indexcontroller_rest.autocompl_rest()

                query = mymodel.find(wm);
                // usually we use just pattern/descr field
                //if(!urlparam1)mymodel.find({state:'CA'}, 'patt descr',cb_dyntab1);
                //else mymodel.findById(urlparam1, 'patt descr',cb_dyntab1);

                console.log('start_dynField, recovered schema named  ', myschemaname1, ' query clause : ', fqu, ' model : ', mymodel, 'recovered query  ', query);
                // for promise modesee https://stackoverflow.com/questions/33645570/nested-query-with-mongoose

                // here : https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
                // or : http://mongoosejs.com/docs/queries.html

                //query.select(['patt', 'data']);


                crun=(resolve, reject) => {
                    //request(req, function (err, res, body) {
                    query.exec(// EXEC : fill dynitems , no promise just simple cb
                        function (err, hotels) {// query cb
                            // check this thought : ???? this is a inner function of start_dynField that is callen on many field param dynfield1 , so here i see the calling stake of start_dynField ( like enclosure) 
                            // so next invocation of start_dynField dont touch the local var of previous call ( that will use those at this callback !!)


                            //  >>>> this is the cb that will calc the model x a specific dyntab dyntab1 
                            //according the declared  menu_items[dyntab1].dyn and adds to pageDynEnt
                            // remember from  hotels (subclass inst of db entity model ,thequery result got from specific schema result)  usually we have to calc :

                            if (err) {
                                console.error(err);
                                //debug('Error in Botkit CMS api: ', err);
                                return reject(err);
                                // or 
                                return reject(new Error('some info'));
                            }
                            else {

                                console.log(' start_dynField, receiving ', hotels.length, '\n:', hotels, ' , now dynfield1 is ', dynfield1);
                                console.log('  start_dynField, , first  row : ', hotels[1].patt, ' , ', hotels[1].descr, ' , ', hotels[1].value);

                               // dynitems = hotels;// schema find extract models extended expected interface (.dyn constructor !)
                                if ( hotels.length > maxItems)  hotels.length = maxItems;


                                // fill map :

                                //pageDynEnt[dynfield1]=dynitems; // temp dyntab current values , will be used by render as context to display dyntab to render 


                                //afterDyncalc(); // run controller after dyn calc ( some dyn key in pageDynEnt  not void)

                                // NO ( must be a session var !) dialog.dynamic[dynfield1].dyn = dynitems;
                               // if(sess_dyn&&sess_dyn[dynfield1])sess_dyn[dynfield1] = hotels;// must store dyn query in session 

                                resolve(dynfield1,  hotels);// inform that a dyn was set


                            }
                        });

                }
                
                // promxx = new Promise(crun);// end promise

// end DELETE 


function exec(query){
	console.log('B7 1.1.1 executing query ',query);
    query//.limit(20)// debug . seems limit  cant be used with distinct ???????
	.exec(
    function(err, resta){
    if (!err) {console.log('1.1.1.1  B9 query returned results : ',resta);//users.length);
		console.log('  B9a resta[0] is ',resta[0]);
      	  	 // Method to construct the json result set

		/*
       	 	 var result = buildResultSet(users);
       	 	 res.send(result, {
        	  		  'Content-Type': 'application/json'
       	 		 }, 200);
  		*/
	if(inter=='gui'||inter=='full'||inter=='deb'){	// serving json the autocomplete rest ( term + where param ) AND full vui db table copy

				// if(resta).....
		 		res.format({json: function(){ console.log('send json  results : ');res.json(resta);console.log('  B9aa resta[0] ');} });// question res.json(user)=JSON.stringify(users) ??????
	}else{		// VUI CASE : fill just the id of the query

				// inter='',  serving idspace the vui dbtab  join rest ( no term + where param ( also null)  ) 
				/*
				// from https://docs.nodejitsu.com/articles/advanced/buffers/how-to-use-buffers/ and http://expressjs.com/it/api.html#res
		
				var buffer = new Buffer(resta);// resta is array of integer
				//res.set('Content-Type', 'text/html');res.set('Content-Type', 'application/octet-stream');
				res.send(buffer);
				*/

		// from https://github.com/Automattic/mongoose/issues/1391 + 
			// having set _id to number : 
			//	var schema = mongoose.Schema({_id: Number});
			//	var Pet = mongoose.model('Pet', schema);

			//	var schema = mongoose.Schema({pet: {type: Number, ref: 'Pet'}});
			//	var Shop = mongoose.model('Shop', schema);

		/*  A
		// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
			// transform the integer array resta :
			//  following is js code , that should work if buffer is understood by nodejs 
				var rl=resta.length;
				var buffer = new ArrayBuffer(rl*4),int32View = new Int32Array(buffer);
				if (int32View.length!=rl) {console.log('error on bytewise array of ids ',rl);
				for (var i = 0; i < int32View.length; i++) {
 					 int32View[i] = resta[i];
				}
		*/


			// B following seems to use nodejs buffer library , see https://allenkim67.github.io/programming/2016/05/17/nodejs-buffer-tutorial.html
			//	and https://www.w3schools.com/nodejs/ref_buffer.asp :
				const Buffer = require('buffer').Buffer;
				var rl=resta.length;



				//DEBUG ::: 

				if(rl>5)rl=5; // debug
				// create an empty buffer with length of 4 bytes.
				const 
				// ASD  buf = new ArrayBuffer(4*rl),
				rawbuf = Buffer.alloc(4*rl);
				//  ASD from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays .  readwrite the buffer using data format  int32 
				// ASD	int32View = new Int32Array(buf);

				console.log('B9 allocated buffer of byte length  ',4*rl);//,' int32View is of length  ',int32View.length);
				// LAST ERROR :  int32View is not defined
				// nb rest[i] is alredy a string :   ( rest[i]=ObjectId.valueof(the_id))
				for (var i = 0; i <rl; i++) {
 
					// CASE resta[i]  is a string to put in ascii format into the buffer
					// write the unsigned 32-bit, big-endian number 123 into the buffer starting
					// at index 0 of the buffer.
					//buf.writeUInt32BE(resta[i], 4*1);
					// buf.write(resta[i], 4*i); // no : here will convert the string in a ascii/utf8  format


					// CASE resta[i]  is a numer in hex form (objectid is 96 bit hex string )
					// but resta[i] if objectid is has 12 byte (uint96)
					//  ( should better  
					//	- use :https://stackoverflow.com/questions/14730980/nodejs-write-64bit-unsigned-integer-to-buffer
					// 		 and https://nodejs.org/api/buffer.html 
					//	- OR USE A HASH TO DESCEASE THE BYTE https://github.com/lovell/highwayhash 
					//		https://www.scadacore.com/tools/programming-calculators/online-hex-converter/ )
					// insert the hex var ( string with hex values ) :  
					// buf1.copy(buf2, 0, buf2.length, 20);buf1=Buffer.from('548e09f70356a1237594fbe489e33684'=resta[i], 'hex');
					// or just buf.writeUInt32BE('0x548e09f70356a1237594fbe489e33684', shift);
					// if var numconv=parseInt(objectId.valueOf(), 16);// but it is a uint96!
					// buf.writeUInt32BE(numconv, 4*i); 

					// case : resta[i] is a int from db numeric key				
					rawbuf.writeUInt32BE(resta[i], 4*i); 
					// OR 
					 // ASD int32View[i] = resta[i];


					console.log('B9a , resta[i] ',resta[i],
					// ASD 'int32View[i] ',int32View[i],'\n inserted buf : ',buf,
					'\n inserted rawbuf : ',rawbuf);

				}


			// then read in a client like : https://stackoverflow.com/questions/39062510/how-to-return-arraybuffer-to-the-client-by-nodejs
				//res.set('Content-Type', 'text/html');res.set('Content-Type', 'application/octet-stream');
				res.send(rawbuf,0);// res.send(rawbuf);

  	 	 }


	  }else {// err
        	 res.send(JSON.stringify(err), 1);// res.send(JSON.stringify(err), { 'Content-Type': 'application/json'}, 404);
      	 }
   });// end query.exec()
console.log('B7 1.1.2  query returned');
}// end function exec(){} 

let res={
    format:function(jsond){
        //let jsond;
        resolve_(jsond,null)({rows:jsond,reason:'json'});;// null : normal json rows 

    },
    send:function(  bytes,code ){
        //let bytes;
        if(code==0)resolve_({rows:bytes,reason:'byte'});
        else if(code==1)resolve_({rows:bytes,reason:'err'});// rows can be array?
    }



}

// just at func beginning 
let resolve_,reject_;

prom=new Promise(function(resolve,reject){resolve_=resolve;reject_=reject});// creates a promise that launch a function that wiil garantee tha sometime the promise resolve and reject cbs will be called (as middleware cb return resolve will be called )
   

//prom = new Promise(crun_);// end promise



                console.log('  start_dynField,  query exec launched on dyn field  ', dynfield1);

            } else { // >>> TODO to complete : insert in GET POST all PARAM SET used in db case 
                // do aiax :
                // remember dyn tab and dyn params are in session copied in before from dialog
                // so at the end remember to set session.dyn or the param match that as is just a value
                // we can fill vars.param and also  session.Match_Param.param because it is the location to see for match entity  .....
                // but we have convo reference no so do it at return when promise is resolved 
                // not convo.vars but match so session.Match_Param


                if (qs && schema_url) {
                    let method, limit;
                    if (dialog.dynamic[field].method == 'POST') method = 'POST'; else method = 'GET';
                    if (dialog.dynamic[field].limit) limit = dialog.dynamic[field].limit; else limit = 5;

                    // 
                    prom = this.rest(dynfield1, schema_url, qs, method, map, limit);// in bot.js we called  rest(uri, params, method,outmap,limit){
                }

                prom = null;

            }// end  do aiax

        }// end prefill

        let origProm=prom;

        function fulfHereToo (field, query) {// return promise itself as chained promise , see https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
            let  isParam ;
            if (dialog && dialog.dynamic[field]) {
                 isParam = dialog.dynamic[field].isParam||false;
                if(isParm)session.Match_Param[field] = convo.vars[field] = query[0][0];
                else {  dialog.dynamic[field].query = session.Match_Param[field].query =  query;
                        // no more : session.dyn[field] = query;
                }
            }
            return origPro;// is the same return prom ???.  so next .then will get the fullfill of original  prom again (correct  ?)
        }
        function fulfHereToo1 (field, query) {// promise that fullfilled will ends
            let  isParam ;
            if (dialog && dialog.dynamic[field]) {
                 isParam = dialog.dynamic[field].isParam||false;
                if(isParm)session.Match_Param[field] = convo.vars[field] = query[0][0];
                else {  dialog.dynamic[field].query = session.Match_Param[field].query =  query;
                        // no more : session.dyn[field] = query;
                }
            }
            //return null so live the thread
        }
        // sulution 0 : fullfill a promise that repropose the same promise that will be returned 
       //  if (prom) prom = prom.then(fulfHereToo); else ;// TODO  return a failed promise 

        // better ?
        // sulution 1 : .then 2 times the promise : is just a way to split the thread
        if (prom) prom.then(fulfHereToo1); else ;// TODO  return a failed promise 


        // 122019 query is obj array depending from prType set , we'll have use them to set in Match_Par.query__ that will be used 
        //  by user dyn field ctl (like a_onChange_dyn_field) to lauch a Q&A selection that will refine  current dyn and calc a new session.Matc_Parm Status X DYN  FIELD SO CAN GOON TO REFINE OR WE GOTÒ A SUCCESSS DYN MATC 
        // .then(function(dynfield1, dynitemsmatrix_np2 or a sinlgestringmatrix=[['paramvalue']]){ set convo.vars and session ....})



        return prom;
    },// end onChange_dynField



    rest: async function rest_(entity, uri, params, method, outmap, limit) {
        // outmap must be ['firstprop','secondprop'] or  ['firstprop'] x param ( only first row will be got)
        // return a promise that .then(function(fieldname,([[],,,]  or []) of string){})


        var is1or2 = 2;
        if (!(isArray(outmap))) return null;
        else { if (outmap.length == 1) is1or2 = 1; else is1or2 = 2; }// 1 if is a param
        let req = {
            uri: host + uri,//+ '?access_token=' + this._config.token,
            headers: {
                'content-type': 'application/json'
            },
            method: method,
            form: params
        };
        console.log('after ,rest called , uri ', uri);

        // var prom=new Promise((resolve, reject) => {
        //   console.log('promise started');
        //     bot.say('I heard: pippo' ).then(function (){console.log('promise res');resolve('pippo');});});
        // bot.say('I heard: pippo2' );resolve('pippo');


        return new Promise((resolve, reject) => {// same as done in bot.js 
            //request(req, function (err, res, body) {
            this.http(req, function (err, res, body) {
                if (err) {
                    //debug('Error in Botkit CMS api: ', err);
                    return reject(err);
                }
                else {
                    //debug('Raw results from Botkit CMS: ', body);
                    let json = null;
                    try {
                        json = JSON.parse(body);
                    }
                    catch (err) {
                        //  debug('Error parsing JSON from Botkit CMS api: ', err);
                        return reject(err);
                    }
                    if (!json || json == null) {
                        reject(new Error('Botkit CMS API response was empty or invalid JSON'));
                    }
                    else if (json.error) {
                        if (res.statusCode === 401) {
                            console.error(json.error);
                        }
                        reject(json.error);
                    }
                    else {
                        // var jsonr=json[0].id;
                        var jsonr = {}, len;
                        { len = json.length; if (len > limit) len = limit; }
                        for (var i = 0; i < len; i++) {
                            if (is1or2 == 2) { jsonr.push([json[i][outmap[0]], json[i][outmap[1]]]); } else { jsonr.push(json[i][outmap[0]]) };
                        }
                        resolve(entity, jsonr);
                    }
                }
            });

        });




        //return prom;
        function isArray(a) {
            return (!!a) && (a.constructor === Array);
        }

        // now api to aiv4 :

    } //end rest


}// end refImplementation



/* ongoing
function (vuimsg, lastcmd, frameWInfo, cb) {// passare cb(mastercontext = map of dynmatrixs); 

    // req = { cmd: lastcmd, msg: msg,session,newpage };// session.curpage= is the new page !
// res={cb,resparam={newpage,vuidata=data,nextpreprompt,dyncontent ,newpageurl}}
    // will cb adding to vuimsg.session.dyn the vui data and dyn context 

    // >>>>  test if a entity with the dyn not resolved at get page to calc 
    //		 from current session state data(page,intent/form already processed)

    // >>>  rifatto updateDyn , x fare simile al postroute
    var session = vuimsg.session;


    var req = { cmd: lastcmd, msg: vuimsg };// session.curpage= is the new page !


    console.log('** getPage , calling gettings [curpage] , curpage : ', session.curpage, '\n msg is : ', req.msg);

    var restBank = null;

    getter_=intents.mng.endCmd_Bl_Routing_Cfg;
    
    getter_(session.curpage, req,// use intentskills.gettings and also cmd intentskills.skills_OnEnd routings
      
    }

*/








/* moved

function rout_insdyn_insvui(req, res, next) {// last phase before call cb,TODO rout_insdyntomovebefore_insvui
    // was the cb in getter_(,,cb)  in olg getpage()

    //  req = see def in aiv3
    let { session, curpage, msg } = req;// here msg is text , any other param is a field of req
    // all data will be put in channelData so do it here or in final routeMid cb 
    var { newpage, channelData, nextpreprompt, dyncontent, newpageurl } = res;
    const vuimsg = channelData;
    // add here session ??? 
    // ? channelData.session=session;
    // >>>  newpage is the action expected todo in buildVuiFram :

    console.log('** getpage, getter_ callingback  (intentskills.gettings ) :', req);
    newpage = newpage || session.curpage;// can be curpage 

    // session = vuimsg.session;// can be changed 

    // update session
    // 072019 : so session will go to vui engine 
    //          in session .dyn put the dyn resolved both befor or in buildVuiFram and copy it in dialog.dynamic in intenskills 

    session.dyn = null;//reset
    session.prfInt = skillcb.pref;
    session.actContext = session.actContext || {};

    // >>>> The req1 : param needed by buildVuiFram :
    var req1 = {
        session: session,
        // text: vuimsg.text, 
        text: msg,
        url: newpageurl, // must be ever specified also if newpage=curpage ( or '' that's the same)
        newpage: newpage, // if =curpage and has alredy called before means just add dyns of curpage 
        cmd: lastcmd,
        rest: dyncontent
    };

    //    buildVuiFram will get vui cfg that comes from intentskill cfg 
    //     then buildVuiFram calc all
    //     dyns from where dependency than fills vui then returns here 
    //     changes  : calc all dyn here ( if we know the cfg staff from bk config ( or can get from ve direct call from here))
    //             then 
    //             do vui in the external pachage obj, passing the ref of all dyn alredy calc here , or 
    //                 also with a aiax or 
    //             just call ve direcly from here )

*/
/* 072019 management summary
 so to simplify try to cal all dyn and if the next page is null 
  buildVuiFram will simply add the last dyn in its vui message with no .vui parts
 question : will the dyn aiaxed or db queryed here io in previous midllew ctl (endAsk_Cmd  ctl) ?????????
 buildVuiFram :
    will check the dyn required to get the new page and fill it according to
    list of dyn in a page found in cfg_info fwcfg that should be a copy of intentskill.dynamic.dynfield.,,,
    to find the where it will search in the fields given in session.Match_Param (consolidation of all convo.vars) filled in 
        here.onchang   ... matcher ....
    but as some dyn can be resoved befor the buildVuiFram call ( and put into dyalog.dynamic.query)
    so buildVuiFram  before filling a dyn page/ related  will check that is alredy in 
        convo.fw.dialog.dynamic.dynfield.query
        or session.fw  ....  ( study if store this nfo in vars or session depen on how easy is to recover convo or session in cbs)
    
    keep in mind that if the page dont change buildVuiFram will be called :
        - to set preferred intent or mandatory intent ( vectorfield/entities on a thread)
        - insert in vui data the dyn info if the dyn is used in vui form to match 
                so buildVuiFram will ensure to fill only dyn in its page.js declaration 
    
    
    
    ...............
*/
/*
    lllllllllllll?;
    fram_ctl.buildVuiFram(req1, function (fwCont) {// if newpage=null or curpage just do aiax on restBank

        console.log('** getpage,calling  cnt_wk1/buildVuiFram(req) req: ', req1,
            ' \n  buildVuiFram returned cb  param (the fw cont=hbscontext) : ', fwCont);

        // set the client device :
        if (voicebot) {
            vuimsg.voiceEnabler = true;
            var ctx;
            if (fwCont) {
                ctx = new Ctx(session.curpage, newpage, vuimsg.text, fwCont.vuidialogue, fwCont.json, session.dfContext, fwCont.vui);
                if (guivui && fwCont.guivui) ctx.guivui = fwCont.guivui;// the form context x rendering (dyn+static)
            } else ctx = new Ctx(session.curpage, newpage, vuimsg.text, null, null, session.dfContext, null);

        } else {

            // ||||||||||||| in res.data 
            vuimsg.voiceEnabler = false;
        }

        console.log('** ctx details :\n ', tree(ctx));

        // ************  management symmary : dynamic/static declare fields and changing the curpage
        if (session.newpage) session.curpage = session.newpage;// reset if we are in new page  

        session.ctx = ctx;// add new page ctx to session x vui engine use , so at getpost we can clear this part of session 	
        console.log('** getPage , callingback after add some vui to session ', session);

        // >>>>  dynprompt :

        var chkses = false;
        if (chkses)// do not run 
            checksession(vuimsg, function (updsession) {
                vuimsg.session = updsession;// session will be used by vuiengine
                next();//cb(vuimsg);
            });
        else next();// cb(vuimsg);
    });
    // the get post ctl of cur page !


}  

///  private staff

let getPage = // moved 

    function (vuimsg, lastcmd, frameWInfo, cb) {// passare cb(mastercontext = map of dynmatrixs); 
    // will cb adding to vuimsg.session.dyn the vui data and dyn context 

    // >>>>  test if a entity with the dyn not resolved at get page to calc 
    //		 from current session state data(page,intent/form already processed)

    // >>>  rifatto updateDyn , x fare simile al postroute
    var session = vuimsg.session;


    var req = { cmd: lastcmd, msg: vuimsg };// session.curpage= is the new page !


    console.log('** getPage , calling gettings [curpage] , curpage : ', session.curpage, '\n msg is : ', req.msg);

    var restBank = null;

    getter_ = intents.mng.endCmd_Bl_Routing_Cfg;

    getter_(session.curpage, req,// use intentskills.gettings and also cmd intentskills.skills_OnEnd routings
        function (skillcb) {

            // >>>  newpage is the action expected todo in buildVuiFram :

            console.log('** getpage, getter_ callingback  (intentskills.gettings ) :', skillcb);
            newpage = skillcb.newpage || session.curpage;// can be curpage 

            session = vuimsg.session;// can be changed 

            // update session
            session.dyn = null;//reset
            session.prfInt = skillcb.pref;
            session.actContext = session.actContext || {};

            // >>>> The req1 : param needed by buildVuiFram :
            var req1 = {
                session: session, text: vuimsg.text,
                url: skillcb.newpageurl, // must be ever specified also if newpage=curpage ( or '' that's the same)
                newpage: newpage, // if =curpage and has alredy called before means just add dyns of curpage 
                cmd: lastcmd,
                rest: skillcb.dyncontent
            };


            fram_ctl.buildVuiFram(req1, function (fwCont) {// if newpage=null or curpage just do aiax on restBank

                console.log('** getpage,calling  cnt_wk1/buildVuiFram(req) req: ', req1,
                    ' \n  buildVuiFram returned cb  param (the fw cont=hbscontext) : ', fwCont);

                // set the client device :
                if (voicebot) {
                    vuimsg.voiceEnabler = true;
                    var ctx;
                    if (fwCont) {
                        ctx = new Ctx(session.curpage, newpage, vuimsg.text, fwCont.vuidialogue, fwCont.json, session.dfContext, fwCont.vui);
                        if (guivui && fwCont.guivui) ctx.guivui = fwCont.guivui;// the form context x rendering (dyn+static)
                    } else ctx = new Ctx(session.curpage, newpage, vuimsg.text, null, null, session.dfContext, null);

                } else {

                    vuimsg.voiceEnabler = false;
                }

                console.log('** ctx details :\n ', tree(ctx));

                // ************  management symmary : dynamic/static declare fields and changing the curpage
                if (session.newpage) session.curpage = session.newpage;// reset if we are in new page  

                session.ctx = ctx;// add new page ctx to session x vui engine use , so at getpost we can clear this part of session 	
                console.log('** getPage , callingback after add some vui to session ', session);

                // >>>>  dynprompt :

                var chkses = false;
                if (chkses)// do not run 
                    checksession(vuimsg, function (updsession) {
                        vuimsg.session = updsession;// session will be used by vuiengine
                        cb(vuimsg)
                    });
                else cb(vuimsg);
            });
        });// the get post ctl of cur page !
}fine moved */


// matchers as was done in old botkit :
// todo a version x dyn matcher using convo.vars.dynmodels.[field] also to build the question prompt
async function matcher(msg, field,resValues,intents,cmd,thread) {// nb if not coming back from a child should be resValues=msg.text 

 // 11112019 returns : if scalar a string , if vector the entities in  format :this.curInt[0] + some status info , if dyn  dynSes the dyn matching obj (just set or recovered from session.dyn)

// 07102019 now msg=context.activity, so
// text=msg.text,channelData=msg.channelData


    // suppose msg is the msg build in core.handleTurn(), staticF is the name f the mandatory intent that can
    // be associated to a ai intent=staticF_Ask 
    //      (scalar or vector Ask, not the  first main thread Ask that is associatedto the hears (not mandatory) intent )
    //  ,(vector  if entities >1) 
    //  that can be tested in the format : baseurl+/'+intent
    //  baseurl=https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<APPID>?subscription-key=<SUBID>&verbose=true&timezoneOffset=-360&q=

    // returns : if scalar a string , if vector the entities in FE format : entities=[{name: e.type,value: e.entity,type: 'entity'},,,]


    //  model=staticF=intDataModels.dialog.static[field]

    // who set notexamined ? : conversation.continuedialog and conversation.begindialog
    let nexam= msg.channelData.notexamined;//dc.context.activity.channelData.notexamined;//step.values.notexamined;// so this is first step a new user result  run so (TODO) check ai entities from activity 
 
    // 112019 news : in case of vector field , ai agent are called before in conversation.onstep() because if we have a vector resolver chaild we need to call ai before
    nexam=false;

    let api = null;// to reference 
    let staticF = dialog.static[field],// intDataModels.dialog.static[field],
     isVector = false, mandIntent;

    if (field.charAt(0)=='_') {
        isVector = true;
        mandIntent = field.substring(1);//  leave starting _ ( Vector entities) is the child cmd that resolves the vector field staticF
    }

    // >>>>>>>>>>>>>>>>>>   return new Promise(function(resolve, reject) {// return to a cb registered with .then

    /* study :
    ai json : different format ,
    
    ex (luis=enrichMessage)(msg_text) resolved query 
    
    query.intents =[{intent,entities}]
         . entities // or usually a property of a specific intent 
         .actions 
    
         V
         V  ex : 
         V
    
    
    
        in botkit-cms  enrichMessage returns/resolves command filled from query with format :
    
    
    
        var command=triggered = scripts[bestintentmatch]; + 
                                triggered.luis = query.luis  +
                                triggered.variables added with all entities in query.(intents.)entities  
                                    that  there are not jet already present in triggered.variables :
                                triggered.variables+=// e=query
                                    ne = {
                                        name: e.type,
                                        value: e.entity,
                                        type: 'entity'
                                    };
    
        // copy entities from LUIS into the conversation script
        if (query.entities && query.entities.length) {
            query.entities.forEach(function(e) {
                var ne = {
                    name: e.type,
                    value: e.entity,
                    type: 'entity'
                };
                var cv = triggered.variables.filter(function(v) {
                    return v.name === ne.name && v.value === ne.value && v.type === ne.type;
                });
                if (cv.length === 0) {
                    triggered.variables.push(ne);
                }
            });
        }
    
        // if LUIS results exist, pass them down to the bot. 
        //  really should be used command.variables because they have bith entities resolved and param passed by cms conditions  !1
    
        if (query.luis) {
            triggered.luis = query.luis;// for,mat FX , triggered.variables are formatted FA !!
        
        command is returned to testTrigger handler that from command.trigger extract entities and add to msg :
    
        msg.intent={name=command,probs,entities}// map is identity between luis intent name and command name!
        msg.entities or msg.intent.entities={}
    
    */

    // >>>  management summary on intent mngmnt 20082019

    // Entities Formats
    //      FX the format of luis ai rest query, FY is the format of the matcher ai rest query( FX=FY usually)
    //          luis rest queries  maps FX entities format  into FA format  usually attached to message.(intents).entities
    //      local var entities with format FE are set here from FA format ( luis from ms trigger) or from FY
    //      usually FE=FA
    //      >> in this implementation FA=FE:  entities=[{name: e.type,value: e.entity,type: 'entity'},,,]
    //  
    // - matcher can be called from first vector field/ask of default thread of the cmd engaged by cms (that used ai services or regex match from trigger config)
    //      the msg.intent contains intent with same name of command (which s the name of field ? the same of command+_ ?)
    //      the entities format FB will be attached to msg ( or msg.container)  in cms.testTrigger :
    //                          TODO TODO TODO merge code into right file ( botkit-plugin-cms.testTrigger not  botkit-studio-sdk.testTrigger ).... 
    //              that called   command=evaluateTrigger()  receiving matching command : command={command,luis,variables} from https://github.com/howdyai/botkit-cms/blob/master/src/api.js
    //                                 - botkit-cms.api.evaluateTriggers() will receive from ext (post in enrichMessage()) api service intents+entities in query obj ,formatted FX,
    //                                      then after find the matching command among intents received and the triggers defined in cms x different commands (query.intents[i].intent === triggers[t].trigger.pattern) 
    //                                       and build entities with format ne:      
    //                                          e=query.entities[i];variables.push(ne = {name: e.type,value: e.entity,type: 'entity'});// ne format FA
    //                                          so returns command={command,luis=query,variables} // so entities in both format : FA, in variables, and FX ,in query/luis.entities


    //                cms.testTrigger  receiving command , then insert in message directly or wrapped into a container 
    //                              message.intents=command.luis.intents=[]
    //                              message.intents[i].entities=command.luis.entities;// all entities can be made available to any intent ???
    //                              message.variables=command.variables >> clarify the variables role , perhaps just param set in cms , so canbe added to entities attribute ? 

    // - if matcher  finds message.intent[i].name=key without starting '_'  field  (in a vector askfield) 
    //         and associated entities in format FA  , can extract entities in a local property named  entities with format FE (usually FA=FE)
    // - if matcher cant find any message.intent field  (in a vector askfield) can call an external ai for entities matching on a defined intent of name=key
    //      and see if there is  a  msg.intent with name=key  with entities with format FY (just copy/updates the post request enrichMessage() )
    //          if so extract entities in a local field entities with format FE
    //  > better if FX=FY 
    // now evaluate the match on entity :field
    // TODO x matcher() :

    // matcher will try to see if the mandatory fields of the vector field described on the default thread of the childdialog vectorkeyname associated to the vector field=key=_vectorkeyname
    //  and returned at the end of the childdialog with session.Match_Param (and session.command.Match_Param)  filled with all entities resolved and if all mandatory fields matches
    //  returning from matcher() we see if the match is complete and if not (set a flag embedding in user answer $X.... x cms condition that will start a child cmd associated ):
    //  - launch the child default thread (conversation.js code has been updated to launch a child dialog from a special condtion action ....) 
    //      that will complete the mandatory field  according to command cfg  child vectorkeyname
    //      nb the vectorentities will be stored in :
    //          cms will register the user response (result) in vars.vectoraskfield.childscalarfield as user speech and
    //          the fw store the item mtches in  session.Match_Param.vectoraskfield.childscalarfield as entity item
    //     returning in the parent cmd we have set all mandatory field on vector field so we can goon asusual 

    if (isVector) {// 112019 : ONLY vector field has Intent set by client/cms/hererested ai agent !!!!
        /* 11112019
        now vector will look for matches that comes from child result. infact vectorask current conversation.onstep  handle  will call onchange with convo=null case that will  
            set session matcher from activity intents or direct rest ai calls
            then child resolver can complete the other entities returning in resValues and theis entitied will here be added to session matchers 




        */

        /*
         **************  112019 management summary updated see comment with this date  
        **************   23102019 management summary TODO 
        a vector onchange matcher must 
        see in intent was resolved by ext ai and/or completed/created associated resolver child
        - if not call rest ai to fill what ext ai or child should had done
        -then recheck if intent satisfy the model mandatory entities ,
        -return the intents, entirties match and user speech if any under values.fieldname.entities 
                and duplicates matches on session.Match_Param.vectoraskfield.childscalarfield  and session.Match_Param.childscalarfield  
                 matchers 
                 and a intent match value :  session.Match_Param.vectoraskfield.value=satisfied / not satisfied ( according to  the mosed description )
         the rest of onchange will do rooting or give suggestion to cmd options condition :  ... if not return $Xretry to cms condition 
        */
        /*
        **************   15102019 management summary 
        
        this is vector so the entities , resolved by ext ai, rest ai or (also) completed by a resolver child 
        must be found on session.intents 
        so remember that result after returning by a resolver child (also if do not exist onstep will call resume with result filled by the msg..intent.entities of the vector ask) 
        copy  the user speech in value.resolverchild.userspeech/entityitemname and  resolved entities  session.Match_Param.vectoraskfield.childscalarfield if not alredy done by resolver child 
         msg.text is last user speech responding to last child  prompt or  previous msg prompt 
        
        
        
        */

 //       error not msg.intent but session.intent , msg not exists 


        // let intents = msg.channelData.intents,// no more used , see in session definition :
        
        
        /* 112019 see in session definition :
        activity.channelData.intents=[
            this.curInt[0]={
                             name:vectorfield,
                             conf:confidence,
                             entities:{
                                      ask1:val1,
                                      ,,,
                             }
                            }
          ]
        */
        
        
        // old :  an  interface =intents=[{intent:nme,prob,intents with formt .... FA ??},,,] so intents=[{ne1:{name: e.type,value: e.entity,type: 'entity'},,,,]
            intEntities = null;
        // intents will be an interface that define intents and associated entities coming from :
        //   - both from ext ai ( cmstrigger or ve) that fills msg.intents or
        //   - launching here a rest to a service returning the intents 

        let entities;// format FE, usually = FA


        //if(nexam){// the message is first time enter a step to find matches : try to find intent in msg or with ext ai 
        if(false){    // old staff 
        // aiEntExtr is cfg flag : means to try to ask ai service if we dont find intents in msg.intents={}
        if (!intents) {// if this is a first vector ask of  a cmd, intents are evaluated by cms that if do not find anything set intents={} !!! so dont go in 

        if (cnfl.aiEntExtr&&nexam) {// no more used see 112019 comments , //if (cnfl.aiEntExtr) {
        
                
                        
                
                
                
                // do rest on ai service in onchange cb
                //       message.intents is set by  :
                //      -  cms.evaluateTrigger()  if is 
                //              - the first ask in a default thread of a cmd triggerable when all cmd are completed.
                //           evaluateTrigger()   will search matches looking to message.intents set by external ve  or lunching a rest to a ai service like luis  
                //      - ve ext service that found in previous scalar dyn named actContext (or looking at session.actContext)set with 1 (mandatory ) intent named as the key of crent message processed ( a ask)  
                //  >>> so if we dont find all mandatoty  entities in the config of the associated child command named key without starting _ resolved
                // take code from :  api.evaluateTriggers()








                //  api.enrichMessage(mandIntent,message_text).then(function(query) {
                let queryed, query,
                    // builder is 
                    // the template from which to render at flight/runtimebuild a ai agent creator using aicontext= the intent field params/directives or
                    //      its previously created agent reference 
                    builder = dialog.cmds[mandIntent].template || dialog.cmds[mandIntent].instance,
                    childfields = dialog.cmds[mandIntent];//  will contain all cmd fields, its model and voice directives, and the cmd directive to build the cmd ai agent  ;
                if (api) query = await api.enrichMessage(mandIntent, msg.text, builder, aicontext);
                if (query) loadquery(query);
            }
            else{


                // return entities=null  ; returns null matches !!!!!!

                // other matching outside model description associated with field/ask name will be managed by user onchange  cb part in intent data model  
                // specifically will be matched other entity that can be used also in condition passing a custom $X qsstring ( can also contains entitied of associated model inside a qs format )
                // using   res.route.routings.actionCms=qstring that overwrite the std  res.route.routings.actionCms=req.match; // match can be string or qs of all entities if ask is vector 


            }


        } else {// so there is resolved intents in msg: build entities from it 

            // extract [mandIntent entities , depending on intents/entities format ;  
            // mandIntent = field.substring(1);
            //  let intents = msg.channelData.intents,

            if (intents[0]&&intents[0].entities&&intEntities.length > 0)// && intents[0].name==field)
            entities = intEntities;//intEntities = intents[0].entities;

            // extract entities in the format FE
            // as FA=FE :
          //  if (intEntities.length > 0) entities = intEntities;// identity mapping 


        }
        nexam=false;
    }// end old staff


    /* 11112019 NEW :
    11112019
    now vector will look for resValues input that, 
    

        In conversation.onstep vectorask current  step handler  will call onchange with convo=null case after filled curInt[0] from activity.channelData.intents 
            onchange check if a intent was set in activity or call ai service to fill it , then returns with curInt[0] filled   marking coplete or not 

        if intent is not complete 
            - we fire resolver cmd with the same name of vectorfield : it will return with result=resValues=Match_Parm[field]={entities,complete} , entities=curInt[0].entities
            or 
            - if incomplete retry the current step using the message (template with no context set ) to prompt the user to fill the intent/vectorfield , so result=resValues=usertext
                or goon next step to manage the context for template using ctl chain / services(...)
        
        otherwise, is complete, and  go to next step with user text as result and intent complete in activity.channelData.intent=curInt[0]

        so :
        - if a resolver child was fired,resValues contains matches that comes from child result ( set in ..........) : resValues=Match_Parm[field]={entities,complete} , entities like curInt[0].entities
            can be complete or not 
        - if the intent was complete ( or incomplete ) coming from vectorfield step resValues=usertext
    */
    /* 01012020 NEW :
   -  check if intent got in previous vectorfield step was complete . 
        in this case the intent is stored  in session.channelData.intents[0]={name,conf,entities,complete}
            - from intent build smp with vectorfield for intent case (as done in conversartion ??) 

        else

            for each field on new_value resolver child result ( the field collected ) 
                - load the entity into father vector/intent  (entities) matcher after check that the field is matched in child (has a complete matcher :smp.complete)


            for each declared entities in dialog.cmds[vectorfield]:
                    find if some collection ask is done in the child , and in the Match_Parm is ccomplete add this entity to the vectorfield Match_Parm.entities 

    */
        let compl,childR,compl;
        childR=session[mandIntent].Match_Parm;// the child's matchers, child cmd has same name as vectorfield intent

    // if(resValues){
        if(resValues&&Array.isArray(resValues))
        {if(childR){// resuming from a child with name =mandIntent= field without starting _
 

            if(allEnt2(mandIntent,childR,matchval)){
               // match !!
            }else{
                // do not match , we must goon retying asking :
                // - as there are a child  ask a new text to process with child also


                matchval[mandIntent].text=null;
            }




            
        } else
        
        {
            /* do nothing 
            // no res child so check if from Activity. in this case allEnt should be already run so we find in vectorfield cmd also all matchers smp of intent's entities satifacting 
           if(intents[0].options.complete){
// extract from intents[0].entities[entity]
            entities=intents[0].entities;

           }
           */
        }
    }else{// a text result : user speech , goon with ext ai if there is 

        if (resValues.type === 'string'){// user speech 
            // call ext ai like onchange case !convo

            var tkurl=intDataModels.dialog.static[field];// url or token , field is vector field so the model is the ai service url !
            if(tkurl){
            let ints=await witai2activity(resValues,tkurl,field,this.aiserv,aiclients);// witai2activity(text,tokenurl,field,aiserv,aiclients,aiclient)
            // console.log('aiv3.onchange , test6 : ',this.curInt);
            if(ints&&ints.entities){
            //items=ints.entities;//activity.channelData.intents[0].entities;
            if (allEnt1(mandIntent,ints.entities,matchval)) // will set/complete  matchval[mandIntent_]

            return 1;
            else{// do not match , we must goon retying asking :
                // - if there are child  process this text with child also
                // nb the step if cant find the child will anyway  prompt user x another text

                matchval[mandIntent].text=resValues;

            }




            }}




        }
    }








        /*
        // now build vector smp and check if declared mandatory entities are all  extracted 

        // field or mandIntent ???
        if(allEnt(mandIntent, entities)){
           if(!compl) matchval[mandIntent].complete=false;// compl is strongher
        }else {

        }*/



        /* wasold

        if(resValues&&Array.isArray(resValues)){// resuming from a child
            let intent,dynList;
          if(intents&&intents[0]){
               intent=intents[0];
               if(intent.options&&intent.options.complete) {
                   // conversation in previous step got a successful intent from fwonchange intent analises so skip to next step immediately without begin child resolver dialog, 
                   // so we are  here to goon
    
                return intent.entities;
               }

          }else {  entities={ }; // non necessary : intent={ name:field,conf:0.9, entities:{ } };
             }
           let childfields = dialog.cmds[field];//  dialog.cmds={field=vectoraskfield=resolverchildcmd:{field1:{pri:m/a/b/c}. the child cmd has same name then the vectorfield





           for (var prop in new_values) {
             if (new_values.hasOwnProperty(prop)) {
                //if(childfields[prop]&& childfields[prop].pri=='m');// is the resolver child cmd scalar field prop , a mandatory  entity  ? 
                if(!childfields||(childfields&&childfields[prop])){// add if no definition or if match a definition 


                    // static field only 
                    // NO
                    // entities[prop]=new_values[prop];// that usually done by conversation : the father set convo.vars.father={ask1:usertext1,,,,,}

                    // 05122019 :à INSTAD here we get the matcher of child ask 
                    //              +  can be a complete param added by onend child cb to transmit the reason of not matching 
                    // the onchange of vectorfield will relay this reason as vectorfield reason or after analizion entity y an overwrite it 


                    // set match value only if complete not exist or has 'match' value 
                    :: problem : session.Match_Param[prop] was filed inside the ended cresolve child !!!!!!!!!!!!!!!!
                    if(session.Match_Param[prop].complete) {
                        entities[prop]=session.Match_Param[prop].match;
                    }else{
                       if(session.Match_Param[prop].complete=='match')
                       entities[prop]=session.Match_Param[prop].match;
                    }

                }

                // transmit the  end child  complete ' special entity as vector field complete result :

                    if(new_values.complete)compl=new_values.complete;// suggester return value x the vector field : see allEnt() that set default 


                     }
             }
          
           //  do after ctl chain returned if(entities){// dynLis=Object.assign({},entities);
           //     convo.vars.match=Object.assign(convo.vars.match,entities);}// flattened in part are alredy done in child if runned
            
        }

        */ // end wasold 













        // now we have tryedto extract entities related to this vector field, see if we needto extract  some entity that ismandatory :

        /* dothisjustafterreturning?????????
         let allEnt=true;// intent has got all mandatory entities as defined in dialog.cmds
 
  
         if(entities){
 
                                 // transert vector entities got to array of  matched entities ( lenght >1 if vector field !)
                                 // for each entity see if there are a field on child entity resolver , a cmd named string.substring(1))
  
                 for(ent in  childfields){
                               if(ent.pri&&ent.pri=='m') {// is declared mandatory 
                                    var ij;for(ij=0;ij<entities.length;ij++){
                                        if(entities[ij].name==ent)break;                                 }
                               }
                               if(ij==entities.length){
                                 // was not found so
                                 allEnt=false;break;
 
                               }
                              
                 }
 
         }*/
        return {entities,complete:compl};// no more used , {allEnt,entities};
        // TODO  returning : fills vars and session.match_param , set $Xrun into msgso condition will start child thatfill missing mandatory fields in childfields


        //  >>> so if we dont find all mandatoty  entities in the config of the associated child command named key without starting _ resolved

        function loadquery(query) {
            // query is in format FY 
            // return complex format : entities=[ne = { name: e.type, value: e.entity, type: 'entity' },,,,]

            // TODO : refactoring botkit-cms.api.enrichMessage(): query ai for entities defined in intent mandIntent 
            // suppose here query is same format of botkit- : FY=FX
            // if any intents were detected, check if they match the intent named mndIntent , 
            var match = false;
            if (query.intents && query.intents.length) {// query.intents.length >0 
                // check intents first

                var trigger = mandIntent;// the intent we are looking for in query.intents

                for (var i = 0; i < query.intents.length; i++) {
                    // check if the entities are declared on dialog.cmds[mandIntent]
                    var intent = query.intents[i];
                    if (Number(intent.score) >= INTENT_CONFIDENCE_THRESHOLD) {
                        if (intent.intent === trigger) {
                            match = true; break;
                        }
                    }
                }

                // check for no results...


                if (match) {// matched the intent with name , so entities will refers to the expected intent ,  also partially , resolve a array of the matcghed entities 

                    entities = [];
                    let match = null, msg_ent,
                        msg_ent = query.entities;// or better query.intents[trigger].entities
                    if (msg_ent && msg_ent.length) {
                        msg_ent.forEach(function (e) {
                            var ne = { name: e.type, value: e.entity, type: 'entity' };
                            entities.push(ne);
                        });
                        //if(e.type==field)// the name
                        //    {match=e.entity;}
                        // if(entities.length>0) resolve(res);else reject();
                    } else entities = null;




                }
            } else entities = null;
            // else { reject();}}).catch(reject);

        }// ends  loadquery







    } else {
        // is not a vector so here matcher will resolve the entity item according to model dialog.static[field]

        // returns the mathed items dialog.static[key][i]  or null 
        // ??  var field = msg.session.matField;
        var index = -1;

        //if (dialog && dialog.static) {
        // this is like a render of convo ask ( not generate a inflated code from template + context, but a aiax function that  that from aiax resp (dyn)  fills the view  :
        // here the template is a generating function that's this
        // the context is :

        //  old implementation the models werecopied in session : 
        // - the session.dyn.fieldx for dyn menu and 
        // - session.fields.fieldx and session.matchers.fieldx for static menu 


        // this implementation 20082019 we refears directly to page.js config 
        // for static :
        //var staticF = dialog.static[field];// the field model (=key)                        ***************************************   ALREDYDEFINED BEFORE !!!!!!!!!!!!!!!!

        //  match=null;// match =[[]] using builder would be : session.fields[key] or  session.intents[].models.entities[key]
        console.log(' intentskills, matcher ', msg.text, ' against model : ', field);
        //if (staticF) {


            let dynSes;//space=dynSes.space,
	let dynF = dialog.dynamic[field];

        if (staticF) {for (var i = 0; i < staticF.length; i++) {
            console.log(' intentskills, matching,testing item name :', staticF[i][0], '  with pattern :', staticF[i][2]);
            //if(condition.type === 'regex') {
                dynSes={complete:'nomatch'};
            test = new RegExp(staticF[i][2], 'i');

            // TODO: Allow functions to be passed in as patterns
            // ie async(test) => Promise<boolean>
            if (msg.text.match(test)) {// match[i] : is a string ( word or a regex ) or a compiled regex
                index = i;// set matching index 
                dynSes.match=staticF[i][0]; dynSes.complete='match';
                break;
            }
        }}else if (dynF){ // dynF
            // let the user dyn field run the test on user text using some previous where match then return to cms condition with the suggested routing condition 
            //  depending from the result of the fts/q&a rsult 
            /*  
                dynF.refine(field,msg,dynSes);// clone ?, user dyn resolver refine function as a micro middleware working on just a req=dyn_space on the fts
             returning from matcher we will call  scalarFieldCtl() that fire the ctl chain so why call here refine if anyway can be called in field ctl  ofthe ctl chain ?
             infact field ctl will be dedicated to resolve the view represented by the current match space on the dyn field ( not to bl !) so the refine can be managed there ?
             so in cmd condition of a dyn scalar field we check for overall match ( like tat used by vector field ) in $X  or using model match result 
             and retry if not resolved/match 
             but can we goto to another thread with a different msg working on the same dyn field ex :
             1 msg is like the 1st msg in a resolver child trying to resolve a std thread with some where fields and at last the dyn field :
                  1st msg : luis we have some proposal {{vars.thisdynfield_.space}} you can select by position or try matching for example  {{vars.thisdynfield_.refineprompt}}
                  -  test all the where msg getting  those matchings with no  condition without to reprompt the user 
                  -   at last in the dyn field run a dynfielf ctl and test msg condition on some model fts result : session.Match_Param[dynfield].complete= 1match,manymatch,spacereduced
                          ex  if fts got a space of 1 match if so go to a confirm thread then exit the resolver child or
                              if fts got a reduced space we can goto the samd std thread ( or retry the dyn field if there is no where field) or
                              to a alternative thread continuing test the dyn field and related where till the resolver child matches 

            > so in case ofa dyn fts + some where just thing as would be a vector field with where and a dyn so do prompt then  begindialog on the child and returning 
                we can test the child result as would be a std intent with the where field and a static field that is the full space dyn field resolved with some match procedure
            */
           //session.dyn=session.dyn||{};// full dyn matching procedure status 
           //session.dyn[field]= session.dyn[field]||

           dynSes={idspace:[],query:[],complete:'start',prompt:[],match:[],qeAdata:{}};// complete:matchingstatus/result, query:[] the query dyn result [[itempattern,shortdescr],,,,]


                // ********************************************************************
                //                              todo TODO :: following 
                // ********************************************************************

            // or just put the sectionIndex into a join coluumn of  the field table togheter with the usual where join   column and a column of labelname(=item name)
            //  then test the mapping function seeing the count in all dim section 
            //  then generate a classifier ( put in tsetArr[sectionIndex]) training it on all labelname related to sectionIndex 
            // so at runtime just launch  
            //          clssF= tsetAr[tsIndMap (matchingwhere)];
            //          answdata = clssF.answer1(qeaquestion, bot);


/* 122019     relay to httpService :
                        the matching algo is getVoiceModel : that fill pdyn session status Match_Parm  using text to do fts, using dialog info to get where match and db/http info. 
                        the algo is described in httpService.getVoiceModel(pDyn_, req, options) > aiv3...onChange_dynField where specifically : 
                        in onChange_dynField   
                            - we get the idspace with patt and descr field fron db/rest join on where field (cb are in future available to customize the db/rest call) and 
                            - (also using a customization launching userCtls cb ) the algo updates  the dyn status var req.session.Match_Param to prepare x field ctl matcing level
                        (Q&A/fts/position final selection)
                            
*/

/* JER sostituire con KER
const options=1;// set will prType,  1: we want from db do a join on some where field/entity returning  query ={}, so the fields received are usefull to complete here with FTS match on dyn field qea pattern 
await httpService.getVoiceModel(field, req, options) ;// dyn algo : will updates session.Match_Param[]=dynSes={idspace:[],query:[],complete:'start',prompt:[],match:[]};
// >> dyn algo will load a entity array from db using dialog info :
//			info : server url, model schema   ; dependency and itsmatches ,......
//		- to set the data service (a rest aiax formatter or a locaal interfce model mongo model query on ext db server)
//		- to map from data received the fields that fills Match_Param that is essentially a query rows with some fields good for user view management + bl fields
//      nb the rest aiax and db call will serve the same data obj starting from a request in http GET query string format QS= ( url= ,search=,where1=, idset=) 
//          so we can also set a http rest aiax json  service that will get the data obj using the QS requested to do the db call , so is the same db call to serves the mongo query above
// 
//          >>>>> (vui engine will use it! at run time )

//      the expected format of data(array/rows of item views :query,idset,match,,,) is a view good x gui and vui user interface query={id, patt,short descr}+ custom bl field ,
//      the fields received depend on QS format that can be choosen by right options. QS format can be customized using  userCtl.cbs
//      the algo also provide a convenience obj like idset , and match to use immediately  as context by hbs msg , all can be better customzed in user  ctl onchange chain
//      example :
//      data can be served by a join query on where paranm , so user ctl can goon doing fts/QeA match on patt data on a duplicated table  or can do only a position select 
//          obtaining a interection of current query rows 
//          fts can instead be done directly in db server so the user field ctl can do less work to select the item in rows set (query)
//          nb bl can anyway access to full item property (if not alredy in query ) doing a httpService.getVoiceModel specifing only a id= param // TODO 

// todo : the algo have a userCtl.doQeA x customization 
// query format depend on prType set in .onChange_dynField
// after done db query if there afre here q&a or fts goon to do fts on =dynSes:
// .........

// 2nd dyn algo managed as separate algo : do here or in field ctl , can also be get with a userCtls.callback (as was a middleware ctl ?)  :
//		userCtls.qeAres(dynField,
            //updates dyn status 
            let dynS=session.Match_Param[dynfield];// if updated 
            qeAres(dialog.dynamic[field]);

*/


                // QEA TODO review,  get as a custom qea set in userctl
 





/* >>>>>    KER : SERVICES
      await httpService.getVoiceModel(field, req, options) con this services e field var in param 
      await qeAres(dialog.dynamic[field]); con this dynfield e services in param 

************** MNG SUMMARY  REGISTERING SERVICES : look in /doc slide for a updated version 

 services , type A,B,C ,  are registered in intent_Data_models : module.exports = function (fwcont, botkit)

 any service will set Match_Param[], return null

 - Type A 
    in intDataModels.services we put Type A the param must be described when  registering , req is custum format , 
            SERVICES FUNCTION WORKS ON THE SERVICES OBJ SO CAN BE BALLED WITH USUAL THIS 

 - Type B,C  
    req param must be  std ctl chain x onChange in scalarFieldCtl() is :req={convo,bot,cmd:command,askey:field,match:item,thread,msg:text,session,curpage:null}

    in intDataModels.services_ ( can be services_=services) we put 
        Type B with  param : (req,services_,services) , they will have this=dialog.dynamic[field]

    in dialog.dynamic[field] we put 
        Type C with  param : (req,services_,services) , they will have this=dialog.dynamic[field]

            nb Inside Type B and C services function can be called invoking services obj as usual : services.somegenericService so this=services



 - type A : work on services ,  this cb is usually a fw cb so wont be called in specific ctl , so req is service specific this is service 

     callable  >    inside onChange cb(new_value, convo, bot) 
                        from matcher(msg, field,resValues,intents))  
                                * service.httpService(field, req, options);// this is services , field and other  dynamic[field] attributes  in req , 


 -type B : work on services_ or services , this cb is usually a fw cb so wont be called in specific ctl , so req is service specific but this is dyn ctl so service_ will be in param
  type C : work on dynamic[] , this cb will be called in specific ctl , so req is ctl chain std,  this is dyn ctl so service will be in param


     callable  >    inside onChange cb(new_value, convo, bot) 
                        from matcher(msg, field,resValues,intents)  
                                * Type B :  services_.qeA.call(dialog.dynamic[field], req,services_,services);
                                * Type C :  dialog.dynamic[field].qeA(req,service);
                        and 
                        from scalarFieldCtl() launching ctl chain expressCtl.run(req, res)
                            ctl field       _Route_On_AskConvoEnd(req,res)  calls field ctl inside container        intDataModels[page].Route_On_AskConvoEnd[ctlName](req, res)
                            ctl end page    _Route_onPageEnd(req,res,next)  calls                                   intDataModels[page].Route_onPageEnd(req,res, next)
                                * res.services_[qeAx](req,service_,services);   > that will call  services_.qeA.call(dialog.dynamic[field], req,services_,services);
                                    or  res.myservices_(qeAx)                  > that will call  services_.qeA.call(dialog.dynamic[field], req,services_,services);
                                * res.qeA()                                     > that will call  dialog.dynamic[field].qeA(req,service_);


nb req={};	// qeA wants a middleware std req formatted param , it is supposed field specific and lauched by middleware with res.qeA() ; 
			//		but really qeA_ neednt be specific of field so can be put in serviced , then if used in ctl res.serveces_ can be a service version 
			//		where we bound dialog.dynamic[field] for simpler ctl call : res.service_[qea_]()
            // instead services.x  can have req param with custom req format

**************

so here we can : 

let services_=services;// or let services_=services_;

// type A :
req={};// ......... service specfic see httpFarm()... usually remembered when registering 
await service.httpService//.getVoiceModel
                        (field, req, options);// this is services , field and other  dynamic[field] attributes  in req , 
// type C :
req={};// ......... std ctl chain
await dialog.dynamic[field].qeA(req,service);// this is dynamic[field]

// type B :
req={};// ......... std ctl chain
await services_.qeA.call(dialog.dynamic[field], req,services_,services);// this is dynamic[field], services =services_ usually 



*/

let services_=services,// or let services_=services_;
df=dialog.dynamic[field];// dyn field descripter




if(df){


// >>>>>  CALL algo  std type A,  and Type B  if exists , they all in chain will updates  Match_Param[]

/* call type A ( std dyn resolutor ):
req={};//  service specfic see httpFarm()... . 
// remember that std ctl chain x onChange in scalarFieldCtl() is :req={convo,bot,cmd:command,askey:field,match:item,thread,msg:text,session,curpage:null} . CONVERGE ???



- params : field, nb  also iffield has not a askkey in some message ,but exist dyn description in dialog.dynamic[] to discover dependant model ( whose match to use as join or to set  paramlist
    req = { convo, session, askey,qs } , 
     qs : {	term=qs.term,exec_=qs.exec,		> used to do search /fts on patt field 
       full=qs.full,inter=qs.int;		> used to set result rows format 
       join_1_m=qs.join_1_m,join_n_m=qs._join_n_m, > askey/fields to join using current field model .match 
       fts=qs.fts				> > used to do fts on patt field 
   } // vui gui gui+ ossia solo id o id+fields
   :: how to set req ? will influence the filling of match_parm !!!
*/

let qs={inter:null,msg,text:resValues};// msg==activity, so should resValues=msg.text , better use msg and msg.text  . inter:'gui' 'vui' ??


// 20102020 new X2 : req assignement
req_={convo:null,session,qs};// Type A req_ req_!=req !!! 

/*
// if(df.term)qs.term=df.term;// = msg.text; or user speech ?
if(df.regex)qs.regex=df.regex;// term regex/filter
if(df.fts)qs.fts=msg.text;// df.fts;:: or user speech 

if(df.join&&df.join.length>0){
    // if(df.dynparam)qs.dynparam=df.dynparam;// //[wherefield1,wherefield2] , // in related dynfield or staticfield we find the schema_url to where   col name 
if(df.where_jRef)qs.where_jRef=df.where_jRef;
    // 1:M rel 
    qs.is_n_m=df.is_n_m;//  [joinfield1,joinfield2] // in related dynfield or staticfield we find the schema_url to query the associated  collection  
    qs.isRef=df.isRef;//[join1idrefcol,join2idrefcol]

        qs.join=df.join;//[wherefield1,wherefield2]
}*/

Object.assign(qs,df);// extend to df attributes


//if(df.joinRef)qs.joinRef=df.joinRef;//[join1idrefcol,join2idrefcol]

let filledRows;
// >> httpService will query using :
//      - term/regex,fts search and 
//      - where on field columns (schema-url) according to dynparam col list and current matches values , and 
//      - join matches  on :
//          associated rel dynfield  dynparam dynjoin: ['aJoinDyn'] schema (shema_url)  
//          on dynfield associated schema (schema-url) join ref :  joinRef. 
//      - returning results in .curRows x processing (updates/refine matches Match_Param[].)  by chained services 
// >> chain with : services_.qeA or specific dialog.dynamic[field].qeA 


if(service.httpService)
filledRows=await service.httpService// will fill just Match_Parm[].curRows, was .getVoiceModel
                        (field, req_, options);// this is services , field and other  dynamic[field] attributes  in req , 

// 
// filledRows = true if process run with no error 

let req=new ReqOnChange(

   // text, convo, bot,command,field,match,thread,  // onchange cb param 
   //     session,curpage
   msg.text,convo,bot,cmd,field,null,thread,session,null);// Type B/C req
   
   
// >> chain with : services_.qeA or specific dialog.dynamic[field].qeA 
//  these services working on std req ctl chain user turn info can be fired on ctl or just before in Matcher x convenience , so in ctl i can chain again and manage the details only 
//  they with use curRows to updates dyn status  Match_Parm[].match .query .idspace .complete 
//      - these services if using proper data structure set in     
//              qeA common DATA STRUCTURE and algo  in dialog.dynamic[field] OBJ 
//             qeA user session match  status specific x the algo IF EXISTS WILL BE PUT IN Match_Parm[].qeAdata={} (a subt level of session status )


if(df.qeA&&filledRows){
    // type C  call if exists/registered  ( it can also chain the generic algo Type B with : services_.qeA()):
     // THE Specific  dyn matcher algo : chain generic to get final refining of  match, idspace, query fields . starts with if(this.name!='customdynfield')

    // std ctl chain x onChange in scalarFieldCtl() is :req={convo,bot,cmd:command,askey:field,match:item,thread,msg:text,session,curpage:null}

// do refine on Match_Parm[] ( starting from db filled Match_Parm[].curRows ) 
await df.qeA(req,services_,services);// using only std req info; this is dynamic[field] so we can use other services_.xxx like: services_.qeA.call(df=this, req,services_,services); 
} else if(services_.qeA){
    // type B  call if exists/registered  :
    // THE Main generic dyn matcher algo : from curRows updates match, idspace, query fields . starts with if(this.name!='customdynfield')

        // std ctl chain x onChange in scalarFieldCtl() is :req={convo,bot,cmd:command,askey:field,match:item,thread,msg:text,session,curpage:null}

// do refine on Match_Parm[] ( starting from db filled Match_Parm[].curRows ) 
await services_.qeA.call(df, req,services_,services);// this is dynamic[field] so in generic service_.qeA service we can custm match algo looking at this.name (=dynfield) ; services =services_ usually 



// let text= req.qs.msg.text;
// set complete if we find only 1 row

}
}
     //   }// end dyn 

// end KER 


function qeAres(dynDescr){// now new version on intentData_model, dynDescr=dialog.dynamic[field]
    // qeA common DATA STRUCTURE and algo  IF EXISTS WILL BE PUT IN dialog.dynamic[field] OBJ 
    // qeA session match  IF EXISTS WILL BE PUT IN Match_Parm[].qeAdata={} 

    // AND CUSTOM FIELD DB TABLE CAN BE IN ...... ? 

                function tsIndMap (item){
                    // example of a mapping function : from where space point/areas x=5,y=any > go to a set of index , here x semplicity just a index
                    
                    if(item<10)return 0;else if (item<20)return 1; 
                }// we have dim = number of else if !!! ,


			// try to  count every item in table satisfying if condition to segment in dim equally divided partitions
                let tsetArr=[],// the classifier bank ?
			tsetArrTSFile=[];// in setArrTSFile=[i] we put all label(fts entity item)  that is associated to a  where[i] value (where is where[i=1,n])
							//  in space S mapped i=tsIndMap(anyOfSvalues), can depend or not ..... 
                let tSet=dynDescr.tSet,where=[];// where={'giallo','bianco'}
                dialog.dynamic[field].tSet={tsetArr:[],tsIndMap:function(whereIt=where[x]){return x;}};// 

                let qeaquestion=msg;
			// get the classifier appliable to where value :
			clssF=tsetArr[tsIndMap[whereMatch]]// whereMatch the where field matched
                var answdata = clssF.answer1(qeaquestion, bot);
                var answ = answdata.answer;
/*
learning 

trainF='trainData_serv.json'
trainingData=parseTrainingData(trainF,init1);

 trainingData={element1=label1:{
                                    questions:[stringq1,stringq2,,],// [patt]
                                    answer:string1,// voice name
                                    otherBlFields
                                    id:45,  // mandatory 
                                    patt:
                                    data:
                                    name:
                                }

clssF.init(trainF);

        function init1(trainingData){
         ... trainingData.forEach((element, key) => {// trainingData={element1=label1:{questions:[],answer:string1,,,}   }  key=????
             trainClassifier(classifier, element, trainingData[element].questions);
         ....
        }






match :

    var answdata = clssF.answer1(userext, bot);
                answer1()

                     guesses = classifier.getClassifications(usertext.toLowerCase()); = [
                                                                                        label: 'label1',
                                                                                        value: 0.8
                                                                                        ]
                    guess = guesses.reduce((x, y) => x && x.value > y.value ? x : y);
                    return interpretation= {probabilities: guesses,	guess: guess.value > (0.7) ? guess.label : null };

            interpretation=   {probabilities: guesses,	guess: guess.value > (0.7) ? guess.label : null };     
            return {data:trainingData
                    answer:trainingData[interpretation.guess].anwer
                    interpretation            
                    }       
answdata = {data:trainingData
            answer:trainingData[labelMatch=interpretation.guess].answer
            interpretation :{probabilities: guesses,	guess: labelMatch=  guess.value > (0.7) ? guess.label : null };            
            }

	

		idspace:[],query:[],complete:'start',prompt:[],match:[]};// 

*/      
                if (answ == null) {
                    console.log('no answer found ', color);
                    bot.say('Sorry, I\'m not sure what you mean');
                }
                else {
                    console.log('answer found ', answ);
            
                    convo.vars.colorgot = answ;
                    var dump = ''; var i;
                    for (i = 0; i < answdata.interpretation.probabilities.length; i++) {// all labels matched 
                   
                        //JSON.stringify(convo.step, null, 4)
                     
                        var row = answdata.data[answdata.interpretation.probabilities[i].label];// .questions and .answer 
                        dump += '<br> ' + answdata.interpretation.probabilities[i].label + ' ' + answdata.interpretation.probabilities[i].value + ' ' + row.sportello + ' ' + row.servicetype;
                        
                        dynSes.query.push([label],[label]);
			//dynSes.idSpace.push(0);
                        dynSes.match.push([label]);
                        qeaSpace.push(row.id);//
                    }
                    let idspace;

                    // now update status to new match improvement: {idspace_:[],query_:[],complete:'start',prompt:[],match:[]}
                    // imagine have a copy of main db table projection 
                    if(refine){// we have filled all rows with a previous join, now we intersect those array to only rows with sane id  
                        idspace=Intersect(idspace_,qeaSpace);
                        query=Intersect2(idspace,query_)

                        }else{
                            // reset all data with new match 

                        }

                        // now can do a user cb 
                        if(reg_dynCb)(field );
            
                    bot.say('ok just as pre prompt  you got answare :' + answ);// pre prompt 
                    bot.say('answere score and relationship :' + dump + '<br> sportello richiesto: ' + convo.vars.sportello + ', service richiesto: ' + convo.vars._problemtosolve);// pre prompt 
                   // convo.vars.qea = convo.vars.qearesponse = answ;

                }
     }   // QEAres()

                    if(dynSes.match>0)convo.vars[field]=dynSes.match;

          // dynSes={query:session.dyn[field].query,complete:session.dyn.complete};// matching result exposed in conversations,,,, > will be put in session.Match_Param[field]
           index=-2;// dyn case 

        }// ends dynF


        // logs
        if (index >= 0) console.log(' intentskills, matching, after test we match item name : ', staticF[index][0]);
        else console.log(' intentskills, matching, after test no item matched');


        //}

        if (index >= 0) {
          //  return staticF[index][0];// the name of matched/resolved model item 

         // do after ctl chain returns :  convo.vars.match[field]=dynSes.match;
            return dynSes;//{match:staticF[index][0],complete:'match'};// the name of matched/resolved model item 

            //resolve(staticF[index]);//return staticF[index];
        }else if (index == -2)return dynSes;// the dyn matching obj 
        // else reject();//return null;
            else {
            // return null; or 

            return {match:null,complete='nomatch'};// the name of matched/resolved model item 

            }

    }// ends is not avector 
}// ends matcher


function mergeIds(setquerywhere,spaceid){
    // TODO 
    return setquerywhere;}


//# sourceMappingURL=conversationState.js.map
module.exports = { AppCtl: appCtl };
/* 072019 this definition is taken by recent bk_fw.appctl
 AS UPDATE SOMETHING PLEASE MARK LINE STARTING WITH ***
**************** SESSION definition ***************************
** session mngment:
	si basa sul fatto che il wss apre un ws e relativa istanza bot che consegna message che  mantiene il message.user
			per tutta la sessione aperta dal client ws
	>  vuole dire che e' il client ws (browser) che deve settare il message.user  o
		se in message viene da un client che non setta lo user allora lo devo fare in getpost associandolo all'istanza bot o
			rimandandolo indietro al client che mi deve ritornare il session.user  o deve ritestare il bot id

			>> session id set
				- using msg.user set by user cli or
				- type + bot ws connection instance id


    // session will have 3 level :
    //	- convo level : the status are put in convo.vars and the matching history
    //		(action=usuallythelastcommandcompleted)to set outContext
    //	- passing params if there are intermediate calculation to use in a next routed function
    //		( usually a nextGet rest  using qs as params)
    //	- page level : the status are put in outContext,preferred/mandatory list : the space of future match to got success
    //	- app level




>>>> better define a class !!

				// 01052019 session id rules :
				// session  are associated to userid
				// so when ws open a wssession if there is not a userid (ws client wont specify) we must generate one and send it back to client
				// after a time the session will expire and restart a new one, also in case we receive a type=helloxxx
				//
				// 12012019 : a incoming message with session must have a stored session . incoming just updates some status (intent )


.turn // progressive turn index


.get // set in getpost if the incoming request is  a get hello page, use x  ???

- curpage (fw dialog status on top of bb dialogstate in dialogSet.dstatus ) related and matchings :
.curpage // is associated to a dialogSet inserted on dc
.newpage // used in vui engine to see if there are a new page to serve, in fw  we use res.newpage to set a new page from some ctl
.actContext[]  //   explain better ,
                //  probably put the after submit staff ( when a convo/cmd is complete ) like outcontext/action in res.root.outcontext/action ,  ....
                //  and also the senders condition param is better to insert in res.route.send.sender.condition instead of call
route,


****** intent section
// 112019
-  reference for normalized format of :  activity.channelData.intents
        intent from ai is set by conversation.onStep calling aiv3.fwonchange cb where in if(!convo) .... returning from witai2activity() we got curInt :
 

                        
                                 
                                this.curInt[0]= returns = {name:vectorfield,
                                                             conf:confidence,
                                                             entities:{
                                                                ask1:val1,
                                                                  ,,,
                                                            }
                                                        }
  
                                 activity.channelData.intents=[
                                                                this.curInt[0]={
                                                                                 name:vectorfield,
                                                                                 conf:confidence,
                                                                                 entities:{
                                                                                          ask1:val1,
                                                                                          ,,,
                                                                                 }
                                                                                }
                                                              ]

>>> till now 1 intent only in intents obj ( so intents[0]) ! 
                


older comments :

- premessa ( management summary 102019)  
  * botkit-cms chiama luis , sceglie il best intent , poi passa a botkit-plugin-cms.cms :
        - il script corrisponente al best intent che matcha il script trigger  pattern name e  
        - le entities in formato cms variables 
        > il cms setta message.channelData.intents il intents con nome scriptname e entities un obj con properties i nomi dei  entities matched e value il string o [] values
  
  * set also in  witai2activity() if called

  * onchange 
  
    use of intent in onchange() :
            // extract [mandIntent entities , depending on intents/entities format ;  
            // mandIntent = field.substring(1);
            //  let intents = msg.channelData.intents,
            if (intents[mandIntent] && intents[mandIntent].entities) intEntities = intents[mandIntent].entities;
  
    si preoccupa di trasformare il message.channelData.intents dei vector field , 
        -   eventualmente ottenuto in modo analogo con un rest a local ai service, 
        -   eventualmente risolto o completato da un resolver child che ritorna {en1:val1,,,,} (messo in value.vectorfieldname) e session.matched.cmd.Match_Param[vectorfieldname=childcmd]={ent1:val1,,,,}
        in :
        > user speech that matched the entity item : value.vectorfield.entvar (duplicated on value.entvar )
        > model var : session.matched.command.Match_Param[field]= { field1:val1,,,, }
        > current model var :  session.Match_Param[field]= { field1:val1,,,, }


*** waiting to know luis intent format , CHANGE FOLLOWING:
    .intents[name].name = name
    .intents[name].conf = name
    .intents[name].entities= {theentityname_or_aparamName:(matched(calc)value,....} entities matches and calculated params in a intent ( a resolver convo entities and thats of its chained navigation convo)
    	nb contains matched ai entity (from middleware ai rest or embedded in msg),asks(static and dyn) and calc params ( coming from vars.convoEnt)
    (.intents[i].asks was the ask matches , now use entities like in ai case )
*** WITH :
    .matched.command.Match_Param[field] = { value: null };// scalar field/key, example session.matched.colorcmd.fieldname.value
    .matched.command.Match_Param[field] = { field1:val1,,,, };// vector(intentEntities) field/key,  WERR
             example : session.matched.shirtorderkeys={color:'white',size:'large'}

****** fine intent section





.Match_Param all entities map in current convo/cmd (  grouped by intent=vectorfield  name) *** only present current convo, static matches and dyn query matches
////////
    scalar : .Match_Param[field] = 'matchedmodelitemname' ( OR  { value: 'matchedmodelitemname'  } ??)
    vector :  session.Match_Param[vectorfield_]={child_field1:itemmatched1,,,,} 
            was 
              see AAWER 
              + optional map as vector field :  session.Match_Param[vectorfield_]={child_field1:session.Match_Param[child_field1],,,,}  ( ==  WERR )
                            


.dyn.field(?.query)=[[itname,short descr],,,,] =(duplicate?)= session.dyn.adynfield=intDataModels.dialog.dynamic.adynfield.query;   *** only present current convo
        // INVESTIGATE: uestion as all convo temp var are in convo.vars and not in session.... , WHY put dyn in session ???
        //                              because they span in all page ?
        //                             OR because this var must be sent in session  also to client/vui_engine ???

.actContext[]  //   explain better , probably put the after outcontext in res.outcontext ,  ....

browser matching param algo
.prfInt[] : list of intent on cur page to match first

browser connection between parts
.waitEnd

browser conversation
convo

browser dynamic matching function params:
?? .matField, ?? seems already set in intents[i].entities and .Match_Param

  // this is like a render of convo ask ( not generate a inflated code from template + context, but a aiax function that  that from aiax resp (dyn)  fills the view  :
  // here the template is a generating function that's this
  // the template context is (todo: check the following) :
.dyn[fieldx] for dyn menu (must be passed to the rest call that must copy the query model into it ) and
  //  TODO > - session.fields.fieldx(will just copy the intentskills.declare.page.static.fieldx) and session.matField.fieldx for static menu


other vui
.ctx context got by cnt_wk1 :    dialog descr +dyns

	USED BY :
		- client ws to engage vuiengine ( if message.type='message' and message.voieceEnabler=true ) or bot gui
		- vui engine to match the dyn model
		- a resolver convo , named cmd, to match the dyn model
				at creation (hears match) the convo will find this session var in :
				session.ctx.json  so will be made available in following turn in
				convo.setVar('dynmodels',session.ctx.dynmodels );
				convo.vars.dynmodels.[field]=JSON.parse(ctx.json)[field]  > used by matcher that returns matches in :
				//   no : convo.vars.matched[field]=convo.vars.dynmodels.[field][i][0]=session.ctx.dynmodels[field][i][0]
				convo.vars.entities[field/key]=convo.vars.dynmodels.[field][i][0]=session.ctx.dynmodels[field][i][0]
				during convo ask/question matches wi goon : convo.vars.convoEnt[field]
				at end convo the matches in convo  will be transferred to session :
				session.intents[cmd].entities[field]=convo.vars.convoEnt[field]=session.ctx.dynmodels[i][0]
					nb as native we keep :  convo.vars[field/key]= user utterance
	>> anyway both resolver ( ext ai (coming in msg or filled in a receive middleware/ service called in conversation )  or convo resolver) will
			store the matches in :
		session.intents[cmd].entities[field]


	ctx.curpage=session.curpage; >>> a copy of session.curpage !?!
	ctx.newpage=newpage;
	ctx.json = fwCont.json;// the json to deliver dyn to vui engine
			NO MORE :  ctx.dynmodels=JSON.parse(ctx.json) can be done in receiving middleware


	>>> there is some intent/convo (cmd) that will match this  .intents[].models.entities, TODO
	ctx.vuidialogue = fwCont.vuidialogue;// the dialog html/xml description
	ctx.guivui = fwCont.guivui;// the form context x rendering (dyn+static)
	ctx.pageprompt = vuimsg.text;// overwrite
	ctx.dfContext = session.dfContext;// overwrite

app level
.app={}

**************** CONVO vars : SESSION var used as working in convo ***************************+
convo.vars
	.pageprompt
	.convoEnt   the navigation and resolver matches ( convoask() ) used in matcher()
		:  (or matches ?? see intentskills.matcher()) ??

	( set in session2vars())
	.entPrompt = dialog.prompts[afield]
	.session
	.stmodels[afield]=dialog.static[afield]={afield:smod,,,,}
	.stmodels1[afield]=dialog.static[afield][1]={afield:[descriptionfield_item1,,,],,,}
	.entities = session.intents[cmd].entities
	.dyn.fieldx for dyn menu

**************** template context : data model to render convo asks  ***************************+
declare.

	static.afield=[ [],[],,,] (matcher is .intents[i].entities. ........)
	dynamic.adynmodel.dyn (matcher is ........)



*/

/*
**************** intent ENTITIES definitions 11112019 top reference mng summary   ***************************

- cms :   to review :
     in cms command=evaluateTrigger() and     cms.testTrigger 
    from a luis query={intents:[],entities:[e1={type:,entity:,,,,}],,,}
    we get the command  command={command,luis=query,variables=[ne1 = {name: e.type,value: e.entity,type: 'entity'},,,]} 
    
     then in .....   we put in activity.channelData intents with the format described below 


- in conversation.onstep,  Handle the current step if vector field ,  we look for entities in activity.channelData.intents
                                 activity.channelData.intents=[
                                                                this.curInt[0]={
                                                                                 name:vectorfield,
                                                                                 conf:confidence,
                                                                                 entities:{
                                                                                            ask1:val1,
                                                                                            ,,,
                                                                                            adynqueryresultfield:[[name,shortdescr],,,,],  ok??
                                                                                            ,,,
                                                                                 }
                                                                                }
                                                              ]

                                >>> till now 1 intent only in intents obj ( so intents[0]) !     
                                question : each entity a string property     not a complex obj like in luis query or cms variables . sure not need to use a more structured obj ?


 then call fwonchange with  this.curInt set to 
                                null or if exists a intents in activity :
                                activity.channelData.intents

                                this.curInt=[ 
                                                        {name:vectorfield,  // only first item this.curInt[0] is mnged
                                                             conf:confidence,
                                                             entities:{
                                                                ask1:val1,
                                                                  ,,,
                                                                 adynqueryresultfield:[[name,shortdescr],,,,],  ok??
                                                                 ,,,
                                                            }
                                                        }
                                                ]



- in aiv3.fwonchange returning from  normalized wit.ai rest ai  witai2activity() we got simple curInt (not a complex entity format like luis query or cms variables):
 

                        
                                 
                                this.curInt[0]= returns = {name:vectorfield,
                                                             conf:confidence,
                                                             entities:{
                                                                ask1:val1,
                                                                  ,,,
                                                            }
                                                        }

so   using   allEnt(mandIntent_=vectoraskname=childresolvercmd, ......  ) we  
    - fill  .Match_Param[field]:

        session.Match_Param[vectorfield_]={child_field1:itemname,,,,}      
                remember that in case of scalar field : .Match_Param[field] = 'matchedmodelitemname' ( OR  { value: 'matchedmodelitemname'  } ??)


                    nb : 
                        but   allEnt  item, is really a map so should be called  items, has the  FE format normally returned by matcher() : 

                             matcher() returns : if scalar a string , if vector the entities in FE format : entities=[{name: e.type,value: e.entity,type: 'entity'},,,]


                   
    - setting curInt[0].options={complete:true,,,,,} if all mandatory intent fields declared in  childfields=dialog.cmds[vectoraskfield];  dialog.cmds={vectoraskfield=resolverchildcmd:{field1:{pri:m/a/b/c},field2:{},,,},cmd2={},,}
                are got 



- so returning in conversation.onstep from aiv3.fwonchange + aiv3.witai2activity() we got conversation.curInt :
                         

 


                                this.curInt[0]= returns = {name:vectorfield,
                                                             conf:confidence,
                                                             entities:{
                                                                ask1:val1,
                                                                  ,,,
                                                            }
                                                            ,options:{complete:true,,,,,}// param from onchange call  
                                                        }




     so (WHY ? IS USEFULL ??? after set session match fields,  entity in activity intent are used ???) :
        in conversation.onStep we fill activity.channelData.intents[0] :

                                 activity.channelData.intents=[
                                                                this.curInt[0]={
                                                                                 name:vectorfield,
                                                                                 conf:confidence,
                                                                                 entities:{
                                                                                          ask1:val1,
                                                                                          ,,,
                                                                                 }
                                                                                }
                                                              ]


    so after eventually (if options:{complete:false,,,,,} ) 
    - call resolverchild (name is the same as the vectorfield)   to complete activity.channelData.intents and set result=step.value with fields of resolver child 
    - or just run next step to goon with alredy set session match 
    
    
- we got to step ++ where in conversation.onstep  :

 in handle previous step we call this.runOnChange(previous.collect.key, step.result, dc, step);

- in fwonchange onchage cb : 
        result is 
            - previous step user text  or 
            - step.value of returning resolver child if called ,
        curInt[0].options.complete==false means we tryed to call a resolver child that if exists set result as step.value (a obj not a string)
    so if curInt[0].options.complete==true we alredy set session match 
                so can set condition suggestion (example continue )and 
                can also run ctl like scalar field ?  , then 
                exit
    else  we see if a child returned (new_value is not string but is a map and complete=false) so we can reset/add new fields matcher using (new_value=result).childfields calling matcher ( will do vector case match : just add session match looking to result (child scalar fiuelds))
                 so can set condition suggestion and exit


    exiting matcherreturn=aiv3.matcher(activity, field,new_value,this.curInt)
     matcher() returns : 
        if scalar a string after try matching the user text (new_value/result or activity.text ?) , 

        if vector the entities in  format :this.curInt[0].entities, infact  DO ENTITY DISCOVER LIKE witai2activity()

     calling aiv3.allEnt(mandIntent_, matcherreturn,session.Match_Param[mandIntent_]) will complete session.Match_Param[mandIntent_] 

                   session.Match_Param[vectorfield]={  childfield1:'matchentity' ,,,,
                                                    adynqueryresultfield:[[name,shortdescr],,,,] , // a dyn matrix ok?
                    
                                                    ,,,,,}
                     session.Match_Param[scalarfield]=itemmatched   , also dyn ?

*/