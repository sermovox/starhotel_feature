




let db,rest;// user provided. mongo/express interface
let init=function(fwHelpers,fwCb,directives){// fwHelpers,fwCb: base functions containers , directives declaration 
// nb : directive is alredy managed , seems useless



// 072020 : TODO : to insert also qea ( refining matchers ( > no ! in future refine will be done inside a buileded refine template child . or specific matchers
//       put in models service:{}, or in specific model )
/* 

// >> BUILDING SERVICE INJECTED FUNCTIONS fwCb, service to put in vCtl ( cioe onchange.js) and make those ref available to custom (code/cms,....)
// they are template fw matchers funcions wrapped to add reference to directives. these are injected here in this fw voice controller  (or in a specific servise module )
// injected means that when i need the obj or the new class instance i get it using a reference passed by this fw controller that will build/define the obj/class
// so when i change the obj/class nothing change in the user part of the code ( so in cb :onchange...  and && in template and in $$$$ in conditions )

- fwCb,// service organized to be available as directive support (cioe usate dalle funzioni direttive ) :
    to build the dialog (like directive in angular build the html that define the gui dialog)
    esempio  directive to match a condition model
- service;// custom functions  to make available in injected js code $$$$  and in template && code && and in cb like onchange(),.....  .Question : what is the scope of eval code ??

 NOTE : 
 >>>>>>>>>>>>>>>>>   WHY call vCtl.setService(fwHelpers,fwCb) function to build vCtl.fwCb and  service ? 
                I can call here in init(), because the vCtl cant add any of its knowledge to build custom services !!   ??? !!!
                    then call vCtl.setService just to copy them into its fwCb, service fields !!

    convo will at some event in step looping, 
//  for example in condition looping :
//      according with step  directive inserted with macro or condition type , or just looking at usersay formatting 
//          ( example type=regex and usersays='$$dyn_model::' puo essere letto cosi: run matcher scalarstaticmodelregex on dyn_model speified on directive excel...), 
//  launch the registered handler esempio dynMatch

// example to launch on a condition model a matcher we can specify a fw std dyn matcher in this way :
//  in a condition set : 
        - type=intent 
        - put in macro the json directive containing :
//          matcher='fwCb.askS.dynMatch' // std fw function put in a event tree directory ( si specifica  fw service for ask of name dynMatch)

            >> osservazione 1
              in effetti qui con macro si vorrebbe introdurre le direttive che in voiceEngine android si inseriscono sui field dei form
                quindi potremmo inserire la direttiva match=dynMatch , con dynmatch in effetti un matcher injected here or as a custom matcher 
                oppure 
                inserire matcher='fwCb.askS.dynMatch'  che vorrebbe dire usa come matcher la direttiva applicabile agli ask di nome dynmatch

            >> osservazione 2 
              comunque le direttive inserite in macro devono essere equivalenti a inseirle  in excel !
          
or easier : 
//      matcher='dynMatch' // std fw function put in fwCb.askS directory 
//      or custom matcher='service.mydynMatch'    o 'vars.app.service.mydynMatch'????
//              where mydynMatch is a custom matcher built and registerd like httpService like we registerd above


// >> to set fwCb.askS.dynMatch = dynJs.service['httpService'] (set as above =httpService;) we remember the chains of calls in bot.js :
// - call vctl=onchange 
// - add vctl as plugin in  botkit ctl () 
//  when ctl ready, bot.js will  
//  -call fwbase  : fwCtl=require('./nat/fwbase.js')(controller)   
//      so we call this init()
//      here add fwHelpers=.....  as in aiv3
//      here, also set some custom (and also some fw service built from base fwHelpers)
             so the service httpService will call the base service fwHelpers ,    after got the directive models description 
//      ??    that's simply : (fwOnC=controller.plugins.vCtl).setService(fwHelpers,fwCb)

                in fwOnC.setService(){
                         we set fwOnC.fwCb=fwCb 
                         then extend services 
                          fwOnC.fwCb.askS.dynMatch= fwOnC.service['httpService']=httpService= httpFarm(fwHelpers)
                            nb how get dynMatch in setting .dir json in macro ???
                            
                        now when convo are instatiated it will get vCtl=_vcontroller so in code convo we can call services like :
                        this._vcontroller.service[y] or this._vcontroller.fwCb_[x]

 ........  that's it !!!!!!!!!

*/
// alredy in fwHelpers 
  db=fwHelpers.db;rest=fwHelpers.rest;

return setService(fwHelpers,fwCb);// will give fwfunction , they will be added to build 


}// end init()


