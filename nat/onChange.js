// the vCtl/vcontroller   !!!
var db,rest;// services

let{ mustacheF,modsOnAsk}=require('./mustacheFwFunc.js');//fw functions
let application,service,fwCb;


const fs = require('fs');
let wlog ;//= require('./helpers/logs').logger;// todo   seems useless receive env in exported function so get env and build wlog immediately .so vFw will be build immediately and not need to be reset at .init !!

let 
dynJs=require('./models.js');// db and http init by bot.js
// ?? d;

// luigi 032020 + 032021
let cfg,logs='app.log';
/* vFw={
        logger, // function(message,ch,send) into file public/booking.html , used in ...... 
        logs,// function(text)  logs into file logs
        winston,//  = require('./helpers/logs').logger
        a_logger:function(message,ch,send),// log into file bot.log  , used in web adapter channel to log in and out !!!
}
*/
const vFw={// voice fw helper func . available from this plugins (vCtl) as controller.plugins.vCtl.vFw
logger:function(message,ch,send){//logger({user,text},ch,'')
    if(!message.text)return;
    let x,mylog;
        if(send){x=' send ';}else x=' receive from '+message.user;
    mylog='\n'+new Date().toUTCString()+'app server,ch: '+ch+x+', log :\n      >>  '+message.text;
    mylog+=' ..';
    let fn=logs;
    if(ch=='book'){fn='public/booking.html';mylog='<br><h2> a new reservation was confirmed on : '+new Date().toUTCString()+' at: '+message.text+'</h2><h4> user : '+message.user+'</h4>  waiting for a new schedule ...<br>__________________________________<br>'}
    fs.appendFile(fn, mylog, function (err) {
        if (err) return console.log(err);
      //console.log('Appended!');
     });

}

,logs:function(text){
    if(!text)return;
    let x='\n\n'+new Date().toUTCString()+'\n'+text,
    fn=logs;
    fs.appendFile(fn, x, function (err) {
        if (err) return console.log(err);
      //console.log('Appended!');
     });

}
,winston:wlog// warning see wlog def. will be updated on .init()   !!!!!!!!!!!1


,a_logger:function(message,ch,send){// should got from webadapter  as vcontroller plugins vCtl.vFw.a_logger . or as a factory ?
    if(!message.text)return;
    let x,mylog;
        if(send){x=' send ';}else x=' receive from '+message.user;
    mylog='\n'+new Date().toUTCString()+'web adapter channel '+ch+x+', text : '+message.text.replace(/(\r\n|\n|\r|\s+)/gm," ").substring(0,100);;
    mylog+=' ..';
    fs.appendFile('bot.log', mylog, function (err) {
        if (err) return console.log(err);
      //console.log('Appended!');
     });

}
};
const logger=vFw.logger;// convenience rename



//function setService(fwHelpers,fwCb_){}// ported on service.js

// here or in service.js :
function regService(path,func){//'fwCb.askS.dynMatch',func){
// service[path]=func;
}
service={};

function injService(service_,fwCb_){// adds services on locale scope ( x onchange)

    /* mng summary 072020


    service=service.setService(fwHelpers,fwCb_){// injection system : build services in 





      from fwHelpers ( from a factory that extends onchange ctl ( the voice ctl), db,http, and base helper functions) 
          and the knowledge of models (dynJs) in scope of this (onchange.js) closure,
          we build BASE services obj that can access to fw data (cv...... and dyn models/directives in dynJs/models.js):
                     models and matching algos) 
                      to do convo functions  ( onstep directives and add db methods fts staff , db map  ... 

         the first service build here as helper for  convo onchange ( so put in fwCb) directive function is got using fwHelpers base function (db interfce and rest interface) 
		and is  the def dyn matcher ('restServ') that can be a template to do other customizations 

        

         
        service : a bank of functions available in conversation and in user onchange and in $$$$ condition eval 
        fwCb : in fwCB we set the function that can be used if the attribute is set ( by excel....  or in condition macro and .... ) as directive in state.dir 
         for example   
    
      
    we extend services fwCb
     fwCb.askS.dynMatch= fwOnC.service['httpService']=httpService= httpFarm(fwHelpers)
       nb how get dynMatch  in setting .dir json in macro ???
       
    now 
    1: when convo are instatiated it will get this obj :
              vCtl=_vcontroller so in code convo we can call services like :
        this._vcontroller.service[y] 
    
        or
    
    2:  in un ask use directive function x  : this._vcontroller.fwCb[askname][x]
    
    mentre in template we can use && .... vars.service(...)  .....  && 
    
    
    
    */


// we set simply : service < return new sFact(){// using closure scope vars :  Object.assign(this,fwHelpers);

  // in service.js we just extends fwHelpers  so service starts as a fwHelper extension 
  // as services will be added to cv  (cv=onchangejs).service can be called:
  // - from ask.onchange 
  //    see fwbase.initCmd  where we can see that onchange user func will be called in its obj :
  //          directive.direc[mkey].onChange(bot,convo,res,myscript_,mkey);
  //    > so from there we can get onchange functions using vars.app.service (see  wrapgen(session,convovars))

  // - from msg handlebars functions
  //    ................. 
  
  // - from conversations ( matcher )
  //      this._vcontroller.fwCb this._vcontroller.service



// TO DO : some services that call fwHelpers.rest adding some var from fw vars 
//   ......


    

// service is the service bank , would be better extend its context with 

Object.assign(service_,service);// adds local service to passed service obj 
  //   Object.assign(service,service_);// use service.rest(url,qs) to do rest from onchange
    fwCb=fwCb_;// just the structure to fill , with no func ?

this.fwCb=fwCb;this.service=service_; // adds to this Vcontroller fwCb and service

    let // ?
    def_rest_=service.rest;// to customize this as done x service.onChange_dynField, see fwhelpers refImplementation.rest: ....... 

    // first template customization : the def dyn matcher : it uses base function (fwhelpers=service).onChange_dynField
    // to set a user function adding directive information on model.js
    fwCb.askS.dynMatch____=async function(tomatch,entity,excel,varmatches){// OLD , no more used nowused by condition dyn matcher or from onchange 
        /*
        varmatches , the convo + user status of all matches in convo. 
                in getmatched we  use mainly the vars.matches x the entity 
                        ( see the dyn entity matches constructor MatchSt())
                         and its where or related dependenings, 
                        to extract the onChange_dynField generic query params
        tomatch, the user  text
        entity, the master dyn 
        excel=dir_excelformat the directive model definitions in excel format , see model.js (the reference can be available here too as dynJs !) 
        returns the matcher status and the match result if finish the multi turn search (normal matcher , single turn returns matched not matched !)
        */
       // finds if there is where , models declared in excel as mod_wh_Of of some master dyn field 
       // should be dir_excelformat=
       let wheres;
       if(excel&&excel[entity])//&&excel[entity].wheres)
       wheres=excel[entity].wheres;// wheres is filled on fwbase.find_wheres(directive):

      // cb( this.onChange_dynField(req, isDb_Aiax, schema_url, null, null, wheres, true,null, afterallDyncalc));
       let myr={rows,res};
       let isDb_Aiax=true;
       let wheresval;
       if(varmatches)wheresval=getmatched(wheres,varmatches);// to do 
       let previousmatch,idspace;// optionals
       if(varmatches[entity]&&varmatches[entity].qeAdata){previousmatch=varmatches[entity].qeAdata.lastWhere;

       }

       // so no cb need to influence the Rest db interface job ?!?!
        // entSchema : the schema name describig the map of entity and its relation into db engine, like EF in .net
        // schema is set in rest server or in the local rest service (if isDb_Aiax) interfacing db server via driver 
        let entSchema={name:entity,n_m:0};// set db schemaname as the entity name !
        // WILL TRY TO MATCH TEXT AND WHERE CONDITION ON A DB SCHEMA ( using where field and text matching on .patt column)
       myr=await service.onChange_dynField(entSchema,text,wheres,wheresval,idspace,isDb_Aiax,previousmatch);// in previousmatch the rest db interface can see if can use previous db result to refine the query faster

            if(myr&&myr.reason=='err'){return new MatchSt()}// todo 
            else{
                // to do interscation here or in db rest interface ?then 
            
                if(previousmatch)return previousmatch;
                else return new MatchSt();

            }


        }// ends  function dynMatch

    }

