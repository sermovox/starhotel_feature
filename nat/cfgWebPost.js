/* general arch 
this is the express post web fullfillment , so will act as proxy that can call 
- a rest on url that will be escaled by engix

this ends point can also call directly the bot ( as a fw web adapter module) . better call using the proxy anyway so we can escale
2 cases :
1- 

*/

let querystring=require('querystring');
// fw config
const textFwCmd=true;// user text='... %%acmd-par; ....'
                                                       // that is used in simplybookingaiaxctl to connect to a registered simplebook endpoint
 const preStartCSonWELCOME=true;// manage bot welcome  prestart in case of start_ctx=='cs'. to extend also to other cases ( sermovox,....)

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
parseAdminUsers = function(string) {
  if (!string) {
      string = '';
  }

  var creds = string.split(/\s+/);
  var users = {};
  creds.forEach(function(u) {
      var bits = u.split(/\:/);
      users[bits[0]] = bits[1];
  });

  return users;

}


let book_ep=parseAdminUsers(process.env.book_endpoint);




module.exports=//
function(wserv,ctl,ngingurl,webhook_uri,nlpai){// ctl: if we want to connect directly the bot with its handler.ngingurl if we use proxy to xging port
  //const webhook_uri='/api/messages';
  let df_ctl;// set after , call simplybook without fw ctl. use df_ctl()  returns {,rows}


if(wserv){

  // webhook_uri='api/messages'

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

//https://stackoverflow.com/questions/52054436/how-to-pass-multiple-get-parameters-to-express
// https://softwareengineering.stackexchange.com/questions/300995/are-colons-ok-in-a-rest-api
 // wserv.get(webhook_uri + '/phone/projects/:project_id/sessions/:session_id::detectIntent', async (req, res) => {// dev.bot.sermovox.com/phone/projects/:project_id/sessions/:session_id::detectIntent ???
 wserv.post(webhook_uri + '/phone/projects/:project_id/sessions/:session_id::action', async (req, res) => {// dev.bot.sermovox.com/phone/projects/:project_id/sessions/:session_id::detectIntent ???
  // project_id should be alredy used by nginx to get this ip:port, in future here can be 1 endpoint more bot controllers
  // action : constant, future use 

    const urlparams=req.params;
    let myjson=JSON.stringify(req.body);
    console.log('cfgWebPost phone receved .../phone req.body : ',myjson,' with params: ',urlparams);
    let event,contexts,text='',customParams;
    if (req.body.queryInput && req.body.queryInput.text) text=req.body.queryInput.text.text;// usually null if !event
    if (req.body.queryInput && req.body.queryInput.event) event=req.body.queryInput.event;// {name,parameters={}}
  
    if (req.body.contexts) contexts=req.body.contexts;//['a','c']
    // if (req.body.customParams) customParams=req.body.customParams;// a map, future use 


    const res_json = res.json, res_end = res.end;// store original express res cb 

    res.json = res_json_; res.end = res_end_;// set response cb to get and control  bot answer with res_json and res.end = res_end_

  const embedEvent=true;// embed in %%event-valueofthesigleparameter;  if false in condition will use $$$$ and check for channelData.event 

    // manages event/text x processing 
    if(event){
      switch (event.name){
        case 'WELCOME':
        text+='portineria';// will trigger the bot 
        event=null;
        break;
        case 'CLOSE':
          break;
          case 'ROUTEOK':
            break;
          case 'ROUTEKO':
            break;
          case 'TRANSFEROK':
            break;
          case 'TRANSFERKO':
            break;
        //default:          res.end();
        let npar=0,theparam;

        if(event&&embedEvent){
          if(event.parameters)for(ev in event.parameters){npar++;theparam=event.parameters.ev;}
          if(npar==1)
          text+=' %%'+event.name+'-'+theparam;// embed the pbx cmd in text : %%eventname-val1;
          
        }
      }
      }else{// have text 


      }



    







    console.log('webhook cfgWebPost got a request with event: ', event,' text: ',text, ', so managed contexts: ', contexts);
    // res.end();    return;// debug
    //console.log('webhook debug request body: ',req.body);
    // req.body : see df_trace_request_json.txt
    // >>>> HAVING PREPARED THE context to use (ctx and ctx_out) now SET REQ  to start/continue bot turns(processActivity), then according with bot response returns fulfillment with the right ctx 
    req.body = requDF1();//text,event,contexts,customParams);// reset req body with bot request x the intents AA
    // >>> now SEND REQ To Bot AND RETURN FULFILLMENT (usualy send to bot then send fulfillment but not in welcome intent can be done)
    console.log('wekhook send to bot :', req.body.text);
    // >>> now here manage the prestart of bot for Welcome intent (respond fulfillmet without wait for bot returns for timeout problems) 

    if(!req.body){res.end();return;}// returns anyway if dont have to call bot or ctl .  any res.json must be called before









        ctl.adapter.processActivity(req, res, ctl.handleTurn.bind(ctl)).catch((err) => {// a promise.catch()
        // bot will call res(jt), 
        /* jt=
        [{"type":"message","text":"ciao sono l'assistente del favoloso hotel cinque stelle <br> oggi grande festa della amicizia alle 20 tutti in piscina! <br> Puoi fare domande su dove come quando  u
        sufruire dei nostri molti servizi interni ed esterni.\n <br> ad esempio puoi domandare dove e quando fare  colazione , andare al ristorante,  come contattare la portineria  o usufruire della l
        avanderia , puoi anche chiedere l'elenco dei servizi e chiedere poi cosa desideri sapere o prenotare","urgenza_f":"testato","thread":"default","key":"urgenza","outCtx":["mod_Serv/th_serv_relay
        "],"matches":[],"askmatches":[]}]
          */
        console.error('Experienced an error inside the turn handler', err);
        throw err;
      });




    // local functions:


   function requDF1(){// reset req body with bot request x the intents AA
    let res;
    if (event){if(event=='interrupt')res= {user: urlparams.session_id, text, type: "interrupt"};// use .on trigger x this independent/unrelated  by dialogs handler 
    else  res= {user: urlparams.session_id, text, type: "message",event};// usual event , dialog related, event available in convo using {{channelData.event}} or in js ev=channelData.event
   }else res= {user: urlparams.session_id, text, type: "message",customParams};
    return res;
  }


          function res_json_(jt) {// see requDF1()
            // the bot calls 
        /* jt=
            [{"type":"message","text":"ciao sono l'assistente del favoloso hotel cinque stelle <br> oggi grande festa della amicizia alle 20 tutti in piscina! <br> Puoi fare domande su dove come quando  u
            sufruire dei nostri molti servizi interni ed esterni.\n <br> ad esempio puoi domandare dove e quando fare  colazione , andare al ristorante,  come contattare la portineria  o usufruire della l
            avanderia , puoi anche chiedere l'elenco dei servizi e chiedere poi cosa desideri sapere o prenotare","urgenza_f":"testato","thread":"default","key":"urgenza","outCtx":["mod_Serv/th_serv_relay
            "],"matches":[],"askmatches":[]
          
                                  ++++  fields set on js scripts using channelData.field1=.....    
                                  usually :
                                    channelData.parameters={book:'fail'};
                                    channelData.action='BYE';
          
          
          
          }]
          */
              if(!(jt&&jt[0]))return;
                let text = jt[0].text,iu,ii,qs,resp1,parameters,
                channelData=jt[0].channelData;
                if((iu=text.indexOf('%%phone_exit-')) >= 0){
                  ii=text.substring(iu+13).indexOf(';');
                  if(ii>0)qs=text.substring(iu+13,iu+13+ii);
                

                // TODO add all exit end point !!!!!!!!!

                if (
                  // (exit_=text.match(exitregex))// too time consuming
                  qs// qs='action=BYE&par1=val1&par2=val2'   but put £ instead of & . usually   %%phone_exit-action=BYE£book=fail; > qs='action=BYE£book=fail'
                  ) {

                  let pars=querystring.parse(qs.replace(/£/g,'&'));// use & as separator 
                  if(pars){
                    for (x in pars) {
                      let attr=pars[x];
                      
                      if(x=='action'){// rooting info , extract other context or event to trigger 
                        resp1={action:attr};
                    }else {parameters=parameters||{};
                        parameters[x]=attr;
                    }
                  }
                if(resp1)resp1.parameters=parameters;// add params to event   
                }

                }}
                if(!resp1&&channelData){// if cant set response from embedded in text %%phone_exit-.....
                          // try using channelData
                  if(channelData.action){

                    resp1={action:channelData.action};
                    
                    if(channelData.parameters)resp1.parameters=channelData.parameters;
                    }
                  }


                

                if(!text){if(resp1)text='';else return;}
                resp1=resp1||{};// resp1={action:'BYE,parameters:{book:'fail'}}
                resp1.fulfillmantText=text;resp1.languageCode='it-IT';

                
                  console.log(' bot reply to phone: ', resp1);
              
              //  console.log(' bot webhook : intent= ',intent,' ctx= ',ctx,' ctx_out= ',ctx_out,'\n bot called res.json (',jt,') so call res.json( ',resp1,')');
              res.json = res_json;
              res.json(resp1);
            }
          
          function res_end_(x) {
            if ('intent' == 'Default Welcome Intent') {
              // discard bot answer
            }
            else {
              //console.log(' bot webhook : res.end called ',res.text)
              console.log(' bot webhook : res.end called ', x);

              // res_end(x);
              res.end = res_end;
              res.end(x);
            }
          }


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
  wserv.post(webhook_uri + '/df1', async (req, res) => {// df fullfillment endpoint: http://host/ .WARNING  async to use await in case of direct call to nlpai ctl 
    // see https://samxsmith.medium.com/promises-in-express-js-apis-testing-dd0243163d57
    // https://medium.com/@benlugavere/using-promises-with-express-8c986c10fae
    /*
    Try the following, and after please read the following document https://www.promisejs.org/ to understand how the promises work.

      var Promise = require('promise');
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

    */
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    const turns = 'turns', askoperator = 'askoperator';
    let myjson=JSON.stringify(req.body);
    console.log('cfgWebPost receved .../df1 req.body : ',myjson);
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
  
  ___________________________
  
  AADD 
  example of Raw interaction log from history of the fulfillments of intent bookparam : 
  {
    "id": "29c6ff8d-c3f2-4bb4-b52a-7620ecb4c117-d74139ee",
    "fulfillmentText": "ecco le migliori  disponibilità per citta  Udine        e data richieste : trieste domani alle 17 presso ospedale civile via roma 42 , se sei interessato rispondi accetto e dai nome cognome",
    "language_code": "it",
    "queryText": "vaccino a udine sabato mattina",
    "webhookPayload": {},
    "intentDetectionConfidence": 0.66880316,
    "action": "",
    "webhookSource": "",
    "parameters": {
      "location": {
        "shortcut": "",
        "island": "",
        "subadmin-area": "",
        "zip-code": "",
        "country": "",
        "street-address": "",
        "admin-area": "",
        "business-name": "",
        "city": "Udine"
      },
      "date-time": {
        "startDateTime": "2021-04-24T05:00:00+02:00",
        "endDateTime": "2021-04-24T11:59:59+02:00"
      }
    },
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            "  \n\n\n hai scelto l'operatore Struttura di Udine  per usufruire del servizio controllo e vaccinazioni . Ecco i primi \ngiorni disponibili per la prenotazione\n\n\n Giovedì, 22-04-2021, alle ore 09:00,  \n\n oppure \n Venerdì, 23-04-2021,  \n\n oppure \n Lunedì, 26-04-2021,  \n\n\nscegli\nun giorno elencato e l'orario preferito  oppure esprimi altra preferenza giornaliera\n"
          ]
        }
      }
    ],
    "diagnosticInfo": {
      "webhook_latency_ms": 1253,
      "original_webhook_body": "{\"fulfillmentMessages\":[{\"text\":{\"text\":[\"  \\n\\n\\n hai scelto l'operatore Struttura di Udine  per usufruire del servizio controllo e vaccinazioni . Ecco i primi \\ngiorni disponibili per la prenotazione\\n\\n\\n Giovedì, 22-04-2021, alle ore 09:00,  \\n\\n oppure \\n Venerdì, 23-04-2021,  \\n\\n oppure \\n Lunedì, 26-04-2021,  \\n\\n\\nscegli\\nun giorno elencato e l'orario preferito  oppure esprimi altra preferenza giornaliera\\n\"]}}],\"outputContexts\":[{\"name\":\"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/usranswer\",\"lifespanCount\":0,\"parameters\":{\"date-time\":{\"startDateTime\":\"2021-04-24T05:00:00+02:00\",\"endDateTime\":\"2021-04-24T11:59:59+02:00\"},\"date-time.original\":\"sabato mattina\",\"location\":{\"country\":\"\",\"city\":\"Udine\",\"admin-area\":\"\",\"business-name\":\"\",\"street-address\":\"\",\"zip-code\":\"\",\"shortcut\":\"\",\"island\":\"\",\"subadmin-area\":\"\"},\"location.original\":\"udine\"}},{\"name\":\"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/turns\",\"parameters\":{\"date-time\":{\"startDateTime\":\"2021-04-24T05:00:00+02:00\",\"endDateTime\":\"2021-04-24T11:59:59+02:00\"},\"date-time.original\":\"sabato mattina\",\"location\":{\"country\":\"\",\"city\":\"Udine\",\"admin-area\":\"\",\"business-name\":\"\",\"street-address\":\"\",\"zip-code\":\"\",\"shortcut\":\"\",\"island\":\"\",\"subadmin-area\":\"\"},\"location.original\":\"udine\"},\"lifespanCount\":1},{\"name\":\"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/datetime\",\"lifespanCount\":0,\"parameters\":{\"date-time\":{\"startDateTime\":\"2021-04-24T05:00:00+02:00\",\"endDateTime\":\"2021-04-24T11:59:59+02:00\"},\"date-time.original\":\"sabato mattina\",\"location\":{\"country\":\"\",\"city\":\"Udine\",\"admin-area\":\"\",\"business-name\":\"\",\"street-address\":\"\",\"zip-code\":\"\",\"shortcut\":\"\",\"island\":\"\",\"subadmin-area\":\"\"},\"location.original\":\"udine\"}},{\"name\":\"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/__system_counters__\",\"parameters\":{\"no-input\":0,\"no-match\":0,\"date-time\":{\"startDateTime\":\"2021-04-24T05:00:00+02:00\",\"endDateTime\":\"2021-04-24T11:59:59+02:00\"},\"date-time.original\":\"sabato mattina\",\"location\":{\"country\":\"\",\"city\":\"Udine\",\"admin-area\":\"\",\"business-name\":\"\",\"street-address\":\"\",\"zip-code\":\"\",\"shortcut\":\"\",\"island\":\"\",\"subadmin-area\":\"\"},\"location.original\":\"udine\"}},{\"name\":\"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/askoperator\",\"lifespan\":1,\"parameters\":{},\"lifespanCount\":0}]}",
      "original_webhook_payload": "{\n  \"responseId\": \"29c6ff8d-c3f2-4bb4-b52a-7620ecb4c117-d74139ee\",\n  \"queryResult\": {\n    \"queryText\": \"vaccino a udine sabato mattina\",\n    \"parameters\": {\n      \"date-time\": {\n        \"startDateTime\": \"2021-04-24T05:00:00+02:00\",\n        \"endDateTime\": \"2021-04-24T11:59:59+02:00\"\n      },\n      \"location\": {\n        \"country\": \"\",\n        \"city\": \"Udine\",\n        \"admin-area\": \"\",\n        \"business-name\": \"\",\n        \"street-address\": \"\",\n        \"zip-code\": \"\",\n        \"shortcut\": \"\",\n        \"island\": \"\",\n        \"subadmin-area\": \"\"\n      }\n    },\n    \"allRequiredParamsPresent\": true,\n    \"fulfillmentText\": \"ecco le migliori  disponibilità per citta  Udine        e data richieste : trieste domani alle 17 presso ospedale civile via roma 42 , se sei interessato rispondi accetto e dai nome cognome\",\n    \"fulfillmentMessages\": [{\n      \"text\": {\n        \"text\": [\"ecco le migliori  disponibilità per citta  Udine        e data richieste : trieste domani alle 17 presso ospedale civile via roma 42 , se sei interessato rispondi accetto e dai nome cognome\"]\n      }\n    }],\n    \"outputContexts\": [{\n      \"name\": \"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/usranswer\",\n      \"lifespanCount\": 2,\n      \"parameters\": {\n        \"date-time\": {\n          \"startDateTime\": \"2021-04-24T05:00:00+02:00\",\n          \"endDateTime\": \"2021-04-24T11:59:59+02:00\"\n        },\n        \"date-time.original\": \"sabato mattina\",\n        \"location\": {\n          \"country\": \"\",\n          \"city\": \"Udine\",\n          \"admin-area\": \"\",\n          \"business-name\": \"\",\n          \"street-address\": \"\",\n          \"zip-code\": \"\",\n          \"shortcut\": \"\",\n          \"island\": \"\",\n          \"subadmin-area\": \"\"\n        },\n        \"location.original\": \"udine\"\n      }\n    }, {\n      \"name\": \"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/turns\",\n      \"parameters\": {\n        \"date-time\": {\n          \"startDateTime\": \"2021-04-24T05:00:00+02:00\",\n          \"endDateTime\": \"2021-04-24T11:59:59+02:00\"\n        },\n        \"date-time.original\": \"sabato mattina\",\n        \"location\": {\n          \"country\": \"\",\n          \"city\": \"Udine\",\n          \"admin-area\": \"\",\n          \"business-name\": \"\",\n          \"street-address\": \"\",\n          \"zip-code\": \"\",\n          \"shortcut\": \"\",\n          \"island\": \"\",\n          \"subadmin-area\": \"\"\n        },\n        \"location.original\": \"udine\"\n      }\n    }, {\n      \"name\": \"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/datetime\",\n      \"lifespanCount\": 1,\n      \"parameters\": {\n        \"date-time\": {\n          \"startDateTime\": \"2021-04-24T05:00:00+02:00\",\n          \"endDateTime\": \"2021-04-24T11:59:59+02:00\"\n        },\n        \"date-time.original\": \"sabato mattina\",\n        \"location\": {\n          \"country\": \"\",\n          \"city\": \"Udine\",\n          \"admin-area\": \"\",\n          \"business-name\": \"\",\n          \"street-address\": \"\",\n          \"zip-code\": \"\",\n          \"shortcut\": \"\",\n          \"island\": \"\",\n          \"subadmin-area\": \"\"\n        },\n        \"location.original\": \"udine\"\n      }\n    }, {\n      \"name\": \"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54/contexts/__system_counters__\",\n      \"parameters\": {\n        \"no-input\": 0.0,\n        \"no-match\": 0.0,\n        \"date-time\": {\n          \"startDateTime\": \"2021-04-24T05:00:00+02:00\",\n          \"endDateTime\": \"2021-04-24T11:59:59+02:00\"\n        },\n        \"date-time.original\": \"sabato mattina\",\n        \"location\": {\n          \"country\": \"\",\n          \"city\": \"Udine\",\n          \"admin-area\": \"\",\n          \"business-name\": \"\",\n          \"street-address\": \"\",\n          \"zip-code\": \"\",\n          \"shortcut\": \"\",\n          \"island\": \"\",\n          \"subadmin-area\": \"\"\n        },\n        \"location.original\": \"udine\"\n      }\n    }],\n    \"intent\": {\n      \"name\": \"projects/need2buy-rpoggf/agent/intents/1647a499-2a24-4ede-b409-769e97cc6990\",\n      \"displayName\": \"bookparam\"\n    },\n    \"intentDetectionConfidence\": 0.66880316,\n    \"languageCode\": \"it\"\n  },\n  \"originalDetectIntentRequest\": {\n    \"source\": \"DIALOGFLOW_CONSOLE\",\n    \"payload\": {\n    }\n  },\n  \"session\": \"projects/need2buy-rpoggf/agent/sessions/7a7b64bf-8098-bdec-d111-ad49e2317c54\"\n}"
    },
    "webhookStatus": {
      "webhookStatus": {
        "message": "Webhook execution successful"
      },
      "webhookUsed": true
    },
    "outputContexts": [
      {
        "lifespanCount": 1,
        "name": "turns",
        "parameters": {
          "date-time.original": "sabato mattina",
          "date-time": {
            "endDateTime": "2021-04-24T11:59:59+02:00",
            "startDateTime": "2021-04-24T05:00:00+02:00"
          },
          "location.original": "udine",
          "location": {
            "business-name": "",
            "city": "Udine",
            "shortcut": "",
            "zip-code": "",
            "admin-area": "",
            "island": "",
            "country": "",
            "subadmin-area": "",
            "street-address": ""
          }
        }
      }
    ],
    "intent": {
      "isFallback": false,
      "displayName": "bookparam",
      "id": "1647a499-2a24-4ede-b409-769e97cc6990"
    }
  }
  
  
  
  */
 let block_bot_answ=false;// discard bot answer because we sent a response to df independently

    let ictx = 0;
    let ctx = [], ctxName = [], turnsC,// ctx: fulfilled context set x continuing bot ( next outcontext: turns) , turnsC in case we have to add
      askoperatorC,// the outputcontext to set params  when bot returns succfffully booking 
      centroserviziC, datetimeC,// service context
      ctx_out = [],// context set to end bot  ( next outcontext: askoperator)
      askOpLocation,// debug : template for askoperator outcontext parameters to set as  result of bot booking 
      askOpDateTime;// debig : template for askoperator outcontext parameters to set as  result of bot booking 
    // try just to create a plain obj :
    askOpLocation = { country: "", city: "Milano", "admin-area": "", "business-name": "", island: "", shortcut: "", "street-address": "", "subadmin-area": "", "zip-code": "" };// name "location" : parameters.location=askOpLocation
    askOpDateTime = "2021-04-04T12:00:00+02:00";// name "date-time" askoperatorC.parameters["date-time"]=askOpDateTime , see AADD 


    let usranswerPar = {},// ex: param={transferred:'acquisti'} %%transferred-acquisti; use condition: $$%mod_sys:{£&}§1^%%(\w+(?=-))\W(\w+)§tr£^transferred&wait£^transfertwait&miss£^miss
      welcomePar = {},// see phone context, transf_number ("393703522039") ( and caller_id ) parameters to se the outcontext  

      // >>>>>   defined and used only in intent 'Default Welcome Intent'. coming from phone adapter will also insert a flag in centroservizi context (oCtx.parameters.started=='cs') to use when need to start the centroservizi dialog
      start_ctx = null,// the context to serve user, used when call the bot to insert the name of simplybook entry point (usually in welcome intent ) to load right registered  null will be std datetime
                  //    NBNB now centroservizi general book  dialog is available via ccai1 command
                  // so, when in requDF1() (see ABAAX ), intent 'csWhatService' comes to start book bot dialog , we can use  flag to see what is the entry point to connect/continueusingfinitialized
      cs_endpoint,// the endpoint registered in book_ep for start_ctx='cs'



      contexts, intent, session;
    if (req.body.queryResult && req.body.queryResult.intent) intent = req.body.queryResult.intent.displayName;
    if (intent && (contexts = req.body.queryResult.outputContexts)) {// is a df call
      // for(let i=0;i<contexts.length;i++){el=contexts[i];
      if (contexts[0]) {
        ictx = contexts[0].name.indexOf("/contexts/") + 10;
        session = req.body.session.substring(req.body.session.indexOf("/sessions/") + 10);
      }

      if (intent == 'turnscontinue' || intent == 'bookparam' || intent == 'Default Welcome Intent' || intent == 'book' || intent == 'csWhatService') {// AA intents.  manage  fulfillmants for covid dialogue,

        //let start_ctx = null,// the context to serve user, null will be std datetime
          csPresent = false;// useless , centroserviziC its enougth
        if (intent == 'Default Welcome Intent') {

          // 052021 : last policy only if phone prop is set we can reset the response prompt  for the intent to start the bot . otherwise we let the std df welcome to propose both 
          //  then we start the bot x the most probable bot intent that will wait . if another intent matches the bot will reset to that ( problem of time out ??)

          // master on df-bot sincro : 
          // the welcome intent will resolve the contex to serve the user looking up to context phone 
          // usually df will ask what customer class/desidered is the customer , the customer say class1 , class1 match and DF set the rigth user serving context AAD and prompt the user for next request.
          // after user text (request) matched the intent that confirm to goon with a dialog df intent  can pass control to the associated bot passing/rebuilding/mapping the user request
          // BUT
          // - here, the context to serve the user, is calculated not using a user turn but looking at some context (AAB phone) so the user replay is selected/matched by fullfillment :
          //      > buongiorno, puoi chiedere vaccino in una citta e datetime o operatore  !
          //      not   by a question : che utente sei ? e allora un intent è matched by user sayng : sono utente servizi covid  con reply/suggestion  : vuoi prenotare vaccino , che citta e quando ?
          // - that context will have lifespanCount=1
          // - the other serving possible context will have lifespanCount=0 
          // -  AAA  nb se l'intent si trova raggiungibile all'interno dopo un po di turn , to prepare the bot in meanwile posso dare al bot i turni AAAA che fanno posizionare il bot al intent che viene matchato in DF  :
          //        the bot will be triggered a convo with the right init text : see requDF1 AAAAX (ex centro servizi vorrei prenotare visita di controllo )
          // - cosi il DF intent (ABAA csWhatService e bookparam')che triggera la transazione , sul context selezionato,  puo essere matchato con i relativi entity (datetime e location per bookparam)  e trasferire il match (inbedded on text see requDF1  ABAAX) a corrispondente intent nel bot che da qui in 
          //    avanti procede autonomamnte via il loop con il context turn
          //    nb il intent del bot, se interno a un dialogo precedente  puo esserematchato chainando tutti i turn precedenti (con tempi lunghi di elaborazione di tutti i turni) o trovare gia il bot al turno relativo grazie a un precedente AAA 


          // set  outcontext.lifespanCount>0  related to the service to serve if not std (covid : datetime ctx)

          start_ctx = 'sermovox';// debug reset the default serving ctx , is the most slow app , reset if other will be match
          // start_ctx = 'serm';// debug reset the default serving ctx 

          contexts.forEach(el => {// scan contexts, phone will point to  service to serve , if matches substitute the ther std prestart ( start_ctx = 'sermovox' point to covid service)
            let el_out = el;
            let mnam = el.name.substring(ictx);// context name
            if (mnam == 'phone') {// both these incontext  will run a previous  welcome iniated bot , so transmit to bot the used context params
              // AAB
              // array.forEach(element => {  });
              if (el.parameters) {//  direct call parameters:{transf_number:"","caller_id":"393703522039"}},
                                  //  segreteria associazione :  parameters:{transf_number:"393703522039","caller_id":"0434541509"}},

                // bookparam/datetime params (covid bot )

                if (el.parameters.transf_number) {
                welcomePar.transf_number = el.parameters.transf_number;// >>>  only segretery can associate a custom book site registered on 
                 //  if (welcomePar.transf_number == '393703522039') {
                    if (book_ep[welcomePar.transf_number]) {
                    // AAB
                    start_ctx = 'cs';// serve this enrty with centroservizi outcontext(simplybook prenota std dialog)
                    // in first implementation the fulfillment of df point to a df entry (a df post entry)of a bot.js that uses a simplybook ctl (simplybookingAiaxCtl ) pointing to sermovox simplybook application 
                    //    in future when a channelid/user match the prenota child dialog _book_simple0_v2  
                    // simplyBook = new SimplyBook(// simplybook std app : sermovox entry
                    cs_endpoint=book_ep[welcomePar.transf_number];
                  }
                }
              }
            } else if (mnam == 'centroservizi') {
              centroserviziC = el;
              csPresent = true;
            } else if (mnam == 'datetime') {
              datetimeC = el;

            }else  if (mnam == askoperator) {
              isAsk = true;
              el.lifespanCount = 1;//, keep present but set 1
              askoperatorC  = el;// or clone it ? :  Object.assign({}, el); el_out.lifespanCount = 1;// el_out=new Ctx(nam,1,el.parameters);
            }
            ctxName.push(mnam);
            ctx.push(el);
          });
          if (start_ctx) {/// AAB : start_ctx will modify the welcome intent outcontext to serve instead of std context datetimeC named datetime
            // reset  every possible serving context
            // now there are :
            // - datetime context (to trigger bookparam(can launch turn context if there is bot fulfillment )/operator/exit)
            // - centrosevizi context to trigger csWhatService intent to lauch/continue bot with centroservizi simplybook app endpoint  
            let miss_ = false;// miss_  means miss datetime ctx
            if (!datetimeC) miss_ = true;
            else {
              if (start_ctx == 'sermovox') {// conferma il std outctx datetime , annulla il context centroservizi

                centroserviziC.lifespanCount = 0;// change outcontext to turns >>> in  requDF1 posso  preparo il bot con AAAA
                datetimeC.lifespanCount = 1;

              } else {
                if (start_ctx == 'cs') {// change std ctx datetime in favor of with centroservizi

                  centroserviziC.lifespanCount = 1;// change outcontext to turns >>> in  requDF1 posso  preparo il bot con AAAA
                  datetimeC.lifespanCount = 0;

                }
              } if (miss_) console.log(' cfgWebPost: centroservizi and datetime ctx not present in welcome intent ')
            }

          }
            // must be present 
            console.log('cfgWebPost in welcome , main service endpoint pointer, start_ctx,  is set to: ',start_ctx);
            if(start_ctx=='cs')console.log('  > endpoint pointer, start_ctx,  is cs,  so we going to resolve a registered end point , so set to: ',cs_endpoint);

          } else if ((intent == 'bookparam' || intent == 'csWhatService') && ictx && session) {
            // ABAA 
            // for any intent (bookparam on datetime context , csWhatService on  centroservizi context )
            //  that goon with a welcome inialized bot extract params to be used to set the bot text and set context (ctx and ctx_out) x continuing and end turns
            // from context get  local param (usranswerPar.datetime andvusranswerPar.location) to goon a bot dialogue
            //     see 
            // when returning the bot turns outcontext must be set with the right params  to set the right df outcontext that ends (askoperator ...) 

            let isTurns = false, isAsk = false;// has turns and askoperator context ?

            contexts.forEach(el => {
              let el_out = el;
              let mnam = el.name.substring(ictx);// context name
              if (mnam == 'usranswer' || mnam == 'centroservizi') {// these incontext of ABAA intent contains the params to pass (imbedded on text see ABAAX) to start the corresponding intent on bot 
                //  the bot can be in convo previously started by   welcome intent , so convo can continue passing to bot the entity (in text) extracted by context params
                //  useranswer is the context of DF serving default dialog , so the param are there and must be extracted to fill bot request x sermovox dialog (vaccini)
                //    in datetime ctx, bookparam  intent            >>  def usranswer outcontext will work with DF dialog intents
                //                                                  >> if exists, fullfilment set turns outcontext to work with bot dialog intents

                //    in centroservizi ctx, csWhatService  intent   >> if exists, fullfilment set turns outcontext to work with bot dialog intents x centroservizi dialog
                //    in ........       

                if (mnam == 'centroservizi') 
                  centroserviziC = el;// can be usefull

                // array.forEach(element => {  });
                if (el.parameters) {// estraggo parametri da centroservizi o usranswer

                  // bookparamintent/usransweroutcontext  params (covid bot ), if bookparam matches will set its entity on thee outcontext (default is the df outcontext usranswer )
                  let dp = el.parameters['date-time'];
                  if (dp) {
                    if (typeof dp === 'string') {
                      usranswerPar.datetime = dp;
                    } else {
                      if (dp && dp.date_time) usranswerPar.datetime = dp.date_time;//??? error ?
                      else if (dp && dp.startDateTime) usranswerPar.datetime = dp.startDateTime;
                    }
                  }
                  if (el.parameters.location) usranswerPar.location = el.parameters.location.city;

                  // csWhatService/centroservizi params (default simplybook  bot )
                  // ....  no params used ti to goon with bot 

                  // other future bot entry 
                  // ....  no params used ti to goon with bot 
                }

                  el.lifespanCount = 0;// change outcontext to turns

                  let nam = el.name.substring(0, ictx) + turns;
                  if(!isTurns)turnsC = new Ctx(nam);// generated copyng 
                  nam = el.name.substring(0, ictx) + askoperator;
                  if(!isAsk)askoperatorC = new Ctx(nam);// generated copyng 
                  //ctxName.push(turns);
                  // ctx.push(turnsC);
                  el_out = Object.assign({}, el); el_out.lifespanCount = 1;// el_out=new Ctx(nam,1,el.parameters);
                
              } else if (mnam == turns) {
                isTurns = true;
                turnsC=el;
                el.lifespanCount = 1;// keep present but set 1
                el_out = Object.assign({}, el); el_out.lifespanCount = 0;// el_out=new Ctx(nam,1,el.parameters);
              } else if (mnam == askoperator) {
                isAsk = true;
                askoperatorC =el;
                el.lifespanCount = 0;// keep present but set 1
                el_out = Object.assign({}, el); el_out.lifespanCount = 1;// el_out=new Ctx(nam,1,el.parameters);
              } else {
                if (mnam.substring(0, 2) != '__') el.lifespanCount = 0;// dont change sys param
              }

              ctxName.push(mnam);
              ctx.push(el);
              ctx_out.push(el_out);

            });
            if (!isTurns && turnsC) {
              turnsC.parameters.acc = "accetto";
              ctxName.push(turns);
              ctx.push(turnsC);
              let el_out = Object.assign({}, turnsC); el_out.lifespanCount = 0;
              ctx_out.push(el_out);
            }
            if (!isAsk && askoperatorC) {
              // turnsC.parameters.acc="accetto";
              ctxName.push(askoperator);
              ctx_out.push(askoperatorC);
              let el_out = Object.assign({}, askoperatorC); el_out.lifespanCount = 0;
              ctx.push(el_out);
            }
          } else if (intent == 'turnscontinue' && ictx && session) {// from context get the context :
            //  - from turns : create askoperatorC context, add turns to ctx and cloned turns (with lifespan 0) to ctx_out , 
            //  - from askoperator : add askoperator to ctx and cloned askoperator (with lifespan 1) to ctx_out , 
            // at the end if we didnt find askoperator (!isAsk) adds to ctx and ctx_out the created askoperatorC
            let isTurns = false, isAsk = false;// has turns context ?

            contexts.forEach(el => {
              let el_out = el;
              let mnam = el.name.substring(ictx);// context name
              if (mnam == turns) {
                // array.forEach(element => {  });

                el.lifespanCount = 1;

                let
                  nam = el.name.substring(0, ictx) + askoperator;
                askoperatorC = new Ctx(nam);// generated copyng 
                //ctxName.push(turns);
                // ctx.push(turnsC);
                el_out = Object.assign({}, el); el_out.lifespanCount = 0;// el_out=new Ctx(nam,1,el.parameters);

              } else if (mnam == askoperator) {
                isAsk = true;
                el.lifespanCount = 0;//0?, keep present but set 1
                askoperatorC = el_out = Object.assign({}, el); el_out.lifespanCount = 1;// el_out=new Ctx(nam,1,el.parameters);
              } else {
                if (mnam.substring(0, 2) != '__') el.lifespanCount = 0;// dont change sys param
              }

              ctxName.push(mnam);
              ctx.push(el);
              ctx_out.push(el_out);

            });

            if (!isAsk && askoperatorC) {
              // turnsC.parameters.acc="accetto";
              ctxName.push(askoperator);
              ctx_out.push(askoperatorC);
              let el_out = Object.assign({}, askoperatorC); el_out.lifespanCount = 0;
              ctx.push(el_out);
            }
          } else {
            // manage other intents if needed 
          }


          console.log('webhook cfgWebPost got a request with intent: ', intent, ', so managed contexts: ', ctxName);
          //console.log('webhook debug request body: ',req.body);
          // req.body : see df_trace_request_json.txt
          // >>>> HAVING PREPARED THE context to use (ctx and ctx_out) now SET REQ  to start/continue bot turns(processActivity), then according with bot response returns fulfillment with the right ctx 
          req.body = requDF1(req.body, usranswerPar, session, intent);// reset req body with bot request x the intents AA
          // >>> now SEND REQ To Bot AND RETURN FULFILLMENT (usualy send to bot then send fulfillment but not in welcome intent can be done)
          console.log('wekhook send to bot :', req.body.text);



          // >>> now here manage the prestart of bot for Welcome intent (respond fulfillmet without wait for bot returns for timeout problems) 
          if (intent == 'Default Welcome Intent') {// if welcome we can prestart the bot to meet a intermediate intene , and come back to df without waiting the bot answer!
            if (start_ctx == 'sermovox') {// def serving do not need to change the df def response text . if welcome dont came from phone anyway will be : start_ctx == 'sermovox'
              console.log(' bot webhook : reset stack :res.end called immediately with null fulfill  ');
              res.end();// returns null immediately, dont need to change context or answer text, df has alredy set the right way 
              block_bot_answ=true;// discard bot answer 
            } else {
              if (start_ctx == 'cs') {// cs serving . if we start bot dialog to avoid timeout we anticipate the bot response as a df fulfillment response and manage next intent as df intent that finally will pass to bot x goon with dialog turns 
                let promptServ = ' puoi procedere chiedendo servizi di prenotazione del tuo centro servizi o farti passare un operatore o uscire ';
                console.log(' bot webhook : reset stack :anticipate bot response immediately, it will set centroservizi outcontex prompting for centroservizi service: ', promptServ,'\n context: ',JSON.stringify(ctx, null, 4));
                let jsres = respDF([{text:promptServ}], ctx);
                //  console.log(' bot webhook : intent= ',intent,' ctx= ',ctx,' ctx_out= ',ctx_out,'\n bot called res.json (',jt,') so call res.json( ',resp1,')');
                res.json(jsres);// respond without wait bot
                res.end();// returns immediately
                block_bot_answ=true;// discard bot answer 
              }
            }
            block_bot_answ=true;// discard bot answer again !!!!!
          }
          if(!req.body){res.end();return;}// returns anyway if dont have to call bot or ctl .  any res.json must be called before

          // todo,  if wecome intent ,  set here a preprocess flag to do or not do the prestart. if so set a flag as status in some ctx params to wark normal service truggering that the forst turn are already lauched !!!
          // TODOTODO  move in requDF1, is more clear!
          //if(centroserviziC&&centroserviziC.lifespanCount > 0) centroserviziC.parameters.started=true;// this flag mean that cs has activated on welcome ntent thanks to a phone param and preprocess srarted 
                                                            // so when the cs intent csWhatService matches we know to continue a alredy started turn !! see requDF1

          const res_json = res.json, res_end = res.end;// store original express res cb 

          res.json = res_json_; res.end = res_end_;// set response cb to get and control  bot answer with res_json and res.end = res_end_
          // >>> now here CALL BOT OR single turn CTL and returs to DF if not alredy done according with modified res.json(), 2 cases: 
          const singleturn = false;
          if (!singleturn)// launch bot fw (if res() is alredy sent/called  the bot answer will be discarded )
            {
              ctl.adapter.processActivity(req, res, ctl.handleTurn.bind(ctl)).catch((err) => {// a promise.catch()
              // nb il adapter middleware ritorna ( e manda la risposta del bot ) quando handleTurn si risolve 
              // todo: expose this as a global error handler?
              console.error('Experienced an error inside the turn handler', err);
              throw err;
            });}else{// a sinle turn ctl :  df_ctl(), al posto del bot std !
              
              if (df_ctl && intent == 'bookparam') {
              let text = req.body,//= {user: convoId, text, type: "message"};
                qs = { location: usranswerPar.location, isodatetime: usranswerPar.datetime },
                result = await df_ctl(text, qs);// to use await try to set async the express handler .....

              if (result)// rows={datetime,prov_address_descr}1/2 alternativs
              { }

            } else res.end();// returns null immediately
          }

          // local functions:
          function res_json_(jt) {// see requDF1()
            //res_json(resp1);
            if (intent == 'Default Welcome Intent'||block_bot_answ) {
              // discard echo
              console.log(' bot webhook : discard bot aswer , df fulfilment already sent : ', jt)
            }
            else {
              // insert ctx in context fulfillment response only in :
              //  . welcome intent 
              //      when in context phone we find param to trigger a outcontext (centroservizi,..)  different from std vaccino dialog (outcontext usranswer) set by df welcome intent)
              //  - start intent exposed in hello outcontext (usranswer>bookparam, centroservizi>,....) : 
              //      ctx : bookparam + csWhatService intent response
              //  - when bot ends the dialog and return to df control 
              //      ctx_out

              let ctx_,exit_,nextEv=null,qs;
              //if(intent=='bookparam'){
              if (intent == 'bookparam' || intent == 'csWhatService') {
                ctx_ = ctx;
              }
              else if (intent == 'turnscontinue') {
                // passing loop: returns same context (turns)with text modified by bot. df will returns any answer that didnt match the exit intent (chiudi/passami operatore/...) on turncontext)
                // this adapter will catch the df event that will goon with df dialog when get the returns (child params) from the started child dialog
                //  the returns will be sent by a bot ask following the child return ask that emits a non prompting  message porting the event that here will be matched 
                //  
                
                // there are 2 ways to return to dialog flow
                // - so the bot match a intent and emit a prompt  (vuoi conferamre o no) that will be exposed to a next ask ( context)  
                //  theadapter can exit the turns loop starting a df dialog in 2 ways:
                // - 1 the adapter get/recognize the intent and pass the prompt as text setting the context where there is the intent to match the prompt
                //      can also adapt the text to take care of differences of  intent in df and bot in goon with dialog 
                // - 2 the adapter get/recognize the intent and pass to df that intent as event matching the df intent that set the prompt to goon the dialog in df
                //    > so set the event that match a df intent with a response : ok we got a good booking now want to confirm or exit or restart or goto other staff ?
                
                //  seems better and easier the way 2

                // how to start a dialog in bot that continue/ diverge a df dialog 
                // so in df we have a intent with a response : so want to centro servizi or book codiv ? setting the context to match the intent that apply to that question
                //  so the user say centro servizi and the bot match the centroservizi intent that ask/response ok centro servizi can do a,b,c 
                //      ( df will have a,b,c intent that can process the requests o give info that the service is unavailable)
                //  then the adapter will recognize the intent (get service from centro servizi) then record the context that will be routed when the dialogues a,b,c in context ends ( the dialogues can be dummy dialogues )
                //   so give the bot the text (' vorrei avere prenotazioni da centro servizi' : parte centro servizi che lancia il child book ) 
                //      NO : dvo avere un father the lanciare il messaggio che porta l'evento return al adapter !!! 
                //          NO : or set a event that will start the child dialog (book )that would be triggered by a text with )to get the bot in the ask prompting the intent prompt. (way to manage intent can diverge from bot and df !)
                //     the adapter get the bot prompt and pass that as text switching context in turns (the turns loop ctx)
                





                //if bot text contains %exit o 'telefono' o 'è stata confermata' e si ciede di riconfermare si passa al context useranswer ( in comune con l proposta locale)  
               // const exitregex=/(?:^|\s)%%exit-((\w|=|-)+)/i   ;// ex: text='... %%exit-qs;...'  will recover qs='city=pordenone-colore=giallo'   and obj is recovered with querystring.parse(qs.replace(/-/g,'&'))
                // .......
              
                let parm,prompted=jt.length-1;// the last
              
                let text,iu,ii,qs;
                const embed=false;// use embedded cmd %%.....
                
                let y,eventTr,event=-1;// =reason, event -1 NA, >=0 : 0 fail,event 1 book!
                for (y = 0; y < jt.length; y++) {
                  if (jt[y].df_exit) {
                    prompted = y;// df_exit  is a expected event 

                    eventTr = jt[y].df_exit;
                  }

                  text = jt[prompted].text;
                  if (eventTr) {// some event to exame found, see if registered 
                    if (eventTr == 'booked') {
                      event = 1;
                      parm = {};
                      parm.service = jt[prompted].service;
                      parm.performer = jt[prompted].performer;
                      parm.datetime = jt[prompted].datetime;
                      console.log(' bot webhook : on turn msg n# ', y, ' detected event field .df_exit of value: ', eventTr, ' with param: ', parm);
                    } else event = 0;// fail
                  }

                  console.log(' bot webhook : received event as channelData field .df_exit of value: ', eventTr, ' bot response to turnscontinue intent, there are (many) messages, the number is: ', jt.length);
                  if (embed && event < 0)// search in embedded
                  {

                    if ((iu = text.indexOf('%%df_exit-')) >= 0) {
                      ii = text.substring(iu + 7).indexOf(';');
                      if (ii > 0) qs = text.substring(iu + 7, iu + 7 + ii);

                      if (qs) {

                        // extract event and param
                        //let pars=querystring.parse(qs.replace(/-/g,'&'));// use & as separator 
                        let pars = querystring.parse(qs.replace(/£/g, '&'));// use & as separator 
                        if (pars) {
                          // extract param and reason(action)
                          parm = {};
                          for (x in pars) {
                            let attr = pars[x];
                            if (x == 'reason') {// rooting info , extract other context or event to trigger 
                              // TODO 
                              if (attr == 'booked') {// this rooting reason point to even event_oper
                                event = 1;
                              } else event = 0;

                            } else if (x == 'service') {
                              parm.service = attr;
                            } else if (x == 'performer') {
                              parm.performer = attr;
                            } else if (x == 'datetime') {
                              parm.datetime = attr;
                            }


                          }


                        }



                      }// end qs


                    }
                  }
                  if (event >= 0) break;
                }



                if(event>=0){
                  ctx_ = ctx_out;

                  if(event==1){// book
                    nextEv={// fulfillmentMessages will be ignored , the prompt will be given by the event triggered intent (a ask with nogoon)
                      name: "event_oper"
                      /*,parameters: {
                        "parameter-name-1": "parameter-value-1",
                        "parameter-name-2": "parameter-value-2"
                      }*/
                      ,parameters:parm
                      
                      ,"languageCode": "it-IT"
                    };

                  }else{// fail

                    nextEv={// fulfillmentMessages will be ignored , the prompt will be given by the event triggered intent (a ask with nogoon)
                      name: "event_fail"
                      
                      ,"languageCode": "it-IT"
                    };
                  }

                }








                /*  old 
                // TODO add all exit end point !!!!!!!!!
                if (
                  // (exit_=text.match(exitregex))// too time consuming
                  qs
                  ||text.indexOf('è stata confermata') >= 0) {// better set %%exit-conf;   or %%exit-qs;  qs="datetime=2021-04-04T12:00:00+02:00&location=udine", qs_=qsparse(qs) ( comment it <!-- %%exit-qs;  -->)
                  //  -default return from bot : instead of turns  set context askoperator to goon with df dialog if the bot will close giving the prompt to continue with  askoperator context (is a ask in botkit !)
                  //    - fill out bot params (location and datetime of booked service) to be used in following df intents
                  // - BUT if you want to trigger to another (ask) context you must extract info (usually from reason ) about it 
                  //    the same if you want to go into a event ( a ask with goon params)
                  ctx_ = ctx_out; // set askoperator context !
                  //      askOpLocation={country: "", city: "Milano", "admin-area": "","business-name":"",island:"",shortcut:"","street-address":"","subadmin-area":"","zip-code":""};// name "location" : parameters.location=askOpLocation
                  // askOpDateTime="2021-04-04T12:00:00+02:00";// name "date-time" so askoperatorC.parameters["date-time"]=askOpDateTime , see AADD 
                  // askOpLocation.city=qs_.location;
                  // askOpDateTime=qs_.datetime
                  // askOpLocation.city='udine';// askOpLocation.city=qs_.location
                // debug : simulate some param extraction :
                  askoperatorC.parameters = askoperatorC.parameters || { test: 'ciao' };
                  if (askOpDateTime) askoperatorC.parameters["date-time"] = askOpDateTime;
                  if (askOpLocation) { askOpLocation.city = 'udine'; askoperatorC.parameters.location = askOpLocation; }

                  // real staff get from %%exit-qs; : qs='city=Milano-admin_area=PN'

                  //if(exit_&&exit_[1]){
                    if(qs){
                  //let pars=querystring.parse(qs.replace(/-/g,'&'));// use & as separator 
                  let pars=querystring.parse(qs.replace(/£/g,'&'));// use & as separator 
                  if(pars){
                    // extract param and reason(action)
                    for (x in pars) {
                      let attr;
                      if((attr=pars[x]))askoperatorC.parameters[x]=pars[x];
                      if(x=='reason'){// rooting info , extract other context or event to trigger 
                        // TODO 
                        if (attr=='h'){// this rooting reason point to even event_oper
                          nextEv={// fulfillmentMessages will be ignored , the prompt will be given by the event triggered intent (a ask with nogoon)
                            name: "event_oper"
                            ,parameters: {
                              "parameter-name-1": "parameter-value-1",
                              "parameter-name-2": "parameter-value-2"
                            }
                            //,"languageCode": "en-US"
                          };
                      }else  if(x=='askoperator'){
                        // default change ctx_ outputcontext .....
                      }else  //if(x=='xyz'){ // change ctx_ outputcontext .....
                             ;//}
                    }
                  }



                if(nextEv)nextEv.parameters=pars;// add params to event 


                }
                }

                  if (ctx_) console.log(' bot webhook : activate context askoperator: ', JSON.stringify(ctx_, null, 4));
                  console.log(' bot webhook : activate DF outcontext askoperator: with prompt: ', text);

                }*/

                if (ctx_) console.log(' bot webhook : activate context askoperator: ', JSON.stringify(ctx_, null, 4),
                '\n with prompt: ', text);

                //else ctx_=ctx;// ?? ricopoiare ctx al return ????
              }// ends turnscontinue
              else { }
              let resp1 = respDF(jt, ctx_,nextEv);// strip text  tags, insert context in df format 
              //  console.log(' bot webhook : intent= ',intent,' ctx= ',ctx,' ctx_out= ',ctx_out,'\n bot called res.json (',jt,') so call res.json( ',resp1,')');
              res.json = res_json;
              res.json(resp1);
            }
          }
          function res_end_(x) {
            if (intent == 'Default Welcome Intent'||block_bot_answ) {
              // discard bot answer
            }
            else {
              //console.log(' bot webhook : res.end called ',res.text)
              console.log(' bot webhook : res.end called ', x);

              // res_end(x);
              res.end = res_end;
              res.end(x);
            }
          }

        }

        // else if(intent=''){res.end();}// manage some other intent 

        else {
          res.end();// no DF managed intent:  exit returning nothing
        }







      } else {
        res.end();// no df call
      }



    function requDF1(x,param,convoId='xyz1',intent){// x bot

      // news : now better run in express post handler span , so all local var in handler is available:
      // specifically all param var set x current intent are available here , so param parameter (caller set as usranswer param )is really useless
    
    
       // df req template x bot to manage  (intent=='turnscontinue'||intent=='bookparam') :
       // - if we got the bookparam intent : start a dialog simplybook going itho right ask at once 
       // - if got intent turnscontinue just pass the text transparently
    
       // returning from bot will be managed in res_json_ :
       //  - pass bot response text + add params (use qs format ?) to pass some context param (xml to operators) to continue dialog 
       //  - set the return context ( turns context to continue pass to bot or other context to let df to route (match)  next intent):
       //       the df can trigger the fallback intent turnscontinue or 
       //       trigger turnsoff if we want df to 
       //           exit from the turns context (confirm or esci)  (build the answer to confirm )
      //            confirm or   (build the answer to confirm )
       //  nb split turns into more context to better expone the user response to the right intent  


/**********************************************+

master on df-bot sincro : 

the welcome intent 
  will resolve the next contex to serve the user looking up also to phone context (set if the channel is voximplant)  :
  start_ctx, can be:
  - 'sermovox' will point to outcontext 'datetime' to confirm the DF intent 'bookparam' : eventually pre start bot request trying to get at a bot corresponding intent ( bot intent/ask  corresponding to 'bookparam')

  - 'cs' 	will set the outcontext 'centroservizi' to confirm the DF intent 'csWhatService' . eventually pre start a bot turns to target at a bot corresponding intent ( bot intent/ask  corresponding to  'csWhatService')

    >> in both ( now only in 'cs' ) pass a session param to conneting to a simplybook endpoint (text embedded cmd/entity %%simplybook-sermovox/cs;% ) 


  in  funzione di preStartCSonWELCOME:  si calcola l'eventuale prestart del bot  settando il request in requDF1 (passando anche %%simplybook-sermovox;)
  e si puo tornare al df senza attendere il bot answere impostando il next prompt per il outcontext selected 



bookparm intent :
  - puo essere matchato con i relativi entity (datetime e location per bookparam)  e 
    se c'e' bot fulfillment in funzione del flat prestart (fa prepartire con turns chain il bot al welcome intent ):
      si chiama il bot con user text turns chain o il event che porta il bot al corrispondente intent 
      o 
      se il bot e' stato prestarted in welcome essendo gia nel intent di trasferimento bot si fa un reply o si copia il intent prompt x lo user 

    se non c'e il bot fulfillment si prompta per next context 'usranswer' che si setta come nuovo outcontext  e si procede con il dialogo df autonomo che eventualmente si ricongiunge in ........
  - esce con turns outcontext after the bot fulfillment or just switch to df context if the dialog continue in DF

csWhatService intent : like bookparam but it cant go to a df next context , it must goon with bot dialog setting turns context  .


turnscontinue intent : pass text to bot remaining into turns context. till the bot answer to end and so change the outcontext to ......  so goback to DF importing some params from the context params

............ 



 ***********************************************/


// what context use to check before start main bot intent ??? probably askoperator 
// rule : before start bookparam check if oldingctx.parameters.started='cs' , 
//              if so restart bot and apply the turns to match the intent (prabably the user changed intent from cs to sermovox !)
//              if no (def service dont require to reset the context and its param in welcome intent ! )we suppose that sermovox bot is anyway started (preStartCSonWELCOME)
// rule : before start csWhatService check if oldingctx.parameters.started='cs' , 
//              if so the bot is already prestarted so goon and pass text or 'repeat' to bot 
//              if no (def service dont require to reset the context and its param in welcome intent ! )we suppose that sermovox bot is anyway started (preStartCSonWELCOME), so restart bot to pouint to the right intent 
    
      console.log('requDF1 , intent: ',intent,' run with: ',x,param,convoId,'\n start_ctx is: ',start_ctx,' prelaunch bot at welcome is set: ',preStartCSonWELCOME);
      const oCtx=askoperatorC;// centroserviziC
      let text,start,keys=Object.keys(param),res=null,
      reqDate,reqTime,reqLoc;
      text=x.queryResult.queryText;// req text
      // keys.forEach(item => {text+=' %%'+item+'-'+param[item]+';' });// future use 
      //let intent;  intent=x.queryResult.intent.displayName;


      //const start_='%%WELCOMECCAI prenota %%simplybook-sermovox; ';//' cs case: centro servizi prenota %%simplybook-sermovox; ';// change sermvox with the right endpoint 
      let start_='%%WELCOMECCAI prenota %%simplybook-';//' cs case: centro servizi prenota %%simplybook-sermovox; ';// change sermvox with the right endpoint 

      if(intent=='Default Welcome Intent'){// init bot serving some serving context  // will set the book endpoint if comes from phone
                                          // AAAA, AAAAX

        // todo  prevedere una sol minima . x def start init almeno con '%%resetDial-xx; centro servizi' 

        text='';
        if(start_ctx=='sermovox'){// examine ctx to discover the app/ctx the user is tied to run 
          start=' centro servizi prenota servizio controllo ';// associated to default simplybook sermovox app (vaccino ), datetime context start='';
          if(preStartCSonWELCOME&&oCtx){ 
            if(!oCtx.lifespanCount) oCtx.lifespanCount=1;
            oCtx.parameters=oCtx.parameters||{};oCtx.parameters.started=start_ctx;// this flag mean that cs has activated on welcome ntent thanks to a phone param and preprocess started 
            
          }
            else return;
        }else  if(start_ctx=='cs'){//set  ctx to set  the app/ctx the user is tied to run if in future csWhatService will be matched
          start_+=cs_endpoint+';';//' cs case: cs_endpoint is set properly , use it
          start=start_;// sermovox or ...., prenota intent (thread book_simple) has sess_bookapp entity that will be match with 'sermovox' and will set session.simplybook_endpoint
                                                                  // that is used in simplybookingaiaxctl to connect to a registered simplebook endpoint
          
           if(!oCtx.lifespanCount) oCtx.lifespanCount=1;
            oCtx.parameters=oCtx.parameters||{};
            oCtx.parameters.endpoint=cs_endpoint;//this flag mean that cs has activated on welcome intent thanks to a phone param 
            // so when the cs intent csWhatService matches we know to continue a alredy started turn !! see requDF1
            if(preStartCSonWELCOME&&oCtx){ 
            oCtx.parameters.started=start_ctx;// this flag mean that cs has activated on welcome ntent thanks to a phone param and preprocess started 
                                                                  // so when the cs intent csWhatService matches we know to continue a alredy started turn !! see requDF1
                                      }
                                                                  else return;// if preStartCSonWELCOME=false dont call bot to prestart , so when centroservizi csWhatService matches the bot will be called from start with full turns to get into the right intent, see after 
        }
        if(textFwCmd)text+='%%resetDial-xx;'+start;// reset all dialog , text+='%%resetDial-xx; fammi echo';

      }   
      // intent starting in context datetime/centroservizi
      // ABAA
      else if(intent=='bookparam'){// ABAAX 
                                  // usranswer ctx, sermovox app 
        // probably chech the session is in esci state, then restart session matching right convo ask giving all info in text to get the ask in one turn only using collected param
        text='';
    
        // TODO move to welcome intent because timeout problem!!!!!!!!!!!!!!!!!!!  . done!
       // if(textFwCmd)text+='%%resetDial-xx; ';// reset stack if we use a previous same session , start clean  
        // text+=start;
    
      keys.forEach(item => {// first call to bot 
        if(item=='datetime'&&param[item]){let mya=param[item];
                       // text+=' '+ mya.substring(0,19);
                       reqDate=mya.substring(0,10);reqTime=mya.substring(11,13);
                       text+=' '+ reqDate+' alle '+reqTime;// error???
       } else if(item=='location'&&param[item]){ reqLoc= param[item];
                                                text+=' '+ reqLoc;
                                                  }
                  });  
      if(oCtx&&oCtx.parameters&&oCtx.parameters.started=='cs'){
                    text+='%%resetDial-xx; centro servizi prenota servizio di controllo %%simplybook-sermovox; ';// convo waiting in right intent , just repeat its prompt
                    
                    }
    
    }  else if(intent=='csWhatService'){// ABAAX 
                                        // intent matched with  'desidero servizi (di prenotazione )di centroservizi'  
      // probably chech the session is in esci state, then restart session matching rigth convo ask giving all info in text to get the ask in one turn only using collected param
     // text='desidero prenotare';// gia fatto !
     if(oCtx&&oCtx.parameters){// must be 
       if(oCtx.parameters.started=='cs'){
     text='ripeti';// bot convo waiting in right intent to continue the dialog , just repeat its prompt (really is not the same that start prompt but we must prestart the dialog for timing issues)
     
     }else{
      start_+=oCtx.parameters.endpoint+';';//=cs_endpoint=cs_endpoint
       text='%%resetDial-xx; '+start_;// sermovox bot can be prestarted so reset dialogs
     }}else{
       // ???
     }
     console.log('wekhook with intent csWhatService:  continue a already started cs bot book dialogue  with endpoint: ',oCtx.parameters.endpoint,', or start cs from beginning  using text: ',text);
    
    }else if(intent=='turnscontinue');// do nothing pass text
    else return;// exit
     
      res= {user: convoId, text, type: "message"};
      return res;
    }

  });// end df post 


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

