// see summary/structuring at the end

/*
main def :                 
                curRelInDay_ = 0,// the index  ix that correspond to first bookable day when move to a new fromdate   ( after got the sched matrix rows from server is 0) , 



                let  
                dayspan_ = [],//[0,3,4]relative day (day after fromDay ) bookable day with bookable slot , ex dayspan=[0,3,4] . nb dayspan[0] is the first bookable relative in rows, can be 0 or >0
                //  >>>> dayspan[ix] is the days after the fromdate of ix-esimo bookable day after the fromdate  
                // nb fromdate is :
                //      - desidered datetime (desDtatTime) day 
                //          or 
                //      - firstDay if available and > desDtatTime 
                //      >>> dayspan is the i-esimo bookable relative day against fromdate 
                //          so if dayspan[0]=0 means that the first bookable is fromdate
                //              nb clearly  this will be sure if desDtatTime==firstDay and in this case we set gotdate=true

                //      ( desidered day is the day in desidered datetime also if hours dont match !!!!! anyway try a hour match in desidered day if is bookable also if des hour dont match !)

                daysc_ = [],//[14,1,8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable_ = [],  //[19,22,3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot_ = [],//[114,211,null],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd_ = [];//[101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate. question : first value must be 0 ?
            //




// >>>>>>>>>>>>><    SO the base to calc relative days is the  dateFrom_  param of start(curdate,dateFrom_,....) considered at 0 hour  utc
// nb  dateFromAPI = dateFrom_.substring(0,19); fromDate = new Date(dateFromAPI="2021-01-04T10:00:00.000 ) 4 gennaio
// so given a date='2021-11-01........' to cald the relative day call relDay(date) !
// nb as first bookable day dayspan[0] can be >=0 and the first relative  desidered day can be <=0


                daysc_ = [],//[14,1,8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable_ = [],  //[19,22,3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot_ = [],//[114,211,null],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd_ = [];//[101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate. question : first value must be 0 ?
            //

                // ***************************    definition ****************************
                ctl.slotMat = {// updates ctl , reassign slotMat    *CTL 
                    curDate:curdate.toISOString(),
                    dayspan:dayspan_ , daysc: daysc_ , dayBookable:dayBookable_, totSlot:0, bookDays:0,
                    curRelInDay:curRelInDay_ , relDayInd:relDayInd_, pref_day_slot:pref_day_slot_,
                    fromDate, //  fromDate = new Date(dateFromAPI="2021-01-04T10:00:00.000 ) 4 gennaio
                    datefrom,// ="2021-01-04"=dateFromAPI.substring(0,10);// the base to calc relative day
                    startDateTimeStamp,//   usefull to calc day difference from as in relDay("2021-01-05") returns 1 , relative days from datefrom 
                                        // is the time when in utc location  starts the day in iso format "2021-01-04"
                    fromDay, fromHour// . fromDay=4,fromHour=10 is local of fromDate ( loaded using a different locale , th educk locale !!!)
                };


*/





// config :
// const debugL=false;
let inter = 7;//4;// interval reset to 6 if gotdate
const debugL=true,
tests_3D=3,tests_3H=3,// def number of items in selectors
EnLoc=false;// enhable location filtering in find performers. todo debug now is in error



const querystring=require('querystring');// it is a built in module , need to require ?
// config behaviour:
const nearpol=// 0 is tested 
0;// 0 : match hour if >= the prefHour , 1: match hour anyway , take the first >= otherwise the previous . 1 to implement 
// 1;// testing to do 
const SimplyBook = require("simplybook-js-api");// need to set baseurl : this.BaseURL = 'https://user-api.simplybook.me' + url in base.service.js
const orReg = /\?*,*\.*\s+,*\s*/g;// /\?*,*\.*\s+,*\s*/ig;// 'The quick brown fox jumps over , the lazy? , dog. If the dog reacted, was it really lazy?' >> "The|quick|brown|fox|jumps|over|the|lazy|dog|If|the|dog|reacted|was|it|really|lazy?"
// see simplyinfoingAiaxCtl.js the global field approach . here prefers to work with rest passed as param in simplybooking(vars, form_whInst,form_wheres, qs, rest)
// let rest;// got from nlpai.js :
// nb  rest_ is the (rest.js).jrest  , so     jrest:function(url,method,data,head, urlenc,qs){// data ={prop1:value1,,,}  , the js plain 1 level obj (js map)
//                                                                                            //  qs, urlenc  are post only param :    if urlenc = true send a    x-www-form-urlencoded body (got from qs or coding  data obj )
// units discriminators :
const prompti = [], gets = [], keyname = [];// mask=[];will not insert as discriminator the these keys because already whered in the query that give the rows 
// now list all the keys used to discriminate the query performers rows to build a selection model ( discriminator will add a OR entry  in the pattern to match )
// after selected the service we query the performers table to get a performer query model and build a selector
// il query si puo fare con 
// - rest a simplebook o , in futuro 
// - se sono molti si fa un pre download di tutti i performers su un db locale e poi si usa questo per fare la query di selezione  
// if the performers are 20-100 we must query using additional wheres ( oltre al service che fanno) raccolte as dependency model e disponibili come proprieta passate nella querystring 
// una volta ottenuta il result/cursor/rows[] si costruisce il pattern usando i key discriminator ( che non sono stati usati come where nel query , so using mask[])
// definiti qui di seguito :
//  > in pratica si cerca (usando la funzione gets() ) nei item/row mapobj/arrayindiciati  se  sono  presenti i key qui definiti  e se effettivamente sono discriminator vengono poi aggiunti nel pattern del selector 
prompti.push(' con sede presso '); keyname.push('location');// the words user to present the discriminator key/var 
prompti.push(' provincia di '); keyname.push('provincia');
prompti.push(' tipo di servizio '); keyname.push('tipologia');// pubblico/ privato 
gets.push(function (i, query) {// a function used to extract the key value from the entity(row) of the cursor/rows
    //query[i].name.split
    if (query[i].feature) return query[i].feature.location;
});
gets.push(function (i, query) {
    //query[i].name.split
    if (query[i].feature) return query[i].feature.pr;
});
gets.push(function (i, query) {
    //query[i].name.split
    
    let tp; 
    //if (i == 0) tp = 'privato'; else tp = 'pubblico';// simulazione 
    if (query[i].feature) return query[i].feature.type;
    return tp;
});

// NB need to install it locale in nodes : npm install full-icu


// needs ? seems not const moment= require("moment");// npm install moment 

// async return bank , used to collect async response among session as functions cant be stored in user session status (available  if i pass here vars.session.status) 
var hwSession = {};// a persistant map with integer index : the time stamp {time1:{},,,,}, time (milliseconds) is the hash 
// used in :  firstxUid= await hwSession[ctl.curKeyList.first3date]].Uid ='20211231' in local time 

// config behaviour 
const canwait = true;// when unit selected i wait for matrix then do alternatives 

// cfg page : https://sermovox.secure.simplybook.it/v2/management/#plugins/api/

const simplyBook = new SimplyBook(
    'sermovox',
    '58d46aa077c75410c89b7289816cbd5894d01f7b42c1da142ae62772738270ef',
    'be29914b99aa6ce55808c02cae3eccb5e7986c9ff4c230b064e8ff62fa6de5c7',
    'admin',
    'luigiDOluigi');

// 建立Auth Service
let auth = simplyBook.createAuthService();
let token;

/*  27012021

now split start in :
- getservPerformers() that get service and performer data (put in ctl session  so in param.ctl.events)
- performer() that select a performer of a service 
- start()that get the slot matrix  

*/
async function getPerfs(form_wheres, ctl) {


    let chservice = ctl.serviceId,// the service choosen
    location;

        if(EnLoc) location= form_wheres.mod_location;// where location is requested and its location 
    // let ctl = qq.ctl;// get from a model reference (query also in different entity )the ctl part
    let pdate = form_wheres.mod_pdate;

    console.log(' simplybook getPerfs request unit x serviceid: ', chservice, ' with where clause location: ', location, ' and a preferred date: ', pdate, ' that we can add as keyword in selector so when the selector run afterwords we alredy knows in its keyword ',
        ' \n if the unit has the date available matching because when selecting we use this download data that can be provided in advance if we know in advance the date preferred so if fortuna we dont need to ask date downloading or we can do with more precision ');
    if (!token) return 'na';
    // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
    console.log(token.data)

    // 建立Public Service
    let publicService = simplyBook.createPublicService(token.data);

    let unit = await publicService.getUnitList();// use location filtering ? or filter locally using 
    let unitList = Object.values(unit.data);// toarray
    console.log('simplybook (req service=', ctl.serviceId, ')full unit list', unitList, ' json obj: ', JSON.stringify(unitList));
    // */
    // build the service query model 
    // datetime = await publicService.getFirstWorkingDay(1) is first av slot ?

    /*  api responded :
      unitList.data={result,id:'1'}
  
      */
    // put in ctl like ctl.eventObj ( map with integer index )
    ctl.unitObj = unit.data;// {1:{id:'1',,,,,},,,,,}// 1 or '1' ?   ST3
    ctl.unitL = unitList;//[{id:'1',,,,,},,,,,]
    let result = unitList;//[{id:'1',,,,,},,,,,]


    //result=result;//  each unit has a service and events map lists 
    // each event ( service)  has a unit map ( employers )  and provider ( alternativi a employers , hanno location diversa ?) lists 
    // where are the unit char to select from ?? and location ?? 
    // todo ow filter providers x selected service using the unit  registered in the service  , see :ctl.eventSt[ctl.serviceId].providers/unit_map ( file getEventList_json.json)
    //  and the choosen service in eventSt : chservice=ctl.serviceId  by user service selection ;
    // now what the difference from providers and units ? 

    // todo : filter prestatori according with matched service mapping , add some selector description as best match concept and start recovering a datetime to propose and prepare the download of slot matrix 
    let provxServiceL = [],// unit_map array x sel service [{id:'1',,,,,},,,,,]
        provxServiceObj = {};// unit_map obj  {id:{id,feature:perfFeature,,,,},,,,,}// a map of units with feature loaded from description

    if (result) {// result is all unit list

        // very like getEvents build a singleturn query model :

        // get the performer for the selected service and filter if any feature are requested to match 
        // selected service has unit/performer id list as integer key of unit map for selected service :
        // ctl.eventObj[chservice].unit_map// automatic string > int conversion 
        // so cloned it :
        let um = ctl.eventObj[chservice].unit_map;// void unit:map, so fill it in provxServiceObj , build also as list provxServiceL          ST4

        // filtering feature location :
        let mask = [];// mask discrim keywords
        if (location) mask.push('location');// dont put location on key prompted , it is alredy matchd !
        for (unitid in um) {// scan unit.data with um keys
            el = unit.data[unitid];
            // add feature from simplybookserver unit description data  inside descrizione del fornitore , ex:
            // <p hidden="">qs?location=mi&amp;type=prof</p>   qs_='location=mi&amp;type=prof'
            let x, y;
            if (el.description) {

                x = el.description.indexOf('qs?'); if (x > 0) y = el.description.indexOf('</p>', x);
                if (x > 0 && x < y) {
                    let qs_ = querystring.parse(
                        el.description.substring(x + 3, y)
                        .replace(/&amp;/g, '&')// (/&amp;/g, '*') or decode html  
                    );
                    if (qs_) {
                    el.feature = qs_;
                        if (location) if (!(!qs_.location || qs_.location == location)) {// if qs location exists and different from location model the query where clause , select only specified location , if specified ( as db) 
                            // filter provider by location
                            el = null;
                        }
                    }
                }
            }

            if (el) {// fill with objmap got from qs is is not a filtered row
            provxServiceObj[unitid] = el;
                provxServiceL.push(el);
            }
        }


        /*
                provxServiceL, provxServiceObj={}; can also be downloaded by our server (x selected service) that has the unit data, so in simply book we keep only datatime matrix !!!
        
        
        */



        // <p hidden="">qs?location=mi&amp;type=prof</p>
        let perfFeature;
        /* 
         result.forEach((el)=>{
             if(el.id)provxServiceObj[el.id]=el;
             let x=el.description.indexOf('qs?');y=el.description.indexOf('</p>');
             if(x>0&&x<y){
             
             let qs_=querystring.parse(qs);
             if(qs_)el.feature=qs_;
             }
         });
 
         ctl.eventSt.forEach((el)=>{
             if(el.id==chservice)provxServiceL=Object.values(el.unit_map); });
             if(provxServiceL.length>0);else{provxServiceL=result;}// if unitmap is null so any unit will do the service
             */
        if (provxServiceL) {

            /* already done 
            let servProvList=[];
           if(location) for (let ij = 0; ij < provxServiceL.length; ij++) {
                let item=provxServiceObj[provxServiceL[ij]]
                if(item.feature.pv==location)servProvList.push(item);
            }else {servProvList=provxServiceL;}
    
            */

            //let gets=null;// temporarely in getNameDiscr1

            // build the prompt and patt of filtered items to select 
            // from results(provxServiceL[i]] items list ( providers/units to do service ctl.serviceId)
            // extract few items to select , using prompt and patt built taking care of keywords (name of unit limited to 3 words, + the concept used as discriminatot ) 
            //let {names,prompt_,patt,outlist,// outlist is indexmap , 4 items max
            let { names,
                prompt_, vname,
                patt, pattt,
                outlist,
                strategy, disambJ, disambiguate1, disambiguate2, discrJ// future case , now only strategy=1(mix best match) is done
            }
                = getNameDiscr1(ctl.eventObj[chservice].name, provxServiceL, keyname, prompti, gets, 4);// todo strip 2 char words from name !! 'il merlo'
            // where gets functions will extract concept keywords extracted  from hihhen unit descriptions and 
            // anyway update getNameDiscr1( code to : one concept  can alredy been a where alredy matched on caller ( province or city usually , so we alredy asked from server  unit by a location  )
            //  for this we can use a buffering local db instead to download the units eveytimes from symplybook , that anyway cant contain units spread in all the city of a nation !, in future  

            // provxServiceL=outlist;

            // add current unit search params on status to do refinement on next match aiax call 
            ctl.curKeyList = { provxServiceL, outlist, first3date: null };   //  ST4 ctl.eventObj[chservice].unit_map   .   ST5 ctl.curKeyList

            let query = new QueryM();
            // for (let ij = 0; ij < result.length; ij++) {// a copy with SSAA

            /*
                for (let ij = 0; ij < outlist.length; ij++) {// a copy with SSAA, just x units in unit_map of sel service :  rsults[ij] >  results[provxServiceL[ij]]
                // r : for(el in provxServiceObj){// provxServiceObj[el]=result[index]
    
                // if(ctl.eventSt[ctl.serviceId].providers.contains(result[ada].id))
    
                {
                    let sname = outlist[ij].name.toLowerCase();
                    // let prompt=sname;
                    */// const orReg = /\?*,*\.*\s+,*\s*/ig;
            /*
            let patt = sname.replace(orReg, '|');

            if (ij == 0)
                patt = '@' + patt;// @ :  ahocorasick
            let row = {//query.rows.push({
                value: sname,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                patt: patt,// 
                id: outlist[ij].id//a char , bl fields/ alt key
                // filtering will get all day representative after the preferred datetime !! 
            };



            let selItem = {
                vname: sname,// == medSyntL ?
                patt: patt
                // index will be added by addRow !!!(row index , not row id that is bl !!!!!!!!)
            };
            query.addRow(row, selItem, sname, ',');
        }
    }*/


            // before building the selector we can 
            // -check if have a preferred unit to see if we can match it at once
            // - start the request of first slot for the pool position unit , so we can be ready in advance to propone the first date !
            // concurrency : see https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
            //                  https://medium.com/@piotrkarpaa/async-await-and-parallel-code-in-node-js-6de6501eea48
            let sess_firstdate = {};


            ctl.curKeyList.first3date = Date.now();// store ref
            hwSession[ctl.curKeyList.first3date] = sess_firstdate;// store ref in ctl status 

            // first 3 date 
            /*function getFirst(id) {
                return new Promise(resolve => {
                    console.log(`starting ${id}`);
                     setTimeout(() => {console.log(`done ${id}`);resolve(ms);}, ms);
                    // datetime = await publicService.getFirstWorkingDay(1) 
                });
            }*/
            let nd = 3; if (outlist.length < 3) nd = outlist.length;
            for (let ig = 0; ig < nd; ig++) {
                let unIndex = outlist[ig], uId = provxServiceL[unIndex].id;
                sess_firstdate[uId] = publicService.getFirstWorkingDay(uId);// add sess_firstdate.id=promise that resolved will give '20211231' , first bookable date in  local time x unit
            }
            // just x debug 
            let pido = await sess_firstdate[0];// nb recovering later we must await ! , so unitid has first bookable date the other await when we got selec : firstxUid= await hwSession[ctl.curKeyList.first3date]].Uid ='20211231' in local time 
            for (index = 0; index < outlist.length; index++) {   // ******************** sname can be repeated !!! check is unique !!! probabl
                let sname = names[outlist[index]];// the where al posto di servizio  taglio capelli   >>> check unique
                // let prompt=sname;
                // const orReg = /\?*,*\.*\s+,*\s*/ig;
                let patt_ = patt[outlist[index]].toLowerCase(),
                    pattt_ = pattt[outlist[index]].toLowerCase();
                if (index == 0)
                    patt_ = '@' + patt_;// @ :  ahocorasick
                let row = {//query.rows.push({
                    value: sname,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                    patt: pattt_,// 
                    //vname:prompt_[outlist[index]],// the prompt x item 
                    vname: vname[outlist[index]],// the prompt x item 
                    // old : quando seleziono questo row/item e l'user chiede dettagli vado su th che rifa il aiax a questo controller con action=detail  
                    // questo controller  registra come query result del servizio amministratore  il seguente obj
                    //  tale result come in performers buildera il detail che esporra un riassunto descr e le property che voglio sapere in un model da selezionare 
                    // the result of a query on this ctl with action='detail' , where='amministratore' 

                    // new :
                    //  quando seleziono questo row/item e l'user chiede dettagli vado su th che rifa il aiax a questo controller con action=detail  
                    // questo controller associa a questo service item (richiesta amministratore ) questa struttura (obj)
                    //  questo stesso controller , come in performers, partendo dal service item selezionato (qui si usa il obj) esporra un descr del service selezionato e buildera il detail query con la lista dei details 
                    //  che posso selezionare come completamento di questo servizio
                    //   in pratica : ok il   row.vname='amministratore' è row.descr= 'zancan che e' capo del board' se vuoi approfondire possiamo dettagliare  .dettagli.corsor.medSyntL  = ' il board o il operation director o ...'   
                    // ? the result of a query on this ctl with action='detail' , where='amministratore' 

                    // disambiguazione :
                    // nel caso in cui seleziono un item ( es azienda ) e la query produce molti item che dovrei elezionare (pattern) non solo  in base al nome (best match troppo simili) ma a un attributo discriminante  
                    // posso prima chiedere un where e fare la query esterna usando questo parametro oltre che al user term (es dammi la provincia e il nome azienda )
                    // o uso solo il term ma poi non chiedo di fare il selection sul patt = vname (best match ) degli items querati ma aggiungo anche i concetti(relation entitys) discriminanti in cursor.discr_sel (come fatto per qea) 
                    //  i cui item vengono inseriti nei patt degli items 
                    // in pratica  patt1='acme srl di pn large' patt2='acmel italia' e il cursor.discr_sel= puoi selezionare un item per nome o usando info su provincia o grandezza (discriminanti sono in pratica scelti tra i dati del report dal search aiax !!!)
                    // obj that takes role similar to qea completamento:
                    id:provxServiceL[outlist[index]].id // >>>>>>>>>>>>>>>>>>>>>>>  CHECKit 
                };

                // set selector:
                // - sname  
                let selItem = {// the value in rows
                    vname: prompt_[outlist[index]],// row.vname,// the v name prompt== medSyntL ?
                    patt: patt_  // item selector match,  is the name or its attribute used to select the item  
                    //,index : optional sync (additional to selItem property) with rows index
                    // index will be added by addRow !!!(row index , not row id that is bl !!!!!!!!)
                };
                query.addRow(row, selItem, selItem.vname, ',');//addRow(row, selItem, prompt, sep) 
                //result.details[sname]=row;// rows copy , will be maintained on ctl status 
            }

            query.ctl = ctl;
            // query.ctl.perfSt = query.ctl.perfSt || {};query.ctl.perfSt[chservice] = result;// {// the ctl event status (service+performer)}

            return query;// {query};// return
        } else return null;

    }
    // end if(result)
    else {
        return null;// server cant return data 
    }

}

async function getEvents() {//
    console.log(' simplybook getEvents');

    token = await auth.getToken().catch(// NOW PUT the token at server scope , so 1 token for all app in server , in future insert the tokent into .ctl !!!
        (err) => { console.error(' simplybook  got ERROR : ', err); });

    // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
    console.log(token.data);

    // 建立Public Service
    let publicService = simplyBook.createPublicService(token.data);// also store as a  singlethon as the token ???

    // /* // 取得Event List
    let event = await publicService.getEventList();
    let eventList = Object.values(event.data);// toarray
    console.log('simplybook event list', eventList, ' json obj: ', JSON.stringify(event));
    // */
    // build the service query model 


    /*  api responded :
      event.data={result,id:'1'}
      result={
      '1':{
          id:'1',
          name:'service name ',
          position:'1',
          providers:[1,2]
          },
      .....
      }
      */

    let result = eventList;
    if (result) {
        let query = new QueryM();

        for (let ij = 0; ij < result.length; ij++) {// a copy with SSAA
            // if(ctl.eventSt[ctl.serviceId].providers.contains(result[ada].id))
            {
                let sname = result[ij].name.toLowerCase();
                // let prompt=sname;
                // const orReg = /\?*,*\.*\s+,*\s*/ig;
                let patt = sname.replace(orReg, '|');

                if (ij == 0)
                    patt = '@' + patt;// @ :  ahocorasick
                let row = {//query.rows.push({
                    value: sname,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                    patt: patt,// 
                    id: result[ij].id//a char , bl fields/ alt key
                    // filtering will get all day representative after the preferred datetime !! 
                };



                let selItem = {
                    vname: sname,// == medSyntL ?
                    patt: patt
                    // index will be added by addRow !!!(row index , not row id that is bl !!!!!!!!)
                };
                query.addRow(row, selItem, sname, ',');
            }
        }


        /* schema to build the query model with associaed bacic simply selector model 
        
            if (availableTime.success) {// BUILD the query model instance , after the items will be selected  
        
                let query = new QueryM();
        
                // build a datetime entity with related bl 
        
                let datas = availableTime.data;
        
                if (datas) {//  availableTime{  success:true,
        
                    for (let ada in datas) {// datas={ada='2020-12-30':["09:00:00","10:00:00","11:00:00",,,],,,,,}
        
                        let variables=datas[ada].kk;
                        let row = {//query.rows.push({
                            value: stdT,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                            patt: stdT,// 
                            date: ada,
                            time: tim,
                            // old :  index: ada.substring(8, 10)// day number . when filter we take 1 represenatative each different index , so after go the matxh on index we'll match the items inter index !!!
                            index: count.toString() // new . usefull in ....?  ex in template to navigate in ctl structure ? ex medSyntL[index] o original medSyntL_[index]
        
                            // filtering will get all day representative after the preferred datetime !! 
        
                        };
                        prompt = ' marios butchers';//);
        
                        let selItem = {
                            vname: prompt,// == medSyntL ?
                            patt: '\\bmario\\$'
                        };
        
                        query.addRow(row, selItem, prompt, ',');
        
                    };
        
                    query.ctl.somemodelStatus = {// the ctl status 
                        dayspan, daysc, dayBookable, totSlot, bookDays,
                        curRelInDay, relDayInd, pref_day_slot,
                        fromDate, fromDay, fromHour// from date is Date()  loaded using a duck locale trans as rome local . fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
                    };
                    return query;// {query};// return
                }// ends datas 
        
                else return null;//( ) impossible !) returns without any data bookable 
            }
            else return null;
        
        // end schema 
        */

        query.ctl = { eventSt: result, eventObj: event.data };// {// the ctl event status (service+performer)}

        return query;// {query};// return


    } else {
        return null;// server cant return data 
    }

}// end getEvents() 