function setService(fwHelpers_,fwCb_){// injection system : build services in 


    /* >>>>>>>  top 15072020 
      from fwHelpers ( extension of onchange cv ctl, db,http, and base helper functions) 
          and the knowledge of models (dynJs) in scope of closure,
          we build BASE services obj that can access to fw data (cv...... and dyn models/directives in dynJs/models.js):
                     models and matching algos) 
                      to do convo functions  ( onstep directives and add db methods fts staff , db map  ... 

         the first service cusomize using service in onchang will be the def dyn matcher ('restServ') that can be a template to do customizations 
                        see onchange.js
        

         
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

 let myf= new sFact(fwHelpers_);

return myf;




  




    /*
        ************************************************** alredy done 



    // >> SERVICE INJECTED FUNCTIONS 
// they are template fw matchers funcions wrapped to add reference to directives. these are injected here in this fw voice controller  (or in a specific servise module )
// injected means that when i need the obj or the new class instance i get it using a reference passed by this fw controller that will build/define the obj/class
// so when i change the obj/class nothing change in the user part of the code ( so in cb :onchange...  and && in template and in $$$$ in conditions )
let fwCb,// service organized to be available as directive support to build the dialog like directive in angular build the html that define the gui dialog
service;// custom functions  to make available in injected js code $$$$  and in template && code && and in cb like onchange(),.....  .Question : what is the scope of eval code ??



function httpFarm(fwHelpers_) {// will define data service using fwHelpers or another implementation to extract dyn view

122019 Mng Summary 
returns : f= function  :
    f(field, req, options) (( req: req ctl chain format : .......................))
    it does :
      - get paramlist,mapping,schema_url  from dialog.dynamic[field] 
      - so calls and returns :
            fwHelpers.onChange_dynField(req, null, schema_url, null, null, paramList, null, mapping);
          .............................................
          > see aiv3 refImplementation.onChange_dynField ......







var fwHelpers = fwHelpers_;//make available  refImplementation (onChange_dynField,rest,...) or its mofificationd + db + http + api to aiv3

 //{   getVoiceModel: 
 // 122019 now return a function 
  let f=async function (field, req, options) {// getVoiceModel:function(dynfield,req,options){



    // db : the param , the schema , the mapping response in row-id/text/descriprion/
    // rest : ....

    // as the param will be in some vars.matched item matched entity , i just recover from conf the list of params , then the 
    // a std aiax getter can do the query 

    // get the array of param to do query/aiax :
    // this.dialog.dynamic.adynfield.dynparam if i set call this



    dialog=dynJs.direc;// ERROR old mybot, so correct it !


    var paramList = dialog.dynamic[field].dynparam, // ex : ['param1'.'param2'], like attrib in a qs of a get, usually ['tableName_resName']
      mapping = dialog.dynamic[field].map,// additional info to map rest json field to itemname and item description  ,usually null
      schema_url = dialog.dynamic[field].url;// url or schema to lauch the query ,
    // in helpers : for(var i=0;i<paramList.length;i++){if(convo.vars[paramList[i]]){qs[paramList[i]]=convo.vars[paramList[i]]}else{qs=null;break;}}

    // will extract query for many dynfield 

    // uses db, http and ref implementation of refImplementation to extract dyn and params to fill dynfield and params of convo.vars
    // fwHelpers.onChange_dynField();// to do : use less param , dialog info can be obtained using api in  refImplementation functions 

    var queryresult;
    //onChange_dynField:function (dynfield1, isDb_Aiax, schema_url, sess_clone, sess_dyn, setquerywhere_, prefill, mapfuncnam, afterallDyncalc) {// a inner of main ctl code
    // calc inside onchange the param:
    //  isDb_Aiax,  prefill, ),  afterallDyncalc no more because return a promise

    //return a promise 

    // / * req_=req has specific format , relayed from f(req), see httpservicemngsummary :
    req = { convo, session, askey,qs } , 
    qs : {	term=qs.term,exec_=qs.exec,		> used to do search /fts on patt field 
    full=qs.full,inter=qs.int;		> used to set result rows format 
    join_1_m=qs.join_1_m,join_n_m=qs._join_n_m, > askey/fields to join using current field model .match 
    fts=qs.fts				> > used to do fts on patt field 
    } * /


    let pro=await  fwHelpers.onChange_dynField(req, null, schema_url, null, null, paramList, null, mapping)// paramList,mapping,url_schema could be got also in caller but if we set those param here can be explanatory/clearer
    let session=req.session;
    // fill match_param see      RETURNS   in    onChange_dynField()  
    let (rows,reason)=pro;// depending from req.full and req.inter  we receive different fields in  rows ={}
    if(reason=='json'){

     // TODO  updates Match_Parm using a func like in function qeAres(req,services) we updates  dynSes

     if(session.Match_Parm[req.askey]==null)session.Match_Parm[req.askey]= new  MatchSt();

      session.Match_Parm[req.askey].curRows=rows;



    }else if(reason=='byte'){

    }else if(reason=='err'){

    }else{return false;
    }

    return true;
  }
  return f;
// }
};

// FW BASE FUNCTIONS :

function onChange_dynField(req, null, schema_url, null, null, paramList, null, mapping){


}
// ends FW BASE FUNCTIONS 

  *****************************************************        end  alredy done ***************************
*/ 

}
function sFact(fwHelpers_){// the service obj factory ,using closure scope vars 
  // simply return service : a obj extending fwHelpers_ in closure
  // service will be extended on 
  // here the user can do its addings , it will be also referenciable in bot.js for inject a internal db data service engine


Object.assign(this,fwHelpers_);
// extends fwHelpers and its base services functions so 
// as services will be added to cv=onchangejs can be called:
// - from ask.onchange 
//    see fwbase.initCmd  where we can see that onchange user func will be called in its obj :
//          directive.direc[mkey].onChange(bot,convo,res,myscript_,mkey);
//    > so from there we can get onchange functions using vars.app.service (see  wrapgen(session,convovars))

// - from msg handlebars functions
//    ................. 

// - from conversations ( matcher )
//      this._vcontroller.fwCb this._vcontroller.fwCbservice



// to do sume services that call fwHelpers.rest adding some var from fw vars ......
// for example in this level of astraction , we can add here support for db mapping using model directive data or using a dedicated schema mapping 


/* old staff :
      let httpService;
      service['restServ']=httpService= httpFarm(fwHelpers);// general db/fs query with recover of where field clause if found in excel.......
      // service['httpService']=httpService= httpFarm(fwHelpers);// general db/fs query 
  

  
      / * >>>>>>>>>>>>>   TODO  : 062020 ADD Here or directly in fwbase ??   
      fwCb.ask.dynMatcher=function(tomatch,entity,excel){//  excel ? needed as param ??????
          //called in  /// GHTR  see in conversation.js call param definition 
          // this._vcontroller.fwCb.askS[matcher](tomatch,entity,step.values.excel);
          
          // ....... adapt para , add some excel ? needed as param ??????
          return //// return httpService()  ; // make avaible this matcher as directve matcher to clall  if specified in macro.matcher='dynMatcher';
      }*/

// plugin mng :

this.plugins=[];
this._deps=[];

  }
      // add plugin function to constructor prototypes 
sFact.prototype.addPluginExtension= function(name, extension) {
        
          // debug('Plugin extension added: controller.' + name);
          
          this.plugins[name] = extension;
      };
    
sFact.prototype.addDep= function(name) {
        debug(`Waiting for ${name}`);
        this._deps[name] = false;
    }

    sFact.prototype.completeDep= function(name) {
        debug(`${name} ready`);
        this._deps[name] = true;
        for (let key in this._deps) {
            if (this._deps[key] === false) {
                return false;
            }
        }
        // everything is done!
        this.signalBootComplete();
        return true;
    };

    sFact.prototype.signalBootComplete= function() {
        this.booted = true;
        for (let h = 0; h < this._bootCompleteHandlers.length; h++) {
            let handler = this._bootCompleteHandlers[h];
            handler.call(this);
        }
    };
//console.log('sfact builder done');
    




function cfg(db_,http_){// not used
  http=http_;db=db_;

}

module.exports ={cfg,init};