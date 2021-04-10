/* general arch 
this is the express post web fullfillment , so will act as proxy that can call 
- a rest on url that will be escaled by engix

this ends point can also call directly the bot ( as a fw web adapter module) . better call using the proxy anyway so we can escale
2 cases :
1- 

*/
// fw config
const textFwCmd=true;// user text='... %%acmd-par; ....'

const fs = require('fs');

let logf='voximplant.log';


function logs(text){
    if(!text)return;
    let x='\n\n'+new Date().toUTCString()+'\n'+text,
    fn=logf;
    fs.appendFile(fn, x, function (err) {
        if (err) return console.log(err);
      //console.log('Appended!');
     });

}







module.exports=//
function(wserv,ctl,ngingurl,webhook_uri){// ctl: if we want to connect directly the bot with its handler.ngingurl if we use proxy to xging port
  //const webhook_uri='/api/messages';
if(wserv){

  wserv.post(webhook_uri+'/vilogs', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('vilogs got a request  :',req.body);
    logs(JSON.stringify(req.body, null, 4));
  });


wserv.get('/someuri', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    res.send('someuri wellcome');
});
const df=1;// 2 way
if(df==0){wserv.post(webhook_uri+'/df', (req, res,next) => {
    //.... change body json obj
    /*
                const message = req.body;// json parser webserver.use(bodyParser.json() ?
            const activity = {
                timestamp: new Date(),
                channelId: 'actions',//same process actions and xmpp
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
                type: message.type === 'message' ? botbuilder_1.ActivityTypes.Message : botbuilder_1.ActivityTypes.Event
            };
    */

   const res_json=res.json,res_end=res.end;
   function res_json_(jt){
       let resp1=resp(jt);
       res_json(resp1);
   };
   function res_end_(x){
       console.log('ppp',x)
    res_end(x);
    }
    res.json=res_json_;res.end=res_end_;
    //res.json({test:'ciao'});
   //next();
   next('route');
    });

    const middlewareIndex7 = wserv._router.stack[7];
    wserv._router.stack[7]=wserv._router.stack[11];
    wserv._router.stack[11]=middlewareIndex7;

}/*

this.webserver.post(this._config.webhook_uri+'/*', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('wekhook got a request  :',req.body);
    this.adapter.processActivity(req, res, this.handleTurn.bind(this)).catch((err) => {// a promise.catch()
        // nb il adapter middleware ritorna ( e manda la risposta del bot ) quando handleTurn si risolve 
        // todo: expose this as a global error handler?
        console.error('Experienced an error inside the turn handler', err);
        throw err;
    });
});*/
else {// df1
    wserv.post(webhook_uri+'/df1', (req, res) => {// df fullfillment endpoint: http://host/
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('cfgWebPost receved .../df1 req.body : ', req.body);
/*
main logic :
can receive a session sessions/b6652524-cc53-6487-57a6-300bb045f495 as a convoId trasparently if context is 
*/





  /*
console.log('cfgWebPost receved .../df1 req.body : ', req.body);
....

queryResult:Object {queryText: "vaccino milano domenica", parameters: Object, allRequiredParamsPresent: true, …}
allRequiredParamsPresent:true
fulfillmentMessages:Array(1) [Object]
fulfillmentText:"ecco le migliori  disponibilità per citta e data richieste : trieste domani alle 17 presso ospedale civile via roma 42 , se sei interessato rispondi accetto e dai nome cognome"
intent:Object {name: "projects/need2buy-rpoggf/agent/intents/1647a499-2a…", displayName: "bookparam"}
intentDetectionConfidence:0.63621825
languageCode:"it"
outputContexts:Array(4) [Object, Object, Object, …]
length:4
__proto__:Array(0) [, …]
0:Object {name: "projects/need2buy-rpoggf/agent/sessions/3aa9a743-2…", lifespanCount: 0, parameters: Object}
lifespanCount:0
name:"projects/need2buy-rpoggf/agent/sessions/3aa9a743-2edb-c206-6fdd-2736beab62a7/contexts/usranswer"
parameters:Object {date-time: "2021-04-04T12:00:00+02:00", date-time.original: "domenica", location: Object, …}
date-time:"2021-04-04T12:00:00+02:00"
date-time.original:"domenica"
location:Object {country: "", city: "Milano", admin-area: "", …}
admin-area:""
business-name:""
city:"Milano"
country:""
island:""
shortcut:""
street-address:""
subadmin-area:""
zip-code:""
__proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
location.original:"milano"
__proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
__proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
1:Object {name: "projects/need2buy-rpoggf/agent/sessions/3aa9a743-2…", lifespanCount: 1, parameters: Object}
2:Object {name: "projects/need2buy-rpoggf/agent/sessions/3aa9a743-2…", lifespanCount: 0, parameters: Object}
3:Object {name: "projects/need2buy-rpoggf/agent/sessions/3aa9a743-2…", parameters: Object, lifespanCount: 0}
parameters:Object {date-time: "2021-04-04T12:00:00+02:00", location: Object}
date-time:"2021-04-04T12:00:00+02:00"
location:Object {country: "", city: "Milano", admin-area: "", …}
admin-area:""
business-name:""
city:"Milano"
country:""
island:""
shortcut:""
street-address:""
subadmin-area:""
zip-code:""
__proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
__proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
queryText:"vaccino milano domenica"
__proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
responseId:"a676e306-d5ff-428b-ab0f-9bf410b70f86-4b8539db"
session:"projects/need2buy-rpoggf/agent/sessions/3aa9a743-2edb-c206-6fdd-2736beab62a7"





*/

      let ictx=0;
   let ctx=[],ctxName=[],turnsC;// turnsC in case we have to add
   let usranswerPar={};// ex: param={transferred:'acquisti'} %%transferred-acquisti; use condition: $$%mod_sys:{£&}§1^%%(\w+(?=-))\W(\w+)§tr£^transferred&wait£^transfertwait&miss£^miss
      let contexts,intent,session;
      if(req.body.queryResult&&req.body.queryResult.intent)intent=req.body.queryResult.intent.displayName;
   if(intent&&(contexts=req.body.queryResult.outputContexts)){// is a df call
    // for(let i=0;i<contexts.length;i++){el=contexts[i];
                   if(contexts[0]){ictx=contexts[0].name.indexOf("/contexts/")+10;
                    session=req.body.session.substring(req.body.session.indexOf("/sessions/")+10);}

if(intent=='turnscontinue'||intent=='bookparam'||'book'||intent=='Default Welcome Intent'){// AA intents.  manage  fulfillmants for covid dialogue,


  if(intent=='bookparam'&&ictx&&session){// from context get the context in ctx and local param (usranswerPar.datetime andvusranswerPar.location) to init a bot dialogue
    let isTurns=false;// has turns context ?
    const  turns='turns'
      contexts.forEach(el=> {
       let mnam=el.name.substring(ictx);// context name
       if(mnam=='usranswer'){
        // array.forEach(element => {  });
        let dp=el.parameters['date-time'];
        if ( typeof dp === 'string') {
          usranswerPar.datetime=dp;
      }else if(dp&&dp.date_time)
        usranswerPar.datetime=dp.date_time;
        usranswerPar.location=el.parameters.location.city;
        el.lifespanCount=0;
       
        let nam=el.name.substring(0,ictx)+turns;
        turnsC=new Ctx(nam);// generated copyng 
        //ctxName.push(turns);
        // ctx.push(turnsC);
       }else  if(mnam==turns){
         isTurns=true;
        el.lifespanCount=1;// keep present but set 1
       }else {
        if(mnam.substring(0,2)!='__')el.lifespanCount=0;// dont change sys param
       }

      ctxName.push(mnam);
      ctx.push(el);
      
     });
     if(!isTurns&&turnsC){
       turnsC.parameters.acc="accetto";
      ctxName.push(turns);
      ctx.push(turnsC);
     }
      }else{
        // manage other intents if needed 
      }


   console.log('webhook got a request with intent: ',intent,', contexts: ',ctxName);
   //console.log('webhook debug request body: ',req.body);
    

    req.body=requDF1(req.body,usranswerPar,session,intent);// reset req body with bot request x the intents AA

  

    console.log('wekhook send to bot :',req.body);

    if(intent=='Default Welcome Intent'){
      console.log(' bot webhook : reset stack :res.end called immediately');
      res.end();// returns null immediately
    }

    const res_json=res.json,res_end=res.end;// store original express res cb 

     res.json=res_json_;res.end=res_end_;
// 2 cases : 

    ctl.adapter.processActivity(req, res, ctl.handleTurn.bind(ctl)).catch((err) => {// a promise.catch()
        // nb il adapter middleware ritorna ( e manda la risposta del bot ) quando handleTurn si risolve 
        // todo: expose this as a global error handler?
        console.error('Experienced an error inside the turn handler', err);
        throw err;
    });

    


        // local functions:
        function res_json_(jt){
          //res_json(resp1);
          if(intent=='Default Welcome Intent'){
            // discard echo
            console.log(' bot webhook : reset stack echo discarded: ',jt)
          }
          else{// insert ctx only in bookparam intent response
            let ctx_; 
            if(intent=='bookparam'){ctx_=ctx;}
            //else{}
            let resp1=respDF(jt,ctx_);
          console.log(' bot webhook : bot called res.json (',jt,') so call res.json( ',resp1,')')
          res.json=res_json;
          res.json(resp1);
          }
      }
      function res_end_(x){
        if(intent=='Default Welcome Intent'){
          // discard echo
        }
        else{
        //console.log(' bot webhook : res.end called ',res.text)
        console.log(' bot webhook : res.end called ',x);
    
       // res_end(x);
       res.end=res_end;
       res.end(x);
        }
       }

  }

  // else if(intent=''){res.end();}// manage some other intent 
  
  else {res.end();// no DF managed intent:  exit returning nothing
  }







} else {res.end();// no df call
}
    }

);
wserv.post(webhook_uri+'/message1', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('wekhook got a request  :',req.body);

    const res_json=res.json,res_end=res.end;
    function res_json_(jt){
        let resp1=jt;
       // res_json.call(res,resp1);// dangerous because now res.json is this cb 
       console.log(' bot webhook : res.json called ',jt)
       res.json=res_json;
       res.json(jt);
    };
    function res_end_(x){
        console.log(' bot webhook : res.end called ',x)
    //  res_end.call(res,x);
    res.end=res_end;
    res.end(x);
     }
     res.json=res_json_;res.end=res_end_;



    ctl.adapter.processActivity(req, res, ctl.handleTurn.bind(ctl))// call processActivity that will cb calling res.json (> res_json() ) or res.ens (> res_end() )
    .catch((err) => {// a promise.catch()
        // nb il adapter middleware ritorna ( e manda la risposta del bot ) quando handleTurn si risolve 
        // todo: expose this as a global error handler?
        console.error('Experienced an error inside the turn handler', err);
        throw err;
    });
});
wserv.post(webhook_uri+'/testend', (req, res) => {
  // Allow the Botbuilder middleware to fire.
  // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
  // which we can then use to turn into a BotkitMessage
  console.log('testend a request  :',req.body);

  const res_json=res.json,res_end=res.end;
  res.end();
});

}// end  df1

