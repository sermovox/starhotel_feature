const { NlpManager } = require('node-nlp');// npm install node-nlp
let postRinfo;
let manager;
const aiRestInt=false,//
debug=false;
let rest,qea;
const oneduckInstOnly=true;// duck can have 1 time or one time interval each turn
//const isodate=true;
const isodate=false;
let isoRegEx;
if(isodate)
  // see https://www.regextester.com/112232
  // const isoRegEx=/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(((-|\+)(\d{2}):(\d{2})|Z)?)/i
 /// isoRegEx=/\s(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\s/i; // just date time in ec , no timezone
  isoRegEx=/\s((\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2}))?)\s/i;// 'ciao pippo oo 2012-01-01T17:52:27 ok' or 'ciao pippo oo 2012-01-01 ok '

// interface 
// cfg agents to know what end point will use , ???
agents={duck:'duckling',
        nlpjs:'nlpjs',
        witai:'witai'
},


services={};// see ARESTJJ

/* MNG SUMMARY 
when using matchers we set  url=service://plugins.witai?v=20201025, or =service://plugins.nlpai.datematch, in condition macro   
- so the matcher (/helper)  ( ex dynMatch()) can call the right interface according to its type :
    - interface connected to a specific rest endpoint :  service:plugins.wita 
        or 
    - interface ( ex nlpai) that can have many implementation to many  end points (datematch.. ) : service.plugins.nlpai.datematch) 
    
    the interface will serve the calling matcher requirements :
      - the form param : form={term,qs,,,},
          and rows in general result format :
        {reason:'runned'/'err',rows}

        rows can be formatted in 2 very similar format :
        - complex entity , required by ent type matcher

          ......   
          so the schema is {(major entity show field:) name/key/value,descr,,, + bl entity eventually inflated ( comprese le  where if any )}
        - intent , required by int type matcher
        ........ see below example 
         so the schema is {intent=major_entity, (show fields:) name/key/value,descr,,, ,entities:[{bl entity1 (show fields) eventually inflated ( comprese le  where if any )},,,,]} 

        >>> they are the same but the major entity is the intent and in intent the bl entities are put in entities array , in entity flattened on the major row !!!!




- that service is here config to perform an action calling a service end point using params passed in .init

*/


module.exports=// copy of db part of  refImplementation 

