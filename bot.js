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
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.uri,
        token: process.env.token,
    }));
}

///*
// xmpp : put in a module !
const  { XmppAdapter } =require('./nat/xmpp_adapter.js');
const  xmpp2adapter=require('./nat/xmpp2adapter.js');
let xmpp_adapter
// activate xmpp:
//xmpp_adapter=new XmppAdapter({});


configureWebhookXmpp(controller.webserver,controller._config.webhook_uri+'_test');// webserver  x test 
function configureWebhookXmpp(webserver,uritest){
if (xmpp_adapter) {
    // as in botkit core
    // MAGIC: Treat the adapter as a botkit plugin
    // which allows them to be carry their own platform-specific behaviors
    controller.usePlugin(xmpp_adapter);// chi usa il controller potra recuperare il xmpp_adapter : cio avviene quando .....

   let logic=controller.handleTurn.bind(controller);// bot entry 
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
    xmpp2adapter(webserver, xmpp_adapter,logic,uritest);//(webserver,adapter,logic) // why adapter ? x test !!
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

let db,rest;

// in future add fw as plugin !!!
let vctl=require('./nat/onChange.js')
controller.addPluginExtension('vCtl', vctl);// will be available as controller.plugin.vCtl.xx
vctl.init(db,rest,null,null);// service + controller ?

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {// picms

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
                let fwCtl=require('./nat/fwbase.js')(controller);// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
                // controller.usePlugin(fwCtl);
         
    }
});





