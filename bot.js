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




var testFunc =  // onChange template seems OLD!!! see dyn_rest_f !

    // CONTAINS ERRORS SEE the updated dyn_rest_f !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // function(res,bot,convo){
    async function  //    (res,bot,convo){// after deserialized 
/* bound with its script so :
// this={excel:     {news:'oggi grande festa dell\'amicizia alle 20 tutti in piscina!' 
                     },
        colazione_dyn:{// used in  associazione a    : {{values.colazione_dyn....}}

                         data:{
                        }
                    }
        }
*/

   // console.log(res);

    (new_value, convo, bot,script,ask)  {// this function will be loaded at cms init with the jsonobj:
// convo.vars=convo.step.values

        // CHECK IT
        // PROBABLY think this func a method of the obj we insert the func : 
        //          >> vars.dynfieldobj so try to set this=vars.dynfieldobj

//
        console.log(' onchange fired for ask ', ask, ' inside my_script: ', script,' context: ',this);

        let script_excel=this.excel,// mnt dyn data 

            // user=  from convo.step.state?
            // user_loc_Map=script_excel.thisdynask.usrMap 
            //      use to find loc of the user : loc=user_loc_Map[user];

            mydata=this.ask.data;

        // matches used by conversation matcher 
        let mat=values.matches, kmat=values.askmatches;


        var answ ;

        // recover where conditional field
        /* row : 0 id
              1 value/nome
              2 patt
              3 descr
              4 data
              5 loc
              6 menu
              7 void
              // 
              8 where
              9 when
              10 how
        */

       mydata=[
        [0,'red','redisdes','red RTCSessionDescription','data','piano1','pesce','void','vaial piano','ore4 ascensore'],
        [1,'green','redisdes','red RTCSessionDescription','oggi branch gratis alle 11','piano2','pesce','void','vaial piano','ore4 ascensore'],
        [2,'blu','redisdes','red RTCSessionDescription','data','piano1','carne','void','vaial piano','ore4 ascensore']
       ];
       let cQ={cval:[],ccol:[]};// query where clauses , cval =values     ccol= column to where 
      //  cQ.cval=[];cQ.ccol=[];
       //values=convo.values;
       function cond(ind,val){
           if(val){
           cval.push(val);
           ccol.push(ind);
           }
       }
       function runQuery(mydata,cq){// find rows in mydata matching/whering columns/value as specified by cq
           rows=[];// rows matching where clauses cQ
           let nd=cq.ccol.length;
           function iterc(val,n){// iterate intersection with n-esima col/values in cq arrays till : add val in rows if match or do nothing  
            // val : cur rows in evaluation , it matches all where in cQ with index n-nd
            if(n<=0){return val;}//val=arow in mydata matches all ( cQ index 0-) where in cQ : so add cur val row to  rows;
            n--;
            if(val[cq.ccol[n]]==cq.cval[n])// if n where clause in cq 
                return iterc(val,n);
            else return null;
           }
           mydata.forEach(function (i,arow){let ret;if((ret=iterc(i,arow,nd))){
                    rows.push(ret);
                    console.log(' querying entity  with where clauses got cursor : ');
                 }
            });// test each item in data entity 
            if(rows.length>0)return rows;else return mydata[0];// anyway returns first
       }
       cond(5,mat.colazione_luogo);// add a intersect/where  on col n 5 with value mat.colazione_luogo
       cond(6,mat.colazione_menu);

      let res=runQuery(cQ);
      //console.log(' querying entity  with where clauses ',cQ,' got cursor : ',res);

      let id=0,name=1,iD;
       iD=name;

        res=res.map(function(i,v){return v[iD]});// calc matching [rows], then returns rows [] with just some cols (1:name)
         console.log( 'querying entity  with where clauses ',cQ,' got cursor names : ',res);;

            
         /// now fils response vars.dynmatches.dyn_rest     .match  e .complete  
         // they will be cheched in condtion with : 
         //      item :   $$$vars.dynmatches.dyn_rest.match  and 
         //      routing instr   $$$vars.dynmatches.dyn_rest.complete

         // now process bl : 
         // case a response by models matched : 
         //     modServ= should 'col'
         //     mod_wh = where/when......
         //     .......
         //     >> each case fills routings and some vars that will be used by following onchange or in msg template 
         //         CAN be used vars.excel.askname.something x dynamic news or
         //                     vars.loopDir.dyn_rest.param2_maxretry  as param x conversation looping behaviour 

         let vars=convo.vars,// = state.values
            askmatches=convo.vars.askmatches,
            matches=convo.vars.matches;

    // GET MODEL MATCH impacting this dyn 
         
            // nb askmatches=convo.vars.askmatches will be completed by condition matching adding fields  

            mydyn=askmatches['dyn_rest']={matched:null,complete:'fail'};// >>>> wwill also filled (matches,nomatches,match) by condition testing after see conversation
            // add dyn_rest match (as a result summary)
            // askmatches.dyn_rest={match:[]};

    // DO BL 
        if(mod_wh=='when'){
            mydyn.matched=['when'];// a summary of the service this bl dyn provides according with its request model 
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_quando';
        }else if(mod_wh=='where'){
            mydyn.matched=['where'];// a summary of the service this bl dyn provides according with its request model 
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_dove';
        }else {// def
            mydyn.matched=['det_full'];// a summary of the service this bl dyn provides according with its request model 

            mydyn.complete='match_full';
        }
        

        if (answ == null) {
            console.log('no answer found ', color);
            bot.say('Sorry, I\'m not sure what you mean');
        }
        else {
            console.log('answer found ', answ);
            convo.vars.colorgot = answ;
            bot.say('ok you got answare :' + answ);
            // try to add dyn a new trhread that can dispatch at a thread or script dynamically 
            // depending on answ
    
        
    }

/* remember mustache function to be called 
    {   // context :
        // .......

        "name": "Tater",
        "out": function () {
          return function (text, render) {
            return "<b>" + render(text) + "</b>";
          }
        }
      }
      
      Template:
      
      {{#out}}Hi {{name}}.{{/out}}
*/
    }// ends testfunc

    var dyn_medi_f =  
    
    
    /* 27022020
    
    **** MNG SUMMARY  this is the method assigned to the dyn bl associated with the dyn_ask dyn_rest . IT Define the onChange cb using dyn_rest as context 

    
    cfg obj = dynJs={ //  bank containing script directive with onChange x script/dynfield-key 


            hotel:{// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

                mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

                excel :{.... } ,

                ,,,,,

                dyn_rest:{// used in  associazione a    :

                        loopDir:{
                        ......

                        },

                        data:
                                [
                            [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','come','08:00','10:00'],
                          ],   
                        onChange_text:testFunc.toString,// without async !! used to build onChange from text def  


                     // >>>> insert here onchange as a module of this obj so can see the fields !
                    onChange:function(new_value, convo, bot,script,ask){
                            return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

                    }

                }






    */


    async function  //    (res,bot,convo){// after deserialized 
