// old : now use bookcms plugin from a cms fork

let querystring=require('querystring');
// fw config

const fs = require('fs');

// create user and pass like cms


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
function(wserv,ctl,ngingurl,webhook_uri,nlpai){// ctl: if we want to connect directly the bot with its handler.ngingurl if we use proxy to xging port
  //const webhook_uri='/api/messages';
  let df_ctl;// set after , call simplybook without fw ctl. use df_ctl()  returns {,rows}
if(wserv){
/*
  wserv.post(webhook_uri+'/vilogs', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    console.log('vilogs got a request  :',req.body);
    logs(JSON.stringify(req.body, null, 4));
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
*/

}
}