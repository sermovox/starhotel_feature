let 
dynJs=require('./models.js'),// dynJs=comands={cmddir,cmd2dir,,,,} , db and http init by bot.js
//models_directives=dynJs,

// should be also controller.plugin.vCtl.appWrap
fwOnC;// injected on the init of this module , require('./onChange.js'),//fw onChange to register, can also be passed when create the module !

let db,rest,Schema;
let controller;
let app;
console.log('\n starting FW initCmd ,dynJs:  ',dynJs);



// a directive fw cb bank
/* moved in fwhelpers
let dynMatch=function(a,b,c){// put in a sort of interface TO complete in setSetvice , or a def matcher template
    // ?? directive.direc[mkey]
    // using directive info run fts using db/http directive.excel[dynMod]

    // built using some fw matcher component ( fwHelpers) 
    //      integrated by user cb to custom some part of matching process like service_
};*/
let dynMatch=null;//  moved in fwhelpers

// TODO : user service injection 
// user will use some service function he provide in dynJs.service[afunc]=funcion(){} ( or registering like fw.controller();)
//      eventually using some fw  base helpers like fwHelpers , 
//              example   old service helpers 
//                        httpService : 
//                              - .....  
//                          or
//                        fillDependingUseCtl returns null and req is std middleware :
//                              - if we match some model , we can see if there are some where depending dyn ( no fts , just a usual were select) that can be launched when this where is match
//                                  if all other depending where model were matched we can run the query ( knowing all where clauses ) to get (db/rest query)the depending dyn  and fill the dyn match status
//                                     nb knowing a model match , the dyns that has that model as a  where clause  are got from dialog config :....
//              see x example  httpService= httpFarm(fwHelpers)  , so registering using  dynJs.service['httpService']=httpService;
//                  nb httpService: match a dyn (fills matcher status ....) , also if it has not a askkey , with a db/rest query , the params are got from config dialog 
// using vars.dir.service.httpService  or vars.app.service['httpService']






let service,
fwCb={fWService1:null,askS:{dynMatch},thS:{}};// example of void schelethon  directives fw service  to be used on convo to process directives
                                            // fwCb.asks.dynMatch will be a ask matcher of some type provided by framework  
let fwHelpers={};// base service function provided by framework. usually used in service.js and then made available/injected  to convo


// TODO    try to put also modsOnAsk in onChange :
//let{ mustacheF,modsOnAsk}=require('./mustacheFwFunc.js');//fw onChange to register