/* bound with its script so :
// this={excel:     {news:'oggi grande festa dell\'amicizia alle 20 tutti in piscina!' 
                     },
        colazione_dyn:{// used in  associazione a    : {{values.colazione_dyn....}}

                         data:{
                        }
                    }
        }
*/

   // console.log(res);

    (new_value, convo, bot,script,ask)  {// this function will be loaded at cms init with the jsonobj:
// convo.vars=convo.step.values

        // CHECK IT
        // PROBABLY think this func a method of the obj we insert the func : 
        //          >> vars.dynfieldobj so try to set this=vars.dynfieldobj


        let script_excel=this.excel// mnt dyn data 



          ;//  mydata=this.ask.data;

          // most important var passed is the convo step status and its convo status :
          const stepSt=convo.step,convoSt=stepSt.state,values=stepSt.values;// nb values=convo.step.values==convo.vars

            // user=  values.user;// assigned by the channel
            // user_loc_Map=script_excel.thisdynask.usrMap 
            //      use to find loc of the user : loc=user_loc_Map[user];

        // matches used by conversation matcher 
        // let mat=values.matches, kmat=values.askmatches;

        let // vars=convo.vars,// = state.values
        askmatches=convo.vars.askmatches,/* askmatches={aask:{

                                                                match:'aval',
                                                                matches:[{key:'aval'},{key/ind:oneindex?},,],// models matches  , one routing (std, $$,$$$, no $%) index 
                                                                nomatches:[{key:'aval'},,,],// only models
                                                                ... some onchange added fields , ex : matched complete desire param ...
                                                            }}*/
        matches=convo.vars.matches,// models matches . see ormat at conversation.addMatcRes, convo.vars.matches.amodel={match:itemvalue-key,vmatch:voicenameofitem,data:xqea}
        mustacheF=stepSt.mustacheF;
        var answ ;
// matches.mod_Serv.match must be defined as we here must find a resource of a  group 
if(!matches.mod_Serv.match)matches.mod_Serv.match='col';// the default group is colazione 
console.log(' onchange fired for ask ', ask, ' inside my_script: ', script,' context: ',this);



       function runQuery(mydata,cq){// find rows in mydata matching/whering columns/value as specified by cq ( can also be used the local cQ without use a param !)
        /*   cQ={cval:[],ccol:[]};// init query where clauses , cval =values     ccol= column to where 
        returns :{ind:[3,6,8],rows:[mydata[3],mydata[6],mydata[8]]}
        that is the sql sparql query mapped into procedure template with param
        ex:

        prompt toward a target procedure : chiedi come quando dove avere fare servizio x soddisfare bisogno

        user speech >>> nornal form query template :  when will i can do breakfast at floor 3 ? >>>  target procedure : select time from colazione (desidere) where loc=floor3 

        so user speech prompted toward a set of query template with param can be get as complete normal form query  or param of target procedure are got  

        if user cant got full normal target expected  form will prompt missing param  then try to reproposal a normal form query of a partial target  or 
        just execute the partial query procedure , then prompt for missing param to reproposal the target query set procedure/ normal query format 
        example in colazione :
        - se user dice  vorrei sapere quando posso fare colazione al secondo piano o quando apre il  coffe  al secondo piano 

        posso 
        - matchare un linked data nlp2sparkl trasducer che mi traduce lo speech in normal form then mapped (ex piano 2 > location=piano2)
                into a target sparql query AA 
        o per una parte principale dei target query space AA : 
        ottenere i param del corrispondente procedure che lancia la query equivalente via dialog tree :
        - got param after prompt via single turn entity ai or refining  multiturn ( mi vuoi dare la collocazione ? > piano 2) tree dialog  ,
                > at the end goto thread that check all required param need to go to dyn_ask that run ( the equivalent to AA) procedure 


        */
        console.log(' query running  cq is : ',cq);
           let rows=[],ind=[];// rows matching where clauses cQ
           let nd=cq.ccol.length;
           function iterc(val,n){// iterate intersection with n-esima col/values in cq arrays till : add val in rows if match or do nothing  
            // val : cur rows in evaluation , it matches all where in cQ with index n-nd
            if(n<=0){return val;}//val=arow in mydata matches all ( cQ index 0-) where in cQ : so add cur val row to  rows;
            n--;
            if(val[cq.ccol[n]]==cq.cval[n])// if n where clause in cq 
                return iterc(val,n);
            else return null;
           }
           mydata.forEach(function (arow,i){let ret;
            if((ret=iterc(arow,nd))){// test if arow satisfy all cq where clauses on its columns 
                    rows.push(ret);ind.push(i);
                    console.log(' querying cur  entity:  row ',i,' satisfy the where clauses cQ  ');
                 }
            });// test each item in data entity 
            if(rows.length>0)return {ind,rows};
            
            // PP else return rows[0];// anyway returns a default
            else return {ind:[0],rows:[rows[0]]};// anyway returns a default
       }




       /* STATUS MNG 
       > put in appSt. in this impl we keep the user status in state 
       
       remember in corejs in botkit constructor we registered :
       dialogState = this.conversationState.createProperty(this.getConfig('dialogStateProperty'));
       dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);
       dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);// the dialog def, 
       in dialogset dialogstate is state property used to persist the sets dialog stack.
       when botkit in handleturn  ask a dc  
        handleturn(){
            .....
            
            dc=dialogset.createContext(turnContext);
                in dialogset ( that has as field dialogState):
                createContext(context) {
                    state_ = await this.dialogState.get(context, { dialogStack: [] });// ask session mng to store  var named dialogstack associated with context=tc
                        >>>> probably tc is tyed with userid so 
                    return .DialogContext(this, context, state);

                        so in in dc this.stack = state.dialogStack=[{id: dialogId,state: {}},,,,] 
                        state is the top stack current convo with convoid=dialogId
                }
        }

        to save the state we do :
            conversationState.saveChanges(tc);
            so the state_ , tied to tc,  will be saved

        >>>> so 
            a) if we wanted to add app status related to tc we must add a property  and register a appstatus obj tied to tc or a part of it 
            OR 
            b) if we want to be tyed to tc like dialogstack we can use the same 
                so just add a appstatus to state={appstatus,dialogStack: [] }

            probably just state.appstatus={.....} 


       */

        /* a);
            const appState = this.conversationState.createProperty('ds');// 
            this.dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);
            ,,,,,,,
        */
       // b) :

       let dialogState=bot._controller.dialogSet.dialogState;// =

       // or directly
       // somewere before :
       let state = await dialogState.get(convo.dc.context, { dialogStack: [] });
       state.appstatus={appSt:'ok',dyn_match:{}};// status a livello app . per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']

       // here as start :
       values.appSt=state.appstatus;// make available in current convo the appState
       // better  wen before are moved to begin :
       // this.appSt=await dialogState.get(context);


      
                        // from related gathered  matched models  choose the qs/queryclauses to run 
 
        let mod_wh,// the model that define the bl out result .
                    // puo riferirsi al modo di elencere le medicine da prendere o ai dettagli da dare per facilitare un problema di assunzione
                    // nel caso decidessi di cambiare grouprisorsa (col/rest si puo lascire il mod_wh corrente)
                    // nb convo.vars.matches.amodel={match:itemvalue} , see addMatcRes
        def=false;

       // >>>> will also filled (matches,nomatches,match) by condition testing after,  see conversation
      
       let mydyn=askmatches[ask]={matched:null,complete:'fail'};// SAREBBE il qs da passare al next page ! E' STATUS A BREVE . se lo span e app allora usare state.appstatus
                                                                    // NB match as ask key matching statu ( match/no match ..) , the model item match is put :
                                                                    // - vars.askmatches.paam.match  if status for next thread ( like qs of next page load) 
                                                                    // - vars.appstatus
       let mydata;

        let infl_view;// the thread to display the results : now can have 2 values : std resource view  and qea ( still to implement )

        let mod_qea=matches.mod_qea;// mod_qea={match: "gotqea", vmatch: "setinexcel"}

        if(mod_qea&&mod_qea.match&&mod_qea.data){// QEA 
           // here must be :  infl_view==2
           infl_view=3;// TODO  to implement jet 

    // the $$mod_qea:coded patts, so following apatt items  will be launched by conversation and tomatch=step.result regex will run against the regex patt:
         // ttest returns tomatch.match(new RegExp(apatt, 'i')) that is 
         mydata=mustacheF.qeA(matches.mod_qea.data);// the desire master entity : has inflated all detailed/querred desires entities to give 
         // proposal : qea algo will fill a inflacted master desire context  mydata={xdata-contextinflactedmasterdesireentity, qeaaction,answere:qeaspecificdetaildesireresult}
            //   xdata-contextinflactedmasterdesireentity is one of the managed desidere/context managed by view/threads associated to xdata of the dyn_ask

            if(mydata){
    // DO BL 
       // bl will put its status changes/pamab inside dyn obj mydyn :
       mydyn.matched='match';// match as dyn ask , the matched model item match is put in mydyn.param.match   or if a app status in 
       



       mydyn.param={};// a summary of the result of the service this bl dyn provides 




            mydyn.param.item={qea:{item:mydata}};// qa a single response from qea the result of a db/sparql query : an action with data (usually display some data)


       // usually the desire obj is one of the managed view ( x_data )rootable by this ask , 
       // so qea will route to a  managed view as mod_wh does but the answere is not a item=xdata[matindex] fields but item.answere




           state.appstatus.dyn_match={};state.appstatus.dyn_match[ask]={match:mydata};// ??

            mydyn.param.desired=mydata.answere;
            mydyn.complete=mydata.qeaaction;//'qeaaction';// route to the answere display (action related)  and context summary then propose new action 
            // root to content view x qea
            }else{
                mydyn.complete='qea-noanswere';
                }

        }else {// No QEA , output defined by : matches.mod_wh




            infl_view=0;// def : case generic,col,......


        // recover where conditional field : here field are the coffe to do colazione 
        // so iside cen be put some bl field with orari ... come raggiungere ... promo specifiche del coffee
        /* row : 0 id
              1 value/nome
              2 patt
              3 descr
              4 data
              5 loc
              6 menu
              7 void
              // 
              8 where
              9 how
              10 when from
              11 when to 
        */


        // mydata=data model : a desire master tab + 2 join tabs .same query join procedures, out views  depending from  infl_view
        // master desidere tab are pre inflatted to make easy things !
        // now from this onchange input params , that will define this dynaskonchange logic, :
        //      - related askmatches routing matches (indexmatches)
        //      - and related input model matches 
        //     > calc the params and the  view (infl_view) that will route to threads/msg that  displays the action/desired entity related info  

        // infl_view;// the thread to display the results 


            /*   >> now all data in a group has same format ( restaurant, colazione , lavanderia ) 
            // now consider another entity bu same db query procedure but different join properies so will change the inflacted/populated in bl fields
            // if(matches.mod_wh){if(matches.mod_wh.key=='rest'){
                if(matches.mod_Serv&&mod_Serv.match=='col'){
                
                mydata=this.rest_data;// the desire entity : has inflated all detailed/querred desires entities to give 
                infl_view=1;// rest like view, 0: col view
            }else {// the std desire master entity , colazione 
                mydata=this.data;// the desire entity : has inflated all detailed/querred desires entities to give 
                infl_view=2;// rest like view, 0: col view

            }*/
     
            mydata=this.med_data;// the desire entity : has inflated all detailed/querred desires entities to give 
            infl_view=2;// no more used , all resource select hans in same data matrix , same format 
     
     
     
     
     
            /*           [
                         [0,'terace','redisdes','red RTCSessionDescription','data','piano1','pesce','void','vaial piano','come','08:00','10:00'],
                         [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11','piano2','pesce','void','vaial piano','come','07:00','10:00'],
                         [2,'outside','redisdes','red RTCSessionDescription','data','piano1','carne','void','vaial piano','come','09:00','10:00']
                        ]
            
            
            
            */
            let cQ={cval:[],ccol:[]};// init query where clauses , cval =values     ccol= column to where 
           //  cQ.cval=[];cQ.ccol=[];
            //values=convo.values;
            function cond(ind,val,cq){
                // val added to cq.cval=[]=[val7oj,val9obj], val is usually a string
                // ind added to cq.cind=[]=[7,9]
                if(val&&cq){
                cq.cval.push(val);
                cq.ccol.push(ind);
                }
            }





      // REMEMBER THE DESIRE ENTITY JOIN FIELD simple realization :

                                       /*  *******    master/desire entity simple relation with ask conditional described as $$ 

                                          the entity/model should be  is defined somewhere (in excel ...)
                                          in this very simple implementation the view is not bind to the model ( id/name/voicepattern/shortdescriptio)
                                          but just set by $$ condition munually copyng the name/pattern field 
                                          in future we should do $$mod:areference on the model description file set somewhere in 
                                              the model/field dialog description bind to a static (file) descriptio or to a dyn db schema
                                          here the where model are just the space of a relational where entity put directly in a col of master entity ( desire entity)
                                              whith its id or name ( both are key)
                                          so to make sintetic : $$....reflect the name-voicepattern of a implicit model whose id/name is put in a where field of the related master desire entity
                                    ******
  

                                */
    /*  *******    master/desire entity simple relation with ask conditional described as $$ 

  

        #####//#endregion

                        
        in ve , confirm to client we are doing a target query and  ask the query param we have not got in the past
        
        , so we gather from the user speech answere : 

        - check and prompt the user till get all the param we need o run the query , ex :
                - mach for 2 where table that is related to the target query  
                - after extract other param to do a fts/qea query of a master with 2 join
        - do the query and ask to refine the query till got the selected item/obj so route to next dialog desponding from that sel obj 
                    simply read a bl field ( othe out param recoverd from user speech) extract param from obj and put in app status, then route to next thread )

         now imagine that we add the possibility to get from user instruction to choose also the target query on a predefined set 
            > so come to a normalized correct query utterance that the user can say to request the target query (equivalent to the target query that we do after promting for param)

            >>>>  than  we implement the  predefined procedure with usual query building or using the nlp2sparq methods and compare the different tech 

         then we can also pretend to get from user a more general query , 
         so when recognise  it with a regex we can (instead of doing the usual param collection) we can directly build the query procedure as nlp2sparql and 
         > come to the same dyn_ask of the compatible query in the set 
            ( the compatible target query of which the general query is a subquery )
            - to manage selection , refine some other staff and manage the next action/route

            nb if the gneral (sparql) query is not perfectly recognized we can goon with usual param collection and if the user insist with the direct query we can use past param
            to build the correct direc query 

            ex quale opere murarie sono state fatte nel 5 secolo e da chi ?
             risposta query general : le opere murarie sono state fatte da mario e sono argini di terra .
                si pasa poi al target query ( raccoglie tutte le questin su opere relative al tematrattato in una sala) xhe dira :
                 piu in generale il tema x e trattato nella sala y sul percorso dove si espone il concetto y  che attiene alla tua domanda specifica 
                 li nella sala ....   ti interessa sentire gli altri concetti della sala o vuoi andarci o vuoi continuare lla visita nel corrente posto dove sei ?
                 
                 il query target e' vuoi sapere cosa trovi nella sale relativamente ai percorsi proposti ? vuoi sapere i concetti esposti o qualche concetto paricolare 
                    se vuoi mi puoi fare una domanda su un concetto particolare ad esempio .....qualche entita / relazioine interessante .....
                 o 
                vuoi sapere dove si tratta un certo concetto ?


                nb differenza tra qea e query sparql e' che nel query sparql si querano  entity coinvolte nelle domande , nel qea si vuole beccare l'intent che 
                verra trattato con nuovo dialogo per fare query specifica sulle entita  di cui l'intent e' articolato ( o si da una risposta generica per vedere se e sufficiente)
                es  vorrei sapere il colore delle macchine  , con entity :   hai una macchina di colore rosso/verde/gialla  > hai una macchina rossa/verde/gialla


            altro ex piu generale 
            ........


        nb here for semplicity we build the query ( a desire/master table joined with 2 entity  and a selection (wanted out)  of only desire bl col or a limitated optional 
            cols of the joined table)) answere without a db but :
            - just work on a desire table pre inflacted/(in mongoose populate)  , so for example we have the menu cols filled with the 
                 array or csv name of related n:m where table or  the joined query select field 
            
            example select coffee.descr menu.data where (join_n:m coffee with menu)   

                prompt : so tell me what do you want to know from a coffee risorce at the hotel that you want to go 
                user i'd like to known the menu of the coffee at 3th floor named mario's this evening  
            and as param from user speech we get the ask that match the user output  'what menu' : so in the query rows result i ave the cols 
                    location , name and a col with the inflated menu description just in case the user want that col of the joined menu 


        #####
    */


       // >>>>>>> example from user or colazione_luogo filled get loc or set the default hall location piano2
       let loc; // the id/name item instance of a join/where field (1:N) 
                //implemented in one col of master/desire Entity (mydata matrix)

                // debug . to semplify a  match must exist ! > in future manage the event
       if(matches.mod_loc&&(loc=matches.mod_loc.match)){
           // loc=matches.mod_loc.match;//else loc='piano terra';
            cond(5,loc,cQ);// add a intersect/where clause on col n 5 with instance id/value loc
        }
       if(matches.colazione_menu)cond(6,matches.colazione_menu.match,cQ);// future use
       // anyway we must select a group resource ( colazione , ristorante ,,,,):
       cond(13,matches.mod_Serv.match,cQ);

       // 2502 return null ??
      //  ask='dyn_rest',
       let singleRes=false;//results must be condensed to only 1 result
      let res=runQuery(mydata,cQ);// res={ind:[3,7],rows:[mydata[3],mydata[7]]}// must be not nulll because in any case we set a location default
      //console.log(' querying entity  with where clauses ',cQ,' got cursor : ',res);



      let id=0,name=1,iD,
      nres=0;// matchings rows
       iD=name;


       if(res&&(nres=res.rows.length)>0)

        {//desire entity should be not null  , set anyway a default 

            // resNam is the array containing the col name of matrix rows 
        let resNam=res.rows.map(function(v,i){return v[iD]});// calc matching [rows], then returns rows [] with just some cols (1:name)
 
        console.log(' querying entity  with where clauses ',cQ,' got cursor rows : ',res);
        let blRes,blResItem,blResNam;
        let gr;


         /// now fils response vars.dynmatches.dyn_rest     .match  e .complete  
         // they will be cheched in condtion with : 
         //      item :   $$$vars.dynmatches.dyn_rest.match  and 
         //      routing instr   $$$vars.dynmatches.dyn_rest.complete

         // now process bl : 
         // case a response by models matched : 
         //     modServ= should 'col'
         //     mod_wh = where/when......
         //     .......
         //     >> each case fills routings and some vars that will be used by following onchange or in msg template 
         //         CAN be used vars.excel.askname.something x dynamic news or
         //                     vars.loopDir.dyn_rest.param2_maxretry  as param x conversation looping behaviour 

                // GET MODEL MATCH impacting this dyn 
         

            // add dyn_rest match (as a result summary)
//            askmatches.dyn_rest={match:[]};




    // DO BL 


            // mng OVERVIEW 
            // .matched the dyn query process result 
            // .param   the query match(es) , can be a single selected match or cursor or a cursor waiting to be selected by a selection resolver ask
            // .param.group : a sub view of item matched that is specialized according to its class ( the resorce class) 
            //  if the class is unique is just the projected view param to display   


       // bl will put its status changes/pamab inside dyn obj mydyn :
       mydyn.matched='match';// match as dyn ask , the matched model item match is put in mydyn.param.match   or if a app status in 
       



       mydyn.param={};/* a summary of the result of the service this bl dyn provides : vars={,,,askmatches:{,,,dyn_rest:
       
                                                                                                                        //mydyn=
                                                                                                                        {
                                                                                                                         match: ,complete: ,
                                                                                                                         param:{} // =mydyn.param
                                                                                                                        }
                                                                                            }}


                    example in teplate use : {{vars.askmatches.dyn_rest.param.match}}
                    */

        mydyn.param.group={};// view  transformation 

       //now  here update it  
       // so in template we can recover a copy put in vars.appSt.dyn_match.dyn_rest.match[6]
       state.appstatus.dyn_match={};state.appstatus.dyn_match[ask]={match:blResNam};// has meaning only if 1 match


        // AFTER GOT results build the group (query as a whore ) context (gr )/view (.complete will route to )
        // - a cursor with rows res.ind.length >1 
        //   or 
        // - a single result 

            if(singleRes||res.ind.length==1){// consider 1 match
                nres=1;// 1 match selected  
         blRes=res.ind[0];// the index of row 0 in data
         // PP blResItem=res.rows[0];// just take first index (in mydata matrix)
         blResItem=res.rows[0];// just take first index (in mydata matrix)
         blResNam=resNam[0];// just take first index (in mydata matrix)






            // if 1 match  surely there is one class (here the resouce type :matches.mod_Serv.match)and related  group 
            if(matches.mod_Serv&&matches.mod_Serv.match){
                cQ={cval:[matches.mod_Serv.match],ccol:[1]};// the group model Gdata has a view projection to match : mod_Serv
                                                            // mod_Serv , in this simple impl , is just defined in condition , but it should be a projection of  Gdata
                                                            // so let the vname be the same ( )
            } else  cQ={cval:[blResNam],ccol:[1]};// ?? dont use that
            let grows=runQuery(this.Gdata,cQ);

            if(grows&&grows.rows){gr=grows.rows[0];// should be 1 row
                gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

            }


// make sense to fill sel and def only if we got first row of cursor, other wise just fills mydyn.param.cursor={matches,patt,data} !



            let isStd;
            if(blRes==gr[4]) isStd=true;else isStd=false;
    
            if(!isStd)mydyn.param.group.def={item:mydata[gr[4]]};// as index not string 
            // nb :  mydata[blRes]==res.rows[0];
            mydyn.param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
            // nb  nb different from a non dyn ask !!! see mng summary in addMatcRes() in conversation.js 
            mydyn.param.match=blResNam;//=blResItem[1];//  name 
            mydyn.param.vmatch=blResItem[12];// voice name 
    
            mydyn.param.templatef={};// template flag to add specific parts depending from the match
    
            if(mydata[blRes][0]==1||mydata[blRes][0]==2)mydyn.param.templatef.ishall=true;//(the default , so in template use this flag to not repeat default suggestion )
    

        }else{// many query results : a cursor with more rows : fills cursor


        /* - CASE  medicine  : 
    
        >>>  from mod_assumere_med scegliere this.Gdata[i] che descriverà il cursor medicine list overview view 
        $$mod_assumere_med one of: [no,contr,prendere,ok]
        */
        // for example as done below :     if(matches.mod_assumere_med.match)if(this.Gdata)gr=this.Gdata[0];



                /* ongoing the cursor can be passed to a resolver ask that will find a single match , so will complete the setting of :

                param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
                param.match=blResNam;//=blResItem[1];//  name  ex 'caffe top'
                param.vmatch=blResItem[12];// voice name 

                    but the resolver could not set  at group level projection (resuouces/class name and vname of matched item  ):

                                    param.group.name=gr[1];// example col or rest 
                                    param.group.vname=gr[5];// example colazione or ristorante
                    >> so group in case of a cursor (many matches ) will be a unique class independent from specific matched rows !!!!
                */



            nres=res.ind.length;
            //let cursor=res.rows.map(function(v,i){return v[iD]});// calc matching [rows], then returns rows [] with just some cols (1:name)
            mydyn.param.match=mydyn.param.vmatch=null;// nb different from a non dyn ask !!!
            //mydyn.param.cursor={rows:res.rows,resModel:{},data,param} ;// or use a arrays projection name and patt 
            let resModel={},medSyntL=[];
            mydyn.param.cursor={rows:res.rows,resModel,medSyntL} ;// data useless, rows is enougth. 
                                                            //  projection resModel is result as model to select (can also use a arrays projection name and patt )
            /*
            resModel={val1:{
                patt:regexstr,
                vname:'pippo' // set as array also in medSyntL x list in template
                }
            }*/
            res.rows.forEach(function(v,i){medSyntL.push(v[12]);resModel[v[1]]={patt:v[2],vname:v[12]}});// calc matching [rows], then returns rows [] with just some cols (1:name)
// gr does not have meaning unless just a default or unique chars 

            if(matches.mod_assumere_med.match)// == anyway choose item 0 temporely, possible values : [no,contr,prendere,ok]
                                            //  &&mod_wh==.......






            /*  ************* 15042020  GR MANAGEMENT SUMMARY 
                gr : the context for master summary view : displays the query result as a whole exponing user navigation on the inflacted master desire  kb subspace
                    if some ask select a item on curson it will se  
            
                example of strategy : the query will get a cursor of rows of the same class/resource_type/serviceofferedtocustomer =matches.mod_Serv.match
                        >  usually a query is about a specific class , that can be available as fields of (inflacted master resource instance) rows!
                - each class has a Gdata[i] context and the .complete will :
                    - route to proper template (organized under its (sub)root thread YYUU) rendered using  context param/models (set before and here) to show/navigate desideretree to show info requested  ( many  level 1 2 !..)
                - the template has context param organized in levels , so 
                        - depending from some user expectation priority like confirm or discover specific details 
                            we can route to thread displayng the expectation tree using .complete 
                        - inside the specific thread the user can be focalized to some info looking at  a low level context param like mod_wh
                                    ?? we can have some outcontext ( desidere focus on sub outcontext available x the specific class ) , ex : mod_wh
                        - anyway we have exposed also some other outcontext that the user can explore after current outcontext (YYUU) root thread
                    to guide the user to navigate on specific  cursor got by  the query 
                the view to summary rows result(s) into a summary based on some selected rows properties

                inside the view/msgstep articulater under root YYUU can be view displayng info about the cursor or some specific item selected by some ask during the user navigation (just previuos )
                - to display cursor works on 
                - to display    a singlre item
                > nb  specific item can be selected by some ask during the user navigation (just previuos )
            */


            // IN THIS IMPLEMENTATION all rows has the same group/resourcetype = matches.mod_Serv.match
            //  and that is reflected on associated gr : 
            // so as a single row case :
            if(matches.mod_Serv&&matches.mod_Serv.match){
                cQ={cval:[matches.mod_Serv.match],ccol:[1]};// the group model Gdata has a view projection to match : mod_Serv
                                                            // mod_Serv , in this simple impl , is just defined in condition , but it should be a projection of  Gdata
                                                            // so let the vname be the same ( )
            } else  cQ={cval:[blResNam],ccol:[1]};// ?? dont use that
            let grows=runQuery(this.Gdata,cQ);
            if(grows&&grows.rows){gr=grows.rows[0];// should be 1 row
                gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

            }





            if(this.Gdata&&!gr)gr=this.Gdata[0];// std resource/service : matches.mod_Serv.match='col'

            /* todo 
            so in a resolving_dyn_ask we in msg will list the vname to match ( like we list the missing entities ): resModel[].vname
            then in condition test user answere against the model : resModel[].patt using $$thedynquery_ask:; in next msg we can have :

                                                        rename group.sel > select 
                                                        param.match and  param.vmatch   > selValue and sel_ItemName
            {{vars.askmatches[resolving_dyn_ask].param.group.sel[i]}} as row col value of selected row quered in onchange of key='thedynquery_ask'
            {{vars.askmatches[resolving_dyn_ask].param.match}} as value of selected query res item
             {{vars.askmatches[resolving_dyn_ask].param.vmatch}} as vname of selected query res item

            mydyn.param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)

            mydyn.param.match=blResNam;//=blResItem[1];//  name 
            mydyn.param.vmatch=blResItem[12];// voice name 
            */

          
          }




        if(matches.mod_wh)mod_wh=matches.mod_wh.match;


        // set group x general detail view 
        // find a group uding g_data  
 
        
        /*
1 value/nome
2 best
3 calce
4 defIndex

5 voicename vgroup
        */
        
 if(gr){// the choosen summary template Gdata[i] should be chosen basing on rows content !
     
    // NB if we matched a cursor :mydyn.param.match=null;mydyn.param.cursor={matches,patt,data};//  NB a matches is ARRAY with false/true (match) not the instane name

    /** ricorda , col descrive come dare la lista l funzione del tipo group scelto dallo use , potrebbe essere pills o trattamenti ! 
     * qui si assume col==pills:
     * [
[0,'col','il tuo programma prevede di assumere le seguenti pastiglie ',' avverti l'operatore se hai problemi collaterali, ultimamente l'aspirina e' da preferire sciolta prima di ingiarla. ',1,' pastiglie ','  quando è aperto e come arrivarci',' ricorda anche che devi fare dei prelievi di urine'],
[1,'rest','master shef cucina internazionale','si prega prenotare per menu pesce ',1,'ristorante','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
     */

        mydyn.param.group.name=gr[1];// just interna value , should be pills
        mydyn.param.group.vname=gr[5];// pastiglie
        mydyn.param.group.best=gr[2]; // pre lista
        mydyn.param.group.calce=gr[3];// avvertenze per medicine particolari o intolleranze generiche relative alla lista user e pills , dynamic !
        mydyn.param.group.what=gr[6];// prompt per ulteriori detail di aiuto all'assunzioine, come lista o come specifico di una pill ??
        mydyn.param.group.nextserv=gr[7];



        // obsolete if( mydyn.param.group.sel)mydyn.param.group.isdef=true;else mydyn.param.group.isdef=false;// seems ok , ? to do 
        mydyn.param.group.vgroup=gr[5];
        //, mydyn.param.group.nextserv={list:['colazione','lavanderia']}};
 }



        // >>>>  set bl result param also if mod_wh ( output desidered ) is not set :
    /* updates >>>> no more to use , will be available via row access 
        mydyn.param.news=mydata[blRes][7];
        mydyn.param.from=mydata[blRes][10];// blRes='hall'
        mydyn.param.to=mydata[blRes][11];
        // mydyn.param.match=mydata[blRes][12];// voice name 
    */


        // >>>>  set bl result param also if mod_wh ( output desidered ) is not set :
        // ???


    /* old staff 
        if(infl_view==1) mydyn.param.item={col:{item:mydata[blRes]}};// col-std
        else  if(infl_view==2) { mydyn.param.item={res:{item:mydata[blRes]}};// rest
        // impossible : else  if(infl_view==2)  mydyn.param.item={qea:{item:mydata[0]}};// qa a single response from qea the result of a db/sparql query : an action with data (usually display some data)
                                                                        // item={action,data1,data2}
                                                                        // usually the desire obj is one of the managed view ( x_data )rootable by this ask , 
                                                                        // so qea will route to a  managed view as mod_wh does 
        }else  mydyn.param.item={gen:{item:mydata[blRes]}}; // residual
        */

    /* - CASE  HOTEL/Musei query : usually get the main resource instance and display a wiew to give info according with mod_wh

        // now prepare different context x different answere views to explain/respond to questions 
        // x=matches.mod_Serv.match  con be col (colazione) , res (ristorante),,,,,,
        // {{vars.askmatches.dyn_rest.param.item.x}} so only one x (col or res colazione restaurant)  is not null and i can test to  display the specific choice {{#vars.askmatches.dyn_rest.param.item.x}} 
 
     // ??  mydyn.param.item={};mydyn.param.item[matches.mod_Serv.match]={item:mydata[blRes]};// ex : mydyn.param.item.col.item =data[i] ( a col data row) or  mydyn.param.item.res.item =data[i]  ( a res data row)
     // ??  mydyn.param.item={item:mydata[blRes]};// new way , use if to do a group view 



     // now in param we put all data to render the query results , usually depending on resulting rows and other model to define the output required on the 
     // knoledge base space ( the navigating space is a inflating of some knowledge base linked subtree )




     // now fills context relevant to render the correct view triggered    by mydyn.complete
     // most important is the view thread , defined by mydyn.complete
     // view and related context will display the query results ,
     // query will be pre build so we can choose the query using user selection on model gathered
     // or will be generated by looking at wh, do some regex or qea to find the linked desire and choose a field on desire to render the answere to wh asked 
     // or just a sparql result to be rendered 
     // after query displayed continue saying seems you interested on some linked info to uor main desidere specifically about subject 
     //  say soming generaòl about subject specically some that related wh request then goon asking other detail on current maaster desire (medicine)
     // or group selected and goon 

     // desidered output: mod_wh.match
     // other info got in some model  like tipo risorsa : 
     // desidere linked to wh , like   for example who is painted , who painted , who paid , 
     // sub property of wh , like how  take, get , prepare, manage delay ....
     
        if(mod_wh&&mod_wh.match){
           let mat=mod_wh.match;
        if(mat=='when'){
            mydyn.param.desired='when';// ['when']// the prpoperty more important to give: when  something is somewhat
            mydyn.param.when=mydata[blRes][8];// e/o mydyn.param.wh=mydata[blRes][8];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_quando';
        }else if(mat=='where'){// try to use same view of how just set a different flag for mustache 
            mydyn.param.desired='where';//['where'];
            mydyn.param.where=mydata[blRes][8];// 8???? // e/o mydyn.param.wh=mydata[blRes][8];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_dove';
        }else if(mat=='how'){
            mydyn.param.desired='come';//['come'];
            mydyn.param.how=mydata[blRes][9];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_come';
        }else def=true;}else def=true;

        if(def){// def
            mydyn.param.desired=['det_full'];
            mydyn.complete='match_full';
        }

        */

            /* - CASE  medicine  : 
    
        >>>  from mod_assumere build cursor medicine list overview view with 
        // now prepare different context x different answere views to explain/respond to questions 
        // x=matches.mod_Serv.match  con be col (colazione) , res (ristorante),,,,,,
        // {{vars.askmatches.dyn_rest.param.item.x}} so only one x (col or res colazione restaurant)  is not null and i can test to  display the specific choice {{#vars.askmatches.dyn_rest.param.item.x}} 
 
     // ??  mydyn.param.item={};mydyn.param.item[matches.mod_Serv.match]={item:mydata[blRes]};// ex : mydyn.param.item.col.item =data[i] ( a col data row) or  mydyn.param.item.res.item =data[i]  ( a res data row)
     // ??  mydyn.param.item={item:mydata[blRes]};// new way , use if to do a group view 



     // now in param we put all data to render the query results , usually depending on resulting rows and other model to define the output required on the 
     // knoledge base space ( the navigating space is a inflating of some knowledge base linked subtree )




     // now fills context to be rendered by template/view triggered    by mydyn.complete calculated moslty from mod_assumere_med=[no,contr,prendere,ok]
     // most important is the view thread , defined by mydyn.complete
     // view and related context will display the query results , that is a list of rows resulted by the main bl query

     // user can be intrerested eventually to see at some linked property tied to 
     // - the list itself , ex : i want to know where are or how prepare the medicine to take 
     // - some specific pills 
     // so we can o subquery on specific pills or on the list as a whole

     // THE linked property can be querred using 3 method :
     // 1:
     //     query will be pre build so we can choose the query using user selection on some menu item proposed or
     // 2 :
     //     will be generated by looking at wh, do some regex or qea to find the most probable linked desire and choose a field 
     //         on desire to render the answere to wh asked or
     // 3: 
     //     just a sparql result to be rendered 

     // after query displayed continue saying seems you interested on some linked info to uor main desidere specifically about subject 
     //  say soming generaòl about subject specically some that related wh request then goon asking other detail on current maaster desire (medicine)
     // or group selected and goon 

     // 2 level desidered output inside a 1 level templateview related to mydyn.complete : mod_wh.match
     // other info got in some model  like tipo risorsa : 
     // desidere linked to wh , like   for example who is painted , who painted , who paid , 
     // sub property of wh , like how  take, get , prepare, manage delay ....
     */

        // principale rooting mod is mod_assumere_med (=[no,contr,prendere,ok])then change list focus on mod_wh !!

/*
master view will be chosen from available view 1..n routing 2 level depending on mod_assumere_med and mod_wh
view 1 : lista con details (depending sub lev  ( a/b) depend by  ) e 2 (mod_wh)
view 2 : 2 precise list to confirm
mod_assumere_med=[no,contr,prendere,ok] e' outcontext 1-2 level 
no : 1.a devo assumere dammi lista
contr : 1 b : ho assunto dammi solo rapido check list
prendere : 2 precise list after a confirmation iif i really need the list or i have some problem before take the pills ,
        
ok , ctrl : view 1 b version then fddetail if user fill mob_wh  


*/ 
        // FROM :
        //      gr , that is matches.mod_Serv.match  
        //          or
        //      mod_assumere_med 
        //  >>>  definire .complete che mi portera a un view thread che gestira le varie best wanted info customer needs 



        if(matches.mod_assumere_med){// &&mod_wh&&mod_wh.match){
           let mat=matches.mod_assumere_med.match;
        if(mat=='contr'||mat=='no'){// to check or anyway to prompt list (contr= controllare lista )
           // mydyn.param.desired='miss';// ['when']// the prpoperty more important to give: when  something is somewhat
            // mydyn.param.when=mydata[blRes][8];// e/o mydyn.param.wh=mydata[blRes][8];

            mydyn.param.info= null;//info to display func of mod_assumere_med and mod_wh ????

            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='miss';
        }else if(mat=='ok'){// try to use same view of how just set a different flag for mustache 
            //mydyn.param.desired='where';//['where'];
            // mydyn.param.where=mydata[blRes][8];// 8???? // e/o mydyn.param.wh=mydata[blRes][8];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='tkn';// seems surely taken so just confirm 
        /*}else if(mat=='how'){
            mydyn.param.desired='come';//['come'];
            mydyn.param.how=mydata[blRes][9];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_come';*/
        }else def=true;// prendere , the least define will need a dedicated re-enquiring thread
        }
        else def=true;

        if(def){// def
            //mydyn.param.desired=['det_full'];
            mydyn.complete='miss';// todo
        }


        // *****   single selection context/view :
        // if i dont want to specialize all views mapped by .complete in 2 case : many/single row 
        //      using flags :   {{...mydyn.param.group.sel}} , or {{...mydyn.param.match}}
        //  >> i can route to a single result view in which i can specialize using flags on :
        //          {{matches.mod_Serv.match}} or  {{mod_assumere_med}} 
        



        // SO the routing thread that display the info will refears to :mydyn.param.qsparam    ??

        // nb mydyn.match is the match on condition 


         console.log(' dyn_rest bl ended with short span qs vars.askmatches.dyn_rest.param : ',mydyn.param,'\n and vars is : ',convo.vars);
         if(state.appstatus&&state.appstatus.dyn_match&&state.appstatus.dyn_match[ask])
          console.log(' and app status update   values.appSt=state.appstatus,  state.appstatus.dyn_match.dyn_rest : ',state.appstatus.dyn_match[ask]);
        }// ends desire entity 
        else{// no desire entity got , error ,(a def must anyway exists)
            console.error(' ERROR : a query can not find even a default row , lease manage with an exit error');

    }
            }// ends No QEA
    // Cancel any GOON text from previous user answere 

    convoSt.userTurn=null;

        
    /*
        if (answ == null) {
            console.log('no answer found ', color);
            bot.say('Sorry, I\'m not sure what you mean');
        }
        else {
            console.log('answer found ', answ);
            convo.vars.colorgot = answ;
            bot.say('ok you got answare :' + answ);
            // try to add dyn a new trhread that can dispatch at a thread or script dynamically 
            // depending on answ
    
        
        }*/

/* remember mustache function to be called 
    {   // context :
        // .......

        "name": "Tater",
        "out": function () {
          return function (text, render) {
            return "<b>" + render(text) + "</b>";
          }
        }
      }
      
      Template:
      
      {{#out}}Hi {{name}}.{{/out}}
*/
    }// ends dyn_medi_f


    var dyn_rest_f =  
    
    
    /* 27022020
    
    **** MNG SUMMARY  this is the method assigned to the dyn bl associated with the dyn_ask dyn_rest . IT Define the onChange cb using dyn_rest as context 

    
    cfg obj = dynJs={ //  bank containing script directive with onChange x script/dynfield-key 


            hotel:{// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

                mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

                excel :{.... } ,

                ,,,,,

                dyn_rest:{// used in  associazione a    :

                        loopDir:{
                        ......

                        },

                        data:
                                [
                            [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','come','08:00','10:00'],
                          ],   
                        onChange_text:testFunc.toString,// without async !! used to build onChange from text def  


                     // >>>> insert here onchange as a module of this obj so can see the fields !
                    onChange:function(new_value, convo, bot,script,ask){
                            return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

                    }

                }






    */


    async function  //    (res,bot,convo){// after deserialized 