function respDF(x,ctx,event){
  console.log('bot answered:',x)
  let text;
  text=x[0].text;
  if(text)text=text.replace(/(<.*?>)|(\/n)/g,'');//Regex.Replace(mesage.text,"<.*?>",string.Empty);
  // no: text=text.replace(/(<.*?>)|(\//n)/g,'');
   //text=text.trim().replace(/<.*?>/g,'');// just remove /n and <some>
  let res=response_df1(text,ctx,event);
  console.log('df fullfil (strip <...> !) answered:',res)
  return res;
}

function resp(x,ctx0,ctx1){
    console.log('bot answered:',x)
    let text;
    text=x[0].text;
    let res=response(text,ctx0,ctx1);
    console.log('df fullfil answered:',x);
    return res;
 }
 function requ(x){// df req template
    console.log('ddd',x)
    let text;
    text=x.queryResult.queryText;
    let res= {user: "xyz1", text, type: "message"};
    return res;
 }
 /*
 function requDF1(x,param,convoId='xyz1',intent){// x bot

  // news : now better run in express post handler span , so all local var in handler is available:
  // specifically all param var set x current intent are available here , so param parameter (caller set as usranswer param )is really useless


   // df req template x bot to manage  (intent=='turnscontinue'||intent=='bookparam') :
   // - if we got the bookparam intent : start a dialog simplybook going itho right ask at once 
   // - if got intent turnscontinue just pass the text transarently

   // returning from bot will be managed in res_json_ :
   //  - pass bot response text + add params (use qs format ?) to pass some context param (xml to operators) to continue dialog 
   //  - set the return context ( turns context to continue pass to bot or other context to let df to route (match)  next intent):
   //       the df can trigger the fallback intent turnscontinue or 
   //       trigger turnsoff if we want df to 
   //           exit from the turns context (confirm or esci)  (build the answer to confirm )
  //            confirm or   (build the answer to confirm )
   //  nb split turns into more context to better expone the user response to the right intent  

  console.log('requDF1 , intent: ',intent,' run with: ',x,param,convoId);
  let text,start,keys=Object.keys(param),res=null,
  reqDate,reqTime,reqLoc;
  text=x.queryResult.queryText;// req text
  // keys.forEach(item => {text+=' %%'+item+'-'+param[item]+';' });// future use 
  //let intent;  intent=x.queryResult.intent.displayName;
  if(intent=='Default Welcome Intent'){// init bot serving some serving context  
                                      // AAAA, AAAAX

    text='';
    if(start_ctx=='sermovox'){// examine ctx to discover the app/ctx the user is tied to run 
      start=' centro servizi prenota servizio controllo ';// associated to default simplybook sermovox app (vaccino ), datetime context start='';
    }else  if(start_ctx=='cs'){// examine ctx to discover the app/ctx the user is tied to run 
      start=' centro servizi prenota %%simplybook-sermovox; ';// prenota intent (thread book_simple) has sess_bookapp entity that will be match with 'sermovox' and will set session.simplybook_endpoint
                                                              // that is used in simplybookingaiaxctl to connect to a registered simplebook endpoint
    }
    if(textFwCmd)text+='%%resetDial-xx;'+start;// reset all dialog , text+='%%resetDial-xx; fammi echo';

  }


  // intent starting in context datetime/centroservizi
  // ABAA
  else if(intent=='bookparam'){// ABAAX 
                              // usranswer ctx, sermovox app 
    // probably chech the session is in esci state, then restart session matching right convo ask giving all info in text to get the ask in one turn only using collected param
    text='';

    // TODO move to welcome intent because timeout problem!!!!!!!!!!!!!!!!!!!  . done!
   // if(textFwCmd)text+='%%resetDial-xx; ';// reset stack if we use a previous same session , start clean  
    // text+=start;

  keys.forEach(item => {// first call to bot 
    if(item=='datetime'&&param[item]){let mya=param[item];
                   // text+=' '+ mya.substring(0,19);
                   reqDate=mya.substring(0,10);reqTime=mya.substring(11,13);
                   text+=' '+ reqDate+' alle '+reqTime;// error???
   } else if(item=='location'&&param[item]){ reqLoc= param[item];
                                            text+=' '+ reqLoc;
                                              }
              });  

}  else if(intent=='csWhatService'){// ABAAX 
                                    // intent matched with  'desidero servizi (di prenotazione )di centroservizi'  
  // probably chech the session is in esci state, then restart session matching rigth convo ask giving all info in text to get the ask in one turn only using collected param
  text='desidero prenotare';// 
  

}else if(intent=='turnscontinue');// do nothing pass text
else return;// exit
 
  res= {user: convoId, text, type: "message"};
  return res;
}*/
    