// todo : give ref that in fwHelpers were found in closure !! : db, rest ....

  function (rest_,qea_) {//  nlpai interface , from a std param do call to specific ai service according to url qs  ?agent=order Url:'http://192.168.1.15:8000/parse'
                          // nb  rest_ is the (rest.js).jrest  , so     jrest:function(url,method,data,head, urlenc,qs){// data ={prop1:value1,,,}  , the js plain 1 level obj (js map)
                          //                                                                                            //  qs, urlenc  are post only param :    if urlenc = true send a    x-www-form-urlencoded body (got from qs or coding  data obj )

// >>>>>>   MANAGEMENT SUMMARY 
// THIS INTERFACE FACTORY ( named ai)  :
// WILL provide internal service://plugins...endPoints(intparam) IMPLEMENTing  the ai interface to ext services 
// the ai.x interface is specific to the ImplementingFactory tyed to a utilizator, but with a similar  format  defined : 
// - intparam = form= {entities,term,+ specific utilizatorparam} ( entities={} is the wheres conditions on which ( the major entities associated to)  the intent depends)
//              ex : in a future  ImplementingFactory='db' (used by complex entity matcher) could be : form={entity,term,wheres,meta,whMmeta}
//              in this 'ai interface we implement ai intent resolver interface ('witai')or similar (see 'duck')

// - returns = {reason:'runned'/'err',
//              rows:
//                    - a obj required by the service utilizator ( better of a same 'type' !)  
//                    - [obj1,obj2,,,,]                     
//              };

// here in this 'ai' interface all ends point returns similar format :
//                  - complex std entity used by 'ent' type matcher, 
//                    or 
//                   - std intent  used by 'int' type matcher ( intent and qea matcher)


  // calling  :
  //     - nlpai=require('./nat/nlpai')(jrest,qea)
  //            .init(active={int1,int2,,,}={aIntxx:{url:'http://servprovEP'},,,,});// in matcher macro url= service://plugins.ai.duck.datetime?qs
  //          ...
  //    - service.addPluginExtension('ai', nlpai);// interface ai , with many ( similar) interface : 

  // we register services  with same interface (ai) available as endPoint with :
  //  - service://plugins.ai.aEndPointxx.run
  //        for example i can assign that service  in macro using :  url=service://plugins.ai.aEndPointxx.run
  //    where endpoint aEndPointxx=aIntxx.theEPoint: is created (implements the interface )  by a ImplementingFactory aIntxx ( here provided)
  //     that will interface the external rest service provider available at url='http://servprovEP' (in active param) with its specific interface
  //          the interface can also call internal module that is injected here (ex qea) 
  //      interfaces can be called by utilizer ( mainly convo matcher/helper) that are compatible  ( interfaces that meet utilizer requirements)

  // ex :     nlpai=require('./nat/nlpai')(jrest).init({nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse'}});


    rest = rest_;qea=qea_;// rest and qea module are  injected 
    postRinfo= require('./simplyinfoingAiaxCtl.js')(rest);// inject rest in it

// init({nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse'}})

    return {// ARESTJJ: returns a obj with only a field init:  {init:function(){}}= {init(){}}  init will return services configured obj
      init(active) {//init(active={nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse',qea:{url:extqea} })// interfaces : nlpai,duck.witai(all intent resolver services),qea(all qea services)
        // returns services[][] so i can register services as service plugin (see bot.js :  service.addPluginExtension('ai', nlpai); )
        // so in macro  can call url=service://plugins.ai.datetime.run , sn='datetime' is one service name that this masterfactory   provided according factory associated/registered to  config name ep1=duck (facrory can be provided by caller of a config obj)
        //  passed in active (with its params x the factory)
        //  this factory will set x each config (duck,,,) some service (datetme )that we configure here according to the factory for the config   ep1=duck   endpoint interface named ep1='duck',,,, to what is here config using param passed in active={}
      let srvNam;

        for (ep in active) { // register endpoint :
          if (ep == 'nlpjs') {// duck is the name of the following factory with its associated params 

            // call factory 'nlpjs' , implementing the interface and register the implementation as endpoint  'nlpjs.datetime' 
            srvNam = 'datetime';// the service provided by this master factory nb in matcher macro we set url=service://plugins.ai.nlpjs.datetime?qs
           services[ep] ={};
           services[ep] [srvNam]=nlpjs(active[ep]);//  plugins.ai=services so call  /  plugins.ai.nlpjs.datetime

           // other endpoint srvNam = 'datetime_from_xy';.......

          } else if (ep == 'duck') {
            // call factory 'duck' , implementing the interface and register the implementation as endpoint  'duck.datetime' 
            srvNam = 'datetime';// the service provided by this master factory nb in matcher macro we set url=service://plugins.ai.duck.datetime?....

           services[ep] ={};
           services[ep][srvNam]=duck(active[ep]);// register the implemented endpoint  plugins.ai=services so call  /  plugins.ai.nlpjs.datetime

          } else if (ep == 'witai') {// witai means general interface to ai intent resolver agent , choosing witai format as std 
            // todo ( this will  substitutes intmatch witai case )
            // ...................
          } else if (ep == 'bookApp') {//book end point , al posto di un app post , portare li appena possibile perche ho tutte le var e session disponibili 

            srvNam = 'aiaxpost';// the service provided by this master factory nb in matcher macro we set url=service://plugins.ai.bookApp.aiaxpost?uri=simplybooking . nb qs is inserted on form param by run_jrest
            services[ep] ={};// an obj with 1 func (srvNam) , got from a  factory :
            services[ep] [srvNam]=//  called with form param will returns   {reason:'runned',rows:intent/entity/query} depending by the calling matcher type 

            (function(params){// factory FFDA lauched on init data (active[ep])
            
                 // returns the function obtained by  another factory ( seem useless complication)
                 return   (function(params){// the factory closure, returns mf  , params (active[ep]) are set  in closure 
                    let mf=
                  async function (form){// the service function :  called with form param will returns   {reason:'runned',rows:intent/entity/query} depending by the calling matcher type 
                    let res;
                    // uri coming from qs ( emulate a post/aiax controller selection ):
                    //   url='service://plugins.ai.bookApp.aiaxpost?uri='simplybooking';
                  let {entity,term,wheres,wheresInst,vars,qs}=form; // temporary : here a controller (post) function to be put in app. so as exception use here status ( vars and session )
                  let uri=qs.uri;
                  //natural internal end point is qea
          
                      // note:  dtermis an object, and when converted to a string it will
              // end with a linefeed.  so we (rather crudely) account for that  
              // with toString() and then trim() 
          
              let text;//term.toString().trim() ;
              text=term;
             console.log("you entered: [" + text + "]")



             let postR= require('./simplybookingAiaxCtl.js');
          ///*    
                   // let wheres=null;

                    // temporary : here a controller (post) function to be put in app. and called with a macrodirective : url='service://app/simplybooking'  or url='service://app?uri=simplybooking',
                    //              so as exception use here status ( vars and session )
                      // simulate a post dispaching to controller :
                      if(uri=='simplybooking')
                    {
                     //  var answ = bookctl.post(text, vars,wheres);// the post controller of uri serving a complex medel rows query 
                     // pass rest in param or bind as context 
                      let answ ;//        
                      answ= await postR.simplybooking(vars,wheresInst,wheres,qs,rest)// wheres={mod_date_des:thematchingvalueofduck_datetime} or wheresInst={mod_date_des:the matched entity item as instance}
                                                                                              // can we have instance ={value,patt,descr.date,time }  so get easyle date and time !!!? 
                                                                                              // probably just modify wheres match recovery , take full instance not just the item name value !!!!
                                                                                              //        or simply the model itself !!!  , >>> so pass wheresInst , or both ?
                                                                                              // NBNB this service id temporarely doing a express post controller job ( move to app fast !! )
                                                                                              // so we pass vars, to get the session, url, to get the post ctl , and also :
                                                                                              // form.qs.book_res_child.curStatus=matches.entity.param instead to use cooky to get the multi turn query status/session
                                  // now manage the reject call
                                .catch((err) => { console.error(' the simplybook ctl rejected with error: ',err); });//   or  .catch(console.error);
                         if(qs.curStatus&&qs.curStatus.ctl&&qs.curStatus.ctl.f)       console.error(' debug: the simplybook ctl leave ctl.f '); 

                      if (answ == null) {
                          console.log('no answer found ');
                        //  bot.say('Sorry, I\'m not sure what you mean');
                        return {reason:'runned',rows:null};
                      }
                      else {
                        // answ={chroot:'thechtoroote/action',query:[{value:datetime,date,time,,},,,]} / std with inflated details of main ent
                          console.log('answer found ', answ);

                        // ????? 
                        //let intent=new Intent(answ,wheres);// build intent (2 intents,one best intent and the second chance) with format x the caller ( int matcher, witai intent format + // role can pe put as wheref if is in wheres ?
                        // old :let qmodel={rows:answ.query,objMod:true};
                        let qmodel=answ.query;
                       if(qmodel){ qmodel.complete=answ.chroot;// child param to navigate the query, 2 type of query : intradays slots and in day slot 
                        // NBNBNB  this is intented as query ctl aiax response so a complexx transaction not only a simle query , so each transaction has its navigation result child dialog and model with group context !!!!
                       // so the aiax ctl get the user preference , then depending on situation of query result wereturn a result indicating in the context (group) also the page/child that can diaplay the query result 
                       // , intraday slot 
                       // days slots 
                        return {reason:'runned',rows:qmodel};
                       }else  return {reason:'runned',rows:null};
                      }
                    } else if(uri=='book'){ 
                      let answ ;// 
                      // answ= await postR.book(vars,slot,rest)// wheres={mod_date_des:thematchingvalueofduck_datetime} or wheresInst={mod_date_des:the matched entity item as instance}
                      answ= await postR.book(vars,wheresInst,wheres,qs,rest)// wheres={mod_date_des:thematchingvalueofduck_datetime} or wheresInst={mod_date_des:the matched entity item as instance}
                                                                                              // can we have instance ={value,patt,descr.date,time }  so get easyle date and time !!!? 
                                                                                              // probably just modify wheres match recovery , take full instance not just the item name value !!!!
                                                                                              //        or simply the model itself !!!  , >>> so pass wheresInst , or both ?
                                  // now manage the reject call
                                .catch((err) => { console.error(' the simplybook ctl rejected with error: ',err); });//   or  .catch(console.error);
                      if (answ == null) {
                                  console.log('no answer found  on book ');
                                //  bot.say('Sorry, I\'m not sure what you mean');
                                return {reason:'runned',rows:null};
                              }
                              else {
                                // answ={chroot:'thechtoroote/action',query:[{value:datetime,date,time,,},,,]} / std with inflated details of main ent
                                  console.log('answer found on book  ', answ);
        
                                // ????? 
                                //let intent=new Intent(answ,wheres);// build intent (2 intents,one best intent and the second chance) with format x the caller ( int matcher, witai intent format + // role can pe put as wheref if is in wheres ?
                  
                                // let qmodel={rows:answ.result,objMod:true}; rows='booked'
                                let qmodel={rows:[answ.query.instance],objMod:true};//OLD : {rows:[{value:answ.result}],objMod:true}; // rows={value:'booked',descr:'booked',blfields.....  ,objMod}

                                return {reason:'runned',rows:qmodel};
                  
                              }

                    }else return {reason:'ctlnotfound',rows:null};
          
              }
              return mf;})(params);

            })(active[ep]);
          } else if (ep == 'infoApp') {//book end point , al posto di un app post , portare li appena possibile perche ho tutte le var e session disponibili 

            srvNam = 'aiaxpost';// the service provided by this master factory nb in matcher macro we set url=service://plugins.ai.bookApp.aiaxpost?uri=simplybooking . nb qs is inserted on form param by run_jrest
            services[ep] ={};// an obj with 1 func (srvNam) , got from a  factory :
            services[ep] [srvNam]=//  called with form param will returns   {reason:'runned',rows:intent/entity/query} depending by the calling matcher type 

            (function(params){// factory FFDA lauched on init data (active[ep])
            
                 // returns the function obtained by  another factory ( seem useless complication)
                 return   (function(params){// the factory closure, returns mf  , params (active[ep]) are set  in closure 
                    let mf=
                  async function (form){// the service function :  called with form param will returns   {reason:'runned',rows:intent/entity/query} depending by the calling matcher type 
                    let res;
                    // uri coming from qs ( emulate a post/aiax controller selection ):
                    //   url='service://plugins.ai.bookApp.aiaxpost?uri='simplybooking';
                  let {entity,term,wheres,wheresInst,vars,qs}=form; // temporary : here a controller (post) function to be put in app. so as exception use here status ( vars and session )
                  let uri=qs.uri;
                  //natural internal end point is qea
          
                      // note:  dtermis an object, and when converted to a string it will
              // end with a linefeed.  so we (rather crudely) account for that  
              // with toString() and then trim() 
          
              let text;//term.toString().trim() ;
              text=term;
             console.log("you entered: [" + text + "]")



         //   let postRinfo= require('./simplyinfoingAiaxCtl.js')();
          ///*    
                   // let wheres=null;

                    // temporary : here a controller (post) function to be put in app. and called with a macrodirective : url='service://app/simplybooking'  or url='service://app?uri=simplybooking',
                    //              so as exception use here status ( vars and session )
                      // simulate a post dispaching to controller :
                      if(uri=='simplyinfo')
                    {
                     //  var answ = bookctl.post(text, vars,wheres);// the post controller of uri serving a complex medel rows query 
                     // pass rest in param or bind as context 
                      let answ ;
                      answ= await postRinfo.simplyinfoing(vars,wheresInst,wheres,qs,rest)// wheres={mod_date_des:thematchingvalueofduck_datetime} or wheresInst={mod_date_des:the matched entity item as instance}
                                                                                              // can we have instance ={value,patt,descr.date,time }  so get easyle date and time !!!? 
                                                                                              // probably just modify wheres match recovery , take full instance not just the item name value !!!!
                                                                                              //        or simply the model itself !!!  , >>> so pass wheresInst , or both ?
                                                                                              // NBNB this service id temporarely doing a express post controller job ( move to app fast !! )
                                                                                              // so we pass vars, to get the session, url, to get the post ctl , and also :
                                                                                              // form.qs.book_res_child.curStatus=matches.entity.param instead to use cooky to get the multi turn query status/session
                                  // now manage the reject call
                                .catch((err) => { console.error(' the simplyinfo ctl rejected with error: ',err); });//   or  .catch(console.error);


                      if (answ == null) {
                          console.log('no answer found ');
                        //  bot.say('Sorry, I\'m not sure what you mean');
                        return {reason:'runned',rows:null};
                      }
                      else {
                        // answ={chroot:'thechtoroote/action',query:[{value:datetime,date,time,,},,,]} / std with inflated details of main ent
                          console.log('answer found ', answ);

                        // ????? 
                        //let intent=new Intent(answ,wheres);// build intent (2 intents,one best intent and the second chance) with format x the caller ( int matcher, witai intent format + // role can pe put as wheref if is in wheres ?
                        // old :let qmodel={rows:answ.query,objMod:true};
                        let qmodel=answ.query;
                       if(qmodel){ qmodel.complete=answ.chroot;// child param to navigate the query, 2 type of query : intradays slots and in day slot 
                        // NBNBNB  this is intented as query ctl aiax response so a complexx transaction not only a simle query , so each transaction has its navigation result child dialog and model with group context !!!!
                       // so the aiax ctl get the user preference , then depending on situation of query result wereturn a result indicating in the context (group) also the page/child that can diaplay the query result 
                       // , intraday slot 
                       // days slots 
                        return {reason:'runned',rows:qmodel};
                       }else  return {reason:'runned',rows:null};
                      }

                    }else return {reason:'ctlnotfound',rows:null};
          
              }
              return mf;})(params);

            })(active[ep]);
            
          }else if (ep == 'qea') {// very similar interface to witai,  but specilized to interface qea rest end point 
            srvNam = 'natural';// the service provided by this master factory nb in matcher macro we set url=service://plugins.ai.nlpjs.datetime?qs
            services[ep] ={};// an obj with 1 func (srvNam) , got from a natural factory : natural(active[ep]) using registered init param x the endpoint (active[ep]) 
            services[ep] [srvNam]=natural(active[ep]);//  plugins.ai=services so call  with : macro directive  "url":"service://plugins.ai.qea.natural
          }

        }// end register endpoint :
        return services;
      }
    };
  }// end rest_

  let natural=function(params){// a func factory, after a test get the func by a internal factory 

    if(qea)
      return  (
        function(params){// the closure , params are in closure 
          let mf=
        async function (form){// the service function 
          let res;

        let {entity,term,wheres}=form;

        //natural internal end point is qea

            // note:  dtermis an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 

    let text;//term.toString().trim() ;
    text=term;
   console.log("you entered: [" + text + "]");
///*    
         // let wheres=null;
            var answ = qea.answer1(text, wheres);// consider run a fts with where as alternative or run a on line fast lighter classification then a deeper classification to refine after
            if (answ == null) {
                console.log('no answer found ');
              //  bot.say('Sorry, I\'m not sure what you mean');
              return {reason:'runned',rows:null};
            }
            else {
                console.log('answer found ', answ);
                // see in intClass.handleMessage1() :
              // answ =return= {data:trainingData,intent:interpretation.guess,intentclass:trainingData[interpretation.guess],answer:trainingData[interpretation.guess].answer,interpretation,score:interpretation.score,
        //intent2:interpretation.second,score2:interpretation.score2,discr:interpretation.discr}// in case we want to discriminate / refine on wheres not matched yet 


              // no run_jrest() call so 
              let intent=new Intent(answ,wheres);// build intent (2 intents,one best intent and the second chance) with format x the caller ( int matcher, witai intent format + // role can pe put as wheref if is in wheres ?

              
              if(intent)intent.objMod=true;// mark std format 
              return {reason:'runned',rows:intent};// rows stands for a value to return , if objMod we are sure has the format the calling matchers requires 

            }

        const ext_qea=params.url;// future implem or other ext end point 

          /* template to connect a ext http qea service : 
          let result = await  rest(params.url,'POST',{locale:'it_IT',text:term},null, true,null) // no extra header,true:send urlencoded (calc from map obj data {locale:'it_IT',text:term}, no qs)
          .catch((err) => { console.error(' REST got ERROR : ',err); }); 
  
          console.log('duck service , datematch got :',JSON.stringify(result, null, 2));
  
            let o;
            if (result&&typeof result === 'string') {
            // ........parse       "resolution": {            "value": "2019-12-12T09:00:00.000+00:00",
            try {
              o = JSON.parse(result);
  
          }
          catch (e) { o=null;}
  
          // return {reason:'runned',rows:res}; with res set by Entity constructor basing from : 
          //      get the result o={item1,,,} , look at itemx with dim='time' so res={value:itemx.value.value} 
           if(o) o.forEach(el => {
              if(el.dim=='time'&&el.value&&el.value.value){    // can be many ? no should find interval
                let mainEnt={value:el.value.value};// main row
                res=new Entity(entity,el.dim,mainEnt);// main ent the date time ent 
                // but this is a multi entity ( a intent quasi )so treat like complex entity : a main ent + bl of other entity 
                let t=res.rows.value.indexOf('T'),date,time;
                if(t>0){res.rows.date=res.rows.value.substring(0,t);res.rows.time=res.rows.value.substring(t+1,t+6);}
              }
            });

            */




          // if ()
          // if(result&&result.entities&&result.entities[0]&&result.entities[0].resolution&&result.entities[0].resolution.value)
          if(res)
           return {reason:'runned',rows:res};//{reason:'runned',rows:result.entities[0].resolution.value==new Entity()=.....................};
          else return {reason:'runned',rows:null};

    }
    return mf;})(params);
  }

    let datematch= // this factory  function returns a Promise and do  use await  . so async function  OR function ? 
    function(manager){
    let mf=async function (form){// dynMatch interface : calls this.run_jrest(url,form,isGET); with form=let form={entity,term,wheres,meta,whMmeta};
                    // that, because of url set as matcher param url="url":"service://plugins.nlpai.datematch"
                    // calls let form = formObj || querystring.parse(qs); , so as form is not null tage just it , and
                    // so this func will be called with  form={entity,term,wheres,meta,whMmeta}={entity,term,null,null,null}

        let {entity,term}=form;
        //(async () => {
          //manager = new NlpManager({ ner: { ducklingUrl: 'https://ducklinghost/parse' } });
          // manager.addLanguage(['it']);
    
          //const result = await manager.process('twenty five euros');
          // console.log('nlp.ai : ',JSON.stringify(result, null, 2));
        //})();
        let result = await manager.process(term);
        console.log('nlp.ai , datematch got :',JSON.stringify(result, null, 2));

        if(result){


          // ********** TODO   TODO    TODO 


        let rows=result;// ........parse       "resolution": {            "value": "2019-12-12T09:00:00.000+00:00",
        // if ()
        if(result&&result.entities&&result.entities[0]&&result.entities[0].resolution&&result.entities[0].resolution.value)
         return {reason:'runned',rows:result.entities[0].resolution.value};
        
        else return {reason:'runned',rows:null};


        // other nlp func ....
    }else return {reason:'err',rows:null};


    /*nb 
    const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    '12/12/2019 at 9am'
  );
  console.log(JSON.stringify(result, null, 2));
})();

The answer will be:

{
  "utterance": "12/12/2019 at 9am",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 0,
      "end": 16,
      "len": 17,
      "accuracy": 0.95,
      "sourceText": "12/12/2019 at 9am",
      "utteranceText": "12/12/2019 at 9am",
      "entity": "date",
      "resolution": {
        "value": "2019-12-12T09:00:00.000+00:00",
        "grain": "hour",
        "values": [
          {
            "value": "2019-12-12T09:00:00.000+00:00",
            "grain": "hour",
            "type": "value"
          }
        ]
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "12/12/2019 at 9am",
      "start": 0,
      "value": {
        "values": [
          {
            "value": "2019-12-12T09:00:00.000+00:00",
            "grain": "hour",
            "type": "value"
          }
        ],
        "value": "2019-12-12T09:00:00.000+00:00",
        "grain": "hour",
        "type": "value"
      },
      "end": 17,
      "dim": "time",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 5,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
    */

}
return mf;}