/* bound with its script so :
// this={excel:     {news:'oggi grande festa dell\'amicizia alle 20 tutti in piscina!' 
                     },
        colazione_dyn:{// used in  associazione a    : {{values.colazione_dyn....}}

                         data:{
                        }
                    }
        }
*/

   // console.log(res);

    (new_value, convo, bot,script,ask)  {// this function will be loaded at cms init with the jsonobj:
// convo.vars=convo.step.values

        // CHECK IT
        // PROBABLY think this func a method of the obj we insert the func : 
        //          >> vars.dynfieldobj so try to set this=vars.dynfieldobj


        let script_excel=this.excel// mnt dyn data 



          ;//  mydata=this.ask.data;

          // most important var passed is the convo step status and its convo status :
          const stepSt=convo.step,convoSt=stepSt.state,values=stepSt.values;// nb values=convo.step.values==convo.vars

            // user=  values.user;// assigned by the channel
            // user_loc_Map=script_excel.thisdynask.usrMap 
            //      use to find loc of the user : loc=user_loc_Map[user];

        // matches used by conversation matcher 
        // let mat=values.matches, kmat=values.askmatches;

        let // vars=convo.vars,// = state.values
        askmatches=convo.vars.askmatches,/* askmatches={aask:{

                                                                match:'aval',
                                                                matches:[{key:'aval'},{key/ind:oneindex?},,],// models matches  , one routing (std, $$,$$$, no $%) index 
                                                                nomatches:[{key:'aval'},,,],// only models
                                                                ... some onchange added fields , ex : matched complete desire param ...
                                                            }}*/
        matches=convo.vars.matches,// models matches . see ormat at conversation.addMatcRes, convo.vars.matches.amodel={match:itemvalue-key,vmatch:voicenameofitem,data:xqea}
        mustacheF=stepSt.mustacheF;
        var answ ;
// matches.mod_Serv.match must be defined as we here must find a resource of a  group 
if(!matches.mod_Serv.match)matches.mod_Serv.match='col';// the default group is colazione 
console.log(' onchange fired for ask ', ask, ' inside my_script: ', script,' context: ',this);



       function runQuery(mydata,cq){// find rows in mydata matching/whering columns/value as specified by cq ( can also be used the local cQ without use a param !)
        /*   cQ={cval:[],ccol:[]};// init query where clauses , cval =values     ccol= column to where 
        returns :{ind:[3,6,8],rows:[mydata[3],mydata[6],mydata[8]]}
        that is the sql sparql query mapped into procedure template with param
        ex:

        prompt toward a target procedure : chiedi come quando dove avere fare servizio x soddisfare bisogno

        user speech >>> nornal form query template :  when will i can do breakfast at floor 3 ? >>>  target procedure : select time from colazione (desidere) where loc=floor3 

        so user speech prompted toward a set of query template with param can be get as complete normal form query  or param of target procedure are got  

        if user cant got full normal target expected  form will prompt missing param  then try to reproposal a normal form query of a partial target  or 
        just execute the partial query procedure , then prompt for missing param to reproposal the target query set procedure/ normal query format 
        example in colazione :
        - se user dice  vorrei sapere quando posso fare colazione al secondo piano o quando apre il  coffe  al secondo piano 

        posso 
        - matchare un linked data nlp2sparkl trasducer che mi traduce lo speech in normal form then mapped (ex piano 2 > location=piano2)
                into a target sparql query AA 
        o per una parte principale dei target query space AA : 
        ottenere i param del corrispondente procedure che lancia la query equivalente via dialog tree :
        - got param after prompt via single turn entity ai or refining  multiturn ( mi vuoi dare la collocazione ? > piano 2) tree dialog  ,
                > at the end goto thread that check all required param need to go to dyn_ask that run ( the equivalent to AA) procedure 


        */
        console.log(' query running  cq is : ',cq);
           let rows=[],ind=[];// rows matching where clauses cQ
           let nd=cq.ccol.length;
           function iterc(val,n){// iterate intersection with n-esima col/values in cq arrays till : add val in rows if match or do nothing  
            // val : cur rows in evaluation , it matches all where in cQ with index n-nd
            if(n<=0){return val;}//val=arow in mydata matches all ( cQ index 0-) where in cQ : so add cur val row to  rows;
            n--;
            if(val[cq.ccol[n]]==cq.cval[n])// if n where clause in cq 
                return iterc(val,n);
            else return null;
           }
           mydata.forEach(function (arow,i){let ret;
            if((ret=iterc(arow,nd))){// test if arow satisfy all cq where clauses on its columns 
                    rows.push(ret);ind.push(i);
                    console.log(' querying cur  entity:  row ',i,' satisfy the where clauses cQ  ');
                 }
            });// test each item in data entity 
            if(rows.length>0)return {ind,rows};
            
            // PP else return rows[0];// anyway returns a default
            else return {ind:[0],rows:[rows[0]]};// anyway returns a default
       }




       /* STATUS MNG 
       > put in appSt. in this impl we keep the user status in state 
       
       remember in corejs in botkit constructor we registered :
       dialogState = this.conversationState.createProperty(this.getConfig('dialogStateProperty'));
       dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);
       dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);// the dialog def, 
       in dialogset dialogstate is state property used to persist the sets dialog stack.
       when botkit in handleturn  ask a dc  
        handleturn(){
            .....
            
            dc=dialogset.createContext(turnContext);
                in dialogset ( that has as field dialogState):
                createContext(context) {
                    state_ = await this.dialogState.get(context, { dialogStack: [] });// ask session mng to store  var named dialogstack associated with context=tc
                        >>>> probably tc is tyed with userid so 
                    return .DialogContext(this, context, state);

                        so in in dc this.stack = state.dialogStack=[{id: dialogId,state: {}},,,,] 
                        state is the top stack current convo with convoid=dialogId
                }
        }

        to save the state we do :
            conversationState.saveChanges(tc);
            so the state_ , tied to tc,  will be saved

        >>>> so 
            a) if we wanted to add app status related to tc we must add a property  and register a appstatus obj tied to tc or a part of it 
            OR 
            b) if we want to be tyed to tc like dialogstack we can use the same 
                so just add a appstatus to state={appstatus,dialogStack: [] }

            probably just state.appstatus={.....} 


       */

        /* a);
            const appState = this.conversationState.createProperty('ds');// 
            this.dialogSet = new botbuilder_dialogs_1.DialogSet(dialogState);
            ,,,,,,,
        */
       // b) :

       let dialogState=bot._controller.dialogSet.dialogState;// =

       // or directly
       // somewere before :
       let state = await dialogState.get(convo.dc.context, { dialogStack: [] });
       state.appstatus={appSt:'ok',dyn_match:{}};// status a livello app . per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']

       // here as start :
       values.appSt=state.appstatus;// make available in current convo the appState
       // better  wen before are moved to begin :
       // this.appSt=await dialogState.get(context);


      
                        // according with  qs/queryclauses calc from related   model matched
 
        let mod_wh,// the model that define the bl out result . nb convo.vars.matches.amodel={match:itemvalue} , see addMatcRes
        def=false;

       // >>>> will also filled (matches,nomatches,match) by condition testing after,  see conversation
      
       let mydyn=askmatches[ask]={matched:null,complete:'fail'};// SAREBBE il qs da passare al next page ! E' STATUS A BREVE . se lo span e app allora usare state.appstatus
                                                                    // NB match as ask key matching statu ( match/no match ..) , the model item match is put :
                                                                    // - vars.askmatches.paam.match  if status for next thread ( like qs of next page load) 
                                                                    // - vars.appstatus
       let mydata;

        let infl_view;// the thread to display the results : now can have 2 values : std resource view  and qea ( still to implement )

        let mod_qea=matches.mod_qea;// mod_qea={match: "gotqea", vmatch: "setinexcel"}

        if(mod_qea&&mod_qea.match&&mod_qea.data){// QEA 
           // here must be :  infl_view==2
           infl_view=3;// TODO  to implement jet 

    // the $$mod_qea:coded patts, so following apatt items  will be launched by conversation and tomatch=step.result regex will run against the regex patt:
         // ttest returns tomatch.match(new RegExp(apatt, 'i')) that is 
         mydata=mustacheF.qeA(matches.mod_qea.data);// the desire master entity : has inflated all detailed/querred desires entities to give 
         // proposal : qea algo will fill a inflacted master desire context  mydata={xdata-contextinflactedmasterdesireentity, qeaaction,answere:qeaspecificdetaildesireresult}
            //   xdata-contextinflactedmasterdesireentity is one of the managed desidere/context managed by view/threads associated to xdata of the dyn_ask

            if(mydata){
    // DO BL 
       // bl will put its status changes/pamab inside dyn obj mydyn :
       mydyn.matched='match';// match as dyn ask , the matched model item match is put in mydyn.param.match   or if a app status in 
       



       mydyn.param={};// a summary of the result of the service this bl dyn provides 




            mydyn.param.item={qea:{item:mydata}};// qa a single response from qea the result of a db/sparql query : an action with data (usually display some data)

       // usually the desire obj is one of the managed view ( x_data )rootable by this ask , 
       // so qea will route to a  managed view as mod_wh does but the answere is not a item=xdata[matindex] fields but item.answere




           state.appstatus.dyn_match={};state.appstatus.dyn_match[ask]={match:mydata};// ??

            mydyn.param.desired=mydata.answere;
            mydyn.complete=mydata.qeaaction;//'qeaaction';// route to the answere display (action related)  and context summary then propose new action 
            // root to content view x qea
            }else{
                mydyn.complete='qea-noanswere';
                }

        }else {// No QEA , output defined by : matches.mod_wh




            mydata=this.data;infl_view=0;// def : case generic,col,......


        // recover where conditional field : here field are the coffe to do colazione 
        // so iside cen be put some bl field with orari ... come raggiungere ... promo specifiche del coffee
        /* row : 0 id
              1 value/nome
              2 patt
              3 descr
              4 data
              5 loc
              6 menu
              7 void
              // 
              8 where
              9 how
              10 when from
              11 when to 
        */


        // mydata=data model : a desire master tab + 2 join tabs .same query join procedures, out views  depending from  infl_view
        // master desidere tab are pre inflatted to make easy things !
        // now from this onchange input params , that will define this dynaskonchange logic, :
        //      - related askmatches routing matches (indexmatches)
        //      - and related input model matches 
        //     > calc the params and the  view (infl_view) that will route to threads/msg that  displays the action/desired entity related info  

        // infl_view;// the thread to display the results 


            /*   >> now all data in a group has same format ( restaurant, colazione , lavanderia ) 
            // now consider another entity bu same db query procedure but different join properies so will change the inflacted/populated in bl fields
            // if(matches.mod_wh){if(matches.mod_wh.key=='rest'){
                if(matches.mod_Serv&&mod_Serv.match=='col'){
                
                mydata=this.rest_data;// the desire entity : has inflated all detailed/querred desires entities to give 
                infl_view=1;// rest like view, 0: col view
            }else {// the std desire master entity , colazione 
                mydata=this.data;// the desire entity : has inflated all detailed/querred desires entities to give 
                infl_view=2;// rest like view, 0: col view

            }*/
     
            mydata=this.data;// the desire entity : has inflated all detailed/querred desires entities to give 
            infl_view=2;// no more used , all resource select hans in same data matrix , same format 
     
     
     
     
     
            /*           [
                         [0,'terace','redisdes','red RTCSessionDescription','data','piano1','pesce','void','vaial piano','come','08:00','10:00'],
                         [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11','piano2','pesce','void','vaial piano','come','07:00','10:00'],
                         [2,'outside','redisdes','red RTCSessionDescription','data','piano1','carne','void','vaial piano','come','09:00','10:00']
                        ]
            
            
            
            */
            let cQ={cval:[],ccol:[]};// init query where clauses , cval =values     ccol= column to where 
           //  cQ.cval=[];cQ.ccol=[];
            //values=convo.values;
            function cond(ind,val,cq){
                // val added to cq.cval=[]=[val7oj,val9obj], val is usually a string
                // ind added to cq.cind=[]=[7,9]
                if(val&&cq){
                cq.cval.push(val);
                cq.ccol.push(ind);
                }
            }





      // REMEMBER THE DESIRE ENTITY JOIN FIELD simple realization :

                                       /*  *******    master/desire entity simple relation with ask conditional described as $$ 

                                          the entity/model should be  is defined somewhere (in excel ...)
                                          in this very simple implementation the view is not bind to the model ( id/name/voicepattern/shortdescriptio)
                                          but just set by $$ condition munually copyng the name/pattern field 
                                          in future we should do $$mod:areference on the model description file set somewhere in 
                                              the model/field dialog description bind to a static (file) descriptio or to a dyn db schema
                                          here the where model are just the space of a relational where entity put directly in a col of master entity ( desire entity)
                                              whith its id or name ( both are key)
                                          so to make sintetic : $$....reflect the name-voicepattern of a implicit model whose id/name is put in a where field of the related master desire entity
                                    ******
  

                                */
    /*  *******    master/desire entity simple relation with ask conditional described as $$ 

  

        #####//#endregion

                        
        in ve , confirm to client we are doing a target query and  ask the query param we have not got in the past
        
        , so we gather from the user speech answere : 

        - check and prompt the user till get all the param we need o run the query , ex :
                - mach for 2 where table that is related to the target query  
                - after extract other param to do a fts/qea query of a master with 2 join
        - do the query and ask to refine the query till got the selected item/obj so route to next dialog desponding from that sel obj 
                    simply read a bl field ( othe out param recoverd from user speech) extract param from obj and put in app status, then route to next thread )

         now imagine that we add the possibility to get from user instruction to choose also the target query on a predefined set 
            > so come to a normalized correct query utterance that the user can say to request the target query (equivalent to the target query that we do after promting for param)

            >>>>  than  we implement the  predefined procedure with usual query building or using the nlp2sparq methods and compare the different tech 

         then we can also pretend to get from user a more general query , 
         so when recognise  it with a regex we can (instead of doing the usual param collection) we can directly build the query procedure as nlp2sparql and 
         > come to the same dyn_ask of the compatible query in the set 
            ( the compatible target query of which the general query is a subquery )
            - to manage selection , refine some other staff and manage the next action/route

            nb if the gneral (sparql) query is not perfectly recognized we can goon with usual param collection and if the user insist with the direct query we can use past param
            to build the correct direc query 

            ex quale opere murarie sono state fatte nel 5 secolo e da chi ?
             risposta query general : le opere murarie sono state fatte da mario e sono argini di terra .
                si pasa poi al target query ( raccoglie tutte le questin su opere relative al tematrattato in una sala) xhe dira :
                 piu in generale il tema x e trattato nella sala y sul percorso dove si espone il concetto y  che attiene alla tua domanda specifica 
                 li nella sala ....   ti interessa sentire gli altri concetti della sala o vuoi andarci o vuoi continuare lla visita nel corrente posto dove sei ?
                 
                 il query target e' vuoi sapere cosa trovi nella sale relativamente ai percorsi proposti ? vuoi sapere i concetti esposti o qualche concetto paricolare 
                    se vuoi mi puoi fare una domanda su un concetto particolare ad esempio .....qualche entita / relazioine interessante .....
                 o 
                vuoi sapere dove si tratta un certo concetto ?


                nb differenza tra qea e query sparql e' che nel query sparql si querano  entity coinvolte nelle domande , nel qea si vuole beccare l'intent che 
                verra trattato con nuovo dialogo per fare query specifica sulle entita  di cui l'intent e' articolato ( o si da una risposta generica per vedere se e sufficiente)
                es  vorrei sapere il colore delle macchine  , con entity :   hai una macchina di colore rosso/verde/gialla  > hai una macchina rossa/verde/gialla


            altro ex piu generale 
            ........


        nb here for semplicity we build the query ( a desire/master table joined with 2 entity  and a selection (wanted out)  of only desire bl col or a limitated optional 
            cols of the joined table)) answere without a db but :
            - just work on a desire table pre inflacted/(in mongoose populate)  , so for example we have the menu cols filled with the 
                 array or csv name of related n:m where table or  the joined query select field 
            
            example select coffee.descr menu.data where (join_n:m coffee with menu)   

                prompt : so tell me what do you want to know from a coffee risorce at the hotel that you want to go 
                user i'd like to known the menu of the coffee at 3th floor named mario's this evening  
            and as param from user speech we get the ask that match the user output  'what menu' : so in the query rows result i ave the cols 
                    location , name and a col with the inflated menu description just in case the user want that col of the joined menu 


        #####
    */


       // >>>>>>> example from user or colazione_luogo filled get loc or set the default hall location piano2
       let loc; // the id/name item instance of a join/where field (1:N) 
                //implemented in one col of master/desire Entity (mydata matrix)

                // debug . to semplify a  match must exist ! > in future manage the event
       if(matches.mod_loc)loc=matches.mod_loc.match;else loc='piano terra';
       cond(5,loc,cQ);// add a intersect/where clause on col n 5 with instance id/value loc
       if(matches.colazione_menu)cond(6,matches.colazione_menu.match,cQ);// future use
       // anyway we must select a group resource ( colazione , ristorante ,,,,):
       cond(13,matches.mod_Serv.match,cQ);

       // 2502 return null ??
       let singleRes=true;// todo  otherwise 
      let res=runQuery(mydata,cQ);// res={ind:[3,7],rows:[mydata[3],mydata[7]]}// must be not nulll because in any case we set a location default
      //console.log(' querying entity  with where clauses ',cQ,' got cursor : ',res);



      let id=0,name=1,iD,
      nres=0;// matchings rows
       iD=name;


       if(res&&(nres=res.rows.length)>0)

        {//desire entity should be not null  , set anyway a default 

            // resNam is the array containing the col name of matrix rows 
        let resNam=res.rows.map(function(v,i){return v[iD]});// calc matching [rows], then returns rows [] with just some cols (1:name)
 
        console.log(' querying entity  with where clauses ',cQ,' got cursor rows : ',res);
        let blRes,blResItem;
        let gr;


         /// now fils response vars.dynmatches.dyn_rest     .match  e .complete  
         // they will be cheched in condtion with : 
         //      item :   $$$vars.dynmatches.dyn_rest.match  and 
         //      routing instr   $$$vars.dynmatches.dyn_rest.complete

         // now process bl : 
         // case a response by models matched : 
         //     modServ= should 'col'
         //     mod_wh = where/when......
         //     .......
         //     >> each case fills routings and some vars that will be used by following onchange or in msg template 
         //         CAN be used vars.excel.askname.something x dynamic news or
         //                     vars.loopDir.dyn_rest.param2_maxretry  as param x conversation looping behaviour 

                // GET MODEL MATCH impacting this dyn 
         

            // add dyn_rest match (as a result summary)
//            askmatches.dyn_rest={match:[]};




    // DO BL 


            // mng OVERVIEW 
            // .matched the dyn query process result 
            // .param   the query match(es) , can be a single selected match or cursor or a cursor waiting to be selected by a selection resolver ask
            // .param.group : a sub view of item matched that is specialized according to its class ( the resorce class) 
            //  if the class is unique is just the projected view param to display   


       // bl will put its status changes/pamab inside dyn obj mydyn :
       mydyn.matched='match';// match as dyn ask , the matched model item match is put in mydyn.param.match   or if a app status in 
       



       mydyn.param={};/* a summary of the result of the service this bl dyn provides : vars={,,,askmatches:{,,,dyn_rest:
       
                                                                                                                        //mydyn=
                                                                                                                        {
                                                                                                                         match: ,complete: ,
                                                                                                                         param:{} // =mydyn.param
                                                                                                                        }
                                                                                            }}


                    example in teplate use : {{vars.askmatches.dyn_rest.param.match}}
                    */

        mydyn.param.group={};// view  transformation 

       //now  here update it  
       // so in template we can recover a copy put in vars.appSt.dyn_match.dyn_rest.match[6]
       state.appstatus.dyn_match={};state.appstatus.dyn_match[ask]={match:blResNam};// has meaning only if 1 match




            if(singleRes||res.ind.length>0){// consider 1 match
                nres=1;// 1 match selected  
         blRes=res.ind[0];// the index of row 0 in data
         // PP blResItem=res.rows[0];// just take first index (in mydata matrix)
         blResItem=res.rows[0];// just take first index (in mydata matrix)
         blResNam=resNam[0];// just take first index (in mydata matrix)






            // find group if 1 match 
            if(matches.mod_Serv&&matches.mod_Serv.match){
                cQ={cval:[matches.mod_Serv.match],ccol:[1]};// the group model Gdata has a view projection to match : mod_Serv
                                                            // mod_Serv , in this simple impl , is just defined in condition , but it should be a projection of  Gdata
                                                            // so let the vname be the same ( )
            } else  cQ={cval:[blResNam],ccol:[1]};// ?? dont use that
            let grows=runQuery(this.Gdata,cQ);

            if(grows&&grows.rows){gr=grows.rows[0];// should be 1 row
                gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

            }


// make sense to fill sel and def only if we got first row of cursor, other wise just fills mydyn.param.cursor={matches,patt,data} !



            let isStd;
            if(blRes==gr[4]) isStd=true;else isStd=false;
    
            if(!isStd)mydyn.param.group.def={item:mydata[gr[4]]};// as index not string 
            // nb :  mydata[blRes]==res.rows[0];
            mydyn.param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
            // nb  nb different from a non dyn ask !!! see mng summary in addMatcRes() in conversation.js 
            mydyn.param.match=blResNam;//=blResItem[1];//  name 
            mydyn.param.vmatch=blResItem[12];// voice name 
    
            mydyn.param.templatef={};// template flag to add specific parts depending from the match
    
            if(mydata[blRes][0]==1||mydata[blRes][0]==2)mydyn.param.templatef.ishall=true;//(the default , so in template use this flag to not repeat default suggestion )
    

        }else{// many query results : a cursor with more rows : fills cursor

                /* the cursor can be passed to a resolver ak that will find a single match , so will complete the setting of :

                param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
                param.match=blResNam;//=blResItem[1];//  name  ex 'caffe top'
                param.vmatch=blResItem[12];// voice name 

                    but the resolver could not set  at group level projection (resuouces/class name and vname of matched item  ):

                                    param.group.name=gr[1];// example col or rest 
                                    param.group.vname=gr[5];// example colazione or ristorante
                    >> so group in case of a cursor (many matches ) will be a unique class independent from specific matched rows !!!!
                */



            nres=res.ind.length;
            //let cursor=res.rows.map(function(v,i){return v[iD]});// calc matching [rows], then returns rows [] with just some cols (1:name)
            mydyn.param.match=mydyn.param.vmatch=null;// nb different from a non dyn ask !!!
            //mydyn.param.cursor={rows:res.rows,resModel:{},data,param} ;// or use a arrays projection name and patt 
            mydyn.param.cursor={items:[],rows:res.rows,resModel:{}} ;// data useless, rows is enougth. resModel or use a arrays projection name and patt 
            /*
            items:[[rows[1]],,,,]// items=rows with a array of [[rowi]] ,   rows=is a array of [rowi]// to be used in #out&list&col 
            resModel={val1:{
                patt:regexstr,
                vname:'pippo'
                }
            }*/
            res.rows.forEach(function(v,i){resModel[v[1]]={patt:v[14],vname:v[12]};
                                                items.push([v]);
                                            });// calc matching [rows], then returns rows [] with just some cols (1:name)
// gr does not have meaning unless just a default or unique chars 


            if(this.Gdata)gr=this.Gdata[0];// the view to transform row results

            /* todo 
            so in a resolving_dyn_ask we in msg will list the vname to match ( like we list the missing entities ): resModel[].vname
            then in condition test user answere against the model : resModel[].patt using $$thedynquery_ask:; in next msg we can have :

                                                        rename group.sel > select 
                                                        param.match and  param.vmatch   > selValue and sel_ItemName
            {{vars.askmatches[resolving_dyn_ask].param.group.sel[i]}} as row col value of selected row quered in onchange of key='thedynquery_ask'
            {{vars.askmatches[resolving_dyn_ask].param.match}} as value of selected query res item
             {{vars.askmatches[resolving_dyn_ask].param.vmatch}} as vname of selected query res item

            mydyn.param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)

            mydyn.param.match=blResNam;//=blResItem[1];//  name 
            mydyn.param.vmatch=blResItem[12];// voice name 
            */

          
          }




        if(matches.mod_wh)mod_wh=matches.mod_wh;


        // set group x general detail view 
        // find a group uding g_data  
 
        
        /*
1 value/nome
2 best
3 calce
4 defIndex

5 voicename vgroup
        */
        
 if(gr){
     
    // NB if we matched a cursor :mydyn.param.match=null;mydyn.param.cursor={matches,patt,data};//  NB a matches is ARRAY with false/true (match) not the instane name


        mydyn.param.group.name=gr[1];
        mydyn.param.group.vname=gr[5];// the 
        mydyn.param.group.best=gr[2];
        mydyn.param.group.calce=gr[3];
        mydyn.param.group.what=gr[6];
        mydyn.param.group.nextserv=gr[7];



        // obsolete if( mydyn.param.group.sel)mydyn.param.group.isdef=true;else mydyn.param.group.isdef=false;// seems ok , ? to do 
        mydyn.param.group.vgroup=gr[5];
        //, mydyn.param.group.nextserv={list:['colazione','lavanderia']}};
 }



        // >>>>  set bl result param also if mod_wh ( output desidered ) is not set :
            
        mydyn.param.news=mydata[blRes][7];
        mydyn.param.from=mydata[blRes][10];// blRes='hall'
        mydyn.param.to=mydata[blRes][11];
        // mydyn.param.match=mydata[blRes][12];// voice name 



        // >>>>  set bl result param also if mod_wh ( output desidered ) is not set :


    /* old staff 
        if(infl_view==1) mydyn.param.item={col:{item:mydata[blRes]}};// col-std
        else  if(infl_view==2) { mydyn.param.item={res:{item:mydata[blRes]}};// rest
        // impossible : else  if(infl_view==2)  mydyn.param.item={qea:{item:mydata[0]}};// qa a single response from qea the result of a db/sparql query : an action with data (usually display some data)
                                                                        // item={action,data1,data2}
                                                                        // usually the desire obj is one of the managed view ( x_data )rootable by this ask , 
                                                                        // so qea will route to a  managed view as mod_wh does 
        }else  mydyn.param.item={gen:{item:mydata[blRes]}}; // residual
        */

        // now prepare different context x different answere views to explain/respond to questions 
        // x=matches.mod_Serv.match  con be col (colazione) , res (ristorante),,,,,,
        // {{vars.askmatches.dyn_rest.param.item.x}} so only one x (col or res colazione restaurant)  is not null and i can test to  display the specific choice {{#vars.askmatches.dyn_rest.param.item.x}} 
 
     // ??  mydyn.param.item={};mydyn.param.item[matches.mod_Serv.match]={item:mydata[blRes]};// ex : mydyn.param.item.col.item =data[i] ( a col data row) or  mydyn.param.item.res.item =data[i]  ( a res data row)
     // ??  mydyn.param.item={item:mydata[blRes]};// new way , use if to do a group view 



        if(mod_wh&&mod_wh.match){
           let mat=mod_wh.match;
        if(mat=='when'){
            mydyn.param.desired='when';

            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_quando';
        }else if(mat=='where'){// try to use same view of how just set a different flag for mustache 
            mydyn.param.desired=['where'];
            mydyn.param.where=mydata[blRes][8];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_dove';
        }else if(mat=='how'){
            mydyn.param.desired=['come'];
            mydyn.param.how=mydata[blRes][9];
            // route and display when , then ask x detais , then returns to menu 
            mydyn.complete='match_come';
        }else def=true;}else def=true;

        if(def){// def
            mydyn.param.desired=['det_full'];
            mydyn.complete='match_full';
        }

        // SO the routing thread that display the info will refears to :mydyn.param.qsparam

        // nb mydyn.match is the match on condition 


         console.log(' dyn_rest bl ended with short span qs vars.askmatches.dyn_rest.param : ',mydyn.param);
         if(state.appstatus&&state.appstatus.dyn_match&&state.appstatus.dyn_match[ask])
          console.log(' and app status update   values.appSt=state.appstatus,  state.appstatus.dyn_match.dyn_rest : ',state.appstatus.dyn_match[ask]);
        }// ends desire entity 
        else{// no desire entity got , error ,(a def must anyway exists)
            console.error(' ERROR : a query can not find even a default row , lease manage with an exit error');

    }
            }// ends No QEA
    // Cancel any GOON text from previous user answere 

    convoSt.userTurn=null;

        
    /*
        if (answ == null) {
            console.log('no answer found ', color);
            bot.say('Sorry, I\'m not sure what you mean');
        }
        else {
            console.log('answer found ', answ);
            convo.vars.colorgot = answ;
            bot.say('ok you got answare :' + answ);
            // try to add dyn a new trhread that can dispatch at a thread or script dynamically 
            // depending on answ
    
        
        }*/

/* remember mustache function to be called 
    {   // context :
        // .......

        "name": "Tater",
        "out": function () {
          return function (text, render) {
            return "<b>" + render(text) + "</b>";
          }
        }
      }
      
      Template:
      
      {{#out}}Hi {{name}}.{{/out}}
*/
    }// ends dyn_rest_f

        let mustacheF={ };

