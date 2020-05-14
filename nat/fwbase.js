let 
models_directives=dynJs=require('./models.js'),// db and http init by bot.js
fwOnC=require('./onChange.js'),//fw onChange to register
controller;
let{ mustacheF,modsOnAsk}=require('./mustacheFwFunc.js');//fw onChange to register

let init=function(){// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]

 

initCmd("televita",{meds:[11,22,33],cur:'rossi'},['dyn_medicine']);// (cmd,usrAppSt,[keys in bank dynJs[myscript] to register])
initCmd('televita_voice',{meds:[11,22,33],cur:'rossi'},['dyn_medicine']);


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

};// end register bank (dynJs)




 
function initCmd(myscript_,usrAppSt,monchange){//  (cmd,usrAppSt,[keys in bank dynJs[myscript] whose  myonchange framework onchange function must be resistered as botkit onchange ])
    let myth='default';

 





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



            //let  myscript_='televita';// launch a closure with a internal var the script well be registering :
            controller.plugins.cms.before(myscript_,myth, async(convo, bot) => {// default thread will be enougth


            // RECOVER STATUS - INIT - COPY to convo.state

            let dialogState=bot._controller.dialogSet.dialogState;// =

            // or directly
            // somewere before :
            let state = await dialogState.get(convo.dc.context, { dialogStack: [] });

            // init 
            state.appstatus={appSt:'start-'+myscript_,// status a livello app .
            
                             dyn_match:{}};// ??  per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']
     

            let appSt=state.appstatus;// make available in current convo the appState

             // get user status from db query 

             appSt.user=usrAppSt;
             convo.setVar('appSt',appSt);

             // GENERAL FUNCTION TO INJECT in ALL convo >>> better set in ?????
             //convo.step.mustacheF=dynJs[myscript_].mustacheF;
             convo.step.mustacheF=mustacheF;

             const dc=convo.dc;

             let script=convo.script;// see conversation runBefore 


              convo.setVar('modsonask',modsOnAsk(script));//  modsOnAsk used in .out miss func 
             convo.setVar('excel',dynJs[myscript_].excel);// corrected to be as was before


             let loopDir={};// dialog directive. or if done later ,  insert in already present convo.values.loopDir


            // let color_=color;
             convo.setVar('direc',dynJs[myscript_].direc);// dir about ask as conversational tab . NOW also the static fields
             convo.setVar('matches',{});// case $$ and $% : model and key matches ex :values.matches.color='red', see conversation.addMatcRes()
             convo.setVar('askmatches',{});// other : key matches ex :values.askmatches.akey={match=[{key:0},,,]}, see conversation.addMatcRes()
            
            });// end before()

           monchange.forEach(function(mkey){

            // set onchange , can also get from a eval/Function from a functext then inserted on fwOnC[mkey] where service can be used !
            // dynJs[myscript_].direc[mkey].onChange_text OR a text from cms trigger in json
            console.log( 'registering on cmd ',myscript_,' ask ',mkey, ' dynJ : ',dynJs[myscript_]);

            if(dynJs[myscript_].direc[mkey].onChange_text)fwOnC.buildF(mkey,dynJs[myscript_].direc[mkey].onChange_text);

            if(fwOnC&&fwOnC.onChange[mkey])dynJs[myscript_].direc[mkey].onChange=fwOnC.onChange[mkey];// overwrite

            //let mkey='dyn_medicine';// TODO : for all direc do .....

             //let myoC1=dynJs[myscript_].direc[mkey].onChange;//.bind(dynJs[myscript]);
             controller.plugins.cms.onChange(myscript_, mkey,async function(a,b,c){
                // let color_=color,myscript_=myscript_;// CORRECT put myscript_ in a closure !
                 //return myoC1(a,b,c,myscript_,color_);
                 //return dynJs[myscript][color].onChange(a,b,c,myscript_,color_);// this should be set 
                 return dynJs[myscript_].direc[mkey].onChange(a,b,c,myscript_,mkey);// this should be set 
                     } );// can i bind with its obj ?
                     });
}




// register bank (dynJs) function onChange x script/dynfield-key bound to dynJs[myscript]
module.exports =function (cnt){
    controller=cnt;
    if(controller.plugins.cms)init();

}