let init=function(){// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
// db=db_,http_=http;// or better use them in services ??



    /*   require('./fwHelpers')(fwHelpers,fwCb,db,rest) returns
    fwHelp=refImplementation={
    onChange_dynField(entSchema,text_,wheres,idspace,isDb_Aiax) interface to db manager engine to query entities with join relatations (in entSchemas ) and id/keys 
                                                                the db manager ,recovering schema+url (in model.js) , can request a query to a db server
    rest__: async function (entity, uri, params, method, outmap, limit) {// not used now,
    run_jrest: async function (uri,formObj, method) returns the object if run_rest returns a json
    run_rest: async function (uri,formObj, method) general rest interface
    dynMatch:async function((url,)entity,text=searchterm,wheres,isDb_Aiax,cb) // put in a sort of interface TO complete in setSetvice of fwCb , or a default matcher template to custom in fwCb.asks/model
                                                    interface to rest engine to query entities with minimum relation expressed by general properties ( terms + where )
                                                                                                        ( url and where entity mapping can be recovered in model.js )

                                                    customization (put in fwCb) can interface a data service adapter:
                                                        - interfacing to db engine using onChange_dynField (internal db adapter) or similar interface 
                                                        - a proper rest param invocation interfacing rest like adapter data service
     
    }    */
 
let fwHelp=require('./fwHelpers')(fwHelpers,fwCb,db,rest,dynJs);// extend fwHelpers (using fwHelpers and fwCb) with other  base fw functions 
// fwHelp={db,rest+refImplementation properties}
//service=require('./service').setService(db,http,fwHelp,fwCb,dynJs);// db,http too ? nb also here we have to insert function in dynJs from text ( model Matchers ) : do like after in HEI ?
service=require('./service').init(fwHelp,fwCb,dynJs);//extend fwHelp (using fwHelp and fwOnC) with other  user fw functions 
                                                    // db,http too ? nb also here we have to insert function in dynJs from text ( model Matchers ) : do like after in HEI ?
// service={db,rest+refImplementation properties + service provided properties}

// Load SERVICES in VCTL : 
fwOnC.injService(service,fwCb);// now pass also in vCtl(=fwOnC) the services available for run time in case we add user onchange in onChange.js obj 
                                // >>> but if the onchange comes from cms the services will be available with following initCmd !!!!

initCmd("televita",{meds:[11,22,33],cur:'rossi'},['dyn_medicine']);// (cmd,usrAppSt,[keys in bank dynJs[myscript] to register])
initCmd('televita_voice',{meds:[11,22,33],cur:'rossi'},['dyn_medicine'],'televita');
initCmd('museoAQ',{meds:[11,22,33],user:'rossi'},['dyn_medicine']);


/* warning hotels was bound differently :
color=dyn_colazione
controller.plugins.cms.onChange(myscript, color,async function(a,b,c){
    return dynJs[myscript].direc[color].onChange.bind(dynJs[myscript])// probably bind is useless because overwritten by ...
    .(a,b,c,myscript,color); .......
color11='dyn_rest';
controller.plugins.cms.onChange(myscript, color11,async function(a,b,c){
    return dynJs[myscript].direc[color11].onChange(a,b,c,myscript,color11);// this should be set 
*/
initCmd('hotels',{meds:[11,22,33],cur:'rossi'},['colazione_dyn','dyn_rest']);

/* warning hotel3pini was bound differently :
color=dyn_colazione
controller.plugins.cms.onChange(myscript, color,async function(a,b,c){
    return dynJs[myscript].direc[color].onChange.bind(dynJs[myscript])// probably bind is useless because overwritten by ...
    .(a,b,c,myscript,color); .......
color11='dyn_rest';
controller.plugins.cms.onChange(myscript, color11,async function(a,b,c){
    return dynJs[myscript].direc[color11].onChange(a,b,c,myscript,color11);// 
// probably bind is useless because overwritten by ...
*/
// colazione_dyn is still to implement , from login helper get {meds:[11,22,33],cur:'rossi'}
initCmd('hotel3pini',{meds:[11,22,33],cur:'rossi'},['colazione_dyn','dyn_rest']);

/* warning hotel3pini was bound differently :
color=dyn_colazione
controller.plugins.cms.onChange(myscript, color,async function(a,b,c){
    return dynJs[myscript].direc[color].onChange.bind(dynJs[myscript])// probably bind is useless because overwritten by ...
    .(a,b,c,myscript,color); .......
color11='dyn_rest';
controller.plugins.cms.onChange(myscript, color11,async function(a,b,c){
    return dynJs[myscript].direc[color11].onChange(a,b,c,myscript,color11);// 
// probably bind is useless because overwritten by ...
*/
initCmd('hotel3pini_vox',{meds:[11,22,33],cur:'rossi'},['colazione_dyn','dyn_rest']);

initCmd('star_hotel',{meds:[11,22,33],cur:'rossi',service:'hotel'},['dyn_medicine','ask_afterpilldet']);// copied from 'televita_voice'
initCmd('config',{meds:[11,22,33],cur:'rossi',service:'hotel'},['dyn_medicine','ask_afterpilldet']);// copied from 'star hotel
initCmd('_yourname',null,null);// a child , no ask to support just load cmd vars.excell and vars.direc


// autoregistration of OnCh_Register

for (x in dynJs) {
    let asks=[];
    if(x.autoReg){// automatic registration of all onchange 

        if(x=='manualreg'){// do here manual registration 

            // initCmd(x,{meds:[11,22,33],cur:'rossi',service:'hotel'},['dyn_medicine','ask_afterpilldet']);
        }else{
        for (y in dynJ[x].direc) {
            if(x.autoReg)// automatic registration of all onchange 
            asks.push(y);
          } 
          initCmd(x,null,asks);
        }
    }
  } 


return service;
};// end register bank (dynJs)




 // example usrAppSt={meds:[11,22,33],cur=user:'rossi'} , current user got from previous  botframework loging service call : TODO
 // should be like a frame connect a ws to a bot using login in main browser windows .......
