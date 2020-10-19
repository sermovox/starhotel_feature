var db,rest;// services

let{ mustacheF,modsOnAsk}=require('./mustacheFwFunc.js');//fw functions
let application,service,fwCb;


const fs = require('fs');

let 
dynJs=require('./models.js');// db and http init by bot.js
// ?? d;

// luigi 032020
const logger=function(message,ch,send){//logger({user,text},ch,'')
    if(!message.text)return;
    let x,mylog;
        if(send){x=' send ';}else x=' receive from '+message.user;
    mylog='\n'+new Date().toUTCString()+'app server,ch: '+ch+x+', log :\n      >>  '+message.text;
    mylog+=' ..';
    let fn='app.log';
    if(ch=='book'){fn='public/booking.html';mylog='<br><h2> a new reservation was confirmed on : '+new Date().toUTCString()+' at: '+message.text+'</h2><h4> user : '+message.user+'</h4>  waiting for a new schedule ...<br>__________________________________<br>'}
    fs.appendFile(fn, mylog, function (err) {
        if (err) return console.log(err);
      //console.log('Appended!');
     });

}

let application;


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
    fwCb.askS.dynMatch____=async function(tomatch,entity,excel,varmatches){// old, no more used nowused by condition dyn matcher or from onchange 
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
        entity,             // ................................
        storemat, // a string for simple static model match , a obj if we matched a entity , intent , or a query result 
        // storematch='thematchedvalue'
        // storematch={type:'Ent'/'Int'/'Cur',.....}

        
        storeMId // storemat is
        // if the model is static   or is no model , we use a regex matcher , so is a string : the value/name matched ,  
        //                          storeMId is the index p,  in static  model definition 
        // if the model is dyn,,, , we use a directive matcher   , so (isStatic=false) is a obj the matcher returns:
        //          dyn matcher returns : see dynMatch in fwhelpers.js

        , routing// routing=linematch is true if not $% case ( not routing case ) so this condition will stop the cond loop
        , rematch// the regex matched extraction (....)
        , reset// reset matches ???? never called !!!!!!!!!!!!!!!
        , param,// not nul if this is a resolver selection ask
        storeVal// old a integer or string to get from user  .02102020 : changed see below news 
        , step, previous
        //  see AQJU ,  probably the var isStatic just is indeed true if the type result is text . 
        //              if we need a var that knows if the matcher used is std regex static model or a custom matcher use isStatic_
        , isStatic_ // will decide to put std static match or use 


    ) {// register model/entity match, last turn match asked with $$ or $% result 


        /* 02102020 semplificazione da fare : new rules  x settaggio di matches[entity].match:
         storeval e isStatic_ probabilmente da buttare 
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

             3 casi :
             - entity nomatch   
                                        set .match=null
            - from   std matcher 
                        isStatic_ = true 

                        entity item singola risolta   descritti in excel o inline 
                                        storeval=nome singolo item ('value'), 
                                        .match={match:storemat,vmatch:storemat,mid:0}, storemat risolto come regex group match 

                        entity con piu item descritti in excel o inline 
                                        storeval = null 
                                         .match={match:storemat,vmatch:storemat,mid:index}
                                         ma in excel[entity]['someblpropname'][mid] posso trovare  proprieta addizionali 



            se obj :   matches[entity] =storemat ; storemat.match=storemat.vmatch=storemat.value;
                                        in storemat.type potro trovare type per differenziare casi particolari
            - isStatic_ e true se ho std matcher

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
        // storematch, storeMId is 
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


        let askmatches = step.values.askmatches;


        console.log(' ** addMatcRes called to set matching result  ,mat: ', mat, ',entity: ', entity, ',model item ,name(static) or obj, storemat: ', storemat, ', routing: ', routing);


        if (reset) {


            if (entity) step.values.matches[entity] = null;
            askmatches[previous.collect.key] = null;

            return;
        }

        let mf, amatch, amatchId;
        if (mat) mf = 'matches'; else mf = 'nomatches';
        if (entity) amatch = { key: entity };// the model/entity name matched/not matched
        amatchId = { id: storeMId };// normal condition match with no model 


        // do in main p loop if(storeMId==0)step.values.askmatches[previous.collect.key];// reset if start conditions loopif(reset){

        // nb step.values.askmatches[previous.collect.key] can be alredy filled with short bl status (like qs in reload after a web form)
        askmatches[previous.collect.key] = askmatches[previous.collect.key] || {
            matches: [],// [mod_ent1,mod_ent5,,] also condition with $%
            match: null,// {key:'mod_ent5}condition not $% (so routing)
            mId: null,// {id:5} // present also in no proper entity
            nomatches: []
        };//  [mod_ent2,mod_ent3,,]adds only $% or $$  case
        askmatches[previous.collect.key].matches = askmatches[previous.collect.key].matches || [];
        askmatches[previous.collect.key].nomatches = askmatches[previous.collect.key].nomatches || [];

        // if(askmatches[previous.collect.key][mf])
        if (entity) askmatches[previous.collect.key][mf].push(amatch);

        //             FIXED   ERROR  
        // when a past alreday ask matched we need to unmatch when testing again tll get a new match
        //  >>> so to make easy unmatch at any unmatched condition. the ask match only at last routing condition 
        //   DEFALUT THREAD EXCLUDED !!!!! 
        askmatches[previous.collect.key].match = null;

        if (routing) {
            askmatches[previous.collect.key].match = amatch;// stop condition routing
            askmatches[previous.collect.key].mId = amatchId;
        }// 

        //                ERROR  
        // when a past alreday ask matched we need to unmatch when testing again tll get a new match
        //  >>> so to make easy unmatch at any unmatched condition. the ask match only at last routing condition 
        //   DEFALUT THREAD EXCLUDED !!!!! 


        // else askmatches[previous.collect.key][mf] = {key:entity};// first value
        //askmatches[previous.collect.key].match += entity;// += '|'+entity in case of multimatch. register too the step was  matched in favor of entity 



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
            isStatic = isStatic_;// now false means non std matcher

  

            // ??????????????????
            // 01102020 : probably means that we do not have any model defined in excel . the 'entity is resolved by a regex matching group or some ai entity resolver 
            //              in this case the matcher set storematch='value' ( means the item name is resoled by ai , i donnt have models staic in excel ) and the entity value ( item name) is  storeVal
            //              so if the model is static in xcel storemat is the item name and the item content (value/name , descr, vname ... ) is got from excel model 
            //                  if the entity is got from external ai / regex group  then storemat='value' and the object properties are in storeval :
            //                      storeval : 'voiceitemname' ( vname)   if atomic  ex a date  user entered name of  person , a date ....
            //                                  a obj in std format if from db/entityfts  ={value(the vname in static model),descr,patt,data+blfields } 
            let isVal = isStatic && storeVal && storemat ;// a static model whose values are the regex group match ( user gives a integer, a name of something), not the item name declared in excel



            let mv=step.values.matches[entity]={};// reset


           // mv = step.values.matches[entity] = step.values.matches[entity] || {};
            if (mat) {// matches


                let rT;
                if (typeof storemat === 'string'
                 // || step.result instanceof String
                 ) rT = 0;
                 // id object :
                else if (storemat.type == 'Ent') rT = 1;
                else if (storemat.type == 'Int') rT = 2;
                else if (storemat.type == 'Cur') rT = 3;
    
                console.log(' result should be a string :', isStatic && rT == 1);


              



                if (isVal&&rT==0) {// the entity is a value ( item is the regex match value)
                    mv.match = storemat;mv.mid=0;// register under values.matches.entity=itemvalue
                    //mv.mid = 0;// dont use this, usable to see if is match is good (mid>0) 
                    // use storeval x  ??
                } else {// a finit dimension entity
                    if (rT==0) {// should be rT=0
                        // get   the type of match :
                        // string : normal entity value


                        // GET the result Type 
                        mv.match =mv.vmatch = storemat;mv.mid=storeMId;
                    } else // a non static matcher will provide the match obj
                        if (rT = 1) {// a std model selected/matched entity item row {value,descr,,,,,, + bl fields }
                        let mvv= Object.assign(mv,storemat);
                          mv.vmatch = mv.value;// bl fields can be recovered by vars.matches[].someblfiled
                          mv.match = mv.value;
                        } else if (rT == 2) {// int
                          //  mv.match = null;
                        } else if (rT == 3) {// query cursor
                           
                        } else  mv.vmatch = null;// do no set matchers
                }

            } else   mv.vmatch = null;// tested (step.values.matches[entity] exists  ) but not matched // so not matched is matches[entity]=null???

            // ?? if(isStatic){
            if (isVal) {// anyway

                if (param && param.group) {// this condition is selecting on cursor param set by a desiredE dyn ask : param=step.values.askmatches[desiredE].param
                    // the model that matches the cursor has the same  name as this desiredE ask :
                    // NB in this case the model that matches is 'created' here: entity =previous.collect.key , the name of this ask in testing
                    //      so is not the name of a declared model in excel ! or in line condition : &&model:....

                    /* remember what said in bot.js onchange :
                    the cursor can be passed to a resolver ask that will find a single match , so will complete the setting of :
                    
                    param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
                    param.match=blResNam;//=blResItem[1];//  name  ex 'caffe top'
                    param.vmatch=blResItem[12];// voice name 
                    */



                    // entity is the on running generated model by the condition resolver with same name as the ask !
                    //  step.values.matches[entity]={match: storemat};// alredy done 
                    // adds matched item copyng from desidere ask :
                    // param=step.values.askmatches[desiredE].param

                    // UPdate the desire query param ( so add a match and a sel)


                    param.group.sel = {
                        item: param.cursor.rows[storeMId]
                        //,index:blRes
                    };// index storeMId refears to cursor.rows index not to table/data index !! so take care ! 



                    param.match = storemat;// ?? touch the desire ask result ?
                    param.vmatch = param.cursor.resModel[storemat].vname;// ?? touch the desire ask result ?
                    param.selmatched = entity;// a way to see in param  if the match is a single row cursor or a following selection match,
                    // entity=previous.collect.key 

                    // now the generated mode . should i add  param ??? on model or on ask ? both ? 
                    //step.values.matches[entity].vmatch=step.values.askmatches[desiredE].param.group.sel[12];
                    mv.vmatch = param.vmatch;// pass in param ??

                    // attach param to model ( AND to this normal ask ? )
                    mv.param = param;
                    askmatches[previous.collect.key].param = param;





                } else {// no .param
                    /*
                    if (isVal) {
                        mv.vmatch = step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                    } else 
                    */
                    {// recover voice name  if there is registered  in excel :

                        if (step.values.excel[entity] && step.values.excel[entity].vmatches)
                            mv.vmatch = step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                    }
                    // leave previous matches if '§',nb cant be used in vuluetype model !!      <<<< TODO : CHECH it is true 

                    // add a  data to store regex extraction  to ......... ????
                    if (rematch && rematch[1]) mv.data = rematch[1];// see ttest() return ( returns regex catch () ) ,store matched data to run on a routed displayng dyn key onchange (the thread msg on a $$ condition gotothread )
                }
                // } //ends if(isStatic)
            }// ends if isval
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
async function getappWrap(bot,convo){// now is a session recover (into values.session) from dialogstate and put in values.app appWrap (wrapper of  application with convo vars )

    /* *********************    01102020  management summary on session THE ONLY UPDATED REFERENCE x SESSION  


    premessa in a express app the ctl mantains its status in session vars condivise anche conil browser ( pensa a una spa )
    - ma qui il livello browser e' fatto da convo che non ha proprio stato perche' lavora per tutti gli user, quindi anche lui ha uno status delle view che qui si chiama status
     e che viene passato al onStep , quindi anche lo step ctl usa i servizi di status : controller inversion , better :controller-browser simmetry !!!
     - a cio si aggiunge uno status di interconvo che sarebbe lo status del dialog set : lo stack 
     >> il nostro problema e' connettere il dialog stack , ds, con il controller  che viene suddiviso in una parte nel convo ( la parte spa detta appwrap) 
         che ha un livello superiore ( la pagina o il ds)  nel server esterno express


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
                                                                                            //  init if void ??
                                                                                            // (nb dialog state (dialogState) was get/init already in   Dialogset.createContext:
                                                                                            //       state = await this.dialogState.get(context, { dialogStack: [] });
                                                                                            //  and put in dc.stack = state.dialogStack;

        if(userDstate.error);// error
        if(userDstate.session);//error 
 
   // QUESTION  : non basta che faccia questo al begin del default thread ( butto app in values ????
 
 // changing 052020 .  
  //  state.appstatus={appSt:'ok',dyn_match:{}};// status a livello app . per status tipo qs di newpage after a form usare  mydyn=askmatches['dyn_rest']
 
  values.session=userDstate.session=userDstate.session||{};;// ADD SESSION TO dialogState state, see AWE , init if void 

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
    if( !(values.app&&Object.keys(values.app).length))values.app=wrapgen(values.session,values);// session and vars application wrapper  appWrap
    // do in fwbase caller :
    // if( !(values.app&&Object.keys(values.app).length))values.app=wrapgen(values.session,values);// session... and (values=vars).app application wrapper  appWrap
    return wrapgen(values.session,values,app);// session... and (values=vars).app application wrapper  appWrap
}



function init(db_,rest_,appcfg,session){// appCfg :  init default application ctl

// can we build fwAskOnChange automatically from models.js ???

    db=db_;    rest=rest_;// they will be propagated into service and fwHelper via fwbase
    application=fsmfactory(appcfg);// init default application ctl
    // service and fwCb will be added later soon !!!!
    // they can be said injected in sense that they are instantiated outside the fw by user configuration code and registered on fw 
    //  ( that in service obj , that is the same as startup in .net, , or using some registration call to (service.js).register(servicename,func), 
    // than called in user cb ( onchange()) by name service.somaregisterd injected service)
    // ALL will be in context/scope of user onchange convo cbs !
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
module.exports ={init,onChange,buildF,getappWrap,mustacheF,modsOnAsk,vfwF,injService};// onChange:will overwrite directive onchange,getappWrap will now mng session recovery
// service injection : 
// this onchange export seems  the equivalent to csharp dialog obj called by handler .
// so as it is  init with all the injection staff that will be on scope of user onchange, and do not need those obj added to vars status to be available !!  . like service !!
// >>> whoever will chain these onchange cb to convo onstep() ( THAT IS fwbase in case the onchange comes from cms !!) :
// -  will add in its space/context service,application and fwCb