let hotel3pini_vox,hotel3pini,hotels,televita,museoAQ,config;



//  bank containing script directive with onChange x script/dynfield-key 
    // onChange is  bound to its dynJs[myscript] > contain scripts directive 
    // cms.before will insert :
    //  values.excel    >  dynJs[myscript_].excel
    //  values.loopDir  > ????
    //  values.matches  >    model matches ex :values.matches.color='red'
    //  values.askmatches  >    model matches ex :values.matches.color='red'

/*
dynJs={ascript:{ TODO : to  REVIEW  changed !!!  on 062020 last templates was config and star_hotels !!!
            excel:{
                    staticvarr...
                    askname:{askstaticattributes,notMatPr:'piano interessato'}  >>> 27022020 : better move inside askdynDir !!!!!!!!!!!!!!!!
                    model attributes and items descriptions

                }

            askdynDir:{
                    loopDir:{// will go inside values.loopDir[akey=colazione_dyn] 
                            loop matching var in intent managed by the dyn 
                            }
            data:{} // filled by onChange as db rows
            onChange_text:'function ...  ' // to be eval in onChange :

            // >> dynask onChange must be registered to cms 
            onChange:function ...

            }
}
*/
// usefull regex (also precompiled ?):

function twoWordNear(w1,w2,d){
    // ex twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2) will return :
    // \\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*
    return '\\b(?:'+w1+')\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,'+d+'}\\s(?:'+w2+')\\w*\\s*';}// 
function buildMod(list,sep1,sep2){// list=[['red,'red|redd'],,,,,,,] , sep1='>',sep2='!', ex  list.push(['red',twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)])
    let items='';
    list.forEach(e => {
       //  typeof (key) === 'string' Array.isArray(handlers) typeof (handlers) === 'function'
        if(typeof (e[1]) === 'string'){
        items+=sep1+e[0]+sep2+e[1];
        }else if(typeof (e[1]) === 'function'){
          /// no good  ????// 
    }});
    if(items){items.substring(1);
    return '{'+sep1+sep2+'}'+items;}
    }

const pren_alle_3='\\bpreno\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s+(\\d{0,2})\\s*',// prefix - 2 word max - integer  .to enhance with datetime 
    ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2);// 

hotel3pini_vox={// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

// added later :   mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

excel:{//  values.excel are dyn staff x user maintenance and dynamic data
//      - dyn template vars and 
//      - dynask params used in in onchange to influence bl in some dyn ask field
//              ex find the floor a log user is in 
//          >>> probably insert some of this in dedicated dyn obj like below
//              
//          > convo directives is more about dialog design !! 
//      - model definition ( view fields and also bl fields )
//          that usually are put in db 

// general param in template

rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,






// >>> NO MORE static ask property AAA following some ask (tab) attributes . NOTE: PUT INSIDE direc DEDICATED ASKDIN fields ( like dyn_rest ) ????? !!!!!!
/*
colazione_conf:{// available in conversations via step.values.excel              
    goon:false // will not :
                // goon taking present user speech  and  skipping the next prompt  
},*/
lastwherein_typeaserv:{         
    news:' oggi al caffe in terrazza viene servito il branch all\'inglese gratis fino alle 11 '
},



// >>> following some Model attributes ( name/patt are directly inserted as condition $$)
colazione_loc:{voicename:'',
                patt:{piano1:'al primo piano'},
                notMatPr:' la location desiderata  '//esempio ..'
},
 mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
        vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
        /* remember tale costrutto lista all not matched model in a ask (+ following branch) 
            but if  marked mod_wh_Of:querredent not list if rel dyn (querredent) alredy matched 
        {{#mustacheF.out}}$$miss&dyn_rest&
            puoi chiedere  <br> 
            x {{vars.matches.mod_Serv.vmatch}}
            <br>
            {{#vars.excel.notMatchL}}
                {{mustacheF.rendnotmatch}}
            {{/vars.excel.notMatchL}}
             o continuare <br>
             x o ritornare al menu principale 
        {{ustacheF.out}}
        */
            notMatPr:'cosa vuoi sapere ad esempio   quando apre o dove si trova ',//  model entity name used in nmList not matched list 
            // vname:=notMatPr

        model:{where:{patt:'dove|che posto|luogo'},
            how:{patt:'come|modo|devo|fare'},
            when:{patt:'quando|ora|orario|mattina|pomeriggio|sera|mattina|oggi|domani'}

        }
 },
 mod_loc:{vmatches:{'piano 1':'piano 1','terrazza':'terrazza al aperto','piano 2':'piano 2','piano terra':'piano terra','loc 3':'piano 3','main':' principale'},// model specification , item voice name 
        notMatPr:' la location ad esempio in terrazza  '//  model entity name used in nmList not matched list 
        ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
 // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
 // vname:=notMatPr
},
mod_Serv:{vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
        vlist:['bar','ristorante','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
// news : that is the declaration of model values and patten instead that do it in line on condition .
// : todo 
//   if a condition declare instead of :
//          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
//      :
//          $$mod_Serv::
//      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
jmodel:'',// json into model
model:null,// 
//  could be 'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast',
// or better 
//  from a json , a general declaration that is inflated in convenience structures vmatches,vlist,....
//      {bar:{
//          patt:'ristorant*|pranzo|cena|trattoria',
//            ai_url:'',
//            vname:''
//      },,}

notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
// vname:=notMatPr
},
mod_vita_user:{
   vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
    },// model specification , item voice name 
    notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
// vname:=notMatPr
}

},


direc:{

/// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
//      so REVIEW following comments ....

dyn_rest_quando:{// a thread

    loopDir:{
        goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
    }
},
dyn_rist_altro_details:{// a thread

    loopDir:{
        goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
    }
},

colazione_dyn:{// used in  associazione a    :




loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
        //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
        //loop staff 
        // complete=repeat_...,// repeat in loop all where field till matches (max2)
        nomain:true,// a context var  in some msg 
        max_repeat:1// then default 

        // here the out function  on context of ....  . or put in global excel ?
        // out:out,// askdin function 
        // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

        // no nmp

},

data:{// will be used by onChange as db rows as array of string 
    // mappings 0,1,2,....   id,value,patt,desc,data,blfields 

},
onChange_text:null//:testFunc.toString// without async !!

},
dyn_rest:{// used in  associazione a    :

// put here also the static  dyn ask definition  AAA ?? yes

loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
        //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
        //loop staff 
        // complete=repeat_...,// repeat in loop all where field till matches (max2)
        nomain:true,// a context var  in some msg 
        max_repeat:1// then default 

        // here the out function  on context of ....  . or put in global excel ?
        // out:out,// askdin function 
        // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

        //, goon:true;

},

    // try to use x every resource the same field . so use data 