function MatchSt(){// std matcher status constructor 
    // most used :
    this.match='',//thematcheditemname/value;// if length=1 match ! , list of value col in query 
    this.id=0,// the key id 

    this.vmatch=null;// the entity as known by voice

    this.type='dynMatch',//'the algo type expected to work  on this status',      
    this.cursor=[];// a string matrix

    this.nMPrompt;//			will be used to insert a .prompt[0], the bot suggested response in order to be set as context x next template by  
    // both ?
    this.prompt=[];		// dyn only, used instead of entities , a dyn is like a multi value static single entity
     // but match still used to have the list of query pattern items
             
             
             
     this.complete='wait/getting/got';			// the master matching status
   
   

   this.qeAdata=null;// optional session status used by multiturn  qeA matching algo , in base to the status of matching algo 
               // {
               //  idspace:null,// [45,77,89]
               //  wheres=['city','size'], same index as lastwwhere
               //  lastWhere,// [['rome',id=12],null]// the order match with the where field in rest query qs={where:['city','state']], id only if db see that the where is a relation matching with id=ext key
               //						id to make easyer to run a new query with old where match 
               //,}
   
   }

let vfwF = {// framework functions module used in convo obj 
    // instead of write custom convo code in converstion.js try to custom sw here so the convo obj will be easyer to read. 
    // we can think to add some context var to be used instead to pass such vars  every call we do

    addMatcRes: function (mat,// true : matched
        entity,             // entity name if static model pointed by the condition $xxxx, ... 
                            // nb : if ='value' regex group , the ask containing $$xxx:> , param is not null 
        storemat, // a string for simple static model match , a obj if we matched a entity , intent , or a query result 
                // if obj its def is according storemat.type == 'Ent/Int,,,'
        // storemat='thematcheditem' or 'value'
        // storemat={type:'Ent'/'Int'/'Cur',.....} can be obj in case of nt std matcher

        
        storeMId // Avoid , use storemat 
        // if the model is static   or is no model , we use a regex matcher , so is a string : the value/name matched ,  
        //                          storeMId is the index p,  in static  model definition 
        // if the model is dyn,,, , we use a directive matcher   , so (isStatic=false) is a obj the matcher returns:
        //          dyn matcher returns : see dynMatch in fwhelpers.js

        , routing// routing=linematch is true if not $% case ( not routing case ) so this condition will stop the cond loop
        , rematch// the regex matched extraction (....) , in revision 102020 seems to be changed with storeVal
        , reset// reset matches ???? never called !!!!!!!!!!!!!!!
        , param,// not nul if this is a resolver selection ask, entity is a askname or modelname , param can be param/query or entity or intent ! // nb not null only if entity matches (mat=true) ?
        storeVal// old a integer or string to get from user  .02102020 : changed , manage case storemat='value' , see below news 
        , step, previous
        //  see AQJU ,  probably the var isStatic just is indeed true if the type result is text . 
        //              if we need a var that knows if the matcher used is std regex static model or a custom matcher use isStatic_
        // needed ? now we see if we have simple entity looking at value field ! , isStatic_ // will decide to put std static match or use 
        , pattArray // access to mapping entity info from cond model fields name .= step.values.excel[entity].model pattArray={itema-regexa&itemb-regexb&.......} 

    ) {
        // 24102020 : rivedere i campi di matching nel .param cosi come suggerito in master_df_builder... in : logic di addMatcRes()
        //              quindi oltre che rivedere i campi di match dovuto a 
        //                  - match da std matcher
        //                  - match da entity matcher
        //                  - match da un selection con il &&XXX:>  . 2 cases :1 selection on query (.param....), 2 selection on intent (.intent....)
        //                      TODO/aggiungere anche  
        //                  - matching da result avuto da rest a agent che torm un json che mi trovo in storemat ( o storeVal?) 


        // chiamo n intent resolver
        // fare merging con quei commenti e fare un mng summery !

    // remember the matcher Summary in convo :
    // nb following vars are used to put ent/int partial def status ref : ask=askmatches[previous.collect.key],mv=matches[entity] , param

                                            /* 22102020 mng SUMMARY main logic, see also matches_askmatches_logic&api.txt :
                                        - matchtyp will check that matcher can be processed by the current condition , as matchtyp api requires
                                        - convo std/notstd matcher usually is , a service (a match helper like intMatch,dynQuery or dynMatch) that convert the format of a external run rest service (run_jrest())
                                                nb run_jrest() give int/ent match (or a partial info ( ex cursor describing the master query/model to select)to resolve in  next turn in a relayed thread or  with the help of a child working on the entity var )
                                             to a format defined by the matcher type

                                            , so matcher according its type ( query,entity, intent) will add/ update some fields (.text,..) and pass matched,storemat/storeVal to addMatcRes(matched,storemat/storeVal ) that according to type will:
                                                    - ASWF (var mv in code) : set condition match mv=.matchers.modelassociatedwithcondition (as booleanevententity associated with condition   or embedding the static model if is std matcher (unsess $$$$) the modelitself ASSK )
                                                    - ASWE ( var key in code) : set the ask matches about its condition matching result  ask(=askmatches).match/...
                                                    + ASWG (var EntMod in code )if no std matcher : set the associated Target entity in a proper var EntMod for following turn process , can be mv.x  ask.x or param.x 
                                                            - usually is easy to set embedding into the askmatches.askofcondition.param/intent that describe the ask or add a new var like matches.askofcondition
                                                                if .dir.cond[entity].vars, i can put ito ask/mod  askmatches[.dir.cond[entity].vars]/matches !!!!
                                                            - or in case $$xxx:> of std matcher we add it into the provided var where the entity status is described
                                            - in matcher $$$$ case ( std matcher , case $$$$'jscode/Eventcode') a js code that returns true/false to manage condition match result mv( condition test a boolean entity tre/false , a Event) but
                                                the Event code  will start process a targhet entity/intent set by jscode  that set the Target entity var (can  be usually mv,ask ) so  this code dont need to set the Target entity status var 
                                                    the Target entity will be processed by following turns till succedeed or rejected


                                        - The entity/intent  content, can be  
                                            - its name/key  +  short descr or voice name ( a scalar entity ofen stored in plain attributes of a obj )
                                              or 
                                            - its property/relation  ( bl fields ) + its definition model to match ( cursor) ( a obj entity ofen stored in
                                                    - a map ent/int={ent1:item1,,, )
                                                    - a querymap ent/int=[{name,val},,,]
                                         - The entity/intent  can
                                            - ASSK case : be resolved and merged with the condition itself so the condition can set the entity result in .matches and  can root to next action if matched ,
                                                or
                                            - is/can (by a intent resolver child) be a Target int/ent processed partially and set its status in a proper var , 
                                                    often embedded in askmatches in a property like params or intent because so can be added in 
                                                the ask is dedicated to manage the entity so we attach the entity to it
                                                following the next turn will process the Target entity till be resolved/rejected   
                                                for example a intent can be processed progressively in a intent resolver child or in one shot by a agent so anyway we choose a std way to set its var in a separate entity var and not in a 
                                                        entity tied on a condition ! 
                                        - when a matcher returns the result, according its api, is processed by addMatcRes(mat,storemat/storeVal='matched obj/objname',param=askmatches.obj) that 
                                                set the status of the entity pointed by the testing ask condition
                                                * 
                                                * to fill the condition models: matchers ...  and its targhet askmatches .... according with its type
                                                    ex: $$dyn_medicine:>  is a fw special matcher Targeting Target to dyn_medicine
                                                        $$$$ someaskmatchers=service.process a match typeapi
                                        */


        /* 102020
            nb storemat is the matching entity , 
                - A represent a obj if the matcher is intent so represented by a map with its entities

                        >>>>    askmatchers.askx.match  : the match of the condition as is , so if matchs the condition it will route 
                                                ....    
                                                .intent.name   : the match as item selected with its bl fields , so this is a object match and is represented like A
                                                        ..........
                                                        .entities:{

                                                                    stile a :
                                                                    luogo:mantova // just item name
                                                                    stile b : // with properties
                                                                    luogo:{name luogo
                                                                            match/value:,
                                                                            descr,,,
                                                                        }
                                                        }
        

                - B represent a entity entity     but if the matcher referars to a entity : is a static:
                    - BA if menu model in excel : no query cursor to mamntain to select item so can a menu model in excel and all related entity ( bl entity) is supposed to be 
                                defined in other query 
                        > the match is  (like std mini view fields   value,descr,)    match vmatch and info  and it it put in matchers as do not need other process to do :

                        >>> matchers.modelx.match=itemname       >> the match is applied to condition !!!
                                            .vmatch=itemshortdescr
                                            ....

                            nb patterns are in excel model description
 
                    - BB if is a dyn entity (so  mantain a master selection ) needs also of patt field to select the cursor 
                       and can have also bl related fields (with related entity Name (key)) in the cursor so that we dont need a query to extract the related entities
                    - if is a db query with 1 select  with bl fields 

                        > the match need other processing so its better to fill the askmatches data to be managed by next steps :

                        >>>>    askmatchers.askx.match  : the match of the condition as is , so if matchs the condition it will route 
                                                .........
                                                .params.select   : the match as item selected with its bl fields , so this is a object match and is represented like A
                                                        .cursor :  the query to be selected using match info in .patt
        
            no returns but 
                the matchs refears to the match of condition , so x example if a condition call a rest to fill its ask and do not route so it do not match



                     3 casi :
                - entity nomatch   
                                        set .match=null
                - from   std matcher 
                        isStatic_ = true 

                        entity item singola risolta   descritti in excel o inline with a single item = storemat='value'
                                        storeval=nome singolo item ('value'), 
                                        .match={match:storeval,vmatch:storeval,mid:0}, storeVal risolto come regex group match 
                                        
                                        ??????????
                                        .data=storeVal 

                        entity con piu item descritti in excel o inline 
                                        storeval = null 
                                         .match={match:storemat,vmatch:storemat,mid:index}
                                         ma in excel[entity]['someblpropname'][mid] posso trovare  proprieta addizionali 



                se obj :   matches[entity] =storemat =  the row got from db , usually std format {value,patt,shortdescr,,,,}
                                                    + 
                                                    storemat.match=storemat.vmatch=storemat.value;
                                                    +
                                                    storemat.type dove potro trovare type per differenziare casi particolari
                - isStatic_ e true se ho std matcher



                in case of askmatches param master model  , in addition to fill the model that is assigned to the ask containing the $$xxx:>  condition , fills the model match inside dynask  params 
        - set .param 

        - set the match in ask condition container that contains the condition matched (or if no condition ........)

        */
        
        // register model/entity match, last turn match asked with $$ or $% result 

        // revision 102020   storeval da tenere , rematch sembra inutile 

        /* 02102020 semplificazione da fare : new rules  x settaggio di matches[entity].match:
         storeval e isStatic_ probabilmente da buttare ??? no , us solo storeval 
         nuovo concetto base : 
         - storemat e' il valore matchato da settare come match della entity , se nn e' entity .....
          puo essere atomico o obj std format {value, patt,descr,data + bl}
          puo avere .type e cosi gestisco casi particolari ( intent,query cursor)
         principalmente settero matches[entity] cosi :
            se string : matches[entity] ={match:storemat,  
                                        vmatch:( from excel entity item storemat)
                                        }
                            in vars.excel[entity] si potranno trovare altre proprietà  della entity (obj) storati in excel !!

                            se storeval= not null , tipicamente 'value'  vuol dire che e' un regex match  che becca la entity atomica come semplice string :
                                        cioe l'item in static model viene risolto come valore atomico 
                                            quindi l'item ha senso sia uno , e gli altre proprieta della entity ( essondo un solo item) sono senza significato
                                            se il valore non e' atomico allora vuol dire che e' un entity di cui si conosce solo il nome e andra querato  a parte per trovare le proprietà 
                                        >    fare come si faceva con storemat='value' ma si mette il valore atomico risolto in storemat e in ogni caso per sapere che e' entity con singolo
                                                item risolto si mette in storeval il nome item singolo ( di solito value perche  o il nome della entita risolta e' entita !! )

                                        see matcher format mv above 
    */

        /* if condition with entity ( $$ or $% case )  we register  a model match ( entity instance  = itemname) :
              adding  {key:entity} to  values.askmatches.askname.match array (  values.askmatches.askname={match:[{},,,,],nomatch:[]} )
              + setting                         values.matches.entity={match:itemvalue}
                         if exist def in excel : values.matches.entity={match:itemvalue,vmatch:vars.excel.entity.vmatch,data:rematch[1]=matches.entity} 
        
        
        
              or not matched :
              adding {key:entity} to  values.askmatches.askname.nomatch array (  values.askmatches.askname={match:[{},,,,],nomatch:[]} )
        
         if a condition with no model matches we register a match {ind:4} (and not {key:value})
            adding {ind:4} to  values.askmatches.askname.match array (  values.askmatches.askname={match:[{},,,,],nomatch:[]} )
            if do not match ,do nothing  
        
        */

        // mat      : true if entity is matched, false 
        // entity   : model name ($$ case) otherwise null condition  index 
        // storemat, storeMId is 
        //              if condition is $$ $% ( model match) : the name/value matched () entity not null),
        //              storeMId is the id of matching condition 

        /*  *******    master/desire entity simple relation with ask conditional described as $$ 
        
                  the entity/model should be  is defined somewhere (in excel ...)
                  in this very simple implementation the view is not bind to the model ( id/name/voicepattern/shortdescriptio)
                  but just set by $$ condition munually copyng the name/pattern field
                  in future (DONE !)  we should do $$mod:areference on the model description file set somewhere in 
                      the model/field dialog description bind to a static (file) descriptio or to a dyn db schema
                  here the where model are just the space of a relational where entity put directly in a col of master entity ( desire entity)
                      whith its id or name ( both are key)
                  so to make sintetic : $$....reflect the name-voicepattern of a implicit model whose id/name is put in a where field of the related master desire entity
            ******
        */

        // storemat : matched model item name/value ($$ case), otherwise condition  index
        // old : so matches can be available in out as step=this ,this.values.askmatches[thisaskmatchesname].match/nomatch='entity1|entity2'

        /*
                                askmatches=convo.vars.askmatches,/* askmatches={aask:{
        
                                        match:'aval',
                                        matches:[{key:'aval'},{key/ind:oneindex?},,],// models matches  , one routing (std, $$,$$$, no $%) index 
                                        nomatches:[{key:'aval'},,,],// only models
                                        ... some onchange added fields , ex : matched complete desire param ...
                                    }}
                            modmatches=convo.vars.matches.amodel={match:itemvalue-key,vmatch:voicenameofitem,data:xqea}
        
        */
        let vars=step.values,askmatches = vars.askmatches;
        console.log(' ** addMatcRes called to set matching result on ask ',previous.collect.key,'  ,matches: ', mat, ',entity: ', entity, ',model item (name(static) or obj) storemat: ', storemat, ', routing: ', routing,', selecting a desire ent:',param!=null);
        if (reset) {
            if (entity) step.values.matches[entity] = null;
            askmatches[previous.collect.key] = null;
            return;
        }

        /* no more. set just entity as the selector model
        if (param && param.cursor) { 
             // $$desireEntitytoselect:> case , the matcher pass the entity model to set the selection done :
                                                //      intent : matcher matched storeMId that is index of the intents[storeMId] selected
                                                //      param/query model : matcher matched storeMId that is index of the rows[storeMId] selected
                                                // param can be param/query or intent . set ent status var for $$xxx:> case on param var embedded on a ask that got the master dyn query cursor
                    
                    // 112020
                    // entity is  the model generated to do the selection .
                    //  its name is nameof Desire2select +  '_sel' to avoid overlapping 
                    //  its match value will copy the name of selected desidere item ! ( not the item name of run time selector model )
                    entity=entity+'_sel';
        }*/
        let mf, amatch, amatchId;
        if (mat) mf = 'matches'; else mf = 'nomatches';

        // the info about the Entity condition tested 
        if (entity) amatch = { key: entity };// the model/entity name matched/not matched , used to register on ask the matching entity conditions 
         // >>>   OR SIMPLY register the entity name 
        amatchId = { id: storeMId };// normal condition match with no model 

        // do in main p loop if(storeMId==0)step.values.askmatches[previous.collect.key];// reset if start conditions loopif(reset){
        // nb step.values.askmatches[previous.collect.key] can be alredy filled with short bl status (like qs in reload after a web form)
        let ask= askmatches[previous.collect.key] =// convenient ref x ask containing the condition ASWE
         askmatches[previous.collect.key] || {
            matches: [],// [mod_ent1,mod_ent5,,] also condition with $%
            match: null,// {key:'mod_ent5}condition not $% (so routing)
            mId: null,// {id:5} // present also in no proper entity
            nomatches: []
        };//  [mod_ent2,mod_ent3,,]adds only $% or $$  case

        // UPDATE ASK condition Matching results :
        ask.matches = ask.matches || [];
        ask.nomatches = ask.nomatches || [];

        // if(ask[mf])
        if (entity) ask[mf].push(amatch);

        //             FIXED   ERROR  
        // when a past alreday ask matched we need to unmatch when testing again tll get a new match
        //  >>> so to make easy unmatch at any unmatched condition. the ask match only at last routing condition 
        //   DEFALUT THREAD EXCLUDED !!!!! 
        ask.match = null;

        if (routing) {
            ask.match = amatch;// stop condition routing
            ask.mId = amatchId;
        }// 

        //                ERROR  
        // when a past alreday ask matched we need to unmatch when testing again tll get a new match
        //  >>> so to make easy unmatch at any unmatched condition. the ask match only at last routing condition 
        //   DEFALUT THREAD EXCLUDED !!!!! 


        // else ask[mf] = {key:entity};// first value
        //ask.match += entity;// += '|'+entity in case of multimatch. register too the step was  matched in favor of entity 



        // model settings in this normal ask (no queryask/desidereask )
        // model can be 
        // - defined in condition patt line ( $$entity:.....) or 
        // - in excel  ( $$entity::) or 
        //  - defined on run  ( $$desidereAsk:;) in a CONDITION that  resolve a selection of a desire onchangequery ask, the name is entity='mod_'+previous.collect.key
        //      in this care storemat is the selected/matched item name/value
        // register only model matches ( not register model notmatching in nomatches field, if dont match match=null !): 
        if (entity) {// in this condition we  manage matching (vars.matches/askmatches) on model and value entity/value ($$,,)

            //  AQJU :
            //  isStatic=typeof step.result === 'string' ????????? ,
            //      explaination 1: if we have a string result we surely run std regex model so storeMId is defined , so we setstep.values.matches[entity]={match:'entname',id=p:3}
            //      explaination 2: thinks to dyn_medicine ask : in this case we run a ask dyn, so we load rest models using rest in onchange , in this case we dont use string as result because ........
            //  probably non correct , perhaps is better to add that as  a param !!!





            /// ???????????
            let isStatic = typeof step.result === 'string';//  old , otherwise is  a no static model (dynmodel)returned by a matcher function a dynmodel


                                                            // now false means non std matcher
            //if (!(typeof isStatic_ == 'undefined')) 
            // isStatic = isStatic_;// now false means non std matcher

  

            // ??????????????????
            // 01102020 : probably means that we do not have any model defined in excel . the 'entity is resolved by a regex matching group or some ai entity resolver 
            //              in this case the matcher set storematch='value' ( means the item name is resoled by ai , i donnt have models staic in excel ) and the entity value ( item name) is  storeVal
            //              so if the model is static in xcel storemat is the item name and the item content (value/name , descr, vname ... ) is got from excel model 
            //                  if the entity is got from external ai / regex group  then storemat='value' and the object properties are in storeval :
            //                      storeval : 'voiceitemname' ( vname)   if atomic  ex a date  user entered name of  person , a date ....
            //                                  a obj in std format if from db/entityfts  ={value(the vname in static model),descr,patt,data+blfields } 
            let isVal = isStatic && storeVal && storemat ;// a static model whose values are the regex group match ( user gives a integer, a name of something), not the item name declared in excel

            let mv=step.values.matches[entity]=step.values.matches[entity]||{};// ye / no ??? desidere can be = entity and matches ??? probably yes , ASWF 
            mv.match=mv.matched=mv.vmatch=null;// reset also if mv=desidere
           // mv = step.values.matches[entity] = step.values.matches[entity] || {};
            if (mat) {// matches


                let rT;
                if (typeof storemat === 'string'
                 // || step.result instanceof String
                 ) rT = 0;// std matcher , no ASWG
                 // id object :
                else // no std matcher , entity will be stored on var ASWG , can depend from type (?)
                {if (storemat.type == 'Ent') rT = 1;
                else if (storemat.type == 'Int') rT = 2;
                else if (storemat.type == 'Query') rT = 3;// Cur or param or query 
                console.log('  addMatcRes is set a matching of complex entity: ',entity,', of type: ', storemat.type,' , filling case rT=',rT);
                }
               // console.log(' result should be a string :', isStatic && rT == 1);

               // >>>>>  FIND the status (matches or askmatches ) to attach the match in format wanted by matcher type 

              function setSt_(entity){// decide where to attach the dyn match (complex model of type int,ent,query) status, usually on a asmatches or a matches , 
                let setSt,setStN,cst=step.state.dir.cond[entity];// cond directives
                if(cst&&cst.vars){setStN=cst.vars;// get from directive set in macro if there are a vars entry (the vars_directive)  , if so take that as asmatches
                    if(vars.askmod[setStN])setSt=vars.matches[setStN]=vars.matches[setStN]||{};// ( vars.askmod[setSt] say if there is a model of name setSt) setSt is a mod , so it must have matches entry 
                    else {setSt=askmatches[setStN]=askmatches[setStN]||{};}// attach the complex model to the askmaches[vars_directive]
                }
                return setSt;
              }

               // >>>>>  FILLS/UPDATES  the status (matches or askmatches ) field to summary the match in std way ( set .match  and .vmatch, .matched already set before )  

                if (isVal&&rT==0) {// the entity is a value got with external , here unkown, matching model( item is the regex match value)
                    // , no ASWG support
                    mv.match = mv.vmatch=storeVal;// storemat;// 'value'
                    mv.matched='match';
                    mv.mid=0;// register under values.matches.entity=itemvalue
                    //mv.mid = 0;// dont use this, usable to see if is match is good (mid>0) 
                    // use storeval x  ??
                } else {// a finit dimension entity here described x matching (excel/online), so we can set the matching val according to model descr
                    if (rT==0) {// should be rT=0
                        // get   the type of match :
                        // string : normal entity value
                        //  no ASWG support


                        // GET the result Type 
                        mv.match =mv.vmatch = storemat;mv.mid=storeMId;mv.matched='match';
                        // no mv.matched='match' ? 
                    } else // a non static matcher (db call) will provide the entity match obj
                        if (rT == 1) {// we must set a Ent entities from Ent api storemat in a convenient var: ...............
                                    //  a std model selected/matched entity item row {value,descr,,,,,, + bl fields }
                        // the model associated with condition will be the row model ( no bl ) so a basic value/descr or match/vmatch , the model description in excel will say the connection url ,
                                                                                                                                        // the model model is not in excel model but is represented by row fields 
                        //let mvv= Object.assign(mv,storemat);
                        // , ASWG support , set the entity in EntMod var , can be askmatches or .....
                        // let EntMod=storemat
                        //key.entity,// was param in dyn_medicine

                        let setSt=mv;// no more : setSt_(entity)||mv;// std : attach in mv ( the entity of the condition )

                        let EntMod=setSt.entity=storemat;// VAL with match set in convo
                        // the std format matching entity fields :
                        // alredy done in matcher mv.entity.match=storemat.value;mv.entity.vmatch=storemat.descr;
                        // like was a value to get with a regex , copy down to event model mv ( launching the db rest , in realta e' event binario matcha o no il db query !)

                        if (EntMod.matched) setSt.matched = EntMod.matched; else if (setSt.match) setSt.matched = 'match';

                        let row;

                        //  EntMod=storemat comes from a entity type  matcher doing a  service call, so meets ASWQ entity matcher interface   see reference in dynMatch() service helper
                            if (EntMod.rows.value) {// rows={value,,,} nota array , a simple entity because row contains value field, row can be in std db format ( have bl  fields oltea a patt e descr )

                            row=EntMod.rows;// rows is row


                            } else {
                                row=EntMod.rows[0];
                            }


                            console.log('  addMatcRes is setting a Entitymodel.match that represent the entity (Entitymodel.instance/Entitymodel.row(s)).match) match. rT case =1, a matching of complex entity name: ',entity,', of type: ', storemat.type,',entity.rows: ',EntMod.rows);

                            
                                                            // better use an alredy set match at entity level ? 
                                if (EntMod.match) {// match is alredy set by entity.match
                                setSt.match = EntMod.match;
                                setSt.instance =EntMod.instance;// must be set 

                                }
                                else {// set match here 
                                    let stdval=false;// the first item row
                                setSt.instance =row;// x convenience ,  a instance result independent from model type . nb can be null (the entity matcher run well ( matched) but return a null row . alternative to have a entity matcher not matched (not run) )

                                

                            
                                let ival,mapval;
                                //   extract main entity matching ,mapval, from fields described in model  pattArray = step.values.excel[entity].modelpattArray={value-mapval&itemb-regexb&.......}  > get value mapval
                                if (pattArray) {// pattArray={value-mapval&itemb-regexb&.......}  > get value mapval . means : set as matched value the field mapval  match=row.mapval
                                    // error pattarray is a string !!
                                    // so 
                                    
                                    if((ival=pattArray.indexOf('value'))>=0){// :value-herethefieldtousetosetmatch&......
                                            mapval=pattArray.substring(ival+6);
                                            if((ival=mapval.indexOf('&'))>=0)mapval=mapval.substring(0,ival);
                                        
                                    }
                                    //   .... code other matcher.mod.blfield1/2/..  oltre a mod.match

                                                                
                                if(mapval){// complex ent : in row can not be present value field . there are more entity (each with  only its key/name). so set match=row.mapval
                                EntMod.type = 'Ent-Vector';//  the row contains also bl fields .  mark complex ent type='Ent-Multi' , ex row={color,size:}







                                    /*
                                    if (pArray) itr1 = Object.getOwnPropertyNames(pArray);
                                    else {
                                        // TODO TODO todo : do the same on mod_feature branch
                                        if(pattArray.length>7&&pattArray.charAt(0)=='{'&&pattArray.charAt(3)=='}'){// set x,y
                                            itemSep=pattArray.charAt(2);nameSep=pattArray.charAt(1);
                                            pattArray=pattArray.substring(4);



                                        }}
                                        */









                                    // that will say what is main entity, if there is one 
                                    // say where is the entity in row obj  . run eval like convo looseJsonParse(), temporarely treat like a field :
                                    // make easy: pattArray.value  = 'x.y.z'
                                    // xeval='X.'+ pattArray.value+';' so something like match=looseJsonParse(xeval,context=EntMod)

                                    // temp :suppose  just a string as the property of EntMod:
                                    // if pattArray.value is string :
                                    // ex $%amod:value-pippo&descr-caio  will set matchers.amod.match=row.pippo and matchers.amod.vmatch=row.caio
                                   // if(row)EntMod.match = row[mapval];else {EntMod.match =EntMod.matched =null;}
                                    if(row){setSt.match= row[mapval];// else lascia il valore in essere.  corrected 20062021
                                        console.log('  addMatcRes is setting a Entitymodel.match  rT case =1 ($$modname:value-arowfield&....), use row.',mapval,' to set model match, instead of entity.match');
                                    }
                                    else  stdval=true;// use row.value to overwrite entity.match ???
                                    // future use 
                                    // if (pattArray.descr) EntMod.vmatch = EntMod.row[pattArray.descr]; else EntMod.vmatch = EntMod.match;


                                } else{
                                    stdval=true;
    
                                } // EntMod.match = '?';// no main entity .match will be extracted from .row  by following ask custom field/ onchange  from matches.supportingmodel.entity !!
                                // no : EntMod.matched=null;// match val  not found
                            }else{stdval=true;
   
                            }

                            if(stdval){// set the value field as bl match : match=row.value
                                if(row){
                                setSt.match = row.value;
                                if (row.descr) setSt.vmatch = row.descr; else setSt.vmatch = setSt.match;
                                // bl fields can be recovered by vars.matches[].someblfiled
                                // the event binary result , alredy filled ?
                                }else{
                                    setSt.match= setSt.vmatch= setSt.matched=null;
                                }
                            }

                        }
                        // redirect mng 

                                                    // ============================  app case (do a specific matchTyp ?)
                            // see dynMatch() : row={redirect:'name',action:'repeat/next/begin....'}
                                                                                /* condition format :
                                                            {
                                                            "pattern": "oper",
                                                            "type": "regex",
                                                            "action": "execute_script", xx
                                                            "execute": {
                                                                "script": "hello",      xx  
                                                                "thread": "default"     xx
                                                            }
                                                            }

                                                    */

                        if(pattArray&&pattArray.redirect){// Ent matcher : app:// call case : supporting condition $$model: must have a model with item name  redirect and action
                            // reset the next action !
                            let condition=storemat.condition;// condition is inserte by Ent matcher in app:// case 

                            //>>>>>><  TODO  better matcher mark type='Post' instead of 'Ent' !!!!!!!!!!!!!!!!! 

                            if(storemat.redirect&&storemat.action&&(storemat.action=='execute_script'||storemat.action=='beginDialog'||storemat.action=='complete')){
                                condition.action=storemat.action;
                                condition.execute.script=storemat.redirect;

                            }

                                                    // ============================  app case (do a specific matchTyp ?)


                        }
                        } else if (rT == 2) {// intent case

                        // in this case the matcher will transmit the wit.ai intent resolved format (matcher  can  add  some fields to wit.ai format)



                        // but if we used a builded chaild to resolve the intent we get from the child usually a askmatches format with askmatches.child/relayask.intent in wit.ai format 
                        // so can be choose his format and var as std way to put a intent match instead that in a matches.child/relayask.intent    ( or can be used both ? )
                        // or mv.intent ??? 
                        // NO MORE :  so choose to set in mv or ask or use .dir:

                            let setSt=mv;// no more setSt_(entity)||mv;

                         let EntMod=setSt.intent=storemat;// storemat:  wit.ai intent resolved format (matcher  can  add  some fields to wit.ai format)

                                                 // like was a value to get with a regex , copy down to event model setSt ( launching the db rest , in realta e' event binario matcha o no il db query !)
                        // see format. reference
                        setSt.match=setSt.vmatch = setSt.intent.match;// bl fields can be recovered by vars.matches[].someblfiled
                        //todo after mng param . setSt.instance= setSt.intents[setSt.match];// a convenience reference to be easily used in templates !!! , when selection activity id sdone the selection is usually set in cursor.sel and copied here 

                         // transmit the matching val also to the intent as a whole ( the )
                         // alredy done in convo !! if(mv.matched=='match')mv.match =mv.vmatch=entity;else mv.match=null;

                          //  mv.match = null;
                          if(setSt.intent.complete)setSt.complete=setSt.intent.complete;
                        } else if (rT == 3) {// query cursor : very like to intent case
                          // ASWG  support let EntMod=key.masterQ,// was param in dyn_medicine
                          // ......
                           

                        // in this case the matcher will transmit param/query resolved format (matcher  can  add  some fields to helper val result)



                        let setSt=mv;// no more setSt_(entity)||mv;

                        let EntMod=setSt.param=storemat;// storemat:  wit.ai intent resolved format (matcher  can  add  some fields to wit.ai format)

                                                // like was a value to get with a regex , copy down to event model setSt ( launching the db rest , in realta e' event binario matcha o no il db query !)
                       // see format. reference
                       setSt.match=setSt.vmatch = setSt.param.match
                       setSt.matched=setSt.param.matched||'match';// or copy setSt.param.matched
                       setSt.instance=setSt.param.instance;// needed ???
                       if(setSt.param.complete)setSt.complete=setSt.param.complete;

                        } else  mv.vmatch = null;// do no set matchers
                }// ends a finit dimension entity

            } else   {// dont match  mat=false
                mv.vmatch =// tested (step.values.matches[entity] exists  ) but not matched // so not matched is matches[entity]=null???
                mv.match=null;mv.matched=false;
                // :> case , we can not match the selector entity for a desire intent/query but the selector can be set to default entity / rows that will be 0 , so force storeMId]
                storeMId=0; // set default intents[0] or rows[0], so force  index=0
            }
            // ?? if(isStatic){
            //if (isVal) 
            {// anyway

                if (mat&&param && param.cursor) {  // desire entity selection see above 
                    /* - set inside these fields :  param={
                                                        match:,vmatch:,selmatched:,
                                                        group:{sel:{item: param.cursor.rows[storeMId]}}

                        -  attach param to model ( AND to this normal ask ? )
                            mv.param = param;
                            (ask.param = param;)
                    }*/
                    
                    // review 012021
                    // >> this condition is selecting a desideredE unselected model using its cursor param set : param=step.values.(ask)matches[desiredE].param 
                    // building a inline condition model the current run time model 

                    // 
                    // the inline model set on matches.nameofthemactingmodel ( if not specified by $$desideredE:> nameofthemactingmodel)  that matches the cursor 
                    //      has the same  name as this desiredE model attached to a ask model askmatches.desideredE.:
                    //      nameofthemactingmode=entity and the match value is the value of the desideredE matched 
                    //      so we attached also a instance :
                    //      matches.nameofthemactingmodel.instance=(ask)matches.desiredE.query/param.rows[correspondingIndex]

                    // ?? 
                    // NB in this case the model that matches is 'created' here: entity =previous.collect.key , the name of this ask in testing
                    //      so is not the name of a declared model in excel ! or in line condition : &&model:....



                    /* remember what said in bot.js onchange :
                    the cursor can be passed to a resolver ask that will find a single match , so will complete the setting of :
                    
                    param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
                    param.match=blResNam;//=blResItem[1];//  name  ex 'caffe top'
                    param.vmatch=blResItem[12];// voice name 
                    */

                   console.log('  addMatcRes is matching a selector entity: ',entity,', (can be same desire ) on a desire query ');

                    // entity is the on running generated model by the condition resolver with same name as the ask !
                    //  step.values.matches[entity]={match: storemat};// alredy done 
                    // adds matched item copyng from desidere ask :
                    // param=step.values.askmatches[desiredE].param

                    // UPdate the desire query param ( so add a match and a sel)
                    let isMasterQ;// the model is a query , not intent
                    let rows=param.rows||param.cursor.rows;// prefer param.rows
                    if(param.group)
                    if(param.intents)isMasterQ=false;else isMasterQ=true;// otherwise is isIntent
                    // set context staff to mark a selection was done ( probably would to be move position of selected item as first position )
                    let mName,mVname,instance;// the matching itemname and vname
                    if(isMasterQ){
                        
                        if(rows){
                            instance=param.rows[storeMId] ;//
                            mName=param.match=param.rows[storeMId].value;


                            // copy of group.sel
                            param.instance=param.rows[storeMId];// convenience
                            param.index=storeMId;

                        }else if(param.rows&&param.rows[storeMId]){// delete !
                            instance=param.rows[storeMId] ;//
                            mName=param.match=param.rows[storeMId].value;

                        }
                        if(mName!=storemat)console.error(' addMatRes, setting desire query selecting , found error in array indexing ');
                         
                        param.group.sel ={
                        item: instance,matched:'match'//mv.matched // ERRDS: ERROR ! should be used storemat  to calc storeMId as : param.cursor.rows[storeMId].value=storemat (as resModel[storemat] describes rows[storeMId]]!) 
                        //,index:blRes
                        ,index:storeMId
                        };// index storeMId refears to cursor.rows index not to table/data index !! so take care ! 
                        if(instance.descr){mVname=param.vmatch=instance.descr;// ? or vname ??
 
                        }

                    }else {// is intent
                        instance=null;

                        //instance=param.intents[storeMId];// WARNING  ::::::::::::::TODO     better use the value/name and storemat to get the corrispondence !!!!!!! so also in Query case !!!!

                        param.intents.forEach(element => {if(element.name==storemat)
                            
                            {
                            instance=element;
                            }
                        });
                        
                        if(instance){
                        param.group.sel = {
                            item: instance,matched:mv.matched//,index:blRes, added matched to let it know ita a default because selector run but not matched 
                        };
                        mName=param.match=instance.name;
                     if(instance.vname){mVname=param.vmatch=instance.vname;
                        }
                    }
                        }

                    /* no : 
                    param.match = storemat;// ?? touch the desire ask result ?
                    if(param.cursor.resModel&&param.cursor.resModel[storemat])
                    param.vmatch = param.cursor.resModel[storemat].vname;// ?? touch the desire ask result ?
                    param.selmatched = entity;// a way to see in param  if the match is a single row cursor or a following selection match,
                    // entity=previous.collect.key 
                    */

                    // now the generated model . should i add  param ??? on model or on ask ? both ? 
                    //step.values.matches[entity].vmatch=step.values.askmatches[desiredE].param.group.sel[12];

                    // 112020
                    // mv is the model generated containing  the selection (matches.mv.....) and is set by $$desidered:>pippo , so   mv=pippo
                    //  if is missing convo uses a model matches.samenameasthedesidered 2 choices :
                    //      1 create anyway a new model  but +  '_sel' to avoid overlapping  TRPK
                    //      2 just add fields to desire to set the selection  

                    //  its match value will copy the name of selected desidere item ! ( not the item name of run time selector model )
                    if(mVname)mv.vmatch = mVname;// pass in param ??
                    mv.match= mName;//should alredy set as storemat ! , param.group.sel.item.name ;// reset , in convo just set intents[0].name . set also if selector is not run
                    mv.instance=instance;// convenience reference. set also if selector is not run ,
                    mv.matched='match';  // 13022021  todo set 'best' if we got manyresult and still to select  means that anyone can take this as a selected value instance 

                    ///* ?????????
                    // attach param/intent to entity=selector of model param/intent( AND to this normal ask ? )
                    if(isMasterQ)// if mv different then desidered :  $$desidered:>mv copy complex model desidere in mv status  (mv.intents/param)
                    mv.param = mv.param||param;//  , param is just take as mv=desiredE.param in convo, where desired can be ask or also a model . so if is a ask here add a model of same name 
                    else
                    mv.intent= mv.intent||param;
                    //ask.param = param;// attack master model ( .param or .intent ) to ask containing condition $$entity:>
                    




                } else {// no .param
                    /*
                    if (isVal) {
                        mv.vmatch = step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                    } else 
                    */
                    {// recover voice name  if there is registered  in excel :

                        if (!storeVal&&step.values.excel&&step.values.excel[entity] && step.values.excel[entity].vmatches)
                            mv.vmatch = step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                    }
                    // leave previous matches if '§',nb cant be used in vuluetype model !!      <<<< TODO : CHECH it is true 

                    // add a  data to store regex extraction  to ......... ????
                    //if (rematch && rematch[1]) mv.data = rematch[1];// see ttest() return ( returns regex catch () ) ,store matched data to run on a routed displayng dyn key onchange (the thread msg on a $$ condition gotothread )
                    
                    // ????
                    if ( storeVal ) mv.data = storeVal;// see ttest() return ( returns regex catch () ) ,store matched data to run on a routed displayng dyn key onchange (the thread msg on a $$ condition gotothread )
                    
                }
                // } //ends if(isStatic)
            }// ends if isval

            // alredy done : if() step.values.matches[entity]=mv;

        }// ends if entity 



        /* *** askmatches mng OVERVIEW
            usually this are the vars used 
        
            - in desire ask that do onchange trying to resolve a single match of a single item:
              >in template :
        
                {{vars.askmatches.dyn_rest.param.......}} 
                    example {{vars.askmatches.dyn_rest.param.match}}
                            {{vars.askmatches.dyn_rest.param.vmatch}}
                
                and 
                        {{vars.askmatches.dyn_rest.param.group.....}} the group class view attributes( class_/resourcetype group view of item) of matching item/instance
                            example {{vars.askmatches.dyn_rest.param.group.name}}
                                    {{vars.askmatches.dyn_rest.param.group.vname}}
        
                                 nb in this implemtation of item cols (bl attributes)
                                    {{vars.askmatches.dyn_rest.param.group.sel.item[1]}}==
                                     {{vars.askmatches.dyn_rest.param.match}}, 
        
                                     {{vars.askmatches.dyn_rest.param.group.sel.item[12]}}==
                                     {{vars.askmatches.dyn_rest.param.vmatch}}
        
                        {{/vars.askmatches.dyn_rest.param.group.sel.....}}// the matched model item view attributes 
        
        
        
                        example : the matched model value/name {{vars.askmatches.dyn_rest.param.group.name}}
                                the matched model vname {{vars.askmatches.dyn_rest.param.group.vname}} ( = {{vars.matches.mod_Serv.vmatch}} 
        
             > in condition:
        
                {{vars.askmatches.dyn_rest.complete}} the onchange query matching process result 
        
            - in resolver  CONDITION  trying to resolve a single match of a desire ask multi results we set and use :
        
                     IN NEXT ROUTED (by resolver condition )  MSG we can use in template :
        
                        {{vars.askmatches.dyn_rest.param.group.sel.item...}} ( so as we routed from a resolver query ) 
        
                            nb desire ask multi results store rows setting  :
                                    mydyn.param.match=mydyn.param.vmatch=null;// nb different from a non dyn ask !!!
                                    mydyn.param.cursor={rows:res.rows,resModel:{},data,param} 
        
                        and as previous, select a item  setting :
        
                            {{vars.askmatches.dyn_rest.param.match}} and 
                            {{vars.askmatches.dyn_rest.param.vmatch}}
                
                        but dont change .group staff that was set in desire ask onchange :
                                    example :
        
                                        param.group.name=gr[1];// example col or rest 
                                        param.group.vname=gr[5];// example colazione or ristorante
        
            - in normal ask 
              >in template :
        
        
                                {{vars.askmatches.akey.match}}  the condition model that caused not default routing  
        
                                used only by algo : entity={{vars.askmatches.akey.matches[i].key}} say that a condition, of key=akey, matched on that entity 
                                used only by algo : entity={{vars.askmatches.akey.matches[i].key}} say that a condition, of key=akey, dont matched on that entity 
        
        
        
        
        
        
           *** model matches mng OVERVIEW
             in template :
                 {{vars.matches.mod_Serv.match}} and {{vars.matches.mod_Serv.vmatch}} 
        
             in condition:
                            .................
        
        
        
        */

        // if(mydynParam) we have the resolver section to complete :
        /* 
        
        a) set model build on this resolver that is entity  
    
        mydyn=step.values.askmatches[previous.collect.key]
        if(mydynParam){// a cursor selection case ii is the matched index 
                mydyn.param.group.sel=step.values.askmatches[desiredE].cursor.data[ii];
    
                // no : 
                //todocheckvname vmatches; now we can find in data[][]=mydyn.param.group.sel[12];
                //=mydyn.param.group.sel[12];
    
            }
        b) add/complete/review  param selection also in  desiredE
            >>> todo check out if the matches in desiredE.match and in desiredE.param.group  ......
            
        */




    }// ends addMatcRes


};//  ends vfwF

