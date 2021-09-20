const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');// install with : npm install googleapis@39 --save , see https://developers.google.com/calendar/quickstart/nodejs

// If modifying these scopes, delete token.json.
//const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json',// def user token x api scaricato dal server di autorizzarione che consente l'accesso 
TOKENS_PATH = 'tokens.json',// def user token x api scaricato dal server di autorizzarione che consente l'accesso 
DEF='def';// the default user x testing 

let rep = 0;

// singleton auth oath2 client 
let apicaller,// the def authorized oath2 client. calendar api will get data about data of client using  a authorized oath2 client : calendar = google.calendar({version: 'v3', auth/apicaller});
  regOath2AuthClis = {};

function got(ac) {
  apicaller = ac;
}


module.exports = {


  /* riassunto 10082019
  see 
  https://developers.google.com/calendar/quickstart/nodejs
  
  Open the Google Cloud Console . user sermovoice irisbianco progetto Quickstart
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



  init: function (gcalUrs,siteGcalUsers) {// returns immediately, prepare // singleton auth oath2 client  x later use
                            // this support all cmd with the first initialized gcal service account 
                            // if gcalUrs='def'  fill sigleton var apicaller
                            // if gcalUrs!='def'  fill sigleton var regOath2AuthClis[gcalUsr]
    // init just once :
    //if(apicaller)return;
    if (rep == 1) { return }
    if (siteGcalUsers_) { return }
    rep++;
    // debug:
    //return;
    siteGcalUsers_=siteGcalUsers||'credentials.json';// siteGcalUsers: the name of file containing app service account credentials to connect to gcal data of users that authorize data access fot that service account 

    // Load client secrets from a local file.
    fs.readFile(siteGcalUsers, (err, content) => {
      if (err) {
        console.log('Error loading client secret file:', err);
        return;
      }
      siteGcalUsers_=siteGcalUsers;

      this.authUser(gcalUrs);});
    },
    authUser: function (gcalUrs) {

      if (!siteGcalUsers_) {  console.log('Error Gcal is not initialized :', err);
      return }
      
        

      // Load client secrets from a local file.
      fs.readFile(siteGcalUsers_, (err, content) => {
        if (err) {
          console.log('Error loading client secret file:', err);
          return;
        }
  
  


      // fill def oath2 auth client  siglethon . if not exists token we got auth url by console 
      gcalUrs=gcalUrs||DEF;
      if(gcalUrs!=DEF){
        // set a singlethon 
        if(regOath2AuthClis[gcalUrs])return true;
        else authorize(JSON.parse(content), (cl)=>{if(cl){regOath2AuthClis[gcalUrs]=cl;}},gcalUrs);
      }
      else{
        // temp  reate a cli every call
      // Authorize a client with credentials, then call the Google Calendar API.
      authorize(JSON.parse(content), got,DEF);// build the authclient , ask/chech x token , than cb : listEvents(authclient)
      }


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
    function authorize(credentials, callback,cli) {// callback param is the oauth api access obj x user cli 
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
       //cli=cli||'def';

        if(cli==DEF){
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          getAccessToken(oAuth2Client, callback,cli);// cli='def'
          return;
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }else{
            // Check if we have previously stored a token.
            fs.readFile(TOKENS_PATH, (err, tokens) => {
              if (err) {
                console.log('Error loading clients registered secret file:', err);
                return;
              }
              let regs=JSON.parse(tokens);
              if (!regs) {
                console.log('Error loading clients registered secret file:', err);
                return;
              }
              if (!regs[cli]) {
                getAccessToken(oAuth2Client, callback,cli);
                return;
              }
              oAuth2Client.setCredentials(JSON.parse(token));
              callback(oAuth2Client);
            });

    }

    }



    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback,cli) {
      const authUrl = oAuth2Client.generateAuthUrl({// set authUrl param to let a generic google user approve some  scopes auth on its calendar data
        access_type: 'offline',
        scope: SCOPES,// SCOPES[cli]
      });
      //cli=cli||'def';
      console.log('client: ',cli,' can Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      // da terminale si aspetta un codice che ottengo navigando su un url generato 
      // il codice viene inviato al auth server via il auth client obj e si ottiene in risposta :
      //  il token da usare per inviare le richieste di api dalla app al google account su cui la app e' registrata 
      // il token viene registrato per successive richieste in token_path
      io = function (code) {// the AUTHORIZATION CODE  entered by terminal, io ask a new token to access user data according the auth aproved visiting authUrl
        //  rl.close();
        console.error('code is ', code);
        oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            console.error('Error retrieving access token', err);
            return;
          }
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          let token_=token;path_=TOKEN_PATH;// def user token file
          if(cli!=DEF){// other user
          tokens[cli]=token;token_=tokens,path_=TOKENS_PATH;
          }
          fs.writeFile(path_, JSON.stringify(token_), (err) => {
            if (err) {

              console.error(err);
              return;
            }
            console.log('Token stored to', token_);
          });
          callback(oAuth2Client);
        });
      }
      let chToken=
        cli!=DEF;// true; // if want to change token
      if(chToken)
       rl.question('Enter the code from that page here: ',io);
      else io('4/4wFYXA-qJ77YxnLzs0G8GNqrJOpByUdfs4SY9A_p2qcRYSVLzKiElaw');
    }


  },
  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */

  listEvents: async function (form) {// returns a promise executing  listEvents_(auth2Cli) 
    //let res_, rey_;// useless 
    if (apicaller) {// at least the def must be present
      // extract qs 
      let cal,auth2Cli;
      if (form && (cal = form.calend));// the calendar account
      
      if(cal!=DEF&&regOath2AuthClis[cal])auth2Cli=regOath2AuthClis[cal];
      else{ 
        // if(cal=='def')
      auth2Cli=apicaller;
    }

     if(auth2Cli) return new Promise(function (res, rey) { //res_ = res; rey_ = rey; 
                                                          listEvents_(auth2Cli,res,rey) });
    }

    function listEvents_(auth,res_,rey_) {// now resolve with { reason: 'runned', rows: ev } . better add a cb to fill a rows result you want from res.data ???

      const calendar = google.calendar({ version: 'v3', auth });// a request obj to run
      calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) {
          rey_(err);
          return console.log('The API returned an error: ' + err);
        }
        const events = res.data.items;
        let ev = '';
        if (events.length) {
          console.log('Upcoming 10 events:');

          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
            ev += start + event.summary + ', ';
          });
        } else {
          console.log('No upcoming events found.');

        }
        // res_(events);
        res_({ reason: 'runned', rows: ev })
      });
    }
  }
}