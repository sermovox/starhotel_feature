//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the mybot_v1 bot.
var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
	
   }
console.log( 'botkit obj ',keys);
   return keys;
}
// Import Botkit's core features
const bkpack= require('botkit');
getKeys(bkpack);
const { Botkit ,BotkitConversation} = bkpack;// botkit in core.js
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for web.

const { WebAdapter } = require('botbuilder-adapter-web');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}
let ai ={};// ai agent 
if (process.env.WITAI) {// remote ai service auth token passe direcly on service because there in intmatch hepler func x intent matcher
                        // we call a rest http direcly 
                        // in future will better do a interface to call all ai intent service , usually as plugin, so pass these params there !!!!!!!!
    ai.witai={url:'https://api.wit.ai/message?',agents:witAiAg(process.env.WITAI)};// nb url can be ovewrite in .dir or excel 
}

// let ws=ws like core.

// group1 bot : this channel has a url/port xmpp_wss connection connecting a ctl1 working on  cms1  
const xmpp_cfg1={// the xmpp client channel x group 1
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
	  username: process.env.XMPP_username,//"marson",//"test",
	  password: process.env.XMPP_password//"marson01"//testmarson01"

/*
service: "wss://404.city:5222/xmpp-websocket/",
	 // service: "http://404.city:5222",
	  domain: "404.city",
	 // resource: "testresource",
	  username: "mmarson",
	  password: "zq7MG7xcGE8jPTP",
*/
};
const wsPort=process.env.port || process.env.PORT||'3000';// the webhook channel x group 1


const https = require("https");const http = require("http");// not controller.httpconst http = require("http");// not controller.http
// http used also by :  jrest_.init(http,https);jrest=jrest_.jrest;, so use both in web_adapter,rest and core ?
const setProvWeb=false;// set web outside botkit , some timing mismatch if true 
let httpserver,webserver;
if(setProvWeb){
let  servs=require('./nat/http/servers.js')(http,wsPort);// like core. // Create HTTP server http (http/restify package ) to listen a  http  port (set by .env), attach webserver to handle http data
httpserver=servs.httpserver;webserver=servs.webserver;// must add dependency into controller to be sure it was done before call .ready() .....
}else httpserver=webserver=null;
// need also su reset the server port listen ! webserver=null;// if dont want provide external webserver 
// webserver_gx     > insert /api/messages/groupx    ogni user ha un subdomain proxied to a port ( many webserver and controller-cms)  or 
// webhook_uri (only many controller-cms) 

const adapter = new WebAdapter({});// calling createSocketServer(http,optn, logic=controller.handleTurn.bind(botkit)); will build ws on http server , attach ws to controller 

const webhook_uri='/api/messages';

const controller = new Botkit({// controller will have 1 ds filled by cms instance . ds provide a dialogcontext to (spaw()) bot to operate on it :
                                //       dialogcontext= new DialogContext(this, context, state=dialogState.get(context, { dialogStack: [] }));
                                //      dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState=conversationState.createProperty('dialogStateProperty'));
                                //      dialogState is saved in controller (conversationState.saveChanges(bot.getConfig('context'))) and set in 
                                // can we have more ds , one for usergroup with its own cms instance/port ? 
                             //1 ctl foreach client group
    debug: true,
    port:wsPort,
    webhook_uri,
    webserver,// take webserver alredy config , if not provided the controller will create internally a http and webserver 
    adapter: adapter,// in configureWebhookEndpoint() will tie post webserver endpoint ( webhook_uri) handler  to adapter that will use bot to process req then use res to sent response
                    //      webserver.post(webhook_uri, (req, res) => {...        this.adapter.processActivity(req, res, logic=this.handleTurn.bind(this))   ; nb  this=controller
                    // then add as plugin  usePlugin(this.adapter), so when controller is ready in controiller.ready(handler) ????????really????  call adapter.init(controller) to add websocket using controller.http
                    //      adapter.createSocketServer(controller.http,optn, controller.handleTurn.bind(botkit)); but if controller.http is not set as webserver is provided , i have to call manually  see TYU
    storage
    // debug : ,adapterConfig:{path:'/x'}
});
let logic=controller.handleTurn.bind(controller);// bot entry point bind, so call logic is the same of controller.logic !. any connction method will call this entry point 

