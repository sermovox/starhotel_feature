module.exports=//
function(wserv,ctl,webhook_uri){
if(wserv){
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
else {
    wserv.post(webhook_uri+'/df1', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('wekhook got a request  :',req.body);
    req.body=requ(req.body);

    const res_json=res.json,res_end=res.end;
    function res_json_(jt){
        let resp1=resp(jt);
        //res_json(resp1);
        res.json=res_json;
        res.json(resp1);
    };
    function res_end_(x){
        console.log('ppp',x)
     // res_end(x);
     res.end=res_end;
     res.end(x);
     }
     res.json=res_json_;res.end=res_end_;


    ctl.adapter.processActivity(req, res, ctl.handleTurn.bind(ctl)).catch((err) => {// a promise.catch()
        // nb il adapter middleware ritorna ( e manda la risposta del bot ) quando handleTurn si risolve 
        // todo: expose this as a global error handler?
        console.error('Experienced an error inside the turn handler', err);
        throw err;
    });
});
wserv.post(webhook_uri+'/message1', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('wekhook got a request  :',req.body);


    const res_json=res.json,res_end=res.end;
    function res_json_(jt){
        let resp1=jt;
       // res_json.call(res,resp1);// dangerous because now res.json is this cb 
       res.json=res_json;
       res.json(jt);
    };
    function res_end_(x){
        console.log('ppp',x)
    //  res_end.call(res,x);
    res.end=res_end;
    res.end(x);
     }
     res.json=res_json_;res.end=res_end_;



    ctl.adapter.processActivity(req, res, ctl.handleTurn.bind(ctl)).catch((err) => {// a promise.catch()
        // nb il adapter middleware ritorna ( e manda la risposta del bot ) quando handleTurn si risolve 
        // todo: expose this as a global error handler?
        console.error('Experienced an error inside the turn handler', err);
        throw err;
    });
});

}

function resp(x){
    console.log('ddd',x)
    let text;
    text=x[0].text;
    let res=response(text);
    return res;
 }
 function requ(x){// df req template
    console.log('ddd',x)
    let text;
    text=x.queryResult.queryText;
    let res= {user: "xyz1", text, type: "message"};
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
{  "responseId": "response-id",  "session": "projects/project-id/agent/sessions/session-id",  "queryResult": {    "queryText": "End-user expression",    "parameters": {      "param-name": "param-value"    },    "allRequiredParamsPresent": true,    "fulfillmentText": "Response configured for matched intent",    "fulfillmentMessages": [      {        "text": {          "text": [            "Response configured for matched intent"          ]        }      }    ],    "outputContexts": [      {        "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",        "lifespanCount": 5,        "parameters": {          "param-name": "param-value"        }      }    ],    "intent": {      "name": "projects/project-id/agent/intents/intent-id",      "displayName": "matched-intent-name"    },    "intentDetectionConfidence": 1,    "diagnosticInfo": {},    "languageCode": "en"  },  "originalDetectIntentRequest": {}}
'
*/

function jresponse(text){return '{"fulfillmentMessages": [{"text": {"text":['+text+'] }}]}'}
function response(mytext){ return {fulfillmentMessages: [
      {
        text: {
          text: [
            mytext
          ]
        }
      }
    ]
  }
}
}
}
   
