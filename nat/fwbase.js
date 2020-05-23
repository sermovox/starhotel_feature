let 
models_directives=dynJs=require('./models.js'),// db and http init by bot.js
fwOnC=require('./onChange.js'),//fw onChange to register
controller;
console.log('\n starting FW initCmd ,dynJs:  ',dynJs);
let{ mustacheF,modsOnAsk}=require('./mustacheFwFunc.js');//fw onChange to register

let init=function(){// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]

 

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

initCmd('star_hotel',{meds:[11,22,33],cur:'rossi'},['dyn_medicine']);// copied from 'televita_voice'

};// end register bank (dynJs)




 // example usrAppSt={meds:[11,22,33],cur=user:'rossi'} , current user got from previous  botframework loging service call : TODO
 // should be like a frame connect a ws to a bot using login in main browser windows .......
function initCmd(myscript_,usrAppSt,monchange,mod_dir){//  (cmd,usrAppSt,[keys in bank dynJs[myscript] whose  myonchange framework onchange function must be resistered as botkit onchange ],
                                                        // model-dir if the model name  is different by cmd name myscript_)
    let myth='default',directive;

    //if(!dynJs[myscript_])return;// error


    let model=mod_dir|| myscript_;

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
     

            let appSt=state.appstatus;// make available in current convo the appState

            */

           // getappWrap(bot,convo) sets : appWrap=values.app={aiax:function(actionurl,req),session,begin_def:function serverservice()}
         // example usrAppSt={meds:[11,22,33],cur:'rossi'} , current user got from previous  botframework loging service call : TODO
           await fwOnC.getappWrap(bot,convo);// getappWrap(bot,convo) sets : appWrap=values.app ; vars={channel,user,....}
           let values=convo.step.values,
           appWrap=values.app,session=values.session;

           // user example usrAppSt={meds:[11,22,33],cur=user:'rossi'}



            // inform server endpoint a major comand is requesting 
            appWrap.begin_def(myscript_,usrAppSt);
             // get user status from db query 
             appWrap.aiax('register',{user:usrAppSt.user,data:usrAppSt,service:myscript_});// a db query will set user data on session.user={name,property1,,,}



             console.log('+++++++++++++ ùùùùùùùùùù convo begin : init fw vars for  cmd   ',myscript_);
             // alredy set  : convo.setVar('appSt/appWrap',appSt);

             // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
             //convo.step.mustacheF=dynJs[myscript_].mustacheF;
             convo.step.mustacheF=mustacheF;

             const dc=convo.dc;

             let script=convo.script;// see conversation runBefore 

            //  convo.setVar('app',appWrap);// transfer to fw convo works but  not x function obj ?
            
             // convo.openStep.state.app=appWrap;// already done


              convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
             convo.setVar('excel',directive.excel);// corrected to be as was before


             let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


            // let color_=color;
             convo.setVar('direc',directive.direc);// dir about ask as conversational tab . NOW also the static fields
             convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
             convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
            
            });// end before()

           monchange.forEach(function(mkey){

            // set onchange , can also get from a eval/Function from a functext then inserted on fwOnC[mkey] where service can be used !
            // dynJs[myscript_].direc[mkey].onChange_text OR a text from cms trigger in json
            //console.log( 'registering on cmd ',myscript_,' ask ',mkey, ' dynJ : ',dynJs[myscript_]);
            console.log(' FW initCmd :  convo begin : setting onchange for  cmd   ',myscript_,' onchange for ask ',mkey);
            if(!directive.direc[mkey])return;

            if(directive.direc[mkey].onChange_text)fwOnC.buildF(mkey,directive.direc[mkey].onChange_text);// build from text with eval

            if(fwOnC&&fwOnC.onChange[model]&&fwOnC.onChange[model][mkey])directive.direc[mkey].onChange=fwOnC.onChange[model][mkey];// overwrite directive.direc[mkey].onChange using fwOnC.onChange

            //let mkey='dyn_medicine';// TODO : for all direc do .....

             //let myoC1=dynJs[myscript_].direc[mkey].onChange;//.bind(dynJs[myscript]);
             controller.plugins.cms.onChange(myscript_, mkey,async function(bot,convo,res){
                // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
                 //return myoC1(a,b,c,myscript_,color_);
                 //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
                 return directive.direc[mkey].onChange(bot,convo,res,myscript_,mkey);// this should be set 
                     } );// can i bind with its obj ?
                     });

                     console.log( 'FW initCmd ended onchange set on  cmd ',myscript_,' ask ',monchange);
}




// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
module.exports =function (cnt){
    controller=cnt;
    if(controller.plugins.cms)init();

}