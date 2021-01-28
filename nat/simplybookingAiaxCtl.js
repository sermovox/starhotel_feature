const SimplyBook = require("simplybook-js-api");


// NB need to install it locale in nodes : npm install full-icu


// needs ? seems not const moment= require("moment");// npm install moment 

// cfg page : https://sermovox.secure.simplybook.it/v2/management/#plugins/api/
    
const simplyBook = new SimplyBook(
    'sermovox',
    '58d46aa077c75410c89b7289816cbd5894d01f7b42c1da142ae62772738270ef',
    'be29914b99aa6ce55808c02cae3eccb5e7986c9ff4c230b064e8ff62fa6de5c7',
    'admin',
    'luigiDOluigi');
    
// 建立Auth Service
let auth = simplyBook.createAuthService();
let token ;



async function start(dateFrom_, inter) {// dateFrom "2016-02-09T00:00:00-08:00"  is iso from duck with time shift (-8 ), will be tranf to ROME local time 
                                        // get slot matrix for datefrom till datefrom+inter
    let startDate,//"2016-02-09T00:00:00Z";// to count days , so the 0 utc of dayfrom 
    startDateTimeStamp;

    // 取得Token

    let { date, time } = curdatetime();
    /*
    dateFrom = dateFrom|| date;dateTo = dateTo||date;
    */

    let serviceId = eventId = 1, performerId = 1, unitId = '2', qty = 1;

    console.log(' simplybook search datetime ', date, ' time ', time);

    token = await auth.getToken().catch(
        (err) => { console.error(' simplybook  got ERROR : ', err); });

    // cabe12dac8ba2e4aa2fbdcf16021f55b0ce673c3123bfb5ebd9ac608231373ecf
    console.log(token.data)

    // 建立Public Service
    let publicService = simplyBook.createPublicService(token.data)

    // /* // 取得Event List
    let event = await publicService.getEventList();
    let eventList = Object.values(event.data);// toarray
    console.log('simplybook event list',eventList);
    // */

    // to calc the rel day from start date use this :

    let dateFromAPI = dateFrom_.replace('-08:0','+01:0');// change the local date , set loc hour to what is in book server us local hour

    let fromDate=new Date(dateFromAPI);// the from date , with hour ( master desidered book )
                                        // dateFrom_ is  iso with time offset (from duck server is -8) ex  "2021-01-04T01:00:00.000+01:00" means local time is hour 1 at locale with schift of 1 hour (it) so is = to "2021-01-04T01:00:00.000+01:00" or "2021-01-04T01:00:00.000Z" 
    //  if without time shift "2021-01-04"  is std (hour 0 at greenweech)
    //                          "2021-01-04T13:00:00" or "2021-01-04T13:00:00.000" is locale time  so hour is 12 at greenweech ,so = to "2021-01-04T12:00:00.000Z" so = to "2021-01-04T13:00:00.000+01:00"

    startDate = dateFromAPI.substring(0, 10) + 'T00:00:00Z';//= // "2016-02-09T00:00:00Z"; froDate but at 0 hour utc
    startDate_=new Date(startDate);    startDateTimeStamp = startDate_.getTime();
    let startDay=startDate_.getDate(),// the day as 9 , local time
        fromDay=startDay,// same local !
        fromHour = fromDate.getHours(); // - 08:00 local time now trans to rome local time +01:00,  desidered book hour
    // having a nowdateFromAPI // must be "2016-02-09........."
    // daysfromstart= diffdays(nowdateFromAPI);

    // >>  Master on date
    //  dateFrom_   "2016-02-09T00:00:00-08:00"  hour load in simplybook server is local time in us (-08:00)
    //  dateFromAPI = 2016-02-09T00:00:00-08:00"  Means we trans the us loc date in rome loc time , and we manage all time in this local time 
    //  locdate_dateFirst is the first slot localtime got in matrix 


   //  dateTo = fromDate + inter;// NONONO new Date format , 3 days more then dateFrom


   let dateTo =addDays(fromDate, inter);// dateto   2021-01-07T10:32:00.000+01:00
   let dateToUS =dateToISOLikeButUs(dateTo);//      2021-01-07T10:32:00.000-08:00

    /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate
        const birthday = new Date('2021-01-29T01:00:00');// is local time !! 
        const date1 = birthday.getDate();
        console.log(date1,birthday.getUTCDate(),birthday.toISOString(),birthday.toString());// birthday.toString() is local time followed by schift time from grenweech
        >>> 29 29 "2021-01-29T00:00:00.000Z" "Fri Jan 29 2021 01:00:00 GMT+0100 (Central European Standard Time)"
    */
   // const locdate_dateFrom = fromDate.toString();//  NO it a long format !!!is local time followed by schift time from grenweech. calculated from dateFrom_ referring time with a locale spoecified by time shift 



        // ok :
    //dateTo.toISOString());// expected output: 2011-10-05T14:48:00.000Z

    // convertback to us server time

    let availableTime = await publicService.getStartTimeMatrix(dateFrom_, dateToUS, serviceId, performerId, qty);// ={success: true, data: {2020-12-29: Array(0), 2020-12-30:["09:00:00", "10:00:00", "11:00:00", …]}}
    // dateFrom = '2020-03-03'
    console.log('simplybook slot matrix', availableTime);
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
        rows:[// event list across days and hours 
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
        cursor={// this is a runtime build from some case cursor template (selects day, select slot hour)!!!
                    resModel:{// automatically build from row 
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
    var options1 = {'month': '2-digit', 'day': '2-digit', 'year': 'numeric', 'hour': '2-digit', 'minute': '2-digit' };// substitute , with: , alle roe 
    // se potessi usare it-IT : var options2 = {'month': 'short', 'day': 'numeric', 'year': 'numeric', 'hour': '2-digit', 'minute': '2-digit' };// substitute , with: , alle roe 
    // or var options = {'weekday': 'long', 'month': '2-digit', 'day': '2-digit','year':'numeric'}; then add 'alle 18:30' 
    // var date = new Date().toLocaleString('it-IT', options);


    if (availableTime.success) {

        let query = // ITEMS to test : rows contains bookable slot( date-time) , cursor the model to match the rows . a bookable slot is a available slot following the desidered date-time 
                    // the describing  dayspan/dayBookable arrays   tells what are the bookable relative /calendar date in rows slots 
        {
            objMod: true,// return the std complex query  model : 
            rows: [// event list across days and hours 
            ],
            cursor: {// this is a runtime build from some case cursor template (selects day, select slot hour)!!!
                resModel: {// will point to rows[x].value 
                },
                medSyntL: [],// the list of voice name ( to list the items to user x matching ) item to test  MUST be ON SYNC with rows ( can use medSync) !!!!!
                medSync:[]// the resModel key of the item to test.  for associated resolver row index , 
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

        };

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
                dayspan = [],//[0,3,4]relative (day after fromDay ) bookable day with bookable slot , ex dayspan=[0,3,4] 
                            //  >>>> dayspan[ix] is the days after the fromdate of ix-esimo bookable day after the fromdate  

                            // so first bookable day (xi=0) is 0 day after the startday/datefirst and, according with daysc = [xi], has 14 slot available for booking and according to dayBookable  is cal day 19,
                            //    the slot index in rows of the bookable slot meeting fromHour according pref_day_slot[ix] is 114 and according to relDayInd the first slot index of this day (calendar day 19) is 101 
                            // second bookable day,ix=1,  is 3 day after the after the startday/datefirst ,  the calendar day is dayBookable[ix]=22 (datefrom cal day is 19) and has 1 slot bookable and the slot meeting fromhour has rows index pref_day_slot[ix]=211
                curRelInDay=0,// the index  ix that correspond to first bookable day when move to a new fromdate   ( after got the sched matrix rows from server is 0) , 
                            //  so first  cal bookable day after desidered day das ix= curRelInDay+0, iesimo after is ix= curRelInDay + i-1, and has calendar day dayBookable[ix]
                            //      so given a desidered calendar day 21th  of march we look how many days is after from fromdate ( cal day 19), so  2, so search ix : dayspan[ix]>=2 => ix=1 so   curRelInDay=ix=1, 
                            //          and first bookable day is   dayspan[curRel]- 2 days after the desidered day  ( calendar 22 - calendar 21 of same month)

                            //          (interesting case : given a desidered calendar day 3  of march we look how many days   after from fromdate (ex cal day 28), so  3, so search ix : dayspan[ix]>=3 => ix=1 so   curRelInDay=ix, )
                            //      if we want select days meeting a new  desidered new fromHour we must rebuild all preferred hour day pointer : pref_day_slot[i] that gives for the iesimo bookable day after fromdate the rows index of slot meeting the fromhour
                            // >>>  so when given a desidered day we calc curRelInDay index. the iesimo bookable day after the desidered day will be found in bookable arrays with index ix=curRelInDay+i

                daysc = [],//[14,1,8] number of bookable  slot in  iesimo bookable day (has value >0)
                dayBookable=[],  //[19,22,3] the calendar number of the bookable day , so first bookable is 19 ( of february? ), attention the month is not known , need just to matching the prompt 
                pref_day_slot=[],//[114,211,null],  if not null, contains  the rows index, prefSlot,   of slot in rel day dayspan , having hour near the hour preference of user  (fromHour) can be rebuilt
                relDayInd=[],//[101,210,310],   contains  the rows index,  of first slot of ix esimo bookable day after fromdate

          
                totSlot=0,// total slot got , consolidate intCount
                prefSlot;

                //


               // alrede have count :useless !!     i=0;// the index in building rows,.medSync same as count  but 1=cout+1 !!!

            // for each day with available booking slot
            for (let ada in datas) {// datas={ada='2020-12-30':["09:00:00","10:00:00","11:00:00",,,],,,,,}

                prefSlot=-1;//  the day slot after desidered hour
                let day,// 9 the day cal number 
                    first=true,
                    intCount = 0;// slot in this day 
                //bDays++;ERROR must be calculated comparing utc hour with startDate (or startDate_) (that is start day utc 0 hour ) time stamp 

                bDays=diffdays(ada);
                console.log( ' parsing available slot matrix , a new date is got: ',ada, ' is ',bDays,' days after the star desidered data ',dateFromAPI );


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
                    if(prefSlot<0&&hour>=fromHour)prefSlot=count;// the slot with pref hour in a bookable day 
                    if(first){relDayInd_=count;first=false;}

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
                    let dayi= it(elap.toLocaleString('us-US', { 'weekday': 'narrow' }));
                    if(dayi == 'T') { if(elap.toLocaleString('us-US', { 'weekday': 'short' })=='Tue')dayi='Martedì';else dayi='Giovedì';}
                    else{ if(dayi == 'S')  if(elap.toLocaleString('us-US', { 'weekday': 'short' })=='Sat')dayi='Sabato';else dayi='Domenica';}
                    let prompt_time=' alle ore '+tim.substring(0,5),//  alle ore 17:45
                    prompt_d=dayi+', '+it_date(ada),//  giovedi, 15-12-2021
                    prompt=prompt_d+','+prompt_time;
                    


                    // TODO aggingere l'espansione della data in  :  23 dicembre 2020 

                    query.rows.push({
                        value: stdT,// std datetime duck is "2021-01-04T13:00:00.000-08:00"  so take as our def : "2021-01-04T13:00:00"
                        patt: stdT,// 
                        date: ada,
                        time: tim,
                        // old :  index: ada.substring(8, 10)// day number . when filter we take 1 represenatative each different index , so after go the matxh on index we'll match the items inter index !!!
                        index:count.toString() // new . usefull in ....?  ex in template to navigate in ctl structure ? ex medSyntL[index] o original medSyntL_[index]
                        
                        // filtering will get all day representative after the preferred datetime !! 

                    });
                    // per syncronizzare meglio medsyntL e il resModel aggiungo l'array che mappa i item in index 

                    query.cursor.medSync.push(stdT);//  (**) mappa di sincronismo duale di resModel.index. maps index > itemname=row.value=stdT
                    // al list mustache assieme a dmedSync ( o pre annullare un clone ) 

                    query.cursor.medSyntL.push(// it(elap.toLocaleString('it-IT', options))// the item list to match 
                    prompt+', '//oppure'
                        );// e l'ultimo ??????? .  list items to select . c'e' disponiilità per    :
                    // giovedi 15 dicembre alle 17 e 30  oppure ....
                    // con bu skip value if corresponding patt in null 
                    query.cursor.resModel[stdT] = {// will point to rows[index].value
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
                        patt_hm:tim.substring(0,5),
                        patt_d: day, // 31 
                        patt_i: dayi,// giovedì
                        //vname: row.vname,// ???
                        index: count,// (was i++ )          (**) maps stdT >  index  so rows[index].value=itemname=row.value=stdT. the inverse is  stdT=query.cursor.medSync[index]
                        execu: execu,
                        span
                    };
                    /* incremental process , do if performance problem
                    if(!query.cursor.resModel[stdT].execu){
                        query.cursor.resModel[stdT].execu=true;
                        query.cursor.resModel[stdT].prompt_.replace(',', ', alle ore ');
                    }*/
                });
            //  ad ogni cambio giorno , solo 
            if (intCount > 0) {// >>> ho trovato slot prenotabili nel day so is a bookable day so build BOOKABLE DAYS ARRAYs :
                pref_day_slot.push(prefSlot);// if defined , contains  the index  of slot in this day , having hour near the hour preference of user  (fromHour)
                relDayInd.push(relDayInd_);
                dayspan.push(bDays);//[0,3,4]relative day with slot available , dayspan[ix]= number of days from startdate of ix-esimo bookable day after fromdate  , ex dayspan=[0]  so 0 day (the start day corresponding to dateFirst )has 14 slot available 
                dayBookable.push(day);//[19,22,23]calendar  day with slot , ex dayspan=[0]  so 0 day (the start day corresponding to dateFirst )has 14 slot available 
                daysc.push(intCount);// the slots available to book  x the day dayspan[i]
                totSlot+=intCount;
                
            } // + alla fine
            }

            let bookDays=dayspan.length;// number of bookable days in the interval 
            query.ctl= {   dayspan, daysc,dayBookable,totSlot,bookDays,
                        curRelInDay, relDayInd,pref_day_slot,
                        fromDate,fromDay,fromHour// from date is Date()  loaded using a duck locale trans as rome local . fromDay,fromHour is local of formDate ( loaded using a different locale , th educk locale !!!)
                    };
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
    o=s.substring(8,10)+'-'+s.substring(5,7)+'-'+s.substring(0,4);
    return o;
  }


   
   function diffdays(xdateFromAPI){// must be : "2016-02-09...."; sullo stesso locale da cui ho preso il startDate
    // deve tornare i numeri di giorni , differenze dei calendar number, tra due date (iso format) sullo stesso locale

   let xDate=xdateFromAPI.substring(0,10)+ 'T00:00:00Z';//= // "2016-02-09T00:00:00Z";
   const now = new Date( xDate);
   const nowTimeStamp = now.getTime();
   const microSecondsDiff = Math.abs(nowTimeStamp-startDateTimeStamp);
   return daysDiff = Math.floor(microSecondsDiff / 86400000);// number of day from start date 
   }


   function addDays(date, days) {// https://codewithhugo.com/add-date-days-js/

    // use const date = new Date();const newDate = addDays(date, 10);

    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }
  
  function dateToISOLikeButUs(date) {// https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local
  //function dateToISOLikeButLocal(date) {// https://stackoverflow.com/questions/12413243/javascript-date-format-like-iso-but-local
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal =  date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    const iso = dateLocal.toISOString();
    const isoLocal = iso.slice(0, 19);
    const isous=iso.replace('Z','-08:00');// ex : 2021-01-07T10:32:00.000-08:00
    return isous;//isoLocal;
}



}

async function book(qs) {
    // 取得Token
    let slot = qs.slot;
    console.log('inside api simplybook, booking , slot :', slot);
    // some sort of cache     let token = await auth.getToken().catch( (err) => { console.error(' simplybook  got ERROR : ',err); }); 
    if (!token) return 'na';
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
    let time = '15:00:00';
    let bookingsInfo;
    bookingsInfo = await publicService.book(eventId, unitId, '2020-12-31', time, clientData, additionalFields)
        .catch((err) => { console.error('simplybook , a slot matrix booking was rejected: ', err); }); // or  .catch(console.error);;
    console.log('simplybook slot matrix', bookingsInfo);
    //  bookingsInfo.then((val)=>{console.log('simplybook booked data',val);});
}

async function simplybooking(vars, form_whInst, qs, rest) {// consider only rest_,appcfg .


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
    console.log(' simplybooking book ctl received form instance where : ', form_whInst);
    // now rest on simplybooking to find available slot on desBookingDate
    // so form_whInst={value,date,time}  ?????
    // calc start(dateFrom,dateTo )

    let qq=qs.curStatus,// the passed last query obj , at init is null

    chroot,// the complete directives : will be used as redirection url in ask relay 
    sc=0;// the number of (filtered) item to select set in  medSync,medSyntL,resModel obj

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

    if (form_whInst && form_whInst.mod_date_des && form_whInst.mod_date_des.value) {

        let desDtatTime = form_whInst.mod_date_des.value;// the new request/desidered  datetime about the query

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

        let  selStat, // the status of the matching (selecting ) process managed by this aiax ctl 
        match, groupsel,inst,// rindondant copy ?
        selAction;

        // qq = qs.query;// recover the model under selection process, it is the matches[entity].param , that can be selected or not by user matching (matches[entity].param.match/instance)
        // if matched we goon knowing .param building a new refining match to do from the current status selstat
        // if dont match we can see if the user matched some flag and  obj , that are accettable directives and request to build the selection , in addition to the main form request datetime desDtatTime
        // 

        if (qq) {// the model is alredy filled by previous datetime preference : mod_date_des AND :
                //  the user matched the filtred selection OR express a different action selAction
            selStat = qq.ctl.selStat;// cur status of selection process

            match = qq.match;inst=qq.instance;// the proposed selection was matched 
            groupsel=qq.group.sel;

            selAction = qs.selAction;// a user request that is tied to a new way to give prompt and collect results ( event programming)  to do some matching different from default method followed by selStat 0 ( day , the, hour ) 
                                    // like a aiax param to get a updated query from page ctl , no more as a ctl attribute !!
                                    // usually not null if dont match, so match=false
            // TODO calc current curRelInDay because the preferred date now has a relative val respect to start date of the downloaded matrix >=0, not 0 !! ex startday=22 matchday=24  so curRelInDay=2 ! (calc via instance.day)
            if(!selAction)selAction=0;// no secial action requested as we probably matched the def goon as std
            // ex  user requested pomeriggi ( and match or not the day ) or interval or some week day ....



            // ************* FSM
            // fsm-mdp  see article in mdpArticle folder 
            //  in dialog management each status (vars currently matched) and its output , the prompt (depend statically by matches) depending from user concept matches that give to bot the knowledge of the user choices and objectives ( observations ) 
            //  on matched on ask so its derived by status ) has a next status calculated using the new matched concept . 
            // very often one of the concept or some concepts set the function (user intention helper o event handler) used to calc the  status and associated new output 
            // new output

            qq.match=qq.matched=null;// >>>>  ONLY in case of matched result MUST be reset to match  
           qq.group.sel=qq.instance=null; // also the copied in group (needs ?)


            if (selStat == 1) {
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
                if(match){
                    chroot='slotmatch';// goon with booking naw at least the slot is got

                    qq.match=match;// restore match as we finish and goon without another refine selection 
                    qq.instance=inst; 
                    qq.matched='match';
                    qq.group.sel=groupsel;
                    sc=1;// just not to return null;

                }else{
                    chroot='repeat';
                }
            }else  chroot='repeat';// unkown stare restart

        } else  await firstReq();



        // event handlers for fsm transaction 
        async function setHourSel(){// calling must await if we await something !!!!

            // comes here from selStat  (selection state) =1 . it select the slot of the best bookable day near fromhour , if specified, 
            // in this state we build the selection of the slot in the day with  hour matching :
            // - near previous desidered hour (the instance slot alredy provide a estimation of a desidered hour ) 
            // - if if user say  day 19 but hour 16 and the promt said day 10 at 15:00 we reset the desidered hour new one 

            qq.ctl.selStat = 2;// selecting hour in matched day status
            let row=qq.instance,ind=qq.index;// the rows matching index  :  qq.instance=rows[qq.index],qq.match=instance.value  , so is the current relative desidered index

            let prefHour;
            if(qs.hour_pref)prefHour=parseInt(qs.hour_pref);
            
            if (!isNaN(prefHour)) {// is integer so set index corresponding to first slot of the day with hour just >= prefHour . if cant let ind as it comes 
                // recalc start slot matching prefHour in same day or matched slot , otherwise let pref slot the matched slot 
                //bookable index :
                let ij;
                for (ij = 0; ij < qq.ctl.dayspan.length; ij++) { if (qq.ctl.relDayInd[ij] > ind) break; }
                let eDay; if (ij < qq.ctl.dayspan.length) eDay = qq.ctl.relDayInd[ij]; else eDay = qq.rows.length;
                for (ij = qq.ctl.relDayInd[ij - 1]; ij < eDay; ij++) {
                    let pref = parseInt(qq.rows[ij].time.substring(0,2));// .time:"10:00:00"
                    if (!isNaN(pref))
                        if (pref >= prefHour) break;
                }
                if (ij < eDay) ind = ij;
            }
            
            
            // set till 3 slot following this 
            let dl=qq.rows.length;
            qq.cursor.medSyntL=[];




            let ds=[],// list of index to select ,usefull?
            refLunedi = [];// local 

            qq.cursor.medSync  = Array(dl);// rebuild medSync, fill with null all rows index 

            let tests=3,
            cdate=qq.rows[ind].date;




                // fills new filtered selection medSync,medSyntL,resModel obj : insert 3 datetime of days, following desidered day , with slot hour near to desidered hour  
                for (let ll = ind; ll < dl && sc < tests; ll++) {// from the first related curRelInd following desidered related curRel
                    // nb one slot will be  ri = qc.pref_day_slot[x] x is the  (index of) rel day considering : sstart from it ? (its near the preferred hour )
                    // x is index of ctl.dayBookable that has value = current day 
                    if((qq.rows[ll].date)!=cdate)break;
                    ds.push(ll);

                    sc++;
                    // rebuild the cursor.resModel[match].path = cursor.resModel[match].path_h
                    //let check=qq.rows[ll].value;
                    qq.cursor.resModel[qq.rows[ll].value].patt = qq.cursor.resModel[qq.rows[ll].value].patt_h;// a integer!!!!
                    refLunedi.push(// name of day , register x deiscrminating test
                         setSelectItem(qq.cursor,ll,false,1)// insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs last flag means copy patt_d > .patt , 1 series of hours in a day 

                        //console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
                        //console.log(' > added a selection item , value/datetime: ', kkey, ' patt: ', qq.query.cursor.resModel[kkey].patt, ' dayname : ', qq.query.cursor.resModel[kkey].patt_i, ' to add if discriminant ');
                    );



                }
                if(sc)qq.cursor.medSyntL[0]=   qq.cursor.resModel[qq.rows[ind].value].prompt_d+', ' +qq.cursor.medSyntL[0];// add lunedì 25-12-2021 in first item
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

                chroot= 'th_3daySel_2';

        }

           async function firstReq(){
        selStat = 0;// initial status on the fsm recover a sched matrix 
                    // 012021 : really we need to choose the service and provider , then will propone a def slot or ask user to give desidered dataetime so can get the sched matrix on which select a slot
                    //  so before get a slot matrix we start at status -10 that recover the service/provider list , then after selected service and provider enter in status 0 to start getting the sched matrix ! 


        // { query,dayspan,dayBookable,daysc,totSlot,pref_day_slot,bookDays,fromDate,fromDay,fromHour} 
        qq = await start(desDtatTime, inter);
        // let query=[form_whInst.mod_date_des];// return query as array of just 1 item

        // now schedule must analized and the rows to select must be filtered for first pre select : the day . 
        // then refine again the schedule to select the hour in the preselected day
        // find the day to put in the filtered to preselect


        if (qq.ctl.bookDays < 3) {
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
        if (qq.ctl.bookDays < 3) {
            inter = 30;
            qq = await start(desDtatTime, inter);
        }
        if (qq.ctl.bookDays < 3) {
            inter = 90;
            qq = await start(desDtatTime, inter);
        }

        // let dateTo=qq.fromDate+inter;// error , must use =addDays
        /* Main logic 
        // now filter 3 day to select days , then:
        //                                  if one of 3 is ok :  refilter its hour  or 
        //                                  if request a new date refiletr a new 3 day following the new desidered day and looping 
        // the condition $$xx:> will test row that has index with position not nulled on the filterable map  cursor.medSync[] ( do a copy before filter)
    
                                        the test regex is the field cursor.resModel[stdT].patt: that contains x def the day ,, but that can run time settable 
                                                patt can be refined/ built using  patt_h: hour,patt_d: day,patt_i: dayi, depending if they are discriminant on the filtered set x the specific turn
                            mustache list the array  
                                     cursor.medSyntL[] ( do a copy)
                                        > filled with day number , day name and hour
                            filtered by skipping item as set by the  filterable map  cursor.medSync[]
    */
        const qc = qq.ctl;
        const nit2Prom = 3; // can be 2 or 4
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
                        setSelectItem(qq.cursor,ri)// // insert item ri in filtered selection model cursor.medSync/medSyntL/resModel objs
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


            chroot= 'th_3daySel';
           

        // }
    }


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
        
    } else return null;

    function setSelectItem(cursor,ri,cp_day=true,prmode=0){// ri is the index in full matrix , patt_d > patt if cp_day, pmode 1 series of hours in a day prompt 
                                                // fills 1 item in filtered selection obj :  medSyn,resModel,medSyntL
    let kkey = cursor.medSync[ri] = cursor.medSync_[ri];// the key , itemname, corresponding to index ri, rebuild the sync/ filter array 
    if(cp_day)cursor.resModel[kkey].patt = cursor.resModel[kkey].patt_d;// calendar day number in pattern
    // refLunedi.push(cursor.resModel[kkey].patt_i);// name of day , register x deiscrminating test
    if(prmode==1)cursor.medSyntL.push(cursor.resModel[kkey].prompt_time);
    else cursor.medSyntL.push(cursor.medSyntL_[ri]);// rebuild itemlist with just the slot to test
   // console.log(' a testing rel day(', dayspan[ll], ') correspond to rows index : ', ri, ' item/slot name (stddatetime): ', kkey);
    console.log(' > symplybookingAiaxCtl setSelectItem : added a selection item , value/datetime: ', kkey, ' patt: ', cursor.resModel[kkey].patt, ' dayname : ', cursor.resModel[kkey].patt_i, ' to add if discriminant ');
    return cursor.resModel[kkey].patt_i;// name of day , register x deiscrminating test
}


}

async function book(vars,slot,rest){// consider only rest_,appcfg .
    // let desDateTimeEntityMatch=form.mod_date_des;// form.thenameofentity;
    //  let desBookingDate,desBookingSlot;// calc from desDateTimeEntityMatch !!!!
     console.log(' book book ctl received slot qs : ',slot);
     // now rest on simplybooking to find available slot on desBookingDate
     await start();let result=['booked'];// return query as array of just 1 item
     return {result} ;
 }

 function it(ri){
     if(ri.charAt(0)=='M')return 'Lunedì';
     //else if(ri.charAt(0)=='T')return 'Martedì';
     else if(ri.charAt(0)=='T')return 'T';
     else if(ri.charAt(0)=='W')return 'Mercoledì';
     else if(ri.charAt(0)=='F')return 'Venerdì';
     //else if(ri.charAt(0)=='S')return 'Sabato';
     else if(ri.charAt(0)=='S')return 'S';
     // never
     //else if(ri.charAt(0)=='X')return 'Giovedì';
     //else if(ri.charAt(0)=='Y')return 'Domenica';

 }

 function curdatetime(){

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
let date_=year + "-" + month + "-" + date,
    time= hours + ":" + minutes;

return {date_,time,date};// YYYY-MM-DD  , 19:57 , current new Date()
 }

module.exports ={simplybooking,book};