/* moved here from below , rigth?? no so come back !
let nlpai;
if (process.env.NLPAI) {// calls a builder to init local ai services (nlpai) to inject: some endpoint x each interface nlpjs,duck,qea . following the factory initiated with nlpjs,duck,qea config obj 
                        // ex  : qea engine is injected 
                        // usually all end point (also called adapter ) serves a same matcher type , so implements its interface mr={reason,rows}
    // nlpai=require('./nat/nlpai')(jrest,qea).init({nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse'},qea:{url:null}
    nlpai=require('./nat/nlpai')(jrest,qea).init({nlpjs:{url:process.env.NLPAI_DUCK},duck:{url:process.env.NLPAI_DUCK},qea:{url:null}
    
    
    ,bookApp:{url:null}// {url:null} is the init param x a set of some matcher type (query) endpoint build process defined in builder (builder=require('./nat/nlpai')(jrest,qea) )
                    // usually the set is a obj containing endpoint/adapters connecting a rest server of some related data to make available in fw as complex model 
                    // the endpoint returns mr obj containing the val data x the matcher mr={}reason,rows=val}
                    // so the endpoint is a 'adapter' use some rest interface to simulate a post controller returning a complex model  
                    // assuming registering this services as 'ai' plugin,  the adapter can be called in a condition macro using directive:  
                    //        "url":"service://plugins.ai.book.....anAvailableAdapter
                    // nb book is better port to app controller 
                    ,infoApp:{url:null}
}
    
    );// in matcher macro url= service://plugins.ai.duck.datetime?qs
    // NO  :    ai.nlpai={url:'service://data',agents:[{data:manager.process}]};// nb url can be ovewrite in .dir or excel 
    // because like witai the api is in a http end point or we must set a local interface , usually as plugin , so create a plugin 
}*/

let rootDef=require('./nat/cfgWebPost.js');// the endpoint definition 
let ngingurl=null;// ext post relay
// do below : rootDef(controller.webserver,controller,ngingurl,webhook_uri,nlpai);

if (process.env.uri) {
console.log('*** instantiating Botkit CMS');

    // TODO What if many cms (app) to run ? ( and deallocate when finish ?)
    controller.usePlugin(new BotkitCMSHelper({// todo:  add module (directives) download too , plugin name ='cms' !
                                            // .usePlugin(adapter={name:pname,,})plugin name pname: when ... call : adapter.init(controller) to add all dialog : controller.addDialog(d);
        uri: process.env.uri,// must be set/updated  by app when redirects. probably we open a admin cms (with map user_app/data_map + sub page/data_page datamap x each user_app) to set a current page data file + its wellcome prompt 
        token: process.env.token,

        // can we have separate ds x appid dedicated at some userspace ? ? , and load a appid ds from a def ds user registartion ? 

    }));
}

///*
// xmpp : put in a module !
const  { XmppAdapter } =require('./nat/xmpp_adapter.js');
 // const xmpp_on=true;
const xmpp_on=false;
const  xmpp2adapter=require('./nat/xmpp2adapter.js');
let xmpp_adapter
// activate xmpp:
xmpp_adapter=new XmppAdapter({});


