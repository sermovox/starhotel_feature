var db,rest;// services
let application;

let fsmfactory = function (cfg_) {// a fsm initilized / a rest server access point 
    let cfg = cfg_;
    let botstatus = { processing: 0, log: [] };
    return {

        begin_def: function (cmd, request) {
            // new user comes in ( comes out after a time lag cause channel reset )
            botstatus.log.push(cmd + '-' + request);// request.toString+ time stamp 
        },
        post(action, vars, session, request) {// request is a qs : ?ask=pippo&colore=giallo  (actionurl,convovars,session,req);
            transaction(action, vars, session, request);
            console.log('appserver called session : ', session, '\n vars ', vars);

        }
    }

    function transaction(action, vars, session, request) {// session = app user status; vars=app user view status
        // will work on session and vars (i/o)

        if (action.length > 5 && action.substring(0, 4) == 'tour') {
            let action_ = action.substring(5);
            if (action_ == 'start') {// action='tour-start'
                // we got in new path so rest appstate to 
                session.curprocess = 'path';// cultural or storico is state contained in convo.vars ...
                // .....  access and updates app status session + convo status vars



            } else if (action_ == 'reset') {
                // we got in new path so rest appstate to 
                session.curprocess = null;// cultural or storico is state contained in convo.vars ...
                // .....  access and updates app status session + convo status vars
            } else if (action_ == 'set') {
                session.path = result.path;
            } else if (action_ == 'next') {
                if (session.curprocess == 'path') ;//  ?????   session.path++;
            } else;
        } else if (action == 'register') {
            // call server to get user data 
            // await user=get()
            let user = request.user;
            session.user = user;// will be available as vars.appWrap.session.user
            session.processing=request.service;

            ;
        }


        
    }
}

let WrapApp=function(session,convovars){
    this.sess=session;
    this.va=convovars;
   
}
WrapApp.prototype.aiax=function(actionurl,req){
   application.post(actionurl,this.va,this.sess,req);// session and convovars cant change when i stay in the same convo
}
WrapApp.prototype.begin_def=function(cmd,req){
   application.begin_def(cmd,req);// session and convovars cant change when i stay in the same convo
}



async function getappWrap(bot,convo){// recover session and return a wrapper to have session and with that call the aiax app endpoint
// returns a app endpoint wrapper : appWrap=values.app={aiax:function(actionurl,req),session,begin_def:function serverservice()} aiax will change vars and session
    
                /*      ***************************************
                convo.vars==convo.step.values==convo.step.state.values
                        ***************************************
                */  



/* mng overview          rules in convo status :

 convo status is    values=convo.step.values
  +
 session            session=values.session

 to do aiax in templates and onchange we add appWrap :
getappWrap(bot,convo) sets : appWrap=values.app={aiax:function(actionurl,req),session,begin_def:function serverservice()}

                    appWrap=values.app

nb 

    - when status persist will loose values.app.aiax and begin_def function we ripristine appWrap from values.session

    - if we dont have session we get it from persistant system :
        state = await dialogState.get(convo.dc.context, { dialogStack: [] });
        session=app_session=state.session=state.session||{};

*/




/*
    let basewrap={
        aiax:function(actionurl,req){
            application.post(actionurl,convovars,session,req);// session and convovars cant change when i stay in the same convo
        },
        begin_def:function(cmd,req){
           application.begin_def(cmd,req);// session and convovars cant change when i stay in the same convo
       }
    }*/

    let values=convo.step.values;

    // already set in this convo ?
    if(values.app){// the wrking convo values , appWrap=values.app

        console.log( 'getappWrap, onchange/before recovering state,wrapper already set , session  : ',values.app); 
    if(values.app.aiax){
        console.log( 'getappWrap returns , found values.app.aiax');
        return }// is the app wrapper
    else if(values.session){// need to re add the wrapper as the status persist only with plain obj  , string and number
       // values.app=Object.assign({session:values.session},basewrap);

    }else ;// error
}

    if(!values.session){
    let dialogState=bot._controller.dialogSet.dialogState;// =

    // or directly
    // somewere before :
    let state = await dialogState.get(convo.dc.context, { dialogStack: [],error:true });// must be found
        if(state.error);// error
        if(state.session);//error 
 
   // QUESTION  : non basta che faccia questo al begin del default thread ( butto app in values ????
 
 // changing 052020 .  
  //  state.appstatus={appSt:'ok',dyn_match:{}};// status a livello app . per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']
 
  values.session=state.session||{};
    }


 //here a onchange can call : 
 
//  let convostatus=convo.vars,request={path:'cultura'};// >>>>>>>>>>>>>>>>>>>   put all fw staff under vars.frameW   !!!!  ex  vars.matches  > vars.frameW.matches
 


 //convostatus=application.post('tourstart',convostatus,app_session,request);// request is a qs : ?ask=pippo&colore=giallo
 function wrapgen(session,convovars){
     //let app_session=session;convovars=convovars;// closure var

     return {
     
     aiax:function(actionurl,req){
         application.post(actionurl,convovars,session,req);// session and convovars cant change when i stay in the same convo
     },
     begin_def:function(cmd,req){
        application.begin_def(cmd,req);// session and convovars cant change when i stay in the same convo
    },
     //session:app_session
     session
     }
 
 };
 let app_session=values.session;
 
//let convovars=values;
// one or the other
values.app=wrapgen(app_session,convo.vars);
 //values.app=new WrapApp(values.session,values);



 console.log( 'getappWrap, onchange/before recover state , app wrapper (vars.app) = ',values.app,'\n session ',values.session); 

 

}









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

