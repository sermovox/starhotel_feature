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


const adapter = new WebAdapter({});


const controller = new Botkit({
    debug: true,
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage
});

if (process.env.uri) {
console.log('*** instantiating Botkit CMS');

    // TODO What if many cms (app) to run ? ( and deallocate when finish ?)
    controller.usePlugin(new BotkitCMSHelper({// todo:  add module (directives) download too 
        uri: process.env.uri,
        token: process.env.token,

        // can we have separate ds x appid dedicated at some userspace ? ? , and load a appid ds from a def ds user registartion ? 

    }));
}

/*
// xmpp : put in a module !
const  { XmppAdapter } =require('./nat/xmpp_adapter.js');
const  xmpp2adapter=require('./nat/xmpp2adapter.js');
let xmpp_adapter=new XmppAdapter({});
// as in botkit core
if (xmpp_adapter) {
    // MAGIC: Treat the adapter as a botkit plugin
    // which allows them to be carry their own platform-specific behaviors
    controller.usePlugin(this.adapter);
}
if (xmpp_adapter) {
   let logic=controller.handleTurn.bind(controller);
   /*).catch((err) => {// like in core
    // todo: expose this as a global error handler?
    console.error('Experienced an error inside the turn handler', err);
    throw err;
    });* /



   // let logic=this.handleTurn.bind(this);
    xmpp2adapter(null, xmpp_adapter,logic);//(webserver,ad,logic) 
}
*/






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

 
	var conn      = mongoose.createConnection(process.env.DB_URI);
	// now use conn to call std methods that was using a tandard connection :
	//   trip = mongoose.model('master',stdModel1);   >>>>   trip = conn.model('master',stdModel1);

	if(conn)db=conn;

}

// in future add fw as plugin !!!
let vctl=require('./nat/onChange.js');// vcontroller={init,onChange:fwAskOnChange,buildF,getappWrap,mustacheF,modsOnAsk,vfwF,injService}

controller.addPluginExtension('vCtl', vctl);// vcontroller will be available as controller.plugin.vCtl.xx
const http = require("http");// not controller.http
jrest_=require('./nat/rest.js');jrest_.init(http);jrest=jrest_.jrest;


// now db connection wont be used any more !
vctl.init(db,jrest,null,null);// service + controller ? . attention : fwbase is not alredy init : see  fwCtl=require('./nat/fwbase.js ....
let app=require('./nat/app.js');

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

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
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });

        //let color='colazione_dyn',myscript='room',myth='default';

        // ************************    myscript is cabled !!!!!

        

    }// end picms
    if (controller.plugins.vCtl) {// 
                // register cmdDirectives, will injeci a ref of some fw var in controller so that fw functions will be accessible from controller  instance (ex conversation!)


            // module containing the directive definition module.js can be got with cms download of all amd definition 
            //    TODO   problem How to add custom matcher function (matcher in specific conditions ): they must be eval in some context ........

                // in future do not use db and schema but the plugin dbs , ? where was used Schema ? 
                // probabilmente da un onchange che si collegava a un db senza un service rest > gli serve lo schema per mappare il colection in cursor !
 
                // should cfg only the def dialogset ?: 
                let service=require('./nat/fwbase.js')(controller,db,Schema,jrest,app);// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
                                                                 // will propagate vct.db and vctl.rest on service and fwhelpers
                // controller.usePlugin(fwCtl);
         
                // extend services :
                //let dbeng=require('./nat/dbservice')(Schema,mongoose,createMongooseSchema);
                let dbeng=require('./nat/dbservice')(Schema,mongoose,mongoosify);
                let gCal=require('./nat/gCal');// npm install googleapis@39 --save
                 // dbeng.mongoose=mongoose;dbeng.Schema=Schema;// TODO put in module as internal var ?
                service.addPluginExtension('dbs', dbeng);// connection db will be set by dbs endpoint 
                service.addPluginExtension('gCal', gCal);// 
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



*/