async function start(curdate,dateFrom_, inter,ctl) {// usually dateFrom_ :
                                            // -  comes from desidered datetime set by duchling server. it set in us localtime : dateFrom_ "2016-02-09T00:00:00-08:00"  is iso from duck with time shift (-8 ), 
                                            // - can also be firstDate or current time 
                                            // in code internally will be tranf to ROME local time "2016-02-09T00:00:00+01:00" 
    //  when call simplybook server it must used again  as US : "2016-02-09T00:00:00-08:00"


    // 032021 definition : assume anyway dateFrom_ in local time schift : 
   /* old : 
   let dateFromAPI = dateFrom_.replace('-08:0', '+01:0');// old, change the local date , set loc hour to what is in book server us local hour dateFrom_="2021-01-04T01:00:00.000-08:00" > dateFromAPI="2021-01-04T01:00:00.000+01:00"
   const fromDate = new Date(dateFromAPI);// the from date obj  , with hour ( master desidered book )
   // dateFrom_ is  iso with time offset (from duck server is -8) ex  "2021-01-04T01:00:00.000+01:00" means local time is hour 1 at locale with schift of 1 hour (it) so is = to "2021-01-04T01:00:00.000+01:00" or "2021-01-04T01:00:00.000Z" 
   //  if without time shift "2021-01-04"  is std (hour 0 at greenweech)
   //                          "2021-01-04T13:00:00" or "2021-01-04T13:00:00.000" is locale time  so hour is 12 at greenweech ,so = to "2021-01-04T12:00:00.000Z" so = to "2021-01-04T13:00:00.000+01:00"
    */

// new 032021 assume anyway dateFrom_ in local time schift : 
let dateFromAPI = dateFrom_.substring(0,19);//  dateFrom_="2021-01-04T01:00:00.000-08:00" > dateFromAPI="2021-01-04T01:00:00.000  
 
const fromDate = new Date(dateFromAPI);// assume dateFrom in local time,   fromDate = new Date(dateFromAPI="2021-01-04T01:00:00.000 )
// dateFrom_ is  iso with time offset (from duck server is -8) ex  "2021-01-04T01:00:00.000+01:00" means local time is hour 1 at locale with schift of 1 hour (it) so is = to "2021-01-04T01:00:00.000+01:00" or "2021-01-04T01:00:00.000Z" 
//  if without time shift "2021-01-04"  is std (hour 0 at greenweech)
//                          "2021-01-04T13:00:00" or "2021-01-04T13:00:00.000" is locale time  so hour is 12 at greenweech ,so = to "2021-01-04T12:00:00.000Z" so = to "2021-01-04T13:00:00.000+01:00"



    // get slot matrix for datefrom_/curdate{date,time} till datefrom+inter
    /* returns query :
    query={// see *QUERY : new QueryM()
            // items built using helper query.addrows()
        rows=[row1,,,,],// see *ROWS . row={value: stdT,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                                            patt: stdT,// 
                                            date: ada,
                                            time: tim,
                                                // old :  index: ada.substring(8, 10)// day number . when filter we take 1 represenatative each different index , so after go the matxh on index we'll match the items inter index !!!
                                            index: count.toString() // new . usefull in ....?  ex in template to navigate in ctl structure ? ex medSyntL[index] o original medSyntL_[index]
                                            }
        cursor:{
                 resModel:{value=row1.value:
                                                {*SELITEM}
                            ,,,,} 
                 medSyntL:[row1.vname,,,],
                 medSync:[row1.value,,,,,]    *MEDSYNC *MEDSYNTL

            }
        group,
        ctl:{ // ***************************  
            selStat: // main status 

            see after :
            ctl.slotMat = {// updates ctl , reassign slotMat    *CTL 
                curDate:curdate.toISOString(),
                dayspan:dayspan_ , daysc: daysc_ , dayBookable:dayBookable_, totSlot:0, bookDays:0,
                curRelInDay:curRelInDay_ , relDayInd:relDayInd_, pref_day_slot:pref_day_slot_,
                fromDate, //  fromDate = new Date(dateFromAPI="2021-01-04T10:00:00.000 ) 4 gennaio
                datefrom,// ="2021-01-04"=dateFromAPI.substring(0,10);// the base to calc relative day
                startDateTimeStamp,//   usefull to calc day difference from as in relDay("2021-01-05") returns 1 , relative days from datefrom 
                                    // is the time when in utc location  starts the day in iso format "2021-01-04"
                fromDay, fromHour// . fromDay=4,fromHour=10 is local of fromDate ( loaded using a different locale , th educk locale !!!)
            };
                bookInd= iesimo bookable day
                dayspan = [],//     [  0,  3,  4]relative (day after fromDay )iesimo(bookInd) bookable day with bookable slot , ex dayspan=[0,3,4] . sparce domain. nb can be dayspan=[1,3,4] !
                daysc =   [],//     [ 14,  1,  8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable = [],   [ 19, 22,  3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot = [], [114,211,nul],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd = [],     [101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate


                // so first bookable day (xi=0) is 0 day after the startday/datefirst and, according with daysc = [xi], has 14 slot available for booking and according to dayBookable  is cal day 19,
                //    the slot index in rows of the bookable slot meeting fromHour according pref_day_slot[ix] is 114 and according to relDayInd the first slot index of this day (calendar day 19) is 101 
                // second bookable day,ix=1,  is 3 day after the after the startday/datefirst ,  the calendar day is dayBookable[ix]=22 (datefrom cal day is 19) and has 1 slot bookable and the slot meeting fromhour has rows index pref_day_slot[ix]=211

                curRelInDay = 0,// the index  ix that correspond to first bookable day when move to a new fromdate   ( after got the sched matrix rows from server is 0) , 
                //  so first  cal bookable day after desidered day das ix= curRelInDay+0, iesimo after is ix= curRelInDay + i-1, and has calendar day dayBookable[ix]

                // - how to find the first bookable slot of a new desidered day?  just find curRelInDay :
                //      so given a desidered calendar day 21th  of march we look how many days is after from fromdate ( cal day 19), so  2, so search ix : dayspan[ix]>=2 => ix=1 so   curRelInDay=ix=1, 
                //          and first bookable day is   dayspan[curRel]- 2 days after the desidered day  ( calendar 22 - calendar 21 of same month)

                //          (interesting case : given a desidered calendar day 3  of march we look how many days   after from fromdate (ex cal day 28), so  3, so search ix : dayspan[ix]>=3 => ix=1 so   curRelInDay=ix, )
                //      if we want select days meeting a new  desidered new fromHour we must rebuild all preferred hour day pointer : pref_day_slot[i] that gives for the iesimo bookable day after fromdate the rows index of slot meeting the fromhour
                // >>>  so when given a desidered day we calc curRelInDay index. the iesimo bookable day after the desidered day will be found in bookable arrays with index ix=curRelInDay+i


            // ulteriouri state added during ctl multi turn multi entity matching/selection :
            ......  (status ...)
            unitId // receiving match in status  -7  see ST1
            serviceId // receiving match in status  -9 see ST2
            unitObj=unit.data,ctl.unitL=unitList;  // see ST3
            eventObj[chservice].unit_map   // see    ST4
            curKeyList   // see ST5
            ..........

            }

    }
    
    */


    // no more let relDay=ctl.relDay;// short ref

    let startDate;//"2016-02-09T00:00:00Z";// to count days , so the 0 utc of dayfrom 
     

    // 取得Token

    // useless : let { date, time } = curdatetime();// time format problem 
    /*
    dateFrom = dateFrom|| date;dateTo = dateTo||date;
    */
    // from param !! let ctl = qq.ctl;// get from a model reference (query also in different entity )the ctl part

    let serviceId = eventId = ctl.serviceId, performerId = ctl.unitId, unitId = '2', qty = 1;//unitid/performerId is the match of just selected unit/performer selector  query 

    if (!token) return 'na';
    // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
    console.log(token.data)
    // 建立Public Service
    let publicService = simplyBook.createPublicService(token.data)




    startDate = dateFromAPI.substring(0, 10) + 'T00:00:00Z';//= // "2016-02-09T00:00:00Z"; dateFromAPI but at 0 hour utc. usefull to calc day difference as in relDay()
    startDate_ = new Date(startDate);// start date obj , same as fromDate but at 0 hour utc (hout 0 utc is hour 1 local rome)
    const startDateTimeStamp = startDate_.getTime();// time at local , so 0 utc is 1 in localtime,  usefull to calc day difference as in relDay()
    const startDay = startDate_.getDate(),// the calendar day as 9 , local time
        fromDay = startDay;

    
    const fromHour = fromDate.getHours(); // - 08:00 local time now trans to rome local time +01:00,  desidered book hour

    // having a nowdateFromAPI // must be "2016-02-09........."
    // daysfromstart= relDay(nowdateFromAPI);

    // >>  Master on date
    //  dateFrom_   "2016-02-09T00:00:00-08:00"  hour load in simplybook server is local time in us (-08:00)
    //  dateFromAPI = 2016-02-09T00:00:00-08:00"  Means we trans the us loc date in rome loc time , and we manage all time in this local time 
    //  locdate_dateFirst is the first slot localtime got in matrix 


    //  dateTo = fromDate + inter;// NONONO new Date format , 3 days more then dateFrom


    let dateTo = addDays(fromDate, inter);// fromDate= new Date(dateFromAPI="2021-01-04T01:00:00.000+01:00");inter=number of days to schift
    // old , let dateToUS = dateToISOLikeButUs(dateTo);//    dateTo=new Date('2021-01-07T10:32:00.000+01:00'),dateToUS= 2021-01-07T10:32:00.000-08:00

    /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate + https://www.w3schools.com/jsref/jsref_toutcstring.asp
        const birthday = new Date('2021-01-29T01:00:00');// is local time !! 
        const date1 = birthday.getDate();
        console.log(date1,birthday.getUTCDate(),birthday.toISOString(),birthday.toString());// birthday.toString() is local time followed by schift time from grenweech
        >>> 29 29 "2021-01-29T00:00:00.000Z" "Fri Jan 29 2021 01:00:00 GMT+0100 (Central European Standard Time)"
    */
    // const locdate_dateFrom = fromDate.toString();//  NO it a long format !!!is local time followed by schift time from grenweech. calculated from dateFrom_ referring time with a locale spoecified by time shift 



    // ok :
    //dateTo.toISOString());// expected output: 2011-10-05T14:48:00.000Z
    let datefrom=dateFromAPI.substring(0,10);// dateFromAPI or  dateFrom_  just date : 2011-10-05 ?
    dateto=dateTo;// was : dateto=dateToUS.substring(0,10);//  just date : 2011-10-05 ?
    // convertback to us server time
    let availableTime = await publicService.getStartTimeMatrix(datefrom, dateto, serviceId, performerId, qty);// ={success: true, data: {2020-12-29: Array(0), 2020-12-30:["09:00:00", "10:00:00", "11:00:00", …]}}
    // dateFrom = '2020-03-03'
    console.log('simplybook slot matrix, datefrom: ',datefrom,' , dateto: ',dateto,', serviceid: ',serviceId,', performer: ',performerId,' data: ', availableTime);
    /*
    build loop :
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
    
    
    
    {   objMod:true,// return the std complex query  model : 
        rows:[// event list across days and hours   *ROWS
                {
                // std row
                value:"2021-01-04T13:00:00.000-08:00",
                descr:'',// or vname 
                patt:'',// the matching regex 
                // now a inflatted related bl 
                // date time exploited :
                date:"2021-01-04",
                time:"13:00",
                // the event related 
                detail:'na'
                },,,,
    
        ],
        cursor={// this is a runtime build from some case cursor template (selects day, select slot hour)!!! *CURSOR
                    resModel:{// automatically build from row   *SELITEM
                        {// we tie to intents[0], so when user match item  'disc1' storemat='disc1' (useless) but storeMId should be 0, so we match intents[0]. TO BE CHECKED 
                        patt: row.patt,// null if filtered unselectable
                        vname: row.vname, // can be the day/hour , depend from case and is according with case prompt 
                        index:7
                        },,,,
                    },
                    medSyntL:[row.vname,,,]
        },
        group={ sel:{item:null,match=vname[i]}
        }//group={sel:{item:this.intents[0]}
    
    
    } // to manage selection in child with $$xxx:> support 
    */

    // https://cloud.google.com/text-to-speech/?hl=it : vorrei prenotare oggi lunedì 04/01/2021 alle 18:30
    // https://stackoverflow.com/questions/34919631/get-date-in-italian-format-as-luned%C3%AC-gg-mm-how-to/34920046
    // https://momentjs.com/docs/
    // https://blog.logrocket.com/4-alternatives-to-moment-js-for-internationalizing-dates/

    // so test in : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    //  event = new Date(2012, 12-1, 31, 14, 59, 0); console.log(event.toLocaleString('it-IT', options)); >> "lunedì 31/12/2012, 14:59"
    var options = { 'weekday': 'long', 'month': '2-digit', 'day': '2-digit', 'year': 'numeric', 'hour': '2-digit', 'minute': '2-digit' };// substitute , with: , alle roe 
    var options1 = { 'month': '2-digit', 'day': '2-digit', 'year': 'numeric', 'hour': '2-digit', 'minute': '2-digit' };// substitute , with: , alle roe 
    // se potessi usare it-IT : var options2 = {'month': 'short', 'day': 'numeric', 'year': 'numeric', 'hour': '2-digit', 'minute': '2-digit' };// substitute , with: , alle roe 
    // or var options = {'weekday': 'long', 'month': '2-digit', 'day': '2-digit','year':'numeric'}; then add 'alle 18:30' 
    // var date = new Date().toLocaleString('it-IT', options);


    if (availableTime.success) {// BUILD the query model instance , after the items will be selected  



        let query = // ITEMS to test : rows contains bookable slot( date-time) , cursor the model to match the rows . a bookable slot is a available slot following the desidered date-time 
            // the describing  dayspan/dayBookable arrays   tells what are the bookable relative /calendar date in rows slots 
            new QueryM();// *QUERY 

        // build a datetime entity with related bl 

   

        let datas = availableTime.data;

        if (datas) {//  availableTime{  success:true,
            //                  data:{2021-01-08: Array(9), 2021-01-09: Array(0), 2021-01-10: Array(0), …}
            //               }
            // 012021 : bookable day : is the i-esimo day that is after the startday/fromday and has slot available ,  it is dayspan[i] day after the startday/fromday
            //                          if have slot with hour (>)= the desired hour (if no expressed is 800 ????) .will have a not null  pref_day_slot
            //             when desidered day move >fromday the first bookable day with calendar date >= desidered calendar day  is dayspan[curRelInDay]after the fromdate so has calendar day = calendar day of fromdate + dayspan[curRelInDay]
            //              the following ex are built with fromdate that is the 19th of march desidered day at start has the same date.

            //              >>>>   the bookable ix-esimo day after the fromdate is described by BOOKABLE DAYS ARRAYs :   dayspan,daysc,dayBookable,relDayIndex with index ix

            // nb when rebuild the selection filter  ( fills new filtered selection medSync,medSyntL,resModel obj ) we def the model to select some target slots  
            let locdate_dateFirst;// first cal day in matrix got 
            let oldc = 0, count = -1,// total slot , index of rows
                span = 0,// span days more than first slot ex examin 4 days : span=4, if only 2 have slot bDays=2
                bDays = -1,//relative day , stat at start day with 0   


                // totSlot_ = 0,// total slot got , consolidate intCount
                prefSlot;

                let  
                dayspan_ = [],//[0,3,4]relative day (day after fromDay ) bookable day with bookable slot , ex dayspan=[0,3,4] . nb dayspan[0] is the first bookable relative in rows, can be 0 or >0
                //  >>>> dayspan[ix] is the days after the fromdate of ix-esimo bookable day after the fromdate  
                // nb fromdate is :
                //      - desidered datetime (desDtatTime) day 
                //          or 
                //      - firstDay if available and > desDtatTime 
                //      >>> dayspan is the i-esimo bookable relative day against fromdate 
                //          so if dayspan[0]=0 means that the first bookable is fromdate
                //              nb clearly  this will be sure if desDtatTime==firstDay and in this case we set gotdate=true

                //      ( desidered day is the day in desidered datetime also if hours dont match !!!!! anyway try a hour match in desidered day if is bookable also if des hour dont match !)

                // so first bookable day (xi=0) is 0 day after the startday/datefirst and, according with daysc = [xi], has 14 slot available for booking and according to dayBookable  is cal day 19,
                //    the slot index in rows of the bookable slot meeting fromHour according pref_day_slot[ix] is 114 and according to relDayInd the first slot index of this day (calendar day 19) is 101 
                // second bookable day,ix=1,  is 3 day after the after the startday/datefirst ,  the calendar day is dayBookable[ix]=22 (datefrom cal day is 19) and has 1 slot bookable and the slot meeting fromhour has rows index pref_day_slot[ix]=211
                curRelInDay_ = 0,// ?? the index  ix that correspond to first bookable day when move to a new fromdate   ( after got the sched matrix rows from server is 0) , 
                //  so first  cal bookable day after desidered day das ix= curRelInDay+0, iesimo after is ix= curRelInDay + i-1, and has calendar day dayBookable[ix]
                //      so given a desidered calendar day 21th  of march we look how many days is after from fromdate ( cal day 19), so  2, so search ix : dayspan[ix]>=2 => ix=1 so   curRelInDay=ix=1, 
                //          and first bookable day is   dayspan[curRel]- 2 days after the desidered day  ( calendar 22 - calendar 21 of same month)

                //          (interesting case : given a desidered calendar day 3  of march we look how many days   after from fromdate (ex cal day 28), so  3, so search ix : dayspan[ix]>=3 => ix=1 so   curRelInDay=ix, )
                //      if we want select days meeting a new  desidered new fromHour we must rebuild all preferred hour day pointer : pref_day_slot[i] that gives for the iesimo bookable day after fromdate the rows index of slot meeting the fromhour
                // >>>  so when given a desidered day we calc curRelInDay index. the iesimo bookable day after the desidered day will be found in bookable arrays with index ix=curRelInDay+i

                daysc_ = [],//[14,1,8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable_ = [],  //[19,22,3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot_ = [],//[114,211,null],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd_ = [];//[101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate. question : first value must be 0 ?
            //




                // ***************************    definition ****************************

// >>>>>>>>>>>>><    SO the base to calc relative days is the  dateFrom_  param of start(curdate,dateFrom_,....) considered at 0 hour  utc
// nb  dateFromAPI = dateFrom_.substring(0,19); fromDate = new Date(dateFromAPI="2021-01-04T10:00:00.000 ) 4 gennaio
// so given a date='2021-11-01........' to cald the relative day call relDay(date) !
// nb as first bookable day dayspan[0] can be >=0 and the first relative  desidered day can be <=0

                ctl.slotMat = {// updates ctl , reassign slotMat    *CTL 
                    curDate:curdate.toISOString(),
                    dayspan:dayspan_ , daysc: daysc_ , dayBookable:dayBookable_, totSlot:0, bookDays:0,
                    curRelInDay:curRelInDay_ , relDayInd:relDayInd_, pref_day_slot:pref_day_slot_,
                    fromDate, //  fromDate = new Date(dateFromAPI="2021-01-04T10:00:00.000 ) 4 gennaio
                    datefrom,// ="2021-01-04"=dateFromAPI.substring(0,10);// the base to calc relative day
                    startDateTimeStamp,//   usefull to calc day difference from as in relDay("2021-01-05") returns 1 , relative days from datefrom 
                                        // is the time when in utc location  starts the day in iso format "2021-01-04"
                    fromDay, fromHour// . fromDay=4,fromHour=10 is local of fromDate ( loaded using a different locale , th educk locale !!!)
                };




            // now add function reference for rows :
            ctl.f.rows=query.rows;//   >>>>>>>>>>>>>>>>>>>>>>>>> just for this instance do just after rest call 


            // alrede have count :useless !!     i=0;// the index in building rows,.medSync same as count  but 1=cout+1 !!!

            // for each day with available booking slot
            for (let ada in datas) {// datas={ada='2020-12-30':["09:00:00","10:00:00","11:00:00",,,],,,,,}

                prefSlot = -1;//  the day slot after desidered hour
                let prefSet=false,
                day,// 9 the day cal number 
                    first = true,
                    intCount = 0;// slot in this day 
                //bDays++;ERROR must be calculated comparing utc hour with startDate (or startDate_) (that is start day utc 0 hour ) time stamp 

                bDays = ctl.f.relDay(ada);
                console.log(' parsing available slot matrix , a new date is got: ', ada, ' is ', bDays, ' days after the slot matrix start desidered data ', dateFromAPI);
                let relDayIndc=0;

                // for each slot in cur day bDays
                datas[ada].forEach(tim => {// tim="09:00:00"
                    count++; intCount++;

                    let stdT = ada + 'T' + tim;// std iso , localtime because T is specified !
                    let elap = new Date(stdT);// new Date('1995-12-17T03:24:00')// is local date 

                    /*

                    this slot has a relative position 

                    const diffTime = Math.abs(elap - dateFrom);
                    const diffDays = Math.ceil(diffTime / 86400);
                    */


                    let locdate_stdT = elap.getDate();// the cal day number
                    locdate_dateFirst = locdate_dateFirst || elap.getDate;
                    // let daysfrom_dateFrom = locdate_stdT - locdate_dateFrom;// 0,1,2 ....

                    day = elap.getDate(),// the day as 8
                        hour = elap.getHours(); // local hour , 8
                    if (!prefSet){ if(hour >= fromHour)prefSet=true; prefSlot = count;}// // take nearer:  means just before o just after . the first slot with hour >=pref hour in a bookable day 
                    if (first) { relDayIndc = count; first = false; }

                    // = ada;

                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

                    // let dtPrompt=elap.toLocaleString('it-IT', options);//  >> "lunedì 31/12/2012, 14:59"

                    /*let prompt = elap.toLocaleString('en-US', options1)// need to install it locale in nodes : npm install full-icu
                    .replace(',', ', alle ore ');
                        // example :  giovedi 15 dicembre , 17:30  oppure .....
                    */

                    let execu = false;
                    // add only at executing time if is not filtered :
                    // add only at executing time if is not filtered :
                    let dayi = it(elap.toLocaleString('us-US', { 'weekday': 'narrow' }));
                    if (dayi == 'T') { if (elap.toLocaleString('us-US', { 'weekday': 'short' }) == 'Tue') dayi = 'Martedì'; else dayi = 'Giovedì'; }
                    else { if (dayi == 'S') if (elap.toLocaleString('us-US', { 'weekday': 'short' }) == 'Sat') dayi = 'Sabato'; else dayi = 'Domenica'; }
                    let prompt_time = ' alle ore ' + tim.substring(0, 5),//  alle ore 17:45
                        prompt_d = dayi + ', ' + it_date(ada),//  giovedi, 15-12-2021
                        prompt = prompt_d + ',' + prompt_time;



                    // TODO aggingere l'espansione della data in  :  23 dicembre 2020 

                    let row = {//query.rows.push({      *ROWS
                        value: stdT,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                        patt: stdT,// 
                        descr:prompt,
                        date: ada,// '2021-01-04'
                        time: tim,
                        // old :  index: ada.substring(8, 10)// day number . when filter we take 1 represenatative each different index , so after go the matxh on index we'll match the items inter index !!!
                        index: count.toString() // new . usefull in ....?  ex in template to navigate in ctl structure ? ex medSyntL[index] o original medSyntL_[index]

                        // filtering will get all day representative after the preferred datetime !! 

                    };//);





                    /* **************   now automatically inserted by .addRow
                    // per syncronizzare meglio medsyntL e il resModel aggiungo l'array che mappa i item in index 

                    query.cursor.medSync.push(stdT);//  (**) mappa di sincronismo duale di resModel.index. maps index > itemname=row.value=stdT
                    // al list mustache assieme a dmedSync ( o pre annullare un clone ) 

                    query.cursor.medSyntL.push(// it(elap.toLocaleString('it-IT', options))// the item list to match 
                        prompt + ', '//oppure'
                    );// e l'ultimo ??????? .  list items to select . c'e' disponiilità per    :
                    // giovedi 15 dicembre alle 17 e 30  oppure ....
                    // con bu skip value if corresponding patt in null 
                    */


                    let selItem = {// query.cursor.resModel[stdT] = {// will point to rows[index].value    *SELITEM
                        prompt,//oppure',// used ??????, == medSyntL ( vmatch) ? prompt sarebbe la richiesta x ottenere il match che e' espresso come vmatch 
                        prompt_d,// 
                        prompt_time,
                        vname: prompt,// == medSyntL ?
                        patt: day, // std patt di "2021-01-04T13:00:00.000" è:  4 (the day) . but fltering will overwrite using patt_d or patt_h or patt_i depending on span and discriminating 
                        // rows date time e' entity vettoriale e il match si ha se matcho sia date che time , components della entity of name .value
                        // quindi il match si ha matchando date e time , botta unica o parziale , 
                        // - quando parziale si filtra una rappresentanza (un rappresentante day per classe day , magari di un time ipotesi) )e si fa match sulla proprieta' classe (day)
                        //      settando il patt che matche il pattern della classe day
                        // - matchata la classe day si filtra una rappresentanza di clase time/hour , magari i elenteti della classe di day matchato e si setta il patt sulla classe time/hour   
                        patt_h: hour, // 24
                        patt_hm: tim.substring(0, 5),
                        patt_d: day, // 31 
                        patt_i: dayi.toLowerCase(),// giovedì
                        //vname: row.vname,// ???
                        index: count,// (was i++ )          (**) maps stdT >  index  so rows[index].value=itemname=row.value=stdT. the inverse is  stdT=query.cursor.medSync[index]
                        execu: execu,
                        span
                    };


                    query.addRow(row, selItem, prompt, ',');

                    /* incremental process , do if performance problem
                    if(!query.cursor.resModel[stdT].execu){
                        query.cursor.resModel[stdT].execu=true;
                        query.cursor.resModel[stdT].prompt_.replace(',', ', alle ore ');
                    }*/
                });
                //  ad ogni cambio giorno , solo 
                if (intCount > 0) {// >>> ho trovato slot prenotabili nel day so is a bookable day so build BOOKABLE DAYS ARRAYs :
                    ctl.slotMat.pref_day_slot.push(prefSlot);// if defined , contains  the index  of slot in this day , having hour near the hour preference of user  (fromHour)
                    ctl.slotMat.relDayInd.push(relDayIndc);
                    ctl.slotMat.dayspan.push(bDays);//[0,3,4]relative day with slot available , dayspan[ix]= number of days from startdate of ix-esimo bookable day after fromdate  , ex dayspan=[0]  so 0 day (the start day corresponding to dateFirst )has 14 slot available 
                    ctl.slotMat.dayBookable.push(day);//[19,22,23]calendar  day with slot , ex dayspan=[0]  so 0 day (the start day corresponding to dateFirst )has 14 slot available 
                    ctl.slotMat.daysc.push(intCount);// the slots available to book  x the day dayspan[i]
                    ctl.slotMat.totSlot += intCount;

                } // + alla fine
            }

            ctl.slotMat.bookDays = ctl.slotMat.dayspan.length;// number of bookable days in the interval 
            query.ctl = ctl; // inject current  ctl permanent 
            /*
            ctl.slotMat = {// updates ctl ,     *CTL 
                dayspan, daysc, dayBookable, totSlot, bookDays,
                curRelInDay, relDayInd, pref_day_slot,
                fromDate, startDateTimeStamp,fromDay, fromHour// from date is Date()  loaded using a duck locale trans as rome local . fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
            };*/
            console.log(' simplybook:returning start  , totslot: ',ctl.slotMat.totSlot,'cal days :  ',ctl.slotMat.dayBookable,' slot x days :  ',ctl.slotMat.daysc,'query: ',query,'  selStat:', ctl.selStat);

            return query;// {query};// return
        }// ends datas 

        return null;//( ) impossible !) returns without any data bookable 


    } else {
        return null;// server cant return data 
    }

    /*
    let isVisibleOnly=false, asArray=true;
    let availUnit = await publicService.getUnitList(isVisibleOnly, asArray)
    .catch((err) => { console.error('simplybook available unit was rejected: ',err); }); // or  .catch(console.error);;
    console.log('simplybook available unit: ',availUnit);
    // Returns Array :list of service performers. If $asArray is false then method returns a map with event id as key and details object as value.
    // If parameter set to true then method returns a list sorted by 'position' property of event's details object. 
    */
    function it_date(s) {// 2021-12-31  >  31-12-2021
        //for (var i = s.length - 1, o = ''; i >= 0; o += s[i--]) { }
        o = s.substring(8, 10) + '-' + s.substring(5, 7) + '-' + s.substring(0, 4);
        return o;
    }


/* alredy got from ctl obj : let relDay=ctl.relDay;
    function relDay(xdateFromAPI) {// xdateFromAPI ='2021-01-07T10:32:00.000+01:00'; or ='2021-01-07'; sullo stesso locale da cui ho preso il startDate
        // deve tornare relday : i numeri di giorni in cui  xdateFromAPI dista da startDate, differenze dei calendar number se nello stesso mese , tra xdateFromAPI (iso format) e lo startdate , sullo stesso locale
        // probabilmente bastava fare la diff dei 2 date obj (allo steso locale)
        // poco stile !. date due date nello stesso locale , il numero di giorni tra le due e' lo stesso dei numero di giorno tra i due istanti in cui il utc e' alle ore 0 alle 2  date locale
        let xDate = xdateFromAPI.substring(0, 10) + 'T00:00:00Z';//= // "2016-02-09T00:00:00Z";
        const now = new Date(xDate);
        const nowTimeStamp = now.getTime();
        const microSecondsDiff = Math.abs(nowTimeStamp - startDateTimeStamp);
        return daysDiff = Math.floor(microSecondsDiff / 86400000);// number of day from start date 
    }*/


    function addDays(date, days) {// https://codewithhugo.com/add-date-days-js/. // date= new Date(dateFromAPI="2021-01-04T01:00:00.000+01:00");days=number of days to schift

        // use const date = new Date();const newDate = addDays(date, 10);

        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy// Date obj , to get iso do : 
    }

    function dateToISOLikeButUs(date) {// https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local  .  dateto='2021-01-07T10:32:00.000+01:00',dateToUS= 2021-01-07T10:32:00.000-08:00
        //function dateToISOLikeButLocal(date) {// https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;// 1min=60000 seconds
        const msLocal = date.getTime() - offsetMs;
        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();
        const isoLocal = iso.slice(0, 19);
        const isous = iso.replace('Z', '-08:00');// ex : 2021-01-07T10:32:00.000-08:00
        return isous;//isoLocal;
    }



}// end start 