function initCmd(myscript_,usrAppSt,monchange,mod_dir){
    
    // ***  will set dat to provide fw support (in onchange ) on monchange list of ask that are defined in fwOnC.onChange ( onChange.js)

    /*
    ((myscript_/cmd: the cmd
     usrAppSt: param to load on application server to serve this convo 
     monchange : list of onChange ask function name on which i want vframework support monchange=[,,mkey_i,,]  , mkey is a ask name 

                 the functions mykey_i  will be registered in  directive.direc[mkey_i] 
                            , directive=(dynJs=require('./models.js'))[model=cmd], 
                        from :
                        -  (thevoicectl=fwOnC=controller.plugins.vCtl).onChange[model=cmd][mkey]
                                        fwOnC.onChange=fwAskOnChange=fwAskOnChange={cmd:{askname1:onchangefunc1,,,,,},,,}
                                controller.plugin.vCtl= require('./nat/onChange.js') is set in bot.js 
                        or
                        - a downloaded func definition string from cms put in: directive.direc[mkey].onChange_text)  , // build from text with eval

     model-dir : if present set model instead of cmd

 
* ****************  as in onChange.js : mng summary on framework onchange settings in a command :
 onChange functions onChange=fwAskOnChange={modelname:{askname1:onchange1_function,,,}} will be injected on model models.modelname.direc.askname1.onChange,
      if modelname param is missing we take modelname=cmdname
 in fwbase.initCmd('cmdname',{meds:[11,22,33],cur:'rossi'},[askname1,,,],modelname) will be loaded the modelname asks functions on cmd cmdname
 will be usually injected on models.modelname.direc.askname.onChange

 usrAppSt: the param to load on application server service (starting status)
        begin_def(myscript_,usrAppSt) 
        to inform a process is requested by dialogstack started by cmd : myscript_  with param usrAppSt
monchange : list of onChange ask function on which i want vframework support

model-dir : if the model name  is different by cmd name myscript_) 

usage : 
initCmd('star_hotel',{meds:[11,22,33],cur:'rossi',service:'hotel'},['dyn_medicine','ask_afterpilldet']);// copied from 'televita_voice'
initCmd('config',{meds:[11,22,33],cur:'rossi',service:'hotel'},['dyn_medicine','ask_afterpilldet']);// copied from 'star hotel

*/


    let myth='default',
    directive;// directive= ( dynJs=comands={cmddir,cmd2dir,,,,} ) .acmd

    //if(!dynJs[myscript_])return;// error


    let cmd=mod_dir|| myscript_;// was called model that was a bad name,   MODEL IS REALLY the Command script ! so we changed in cmd 

    if(cmd){if(dynJs[cmd])directive=dynJs[cmd];// directive= ( model.js()=dynJs=comands={cmddir,cmd2dir,,,,} ) [acmd=model]  , model is a bad name for cmdname
        else{ 
            console.log('\n starting FW initCmd ,cant find any models or directives for cmd   ',myscript_);
            return;
        }
        }
        //else {            if(dynJs[myscript_])directive=dynJs[myscript_];else{
        //        console.log('\n starting FW initCmd ,cant find any models or directives for cmd   ',myscript_);
        //    return;}        }



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


   console.log('\n starting FW initCmd , so registering convo.before for cmd   ',myscript_,' thread default ');
            //let  myscript_='televita';// launch a closure with a internal var the script well be registering :
            controller.plugins.cms.before(myscript_,myth, async(convo, bot) => {// default thread will be enougth



                /*      ***************************************
                convo.vars==convo.step.values==convo.step.state.values
                        ***************************************
                */  



                /*
            // RECOVER STATUS - INIT - COPY to convo.state

            let dialogState=bot._controller.dialogSet.dialogState;// =

            // or directly
            // somewere before :
            let state = await dialogState.get(convo.dc.context, { dialogStack: [] });

            // init 
            state.appstatus={appSt:'start-'+myscript_,// status a livello app .
            
                             dyn_match:{}};// ??  per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']
     
oo
            let appSt=state.appstatus;// make available in current convo the appState

            */

           let values=convo.step.values,session=values.session,appWrap;

           // getappWrap(bot,convo) sets : appWrap=={aiax:function(actionurl,req),session,begin_def:function serverservice()}
         // example usrAppSt={meds:[11,22,33],cur:'rossi'} , current user 'rossi' should be got from previous  botframework loging service call : TODO

            // ****  if we comes from a convo that passed a already set of vars continue with some , other specific x this convo will be replaced
            //      but function like controller appWrap=values.app  must injected at every convo start !!!
            // if(!values.app)// we could put app in context then wrap it with values.session here ? seems no better way 


            // SESSION / APP MNG 
            // > when cmd starts on def thread is like a page download so after some data gathering the user fire a onclick/onChange
            //      THAT ONCHANGE CAN  
            //      - DO AIAX/REST 
            //      - POST BACK to the post host ctl that gave the page  waiting on the page end point to manage the user session data and the postback forms data 
            //          the page can be tied to the cmd/thread so the user in onchange do a post with a form , thaen the post is received by
            //          a relay that forward the post to a cmd ctl that can also add a level  searching for a ctl available for the sending thread 
            // in start a child app is recovered from status but not the functions , so them must be recovered by getappWrap 
            //          that ctl can also be thought as a on click available for the firing cmd/thread in a spa that can also fire 
            //          a level up post to a external page controller waithing apostback on yhe page/cmd ctl
            //          that external clt ( reached with a POST rest call ) can get the usersession , do the action available for the page post ctl
            //          then rsetting the dialog set (as a page download) then prompt the user to start the dialog set triggering the first cmd on the dialog set 




            // IF app is given by bot.js , better register session and app here or in onChange fwOnC ??

            // IN THIS POSIION we suppose to KNOW what is the controller to manage the user request ( equivalent to express routing of controller from url of http request)
            // usually the user start convo , then when trigger an application action to do , we start a app dialog/convo and this will route// attach the app 
            // to manage the user application needs , so in a onClick ( a condition/onChange) i can run a app routine to manage the user transaction calling a closure function :
            //      $$$$ - fire :vars.session.app.post(action,FORM)  so chiamiamo il listener come richiedo qualcosa al web server mandando un post alla pagina servente o a una altra pagina
            //                                              che chiamera' la routing servente anche guardando gli altri param del FORM ( in effetti il action puo stare nel form stesso !)
            //           - and set a vars.x with the cb as usual
            // that association can be done in the custom field attaching a app that someone will add in service ( when we download the cms staff) like 
            //          $$$$ vars.session.setApp='aservicefunction'
            // OR here looking for some app registered on this cmd myscript_ in  bot.js  , 
            // so to set the 'express' handler that will receve all appwrap.x request from any matched condition/onchange ( like onClick in a android/browser app)
            //   x usually is 'post' but we can add some upper level (.begin_def)to manage the routing 
                let trigApp,appcfg;

             const dc=convo.dc;

             let script=convo.script;// see conversation runBefore 


            // ********     so never extend again in this Multidialog Status Chain ******

            let injected=convo.vars.convoCont= convo.vars.convoCont||{};
            if(!injected[myscript_]){

                if(directive.excel)appcfg=directive.excel.appinit;

                // check if this cmd is triggering a action/appctl (post) endpoint : the ctl/app will be routed for .x expecially .post request !

                if(app){if((trigApp=app(null,rest,appcfg,null,myscript_) ));else trigApp=app(null,rest,appcfg,null,'def');}
                if(trigApp){
                    // also :
                    // - set a filter on the dialog the cms can trigger (set the incontext )
                    // OR , better, 
                    // - CCDD : JUST manage the triggering of (all dialog related to) a app in a 'controller  dialog' ( level 0)
                    //      so when triggered cmd ' order' we attach order app and launch the order controller entry dialog cmd='order' (level 1) that will promt used for a action on order app
                    //       so we can do some order action and when finished we :
                    //          - do not COMPLETE the dialog : because we let the base cmd triggering only to controller dialog  only 
                    //          - but goto the order cmd that will trigger other action using condition match
                    //      only when the user leave the order app we count the cms triggering the next app controller dialog 
                
            values.app=await fwOnC.getappWrap(bot,convo,trigApp);// ****  SESSION and app RECOVER : // will put in convo.vars  user session status and register a serving app , check  appWrap in vars.app ....
                                                        // so attach in session.appWrap a relay where register in  a app that can manage events fired (appWrap.post() by  ( onchange/onclick/askconditions) fired by the view level 
                                                        // 
            // getappWrap(bot,convo) sets : appWrap=fwOnC..appWrap ; vars={channel,user,....}
            app.service=service; // needed ? 
            appWrap=values.app;
                }

           // appWrap=values.app,session=values.session; // now do here for clarity  :

           /* infact appwrap just :
            appwrap= {   service,fwCb,
                    post:function(actionurl,req){// session and convovars cant change when i stay in the same convo
                                        application.post(actionurl,convovars,session,req);},
                    ,,,}
                = function(convo){session=convo.vars.session;req.session=session;return {,,,post:function(url,req){}} }
            so in a cmd prepare a wrap call to post() collecting session param (a convo prop) in the closure
            so is a convo helper (convo.app) that uses convo property ( convo.vars.session) making the call to post() easier with less param
            */

           // user example usrAppSt={meds:[11,22,33],cur=user:'rossi'}


            // FOLLOWING we explore a different approach ( just studing ) 
            //  - have a express endpoint .begin_def that prepare a routing ctl that can be served using a .post endpoint 
            // supponiamo non ancora aver fissato il routed ctl per questo cmd , ma preferire di comunicare con i ctl non selezionandolo e poi avere connessione diretta 
            //  ma sempre attraverso  la supervisione del router ( il express end point ) ,
            //  quindi  vogliamo avvertire il serverexpress che lo user is in current cmd that could ask some request to the cmd controller to invoche later
            //      > so the serve will init the cmd controller that will be ready to recive a following request from the bot
            //  inform server endpoint a major comand is requesting ( so call .begin_def  a request to express service to use a routing ctl)
            appWrap.begin_def(myscript_,usrAppSt);// inform app server we start a new convo so prepare/continue serving and the new context is usrAppSt  
                                                // also can WARN FW code that user is using a app ctl , so dialogs/cmds are serving a bl specific app
                                                // for example set in/out context can be set in 'controller  dialog' (see CCDD) to chain next triggered dialog ( a )

             // get user status from db query , so now request the 'register' action ( like a onclick listener ) on the previously declared myscript ctl ( so call .post to request some to the myscript_ ctl )
             //     >> 
             appWrap.post('register',{user:convo.vars.user,data:usrAppSt,service:myscript_});// a db query will set user data on session.user={name,property1,,,}to goon this convo

             console.log('+++++++++++++ ùùùùùùùùùù convo begin : init fw vars for  cmd   ',myscript_);
             // alredy set  : convo.setVar('appSt/appWrap',appSt);

             // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
             //convo.step.mustacheF=dynJs[myscript_].mustacheF;

             //convo.step.mustacheF=// review template generator in convo the delete this !!!!!!!!!!!!!!!!!!!!!!!!!!!!
             // alredy done fwOnC.mustacheF=mustacheF;


            //  convo.setVar('app',appWrap);// transfer to fw convo works but  not x function obj ?
            
             // convo.openStep.state.app=appWrap;// already done



             //// NB non status directives , excel and direc are set here because they must be got also in msg template , , shoud be set as commented in onChange WUI

            // >>>  fw function injection : functions that must be available in UserOnChange (cmd.direc[mkey].onchange() ) and not depend on user (session), (user) cmd, (user) turn 
            //  , now we  put the services in onChange.js (onChange.service)  , so :
            //      (so  onchange can come also dowloaded  from cms onchange in json) :
            //   - setting a convenient this context on cmd.direc[mkey]  :
            //          this={
            //          direc definition, 
            //          services=injected service injService(service,fwCb),
            //          appWrap,
            //          }
            //          >> so extend cmd_directive.direc[mkey]={data,,,onChange } with :
            //              onChThis=Object.assign({},service,fwCb,appWrap);//
            //      so when run direc[mkey].onchange() will find services on this.service.some service 



            // extension : probably needed because of the child extends its vars from the father status, so the father vars are available in the child
            // SO A beginDialog set its var extending the var of the father , and now her where we add excel and direc must extend current excel and direc 
            //      and not overwrite them ! 
            //  but as a thread can called more times we should check if the addition is alredy done ( a cmd add once excel and direc , not more  )
            //  so set a counter vars.convoCont !!

            ////////////////////   DO NOT INSERT TWO TIMES in A CONVO a proper structures addding structures  so no excel on the same excel   wheres ,,,,, 
            // the case is call 2 times def thread so begin run twice !!!!!!!!

            /* ********     so never extend again in this Multidialog Status Chain ******

            let injected=convo.vars.convoCont= convo.vars.convoCont||{};
            if(!injected[myscript_]){
                */


                let exten=convo.vars.excel||{};
            // convo.setVar('excel',directive.excel);// // ovewrite previous convo excel  data , corrected to be as was before
            convo.vars.excel=Object.assign(exten,directive.excel);// extend present excel with current convo excel, avoid duplicate name !!!

                        // let color_=color;
            // info about current dialog definition , 
            // convo.setVar('direc',directive.direc);//  // ovewrite previous convo excel  data , dir about current cmd asks as conversational tab . NOW also the static fields
            let exten2=convo.vars.direc||{};
            // convo.setVar('excel',directive.excel);// // ovewrite previous convo excel  data , corrected to be as was before
            convo.vars.direc=Object.assign(exten2,directive.direc);// extend present excel with current convo excel, avoid duplicate name !!!
                
            find_wheres(convo.vars);// insert wheres on dependend dyn as mod_wh_Of of its depending wheres 

            injected[myscript_]=true;// ********     so never extend again in this Multidialog Status Chain ******
            }
            
            // every time ???????
            convo.setVar('modsonask',fwOnC.modsOnAsk(script));//  modsOnAsk used in .out miss func x current script

            /*
            // portare fuori che lo faccia il framework questo e init da far fare al framework !!!!
            if(!convo.vars.excel.Toinit){
            find_wheres(directive);// insert wheres on dependend dyn as mod_wh_Of of its depending wheres 
            }
            convo.vars.excel.Toinit=true;
            */


             let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir




             // status of convo algo var and user navigation on convo

             if(!convo.vars.matches)// previous matches in previous convo will be mantained
             convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
             


             if(!convo.vars.askmatches)
             convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()

            // >>>>>> Chains user registered before for default thread cb :
            // SERVICE INJECTION  in directive.thread['default'] User BEFORE CONTROLLER  ( directive=dynJs[cmd])

            if(directive.thread&&directive.thread['default']){
                let onChThis=Object.assign({},{cmdModels:dynJs[cmd]},directive.thread['default'],{service},{fwCb});// clone directive.thread['default'] + add extension contexts 
                if(directive.thread['default'].before_text)onChThis.before=buildF('default',directive.thread['default'].before_text);// text from cms,  build from text with eval
                if(fwOnC&&fwOnC.before&&fwOnC.before[cmd]&&fwOnC.before[cmd]['default'])onChThis.before=fwOnC.before[cmd]['default'];// overwrite directive.direc[mkey].onChange using fwOnC.onChange
            }

            
            });// end before()


             // >>>>>> ADDS user registered before for other thread cb :
            // SERVICE INJECTION  in directive.thread['default'] User BEFORE CONTROLLER  ( directive=dynJs[cmd])
            //   .............................

            // >>>>>  SET Directive convo event(tyed to begin after th or step/ask example dynmatchers in ask condition loop  ) service/handler
            // add a directive fw cb bank, so put here 

            // >>>>>  SET botkit convo FW ONCHANGE ASK service/handler/controller
           if(monchange)monchange.forEach(function(mkey){// for each ONCHANGE

            // set botkit convo onchange service/handler , can also get from a eval/Function from a functext then inserted on fwOnC[mkey] where service can be used !
            // dynJs[myscript_].direc[mkey].onChange_text OR a text from cms trigger in json
            //console.log( 'registering on cmd ',myscript_,' ask ',mkey, ' dynJ : ',dynJs[myscript_]);
            console.log(' FW initCmd :  convo begin : setting onchange for  cmd   ',myscript_,' onchange for ask ',mkey);
            if(!directive.direc[mkey])return;

            // WARNING  bad naming : model IS really a cmd !!!!!!

            // build function from text downloaded inside directives=dynJs    HEI

            // >>>>>>> set UserOnChange on current cmd directive.direc[mkey] obj , set also this context to inject all service we need to run onchange
            // so directive.direc[mkey] will have :
            //  - user definition directive.direc[mkey] , directive=dynJs[model];// directive=dynJs=model.js()=comands={cmddir,cmd2dir,,,,} , model is a bad name for cmdname
            // + service and fwCb functions
            // + onChange =(fwOnC=onChange.js...).onChange[model][mkey] user provided onchange

            // SERVICE INJECTION  in directive.direc[mkey] User ASK CONTROLLER
            //let onChThis1=Object.assign(directive.direc[mkey],service,fwCb);// service injection in directive.direc[mkey] user controller
            let onChThis=Object.assign({},{cmdModels:directive},directive.direc[mkey],{service},{fwCb});// service injection in directive.direc[mkey] user controller
            //if(directive.direc[mkey].onChange_text)fwOnC.buildF(mkey,directive.direc[mkey].onChange_text);// text from cms,  build from text with eval
            if(directive.direc[mkey].onChange_text)onChThis.onChange=buildF(mkey,directive.direc[mkey].onChange_text);// text from cms,  build from text with eval
             // onchange injected from cms, todo: buildF must add services in scope/context
            // adds serviceson ctx via fwOnC=onChange.js extension ? 

            // if(fwOnC&&fwOnC.onChange[model]&&fwOnC.onChange[model][mkey])directive.direc[mkey].onChange=fwOnC.onChange[model][mkey];// overwrite directive.direc[mkey].onChange using fwOnC.onChange
            if(fwOnC&&fwOnC.onChange[cmd]&&fwOnC.onChange[cmd][mkey])onChThis.onChange=fwOnC.onChange[cmd][mkey];// overwrite directive.direc[mkey].onChange using fwOnC.onChange

            // register also the schema on connection :
            if(onChThis.onChange&&onChThis.schema&&onChThis.schemaurl){

                // do not use db , debug only  :
                db.model(onChThis.schemaurl,new Schema(onChThis.schema)); // register also the schema on std connection   : OLD just to debug never use it 
            }




            //let mkey='dyn_medicine';// TODO : for all direc do .....

             //let myoC1=dynJs[myscript_].direc[mkey].onChange;//.bind(dynJs[myscript]);

                // ERROR on context setting . probably cms.onChange will bind with something
                // infatti in cms onchange si richiama convo.onChange(variable_name, handler=async function()....  di sopra );
                //  ORA CONVO ONCHANGE PRENDE L'HANDLER E LO CARICA SUl bank  CONVO._changeHooks[variable]
                /// quando si fire il onchange da onStep si chiama 
                //                runOnChange(variable, value, dc, step) {......
                //                  yield handler.call(this, value, convo, bot);......
                // >>>>> quindi il context e' settato su convo stesso
                // conclusioni    : passare il context onChThis in qualche parametro che viene passato al onChange 
                //          MA NON ESISTONO !!!!
                //              ad esempio non convo  che non viene passato al mio onchange perche si crea un nuovo convo
                //          quindi banalmente lo inserisco in una closure CLO dove setto il mycontext=  onChThis


                /* useless wrapper 
               let myOnCh= async function(bot,convo,res){
                    // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
                     //return myoC1(a,b,c,myscript_,color_);
                     //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
    
    
                     // the run context of function is  directive.direc[mkey] see X on chart RT1, shouldnt put also some context like excel??(instead of get it ...)
                     // return directive.direc[mkey].onChange(bot,convo,res,myscript_,mkey);// this should be set different from directive.direc[mkey]
                     return onChThis.onChange(bot,convo,res,myscript_,mkey);// this should be set different from directive.direc[mkey] > PERCHE ????
    

                    } // can i bind with its obj ?
                    */
                    /*
            let myClosure=function(){// sol a : in onChThis.onChange i can get onChThis=convo.fwbase_this that is a additional  app context 
                    
                        mycontext=onChThis;
                        // add that to a run time param or to a function property 
                        return async function(bot,convo,res){
                            convo.fwbase_this=mycontext;
                           //  myOnCh(bot,convo,res);
                           // NB myscript_ can change so dont copy 
                           return onChThis.onChange(bot,convo,res,myscript_,mkey);// this should be set different from directive.direc[mkey] > PERCHE ????
    
                        }
        
        
                    }
                   // no  dont work returning not this 
                    let wrapContextGen2=function(that){// nella sua closure ha le variabili che usera quando il factory verra chiamato 
                        //cant :this=Object.assign(this,that,directive.direc[mkey],service,fwCb);
                         this.onChangexx= onChThis.onChange;// method added on the object . so as added cant cover exixting obj 
                        let newobj=Object.assign(this,that,directive.direc[mkey],service,fwCb);
                        return newobj;
                    }
                    let myClosure2=function(bot,convo,res){// sol b : in onChThis.onChange i can get onChThis ....
                    
                        //mycontext=onChThis;
                        // add that to a run time param or to a function property 
                        new wrapContextGen2(this).onChangexx(bot,convo,res);
        
        
                    }/*

                    let myClosure3=function(bot,convo,res){// sol b : in onChThis.onChange i can get onChThis ....
                    
                        //mycontext=onChThis;
                        // add that to a run time param or to a function property 
                        onChThis.onChange.call(new wrapContextGen3(this),bot,convo,res);
        
        
                    }
                    let wrapContextGen3=function(that){// nella sua closure ha le variabili che usera quando il factory verra chiamato 
                        this=Object.assign(this,that,directive.direc[mkey],service,fwCb);


                    }*/


                    let myClosure4=function(bot,convo,res){// sol bd : in onChThis.onChange i can get onChThis ....
                    
                        // this is the context that called cms onChange=myClosure4
                        // so add the onChThis custom onchange 

                        //let that=Object.assign(this,{cmdModels:directive},directive.direc[mkey],{service},{fwCb});
                        let that=Object.assign(this,onChThis);
                        //reassign the context 
                        return onChThis.onChange.call(that,bot,convo,res,myscript_,mkey);// seems useless the call
        
                    }

            // REGISTER FW ASK CTL 

             controller.plugins.cms.onChange(myscript_, mkey,
                /* was :
                async function(bot,convo,res){
                // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
                 //return myoC1(a,b,c,myscript_,color_);
                 //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 


                 // the run context of function is  directive.direc[mkey] see X on chart RT1, shouldnt put also some context like excel??(instead of get it ...)
                 // return directive.direc[mkey].onChange(bot,convo,res,myscript_,mkey);// this should be set different from directive.direc[mkey]
                 return onChThis.onChange(bot,convo,res,myscript_,mkey);}// this should be set different from directive.direc[mkey] > PERCHE ????
                    */

                   //myClosure() // or
                   // myClosure2 // or
                   //myClosure3 // or
                    myClosure4

                 );// can i bind with its obj ?

            });// end // for each ONCHANGE

                     console.log( 'FW initCmd ended onchange set on  cmd ',myscript_,' ask ',monchange);
}


