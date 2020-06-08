let hotel3pini_vox,hotel3pini,hotels,televita,museoAQ;



//  bank containing script directive with onChange x script/dynfield-key 
    // onChange is  bound to its dynJs[myscript] > contain scripts directive 
    // cms.before will insert :
    //  values.excel    >  dynJs[myscript_].excel
    //  values.loopDir  >
    //  values.matches  >    model matches ex :values.matches.color='red'
    //  values.askmatches  >    model matches ex :values.matches.color='red'

/*
dynJs={ascript:{ TO REVIEW  !!!
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
star_hotel={// REFERENCE . all var dyn added at containers values.excel/matches/askmatches of the convo room at defeult thread launch 

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
    
         mod_wh:{vmatches:{where:'dove',how:'come',when:'quando'},// model specification , item voice name 
            vlist:['dove ','come','quando'],//temporaneo , è duplicato di vmatches con different format !
             notMatPr:'le informazioni desiderate come  quando dove '//  model entity name used in nmList not matched list 
             // vname:=notMatPr
    },

    // a value model : get its valus by a group match in a regex ( now only result[1] is consifdered a valid value match )
    mod_bookhour:{vmatches:{value:''},//int value , when matched the value is the number got:vars.models.matches.modelname.vmatch vars.models.matches.modelname.match
    vlist:['ora prenotata'],//temporaneo , è duplicato di vmatches con different format ! // not value type
    model:'value-\\bpreno\\w*(?:\\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s+(\\d{0,2})\\s*',// nb  /  or  //   x- will go in vars.models.matches.modelname.match=x
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

    mod_Serv:{vmatches:{bar:'bar',rest:'ristoranti',port:'portineria',pisc:'piscina',lav:'lavanderia',col:'colazione'},// model specification , item voice name 
         vlist:['bar','ristoranti','portineria','piscina','lavanderia','colazione'],//temporaneo , è duplicato di vmatches con different format !
    // news : that is the declaration of model values and patten instead that do it in line on condition .
    // : todo 
    //   if a condition declare instead of :
    //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast
    //      :
    //          $$mod_Serv::
    //      >> means that the value and pattern and vnames and vlist names and ... are declares as axcel attributes ! 
    model:'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast&ext-\\b(?:risto|tratt|ester|vicin|fuori)\\w*(?:\s+[A-Za-z][A-Za-z0-9]*){0,2}\\s(?:risto|tratt|ester|vicin|fuori)\\w*\\s*',
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
    };// ends star_hotel
    

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
            [11,'aspirina','aspirina','famosa testa di pietra con orecchie a sventola ','data','std_user','prima pasti ','se salti non riprenderla ','vai in credenza ',' sciogliendo la compressa in acqua ','prima dei pasti ','10:00','aspirina','col',,,,,,,,true,,,,,''],
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
[0,'col',' la sala dei busti funerari contiene 17 opere della arte funeraria romana. Si vuole rappresentare la arte funeraria che commemora i personaggi .......  ',' avverti l operatore se hai problemi collaterali, ultimamente l aspirina è da preferire sciolta prima di ingiarla. ',1,'sala dei busti funerari e della arte funeraria romana','  quando prenderle o modalità di assunzione',' sezione medicamenti o servizio prenotazione visite','pippo','si è stimato che possano risalire al epoca tardo romana',' è esempio delle arti della cultura tardo rinacimentale  al termine del periodo di spendore'],
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
};// ends musei


module.exports ={hotel3pini_vox,hotel3pini,hotels,televita,museoAQ,star_hotel};