//  common date mng section 

/* functions :
function findRelDay(ind) {// ind: a row slot index of a bookable day . return the bookable index bookInd. ex 3 means the rows is a slot with date the third bookable 

    let ij;
    for (ij = 0; ij < slotMatSt.dayspan.length; ij++) { if (slotMatSt.relDayInd[ij] > ind) break; }// find index ij=bookInd for bookable date following the date of the matched  rows index = ind
    // now ij is =bookInd+1 for bookable date following the date of the matched  rows of index ind OR  
    return ij - 1;// =bookInd
}
function findSlotAfterHour(ind, prefHour) {// ind: a row slot index of a day on which we want to the slot immediately after prefHour (integer). usually a selected rows item ! 
    if (!isNaN(prefHour)) {// is integer so set index corresponding to first slot of the day with hour just >= prefHour . if cant let ind as it comes 
        // recalc start slot matching prefHour in same day or matched slot , otherwise let pref slot the matched slot 
        //bookable index :

        return findSlotAfterHourH(findRelDay(ind), prefHour);// relDay=findRelDay(ind)

    }
    return ind;// error
}

function findSlotAfterHour_(isodate, prefHour) {// finf a slot just after prefhour in a bookable date = (or just after) , isodate='2021-01-07T10:32:00.000+01:00'; or ='2021-01-07';
    let inf = findBookableInfo(relDay(isodate));// 
    let got = true;// isodate is a bookable date , or we have only a after date we can book 
    if (inf.after < 0) {// no bookable date =/after the isodate in rows matrix 
        return null;
    } else {
        if (inf.after == 0) { got = true; return findSlotAfterHourH(inf.bookAfter_bookInd, prefHour); }
        else { got = false; return findSlotAfterHourH(inf.bookAfter_bookInd, prefHour); }
    }
}

function findSlotAfterHourH(bookInd, prefHour) {       // composition Helper , from bookable bookInd=3 ( third bookable day after start date)  returns the rows index of slot that meet (>=) prefHour=16   
    // now ij is =bookInd for bookable date following the date of the matched  rows 

    if (!isNaN(pref)) {
        let eDay;// the row index of first bookable day > preferred day or endoffile/length. first rows index of slot with a bookable date immediately after of the selected bookable day : its for stop the for !!
        let ij = bookInd + 1;
        if (ij < slotMatSt.dayspan.length) eDay = slotMatSt.relDayInd[ij]; else eDay = qq.rows.length;
        let fs = slotMatSt.relDayInd[ij - 1];// fs  : rows index of first slot of the bookable day on which find the hour next
        for (ij = fs; ij < eDay; ij++) {// for all row index from the bookable day before the following bookable day of  . scan rows slot from the first slot (fs)of the bookable day on which find the hour next to prefHour. eDay stops the for !
            let pref = parseInt(qq.rows[ij].time.substring(0, 2));// .time:"10:00:00"

            if (pref >= prefHour) break;// stop when find first  slot with a hour after prefHour


            return ij;
        }
    } else return null;
}







function findBookableInfo(relDay) {// ex 4 , 4 days after the start date theat is the first bookable date on rows 

    let ij, prev = 0, after = 0;// prev , 0 : is a bookable, -2  there are a bookable 2 days before ,   after : 3 , the first bookable is 3 days after 
    let bookAfter_rel,// the relative day of the first(or got) after bookable
        bookAfter_rowInd = -1,// the rows index of the first slot of ater bookable 
        bookAfter_bookInd;// the bookable index of first after bookable (or the got bookable if after=0), -1 if uot of rows 

    for (ij = 0; ij < slotMatSt.dayspan.length; ij++) { if (slotMatSt.dayspan[ij] > relDay) break; }
    if (ij == slotMatSt.dayspan.length) {
        // relDay after the max date in rows 
        prev = slotMatSt.dayspan[ij - 1] - relDay;// <0 !
        after = -1;
        bookAfter_rel = bookAfter_rowInd = null;
        bookAfter_bookInd = -1;
    } else {// ij>0 as by def slotMatSt.dayspan[0]=0
        if (slotMatSt.dayspan[ij - 1] == relDay) {// the relDay is bookable , find info at index bookInd=ij-1 
            prev = 0; after = 0;
            bookAfter_rel = relDay; bookAfter_rowInd = relDayInd[ij];
            bookAfter_bookInd = ij;
        } else {// the relDay is not bookable , there are a previous bookable (rel=slotMatSt.dayspan[ij-1]) and a after (slotMatSt.dayspan[ij]) . find info for after day

            prev = slotMatSt.dayspan[ij - 1] - relDay;// <0 !
            after = slotMatSt.dayspan[ij] - relDay;//>0
            bookAfter_rel = slotMatSt.dayspan[ij]; bookAfter_rowInd = relDayInd[ij];
            bookAfter_bookInd = ij;
        }
    }
    return { after, prev, bookAfter_rel, bookAfter_rowInd, bookAfter_bookInd };
}

function findSlotAfterDay_Hour(relDay, prefHour) {// relDay=4 :  4 days after the start date , prefHour= 16 , returns the rows index of booable slot with day >= relDay and hour after  prefHour
let bookInd;
if ((bookInd = findBookableInfo(relDay).bookInd) >= 0) {// there are a bookable after or same rel date in rows 
    return findSlotAfterHour(bookInd, prefHour);// returns the rows index of booable slot with day >= relDay and hour after  prefHour
}
return null;
}
*/

/*
let ctl_f={// like the prototype are attached to a new obj , we use this 'prototype' and atact to a data obj using Object.assign()  or just set the session/aiax data using session()
// used to build new seletors on a multi turn slot matrix query model
rows:null,
slotMat:null,
session:function(rows_,slotMat_){// inject aizx session data x a slot matrix query
   if(slotMat_){ // we must be sure rows is from a slot matrix query 
       this.rows=rows_;this.slotMat=slotMat_;    }
},......

*/

let func_ctl={


findRelDay:function (ind) {// ind: a row slot index of a bookable day . return the bookable index bookInd. ex 3=findRelDay(33) means the rows[33] is a slot with date the third bookable 

    let ij;
    for (ij = 0; ij < this.ctl.slotMat.dayspan.length; ij++) { if (this.ctl.slotMat.relDayInd[ij] > ind) break; }// find index ij=bookInd for bookable date following the date of the matched  rows index = ind
    // now ij is =bookInd+1 for bookable date following the date of the matched  rows of index ind OR  
    return ij - 1;// =bookInd
},
findSlotAfterHour:function (ind, prefHour) {// ind: a row slot index of a day on which we want to the slot immediately after prefHour (integer). usually a selected rows item ! 
                                            // return null se non c'e' uno slot dopo il prefhour 
    if (prefHour!=null&&!isNaN(prefHour)) {// is integer so set index corresponding to first slot of the day with hour just >= prefHour . if cant let ind as it comes 
        // recalc start slot matching prefHour in same day or matched slot , otherwise let pref slot the matched slot 
        //bookable index :

        return this.findSlotAfterHourH(this.findRelDay(ind), prefHour);// relDay=findRelDay(ind)

    }
    return ind;// error
},
findSlotAfterHour_:function (isodate, prefHour) {// find a slot just after prefhour in a bookable date = (or just after) , isodate='2021-01-07T10:32:00.000+01:00'; or ='2021-01-07';
    let inf = this.findBookableInfo(this.relDay(isodate));// 
    let got = true;// isodate is a bookable date , or we have only a after date we can book . can be put in return if needed in future
    if (inf.after < 0) {// no bookable date =/after the isodate in rows matrix 
        return null;
    } else {
        if (inf.after == 0) { got = true; return this.findSlotAfterHourH(inf.bookAfter_bookInd, prefHour); }
        else { got = false; 
            return this.findSlotAfterHourH(inf.bookAfter_bookInd, prefHour); }
    }
},

findSlotAfterHourH:function (bookInd, prefHour) {       // composition Helper , from bookable bookInd=3 ( third bookable day after start date)  returns the rows index of slot that meet (>=) prefHour=16   
                                                        // return null if there are no slot after prehour !
    // now ij is =bookInd for bookable date following the date of the matched  rows 

    if (prefHour!=null&&!isNaN(prefHour)) {
        let eDay;// the row index of first bookable day > preferred day or endoffile/length. first rows index of slot with a bookable date immediately after of the selected bookable day : its for stop the for !!
        let ij = bookInd + 1;// cerco il primo slot del relative day successivo e vado al precedente slot :( sarà l'ultimo slot del bookind rel day !)
        if (ij < this.ctl.slotMat.dayspan.length) eDay = this.ctl.slotMat.relDayInd[ij]; else eDay = this.rows.length;
        let fs = this.ctl.slotMat.relDayInd[ij - 1];// fs  : rows index of first slot of the bookable day on which find the hour next
        for (ij = fs; ij < eDay; ij++) {// for all row index from the bookable day before the following bookable day of  . scan rows slot from the first slot (fs)of the bookable day on which find the hour next to prefHour. eDay stops the for !
            let pref = parseInt(this.rows[ij].time.substring(0, 2));// .time:"10:00:00"

            if (pref >= prefHour) break;// stop when find first  slot with a hour after prefHour
        }

        if(ij<eDay)    return ij;// il i-esimo bookable day ha uno slot con hour >= a prefhour 
        }
    return null;// il i-esimo bookable day non ha uno slot con hour >= a prefhour, il day potrebbe avere hour prima ma non podo il prefHour 
},

findSlotNearHourH:function (bookInd, prefHour) {       // composition Helper , from bookable bookInd=3 ( third bookable day after start date)  returns the rows index of slot that is just >= or just < of prefHour=16   
    // return null if there are no slot after prehour !
// now ij is =bookInd for bookable date following the date of the matched  rows 

if (prefHour==null||isNaN(prefHour))prefHour=7;// 7 a.m.
if (prefHour!=null&&!isNaN(prefHour)) {// sure
let eDay;
if((bookInd+1)>=this.ctl.slotMat.relDayInd.length) eDay =this.rows.length;else eDay=this.ctl.slotMat.relDayInd[bookInd+1];
let fs = this.ctl.slotMat.relDayInd[bookInd];// fs  : rows index of first slot of the bookable day on which find the hour next
for (ij = fs; ij < eDay; ij++) {// for all row index from the bookable day before the following bookable day of  . scan rows slot from the first slot (fs)of the bookable day on which find the hour next to prefHour. eDay stops the for !
let pref = parseInt(this.rows[ij].time.substring(0, 2));// .time:"10:00:00"

if (pref >= prefHour) break;// stop when find first  slot with a hour after prefHour
}

if(ij<eDay)    return ij;// il bookInd-esimo bookable day ha uno slot con hour >= prefHour 
else return eDay-1;// il bookInd-esimo bookable day ha uno slot con hour < prefHour 
}

},





 findBookableInfo:function(relDay) {// ex 4 , 4 days after the start date theat is the first bookable date on rows 

    let ij, prev = 0, after = 0;// prev , 0 : is a bookable, -2  there are a bookable 2 days before ,   after : 3 , the first bookable is 3 days after 
    let bookAfter_rel,// the relative day of the first(or got) after bookable
        bookAfter_rowInd = -1,// the rows index of the first slot of ater bookable 
        bookAfter_bookInd;// the bookable index of first after bookable (or the got bookable if after=0), -1 if uot of rows 

    for (ij = 0; ij < this.ctl.slotMat.dayspan.length; ij++) { if (this.ctl.slotMat.dayspan[ij] > relDay) break; }
    if (ij == this.ctl.slotMat.dayspan.length) {
        // relDay after the max date in rows 
        prev = this.ctl.slotMat.dayspan[ij - 1] - relDay;// <0 !
        after = -1;
        bookAfter_rel =  null;
        bookAfter_rowInd = -1;
        bookAfter_bookInd = -1;
    } else {// ij>0 as by def this.ctl.slotMat.dayspan[0]=0
        if (this.ctl.slotMat.dayspan[ij - 1] == relDay) {// the relDay is bookable , find info at index bookInd=ij-1 
            prev = 0; after = 0;
            bookAfter_rel = relDay; bookAfter_rowInd = this.ctl.slotMat.relDayInd[ij];
            bookAfter_bookInd = ij;
        } else {// the relDay is not bookable , there are a previous bookable (rel=this.ctl.slotMat.dayspan[ij-1]) and a after (this.ctl.slotMat.dayspan[ij]) . find info for after day

            prev = this.ctl.slotMat.dayspan[ij - 1] - relDay;// <0 !
            after = this.ctl.slotMat.dayspan[ij] - relDay;//>0
            bookAfter_rel = this.ctl.slotMat.dayspan[ij]; bookAfter_rowInd = this.ctl.slotMat.relDayInd[ij];
            bookAfter_bookInd = ij;
        }
    }

    // example: dayspan=[0,3,4] , findBookableInfo(2)>{-2,1,null,22,1}
    return { after, prev, bookAfter_rel, bookAfter_rowInd, bookAfter_bookInd }; 



},

findSlotAfterDay_Hour:function (relDay, prefHour) {// relDay=4 :  4 days after the start date , prefHour= 16 , returns the rows index of booable slot with day >= relDay and hour after  prefHour
let bookInd;
if ((bookInd = this.findBookableInfo(relDay).bookInd) >= 0) {// there are a bookable after or same rel date in rows 
    return this.findSlotAfterHour(bookInd, prefHour);// returns the rows index of bookable slot with relday >= relDay and hour after  prefHour
}
return null;
},

// WERE DEFINED IN start()

// 
relDay:function (xdateFromAPI) {// xdateFromAPI ='2021-01-07T10:32:00.000+01:00'; or ='2021-01-07'; sullo stesso locale da cui ho preso il startDate
        // deve tornare relday : i numeri di giorni in cui  xdateFromAPI dista da startDate, differenze dei calendar number se nello stesso mese , tra xdateFromAPI (iso format) e lo startdate , sullo stesso locale
        // probabilmente bastava fare la diff dei 2 date obj (allo steso locale)
        // poco stile !. date due date nello stesso locale , il numero di giorni tra le due e' lo stesso dei numero di giorno tra i due istanti in cui il utc e' alle ore 0 alle 2  date locale
        let xDate = xdateFromAPI.substring(0, 10) + 'T00:00:00Z';//= // "2016-02-09T00:00:00Z";
        const now = new Date(xDate);
        const nowTimeStamp = now.getTime();
        const microSecondsDiff = nowTimeStamp - this.ctl.slotMat.startDateTimeStamp;// Math.abs(nowTimeStamp - this.ctl.slotMat.startDateTimeStamp);
        return daysDiff = Math.floor(microSecondsDiff / 86400000);// number of day from start date 
    }
}

/* techicques primer : woking with session data_ :
object with instance data to work on :
    // nb data_ >  rows,slotMat


closure :
ctl_func=function (data_){ 
    let data=data_;
    return func_ctl={f1,f2,f3}

}

let ctl_f=function(){.....};// the creator
ctl_f.prototype=f1;
slotHelpers= new ctl_f(data_)

slotHelpers=object.assign{{},data_,func_ctl} >> use this as alredy done in onchange.js !
 so : ctl_=slotHelpers=object.assign{{},rows,slotMat,func_ctl} 
    or
    ctl_=slotHelpers=object.assign{{},ctl,func_ctl} ;slotMat=ctl_.slotMat;  slotMat.fromDate=.... ctl_.relDay()

 anyway i must refears meta data using a obj : 
  ctl.slotMat = {// updates ctl ,     *CTL 
                dayspan, daysc, dayBookable, totSlot, bookDays,
                curRelInDay, relDayInd, pref_day_slot,
                fromDate, startDateTimeStamp,fromDay, fromHour// from date is Date()  loaded using a duck locale trans as rome local . fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
            };

            so change value using slotMat.fromDate and not using fromDate !!!!!!!!!!!!!!

*/
// end common date mng

async function book(vars, form_whInst, form_wheres, qs, rest) {//
    // 取得Token
    let eventId, unitId, slot = qs.slot, customer = qs.customer, tele = qs.tele, sc = 0;// sc=0 return problem
    let qq = qs.curStatus,booked_start,booked_end,bId=777,bookingsInfo;
    console.log('inside api simplybook, book try to book  , slot :', slot, ' cust tele: ', tele, ' cust : ', customer, ' status: ', qq);
    // some sort of cache     let token = await auth.getToken().catch( (err) => { console.error(' simplybook  got ERROR : ',err); }); 
    if (token) {
        sc = 1;
        // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
        console.log(token.data)
        // 建立Public Service
        let publicService = simplyBook.createPublicService(token.data)
        let additionalFields = null;//{'6740d3bce747107ddb9a789cbb78abf3':'value1',b0657bafaec7a2c9800b923f959f8163:'value2' }; 
        clientData = {
            name: 'Client name',
            email: 'client@email.com',
            phone: '+13152108338'
        };
        let time = '15:00:00', myday = '2020-12-31';
        let telN = parseInt(tele);
        if (telN!=null&&!isNaN(telN)) { clientData.phone = telN; }else sc=0;// n/a if  if tele is missing 
        if (customer) clientData.name = customer;

        // qq ...   eventId, unitId
        eventId = qq.ctl.serviceId; unitId = qq.ctl.unitId;
        if (eventId && unitId && slot&&sc>0) {
            myday = slot.substring(0, 10); time = slot.substring(11);
            let bookings=[];bookings.push({start_date_time:myday+'T'+time,bId,end_date_time:myday+'T'+time});// used in debug as response 
            if(!debugL)
            bookingsInfo = await publicService.book(eventId, unitId, myday, time, clientData, additionalFields)
                .catch((err) => { console.error('simplybook: book() , a slot matrix booking was rejected: ', err); sc = 0; }); // or  .catch(console.error);;
            else bookingsInfo={success:true,data:{bookings}};
            // seems that : nb in case of err the rejected promise run the .catch then the following code is launched with null await value !
            console.log('simplybook book request feedback : ', bookingsInfo);
            //  bookingsInfo.then((val)=>{console.log('simplybook booked data',val);});
            if(!bookingsInfo)sc=0;else if(bookingsInfo.success){let book_=bookingsInfo.data.bookings[0];booked_end=book_.end_date_time;booked_start=book_.start_date_time;bId=book_.bId}else sc=0;
        }
    }
    let name = 'mod_bookSt', row;// 
    if (sc > 0) {
        // alredy set in ctl : qq.selStat=1;// 1: day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)
        //let cchh=chroot;
        row = { value: 'booked', descr: 'è stata prenotata', data: bookingsInfo ,booked_start,booked_end,bId};

        //BookEnt(name,row_)

        // returns to endpoint that provide to returns the expected val to convo matchers caller ( here a entity matcher , so condition macro set it with : 
        // 
        // )
        return { chroot: 'booked', query:new BookEnt(name, row) };// returns the complex query with selection definition prepared and the redirect th/child that will perform the selection  
    } else {
        row = null;
        return {
            chroot: 'n/a', // the relay/redirection  to the managing thread , both in case of match and in case to refine/reset selection filters 
            query: new BookEnt(name, row)// error because row is null and in convo  try to set model also with a null row !
        };
    }
}

const covidCtl={};

async function initCovid(vars, form_whInst, form_wheres, qs, rest) {// consider only rest_,appcfg .

}

async function fixedbooking(vars, form_whInst, form_wheres, qs, rest) {// consider only rest_,appcfg .

}