if(xmpp_on)configureWebhookXmpp(controller.webserver,controller._config.webhook_uri+'_test');// webserver  x test 
function configureWebhookXmpp(webserver,uritest){// like core in configureWebhookEndpoint() will tie post webserver endpoint handler  to adapter that will use bot to process req then use res to sent response 
                                                //   webserver.post(webhook_uri, (req, res) => {...        this.adapter.processActivity(req, res, logic=this.handleTurn.bind(this))
                                                //  adapter.processActivity() will call logic=core.handleturn ,  then return response using res 
if (xmpp_adapter) {
    // as in botkit core
    // MAGIC: Treat the adapter as a botkit plugin
    // which allows them to be carry their own platform-specific behaviors
    controller.usePlugin(xmpp_adapter); // .usePlugin(adapter={name:pname,,})plugin name pname: when ...... call : adapter.init(controller) to set websocket ......

   //let logic=controller.handleTurn.bind(controller);// bot entry 
   /*).catch((err) => {// like in core
    // todo: expose this as a global error handler?
    console.error('Experienced an error inside the turn handler', err);
    throw err;
    });*/

   // let logic=this.handleTurn.bind(this);
   // al posto di registrare con webserver.post(url,function {
    //  ... 
    //   inner function che verra chiamata per gestire il request : 
    //  adapter.processActivity(req, res, logic=this.handleTurn.bind(this))// servono adapter e logic 

    // ...} ) 
    //  registro su xmpp2adapter  logic e adapter 
    xmpp2adapter(xmpp_cfg1,webserver, xmpp_adapter,logic,uritest);//(webserver,adapter,logic) // why adapter ? x test ONLY !! so What protocol uses xmpp ????????
}
}
//*/






////////////////////////////////////


///////////////////// put in mustacheFwFunc.js

/*
var funcAsString = testFunc.toString();
var json = { "one": 700, "colazione_dyn": funcAsString };
var parameters = JSON.parse( JSON.stringify(json));
// parameters > dynJs
        let dynJs={

            hotel:{// all var dyn added at container values.excel of the convo room

                excel:{news:'oggi grande festa dell\'amicizia alle 20 tutti in piscina!' 
                },
                dyn_rest:{// used in  associazione a    : {{values.colazione_dyn....}}

                    data:{

                    },
                    onchange_text:'function(result,bot,convo){  }',


                }

                }

            }



*/


/*
// eval( 'dynJs.room.colazione_dyn.onChange = async ' + dynJs.room.colazione_dyn.onChange_text );
dynJs.hotels.direc.colazione_dyn.onChange = testFunc;
dynJs.hotel3pini.direc.colazione_dyn.onChange = testFunc;
dynJs.hotel3pini_vox.direc.colazione_dyn.onChange = testFunc;
*/

let db,// the def  old  db connection used by some onchange ( available to service obj as std db connection )
jrest_,jrest;



const mongoose = require('mongoose');// npm i mongoose , better before mongoosify
var mongoosify = require("mongoosify");// alternative to convert-json-schema-to-mongoose, npm i mongoosify

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;// >>>>>> alredy did in std db module ???

//const createMongooseSchema = require('./node_modules/convert-json-schema-to-mongoose/lib/json-schema').default;// npm i convert-json-schema-to-mongoose
// import createMongooseSchema from 'convert-json-schema-to-mongoose';
// dont work so TODO :  npm uninstall --save 'convert-json-schema-to-mongoose'   , see https://stackoverflow.com/questions/13066532/how-to-uninstall-npm-modules-in-node-js
if (process.env.DB_URI) {

    let conn;
    // do connection after x specific db to connect 
    
    // that only if want a def connection x all bot :
    // var conn      = mongoose.createConnection(process.env.DB_URI);
	// now use conn to call std methods that was using a tandard connection :
	//   trip = mongoose.model('master',stdModel1);   >>>>   trip = conn.model('master',stdModel1);

	if(conn)db=conn;

}

// in future add fw as plugin !!!
let vctl=require('./nat/onChange.js');// vcontroller={init,onChange:fwAskOnChange,buildF,getappWrap,mustacheF,modsOnAsk,vfwF,injService}

controller.addPluginExtension('vCtl', vctl);// vcontroller will be available as controller.plugin.vCtl.xx
controller.logs=vctl.vFw.logs;// inject the vctl logger (mainly logs convo staff, logs gogs into a file set in voice controller (onChange.js)(production debug))

jrest_=require('./nat/rest.js');jrest_.init(http,https);jrest=jrest_.jrest;//  che fa ?
// question : why dont get jrest from inside modules that need to work with rest provided app helper (ex nlpai)  calling for a config singlethon directly in jrest_   ????
// instead of inject it when init their modules ??? try this way in simplybookingAiaxCtl , sub module of nlpai ..........

let qea;// the local qea engine
if(process.env.QeATrain)qea=require('./nat/qea.js') // a function (interface) = require('./natural/intClass').create(testwd)
(process.env.QeATrain);// the train classes