let fsmfactory = function (cfg_) {// a fsm initilized / a rest server access point // a default/TEMPLATE app ctl fsm initilized / a rest server access point 
    let cfg = cfg_;
    let botstatus = { processing: 0, log: [] };
    return {// application

        begin_def: function (cmd, request) {
            // new user comes in ( comes out after a time lag cause channel reset )
            // the dialogstack active dialogid is cmd
            // to see if it was a new dialogstack we must have beginDialog info flag ( todo) , or observ that session is a void obj
            let log_='begin-'+cmd+'-'+JSON.stringify(request);
            botstatus.log.push(log_);
            logger({user:'',text:log_},'event','');
            console.log('application endpoint begin_def called. def thread called for cmd : ', cmd,', request: ', request);

        },
        post:function(action, vars, session, request) {// request is a qs : ?ask=pippo&colore=giallo  (actionurl,convovars,session,req);
            let log_='post-action:'+action+'-request:'+JSON.stringify(request)+'-session:'+JSON.stringify(session);
            botstatus.log.push(log_);
            logger({user:session.user,text:log_},'post','');
            transaction(action, vars, session, request);
            console.log('application endpoint post called. session : ', session, '\n vars ', vars);

        },
        post_aiax_fw_chain:function(action, vars, session, request) {
            // here we implement a middleware organized by rooting level (ctl/app routing) and adapter to interface ext service (ve)
            // that will receive and respond data in model format to onchange that use model and directive fw support 

            console.log('appserver post_aiax_fw_chain called session : ', session, '\n vars ', vars);

        }
    }

    function transaction(action, vars, session, request) {// web server routing sys session = app user status; vars=app user view status
        // will work on session and less on vars (i/o)

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
                session.path = request.path;
            } else if (action_ == 'book') {// action tour-book
                session.booked = request.book;// request={book:res};
                logger({user:session.user,text:session.booked},'book','');

            } else if (action_ == 'next') {
                if (session.curprocess == 'path') ;//  ?????   session.path++;
            } else;
        } else if (action == 'register') {
            // call server to get user data 
            // await user=get()
            console.log('application endpoint post called. def thread triggered/replay for service/cmd : ', request.service,'\n session: ', session, '\n vars ', vars);
            let user = request.user;// from convo.vars.user
            session.user = user;// will be available as vars.appWrap.session.user
            session.vuser='luigi';
            session.processing=request.service;// from userbefore()
            let log_='app-register-on-session';
            // botstatus.log.push(log_);
            logger({user:session.user,text:log_},'app','');

            ;
        }
       
    }
}