/* from ........
 df template :
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
{  "responseId": "response-id",
  "session": "projects/project-id/agent/sessions/session-id",
    "queryResult": {    "queryText": "End-user expression", 
     "parameters": {      "param-name": "param-value"    },    "allRequiredParamsPresent": true,    "fulfillmentText": "Response configured for matched intent",   
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
function response_test(mytext,ctx0,ctx1){// not used
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
function response_df1(mytext,ctx,event){
  if(ctx){
  let resp= {fulfillmentMessages: [
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
 if(event)resp.followupEventInput=event;// fulfillmentMessages will be ignored , the prompt will be given by the event triggered intent (a ask with nogoon)


 return resp;
}else return {fulfillmentMessages: [
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
let dfEp;
if(nlpai&&nlpai.bookApp&&(dfEp=nlpai.bookApp.aiaxpost)){




  let qs={uri:'dfEp'},vars=null,entity=null,wheresInst=null,term;

  let form={entity,wheresInst,vars,qs}; //={entity,term,wheres,wheresInst,vars,qs}; // the nlpai interface
 
  
// test:
term='ciao',wheres={city:'udine',time:'2021-12-31T12:00:00'};

df_ctl=async function(term,wheres){
form.term=term,form.wheres=wheres;


let answ= await dfEp(form);// will call postR.simplyDF(vars,wheresInst,wheres,qs,rest) returns {reason:'runned'/x,rows:qmodel};// qmodel={par1,par2}
if(answ.reason=='runned')return answ.rows;
else return null;
}

}
}
 