function respDF(x,ctx){
  console.log('bot answered:',x)
  let text;
  text=x[0].text;
  if(text)text=text.replace(/(<.*?>)|(\/n)/g,'');//Regex.Replace(mesage.text,"<.*?>",string.Empty);
  // no: text=text.replace(/(<.*?>)|(\//n)/g,'');
   //text=text.trim().replace(/<.*?>/g,'');// just remove /n and <some>
  let res=response_df1(text,ctx);
  console.log('df fullfil answered:',res)
  return res;
}

function resp(x,ctx0,ctx1){
    console.log('bot answered:',x)
    let text;
    text=x[0].text;
    let res=response(text,ctx0,ctx1);
    console.log('df fullfil answered:',x)
    return res;
 }
 function requ(x){// df req template
    console.log('ddd',x)
    let text;
    text=x.queryResult.queryText;
    let res= {user: "xyz1", text, type: "message"};
    return res;
 }
 function requDF1(x,param,convoId='xyz1',intent){
   // df req template x bot to manage  (intent=='turnscontinue'||intent=='bookparam') :
   // - if we got the bookparam intent : start a dialog simplybook going itho right ask at once 
   // - if got intent turnscontinue just pass the text transarently

   // returning from bot :
   //  - pass bot response text + add params (use qs format ?) to pass some context param (xml to operators) to continue dialog 
   //  - set the context turns so df can match next intent:
   //       the df can trigger the fallback intent turnscontinue or 
   //       trigger turnsoff if we want df to 
   //           exit from the turns context (confirm or esci)  (build the answer to confirm )
  //            confirm or   (build the answer to confirm )
   //  nb split turns into more context to better expone the right intent
  console.log('requDF1 , intent: ',intent,' run with: ',x,param,convoId);
  let text,keys=Object.keys(param),res=null;
  text=x.queryResult.queryText;
  // keys.forEach(item => {text+=' %%'+item+'-'+param[item]+';' });// future use 
  //let intent;  intent=x.queryResult.intent.displayName;
  if(intent=='Default Welcome Intent'){
    text='';
    if(textFwCmd)text+='%%resetDial-xx; fammi echo';

  }
  else if(intent=='bookparam'){
    // probably chech the session is in esci state, then restart session matching rigth convo ask giving all info in text to get the ask in one turn only using collected param
    text='';
   // if(textFwCmd)text+='%%resetDial-xx; ';// reset stack if we use a previous same session , start clean  // TODO move to welcome intent !!!!!!!!!!!!!!!!!!!
    text+='centro servizi prenota servizio controllo ';  
  keys.forEach(item => {// first call to bot 
    if(item=='datetime'&&param[item]){let mya=param[item];
                   // text+=' '+ mya.substring(0,19);
                   text+=' '+ mya.substring(0,10)+' alle '+mya.substring(11,13);// error???
   } else if(item=='location'&&param[item])text+=' '+ param[item];

              });  

}else if(intent=='turnscontinue');// do nothing pass text
else return;// exit
 
  res= {user: convoId, text, type: "message"};
  return res;
}
    
