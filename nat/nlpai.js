const { NlpManager } = require('node-nlp');// npm install node-nlp
let manager;
const aiRestInt=false;//
let rest;

// interface 
// cfg agents to know what end point will use , ???
agents={duck:'duckling',
        nlpjs:'nlpjs',
        witai:'witai'
},


services={};

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

// init({nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse'}})

    return {
      init(active) {//init(active={nlpjs:{url:'http://192.168.1.15:8000/parse'},duck:{url:'http://192.168.1.15:8000/parse',qea:{url:extqea} })// interfaces : nlpai,duck.witai(all intent resolver services),qea(all qea services)
        // returns services so i can register plugin  regplugin('ai',services) 
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
            // todo
          }else if (ep == 'qea') {// very similar interface to witai,  but specilized to interface qea rest end point 
            srvNam = 'natural';// the service provided by this master factory nb in matcher macro we set url=service://plugins.ai.nlpjs.datetime?qs
            services[ep] ={};
            services[ep] [srvNam]=natural(active[ep]);//  plugins.ai=services so call  /  plugins.ai.nlpjs.datetime
          }



        }// end register endpoint :
        return services;
      }
    };
  }// end rest_

  let natural=function(params){

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
            var answ = qea.answer1(text, wheres);
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
              let intent=new Intent(answ,wheres);// witai intent format + // role can pe put as wheref if is in wheres ?



              return {reason:'runned',rows:intent};

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

let duck=function(params){

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
  return   datematch2(params);
  }



    datematch2= // this function returns a Promise and do  use await  . so async function  OR function ? 

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

so main json result template is :

datetime="2020-10-31T19:30:00.000-07:00"

result =[// conf=  ????
  {start:3,end:8,dim:"time",value:{type='interval',to:{value:datetime,grain},from:{value:datetime,grain}}},
  {start:3,end:8,dim:"time",value:{type:"value",grain:"minute",value:datetime}},
   {start:3,end:8,dim:"number",value:{type:"value",value:2}},
]
*/
      
       //let url=http://192.168.1.15:8000/parse
        let result = await  rest(params.url,'POST',{locale:'it_IT',text:term},null, true,null) // no extra header,true:send urlencoded (calc from map obj data {locale:'it_IT',text:term}, no qs)
        .catch((err) => { console.error(' REST got ERROR : ',err); }); 

        console.log('duck service , datematch got :',JSON.stringify(result, null, 2));

          let o,res;
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
        // if ()
        // if(result&&result.entities&&result.entities[0]&&result.entities[0].resolution&&result.entities[0].resolution.value)
        if(res)
         return {reason:'runned',rows:res};//{reason:'runned',rows:result.entities[0].resolution.value==new Entity()=.....................};
        else return {reason:'runned',rows:null};
        // other nlp func ....
    }else return {reason:'err',rows:null};
  }
  return mf;}

function Intent(res, wheres) {// std intent wit.ai obj  see formatx.txt, is wheres needed ? or discr is enougth
  // + discr in intent and isDiscr in entity 
  // res = {data:trainingData,intent:interpretation.guess,intentclass:trainingData[interpretation.guess],answer:trainingData[interpretation.guess].answer,interpretation,score:interpretation.score,
  //intent2:interpretation.second,score2:interpretation.score2,discr:interpretation.discr}// in case we want to discriminate / refine on wheres not matched yet 
/*
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

  function fillE(res, ent) {
    let entities = {};
    for (let e in ent) {// scan properties
      if (e != 'questions' && e != 'metadata') {
       // if (e != 'answer')
         {
          let isDiscr;
          if (res.discr && res.discr.indexOf(e) > -1) isDiscr = true;// the property e is item of res.discr
           else isDiscr = false;
          entities[e] = { name: e, value: ent[e], role: 'n/d', type: 'value', isDiscr };
        }
      }
    } 
    // entities.descr=ent.answer;// rename answer in descr why? descr is a short descr answer is a long descr 

    return entities;
  }


  // main intent entities
  let entities = fillE(res, res.data[res.intent]);
  // second intent entities
  let entities2 = fillE(res, res.data[res.intent2]);
  this.entities = entities;// intents[0] entities ( common ?) 
  // attach
  this.intents = [{ name: res.intent, confidence: res.score,
    // discr: res.discr,
    entities }];// best result

    this.discr=res.discr,
  // copy in selecting , take intents[0]
  this.group={sel:{item:this.intents[0]}//this.cursor={sel:{item:this.intents[0]}
  // some navigation context ,,,,
  };// or simply this.cursor={sel:this.intents[0]};
  if (res.intent2 && res.discr) {//
    this.intents.push({ name: res.intent2, confidence: res.score2,
    //    discr: res.discr,
       entities:entities2 });// second intent can have its own entities 

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
    let dis=this.discr;// discr=['city','type']
    if(dis&&dis[0]) {// prepare the run time model for selection on selector thread among the many intents. begin with just 1 dis criminating entity ( the first)
      let v1=entities[dis[0]].value,v2=entities2[dis[0]].value;

      // /  -> |
      var vv1 = v1.replace(/\//g, '|');var vv2 = v2.replace(/\//g, '|');// ex 'banane/mele' -> 'banane|mele'

      this.cursor={resModel: {}};// this run time model do not describe the intents items that needn't to be matched , but the values of entities that can discriminate the intents !!!!!!!!
                              // so they have fantasy name , say disc1,disc2 .....
          letd='disc0';
          this.cursor.resModel[letd]= {// we tie to intents[0], so when user match item  'disc1' storemat='disc1' (useless) but storeMId should be 0, so we match intents[0]. TO BE CHECKED 
            patt: vv1,
            vname: v1
            };
            letd='disc1';// we tie to intents[1]
            this.cursor.resModel[letd]={
            patt: vv2,
            vname: v2
          }
        
      
    }
    

  }
  //this=that;
  //

}

function Entity(name,type,row_){// std entity obj inside the  associated matches see formatx.txt, 
                          // is class, the value is : std row {value,descr(,patt,data + bl entity name/key)}+ std matcher var :{match,vmatch} 
/*
    constructor , returs obj :
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


					},

				// witai like : 
				type: 	// witai dim + ...  es : type=number,datetime-val/interval,location,customentitynameAssigned( the name referas to a entity described on staticmodel or a db schema)
				name:'ent',/// needed?

      }


*/
let value;match=null;this.matched=null;
this.type=type;
this.name=name;
if(row_&&(value=row_.value)){this.rows=row_;
  this.match=value;this.vmatch=row_.descr;
  this.matched='match';
  
}else this.row=null;

}