// global helper to be run in context of ......  
//mustacheF.nmList=function (map,step,clVars){// map can be the notmatching model list item =[{name:modelx},{}] on ask condition 
mustacheF.nmList=function (mapname,nmp,firstname,retAFunc){

    /*cases 

    nb in handlebars {{afunctionfactory }} {afunctionfactory is a factory. here the factory rendQuery is build by factory listAitem1 , 
        so  rendQuery=listAitem1(firstit,col)


            0) : array=[  [id,nome,,,,,]   ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
    {{#mustacheF.out}}$$list& 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches....array}}
             {{mustacheF.rendQuery}} 
          {{#vars.askmatches....array}}
    {{/mustacheF.out}}

    1) : cursor.rows=[  [id,nome,,,,,]   ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
    {{#mustacheF.out}}$$list&5& col 2 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches.dyn_medicine.param.cursor.rows}}
             {{mustacheF.rendQuery}} 
          {{/vars.askmatches.dyn_medicine.param.cursor.rows}}
    {{/mustacheF.out}}

    2a) : cursor.rows=[  [id,nome,,,,,]   ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
    {{#mustacheF.out}}$$list&5& col 2 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches.dyn_medicine.param.cursor.rows}}
             {{#mustacheF.rendQuery}} vorrai prendere la medicina $    {{&&let col;if(vars.matches.mod_wh=='when')col=3;col=col;&&}} 
             {{/mustacheF.rendQuery}}
          {{/vars.askmatches.dyn_medicine.param.cursor.rows}}
    {{/mustacheF.out}}


    2b) : cursor.rows=[  [[id,nome,,,,,]]  ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
            dentro 
        {{#mustacheF.out}}$$list&5& col 2 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches.dyn_medicine.param.cursor.items}}
             {{#mustacheF.rendQuery}} vorrai prendere la medicina $   {{#.}} {{&&let col;if(vars.matches.mod_wh=='when')col=3;col=col;&&}} {{/.}}
             {{/mustacheF.rendQuery}}
          {{/vars.askmatches.dyn_medicine.param.cursor.items}}
    {{/mustacheF.out}}



    TO COMPLETE UPDATE : 
        nb $ means col 2 del iesimo item in cursor.items 
           {{#contextL}}  {{#.}}  // start  iterate uCx the unnamed Context passed , contextL=aobj=[uC1,uC2,,,,] , uCx is not a obj with fields {f1:a,f2:b ..}, ex is a []
                                nb named is  contextL=[{name:{},id:'9'},] so 
                                     {{#contextL}}  {{name}}
                {{5}}  // 
            {{#.}}


    */

/*

>>> nmList returns  the entity/model name  : mapname or, (if mapname is a model defined in excel,) its voice notmatchedprompt npm
                    adding 'a anche' if mapname is different from firstname(in the middle of a father list context = this!)


params :
 // usually  map is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
 // returns the value name of the model ( as specified in $$modelname:) or its voice name if specified in its definition as property of vars.excel

*/

//console.log('   ********** nmList called clVars is ',clVars );console.log('   ********** first name  is ',firstname );
   //  let excel_=step.values.excel;
   let ret;// error 
   let morecompl=retAFunc;// can render a funcion template
    if(mapname){// a notmatched model , look in excel if the model is descibed and get the notMatched prompt if there is 

        let retur;
        if(nmp){// the model notmatched name 
            ret= '  '+nmp;
        }else{
            ret= ' '+mapname;
        }
        // if(clVars.notmatlist[0]==map.name)return ret;// first item
        if(firstname=='.'||(firstname!='-')&&firstname==mapname)retur= '';// first item
        else retur= ' inoltre ' ;


        if(!morecompl){// return the value rendered by function using  context (the calling f context)
            return retur+ret;

        }else{// return function(text,render) to be called with text to render 

            return function(text,render) {

                if(text) {// a {{function}} 

                    return retur+render(text).replace('$',mapname);
                }
                else{
                    return retur+ret;
                }
            }

        }


     }
}