/*
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
WrapApp.prototype.post_aiax_fw_chain=function(cmd,req){
    post_aiax_fw_chain(actionurl,this.va,this.sess,req);
 }
*/

 //convostatus=application.post('tourstart',convostatus,app_session,request);// request is a qs : ?ask=pippo&colore=giallo
 function wrapgen(session,convovars,app){// a relay to register ctl as listener of some events (form postback) 
                                    // the ctl triggered can be in some session var of the browser ( the url downloaded) so can do a post back
                                    // or we consider a big page that take session status on where the browser is and   wherethe browser want to go ( post througth to a actionurl)
                                    // anyway the wrap will search some registered controller that can serv a post on action actionurl/postback + form data 
                                    // that application will also manage page navigation ( the dialog set managed by cms) as a spa or using a express server


                                    //function with no state vars like EXTRESS CONTROLLER !!!!
    //let app_session=session;convovars=convovars;// closure var
    let app_;
    if(app)app_=app;else app_=application;
    if (app_)
    return {// that obj can be got inside a onchange ( do not has onchange in scope  ( is added on model ask directive , can come from cms !))
            // with vars.app
    service,
    fwCb,
    post:function(actionurl,req){// pass session in closure !
        app_.post(actionurl,convovars,session,req);// session and convovars cant change when i stay in the same convo
    },
    post_aiax_fw_chain:function(actionurl,req){
        app_.post_aiax_fw_chain(actionurl,convovars,session,req);// session and convovars cant change when i stay in the same convo
   },
    begin_def:function(cmd,req){
        app_.begin_def(cmd,req);// session and convovars cant change when i stay in the same convo
   }
    //session:app_session
    //,session //// warning session must not be reset ! so i would loose the new ref 
    }

};