async function simplybooking(vars, form_whInst, form_wheres, qs, rest) {// consider only rest_,appcfg .
    /* general logic
     this multi turn multi query selector ctl 
     - according to state,selStat,  
     - check the pending selection,match,  and accordins to action proposed ,selAction, will do 
     - a action (bl) and sets a new status and 
     - response (prompts,groupvars(context x next templates) ,complete/redirect/routings) 
    
    selStat, // the status of the matching (selecting ) process managed by this aiax ctl 
            match, groupsel, inst,// rindondant copy ?
            selAction;
    
    

structuring 

helpers
    helper1=start(dateFrom_, inter,ctl)
            ctl.slotMat = {dayspan, daysc, dayBookable, totSlot, bookDays,
                            curRelInDay, relDayInd, pref_day_slot,
                            fromDate, fromDay, fromHour};


    setHourSel(index_, isodate,prefHour)

    
    getPerfs(form_wheres, qc)  >>>> add ctl
             query = new QueryM()
             query.ctl=ctl
             return query
            

    

    .....

simplybooking
    qq = qs.curStatus,// the passed last query obj request to this controller , at init is null
    ctl=query_.ctl  >>> Object.assign(query_.ctl,ctl_f)
    case on selStat
        if(!qq): getEvent
                getEvents()

                qq = await getEvents();// build ctl structure , fill simple query model 
                chroot = 'th_ServiceSel';// the th/ask to select the service

        -9 :setPerformerSel(form_wheres, qs, rest) {// after coming back with a selected service , build the performer selector with the same status  query.ctl.eventSt
                selStat = -8;// initial status on the fsm recover a event (service/performer)  structure 
                qc = ctl= qq.ctl;// the ctl status injected on query model 
                // new qq injecting th updated ctl
                qq = await getPerfs(form_wheres, qc);// build ctl structure , fill simple query model 
                qc.selStat = -7;
                chroot = 'th_PerfSel';// set routings to the th/ask to select the query model returned (peformer list)



        -7 firstReq(fromDate,desDtatTime,gotdate)
                // new qq injecting th updated ctl
                qq = await start(desDtatTime, inter,ctl);// fill complex multi turn multi filter/selector query model . query for many turn selecting , used also by 
                chroot = 'th_3daySel';// complete
        -5 ....
        0: avoid 
        1: setHourSel(index_, isodate,prefHour)
                redefine selector on coming qq


    return {chroot, query: qq)






    */

    /* review 012021

    form_whInst: the form obj :
        - mod_date_des  model , its value is a datetime key 
        - .......

    qs: the url qs in macro :
        - curStatus this query obj status . the object on which this ctl is working in multiturn process
            specifically:
                qs.curStatus=queryobj.param
                so mainly :
                param={rows,cursor,group,ctl} . ctl is the real status of this multiturn aiax ctl
        - selAction , the action requested ( event driven status machine. the fsm is managed with event to move status on. see ..... )
            so mainy :
            the ctl proces has a integer status number :  selStat = qq.ctl.selStat;// cur status of selection process
            - every selStatus will define a process to move on the fsm  , depending on event requested by user : selAction 

    */


    // old : 
    // let desDateTimeEntityMatch=form.mod_date_des;// form.thenameofentity;
    //  let desBookingDate,desBookingSlot;// calc from desDateTimeEntityMatch !!!!
    console.log('\n Simplybooking book ctl received form instance where : ', form_whInst,' qs: ',qs);
    // now rest on simplybooking to find available slot on desBookingDate
    // so form_whInst={value,date,time}  ?????
    // calc start(dateFrom,dateTo )

    let qq = qs.curStatus,// the passed last query obj request to this controller , at init is null
        desDtatTime,// isodate '2021-11-31'
        chroot,// the complete directives : will be used as redirection url in ask relay 
        sc = 0,// the number of (filtered) item to select set in  medSync,medSyntL,resModel obj
        prefHM,// '23:33'
        prefDay,// old , dont use it ! 31   ???? 
        prefRelDay,// rel preferred day  asked by user in current turn 
        prefHour, prefHour_,// integer calendar 
        hou;// target hour ??

        // extrack preferred datetime Duck
        if (form_whInst && form_whInst.mod_date_des && form_whInst.mod_date_des.value) {// the user select performaer and asked a preferred date 

            desDtatTime = form_whInst.mod_date_des.value;// local (+01) but duckling presented as was US local "2016-02-09T00:00:00-08:00" , the new request/desidered  datetime about the query


            // old :
            // 2 cases : 
            // 1: a new query > build a new query/param model obj 
            // 2: a current query update > get status and goon to respond to the new request 
            //      ex: if the status is 0 ( day/prefhour to match ) and new req is day matched , a new hour is requested > go to selAction n2 ......
            //      status is a session var  that we put inside the query model
            //      the event associate the input to a function that will se the status , then give selAction/output and set the new status 
            // event means that from the input we can test what function to call to process the input on the current status  usually the test try to see if the function has the condition to process the input data
            // in altre parole l'imput prima ancora di vedere lo status  dichiara o implicitamente determina la funcion/operazione/servizio che lo processa in funzione dello stato 
            // 

            // ancora : nel processare un input , viene definito o desunto implicitamente seguendo un   generale check (framework o level 1 of bl )  al verificarsi di alcune match 
            //      quando l'evento si materializza si triggera la funzione/callback  che lo gestisce che puo al suo interne definire alri eventi gestiti da altri call back (asincroni  se uso  chiamate di sistema che gestisce le code di eventi)

            // in parole povere qui nel controller che e' dedicato a navigare un complex model  gestisco eventi che sono determinati/raccolti dal bot e qui processati 
            // - tenendo conto dello status imbeddato nel query da processare  
        }


    /* Metodo per aggiornare il user preferred datetime  
        see AAA,
        definition :
        - prefHour_=qs.hour_pref () the preferred hour in not null current  day (qq.ctl.selDayId=qq.rows[matInd].date;) estimation algo
        - qs.day_pref estimation of preferred calendar day : NOT USED ANYMORE > in future use a context estimation algo qs.datetime_pref or qs.date_pref  

        - desDtatTime  the duck preferred datetime in iso format 
        - prefDay the preferred calendar day (avoid it )
        - prefRelDay : the relative (vs fromDate) preferred day 

        >>> so the preferred datetime is defined by :
        prefHour  : int  or prefHM = '06:00', usually set to hour_pref or desDtatTime,substring() . used in 3hours selection if 3hours sel dont match and desDtatTime qualify,  we can take  prefHour = desDtatTime.substring() 
                                                                                                    otherwise we can try a new hours sel starting from prefHour
        prefRelDay : relative days of desDtatTime from fromDate . used to switch to 3days selector if different from qq.ctl.selDayId  but 
                                                                                        if qs.day_pref  exist (=prefHour) desDtatTime  must be qualified to force 3daysselector otherwise reset 3hourssel
                                                                                         



    */
let func_ctl_,
ctl; // NB NB ctl extension , should be called ctlExt  extended with f in which there is  a ctl clone 
if(qq){// 042021
    if (qq.ctl.selStat == -7) {
        // clone so we can restart at selStat=-7 !
        let qq_cl=Object.assign({},qq);// soft clone !!!efficient ???
        qq=qq_cl;
        let qq_ctl=Object.assign({},qq.ctl);// soft clone !!! efficient ???
        qq.ctl=qq_ctl;

    }





  let 
 // myctl=Object.assign({},qq.ctl);// a clone , so avoid circular obj but f  cant see updated ctl values !!! 
  myctl=qq.ctl;// circular . warning very dangerous !!!
  // concept error   extend ctl with f and just call qq.ctl.f.relDay(desDtatTime.substring(0, 10) but reference using ctl.x=this.ctl there f.init(ctl) will
   func_ctl_=Object.assign({},{rows:qq.rows,ctl:myctl},func_ctl);// make rows and ctl available to func, rows will be added as query is created in firstReq{...start();...}
   ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
   // TODO probably set directly ctl so is done here and can leave post set in many parts 
}

   


    if (!qs.prefDuck) {// preferred policy, duck is desDtatTime, prefer duck instead of qs....


        if (qs.hour_pref) {
            prefHour_ = parseInt(qs.hour_pref);// rettifica il preferred hour se c'e entity specifica piu aggiornata .hour_pref , se disponibile
            if (prefHour_) if (prefHour_ < 10) prefHM = '0' + prefHour_ + ':00'; else prefHM = prefHour_ + ':00';

                // check if duck get a date time when hour_pref detected , 
                // so if a new desidered datetime is got but if less  then 2 integer number or a week day and qs.hour_pref we ll discard desDtatTime
                // if we are in 3 hour selection state = 2
                // so keep track of prefHour _ :
                prefHour=prefHour_;


            if (desDtatTime) {



                prefDay = parseInt(desDtatTime.substring(8, 10));// old staff


                if(qq&&qq.ctl.slotMat&&qq.ctl.slotMat.fromDate)
                prefRelDay=qq.ctl.f.relDay(desDtatTime.substring(0, 10));// was error : diffDay(slotMat.fromDate.substring(0,10),desDtatTime.substring(0,10));
                else prefRelDay=null;

            }else prefRelDay=null;;// use qs.datetime_pref



        } else if (desDtatTime) {//  no qs.hour_pref) estimation ,  altrimenti se ora diversa 00  predi il desiered hour 
            //  hour is >0 !
            if (desDtatTime.substring(11, 13) != '00') {
                prefHM = desDtatTime.substring(11, 16);
                prefHour = parseInt(prefHM.substring(0, 2));
            }
            prefDay = parseInt(desDtatTime.substring(8, 10));
            if(qq&&qq.ctl.slotMat&&qq.ctl.slotMat.fromDate)
            prefRelDay=prefRelDay=qq.ctl.f.relDay(desDtatTime.substring(0, 10));//diffDay(slotMat.fromDate.substring(0,10),desDtatTime.substring(0,10));
            else prefRelDay=null;
        }
    } else {
        if (desDtatTime) {// prevale desDtatTime : altrimenti se ora diversa 00  predi il desiered hour 
            //  hour is >0 !
            if (desDtatTime.substring(11, 13) != '00') {
                prefHM = desDtatTime.substring(11, 16);
                prefHour = parseInt(prefHM.substring(0, 2));
            }
            prefDay = parseInt(desDtatTime.substring(8, 10));
            if(qq&&qq.ctl.slotMat&&qq.ctl.slotMat.fromDate)
            prefRelDay=prefRelDay=qq.ctl.f.relDay(desDtatTime.substring(0, 10));//diffDay(slotMat.fromDate.substring(0,10),desDtatTime.substring(0,10));
            else prefRelDay=null;
        } else {
            if (qs.hour_pref) {
                prefHour = parseInt(qs.hour_pref);// rettifica il preferred hour se c'e entity specifica piu aggiornata .hour_pref , se disponibile
                if (prefHour) if (prefHour < 10) prefHM = '0' + prefHour + ':00'; else prefHM = prefHour + ':00'



            }
        }

    }

 

    /* https://www.toptal.com/software/definitive-guide-to-datetime-manipulation
    date = new Date("2016-07-27T07:45:00Z"); iso with time zone UTC
    date = new Date("2016-07-27"); iso with time zone UTC as default
    However, you can run into trouble when you do not provide the time zone explicitly!
    
    const date1 = new Date("25 July 2016");
    const date2 = new Date("July 25, 2016");
    
    Either of these will give you 25 July 2016 00:00:00 local time.
    
    If you use the ISO format, even if you give only the date and not the time and time zone, it will automatically accept the time zone as UTC.
    */

    /*  start() return interface : 
    let qq=start(form_whInst.value,inter)={
         query,// the query std model 
         dayspan,//[0,3,4]relative day with slot , ex dayspan=[0]  so 0 relative day (the start day corresponding to dateFirst )has some (3)  slot available 
               // first bookable day and last bookable day are first and last entry
         daysBookable,//[19,22,23]calendar  calendar day with slot , ex dayspan=[0]  so 0 relative day has a calendar number 19 ( ex 19th of december )
         daysc,//[3,2,4] the slots available to book for the relative day  so 0 relative day (the start day corresponding to dateFirst )has 3 slot available 
         totSlot,// in the interval we have a total of totSlot to book 
         pref_day_slot, // [14,16,15] the row bookable slot index just after the desdered hour, so 14 is the index of the slot bookable just after the desidered hour  in relative day 0 
         bookDays,// number of bookable days in the interval ,the relative number is in dayspan[]  , the calendar day is in dayBookable[] ,ordered by incremmenting
         fromDate,fromDay,fromHour// fromDate is desidered Date()  loaded using a duck locale. fromDay,fromHour is local of formDate ( loaded using a different locale !!!)
       };
    */



    let// selStat, // the status of the matching (selecting ) process managed by this aiax ctl 
        match, groupsel, inst,// rindondant copy ?
        selAction;

   // let ctl,func_ctl_;// used in handlers of slot matrix query 

    // qq = qs.query;// recover the model under selection process, it is the matches[entity].param , that can be selected or not by user matching (matches[entity].param.match/instance)
    // if matched we goon knowing .param building a new refining match to do from the current status selstat
    // if dont match we can see if the user matched some flag and  obj , that are accettable directives and request to build the selection , in addition to the main form request datetime desDtatTime


    if (qq) {// a model is alredy filled so we have a ctl status 
        //  the user SELECTED ($$querymodel:>selectmodel)the filtred selection querymodel OR express a different action selAction
        // querymodel : qq=matches.querymodel.param={match,matched,instance,index,
        //                                          rows,cursor,group
        //                                          ctl:{}, // this controller status
        //                                          }  see QueryM that was then inserted in matches 

        // no more see in specific handlers  :      if(qq.ctl)Object.assign(qq.ctl,ctl_f);// add prototype functions 

        selStat = qq.ctl.selStat;// cur status of selection process
       // console.log(' simplybooking book ctl found ctl status : ', selStat, ' so  according to action ', selAction, ' its handler will be fired ');

        //selStat = qq.ctl.selStat;// cur status of selection process
        match = qq.match; inst = qq.instance;// the proposed selection was matched 
        groupsel = qq.group.sel;

        selAction = qs.selAction;// a user request that is tied to a new way to give prompt and collect results ( event programming)  to do some matching different from default method followed by selStat 0 ( day , the, hour ) 
        // like a aiax param to get a updated query from page ctl , no more as a ctl attribute !!
        // usually not null if dont match, so match=false
        // TODO calc current curRelInDay because the preferred date now has a relative val respect to start date of the downloaded matrix >=0, not 0 !! ex startday=22 matchday=24  so curRelInDay=2 ! (calc via instance.day)
        console.log(' simplybooking ctl found ctl status : ', selStat, ' so  according to action ', selAction, ' its handler will be fired ');
        if (!selAction) selAction = 0;// no secial action requested as we probably matched the def goon as std
        // ex  user requested pomeriggi ( and match or not the day ) or interval or some week day ....


        // ************* FSM
        // fsm-mdp  see article in mdpArticle folder 
        //  in dialog management each status (vars currently matched) and its output , the prompt (depend statically by matches) depending from user concept matches that give to bot the knowledge of the user choices and objectives ( observations ) 
        //  on matched on ask so its derived by status ) has a next status calculated using the new matched concept . 
        // very often one of the concept or some concepts set the function (user intention helper o event handler) used to calc the  status and associated new output 
        // new output


        if (selStat == -9) {// the ctl has alredy set the even/service structure   query.ctl={eventSt}, and tryed to selected  the event/service , now checking that service is got, must select  the performer using the same structure 

            // qq.match = qq.matched = null;// >>>>  ONLY in case of matched result MUST be reset to match  
            // qq.group.sel = qq.instance = null; // also the copied in group (needs ?)


            if (match) {


                qq.ctl.serviceId = inst.id;// store the match as status property  at first level , used to set slot matrix   ST2
                if (inst.id) await setPerformerSel(form_wheres, qs, rest);// danger 0 
            }
            else {// cant be 
             // must returned in final   return null;
             console.error(' cant be here ');
            }



        } else if (selStat == -7) {// the ctl has alredy set the even/service structure and unit list ctl   now can request action to :
            // - selAction 0 (def) :  register a selection ( match ) so we can goon on choose the datetime slot 
            // - selAction 1 (def) : update unit list ... can also be matched ?

            // qq.match = qq.matched = null;// >>>>  ONLY in case of matched result MUST be reset to match  
            // qq.group.sel = qq.instance = null; // also the copied in group (needs ?)
            let next;

            // clone so we can restart at selStat=-7 !
            //let qq_cl=Object.assign({},qq);
            // qq=qq_cl;

            if (match && selAction != 1) {


                qq.ctl.unitId = inst.id;// the Unit Id selected . store as status property  at first level , used to set slot matrix    ST1


                // >>> AAA set fromDate : the date on wich calc relative day 
                //      example fromDate = 2000-09-01  so if dayspan=[1,3,4] the first bookable day has relative=1 and is the 2000-09-02
                //           2000-08-31 is relative=-1

                    // if we already got the first date available ( looking in  
                    let sess_firstdate,// array of  predownloaded fist date  x prbably unit to select 
                        sel=1,// 1 3 day sel ,2 hour sel 
                        detcaseprompt,//=case
                        gotdate = false,// gotdate means we can propose a first day proposal because the prederred misses or meets the predownloaded fist date  ,
                        //                   while wailing x full matrix downloaded 
                        dontgotdate = false,
                        myd;// ?
                        let firstDateNA=true,// firstdate not available
                            fromDate;// start day for matrix download . if null firstReq() will set currentdate
                    // firstxUid= await hwSession[ctl.curKeyList.first3date]].Uid ='20211231' in local time 

                    
                        fromDate=desDtatTime;// default can be null , in this case it will be set as currentdate

                        // now updates fromDate=desDtatTime  if we know firstDate we can say if surely desDtatTime is bookable (firstDate == desDtatTime >>  )
                if (qq.ctl.curKeyList.first3date && (sess_firstdate = hwSession[qq.ctl.curKeyList.first3date])) {// was requested a pre download of first date for probale selecting unit ?
                    let firstDate, firstDate_; 
                    if (sess_firstdate[qq.ctl.unitId]) {
                        firstDate_ = await sess_firstdate[qq.ctl.unitId];// a promise, resolve in '20211231' in local time 

                        if (firstDate_.success) {
                            firstDateNA = false;
                            firstDate = firstDate_.data;// firstDate_.substring(0, 4) + '-' + firstDate_.substring(4, 6) + '-' + firstDate_.substring(6, 8);// iso short '2021-12-31' ; was pre donloaded firstbook selecting unit got ?if so we have alredy the first proposal 
                            //if(desDtatTime)myd=desDtatTime.substring(0,4)+desDtatTime.substring(5,7)+desDtatTime.substring(8,10);// if selecting the unit user set preferred/desidered date time we can onfirm the date proposing a hour selection or a new 3 day proposal
                            //  if if no preferred we can immediately propose pre downloaded while waiting for full matrix bookable slot x unit selected 

                            if (!desDtatTime) {
                                //  desDtatTime = firstDate + 'T00:00:00-08:00';// propone the predowloaded first date hour select , us local as duckling 
                                console.log(' simplybook: setting matrix fromdate, no desDtatTime but have firstdate so set it : ', firstDate);
                                fromDate = firstDate + 'T00:00:00-08:00';// fuso indifferente tanto viene sistemato
                            } else {
                                if (firstDate == desDtatTime.substring(0, 10)) {
                                    gotdate = true;///se desidered = first available we now surely got  the day , so propone the predowloaded first date hour select 
                                    //sel=2;
                                    // detcaseprompt=1;
                                    // is default:  fromDate=desDtatTime;
                                    //  firstDate == desDtatTime 
                                    console.log(' simplybook: setting matrix fromdate, firstDate == desDtatTime  so mark gotdate (so firstday(relative day 0)=desidered day is surely bookable (apart hour match) ) and set desDtatTime: ', fromDate);
                                } else {

                                    if (diffDay(firstDate, desDtatTime)>=0) {//firstDate < desDtatTime){// des date e' dopo first available  so get slot from   desDtatTime then check if à disponibile prevDay(firstDate, desDtatTime)
                                        // default fromDate=desDtatTime;
                                        // detcaseprompt=3;
                                        console.log(' simplybook: setting matrix fromdate, firstDate <= desDtatTime  so set fromdate=desDtatTime: ', fromDate, ' nb firstday (relat day  =0) dont know if is bookable !');
                                    } else {// des date is impossible  propose  firrst date and following 

                                        fromDate = firstDate + desDtatTime.substring(10);// move on first day but keep the des hour ! 'T00:00:00-08:00';
                                        console.log(' simplybook: setting matrix fromdate, firstDate > desDtatTime  so set firstDate: ', fromDate, ' nb firstday (relat day  =0) is surely bookable !');
                                        //detcaseprompt=2;

                                    }
                                }
                            }
                            // we can inform that just matched unit meet r do not meet and in the meanwile justrecover the available  datetime slot to manage the user position
                        } else {

                            console.error('cant get a good matrix from  simplibook ');


                        }
                    }
                }
                    

                            /* ***************  DISCUSSIONE CASO GENERALE , utile se decido di fare il downloaded del matrix mentre do una prima indicazione in base al firstdate 
                            
                            
                            SLOT MATCHING FASE situazione in ingresso allo state -7(was 0) : ho matchato il unit e lo user  ha dato il preferred datetime , duckling desDtatTime, so se:
                                > questa parte del ctl loop ( state >= -7 ask > ctl >ask >ctl ...) avviene sul child lanciato come second intent nel th loop (child èè gruppo di template che si occupa di matchare  lo slot ), 
                                        mentre la parte di selection del unit avviene come primo intent ( gestito dal condition nel ask 0) del th loop (status < -7 )
                                    esso e' interrompibile solo se viene interrotto richiamando una action del context superiore
                                    che si occupa di completare una azione parallela  di gestire una variazione del loop th_loop father o superiori
                                    temporaneamente il context interrupt   viene fatto iniettando i context interrupt condition nel child ma in futuro avverra nel context manager (il root dei 
                                        father loop stack 0 ) col problema di come riprendere eventualmente i child che il context ha interrotto ( discard ? a meno che il interrupt non serva un 
                                            loop parallelo e non influente con job che sta facendo il last level child loop e che completato (es una riciesta di aiuto o chiarimento))

                             user matched unit e  ASKED a PREFERRED DATE  
                             - se ho recuperato il first date time dei piu probabili unit in selection e 
                                - A: gotdate matcha ! : user preferred e = first date , 
                                    - se posso aspettare il matrix (canwait) perche rapido , aspetto di caricare il matrix  con start date = first date e poi 
                                        quindi recupero il matrix con fromdate=firstreq() e costruisco il selector sul day fromdate : rispondero : oh scegli l'orario 
                                        case 1 ( gotdate)
                                        - prompt : la data e' disponibile, scegli orario  (tendenzialmente lo posso fare a mano o con duckling ma e' meglio iniettare il 'oggi' cosi il duckling sa che si riferisce ad oggi )
                                        - next status= 2 ( available hours proposed on a day )
                                        - prompt ok abbiamo alcune hour disponobili scegli ...

                                    - se non posso aspettare il return del matrix (troppo lento ) faccio partire il recupero del matrix e intanto vado con dialogo interlocutorio 
                                            ..........

                                - B: : gotdate non matcha ! 
                                    - se posso aspettare il matrix (canwait) perce rapido , aspetto di caricare il matrix  con start date = first date e poi 
                                        recupero il matrix con datefrom il maggiore tra se e il desidered user e costruisco il selector su 3 available days 
                                        case ....
                                        - promptando : 'non ho disonibilita ma in futuro si ', o ' si ho slot disponibili per il desidered day'  e do 3 date 
                                        - next status= 1 (3 date proposed )

                                    - se non posso aspettare il return del matrix (troppo lento ) faccio partire il recupero del matrix e intanto vado con dialogo interlocutorio 
                                            ..........

                             - se non ho recuperato il first 
                                    - se posso aspettare il matrix (canwait) perce rapido , aspetto di caricare il matrix  con start date = first date e poi 
                                    - C: recupero il matrix e 
                                        case 21 come B ma 
                                        - prompto con : ' ecco 3 date disponibili ,scegli data e preferred time' 

                                
                            // next = await firstReq(1, gotdate);// fill the slot matrix x the performer choosen using qq.ctl starting from preferred date time 

                            // todo : calc firstReq param from each case 

                            // the user select performer and did NOT ASKED a PREFERRED DATE  
                            // so so here  return the first available date and ask for a preferred hour  and a new date time
                            //  in the meanwile justrecover the available  datetime slot ( aspettando o eventualmente  rendilo disponibile via desDtatTime)

                            //  - se ho recuperato il first date 
                            //      - se posso aspettare il matrix (canwait) perce rapido , aspetto di caricare il matrix  con start date = first date e poi 
                            //          case D
                            //          - next status 1 
                            //          - prompt : ecco le prime 3 date disponbili 

                            //      - se non posso aspettare il return del matrix (troppo lento ) faccio partire il recupero del matrix e intanto vado con dialogo interlocutorio 
                            //              next status -5  
                            //              -  H1 ho il first date  do la prima data disponibile e chiedo se va bene e se si di darmi il preferred hour, se no  di dare altro preferred day
                            //              -  H2 no ho il first date chiedo di dare il preferred quando risponde sono in status -5 e vedo la disponibilita con slot  matrix che spero nel frattempo aver raccolto  

                            //  - se non ho recuperato il first date 
                            //      - se posso aspettare : come case D


                            //      - se non posso aspettare il return del matrix (troppo lento ) faccio partire il recupero del matrix e intanto vado con dialogo interlocutorio 
                            //              next status -5  
                            //              -  D2 no ho il first date chiedo di dare il preferred quando risponde sono in status -5 e vedo la disponibilita con slot  matrix che spero nel frattempo aver raccolto  



                            // next = await firstReq(2);// fill the slot matrix x the performer choosen using qq.ctl , case 2 




                            // new : here because firstdate is not availabe 

                            if (!desDtatTime) {
                                detcaseprompt=4;// use didnt ask preferred , so get slots from current time then propose first 3 date
                                // desDtatTime will be set cur time 
                            }else{
                                detcaseprompt=5;// fromdate is desDtatTime so get slots from  desDtatTime  then check if 
                                                // - we got  desDtatTime so propose hour selection 
                                                // - dont got so ask selecting 3 deys after 
                            }
                        }

                        */


                    /* so after mapping each case in action param + fromdate we call 

                        -  (V) firstReq(0) ( just load the slot matrix to be checked after in in status -5 )+ interlocutory_dialog() ( next template/routings : complete=....);
                            .... todo 
                        -  (W) firstReq(sel,detcaseprompt,) ( complete=....);
                            implemented !

                            > summary SWY :
                            - desDtatTime is user preference but revise if 
                                - is missing choose firstDate , if is still missing it will be set current date 
                                - is < firstDate  reset to firstDate 
                            - sel (how to build the selector ):
                                2 select 3 days  
                                1 alredy got the date so  select hours in a day
                                3: we need to get slots then see if desDtatTime is matched (first rel bookable is 0)
                            - detcaseprompt (flags on template x the selector items list prompt ) as before set 
                                    ( nb sel is 1 if detcaseprompt is 1,
                                                 2 if detcaseprompt is 2,4, 
                                                 3 if detcaseprompt is 3 or 5)
                                 prompt : 
                                 // cases when first date available 
                                1: la data e' disponibile, scegli orario 
                                2:  des date is impossible  propose  first date and following 
                                3:  des date e' dopo first available  so get slot from   desDtatTime then check 
                                    - if à disponibile if so do hour sel , otherwise give 3 days

                                // cases when no first date available 
                                4: no des date : le prime date disponibili sono  
                                5: (like 3 ?) get slots from  desDtatTime  then check if first slot got fromdate  
                                    - if meet  desDtatTime : ci sono posti per il giorno richiesto ecco gli orari  
                                    - if dont : la  giorno richiesto non è disponobile le prime date disponibili sono  

                                >>>  quando attendo il matrix download (solution coded ) firstdate serve solo a settare il fromdate 
                                        fromdate : desidered if firstday <  desidered
                                                    firstday se firstday >  desidered
                                                    curdate if  both firstday and  desidered misses
                                  , poi guardando il primo relative day mi accorgo se il desidered è meet o no 

                        next = await firstReq(sel,caseprompt,gotdate);// 
                                >>>> idea : in irstReq map detcaseprompt in template context flags : group.ctx.th_book_geit
                    */

                        //fromdate=desDtatTime;// ok?

                        //ctl=Object.assign({},qq.ctl,func_ctl_) ;// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat

                        qq.ctl.slotMat={};// add metadata obj x building slot query , it will be added as query is created in firstReq{...start();...}
                        if(qq.ctl&&!qq.ctl.f){console.error('f not alredy set , ctl is null :',ctl==null);
                        func_ctl_=Object.assign({rows:null,ctl:qq.ctl},func_ctl);// make rows and ctl available to func, rows will be added as query is created in firstReq{...start();...}
                        ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                        }
                        // so ctl is exended qq.ctl . NEVER do like ctl=something  if plan to reuse qq.ctl . in this case : ctl=qq.ctl=something


                        next = // await firstReq(fromDate,desDtatTime,gotdate);// us local time, desDtatTime can be null , fromDate can be null (if desDtatTime is null) so wil be set as currentdate
                        await firstReq(fromDate,desDtatTime,prefDay,prefHour,prefHM,gotdate)

                        if (next == 2) {// .....// manage result of firstReq ??


                        }


                    }
                    else {// update matrix , to do 
                        return null;// the aiax will not change model , no match 
                    }



                } else if (selStat == 0) {// DELETE   ! .the ctl has alredy set the event structure query.ctl={eventSt}, and choosed the service and the performer .now build the multiturn model datetime/slot matrix and itsstructure on ctl.
                    // OLD AVOID using 
                    // if (selAction == 0) 
                    if (match) {

                        qq.ctl.perfId = inst.id;
                        if (form_whInst && form_whInst.mod_date_des && form_whInst.mod_date_des.value) {// isodate duckling format 

                            desDtatTime = form_whInst.mod_date_des.value;// the new request/desidered  datetime about the query

                            // 2 cases : 
                            // a new query > build a new query/param model obj 
                            // a current query update > get status and goon to respond to the new request 
                            //      ex: if the status is 0 ( day/prefhour to match ) and new req is day matched , a new hour is requested > go to selAction n2 ......
                            //      staus is a session var  that we put inside the query model
                            //      the event associate the input to a function that will se the status , then give selAction/output and set the new status 
                            // event means that from the input we can test what function to call to process the input on the current status  usually the test try to see if the function has the condition to process the input data
                            // in altre parole l'imput prima ancora di vedere lo status  dichiara o implicitamente determina la funcion/operazione/servizio che lo processa in funzione dello stato 
                            // 

                            // ancora : nel processare un input , viene definito o desunto implicitamente seguendo un   generale check (framework o level 1 of bl )  al verificarsi di alcune match 
                            //      quando l'evento si materializza si triggera la funzione/callback  che lo gestisce che puo al suo interne definire alri eventi gestiti da altri call back (asincroni  se uso  chiamate di sistema che gestisce le code di eventi)

                            // in parale povere qui nel controller che e' dedicato a navigare un complex model  gestisco eventi che sono determinati/raccolti dal bot e qui processati 
                            // - tenendo conto dello status imbeddato nel query da processare  

                            await firstReq();// fill the slot matrix x the performer choosen using qq.ctl 

                        } else return null;
                    }
                }



                else if (selStat == 1) {// waiting x user action when 3days selector prompted

                    // ************* FSM
                    // fsm-mdp  see article in mdpArticle folder 
                    //  in dialog management each status (vars/concepts currently matched) and its output 
                    //      ( the prompt (depend statically by matches) depending from user concept matches that give to bot the knowledge of the user choices and objectives ( observations ) 
                    //      on matched on ask so it's derived by status ) 
                    //  has a next status calculated using the new matched concepts . 
                    // very often one of the concept or some concepts set the function (user intention helper o event handler) used to calc the new status and associated new output 
                    // new output

                    qq.match = qq.matched = null;// >>>>  multiturn select : ONLY in case of matched result MUST be reset to recorded  match = qq.match  
                    qq.group.sel = qq.instance = null; // also the copied in group (needs ?)
                    let matInd = qq.index;// the rows[index] is the item matched .is a datetime with the seleced date , time/hours will now confirmed by filtering a new select 

                    if (selAction == 0) {// def, no different strategy was requested by user , just matched or not previous sel 
                        // ex , when as here the selStat is 0 , means that  it matched the day so , as no option selAction is required, we goon with std hour selection on any hour available in sel day 
                        if (match) {
                                /* if(desDtatTime){// if there is a qualified pref/desidered day can be we want a different date from the 3 days proposed , so reset a 3 days also if have a sel match
                                    > TODO null the match and do a new 3 days sel build as done in selStat == 2 case */
                                qq.ctl.selDayId =qq.rows[matInd].date;// the selected day  Id/key/name selected . store as status property  at first level , used to select hour on selected day
                                qq.ctl.selDayIndex =matInd;
                                qq.ctl.vselDayId =qq.cursor.resModel[match].prompt_d;// the selected day  vname . store as status property  at first level , used to select hour
                           // let prefHour;
                           // if (qs.hour_pref) prefHour = parseInt(qs.hour_pref);// querystring

                            // todo TODO : check if in this day we have got prefHour like in firstReq(). . in this case goto selStat == 2 !!!!
                            qq.group.ctx.th_book_geit.meetDes='0';// here selStat == 1 so ??????? context flag that  explain response to user : we meet desidered day but not des hour
                            if(qq.ctl&&!qq.ctl.f){console.error('f not alredy set , ctl is null :',ctl==null);
                            //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                            func_ctl_=Object.assign({rows:qq.rows,ctl:qq.ctl},func_ctl);// make rows and ctl available to func
                            ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                             }
                            setHourSel(matInd,null, prefHour);// will set   chroot = 'th_3daySel_2'; and selStat =2
                        } else {// 25032021, new , to check /debug
                          //  return null;// or just let final part return a n/a response
                        if(desDtatTime) dontMHelper();// after checked a selection didnt match or the desidered new day is valid (still todo?)we check if there is a new desDtatTime , so can redo a new 3days sel 
                        else {// the status 1 can only be called by a 3days  sel match or a new  desDtatTime .
                            console.log( ' status 2 error '); return null;}

                        }
                    } else if (selAction == 2) {
                        // 
                        await setFolDaySel();// a new with new days interval error to define 
                    } else if (selAction == 3) {// just a template , still to code 
                        // a part of day requested . ex pomeriggio or only saturday  da
                        setFolDaySel();// a new with days more 
                    }
                } else if (selStat == 2) {  // after the day are selected : 
                                            //  - the selector matches and the desDtatTime is not qualified : thats the final match !!!
                                            //  - desDtatTime is qualified : goto new 3hours sel 
                                            //  - prefHour is valid : goto a new 3hours sel on current  pref day 

                                            // but this is  ctl (fsm machine) and will depend on many user input , hour match but also a different user intention can move the fsm
                                            // so not only the selector match will call the major multi turn intent managed by this ctl but also other match , 
                                            // x example a refusal of current hour selector and new date request triggered by some qs param like qs.hour_pref   
                                            // qs.newdate

                            // in 3 hour selection prefHour where got by qs.hour_pref regex to do selection
                            // here we check if the used wanted a different day using duck desDtatTime so we can go to a new selection also if we got hour selection using hour got from duck
                            // - BUT as we are in 3 hour selection context if in speech miss at least 2 integer or a week day we assume the day is day of current hour selection !
                            // - AND if  qs.hour_pref is got we prefer it to the duck hour 
                            // a new desidered datetime is got but if less  then 2 integer number or a week day and qs.hour_pref we discadrd
                            // if we are in 3 hour selection state 


                                            if(desDtatTime){// ok we can count on the duck day , so see if is qualified 

                                                if(prefHour_){// pref_hour is present , so can be a hour in a detected pref  day , not the hour in today as sometimes desDtatTime will say 
                                                if(
                                                    qs.desidere_asked&&qs.desidere_asked=='asked'){// ok we can count on the duck day and time/hour qualified !
                                                // just if the duch new date is the same as current day we can leave the duch and keep only prefHour 
                                                let selDayId=qq.ctl.selDayId;// "2021-03-12", current 3 hour selection current day 
                                                if(selDayId==prefDay){// if the desidered is the same as the date we are selecting the 3 hours , treat as a sel match
                                                    desDtatTime=null;
                                                    if(prefHour_)// exist and not 0 , so take precedence on desDtatTime hour
                                                    prefHour=prefHour_;
                                                }
                                                
                                            }else{// the duck day is not valid so null it , and recover  qs.hour_pref if present 
                                                if(!match){desDtatTime=null;prefDay=null;prefRelDay=null;}// only if dont match (right?),  prefRelDay per sicurezza
                                                if(prefHour_)// exist and not 0 , // exist and not 0 , so take precedence on desDtatTime hour
                                                    prefHour=prefHour_;// right ? , non doveva essere gia cosi?

                                            }
                                            }else{
                                                ;// so take desDtatTime but check that if  day is not the  pref day , really is so ( current day )
                                            }
                                        }


                    qq.match = qq.matched = null;// >>>>  multiturn select : ONLY in case of matched result MUST be reset before return to match  : qq.match=match
                    qq.group.sel = qq.instance = null; // also the copied in group (needs ?)
                    let index=qq.index;// recover after 
                   // prefHour,prefDay;// other concept that are input x this major intent ctl
                    
                   /* do that after:
                    if (!match) {
                        // the only other input that  addressed this ctl multi turn ctl is a change in date because the hour selection dont satisfy the user 
                    if (qs.day_pref){
                        prefDay = parseInt(qs.day_pref);// if a model , must be reset before last user speeches
                        // .....
                    }else if (prefHour||selAction == 2||selAction == 3){// hour_pref : change hour, selAction  2 if want to chse pom , selAction  3 if want to chse mat

                            // this match is a user intent about hour that not matches the hour selector 
                            // es selector matches   alle 4 , per le 5, il pomeriggio , dopo le 5 .... ()
                            // prefHour is a model/ai agent that map intent to reset the new hour into a hour value

                        if(selAction == 2)prefHour=8;
                        else if(selAction == 3)prefHour=14;
                        //else if(qs.hour_pref)prefHour = parseInt(qs.hour_pref);// if a model , must be reset before last user speeches
                        // match=prefHour;// can be ?
                        // or reset hour selector , ex 'vorrei il pomeriggio' o 'a partire dalle 14'
    
                                qq.group.ctx.th_book_geit.meetDes='5';//context flag that  explain response to user : we change hour on 
    
                                //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                                func_ctl_=Object.assign({rows:qq.rows,ctl:qq.ctl},func_ctl);// make rows and ctl available to func
                                ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                            const lastbaseind=0;//TODO to recover from status 
                                setHourSel(lastbaseind,null, prefHour);// will set   chroot = 'th_3daySel_2'; and selStat =2
                   }


                    }*/
                    let dontmatch=false,mydate;
                    if(match) {// should be if this ctl is called because of a selector match, but can be called also because of  a desDtatTim is detected 
                        // match is the value matched so access matched slot data as rows[index] or cursor.resModel[match] 
                        //                ex  you got  qq.cursor.resModel[match].prompt_d+prompt_time


                        // check there is not a new desidered date different from current selected day  :
 
                        if(desDtatTime&&qs.desidere_asked&&qs.desidere_asked=='asked'){// a new desidered datetime is got but if more then 2 integer number or a week day 
                            mydate=desDtatTime.substring(0,10),

                            // is there the data alredy in rows ?

                             selDayId=qq.ctl.selDayId;// "2021-03-12"
                             if(mydate != selDayId)dontmatch=true;
                            
                        }

                        if(!dontmatch){// matched

                    // console.log(' simplybook: selstat=2 got slot match : ',match,' but desidered day is  different from the day of 3hour proposed selection ,\n so try to meet new desDtatTime: ',desDtatTime,', meetDes = 100, selected Datetime slot date ',qq.rows[index].date,' time ',qq.rows[index].time);                 
                    console.log(' simplybook: 3 hour selection ( selstat=2) got slot match : ',match);
                        qq.ctl.selStat=3;// matched slot 

                        // >>>> restore match :  multiturn select : ONLY in case of matched result MUST be reset before return to match  : qq.match=match

                        chroot = 'slotmatch';// goon with booking naw at least the slot is got

                        qq.match = match;// restore match as was received (no op on received query , so let matched ans exit successfull) as we finish and goon without another refine selection 
                        qq.instance = inst;
                        // qq.index=index;  alredy set 
                        qq.matched = 'match';
                        qq.group.sel = groupsel;
                        sc = 1;// just not to return null;
                        qq.group.ctx.th_book_geit.meetDes='100';//
                    }
                    } 
                    if(!match||dontmatch) {// dont match 

                           // after chech use the new :  dontMHelper() istead following corpus : 

                                dontMHelper();

                        /* summary :
                         - from desDtatTime we alredy calc prefDay and prefHour , review these if other matcher =prefHour_ and day_pref are different 
                         - if we have a good prefDay goon try to see if is bookable (dayInd>=0 ,  so do 3 hour sel) , or not so try to do a other 3 days sel )
                        
                       

                            qq.match =qq.instance =qq.matched = null;
                            if (qs.day_pref){// no more used
                                prefDay = parseInt(qs.day_pref);// if a model , must be reset before last user speeches
                                // ..... rebuild the day assuming same month as desDtatTime
                                // desDtatTime=...
                            }
                            
                            
                            if(prefDay!=null&&!isNaN(prefDay)){//if(desDtatTime){
                                //let mydate=desDtatTime.substring(0,10);

                                // is there the data alredy in rows ?
                                console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , and found in downloaded slot matrix the new desidered day  : ',prefDay,' , ',desDtatTime,
                                '\n now find nearest slot ');
                                  


                                // TODO that can be put in common f !!! find if a date is bookable and its the relday or row index


                                //let selDayId=ctl.selDayId,// "2021-03-12"
                                let dayBookable=qq.ctl.slotMat.dayBookable,relDayInd=qq.ctl.slotMat.relDayInd;//relDayInd = [],     [101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate
                                let dayInd=-1,// row index
                                ij,dayBefInd=-1,dayAftInd=-1;// rel index (ij, index of slotMat arrays : dayBookable,relDayInd,.... )
                                //ij=9;
                                

                                let dmo,dye;
                                if(desDtatTime) {dmo = parseInt(desDtatTime.substring(5,7));// des month
                                    dye = parseInt(desDtatTime.substring(0,4));}
                                for (ij = 0; ij < dayBookable.length; ij++) {// scan iesimo days in matrix , the iesimo day is dayspan[i] days after  fromDate, must find if all days in matrix < or > or beween the des date


                                    let mo,ye;
                                    if(desDtatTime) {mo = parseInt(qq.rows[ij].date.substring(5, 7)), ye = parseInt(qq.rows[ij].date.substring(0, 4));}// month year
                                    if (desDtatTime&&ye > dye) {// desiderd year > 
                                        dayAftInd =ij;// relDayInd[ij];
                                        break;
                                    } else {
                                        if (desDtatTime==null||ye == dye) {// same year
                                            if (desDtatTime&&mo > dmo) {

                                                dayAftInd =ij;//  relDayInd[ij];
                                                break;
                                            } else {

                                                if (desDtatTime==null||mo == dmo) {// same month
                                                    if (dayBookable[ij] > prefDay) {
                                                        dayAftInd = ij;// relDayInd[ij];
                                                        break;

                                                    } else {
                                                        if (dayBookable[ij] == prefDay) {// same day
                                                            dayInd = relDayInd[ij]; break;
                                                        } else {// day before
                                                            dayBefInd = ij;// relDayInd[ij];
                                                        }
                                                    }
                                                } else {// previous month
                                                    dayBefInd = ij;// relDayInd[ij];
                                                }
                                            }
                                        } else {// previous year
                                            dayBefInd = ij;// relDayInd[ij];
                                        }
                                    }
                                }

                                if(dayInd>=0){

                                    console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found in downloaded slot matrix the new desidered day bookable : ',desDtatTime);
                                    qq.group.ctx.th_book_geit.meetDes='55';//context flag that  explain response to user : we have a new desidered day  that is bookable
        
                                    //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                                    func_ctl_=Object.assign({rows:qq.rows,ctl:qq.ctl},func_ctl);// make rows and ctl available to func
                                    ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat

                                    ctl.selDayId =qq.rows[dayInd].date;// the selected day  Id/key/name selected . store as status property  at first level , used to select hour on selected day
                                    ctl.selDayIndex=dayInd;// 032021
                                    ctl.vselDayId =qq.cursor.resModel[qq.rows[dayInd].value].prompt_d;// the selected day  vname . store as status property  at first level , used to select hour
                                    setHourSel(dayInd,null, prefHour);// will set sc,   chroot = 'th_3daySel_2'; and selStat =2
                                }else{
                                    if(dayAftInd>=0){// des day not bookable and have after bookable and previous bookable ?? no can be start 

                                        let tests = 3;
                                        // when just got the matrix it is  0 because 
                                        // , then can be reviewed with the desidered local hour   qc.fromHour
                                        func_ctl_=Object.assign({rows:qq.rows,ctl:qq.ctl},func_ctl);// make rows and ctl available to func
                                        ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                                        ctl.selStat = 1;// 1: 3 day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)
                                        let curRel= ctl.slotMat.curRelInDay =ctl.slotMat.dayspan[dayAftInd];//>>>> current/new desidered rel day   , ex 2 = the second bookable day in rows after startday
/////////////////////////////////////////////////////////////////
                                        sc=
                                        sel3day(curRel,qq,ctl,tests);// curRel the starting relative day to buils 3 dayds selector ,qq=param;ctl=ctl;// ctl: extended qq.ctl
                                        if(sc>0)    { qq.group.ctx.th_book_geit.meetDes='56';//context flag that  explain response to user : we have a new desidered day  that is not bookable but have a day after in matrix so goon 3 days selector
                        
                                        console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found in downloaded slot matrix ',sc,' bookable day after the new desidered day  : ',desDtatTime,' so goon 3days selection , template flag : ',qq.group.ctx.th_book_geit.meetDes);
                                         }else {
                                        qq.group.ctx.th_book_geit.meetDes='-1';//context flag that  explain response to user : we have a new desidered day  that is bookable
                                        console.error('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but NOT found in downloaded slot matrix ',sc,' bookable day after the new desidered day  : ',desDtatTime,' so cant do 3days selection , template flag : ',qq.group.ctx.th_book_geit.meetDes);
                                    }

                                        chroot = 'th_3daySel';// complete

                                        // get rid of not persistent helper funcs :
                                        ctl.f=null;
                        




                                    }else{// desiderd day  after days in matrix, do a new search after stopdate 

                                    
                                        qq.group.ctx.th_book_geit.meetDes='-10';
                                        console.error(' todo , simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match ,th_book_geit.meetDes=-10, and no bookable day in current slot matrix, matching desidered day    : ',   desDtatTime.substring(0,10),);

                                        // ...................... fin 3day to select in present rows like in firstReq()  or start a new download 
                                        sc=0;// so return error 
                                    }
                             
                            }
                        
                        }else{


                            if (prefHour||selAction == 2||selAction == 3){// hour_pref : change hour, selAction  2 if want to chse pom , selAction  3 if want to chse mat

                                // this match is a user intent about hour that not matches the hour selector 
                                // es selector matches   alle 4 , per le 5, il pomeriggio , dopo le 5 .... ()
                                // prefHour is a model/ai agent that map intent to reset the new hour into a hour value
    
                            if(selAction == 2)prefHour=8;
                            else if(selAction == 3)prefHour=14;
                            //else if(qs.hour_pref)prefHour = parseInt(qs.hour_pref);// if a model , must be reset before last user speeches
                            // match=prefHour;// can be ?
                            // or reset hour selector , ex 'vorrei il pomeriggio' o 'a partire dalle 14'

                            console.log(' simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , and a different hour proposal in same day  prefHour: ',prefHour);
        
                                    qq.group.ctx.th_book_geit.meetDes='5';//context flag that  explain response to user : we change hour on 
        
                                    //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                                    func_ctl_=Object.assign({rows:qq.rows,ctl:qq.ctl},func_ctl);// make rows and ctl available to func
                                    ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat


                                // easyer:
                               let dayInd=ctl.selDayIndex;// when moved to hour selection state we register the day and the row index of the day on which we do 3 hour selection . so continue using it !
                                // .....................

                                if(dayInd>=0){
                                    setHourSel(dayInd,null, prefHour);// will set   chroot = 'th_3daySel_2'; and selStat =2
                                    // what to o if cant find a hour? ..... propose next day ? ....
                                }else{
                                    // cant be 
                                    console.error(' simplybook: selstat= 2 error ,match: ',match,' ,prefHour: ',prefHour);
        
                                   return;// setHourSel(0,null, prefHour);// temporaly

                                }
                       }else {

                        // no proposed selector matched, no new hour no new day , so check if some other action set by th_change_quality 
                            
                                            // ...............................

                       // error it will loop ! .....      chroot = 'repeat';// error TODO

                        return;// temporarely

                       }
                        }

                        */
                    }// end don't match

                } else if (selStat == 3) {// matched slot 
                    console.error(' simplybook: selstat= 3 got slot match : ',match,' , error');
                } else chroot = 'repeat';// unkown stare restart

            } else {

                // here the first ctl call , in v0 was called   await firstReq() that supposing service 0 performer 0 , got the slot matrix 
                // now we get only event data , the before call  firstReq()  we need to :
                //  - select service > simple static list  to select 
                //  and 
                //  - performer  >  select after a query to make more restricted he selection 
                await getEvent(form_wheres, qs, rest);
            }
function dontMHelper() {// dont match 


                console.error('  temp debugging  dontMHelper() simplybook: selstat= ', qq.ctl.selStat);
        
                /* summary :
                 - from desDtatTime we alredy calc prefDay and prefHour , review these if other matcher =prefHour_ and day_pref are different 
                 - if we have a good prefDay goon try to see if is bookable (dayInd>=0 ,  so do 3 hour sel) , or not so try to do a other 3 days sel )


                 remember :
                curRelInDay_ = 0,// the index  ix that correspond to first bookable day when move to a new fromdate   ( after got the sched matrix rows from server is 0) , 

                daysc_ = [],//[14,1,8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable_ = [],  //[19,22,3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot_ = [],//[114,211,null],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd_ = [];//[101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate. question : first value must be 0 ?
            //




                // ***************************    definition ****************************
                ctl.slotMat = {// updates ctl , reassign slotMat    *CTL 
                    curDate:curdate.toISOString(),
                    dayspan:dayspan_ , daysc: daysc_ , dayBookable:dayBookable_, totSlot:0, bookDays:0,
                    curRelInDay:curRelInDay_ , relDayInd:relDayInd_, pref_day_slot:pref_day_slot_,
                    fromDate, //  fromDate = new Date(dateFromAPI="2021-01-04T10:00:00.000 ) 4 gennaio
                    datefrom,// ="2021-01-04"=dateFromAPI.substring(0,10);// the base to calc relative day
                    startDateTimeStamp,//   usefull to calc day difference from as in relDay("2021-01-05") returns 1 , relative days from datefrom 
                                        // is the time when in utc location  starts the day in iso format "2021-01-04"
                    fromDay, fromHour// . fromDay=4,fromHour=10 is local of fromDate ( loaded using a different locale , th educk locale !!!)
                };




                */


        
                qq.match = qq.instance = qq.matched = null;

                if(desDtatTime){
                    //let mydate=desDtatTime.substring(0,10);
        
                    // is there the data alredy in rows ?
                    console.log('  simplybook: selstat= ', qq.ctl.selStat, ' (1/2) (tryed match a proposed 3 days or hours selector) )but got null slot match , and found in downloaded slot matrix the new desidered day  desDtatTime: ', desDtatTime,
                        '\n now find nearest slot ');
        
                 // track :        trova il index in cui il rel day is =  or > 
        
                    // TODO that can be put in common f !!! find if a date is bookable and its the relday or row index
                                                    /* alredy done 
                                                        //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                                                        let func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                                                        ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                                                      */
                    //let selDayId=ctl.selDayId,// "2021-03-12"
                    let dayBookable = qq.ctl.slotMat.dayBookable, relDayInd = qq.ctl.slotMat.relDayInd,//relDayInd = [],     [101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate
                    dayspan=qq.ctl.slotMat.dayspan,
                    dayInd = -1,// row index
                        ij, dayBefInd = -1, dayAftInd = -1;// rel index (ij, index of slotMat arrays : dayBookable,relDayInd,.... )

                    let newDate=desDtatTime.substring(0,10),newRelDes=ctl.f.relDay(newDate);// ctl extended

                    for (ij = 0; ij < dayspan.length; ij++) {// dayspan[0] can be >=0 , newRelDes any number 
        
                        if(dayspan[ij]>=newRelDes){// got a bookable >= desidered
                            if(dayspan[ij]==newRelDes){// got a bookable = desidered
                                dayInd=ij;
                                if(ij<dayspan.length-1)dayAftInd=ij+1;
                                if(ij>0)dayBefInd=ij-1;
                            }else{
                                dayAftInd=ij;
                                if(ij>0)dayBefInd=ij-1;

                            }
                            break;
                        }}
                        if(ij==dayspan.length&&ij>0){
                            dayBefInd=ij-1;
                        }

                    
        
                    if (dayInd >= 0) {
        
                        console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found in downloaded slot matrix ( ',dayInd,'-esimo bookable) the new desidered day bookable : ', desDtatTime);
                        qq.group.ctx.th_book_geit.meetDes = '55';//context flag that  explain response to user : we have a new desidered day  that is bookable
                        /*
                        //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                        func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                        ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                        */
                       let row_=relDayInd[dayInd];
                        ctl.selDayId = qq.rows[row_].date;// the selected day  Id/key/name selected . store as status property  at first level , used to select hour on selected day
                        ctl.selDayIndex = row_;// 032021
                        ctl.vselDayId = qq.cursor.resModel[qq.rows[row_].value].prompt_d;// the selected day  vname . store as status property  at first level , used to select hour
                        setHourSel(row_, null, prefHour);// will set sc,   chroot = 'th_3daySel_2'; and selStat =2
                    } else {
                        if (dayAftInd >= 0) {// des day not bookable and have after bookable (and perhaps a previous bookable)
                            console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , the new desidered date  ', desDtatTime,'  is not  found in downloaded slot matrix but found a after date of relative index  ',dayAftInd ,' so start 3 days sel from this date');
                            if(dayAftInd==0 ) console.log('     >> as first after date is rel index 0 ( so matrix fromDate is > new desidered date )the downloaded slot matrix dont have info about bookability of new desidered date ( matrix fromDate is: ',qq.ctl.slotMat.fromDate,' we can  DO DYnamic refilling, still TODO, or redo a search with a right fromDate');
                  
                            ctl.selStat = 1;// 1: 3 day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)
        
                           // let curRel = ctl.slotMat.relDayInd[dayAftInd];// curRel bad name   , >>>> current/new desidered rel day   , ex dayAftInd=2  the third bookable day in rows after startday
                            // when just got the matrix it is  0 because 
                            // , then can be reviewed with the desidered local hour   qc.fromHour
                            /*
                            func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                            ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
        */
     
                            sc =
                                sel3day(dayAftInd , qq, ctl,tests_3D,setSelectItem);// curRel the starting relative day to buils 3 dayds selector ,qq=param;ctl=ctl;// ctl: extended qq.ctl
                            if (sc > 0) {
                                qq.group.ctx.th_book_geit.meetDes = '56';//context flag that  explain response to user : we have a new desidered day  that is not bookable but have a day after in matrix so goon 3 days selector
        
                                console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found in downloaded slot matrix ', sc, ' bookable day after the new desidered day  : ', desDtatTime, ' so goon 3days selection , template flag : ', qq.group.ctx.th_book_geit.meetDes);
                            } else {
                                qq.group.ctx.th_book_geit.meetDes = '-1';//context flag that  explain response to user : we have a new desidered day  that is bookable
                                console.error(' still TODO DYnamic refilling , simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found 0 (sc= ', sc, ') bookable day after the new desidered day  : ', desDtatTime, ' so cant do 3days selection , template flag : ', qq.group.ctx.th_book_geit.meetDes);
                            }
        
                            chroot = 'th_3daySel';// complete
        
                            // get rid of not persistent helper funcs :
                            ctl.f = null;
        
        
        
        
        
                        } else {// desiderd day  after days in matrix, so take the before if near or just  do a new search after stopdate 
                              
                            // todo dayBefInd=   case 
        
                            qq.group.ctx.th_book_geit.meetDes = '-10';
                            console.error(' todo , simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , dayBefind: ',dayBefInd,' th_book_geit.meetDes=-10, and no bookable day in current slot matrix, matching desidered day    : ', desDtatTime);
        
                            // ...................... fin 3day to select in present rows like in firstReq()  or start a new download 
                            if(dayBefInd<0) sc = 0;// so return error 
                            else{ /*
                                sc = sel3day(dayBefInd , qq, ctl,tests_3D,setSelectItem);
                                chroot = 'th_3daySel';// complete
                                // get rid of not persistent helper funcs :
                                ctl.f = null;
                            */
                           let row_=relDayInd[dayBefInd];
                           ctl.selDayId = qq.rows[row_].date;// the selected day  Id/key/name selected . store as status property  at first level , used to select hour on selected day
                           ctl.selDayIndex = row_;// 032021
                           ctl.vselDayId = qq.cursor.resModel[qq.rows[row_].value].prompt_d;// the selected day  vname . store as status property  at first level , used to select hour
                           setHourSel(row_, null, prefHour);// will set sc,   chroot = 'th_3daySel_2'; and selStat =2
    
                            }
                        }
        
                    }
        
                } else {
        
        
                    if (prefHour || selAction == 2 || selAction == 3) {// hour_pref : change hour, selAction  2 if want to chse pom , selAction  3 if want to chse mat
        
                        // this match is a user intent about hour that not matches the hour selector 
                        // es selector matches   alle 4 , per le 5, il pomeriggio , dopo le 5 .... ()
                        // prefHour is a model/ai agent that map intent to reset the new hour into a hour value
        
                        if (selAction == 2) prefHour = 8;
                        else if (selAction == 3) prefHour = 14;
                        //else if(qs.hour_pref)prefHour = parseInt(qs.hour_pref);// if a model , must be reset before last user speeches
                        // match=prefHour;// can be ?
                        // or reset hour selector , ex 'vorrei il pomeriggio' o 'a partire dalle 14'
        
                        console.log(' simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , and a different hour proposal in same day  prefHour: ', prefHour);
        
                        qq.group.ctx.th_book_geit.meetDes = '5';//context flag that  explain response to user : we change hour on 
        
                        if(qq.ctl&&!qq.ctl.f){console.error('f not alredy set , ctl is null :',ctl==null);
                        //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                        func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                        ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                    }
        
                        // easyer:
                        let dayInd = ctl.selDayIndex;// when moved to hour selection state we register the day and the row index of the day on which we do 3 hour selection . so continue using it !
                        // .....................
        
                        if (dayInd >= 0) {
                            setHourSel(dayInd, null, prefHour);// will set   chroot = 'th_3daySel_2'; and selStat =2
                            // what to o if cant find a hour? ..... propose next day ? ....
                        } else {
                            // cant be 
                            console.error(' simplybook: selstat= 2 error ,match: ', match, ' ,prefHour: ', prefHour);
        
                            return;// setHourSel(0,null, prefHour);// temporaly
        
                        }
                    } else {
        
                        // no proposed selector matched, no new hour no new day , so check if some other action set by th_change_quality 
        
                        // ...............................
        
                        // error it will loop ! .....      chroot = 'repeat';// error TODO
        
                        return;// temporarely
        
                    }
                }
            }// end dontMHelper don't match


    function dontMHelper_old() {// dont match 

        console.error('  temp debugging  dontMHelper() simplybook: selstat= ', qq.ctl.selStat);

        /* summary :
         - from desDtatTime we alredy calc prefDay and prefHour , review these if other matcher =prefHour_ and day_pref are different 
         - if we have a good prefDay goon try to see if is bookable (dayInd>=0 ,  so do 3 hour sel) , or not so try to do a other 3 days sel )
        */

        qq.match = qq.instance = qq.matched = null;
        if (qs.day_pref) {
            prefDay = parseInt(qs.day_pref);// if a model , must be reset before last user speeches
            // ..... rebuild the day assuming same month as desDtatTime
            // desDtatTime=...
        }


        if (prefDay != null && !isNaN(prefDay)) {//if(desDtatTime){
            //let mydate=desDtatTime.substring(0,10);

            // is there the data alredy in rows ?
            console.log('  simplybook: selstat= ', qq.ctl.selStat, ' (1/2) (tryed match a proposed 3 days or hours selector) )but got null slot match , and found in downloaded slot matrix the new desidered day  desDtatTime: ', desDtatTime,
                '\n now find nearest slot ');

            //    trova il index in cui il rel day is =  or > 

            // TODO that can be put in common f !!! find if a date is bookable and its the relday or row index


            //let selDayId=ctl.selDayId,// "2021-03-12"
            let dayBookable = qq.ctl.slotMat.dayBookable, relDayInd = qq.ctl.slotMat.relDayInd;//relDayInd = [],     [101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate
            let dayInd = -1,// row index
                ij, dayBefInd = -1, dayAftInd = -1;// rel index (ij, index of slotMat arrays : dayBookable,relDayInd,.... )
            //ij=9;

            /*
            for(ij=0;ij<relDayInd.length;ij++){
                dayBefInd=relDayInd[ij];
                if(qq.rows[dayBefInd].date==desDtatTime.substring(0,10)){dayInd=relDayInd[ij];break;}
            }*/
            let dmo, dye;
            if (desDtatTime) { dmo = parseInt(desDtatTime.substring(5, 7)); dye = parseInt(desDtatTime.substring(0, 4)); }
            for (ij = 0; ij < dayBookable.length; ij++) {


                let mo, ye;
                if (desDtatTime) { mo = parseInt(qq.rows[ij].date.substring(5, 7)), ye = parseInt(qq.rows[ij].date.substring(0, 4)); }// month year
                if (desDtatTime && ye > dye) {
                    dayAftInd = ij;// relDayInd[ij];
                    break;
                } else {
                    if (desDtatTime == null || ye == dye) {// same year
                        if (desDtatTime && mo > dmo) {

                            dayAftInd = ij;//  relDayInd[ij];
                            break;
                        } else {

                            if (desDtatTime == null || mo == dmo) {// same month
                                if (dayBookable[ij] > prefDay) {
                                    dayAftInd = ij;// relDayInd[ij];
                                    break;

                                } else {
                                    if (dayBookable[ij] == prefDay) {// same day
                                        dayInd = relDayInd[ij]; break;
                                    } else {// day before
                                        dayBefInd = ij;// relDayInd[ij];
                                    }
                                }
                            } else {// previous month
                                dayBefInd = ij;// relDayInd[ij];
                            }
                        }
                    } else {// previous year
                        dayBefInd = ij;// relDayInd[ij];
                    }
                }
            }

            if (dayInd >= 0) {

                console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found in downloaded slot matrix the new desidered day bookable : ', desDtatTime);
                qq.group.ctx.th_book_geit.meetDes = '55';//context flag that  explain response to user : we have a new desidered day  that is bookable

                if(qq.ctl&&!qq.ctl.f){console.error('f not alredy set , ctl is null :',ctl==null);
                //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
            }

                ctl.selDayId = qq.rows[dayInd].date;// the selected day  Id/key/name selected . store as status property  at first level , used to select hour on selected day
                ctl.selDayIndex = dayInd;// 032021
                ctl.vselDayId = qq.cursor.resModel[qq.rows[dayInd].value].prompt_d;// the selected day  vname . store as status property  at first level , used to select hour
                setHourSel(dayInd, null, prefHour);// will set sc,   chroot = 'th_3daySel_2'; and selStat =2
            } else {
                if (dayAftInd >= 0) {// des day not bookable and have after bookable and previous bookable
                    ctl.selStat = 1;// 1: 3 day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)

                   //  let curRel = ctl.slotMat.curRelInDay = dayAftInd;//>>>> current/new desidered rel day   , ex 2 = the second bookable day in rows after startday
                    if(qq.ctl&&!qq.ctl.f){console.error('f not alredy set , ctl is null :',ctl==null);
                    // when just got the matrix it is  0 because 
                    // , then can be reviewed with the desidered local hour   qc.fromHour
                    func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                    ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
                }

                    sc =
                        sel3day(dayAftInd , qq, ctl, tests);// curRel the starting relative day to buils 3 dayds selector ,qq=param;ctl=ctl;// ctl: extended qq.ctl
                    if (sc > 0) {
                        qq.group.ctx.th_book_geit.meetDes = '56';//context flag that  explain response to user : we have a new desidered day  that is not bookable but have a day after in matrix so goon 3 days selector

                        console.log('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but found in downloaded slot matrix ', sc, ' bookable day after the new desidered day  : ', desDtatTime, ' so goon 3days selection , template flag : ', qq.group.ctx.th_book_geit.meetDes);
                    } else {
                        qq.group.ctx.th_book_geit.meetDes = '-1';//context flag that  explain response to user : we have a new desidered day  that is bookable
                        console.error('  simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , but NOT found in downloaded slot matrix ', sc, ' bookable day after the new desidered day  : ', desDtatTime, ' so cant do 3days selection , template flag : ', qq.group.ctx.th_book_geit.meetDes);
                    }

                    chroot = 'th_3daySel';// complete

                    // get rid of not persistent helper funcs :
                    ctl.f = null;





                } else {// desiderd day  after days in matrix, do a new search after stopdate 


                    qq.group.ctx.th_book_geit.meetDes = '-10';
                    console.error(' todo , simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match ,th_book_geit.meetDes=-10, and no bookable day in current slot matrix, matching desidered day    : ', desDtatTime);

                    // ...................... fin 3day to select in present rows like in firstReq()  or start a new download 
                    sc = 0;// so return error 
                }

            }

        } else {


            if (prefHour || selAction == 2 || selAction == 3) {// hour_pref : change hour, selAction  2 if want to chse pom , selAction  3 if want to chse mat

                // this match is a user intent about hour that not matches the hour selector 
                // es selector matches   alle 4 , per le 5, il pomeriggio , dopo le 5 .... ()
                // prefHour is a model/ai agent that map intent to reset the new hour into a hour value

                if (selAction == 2) prefHour = 8;
                else if (selAction == 3) prefHour = 14;
                //else if(qs.hour_pref)prefHour = parseInt(qs.hour_pref);// if a model , must be reset before last user speeches
                // match=prefHour;// can be ?
                // or reset hour selector , ex 'vorrei il pomeriggio' o 'a partire dalle 14'

                console.log(' simplybook: selstat= 2 (try match a proposed 3 hour selector) )got null slot match , and a different hour proposal in same day  prefHour: ', prefHour);

                qq.group.ctx.th_book_geit.meetDes = '5';//context flag that  explain response to user : we change hour on 

                if(qq.ctl&&!qq.ctl.f){console.error('f not alredy set , ctl is null :',ctl==null);
                //ctl=Object.assign({},qq.ctl,func_ctl) ;//// query model qq must be a multi turn slot matrix query : inject session ctl data on ctl_ with helper function working on metadata :  
                func_ctl_ = Object.assign({ rows: qq.rows, ctl: qq.ctl }, func_ctl);// make rows and ctl available to func
                ctl = Object.assign(qq.ctl, { f: func_ctl_ });// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
            }

                // easyer:
                let dayInd = ctl.selDayIndex;// when moved to hour selection state we register the day and the row index of the day on which we do 3 hour selection . so continue using it !
                // .....................

                if (dayInd >= 0) {
                    setHourSel(dayInd, null, prefHour);// will set   chroot = 'th_3daySel_2'; and selStat =2
                    // what to o if cant find a hour? ..... propose next day ? ....
                } else {
                    // cant be 
                    console.error(' simplybook: selstat= 2 error ,match: ', match, ' ,prefHour: ', prefHour);

                    return;// setHourSel(0,null, prefHour);// temporaly

                }
            } else {

                // no proposed selector matched, no new hour no new day , so check if some other action set by th_change_quality 

                // ...............................

                // error it will loop ! .....      chroot = 'repeat';// error TODO

                return;// temporarely

            }
        }
    }// end dontMHelper don't match

            // event handlers for fsm transaction 
            async function setHourSel(index_, isodate,prefHour) {
                
                // >>>  find 3 hour after o near prefHour on the (bookable) day day_  of row of index index_ : day_= cdate = qq.rows[index_].date
                //      if cant find any just take first 3 hour of day_

                // index_ of row selected proposed by this ctl filtering the slot matrix containing the desidered date. prefhour (int) is a different model match passed in qs
                // this handlers MUST work on a query model  set by start(), so it is a multimatch slot matrix query !

                // (rows selected )index_, isodate are alternative ,
                // prefHour =16 
                //  ??  the calling must await if we await something !!!!

                // comes here from selStat  (selection state) =1 . it select the slot of the best bookable day near fromhour , if specified, 
                // in this state we build the selection of the slot in the day with  hour matching :
                // - near previous desidered hour (the instance slot alredy provide a estimation of a desidered hour ) 
                // - if if user say  day 19 but hour 16 and the promt said day 10 at 15:00 we reset the desidered hour new one 


                //let slotMatSt = qq.ctl.slotMat;// this event handler works on slot matrix selection , its status is on ctl.slotMat



                let ind = index_,//qq.index;// the rows matching index  :  qq.instance=rows[qq.index],qq.match=instance.value  , so is the current relative desidered index
                indVal,indDay;if(ind!=null&&!isNaN(ind)){indVal=qq.rows[ind].value;indDay=qq.rows[ind].date;}
                ctl.selStat = 2;// selecting hour in matched day status
                console.log(' simplybook: setHourSel,  meetDes = 10, desDtatTime: ',desDtatTime,' prefHour: ',prefHour,', setting selStat:', ctl.selStat,' pointing slot : ',indVal,' date: ',indDay);
                let chechday=ctl.selDayId == indDay;// "2021-03-12"

                //todo:
                /* this was tested ok : use as reference 
                function findSlotAfterHour(ind,prefHour){// ind: a row slot index of a day on which we want to the slot immediately after prefHour (integer).  
                        if (!isNaN(prefHour)) {// is integer so set index corresponding to first slot of the day with hour just >= prefHour . if cant let ind as it comes 
                            // recalc start slot matching prefHour in same day or matched slot , otherwise let pref slot the matched slot 
                            //bookable index :
                            let ij;
                            for (ij = 0; ij < slotMatSt.dayspan.length; ij++) { if (slotMatSt.relDayInd[ij] > ind) break; }// find index ij=bookInd for bookable date following the date of the matched  rows index = ind
                            // now ij is =bookInd+1 for bookable date following the date of the matched  rows of index ind OR  
                            let eDay;// the row index of first bookable day > preferred day or endoffile/length. first rows index of slot with a bookable date immediately after of the selected bookable day : its for stop the for !!
                            if (ij < slotMatSt.dayspan.length) eDay = slotMatSt.relDayInd[ij]; else eDay = qq.rows.length;
                            let fs=slotMatSt.relDayInd[ij - 1];// fs  : rows index of first slot of the bookable day on which find the hour next
                            for (ij = fs; ij < eDay; ij++) {// for all row index from the bookable day before the following bookable day of  . scan rows slot from the first slot (fs)of the bookable day on which find the hour next to prefHour. eDay stops the for !
                                let pref = parseInt(qq.rows[ij].time.substring(0, 2));// .time:"10:00:00"
                                if (!isNaN(pref))
                                    if (pref >= prefHour) break;// stop when find first  slot with a hour after prefHour
                            }
                            if (ij < eDay) ind = ij;//
                        }
                        return ind;
                }*/

                if(ind!=null&&!isNaN(ind)&&ind>=0){// should be just a check
                   //console.error('ciau',ind);
                ind = ctl.f.findSlotAfterHour(ind, prefHour);// reset ind pointing to right hour slot (>  or near of pref hour) can be null 
               // console.error('ciao',ind);
                console.log(' simplybook: setHourSel,  meetDes = 10, desDtatTime: ',desDtatTime,' prefHour: ',prefHour,', finding a slot (near o) post prefHour, row index: ',ind);
  
            // set till 3 slot following this 
            let dl = qq.rows.length;
            qq.cursor.medSyntL = [];

            let ds = [],// list of index to select ,usefull?
                refLunedi = [];// local 

            qq.cursor.medSync = Array(dl);// rebuild medSync, fill with null all rows index 

            let tests = tests_3H;sc=sc;
            //sc=0; //must be 

            // fills new filtered selection medSync,medSyntL,resModel obj : insert 3 datetime of days, following desidered day , with slot hour near to desidered hour  
                    if (ind != null && ind >= 0) {
                        //cdate = qq.rows[ind].date;
 
                        /*
                        let ll;
                        for (ll = ind; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
                            // nb one slot will be  ri = qc.pref_day_slot[x] x is the  (index of) rel day considering : sstart from it ? (its near the preferred hour )
                            // x is index of ctl.dayBookable that has value = current day 
                            if ((qq.rows[ll].date) != cdate) break;// the day slots finished
                            ds.push(ll);
                            sc++;
                            // rebuild the cursor.resModel[match].path = cursor.resModel[match].path_h
                            //let check=qq.rows[ll].value;
                            qq.cursor.resModel[qq.rows[ll].value].patt = '\\b' + qq.cursor.resModel[qq.rows[ll].value].patt_h + '(?:\\s+|$)';;// a integer!!!!
                            refLunedi.push(// name of day , register x deiscrminating test, seems USELESS in selection of slot on same day
                                setSelectItem(qq.cursor, ll, false, 1)// insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs last flag means copy patt_d > .patt , 1 series of hours in a day 
                                //console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
                                //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
                            );
                        }
                        */


                    } else {
                        // do not find a hour > or near , so start with first hour in day ! 
                        let li;
                        for (li = 0; li < qq.ctl.slotMat.relDayInd.length; li++) {// scan bookable days
                            if (qq.ctl.slotMat.relDayInd[li] > index_) break;  //i esimo day first row index >= index_   , so its the day >= the day with index index_ 
                        }
                        li--;
                        //if (li<=qq.ctl.slotMat.relDayInd.length)
                         {// should be
                            ind= qq.ctl.slotMat.relDayInd[li];;// reset ind

                            /*
                            let ll = qq.ctl.slotMat.relDayInd[li];
                            ds.push(ll);
                            sc++;// =1
                            // rebuild the cursor.resModel[match].path = cursor.resModel[match].path_h
                            //let check=qq.rows[ll].value;
                            qq.cursor.resModel[qq.rows[ll].value].patt = '\\b' + qq.cursor.resModel[qq.rows[ll].value].patt_h + '(?:\\s+|$)';;// a integer!!!!
                            refLunedi.push(// name of day , register x deiscrminating test, seems USELESS in selection of slot on same day
                                setSelectItem(qq.cursor, ll, false, 1)// insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs last flag means copy patt_d > .patt , 1 series of hours in a day 
                                //console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
                                //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
                            );
                            */
                        }

                    }

                    let cdate = qq.rows[ind].date;
 
                    if(ind != null && ind >= 0)fill3(ind,cdate);

                    function fill3(ind,cdate){// useless
                        let ll;
                    for (ll = ind; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
                        // nb one slot will be  ri = qc.pref_day_slot[x] x is the  (index of) rel day considering : sstart from it ? (its near the preferred hour )
                        // x is index of ctl.dayBookable that has value = current day 
                        if ((qq.rows[ll].date) != cdate) break;// the day slots finished
                        ds.push(ll);

                        sc++;
                        // rebuild the cursor.resModel[match].path = cursor.resModel[match].path_h
                        //let check=qq.rows[ll].value;
                        qq.cursor.resModel[qq.rows[ll].value].patt = '\\b' + qq.cursor.resModel[qq.rows[ll].value].patt_h + '(?:\\s+|$)';;// a integer!!!!
                        refLunedi.push(// name of day , register x deiscrminating test, seems USELESS in selection of slot on same day
                            setSelectItem(qq.cursor, ll, false, 1)// insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs last flag means copy patt_d > .patt , 1 series of hours in a day 
                            //console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
                            //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
                        );

                    }

                    }
            


            if (sc>0){ qq.cursor.medSyntL[0] = qq.cursor.resModel[qq.rows[ind].value].prompt_d + ', ' + qq.cursor.medSyntL[0];// add lunedì 25-12-2021 in first item
            /*
            if (sc > 0) {
                // alredy set in ctl : qq.selStat=1;// 1: day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)
                return {
                    chroot: 'th_3daySel_2',// VERY IMPORTANT :
                                        // will go to entity.select NB .select + param.ctl.selStat  can be used by:
                                        //  - relay ask and to select the th , usually only .complete instruct the relay the th to route (selector by sttus OR continuing with selector mached)
                                        //  - the ask (of selector th) template to select the prompt for selection loaded 
                                        // NB we can use more .complete for relay so in template we can use the same .complete also x select the prompt 
                     query: qq
     
                };// returns the complex query with selection definition prepared and the redirect th/child that will perform the selection  
            } else return { chroot: 'th_nosel', query: null };*/

            chroot = 'th_3daySel_2';//  hour selector view/template  in a selected day 
            ctl.slotMat.curRelInDay=-1;
        }
        }else {// sc=-1;// bug, error 
            console.error(' simplybookAiax.setHourSel call error , ind not in range',ind);
            ctl.f=null;// get rid of helper func 
        }
        }// ends setHourSel

        /*
        
        ctl is a multi turn :
        - multi query model selection
        1 - start with a request for a query model SERVICE by a aiax to this url ctl  with no current ctl status
                the ctl will return the simply query model with service to select AND set the status on .ctl with the event structure  in ctl.event , set selStat -10,  
                    and redirect to the th that will select the service
        2 - after selection a service 
        3 - start with a request for a provider query model provider by a aiax to this url ctl (with where param helping to refine/filter the provider ) with current ctl status the .ctl of SERVICE model
                and the where model the matched service model 
                the ctl will return the provider query model with provider to select (filtered with city where if provided and a search term=text )AND updated the status on .ctl with the match in service and in city , set selStat -8,  
                    and redirect to the th that will select the provider
                    as in slots query model we run the redirected th and loop returning to provider model with a select or provide a action or update wheres param to make the ctl to filter/refine the provider model    
                        when the looping on provider match (final selection) :
        4 - start with a request for a slot model provider by a aiax to this url ctl (with where param preferred datetime to build the full query results )  with current ctl status the .ctl of provider model
                ........
        
        */


        async function getEvent() {// start here the ctl session if no ctl status structure in qq=qs.curStatus. wil build the structure to manare selection of service and performer 
            selStat = -10;// initial status on the fsm recover a event (service/performer)  structure 

            // so as done x query model book_res_child , filled by a matcher with url refearring to this ctl  
            qq = await getEvents();// build ctl structure , fill simple query model 
            const qc = qq.ctl;// the ctl status injected on query model 
            qc.selStat = -9;// -9 .ctl.event filled , service query model filled for seletion 
            sc =qq.rows.length;qq.group.ctx.th_book_geit.start=1; 
            chroot = 'th_ServiceSel';// the th/ask to select the service
        }
        async function setPerformerSel(form_wheres, qs, rest) {// after coming back with a selected service , build the performer selector with the same status  query.ctl.eventSt
            selStat = -8;// initial status on the fsm recover a event (service/performer)  structure 


            const qc = qq.ctl;// the ctl status injected on query model 

            // so as done x query model book_res_child , filled by a matcher with url refearring to this ctl  
            qq = await getPerfs(form_wheres, qc);// build ctl structure , fill simple query model 




            qc.selStat = -7;// -9 .ctl.event filled , service query model filled for seletion 
            sc = qq.rows.length;


            chroot = 'th_PerfSel';// set routings to the th/ask to select the query model returned (peformer list)



        }



        // async function firstReq(sel,caseprompt,gotdate){// (cases, gotdate = false) {// update ctl status structure , fill complex refinable/filtrable multiturn slot query model 
            // gotdate : we know that desDtatTime is preferred by user
            // desDtatTime , this closure var can be from user preferred date or if miss,  the first date x unit selected  if dowloaded 
            // sel,caseprompt,gotdate: see calling sets at SWY


    async function firstReq(fromDate, desDtatTime, prefDay, prefHour, prefHM, gotdate) {// new // us local time, desDtatTime can be null , fromDate can be null (if desDtatTime is null) so wil be set as currentdate
        //  firstReq('2021-11-30','2021-11-30', prefDay=12 ????, 19, '19:45', true)
        // fromDate depends also on firstDay but if instead will be on desDtatTime day will take also its hour so :desDfromDate=desDtatTime if they are on same day (cant be different hours)
        // main purpose of param is :
        // set select hours  selector ( so complete redirect )
        // or set 3 days selector  ( so complete redirect )
        // + set the relative context ( specially the group.ctx.th_book_geit.... flags)that explain the response to user 
        // gotdate=true means fromdate(ever >=desDtatTime) is bookable (dayspan[0]=0 ) and is the desidered day (day in desDtatTime)

        console.log(' simplybook: firstReq starting , fromDate: ', fromDate, ' desDtatTime: ', desDtatTime, ' gotdate: ', gotdate);

        let selStat = 0;// initial status on the fsm recover a sched matrix 
        // 012021 : really we need to choose the service and provider , then will propone a def slot or ask user to give desidered dataetime so can get the sched matrix on which select a slot
        //  so before get a slot matrix we start at status -10 that recover the service/provider list , then after selected service and provider enter in status 0 to start getting the sched matrix ! 

        /*if (cases == 1) {// have pref date 
            if (canwait) { }
            else { }
        }*/

        if (gotdate) inter = 6;// was 2 , preferred desDtatTime is a date bookable , so get matrix  from that   then filter matrix proposing a selection possibly in some hours of that day , 
        else {//  desDtatTime can be known or not , anyway we respond to user with first bookable days starting from desDtatTime or firstavailable slot (consider desDtatTime today or tomorrow if null)


        }

        // { query,dayspan,dayBookable,daysc,totSlot,pref_day_slot,bookDays,fromDate,fromDay,fromHour} 
        // LOAD multi turn selectable query model

            let { date_, time, date,curDate } = curdatetime();// YYYY-MM-DD  , 19:57 , current new Date()
            if (!fromDate) {// set currenttime
            const iso = date.toISOString();

            // or, simpler :
            // const iso =  new Date().toISOString();

            // const isoLocal = iso.slice(0, 19);
            fromDate = iso.replace('Z', '-08:00');// ex : 2021-01-07T10:32:00.000-08:00  and the local time is 10:32


        }

        // here we anyway download the matrix , but if we have 
        // qq = await start(desDtatTime, inter);// desDtatTime comes from form_whInst (depending where ), format : duckling (us local)
        //qq = await start(fromDate, inter);// desDtatTime comes from form_whInst (depending where ), format : duckling (us local)


        // const qc = qq.ctl;// the ctl status injected on query model 
        // const qc = ctl;// just x convenience, useless it duplicates ctl !  , the ctl status injected on query model 

        qq = await start(curDate,fromDate, inter, ctl);// desDtatTime comes from form_whInst (depending where ), format : duckling (us local)
        // let query=[form_whInst.mod_date_des];// return query as array of just 1 item

        // now schedule must analized and the rows to select must be filtered for first pre select : the day . 
        // then refine again the schedule to select the hour in the preselected day
        // find the day to put in the filtered to preselect

        if (qq && !gotdate) {
            if (qq.ctl.slotMat.bookDays < 3) {
                inter = 10;// integer
                qq = await start(curDate,FromDate, inter, ctl);// really we should complete the alredy downloaded (where ?) matrix !
                /*
                    qq={query:  {,,,// std            
                                ctl:{                                                                       // the dyn selector model managed by query matcher 
                                    dayspan, daysc,dayBookable,totSlot,bookDays,relDayInd,                 // the controlling structure . can be used to recalc :
                                    pref_day_slot,                                                         // recalculated param to get the new selector model query (des. date and des. hour)
                                    fromHour, curRelInDay,                                                 //  the desidered date_time
                                    fromDate,fromDay                                                        //  start day x this slot matrix  
                                                                                                            //      from date is Date()  loaded using a duck locale trans as rome local . fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
                                }
                        }
                */
            }

            if (qq.ctl.slotMat.bookDays < 3) {
                inter = 30;
                qq = await start(curDate,FromDate, inter, ctl);
            }
            if (qq.ctl.slotMat.bookDays < 3) {
                inter = 90;
                qq = await start(curDate,FromDate, inter, ctl);
            }
        }

        // let dateTo=qq.fromDate+inter;// error , must use =addDays


        /* Main logic x slot matrix query model  FILTERING x multiturn SELECTION 
        // now filter the rows querred (bookable slots ) to set a selector model cursor.medSync with 3 day to select, then:
        //                                  if one of 3 is ok :  refilter its hour  or 
        //                                  if request a new date refiletr a new 3 day following the new desidered day and looping 
        // the condition $$xx:> will test row that has index with position not nulled on the filterable map  cursor.medSync[] ( initial cursor.medSync will copyed to cursor.medSync_ before filter);
    
                                        the test regex is the field cursor.resModel[stdT].patt: that contains x def the day ,, but that can run time settable 
                                                patt can be refined/ built using  patt_h: hour,patt_d: day,patt_i: dayi, depending if they are discriminant on the filtered set x the specific turn
                            mustache list the array  
                                     cursor.medSyntL[] ( do a copy)
                                        > filled with day number , day name and hour
                            filtered by skipping item as set by the  filterable map  cursor.medSync[]
    */



        // check if is null matrix 

        if (!qq || qq.ctl.slotMat.bookDays == 0) return null;

        // record pref date time in build the rows 

        // 032021 TODO seems a duplicate of qq.ctl.slotMat !!!! delete 
        // WARNING WARNING  : we delete that :
       //  qq.cursor.time = { prefDay, prefHour, prefHM, fromDate, desDtatTime };// the time when rows/cursor were built. prefDay,prefHour are from desDtatTimeprefDay unless set by qs 

        // store def arrays :
        //qq.query.cursor.medSync_=Object.assign({},qq.query.cursor.medSync);
        // qq.query.cursor.medSyntL_=Object.assign({},qq.query.cursor.medSyntL);
        qq.cursor.medSync_ = qq.cursor.medSync;
        qq.cursor.medSyntL_ = qq.cursor.medSyntL;









        if (gotdate ||// surely fromday=des day (fromDate == desDtatTime)
            // as  fromDate(>=desDtatTime)  , appears  that desDtatTime has day bookable ( so we can select hour) if :
            // -  fromDate == desDtatTime and is bookable dayspan[0] ( first bookable is 0 relative from fromDate) 

            // if not :
            //  - fromDate > desDtatTime (in this case we suppose firstday is bookable)
            //  or
            //  - fromDate = desDtatTime is not bookable (dayspan[0] >0)
            // so (that is good also for new desidered day after a not successfull search ):
            //  - find first bookable with rel >= at rel of  new desDtatTime has day and check  that is = 
            // that search is done starting from   curRelInd (better set it to 0 anyway or progress from a last search)

            //  following if none of 3 days proposed is accepted we can get a new desidered , calc the relative and repeat the check AAAA  
            //       
            (qq.ctl.slotMat.dayspan[0] == 0 &&// consider the first (0) bookable day 
                desDtatTime && fromDate == desDtatTime)) {  // now the selector will match hours in preferred day , prefHour can be missing or 0 (default , means no user requirement)
            // now check if also hours is met , in this case we dont need to select hour on a bookable matched day 
            let dayIndex = qq.ctl.slotMat.relDayInd[0];// row index, a pointer to first slot of the selected day that is the first bookable , so must be 0?
            qq.ctl.selDayId = qq.rows[dayIndex].date;// the selected day  Id/key/name selected . store as status property  at first level , used to select hour on selected day
            qq.ctl.selDayIndex = dayIndex;// 032021
            qq.ctl.vselDayId = qq.cursor.resModel[qq.rows[dayIndex].value].prompt_d;// the selected day  vname . store as status property  at first level , used to select hour
            let hind;// slot row index 
            if(nearpol==0)
            {if (prefHour) hind = qq.ctl.f.findSlotAfterHourH(dayIndex, prefHour);// in first relative day find if there are slot with hour >= prefHour. or there are not (return null)
            }else //if (prefHour) 
            {hind = qq.ctl.f.findSlotNearHourH(dayIndex, prefHour);// to implement , will return not null 
            }
            // now 2 case or we have hind (hind) in des day or we must select 3days
            // }if(hind>=0){// so we are her because the preferred day is a bookable day , now we know  the available hour is >= to pref hour , so check the hind slot hour
            if (hind != null && !isNaN(hind) && parseInt(qq.rows[hind].time.substring(0, 2)) == prefHour) {// '23:59:59' > '23' il best nearer hour must be = prefHour, so we got HOUR MATCH on a prefHour asked by user 
                //qq.group.ctx=qq.group.ctx||{};
                qq.group.ctx.th_book_geit.meetDes = '1';//context flag that  explain response to user : we meet desidered day and hour
                // but the th to redirect can be different (the slot match confirm th ! )
                // copy what we do in status selStat == 2
                ctl.selStat == 3;


                // set the selector matching var as it was done when builded refine selector (.cursor:{resModel,,,} without effectly build the refine we just set when it would match !!

                qq.instance = qq.rows[hind];
                qq.match = qq.instance.value;// restore match as we finish and goon without another refine selection 
                qq.matched = 'match';
                qq.group.sel = { item: qq.instance, match: qq.match };
                qq.index = hind;// new added
                qq.ctl.selStat = 3;// matched slot 

                sc = 1;// just not to return null;
                console.log(' simplybook: firstReq, after start() slot matrix  downloading , we got that first bookable cal day: ', qq.ctl.slotMat.dayBookable[0], ' match  the desidered day and hour , desDtatTime: ', desDtatTime);

                console.log(' slot matched  is: ', qq.match, ' , meetDes = 1, desDtatTime: ', desDtatTime, ' prefHour: ', prefHour, ', setting selStat:', ctl.selStat);
                chroot = 'slotmatch';// goon with booking now at least the slot is got               
                ctl.f = null; // get rid of not persistent helper funcs :

            } else {// so preferred day match , so goto to a 3 hour selection 
                if (prefHour)
                    qq.group.ctx.th_book_geit.meetDes = '0';//context flag that  explain response to user : we meet desidered day but not a requested prefHour
                else // not exist or is 0 , so no prefHour is asked by user 
                    qq.group.ctx.th_book_geit.meetDes = '2';//context flag that  explain response to user : we meet desidered day but dont have

                console.log(' simplybook: firstReq, after start() slot matrix  downloading , we got that first bookable cal day: ', qq.ctl.slotMat.dayBookable[0], ' match  the desidered day  , desDtatTime: ', desDtatTime);

                console.log(' so firstReq= desidered day is  matched as bookable , there are ', qq.ctl.slotMat.daysc[0], ' slot but pref hour dont match (if exists is  < or >, otherwise is 0(def, no prefhour).  so  start starting setHourSel , meetDes = 0, desDtatTime: ', desDtatTime, ' prefHour: ', prefHour, ' start slot ind: ', hind);
                let also_minor = true;
                //if(!hind){// 0 not matches !?
                if (hind == null || isNaN(hind)) {// con be only in findSlotAfterHourH(dayIndex, prefHour) case , never in findSlotNearHourH case 
                    // no slot after prefhour, so (TODO) temporely set the first slot in day
                    // >>>>>>>>>>>>>>>>  (TODO) should be the first of 3 hour before deshours
                    hind = dayIndex;//=qq.ctl.slotMat.relDayInd[0] that is 0 !!!
                    prefHour = 7;// so if cant find a hour near prefHour  or prefHour is null , set prefHour=7
                }                console.log(' so firstReq= desidered day is  matched as bookable , taking care of hind and near policy ',nearpol,' , we finaly ask 3hour selection with hind= ',hind,' prefHour= ',prefHour);
                setHourSel(hind, desDtatTime, prefHour, also_minor);// will set status =...  and correct complete prefhour is moreimportant then desidered hour 

            }

        } else // des day not matched , goto 3days selector 
        {// // no slot available for desidered date time so discover some slot in following days ( and using preferred hour ). desDtatTime is a user pref but we still dont know if is bookable so filter 3 bookable days 
            console.log(' simplybook: firstReq,after start() slot matrix  downloading  , checked that first bookable cal day: ', qq.ctl.slotMat.dayBookable[0], ' is not the desidered day , desDtatTime: ', desDtatTime,
                '\n setting 3days selector  , meetDes = 10 (11 if desDtatTime=null ), desDtatTime: ', desDtatTime, ' prefHour: ', prefHour, ', setting selStat:', qq.ctl.selStat);

            // prompt flag , to say if we give a first bookable after the desidered 
            // if(desDtatTime&&(dayspan[0]==0&&fromDate==desDtatTime))
            if (desDtatTime) qq.group.ctx.th_book_geit.meetDes = 10; else qq.group.ctx.th_book_geit.meetDes = '11';// 3 days selector because 10 : we desidered date is not met, or 11:because we dont have desidered day
            const tests = 3; // max number of datetime proposal (sc), can be min 2 to max 4

            // let query=qq.query;// x convenience

            // useless if (selStat == 0) {
            // *****  RE-BUILD medSync and medSyntL : 
            //          - a new selection model is filtered so we create a partition on datetime selecting a representant of class day, ( of a ipotetic/stimate preferred hour=
            //                  filling  :
            //                          > medSync (not null is the representants of class day ( hour stimated) ) 
            //                          > the match .patt matching the day property/class  and 
            //                          > medSyntL ( the item/class vname). 
            // ***** before run this, in case we have a new desidered date/time we must rebuild the: 
            //              - curRelInDay and pref_day_slot (a class representative rows index), using the rows index pointer to relative date slots :relDayInd (first rows index of element of class day)
            //                      nb in rows the elemet are ordered by day class  , then by hour class !!

            // set status in ctl obj :

            ctl.selStat = 1;// 1: day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)



            qq.cursor.medSyntL = [];// rebuild with just item to test
            // errors

            let curRel = ctl.slotMat.curRelInDay;//>>>> current/new desidered rel day   
            // when just got the matrix it is  0 because 
            // , then can be reviewed with the desidered local hour   qc.fromHour
            sc =
             sel3day(curRel, qq, ctl, tests,setSelectItem);// curRel the starting relative day (day-startday)to buils 3 dayds selector ,qq=param;ctl=ctl;// ctl: extended qq.ctl

            /*
            ================   delete :
            // porting sel3day()
            // param:
            curRel =curRel;
            qq=qq;ctl=ctl;// ctl: extended qq.ctl
            tests=tests;
            // redefine : qq.cursor.medSync,
            // updates : qq.cursor.resModel
            // return: sc?, // dim of selector
            // start 
            let sc=0;// correct?
            let refLunedi = [];// local
            let curRelInd = 0;// starting index of dayspan  under evaluation , better set 0 anyway 
             let dayspan = ctl.slotMat.dayspan, dl = dayspan.length;// number of the rel day available x booking ( from start day)
            ds = [];//the rows  index of slot to propone x selection : its a subset of the bookable rel days dayspan. usefull to ......... ????


            
            let dim = qq.rows.length;
            qq.cursor.medSync = Array(dim);// rebuild medSync, fill with null all rows index 
            let inde;

            // todo  012021 review curRelInDay, dl, curRelInd

            // >>>>>>>>>>>>>>>>  todo : modify this first desidered day match ( find if a desidered day is bookable or get the list of first 3 bookable day after a not bookable desidered day )
            //                          for a new desidered day 
            //    ... get a new desDtatTime so get the relative to fromDate  so set status curRelInDay
            // for the first search it could be negative but is managed in previous if clause

            let newDesidDaygot=false;


            for (l = curRelInd; l < dl; l++) {//  from last relative days index (?)  on , better start from 0 anyway 
                if (dayspan[l] >= curRel) {// is last rel days examined dayspan[l]  < of wanted rel day curRel ? , is so skip , try the next index l
                    // at this index the rel day is the first to be >= at the wanted / desidered rel day 
                    let curRelInd_ = l;// this is the index so dayspan[x]>=curRelInd are good x selection , take the first tests so 
                    console.log('  simplybook: firstReq, setting 3days selector  , meetDes = 10 : as client (new) desidere book day or first possible bookable day is  rel day ', curRel, ' at des hour ', ctl.slotMat.fromHour, '\n we got the first relative ( vs startday)  bookable day(', dayspan[curRelInd_],
                        ') >= desidered/first rel day (', curRel, ') , in a slot of index : ', curRelInd)

                    // now check if is > or = to desidered relative 
                    if (dayspan[curRelInd_] == curRel
                        && curRel != 0 // change in new desidered  desDtatTime  , first time case managed by previous if 
                    ) {
                        newDesidDaygot = true;
                        // .... do like previous if in case we got a desidered day in case of a new    desDtatTime reset 
                        console.error('  simplybook: firstReq,future use new    desDtatTime reset . desidered calendar day ', qq.ctl.slotMat.dayBookable[curRelInd_], ' is bookable so do hours selection on it (');
         


                        // fills new filtered selection medSync,medSyntL,resModel obj : insert 3 datetime of days, following desidered day , with slot hour near to desidered hour  
                    } else {
                        console.log('  simplybook: firstReq,  desDtatTime is not bookable so choose 3 following bookable days starting from calendar day: ', qq.ctl.slotMat.dayBookable[curRelInd_]);
         
                        for (let ll = curRelInd_; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
                            // calc the rows index of the slot with a relative day >= des day and near the desidred hour
                            let ri = ctl.slotMat.pref_day_slot[ll];// ri is the index of the slot with rel day after the desiredered rel day (max test  days is tests!  )can be -1 
                            ds.push(ri);
                            sc++;

                            refLunedi.push(// name of day , register x discrminating test
                                setSelectItem(qq.cursor, ri)// // insert item ri in new (filtered) selection model cursor.medSync/medSyntL/resModel objs
                            );
                            console.log('  simplybook: firstReq, adding a selecting rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', qq.rows[ri].value);
                            //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
                        }
                    }
                }
                break;
            }

            // now test  what refLunedi are discriminamt and add it to pattern qq.query.cursor.resModel[kkey].patt 

            if(!newDesidDaygot){ 
                if(l==dl) console.error('  simplybook: firstReq, no bookable got in 3day selctor builder ');
                else for (l = 0; l < refLunedi.length; l++) {
                let patt=refLunedi[l].patt,disc=true;
                if(patt){for (let m = l+1; m < refLunedi.length; m++) {
                    if(refLunedi[m].patt==patt){
                        disc=false;// not discriminating
                        refLunedi[m].patt=null;}
                    }
                    if(disc){// add lunedi to patt , it is a discriminating 
                        let kkey=refLunedi[l].kkey;
                        qq.cursor.resModel[kkey].patt =qq.cursor.resModel[kkey].patt+'|'+'\\b'+patt.substring(0,4);// cursor.resModel[kkey].patt can be the cal(endar) day, so a integer
                        console.log('  simplybook: firstReq, adding a discriminating: ',patt,' on selecting  day(',kkey);
 
                                   }
                }
                }
            }else{
                console.error('  simplybook: firstReq, got a day in start proc after dedicated if');
            }

            ========================
            */




            /* NO: 
            for (sc = 0; sc < tests; sc++)// sc test to do , tests is max rel days to test 
            
            // find the 3 days bookable  and set the filter/index not null ( the index in );
            {
            
                        if (l < dl) {// l is the rows index corresponding to the slot to propone according to the desidered day/hour
                            sc++;
                            qq.query.cursor.resModel[l].patt = qq.query.cursor.resModel[l].patt_d;// calendar day number in pattern
                            refLunedi.push(qq.query.cursor.resModel[el].patt_i);// name of day , register x deiscrminating test
                            qq.query.cursor.medSyntL.push(qq.query.cursor.medSyntL_[i]);// rebuild itemlist with just the slot to test
                            return el;// set itemname in medSync
                        }
                        else {
            
                            break;// no more days to select                     }
                        }
                    }
            
            
            
            
            
            
            
                    qq.query.cursor.medSync=qq.query.cursor.medSync_.map((el,i) =>{// rebuild the current index/filter of bookable slot  medSync, taking the first 3 item from full medSync_ , the rest null
                        // find the 3 days bookable  and set the filter/index not null ( the index in );
                        if (sc < tests) {
            
                            let inde;
                            for (l = curRelInd; l < dl; l++) {// _  ?????????????
                                if (dayspan[l++] > curRel) {// a rel day folowing curRel
                                    curRelInd = l;
              
                                    preff = pref_day_slot[curRelInd];
                                    break;
                                }
                            }
                            if (l < dl) {
            
                                sc++;
                                qq.query.cursor.resModel[el].patt = qq.query.cursor.resModel[el].patt_d;// calendar day number in pattern
                                refLunedi.push(qq.query.cursor.resModel[el].patt_i);// name of day , register x deiscrminating test
                                qq.query.cursor.medSyntL.push(qq.query.cursor.medSyntL_[i]);// rebuild itemlist with just the slot to test
                                return el;// set itemname in medSync
                            }
                        } else {
            
                            return null;// no test
                        }
            
                    });
            
            
                    */

            // now say if array refLunedi contain  duplicatd value , if so the concept is not a discriminating one so dont merge in cursor.resModel[stdT].patt (as regex or ) !
            // ....

            // next state : the user answer the 3 day selection match choosing a day after the desidered and with hour after the desidered 
            //      - conf a day ( and hour so can go to confirm the hour if not ask :prefers a diff day previous , after or among 1,2,3  or enter a new day 
            //          diff day : verifyif is in query , download eventually a new query and rebiold the 3 set to loop the 3 day selection


            // cursor.medSync.forEach(() =>{
            //        // find the 3 days bookable         });


            chroot = 'th_3daySel';// complete

            // get rid of not persistent helper funcs :
            ctl.f = null;


            // }
        }

        /*         else { sc=-1;// bug, error 
            ctl.f=null;// get rid of helper func 
            console.log(' simplybook: firstReq, error code');
        }*/

    }// end firstReq




        // finally 



    // as we forget to reset do another time here :
    if(qq.ctl)qq.ctl.f = null;



        let templ,cri;
        //if(qq.group.ctx.th_book_geit&&!isNaN(qq.group.ctx.th_book_geit.meetDes))templ=qq.group.ctx.th_book_geit.meetDes;
        //if(qq.group.ctx.th_book_geit&&!isNaN(qq.group.ctx.th_book_geit.meetDes))templ=qq.group.ctx.th_book_geit.meetDes;
        if(qq.group.ctx.th_book_geit&&qq.group.ctx.th_book_geit)templ=qq.group.ctx.th_book_geit.meetDes;
        if(qq.group.ctl&&qq.ctl.slotMat)cri=qq.ctl.slotMat.curRelInDay;
        console.log('\n  simplybook: Return .  sc: ',sc,' ,routing template to prompt selector(.complete) chroot: ',chroot,'  selStat:', qq.ctl.selStat,' selector prompts: ',qq.cursor.medSyntL,' template reason flags (meetDes: why we are asking this selector): ',templ,
        ' current 3days startfrom ',cri);



        if (sc > 0) {
            // alredy set in ctl : qq.selStat=1;// 1: day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)
            //let cchh=chroot;
            return {
                chroot, // the relay/redirection  to the managing thread , both in case of match and in case to refine/reset selection filters 
                query: qq

            };// returns the complex query with selection definition prepared and the redirect th/child that will perform the selection  
        } else if (sc == 0) {
            /*if(mach){
                return { chroot, query: qq.query };// as match we redo addMatchRes(true,,,)  but as the matcher find the .param.matched=' match' , should refill the same matching .param, 
                
            }
            else */
            return { chroot: 'th_nosel', query: null };
        }else return { chroot: 'th_err', query: null };// an error , do as no result got 

        // } else return null;

        function setSelectItem(cursor, ri, cp_day = true, prmode = 0,sc) {// ri is the index in full matrix , patt_d > patt if cp_day, pmode 1 series of hours in a day prompt 
            // fills 1 item in filtered selection obj :  medSyn,resModel,medSyntL
            let kkey = cursor.medSync[ri] = cursor.medSync_[ri];// the key , itemname, corresponding to index ri, rebuild the sync/ filter array 
           // if (cp_day) cursor.resModel[kkey].patt = cursor.resModel[kkey].patt_d;// calendar day number in pattern
            if (cp_day) cursor.resModel[kkey].patt = '\\b'+cursor.resModel[kkey].patt_d+'(?:\\s+|$)';// calendar day number in pattern // \b1(?:\s+|$) to match 1
            // refLunedi.push(cursor.resModel[kkey].patt_i);// name of day , register x deiscrminating test
            if (prmode == 1) cursor.medSyntL.push(cursor.resModel[kkey].prompt_time);//  alle ore 17:45, used in 3 hours 
            else {
                let ins;
                if(sc==1)ins=cursor.medSyntL_[ri];else{ins=cursor.medSyntL_[ri].substring(0,cursor.medSyntL_[ri].indexOf(' alle'));}
                cursor.medSyntL.push(ins);// rebuild itemlist with just the slot to test
            }
            // console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
            console.log(' > symplybookingAiaxCtl setSelectItem : added a selection item , value/datetime: ', kkey, ' patt: ', cursor.resModel[kkey].patt, ' dayname : ', cursor.resModel[kkey].patt_i, ' to add if discriminant ');
            return {kkey,patt:cursor.resModel[kkey].patt_i};// name of day , register x deiscrminating test
        }


    }
    /*
    async function book(vars, slot, rest) {// consider only rest_,appcfg .
        // let desDateTimeEntityMatch=form.mod_date_des;// form.thenameofentity;
        //  let desBookingDate,desBookingSlot;// calc from desDateTimeEntityMatch !!!!
        console.log(' book book ctl received slot qs : ', slot);
        // now rest on simplybooking to find available slot on desBookingDate
        await start(); let result = ['booked'];// return query as array of just 1 item
        return { result };
    }*/

    function it(ri) {
        if (ri.charAt(0) == 'M') return 'Lunedì';
        //else if(ri.charAt(0)=='T')return 'Martedì';
        else if (ri.charAt(0) == 'T') return 'T';
        else if (ri.charAt(0) == 'W') return 'Mercoledì';
        else if (ri.charAt(0) == 'F') return 'Venerdì';
        //else if(ri.charAt(0)=='S')return 'Sabato';
        else if (ri.charAt(0) == 'S') return 'S';
        // never
        //else if(ri.charAt(0)=='X')return 'Giovedì';
        //else if(ri.charAt(0)=='Y')return 'Domenica';

    }

    function curdatetime() {

        let date_ob = new Date();

        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);

        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // current year
        let year = date_ob.getFullYear();

        // current hours
        let hours = date_ob.getHours();

        // current minutes
        let minutes = date_ob.getMinutes();

        // current seconds
        let seconds = date_ob.getSeconds();

        // prints date in YYYY-MM-DD format
        let date_ = year + "-" + month + "-" + date,
            time = hours + ":" + minutes;

        return { date_, time, date,curDate:date_ob };// YYYY-MM-DD  , 19:57 , calendar day , current new Date() ??
    }

    function QueryM() {
        /*
            {
                objMod: true,// return the std complex query  model : 
                rows: [// event list across days and hours 
                ],
                cursor: {// this is a runtime build from some case cursor template (selects day, select slot hour)!!!
                    resModel: {// will point to rows[x].value 
                    },
                    medSyntL: [],// the list of voice name ( to list the items to user x matching ) item to test  MUST be ON SYNC with rows ( can use medSync) !!!!!
                    medSync: []// the resModel key of the item to test.  for associated resolver row index , 
                    // it is a the sync map  : resModel[stdT=medSync[i]].index is the index of rows to the associated row=rows[resModel[stdT=medSync[i]].index],
                    //          usually for construction resModel[stdT=medSync[i]].index=i  !!!!!!!!!!!!!
                    // used also  to filter testing on rows : in convo.stdMatch() , case $$xxx:>,  do not test if medSync[i] is null !
        
                    // >>>>>>> medSyntL and medSync will be copied in medSyntL_ and medSync_  ( arrays of all bookable slots with a date-time after the desidered date-time) 
                    //          then rebuilt ,from full arrays ..._,  to take only 2-4 testing items ( only item not null in medSync will be tested )
                    // initially the are the first items corresponding the following date but if user ask a following desidered date the list can be rebuilt 
        
                    // put on obj not here :  ,clt:null// ctl structure to build new selector (x desidered day//hour) , can be usefull to reset pref_day_slot whith new curRelInDay and fromHour
        
                },
                group: {
                    sel: {
                        item: null, match: null// will be set by convo $$desidere:>
                    }//group={sel:{item:this.intents[0]}
                }
        
            };*/
        this.objMod = true;// return the std complex query  model : 
        this.rows = [// event list across days and hours 
        ];
        this.cursor = {// this is a runtime build from some case cursor template (selects day, select slot hour)!!!
            resModel: {// will point to rows[x].value 
            },
            medSyntL: [],// the list of voice name ( to list the items to user x matching ) item to test  MUST be ON SYNC with rows ( can use medSync) !!!!!
            medSync: []// the resModel key of the item to test.  for associated resolver row index , 
            // it is a the sync map  : resModel[stdT=medSync[i]].index is the index of rows to the associated row=rows[resModel[stdT=medSync[i]].index],
            //          usually for construction resModel[stdT=medSync[i]].index=i  !!!!!!!!!!!!!
            // used also  to filter testing on rows : in convo.stdMatch() , case $$xxx:>,  do not test if medSync[i] is null !

            // >>>>>>> medSyntL and medSync will be copied in medSyntL_ and medSync_  ( arrays of all bookable slots with a date-time after the desidered date-time) 
            //          then rebuilt ,from full arrays ..._,  to take only 2-4 testing items ( only item not null in medSync will be tested )
            // initially the are the first items corresponding the following date but if user ask a following desidered date the list can be rebuilt 

            // put on obj not here :  ,clt:null// ctl structure to build new selector (x desidered day//hour) , can be usefull to reset pref_day_slot whith new curRelInDay and fromHour

        };
        this.group = {// the selector state (sel), next ask/th template context, bl params  
            sel: {
                item: null, match: null// will be set by convo $$desidere:>
            },//group={sel:{item:this.intents[0]}
            ctx:{th_book_geit:{meetSer_length:null,meetDes:null}},// context in ask template in service list and in ask routed by  .complete 
                    // meetDes: 0 desidered day met so chose hour.
                    //          1 desidered day and hour met do confirm ,
                    //          10 desidered not met choose 3 days,
                    //          -1 no bookable at the moment 
                    //                      with firstday 
                    //           100: day available choose hour (waiting for the matrix to download ....   future use 

            /* considerazioni per migliorare il settaggio di flag nel th che gestisce il .complete del turn
            qq.group.ctx.th_book_geit.meetDes  dovrebbe servire come flag/context del th che gestisce il .complete del turn
	usato in   in realta non usato perche .complete vengono tutti instradati su un unico th (th_book_geit) e il .complete fa da context flag 
	pero devo fare un if(.complete=....) invece dovrei usare un flag tipo meetDes.flag1 cosi  posso fare {{...meetDes.flag1}} e non andare a fare un if meetDes= flag1 o .complete= flag1 
            */



            param:null// bl x template
        };


    }

    QueryM.prototype.addRow = function addRow(row, selItem, prompt, sep) {// add a item in query model , and related simply std selector model item resModel //stdT is the value field ! row.value 
        // selItem minimum is :{vname,patt}
        // functions wont be persistant on status save!!! 
        // TODO aggingere l'espansione della data in  :  23 dicembre 2020 




        let index = this.rows.length;
        let stdT = row.value;
        this.rows.push(row);
        // per syncronizzare meglio medsyntL e il resModel aggiungo l'array che mappa i item in index 

        this.cursor.medSync.push(stdT);//  (**) mappa di sincronismo duale di resModel.index. maps index > itemname=row.value=stdT  *MEDSYNC *MEDSYNTL
        // al list mustache assieme a dmedSync ( o pre annullare un clone ) 

        this.cursor.medSyntL.push(// it(elap.toLocaleString('it-IT', options))// the item list to match  *MEDSYNC *MEDSYNTL
            prompt + sep//', '//oppure'
        );// e l'ultimo ??????? .  list items to select . c'e' disponiilità per    :
        // giovedi 15 dicembre alle 17 e 30  oppure ....
        // con bu skip value if corresponding patt in null 



        // insert index if not provided :

        selItem.index = selItem.index || index;

        this.cursor.resModel[stdT] = selItem;



    }

    // old function getNameDiscr1(name,query,concepts,) {//query=result.companies. nod add params : (namea,servProvList=query=[item1{name,id,description,,,,} ,,,,],
    // concepts={names=[wherename1,,,]// useless 
    //          gets[j=0..n],prompti[j=0..n],
    //          selected=[value1,,,,]},/ comes from qs, wheres comes from forms !!
    //          initially :  we consider none selected , gets and prompti are def inside 
    // Wheres={names=[wherename1,,,]// useless 
    //              ,gets[z],were_prompti[z=0..n]}) nb these wheres are not selected so can be any values inside servProvList items (only item that satisfied selected wheres are extracted and put into servProvList)
    //  usually gets[z]= item => item.feature[wherename1] 
    // to do servProvList becoms provxServiceL , gets are used only in special query concept excluding   wheres concepts , prompti must be defined x all keys 

    // ***** so you see that here wheres and concepts are treated the same, is the caller responsability to set them properly 
    // >>>>> so concepts+Wheres are set in : keyname,gets,prompti,selected ( only concepts can have selected values )


    //function isPrevDay(firstDate, desDtatTime){  // isPrevDay('2021-01-01T....','2021-01-02T....')=1
    function diffDay(firstDate, desDtatTime){  // isPrevDay('2021-01-01T....','2021-01-02T....')=1

        /*
        if( parseInt(firstDate.substring(8,10))< parseInt(desDtatTime.substring(8,10))){
            if( parseInt(firstDate.substring(0,5))> parseInt(desDtatTime.substring(0,5))|| (
                parseInt(firstDate.substring(0,5))== parseInt(desDtatTime.substring(0,5))&&parseInt(firstDate.substring(5,7))> parseInt(desDtatTime.substring(5,7))
                ))return false;
            else return true;
            }
        else if( parseInt(firstDate.substring(0,5))< parseInt(desDtatTime.substring(0,5))|| (parseInt(firstDate.substring(0,5))== parseInt(desDtatTime.substring(0,5))&&parseInt(firstDate.substring(5,7))< parseInt(desDtatTime.substring(5,7))))return true;
        else return false;
        */
	var date1 = new Date(firstDate.substring(0,10)),date2 = new Date(desDtatTime.substring(0,10));


// To calculate the no. of days between two dates
return Math.floor(((date2.getTime() - date1.getTime())/ (1000 * 3600 * 24)));//toFixed(0);

        }

    


    function getNameDiscr1(namea, query, keyname, prompti, gets, nextr = 4) {// nextr is the max items in out priority items list 
        // so keys/discriminatingVar/conceptvar are:   :
        // - name extracted keys= first 3 word of name excluding 2 char words. not indexed 
        //      > prompt is just the first 3 3 words 
        //      indexed (max )
        // - wheres keys (where are db selecting prop or via equivalent procedure here . specifically each items must have a wheres[z] property )
        //      > prompt contribution  are obtained adding were_prompti[i] before the key 
        // -other extracted keys  ( are concepts extractable from item query[j] properties and can be selected here  )
        //      concept[j]=gets[j] from properties and feature of query[i] item 
        //      > prompt contribution  are obtained adding were_prompti[i] before the key 

        //      nb but these cant be selected 
        //      so strategy dont indicate opportunity x selecting them with sb where selection , but could be done working here in gets related concepts
        /*
        returns  {names,prompt_,patt,strategy,disambJ,disambiguate1,disambiguate2,discrJ};
        - names: query[i].name items key name
        - prompt:  prompt text to select sme words (max maxKeywordsinName) from .name and the other discrimunatory  var/concepts   , template is in  prompti
         gets[] : the cb(query[i]) to extract from iesimo item the discriminatory concepts , has dimension of discriminatory concepts is dvar.
                    so discriminatory concepts (max to prompt = mdp )and first maxKeywordsinName words on .name[i] are the keyworks to best match using prompt=prompt_[i]  and patt=patt[i] !!!
        
                    manca un init che builda come sotto fatto a mano !
        
        strategy,disambJ,disambiguate1,disambiguate2,discrJ : sono suggerimenti per chiedere , in alternativa al best match :
            strategy=1: best match (mix) , promptlist  max nextr item,  with prompted key  < mdp, do best match
                        on discriminatory key/var/concepts of index discrJ :
                      2: (disambJ!=ull ) ask disamb on a key (j=disambJ index)   from the values disambiguate1,disambiguate2 , ex   want rome or milan ?, then requery 
                      3: (discrJ!=null) prompt to match a key of index discrJ , on a keyvaluelist , then requery 
                      nb 1 is preferred then 3 then 2 .
        
        
                            
                            discriminatory selection ( select on all items of a discrim var, or jus disambiguate from 2 val of the var or )
        
        */

        let maxKeywordsinName = 3// sure ?
            // nextr=4// max list item dimension ,:  limit the items to select to a max of nextr 
            , dvar = keyname.length// city + province + type the discr var ex: large province sector : the discriminator concept to insert in returning   prompt_,patt,
            // here 
            , mdp = 2//maxdiscrinprompt <= dvar  , maxkeyInPrompt

            // ex 1/4 means 1  one value
            // 1 1  al terzo = null  all    val 1 valcont 
            //   1 1 1 1   >    _ _ _ _
            //   1 1 2 2    >   1 1 2 2 
            //   1 1 2 1  >  _ _ 2  _                       DE3
            // rule after a value meet count 3 we null
            //  discr1=[1,1,2,1]  values[0]=1  count[0]=1,2 al 3 si cancella il values[0]. alla fine solo i  
            ;


        let getname = function (i) {// return {key=query[i].id='1',prompt=query[i].name.limitata_a_3_word='mario rossi spa'}
            //query[i].name.split
            // max 3 words str.indexOf(searchValue[, fromIndex])
            let myn = query[i].name, mwords = maxKeywordsinName,//3,
                ni, key = query[i].id;
            function iter(ind, cc) {
                cc++;//if(cc++>mwords)return ind;
                if ((ni = myn.indexOf(' ', ind)) < 0) return -1; else {
                    if (cc >= mwords) return ni;
                    else return iter(ni + 2, cc);// 'i  frari '  ???? min length= 2 
                }
            }
            let last = iter(2, 0);// get first 3 words delimeter starting from 2nd char 
            if (last <= 0) {
                return { prompt: myn, key: myn };// less  then three words, no filtering ex key='one two three four'  last=13
            } else {
                return { prompt: myn.substring(0, last), key: myn };// key is misleading , more then three words, third word termining at last index
            }

        }


        let discr = new Array(dvar),// discr[0] the values of first disc var (=discriminating key/var  ) 
            values = new Array(dvar),// 
            count = new Array(dvar);// 

        /* const    prompti = [],// 
            gets=[],keyname=[];
            prompti.push(' sede a ');keyname.push('sede');// the words user to present the disc var 
            prompti.push(' provincia di ');keyname.push('provincia');
            prompti.push(' tipo  ');keyname.push('tipologia');
            gets.push(function(i){
                //query[i].name.split
                return query[i].address.city;
            });
            gets.push(function(i){
                //query[i].name.split
                return query[i].address.province;
            });
            gets.push(function(i){
                //query[i].name.split
                return query[i].type;
            });
            */

        for (var i = 0; i < discr.length; i++) {
            discr[i] = new Array(nextr);
            values[i] = [];
            //mapVal[i]=[];// perf map 
            count[i] = [];
        }


        let prompt_ = new Array(nextr)// the prompt x selector , pairs with pattt
            , names = new Array(nextr)
            , vname = new Array(nextr)// the prompt x the row item 
            , patt = new Array(nextr)// pattern is the rows patt, pairs with vname
        pattt = new Array(nextr);// pattern x selector x this query



        let scan = query.length; if (nextr < scan) scan = nextr;
        for (let i = 0; i < scan; i++) {// find wheres/concepts/keyvar for first scan item 
            for (let j = 0; j < dvar; j++) {
                let myv = gets[j](i, query);// keyname j in item i 
                //discr[j][i]=myv;// a key j value found in item i 
                let z = -1;
                if (myv) {
                    for (z = 0; z < values[j].length; z++) {
                        if (!((!values[j]) || (!(values[j][z] == myv)))) {
                        count[j][z]++;
                            console.log(' in item n ', i, ' found a key (keyname=', keyname[j], ' with value : ', myv, '  duplicated ', count[j][z], ' times, at index z   : ', z);
                            break;
                        }

                    }
                    if (z == values[j].length) {
                        values[j].push(myv);
                        count[j].push(1);
                        // mapVal[j].push(myv);
                        console.log(' in item n ', i, ' found a key: ', myv, '  not duplicated , so insert at found key values[keynumber=', j, '(keynome=', keyname[j], '),index=z=', z, ']= ', myv);
                    }
                }
                discr[j][i] = z;// a key j value (mapped by  value=values[discr[j][i]]) found in item i , if -1 no found
                console.log(' check : in item n ', i, ' found a keyval: ', values[discr[j][i]], ' keynumber ', j, ' ,keynome=', keyname[j], ',in values of  index=z=', discr[j][i]);
                // console.log('\n getNameDiscr : i,j ',i,j);
                // console.log(' discr i,j  : ',mvy);

            }

        }
        // now scan each query item and delete the discr that counts >2 , max 2 dirsc per prompt 
        // set a indexmap to order items by discriminators efficiency ( just move in pool position who has more (not name) discriminators  so one, two array staff)

        // 3 choices . 1: mix , promptlist  max nextr item,  with prompted key  < mdp, do best query 
        //              2: ask disamb on a key (j index)   want rome or milan ?, then requery 
        //              3: ask match a key on a keyvaluelist , then requery 


        //const maxkeyInPrompt=2;
        let discrim = new Array(dvar); discrim.fill(0);//the premium on ask for what desidered value for key j ;
        let disamb1 = new Array(dvar), disamb2 = new Array(dvar); disamb1.fill(-1); disamb2.fill(-1);
        let disamb1v = new Array(dvar), disamb2v = new Array(dvar), disamb = new Array(dvar); disamb.fill(0);// the premium on ask one or other value of key j , disamb1 is the max number of times a keyval appears 
        let gpr = [], npr = [], bpr = [];
        for (let i = 0; i < scan; i++) {

            let one = [], two = [], onec = 0, twoc = 0, z;// one[k]=per il key k indice dei count e value per value che matchano solo su 1 item 
            for (let j = 0; j < dvar; j++) {
                // find what index is the discr j in item i in discrval list : 
                /*
                for(let z=0;z<values[j].length;z++){
                    if(values[discr[j][i]]){// z
                        if(count[j][z]==1){one.push(j);}// se e' anche in piu di 2 item cancella il discr , see DE3
                    }else   if(count[j][z]==2){two.push(j);}
                }*/

                //for(let z=0;z<values[j].length;z++){
                if (discr[j][i] >= 0) {
                    if ((z = (count[j][discr[j][i]])) == 1) {// z is the number of time j keyval values[discr[j][i] compares on items 
                        one.push(discr[j][i]);// this keyval has max priority to be inserted on prompt for  item i , se e' anche in piu di 2 item cancella il discr , see DE3
                        two.push(-1);
                        discrim[j]++;// numero di key j-esima value che caratterizza solo un item 
                        onec++;
                    } else if (z == 2) { two.push(discr[j][i]); one.push(-1); twoc++; }// a little priority 

                    else { one.push(-1); two.push(-1); }

                    if (z >= (scan / 3)) {
                    disamb[j] += z;
                        if (z > disamb1[j]) { disamb1[j] = z; disamb1v[j] = values[j][discr[j][i]] }
                        else if (z > (disamb2[j])
                            //&&z<(disamb1[j])
                        ) { disamb2[j] = z; disamb2v[j] = values[j][discr[j][i]]; }
                    }
                } else { one.push(-1); two.push(-1); }
            }
            let need2 = 0,
                getname_ = getname(i), nam = getname_.key, triple = false;
    /*if(getname_.indexOf(nam) > -1){
        
       if(triple){console.error('** not unique key in search azienda'); names[i]=getname_.key+' 2';}
       else{triple=true;names[i]=getname_.key+' 1';
       }// check key is unique , todo add mumtiple same name ( more then 1 ) : myarr.indexOf(nam)
    }else 
    */names[i] = getname_.key;// full name 
            vname[i] = prompt_[i] = getname_.prompt;// first word 
            let priority = 0;// number of discrimination concept (excluding name keys ) in prompt , will be set in pool position 
            // patt[i]=prompt_[i].split(/[\s,]+/,3).join('|');//max 3 item anyway,  exclude search ? , exclude length < 3 ?
            patt[i] = ''; prompt_[i].split(/[\s,]+/, 3).forEach(el => { if (el.length > 2) patt[i] += el + '|'; });
            if (patt[i]) patt[i] = patt[i].substring(0, patt[i].length - 1);//max 3 item anyway,  exclude search ? , exclude length < 3 ?
            pattt[i] = patt[i];
            if (onec < mdp) need2 = mdp - onec;
            let mycc = 0;
            for (let j = 0; j < dvar && mycc < onec; j++) {// see the key j on item i 
                if (one[j] >= 0) {
                    prompt_[i] = prompt_[i] + prompti[j] + values[j][one[j]];// add discr that is present only on this item 
                    patt[i] = patt[i] + '|' + values[j][one[j]];
                    mycc++; priority += 2;
                }
            }
            let twos;
            if (need2 < two.length) twos = need2; else twos = two.length;
            //mycc=0;
            for (let j = 0; j < dvar && mycc < mdp; j++) {// add discr that is present >1
                if (two[j] >= 0) {
                    prompt_[i] = prompt_[i] + prompti[j] + values[j][two[j]];
                    patt[i] = patt[i] + '|' + values[j][two[j]];
                    mycc++;
                    priority++;
                }
            }
            if (priority > 2) { bpr.push(i) } else if (priority > 0) { gpr.push(i) }
            else npr.push(i);
        }// ends i 
        // order via indexmap
        for (let ik = 0; ik < gpr.length; ik++) { bpr.push(gpr[ik]) };
        for (let ik = 0; ik < npr.length; ik++) { bpr.push(npr[ik]) };


        // give advice (strategy) on next disambiguation action 
        let disambJ = -1, disambS = 0, discrJ = -1, discrS = 0, disambiguate1 = null, disambiguate2 = null, strategy = 1;
        for (let j = 0; j < dvar; j++) {
            // choose strategy 
            if (discrim[j] / scan > 0.85 && discrim[j] / scan > discrS) { discrJ = j; discrS = discrim[j] / scan; strategy = 3 }// so strategy 3 is the same of strategy 1 but tests only one discr key not best match on names + all discr keys 
            else if (disamb[j] / (2 * scan) > 0.9 && disamb[j] / (2 * scan) > disambS) { disambJ = j; disambS = disamb[j] / (2 * scan); disambiguate1 = disamb1v[j]; disambiguate2 = disamb2v[j]; strategy = 2; }// only if strategy 3 is not got 
            console.log('  keynumber ', j, ' ,keynome=', keyname[j], ', premium , to ask key(', keyname[discrJ], ', index: ', discrJ, ') , is:', discrS, '%', ' Premium to disambiguate value of key (', keyname[disambJ], ',index: ', disambJ, ') against ', disamb1v[j], '(', disamb1[j], ' times)/', disamb2v[j], '(', disamb2[j], ' times) is:', disambS);
        }

        return { names, prompt_, vname, patt, pattt, outlist: bpr, strategy, disambJ, disambiguate1, disambiguate2, discrJ };// bpr items have length = scan 
        // {names,prompt_,patt,outlist,/
    }// getNameDiscr1