/* df template :
   let request=
{
  "responseId": "response-id",
  "session": "projects/project-id/agent/sessions/session-id",
  "queryResult": {
    "queryText": "End-user expression",
    "parameters": {
      "param-name": "param-value"
    },
    "allRequiredParamsPresent": true,
    "fulfillmentText": "Response configured for matched intent",
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            "Response configured for matched intent"
          ]
        }
      }
    ],
    "outputContexts": [
      {
        "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
        "lifespanCount": 5,
        "parameters": {
          "param-name": "param-value"
        }
      }
    ],
    "intent": {
      "name": "projects/project-id/agent/intents/intent-id",
      "displayName": "matched-intent-name"
    },
    "intentDetectionConfidence": 1,
    "diagnosticInfo": {},
    "languageCode": "en"
  },
  "originalDetectIntentRequest": {}
}

'
{  "responseId": "response-id",  "session": "projects/project-id/agent/sessions/session-id",  "queryResult": {    "queryText": "End-user expression",    "parameters": {      "param-name": "param-value"    },    "allRequiredParamsPresent": true,    "fulfillmentText": "Response configured for matched intent",   
   "fulfillmentMessages": [      
                            {        "text": {          "text": [            "Response configured for matched intent"          ]       
                                             }      
                            }    
                          ], 
    "outputContexts":     [      
                            {        "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",        "lifespanCount": 5,        "parameters": {          "param-name": "param-value"        }      }    ],    "intent": {      "name": "projects/project-id/agent/intents/intent-id",      "displayName": "matched-intent-name"    },    "intentDetectionConfidence": 1,    "diagnosticInfo": {},    "languageCode": "en"  },  "originalDetectIntentRequest": {}}
'
*/

