let 
dynJs=require('./models.js'),// db and http init by bot.js
//models_directives=dynJs,

// should be also controller.plugin.vCtl.appWrap
fwOnC;//require('./onChange.js'),//fw onChange to register, can also be passed when create the module !


let controller;
console.log('\n starting FW initCmd ,dynJs:  ',dynJs);



// a directive fw cb bank

let dynMatch=function(dynMod){
    // ?? directive.direc[mkey]
    // using directive info run fts using db/http directive.excel[dynMod]

    // built using some fw matcher component ( fwHelpers) 
    //      integrated by user cb to custom some part of matching process like service_
};

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





let fwCb={fWService1:null,askS:{dynMatch},thS:{}};// fw service  to be used on convo 
let fwHelpers;


// TODO    try to put also modsOnAsk in onChange :
//let{ mustacheF,modsOnAsk}=require('./mustacheFwFunc.js');//fw onChange to register

let init=function(){// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
// db=db_,http_=http;
 

/* convo will at some event in step looping, 
//  for example in condition looping :
//      according with step  directive inserted with macro or condition type , or just looking at usersay formatting 
//          ( example type=regex and usersays='$$dyn_model::' means : run matcher scalarstaticmodelregex on model speified on directive excel...), 
//  launch the registered handler esempio dynMatch

// example to launch on a condition model a matcher we can specify a fw std dyn matcher in this way :
//  in type=intent put in macro the directive containing :
//      matcher='fwCb.askS.dynMatch' // std fw function put in a event tree directory ( here read  fw service for ask of name dynMatch)
or easier : 
//      matcher='dynMatch' // std fw function put in fwCb.askS directory 
//      or custom matcher='service.mydynMatch'    o 'vars.app.service.mydynMatch'????
//              where mydynMatch is a custom matcher built and registerd like httpService like we registerd above


// >> to set fwCb.askS.dynMatch = dynJs.service['httpService'] (set as above =httpService;) we remember the chains of calls in bot.js :
// - call vctl=onchange 
// - add vctl as plugin in  botkit ctl () 
//  when ctl ready, bot.js will  
//  -call this fwbase  : fwCtl=require('./nat/fwbase.js')(controller)   
//      so we run this init()
//      here add fwHelpers=.....  as in aiv3
//      here, in fwbase to set some custom (and also some fw service built from base fwHelpers) :

//      call ctl.plugin.vCtl.setService(fwHelpers,fwCb)  // so httpService will call fwHelpers.   after got the directive models description 
//      that's simply : (fwOnC=controller.plugins.vCtl).setService(fwHelpers,fwCb)

                in fwOnC.setService(){
                         we set fwOnC.fwCb=fwCb 
                         then extend services 
                          fwOnC.fwCb.askS.dynMatch= fwOnC.service['httpService']=httpService= httpFarm(fwHelpers)
                            nb how get dynMatch in setting .dir json in macro ???
                            
                        now wen convo are instatiated it will get vCtl=_vcontroller so in code convo we can call services like :
                        this._vcontroller.service[y] or this._vcontroller.fwCb_[x]

 ........  that's it !!!!!!!!!

*/

fwOnC.setService(fwHelpers,fwCb);// will give fwfunction , they will be added to build 


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


};// end register bank (dynJs)




 // example usrAppSt={meds:[11,22,33],cur=user:'rossi'} , current user got from previous  botframework loging service call : TODO
 // should be like a frame connect a ws to a bot using login in main browser windows .......