function find_wheres(directive){
// insert wheres on excel dyn model (model in vars.matches) that is depending from some (static/dyn) models
// also x the model associated with a ask that in its onchange  fills also itself model (model in vars.askmatches)with aiax 
// returns after filled  direc.dependingAsk.wheres=[wheremod1,wheremod2,,,]  or   excel.dependingModel.wheres=[wheremod1,wheremod2,,,], mod is a model or a static entity 
let p=directive.excel;


    for (var key in p) {
        let amod;
        if (p.hasOwnProperty(key)) {
            amod=p[key];
            if (amod.mod_wh_Of) {//key is a  model declaration (excel=p).key=amod={model:,mod_wh_Of:adependantModel} OR amod={model:,mod_wh_Of:adependantAsk}
                let ins;

                if(directive.direc&&directive.direc[amod.mod_wh_Of]){//  ins=  direc.adependingAsk
                   ins= directive.direc[amod.mod_wh_Of];// ads the depending model to dependant  ask dyn 
                }
                else // if ( p[key.mod_wh_Of].type && p[key.mod_wh_Of].type != 'static') // ?? 
                {
                if(! p[amod.mod_wh_Of]) p[amod.mod_wh_Of]={};// insert a model declaration anyway
                   ins= p[amod.mod_wh_Of];// ads the depending model to dependant not ask dyn 
                }

            if(ins){// set in =  direc.adependant_ask.wheres or in excel.adedendant_model.wheres its  where model key :  wheres=[key,wheremod1,wheremod2,,,]
                ins.wheres = ins.wheres || [];
                ins.wheres.push(key);// ads the depending model to dependant not ask dyn 
            }
            }
        }
    }

}
function buildF(ask_th,ftext){


    // use ftext and get a function using :
    //  - eval or function returning a function to insert in a promise


   let myOnCh=null;
   return myOnCh;


}// insert db and rest services

// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
module.exports =function (cnt,db_,schema,rest_,app_){
    controller=cnt;
    fwOnC=controller.plugins.vCtl;// is vCtl
    db=db_;
    rest=rest_;
    Schema=schema;
    app=app_;   
    if(controller.plugins.cms)return init();// return service pluginable 


}