// book entity model to be sent to book entity endpoint 
function BookEnt(name,row_) {// returns a entity model {match,matches,vmach.intent,rows:[{value,descr,patt,,,,},,,],group,,,,} , coping function Entity(name, dim, row_, value) .....
                            // row = { value: 'booked', descr: 'è stata prenotata', data: bookingsInfo ,booked_start,booked_end,bId};
   this.matched = this.match=null;
   if(row_) {
       this.matched = 'match';
       this.match=row_.value;
       this.instance=row_;
       // no index 
       this.vmatch=row_.descr;
  this.type = 'result';
  this.name = name;// entity name 

    this.rows = row_;// or rows=[], rows.push(row_)
    // this.group={};// template params



    } 
}  

function sel3day(curRel,qq,ctl,tests=tests_3D,setSelectItem){// curRel : the relative day to start 3 days selector . tests can be overwritten by caller 
                                                            // newDesidDaygot : cant ask a 3days selector with curRel > 0, on a bookable day   

/*

// porting sel3day()
// param:
curRel =curRel;// the 
qq=qq;ctl=ctl;// ctl: extended qq.ctl
tests=tests;
// redefine : qq.cursor.medSync,
// updates : qq.cursor.resModel
// return: sc?, // dim of selector
// start 
*/

let sc=0;// correct?
let refLunedi = [];// local
let curRelInd = 0;// starting index of dayspan  under evaluation , better set 0 anyway 
 let dayspan = ctl.slotMat.dayspan, dl = dayspan.length,// number of the rel day available x booking ( from start day)
 // nb : dayspan = [],//     [  0,  3,  4]relative (day after fromDay )iesimo(bookInd) bookable day with bookable slot , ex dayspan=[0,3,4] . sparce domain
ds = [];//the rows  index of slot to propone x selection : its a subset of the bookable rel days dayspan. usefull to ......... ????



let dim = qq.rows.length;
qq.cursor.medSync = Array(dim);qq.cursor.medSyntL=[];// rebuild medSync, fill with null all rows index 
let inde;

// todo  012021 review curRelInDay, dl, curRelInd

// >>>>>>>>>>>>>>>>  todo : modify this first desidered day match ( find if a desidered day is bookable or get the list of first 3 bookable day after a not bookable desidered day )
//                          for a new desidered day 
//    ... get a new desDtatTime so get the relative to fromDate  so set status curRelInDay
// for the first search it could be negative but is managed in previous if clause

let newDesidDaygot=false;


for (l = curRelInd; l < dl; l++) {//  from last relative days index (?)  on , better start from 0 anyway 
    if (dayspan[l] >= curRel) {// is last rel days examined dayspan[l]  < of wanted rel day curRel ? , is so skip , try the next index l
        // at this index the rel day is the first to be >= at the wanted / desidered rel day 
        let curRelInd_ = l;// this is the index so dayspan[x]>=curRelInd are good x selection , take the first tests so 
        console.log('  simplybook: firstReq, setting 3days selector  , meetDes = xx : as client (new) desidere book day or first possible bookable day is  rel day ', curRel, ' at des hour ', ctl.slotMat.fromHour, '\n we got the first relative ( vs startday)  bookable day(', dayspan[curRelInd_],
            ') >= desidered/first rel day (', curRel, ') , in a slot of index : ', curRelInd)

        // now check if is > or = to desidered relative 
        if (dayspan[curRelInd_] == curRel
            && curRel != 0 // change in new desidered  desDtatTime  , first time case managed by previous if 
        ) {
            newDesidDaygot = true;
            // .... do like previous if in case we got a desidered day in case of a new    desDtatTime reset 
            console.error('  simplybook: firstReq,future use new    desDtatTime reset . desidered calendar day ', qq.ctl.slotMat.dayBookable[curRelInd_], ' is bookable so do hours selection on it (');
            // eventually fills just with the got day ! .....


            // fills new filtered selection medSync,medSyntL,resModel obj : insert 3 datetime of days, following desidered day , with slot hour near to desidered hour  
        } else {
            console.log('  simplybook: firstReq,  desDtatTime is not bookable so choose 3 following bookable days starting from calendar day: ', qq.ctl.slotMat.dayBookable[curRelInd_]);

            for (let ll = curRelInd_; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
                // calc the rows index of the slot with a relative day >= des day and near the desidred hour
                let ri = ctl.slotMat.pref_day_slot[ll];// ri is the index of the slot with rel day after the desiredered rel day (max test  days is tests!  )can be -1 
                ds.push(ri);
                sc++;


                refLunedi.push(// name of day , register x discrminating test
                    //setSelectItem(qq.cursor, ri)// // insert item ri in new (filtered) selection model cursor.medSync/medSyntL/resModel objs
                    setSelectItem(qq.cursor, ri,true,0,sc)// // insert item ri in new (filtered) selection model cursor.medSync/medSyntL/resModel objs
                );
                console.log('  simplybook: firstReq, adding a selecting rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', qq.rows[ri].value);
                //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
            }
        }
        break;// >>>>>  WARNING : changed 01042021
    }

}

// now test  what refLunedi are discriminamt and add it to pattern qq.query.cursor.resModel[kkey].patt 

if(!newDesidDaygot){ 
    if(l==dl) console.error('  simplybook: firstReq, no bookable got in 3day selctor builder ');
    else for (l = 0; l < refLunedi.length; l++) {
    let patt=refLunedi[l].patt,disc=true;
    if(patt){for (let m = l+1; m < refLunedi.length; m++) {
        if(refLunedi[m].patt==patt){
            disc=false;// not discriminating
            refLunedi[m].patt=null;}
        }
        if(disc){// add lunedi to patt , it is a discriminating 
            let kkey=refLunedi[l].kkey;
            qq.cursor.resModel[kkey].patt =qq.cursor.resModel[kkey].patt+'|'+'\\b'+patt.substring(0,4);// cursor.resModel[kkey].patt can be the cal(endar) day, so a integer
            console.log('  simplybook: firstReq, adding a discriminating: ',patt,' on selecting  day(',kkey);

                       }
    }
    }
}else{
    console.error('  simplybook: firstReq, got a day in start proc after dedicated if');
}
return sc;
}

