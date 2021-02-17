
const orReg = /\?*,*\.*\s+,*\s*/g;// /\?*,*\.*\s+,*\s*/ig;// 'The quick brown fox jumps over , the lazy? , dog. If the dog reacted, was it really lazy?' >> "The|quick|brown|fox|jumps|over|the|lazy|dog|If|the|dog|reacted|was|it|really|lazy?"
let rest;// got from nlpai.js :
                          // nb  rest_ is the (rest.js).jrest  , so     jrest:function(url,method,data,head, urlenc,qs){// data ={prop1:value1,,,}  , the js plain 1 level obj (js map)
                          //                                                                                            //  qs, urlenc  are post only param :    if urlenc = true send a    x-www-form-urlencoded body (got from qs or coding  data obj )
const fs = require("fs");



// NB need to install it locale in nodes : npm install full-icu


// needs ? seems not const moment= require("moment");// npm install moment 

// cfg page : https://sermovox.secure.simplybook.it/v2/management/#plugins/api/



// 建立Auth Service

let token;
let infobaseurl='https://connect.sandbox.creditsafe.com/v1/';
 

/*  27012021

now split start in :
- getservPerformers() that get service and performer data (put in ctl session  so in param.ctl.events)
- performer() that select a performer of a service 
- start()that get the slot matrix  

*/