// /* moded above , rigth??
let nlpai;
if (process.env.NLPAI) {// calls a builder to init local ai services (nlpai) to inject: some endpoint x each interface nlpjs,duck,qea . following the factory initiated with nlpjs,duck,qea config obj 
                        // ex  : qea engine is injected 
                        // usually all end point (also called adapter ) serves a same matcher type , so implements its interface mr={reason,rows}
    // nlpai=require('./nat/nlpai')(jrest,qea).init({nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse'},qea:{url:null}

    nlpai=require('./nat/nlpai')(jrest,qea)
    .init({nlpjs:{url:process.env.NLPAI_DUCK},duck:{url:process.env.NLPAI_DUCK},qea:{url:null}
    
    
    ,bookApp:{url:null}// {url:null} is the init param x a set of some matcher type (query) endpoint build process defined in builder (builder=require('./nat/nlpai')(jrest,qea) )
                    // usually the set is a obj containing endpoint/adapters connecting a rest server of some related data to make available in fw as complex model 
                    // the endpoint returns mr obj containing the val data x the matcher mr={}reason,rows=val}
                    // so the endpoint is a 'adapter' use some rest interface to simulate a post controller returning a complex model  
                    // assuming registering this services as 'ai' plugin,  the adapter can be called in a condition macro using directive:  
                    //        "url":"service://plugins.ai.book.....anAvailableAdapter
                    // nb book is better port to app controller 
                    ,infoApp:{url:null}
}
    
    );// in matcher macro url= service://plugins.ai.duck.datetime?qs
    // NO  :    ai.nlpai={url:'service://data',agents:[{data:manager.process}]};// nb url can be ovewrite in .dir or excel 
    // because like witai the api is in a http end point or we must set a local interface , usually as plugin , so create a plugin 
}
rootDef(controller.webserver,controller,ngingurl,webhook_uri,nlpai);// moved here (now nlpai is defined !!)
//*/