//let convovars=values;
// one or the other
async function getappWrap(bot,convo,app){// now is :
    // ***********  SESSION  recover (into values.session) from dialogstate and 
    //              values.app = APPWRAP  (wrapper of  application with convo vars )

    /* *********************    01102020  management summary on session THE ONLY UPDATED REFERENCE x SESSION  

    01112020  ==============  to be reviewed , using last status mng overview ................   !!!!!!!!!!!!!!!   


    premessa in a express app the ctl mantains its status in session vars condivise anche conil browser ( pensa a una spa )
    - ma qui il livello browser e' fatto da convo che non ha proprio stato perche' lavora per tutti gli user, quindi anche lui ha uno status delle view che qui si chiama status
     e che viene passato al onStep , quindi anche lo step ctl usa i servizi di status : controller inversion , better :controller-browser simmetry !!!
     - a cio si aggiunge uno status di interconvo che sarebbe lo status del dialog set : lo stack 
     >> il nostro problema e' connettere il dialog stack , ds, con il controller  che viene suddiviso in una parte nel convo ( la parte spa detta appwrap) 
         che ha un livello superiore ( la pagina o il ds)  nel server esterno express  o a un livello superiore di appwrap


     nb the convo has access to vCtl   via vCtl=controller.plugins.vCtl

        the vCtl.application will be called using a session and vars wrapper (vars=values=convo.step.state.values).appWrap singlethon set at onbefore()
   
        user entering in a new cmd will recover a dialogstack status : all status of all cmd  (thread) called by first starting cmd

        let userDstate = await dialogState.get(convo.dc.context, { dialogStack: [],error:true });// must be found
         userDstate={session,
                      dialogStack:[{convoid,convostate}// convostate > step.state
                          ,,,]
                    }

    each cmd ( think a page of a browser spa app ) has its conversation=convo instance ( a convo controller), like any express controller 
        after got the new user turn speech , before active convo is called (check : by dc.beginDialog?) its status is recovered  (convostate) from dialogStack ( the top of stack) 
        so convo can start a step passsing a the state obj: 
            onStep(,step)
                on which  can find convostate=step.state

                state obj is recovered by the status manager(dialogstate ) and will contain :
                        - dialog status ( the status of the view/data gathering and command navigation level ) ,called the browsing level ) , so the dialogstack and ,at step level , its   the step.values=vars, and 
                        - app status , the session , 


    - ora quando lo user parla , onstep gestische l'equivalente dei browser  onclick abilitati  cercando di capire quale onclick e' stato firato ( il matcjhh dei ask condition )
                    una volta trovato il onclick ( il condition matchato) , ovvero una volta che il onChange trova un match o lo predispone per i seguenti condition 
                                                                            ovvero una volta che il match avviene si gestisce in match nel onChange successivo 
                    >>> devo agganciare il listener che immaginiamo essere un spa ctl equivalente di un classico ( level app ) express controller 
                        cioe il on click va a sparare il ctl registato a se stesso il che avviene con un onchange : appWrap.post( form data) 
                            il appwrap estrae il ask e va a vedere se c'e' un listener ( detto controller , in genere di pagina che discrimina il thread e il step)
                            abilitato/registrato che possa gestire il potenziale match 
                            il listener in genere lavora sul session e decide se sparare un post a livello pagina al external express o gestire autonomamente la transazione
                            - il appwrap portera il session al controller registrato . il appwrap sara ospitato in session itself !



    /* *********************   previous comment  22052020  management summary on session THE ONLY UPDATED REFERENCE x SESSION  

    someone ( can be also  dc.beginDialog ) must check if session singlethon  exists , init it and attach it in some step referencies
        we do it in basefw...onbefore()  ( called from onStep()) that is easier because is a userstaff :
            - once got userDstate we check the singleton session then attach it 
                - somewhere in onStep ,:
                    session=step.status.values.session (or step.values) //

                - in onchange or in before :
                    session=convo.vars.session;

            - here we set  also the application (session and vars wrapper) (vars=values=convo.step.state.values).appWrap singlethon , so in step we can call application wrapping also session and vars with :
                 - somewhere in onStep ,:
                    appWrap=step.status.values.app (or step.values) //

                - in onchange or in before :
                    appWrap=convo.vars.app;



                    nb in future move al vCtl convo status (x=matches/assmatches/...) from vars.x to vars.vFw.x


*/    
    

                /*      ***************************************
                convo.vars==convo.step.values==convo.step.state.values
                        ***************************************
                */  



/* OLD mng overview          rules in convo status :

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

    let values=convo.step.state.values;//

    /*22052020
    // already set in this convo ?
    if(values.app){// the wrking convo values , appWrap=values.app

        console.log( 'getappWrap, onchange/before recovering state,wrapper already set , session  : ',values.app); 
    if(values.app.aiax){
        console.log( 'getappWrap returns , found values.app.aiax');
        return }// is the app wrapper
    else if(values.session){// need to re add the wrapper as the status persist only with plain obj  , string and number
       // values.app=Object.assign({session:values.session},basewrap);

    }else ;// error
    }*/

    if(!values.session){// session not set so set it and the appWrap
    let dialogState=bot._controller.dialogSet.dialogState;// =

    // or directly
    // somewere before :
    let userDstate = await dialogState.get(convo.dc.context, { dialogStack: [],error:true });// get status, AWE
  //  let userDstate = await dialogState.get(convo.dc.context, { dialogStack: [],error:true,session:{}});// get status, AWE
                                                                                            //  init if void ??
                                                                                            // (nb dialog state (dialogState) was get/init already in   Dialogset.createContext:
                                                                                            //       state = await this.dialogState.get(context, { dialogStack: [] });
                                                                                            //  and put in dc.stack = state.dialogStack;

        if(userDstate.error);// error
        if(userDstate.session);//error 
 
   // QUESTION  : non basta che faccia questo al begin del default thread ( butto app in values ????
 
 // changing 052020 .  
  //  state.appstatus={appSt:'ok',dyn_match:{}};// status a livello app . per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']

  values.session=userDstate.session=userDstate.session||{};// ADD SESSION TO dialogState state, see AWE , init if void 

// better, the same as  : 
// let userDstate = await dialogState.get(convo.dc.context, { dialogStack: [],error:true,session:{} });// must be found


 //here a onchange can call : 
 
//  let convostatus=convo.vars,request={path:'cultura'};// >>>>>>>>>>>>>>>>>>>   put all fw staff under vars.frameW   !!!!  ex  vars.matches  > vars.frameW.matches
 
//appWrap=wrapgen(null,convo.vars);
// porta fuori as const
// put after : values.app=wrapgen(values.session,values);// session and vars application wrapper  appWrap
//values.app=new WrapApp(values.session,values);

 console.log( ' session recoverd from dialogState accessor ',values.session,' \n And app wrapper getappWrap registerd state.app) = ',values.app),' \n nb appwrapper will call app method passing session';  
    }
    // useless that are done in fwbase caller if( !(values.app&&Object.keys(values.app).length))values.app=wrapgen(values.session,values);// session and vars application wrapper  appWrap
    // do in fwbase caller :
    // if( !(values.app&&Object.keys(values.app).length))values.app=wrapgen(values.session,values);// session... and (values=vars).app application wrapper  appWrap
    return wrapgen(values.session,values,app);// session... and (values=vars).app application wrapper  appWrap
}