function initCmd(myscript_,usrAppSt,monchange,mod_dir){//  (cmd,usrAppSt,[keys in bank dynJs[myscript] whose  myonchange framework onchange function must be resistered as botkit onchange ],
                                                        // model-dir if the model name  is different by cmd name myscript_)

/* ****************  as in onChange.js : mng summary on framework onchange settings in a command :
 onChange functions onChange=fwAskOnChange={modelname:{askname1:onchange1_function,,,}} will be injected on model models.modelname.direc.askname1.onChange,
      if modelname param is missing we take modelname=cmdname
 in fwbase.initCmd('cmdname',{meds:[11,22,33],cur:'rossi'},[askname1,,,],modelname) will be loaded the modelname asks functions on cmd cmdname
 will be usually injected on models.modelname.direc.askname.onChange

 usrAppSt: the param to load on application server service (starting status)
        begin_def(myscript_,usrAppSt) 
        to inform a process is requested by dialogstack started by cmd : myscript_  with param usrAppSt
monchange : list of onChange ask function on which i want vframework support 

*/


    let myth='default',directive;

    //if(!dynJs[myscript_])return;// error


    let model=mod_dir|| myscript_;// ATTENTION bad name,   MODEL IS REALLY the Command script !

    if(model){if(dynJs[model])directive=dynJs[model];else{ 
        console.log('\n starting FW initCmd ,cant find any models or directives for cmd   ',myscript_);
        return;}
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

           // getappWrap(bot,convo) sets : appWrap=={aiax:function(actionurl,req),session,begin_def:function serverservice()}
         // example usrAppSt={meds:[11,22,33],cur:'rossi'} , current user got from previous  botframework loging service call : TODO
           await fwOnC.getappWrap(bot,convo);// will recover session , check  appWrap in vars.app ....
                                            // getappWrap(bot,convo) sets : appWrap=fwOnC..appWrap ; vars={channel,user,....}
           let values=convo.step.values,
           appWrap=values.app,session=values.session;

           // user example usrAppSt={meds:[11,22,33],cur=user:'rossi'}



            // inform server endpoint a major comand is requesting 
            appWrap.begin_def(myscript_,usrAppSt);
             // get user status from db query 
             appWrap.post('register',{user:convo.vars.user,data:usrAppSt,service:myscript_});// a db query will set user data on session.user={name,property1,,,}



             console.log('+++++++++++++ ùùùùùùùùùù convo begin : init fw vars for  cmd   ',myscript_);
             // alredy set  : convo.setVar('appSt/appWrap',appSt);

             // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
             //convo.step.mustacheF=dynJs[myscript_].mustacheF;

             //convo.step.mustacheF=// review template generator in convo the delete this !!!!!!!!!!!!!!!!!!!!!!!!!!!!
             // alredy done fwOnC.mustacheF=mustacheF;

             const dc=convo.dc;

             let script=convo.script;// see conversation runBefore 

            //  convo.setVar('app',appWrap);// transfer to fw convo works but  not x function obj ?
            
             // convo.openStep.state.app=appWrap;// already done



             //// NB non status directives , excel and direc are set here because they must be got also in msg template , , shoud be set as cemmented in onChange WUI

              convo.setVar('modsonask',fwOnC.modsOnAsk(script));//  modsOnAsk used in .out miss func 
             convo.setVar('excel',directive.excel);// corrected to be as was before


             let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


            // let color_=color;
             convo.setVar('direc',directive.direc);// dir about ask as conversational tab . NOW also the static fields
             convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
             convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
            
            });// end before()

            // >>>>>  SET Directive convo event(tyed to begin after th or step/ask example dynmatchers in ask condition loop  ) service/handler
            // add a directive fw cb bank, so put here 





            // >>>>>  SET botkit convo onchange service/handler
           monchange.forEach(function(mkey){

            // set botkit convo onchange service/handler , can also get from a eval/Function from a functext then inserted on fwOnC[mkey] where service can be used !
            // dynJs[myscript_].direc[mkey].onChange_text OR a text from cms trigger in json
            //console.log( 'registering on cmd ',myscript_,' ask ',mkey, ' dynJ : ',dynJs[myscript_]);
            console.log(' FW initCmd :  convo begin : setting onchange for  cmd   ',myscript_,' onchange for ask ',mkey);
            if(!directive.direc[mkey])return;



            // WARNING  model IS cmd !!!!!!


            if(directive.direc[mkey].onChange_text)fwOnC.buildF(mkey,directive.direc[mkey].onChange_text);// build from text with eval

            if(fwOnC&&fwOnC.onChange[model]&&fwOnC.onChange[model][mkey])directive.direc[mkey].onChange=fwOnC.onChange[model][mkey];// overwrite directive.direc[mkey].onChange using fwOnC.onChange

            //let mkey='dyn_medicine';// TODO : for all direc do .....

             //let myoC1=dynJs[myscript_].direc[mkey].onChange;//.bind(dynJs[myscript]);
             controller.plugins.cms.onChange(myscript_, mkey,async function(bot,convo,res){
                // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
                 //return myoC1(a,b,c,myscript_,color_);
                 //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 


                 // the run context of function is  directive.direc[mkey] see X on chart RT1, shouldnt put also some context like excel??(instead of get it ...)
                 return directive.direc[mkey].onChange(bot,convo,res,myscript_,mkey);// this should be set different from directive.direc[mkey]
                     } );// can i bind with its obj ?
                     });

                     console.log( 'FW initCmd ended onchange set on  cmd ',myscript_,' ask ',monchange);
}




// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
module.exports =function (cnt){
    controller=cnt;
    fwOnC=controller.plugins.vCtl;// is vCtl
    if(controller.plugins.cms)init();


}