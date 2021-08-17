const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');// install with : npm install googleapis@39 --save , see https://developers.google.com/calendar/quickstart/nodejs

// If modifying these scopes, delete token.json.
//const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';// token x api scaricato dal server di autorizzarione che consente l'accesso 
let rep=0;
let apicaller;
function got(ac){
  apicaller=ac;}

module.exports={


 /* riassunto 10082019
 see 
 https://developers.google.com/calendar/quickstart/nodejs
 
 Open the Google Cloud Console. user sermovoice irisbianco progetto Quickstart
 controlla avere gcal api , 
 You can use either an OAuth client ID or a service account with domain delegation   > we use oauth2
 so 


 */


// start connection to gcal 
// this func should be available to 
//          - 1 the  app controller in onchange.js  using the service given by fw in a obj like service.app.appservices:{gcal:{init,doapirest}} 
//          - 2 as a service that fw expone to $$$$ via service request protocol :
//              like : $$$$let out;par.sF=service.run_rest;par.sP='localhost:3000/pippo';par.cb=function(x){vars.nome=vars.nome+x};out=true;
//              ex :    $$$$let out;par.sF=service.run_rest;par.sP='internal?relayctl=gcalapi&req=getevent/setevent/getevlist&&dateparm=vars.matches.pippo.match, ...';par.cb=function(x){vars.nome=vars.nome+x};out=true;
//                      where x is a model item selected or a ask query to put in a ask ( usually done  in a ask onchange )
//                      so : write a service that instead to do the rest query http do route to a internal express routing to a internal ctl 
//                      ex internal/gcal?qs    is routed by internal rest service to the ctl service.gcal(req,res)   whetr req.qs is the qs
//          - 3 as bl injected on a ask onchange instead of run at all level ctl like above ( like dyn_medicine ask filling askmatches master query )
//                      using the same resvice like $$$$ case 
//          - 4 as a macro where matcher is the run_rest service that route to internal service like 2 , where the param are get from model in excel 




init:function(){// returns immediately

// init just once :
//if(apicaller)return;
if(rep==1){return}
rep++;
// debug:
//return;

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) 
  {
   console.log('Error loading client secret file:', err);
  return;
}
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), got);// build the authclient , ask/chech x token , than cb : listEvents(authclient)
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.// token x chiamare il server di autorizzazione che mi da il token token.json per chiamare le gcal api con service .....
 *                          // 
 *                          // l'oggetto che mi fa la chiamata al server di autorizzazione si chiama oAuth2Client , a cui passo le credentials x contattare il server di auth
 *                          // poi quando ottengo il token in TOKEN_PATH carico il token su oAuth2Client con .setCredentials(JSON.parse(token))
 *                          poi posso fare chiamate api chiamando le funzioni come : listEvents(oAuth2Client);
 * 
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) 
    {
    getAccessToken(oAuth2Client, callback);
    return;
  }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}



/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

// da terminale si aspetta un codice che ottengo navigando su un url generato 
// il codice viene inviato al auth server via il auth client obj e si ottiene in risposta :
//  il token da usare per inviare le richieste di api dalla app al google account su cui la app e' registrata 
// il token viene registrato per successive richieste in token_path
io=function(code){// the AUTHORIZATION CODE  entered by terminal
  //  rl.close();
  console.error('code is ',code);
    oAuth2Client.getToken(code, (err, token) => {
      if (err){
         console.error('Error retrieving access token', err);
         return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err){ 
          
           console.error(err);
          return;}
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  }

//  rl.question('Enter the code from that page here: ',io);
io('4/4wFYXA-qJ77YxnLzs0G8GNqrJOpByUdfs4SY9A_p2qcRYSVLzKiElaw');
}


},
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

 listEvents:async function(form){
let res_,rey_;
    if(apicaller){
      // extract qs 
      let cal;
      if(form&&(cal=form.calend));// the calendar account
    return   new Promise(function(res,rey){res_=res;rey_=rey;listEvents_(apicaller)});
    }
 
 function listEvents_(auth) {

  const calendar = google.calendar({version: 'v3', auth});// a request obj to run
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) {
        rey(err);
        return console.log('The API returned an error: ' + err);}
    const events = res.data.items;
    let ev='';
    if (events.length) {
      console.log('Upcoming 10 events:');
      
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
        ev+=start+event.summary+', ';
      });
    } else {
      console.log('No upcoming events found.');
        
    }
   // res_(events);
   res_({reason:'runned',rows:ev})
  });
}
}}