rest_data:// old :  now all group go in data as are supposed to have a normalzed inflacted format 
// will be used by onChange as db rows as array of string 
            /* row : 0 id
  1 value/nome
  2 patt
  3 descr
  4 data
  5 loc
  6 menu
  7 news
  // 
  8 where
  9 how
  10 when from
  11 when to 
  12 voicename

*/
    [
        [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza'],
        [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra'],
        [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino']
       ]
,
data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
// now all group go in data as are supposed to have a normalzed inflacted format 

/* row : 0 id
    1 value/nome
    2 patt
    3 descr
    4 data
    5 loc
    6 menu
    7 news

    8 where
    9 how
    10 when from
    11 when to 
    12 voicename
    13 loc/res,,,,, the group type 
    */
[
[0,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col'],
[1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra','col'],
[2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino','col'],
[3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest'],
[4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest'],
[5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest']

]
,


Gdata:// will be used by onChange as group feature 
/* row : 0 id
1 value/nome
2 best
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 nextser : suggested next service to query 

*/
[
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
[1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,

//
onChange_text:null,//testFunc.toString,// without async !!


    // >>>> insert here onchange as a module of this obj so can see the fields !
onChange:null//function(new_value, convo, bot,script,ask){    return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;}
}// ends direc all dyn cb and bl 
}
};// ends hotel3pini_vox


hotel3pini={// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

// add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

excel:{//  values.excel are dyn staff x user maintenance and dynamic data
    //      - dyn template vars and 
    //      - dynask params used in in onchange to influence bl in some dyn ask field
    //              ex find the floor a log user is in 
    //          >>> probably insert some of this in dedicated dyn obj like below
    //              
    //          > convo directives is more about dialog design !! 
    //      - model definition ( view fields and also bl fields )
    //          that usually are put in db 

    // general param in template

    rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

    news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,






    // >>> NO MORE static ask property AAA following some ask (tab) attributes . NOTE: PUT INSIDE direc DEDICATED ASKDIN fields ( like dyn_rest ) ????? !!!!!!
    /*
    colazione_conf:{// available in conversations via step.values.excel              
        goon:false // will not :
                    // goon taking present user speech  and  skipping the next prompt  
    },*/
    lastwherein_typeaserv:{         
        news:' oggi al caffe in terrazza viene servito il branch all\'inglese gratis fino alle 11 '
    },
    


    // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
    colazione_loc:{voicename:'',
                    patt:{piano1:'al primo piano'},
                    notMatPr:' la location desiderata  '//esempio ..'
    },
     mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
            vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
            /* remember tale costrutto lista all not matched model in a ask (+ following branch) 
                but if  marked mod_wh_Of:querredent not list if rel dyn (querredent) alredy matched 
            {{#mustacheF.out}}$$miss&dyn_rest&
                puoi chiedere  <br> 
                x {{vars.matches.mod_Serv.vmatch}}
                <br>
                {{#vars.excel.notMatchL}}
                    {{mustacheF.rendnotmatch}}
                {{/vars.excel.notMatchL}}
                 o continuare <br>
                 x o ritornare al menu principale 
            {{ustacheF.out}}
            */
                notMatPr:'cosa vuoi sapere ad esempio   quando apre o dove si trova ',//  model entity name used in nmList not matched list 
                // vname:=notMatPr

            model:{where:{patt:'dove|che posto|luogo'},
                how:{patt:'come|modo|devo|fare'},
                when:{patt:'quando|ora|orario|mattina|pomeriggio|sera|mattina|oggi|domani'}

            }
     },
     mod_loc:{vmatches:{'piano 1':'piano 1','terrazza':'terrazza al aperto','piano 2':'piano 2','piano terra':'piano terra','loc 3':'piano 3','main':' principale'},// model specification , item voice name 
            notMatPr:' la location ad esempio in terrazza  '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
     // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
     // vname:=notMatPr
    },
    mod_Serv:{vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
            vlist:['bar','ristorante','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
    // news : that is the declaration of model values and patten instead that do it in line on condition .
    // : todo 
    //   if a condition declare instead of :
    //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
    //      :
    //          $$mod_Serv::
    //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
    jmodel:'',// json into model
    model:null,// 
    //  could be 'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast',
    // or better 
    //  from a json , a general declaration that is inflated in convenience structures vmatches,vlist,....
    //      {bar:{
    //          patt:'ristorant*|pranzo|cena|trattoria',
    //            ai_url:'',
    //            vname:''
    //      },,}
    
    notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
    // vname:=notMatPr
   },
   mod_vita_user:{
       vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
        },// model specification , item voice name 
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
   // vname:=notMatPr
    }

},


direc:{
    // 072020 : dyn that recover dyn model data in onchange are ask dyn so go here 
    // dyn model that matches in a condition using a dynmatcher can be definex inside excel  (right ?) 

    /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
    //      so REVIEW following comments ....

    dyn_rest_quando:{// a thread

        loopDir:{
            goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
        }
    },
    dyn_rist_altro_details:{// a thread

        loopDir:{
            goon:false// in the step 0 of the thread  dont want to recover past goon ( so msg will be prompt anyway ). see conversation.runstep
        }
    },

colazione_dyn:{// used in  associazione a    :


    

    loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
            //loop staff 
            // complete=repeat_...,// repeat in loop all where field till matches (max2)
            nomain:true,// a context var  in some msg 
            max_repeat:1// then default 

            // here the out function  on context of ....  . or put in global excel ?
            // out:out,// askdin function 
            // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

            // no nmp

    },

    data:{// will be used by onChange as db rows as array of string 
        // mappings 0,1,2,....   id,value,patt,desc,data,blfields 

    },
    onChange_text:null//testFunc.toString// without async !!

},
dyn_rest:{// used in  associazione a    :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
            //loop staff 
            // complete=repeat_...,// repeat in loop all where field till matches (max2)
            nomain:true,// a context var  in some msg 
            max_repeat:1// then default 

            // here the out function  on context of ....  . or put in global excel ?
            // out:out,// askdin function 
            // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

            //, goon:true;

    },

        // try to use x every resource the same field . so use data 
    rest_data:// old :  now all group go in data as are supposed to have a normalzed inflacted format 
    // will be used by onChange as db rows as array of string 
                /* row : 0 id
      1 value/nome
      2 patt
      3 descr
      4 data
      5 loc
      6 menu
      7 news
      // 
      8 where
      9 how
      10 when from
      11 when to 
      12 voicename

*/
        [
            [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza'],
            [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra'],
            [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino']
           ]
    ,
    data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
    // now all group go in data as are supposed to have a normalzed inflacted format 

    /* row : 0 id
        1 value/nome
        2 patt
        3 descr
        4 data
        5 loc
        6 menu
        7 news

        8 where
        9 how
        10 when from
        11 when to 
        12 voicename
        13 loc/res,,,,, the group type 
        */
[
[0,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col'],
[1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra','col'],
[2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino','col'],
[3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest'],
[4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest'],
[5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest']

]
,


Gdata:// will be used by onChange as group feature 
/* row : 0 id
1 value/nome
2 best
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 nextser : suggested next service to query 

*/
[
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
[1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,

//
    onChange_text:null,//testFunc.toString,// without async !!


        // >>>> insert here onchange as a module of this obj so can see the fields !
    onChange:function(new_value, convo, bot,script,ask){
        return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

    }

}
}// ends direc all dyn cb and bl 
};// ends hotel3pini

hotels={// all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

// add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

excel:{//  values.excel are dyn staff x user maintenance and dynamic data
    //      - dyn template vars and 
    //      - dynask params used in in onchange to influence bl in some dyn ask field
    //              ex find the floor a log user is in 
    //          >>> probably insert some of this in dedicated dyn obj like below
    //              
    //          > convo directives is more about dialog design !! 
    //      - model definition ( view fields and also bl fields )
    //          that usually are put in db 

    // general param in template

    rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

    news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,






    // >>> NO MORE static ask property AAA following some ask (tab) attributes . NOTE: PUT INSIDE direc DEDICATED ASKDIN fields ( like dyn_rest ) ????? !!!!!!
    /*
    colazione_conf:{// available in conversations via step.values.excel              
        goon:false // will not :
                    // goon taking present user speech  and  skipping the next prompt  
    },*/
    lastwherein_typeaserv:{         
        news:' oggi al caffe in terrazza viene servito il branch all\'inglese gratis fino alle 11 '
    },
    


    // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
    colazione_loc:{voicename:'',
                    patt:{piano1:'al primo piano'},
                    notMatPr:' la location desiderata  '//esempio ..'
    },
     mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
            vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
                notMatPr:'le informazioni desiderate come  quando dove '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
     },
     mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
     // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
     // vname:=notMatPr
    },
    mod_Serv:{vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
            vlist:['bar','ristorante','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
    // news : that is the declaration of model values and patten instead that do it in line on condition .
    // : todo 
    //   if a condition declare instead of :
    //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
    //      :
    //          $$mod_Serv::
    //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
    model:'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast',
    // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
    //      {bar:{
    //          patt='ristorant*|pranzo|cena|trattoria',
    //            ai_url='',
    //            vname=''
    //      },,}
    
    notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
    // vname:=notMatPr
   },
   mod_vita_user:{
       vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
        },// model specification , item voice name 
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
   // vname:=notMatPr
    }

},


direc:{

    /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
    //      so REVIEW following comments ....

colazione_dyn:{// used in  associazione a    :


    

    loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
            //loop staff 
            // complete=repeat_...,// repeat in loop all where field till matches (max2)
            nomain:true,// a context var  in some msg 
            max_repeat:1// then default 

            // here the out function  on context of ....  . or put in global excel ?
            // out:out,// askdin function 
            // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

            // no nmp

    },

    data:{// will be used by onChange as db rows as array of string 
        // mappings 0,1,2,....   id,value,patt,desc,data,blfields 

    },
    onChange_text:null//testFunc.toString// without async !!

},
dyn_rest:{// used in  associazione a    :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
            //loop staff 
            // complete=repeat_...,// repeat in loop all where field till matches (max2)
            nomain:true,// a context var  in some msg 
            max_repeat:1// then default 

            // here the out function  on context of ....  . or put in global excel ?
            // out:out,// askdin function 
            // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

            //, goon:true;

    },

        // try to use x every resource the same field . so use data 
    rest_data:// old :  now all group go in data as are supposed to have a normalzed inflacted format 
    // will be used by onChange as db rows as array of string 
                /* row : 0 id
      1 value/nome
      2 patt
      3 descr
      4 data
      5 loc
      6 menu
      7 news
      // 
      8 where
      9 how
      10 when from
      11 when to 
      12 voicename

*/
        [
            [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza'],
            [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra'],
            [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino']
           ]
    ,
    data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
    // now all group go in data as are supposed to have a normalzed inflacted format 

    /* row : 0 id
        1 value/nome
        2 patt
        3 descr
        4 data
        5 loc
        6 menu
        7 news

        8 where
        9 how
        10 when from
        11 when to 
        12 voicename
        13 loc/res,,,,, the group type 
           todo 
        14 : patt
        15: spare
        16:time2 from
        17:time2 to

        */
[
[0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col'],
[1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra','col'],
[2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino','col'],
[3,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','res'],
[4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','res'],
[5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','res']

]
,


Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
/* row : 0 id
1 value/nome
2 best
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 suggested next service to query 
8 ?

*/
[
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante , portineria e'],
[1,'rest','master shef cucina internazionale','si prega prenotare per menu pesce ',1,'ristorante','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,


    onChange_text:null,//testFunc.toString,// without async !!


        // >>>> insert here onchange as a module of this obj so can see the fields !
    onChange:function(new_value, convo, bot,script,ask){
        return dyn_rest_f.call(this,new_value, convo, bot,script,ask) ;

    }

}
}// ends direc all dyn cb and bl 
};// ends hotels

televita={// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

// add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

excel:{//  values.excel are dyn staff x user maintenance and dynamic data
    //      - dyn template vars and 
    //      - dynask params used in in onchange to influence bl in some dyn ask field
    //              ex find the floor a log user is in 
    //                  have info if the user got the medicine so can jump to rith service thread 
    //          >>> probably insert some of this in dedicated dyn obj like below
    //              
    //          > convo directives is more about dialog design !! 
    //      - model definition ( view fields and also bl fields )
    //          that usually are put in db 

    // general param in template

    rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

    news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,






    


    // >>> following some Model attributes ( name/patt are directly inserted as condition $$)

   mod_vita_user:{
       vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
        },// model specification , item voice name 
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
   // vname:=notMatPr
    },
    // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*


     ///////

     mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
        vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
         notMatPr:'le informazioni desiderate come  quando dove '//  model entity name used in nmList not matched list 
         // vname:=notMatPr
},
mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
     notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
     ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
},
mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
     notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
     ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
},
mod_Serv:{vmatches:{bar:'bar',rest:'medicamenti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'farmaci'},// model specification , item voice name 
     vlist:['bar','medicamenti','portineria','piscina','lavanderia','farmaci'],//temporaneo , è duplicato di vmatches con different format !
// news : that is the declaration of model values and patten instead that do it in line on condition .
// : todo 
//   if a condition declare instead of :
//          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
//      :
//          $$mod_Serv::
//      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
model:'bar-bar&rest-medicamen&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-farmac|pastigli|compress',
// or , a general declaration that is inflated in convenience structures vmatches,vlist,....
//      {bar:{
//          patt='ristorant*|pranzo|cena|trattoria',
//            ai_url='',
//            vname=''
//      },,}

notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
// vname:=notMatPr
},

     /////
     

},


direc:{

    /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
    //      so REVIEW following comments ....

    key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{
            //goon:false // dont work 
            // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
            // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
            goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
        }
    },

    ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{
            //goon:false // dont work 
            goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
        }
    },
    ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{
            //goon:false // dont work 
            goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
        }
    },



dyn_medicine:{// used in  associazione a    :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
            //loop staff 
            // complete=repeat_...,// repeat in loop all where field till matches (max2)
            nomain:true,// a context var  in some msg 
            max_repeat:1// then default 

            // here the out function  on context of ....  . or put in global excel ?
            // out:out,// askdin function 
            // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

            //, goon:true;

    },

   

    med_data:// will be used by onChange as db rows as array of string 
                /* row : 0 id
      1 value/nome
      2 patt
      3 descr
      4 data
      5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera ... in sostanza un where field !         
      6 menu quando prenderla
      7 news avvertenze medico
      // 
      8 where  come fare a recuperarla 
      9 how come prenderla
      10 when from : prima pasti
      11 when to  max delay
      12 voicename
        13 loc/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
           todo 
        14 : patt :duplicated , see 2
        15: spare
        16:time2 from
        17:time2 to

      // specific bl transaction fields 
      20 taken/missing : get join with user med with status get/miss: 0/1
      21 ....
      22 ....
      23 ...
      24 ---
      25 inputdata1









*/
        [
            [11,'aspirina','aspirina','aspirina descr ','data','credenza 1','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo la compressa in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
            [22,'cumadin','cuma|coum','cumadin descr','oggi branch gratis alle 11 ','credenza 2','prima pasti ','se salti non riprenderla','vai in credenza',' deglutendo la compressa intera con acqua','dopo i pasti ','10:00','cumadin','col',,,,,,,,false,,,,,''],
            [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
           ]
    ,
    data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
    /* row : 0 id
1 value/nome
2 patt
3 descr
4 data
5 loc
6 menu
7 news
// 
8 where
9 how
10 when from
11 when to 
12 voicename
*/
[
[0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza'],
[1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra'],
[2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino']
]
,
Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
/* row : 0 id
1 value/nome
2 best prompt per cominciare a rispondere al main desire
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
4 defIndex : the index of resource data that is the std item x the specific service

5 voicename vgroup
6 wh available for the service (to prompt in altro)
7 suggested next service to query 
8 ?

*/
[
[0,'col','ecco lelenco dei farmaci che ci risulta devi ancora assumere ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' farmaci','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite'],
[1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
]
,
    onChange_text:null,//testFunc.toString,// without async !!


        // >>>> insert here onchange as a module of this obj so can see the fields !
    onChange:null//function(new_value, convo, bot,script,ask){return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;    }

}
}// ends direc all dyn cb and bl 
};// ends televita
let star_hotel={// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

    // add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF
    
    excel:{//  values.excel are dyn staff x user maintenance and dynamic data
        //      - dyn template vars and 
        //      - dynask params used in in onchange to influence bl in some dyn ask field
        //              ex find the floor a log user is in 
        //                  have info if the user got the medicine so can jump to rith service thread 
        //          >>> probably insert some of this in dedicated dyn obj like below
        //              
        //          > convo directives is more about dialog design !! 
        //      - model definition ( view fields and also bl fields )
        //          that usually are put in db 
    
        // general param in template
    
        rest:{col:{hall:{news:'today branch gratis!'}}},// delete 
        vname:'hotel cinque stelle',
    
        news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,
    
    
    
    
    
    
        
    
    
        // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
    
       mod_vita_user:{
           vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
            },// model specification , item voice name 
            notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
       // vname:=notMatPr
        },
        // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*
    
    
         ///////
    
         mod_wh:{ // items : 'dove ','come','quando' + altro dettagli ????
            // model specification , item voice name     
            vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
            vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
             notMatPr:'le informazioni desiderate come  quando dove ',//  model entity name used in nmList not matched list 
             // vname:=notMatPr
             // insert here model , instead of inline ? 
             // model: $$§mod_wh:come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\bdetta|\binfor|\baltro
             model:'come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\\bdetta|\binfor|\\baltro&det-\\bdettagl|\\baltro',

    },

    // a value model : get its valus by a group match in a regex ( now only result[1] is consifdered a valid value match )
    mod_bookhour:{vmatches:{value:''},//int value , when matched the value is the number got:vars.models.matches.modelname.vmatch vars.models.matches.modelname.match
    vlist:['ora prenotata'],//temporaneo , è duplicato di vmatches con different format ! // not value type
    model:'value-'+pren_alle_3,// nb  /  or  //   x- will go in vars.models.matches.modelname.match=x
     notMatPr:'l ora in cui prenotare'//  model entity name used in nmList not matched list 
     // vname:=notMatPr
},


    mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
         notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
         ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
    // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
    // vname:=notMatPr
    },
    mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
         notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
         ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
    // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
    // vname:=notMatPr
    schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
    },
    mod_Serv:{vmatches:{bar:'bar',rest:'ristoranti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione',ext:'ristoranti della zona'},// model specification , item voice name 
   vlist:['bar','ristoranti','portineria','piscina','lavanderia','colazione','ristoranti della zona'],//temporaneo , è duplicato di vmatches con different format ! 

    // news : that is the declaration of model values and patten instead that do it in line on condition .
    // : todo 
    //   if a condition declare instead of :
    //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
    //      :
    //          $$mod_Serv::
    //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



    // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
    //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
    // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
    // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
    model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>'+twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2),

    // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
    //      {bar:{
    //          patt='ristorant*|pranzo|cena|trattoria',
    //            ai_url='',
    //            vname=''
    //      },,}
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
    // vname:=notMatPr
    },
    
    },
    
    
    direc:{
    
        /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
        //      so REVIEW following comments ....
    
        key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
                // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }
        },
    
        ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            },
            onChange_text:null,
    
    
          
        onChange:null//
    
        },
        ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }
        },
    
    
    
    dyn_medicine:{// parte del context in onChange    :
    
        // put here also the static  dyn ask definition  AAA ?? yes
        url:null,// get query from internal db rest service :  ='service://dbmatch',// new method
        schemaurl:'Master',// schemaname of master collection, url is  'mongodb://localhost:27017/'
        schema: 
            {
                // receiving the cursor rows from db we can flat into a array of format med_data using :
                // no  [xx._id,xx.value,xx.patt,xx.descr,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]
                //     [xx._id,xx.value,xx.patt,xx.descr,xx.data,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]
  
                    // nb here got is number  not boolean like med_data
          
          // DEFAULT FIELDS :
          _id: Number,// choosen numeric id !!!
          // id/name
              value: {type: String, required: true},// the name (if we want to use as patt a modified voice name or  bl key or the gui key shown in list, here the name
          
              patt: {type: String, required: true},// the vui key ( voice name to find entity itself)	// * post_title
             descr: {type: String, required: true},// the find/query IR matching terms
          // mobile reserveurl or a a detailed description
             data: {type: String},// the fts added terms/relation x refine or some bl detail // the preparazione
          
          
          // BL FIELDS : 
          
          loc: {type: String, required: true},
          menu: {type: String},
          news: {type: String},
          where: {type: String, required: true},
          how: {type: String, required: true},
          whenfrom: {type: String},
          whento: {type: String},
          voicename: {type: String, required: true},
          res: {type: String},
          patt2: {type: String},
          spare: {type: String},
          time2from: {type: String},
          time2to: {type: String},
          det_master: {type: String},
          det_item: {type: String},
          got: {type: Number},
          dat1: {type: String},
          dat2: {type: String},
          dat3: {type: String},
          dat4: {type: String},
          inputdata1: {type: String}

            },
    
        loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                //loop staff 
                // complete=repeat_...,// repeat in loop all where field till matches (max2)
                nomain:true,// a context var  in some msg 
                max_repeat:1// then default 
    
                // here the out function  on context of ....  . or put in global excel ?
                // out:out,// askdin function 
                // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}
    
                //, goon:true;
    
        },
    
       
    
        med_data:// will be used by onChange as db rows as array of string 
                    /* row : 0 id
          1 value/nome
          2 patt
          3 descr in testa , il default, breve 
          4 data news , marketing
          5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera ... in sostanza un where field !         
          6 menu (wh = menu o che ....)
          7 news avvertenze medico
          // 
          8 where/dove  come fare a raggiungerlo
          9 how come prenotare/chiamarlo/....   e' vario !
          10 when from : arertura 
          11 when to  chiusura
          12 voicename
            13 the group belonging to :col/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
               todo 
            14 : patt :duplicated , see 2
            15: spare
            16:time2 from
            17:time2 to
        18: det dettaglio in master long (instead of 3 )
        19 :det  dettaglio in item  , long (instead of 3 )
    
          // specific bl transaction fields 
          20 true/false   taken/missing : get join with user med with status get/miss: 0/1
          21 ....
          22 ....
          23 ...
          24 ---
          25 inputdata1
  
    
    
    
    
    
    
    
    
    */
   /*
            [
                [11,'aspirina','aspirina','aspirina descr ','data','credenza 1','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo la compressa in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
                [22,'cumadin','cuma|coum','cumadin descr','oggi branch gratis alle 11 ','credenza 2','prima pasti ','se salti non riprenderla','vai in credenza',' deglutendo la compressa intera con acqua','dopo i pasti ','10:00','cumadin','col',,,,,,,,false,,,,,''],
                [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
               ]
*/
/*
               [
                [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al ultimo piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','vai al piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','vai al secondo piano','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
                [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,'']
                
                ]
*/
// /*

               [
                [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al ultimo  piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],,true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall caffe','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
               // test withou then uncomment: [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
               // test withou then uncomment: [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [5,'giardino','\\bgiard','è il ristorante esclusivo dello star  hotel, da su uno splendido giardino multipiano','data','piano 2','carne','veggs backon gratis',' esci in giardino e segui le indicazioni baia blu','prendi ascensore B presso la hall','09:00','10:00','ristorante  al giardino blu','rest',,,,,'è splendido ristorante con terrazza panoramica, aperto fino alle 24,  specializzato sul rosbeef all inglese','è splendido ristorante con terrazza panoramica, aperto fino alle 24,  specializzato sul rosbeef all inglese',true,,,,,''],
                [6,'da toni','toni','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','prendi la strada per pescaropoli e al terzo kilometro gira verso il capanno','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''],
                [7,'da genio','genio','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','prendi la strada per udine e al terzo kilometro gira verso l\'oasi terre nere','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''] 

               ]

// */
        ,
        data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
        /* row : 0 id
    1 value/nome
    2 patt
    3 descr
    4 data
    5 loc
    6 menu
    7 news
    // 
    8 where
    9 how
    10 when from
    11 when to 
    12 voicename
    */
   // DO NOT USE :
    [
    [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza'],
    [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra'],
    [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ']
    ]
    ,
    Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
    /* row : 0 id
    1 value/nome
    2 best prompt per cominciare a rispondere al main desire
    3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
    4 defIndex : the index of resource data that is the std item x the specific service
    
    5 voicename vgroup
    6 wh available for the service (to prompt in altro)
    7 suggested next service to query 
    8 ?
    
    */
   /*
    [
    [0,'col','ecco lelenco dei farmaci che ci risulta devi ancora assumere ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' farmaci','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite'],
    [1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi'],
    [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
    [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
    ]*/
/*
    [
        [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
        [1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
        [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        ]
*/



/* 072020 last mapping :
    mydyn.param.group.name=gr[1];// just interna value , should be pills
    mydyn.param.group.vname=gr[5];// pastiglie
    mydyn.param.group.best=gr[2]; // master : presentazione  lista in master in assenza di richieste mod_wh
    mydyn.param.group.calce=gr[3];//class common detail item: avvertenze per medicine particolari o intolleranze generiche relative alla lista user e pills , dynamic !
    mydyn.param.group.what=gr[6];// ?? prompt per ulteriori detail di aiuto all'assunzioine, come lista o come specifico di una pill ??
    mydyn.param.group.nextserv=gr[7];??
    mydyn.param.group.promtAfterList=gr[8];// the closing prompt for master to goon with the list . if exists will override the std  x all group in template



    // obsolete if( mydyn.param.group.sel)mydyn.param.group.isdef=true;else mydyn.param.group.isdef=false;// seems ok , ? to do 
    mydyn.param.group.vgroup=gr[5];
*/
    [
// non va se inserisco {{some var}}        [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per prenotare o avere più dettagli  .  o chiedere altre informazioni sul servizio {{vars.askmatches.dyn_medicine.param.group.vname}}ad esempio dove, come arrivare o quando apre'],
// ind,name,prelist,                                        item detail                                                                                                                     def item index, vname,                                       
// [id,name,best,                                           calce,                                                                                                                          def,vname,          what,                               nextserv,                   promtAfterList]

//[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per prenotare o avere più dettagli  .  o chiedere altre informazioni sui servizi colazione, ad esempio dove, come arrivare o quando apre'], 
// [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta  o chiedere  informazioni sulla location o sugli orari di apertura'],
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta   o chiedere  informazioni di dettaglio sulla location o sugli orari di apertura'],
[1,'rest',' tutti i ristoranti sono attentissimi alla qualità dei prodotti ','Per intolleranze segnalarlo in reception. ',1,'ristoranti', '  quando è aperto e come arrivarci ',' ciao , portineria e taxi','puoi scegliere una proposta .  o chiedere  informazioni di dettaglio sulla location o sugli orari di apertura'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi',''],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi',''],
        ]



    ,
        onChange_text:null,//testFunc.toString,// without async !!
    
    
            // >>>> insert here onchange as a module of this obj so can see the fields !
        onChange:null//function(new_value, convo, bot,script,ask){return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;    }
    
    }
    }// ends direc all dyn cb and bl 
    };// ends star_hotel
    
config={// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

        // add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF
        
        excel:{//  values.excel are dyn staff x user maintenance and dynamic data
            //      - dyn template vars and 
            //      - dynask params used in in onchange to influence bl in some dyn ask field
            //              ex find the floor a log user is in 
            //                  have info if the user got the medicine so can jump to rith service thread 
            //          >>> probably insert some of this in dedicated dyn obj like below
            //              
            //          > convo directives is more about dialog design !! 
            //      - model definition ( view fields and also bl fields )
            //          that usually are put in db 
        
            // general param in template
        
            rest:{col:{hall:{news:'today branch gratis!'}}},// delete 
            vname:'auto virtuale',
        
            news:' da oggi è possibile avere nuovi motori con alimentazione ad alcool  ' ,
        
        
        
        
        
        
            
        
        
            // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
        
           mod_vita_user:{
               vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
                },// model specification , item voice name 
                notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
           // vname:=notMatPr
            },
            // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*
        
        
             ///////
        
             mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
                vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
                 notMatPr:'le informazioni desiderate come  quando dove '//  model entity name used in nmList not matched list 
                 // vname:=notMatPr
        },
    
        // a value model : get its valus by a group match in a regex ( now only result[1] is consifdered a valid value match )
        mod_bookhour:{vmatches:{value:''},//int value , when matched the value is the number got:vars.models.matches.modelname.vmatch vars.models.matches.modelname.match
        vlist:['ora prenotata'],//temporaneo , è duplicato di vmatches con different format ! // not value type
        model:'value-'+pren_alle_3,// nb  /  or  //   x- will go in vars.models.matches.modelname.match=x
         notMatPr:'l ora in cui prenotare'//  model entity name used in nmList not matched list 
         // vname:=notMatPr
    },
    
    
        mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
             notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
             ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
        // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
        // vname:=notMatPr
        },
        mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
             notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
             ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
        // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
        // vname:=notMatPr
        },
        /*    mod_Serv:{vmatches:{bar:'bar',rest:'medicamenti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'farmaci'},// model specification , item voice name 
             vlist:['bar','medicamenti','portineria','piscina','lavanderia','farmaci'],//temporaneo , è duplicato di vmatches con different format !
        // news : that is the declaration of model values and patten instead that do it in line on condition .
        // : todo 
        //   if a condition declare instead of :
        //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
        //      :
        //          $$mod_Serv::
        //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
        model:'bar-bar&rest-medicamen&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-farmac|pastigli|compress',
        // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
        //      {bar:{
        //          patt='ristorant*|pranzo|cena|trattoria',
        //            ai_url='',
        //            vname=''
        //      },,}
        
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
        // vname:=notMatPr
        },
        */
    
        mod_Serv:{vmatches:{bar:'stile',rest:'abitacolo',port:'freni',pisc:'piscina',lav:'lavanderia',col:'motore',ext:'abitacolo'},// model specification , item voice name 
             vlist:['stile','abitacolo','freni','piscina','lavanderia','motore','abitacolo'],//temporaneo , è duplicato di vmatches con different format !
        // news : that is the declaration of model values and patten instead that do it in line on condition .
        // : todo 
        //   if a condition declare instead of :
        //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
        //      :
        //          $$mod_Serv::
        //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
        model:'bar-bar&rest-abitacolo&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-\bmotore&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
        // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
        //      {bar:{
        //          patt='ristorant*|pranzo|cena|trattoria',
        //            ai_url='',
        //            vname=''
        //      },,}
        
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
        // vname:=notMatPr
        },
        
             /////
             
        
        },
        
        
        direc:{
        


            //  ????????????????????????
            /// 27022020  CHANGED ( sure ?)  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
            //      so REVIEW following comments ....

        
            key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :
        
                // put here also the static  dyn ask definition  AAA ?? yes
        
                loopDir:{
                    //goon:false // dont work 
                    // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
                    // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            },
        
            ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :
        
                // put here also the static  dyn ask definition  AAA ?? yes
        
                loopDir:{
                    //goon:false // dont work 
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                },
                onChange_text:null,
        
        
              
            onChange:null//
        
            },
            ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :
        
                // put here also the static  dyn ask definition  AAA ?? yes
        
                loopDir:{
                    //goon:false // dont work 
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            },
        
        
        
        dyn_medicine:{// used in  associazione a    :
        
            // put here also the static  dyn ask definition  AAA ?? yes
        
            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                    //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                    //loop staff 
                    // complete=repeat_...,// repeat in loop all where field till matches (max2)
                    nomain:true,// a context var  in some msg 
                    max_repeat:1// then default 
        
                    // here the out function  on context of ....  . or put in global excel ?
                    // out:out,// askdin function 
                    // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}
        
                    //, goon:true;
        
            },
        
           
        
            med_data:// will be used by onChange as db rows as array of string 
                        /* row : 0 id
              1 value/nome
              2 patt
              3 descr in testa 
              4 data news , marketing
              5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera ... in sostanza un where field !         
              6 menu (wh = menu o che ....)
              7 news avvertenze medico
              // 
              8 where  come fare a raggiungerlo
              9 how come prenotare/chiamarlo/....   e' vario !
              10 when from : arertura 
              11 when to  chiusura
              12 voicename
                13 loc/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
                   todo 
                14 : patt :duplicated , see 2
                15: spare
                16:time2 from
                17:time2 to
            18: det dettaglio in master 
            19 :det  dettaglio in item  
        
              // specific bl transaction fields 
              20 true/false   taken/missing : get join with user med with status get/miss: 0/1
              21 ....
              22 ....
              23 ...
              24 ---
              25 inputdata1
    
        
        
        
        
        
        
        
        
        
        */
       /*
                [
                    [11,'aspirina','aspirina','aspirina descr ','data','credenza 1','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo la compressa in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
                    [22,'cumadin','cuma|coum','cumadin descr','oggi branch gratis alle 11 ','credenza 2','prima pasti ','se salti non riprenderla','vai in credenza',' deglutendo la compressa intera con acqua','dopo i pasti ','10:00','cumadin','col',,,,,,,,false,,,,,''],
                    [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
                   ]
    */
    
                   [
                    [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                    [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                    [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
                    [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                    [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                    [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                    [6,'da toni','toni','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','vaial piano','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''],
                    [7,'da genio','genio','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','vaial piano','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''],                ]
            ,
            data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
            /* row : 0 id
        1 value/nome
        2 patt
        3 descr
        4 data
        5 loc
        6 menu
        7 news
        // 
        8 where
        9 how
        10 when from
        11 when to 
        12 voicename
        */
       // DO NOT USE :
        [
        [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza'],
        [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra'],
        [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ']
        ]
        ,
        Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
        /* row : 0 id
        1 value/nome
        2 best prompt per cominciare a rispondere al main desire
        3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
        4 defIndex : the index of resource data that is the std item x the specific service
        
        5 voicename vgroup
        6 wh available for the service (to prompt in altro)
        7 suggested next service to query 
        8 ?
        
        */
       /*
        [
        [0,'col','ecco lelenco dei farmaci che ci risulta devi ancora assumere ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' farmaci','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite'],
        [1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi'],
        [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        ]*/
    
        [
            [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
            [1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
            [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
            [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
            ]
    
        ,
            onChange_text:null,//testFunc.toString,// without async !!
        
        
                // >>>> insert here onchange as a module of this obj so can see the fields !
            onChange:null//function(new_value, convo, bot,script,ask){return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;    }
        
        }
        }// ends direc all dyn cb and bl 
        };// ends config
        

museoAQ={// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

// add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF

    excel: {//  values.excel are dyn staff x user maintenance and dynamic data
        //      - dyn template vars and 
        //      - dynask params used in in onchange to influence bl in some dyn ask field
        //              ex find the floor a log user is in 
        //                  have info if the user got the medicine so can jump to rith service thread 
        //          >>> probably insert some of this in dedicated dyn obj like below
        //              
        //          > convo directives is more about dialog design !! 
        //      - model definition ( view fields and also bl fields )
        //          that usually are put in db 

        // general param in template

        rest: { col: { hall: { news: 'today branch gratis!' } } },// delete 

        news: 'oggi grande festa della amicizia alle 20 tutti in piscina!',









        // >>> following some Model attributes ( name/patt are directly inserted as condition $$)

        mod_vita_user: {
            vmatches: {
                bar: 'bar', rest: 'ristorante', port: 'portineria', pisc: 'piscina', lav: 'lavanderia', col: 'colazione'
            },// model specification , item voice name 
            notMatPr: ' il servizio desiderato  '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
        },
        // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*



        /* prima stesura errata : 
        mod_wh: {
            vmatches: { where: 'dove', how: 'come', when: 'quando' ,det:'descrizione'},// model specification , item voice name 
            vlist: ['dove ', 'come', 'quando','descrizione'],//temporaneo , è duplicato di vmatches con different format !
            notMatPr: 'le informazioni desiderate come  quando dove ',//  model entity name used in nmList not matched list 
            // vname:=notMatPr
            model: 'where-\bdove&how-\bcome&when-\bquando&det-\bulterior|\binform|\bdettag',
            notMatPr: ' richiesta informazioni',//  model entity name used in nmList not matched list 
        },*/

                ///////$$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch
        // seconda stesura : 
        mod_wh: {
            vmatches: { dove: 'dove', come: 'come', quando: 'quando' ,per:'motivo'},// model specification , item voice name 
            vlist: ['dove ', 'come', 'quando','motivo,significato'],//temporaneo , è duplicato di vmatches con different format !
            notMatPr: 'le informazioni desiderate come  quando dove ',//  model entity name used in nmList not matched list 
            // vname:=notMatPr
            model: ' come-\bcome|\bche mod|\bquale mod&quando-\bquando&dove-\bdove&perc-\bperch|\bulterior|\binform',
            notMatPr: ' richiesta informazioni',//  model entity name used in nmList not matched list 
        },
        mod_loc: {
            vmatches: { 'piano 1': 'piano 1', 'piano 2': 'piano 2', 'piano terra': 'piano terra' },// model specification , item voice name 
            notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            , mod_wh_Of: 'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
        },
        mod_Serv: {
            vmatches: { bar: 'bar', rest: 'medicamenti', port: 'portineria', pisc: 'piscina', lav: 'lavanderia', col: 'sala 1' },// model specification , item voice name 
            vlist: ['bar', 'medicamenti', 'portineria', 'piscina', 'lavanderia', 'sala 1'],//temporaneo , è duplicato di vmatches con different format !
            // news : that is the declaration of model values and patten instead that do it in line on condition .
            // : todo 
            //   if a condition declare instead of :
            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
            //      :
            //          $$mod_Serv::
            //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
            model: 'bar-bar&rest-medicamen&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-\bsala 1|\bsala uno',
            // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
            //      {bar:{
            //          patt='ristorant*|pranzo|cena|trattoria',
            //            ai_url='',
            //            vname=''
            //      },,}

            notMatPr: ' il servizio desiderato  '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
        },


        mod_mattsera: {
            vmatches: { path_1: 'storico', path_0: 'culturale' },// model specification , item voice name 
            vlist: ['storico', 'culturale'],//temporaneo , è duplicato di vmatches con different format !
            // news : that is the declaration of model values and patten instead that do it in line on condition .
            // : todo 
            //   if a condition declare instead of :
            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
            //      :
            //          $$mod_Serv::
            //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
            model: 'path_1-storico&path_0-culturale|[\s\S]+|start',
            // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
            //      {bar:{
            //          patt='ristorant*|pranzo|cena|trattoria',
            //            ai_url='',
            //            vname=''
            //      },,}

            notMatPr: ' il percorso  '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
        },
        mod_target: {
            vmatches: { bambi: 'versione per bambini', std: 'versione per pubblico generico' },// model specification , item voice name 
            vlist: ['versione per bambini', 'versione per pubblico generico'],//temporaneo , è duplicato di vmatches con different format !
            // news : that is the declaration of model values and patten instead that do it in line on condition .
            // : todo 
            //   if a condition declare instead of :
            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
            //      :
            //          $$mod_Serv::
            //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
            model: 'bambi-bambin|ragaz&std-publico|[\s\S]+',
            // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
            //      {bar:{
            //          patt='ristorant*|pranzo|cena|trattoria',
            //            ai_url='',
            //            vname=''
            //      },,}

            notMatPr: ' versione '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
        },
        mod_percorso: {
            vmatches: { storico: 'storico', culturale: 'culturale' },// model specification , item voice name 
            vlist: ['storico', 'culturale'],//temporaneo , è duplicato di vmatches con different format !
            // news : that is the declaration of model values and patten instead that do it in line on condition .
            // : todo 
            //   if a condition declare instead of :
            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
            //      :
            //          $$mod_Serv::
            //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
            model: 'storico-\bstorico&culturale-\bculturale',
            // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
            //      {bar:{
            //          patt='ristorant*|pranzo|cena|trattoria',
            //            ai_url='',
            //            vname=''
            //      },,}

            notMatPr: ' tipologia di utenza '//  model entity name used in nmList not matched list 
            // vname:=notMatPr
        },

        /////


    },


direc:{

    /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
    //      so REVIEW following comments ....

    key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{
            //goon:false // dont work 
            // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
            // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
            goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
        }
    },

    ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{
            //goon:false // dont work 
           // goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
        }
    },
    ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :

        // put here also the static  dyn ask definition  AAA ?? yes

        loopDir:{
            //goon:false // dont work 
            goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
        }
    },



dyn_medicine:{// used in  associazione a    :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
            //loop staff 
            // complete=repeat_...,// repeat in loop all where field till matches (max2)
            nomain:true,// a context var  in some msg 
            max_repeat:1// then default 

            // here the out function  on context of ....  . or put in global excel ?
            // out:out,// askdin function 
            // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}

            //, goon:true;

    },

   

    med_data:// will be used by onChange as db rows as array of string 
                /* row : 0 id
      1 value/nome
      2 patt per match singolo item
      3 descr short descr
      4 data
      5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera / target user ... in sostanza un where field !         
      6 menu quando prenderla
      7 news avvertenze medico
      // 
      8 where  come fare a recuperarla , la location dell'opera   , luoghi associati all'opera, 
      9 how tecnica come prenderla
      10 when from : prima pasti
      11 when to  max delay
      12 voicename
        13 loc/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
           todo 
        14 : patt :duplicated , see 2
        15: spare / chi 
        16:time2 from
        17:time2 to

      // specific bl transaction fields 
      20 taken/missing : get join with user med with status get/miss: 0/1
      21 ....
      22 ....
      23 ...
      24 ---
      25 inputdata1









*/
        [
            [11,'op1','primavera|botticell','nove figure della mitologia che incedono su un prato fiorito ','data','std_user','attorno al 1480','caratterizzata da spettacolare perizia tecnica del maesto dimostarta dall impegno profuso del maestro e la cura dei dettagli ','l opera è stata scoperta alla fine del 15 secolo in casa di lorenzo di pierfrancesco','caratterizzata da spettacolare perizia tecnica del maesto in tempera grassa su tavola ','datata attorno al 1480 ','10:00','la primavera','col',,'botticelli',,,,,,true,,,,,''],
            [22,'op2','duchi|urbino|sforza','dittico raffigurante i signori di urbino, uno dei più celebri ritratti del rinascimento italiano ','oggi branch gratis alle 11 ','attorno al 1470','attorno al 1470 ','in accordo alla tradizione quattrocentesca le due figure sono rappresentate di profilo, grande verosimiglianza ma senza che trasparissero gli stati d animo','paesaggio marchigiano ove i montefeltro regnavano',' il maestro concilia la rigorosa impostazione prospettica con la lenticolare rappresentazione della pittura fiamminga','attorno al 1470 ','10:00','i duchi di urbino','col',,'piero della francesca',,,,,,false,,,,,''],
            [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
           ]
    ,
    data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
    /* row : 0 id
1 value/nome
2 patt
3 descr
4 data
5 loc
6 menu
7 news
// 
8 where
9 how
10 when from
11 when to 
12 voicename
*/
[
[0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','caffe terrazza'],
[1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','hall al piano terra'],
[2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','colazione in giardino in giardino']
]
,
Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
/* 
musei : sono le stanze ove sono le opere

row : 
0 id / nordine sale da visitare
1 value/nome
2 best prompt per cominciare a rispondere al main desire / descrizione base sala 
3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 ) // ulteriore dettaglio 
4 defIndex : the index of resource data that is the std item x the specific service/major opera

5 voicename vgroup > nome sala 
6 wh available for the service (to prompt in altro) // domande disponibili x approfondimenti
7 suggested next service to query 
8 ?
9 when phrase
10 why / significato

*/
[
[0,'col',' dipinti rinascimantali del circolo  neoplatonico tra i più amati nel mondo , le opere sono pemeate di significati misteriosi non ancora completamente decifrati ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' grande sala dove sono esposte le più importanti opere di botticelli ','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite','pippo','si è stimato che possano risalire al epoca tardo romana','si vuole rappresentare l espressione delle arti e della raffinatezza della cultura tardo rinacimentale del 1400  al termine del periodo di spendore'],
[1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi','pippo','le opere  contenute risalgono al epoca tardo romana',' è esempio delle arti della cultura tardo rinacimentale  al termine del periodo di spendore'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi','pippo','le opere  contenute risalgono al epoca tardo romana',' è esempio delle arti della cultura tardo rinacimentale  al termine del periodo di spendore'],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi','pippo','le opere  contenute risalgono al epoca tardo romana',' è esempio delle arti della cultura tardo rinacimentale  al termine del periodo di spendore'],
]
,
    onChange_text:null,//testFunc.toString,// without async !!


        // >>>> insert here onchange as a module of this obj so can see the fields !
    onChange:null//function(new_value, convo, bot,script,ask){ return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;   }

}
}// ends direc all dyn cb and bl 
};// ends museoAQ

/// Preferred registration method : fillOnCh_Register :
let OnCh_Register={// minimum  must be :          acmd:{ excel:{}},


ccai1:{// starting with _ means that a goto cmd will fire a child !!
    
    excel:{
    mod_esci:{vmatches:{esci:'esco',msg:'lascia messaggio'},// model specification , item voice name 
    vlist:['esco','lascia messaggio'],//temporaneo , è duplicato di vmatches con different format ! 
     model:'{>&}esco>\\besc|\\busci|\\bciao|\\bsalut&msg>\\bmessag',

         notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
     // vname:=notMatPr
     },


    
    },
    
    direc:{
  
    }},// ends  cca1



    
    simple_help_desk:{// starting with _ means that a goto cmd will fire a child !!
    
        excel:{
        mod_esci:{vmatches:{esci:'esco',msg:'lascia messaggio'},// model specification , item voice name 
        vlist:['esco','lascia messaggio'],//temporaneo , è duplicato di vmatches con different format ! 
         model:'{>&}esco>\\besc|\\busci|\\bciao|\\bsalut&msg>\\bmessag',

             notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
         // vname:=notMatPr
         },
   

        
        },
        
        direc:{
            msgxuff:{
        
                loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }},
            msguff2:{
        
            loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
        
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }},
            mod_cont:{
        
                loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
            
                    goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
        //, autoReg=true
        //
        }   
        }},// ends  simple_help_desk
    _yourname: {// starting with _ means that a goto cmd will fire a child !!

        excel: {


            witai: {},// alredy set in .rid

            mod_prov: {// registering in basefw will make available so in 


                //  db data used by dataservice,  not bot . it is here just to config here also the dataservice connections params
                dbmeta: {// dbservice staff  
                    rel: 0,// a where condition , not join 
                    dburl: 'mongodb://192.168.1.15:27017/',// db mongo server
                    db: 'emilia',// the mongo db
                    collect: 'J_1_m',// x collection name j_1_ms
                    schema1old: // col mapping x cursor filling is not json , no good 

                    // receiving the cursor rows from db we can flat into a array of format med_data using :
                    // no  [xx._id,xx.value,xx.patt,xx.descr,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]
                    //     [xx._id,xx.value,xx.patt,xx.descr,xx.data,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]

                    // nb here got is number  not boolean like med_data

                    // DEFAULT FIELDS :

                    {
                        _id: Number,
                        patt: { type: String, required: true },// the vui key ( voice name)
                        value: { type: String, required: true },// the name or  bl key or the gui key shown in list
                        data: { type: String, required: false },// the fts added terms/relation x refine or some bl detail
                        descr: { type: String, required: false }

                    },


                    schema: // col mapping x cursor filling in json format

                    // DEFAULT FIELDS :

                    {
                        _id: 'number',
                        patt: { type: 'string', required: true },// the vui key ( voice name)
                        value: { type: 'string', required: true },// the name or  bl key or the gui key shown in list
                        data: { type: 'string', required: false },// the fts added terms/relation x refine or some bl detail
                        descr: { type: 'string', required: false }

                    }
                },
                // end db data 

                // error paese e' ask deve essere entity pioop 
                mod_wh_Of: 'pippo'// will be used as where to query a dyn_key OR  match another entity ( depending on this entity ex capital of Italy) , so dont put in notmatched prompt list if we already had the dyn_key matched 
            },

            pippo: {
                schemaurl: 'Master',// old  data service staff,,to be  pass to it !. to map entity pippo into the name of master collection on data service  wich run query 

                dbmeta: {// dbservice staff 
                    dburl: 'mongodb://192.168.1.15:27017/',// db mongo server
                    db: 'emilia',// the mongo db
                    collect: 'J_1_m',// x collection name j_1_ms
                    schema1old: // col mapping x cursor filling is not json , no good 

                    // receiving the cursor rows from db we can flat into a array of format med_data using :
                    // no  [xx._id,xx.value,xx.patt,xx.descr,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]
                    //     [xx._id,xx.value,xx.patt,xx.descr,xx.data,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]

                    // nb here got is number  not boolean like med_data

                    // DEFAULT FIELDS :

                    {
                        _id: Number,
                        patt: { type: String, required: true },// the vui key ( voice name)
                        value: { type: String, required: true },// the name or  bl key or the gui key shown in list
                        data: { type: String, required: false },// the fts added terms/relation x refine or some bl detail
                        descr: { type: String, required: false }

                    },
                    schema: // col mapping x cursor filling in json format


                        // DEFAULT FIELDS :

                        JSON.stringify(
                            {
                                type: 'object',
                                properties: {

                                    _id: { type: 'integer' },//, required: true},//'number',
                                    patt: { type: 'string' },//, required: true},// the vui key ( voice name)
                                    value: { type: 'string' },//, required: true},// the name or  bl key or the gui key shown in list
                                    data: { type: 'string' },//, required: false},// the fts added terms/relation x refine or some bl detail
                                    descr: { type: 'string' }//, required: false}
                                }
                            })
                    // "{"_id":{"type":"integer"},"patt":{"type":"string"},"value":{"type":"string"},"data":{"type":"string"},"descr":{"type":"string"}}"
                    , schemax: '{' +
                        '"type":"object",' +
                        '"properties":{' +
                        /*
                          '"address":{'+
                            '"type":"object",'+
                            '"properties":{'+
                             '"street":{"type":"string"},'+
                             ' "house":{"type":"string"},'+
                              '"city":{"type":"string"}'+
                            '}'+
                          '},'+*/
                        '"firstName":{"type":"string"},' +
                        '"lastName":{"type":"string"},' +
                        '"title":{' +
                        '"type":"string",' +
                        ' "enum":["Dr","Prof.","Ph.D."]' +
                        '},' +
                        '"email":{' +
                        '"type":"array",' +
                        ' "items":{"type":"string"}' +
                        '},' +
                        ' "age":{"type": "integer"}' +
                        ', "_id":{"type": "integer"}' +
                        ' }' +
                        '}'

                },
            }

        },

        direc: {
            paese: {

                loopDir: {// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 

                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
                //, autoReg=true
                //
            }
        }
    },// ends  _yournam

star_desk:{// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

    // add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF
    
    excel:{//  values.excel are dyn staff x user maintenance and dynamic data
        //      - dyn template vars and 
        //      - dynask params used in in onchange to influence bl in some dyn ask field
        //              ex find the floor a log user is in 
        //                  have info if the user got the medicine so can jump to rith service thread 
        //          >>> probably insert some of this in dedicated dyn obj like below
        //              
        //          > convo directives is more about dialog design !! 
        //      - model definition ( view fields and also bl fields )
        //          that usually are put in db 
    
        // general param in template
    
        rest:{col:{hall:{news:'today branch gratis!'}}},// delete 
        vname:'aladino',
    
        news:'oggi grande festa della amicizia alle 20 tutti in piscina!' ,
    
    
    
    
    
    
        
    
    
        // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
    
       mod_vita_user:{
           vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
            },// model specification , item voice name 
            notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
       // vname:=notMatPr
        },
        // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*
    
    
         ///////
    
         mod_wh:{ // items : 'dove ','come','quando' + altro dettagli ????
            // model specification , item voice name     
            vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
            vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
             notMatPr:'le informazioni desiderate come  quando dove ',//  model entity name used in nmList not matched list 
             // vname:=notMatPr
             // insert here model , instead of inline ? 
             // model: $$§mod_wh:come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\bdetta|\binfor|\baltro
             model:'come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\\bdetta|\binfor|\\baltro&det-\\bdettagl|\\baltro',

    },

    // a value model : get its valus by a group match in a regex ( now only result[1] is consifdered a valid value match )
    mod_bookhour:{vmatches:{value:''},//int value , when matched the value is the number got:vars.models.matches.modelname.vmatch vars.models.matches.modelname.match
    vlist:['ora prenotata'],//temporaneo , è duplicato di vmatches con different format ! // not value type
    model:'value-'+pren_alle_3,// nb  /  or  //   x- will go in vars.models.matches.modelname.match=x
     notMatPr:'l ora in cui prenotare'//  model entity name used in nmList not matched list 
     // vname:=notMatPr
},

    mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
         notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
         ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
    // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
    // vname:=notMatPr
    },
    mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
         notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
         ,mod_wh_Of:'dyn_rest'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
    // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
    // vname:=notMatPr
    },
    mod_Serv:{vmatches:{bar:'bar',rest:'ristoranti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione',ext:'ristoranti della zona'},// model specification , item voice name 
   vlist:['bar','ristoranti','portineria','piscina','lavanderia','colazione','ristoranti della zona'],//temporaneo , è duplicato di vmatches con different format ! 

    // news : that is the declaration of model values and patten instead that do it in line on condition .
    // : todo 
    //   if a condition declare instead of :
    //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
    //      :
    //          $$mod_Serv::
    //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 

    // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
    //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
    // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
   
    model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',

    // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
    //      {bar:{
    //          patt='ristorant*|pranzo|cena|trattoria',
    //            ai_url='',
    //            vname=''
    //      },,}
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
    // vname:=notMatPr
    },

    
    },
    
    
    direc:{
    
        /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
        //      so REVIEW following comments ....
    
        key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
                // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }
        },
    
        ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            },
            onChange_text:null,
    
    
          
        onChange:null//
    
        },
        ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }
        },
    
    
    
    dyn_medicine:{// used in  associazione a    :
    
        // put here also the static  dyn ask definition  AAA ?? yes
    
        loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                //loop staff 
                // complete=repeat_...,// repeat in loop all where field till matches (max2)
                nomain:true,// a context var  in some msg 
                max_repeat:1// then default 
    
                // here the out function  on context of ....  . or put in global excel ?
                // out:out,// askdin function 
                // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}
    
                //, goon:true;
    
        },
    
       
    
        med_data:// will be used by onChange as db rows as array of string 
                    /* row : 0 id
          1 value/nome
          2 patt
          3 descr in testa , il default, breve 
          4 data news , marketing
          5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera ... in sostanza un where field !         
          6 menu (wh = menu o che ....)
          7 news avvertenze medico
          // 
          8 where/dove  come fare a raggiungerlo
          9 how come prenotare/chiamarlo/....   e' vario !
          10 when from : arertura 
          11 when to  chiusura
          12 voicename
            13 the group belonging to :col/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
               todo 
            14 : patt :duplicated , see 2
            15: spare
            16:time2 from
            17:time2 to
        18: det dettaglio in master long (instead of 3 )
        19 :det  dettaglio in item  , long (instead of 3 )
    
          // specific bl transaction fields 
          20 true/false   taken/missing : get join with user med with status get/miss: 0/1
          21 ....
          22 ....
          23 ...
          24 ---
          25 inputdata1

    
    
    
    
    
    
    
    
    
    */
   /*
            [
                [11,'aspirina','aspirina','aspirina descr ','data','credenza 1','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo la compressa in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
                [22,'cumadin','cuma|coum','cumadin descr','oggi branch gratis alle 11 ','credenza 2','prima pasti ','se salti non riprenderla','vai in credenza',' deglutendo la compressa intera con acqua','dopo i pasti ','10:00','cumadin','col',,,,,,,,false,,,,,''],
                [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
               ]
*/
/*
               [
                [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al ultimo piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','vai al piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','vai al secondo piano','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
                [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,'']
                
                ]
*/
// /*

               [
                [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall caffe','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
               // test withou then uncomment: [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
               // test withou then uncomment: [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [5,'giardino','\\bgiard','è il ristorante esclusivo dello star  hotel, da su uno splendido giardino multipiano','data','piano 2','carne','veggs backon gratis',' esci in giardino e segui le indicazioni baia blu','prendi ascensore B presso la hall','09:00','10:00','ristorante  al giardino blu','rest',,,,,'è splendido ristorante con terrazza panoramica, aperto fino alle 24,  specializzato sul rosbeef all inglese',,true,,,,,''],
                [6,'da toni','toni','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','prendi la strada per pescaropoli e al terzo kilometro gira verso il capanno','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''],
                [7,'da genio','genio','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','prendi la strada per udine e al terzo kilometro gira verso l\'oasi terre nere','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''] ,
                [8,'col1','general collaudi','collaudi immediati e affidabili','oggi collaudo con check motore gratuito ','a vergate, 10 km','collaudi con check impianto frenante','','prendi la strada per udine e al terzo kilometro gira verso l\'oasi terre nere','prima rotonda e prendi la sinistra','07:00','10:00','collaudatore convenzionato con disponibilità immediata','coll',,,,,'offerte per check aggiuntivi, sempre aperto',,true,,,,,''] 
               ]

// */
        ,

    Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
    /* row : 0 id
    1 value/nome
    2 best prompt per cominciare a rispondere al main desire
    3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
    4 defIndex : the index of resource data that is the std item x the specific service
    
    5 voicename vgroup
    6 wh available for the service (to prompt in altro)
    7 suggested next service to query 
    8 ?
    
    */
   /*
    [
    [0,'col','ecco lelenco dei farmaci che ci risulta devi ancora assumere ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' farmaci','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite'],
    [1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi'],
    [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
    [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
    ]*/
/*
    [
        [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
        [1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
        [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        ]
*/



/* 072020 last mapping :
    mydyn.param.group.name=gr[1];// just interna value , should be pills
    mydyn.param.group.vname=gr[5];// pastiglie
    mydyn.param.group.best=gr[2]; // master : presentazione  lista in master in assenza di richieste mod_wh
    mydyn.param.group.calce=gr[3];//class common detail item: avvertenze per medicine particolari o intolleranze generiche relative alla lista user e pills , dynamic !
    mydyn.param.group.what=gr[6];// ?? prompt per ulteriori detail di aiuto all'assunzioine, come lista o come specifico di una pill ??
    mydyn.param.group.nextserv=gr[7];??
    mydyn.param.group.promtAfterList=gr[8];// the closing prompt for master to goon with the list . if exists will override the std  x all group in template



    // obsolete if( mydyn.param.group.sel)mydyn.param.group.isdef=true;else mydyn.param.group.isdef=false;// seems ok , ? to do 
    mydyn.param.group.vgroup=gr[5];
*/
    [
// non va se inserisco {{some var}}        [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per prenotare o avere più dettagli  .  o chiedere altre informazioni sul servizio {{vars.askmatches.dyn_medicine.param.group.vname}}ad esempio dove, come arrivare o quando apre'],
// ind,name,prelist,                                        item detail                                                                                                                     def item index, vname,                                       
// [id,name,best,                                           calce,                                                                                                                          def,vname,          what,                               nextserv,                   promtAfterList]

//[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per prenotare o avere più dettagli  .  o chiedere altre informazioni sui servizi colazione, ad esempio dove, come arrivare o quando apre'],

[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per avere più dettagli  .  o chiedere  informazioni di dettaglio sulla location o sugli orari di apertura'], 
[1,'rest',' tutti i ristoranti sono attentissimi alla qualità dei prodotti ','Per intolleranze segnalarlo in reception. ',                                                           1,'ristoranti', '  quando è aperto e come arrivarci ',' ciao , portineria e taxi','puoi scegliere una proposta per avere più dettagli  .  o chiedere  informazioni di dettaglio sulla location o sugli orari di apertura'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi',''],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi',''],
[4,'off','officina affidabile','calcei',1,'servizio di officina consigliato','  quando ha disponibilità e come arrivarci',' carrozzeria, portineria e taxi',''],
[5,'carr','carrozzeria affidabile','calcei',1,'servizio di officina consigliato','  quando ha disponibilità e come arrivarci',' carrozzeria, portineria e taxi',''],
[6,'coll','collaudo immediato','calcei',1,'servizio di officina consigliato','  quando ha disponibilità e come arrivarci',' carrozzeria, portineria e taxi','']
        ]



    ,
        onChange_text:null,//testFunc.toString,// without async !!
    
    
            // >>>> insert here onchange as a module of this obj so can see the fields !
        onChange:null//function(new_value, convo, bot,script,ask){return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;    }
    
    }
    }// ends direc all dyn cb and bl 
    },// ends star_desk

_opportunity:{// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

    // add later mustacheF,// mustach functions // passed now in step.values.mustacheF but then copied in conversation.mustacheF
    
    excel:{//  values.excel are dyn staff x user maintenance and dynamic data
        //      - dyn template vars and 
        //      - dynask params used in in onchange to influence bl in some dyn ask field
        //              ex find the floor a log user is in 
        //                  have info if the user got the medicine so can jump to rith service thread 
        //          >>> probably insert some of this in dedicated dyn obj like below
        //              
        //          > convo directives is more about dialog design !! 
        //      - model definition ( view fields and also bl fields )
        //          that usually are put in db 
    
        // general param in template
    
        // ERROR opp:{
            opp:'affitti favolosi',
        vname:'casa tua',
    
        news:'oggi grande offera di abbonamento gratuito' ,
        mod_wh:{ // items : 'dove ','come','quando' + altro dettagli ????
        // model specification , item voice name     
        vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
        vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
         notMatPr:'le informazioni desiderate come  quando dove ',//  model entity name used in nmList not matched list 
         // vname:=notMatPr
         // insert here model , instead of inline ? 
         // model: $$§mod_wh:come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\bdetta|\binfor|\baltro
         model:'come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\\bdetta|\binfor|\\baltro&det-\\bdettagl|\\baltro',

},

// a value model : get its valus by a group match in a regex ( now only result[1] is consifdered a valid value match )
mod_bookhour:{vmatches:{value:''},//int value , when matched the value is the number got:vars.models.matches.modelname.vmatch vars.models.matches.modelname.match
vlist:['ora prenotata'],//temporaneo , è duplicato di vmatches con different format ! // not value type
model:'value-'+pren_alle_3,// nb  /  or  //   x- will go in vars.models.matches.modelname.match=x
 notMatPr:'l ora in cui prenotare'//  model entity name used in nmList not matched list 
 // vname:=notMatPr
},


mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
     notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
     ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
},
mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
     notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
     ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
},
mod_Serv:{vmatches:{bar:'bar',rest:'ristoranti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione',ext:'ristoranti della zona'},// model specification , item voice name 
vlist:['bar','ristoranti','portineria','piscina','lavanderia','colazione','ristoranti della zona'],//temporaneo , è duplicato di vmatches con different format ! 

// news : that is the declaration of model values and patten instead that do it in line on condition .
// : todo 
//   if a condition declare instead of :
//          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
//      :
//          $$mod_Serv::
//      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



// message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
//model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
// model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
// ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>'+twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2),

// or , a general declaration that is inflated in convenience structures vmatches,vlist,....
//      {bar:{
//          patt='ristorant*|pranzo|cena|trattoria',
//            ai_url='',
//            vname=''
//      },,}
    notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
// vname:=notMatPr
},

    
    
        rest:{col:{hall:{news:'today branch gratis!'}}},// delete 

    
    
        
    
    
        // >>> following some Model attributes ( name/patt are directly inserted as condition $$)
    
       mod_vita_user:{
           vmatches:{bar:'bar',rest:'ristorante',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'
            },// model specification , item voice name 
            notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
       // vname:=notMatPr
        },
        // $$§mod_wh:come-come|che mod|quale mod&quando-quando&dove-dove&per-perch*
    
    
         ///////
    
         mod_wh:{ // items : 'dove ','come','quando' + altro dettagli ????
            // model specification , item voice name     
            vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
            vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
             notMatPr:'le informazioni desiderate come  quando dove ',//  model entity name used in nmList not matched list 
             // vname:=notMatPr
             // insert here model , instead of inline ? 
             // model: $$§mod_wh:come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\bdetta|\binfor|\baltro
             model:'come-come&quando-quando&dove-dove|arriv|trova&per-perch&det-\\bdetta|\binfor|\\baltro&det-\\bdettagl|\\baltro',

    },

    // a value model : get its valus by a group match in a regex ( now only result[1] is consifdered a valid value match )
    mod_bookhour:{vmatches:{value:''},//int value , when matched the value is the number got:vars.models.matches.modelname.vmatch vars.models.matches.modelname.match
    vlist:['ora prenotata'],//temporaneo , è duplicato di vmatches con different format ! // not value type
    model:'value-'+pren_alle_3,// nb  /  or  //   x- will go in vars.models.matches.modelname.match=x
     notMatPr:'l ora in cui prenotare'//  model entity name used in nmList not matched list 
     // vname:=notMatPr
},


    mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
         notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
         ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
    // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
    // vname:=notMatPr
    },
    mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
         notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
         ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
    // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
    // vname:=notMatPr
    schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
    },
    mod_Serv:{vmatches:{bar:'bar',rest:'ristoranti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione',ext:'ristoranti della zona'},// model specification , item voice name 
   vlist:['bar','ristoranti','portineria','piscina','lavanderia','colazione','ristoranti della zona'],//temporaneo , è duplicato di vmatches con different format ! 

    // news : that is the declaration of model values and patten instead that do it in line on condition .
    // : todo 
    //   if a condition declare instead of :
    //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
    //      :
    //          $$mod_Serv::
    //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



    // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
    //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
    // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
    // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
    model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>'+twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2),

    // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
    //      {bar:{
    //          patt='ristorant*|pranzo|cena|trattoria',
    //            ai_url='',
    //            vname=''
    //      },,}
        notMatPr:' il servizio desiderato  '//  model entity name used in nmList not matched list 
    // vname:=notMatPr
    },
    
    },// end excel
    
    
    direc:{
    
        /// 27022020  CHANGED  all direc dyn directives will go into vars.direc as is . they will be the context of onChange
        //      so REVIEW following comments ....
    
        key_cambioricetta:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                // if  goon goon2=true continue to test current ask conditions to gather user info/indication/answere from previous msg without prompt a new msg
                // if the bot has info to respond goon2=false so the bot can start a new turn , so prompt the current msg and then test the user answere   
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }
        },
    
        ask_afterpilldet:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            },
            onChange_text:null,
    
    
          
        onChange:null//
    
        },
        ask_opera1_0:{// first step of a displaying view thread . no goon at first step  :
    
            // put here also the static  dyn ask definition  AAA ?? yes
    
            loopDir:{
                //goon:false // dont work 
                goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
            }
        },
    
    
    
    dyn_medicine:{// parte del context in onChange    :
    
        // put here also the static  dyn ask definition  AAA ?? yes
        url:null,// get query from internal db rest service :  ='service://dbmatch',// new method
        schemaurl:'Master',// schemaname of master collection, url is  'mongodb://localhost:27017/'
        schema: 
            {
                // receiving the cursor rows from db we can flat into a array of format med_data using :
                // no  [xx._id,xx.value,xx.patt,xx.descr,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]
                //     [xx._id,xx.value,xx.patt,xx.descr,xx.data,xx.loc,xx.menu,xx.news,xx.where,xx.how,xx.whenfrom,xx.whento,xx.voicename,xx.res,xx.patt2,xx.spare,xx.time2from,xx.time2to,xx.det_master,xx.det_item,xx.got,xx.dat1,xx.dat2,xx.dat3,xx.dat4,xx.inputdata1]
  
                    // nb here got is number  not boolean like med_data
          
          // DEFAULT FIELDS :
          _id: Number,// choosen numeric id !!!
          // id/name
              value: {type: String, required: true},// the name (if we want to use as patt a modified voice name or  bl key or the gui key shown in list, here the name
          
              patt: {type: String, required: true},// the vui key ( voice name to find entity itself)	// * post_title
             descr: {type: String, required: true},// the find/query IR matching terms
          // mobile reserveurl or a a detailed description
             data: {type: String},// the fts added terms/relation x refine or some bl detail // the preparazione
          
          
          // BL FIELDS : 
          
          loc: {type: String, required: true},
          menu: {type: String},
          news: {type: String},
          where: {type: String, required: true},
          how: {type: String, required: true},
          whenfrom: {type: String},
          whento: {type: String},
          voicename: {type: String, required: true},
          res: {type: String},
          patt2: {type: String},
          spare: {type: String},
          time2from: {type: String},
          time2to: {type: String},
          det_master: {type: String},
          det_item: {type: String},
          got: {type: Number},
          dat1: {type: String},
          dat2: {type: String},
          dat3: {type: String},
          dat4: {type: String},
          inputdata1: {type: String}

            },
    
        loopDir:{// vars of a dyn that can replay a thread  , can be also loop status var filled by the replay dyn when matched 
                //will go inside values.loopDir[akey=colazione_dyn] because values.akey=colazione_dyn is managed by conversation for its staff
                //loop staff 
                // complete=repeat_...,// repeat in loop all where field till matches (max2)
                nomain:true,// a context var  in some msg 
                max_repeat:1// then default 
    
                // here the out function  on context of ....  . or put in global excel ?
                // out:out,// askdin function 
                // {{#values.loopDir[akey=colazione_dyn].out}}$$param&template to render on function out with param param {{/...out}}
    
                //, goon:true;
    
        },
    
       
    
        med_data:// will be used by onChange as db rows as array of string 
                    /* row : 0 id
          1 value/nome
          2 patt
          3 descr in testa , il default, breve 
          4 data news , marketing
          5 loc / tipo medicazione-medicina-pastiglia-medicazione-iniezione / mattina-sera ... in sostanza un where field !         
          6 menu (wh = menu o che ....)
          7 news avvertenze medico
          // 
          8 where/dove  come fare a raggiungerlo
          9 how come prenotare/chiamarlo/....   e' vario !
          10 when from : arertura 
          11 when to  chiusura
          12 voicename
            13 the group belonging to :col/res,,,,, the group type medicine : future articulation of view results , potrebbe essere pranzo cena  o pills medicamento ....
               todo 
            14 : patt :duplicated , see 2
            15: spare
            16:time2 from
            17:time2 to
        18: det dettaglio in master long (instead of 3 )
        19 :det  dettaglio in item  , long (instead of 3 )
    
          // specific bl transaction fields 
          20 true/false   taken/missing : get join with user med with status get/miss: 0/1
          21 ....
          22 ....
          23 ...
          24 ---
          25 inputdata1
  
    
    
    
    
    
    
    
    
    */
   /*
            [
                [11,'aspirina','aspirina','aspirina descr ','data','credenza 1','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo la compressa in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
                [22,'cumadin','cuma|coum','cumadin descr','oggi branch gratis alle 11 ','credenza 2','prima pasti ','se salti non riprenderla','vai in credenza',' deglutendo la compressa intera con acqua','dopo i pasti ','10:00','cumadin','col',,,,,,,,false,,,,,''],
                [33,'prostamol','prost*','prostamol descr','data','credenza 1','prima pasti ','se salti non riprenderla','vai in credenza',' sciogliendo pastiglia acqua e bere ','prima pasti ','10:00','prostamol','rest',,,,,,,,true,,,,,''],
               ]
*/
/*
               [
                [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al ultimo piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','vai al piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','vai al secondo piano','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
                [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [5,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendi ascensore B presso la hall','09:00','10:00','ristorante  in giardino','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,'']
                
                ]
*/
// /*

               [
                [0,'terace','terrazza',' è splendido caffè con terrazza panoramica ','data','terrazza','pesce','eggs backon gratis','vai al ultimo  piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza','col',,,,,' è splendido caffè con terrazza panoramica e specializzato il breakfast all inglese',' è splendido caffè con terrazza panoramica, sempre aperto è specializzato per abbondanti breakfast all inglese',true,,,,,''],// 'col',,,,,,,,true,,,,,''],,true,,,,,''],// 'col',,,,,,,,true,,,,,''],
                [1,'hall','hall','è la sala principale del hotel','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall caffe','col',,,,,'è la sala principale del hotel , apre alle 7 ','è la sala principale del hotel , apre alle 7 e ha servizio di branch all americana',true,,,,,''],
                [2,'giardino','giardino','è immerso nel verde del giardino , aperto solo la sera ','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ','col',,,,,'è immerso nel verde del parco acquatico , con sale private , apre alle 20','è immerso nel verde del parco acquatico naturale, con tavoli riservati per una colazione appartata apre alle 20',true,,,,,''],
               // test withou then uncomment: [3,'terace','redisdes','red RTCSessionDescription','data','terrazza','pesce','eggs backon gratis','vaial piano','prendi ascensore A presso la hall  ','08:00','10:00','ristorante terrazza','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
               // test withou then uncomment: [4,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','recati presso la hall e prendi la sinistra','07:00','10:00','ristorante al piano terra','rest',,,,,'è splendido caffè con terrazza paoramica, sempre aperto specializzato il breakfast all inglese',,true,,,,,''],
                [5,'giardino','\\bgiard','è il ristorante esclusivo dello star  hotel, da su uno splendido giardino multipiano','data','piano 2','carne','veggs backon gratis',' esci in giardino e segui le indicazioni baia blu','prendi ascensore B presso la hall','09:00','10:00','ristorante  al giardino blu','rest',,,,,'è splendido ristorante con terrazza panoramica, aperto fino alle 24,  specializzato sul rosbeef all inglese','è splendido ristorante con terrazza panoramica, aperto fino alle 24,  specializzato sul rosbeef all inglese',true,,,,,''],
                [6,'da toni','toni','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','prendi la strada per pescaropoli e al terzo kilometro gira verso il capanno','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''],
                [7,'da genio','genio','locanda abruzzese','oggi mozzarella in carrozza ','a vergate, 10 km','cucina umbra','','prendi la strada per udine e al terzo kilometro gira verso l\'oasi terre nere','prima rotonda e prendi la sinistra','07:00','10:00','ristorante convenzionato tipicità locali','ext',,,,,'è splendido locale raffinato con terrazza panoramica, sempre aperto',,true,,,,,''] 

               ]

// */
        ,
        data:// will be used by onChange as db rows as array of string if we try to manage a restaurant . all procedure to select are the same, changes only the selection data and answere view 
        /* row : 0 id
    1 value/nome
    2 patt
    3 descr
    4 data
    5 loc
    6 menu
    7 news
    // 
    8 where
    9 how
    10 when from
    11 when to 
    12 voicename
    */
   // DO NOT USE :
    [
    [0,'terace','redisdes','red RTCSessionDescription','data','piano 1','pesce','eggs backon gratis','vaial piano','prendendo l ascensore A presso la hall  ','08:00','10:00','caffe terrazza'],
    [1,'hall','redisdes','red RTCSessionDescription','oggi branch gratis alle 11 ','piano terra','colazione all\'inglese','eggs backon gratis','vaial piano','dalla  hall prendendo il corridoio a sinistra','07:00','10:00','hall al piano terra'],
    [2,'giardino','redisdes','red RTCSessionDescription','data','piano 2','carne','veggs backon gratis','vaial piano','prendendo l ascensore B presso la hall','09:00','10:00','colazione in giardino presso il garden breakfast ']
    ]
    ,
    Gdata:// will be used by onChange as group feature so we can customize the view of the general entity instance in data 
    /* row : 0 id
    1 value/nome
    2 best prompt per cominciare a rispondere al main desire
    3 calce : the general descriptor for the service to put on general view . is the same of wh field on specific resouce ( come in lavanderia1 )
    4 defIndex : the index of resource data that is the std item x the specific service
    
    5 voicename vgroup
    6 wh available for the service (to prompt in altro)
    7 suggested next service to query 
    8 ?
    
    */
   /*
    [
    [0,'col','ecco lelenco dei farmaci che ci risulta devi ancora assumere ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,' farmaci','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite'],
    [1,'rest','il tuo programma prevede di applicare i seguenti medicamenti','avverti l operatore se hai difficolta  ',1,'medicamenti','  quando fare la medicazione e come ',' ciao , portineria e taxi'],
    [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
    [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
    ]*/
/*
    [
        [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria '],
        [1,'rest','cucina internazionale','calcei',1,'ristorante','  quando è aperto e come arrivarci',' colazione , portineria e taxi'],
        [2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        [3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi'],
        ]
*/



/* 072020 last mapping :
    mydyn.param.group.name=gr[1];// just interna value , should be pills
    mydyn.param.group.vname=gr[5];// pastiglie
    mydyn.param.group.best=gr[2]; // master : presentazione  lista in master in assenza di richieste mod_wh
    mydyn.param.group.calce=gr[3];//class common detail item: avvertenze per medicine particolari o intolleranze generiche relative alla lista user e pills , dynamic !
    mydyn.param.group.what=gr[6];// ?? prompt per ulteriori detail di aiuto all'assunzioine, come lista o come specifico di una pill ??
    mydyn.param.group.nextserv=gr[7];??
    mydyn.param.group.promtAfterList=gr[8];// the closing prompt for master to goon with the list . if exists will override the std  x all group in template



    // obsolete if( mydyn.param.group.sel)mydyn.param.group.isdef=true;else mydyn.param.group.isdef=false;// seems ok , ? to do 
    mydyn.param.group.vgroup=gr[5];
*/
    [
// non va se inserisco {{some var}}        [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per prenotare o avere più dettagli  .  o chiedere altre informazioni sul servizio {{vars.askmatches.dyn_medicine.param.group.vname}}ad esempio dove, come arrivare o quando apre'],
// ind,name,prelist,                                        item detail                                                                                                                     def item index, vname,                                       
// [id,name,best,                                           calce,                                                                                                                          def,vname,          what,                               nextserv,                   promtAfterList]

//[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta per prenotare o avere più dettagli  .  o chiedere altre informazioni sui servizi colazione, ad esempio dove, come arrivare o quando apre'], 
// [0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta  o chiedere  informazioni sulla location o sugli orari di apertura'],
[0,'col','serviamo colazioni con prodotti freschissimi ',' Per intolleranze segnalarlo in reception. La colazione viene servita anche in camera come servizio extra che puoi chiedere ora. ',1,'colazione ','  quando è aperto e come arrivarci',' ristorante o portineria ','puoi scegliere una proposta   o chiedere  informazioni di dettaglio sulla location o sugli orari di apertura'],
[1,'rest',' tutti i ristoranti sono attentissimi alla qualità dei prodotti ','Per intolleranze segnalarlo in reception. ',1,'ristoranti', '  quando è aperto e come arrivarci ',' ciao , portineria e taxi','puoi scegliere una proposta .  o chiedere  informazioni di dettaglio sulla location o sugli orari di apertura'],
[2,'portineria','full service','calcei',1,'portineria','  quando è aperto e come arrivarci',' ristorante , portineria e taxi',''],
[3,'lavanderia','servizio 24 ore','calcei',1,'servizio di lavanderia','  quando è aperto e come arrivarci',' ristorante , portineria e taxi',''],
        ]



    ,
        onChange_text:null,//testFunc.toString,// without async !!
    
    
            // >>>> insert here onchange as a module of this obj so can see the fields !
        onChange:null//function(new_value, convo, bot,script,ask){return dyn_medi_f.call(this,new_value, convo, bot,script,ask) ;    }
    
    }
    }// ends direc all dyn cb and bl 
    },// ends _opportunity

    _book_simple0: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 

            opp:{vname:'facile prenotare ',
                opp:'servizi alla persona',
                news:' abbiamo una bella novità : ora è possibile usufruire dei nuovi servizi di igiene dentale <br>'
            },

            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
              mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
              notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
              ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
              notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
              ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },

            /*mod_location:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
            vlist:['barba','taglio capelli'],
            model:'barba-barba&capelli-\\bcapel|taglio',
             notMatPr:' il luogo preferito '//  model entity name used in nmList not matched list 
            },*/

            mod_location: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' la provincia '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'mod_aiax_prest'
            },

            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' la data e l orario preferito '//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple0
_book_simple:{
        
    opp:'servizi di parrucchiere ',
vname:' sempre belli ',

news:'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli' ,
most:' i servizi più richiesti sono taglio , piega e lavaggio ',
excel:{// 



    mod_date_des:{// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
    notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
    ,mod_wh_Of:'book_res_child'
},
book_res_child:{
notMatPr:' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

// not usefull , because is not put in wheres if dont match !
// ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

},
/*
mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
},
mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
},*/
mod_P_Serv:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
vlist:['barba','taglio capelli'],

// news : that is the declaration of model values and patten instead that do it in line on condition .
// : todo 
//   if a condition declare instead of :
//          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
//      :
//          $$mod_Serv::
//      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



// message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
//model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
// model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
// ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
model:'barba-barba&capelli-\\bcapel',

// or , a general declaration that is inflated in convenience structures vmatches,vlist,....
//      {bar:{
//          patt='ristorant*|pranzo|cena|trattoria',
//            ai_url='',
//            vname=''
//      },,}
notMatPr:' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
// vname:=notMatPr
},
mod_location:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
vlist:['barba','taglio capelli'],

model:'barba-barba&capelli-\\bcapel|taglio',

notMatPr:' il servizio parrucchiere , ad esempio barba, taglio capelli '//  model entity name used in nmList not matched list 

},
ask_prest_1102:{// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

notMatPr:' lo stile preferito'//  model entity name used in nmList not matched list 

},
mod_tipo:{vmatches:{cl:'classico',wa:'giovane'},// model specification , item voice name 
vlist:['classico','giovane'],

model:'cl-\bclas&wa-wave',

notMatPr:' lo stile desiderato '//  model entity name used in nmList not matched list 

}




},
direc:{

key_template:{// first step of a displaying view thread . no goon at first step  :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{
        goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
    }
}
}

},// ends of _book_simple
    _book_simple0_v2: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 

            opp:{vname:'facile prenotare ',
                opp:'servizi alla persona',
                news:'novità ora è possibile usufruire dei nuovi servizi di igiene dentale'
            },

            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
            mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
            notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },

            /*mod_location:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
            vlist:['barba','taglio capelli'],
            model:'barba-barba&capelli-\\bcapel|taglio',
            notMatPr:' il luogo preferito '//  model entity name used in nmList not matched list 
            },*/

            mod_location: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' la provincia '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'mod_aiax_prest'
            },

            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' la data e l orario preferito '//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple0_v2
    _book_simple0_v2_work: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 

            opp:{vname:'facile prenotare ',
                opp:'servizi alla persona',
                news:'novità ora è possibile usufruire dei nuovi servizi di igiene dentale'
            },

            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
            mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
            notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },

            /*mod_location:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
            vlist:['barba','taglio capelli'],
            model:'barba-barba&capelli-\\bcapel|taglio',
            notMatPr:' il luogo preferito '//  model entity name used in nmList not matched list 
            },*/

            mod_location: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' la provincia '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'mod_aiax_prest'
            },

            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' la data e l orario preferito '//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple0_v2
    _book_simple0_v2_parrucchieri: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 

            opp:{vname:'facile prenotare ',
                opp:'servizi alla persona',
                news:'novità ora è possibile usufruire dei nuovi servizi di igiene dentale'
            },

            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
            mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
            notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },

            /*mod_location:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
            vlist:['barba','taglio capelli'],
            model:'barba-barba&capelli-\\bcapel|taglio',
            notMatPr:' il luogo preferito '//  model entity name used in nmList not matched list 
            },*/

            mod_location: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' la provincia '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'mod_aiax_prest'
            },

            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' la data e l orario preferito '//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple0_v2
    _book_simple_v2: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 



            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
            mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
            notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },
            mod_location: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                model: 'barba-barba&capelli-\\bcapel|taglio',

                notMatPr: ' il servizio parrucchiere , ad esempio barba, taglio capelli '//  model entity name used in nmList not matched list 

            },
            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' lo stile preferito'//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple
    _book_simple_v2_work: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 



            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
            mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
            notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },
            mod_location: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                model: 'barba-barba&capelli-\\bcapel|taglio',

                notMatPr: ' il servizio parrucchiere , ad esempio barba, taglio capelli '//  model entity name used in nmList not matched list 

            },
            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' lo stile preferito'//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple
    _book_simple_v2_parrucchieri: {

        opp: 'servizi di parrucchiere ',
        vname: ' sempre belli ',

        news: 'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli',
        most: ' i servizi più richiesti sono taglio , piega e lavaggio ',
        excel: {// 



            mod_date_des: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'book_res_child'
            },
            book_res_child: {
                notMatPr: ' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

                // not usefull , because is not put in wheres if dont match !
                // ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

            },
            /*
            mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
            notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            },
            mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
            notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
            ,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            // prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
            // vname:=notMatPr
            schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
            },*/
            mod_P_Serv: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                // news : that is the declaration of model values and patten instead that do it in line on condition .
                // : todo 
                //   if a condition declare instead of :
                //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
                //      :
                //          $$mod_Serv::
                //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



                // message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
                //model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
                // ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
                model: 'barba-barba&capelli-\\bcapel',

                // or , a general declaration that is inflated in convenience structures vmatches,vlist,....
                //      {bar:{
                //          patt='ristorant*|pranzo|cena|trattoria',
                //            ai_url='',
                //            vname=''
                //      },,}
                notMatPr: ' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
                // vname:=notMatPr
            },
            mod_location: {
                vmatches: { barba: 'barba', capelli: 'taglio capelli' },// model specification , item voice name 
                vlist: ['barba', 'taglio capelli'],

                model: 'barba-barba&capelli-\\bcapel|taglio',

                notMatPr: ' il servizio parrucchiere , ad esempio barba, taglio capelli '//  model entity name used in nmList not matched list 

            },
            ask_prest_1102: {// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

                notMatPr: ' lo stile preferito'//  model entity name used in nmList not matched list 

            },
            mod_tipo: {
                vmatches: { cl: 'classico', wa: 'giovane' },// model specification , item voice name 
                vlist: ['classico', 'giovane'],

                model: 'cl-\bclas&wa-wave',

                notMatPr: ' lo stile desiderato '//  model entity name used in nmList not matched list 

            }




        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

    },// ends of _book_simple

_company_info:{
        
    opp:'servizi informativi aziendali ',
vname:' sempre belli ',

news:'questa settimana abbiamo aggiunto una bella novità da ora potrai avere anche il servizio barba e capelli' ,
most:' i servizi più richiesti sono taglio , piega e lavaggio ',
excel:{// 




    mod_azinfo_name:{// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
    notMatPr:' nome azienda  '//  model entity name used in nmList not matched list 
    ,mod_wh_Of:'mod_aiax_azienda'
},
mod_azinfo_prov:{// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
notMatPr:' la provincia '//  model entity name used in nmList not matched list 
,mod_wh_Of:'mod_aiax_azienda'
},





    mod_date_des:{// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
    notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
    ,mod_wh_Of:'book_res_child'
},
book_res_child:{
notMatPr:' the not match prompt of book_res_child   '//  model entity name used in nmList not matched list 

// not usefull , because is not put in wheres if dont match !
// ,mod_wh_Of:'book_res_child'// on itself : so add in wheres also its instance !!

},
/*
mod_mattsera:{vmatches:{'storico':'culturale'},// model specification , item voice name 
notMatPr:' il percorso preferito '//  model entity name used in nmList not matched list 
,mod_wh_Of:'dyn_medicine'// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
},
mod_loc:{vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
notMatPr:' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
,mod_wh_Of:'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
// prefChoich:' terrazza o hall' da usare come default quando supero un ask replay maxretry
// vname:=notMatPr
schemaurl:'location'// db data injected here but it is db rest service staff , is the name of the db schema 
},*/
mod_P_Serv:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
vlist:['barba','taglio capelli'],

// news : that is the declaration of model values and patten instead that do it in line on condition .
// : todo 
//   if a condition declare instead of :
//          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
//      :
//          $$mod_Serv::
//      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 



// message:"Invalid regular expression: /\b(?:risto|tratt|ester|vicin|fuori)\w*(?:s+[A/: Unterminated character class"
//model:'bar-\\bar&rest-\\bristorant|pranzo|cena|trattoria&port-\\bportin|recept&pisc-piscina&lav-lava*puli*&col-\\bcolaz|\\bbre&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
// model:'{>!}bar>\\bbar!rest>\\bristorant|pranzo|cena|trattoria!port>\\bportin|recept!pisc>piscin!lav>lava|pulizi!col>\\bcolaz|\\bbre!ext>\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
// ristVicino=twoWordNear('risto|tratt|ester|vicin|fuori','risto|tratt|ester|vicin|fuori',2)
model:'barba-barba&capelli-\\bcapel',

// or , a general declaration that is inflated in convenience structures vmatches,vlist,....
//      {bar:{
//          patt='ristorant*|pranzo|cena|trattoria',
//            ai_url='',
//            vname=''
//      },,}
notMatPr:' il servizio parrucchiere desiderato '//  model entity name used in nmList not matched list 
// vname:=notMatPr
},
mod_location:{vmatches:{barba:'barba',capelli:'taglio capelli'},// model specification , item voice name 
vlist:['barba','taglio capelli'],

model:'barba-barba&capelli-\\bcapel|taglio',

notMatPr:' il servizio parrucchiere , ad esempio barba, taglio capelli '//  model entity name used in nmList not matched list 

},
ask_prest_1102:{// no model ,that's are defined in line. just a not match prompt so can be checked in ask 0  and if no match ...$$miss&... will display it 

notMatPr:' lo stile preferito'//  model entity name used in nmList not matched list 

},
mod_tipo:{vmatches:{cl:'classico',wa:'giovane'},// model specification , item voice name 
vlist:['classico','giovane'],

model:'cl-\bclas&wa-wave',

notMatPr:' lo stile desiderato '//  model entity name used in nmList not matched list 

}




},
direc:{

key_template:{// first step of a displaying view thread . no goon at first step  :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{
        goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
    }
}

,ask_azinfo_name:{// first step of a displaying view thread . no goon at first step  :

    // put here also the static  dyn ask definition  AAA ?? yes

    loopDir:{
        goon2:false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
    }
}}

},// ends of _company_info 
cmd_template: {// REFERENCE . CMD TEMPLATE


        opp: 'affitti favolosi',
        vname: 'casa tua',

        news: 'oggi grande offera di abbonamento gratuito',

        excel: {// 



            mod_template: {// vmatches:{'piano 1':'piano 1','piano 2':'piano 2','piano terra':'piano terra'},// model specification , item voice name 
                notMatPr: ' dove sono ad esempio hall o terrazza   '//  model entity name used in nmList not matched list 
                , mod_wh_Of: 'dyn_rest',// will be used as where to query a dyn_key, so dont put in notmatched prompt list if we already had the dyn_key matched 
            },


        },
        direc: {

            key_template: {// first step of a displaying view thread . no goon at first step  :

                // put here also the static  dyn ask definition  AAA ?? yes

                loopDir: {
                    goon2: false // use this, will do not do testing a goon message from previous thread ,normally  display step0 msg and wait for user answere
                }
            }
        }

}// ends of _cmd_template


}// ends OnCh_Register

for (x in OnCh_Register) {
    OnCh_Register[x].autoReg=true;// automatic registration of all onchange 
  } 




//module.exports =                            {hotel3pini_vox,hotel3pini,hotels,televita,museoAQ,star_hotel,star_desk,config};
module.exports =Object.assign(OnCh_Register,{hotel3pini_vox,hotel3pini,hotels,televita,museoAQ,star_hotel,config});// new : register in OnCh_Register