mustacheF.qeA=function(qstring){


}







    myBoundF=function (text, render,stepp_) {// {{#vars.excel.out}} staff !
// is clear what is the context ??? mustache will overwrite what we did ?
        // >> to be bound to this=step before returning !
        // calle with : {{#vars.excel.out}}$$xxx&usualhandlebar {{/vars.excel.out}}  
        /// xxx is the param , usualhandlebar is mustache template used here to compose the template 
        //  template is rendered here using render(template)

        // check this 

        // we need to extract steps
        let stepp=stepp_||this.step;// ???? only if is in root ctx this contains step




        let param,param2,param3,param4,template=text,itr1;// the $$xxx& first part of text 
        // text=text.substring(after&);
        let oplength=0;
        if (text.substring(0, 2) == '$$') { // $$param&param2&template
            template=text.substring( 2) ;
            itr1=template.split('&');// 
            oplenght=itr1.length;
            if(itr1.length>4&&template.substring(0, 2) == 'if'){// 4 param only x if 
                param=itr1[0]; param2=itr1[1];param3=itr1[2];param4=itr1[3];
                
                //template=itr1[4];// last is template
                template=text.substring(2+4+param.length+param2.length+param3.length+param4.length);
                oplength=5;
            }else 
            
                // TODO correct the length as in above if 
                if(itr1.length==4&&template.substring(0, 4) == 'miss'&&template.substring(0, 4) == 'list'){// 3 param
                param=itr1[0]; param2=itr1[1];param3=itr1[2];template=itr1[3];// last is template




            }else if(itr1.length==3){// 2 param + template 
                param=itr1[0]; param2=itr1[1];template=itr1[2];// last is template
            }else if(itr1&&itr1[0]&&itr1[1]){// 1 param only
                param=itr1[0];template=itr1[1];
            }
            // template inizia con \n !!???
        }
    if(param){// so found $$ and not null param 

	        if(param=='if'){// 4 param) 

 /*           example of template execution(passing current context )  on askA msg :
            {{#mustacheF.out}}$$if&vars.excel.avar&==&pippo&
                <template >
                </template>
                 {{/mustacheF.out}}

*/ 

// 25032020 : instead of if : TODO idea out can be like in condition pattern a regex or a even a function or a code to eval 

        let value_,vs={vars:stepp.values};
        // can use jVar as in conversation or must chech for eval error (cant find property of undefined !)
        try{
        eval( "value_ = vs." + param2 );// or use the parser in conversation.js, that means jVar ?
        } catch(e){value_=null;}
        if(value_){
        if(param3=='=='){if(value_!=param4)template=null;
        }else if(param3=='!='){if(value_==param4)template=null;
        }else if(param3.charAt(0)=='>'){if(value_<=param4)template=null;
        }else if(param3.charAt(0)=='<'){if(value_>=param4)template=null;
        }
        }else template=null;

        }
        
        else  if(param=='ff'){// 2 param) 

            /*           example of template execution(passing current context )  using eval :
                       {{#mustacheF.out}}$$ff&
                       let iff=true;vars.mod_pippo={};step.goon=5;let out=iff;
                       &
                           <template >
                           </template>
                            {{/mustacheF.out}}

                         example of template execution(passing current context )  using Function
                       {{#mustacheF.out}}$$ff& 
                       let poppo=context.vars.pippo;// or poppo=vars.pippo;
                       if(poppo)return true;
                       &
                           <template >
                           </template>
                            {{/mustacheF.out}}
           
           */ 
           
           // 25032020 : instead of if : TODO idea out can be like in condition pattern a regex or a even a function or a code to eval 
           
                   let value_,context={vars:stepp.values,state:stepp.state},vars=stepp.values;// also 
                   // can use jVar as in conversation or must chech for eval error (cant find property of undefined !)
                   try{
                   value_=eval(  param2 );// use context.vars ( or vars)  or context.state 
                   } catch(e){value_=null;}
                   if(value_){
                    ;
                   }else template=null;
           
                   }
                   
                   else if(param=='list'&&(itr1.length>1)){// > 2-4 param  , its a more complex list display then just std mustache array+ static func

 /*         example of template extract on askA msg :
            .......
              {{#mustacheF.out}}$$list&  + 
                                        col&adyn_ask&   3 param  (itr1.length=4)  obsoleto 
                                        or
                                        col&            2 param ( if string matrix )  ex :  {{#vars.askmatches[adyn_ask].param.itemS}}
                                        or
                                        no param        1 param='list' (itr1.length=2) ( custom string array )
            <template start >
              ** puoi  specificare  {{#vars.excel.queryL}} se vuoi automaticamente listare la colonna col del adyn_ask query cursor loaded by onchange on : vars.askmatches[adyn_ask].param.itemS
                                    o un tuo string matrix o un array string array {{#arr}} ex : {{#vars.askmatches[adyn_ask].param.itemS}}
                                            {{mustacheF.rendQuery}} will list the above
                                    {{/vars.excel.queryL}}
                                    chiudere array {{/arr}}
                oppure continuare o ritornare al menu principale 
            <template end >
            {{/mustacheF.out}}
            ..........

            nb template start and and must not have '&' !!!



            example1 :
             {{#mustacheF.out}}$$list&11&
            {{#vars.askmatches.dyn_rest.param.item.res.item}}
            {{mustacheF.rendQuery}}
            {{/vars.askmatches.dyn_rest.param.item.res.item}}
            {{/mustacheF.out}}
 

            example2
                {{#mustacheF.out}}$$list&5& col 5 
                le medicine che devi ancora prendere questa mattina sono :<br>
                {{#dyn_medicine.param.cursor}}
                 {{mustacheF.rendQuery}}
                {{/dyn_medicine.param.cursor}}
                {{/mustacheF.out}}

*/
            let excel_=stepp.values.excel;
            
            let col,cursor,firstit=null;// you can put in the template any array of string and {{rendQ}} will list the col but if you specify param2 i can customize it and add e in between 


            if(itr1.length==4&&param4){
            if(stepp.values.askmatches[param4]&&stepp.values.askmatches[param4].param&&stepp.values.askmatches[para4].param.itemS)cursor=stepp.values.askmatches[param4].param.itemS;// a dynask query result set by a dym match as :vars.askmatches[adyn_ask].param.itemS
 
                excel_.queryL=cursor;// optional if use ** .  must be available in context to be referencied in template 
                // firstit=cursor[0][param2];
                col=param3;
            }else if(itr1.length==3&&param2){// the col 
                col=param2;
                }

            // now i can use a function factory or just to set a closure param of a static function , start with the factory : 
                mustacheF.rendQuery=listAitem1(firstit,col);// firstit is now useless, param3 is the col , remember to use queryL as context array inside 
            

        }else if(param=='miss') {// render list of a jet not matched model used in dyn ask dyn_rest, 1,2 param 
            // problem with length of param just start with no & in followingtemplate 

            /* example :
             {{#mustacheF.out}}$$miss&dyn_rest&
    puoi chiedere  <br> 
x {{vars.matches.mod_Serv.vmatch}}
<br>
          {{#vars.excel.notMatchL}}
             {{mustacheF.rendnotmatch}}
          {{/vars.excel.notMatchL}}
     o continuare <br>
 x o ritornare al menu principale 
{{/mustacheF.out}}

            */

          /*
        miss: BUILD , in its step msg with a askA having some models tested ($$ + $%) with a important goon chained askB  ,
         - a callable rendnotmatch function and 
         - its context notmatchedmodel list , vars.excel.notMatchL,   
         operating on its containing template 

          example of template extract on askA msg :
          {{#mustacheF.out}}$$miss&optionalseconddyn_ingoonchain_askB&
            <template start >
            vuoi  specificare  
          {{#vars.excel.notMatchL}}
             {{mustacheF.rendnotmatch}}
          {{/vars.excel.notMatchL}}
         oppure continuare o ritornare al menu principale 
          <template end >
        {{/mustacheF.out}}

        >>>>  NO '&' on template start and end !!!!!!!!!!




          // format : {{#mustacheF.out}}$$miss&dyn_rest&puoi anche specificare {{#vars.excel.notMatchL}}  e anche  {{mustacheF.rendnotmatch}}
          //          {{/vars.excel.notMatchL}} grazie  {{/mustacheF.out}}
          // ex : {{#mustacheF.out}}$$miss&dyn_rest&template...inside can be called mustacheF.rendnotmatch

           {{#mustacheF.out}}$$miss&dyn_rest& puoi anche specificare  
                {{#vars.excel.notMatchL}}
                    e anche  {{mustacheF.rendnotmatch}}
                {{/vars.excel.notMatchL}}
                grazie
            {{/mustacheF.out}}

          */



          /* so call {{#vars.excel.out}}$$miss&template{{/vars.excel.out}}
          // template=templBeforeList+
          // {{#vars.excel.notMatchL}}
          //    want herereallyreturnfromnmList{rendnotmatch}}
          // {{/vars.excel.notMatchL}}
          // +templAfterList
          // {{/vars.excel.out}}

 */



   //  set a array in mustache context to list 
   let excel_=stepp.values.excel;
   // no will be void when called in next step !! let mustacheF=stepp.values.mustacheF;// insert functions

   let line =stepp.curLine,askname ;
   let clVars={};//clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]};
   // if (line && line.collect&& line.collect.key)askname= line.collect.key;

   //excel_.notmatlist can be found in values.askmatches[askname] that is filled with match and not matced model when a askkey test condition 
   // clVars.notmatlist=stepp.values.askmatches[askname].split('|');
// now sotract askkey model $$ matching request 

// per iniziare dare parametro con nome del askkey da testare (sullo stsso thread?) so would b better to add to values.excel a map : keyname > [modeltotestwith$$|$%]

// instead we are interested on get the list of all condition testing models (regex starting with $$ or $%) on:
// -  current askkey or ( as goon) 
// -  askey next in tree that i want to prompt 1 step before ( as goon will try to match 2 step with same user)


// remember when ask condition find a model to check will be registered if mf=match or mf=nomatch
//      step.values.askmatches[previous.collect.key][mf].push(amatch)

    clVars.notmatlist=[];
    let am,ma,ii,it;
    if (line && line.collect&& line.collect.key)askname= line.collect.key;// this key , should be lastwherein_typeaserv

    // TODO : ++ prompt for models on   this step + adds  the interesting goto : param2=some interesting goto collect key
    // so do another loop with if(param2)askname=param2;
    let vars=stepp.values;
    if(askname){// fills clVars.notmatlist with the near asks models didnot matched jet from matching list askmatches and modellist modsonask[

        //method A old , long :
    am=vars.askmatches[askname];// testing ask  present ask matches status :am={matches:[],match:not$%match,nomatches:[]} , to calc the model still to  match

        ma=vars.modsonask[askname];// models that are testing for get matches in testing ask  ( $$ or $% ), a string array

    
    for(ii=0;ii<ma.length;ii++){// for each model tested in the ask (ma[ii]) find if was already matched
        // check id the model is alredy matched 
        // still do not match
        let ism=false;// this model (ma[ii]])is not matched and isrequired only as a where join to query the master dyn mod_wh_Of
            if(vars.excel[ma[ii]]&&vars.excel[ma[ii]].mod_wh_Of&&vars.askmatches[vars.excel[ma[ii]].mod_wh_Of] // main=vars.excel[ma[ii]].mod_wh_Of : tell to put the model in nmp notmatchedprompt list only if the main entity is matched
                &&vars.askmatches[vars.excel[ma[ii]].mod_wh_Of].match)    {                 // if mod_wh_Of not exist try to put in nmlPrompt 
                ;}else{
                // method A complicated and long :
                //if(am){ for(it=0;it<am.matches.length;it++){
                //    if(am.matches[it].key==ma[ii]){ ism=true;break;}
                //}else isn=true;

                // method B easy and fast:
                if(vars.matches[ma[ii]]&&!vars.matches[ma[ii]].match)ism=true;

                }



        if(!ism)clVars.notmatlist.push(ma[ii]);
    }
    }

   // excel_.notmatlObj=
   clVars.notMatchL=[];//=[{name:thenotmname}] why not simple string array ?
   excel_.notMatchL=clVars.notMatchL;// must be available in context to be referencied in template 
   // excel_.notmatlist.forEach(key => excel_.notmatlObj.push({name:key}));

   // fill notMatchL from notmatlist
   if(clVars.notmatlist)clVars.notmatlist.forEach(key => clVars.notMatchL.push(
                                    {name:key
                                    // some other param to specialize the item renderer function 
                                    })
                        );
//stepp=stepp;

   // rendnotmatch will be called inside the out template ttt usually inside a notmatlist obj (built here)
   //   so with notmatlist obj as this context .it will be passed with the closure var step to an external function nmList 
   //   nmList return a text processing the  notmatlist items and the closures (AAD +myBoundF)calculated text 


    // >>> BUILD the callable {{}} motmatching function displayng 
   // >>>>>  now make available rendnotmatch function (using nmList()) that can be called in template to render in this function out with miss procedure : {{#mustacheF.out}}$$miss&dyn_rest&template...
//   mustacheF.rendnotmatch=listAitem(step,clVars.notmatlist[0]);// in its Array context ( put in  this)
    mustacheF.rendnotmatch=listAitem(stepp,null);// in its Array context ( put in  this)
/*
   mustacheF.rendnotmatch=(function(){// add a rendnotmatch function with last matching  result step  on its enclosure
    
    // PROBABLY NOW WE HAVE STEP JUST IN CONTEXT SO THIS closure is useless 
    

       // the closure AAD
    let step=stepp;// or step_
    // other myBoundF vars
    // anyway make available clVars too 
    return function (){ // nb no text/template to work on , if had a template to work on function(template=text,render)
        // remember functions in mustache :
        // a (rendnotmatch) function will be called with the mustache father context/this , that if it is a #array will be  this=Aarray_item 
        // if it has a template ({{#rendernotmatch}}template{{#rendernotmatch}}) it can be recovered in text param and rendered after filtered with 
        //      render(filter(template));

    // **** usually rendernotmatch is called inside a mustache template of array notMatchL previously prepared, so this is a  notMatchL item 
        console.log('  ***** we are in rendnotmatch and this is : ' ,this);
        // usually  this is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
        //return mustacheF.nmList(this,step,clVars)}// call an external function ( can be put in the same excel obj ? !)
        return mustacheF.nmList(this,step,clVars.notmatlist[0])}// call an external function ( can be put in the same excel obj ? !)
   })();
   */


   // so template , can use excel.nmList(this,step) via excel.rendnotmatch so can be : 
   //   template=' puoi anche aggiungere {{#notmatlObj}} * {{vars.excel.rendnotmatch}} {{#notmatlObj}} grazie'
   // msg='... ora {{#vars.excel.out}}$$miss&template{{/vars.excel.out}}

   /*
   excel.nmList=function (this,step){// this can be the notmatching model list item =[{name:modelx},{}] on ask condition 
   let excel_=step.excel;
    if(this.name){// a notmatched model 
        if(excel_[this.name]&&excel_[this.name].notMatPr){// the model notmatched name 
            return ' , '+excel_[this.name].notMatPr;
        }else{
            return ' '+this.name;
        }


    }

   }*/

   // now 
    // 1: render template that can applay notmatlist obj  to a function that render each not matched model item having the model dir in 
    //          rendnotmatch=function(){this.    }
    //          as the function can see its closure var i will see the model drectives as : ......
    // 2: render template that can applay notmatlist string as {{.}}

        /*
remember mustache npm instructions :

{
  "name": "Tater",
  "bold": function () {
    return function (text, render) {
      return "<b>" + render(text) + "</b>";
    }
  }
}

Template:

{{#bold}}Hi {{name}}.{{/bold}}      // {{#bold}}context = Hi {{name}}.    

so function bold will be called by mustache and if it return a function will be called with ({{#bold}}context )

-------
now :if father was a array of string :

now :if father was a array objs :
 {{#beatles}}   // beatles can be a array of obj or string :


 // if array of jobs, each obj item produces a line where when found {{acontextobj}}:
 {{acontextobj}}
    if acontextobj is a string / template :
            it is rendered ,
    if  acontextobj is a function 
            it was run with this= array current obj item 

 example:* {{name}} {{#func2}}a template tobe rendered by func2 {{name2}}  {{/func2}} 

 //  if array of string, each string item produces a line where the string  are accessible as {{.}} 
example : . {{.}}  {{#func2}}a template tobe rendered by func2 {{.}} {{/func2}} 

{{/beatles}}

      */

      /* // nb this=step , text will be rendered using context_ set in conversation.js, remembering HHJJ  :
      
        
      
        // so 
        //      run a context 
         
        text=' magari puoi darmi qualche missing come 
        {{[mod1,mod2]}}



        - luogo  {{}}



      */

      console.log(' : out$miss is rendering its template in which is abilited mustacheF.rendnotmatch that displays the items of its context (vars.excel.notMatchL), item is the {name:entityname,,,}',
      '\n it passes item to calls mustacheF.nmList that displays the entity name having available in params also  step and \n clVars={notmatlist:[n1,,],notMatchL:[{name:n1},,,]} :',clVars);

       
       
}// end miss out function 
else;

     if(template)return  render(template) ;
    else return


    }// end if param 
    else{// no param found or no $$ found >  render template as is 
        return  render(template) ;
    }


    function listAitem(step,firstname){// case out miss , a function factory, to render the item.name of a father context  askArray =[{name:'amodel/entity_name_testedas_$$_$%_inAsk'},,,] 
        // example msg= .... {{#askArray}}    {{generatedfunction}}{{#askArray}}
        // so :  {{#vars.excel.notMatchL}} {{mustacheF.rendnotmatch}} {{/vars.excel.notMatchL}}

        // returns this.name ( the entity name) (or if exist the notmatched prompt (in the model/entity description) npm=excel[this.name].notMatPr ) preceded by 'e anche' if is different from firstitem 

// PROBABLY NOW WE HAVE STEP JUST IN CONTEXT SO THIS closure is useless 
if(firstname==null)firstname='.';// first
let count=0;

// the closure AAD
//let step=stepp;// or step_
// other myBoundF vars
// anyway make available clVars too 
return function (){ // nb no text/template to work on , if had a template to work on function(template=text,render)
// remember functions in mustache :
// a (rendnotmatch) function will be called with the mustache father context/this , that if it is a #array will be  this=Aarray_item 
// if it has a template ({{#rendernotmatch}}template{{#rendernotmatch}}) it can be recovered in text param and rendered after filtered with 
//      render(filter(template));

// **** usually rendernotmatch is called inside a mustache template of array notMatchL previously prepared, so this is a  notMatchL item 
console.log('  ***** we are in rendnotmatch and this is : ' ,this);
// usually  this is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
//return mustacheF.nmList(this,step,clVars)}// call an external function ( can be put in the same excel obj ? !)
let npm,fn;
if(step.values.excel&&step.values.excel[this.name]&&step.values.excel[this.name].notMatPr)npm=step.values.excel[this.name].notMatPr;
if(firstname=='.'){firstname='-';fn='.';}else fn=firstname;
if(count++<2)return mustacheF.nmList(this.name,npm,fn)}// call an external function ( can be put in the same excel obj ? !)
return null;

}
function listAitem1(firstname,col){// case out list , col is the row column index to display 
    // if inside a string matrix  context :
    //          a function factory, to render the item[col] of a father context   vars.askmatches.dyn_rest.param.itemS =the querred subarray of
    //          dyn_ask  data (rows query cursor)=[ [ '','',''],,,,]

    // if inside a string array  context :
    //       
    //          [ ,,,,,]

                                                                                                                                
// example msg= .... {{#vars.askmatches.dyn_rest.param.itemS}}    {{generatedfunction}} {{#vars.askmatches.dyn_rest.param.itemS}} 
// so :  {{#vars.excel.notMatchL}} {{mustacheF.rendnotmatch}} {{/vars.excel.notMatchL}}

// returns this.name ( the entity name) (or if exist the notmatched prompt (in the model/entity description) npm=excel[this.name].notMatPr ) preceded by 'e anche' if is different from firstitem 

// PROBABLY NOW WE HAVE STEP JUST IN CONTEXT SO THIS closure is useless 


// the closure AAD
if(firstname==null)firstname='.';// first
// other myBoundF vars
// anyway make available clVars too 
return function (){ // nb no text/template to work on , if had a template to work on function(template=text,render)
// remember functions in mustache :
// a (rendnotmatch) function will be called with the mustache father context/this , that if it is a #array will be  this=Aarray_item 
// if it has a template ({{#rendernotmatch}}template{{#rendernotmatch}}) it can be recovered in text param and rendered after filtered with 
//      render(filter(template));
let fn,el;
// **** usually rendernotmatch is called inside a mustache template of array notMatchL previously prepared, so this is a  notMatchL item 
console.log('  ***** we are in out list a col of a matrix ({{#mustacheF.out}}$$list&5&...}})  and this is : ' ,this);
// usually  this is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
//return mustacheF.nmList(this,step,clVars)}// call an external function ( can be put in the same excel obj ? !)
if(firstname=='.'){firstname='-';fn='.';}else fn=firstname;
if(Array.isArray(this)){el=this[col];
                        if(Array.isArray(el)&&el.length==1&&Array.isArray(el[0]))el=el[0];// 3 dim array is cursor.items case only
                    }
                    else el=this;
return mustacheF.nmList(el,null,fn,true)}// will add e anche  dopo il primo el . call an external function ( can be put in the same excel obj ? !)

}
    
    }// end myBoundF=

    mustacheF.out__= function (mystep) {// this=step , bound in conversation.parseTemplatesRecursive() BUT reset by mustache to its context 
        // this function (returning) register a handler function called by mustache when finds {{#out}}ttt{{/out}} 
        //  then moustache call immediately the handler passing (ttt,render) whre render is a cb that will render a template that 
        //  is built filtering ttt 
        //  as we thought mustache do not bind the out function (found in context already bound to step) 
        // we use it to pass step to handler using the out closure var step_ or ........
    
        // here handler=myBooundF , does :
        // myBooundF receives a ttt template that will be transformed in a final template that can be rendered using render(template)
        // as we thought mustache do not bind the myBooundF handler (found in context) we have bound bind out to step
        // so here this should be this=step 
        // when the handler function will be called it will build in excel context some status obj and set new function 
        // to be available to the template ttt ....................
    
        // let step_=this;// can be used in returned function 
        // so :
        let step_=this.step;// is null , try to see what is specifically  this 
        return function(){
        return function (templ,render){



            // can use some obj in scope 
           return  myBoundF.call(this,templ,render,mystep);//.bind(step_);// probably don work and useless so delete it 
        }   }
    
    }

    mustacheF.out_= function () {// this=step , bound in conversation.parseTemplatesRecursive() BUT reset by mustache to its context 
        // this function (returning) register a handler function called by mustache when finds {{#out}}ttt{{/out}} 
        //  then moustache call immediately the handler passing (ttt,render) whre render is a cb that will render a template that 
        //  is built filtering ttt 
        //  as we thought mustache do not bind the out function (found in context already bound to step) 
        // we use it to pass step to handler using the out closure var step_ or ........
    
        // here handler=myBooundF , does :
        // myBooundF receives a ttt template that will be transformed in a final template that can be rendered using render(template)
        // as we thought mustache do not bind the myBooundF handler (found in context) we have bound bind out to step
        // so here this should be this=step 
        // when the handler function will be called it will build in excel context some status obj and set new function 
        // to be available to the template ttt ....................
    
        // let step_=this;// can be used in returned function 
        // so :
        let step_=this.step;// is null , try to see what is specifically  this 
    
// *********************************    check it :

    return myBoundF;//.bind(step_);// probably don work and useless so delete it 
  }// ends out 