var dyn_medi_f =  // used in vita , ...
    
    
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
         //   gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

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
          // error in vmatch  gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

        }


        console.log('dyn_medicine onchage matched group :',gr);


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
    if(mat=='contr'||mat=='no'){// so the user need is to to check or anyway to prompt the queryed list (contr= controllare lista )
       // mydyn.param.desired='miss';// ['when']// the prpoperty more important to give: when  something is somewhat
        // mydyn.param.when=mydata[blRes][8];// e/o mydyn.param.wh=mydata[blRes][8];

        mydyn.param.info= null;//info to display func of mod_assumere_med and mod_wh ????

        // route and display when , then ask x detais , then returns to menu 
        mydyn.complete='miss';
    }else if(mat=='ok'){//  so the user need is to check to confirm the absunction . try to use same view of how just set a different flag for mustache 
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

    // ******   TO CORRECT : no more ,is useless and disturbing if we pass to  a relay 
    // convoSt.userTurn=null;


    
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

var dyn_museo_f = 
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
// convo.vars is available as convo.step.values or 

    // CHECK IT
    // PROBABLY think this func a method of the obj we insert the func : 
    //          >> vars.dynfieldobj so try to set this=vars.dynfieldobj

                /*      ***************************************
                        convo.vars==convo.step.values==convo.step.state.values
                        ***************************************
                */  



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


    // TTOO DDOO  : at path starting the sal ais not requested so the app server will set to first >>>   manage it in ......

// matches.mod_Serv.match must be defined as we here must find a resource of a  group 
if(!matches.mod_Serv.match)matches.mod_Serv.match='col';// the first sala of path !!!!!!!!!!!!!!!!
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

 //  see getappWrap .... 

 

// setting a convo app wrapper 
//appWrap=values.app={aiax:function(actionurl,req),session,begin_def:function serverservice()}
await getappWrap(bot,convo);// get and make available in current convo the appState wrapper in values=vars=convo.step.values;
                            // appWrap=values.app
let appWrap=convo.step.values.app;
request={path:'cultura'};// request={path:vars.matches.match};
appWrap.aiax('tour-start', request);







//  let convostatus=convo.vars,request={path:'cultura'};// >>>>>>>>>>>>>>>>>>>   put all fw staff under vars.frameW   !!!!  ex  vars.matches  > vars.frameW.matches
 
 //convostatus=application.post('tourstart',convostatus,app_session,request);// request is a qs : ?ask=pippo&colore=giallo



// >>>>  also a call can come in a condition $$$$ using let session=vars.appWrap.session; vars.appWrap.aiax('action', request={ask:pippo})
   
   
   
   
   // here as start :
//   values.appSt=state.appstatus;// make available in current convo the appState
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








//////////////////// 052020 :
// can be ported on dispacher action with a aiax , then returned in 
//          - session/convo.vars (vars.askmatches.......)
//               or 
//         - justin (json) result (res) and set here its askmatches ??????????????









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
   state.appstatus.dyn_match={};
   state.appstatus.dyn_match[ask]={match:blResNam};// has meaning only if 1 match

   session


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
         //   gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

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
          // error in vmatch  gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

        }


        console.log('dyn_medicine onchage matched group :',gr);


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
    if(mat=='contr'||mat=='no'){// so the user need is to to check or anyway to prompt the queryed list (contr= controllare lista )
       // mydyn.param.desired='miss';// ['when']// the prpoperty more important to give: when  something is somewhat
        // mydyn.param.when=mydata[blRes][8];// e/o mydyn.param.wh=mydata[blRes][8];

        mydyn.param.info= null;//info to display func of mod_assumere_med and mod_wh ????

        // route and display when , then ask x detais , then returns to menu 
        mydyn.complete='miss';
    }else if(mat=='ok'){//  so the user need is to check to confirm the absunction . try to use same view of how just set a different flag for mustache 
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

    // ******   TO CORRECT : no more ,is useless and disturbing if we pass to  a relay 
    // convoSt.userTurn=null;


    
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
}// ends dyn_museo_f



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



   console.log(' onchange, app status is : ')
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
          // error if matches.mod_Serv.vmatch is void>>>>>  gr[5]=matches.mod_Serv.vmatch;       // so let the vname be the same ( ) ( from knowing the projection model rebuild the bl model )

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


// ******   TO CORRECT : no more ,is useless and disturbing if we pass to  a relay 
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


// colazione_dyn or dyn_col is still to implement 





// format : fwAskOnChange={modelname:{askname:f,,,},,,]// the modelname usually can be the cmdname , but different cmd version have same modelname
let fwAskOnChange={televita:{dyn_medicine:dyn_medi_f},
                    museoAQ:{dyn_medicine:dyn_museo_f},
                    hotel3pini_vox :{ dyn_rest:dyn_rest_f},
                    hotel3pini :{ dyn_rest:dyn_rest_f},
                    hotels :{ dyn_rest:dyn_rest_f,colazione_dyn:dyn_rest_f}
                };// fwOnchange functions : will be injected on directives
function init(db_,rest_,appcfg,session){db=db_;rest=rest_;
    application=fsmfactory(appcfg);// init application
}
function buildF(ask,ftext){
    fwAskOnChange[ask]=null;
    // use a text and get a function using :
    //  - eval or function returning a function to insert in a promise


}// insert db and rest services
module.exports ={init,onChange:fwAskOnChange,buildF,getappWrap};// onChange:will overwrite directive onchange