function jresponse(text){return '{"fulfillmentMessages": [{"text": {"text":['+text+'] }}]}'}
function response_test(mytext,ctx0,ctx1){
   return {fulfillmentMessages: [
      {
        text: {
          text: [
            mytext
          ]
        }
      }
    ]

    ,
   // "outputContexts": [{"name":"expecting_yearofbirth", "lifespan":1, "parameters":{}},{"name":"expecting_firstname","lifespan":0,"parameters":{}}]

  //  outputContexts: [{name:"turns", lifespan:1, parameters:{}},{name:"usranswer",lifespan:0,parameters:{}}]

  outputContexts: [{name:"projects/need2buy-rpoggf/agent/sessions/b6652524-cc53-6487-57a6-300bb045f495/contexts/turns", lifespan:1, parameters:{}},{name:ctx1,lifespan:0,parameters:{}},{name:ctx0,lifespan:0,parameters:{}}]


  }
}
function response_df1(mytext,ctx){
  if(ctx)
  return {fulfillmentMessages: [
     {
       text: {
         text: [
           mytext
         ]
       }
     }
   ]

   ,
  outputContexts: ctx

 //  outputContexts: [{name:"turns", lifespan:1, parameters:{}},{name:"usranswer",lifespan:0,parameters:{}}]

 //outputContexts: [{name:"projects/need2buy-rpoggf/agent/sessions/b6652524-cc53-6487-57a6-300bb045f495/contexts/turns", lifespan:1, parameters:{}},{name:ctx1,lifespan:0,parameters:{}},{name:ctx0,lifespan:0,parameters:{}}]


 };
 else return {fulfillmentMessages: [
  {
    text: {
      text: [
        mytext
      ]
    }
  }
]};
}

function response(mytext){
  return {fulfillmentMessages: [
     {
       text: {
         text: [
           mytext
         ]
       }
     }
   ]

  // ,
  // "outputContexts": [{"name":"expecting_yearofbirth", "lifespan":1, "parameters":{}},{"name":"expecting_firstname","lifespan":0,"parameters":{}}]

 //  outputContexts: [{name:"turns", lifespan:1, parameters:{}},{name:"usranswer",lifespan:0,parameters:{}}]

// outputContexts: [{name:"projects/need2buy-rpoggf/agent/sessions/b6652524-cc53-6487-57a6-300bb045f495/contexts/turns", lifespan:1, parameters:{}},{name:ctx1,lifespan:0,parameters:{}},{name:ctx0,lifespan:0,parameters:{}}]


 }
}
function Ctx(nam,ls=1,param={}){

this.name=nam;
this.lifespan=ls; this.parameters={};

}
}
}
   