let nlpjs=function(params){
let manager = new NlpManager({
  ner: {
    ducklingUrl: params.url//       'https://ducklinghost/parse'
  }
});// or new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
manager.addLanguage(['it']);

/* 2 template :
nlpjs={manager,datetime}  call  nlpjs.datetime , param is private 
  or 
nlpjs={datetime=fact(manager)} dove fact ritorna funzione che ha in closure param, call nlpjs.datetime
*/
// services[ep] = { manager }; services[ep][srvNam] = datematch;//  plugins.ai=services so call 
// or 
return datematch(manager);
}

let duck=function(params){// a func factory, after a test get the func by a internal factory 

// >>>  the ai.duck interface is specific to the ImplementingFactory tyed to the  utilizator: 
//    "matcher":"dynMatch"  , helper of  convo Entity matcher type mT='Ent';
/* INTERFACE 
// - intparam = form= {entity,term}

// - returns = {reason:'runned'/'err',
//              rows:


                        {// like a complex entity with bl related (inflated) entity 
                          matched:'match' or null 
                          match:   itemname=row.value ,// (???or {ent:itemname}) 
                          vmatch:,

                          rows:row_=
                                            { // std format : 
                                              value:ducklin_datetime_string ,// in Entity constructor : ducklin_datetime_string= itemx.value.value where itemx is the rest tesult item with itemx.dim='time'

                                             //  + bl : 
                                              date=res.rows.value.substring(0,t)
                                              time=res.rows.value.substring(t+1,t+6);
                                            },
                          // witai like : 
                          type: 	// witai dim + ...  es : type=number,datetime-val/interval,location,customentitynameAssigned( the name referas to a entity described on staticmodel or a db schema)
                          name:'ent',/// needed?

                        }
*/


///            };


  /* 2 template :
  nlpjs={manager,datetime}  call  nlpjs.datetime , param is private 
    or 
  nlpjs={datetime=fact(manager)} dove fact ritorna funzione che ha in closure param, call nlpjs.datetime
  */
  // services[ep] = { manager }; services[ep][srvNam] = datematch;//  plugins.ai=services so call 
  // or 
  return   datematch2(params);// returns the result of datematch2 factory that configure my endpoints with with param=params
  }

  datematch3= // duplicate , just as code reminder . 
              // this is the factory of a async function , so returning a Promise and do  use await  . so async function  OR function ? 

  function(params){
    let mf=
  async function (form){
    // dynMatch interface : calls this.run_jrest(url,form,isGET); with form=let form={entity,term,wheres,meta,whMmeta};
                  // that, because of url set as matcher param url="url":"service://plugins.nlpai.datematch"
                  // calls let form = formObj || querystring.parse(qs); , so as form is not null tage just it , and
                  // so this func will be called with  form={entity,term,wheres,meta,whMmeta}={entity,term,null,null,null}
    // returns : {reason:'runned'/'err',rows:result.entities[0].resolution.value==new Entity()=.....................};


      let {entity,term}=form;

      // curl -XPOST http://192.168.1.15:8000/parse --data 'locale=it_IT&text=14 pezzi per domani'
/* in firefox see json : 
[{"body":"domani dalle 7 di pomeriggio alle 9","start":12,"value":{"values":[{"to":{"value":"2020-10-31T10:00:00.000-07:00","grain":"hour"},"from":{"value":"2020-10-31T00:00:00.000-07:00","grain":"hour"},"type":"interval"},{"value":"2020-10-31T19:00:00.000-07:00","grain":"hour","type":"value"}],"to":{"value":"2020-10-31T10:00:00.000-07:00","grain":"hour"},"from":{"value":"2020-10-31T00:00:00.000-07:00","grain":"hour"},"type":"interval"},"end":47,"dim":"time","latent":false},
{"body":"2","start":12,"value":{"value":2,"type":"value"},"end":13,"dim":"number","latent":false},{"body":"domani alle 7 e trenta di pomeriggio","start":20,"value":{"values":[{"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"}],"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"},"end":56,"dim":"time","latent":false},
{"body":"14","start":0,"value":{"value":14,"type":"value"},"end":2,"dim":"number","latent":false},{"body":"domani alle 18","start":13,"value":{"values":[{"value":"2020-10-31T18:00:00.000-07:00","grain":"hour","type":"value"}],"value":"2020-10-31T18:00:00.000-07:00","grain":"hour","type":"value"},"end":27,"dim":"time","latent":false}]

also :

     DGTG  : 

[
{"body":"domani pomeriggio","start":0,"value":{
                                              // not used:
                                            "values":[{ "to":{"value":"2020-12-28T19:00:00.000-08:00","grain":"hour"},
                                                        "from":{"value":"2020-12-28T12:00:00.000-08:00","grain":"hour"},
                                                        "type":"interval"}
                                                      ],
                                            "to":{"value":"2020-12-28T19:00:00.000-08:00","grain":"hour"},
                                            "from":{"value":"2020-12-28T12:00:00.000-08:00","grain":"hour"},
                                            "type":"interval"
                                            },
                
                "end":17,"dim":"time","latent":false}
,
{"body":"domani alle 8 e 32","start":0,"value":{
                                              // not used :
                                            "values":[{"value":"2020-12-28T08:32:00.000-08:00","grain":"minute","type":"value"}
                                                      ],
                                              
                                            "value":"2020-12-28T08:32:00.000-08:00",
                                            "grain":"minute",
                                            "type":"value"
                                            },
                "end":18,"dim":"time","latent":false}
]

so main json result template is :

datetime="2020-10-31T19:30:00.000-07:00"

result =[// conf=  ????
{start:3,end:8,dim:"time",value:{type='interval',to:{value:datetime,grain},from:{value:datetime,grain}}},   >> so row:{value:datetime,dim:'time',type:'interval',date:datefromvaue,time:timefromvalue,tovalie,todate,totime:}
{start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:datetime}},                               >> so row:{value:datetime,dim:'time',type:'value',date:datefromvaue,time:timefromvalue,tovalie,todate,totime:}
{start:3,end:8,dim:"number",value:{type:"value",value:2}},                                                  >> so row:{value:13,dim:'number',type:'value'}
]
*/
    
     //let url=http://192.168.1.15:8000/parse
      let result ;
     if(!debug) // debug
     result= await  rest(params.url,'POST',{locale:'it_IT',text:term},null, true,null) // no extra header,true:send urlencoded (calc from map obj data {locale:'it_IT',text:term}, no qs)
      .catch((err) => { console.error(' REST got ERROR : ',err,',  so set test datetime');
     // dont work , too late :  result= JSON.stringify([{start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:'2021-01-14T09:00:00.000+00:00'}}]);
      //'[{"body":"2","start":12,"value":{"value":2,"type":"value"},"end":13,"dim":"number","latent":false},{"body":"domani alle 7 e trenta di pomeriggio","start":20,"value":{"values":[{"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"}],"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"},"end":56,"dim":"time","latent":false},

    }); 
    result= result||JSON.stringify([{start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:'2021-01-18T09:00:00.000+00:00',values:{},type:'value'}}]);


      console.log('duck service , on text: ',term,' datematch got :',result,', json: ',JSON.stringify(result, null, 2));// see DGTG for expected format 

        let o,res;
        if (result&&typeof result === 'string') {
        // ........parse       "resolution": {            "value": "2019-12-12T09:00:00.000+00:00",
        try {
          o = JSON.parse(result);

      }
      catch (e) { o=null;}// works ?

      console.log('duck service , on text: ',term,' datematch got: ',o);// see DGTG for expected format 

      // return {reason:'runned',rows:res}; with res set by Entity constructor basing from : 
      //      get the result o={item1,,,} , look at itemx with dim='time' so res={value:itemx.value.value} 
       if(o) o.forEach(el => {// from duck extract only time info (TODO in case needed also numbers info .....)
          if(el.dim=='time'&&el.value
          // &&el.value.value  also el.value.values
          &&el.value.values// = "2021-02-25T11:00:00.000-08:00"
          ){    // can be many ? no should find interval
            let mainEnt={value:
              null// el.value.value
            };// main row

            res=new Entity(entity,el.dim,mainEnt,el.value);// main ent : the date time ent , e.dim='time'  ,  mainEnt : see DGTG . no number or other dmension .
            // but this is a multi entity ( a intent quasi )so treat like complex entity : a main ent + bl of other entity 

                          // 122020 >>>>>  this value is the entity obj but is more complete then std VAL expected format see Matcher_AdapterInterface.txt
                          // done  got entity for type value ( see above DGTG )
                          // to do   : define the entity found : Time or/e Interval
                          
            //  ????? keep localtime schift ??????????????????????????
            
            let t=res.rows.value.indexOf('T'),date,time;// res.rows.value= "2021-02-25T11:00:00.000-08:00"
            if(t>0){res.rows.date=res.rows.value.substring(0,t);res.rows.time=res.rows.value.substring(t+1,t+6);}
          }
        });
      // if ()
      // if(result&&result.entities&&result.entities[0]&&result.entities[0].resolution&&result.entities[0].resolution.value)
      if(res)
      {
        // res is better then std format ( see Matcher_AdapterInterface.txt ), so set objMod
        res.objMod=true;// better then std form expected by entity matcher type Ent
       return {reason:'runned',rows:res};//{reason:'runned',rows:result.entities[0].resolution.value==new Entity()=.....................};
      }
      else return {reason:'runned',rows:null};
      // other nlp func ....
  }else return {reason:'err',rows:null};
}
return mf;}

  datematch2= // this is the factory of a async function , so returning a Promise and do  use await  . so async function  OR function ? 

    function(params){
      let mf=
    async function (form){
      // dynMatch interface : calls this.run_jrest(url,form,isGET); with form=let form={entity,term,wheres,meta,whMmeta};
                    // that, because of url set as matcher param url="url":"service://plugins.nlpai.datematch"
                    // calls let form = formObj || querystring.parse(qs); , so as form is not null tage just it , and
                    // so this func will be called with  form={entity,term,wheres,meta,whMmeta}={entity,term,null,null,null}
      // returns : {reason:'runned'/'err',rows:result.entities[0].resolution.value==new Entity()=.....................};


        let {entity,term}=form;

        // curl -XPOST http://192.168.1.15:8000/parse --data 'locale=it_IT&text=14 pezzi per domani'
/* in firefox see json : 
[{"body":"domani dalle 7 di pomeriggio alle 9","start":12,"value":{"values":[{"to":{"value":"2020-10-31T10:00:00.000-07:00","grain":"hour"},"from":{"value":"2020-10-31T00:00:00.000-07:00","grain":"hour"},"type":"interval"},{"value":"2020-10-31T19:00:00.000-07:00","grain":"hour","type":"value"}],"to":{"value":"2020-10-31T10:00:00.000-07:00","grain":"hour"},"from":{"value":"2020-10-31T00:00:00.000-07:00","grain":"hour"},"type":"interval"},"end":47,"dim":"time","latent":false},
{"body":"2","start":12,"value":{"value":2,"type":"value"},"end":13,"dim":"number","latent":false},{"body":"domani alle 7 e trenta di pomeriggio","start":20,"value":{"values":[{"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"}],"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"},"end":56,"dim":"time","latent":false},
{"body":"14","start":0,"value":{"value":14,"type":"value"},"end":2,"dim":"number","latent":false},{"body":"domani alle 18","start":13,"value":{"values":[{"value":"2020-10-31T18:00:00.000-07:00","grain":"hour","type":"value"}],"value":"2020-10-31T18:00:00.000-07:00","grain":"hour","type":"value"},"end":27,"dim":"time","latent":false}]

also :

       DGTG  : 

[
{"body":"domani pomeriggio","start":0,"value":{
                                                // not used:
                                              "values":[{ "to":{"value":"2020-12-28T19:00:00.000-08:00","grain":"hour"},
                                                          "from":{"value":"2020-12-28T12:00:00.000-08:00","grain":"hour"},
                                                          "type":"interval"}
                                                        ],
                                              "to":{"value":"2020-12-28T19:00:00.000-08:00","grain":"hour"},
                                              "from":{"value":"2020-12-28T12:00:00.000-08:00","grain":"hour"},
                                              "type":"interval"
                                              },
                  
                  "end":17,"dim":"time","latent":false}
,
{"body":"domani alle 8 e 32","start":0,"value":{
                                                // not used :
                                              "values":[{"value":"2020-12-28T08:32:00.000-08:00","grain":"minute","type":"value"}
                                                        ],
                                                
                                              "value":"2020-12-28T08:32:00.000-08:00",
                                              "grain":"minute",
                                              "type":"value"
                                              },
                  "end":18,"dim":"time","latent":false}
]

so main json result template is :

datetime="2020-10-31T19:30:00.000-07:00"

result =[// conf=  ????
  {start:3,end:8,dim:"time",value:{type='interval',to:{value:datetime,grain},from:{value:datetime,grain}}},   >> so row:{value:datetime,dim:'time',type:'interval',date:datefromvaue,time:timefromvalue,tovalie,todate,totime:}
  {start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:datetime}},                               >> so row:{value:datetime,dim:'time',type:'value',date:datefromvaue,time:timefromvalue,tovalie,todate,totime:}
  {start:3,end:8,dim:"number",value:{type:"value",value:2}},                                                  >> so row:{value:13,dim:'number',type:'value'}
]
*/
      
       //let url=http://192.168.1.15:8000/parse
        let result,res ;

  const ti='time';
//  
        if(isodate){

          // regex match of single datetime 
          // see https://www.regextester.com/112232
          // const isoRegEx=/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(((-|\+)(\d{2}):(\d{2})|Z)?)/i

          // const isoRegEx=/\s(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\s/i // just date time in ec , no timezone , discover a single datetime 

          let isTim;// ' ciao  per il "2012-02-01T18:21:06" o il 2012-02-07 vorrei ....'
          try{
            let matres= tomatch.match(isoRegEx);// test='stay*\w*\s(\w*)' will return rematch=[],  in rematch[1] is the word after stay*
          }catch{
              console.error(' nlpai duck service interface: isoRegEx error ');}

          if(matres&&matres.length>2)isTim=matres[1].substring(0,19);// no fuse, local
          if(isTim){

            if(isTim.length==10)res=res.substring(0,10)+'T00:00:00';
            console.log('res with ',res);
            
            let val_={type:"value",grain:"minute",value:isTim};// 'value' means single datetime
            res=new Entity(entity,'time',{value:null},val_,Ltime);// main ent : the date time ent , e.dim='time'  ,  mainEnt : see DGTG . no number or other dmension .
            // but this is a multi entity ( a intent quasi )so treat like complex entity : a main ent + bl of other entity 

            console.log('duck service , on text: ',term,' find a iso datetime string: ');// see DGTG for expected format 
          }else{

          }

        }

        if(!res){// didnt find a inline datetime , so run datetime server
          if(!debug) // debug
       result= await  rest(params.url,'POST',{locale:'it_IT',text:term},null, true,null) // no extra header,true:send urlencoded (calc from map obj data {locale:'it_IT',text:term}, no qs)
        .catch((err) => { console.error(' REST got ERROR : ',err,',  so set test datetime');
       // dont work , too late :  result= JSON.stringify([{start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:'2021-01-14T09:00:00.000+00:00'}}]);
        //'[{"body":"2","start":12,"value":{"value":2,"type":"value"},"end":13,"dim":"number","latent":false},{"body":"domani alle 7 e trenta di pomeriggio","start":20,"value":{"values":[{"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"}],"value":"2020-10-31T19:30:00.000-07:00","grain":"minute","type":"value"},"end":56,"dim":"time","latent":false},

      }); 
      result= result||JSON.stringify([{start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:'2021-01-18T09:00:00.000+00:00',values:{},type:'value'}}]);
  

        console.log('duck service , on text: ',term,' datematch got :',result,', json: ',JSON.stringify(result, null, 2));// see DGTG for expected format 

          let o;
          if (result&&typeof result === 'string') {
          // ........parse       "resolution": {            "value": "2019-12-12T09:00:00.000+00:00",
          try {
            o = JSON.parse(result);

        }
        catch (e) { o=null;}// works ?

        console.log('duck service , on text: ',term,' datematch got: ',o);// see DGTG for expected format 

        // return {reason:'runned',rows:res}; with res set by Entity constructor basing from : 
        //      get the result o={item1,,,} , look at itemx with dim='time' so res={value:itemx.value.value} 
        let tcount=0;
         if(o) o.forEach(el => {// from duck extract only time info (TODO in case needed also numbers info .....)
            if(el.dim==ti// ti='time'
              &&el.value
            // &&el.value.value  also el.value.values
            &&el.value.values// = "2021-02-25T11:00:00.000-08:00"
            ){    // can be many ? no should find interval
              let mainEnt={value:
                null// el.value.value
              };// main row
              res=new Entity(entity,ti,mainEnt,el.value,changeLtime);// main ent : the date time entity , e.dim='time'  ,  mainEnt : see DGTG . no number or other dmension .
              // but this is a multi entity ( a intent quasi )so treat like complex entity : a main ent + bl of other entity 

                            // 122020 >>>>>  this value is the entity obj but is more complete then std VAL expected format see Matcher_AdapterInterface.txt
                            // done  got entity for type value ( see above DGTG )
                            // to do   : define the entity found : Time or/e Interval
              //  ????? keep localtime schift ??????????????????????????
              tcount++;
            }
          });
        // if ()
        // if(result&&result.entities&&result.entities[0]&&result.entities[0].resolution&&result.entities[0].resolution.value)
          if(oneduckInstOnly&&tcount>1)res=null;//
          
        }else return {reason:'err',rows:null};}
        if(res)
        {
          let t=res.rows.value.indexOf('T'),date,time;// res.rows.value= "2021-02-25T11:00:00.000-08:00"
          if(t>0){res.rows.date=res.rows.value.substring(0,t);res.rows.time=res.rows.value.substring(t+1,t+6);}
          // res is better then std format ( see Matcher_AdapterInterface.txt ), so set objMod
          res.objMod=true;// better then std form expected by entity matcher type Ent
         return {reason:'runned',rows:res};//{reason:'runned',rows:result.entities[0].resolution.value==new Entity()=.....................};
        }
        else return {reason:'runned',rows:null};
        // other nlp func ....
        

  }
  return mf;}