async function getEvents(form_wheres) {//
    console.log(' simplyinfo getEvents');
/*
    token = await auth.getToken().catch(// NOW PUT the token at server scope , so 1 token for all app in server , in future insert the tokent into .ctl !!!
        (err) => { console.error(' simplybook  got ERROR : ', err); });

    // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
    console.log(token.data);
*/
let 
form = { username: 'f.paronuzzi@groupadv.com', password: 'ik,h981wz1bjeAghpaFu' },
url=infobaseurl+'authenticate',
infodata,
head={    'content-type': 'application/json'} ;//                 headers: {    'content-type': 'application/json'}  or { Authorization: 'Bearer ' + tk };

if(!token){
// let response = await this.run_rest(url, form,'POST',head);
let response = await rest(url,'POST',form,head);
if (response) {
    mr=JSON.parse(response);
        // check format 
        if(mr.token){// surely the interface adapter returns a well format matcher result obj , goon 
            token=mr.token;
    }


}}

// required data to set up the firm data 
let namea=form_wheres.mod_azinfo_name,
    pr=form_wheres.mod_azinfo_prov;



if(token){
    form = null;
//url=infobaseurl+'companies/IT-0-VR167745?template=complete',




url=infobaseurl+'companies?name='+namea+'&countries=IT',
 
head={    'content-type': 'application/json',Authorization:token} ;// application-json is anyway set !,                headers: {    'content-type': 'application/json'}  or { Authorization: 'Bearer ' + tk };


// let response = await this.run_rest(url, form,'GET',head);
let response = await rest(url,'GET',null,head);

/*
or :            response = await  this.rest(uri, method,form,head) 
                            .catch((err) => { console.error(' REST got ERROR : ',err); }); 
*/


if (response) {
    infodata=JSON.parse(response);
        // check format 
   //     if(mr.token){// surely the interface adapter returns a well format matcher result obj , goon 
     //       token=mr.token;
   // }


}


}else {

    const trainingFile = fs.readFileSync('./nat/baulisrc.json');

    infodata=JSON.parse(trainingFile);
}




    console.log('simplyinfo report list: ', infodata);
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

// ex of search x name 
// let build=getNameRes(namea,infodata);

let result=infodata;

    let {names,prompt_,patt,
        strategy,disambJ,disambiguate1,disambiguate2,discrJ// future case , now only strategy=1(mix best match) is done
    } 
    = getNameDiscr(namea,result.companies) ;//query=result.companies.  {names,prompt_,patt,strategy,disambiguate1,disambiguate2,discr_};
    if (result&&prompt_&&patt) {
        let query = new QueryM();
        let nitem=names.length;
        result.details={};// copy here rows but indexed with its value ,  just to take in status 
        // item 0 
            // if(ctl.eventSt[ctl.serviceId].providers.contains(result[ada].id))
            for(index=0;index<nitem;index++)
            {   // ******************** sname can be repeated !!! check is unique !!! probabl
                let sname = names[index];// the where al posto di servizio  taglio capelli   >>> check unique
                // let prompt=sname;
                // const orReg = /\?*,*\.*\s+,*\s*/ig;
                let patt_ =patt[index].toLowerCase();

                if (index == 0)
                    patt_ = '@' + patt_;// @ :  ahocorasick
                let row = {//query.rows.push({
                    value: sname,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                    patt: patt_,// 
                    vname:prompt_[index],// the prompt x item 
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

                };

                // set selector:
                // - sname  
                let selItem = {// the value in rows
                    vname: row.vname,// the v name prompt== medSyntL ?
                    patt: patt_  // item selector match,  is the name or its attribute used to select the item  
                    //,index : optional sync (additional to selItem property) with rows index
                    // index will be added by addRow !!!(row index , not row id that is bl !!!!!!!!)
                };
                query.addRow(row, selItem, prompt_[index], ',');//addRow(row, selItem, prompt, sep) 
                result.details[sname]=row;// rows copy , will be maintained on ctl status 
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

        query.ctl = { eventSt: result };// {// the ctl event status (service+performer)}. here events are the firm search

        return query;// {query};// return

    } else {
        return null;// server cant return data 
    }

}
async function getPerfs(ctl) {
    console.log(' simplybook getPerfs');
    if (!token) return 'na';
    // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
    console.log(token.data)
    let chservice=ctl.serviceId ;

   // let ctl = qq.ctl;// get from a model reference (query also in different entity )the ctl part

    // 建立Public Service
    let publicService = simplyBook.createPublicService(token.data);

    // very like getEvents build a singleturn query model :

    // get the performer for the selected service 


    let unit = await publicService.getUnitList();
    let unitList = Object.values(unit.data);// toarray
    console.log('simplybook event list', unitList, ' json obj: ', JSON.stringify(unitList));
    // */
    // build the service query model 


    /*  api responded :
      unitList.data={result,id:'1'}
  
      */

    let result = unitList;

    
    result=result;// todo ow filter providers x selected service using ctl.eventSt[ctl.serviceId].providers/unit_map and chservice=ctl.serviceId ;

    // fills model ......result.push.length.

    if (result) {
        let query = new QueryM();
        result.details={};
        // item 0 
            // if(ctl.eventSt[ctl.serviceId].providers.contains(result[ada].id))
            {
                let sname = 'amministratore';// the where al posto di servizio  taglio capelli 
                // let prompt=sname;
                // const orReg = /\?*,*\.*\s+,*\s*/ig;
                let patt = 'amministratore|direttore';

                //if (ij == 0)
                    patt = '@' + patt;// @ :  ahocorasick
                let row = {//query.rows.push({
                    value: sname,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                    patt: patt,// 
                    descr:' amministratore è STEFANO ZANCAN , con anche incarico di consigliere',//findAmm(),// the bl field used to summary this item when selected 
                    next:'se vuoi conoscere consiglieri edirettori operativi chiedi dettagli ',
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
                    obj:[{value:'consiglieri',patt:'consiglie',descr:'extract from rep'},// descr is here calculated from result
                        {value:'direttori operativi',patt:'diretto|operativ',descr:'extract from rep2'}
                        ]


                };


                // set selector:
                // - sname  
                let selItem = {// the value in rows
                    vname: sname,// the v name prompt== medSyntL ?
                    patt: patt  // item selector match,  is the name or its attribute used to select the item  
                    //,index : optional sync (additional to selItem property) with rows index
                    // index will be added by addRow !!!(row index , not row id that is bl !!!!!!!!)
                };
                query.addRow(row, selItem, sname, ',');
                result.details[sname]=row.obj;
            }
                    // item 1 
            // if(ctl.eventSt[ctl.serviceId].providers.contains(result[ada].id))
            {
                let sname = 'score';// the where al posto di servizio  taglio capelli 
                // let prompt=sname;
                // const orReg = /\?*,*\.*\s+,*\s*/ig;
                let patt = 'rat|credito|score|pregiudi|concorsu';

                //if (ij == 0)                    patt = '@' + patt;// @ :  ahocorasick
                let row = {//query.rows.push({
                    value: sname,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                    patt: patt,// 
                    descr:' attuale credit score è B limite è di 2200000 euro ,  ',//findcredito(),// the bl field used to summary this item when selected 
                    next:'se vuoi conoscere ulteriori info su crediti  chiedi dettagli ',
                    // quando seleziono questo row e chiedo dettagli vado su th che rifa il aiax con action detail e gli passa il sname 
                    // questo controller registra come query result del servizio amministratore  il seguente obj
                    //  tale result come in performers buildera il detail che esporra un riassunto descr e le property che voglio sapere in un model da selezionare 
                    // the result of a query on this ctl with action='detail' , where='amministratore' 
                    obj:[{value:'ultimo',patt:'ultimo|credito',descr:'pippo'},// descr is here discovered from result
                        {value:'provider',patt:'provider',descr:'poppo'}
                        ]


                };



                let selItem = {
                    vname: sname,// == medSyntL ?
                    patt: patt
                    // index will be added by addRow !!!(row index , not row id that is bl !!!!!!!!)
                };
                query.addRow(row, selItem, sname, ',');
                result.details[sname]=row.obj;
            }


    query.ctl = { eventSt: result };// {// the ctl event status (service+performer)}

    return query;// {query};// return


} else {
    return null;// server cant return data 
}



}





async function simplyinfoing(vars, form_whInst,form_wheres, qs, rest_) {// consider only rest_,appcfg .
                                                        // rest is here already set in property at init !


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
    console.log(' simplybooking book ctl received form instance where : ', form_wheres,form_whInst);
    // now rest on simplybooking to find available slot on desBookingDate
    // so form_whInst={value,date,time}  ?????
    // calc start(dateFrom,dateTo )

    let qq = qs.curStatus,// the passed last query obj request to this controller , at init is null
        desDtatTime,
        chroot,// the complete directives : will be used as redirection url in ask relay 
        sc = 0;// the number of (filtered) item to select set in  medSync,medSyntL,resModel obj

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
    let inter = 4;// interval


    let selStat, // the status of the matching (selecting ) process managed by this aiax ctl 
        match, groupsel, inst,// rindondant copy ?
        selAction;

    // qq = qs.query;// recover the model under selection process, it is the matches[entity].param , that can be selected or not by user matching (matches[entity].param.match/instance)
    // if matched we goon knowing .param building a new refining match to do from the current status selstat
    // if dont match we can see if the user matched some flag and  obj , that are accettable directives and request to build the selection , in addition to the main form request datetime desDtatTime
    // 

    if (qq) {// a model is alredy filled so we have a ctl status 
        //  the user matched the filtred selection OR express a different action selAction
        console.log(' simplyinfoing book ctl found ctl status : ', selStat, ' so  according to action ', selAction, ' its handler will be fired ');

        selStat = qq.ctl.selStat;// cur status of selection process

        match = qq.match; inst = qq.instance;// the proposed selection was matched 
        groupsel = qq.group.sel;

        selAction = qs.selAction;// a user request that is tied to a new way to give prompt and collect results ( event programming)  to do some matching different from default method followed by selStat 0 ( day , the, hour ) 
        // like a aiax param to get a updated query from page ctl , no more as a ctl attribute !!
        // usually not null if dont match, so match=false
        // TODO calc current curRelInDay because the preferred date now has a relative val respect to start date of the downloaded matrix >=0, not 0 !! ex startday=22 matchday=24  so curRelInDay=2 ! (calc via instance.day)
        console.log(' simplyinfoing book ctl found ctl status : ', selStat, ' so  according to action ', selAction, ' its handler will be fired ');
        if (!selAction) selAction = 0;// no secial action requested as we probably matched the def goon as std
        // ex  user requested pomeriggi ( and match or not the day ) or interval or some week day ....


        // ************* FSM
        // fsm-mdp  see article in mdpArticle folder 
        //  in dialog management each status (vars currently matched) and its output , the prompt (depend statically by matches) depending from user concept matches that give to bot the knowledge of the user choices and objectives ( observations ) 
        //  on matched on ask so its derived by status ) has a next status calculated using the new matched concept . 
        // very often one of the concept or some concepts set the function (user intention helper o event handler) used to calc the  status and associated new output 
        // new output


        if (selStat == -9) {// the ctl has alredy set the event structure   query.ctl={eventSt}, and tryed to selected  service , now checking that service is got, must select  the performer using the same structure 

            // qq.match = qq.matched = null;// >>>>  ONLY in case of matched result MUST be reset to match  
            // qq.group.sel = qq.instance = null; // also the copied in group (needs ?)


            if (match) {


                qq.ctl.serviceId = inst.id;// store as status property  at first level , used to set slot matrix
            if (selAction == 0) {// do/update/change another base info query 

               if(inst.id) await getEvent(form_wheres);
            }else if (selAction == 1) {// user ashed detais on performers of last matched so qq.ctl.serviceId

                if(inst.id) await setPerformerSel(qq.ctl.serviceId,inst);// use inst.rows[qq.ctl.serviceId,].obj ?? 
             }
        }else // cant be 
                return null;




        } else if (selStat == 0) {// the ctl has alredy set the event structure query.ctl={eventSt}, and choosed the service and the performer .now build the multiturn model datetime/slot matrix and itsstructure on ctl.

            // if (selAction == 0) 
            if (match) {

                qq.ctl.perfId = inst.id;
                if (form_whInst && form_whInst.mod_date_des && form_whInst.mod_date_des.value) {

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



        else if (selStat == 1) {

            // ************* FSM
            // fsm-mdp  see article in mdpArticle folder 
            //  in dialog management each status (vars currently matched) and its output , the prompt (depend statically by matches) depending from user concept matches that give to bot the knowledge of the user choices and objectives ( observations ) 
            //  on matched on ask so its derived by status ) has a next status calculated using the new matched concept . 
            // very often one of the concept or some concepts set the function (user intention helper o event handler) used to calc the  status and associated new output 
            // new output

            qq.match = qq.matched = null;// >>>>  multiturn select : ONLY in case of matched result MUST be reset to match  
            qq.group.sel = qq.instance = null; // also the copied in group (needs ?)


            if (selAction == 0) {// no different strategy was requested by user , just matched or not previous sel 
                // ex , when as here the selStat is 0 , means that  it matched the day so , as no option selAction is required, we goon with std hour selection on any hour available in sel day 
                if (match)
                    setHourSel();
                else // cant be 
                    return null;

            } else if (selAction == 2) {
                // 
                await setFolDaySel();// a new with new days interval 

            } else if (selAction == 3) {// just a template , still to code 
                // a part of day requested . ex pomeriggio or only saturday  da
                setFolDaySel();// a new with days more 

            }

        } else if (selStat == 2) {// the hour was matched after the day are selected : thats the final match !!!

            qq.match = qq.matched = null;// >>>>  multiturn select : ONLY in case of matched result MUST be reset to match  
            qq.group.sel = qq.instance = null; // also the copied in group (needs ?)

            if (match) {
                chroot = 'slotmatch';// goon with booking naw at least the slot is got

                qq.match = match;// restore match as we finish and goon without another refine selection 
                qq.instance = inst;
                qq.matched = 'match';
                qq.group.sel = groupsel;
                sc = 1;// just not to return null;

            } else {
                chroot = 'repeat';
            }
        } else chroot = 'repeat';// unkown stare restart

    } else {

        // here the first ctl call , in v0 was called   await firstReq() that supposing service 0 performer 0 , got the slot matrix 

        // now we get only event data , the before call  firstReq()  we need to :
        //  - select service > simple static list  to select 
        //  and 
        //  - performer  >  select after a query to make more restricted he selection 
        await getEvent(form_wheres);

    }


    // event handlers for fsm transaction 
    async function setHourSel() {// calling must await if we await something !!!!

        // comes here from selStat  (selection state) =1 . it select the slot of the best bookable day near fromhour , if specified, 
        // in this state we build the selection of the slot in the day with  hour matching :
        // - near previous desidered hour (the instance slot alredy provide a estimation of a desidered hour ) 
        // - if if user say  day 19 but hour 16 and the promt said day 10 at 15:00 we reset the desidered hour new one 


        let slotMatSt = qq.ctl.slotMat;// this event handler works on slot matrix selection , its status is on ctl.slotMat


        qq.ctl.selStat = 2;// selecting hour in matched day status
        let row = qq.instance, ind = qq.index;// the rows matching index  :  qq.instance=rows[qq.index],qq.match=instance.value  , so is the current relative desidered index

        let prefHour;
        if (qs.hour_pref) prefHour = parseInt(qs.hour_pref);

        if (!isNaN(prefHour)) {// is integer so set index corresponding to first slot of the day with hour just >= prefHour . if cant let ind as it comes 
            // recalc start slot matching prefHour in same day or matched slot , otherwise let pref slot the matched slot 
            //bookable index :
            let ij;
            for (ij = 0; ij < slotMatSt.dayspan.length; ij++) { if (slotMatSt.relDayInd[ij] > ind) break; }
            let eDay; if (ij < slotMatSt.dayspan.length) eDay = slotMatSt.relDayInd[ij]; else eDay = qq.rows.length;
            for (ij = slotMatSt.relDayInd[ij - 1]; ij < eDay; ij++) {
                let pref = parseInt(qq.rows[ij].time.substring(0, 2));// .time:"10:00:00"
                if (!isNaN(pref))
                    if (pref >= prefHour) break;
            }
            if (ij < eDay) ind = ij;
        }


        // set till 3 slot following this 
        let dl = qq.rows.length;
        qq.cursor.medSyntL = [];




        let ds = [],// list of index to select ,usefull?
            refLunedi = [];// local 

        qq.cursor.medSync = Array(dl);// rebuild medSync, fill with null all rows index 

        let tests = 3,
            cdate = qq.rows[ind].date;




        // fills new filtered selection medSync,medSyntL,resModel obj : insert 3 datetime of days, following desidered day , with slot hour near to desidered hour  
        for (let ll = ind; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
            // nb one slot will be  ri = qc.pref_day_slot[x] x is the  (index of) rel day considering : sstart from it ? (its near the preferred hour )
            // x is index of ctl.dayBookable that has value = current day 
            if ((qq.rows[ll].date) != cdate) break;
            ds.push(ll);

            sc++;
            // rebuild the cursor.resModel[match].path = cursor.resModel[match].path_h
            //let check=qq.rows[ll].value;
            qq.cursor.resModel[qq.rows[ll].value].patt = qq.cursor.resModel[qq.rows[ll].value].patt_h;// a integer!!!!
            refLunedi.push(// name of day , register x deiscrminating test
                setSelectItem(qq.cursor, ll, false, 1)// insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs last flag means copy patt_d > .patt , 1 series of hours in a day 

                //console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
                //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
            );



        }
        if (sc) qq.cursor.medSyntL[0] = qq.cursor.resModel[qq.rows[ind].value].prompt_d + ', ' + qq.cursor.medSyntL[0];// add lunedì 25-12-2021 in first item
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

        chroot = 'th_3daySel_2';

    }

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


    async function getEvent() {//in info will be info to provide inside the row as descr or other attributes ( details , like details on master inflatted into the main row)
        selStat = -10;// initial status on the fsm recover a event (service/performer)  structure 

        // so as done x query model book_res_child , filled by a matcher with url refearring to this ctl  
        qq = await getEvents(form_wheres);// build ctl structure , fill simple query model 


        const qc = qq.ctl;// the ctl status injected on query model 


        qc.selStat = -9;// -9 .ctl.event filled , service query model filled for seletion 
        sc = qq.rows.length;


        chroot = 'std';// the standard way to explore the info row,value and its details : descr, other sub related info



    }
    async function setPerformerSel() {// after coming back with a selected service ( now > azienda) , build the performer (  now > info)  selector with the same status  query.ctl.eventSt
        selStat = -8;// initial status on the fsm recover a event (service/performer)  structure 


        const qc = qq.ctl;// the ctl status injected on query model 

        // so as done x query model book_res_child , filled by a matcher with url refearring to this ctl  
        qq = await getPerfs(qc);// build ctl structure , fill simple query model 




        qc.selStat = -7;// -9 .ctl.event filled , service query model filled for seletion 
        sc = qq.rows.length;


        chroot = 'th_PerfSel';// the th/ask to select the service



    }



    async function firstReq() {// update ctl status structure , fill complex refinable/filtrable multiturn slot query model 
        selStat = 0;// initial status on the fsm recover a sched matrix 
        // 012021 : really we need to choose the service and provider , then will propone a def slot or ask user to give desidered dataetime so can get the sched matrix on which select a slot
        //  so before get a slot matrix we start at status -10 that recover the service/provider list , then after selected service and provider enter in status 0 to start getting the sched matrix ! 


        // { query,dayspan,dayBookable,daysc,totSlot,pref_day_slot,bookDays,fromDate,fromDay,fromHour} 
        qq = await start(desDtatTime, inter);
        // let query=[form_whInst.mod_date_des];// return query as array of just 1 item

        // now schedule must analized and the rows to select must be filtered for first pre select : the day . 
        // then refine again the schedule to select the hour in the preselected day
        // find the day to put in the filtered to preselect


        if (qq.ctl.slotMatSt.bookDays < 3) {
            inter = 10;// integer

            qq = await start(desDtatTime, inter);
            /*
                qq={query:  {,,,// std
            
            
                            ctl:{                                                                // the dyn selector model managed by query matcher 
                                dayspan, daysc,dayBookable,totSlot,bookDays,relDayInd,                 // the controlling structure . can be used to recalc :
                                pref_day_slot,                                                         // recalculated param to get the new selector model query (des. date and des. hour)
                                fromHour, curRelInDay,                                                 //  the desidered date_time
                                fromDate,fromDay                                                        //  start day x this slot matrix  
                                                                                                        //      from date is Date()  loaded using a duck locale trans as rome local . fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
                            }
                    }
            */
        }
        if (qq.ctl.slotMatSt.bookDays < 3) {
            inter = 30;
            qq = await start(desDtatTime, inter);
        }
        if (qq.ctl.slotMatSt.bookDays < 3) {
            inter = 90;
            qq = await start(desDtatTime, inter);
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
        const qc = qq.ctl;
        const nit2Prom = 3; // can be min 2 to max 4
        // store def arrays :
        //qq.query.cursor.medSync_=Object.assign({},qq.query.cursor.medSync);
        // qq.query.cursor.medSyntL_=Object.assign({},qq.query.cursor.medSyntL);
        qq.cursor.medSync_ = qq.cursor.medSync;
        qq.cursor.medSyntL_ = qq.cursor.medSyntL;

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

        qc.selStat = 1;// 1: day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)

        let tests = nit2Prom;
        let refLunedi = [];// local 
        qq.cursor.medSyntL = [];// rebuild with just item to test



        let curRel = qc.curRelInDay,//>>>> current desidered rel day   when just got the matrix it is  0 , then can be reviewed with the desidered local hour   qq.fromHour
            curRelInd = 0,// index of dayspan  under evaluation 
            dayspan = qc.dayspan, dl = dayspan.length;// number of the rel day available x booking ( from start day)
        ds = [];//the rows  index of slot to propone x selection : its a subset of the bookable rel days dayspan. usefull to ......... ????


        let dim = qq.rows.length;
        qq.cursor.medSync = qq.cursor.medSync = Array(dim);// rebuild medSync, fill with null all rows index 
        let inde;

        // todo  012021 review curRelInDay, dl, curRelInd

        for (l = curRelInd; l < dl; l++) {//  from last relative days index on 
            if (dayspan[l++] >= curRel) {// is last rel days examined dayspan[l]  < of wanted rel day curRel ? , is so skip , try the next index l
                // at this index the rel day is the first to be >= at the wanted / desidered rel day 
                curRelInd = l - 1;// this is the index so dayspan[x]>=curRelInd are good x selection , take the first tests so 
                console.log(' as client desidere book at  rel day ', curRel, '  hour ', qc.fromHour, '\n got the first relative ( vs startday)  bookable day(', dayspan[curRelInd], ') >= desidered rel day (', curRel, ') , is at index : ', curRelInd)

                // fills new filtered selection medSync,medSyntL,resModel obj : insert 3 datetime of days, following desidered day , with slot hour near to desidered hour  
                for (let ll = curRelInd; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
                    // calc the rows index of the slot with a rel day >= des day and near the desidred hour
                    let ri = qc.pref_day_slot[ll];// ri is the index of the slot with rel day after the desiredered rel day (max test  days is tests!  )
                    ds.push(ri);
                    sc++;

                    refLunedi.push(// name of day , register x deiscrminating test
                        setSelectItem(qq.cursor, ri)// // insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs
                    );
                    console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', qq.rows[ri].value);
                    //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');




                }
                break;
            }
        }


        // now test  what refLunedi are discriminamt and add it to pattern qq.query.cursor.resModel[kkey].patt 

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


        chroot = 'th_3daySel';


        // }
    }// ends firstReq()


    // finally 



    if (sc > 0) {
        // alredy set in ctl : qq.selStat=1;// 1: day/preferredhour selector set , waiting for match on some day (selStat=2) or match on a specific day (selStat=3)
        //let cchh=chroot;
        return {
            chroot, // the relay/redirection  to the managing thread , both in case of match and in case to refine/reset selection filters 
            query: qq

        };// returns the complex query with selection definition prepared and the redirect th/child that will perform the selection  
    } else {
        /*if(mach){
            return { chroot, query: qq.query };// as match we redo addMatchRes(true,,,)  but as the matcher find the .param.matched=' match' , should refill the same matching .param, 
            
        }
        else */
        return { chroot: 'th_nosel', query: null };
    }

    // } else return null;

    function setSelectItem(cursor, ri, cp_day = true, prmode = 0) {// ri is the index in full matrix , patt_d > patt if cp_day, pmode 1 series of hours in a day prompt 
        // fills 1 item in filtered selection obj :  medSyn,resModel,medSyntL
        let kkey = cursor.medSync[ri] = cursor.medSync_[ri];// the key , itemname, corresponding to index ri, rebuild the sync/ filter array 
        if (cp_day) cursor.resModel[kkey].patt = cursor.resModel[kkey].patt_d;// calendar day number in pattern
        // refLunedi.push(cursor.resModel[kkey].patt_i);// name of day , register x deiscrminating test
        if (prmode == 1) cursor.medSyntL.push(cursor.resModel[kkey].prompt_time);
        else cursor.medSyntL.push(cursor.medSyntL_[ri]);// rebuild itemlist with just the slot to test
        // console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
        console.log(' > symplybookingAiaxCtl setSelectItem : added a selection item , value/datetime: ', kkey, ' patt: ', cursor.resModel[kkey].patt, ' dayname : ', cursor.resModel[kkey].patt_i, ' to add if discriminant ');
        return cursor.resModel[kkey].patt_i;// name of day , register x deiscrminating test
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

    return { date_, time, date };// YYYY-MM-DD  , 19:57 , current new Date()
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
    this.group = {
        sel: {
            item: null, match: null// will be set by convo $$desidere:>
        }//group={sel:{item:this.intents[0]}
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

    this.cursor.medSync.push(stdT);//  (**) mappa di sincronismo duale di resModel.index. maps index > itemname=row.value=stdT
    // al list mustache assieme a dmedSync ( o pre annullare un clone ) 

    this.cursor.medSyntL.push(// it(elap.toLocaleString('it-IT', options))// the item list to match 
        prompt + sep//', '//oppure'
    );// e l'ultimo ??????? .  list items to select . c'e' disponiilità per    :
    // giovedi 15 dicembre alle 17 e 30  oppure ....
    // con bu skip value if corresponding patt in null 



    // insert index if not provided :

    selItem.index = selItem.index || index;

    this.cursor.resModel[stdT] = selItem;



}
function getNameDiscr(name,query) {//query=result.companies=

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

let maxKeywordsinName=3;// sure ?
let nextr=4// max list item dimension ,:  limit the items to select to a max of nextr 
 ,dvar=3// city + province + type the discr var ex: large province sector : the discriminator concept to insert in returning   prompt_,patt,
    // here 
 ,mdp=2//maxdiscrinprompt <= dvar  , maxkeyInPrompt

    // ex 1/4 means 1  one value
    // 1 1  al terzo = null  all    val 1 valcont 
    //   1 1 1 1   >    _ _ _ _
    //   1 1 2 2    >   1 1 2 2 
    //   1 1 2 1  >  _ _ 2  _                       DE3
    // rule after a value meet count 3 we null
    //  discr1=[1,1,2,1]  values[0]=1  count[0]=1,2 al 3 si cancella il values[0]. alla fine solo i  
;


let getname=function(i){// return {key:'mario rossi spa tanti auguri,prompt:'mario rossi spa'}
    //query[i].name.split
    // max 3 words str.indexOf(searchValue[, fromIndex])
    let myn=query[i].name,mwords=maxKeywordsinName,//3,
    ni,key=query[i].id;
    function iter(ind,cc){
        cc++;//if(cc++>mwords)return ind;
        if((ni=myn.indexOf(' ', ind))<0)return -1;else 
        {
            if(cc>=mwords)return ni;
        else return iter(ni+2,cc);// 'i  frari '  ???? min length= 2 
    }
    }
let last=iter(2,0);// get first 3 words delimeter starting from 2nd char 
if(last<=0){return {prompt:myn,key};// less  then three words, no filtering ex key='one two three four'  last=13
}else {return {prompt:myn.substring(0,last),key};// more then three words, third word termining at last index
}

}


let discr = new Array(dvar),// discr[0] the values of first disc var  
values = new Array(dvar),// 
count = new Array(dvar),// 
prompti = [],// 
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
for (var i = 0; i < discr.length; i++) {
  discr[i] = new Array(nextr);
 values[i] = [];
 //mapVal[i]=[];// perf map 
 count[i] = [];
}


let prompt_=new Array(nextr)
,patt=new Array(nextr)
,names=new Array(nextr);
let scan=query.length;if(nextr<scan)scan=nextr;
for(let i=0;i<scan;i++){
    for(let j=0;j<dvar;j++){
        let myv=gets[j](i);// keyname j in item i 
        //discr[j][i]=myv;// a key j value found in item i 
        let z;
        for(z=0;z<values[j].length;z++){
            if(values[j][z]==myv){count[j][z]++;
                console.log(' in item n ',i,' found a key (keyname=',keyname[j],' with value : ',myv,'  duplicated ',count[j][z],' times, at index z   : ',z);
                break;}
        
    }
    if(z==values[j].length){values[j].push(myv);
                count[j].push(1);
               // mapVal[j].push(myv);
                console.log(' in item n ',i,' found a key: ',myv,'  not duplicated , so insert at found key values[keynumber=',j,'(keynome=',keyname[j],'),index=z=',z,']= ',myv);
    }
    discr[j][i]=z;// a key j value (mapped by  value=values[discr[j][i]]) found in item i 
    console.log(' check : in item n ',i,' found a keyval: ',values[discr[j][i]],' keynumber ',j,' ,keynome=',keyname[j],',in values of  index=z=',discr[j][i]);
   // console.log('\n getNameDiscr : i,j ',i,j);
   // console.log(' discr i,j  : ',mvy);

}

}
// now scan each query item and delete the discr that counts >2 , max 2 dirsc per prompt 

// 3 choices . 1: mix , promptlist  max nextr item,  with prompted key  < mdp, do best query 
//              2: ask disamb on a key (j index)   want rome or milan ?, then requery 
//              3: ask match a key on a keyvaluelist , then requery 


//const maxkeyInPrompt=2;
let discrim= new Array(dvar);discrim.fill(0);//the premium on ask for what desidered value for key j ;
let disamb1=new Array(dvar),disamb2=new Array(dvar); disamb1.fill(-1); disamb2.fill(-1);
let disamb1v=new Array(dvar),disamb2v=new Array(dvar),disamb=new Array(dvar);disamb.fill(0);// the premium on ask one or other value of key j , disamb1 is the max number of times a keyval appears 
for(let i=0;i<scan;i++){

    let one=[],two=[],onec=0,twoc=0,z;// one[k]=per il key k indice dei count e value per value che matchano solo su 1 item 
    for(let j=0;j<dvar;j++){
        // find what index is the discr j in item i in discrval list : 
        /*
        for(let z=0;z<values[j].length;z++){
            if(values[discr[j][i]]){// z
                if(count[j][z]==1){one.push(j);}// se e' anche in piu di 2 item cancella il discr , see DE3
            }else   if(count[j][z]==2){two.push(j);}
        }*/

        //for(let z=0;z<values[j].length;z++){
            if((z=(count[j][discr[j][i]]))==1){// z is the number of time j keyval values[discr[j][i] compares on items 
             one.push(discr[j][i]);// this keyval has max priority to be inserted on prompt for  item i , se e' anche in piu di 2 item cancella il discr , see DE3
             two.push(-1);
             discrim[j]++;// numero di key j-esima value che caratterizza solo un item 
             onec++;
            }else   if(z==2){two.push(discr[j][i]);one.push(-1);twoc++;}// a little priority 
                
            else{one.push(-1);two.push(-1);}
            if(z>=(scan/3)){disamb[j]+=z;
                if(z>disamb1[j]){disamb1[j]=z;disamb1v[j]=values[j][discr[j][i]]}
                else if(z>(disamb2[j])
                //&&z<(disamb1[j])
                ){disamb2[j]=z;disamb2v[j]=values[j][discr[j][i]];}
            }
       // } 
}
 let need2=0,
getname_= getname(i),nam=getname_.key,triple=false;
/*if(getname_.indexOf(nam) > -1){
    
   if(triple){console.error('** not unique key in search azienda'); names[i]=getname_.key+' 2';}
   else{triple=true;names[i]=getname_.key+' 1';
   }// check key is unique , todo add mumtiple same name ( more then 1 ) : myarr.indexOf(nam)
}else 
*/names[i]=getname_.key;
prompt_[i]=getname_.prompt;
 patt[i]=prompt_[i].split(/[\s,]+/,3).join('|');// exclude search ? , exclude length < 3 ?
 if(onec<mdp)need2=mdp-onec;
 let mycc=0;
 for(let j=0;j<dvar&&mycc<onec;j++){// see the key j on item i 
if(one[j]>=0){
     prompt_[i]=prompt_[i]+ prompti[j]+values[j][one[j]];// add discr that is present only on this item 
     patt[i]=patt[i]+'|'+values[j][one[j]];
     mycc++;
 }
 }
 let twos;
 if(need2<two.length)twos=need2;else twos=two.length;
//mycc=0;
 for(let j=0;j<dvar&&mycc<mdp;j++){// add discr that is present >1
    if(two[j]>=0){
    prompt_[i]= prompt_[i]+ prompti[j]+values[j][two[j]];
    patt[i]=patt[i]+'|'+values[j][two[j]];
    mycc++;
}
}
}
let disambJ=-1,disambS=0,discrJ=-1,discrS=0,disambiguate1=null,disambiguate2=null,strategy=1;
for(let j=0;j<dvar;j++){
    // choose strategy 
    if(discrim[j]/scan>0.85&&discrim[j]/scan>discrS){discrJ=j;discrS=discrim[j]/scan;strategy=3}// so strategy 3 is the same of strategy 1 but tests only one discr key not best match on names + all discr keys 
    else if(disamb[j]/(2*scan)>0.9&&disamb[j]/(2*scan)>disambS){disambJ=j;disambS=disamb[j]/(2*scan);disambiguate1=disamb1v[j];disambiguate2=disamb2v[j];strategy=2;}// only if strategy 3 is not got 
    console.log('  keynumber ',j,' ,keynome=',keyname[j],', premium to ask key: ',discrJ,' desidered value is:',discrS,'%',' Premium to disambiguate value of key: ',disambJ,'against ',disamb1v[j],'(',disamb1[j],' times)/',disamb2v[j],'(',disamb2[j],' times) is:',disambS);
}

return {names,prompt_,patt,strategy,disambJ,disambiguate1,disambiguate2,discrJ};
}






async function getNameRes(name,query) {

//url=infobaseurl+'companies/IT-0-VR167745?template=complete',
let res,url='localhost:3000/pippo',
 
head={    'content-type': 'application/json'} ;//                 headers: {    'content-type': 'application/json'}  or { Authorization: 'Bearer ' + tk };


// let response = await this.run_rest(url, form,'GET',head);
let response = await rest(url,'GET',{query},head);// or send directly query in json format 

/*
or :            response = await  this.rest(uri, method,form,head) 
                            .catch((err) => { console.error(' REST got ERROR : ',err); }); 
*/

if (response) {
    res=JSON.parse(response);
        // check format 
   //     if(mr.token){// surely the interface adapter returns a well format matcher result obj , goon 
     //       token=mr.token;
   // }
return res;

}
}

// module.exports = { simplyinfoing };// the ctl processes . each one with its status 
module.exports = function(rest_){
    rest=rest_;
   return  { simplyinfoing };// the ctl processes . each one with its status 
}