// now db connection wont be used any more !
vctl.init(db,jrest,null,null,process.env);// service + controller ? . attention : fwbase is not alredy init : see  fwCtl=require('./nat/fwbase.js ....
let app=require('./nat/app.js');// must set the cms endpoint port that gives the cms set of app, and the wellcome msg prompt 

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {// Plugin staff: all dependencies usually registered by plugins in init()(called by .... when ....), have been marked complete.

    // TYU
    if(webserver)adapter.createSocketServer(httpserver, {},logic); // create a wss on port managed by http listener httpserver (works in || with attached http webserver (expone post on http uri on listener port ))
                                                                    // probably to think : wws is like a double way http  on a special uri on listened port 
                                                                    //async(context) => {// handle turn here   controller.handleTurn.bind(botkit))        });

    // load traditional developer-created local custom feature modules
   // after cms ?       controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {// picms


        // now set the client dilalog to start : giving responsability to testtrigger to GET the right root cmd. 
        // when  root trigered cmd is completing, in onAfter ( or last ask onchange) user cb , will call  the app level of the cmd app 
        //      application  application/ fsmfactory in onchange.js ,
        //  that , 
        //          (
        //              like a routing level of a spa , 

        //              that redirect internally defining the new incontext + prompt for it before exiting 
        //              or
        //               post to main app that as usual 
        //                  redirect with a new (spa) page + qs to download to client 
        //                  or 
        //                  /aiax) just give response  so the spa itself will route to next page 

       //               BUT, as cant work with cmstriggering sys ,  does this way : 
        //          )
        // 1. if dont need to reset the triggering preference can do what a web server post do 
        //          ( use model got in convo.vars.matches, calc next static current value or dyn in vars.matches[dynmodel] likr dyn smp in mybot ))
        //          set the prompt to address the user to next, cms triggerable,  cmd 
        // 2. if need to ghange the preferred trigeramle by cms : 
        //   will post to a app level in bot.js that , passing session, will 
        //      - use the post data , 
        //      - instead of set a new get redirect page with qs,  give directive to update the triggering system in :
        //          testTrigger that when come a tc, containing the user session ,  will trigger according with session.incontext.preference 
        //      - give a update for next page prompt (if needed)


        // will  come back with a post to main app that :
        //  - will not redirect with a new page + qs to receive a new page with a title prompt but :
        //  - will get the
        // will send lastreview testtrigger 


        // ***** >>>>  come fa il ctl a associare un bot corretto in funzione del event message ???? ( associato al uri associato al nginx subdomain ) ?????????????????????
        controller.on('message,direct_message', async (bot, message) => {// no need x centralino trigger ? with middleware extraction ?
            /* **** after checked x waiting continueDialog,  process registered 'hears' cmd/dialog like in core.ingest(), but using a remote triggering cms: 
                  - run handler for the message event message.type . hears handler are run using listenForTriggers(), a special event handler that choose the handler that is triggered
                      addendum :
                      - we can add a interrupt  triggering adding a controller.plugins.cms.testTrigger(bot, message); using a instance pointing to different url . command must have 1 step , 
                            >> better have just 1 turn cmd
                      - we can have different event mng using different instances registering to different event : controller.on('sys', async (bot, message) => results = await controller.plugins.cms2.testTrigger(bot, message);
                            or add some manual 
                                 controller.interrupts('sys', async(bot, message) => {
                                            if(text==) await bot.reply(message,'sys:dosomething')
                                                >>>>  but after we replayed to the interrupts we can continue or not the waiting dialog. so what to do if we want end it ?
                                                    we have to call bot.cancelAllDialogs()  , how ??

                                                how to ends the still active waiting main convo !
                                            });


                      - we can have outcontext adding a where condition on trigger checks example :
                        results = await controller.plugins.cms.testTrigger(bot, message,[context1,context2]);
                                    context1 means that only cmd registered for this context can be triggered 
                                    these cmd will find a father context (wheres) already filled to perform the action requested by the user , to be matched/triggered by the cmd 
                                            implementation : the triggering regex must also match a condition based on outcontext values
                                                so like a ask with many condition section satisfied only by some previous wheres/outcontext ( like relay after a match find the next route checking some context?)

            */

            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
        controller.interrupts('esci|\b%%exit-hangup','message', async(bot, message) => {// must be sent by sys every time it interrupt the dialog
            // when the bot ends the dialog send %%exit-.... the sys answer but the convo alredy died so this interrupt will cancel nothing   
           /// verificare che non serve rispondere  await bot.reply(message,'%%exit-ok; ok chiudiamo la conversazione arrivederci ');
            await bot.cancelAllDialogs() ;
           
           });

           // now here manage the dialog that dont go to current dialog stack . usually all pbx command that are to respond indipendently by the current dialog
           // otherwise the pbx command will be managed inside the current dialog stack
           /* question :
            in interrupts we can start dialog as done in hears : controller.hears(['hello'], 'message', async(bot, message) => {
                                                                                             bot.beginDialog('onboarding');});

                    this way :
                                                                controller.interrupts('help', 'message', async(bot, message) => {
                                                                    // start a help dialog, then eventually resume any ongoing dialog  
                                                                            >>>>>>  ?? so after help dialog finish we pass the turn to a waiting hears dialog ?? and the reply in HELP_DIALOG ???
                                                                                    see core.js , seems only if interrupts returns true :
                                                                                                if (interrupt_results === false) {
                                                                    await bot.beginDialog(HELP_DIALOG);
                                                                    });

                qustion : seemd interrupts dialog cant store its stack to continue dialog as hears dialog do . right ?
            */
           controller.interrupts('\b%%exit-ok','message', async(bot, message) => {// the pbx puo' rispondere al bot confermando che chiuderà  , ma il bot oramai ha chius tutto cosi non si tiene conto del input 
            // when the bot ends the dialog send %%exit-.... the voip sys answer %%exit-ok but the convo alredy died so this interrupt will cancel nothing   
           /// verificare che non serve rispondere  await bot.reply(message,'%%exit-ok; ok chiudiamo la conversazione arrivederci ');// ma invece sembra che faccia un eco !?
           //               tuttavia cosa succede se ho un webhook ?? cosa si risponde ?? un msg dummy? e' necessario esplicitare un bot.reply() ? 
           /// verificare che non serve  await bot.cancelAllDialogs() :
            // await bot.cancelAllDialogs() ;

            //  >> forse e' meglio che il sys non risponda al bot %%exit-ok, solo esegua l'abbattimento della call !
           });

        //let color='colazione_dyn',myscript='room',myth='default';

        // ************************    myscript is cabled !!!!!

        

    }// end picms
    // load traditional developer-created local custom feature modules
   controller.loadModules(__dirname + '/features');// on modules registered after on cms 

    if (controller.plugins.vCtl) {// 
                // register cmdDirectives, will injeci a ref of some fw var in controller so that fw functions will be accessible from controller  instance (ex conversation!)


            // module containing the directive definition module.js can be got with cms download of all amd definition 
            //    TODO   problem How to add custom matcher function (matcher in specific conditions ): they must be eval in some context ........

                // in future do not use db and schema but the plugin dbs , ? where was used Schema ? 
                // probabilmente da un onchange che si collegava a un db senza un service rest > gli serve lo schema per mappare il colection in cursor !
 
                // should cfg only the def dialogset ?: 
                let service=require('./nat/fwbase.js')(controller,db,Schema,ai,jrest,app);// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
                                                                 // will propagate vct.db and vctl.rest on service=require('./service') and fwhelpers==require('./fwHelpers')
                                                                // ai ( witai rest conn  info) will be passed to fwhelpers to be used on 
                                                                 
                // controller.usePlugin(fwCtl);
         
                // extend services :
                //let dbeng=require('./nat/dbservice')(Schema,mongoose,createMongooseSchema);
                let dbeng=require('./nat/dbservice')(Schema,mongoose,mongoosify);
                let gCal=require('./nat/gCal');// npm install googleapis@39 --save
                 // dbeng.mongoose=mongoose;dbeng.Schema=Schema;// TODO put in module as internal var ?
                service.addPluginExtension('dbs', dbeng);// connection db will be set by dbs endpoint 
                service.addPluginExtension('gCal', gCal);// 
                if(nlpai)  service.addPluginExtension('ai', nlpai);// ai interface x intent matchers. implements some ai  end point 
    }
});