function modsOnAsk(script) {// from a conversation script create a map : ask > list of model tested in ask
    // we  want to know what model will be tested on script asks on all threads
    // in onchange  main dyn_ask will test major models gathered by y many asks that are visited in the dialog
    // so in a ask we'll find the models that we test fox matching in the ask and the most important goon ask in its condition routing 


// **************************    // seems modsOnAsk do not give right ouput !!!


    let modsOnAsk_ = {
        //aask:[model1,model2]
    };
    console.log(' modsOnAsk *** script is : ', script)

    for (var thread in script) {// thread is a name 
        if (script.hasOwnProperty(thread)) {

            // thread is a []
            let thread_ins = script[thread];// a array 

            for (let p = 0; p < thread_ins.length; p++) {// line: a step in thread
                let mods = [];
                let line = thread_ins[p], name;// name is a askvar
                if (line.collect && line.collect.options)// line has a key to collect
                // 
                {
                    let paths = line.collect.options;
                    name = line.collect.key;// line key name


                    for (let pp = 0; pp < paths.length; pp++) {// a condition on step  ( compreso default)
                        let condition = paths[pp];

                        if (condition.type && condition.type === 'regex') {
                            if (condition.pattern.substring(0, 2) == '$$' || condition.pattern.substring(0, 2) == '$%') {
                                let itr = condition.pattern.indexOf(':');

                                if (itr > 0) {
                                    entity = condition.pattern.substring(2, itr);
                                    mods.push(entity);
                                }

                            }
                            //if(entity){// a condition in line will test a model=entity
                            //	mods.push(entity);}

                            // console.log('** modsOnAsk( , evaluating ask ',name,' model test : ',mods); 

                            // if(mods.length>0)modsOnAsk[name]=mods;


                        }


                    }
                    console.log('** modsOnAsk , in thread ', thread, ' evaluating ask step ', p, '  with collect var  ', name, ' testing model : ', mods);
                    if (mods.length > 0) modsOnAsk_[name] = mods;

                }// a step with ask
            }// end a step
        }// thread
    }
    return modsOnAsk_;
}// ends modsOnAsk
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