/*

summary/structuring 

see: 
	- techiques primer : working with session data_ ...
	- howto_endspoint_primer

1230
*simplybooking (vars, form_whInst, form_wheres, qs, rest)// input param passed by enpoint (da form ! )

    qq = qs.curStatus,// the passed last query obj request to this controller , at init is null
    ( qq.ctl=)  Object.assign(qq.ctl,ctl_f)// add (prototype helper) functions . warning functions works on slot matrix query and its meta set in ctl.slotMat
    nb qq and qq.ctl are persistant so without any function . so keep functions on object on which set the persistant data to work on
 
    case on selStat
        if(!qq): getEvent
                getEvents()

                qq = await getEvents();// build ctl structure , fill simple query model 
                chroot = 'th_ServiceSel';// the th/ask to select the service

        -9 :
1910	setPerformerSel(form_wheres, qs, rest) {// after coming back with a selected service , build the performer selector with the same status  query.ctl.eventSt
                selStat = -8;// initial status on the fsm recover a event (service/performer)  structure 
                qc = ctl= qq.ctl;// the ctl status injected on query model 
                // new qq injecting the updated ctl
                qq = await getPerfs(form_wheres, qc);// build ctl structure , fill simple query model 
                qc.selStat = -7;
                chroot = 'th_PerfSel';// set routings to the th/ask to select the query model returned (peformer list)



1430   -7 
		desDtatTime = form_whInst.mod_date_des.value;
		firstDate_ = await sess_firstdate[qq.ctl.unitId];/
		qq.ctl[slotMat]={};// add metadata obj x building slot query 
		func_ctl_=Object.assign({},qq.rows,func_ctl);// make rows available to func
                ctl=Object.assign({},qq.ctl,func_ctl_) ;// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat

		better 
                        qq.ctl.slotMat={};// add metadata obj x building slot query , it will be added as query is created in firstReq{...start();...}
                        func_ctl_=Object.assign({rows:null,ctl:qq.ctl},func_ctl);// make rows and ctl available to func, rows will be added as query is created in firstReq{...start();...}
                        ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat



1940		firstReq(fromDate,desDtatTime,gotdate) 
                
                        // so ctl is exended qq.ctl . NEVER do like ctl=something !!!!!!!! but ctl=qq.ctl=something
                	qq = await start(desDtatTime, inter,qc);// fill complex multi turn multi filter/selector query model (slot matrix) . is a multiturn query so multi selecting , 
			used to build 3days (in 2nd part of start() ) and hours (setHourSel() ) selector setting code 



                if(parseInt(qq.rows[hind].time.substring(0,2))==prefHour){// '23:59:59' > '23' il best nearer hour must be = prefHour
                    qq.group.ctx.th_book_geit.meetDes=1;//context flag that  explain response to user : we meet desidered day and hour
                                                    // but the th to redirect can be different (the slot match confirm th ! )
                    selStat == 2;
                    // set the selector matching var as it was done when builded refine selector (.cursor:{resModel,,,} without effectly build the refine we just set when it would match !!

                    ......
                }else{ 
			qq.group.ctx.th_book_geit.meetDes=0;//context flag that  explain response to user : we meet desidered day but not des hour
                	setHourSel(null, desDtatTime, prefHour);// will set status =...  and correct complete 
                }
              	} else {// desDtatTime is a user pref but we still dont know if is bookable so filter 3 bookable days 

               		qq.group.ctx.th_book_geit.meetDes=10;//

			........

                	chroot = 'th_3daySel';// complete
                	ctl.f=null;// get rid of not persistent helper func 

        -5 ....
        0: avoid 
        1: 
           if (match) {
                            let prefHour;
                            if (qs.hour_pref) prefHour = parseInt(qs.hour_pref);

                            func_ctl_=Object.assign({rows:qq.rows,ctl:qq.ctl},func_ctl);// make rows and ctl available to func
                            ctl=Object.assign(qq.ctl,{f:func_ctl_});// =slotHelpers extend ctl with helpers working on slotmatrix metadata slotMat
  
                            setHourSel(matInd,null, prefHour);// will set   chroot = 'th_3daySel_2'; and selStat =2		
			setHourSel(index_, isodate,prefHour)
		        redefine selector on coming query qq working on qq.rows/cursor... that MUST be a slot set by start() . use ctl=qq.ctl related matrix meta data in  : ctl.slotMat
                works on ctl methods
                ind = ctl.findSlotAfterHour(ind, prefHour);
                // slotMatSt = ctl.slotMat;  // NOT qq.ctl.slotMat
                chroot = 'th_3daySel_2';

	2: 

            if (match) {
                        ctl.selStat=3;// matched slot 

                        // >>>> restore match :  multiturn select : ONLY in case of matched result MUST be reset before return to match  : qq.match=match
                        chroot = 'slotmatch';// goon with booking naw at least the slot is got

                        qq.match = match;// restore match as we finish and goon without another refine selection 
                        qq.instance = inst;
                        qq.matched = 'match';
                        qq.group.sel = groupsel;
                        sc = 1;// just not to return null;
                        qq.group.ctx.th_book_geit.meetDes=100;//

	nostatus :

                // here the first ctl call , in v0 was called   await firstReq() that supposing service 0 performer 0 , got the slot matrix 
                // now we get only event data , the before call  firstReq()  we need to :
                //  - select service > simple static list  to select 
                //  and 
                //  - performer  >  select after a query to make more restricted the selection 

             getEvent(form_wheres, qs, rest);


	// now returning to endpoint nlpai to format the matcher response
    if (sc > 0) return {chroot, query: qq)
        if(sc<0) error

* end simplybooking




helpers:


    start(curDateFrom_, inter,ctl)
		datefrom=dateFromAPI.substring(0,10);// dateFromAPI or  dateFrom_   
		availableTime = await publicService.getStartTimeMatrix(datefrom, dateto, serviceId, performerId, qty);

                daysc_ = [],//[14,1,8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable_ = [],  //[19,22,3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot_ = [],//[114,211,null],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd_ = [];//[101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate

            	ctl.slotMat = {// updates ctl , reassign slotMat    *CTL 
                	dayspan:dayspan_ , daysc: daysc_ , dayBookable:dayBookable_, totSlot:0, bookDays:0,
                	curRelInDay:curRelInDay_ , relDayInd:relDayInd_, pref_day_slot:pref_day_slot_,
                	fromDate, startDateTimeStamp,fromDay, fromHour// from date is Date()  loaded using a duck locale trans as rome local . 
									fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
            		};

	     	query = new QueryM()

			........
			bDays = ctl.relDay(ada);
			........

             	query.ctl=ctl
             	return query



    
 59 getPerfs(form_wheres, ctl)  
		
             query = new QueryM()
             query.ctl=ctl
             return query
            

    getEvents()
		let query = new QueryM();
    		query.ctl = { eventSt: result, eventObj: event.data };// {// the ctl event status (service+performer)}
        	return query;// {query};// return
*/

    module.exports = { simplybooking, book };// the ctl processes . each one with its status 
    /*
    simplybooking: create and evolve the user session (.ctl) to do a multiturn booking slot finder
    book:   booking transaction process on a resolved .ctl
    fixedbooking: a .ctl=covid std session manteined here to book a single service single turn slot finder ( no user session) 
    */