/*
todo 

>put directives restructuring :

let static directive in models 
- copy in vars.excel + direc  to have them available in convo ,template and onchange ( writed on onchange or downloaded with cms)
- copy also in state.dir adding the dynamic var to control TI matching algo 
- set session in state (not convo state but user state  to be available in different convo) to manage bl with appwrap ctl engine
- put non fw matcher and func in user custom function set in fwCb (general custom fw function ) + service.js (specific bl functions and matchers). they will be referecied by models directives 
- define a std matcher interface 
- do fts https://docs.mongodb.com/manual/reference/operator/query/text/#match-operation-stemmed-words

previous.collect.key > mkey


> leave level asks in macro loaded in .dir   .dir.askes[x].cond.... > .dir.cond.....

> in convo every function will test vars.asksmatches to apply fw code ( so must run aso in ask that is not registered in basefw)


>  start_dynField,  query exec launched on dyn field   undefined
dbservice.js:1705
(node:19837) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
warning.js:18
MongoDB db  emilia  connection error:
events.js:116
MongoNetworkError: failed to connect to server [192.168.1.15:27017] on first connect [MongoNetworkTimeoutError: connection timed out]

> parse tempate to find js  &&  >>   &&& so i can write if(a&&b)  

> catch per sintax on condition $$$$

> askmatches and matches are set anyway so do not need tochech foe existence in convo !!!! vars.matches=var.matches||{}

> for performance in convo  previous.collect.key > prevName

*/


function witAiAg (string) {// extract  a:b c:d   >    {a:b,c:d}   a is agent uri , b is token
    if (!string) {
        string = '';
    }
    var creds = string.split(/\s+/);
    var users = {};
    creds.forEach(function(u) {
        var bits = u.split(/\:/);
        users[bits[0]+''] = bits[1];
    });
   // let rr='20201025',a=users[rr];
    return users;
}