let dynJs={ //  bank containing script directive with onChange x script/dynfield-key 
            // onChange is  bound to its dynJs[myscript] > contain scripts directive 
            // cms.before will insert :
            //  values.excel    >  dynJs[myscript_].excel
            //  values.loopDir  >
            //  values.matches  >    model matches ex :values.matches.color='red'
            //  values.askmatches  >    model matches ex :values.matches.color='red'

    /*
    dynJs={ascript:{ TO REVIEW  !!!
                    excel:{
                            staticvarr...
                            askname:{askstaticattributes,notMatPr:'piano interessato'}  >>> 27022020 : better move inside askdynDir !!!!!!!!!!!!!!!!
                            model attributes and items descriptions

                        }

                    askdynDir:{
                            loopDir:{// will go inside values.loopDir[akey=colazione_dyn] 
                                    loop matching var in intent managed by the dyn 
                                    }
                    data:{} // filled by onChange as db rows
                    onChange_text:'function ...  ' // to be eval in onChange :

                    // >> dynask onChange must be registered to cms 
                    onChange:function ...

                    }
    }
    */
   hotel3pini_vox:{// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

    mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

    excel:{//  values.excel are dyn staff x user maintenance and dynamic data
        //      - dyn template vars and 
        //      - dynask params used in in onchange to influence bl in some dyn ask field
        //              ex find the floor a log user is in 
        //          >>> probably insert some of this in dedicated dyn obj like below
        //              
        //          > convo directives is more about dialog design !! 
        //      - model definition ( view fields and also bl fields )
        //          that usually are put in db 

        // general param in template

        rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

        news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,






        // >>> NO MORE static ask property AAA following some ask (tab) attributes . NOTE: PUT INSIDE direc DEDICATED ASKDIN fields ( like dyn_rest ) ????? !!!!!!
        /*
        colazione_conf:{// available in conversations via step.values.excel              
            goon:false // will not :
                        // goon taking present user speech  and  skipping the next prompt  
        },*/
        lastwherein_typeaserv:{         
            news:' oggi al caffe in terrazza viene servito il branch all\'inglese gratis fino alle 11 '
        },
        


        // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
        colazione_loc:{voicename:'',
                        patt:{piano1:'al primo piano'},
                        notMatPr:' la location desiderata  '//esempio ..'
        },
         mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
                vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
                /* remember tale costrutto lista all not matched model in a ask (+ following branch) 
                    but if  marked mod_wh_Of:querredent not list if rel dyn (querredent) alredy matched 
                {{#mustacheF.out}}$$miss&dyn_rest&
                    puoi chiedere  <br> 
                    x {{vars.matches.mod_Serv.vmatch}}
                    <br>
                    {{#vars.excel.notMatchL}}
                        {{mustacheF.rendnotmatch}}
                    {{/vars.excel.notMatchL}}
                     o continuare <br>
                     x o ritornare al menu principale 
                {{ustacheF.out}}
                */
                    notMatPr:'cosa vuoi sapere ad esempio   quando apre o dove si trova ',//  model entity name used in nmList not matched list 
                    // vname:=notMatPr

                model:{where:{patt:'dove|che posto|luogo'},
                    how:{patt:'come|modo|devo|fare'},
                    when:{patt:'quando|ora|orario|mattina|pomeriggio|sera|mattina|oggi|domani'}

                }
         },
         mod_loc:{vmatches:{'piano 1':'piano 1','terrazza':'terrazza al aperto','piano 2':'piano 2','piano terra':'piano terra','loc 3':'piano 3','main':' principale'},// model specification , item voice name 
                notMatPr:' la location ad esempio in terrazza  '//  model entity name used in nmList not matched list 
                ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
         // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
         // vname:=notMatPr
        },
        mod_Serv:{vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
                vlist:['bar','ristorante','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
        // news : that is the declaration of model values and patten instead that do it in line on condition .
        // : todo 
        //   if a condition declare instead of :
        //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
        //      :
        //          $$mod_Serv::
        //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
        jmodel:'',// json into model
        model:null,// 
        //  could be 'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast',
        // or better 
        //  from a json , a general declaration that is inflated in convenience structures vmatches,vlist,....
        //      {bar:{
        //          patt:'ristorant*|pranzo|cena|trattoria',
        //            ai_url:'',
        //            vname:''
        //      },,}
        
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
        // vname:=notMatPr
       },
       mod_vita_user:{
           vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
            },// model specification , item voice name 
            notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
       // vname:=notMatPr
        }

    },


    direc:{

        /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
        //      so REVIEW following comments ....

        dyn_rest_quando:{// a thread

            loopDir:{
                goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
            }
        },
        dyn_rist_altro_details:{// a thread

            loopDir:{
                goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
            }
        },

    colazione_dyn:{// used in  associazione a    :


        

        loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                //loop staff 
                // complete=repeat_...,// repeat in loop all where field till matches (max2)
                nomain:true,// a context var  in some msg 
                max_repeat:1// then default 

                // here the out function  on context of ....  . or put in global excel ?
                // out:out,// askdin function 
                // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                // no nmp

        },

        data:{// will be used by onChange as db rows as array of string 
            // mappings 0,1,2,....   id,value,patt,desc,data,blfields 

        },
        onChange_text:testFunc.toString// without async !!

    },
    dyn_rest:{// used in  associazione a    :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                //loop staff 
                // complete=repeat_...,// repeat in loop all where field till matches (max2)
                nomain:true,// a context var  in some msg 
                max_repeat:1// then default 

                // here the out function  on context of ....  . or put in global excel ?
                // out:out,// askdin function 
                // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                //, goon:true;

        },

            // try to use x every resource the same field . so use data 
        rest_data:// old :  now all group go in data as are supposed to have a normalzed inflacted format 
        // will be used by onChange as db rows as array of string 
                    /* row : 0 id
          1 value/nome
          2 patt
          3 descr
          4 data
          5 loc
          6 menu
          7 news
          // 
          8 where
          9 how
          10 when from
          11 when to 
          12 voicename

    */
            [
                [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza'],
                [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra'],
                [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino']
               ]
        ,
        data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
        // now all group go in data as are supposed to have a normalzed inflacted format 

        /* row : 0 id
            1 value/nome
            2 patt
            3 descr
            4 data
            5 loc
            6 menu
            7 news

            8 where
            9 how
            10 when from
            11 when to 
            12 voicename
            13 loc/res,,,,, the group type 
            */
[
    [0,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col'],
    [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra','col'],
    [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino','col'],
    [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest'],
    [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest'],
    [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest']

]
,


Gdata:// will be used by onChange as group feature 
/* row : 0 id
1 value/nome
2 best
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 nextser : suggested next service to query 

*/
[
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
[1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,

//
        onChange_text:testFunc.toString,// without async !!


            // >>>> insert here onchange as a module of this obj so can see the fields !
        onChange:function(new_value, convo, bot,script,ask){
            return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

        }

    }
    }// ends direc all dyn cb and bl 
},

    hotel3pini:{// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

        mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

        excel:{//  values.excel are dyn staff x user maintenance and dynamic data
            //      - dyn template vars and 
            //      - dynask params used in in onchange to influence bl in some dyn ask field
            //              ex find the floor a log user is in 
            //          >>> probably insert some of this in dedicated dyn obj like below
            //              
            //          > convo directives is more about dialog design !! 
            //      - model definition ( view fields and also bl fields )
            //          that usually are put in db 

            // general param in template

            rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

            news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,

  
  
  
  
  
            // >>> NO MORE static ask property AAA following some ask (tab) attributes . NOTE: PUT INSIDE direc DEDICATED ASKDIN fields ( like dyn_rest ) ????? !!!!!!
            /*
            colazione_conf:{// available in conversations via step.values.excel              
                goon:false // will not :
                            // goon taking present user speech  and  skipping the next prompt  
            },*/
            lastwherein_typeaserv:{         
                news:' oggi al caffe in terrazza viene servito il branch all\'inglese gratis fino alle 11 '
            },
            


            // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
            colazione_loc:{voicename:'',
                            patt:{piano1:'al primo piano'},
                            notMatPr:' la location desiderata  '//esempio ..'
            },
             mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
                    vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
                    /* remember tale costrutto lista all not matched model in a ask (+ following branch) 
                        but if  marked mod_wh_Of:querredent not list if rel dyn (querredent) alredy matched 
                    {{#mustacheF.out}}$$miss&dyn_rest&
                        puoi chiedere  <br> 
                        x {{vars.matches.mod_Serv.vmatch}}
                        <br>
                        {{#vars.excel.notMatchL}}
                            {{mustacheF.rendnotmatch}}
                        {{/vars.excel.notMatchL}}
                         o continuare <br>
                         x o ritornare al menu principale 
                    {{ustacheF.out}}
                    */
                        notMatPr:'cosa vuoi sapere ad esempio   quando apre o dove si trova ',//  model entity name used in nmList not matched list 
                        // vname:=notMatPr

                    model:{where:{patt:'dove|che posto|luogo'},
                        how:{patt:'come|modo|devo|fare'},
                        when:{patt:'quando|ora|orario|mattina|pomeriggio|sera|mattina|oggi|domani'}

                    }
             },
             mod_loc:{vmatches:{'piano 1':'piano 1','terrazza':'terrazza al aperto','piano 2':'piano 2','piano terra':'piano terra','loc 3':'piano 3','main':' principale'},// model specification , item voice name 
                    notMatPr:' la location ad esempio in terrazza  '//  model entity name used in nmList not matched list 
                    ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
             // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
             // vname:=notMatPr
            },
            mod_Serv:{vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
                    vlist:['bar','ristorante','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
            // news : that is the declaration of model values and patten instead that do it in line on condition .
            // : todo 
            //   if a condition declare instead of :
            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
            //      :
            //          $$mod_Serv::
            //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
            jmodel:'',// json into model
            model:null,// 
            //  could be 'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast',
            // or better 
            //  from a json , a general declaration that is inflated in convenience structures vmatches,vlist,....
            //      {bar:{
            //          patt:'ristorant*|pranzo|cena|trattoria',
            //            ai_url:'',
            //            vname:''
            //      },,}
            
            notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
           },
           mod_vita_user:{
               vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
                },// model specification , item voice name 
                notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
           // vname:=notMatPr
            }

        },


        direc:{

            /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
            //      so REVIEW following comments ....

            dyn_rest_quando:{// a thread

                loopDir:{
                    goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
                }
            },
            dyn_rist_altro_details:{// a thread

                loopDir:{
                    goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
                }
            },

        colazione_dyn:{// used in  associazione a    :


            

            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                    //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                    //loop staff 
                    // complete=repeat_...,// repeat in loop all where field till matches (max2)
                    nomain:true,// a context var  in some msg 
                    max_repeat:1// then default 

                    // here the out function  on context of ....  . or put in global excel ?
                    // out:out,// askdin function 
                    // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                    // no nmp

            },

            data:{// will be used by onChange as db rows as array of string 
                // mappings 0,1,2,....   id,value,patt,desc,data,blfields 

            },
            onChange_text:testFunc.toString// without async !!

        },
        dyn_rest:{// used in  associazione a    :

            // put here also the static  dyn ask definition  AAA ?? yes

            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                    //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                    //loop staff 
                    // complete=repeat_...,// repeat in loop all where field till matches (max2)
                    nomain:true,// a context var  in some msg 
                    max_repeat:1// then default 

                    // here the out function  on context of ....  . or put in global excel ?
                    // out:out,// askdin function 
                    // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                    //, goon:true;

            },

                // try to use x every resource the same field . so use data 
            rest_data:// old :  now all group go in data as are supposed to have a normalzed inflacted format 
            // will be used by onChange as db rows as array of string 
                        /* row : 0 id
              1 value/nome
              2 patt
              3 descr
              4 data
              5 loc
              6 menu
              7 news
              // 
              8 where
              9 how
              10 when from
              11 when to 
              12 voicename

        */
                [
                    [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza'],
                    [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra'],
                    [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino']
                   ]
            ,
            data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
            // now all group go in data as are supposed to have a normalzed inflacted format 
 
            /* row : 0 id
                1 value/nome
                2 patt
                3 descr
                4 data
                5 loc
                6 menu
                7 news

                8 where
                9 how
                10 when from
                11 when to 
                12 voicename
                13 loc/res,,,,, the group type 
                */
    [
        [0,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col'],
        [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra','col'],
        [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino','col'],
        [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest'],
        [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest'],
        [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest']

    ]
,


Gdata:// will be used by onChange as group feature 
/* row : 0 id
1 value/nome
2 best
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 nextser : suggested next service to query 

*/
[
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
[1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,

//
            onChange_text:testFunc.toString,// without async !!


                // >>>> insert here onchange as a module of this obj so can see the fields !
            onChange:function(new_value, convo, bot,script,ask){
                return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

            }

        }
        }// ends direc all dyn cb and bl 
    },
    hotels:{// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

        mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

        excel:{//  values.excel are dyn staff x user maintenance and dynamic data
            //      - dyn template vars and 
            //      - dynask params used in in onchange to influence bl in some dyn ask field
            //              ex find the floor a log user is in 
            //          >>> probably insert some of this in dedicated dyn obj like below
            //              
            //          > convo directives is more about dialog design !! 
            //      - model definition ( view fields and also bl fields )
            //          that usually are put in db 

            // general param in template

            rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

            news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,

  
  
  
  
  
            // >>> NO MORE static ask property AAA following some ask (tab) attributes . NOTE: PUT INSIDE direc DEDICATED ASKDIN fields ( like dyn_rest ) ????? !!!!!!
            /*
            colazione_conf:{// available in conversations via step.values.excel              
                goon:false // will not :
                            // goon taking present user speech  and  skipping the next prompt  
            },*/
            lastwherein_typeaserv:{         
                news:' oggi al caffe in terrazza viene servito il branch all\'inglese gratis fino alle 11 '
            },
            


            // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
            colazione_loc:{voicename:'',
                            patt:{piano1:'al primo piano'},
                            notMatPr:' la location desiderata  '//esempio ..'
            },
             mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
                    vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
                        notMatPr:'le informazioni desiderate come  quando dove '//  model entity name used in nmList not matched list 
                        // vname:=notMatPr
             },
             mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                    notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                    ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
             // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
             // vname:=notMatPr
            },
            mod_Serv:{vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
                    vlist:['bar','ristorante','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
            // news : that is the declaration of model values and patten instead that do it in line on condition .
            // : todo 
            //   if a condition declare instead of :
            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
            //      :
            //          $$mod_Serv::
            //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
            model:'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast',
            // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
            //      {bar:{
            //          patt='ristorant*|pranzo|cena|trattoria',
            //            ai_url='',
            //            vname=''
            //      },,}
            
            notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
           },
           mod_vita_user:{
               vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
                },// model specification , item voice name 
                notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
           // vname:=notMatPr
            }

        },


        direc:{

            /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
            //      so REVIEW following comments ....

        colazione_dyn:{// used in  associazione a    :


            

            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                    //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                    //loop staff 
                    // complete=repeat_...,// repeat in loop all where field till matches (max2)
                    nomain:true,// a context var  in some msg 
                    max_repeat:1// then default 

                    // here the out function  on context of ....  . or put in global excel ?
                    // out:out,// askdin function 
                    // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                    // no nmp

            },

            data:{// will be used by onChange as db rows as array of string 
                // mappings 0,1,2,....   id,value,patt,desc,data,blfields 

            },
            onChange_text:testFunc.toString// without async !!

        },
        dyn_rest:{// used in  associazione a    :

            // put here also the static  dyn ask definition  AAA ?? yes

            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                    //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                    //loop staff 
                    // complete=repeat_...,// repeat in loop all where field till matches (max2)
                    nomain:true,// a context var  in some msg 
                    max_repeat:1// then default 

                    // here the out function  on context of ....  . or put in global excel ?
                    // out:out,// askdin function 
                    // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                    //, goon:true;

            },

                // try to use x every resource the same field . so use data 
            rest_data:// old :  now all group go in data as are supposed to have a normalzed inflacted format 
            // will be used by onChange as db rows as array of string 
                        /* row : 0 id
              1 value/nome
              2 patt
              3 descr
              4 data
              5 loc
              6 menu
              7 news
              // 
              8 where
              9 how
              10 when from
              11 when to 
              12 voicename

        */
                [
                    [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza'],
                    [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra'],
                    [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino']
                   ]
            ,
            data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
            // now all group go in data as are supposed to have a normalzed inflacted format 
 
            /* row : 0 id
                1 value/nome
                2 patt
                3 descr
                4 data
                5 loc
                6 menu
                7 news

                8 where
                9 how
                10 when from
                11 when to 
                12 voicename
                13 loc/res,,,,, the group type 
                   todo 
                14 : patt
                15: spare
                16:time2 from
                17:time2 to

                */
    [
        [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col'],
        [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra','col'],
        [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino','col'],
        [3,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','res'],
        [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','res'],
        [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','res']

    ]
,


Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
/* row : 0 id
1 value/nome
2 best
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 suggested next service to query 
8 ?

*/
[
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante , portineria e'],
[1,'rest','master shef cucina internazionale','si prega prenotare per menu pesce ',1,'ristorante','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,


            onChange_text:testFunc.toString,// without async !!


                // >>>> insert here onchange as a module of this obj so can see the fields !
            onChange:function(new_value, convo, bot,script,ask){
                return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

            }

        }
        }// ends direc all dyn cb and bl 
    },

    televita:{// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

        mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

        excel:{//  values.excel are dyn staff x user maintenance and dynamic data
            //      - dyn template vars and 
            //      - dynask params used in in onchange to influence bl in some dyn ask field
            //              ex find the floor a log user is in 
            //                  have info if the user got the medicine so can jump to rith service thread 
            //          >>> probably insert some of this in dedicated dyn obj like below
            //              
            //          > convo directives is more about dialog design !! 
            //      - model definition ( view fields and also bl fields )
            //          that usually are put in db 

            // general param in template

            rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

            news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,

  
  
  
  
  
            


            // >>> following some Model attributes ( name/patt are directly inserted as condition $$)

           mod_vita_user:{
               vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
                },// model specification , item voice name 
                notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
           // vname:=notMatPr
            },
            // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*
            mod_wh:{
                vmatches:{come:'come|che mod|quale mod',
                //come:'(?(?=che)(\w* (mod*|mani*)|come))'
                quando:'quando|che temp',per:'per|quale moti'
                 },// model specification , item voice name 
                 notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
             }

        },


        direc:{

            /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
            //      so REVIEW following comments ....

            key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes
    
                loopDir:{
                    //goon:false // dont work 
                    // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
                    // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            },

            ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes
    
                loopDir:{
                    //goon:false // dont work 
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            },
            ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes
    
                loopDir:{
                    //goon:false // dont work 
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            },



        dyn_medicine:{// used in  associazione a    :

            // put here also the static  dyn ask definition  AAA ?? yes

            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                    //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                    //loop staff 
                    // complete=repeat_...,// repeat in loop all where field till matches (max2)
                    nomain:true,// a context var  in some msg 
                    max_repeat:1// then default 

                    // here the out function  on context of ....  . or put in global excel ?
                    // out:out,// askdin function 
                    // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

                    //, goon:true;

            },

           

            med_data:// will be used by onChange as db rows as array of string 
                        /* row : 0 id
              1 value/nome
              2 patt
              3 descr
              4 data
              5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera ... in sostanza un where field !         
              6 menu quando prenderla
              7 news avvertenze medico
              // 
              8 where  come fare a recuperarla 
              9 how come prenderla
              10 when from : prima pasti
              11 when to  max delay
              12 voicename
                13 loc/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
                   todo 
                14 : patt :duplicated , see 2
                15: spare
                16:time2 from
                17:time2 to

              // specific bl transaction fields 
              20 taken/missing : get join with user med with status get/miss: 0/1
              21 ....
              22 ....
              23 ...
              24 ---
              25 inputdata1









        */
                [
                    [11,'aspirina','aspirina','aspirina descr ','data','credenza 1','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo pastiglia in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
                    [22,'cumadin','cuma|coum','cumadin descr','oggi branch gratis alle 11 ','credenza 2','prima pasti ','se salti non riprenderla','vai in credenza',' deglutendo la compressa intera con acqua','dopo i pasti ','10:00','cumadin','col',,,,,,,,false,,,,,''],
                    [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
                   ]
            ,
            data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
            /* row : 0 id
  1 value/nome
  2 patt
  3 descr
  4 data
  5 loc
  6 menu
  7 news
  // 
  8 where
  9 how
  10 when from
  11 when to 
  12 voicename
*/
    [
        [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza'],
        [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra'],
        [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino']
       ]
,
Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
/* row : 0 id
1 value/nome
2 best prompt per cominciare a rispondere al main desire
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 suggested next service to query 
8 ?

*/
[
[0,'col','ecco l elenco dei farmaci che ci risulta devi ancora assumere ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' pastiglie ','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite'],
[1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,
            onChange_text:testFunc.toString,// without async !!


                // >>>> insert here onchange as a module of this obj so can see the fields !
            onChange:function(new_value, convo, bot,script,ask){
                return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;

            }

        }
        }// ends direc all dyn cb and bl 
    }


        
    }// ends dynJs

// eval( 'dynJs.room.colazione_dyn.onChange = async ' + dynJs.room.colazione_dyn.onChange_text );
dynJs.hotels.direc.colazione_dyn.onChange = testFunc;
dynJs.hotel3pini.direc.colazione_dyn.onChange = testFunc;
dynJs.hotel3pini_vox.direc.colazione_dyn.onChange = testFunc;

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

        

        
        (function(){// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
            // HHJJ   function bind :
            // - in conversation.parseTemplatesRecursive():
            //      excel.out will be bound in conversation.parseTemplatesRecursive() to step
            // - here :
            //      loopDir[ask]=dynJs[myscript_][ask].loopDir  so :
            //          loopDir[ask].out  bond to .....   todo!
            //      onchange=dynJs[myscript][color].onChange is bound to dynJs[myscript]


            /* > so conversation.parseTemplatesRecursive() will set mustache context :
            - vars={
                + status.values ,
                excel:dynJs[myscript_].excel={
                                                .....
                                                askkey:{

                                                }
                                                amodel:{
                                                    name:
                                                    voicename:
                                                    notmatchedprompt:''
                                                    items:{
                                                        value1:{
                                                            vname:'',
                                                            patt:'regex:""'
                                                        }
                                                    }
                                                }
                                                out:function ....
                                            }
                loopDir:{askkey:dynJs[myscript_][askkey].loopDir,
                        ....
                                            }
                matches:{amodel:{
                                match:'it1' // |it2'
                               
                                },,,
                        }
                askmatches:{ askname:{match:[{key:'item1'},,,],// $$ model matches 
                                      nomatch:[{key:'item1'},,,] // $$ not matched so can be asked with model notmatchd prompt 
                         }

                }


              }

            - and registering ask onchange as dynJs.room.colazione_dyn.onChange = testFunc, bound to onStep.step


            */


            /*

              FW management oveerview :
              - expand all dynJs entry and inflate excel.amodel.model into mustache convenience context views structures ...vmatches,vlist,....


            */



            
            // AA
            //(function(){

            let color,myscript,myth;

            // hotels 


            color='colazione_dyn',myscript='hotels',myth='default';
            //let myscript_=myscript;// launch a closure with a internal var the script well be registering :
            controller.plugins.cms.before(myscript,myth, async(convo, bot) => {// default thread will be enougth
                // insert in convo.state obj that will be the mustache context , now only under vars=state.values:
                // see in conversation : let context={ vars: vars }


                // do stuff
               // console.log('starting my_thread as part of my_script');
                // other stuff including convo.setVar convo.gotoThread
                //Object.assign()


                // >>>>>  when conversation render template will bound out to step see it if(excel.out){excel.out.bind(step)}
                // convo.setVar('excel',dynJs[myscript_].excel);

                // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
                convo.step.mustacheF=dynJs[myscript].mustacheF;
                const dc=convo.dc;

                let script=convo.script;// see conversation runBefore 

                // load map  : ask >  tested model list on ask 
                 // ERROR  dynJs[myscript_].excel=modsOnAsk(script);
                 // modsOnAsk will be used by ...........  calling a ref we forgot  . so temporarely put in vars.modsonask :

                 convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
                convo.setVar('excel',dynJs[myscript].excel);// corrected to be as was before

                // example excel.ask.notmatchingdependingdir
                //          excel.amodel={name:
                //                       itemname=[] // alternativi to put in condition regex
                //                       itemvoicename
                //                       itempatt
                 //                           }

                let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


                // ????
                // let outVar={}; // wrapper x loop dynamic main last (sub)intent ask calculate answare
                // ex : outvar.amodelmatchvoicename  like %Msamodelmatchvoicename
                //          generated by onchange using .......

                // in mustache function will be called without context so set out context in global (excel) and dyn out function : 

                //......



               // let color_=color;
                //loopDir[color_]=dynJs[myscript_][color_].loopDir;
                // insert all other ask directives 
                //convo.setVar('loopDir',loopDir);// dir about ask as conversational tab 
                convo.setVar('direc',dynJs[myscript].direc);// dir about ask as conversational tab . NOW also the static fields
                convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
                convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
               
               });

            let //myoB=dynJs[myscript][color].onChange.bind(dynJs[myscript]),
            myoC=dynJs[myscript].direc[color].onChange.bind(dynJs[myscript]);// probably bind is useless because overwritten by ....(mustache ??)

               controller.plugins.cms.onChange(myscript, color,async function(a,b,c){
                return myoC(a,b,c,myscript,color);
                    } );// can i bind with its obj ?
            //});//();







            
            let color11='dyn_rest';// TODO : for all direc do .....

           // myoC=dynJs[myscript][color].onChange.bind(dynJs[myscript]);

           // let myoC1=dynJs[myscript].direc[color].onChange;//.bind(dynJs[myscript]);
            controller.plugins.cms.onChange(myscript, color11,async function(a,b,c){
                //let color_=color,myscript_=myscript;// CORRECT put myscript_ in a closure ! : done
                //return myoC1(a,b,c,myscript_,color_);
                //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
                return dynJs[myscript].direc[color11].onChange(a,b,c,myscript,color11);// this should be set 
                    } );// can i bind with its obj ?


            // hotel3pini

            
            color='colazione_dyn',myscript='hotel3pini',myth='default';
            //let myscript_=myscript;// launch a closure with a internal var the script well be registering :
            controller.plugins.cms.before(myscript,myth, async(convo, bot) => {// default thread will be enougth
                // insert in convo.state obj that will be the mustache context , now only under vars=state.values:
                // see in conversation : let context={ vars: vars }


                // do stuff
               // console.log('starting my_thread as part of my_script');
                // other stuff including convo.setVar convo.gotoThread
                //Object.assign()


                // >>>>>  when conversation render template will bound out to step see it if(excel.out){excel.out.bind(step)}
                // convo.setVar('excel',dynJs[myscript_].excel);

                // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
                convo.step.mustacheF=dynJs[myscript].mustacheF;
                const dc=convo.dc;

                let script=convo.script;// see conversation runBefore 

                // load map  : ask >  tested model list on ask 
                 // ERROR  dynJs[myscript_].excel=modsOnAsk(script);
                 // modsOnAsk will be used by ...........  calling a ref we forgot  . so temporarely put in vars.modsonask :

                 convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
                convo.setVar('excel',dynJs[myscript].excel);// corrected to be as was before

                // example excel.ask.notmatchingdependingdir
                //          excel.amodel={name:
                //                       itemname=[] // alternativi to put in condition regex
                //                       itemvoicename
                //                       itempatt
                 //                           }

                let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


                // ????
                // let outVar={}; // wrapper x loop dynamic main last (sub)intent ask calculate answare
                // ex : outvar.amodelmatchvoicename  like %Msamodelmatchvoicename
                //          generated by onchange using .......

                // in mustache function will be called without context so set out context in global (excel) and dyn out function : 

                //......



               // let color_=color;
                //loopDir[color_]=dynJs[myscript_][color_].loopDir;
                // insert all other ask directives 
                //convo.setVar('loopDir',loopDir);// dir about ask as conversational tab 
                convo.setVar('direc',dynJs[myscript].direc);// dir about ask as conversational tab . NOW also the static fields
                convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
                convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
               
               });

            //myoB=dynJs[myscript][color].onChange.bind(dynJs[myscript]),
            myoC=dynJs[myscript].direc[color].onChange.bind(dynJs[myscript]);// probably bind is useless because overwritten by ....(mustache ??)

               controller.plugins.cms.onChange(myscript, color,async function(a,b,c){
                return myoC(a,b,c,myscript,color);
                    } );// can i bind with its obj ?
            //});//();







            
            color11='dyn_rest';// TODO : for all direc do .....

           // myoC=dynJs[myscript][color].onChange.bind(dynJs[myscript]);

           // let myoC1=dynJs[myscript].direc[color].onChange;//.bind(dynJs[myscript]);
            controller.plugins.cms.onChange(myscript, color11,async function(a,b,c){
                //let color_=color,myscript_=myscript;// CORRECT put myscript_ in a closure ! : done
                //return myoC1(a,b,c,myscript_,color_);
                //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
                return dynJs[myscript].direc[color11].onChange(a,b,c,myscript,color11);// this should be set 
                    } );// can i bind with its obj ?

            // hotel3pini_vox

            
            color='colazione_dyn',myscript='hotel3pini_vox',myth='default';
            //let myscript_=myscript;// launch a closure with a internal var the script well be registering :
            controller.plugins.cms.before(myscript,myth, async(convo, bot) => {// default thread will be enougth
                // insert in convo.state obj that will be the mustache context , now only under vars=state.values:
                // see in conversation : let context={ vars: vars }


                // do stuff
               // console.log('starting my_thread as part of my_script');
                // other stuff including convo.setVar convo.gotoThread
                //Object.assign()


                // >>>>>  when conversation render template will bound out to step see it if(excel.out){excel.out.bind(step)}
                // convo.setVar('excel',dynJs[myscript_].excel);

                // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
                convo.step.mustacheF=dynJs[myscript].mustacheF;
                const dc=convo.dc;

                let script=convo.script;// see conversation runBefore 

                // load map  : ask >  tested model list on ask 
                 // ERROR  dynJs[myscript_].excel=modsOnAsk(script);
                 // modsOnAsk will be used by ...........  calling a ref we forgot  . so temporarely put in vars.modsonask :

                 convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
                convo.setVar('excel',dynJs[myscript].excel);// corrected to be as was before

                // example excel.ask.notmatchingdependingdir
                //          excel.amodel={name:
                //                       itemname=[] // alternativi to put in condition regex
                //                       itemvoicename
                //                       itempatt
                 //                           }

                let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


                // ????
                // let outVar={}; // wrapper x loop dynamic main last (sub)intent ask calculate answare
                // ex : outvar.amodelmatchvoicename  like %Msamodelmatchvoicename
                //          generated by onchange using .......

                // in mustache function will be called without context so set out context in global (excel) and dyn out function : 

                //......



               // let color_=color;
                //loopDir[color_]=dynJs[myscript_][color_].loopDir;
                // insert all other ask directives 
                //convo.setVar('loopDir',loopDir);// dir about ask as conversational tab 
                convo.setVar('direc',dynJs[myscript].direc);// dir about ask as conversational tab . NOW also the static fields
                convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
                convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
               
               });

            //myoB=dynJs[myscript][color].onChange.bind(dynJs[myscript]),
            myoC=dynJs[myscript].direc[color].onChange.bind(dynJs[myscript]);// probably bind is useless because overwritten by ....(mustache ??)

               controller.plugins.cms.onChange(myscript, color,async function(a,b,c){
                return myoC(a,b,c,myscript,color);
                    } );// can i bind with its obj ?
            //});//();







            
            color11='dyn_rest';// TODO : for all direc do .....

           // myoC=dynJs[myscript][color].onChange.bind(dynJs[myscript]);

           // let myoC1=dynJs[myscript].direc[color].onChange;//.bind(dynJs[myscript]);
            controller.plugins.cms.onChange(myscript, color11,async function(a,b,c){
                //let color_=color,myscript_=myscript;// CORRECT put myscript_ in a closure ! : done
                //return myoC1(a,b,c,myscript_,color_);
                //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
                return dynJs[myscript].direc[color11].onChange(a,b,c,myscript,color11);// this should be set 
                    } );// can i bind with its obj ?


        // televita 

                    let  myscript_='televita';// launch a closure with a internal var the script well be registering :
                    controller.plugins.cms.before(myscript_,myth, async(convo, bot) => {// default thread will be enougth
     
     
                    // RECOVER STATUS - INIT - COPY to convo.state
     
                    let dialogState=bot._controller.dialogSet.dialogState;// =
     
                    // or directly
                    // somewere before :
                    let state = await dialogState.get(convo.dc.context, { dialogStack: [] });
     
                    // init 
                    state.appstatus={appSt:'start',// status a livello app .
                    
                                     dyn_match:{}};// ??  per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']
             
     
                    let appSt=state.appstatus;// make available in current convo the appState
     
                     // get user status from db query 
     
                     appSt.user={
                         meds:[11,22,33],
                         cur:'rossi'
                     };
                     convo.setVar('appSt',appSt);
     
                     // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
                     convo.step.mustacheF=dynJs[myscript_].mustacheF;
                     const dc=convo.dc;
     
                     let script=convo.script;// see conversation runBefore 
     
     
                      convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
                     convo.setVar('excel',dynJs[myscript_].excel);// corrected to be as was before
     
     
                     let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir
     
     
                    // let color_=color;
                     convo.setVar('direc',dynJs[myscript_].direc);// dir about ask as conversational tab . NOW also the static fields
                     convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
                     convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
                    
                    });
                    let color21='dyn_medicine';// TODO : for all direc do .....

                     myoC1=dynJs[myscript_].direc[color21].onChange;//.bind(dynJs[myscript]);
                     controller.plugins.cms.onChange(myscript_, color21,async function(a,b,c){
                        // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
                         //return myoC1(a,b,c,myscript_,color_);
                         //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
                         return dynJs[myscript_].direc[color21].onChange(a,b,c,myscript_,color21);// this should be set 
                             } );// can i bind with its obj ?
     
        // televita _voice

        myscript_='televita_voice';// launch a closure with a internal var the script well be registering :
        let directives=dynJs['televita'];
        controller.plugins.cms.before(myscript_,myth, async(convo, bot) => {// default thread will be enougth


        // RECOVER STATUS - INIT - COPY to convo.state

        let dialogState=bot._controller.dialogSet.dialogState;// =

        // or directly
        // somewere before :
        let state = await dialogState.get(convo.dc.context, { dialogStack: [] });

        // init 
        state.appstatus={appSt:'start',// status a livello app .
        
                         dyn_match:{}};// ??  per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']
 

        let appSt=state.appstatus;// make available in current convo the appState

         // get user status from db query 

         appSt.user={
             meds:[11,22,33],
             cur:'rossi'
         };
         convo.setVar('appSt',appSt);

         // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
         convo.step.mustacheF=directives.mustacheF;
         const dc=convo.dc;

         let script=convo.script;// see conversation runBefore 


          convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
         convo.setVar('excel',directives.excel);// corrected to be as was before


         let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


        // let color_=color;
         convo.setVar('direc',directives.direc);// dir about ask as conversational tab . NOW also the static fields
         convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
         convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
        
        });
        let color31='dyn_medicine';// TODO : for all direc do .....

         myoC1=directives.direc[color31].onChange;//.bind(dynJs[myscript]);
         controller.plugins.cms.onChange(myscript_, color31,async function(a,b,c){
            // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
             //return myoC1(a,b,c,myscript_,color_);
             //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
             return directives.direc[color31].onChange(a,b,c,myscript_,color31);// this should be set 
                 } );// can i bind with its obj ?

        })();// end register bank (dynJs)
    }// end picms
});