function init(db_,rest_,appcfg,session,env){// appCfg :  init default application ctl

// can we build fwAskOnChange automatically from models.js ???

    db=db_;    rest=rest_;// they will be propagated into service and fwHelper via fwbase
    application=fsmfactory(appcfg);// init default application ctl
    // service and fwCb will be added later soon !!!!
    // they can be said injected in sense that they are instantiated outside the fw by user configuration code and registered on fw 
    //  ( that in service obj , that is the same as startup in .net, , or using some registration call to (service.js).register(servicename,func), 
    // than called in user cb ( onchange()) by name service.somaregisterd injected service)
    // ALL will be in context/scope of user onchange convo cbs !
    cfg=env;
    if(cfg.logs)logs=cfg.logs;
    wlog= require('./helpers/logs').logger(env);
    vFw.winston=wlog;// update winson definition 
}

function buildF(ask,ftext){/* now done in fwbase 
    // use a text and get a function using :
    //  - eval or function returning a function to insert in a promise
    /* now done in fwbase :
    fwAskOnChange[ask]=null;//  - eval or function returning a function to insert in a promise
    let context={};
    Object.assign(context,service,fwCb);// not add aiv3 staff 
    fwAskOnChange[ask].bind(context);
    */
}// insert db and rest services


/* ****************  mng summary on framework onchange settings in a command :
 onChange functions (onChange.js).onChange=fwAskOnChange={modelname:{askname1:onchange1_function,,,}} will be injected on model models.modelname.direc.askname1.onChange,
      if modelname param is missing we take modelname=cmdname
 in fwbase.initCmd('cmdname',{meds:[11,22,33],cur:'rossi'},[askname1,,,],modelname) will be loaded the modelname asks functions on cmd cmdname
 will be usually injected on models.modelname.direc.askname.onChange
*/
onChange=require('./onChangeFunc.js');
// that's the voice controller :  todo ad service and directives obj ( )
// vcontroller=
module.exports ={init,onChange,buildF,getappWrap,mustacheF,modsOnAsk,vfwF,vFw,injService};// onChange:will overwrite directive onchange,getappWrap will now mng session recovery
// service injection : 
// this onchange export seems  the equivalent to csharp dialog obj called by handler .
// so as it is  init with all the injection staff that will be on scope of user onchange, and do not need those obj added to vars status to be available !!  . like service !!
// >>> whoever will chain these onchange cb to convo onstep() ( THAT IS fwbase in case the onchange comes from cms !!) :
// -  will add in its space/context service,application and fwCb