function Intent(res, wheres) {// std intent wit.ai obj  see formatx.txt, is wheres needed ? or discr is enougth
  // + discr in intent and isDiscr in entity 
  // res = {data:trainingData,intent:interpretation.guess,intentclass:trainingData[interpretation.guess],answer:trainingData[interpretation.guess].answer,interpretation,score:interpretation.score,
  //intent2:interpretation.second,score2:interpretation.score2,discr:interpretation.discr}// in case we want to discriminate / refine on wheres not matched yet 
/*
    /* constructor returns this={
                                intents:[{ name: res.intent, confidence: res.score,entities },,,],
                                entities,
                                discr:res.discr,
                                cursor:{resModel: {disc0:{ 
                                                    patt: vv1,
                                                    vname: v1
                                                    },,,
                                                  }
                                      },
                                group:{ sel:{item:this.intents[0]},
                                        compl_ctx:{         // the model that is context to a thread to match the complete list of next turn qeaitem to chain 
                                            cursor:{rows:[{value:qeaitemname,patt},,]},
                                            resModel: {disc0:{ 
                                                                    patt: vv1,
                                                                    vname: v1
                                                              },,,
                                                     }
                                            },
                            
                             }*/

/* old : 
new Intents() returns (see format.txt):
		   {intents:[{name,confidence,
						entities,
						,
						
				          },,,
					]
			    	entities:{// the entities of intents[0]
						ent1:{name,value,role,type:'value',
				             	+ isDiscr,,,
				            }
				      ,,,,,},
				discr:[thebestentity2discriminateintents[0/1]],
				
				// now the context x selector thread (group is the context x template,
				// cursor is master list(in intent is really intents)+
				// selector runtime model:
				group.sel:{intents[0/1]},
				cursor:{// rows, // nb in intent model ( differently then query/param model ) rows is put in intents
					resModel:{disc0:{patt: v1,
            						vname: v1
            						},
						disc1:{patt: v2,
            						vname: v2
            						}
						}
			    		}
				}
*/
  /*
  curl  -H 'Authorization: Bearer 2FZVYQTXU5WPBT3ITYFLNFABFQTGDZNH'  'https://api.wit.ai/message?v=20201025&q=hy%20weather%20best%20prevision%20in%20pordenone%20at%207%20pm'
{"text":"hy weather best prevision in pordenone at 7 pm","intents":[{"id":"1471383782962006","name":"weather","confidence":1}],"entities":{"wit$datetime:datetime":
[{"id":"be331391-97c5-4a62-9e49-5d7b07a21a43","name":"wit$datetime","role":"datetime","start":39,"end":46,"body":"at 7 pm","confidence":0.9615,"entities":[],"type":"value","grain":"hour",
"value":"2020-11-12T19:00:00.000-08:00","values":[{"type":"value","grain":"hour","value":"2020-11-12T19:00:00.000-08:00"},{"type":"value","grain":"hour","value":"2020-11-13T19:00:00.000-08:00"},
{"type":"value","grain":"hour","value":"2020-11-14T19:00:00.000-08:00"}]}],"wit$location:location":[{"id":"e69e871e-9f66-4827-9c33-c6d79e5f7fa1","name":"wit$location","role":"location",
"start":29,"end":38,"body":"pordenone","confidence":0.9089,"entities":[],"resolved":{"values":[{"name":"Pordenone","domain":"locality","coords":{"lat":45.956890106201,"long":12.660510063171},
"timezone":"Europe\/Rome","external":{"geonames":"3170147","wikidata":"Q6606","wikipedia":"Pordenone"},"attributes":{}},{"name":"Pordenone","domain":"region","coords":
{"lat":46.101821899414,"long":12.690019607544},"timezone":"Europe\/Rome","external":{"geonames":"3170146"},"attributes":{}},{"name":"Pordenone","domain":"region",
"coords":{"lat":45.961711883545,"long":12.655320167542},"timezone":"Europe\/Rome","external":{"geonames":"6540112"},"attributes":{}}]},"type":"resolved"}]},"traits":{}}


vars.(ask)matches.aask.intent=witai_std

witai_std = {intents:[{name,confidence,
                            + discr,,,
                            }
                    ,,,]
          entities:{ent1:{name,value,role,type:'value',
                           + isDiscr,,,
                          }
                    ,,,,,}
          }

  */

  /* let name
   =res.intent,
   confidence
   =res.score,
   discr
   =res.discr,*/




  function fillE(res, ent) {// extract entities from a qea item (qea thought as intent in  wit.ai format like ) returns {entities,compl_ctx}
                            // build the complex model (compl_ctx.param,) as context of a resolver child with  rows/intents,cursor, group properties :
                            //    compl_ctx={param:{cursor,group,rows}};// a second (after entities , associated  child model ) child navigation  model to select completation after examined the qea entities 
                            //   group : contains ( when resolved) :
                            //    sel :  selected  item in rows and 
                            //    prompt : a prompt to select in rows/intents the sel item (in the child)
                            //   cursor : ( no  rows, are null,   ) containing the runtime model (resModel)to select one items in rows/intents in child
                            //  rows/intents : now just void to fill after


     // debug sistemare  : tiodo

    let entities = {},
    compl_ctx;// exactly a query/param model used in a thread to selected the name of next qea item to goon with the qea chain ( complete / multiturn qea ) 
    let cursor={resModel:{},medSyntL:[]},group={sel:{item:null}},//group={sel:{item:this.intents[0]}
    rows=[];
    compl_ctx={param:{cursor,group,rows}};//{cursor:{rows:[{value:qeaitemname,patt}]}};

    for (let e in ent) {// scan properties e in ent 

       // debub : tiodo
      if( e == 'link'// 'linkchild'
        ) {// build the complete selector
        // should be very like a param/query matcher that fills a model : matches.param={}  see fromatx,txt

/* BBCC : building the complex intent/query model thought as a context x process the query in a child ( info about items , selector model to choose a item , param x templates in child , param x child directives and flags used in condition $$$ e $$$$ )
remember  // res = {data:trainingData,intent:interpretation.guess,intentclass:trainingData[interpretation.guess],answer:trainingData[interpretation.guess].answer,interpretation,score:interpretation.score,


ipotesi di qea item (intent with entities=properties):
 quindi in un property metto :

	chapter/argomento: server connectivity 
	subChaptlevel:0-2
	linkchild='nameofqea1/nameofqea2'// if this qea is not lev 2 
	linkfather='nameofqea1/nameofqea2'// // if this qea is not lev 0
	promptlinktempl:'ora puo approfondire argomenti  $linkchild o piu in generale puoi fare riferimento all'agomento $linkfather '// std contex x template di  completamento ,
	menu:threadgoto,if no default mngment

  vname:''// x link 
  patt: keyword in vname x link match 

	categoria:hw/sw
	catg2:app/so/net
  help: ? operatore, manuale, test
  
  quindi il desiredE( the qea/intent/row to select) avra row con value=qeaname  patt=qeaname.patt vname=qeaname.vname descr=qeaname.answer ?

  cosi resModel["qeaname"]= {// we tie to intents[0], so when user match item  'disc1' storemat='disc1' (useless) but storeMId should be 0, so we match intents[0]. TO BE CHECKED 
            patt: row.patt,
            vname: row.vname
            };

spiego : 
	linkchild='nameofqea1/nameofqea2'
	linkfather='nameofqea1/nameofqea2'
  promptlink:'ora puo approfondire argomenti  $linkchild o piu in generale puoi fare riferimento all'argomento $linkfather  dicendo approfondisco argomentox'// std contex x template di  completamento ,
              022021 : quindi se l'utente vuole approfondire viene mandato in un th/child che  gestisce una altra richiesta (intent matcher )di qea come term + where o banalmente ottiene l'intent matcher gia risolto avendo passato il $linkchild/$linkfather ? 
	menu:threadgoto, route nameofthread that manage the request  ( a ask gathering the ok to goon calling a office to resolve the problem. if void the next ask father will ask if we can goon in managing the qea answere ( default menu) 
		the menu is a thread to manage the problem , when finished we ca retun to father to do the pending action got before the qea match  if any  , tipicamente chiedera se oltre al qea vuole fare altro ( default thread without qea part ) 
              022021 : cioe il menu e' circa un .complete che è in pratica un redirect al th che gestisce il completamento/approfondimento del selected item/qea ?
    vname:''// x link 
	chapter/argomento
	subChaptlevel:0-3
	categoria:hw/sw
	catg2:app/so/net
	help: ? operatore, manuale, test


*/

        if(ent[e]){// is a string 

          let childn=ent[e].split('/');
          for(let i=0;i<childn.length;i++){
            let row;
            if(res.data[childn[i]]){
              row={value:childn[i],patt:res.data[childn[i]].patt,descr:res.data[childn[i]].answer,
              vname:res.data[childn[i]].vname};// value is a vname ?? or just set value the key and use a bl vname !!
            rows.push(row);
            cursor.medSyntL.push(row.vname);
          cursor.resModel[row.value]= {// we tie to intents[0], so when user match item  'disc1' storemat='disc1' (useless) but storeMId should be 0, so we match intents[0]. TO BE CHECKED 
          patt: row.patt,
          vname: row.vname
          };}


        }
          // debub : tiodo
          group.prompt=res.intentclass.link;//promptlinktempl;

        }

      }else if (e != 'questions' && e != 'metadata') {// copy all  exluding some
       // if (e != 'answer')
         {
          let isDiscr;// a 'control' propery true if this entity ( a qea item) has different values betheen the 2 extracted qea items
          if (res.discr && res.discr.indexOf(e) > -1) isDiscr = true;// res.discr=[qeaitem.aprop1,,,,] a list of properties with different values in 2 qea item (intents)
                                                                      //  usually aprop1 is a meta property, the property e is item of res.discr, so can discriminate results to select one
           else isDiscr = false;
          entities[e] = { name: e, value: ent[e], role: 'n/d', type: 'value', isDiscr };

          /* PRIMER ON MODELCONTEXTxCHILD_Navigation-Selection .txt
            now we return the intent model to caller 
           remember :
              - generally a model xx is one of  the context of a Dialog (thread/child ),
              - if the model xx is a complex/query model , means that the model is a array of models , result of the query , and the Dialog usually need to work/navigate/inspect on them and 
                  eventually select one of them  using a very simple fw support directive if a dyn model are provided inside the xx model (inflacted in entities or as a separate obj .cursor.resModel ):
                  complex model rest query (that returns xx)  using its metadata can build dym model obj embeddeb on vars.matches.xx.intent/param.cursor.resModel
                   so that dyn model can be used by Dialog using the fw directive $$xx:>selectedmodel to select one item of xx (see format_.txt):
                    vars.matches.selectedmodel={ match: this.instance.name,
                                                instance:vars.matches.xx.intent/param.cursor.sel(.item)=vars.matches.xx.intent.intents[selectedindex]
                                                a) nothing the model to select is qeaitem..pattern so do a qea match on this pattern
                                                b) query.cursor.resModel={det1:{value:nameofqea1,patt:vname1=instance.aniflatterprop.completelist[1]},,,}
                                                }

           in case of multiturn x completamento del qea query il item selezionato (qea class/intent )e' un item qea in forma di model selectedmodel
                  tale model pero deve alimentare come context un dialogo DF (completeiterateqea) che deve selezionare un next qea (il complete/next) (ora il DF e il ask return sul father ma va fatto come thread nel child )
                  ora o il selectedmodel ha inside un  complex model (query) su cui fare la selezione il .resModel e quindi puo usare la directive $$yy:>somemod oppure devo fare query per ottenere le next qea su cui fare il selection
                  tuttavia in effetti il selection si potrebbe appoggiare su 
                  a)  un iterating qea on class/item.pattern piuttosto che come prima su .questions 
                      quindi il DF non occorre che usi un model dinamico per fare il selection ma usera un matcher qea tipo
                      $$mod_iterateqea:value-x
                      macro    matcher=qea....pattern  where_setlist=from_a_bl prop build by qea rest 
                          quindi estrae alcunr bl properties buildate dal rest qea 
                  b) banalmente il rest qea builda un query model aggiunto a selectedmodel , poi faro copia matches.query=selectedmodel.query  che poi matcho in DF con 
                                                $$query:>iterqea
                                                al match avro in name del qea da querare con matcher :
                                                macro    matcher=qea....item  term=tierqea.match

                  c) fa query con un po di param estratti dalle proprieta bl di selectedmodel.instance.entitiy/entities/rows 

                  introdotto da un prompt che usa una prop (inflatted db row or a entity obj prop ,depending on how we format an entity ) prop in  selectedmodel.instance....

               (non occorre un turno di query x avere il obj che viene invece preventivamente inflattato/embeddato nel item ! ) 
            il context per il successivo dialogo : un dialogo che fa il selector di un model dinamico  $$xx:>  usa il model vars.matches.xx.
          */  

        }
      }
    } 
    // entities.descr=ent.answer;// rename answer in descr why? descr is a short descr answer is a long descr 

    return {entities,compl_ctx};
  }// ends fillE()

let resu=0;// itents got
if(res.intent)resu=1;else{
// todo return void 

}
  // main intent entities
  let {entities,compl_ctx} = fillE(res, res.data[res.intent]);

  this.entities = entities;// is a copy of entities of firse intent ( just x convenience ) , intents[0] entities ( common ?) 
  this.compl_ctx=compl_ctx;
  // attach as first intent in intents , just x convenience
  this.intents = [{ name: res.intent, confidence: res.score,
    // discr: res.discr,
    entities,compl_ctx }];// best result, first intent

    this.discr=res.discr;

  /*
  let secInt = fillE(res, res.data[res.intent2]);  // second/alternative intent + its entities
  let entities2=secInt.entities,compl_ctx2=secInt.compl_ctx; 

  // copy in selecting , take main intents[0] as default selection
  // group is the context of navigation child 
  this.group={sel:{item:this.intents[0]}//this.cursor={sel:{item:this.intents[0]}
  // some navigation context ,,,,
  };// or simply this.cursor={sel:this.intents[0]};
*/

  if (res.intent2 && res.discr) {//

      // second/alternative intent + its entities
      let secInt = fillE(res, res.data[res.intent2]);
      let entities2=secInt.entities,compl_ctx2=secInt.compl_ctx; 
    
    // if(secInt)


    this.intents.push({ name: res.intent2, confidence: res.score2,
    //    discr: res.discr,
       entities:entities2,compl_ctx:compl_ctx2 });// second intent can have its own entities 


      // copy in selecting , take main intents[0] as default selection
      this.group={sel:{item:this.intents[0],match:this.intents[0].name}//this.cursor={sel:{item:this.intents[0]}
      // nb in this  impl, the child will fire a selection fw loop il .desr found , independently by group.sel !
      // >> so in this case (following )do not set selected the model !!! 

      // ,chctx1:1 //,some child param used in conditions or template ( navigation context ),,,,

      };// or simply this.cursor={sel:this.intents[0]};

    this.cursor={resModel: {},medSyntL:null};// this run time model do not describe the intents items that needn't to be matched , but is a model containing the values of entities that can discriminate the intents !!!!!!!!

    // LIKE a QUERY prepare the context in .param/ .params  to be used by selector child , so do same staff here
    //  remember , in a query matcher we :
    //    - in .param :
    //      - set the query cursor rows
    //      - set the model X to match a row to select it 
    //          the model X is set in     .param.cursor.resModel
    //    - in .params :
    //      - set general context for the template of the child to run 
    //    - run the child this will promt user to select the cursor by matching the model X using $$desiremodel/ask:>
    // attach also a dyn model description x selection like in a query matcher so can use with  $$intent(ask)matches:>
    // to start just refine intents[0].discr[0]
    //   >>> build dyn model to use in selector macro $$xx:>selectedmodel. selectedmodel is the selected model that a inner dialog select using the dyn model inside matches.xx.intent/param.cursor.resModel


    // now build the context x discriminating first 2 intents
    let dis=this.discr;// discr=['city','type']
    // discriminate only x first discr property


    if(dis) // surely it is !
    
    for(let i=0;i<dis.length;i++)
    {// if find some discr properties , prepare the run time model for selection on selector thread among the many intents. begin with just 1 dis criminating entity ( the first)


      if(dis[i]=='sala'||'piano'||dis[i]=='settore'){// and both properties of intent 0 e 1 
      let v1=entities[dis[i]].value,v2=entities2[dis[i]].value;
      let itNam1=this.intents[0].name,itNam2=this.intents[1].name;

      // /  -> |
      var vv1 = v1.replace(/\//g, '|');var vv2 = v2.replace(/\//g, '|');// ex 'banane/mele' -> 'banane|mele'
      v1 = v1.replace(/\//g, ' o ');v2 = v2.replace(/\//g, ' o ');// ex 'banane/mele' -> 'banane|mele'

      this.cursor.medSyntL=this.cursor.medSyntL||[]; this.cursor.medSyntL.push(v1);this.cursor.medSyntL.push(v2);
          /*
          letd='disc0';
          this.cursor.resModel[letd]= {// we tie to intents[0], so when user match item  'disc1' storemat='disc1' (useless) but storeMId should be 0, so we match intents[0]. TO BE CHECKED 
            patt: vv1,
            vname: v1
            };*/

          this.cursor.resModel[itNam1]= {// we tie to intents[0], so when user match item  'disc1' storemat='disc1' (useless) but storeMId should be 0, so we match intents[0]. TO BE CHECKED 
            patt: vv1,//'banane|mele'
            vname: v1//'banane o mele' 
            };
            //letd='disc1';// we tie to intents[1]
            this.cursor.resModel[itNam2]={
            patt: vv2,
            vname: v2
          }
          this.cursor.discr_sel=dis[i];
          resul=2;
          break;
        }
      
    }
    if(resul==2){
      // 2 intents with discr field , goon to discriminating thread
      this.group.sel=null;//   the child will fire a selection fw loop if .desr found , 
                          // >> so we ALSO set  unselected the model !!! 


    }else{// that will be selecter alredy so set  instance , so this model can be used like a resolved model ( has match and instance )


    }

  }
  //this=that;
  //

}

function Entity(name, dim, row_, value,changeLtime) {// only datetime info , add interval , get only the from . changeLtime is fuso corrector
  /*used value fields : value={type:'value',
                              value:'isotime'
                              }
                            
                        value={type:'interval',
                              to:{value:'isotime'},
                              from:{value:'isotime'}
                              }
*/

  /* see    DGTG  : 
  x=
    {start:3,end:8,dim:"time",value:{type='interval',to:{value:datetime,grain},from:{value:datetime,grain}}},   >> so row:{value:datetime,dim:'time',type:'interval',date:datefromvaue,time:timefromvalue,tovalue,todate,totime:}
    {start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:datetime}},                               >> so row:{value:datetime,dim:'time',type:'value',date:datefromvaue,time:timefromvalue,tovalue,todate,totime:}
    {start:3,end:8,dim:"number",value:{type:"value",value:2}},                                                  >> so row:{value:13,dim:'number',type:'value'}

    value=x.value
  */





  // std entity obj inside the  associated matches see formatx.txt, 
  // is class, the value is : std row {value,descr(,patt,data + bl entity name/key)}+ std matcher var :{match,vmatch} 

  // >>>>>  this value is the entity obj but is more complete then std VAL expected format see Matcher_AdapterInterface.txt
  // to do   : define the entity found : Time or/e Interval 

  /*
      constructor , returns obj :
        {// like ....
          matched:'match' or null 
          match:   itemname=row.value  (???or {ent:itemname}) 
          vmatch:
  
          rows:row_={ value,descr,,,, bl ,,,} // the db std model (a obj with a entity (value=key + patt,descr (view/match property)+ some propertyes value (bl field)) 
                                        //   ex row={value='red',descr'red color',patt='', paint:'acrilic'}
                                        // OR 
                                        // a custom obj with its properties ( so a object with many entity item key) : used here if we have 2 entity 
                                        // example : row={value:null,datex:'31122020',timex:'23:59'} so as :
                                        // $%complexent:date-datex&time-timex   we can set status with a intent ( named like condition models) with 2 entities :
                                        //    named date : {value=descr='31122020'} and time : {value=descr='23:59'}
  
  
            },// OR in model(vars.matches.model={....})=entity  we can copy the row as instance
            instance
  
          // witai like : 
          type: 	// witai dim + ...  es : type=number,datetime-val/interval,location,customentitynameAssigned( the name referas to a entity described on staticmodel or a db schema)
          name:'ent',/// needed?
  
        }
  
  
  */

// fuso, non usato in simplybook
const fuso='+01:00';// or :   =''

  // let value; match = null; 
  this.matched = null;
  this.type = dim;
  this.name = name;
  if (value.type == 'value') {// its a time 
    if (row_&&value.value) {
      row_.value=changeLtime(value.value)+fuso;// value.value= "2021-02-25T11:00:00.000-08:00", port in rome local time (same hour but day can change as losaneles-rome shift is 9 hours)
      row_.type='time-value';
      // row_.descr=.......

    this.rows = row_;
      this.match = row_.value; this.vmatch = row_.descr;
      this.matched = 'match';

    } else this.row = null;
  } else if (value.type == 'interval') {// its a time interval : take from 
    if (row_ && value.from&&value.from.value) {
      row_.value=changeLtime(value.from.value)+fuso;
      if(value.to)row_.to=changeLtime(value.to.value)+fuso;

      row_.type='time-interval';
      // row_.descr=.......

    this.rows = row_;
    this.match = row_.value; this.vmatch = row_.descr;
      this.matched = 'match';

    } else this.row = null;
  } else this.row = null;

}






function changeLtime(dateUsLoc) {// relative time fuso corrector .see today example
                                //dateUsLoc="2021-02-28T08:00:00.000-08:00", hoursShift=9 so if local hour is 8 , return ="2021-03-01T08:00:00.000+01:00"
                                // so if local hour is 10 , return ="2021-02-28T08:00:00.000+01:00"
                                // so if local hour is 10 , return ="2021-02-28T08:00:00.000" local hour 
let nd;
console.log('duckling : date on ustime: ',dateUsLoc);
    const lochour= new Date().getHours();
    console.log('duckling : local hour: ',lochour);
  const nev=false;
  //if(nev){//if(lochour<9){
    let todo_=true;
  if(lochour<9&&!todo_){// todo debug error : do shift only if match  today,tomorrow,..... not venerdi 23
                        // example today: today is the date now in -08 fuso, that can be not the date in local fuso !!!!!!
	let date= new Date(dateUsLoc);

        const offsetMs = 24*3600000;// 1min=60000 milliseconds, 1day =60*24*60000
        const msLocal = date.getTime() + offsetMs;

        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();

      // debug

        const msLocalx = date.getTime(),dateLocalx = new Date(msLocalx);// date in local hour
        const iso0 = date.toISOString();
        const isox = dateLocalx.toISOString();
        console.log('duckling,changeLtime : changing  , isox : ',isox,' iso0 : ',iso0,' iso : ',iso);

        let cal=iso.substring(0,10);// next day 

	nd=cal+dateUsLoc.substring(10,23);//+'+01:00';
	console.log('duckling, changeLtime : changed date on localtime: ',nd);
	}else{

	nd=dateUsLoc.substring(0,23);//+'+01:00';
	console.log('duckling,changeLtime : same date on localtime: ',nd);

}
return nd;
}
function Ltime(dateUsLoc) {
      return dateUsLoc.substring(10,23);
    }
