let fwCb,dynJs;
qs=require("qs");
module.exports =
function DynServHelperConstr(fwHelpers,fwCb_,db_,rest_,dynJs_){// db & http manager , receives from user cfg the managers, add refernce od aiv3 and refIplementation beginning a inner of them.  an object to new   returning FwHelpers :a obj with methods 

    /*

    returns
    refImplementation={
    onChange_dynField(entSchema,text_,wheres,idspace,isDb_Aiax) interface to db manager engine to query entities with join relatations (in entSchemas ) and id/keys 
                                                                the db manager ,recovering schema+url (in model.js) , can request a query to a db server
    rest__: async function (entity, uri, params, method, outmap, limit) {// not used now,
    run_jrest: async function (uri,formObj, method) returns the object if run_rest returns a json
    run_rest: async function (uri,formObj, method) general rest interface
    dynMatch:async function((url,)entity,text=searchterm,wheres,isDb_Aiax,cb) // put in a sort of interface TO complete in setSetvice of fwCb , or a default matcher template to custom in fwCb.asks/model
                                                    interface to rest engine to query entities with minimum relation expressed by general properties ( terms + where )
                                                                                                        ( url and where entity mapping can be recovered in model.js )

                                                    customization (put in fwCb) can interface a data service adapter:
                                                        - interfacing to db engine using onChange_dynField (internal db adapter) or similar interface 
                                                        - a proper rest param invocation interfacing rest like adapter data service
     
    }

    */

    // aiv3=vctl=onchange.js

// 062020 

// this constructor build the new obj starting from this , assigning from many obj properties ( adds all their properties ):
// so will return the object this = {db.http.properties of aiv3, of refimplementation }



    //09092019 put in aiv3, 
    // warning here we extend the calling this with refImplementation (aiv3 aswe call aiv3.DynServHelperConstr() )
    //  DynServHelperConstr and refImplementation can be put in a separate module 
    
        // THIS helper staff can be put in a module . user can use/change  the implementation according its needs 
    
        //onChange_dynField: helps preparing the rest/db call starting with its param
        // rest : a reference rest caller using a http compatible with 
    
        // like botkit function but here we create :
        //      - a object with manu functions  working in the closure ! 
        //         - not a simple function inside the closure
        // like a object factory function(closure) that return or pass a ref cb of a function working on the closure
        /* create an object supportinf std func to do  db query or a rest to get a param or a voiice dyn query on a entity space
        */
    
        //this.db = db_; this.http = http_;
    
        // Object.assign(this,aiv3,refImplementation);// this=DynServHelperConstr,  user can modify this example
        // Object.assign(this,aiv3,refImplementation);// not add aiv3 staff 
        let services=Object.assign(fwHelpers,refImplementation);// not add aiv3 staff 

        services.db = db_;// A FIXED UNIQUE  DB CONNECTION GOT in bot.js
         services.rest = rest_;// ok ??
         fwCb=fwCb_,dynJs=dynJs_;// the models 
        // or
        // this.onChange_dynField=_onChange_dynField;this.rest=rest;
        return services;
    };
    
    var refImplementation = {//  fw api to do call to its db and http service to have convo.vars dyn_models/param loaded  
        /* BANALMENTE SI FA REST USANDO L'ENGINE    passato dallo user http
                        sostanzialmente si fa rest con url=host/mastertable qs con term (fts) e wherefield e schemaname e in genere con tutte le 
                    alri string /stringarray param che vengono banalmente infilati nella qs ( post data map)
                    eventualmente alcuni  campi speciali potranno essere inseriti in post data con formatting particolare ( es int32 x il array idspace !)

                se 
                - il schema,where ... non corrispondono ai db definition si puo aggiungere funzioni al rest che interfaccera un db in modo piu articolato
                        tali parametri verranno aggiunti non qui ( sostanzialmnte si gestisce il formatting dei dati post )
                            ma in genere in service o anche nello user space onchange , usando
                            direttive attinenti al livello dei dati ( potranno ancora essere in model.js nella struttura voice directive o una parallela)
                    passando i parametri necesssari alle operazioni che l'interfaccia rest al bd dovrà sobbarcarsi  :
                    es , mapping, entity mapping and relationship management 
                - inoltre il refinement del query previous puo essere scaricato sul rest interface pur di passare lo statu dei query precedenti 
                -inoltre si possono prevedere anche funzioni di mapping in uscita .....

        */

        onChange_dynField: // this function returns a Promise and do  use await  . so async function  OR function ? 
        async function 




            // ***************    look info to collect db server  :
            //  TODO >>>>>>>>>>>>>>>>>  add excel VISIBILITY x dbserver connections 
            //  BUT in this implementation we have only 1 connection got in bot.js !!!!!






                            
           // old                  (req, isDb_Aiax, schema_url, sess_clone, sess_dyn, paramList, prefill, map, afterallDyncalc) // a inner of main ctl code, req has different  std ctl chain format !
    
    
                            (entSchema,text_,wheres,idspace,isDb_Aiax)// also entity ??, temporarely set schemaname = entityname
                                // idspace can be put in entSchema[0].idspace

{   // returns a promise that resolved with resval=p.then((x)-> return x) // resval=x is :
    // db adapter : resval={rows,reason}  rows is a [] of extension of a literal obj with the properties of the collection rows , result =err/runned
    // aiax : just the rows is a [] of literal obj properties 
    //   with/without _id !
                                

            /* >>>>>  12072020 Summary *********************

            onChange_dynField is a service managed by a local function (or a remote service called with a json post) that do rest call on a master entity/tab/collection
                with the capability to do where on its col or join with some 1:n or n:m related entity
                adding the previous story (previous values) if the refinement is a multiturn process ( the previous idspace can be used instead of doing the where )
                so can be seen as a specialized entity framework 
                semplificando , senza specificare entShema[1,...n] e wheres,  diventa un servizio rest sulla risorsa master entity , i parametri diventano in pratica :
                    (textxfind/match/search,resourcename) cioe' un post a url/resourcename e qs=text
            onChange_dynField : is the service implemented as local service. for a remote service you could just wrap all param in a json and use the rest service to send to 
                                        the service using following  rest funcion : rest(url,'post',data=json((textxfind/match/search,resourcename)))
                                >>> see the implementation actually used in following rest function :rest: async function rest_(entity, uri, params, method, outmap, limit) .....
                

                PARAMS:

                isDb_Aiax : true :implemente rest-db support here      
                            false , just insert in a std post to do rest 



                entSchema[] : name to gey the db reference (schema) to query the collections
                                we set this way :
                                entSchema[0]= {name:schemaname of master dyn that is usually entity name ,n_m:0}mandatory master entity
                                entSchema[1]= {name:schemaname of first relation ,n_m:1/2,prevId:3,prevVal:'rome',id,val,refCol}
                                        - n_m: is the join type 1:1_n,2:n_m 
                                        - id (if known) the id of the where clause item
                                        - val , required if id is null , the where item value 
                                        - refCol is the name of col in master schema that contain the ext key (or keys) of the related entity
                                        se avessimo un entity framework tali info si potrebbero desumere dalle info contenute negli schema 
                                            ad oggi usiamo info di configurazione del db che lo user inserisci assieme in qualche file di config ( assieme alle direttive voice del entity che fa da where: excel....)
                                entSchema[2]=......
                                    if val and id are not present we can try where them eventually 
                                    if current id are the same as past we can just do text/term/fts match on idspace
                                    if current id are different then previous we should discard idspace and do the full where query and new text match
                                            ( restart matching !) 
                                    if thre is current id and no previous id in one where/join entity 
                                        we can just do the where on these and work on previous idspace instead of requery also all other where
                                            in pratica il previous idspace e' buono lo restringo con un nuovo where + altro giro di text match 

                                > in future the relations  will be identified and got inspecting the schemas 


                quasi lo stesso per i where su column senza  external key ( non join ) :

                wheres: [{name:tabname,val:value,prevVal:'rome'},,,] where clause ( no join)
                                    if current id are the same as previous we can just do text/term/fts match on idspace
                                    if current id are different then previous in one tabname
                                        we should discard idspace and do the full where query and new text match
                                                ( restart matching !) 
                                    if thre is current id and no previous id in one where/join entity 
                                        we can just do the where on these and work on previous idspace instead of requery also all other where
                                            in pratica il previous idspace e' buono lo restringo con un nuovo where + altro giro di text match 



                nb , se non voglio tenere memoria dei previous query uso lo stessa logica ma applico tutte le where condition correnti
                        sia in wheres che in entSchema




                all  other params are mostlty string properties to insert in post data as json ( qs json) 
                see onchange     fwCb.askS.dynMatch=async function(tomatch,entity,excel,varmatches)
                    to see how the param is calculated mainly from :
                        varmatches =vars.matchers, the convo + user status of all matches in convo. 
                            nb in getmatched we  use mainly the vars.matches x the entity 
                                         ( see the dyn entity matches constructor MatchSt())
                                    and its where or related dependenings, 
                                    to extract the onChange_dynField generic query params




                RETURNS     ( x details see runquery())
                - a promise that fullfilled call a function res: promise.then(res,rej) res called with  1 param: {rows,reason}.

                        >> so res=await service.onChange_dynField will return res={rows,reason}

                    - reason give 'err' or 'runned'
                    - rows is array that is field map of a master db projection deoending by qs.inter and qs.full 
                            if !full 
                                if paramList : the rows are filtered on where field (view or bl fields) according to  paramList map 
                                if qs.join_1_m or qs.join_n_m   the rows are joined the rel ref  with id of join_x_m row  selected on col match wherex=value = current join_x_m match (look in Match_Param[join_x_m].match)
                                if qs.term  findClause={patt: regex=new RegExp(term, 'i')}, if qs.regex  findClause={patt: regex)}
                            nb  is  the same rows format served in page and aiax ctl of project vuiengine_v2
    
                - null if cant do its job of the query is null
    
    
    
                > so the calling ctl in ctl chain must set the dyn status vars.matches[entity] ....  from the received resolved value {rows,reason} (see res={}):
                reason  err > rows=  error message     
                        runned > rows = db cursor array 
                          
                        still to implement / check :
                        json > rows= a json map of master field query rows 
                        byte > rows= array of coded numbers    
 


              
            */
    
            // DETAILS  ( To review) : 
            //          ...........................
            //  caller to set paramList will   uses session.Match_Param to set paramList (wheres) map with values=matches got  in previous steps/turns (no join just where on specific col)
            //      nb : dont setany value in  session.Match_Param for dyn askey 
            // TODO  we can add also user text req.msg to do a fts too in db, now only where join query on paramlist but with a IN clause if a idspace=prefill is specified 
            // prefill is not void if previously turn fts on dyn algo selected a id space from where to do refining 
            //      a prefill if effective only id have dimension <20 (tobe checked before call this)
            //      otherwise the previous fts is not good, and we goon from a query on full space  with only where join  then a new fts will will try to match 
            //var dialog = this.getDialog();
            // we have alredy 
    
    
    


            
    
            /* >>>>>    onChange_dynField()  122019 management SUMMARY 
    
            using a db connection do 
            - query on mongoose schemas using db 
            OR   
            - relay by a GET/POST AIAX (TO DO ) using PARAM SET .( in post ctl  url will refears to  local db schema ( url comes from  dialog.dynamic[].schema_url) ) 
    
            * db case : cols : 
                dyn voice fields  { "patt": 1,"value": 1,"descr": 1,"data": 1 } ( patt is pattern, value is the entity (voice/gui) name )
                + its bl fields on db table/collection

                
            To review : 

             PHASE 0
                 Recover matched values and set a where map to query : qs=wm={where0:value,where1:value2}

    // ******** reviewing 072020

             PHASE 1 
                 preset the  query on master field : choosing fields/cols to get ( from full and inter) and the search term on what fts field to serch (patt) 
        
                            see https://mongoosejs.com/docs/queries.html
    
                         dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >  query=mymodel.find({patt: regex=new RegExp(term, 'i'),col_served= {'_id':0,'patt': 1,'descr':1 }})
    
                         findClouse={},selClouse={}
                         if term  findClause={patt: regex=new RegExp(term, 'i')}
                         if regex  findClause={patt: regex)}
                        col_served :
                        gui :  selClouse={'_id':0,'patt': 1,'descr':1 }  , if term  findClause={patt: regex=new RegExp(term, 'i')}
                        deb :   nothig to do , serving all cols + '_id'
                        vui :   full:   selClouse={ "patt": 1,"value": 1,"descr": 1,"data": 1 } ( comprende  + 'id')
                                else :  chain with .distinct('_id') too , query=mymodel.find(findClouse,selClouse);
                        bl  : return a row (or get rows[0]) with business field to consume x bl, no join  just paraList (usually :{value:'amatch'} or {id:'anumber'})
    
    
    
    
             PHASE 2
                  add where in voice field{ "patt": 1,"value": 1,"descr": 1,"data": 1 }; or bl fields   
                             for promise modesee https://stackoverflow.com/questions/33645570/nested-query-with-mongoose
                             : https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
                             : http://mongoosejs.com/docs/queries.html
    
                    query.select(['patt', 'data']);
                      OR (??????????)
                    query=query.where(wm)            
    
             PHASE 3  
                    add join clause if there is specified join_1_m and join_n_m , then run queries  
    
                             query the main dynfield1 using a 
                                - where clause on wherefield ( usually on 'patt' and some bl fields )
                                AND 
                                - join by id on ref_1_m , recovered by dynfield1 schema, 
                                   on the id of  match (value=Match_Param[join_...].match) of related table join_1_m and join_n_m 
    
                       nb TODO : join on join_n_m  
    
             EXAMPLE : 
                                                dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >
                                                >  query=mymodel.find({patt: regex=new RegExp(term, 'i'), {'_id':0,'patt': 1,'descr':1 }}) >
                                                > query=query.where(wm)     
                                                 ...... match on join table getting mycity._id
                                                >  query.where(ref_1_m).equals(mycity._id);   
         

             SQLITE DB with MATCH case to do FTS  
                TODO : use the same schema , just change the case formatting using functions 
    
                                                
             FTS COMMENT 
                if want to do fts match on db you cam map a query case using  ( qs.term is used for simple entity query for get bl fields ) qs.term1/fts  param that will set a fts case on db (TODO)
                or
                receiving the returns  we can do FTS qea locally using a duplicated ( id,patt,value ) db or obj structure 
                         training must be done on  patt field  or in some section of a partitioned wherejoin param  space (x less common where values)
                     example partition the training set in 10 parts each covering a where space segment
                     after qea result do a join with the where in the section to get the final qea list 
                     or do a fts whith match and where join then ?
                    
    



            */

            let dynfield1, // = askey;// var ?
    
            /* old :

            let term,regex_,fts,// term is a param reserved for col 'patt' (the master fts col ) , fts : match fts clause data
            full,inter; // vui gui gui+ ossia solo id o id+fields: define the result row column
            */
    
    // added 25012020 >


        join,
        is_n_m,
        schema_url,
        regex,// what is this ? , should be a template to create regex !
        full,inter,
        fts,
        matchWhere// in future we can calc match in this retry turn , but usually  must be done in previous field msg with collect match
        //  map, ......
        ;//  qs eredited from dynamic[field]: , se X2

    /* old func , now useless : 

    function getMatch(field) {// returns 
        if(matches[field]&&matches[field].match)return matches[field].match;
        else return null;
             
         }
         // 

    
    
     
    qeAdata= { // to review : ipotesi di matching status x the dyn master
        consW=[],// consolidated where matched = prevW||newW
        prevW=[],// prev where matched = prevW||newW
        newW=[],// prev where matched = prevW||newW
        matched=[
            [copyofMatch_Param[where[0]].match , itsId_ifisRef[0]]
                  ,,,,
            ],// copy of mathcher + id if , to join , we use ref in schema 
        curRows=[],// current query result on consW ( + fts)
    
    
     } 
    //      
    
    function initWC(len) { // init qeAdata data
    if(!prevW)
         { 
        prevW=(new Array(where.length)).fill(false);
        newW=(new Array(where.length)).fill(false);// or just clone, which is fast ?
        consW=(new Array(where.length)).fill(false);
        matched=new Array(where.length);
    
         }
     }
    
    function getMatch(i) { // can be a static or dyn 
    // return the match of ask field join[i] that is related to present dyn field
    //	- the cur match value 
    //	or , if  is a join field , isRef=[i] ,  
    //	- [match,id]
    
         let field=join[i],id,value; 
        if(matches[field].match){// it matched on previous step (that cant retry !!) (see the AKU case) on this turn (but after last turn that set prevW[i])
                                // >>> so usually the matcher is lauched directly here in this dyn field without a step that collect/match that dyn!!  with matchProc(i) 
            if(matches[field].qeAdata&&matches[field].qeAdata.matched){return matches[field].qeAdata.matched; }// unusual : a join[i] loop dyn step  that probably calc also id , so pass it
            else return matches[field].match;
        }else return null;
    
     }

     */

     async function singleTurnGenM(i) { // now is useless because for simple query to a sigle resource use anyway the 
         //  is a single turn matcher of param i ( i=1 or 2). just term , no where cluse 
        // Relay to dyn field matcher : relay to a db or rest service. In future also to a static matcher 
        // can be a static or dynamic declared field that we. match in this dyn step calling directly a matcher without insert the field in a specific step
    
    // specify if , in case of a db model ,  it returns a value or [id,value] ..........
    
    // 20012020 . simple 1 turn dyn db matcher , filosofia : smp=matcher(req) 
    //  this matcher run as join field ,( name join[i]), ( field related with main dynfield)  partial matcher inside the main dyn (onChange) loop matcher
    // as a matcher,singleTurnGenM,  will fill (the minimum) its Match_Param[join[i]] but without a loop status qeAdata (because is a single turn matcher)
    //  because the loop status is mantained on the main Match_Param[thisdynfield] ( as thisdynfield=mainfield is a multiturn dyn with related field)
    //  so can match 
    //  - a static field using regex or 
    //  - match a dyn using a schema with a regex on term=this user speech ( no loop to refine just match 
    //      ( also a array so many values matched( ctl could choose one ) , but usually just a single match ) or not )
    
    
    
    // return smp , really a dyn smp with smp.matched:[id,value], can be a matrix ? anyway in matches (complete=match) .match must point to first best value
    


    let field=join[i],id,value; 
    let qs=dialog.dynamic[field];
    if(qs)
        return dodyn(qs);// a matcher for dynfield
    else {
        qs=dialog.static[field];// a matcher for static field
        if(qs)return dostatic(qs);    else return null;
    }
    
    async function dodyn(qs){// dyn field matcher : relay to a db or rest service
        // rename http_db_rest(qs) , really do a single turn dyn selection in a unrelated dyn or in a related dyn join to prepare the join in the master dyn
        // try to use the same param as in httpservice , just leave out any field pointing to related entities 
    
        if(qs.isHttpRest_mongo) 
        // qs clone with only the single entity query without the related staff 
            return http_db(qs);// question : why dont use domatch() ??
        // else ;//return http_rest_relay(qs);
        return null;
    }
    


    async function   http_db(qs){
                                // used by dodyn only ?
                                // can be also the wrapper/relay  for any pattern selection ( like db/fts,qea algo ? )
                                // this will fill the Match_patt of the related field in session so 
                                // this is a base matcher , not a onchange matcher that mast start a ctl chain to do bl and routings 
                                // > add in qs some policy/filter/order directive to let algo some flexibility in doing its staff 
                                //          like fts db match algo in ve ??
    
                                // qs will have only the  entity staff part ( the query do not have join field, just term matching patterns) 
    let {msg,
        wheres_jRef,
        isRef,
        join,
        is_n_m,
        schema_url,
        regex,
        full,inter,
        fts,
        isHttpRest_mongo,
        matchWhere// calc match in this retry turn , otherwise must be done in a previous  msg and registerd as a model  math
        //  map, ......
        }=qs;//  qs eredited from dynamic[field]: , se X2
        let term=text=msg.text;
        if(!db||schema_url)return null;
        let model0=db.model(schema_url);
    
        if(!model0) return null;
    // ....
    // from .... try to use with a promise :
    
    
                                // 20012020 
                                
                                
                                console.log('setting the where clause on tab model ',model0,' (',join_1_m,
                                        ')but  not found a previous city_lastValue so go on to find the id of a record with a value= where0   ' , where0);
                                     // var queryc=model0.findOne({"value":where0},{_id: 1 });// returns a objectid or a string ? 
            
                                    // lower case search : performance issue ???
                                     //var queryc=model0.findOne({"value":"/^"+where0+"$/i"},{"value": 1 });// returning just value col { $search: thename } 
                                    // i = no capital 
    
    
                                    var queryc;
    
    
                    // >>>>>>>>><<  following just in case we lost id and have only value . but recently dyn smp will ever put results in :
                                    //              match ( values only ) + matched=[id,value]
                                    termj; // term , not where0
                                     queryc=model0.findOne({"value":{'$regex': where0,$options:'i'}},{"value": 1 });// returning just value col { $search: thename } 
     
     
     
    // >>>>>> or if where0 was not matched before directly try to match using present speech (term) 
    // 
    let regex_;
    if(term)regex_= new RegExp(term, 'i');// todo : use as template regex  : else if(regex_)regex=regex_;else regex=null;//  RegExp('searchel', 'i');
    
      
    
                                    queryc=model0.findOne({patt: regex_}, { 'fullname': 1 });
     
     
                                     //var queryc=model0.find({},{"value": 1 });// returning just value col
                                    queryc.exec(   // get the the city entity  to join fron the city.value=where0 
                                        function(err,mycity) {// return a octal _id?
                                        // IF SYNC we can use all nesting function var as unchanged ( like final ) 
                                        // Create a new ObjectID	var objectId = new ObjectID();
                                        // Verify that the hex string is 24 characters long		assert.equal(24, objectId.toHexString().length);
                                                  if (!err) {	console.log(' 1: queryc returned results , expected record with where0 : ',where0,' ,are : ',mycity);
                                                    //,' is objectid ',assert.equal(24, mycity.toHexString().length));
                                                    if(mycity){city_lastObjkey=mycity._id;
                                                        console.log('1.1 set a where cond for field ',ref_1_m, ' , value ',city_lastObjkey,' where is ',query.where);
                                                        query.where(ref_1_m).equals(mycity._id);// add to query : a where/join clause  _id=city_lastObjkey
            
                                                        exec(query);// exec async > calls exec function
                                                    }else {	res.send('find no restaurant based on city :'+where0);// return no result 
                                                        console.log('1.2 get here only if query do not return result ');
                                                    }
                                                    console.log(' 2 , ');
                                            }else         	 res.send(JSON.stringify(err), { 'Content-Type': 'application/json'}, 404);
                                    });
    
    
    
    
    
    
    
    
    
    // ....
    
    
        }
    
        async function dostatic(){return null;}
     }// ends singleTurnGenM()



     let wm;// the  master where clouse map ( x no join where ). 

            async function doMatch(matc, isJoin, i) { // domatch()  . 
                /* 082020 a master  entSchema[0] query where/join  helper setting
                 > complete the (not jet set)  closure/outer master entity ( entSchema[0] )  and wheres[] obj 
                  setting params  ( entSchema[0].id and wm[i]) needed to build the query on master entity entSchema[0] :
                    - join entity instance data : the entSchema[i>0] .val and .id and 
                    - where data : wm[] containing just the value tuo match in this col/field 


                 param :
                        remember :
                                entSchema[i>0]= {name:schemaname of first relation ,n_m:1/2,prevId:3,prevVal:'rome',id,val,refCol}

                                wheres[i]: {name:tabname,val:value,prevVal:'rome'}  is where clause ( no join)


                  matc : the relation query clouses to  complete : 
                    if isJoin : entSchema[p], p>0 or 
                    if !isJoin : wheres[i]

                 important closure param :
                     match 

                 

                 >>> if isJoin clause try to set id  :
                        will try to get the entSchema[i>0].id from (already calculated matched val or
                            if mJoinText try to match (id/val)the join entity against the current text and set the id
                            set flag doJoinWhere if the current val is different fron previous prevVal
                                                  so will decede if run the where clouse on master query ( setting matc.id and matc.val )
                                                ( if val = prevVal can be enough to take the idspace instead to requery the where condition)
                        exit setting id/val to use as where clause in master query

                 >>> if !isJoin clause   :
                            set wm  
                            set flag doJoinWhere if the current val is different fron previous prevVal

                */



                // old :   matc.do = false;// or true , depend on policy if try to rematch the where entities
                // if false just take the current val or  the previous val 


                // TODO: exclude if previous query was done on same val (curVal=val)so we take good the previous  idspace 



                if (!isJoin) {//is not Join so matc is  wheres[i]
                    // fills wm: the  master entity (entSchema[0]) where map 
                    let aw = {}; aw[matc.name] = matc.val;
                    //                     if (!match.prevVal || matc.val != match.prevVal) doJoinWhere = true;// so at least 1 where/join changed val from previous > discard idspace and do all join/where
                    if (!matc.prevVal || matc.val != matc.prevVal) doJoinWhere = true;// so at least 1 where/join changed val from previous > discard idspace and do all join/where
                    wm.push(aw);
                } else {
                    //is Join so matc is entSchema[i>0]


                    //setfindvaldifferentfromprevious doJoinWhere  set policy mJoinText ( match join entity with text too)

                    if (!matc.id) {// l'istanza in relazione non si conosce ancora compiutamente ( non c'e cur id) , quindi cerco di trovare l'istanza ( cur id) 
                        //  facendo un match on current text matching  il pattern field  o se c'e' posso usare il previous matched id (previd)


                        if (!matc.val) {// l'istanza/item in relazione non e' nota nemmeno attraverso l'altra chiave ( cur name)
                            if (mJoinText) {// if val is set take that . can exist  a not join tab so can be  rematch ???

                                // old : let match = singleTurnGenM(i);

                                let esi = { name: matc.name, n_m: 0 };// the master to query is become now the join entity entSchema[i>0] with name matc.name
                                                                    // we will find the item that matches the text with item.patt
                                let es = []; es.push(esi);

                                // match the value ( no text pattern , just the item value , we need the id )
                                // run a query on the master entity es[0] with no join (es.length=1), and no where condition , just match the text ( a search pattern match)
                                let res = await runquery(text_, null, null, es, null).catch(console.error);// return a promise run query on es[0].name  to match a item field (patt)  using text (so we finfthe item and its  its id) 
                                // .catch .....
                                // extract 1 match from res
                                // TODO   *********************
                                /* remember that await a promise should be used as done in rest.js :
                                await  jrest("https://postman-echo.com/someendp',POST,{title: "Make a request with Node's http module"})
                                // .catch((err) => { console.error(err); });  or  .catch(console.error);
                                so the resolve will be called withsome params and the Promise object will call .then registered function with the same param 
                                now await will use a .then function  that just returns THE FIRST PARAM ??? as a result 
                                */




                                let match = res[0];// todo 

                                if (match && !(matc.prevVal && matc.prevVal == match.val)) {// found a differnt match theen previous 
                                    // TODO should also returned to update the matchers !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                    matc.val = match.val;
                                    matc.id = match.id;
                                } else {
                                    if (matc.prevVal) { matc.id = matc.prevId; matc.val = matc.prevVal; }

                                }

                            } else {
                                // take previous 
                                //  matc.id = matc.prevId; matc.val = matc.prevVal;
                                // or just consider no clause 
                                match.id = null;

                            }
                        } else {// use match.val 

                            let esi = { name: matc.name, n_m: 0 };// the master is now the join entity to query for the id from the value ( both are keys )
                            let es = []; es.push(esi);
                            // match the value ( no text pattern , just the item value , we need the id )
                            let res = await runquery(null, null, match.val, es, null);// run query on es[0] matching value field table for the id 
                            // extract 1 match from results 
                            match = res.something;// todo 
                            if (match && !(matc.prevVal && matc.prevVal == match.val)) {// found a differnt match theen previous 
                                // TODO should also returned to update the matchers !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                matc.val = match.val;
                                matc.id = match.id;
                            } else {
                                if (matc.prevVal) { matc.id = matc.prevId; matc.val = matc.prevVal; }
                            }
                        }

                    }
                    else {
                        // we have a current match matc.id so use it to set master query clouse (wm map)

                        if (matc.prevVal && matc.val != matc.prevVal) {// do the query becaquse was different then in past 
                            idspace = null;// reset unvalid previous set 

                        } else {// do not do  the query if we take good the previous idspace
                            matc.id = null;
                        }

                    }

                }



                /*
                if(!prevW)initWC( );// 
            
                if(!prevW[i]) { // in previous turn join[i] were not already matched so 
                                // - this is the first main turn trying to match main dyn or 
                                // - there was a new main loop with a prompt that suggest also to  match with  join[i]
                                // the where  join[i] match can be controlled by a step with its controller managing the match detail after a std matcher 
                                // but it cant interrupt the main loop (with a vector), unless i manage the call back from the child resolver into the main loop 
         
                                
        
        
        
        
                    let theM;// will be 'amatchval' or [id,value]
        
        
                    if(theM=getMatch(where[field])) { // getMatch : return null, or the match found on this turn  : string or array
                        newW[i]=true;
                        matched[i]=theM;
            
                     }else{ // in this turn I can have no  specific step matcher in main loop (onChange matcher of join[i] step )run or calculed any match 
                            // so I can call the where matcher from this main dyn matcher , if config allowed
                            // here we can use matchProc() that as step matcher called in onchange() fill a Match_Param[] but inside and controlled by this main loop dyn matcher
                            let matchProc=singleTurnGenM;// ok ??
                            if(matchWhere){theM=matchProc(i);// a matching procedure that launch join[i] matchers returning a match value  , but if this  join[i] is dyn 
                                                        //  and isRef[i] we know the this master will use id to join , so the join[i]  must return the id too
                                                        // if join[i]  will not return id this master dyn must calc id from the join[i] match value !!
                                        if(theM){ 
                                            newW[i]=true;
                                            matched[i]=theM;
                                        }else newW[i]=false;
            
                         }else{
                            newW[i]=false;
                         }
                     }// end getMatch 
        
                     */

            }// ends domatch()  . 
    
    
    
    
    
           // old  if(qs){term=qs.term,regex_=qs.regex;full=qs.full,inter=qs.int;join_1_m=qs.join_1_m,join_n_m=qs._join_n_m,ref_1_m=qs.ref_1_m,ref_n_m=qs.ref_n_m,fts=qs.fts} // vui gui gui+ ossia solo id o id+fields
            
            var prefill = true;

            //if(paramList)
            // MAIN code STARTS HERE
                
                
                
                
        /*
                082020
         doJoinWhere=false : none of joins and wheres changed from previous values , 
            > so if the policy doany is false we mantain the previous idspace instead of run the join/wheres clause 
                and query only the master term/fts fields

         anyway take care that we can add join clause anly if the id is set correcly from above phase
        */

        let doany=true,// policy : if true never take idspace instead to rerun previous where/join clause set
        doJoinWhere=false,// if some where/join cur value is different from previuous doJoinWhere became true;
                            // will be used when we must decide to use previous partial matched set when 
                            //   after decided we need to relaunch the query because the last query was launche without all where / join relation extracted from the prrevious user speech turn,
                            //   relaunch the query with a new matching info
        mJoinText;// policy ( match join entity with text too, dont expect to be alredy matched in previous turn text (before this turn text)

             
                
                
                /* prepare to run query 
                - x joins :
                    run external key/related join  if the curent value is different of the previous
                        to load 
                    
                - where condition on master 
                    .....on where entity then on master entity


                */
                
                let p;

                for (p = 1; p < entSchema.length; p++) {// joins

                    if (entSchema[p].val) { };
                    await doMatch(entSchema[p], true);// true means  we want to complete a join request  not where 


                }
                wm = [];

                if(wheres)for (p = 0; p < wheres.length; p++) {// where condition on master 
                    //  if (!o.hasOwnProperty(p)) continue;       // Skip inherited properties

                    if (wheres[p].name && wheres[p].val) {// wheres[p]={name:tabname,val:value,prevVal:'rome'} 
                       await doMatch(wheres[p], false);// false means where not join 

                    }
                    else {
                        // invalid
                        wheres.name = null;

                    }
                }

                if(wm.length==0)wm=null;

                // if(paramList.length<mWhere)mWhere=paramList.length;

                /*  072020  : TODO 
                // join_1_m join_n_m :query on master column  that has a  relation with another collection in mongo . in this case the column is populated by obj ref 
                //  this is different from the case of where col containing just value name but must be managed by the server rest interface or here if the fw consolidate 
                //  also this db management lyer
                // that's the same for fts search with item(= user search)  
                // in altre parole il bot fw chiedera' di fare un match con fts/search sul master entity description (mix info not structured as relation ) e 
                //      chiederà anche dei (1-2) where  1-2 where field in named col
                //      magari where che possono a sua volta essere altre bot entity che saranno querabili con fts per cercare il match
                //  sarà problema del server che da il servizio rest organizzare il db in modo da fare query su tabelle formalizzate in join o no 
                //  nel caso in cui ci sia un refine il rest dovra anche gestire l'eventuale in set per piu rapido refining , sempre tenendo i dati del previous match 
                //      nel bot come session.dynmatches status ( le query request conterranno anche i previous id e values sia del master (idspace )che dei where field (id e value)) !
                // PER ORA gestiamo qui anche il rest interface e il db query cominciando senza refine 
                //  >> quindi e' il rest interface che deve trattare i where condition a seconda che siano  o no formalizzati come join (reference in mongo)
    
                // idee di base :
                - il server rest NON tiene mappa dei param in where0,1  e join_1_m e join_n_m
                - i match param passati dal bot fw contengono idspace e param1-2 e i join previous match :
                    (previous)idspace={17,21,88} e paramx={previous:{[param1:[id1,value1],param2:[]`},current:{[param1:[id1,value1],param2:[]`}}
    
                */

            
                let that=this;
            // run master/join  query
            return runquery(text_,null,null,entSchema,wm);// return a Promise . resolve called with (rows,reason).query  text_ on  pattern col    wm are the wheres in map format, 

            // async
             function runquery(text,regex,value,entSchema,wm_){// returns a promise ( reesolv called by some res{} functions) NB do not use await so async in useless !!

                /* entSchema=[{ name: matc.name, n_m: 0 },,]
                // query the  table associated with  schemaname =entSchema[0].name , returns a promise
                // query join entity if  entSchema[i>0] not null 
                // query  text/regex on  pattern col ( or specific value on value col) , 
                //      depend from inter , see x details the setting of findClouse in setSearc_resCol()
                //      if inter=def try in order : 
                //         match pattern field against regex if not null
                //         match pattern field against text if not null
                //         match exactly val field against value if not null

                // query master col set by  wm_ , are the wheres in map format
               //  res=await promise=runquery(entSchema,wheres), runquery(entSchema,wheres) is a promise, so await if success set res = return from promise.then(function(obj){res=obj})
                // returns ( available as param in cb when  .then(cb) , or as res=await thepromise ), see :
                //  {rows,reason} as set in exec() :
                //      IF RUN SUCCESSFULLY :
                //          {rows:rawbuf/dbquery_CursorResult,reason:'runned'}, ROWS DEPENDING FROM INTER, if inter=def : dbCursorResult=[arowMappingresCols,,,]
                //      if not 
                //             {rows:dbquery_err.toString(),reason:'err'}
                //      dbquery_CursorResult is a array of Map that maps row Cols
                //          row Cols depending on selClouse set by inter,full : see setSearc_resCol(term,regex_,value,inter,full)
                //              main use is inter= def that fill cursor with is all col of the tab


                         master COLUMS AT LEAST :
                    _                                   id: 0,'id':'$_id',
                                                        'pattern':'$patt',
                                                        'descr': '$descr', //aliasing
                                                        'value':'$value',
                                                        'data':'$data'
                                                        .... other bl fields 
                                                        > the join reference :
                                                                'città':'$j_1_m',,,,,
                */
 

                if(!(entSchema&&entSchema[0]&&entSchema[0].name&&entSchema[0].n_m==0))return ;

            var myschemaname1 =  entSchema[0].name;// >>>>>>>>  the master dyn field SCHEMA  name 
    
            // difference with start_dynFields :
            // - that was thought as a cb in user skill that find in the cb param the ifo needed to do the rest 
            //      that info was  put in the vui config by himself and recovered  accordingly 
            //       as param of this call by the framework
    
            // BUT here 
            // - we reciive the general order by cliento to do the rest , so here in this supporting helpings
            //     use the framework info to build a std format data
            //          x aiax : build the qs and a std reveived json mapping ( jon sopposed with plain property object)
            //          db : require the schema according with the info recorded in the config then 
            //              format the qs x the find db  call for a reference base dtat format in dbmongoose
            //       to do the query/aiax with std db/rest service
            //  - after calculated the basic reference data format to do the query it 
            //            -passes that data   back to user  so can  personalize the format prepared  do the call to db and http
            //            - or do the standard calls
            //  SO TODO 
            //   calc here the or better receive a cb in the callimf fwonchange and run from that context this obk containing the helpers 
    
    
            //todo;// calc from param using cfg ://  isDb_Aiax,  prefill, ),  afterallDyncalc no more because return a promise
    
            // very like to start_dynField !
            // >>> HAVE aiv3 IN SPACE !!! but private 
            // db=this._db;http=this._http;
            /* the dynamic constructor for a rest builded by framework 
          
                TODO the aiax call 
          
             it will set dyn cb :
             start_dynFields[adynfield] is a f :
             - default : will be called by framework passing cfg params to perform a user db query , expecting to be cb with (field,arr)
                  start_dynField(dynfield1, recp, sess_clone,sess_dyn, setquerywhere_, prefill, afterallDyncalc)ù
                  dynfield1= the dynfield name
        
                  recp=cfg_info(10,dynfield1)= pages...fields[dynfield] :
                        myschemaname1 = recp.schema,
                        ......................
        
                  sess_clone = never used 
                        was thought coming from buildvuifram call :
                          session in cnt_wk1=buildvuifram cloned as received in req :  buildvuifram(req,,,
                  sess_dyn : the dyn query must be stored in session.dyn . its the same in the whole session ( the same also after a page changed) 
                  setquerywhere_=  the dynfield query where field name map = {field1:matchedval,param1:calculatedval,,,}
                                    OR
                                = the querystring attributes in a std GET AIAX ( or POST) 
                  prefill = true
                  afterallDyncalc= function(field,arr){pageDynEnt[field]=arr;afterallDyncalc(1);} to be called back with (field,arr) 
                        field = the dynfield got ,
                        arr = the query got in matrix format 
          
          clone copy just some session fields :
          
                Param from appCtl	Cloned and used 
                req.session  	>	cloned session
          
                              >	parm
                                body=null
                                text=null
                                curpage=req.newpage
                                frompage=null; the page where last form was submitted 
          
          GENERAL MASTER LOGIC :
          
            can be called from skills if we need to get 1 dyn  during a resolver convo or navigator convo 
             eventually can call framework just to get the wherefield list 
          
            myschemaname1 = recp.schema
            mymodel = db.model(myschemaname1);
            qsmap = session   // no : qsmap = req.query;
            fqu[urlqsParam[ii]] = qsmap[urlqsParam[ii]];// fqu is the where condition : fqu={param1:qsmap.param1}// the mongoose find param obj
            query = mymodel.find(fqu);// 
          
          
          
          */
    
    
    
            //  todo : we can add some user out of framework rest function/query  x model filling callable from gettings controller ( and not from fw cnt_wrk1 controller)
            // >>   start_dynField, async launch the query exec on dyn field  ',dynfield1
    
            /* framework will cb with (start_dynFields[dynfield1]=start_dynField, session is a clone):
            start_dynFields[dynfield1](dynfield1,cfg_info(10,dynfield1),session,null,true,function(field,arr){
              pageDynEnt[field]=arr;afterallDyncalc(1);}  );*/
    
            // setquerywhere_ : NOT USED 
    
            // >> std func will :
            //	- ask a schema from dbschemabunch with modelname get in cfg : field.schema
            //	- add where using as fieldnames the fieldnames get in cfg : field.urlparam=recp.urlparam
            //				as values (session=sess_clone).urlparam[i]
            //	if db schema returned a std model  : ( id,patt,descr,name,data) 
            //	the function cb : afterallDyncalc(dynfield1,dynitems)  a re cb , the param dynitems returns the  ( max row=maxItems) the array of models got formatted from the db query
    
            // the mapping   ' urlparam > the join fieldname '  is identity !!! so view field  'state' with value req.query.state will be the value of field (== identity ) 'state' in masted db table/field
            // prefill : process the dyn to set the handlebars context x the dyn field in this GET new page 
            // aiax : process the dyn to set the js that will calc the the handlebars context x the dyn field precompiled template in browser
            // urlsqsParm , sono i qs  attributes, se null ci si rifa ai url param :
            //		if null urlsqsParm =urlparam , then calc mongoose find query trying to match req.query  : find(fqu) : fqu[urlsqsParm[ii]]=req.query[urlsqsParm[ii]]  !
            // setquerywhere_ : query find clause calc from the param in end point ,  alternative to urlsqsParm and have the priority : if setquerywhere_=null manage urlsqsParm ( null or not null) 
    
            //	2019
            //	gui dyn 
            //		with autoselect entity name (by qs) and where param
            //		- autoselect will aiax with a qs param and where param using a rest to a db server that has querryed ( using q/search param) at get time 
            //			and will give ( view field : viewname and descr) aiax refinement ( with qs param) to independent autocomplete js rendering sys
            //	vui dyn 
            //		the same above result is got using rest server giving the entity id of query on q and qs param to fts copied db that will refine the qs with FTS query
            //		
            //		- so the internal copied will fts select on view field and the rest server will do the same query giving to autocomplete and to dbtab the same entity with
            //			different format ( id or the fields of selected entities)
            //	>>> if we wont use aix after the get we must give at get the dyn :
            //		- gui will do a select by click on a max 20 item list
            //		. vui can  select the full table or a preselect idset if has  has the full table , 
            //			> BUT if not is like the gui :  must download a preselect of max 20 item and the do as gui a selection by position ( click) or build at runtime the fts .
            //	>>>> gui aiax is like autoselect but is managed by a hbs rendering managed by the framework ( so more control on thetemplate to fill with aiax ???) 
    
            //	>>>> se non prefill ( ax city) at get time or server can  do selection :
            //		- in webserver by rest aiax o
            //		- in browser/vui doing a selection on full idset received statically ( a db copy or a list inside a template)
    
            // BOTKIT : this will be run on master app controller as callback
            //	 - al posto di dynfield1 si passa per comodità anche il :
            //		recp=cfg_info(10,dynfield1);//recover pages...fields[dynfield] cfg obj
            //	- urlqsParam and setquerywhere_ is unneeded as param  as can use the available session param with previous result, see below 
            //	>>>>>>>>>>>>>> so pass session on sess_clone ( session with framework info) !!!!
    
    
    
    
            // SDF:
            //	a dyn field can be filled at page GET (the gui template use the dynmap data to fill the field and the vui engine use the dynmap also(do not do query just refinement)) OR
            //	a dyn field can be filled after with a rest aiax(the gui template are download and a js will use the browserDynCfg data to aiax rest a url also 
            //	if db schema returned a std model : 
            //	
    
            //		with a where field previuoly matched at run time
            //		the vui engine will query the internal FTS db (copied(init full)  from db at GET PAGE from the db url )or using the same url (FTS presetted) 
    
    
           // var dynitems = [];
            const maxItems = 5;
    
            var prefill = true;// debug only
    
            /* remember : 
        var dialog = {
          
          
            declare: {// static list of  cmd's model items defined in static or dynamic
              help: [//the ask keys in a cmdname='help' to load as entity x matcher() support ( hbs will get {{convo.vars.entPrompt.help}})
                'help'// a ask key value
             ]
            },
            static: {// static list of  model items ( entity in some intent on curpage that will use these field in ask/question )
                // std model item =dialog.static[afield][i]=['item name', 'item gui short descr '] 
                // or (todo)
                // std model item =dialog.static[afield][i]=['item name', 'item gui short descr ', 'item vui short descr '] 
              help: 
                 [
                     ['docs', 'documentation'],
                     ['community', 'community'],
                      ['contact', 'contact']
                 ]
          
            },
            dynamic: {// list of  model items ( entity in some intent on curpage that need a rest query to fill ) 
              // model items or  PARAM ( single row value = text column) 
              // if user rest function see restPool rest function to fill this field
              // ?? using this we can in appctl  build a blacklist and sent in appctl to vuiengine and use here to black list in testfunction of hears_() 
              adynfield: {cmd:'cmd1',
                  dynparam:['awherefield'],// duplicated value , also in framework ( pages.js), 
                   //  > so usually as with static , can be loaded in framework then use framework to get info 
                  // no , put in session.dyn.dynfield :   ,dyn:null} // the dyn as run time query using dynparam where field }
                  query:null,// the current valid dyn model ( view data model) extraction from some db query or aiax 
                 map:null,// mapping .additional info to map rest json field to itemname and item description  ,usually null
                 schema_url:'http://82.48.217.202:3000',
                 isHttpRest_mongo:true// or db mongo model query 
        
            }
                ........  */
    
    
    
    
            var prom;// promise to return 
            if (prefill) {//  a not void dynmap (SDF : at new page GET we fill the dynmap pageDynEnt
                // SAA : fill a not void specific dyn :
                //  dyn has a ( can only be virtual) schema (item model is menu_items[].dyn constructor function ) known at run time as master table
                // bl selection can be done on master table with where join with previous matches so we got a queryed result table from which to select an item 
                // if there is no join we start from the full master table and we can optionally download the full table to vui just to copy in internal db table 
                //		(probably the same if we have a table with rel table we can donload the file cvs that are used ti init the internal db )
    
                // each dyn field dynfield1 has a mongoose schema usually with same name 
                //	can surely be a specific vui param (example a http resolver specific view implementation param x merging when vui cb to Browser 
                // 		( http resolver can also  call back with a rest to the related page POST directly from android  !!)
    
    
    
    
    
    
    
                // SAA1 : try to get schema from config 
                //	if(dynschema[dynfield1])myschemaname1=dynschema[dynfield1];
                // better : recover the dyn fields obj in tabs, not just the schema name !
    
                // STDINJ BB : ................
       // just at func beginning 
       let resolve_,reject_,

        error//:
       prom=new Promise(function(resolve,reject){resolve_=resolve;reject_=reject});// creates a promise that launch a function that wiil garantee tha sometime the promise resolve and reject cbs will be called (as middleware cb return resolve will be called )
          
       
    
                if (isDb_Aiax) {// 072020 db :    call db api from this db query  adapter  
                    //if (schema_url) myschemaname1 = recp.schema; else myschemaname1 = 'somename';
                    var mymodel;
                    // if urlqsParam is null we can take the field in cfg :
                    // fqu is the where condition : fqu={param1:qsmap.param1}// the mongoose find param obj
                    //  ( in Financial Times rest api  have following query param :
                    //	q  usualy is a search string passed from browser after a search field input is filled or is calculated from passed form fields or session var
                    //		is the prefill (initial space)table from which do a refine  selection using master keyword ( pattern/autocomplete) or 
                    //		do refine selection using 
                    //			- relation association doing join with dbjoin column 
                    //			-  gui :  row selection looking the table rows content ( select by visual inspection of the relation on the rows ) 
                    //			   vui :  fts on destructured multi concept columns (descr)  so ( here 'Concepts' are concepts that are in relation with the master concept):
                    //					try to find 'Concepts' from speech , try to extract 'Concepts' from descr fields , 
                    //					try to match ( some 'Concept' may be in only some descr fields) choosing the row with the most matched Concepts matching the user speech Concepts
    
                    //	qs  params are :
                    //		- master keyword ( the param value can be : 
                    //				(gui only) the keyboard initial master keyword on autocomplete called term or 
                    //				(vui only) the part of speech we want to use to match the master keywords/grammar ( that is the master concept extraction in ai) 
                    //		- the column to join ( the value can be a specific field matched by autonomous concept extraction 
                    //			( usually the dbtab input can have speech filtered to have the part concept related)
                    //			THIS iterative refine joins can be done using server join on prefill space ( the prefill space is rescricted by following join condition)
                    //				or also in the browser ( no practical)  or vui engine if we have duplicated db or do the join using dedicated and fileld on the rows 
                    //		-  vui only : the concept name (example a session period :'sessione estiva' ) to find with fts Practically is the algo dedicated to match FTS the Concept related to the master item
                    //				usually the Concept is also generic and we try to find FTS match from relevant part of user speech with relevant part in descr column 
    
    
    
                    console.log(' start_dynField, schema named  ', myschemaname1, ' query params : ', wm_);// wm_
                    //test : myschemaname1='citie';
                    if (myschemaname1) mymodel = that.db.model(myschemaname1);
    
                    if (!mymodel) { console.log('start_dynField ERROR , recover a null schema for name ', myschemaname1); return; }// process error ......
                    // following mymodel is not null 
    
    
    
    
    
    
                    /* old staff : 
                    var query;
                    var fqu = {};
                    var qsmap = req.query;
              
                    // botkit : if 	setquerywhere={id:session.sametabid} do a findById , otherwise do a std query using the session attributes specified on recp.urlparam
                    //setquerywhere=setquerywhere_;
                    setquerywhere = null; qsmap = session;// session on appCtl  ,.   sess_clone;
              
              
                    if (setquerywhere) {// no in botkit
                      fqu = setquerywhere;
                      query = mymodel.findById(fqu);// priority is serve setquerywhere
              
                    } else { // here botkit will add whereparam=dynfield.urlparam find in config as where query  using value got in session.whereparam
              
                      // build fqu={param1:qsmap.param1}// the mongoose find param obj
                      if (qsmap) {
                        var up;
                        if (!urlqsParam) up = recp.urlparam; else up = urlqsParam;// if not provided take the std in pages conf
              
                        // webkit : 
                        // - take the where query param from config ,
                        // - copy every param that is in query string qsmap
                        //  - in the db query obj  fqu
              
                        if (urlqsParam) {// find if in qs there are some params to set x find where clouse 
                          for (var ii = 0; ii < up.length; ii++) {
                            fqu[urlqsParam[ii]] = qsmap[urlqsParam[ii]];
                          }
                        }
             
                      }
              
                      query = mymodel.find(fqu);// use the cb here OR in exec  
                    }*/
    
                    // todo: calc setquerywhere like qs in rest aiax
    
                    var dojointrue;
                    // let setquerywhere = qs;// ok? no todo 
    
                    /* PHASE 1  preset the  query on master field : choosing fields to get ( from full and inter) and the search term on what fts field to serch (patt) 
    
                            see https://mongoosejs.com/docs/queries.html
                         dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >  query=mymodel.find({patt: regex=new RegExp(term, 'i'),col_served= {'_id':0,'patt': 1,'descr':1 }})
    
                         findClouse={},selClouse={}
                        col_served =
                        gui :   only patt and desc field
                        deb :   nothig to do , serving all cols + '_id' , no seach with term
                        vui :   full:  many cols with id ( not _id!)
                        def/id :   _id list 
    
                                query=mymodel.find(findClouse,selClouse);
                    */
    
                    let  query;inter='gui';full=false;
                    setSearc_resCol(query,text,regex,value,inter,full); // set query  search  term on column patt and set the output result cols 



    
                    //  INSERT Mongoose clause . Sqlite Clause to do , fts clause todo for mongoose and sqlite  )
                    // else if (sql)  .........
    
                    // query.limit(20); 
    
                        /*  PHASE 2  add where in voice field{ "patt": 1,"value": 1,"descr": 1,"data": 1 }; or bl fields            query=query.where(wm)                                                                                                     
                    */
                    // alredy done ?
                    if(!full)
                    
                     if(wm&&wm.length>0)query.where(wm_)   ;// ok ?
    
                    /*  ??????
                    let bl=false;//join values
                    if(!full&&!bl){
                    // get matches where0 on join field join_1_m with model0 schema








                    if (join_1_m) {// a join 1_n is todo 
                        // if (dialog.dynamic[join_1_m]) {
                            schema_url = dialog.dynamic[join_1_m].schema_url;
                            if (schema_url) {
                                model0 = db.model(schema_url);
                                if (model0) {
                                    if (matches[join_1_m]&&matches[join_1_m].match&&!Array.isArray(matches[join_1_m].match)) {where0 = matches[join_1_m].match } 
                                    else { }
                                } else return null;
    
                            } else return null;
                       // } else return null;
                    }
                     // get matches where1 on join field join_n_m with model1 schema
                    if (join_n_m) {
                        if (dialog.dynamic[join_n_m]) {
                            schema_url = dialog.dynamic[join_n_m].schema_url;
                            if (schema_url) {
                                model1 = db.model(schema_url);
                                if (model1) {
                                    if (matches[join_n_m]&&matches[join_n_m].match&&!Array.isArray(matches[join_n_m].match)) {where1 = matches[join_n_m].match } 
                                    else { }
                                } else return null;
    
                            } else return null;
                        } else return null;
                    }
                }
                */
    
    
    
    
    // debug  if where0=='dwl' is a debug test so null it now 

    // 062020 : todo in future : put last where used in previous query into a specific directive model status oo better in  matched model status  the value of where in previous query 
         
    
                                    // TODO where1 ......
    
                    // TODO get col name containing the reference for 1_m join in the schema of master schema=dialog.dynamic[dynfield].schema_url
                    //ref_1_m='j_1_m';//the reference for relation in master field rest (rest aurant)  Model 'j_1_m',// not model0=getSchema(urlparam0,fCfg)  (that is J1_m the master model of the where field city !) !!!
    
    
                   /*  PHASE 3  add join clause if there is specified join_1_m and join_n_m , then run queries  
    
                             query the main dynfield1 using a 
                                - where clause on wherefield ( usually on 'patt' and some bl fields )
                                AND 
                                - join by id on ref_1_m , recovered by dynfield1 schema, 
                                   on the id of  match (value=Match_Param[join_...].match) of related table join_1_m and join_n_m 
    
                       nb TODO : join on join_n_m  
    
                                   example : 
                                                dynfield=myschemaname1=req.askey  >  mymodel=db.model(myschemaname1)    >
                                                >  query=mymodel.find({patt: regex=new RegExp(term, 'i'), {'_id':0,'patt': 1,'descr':1 }}) >
                                                > query=query.where(wm)     
                                                 ...... match on join table getting mycity._id
                                                >  query.where(ref_1_m).equals(mycity._id);                                                                                                
                    */





        if (!doany&&doJoinWhere ) {// doany policy : if false  take idspace instead to rerun previous where/join clause set ()
                                    // doJoinWhere is true if all where/join cur value not changed from prev values 
                                    // in that case just take idspace instead of rerun query with cur val non changed from previous   

        /// todo next release :     062020 ::lidset ?? the id set of previous query : put definition 
            let lidset=idspace;
            // lidset=idspace;// future use 
            // future use 
            if (lidset) query.where('_in').in(lidset);// IN clause
            exec(query);// full table query with no where/join  clause

        }else{





    
                    if(entSchema.length >0){// some joins requested (entSchema.length >0 ) 
                    // NOW ADD Join CONDITION !! 
                    // old : , here where0 ='milano' : Insert  the join clause in query  for both guiautocomplete  and vui 
                        b5();
                    }else{
                    console.log('B6 no join clause');
                    //var query = User.find({}).limit(20);    
                          // Execute query in a callback and return users list
                    exec(query);// full table query with no where clause
                } // end if(where0){... else .... 

        }
            
                function setSearc_resCol(term,regex_,value,inter,full){  // INTER WILL SET THE COLUMS OF RESULT CURSOR 
                    // 082020 set query  search  :
                    // - RUN term/regex on column patt and set the output result cols 
                    // or 
                    // - MATCH value field 

                    /* REVIEW :
                         COLUMS AT LEAST :
                    _                                   id: 0,'id':'$_id',
                                                        'pattern':'$patt',
                                                        'descr': '$descr', //aliasing
                                                        'value':'$value',
                                                        //'città':'$j_1_m',
                                                        'data':'$data'
                    */


                    // 072020  inter WILL SET the output data consider  only :
                    // bl case : all field
                    // gui case : all field id excluded
                    //  full case : just id 
                    // deb case : all coll and _id

                      let   regex=null ,

                      // set the param of query onn model : mymodel.find(findClouse,selClouse);
                        /* ex def case :  mymodel.find(findClouse={patt:regex, or value:'aval'
                                                                },
                                                        selClouse={'_id':0, 'patt': 1,'descr':1 }// out col 
                                                        );
                        */
                    findClouse={},// ={patt:regex,value:'aval'}
                    selClouse={},// the cursor result fields 

                    aggrClause=null,
                    sort=false,
                    distClause=false;
                    
    
                    // praticamente value not considered , goon to regex on term
                    if(term){regex= new RegExp(term, 'i');value=null;}
                    else{   if(regex_){regex=regex_;value=null;}

                        }
    
                    //if(fts)findClouse={}.....TODO 
    
                    //console.log('got a schema : ' , User);
                       //var query = User.find({fullname: regex}, { 'fullname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);




                        if(!inter)inter='def';// usually is gui
                    if(inter=='def'){ 
                        console.log('B4A bl : setting query def case  ' );
    
                        if(regex){findClouse.patt=regex;//
                        }else if(value){findClouse.value=value;}
                    }
                       else if(inter=='bl'){// serving autocomplete with 'patt' +'descr' cols 
                       console.log('B4A bl : setting query ' );
    
                       if(regex){findClouse.patt=regex;// {'_id':0, 'patt': 1,'descr':1 } result fields are patt + descr , _id must forced to be excluded !
                       }else;
                       //selClouse={'_id':0,'patt': 1,'descr':1 };
                    }else if(inter=='gui'){// serving autocomplete with 'patt' +'descr' cols 
                        console.log('B4A gui : setting query ' );
                        // >>> a aiax resolving starting keywords ( term) + join relation 
                        // now set the find {}: search the patt starting letter : use regex !
                        if(term){findClouse.patt=regex;// {'_id':0, 'patt': 1,'descr':1 } result fields are patt + descr , _id must forced to be excluded !
                        }else;
                        selClouse={'_id':0,'patt': 1,'descr':1 };// result fields are patt + descr , _id must forced to be excluded !
                    }else if(inter=='deb'){// ???
                        console.log('B4A deb : setting query ' );
                        

                    }else if(inter=='fts'){//

                        // from https://code.tutsplus.com/tutorials/full-text-search-in-mongodb--cms-24835
                        // do in server : db.messages.createIndex( { "year":1, "subject": "text"} )
                        // db.messages.find({year: 2015, $text: {$search: "cats"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})
                        // but where clause is added sepately  ( same performance ???), so :

                       // db.messages.find( $text: {$search: "cats"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})

                        // so :
                        findClouse.$text= {$search: "cats"};sort=true;// BUT seems better put here also the where instead to chain them  after : query.where(wm_) 
                        // TODO add .sort({score:{$meta:"textScore"}}) !!!!! in SSD

                    }else{ // >>> vui and full   serving vui ( a full db request (returns json) or a join request (returns idspace)
                
                        // >>> a 'vui' aiax to get the join if we do not do internally with a column dedicated to the rel field
                        // 	vui aiax needs only the id of the restaurant results , because we can query the local db with this id ( must be the same ) to have all restaurant voice related  fields 
                
                        // >>>>>>> indeed if in the local db we duplicate the 1:n relation in a city column then we can do the join in the local db without to do this aiax ( can be slower but we spare a rest call)
                        //	 ( we must know the city id from the value field , both are keys ! )
                
                        // https://stackoverflow.com/questions/30677879/mongoose-get-list-of-ids-instead-of-array-of-objects-with-id
                        // Group.find({program: {$in: [...]}})  .distinct('_id')
                        // query = User.find({}, { '_id': 1 });// result fields are just  obj with key _id 
                
                        // >>>>>>> REMEMBER THAT THE JOIN IN VUI ENGINE DBTAB can be done internally in the db manager if we have a column with the relation of the join field 
                        // 	( so value(s) or name or data is the relation value of  the relation entity in relation 1:m or n:m )
                
                        // FULL table,  result fields are just  array of _id strings !!!! are also the id on vui copied db ????????????????????????????? città:	2
                        if(full){
                           // var cols={ "patt": 1,"value": 1,"descr": 1,"data": 1 }; console.log('B4A full : setting query ',cols );
    
                            // mymodel.find({},cols);// serving all cols
                                        // better do a select (aggregate), see http://excellencenodejsblog.com/mongoose-aggregation-count-group-match-project/
                                        //  	and https://stackoverflow.com/questions/41703657/how-do-i-rename-fields-in-the-outputs-of-a-mongo-query
                
                                        // use following because we want id and not _id as col name 
                                        aggrClause=[];
                                        aggrClause.push ({$project: {_id: 0,'id':'$_id',
                                                        'pattern':'$patt',
                                                        'descr': '$descr', //aliasing
                                                        'value':'$value',
                                                        //'città':'$j_1_m',
                                                        'data':'$data'
                                                        // manca match ( the were condition !!!)
                                                            }		
                                            });
    
                
                
                        }else
                        if(inter=='id'){ 	//no bl, no gui , no deb, is vui
                            console.log('B4A gui : setting vui and anyelse ' );
                            distClause=true;// serving just id list
                        // NO term here !! matching with master pattern is done by FTS in internal db of vui engine !!!
                        }else;
                    } 
    
    
    
                    //  INSERT Mongoose clause . 
                    // if(mongo)
                    if(aggrClause){// full only 
                        query = mymodel.aggregate(aggrClause, function (err, recs) {
                                                             if (err) {  console.log('err ',err);} else 	{    console.log('recs ',recs);}
                                                             });
                    }else{
                        // SSD
                        query = mymodel.find(findClouse,selClouse);
                        if(distClause) query.distinct('_id');
                        if(sort) query.sort({score:{$meta:"textScore"}}) ;// fts 
                    }


                }// end setSearc_resCol

    function b5()
    {  

        // to review :
        //  not null : insert where0 in master query if dont use the previous query set with same where0 value
        // NOW ADD to query (till now JUST A SINGLE) WHERE CONDITION !! , here where0 ='milano' : Insert  the join clause in query  for both guiautocomplete  and vui 
        // unless the where0 value is alredy querred in previous query and a id set lidset  is available 
        console.log('B5 some join to do with related entity');
        // TODO set this mapping on pages config !!! . MAPPING the where field to internal db field name 
        var mastermap = {};

// console.log('setting the join  clause if any : ', where0);

{// usual case : ever rrerun query , do not consider idspace
            // or  , see https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
            /*
            model.find({
                '_id': { $in: [
                        mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
                        mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 

                    ]}*/

                    for(p =1;p< entSchema.length;p++ ){


                        if(entSchema[p].id&&entSchema[p].refCol){// .id MUST BE CALCULATED BEFORE ,  entSchema[p].n_m!=0
                            
                            if(entSchema[p].n_m==1){
                                // 1:n relation 
                            query.where(entSchema[p].refJ).equals(entSchema[p].id);
                            console.log('setting the join ',entSchema[p].name,'  clause value : ', entSchema[p].val, ' id was ', entSchema[p].id);
                            }else if(entSchema[p].n_m==2){// n:m relation 

                                // TODO 

                                // to do  probably try to see if the id is in the column val that is a set/array : is id in [firstrelid,secondrelid,,,,] ? 





                            }
                        };
                        
                        
                        
                        }
                        exec(query);// exec now 


        }// ends doany
        /* else { 
            // do this , because is simpler redo the query ( perhaps in future .....   ):
            // redo the query every call :
            if (city_lastValue && city_lastValue.equals(where0)) {// the id of the city was the same as before so id known 
                console.log('setting the where clause found a previous city_lastValue : ', city_lastValue, ' id was ', city_lastObjkey);

                // where('_id') and not where('city') 
                // yes because when do a join i set  the idspace city_lastObjkey as the list  of items satisfying that join 

                // error query.where('_id').equals(city_lastObjkey); // add to query : a where clause  _id=city_lastObjkey
                query.where(ref_1_m).equals(city_lastObjkey);

                exec(query);// exec now 
            } else {

                // 20012020 


                console.log('setting the where clause on tab model ', model0, ' (', join_1_m,
                    ')but  not found a previous city_lastValue so go on to find the id of a record with a value= where0   ', where0);
                // var queryc=model0.findOne({"value":where0},{_id: 1 });// returns a objectid or a string ? 

                // lower case search : performance issue ???
                //var queryc=model0.findOne({"value":"/^"+where0+"$/i"},{"value": 1 });// returning just value col { $search: thename } 
                // i = no capital 
                var queryc = model0.findOne({ "value": { '$regex': where0, $options: 'i' } }, { "value": 1 });// returning just value col { $search: thename } 



                // >>>>>> or if where0 was not matched before directly try to match using present speech (term) 


                //var queryc=model0.find({},{"value": 1 });// returning just value col
                queryc.exec(   // get the the city entity  to join fron the city.value=where0 
                    function (err, mycity) {// return a octal _id?
                        // IF SYNC we can use all nesting function var as unchanged ( like final ) 
                        // Create a new ObjectID	var objectId = new ObjectID();
                        // Verify that the hex string is 24 characters long		assert.equal(24, objectId.toHexString().length);
                        if (!err) {
                            console.log(' 1: queryc returned results , expected record with where0 : ', where0, ' ,are : ', mycity);
                            //,' is objectid ',assert.equal(24, mycity.toHexString().length));
                            if (mycity) {
                                city_lastObjkey = mycity._id;
                                console.log('1.1 set a where cond for field ', ref_1_m, ' , value ', city_lastObjkey, ' where is ', query.where);
                                query.where(ref_1_m).equals(mycity._id);// add to query : a where/join clause  _id=city_lastObjkey

                                exec(query);// exec async > calls exec function
                            } else {
                                res.send('find no restaurant based on city :' + where0);// return no result 
                                console.log('1.2 get here only if query do not return result ');
                            }
                            console.log(' 2 , ');
                        } else res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404);
                    });


            }// end else

        }// end else{ // redo 
        */
    // ?? query.where('descr').equals(where);

    }// end b5()

    /* *****************
    // DELETE 
    // TODO  correct in above the returns : no re.json .... , merge the following  OLD procedure and use the promise as following: 
    
    
                    // if the askey is a dyn field then fw
                    //              sets      session.dyn[field]= session.dyn[field]||{idspace:[],query:[],complete:'start',prompt:[]};// complete:matchingstatus/result, query:[] the query dyn result [[itempattern,shortdescr],,,,]       
                    //              and returns current status/result in  matches[field] = session.Match_Param[field]= dynSes={query:session.dyn[field],complete=session.dyn.complete};// complete= matching result exposed in conversations,,,, > will be set in session.Match_Param[field]
                    // so :
                    let dynSes=matches[field]=matches[field]||{complete:'start'};// dynSes={query:session.dyn[field],complete=session.dyn.complete};
                    // where the training must be done on  mymodel.find({}}) or in some section of a partitioned where space (x less common where values)
                    // example partition the training set in 10 parts each covering a where space segment
                    // after qea result do a join with the where in the section to get the final qea list 
                    // or do a fts whith match and where join then ?
    
                    // let queryres=dynSes.query;// if no where field updates mantain current dynSes status
    
                    // if there are where updates :
                    //let spaceid=session.dyn[field]= session.dyn[field].idspace;// if not null only 
                    let spaceid;
                    const sendIds=false;// if i have a idspace from previous fts  match and a new join i intersect/restrict  the join result space with the current idspace
                                            // that can be done adding a  IN on idspac  clause ( > dbServer) or just by a local intersection on the join result in local dyn matching algo 
                                            // thumb rule : so transmit to db server only if idspace have a limited dimension ( fts idspace is ever limited to max 20)  or not transmit if the join has a linited dimension                            
                    if(dynSes.idspace&&sendIds) spaceid=session.dyn[field].idspace;// if not null only 
    
    
                    if(spaceid)setquerywhere=mergeIds(setquerywhere,spaceid);// // TODO insert a IN clause in query , example : if(lidset)query.where('_in').in(lidset); . ? after the query update idSpace
    
    

    
                    let prType=0;
                    if(prType)query=addProject(query,prType);// see indexcontroller_rest.autocompl_rest()
    
                    query = mymodel.find(wm);
                    // usually we use just pattern/descr field
                    //if(!urlparam1)mymodel.find({state:'CA'}, 'patt descr',cb_dyntab1);
                    //else mymodel.findById(urlparam1, 'patt descr',cb_dyntab1);
    
                    console.log('start_dynField, recovered schema named  ', myschemaname1, ' query clause : ', fqu, ' model : ', mymodel, 'recovered query  ', query);
                    // for promise modesee https://stackoverflow.com/questions/33645570/nested-query-with-mongoose
    
                    // here : https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
                    // or : http://mongoosejs.com/docs/queries.html
    
                    //query.select(['patt', 'data']);
    
    
                    // 062020  deleted following
                    //  crun=(resolve, reject) => {

                        //request(req, function (err, res, body) {
                        query.exec(// EXEC : fill dynitems , no promise just simple cb
                            function (err, hotels) {// query cb
                                // check this thought : ???? this is a inner function of start_dynField that is callen on many field param dynfield1 , so here i see the calling stake of start_dynField ( like enclosure) 
                                // so next invocation of start_dynField dont touch the local var of previous call ( that will use those at this callback !!)
    
    
                                //  >>>> this is the cb that will calc the model x a specific dyntab dyntab1 
                                //according the declared  menu_items[dyntab1].dyn and adds to pageDynEnt
                                // remember from  hotels (subclass inst of db entity model ,thequery result got from specific schema result)  usually we have to calc :
    
                                if (err) {
                                    console.error(err);
                                    //debug('Error in Botkit CMS api: ', err);
                                    return reject(err);
                                    // or 
                                    return reject(new Error('some info'));
                                }
                                else {
    
                                    console.log(' start_dynField, receiving ', hotels.length, '\n:', hotels, ' , now dynfield1 is ', dynfield1);
                                    console.log('  start_dynField, , first  row : ', hotels[1].patt, ' , ', hotels[1].descr, ' , ', hotels[1].value);
    
                                   // dynitems = hotels;// schema find extract models extended expected interface (.dyn constructor !)
                                    if ( hotels.length > maxItems)  hotels.length = maxItems;
    
    
                                    // fill map :
    
                                    //pageDynEnt[dynfield1]=dynitems; // temp dyntab current values , will be used by render as context to display dyntab to render 
    
    
                                    //afterDyncalc(); // run controller after dyn calc ( some dyn key in pageDynEnt  not void)
    
                                    // NO ( must be a session var !) dialog.dynamic[dynfield1].dyn = dynitems;
                                   // if(sess_dyn&&sess_dyn[dynfield1])sess_dyn[dynfield1] = hotels;// must store dyn query in session 
    
                                    resolve(dynfield1,  hotels);// inform that a dyn was set
    
    
                                }
                            });
    
                    
                    
                    // promxx = new Promise(crun);// end promise
    
    // end DELETE 
    */
    
    
    function exec(query){
        console.log('B7 1.1.1 executing query ',query);
        query//.limit(20)// debug . seems limit  cant be used with distinct ???????
        .exec(
        function(err, resta){
        if (!err) {console.log('1.1.1.1  B9 query returned results : ',resta);//users.length);
            console.log('  B9a resta[0] is ',resta[0]);
                     // Method to construct the json result set
    
            /*
                     var result = buildResultSet(users);
                     res.send(result, {
                            'Content-Type': 'application/json'
                         }, 200);
              */
        if(inter=='gui'||inter=='full'||inter=='deb'){	// serving json the autocomplete rest ( term + where param ) AND full vui db table copy
    
                    // if(resta).....
                
                   // res.format({json: function(){ console.log('send json  results : ');res.json(resta);console.log('  B9aa resta[0] ');} });// question res.json(user)=JSON.stringify(users) ??????
 
                    console.log('send  results : ');res.results(resta,0);console.log('  B9aa resta[0] ');// question res.json(user)=JSON.stringify(users) ??????
 

                }else{		// VUI CASE : fill just the id of the query
    
                    // inter='',  serving idspace the vui dbtab  join rest ( no term + where param ( also null)  ) 
                    /*
                    // from https://docs.nodejitsu.com/articles/advanced/buffers/how-to-use-buffers/ and http://expressjs.com/it/api.html#res
            
                    var buffer = new Buffer(resta);// resta is array of integer
                    //res.set('Content-Type', 'text/html');res.set('Content-Type', 'application/octet-stream');
                    res.send(buffer);
                    */
    
            // from https://github.com/Automattic/mongoose/issues/1391 + 
                // having set _id to number : 
                //	var schema = mongoose.Schema({_id: Number});
                //	var Pet = mongoose.model('Pet', schema);
    
                //	var schema = mongoose.Schema({pet: {type: Number, ref: 'Pet'}});
                //	var Shop = mongoose.model('Shop', schema);
    
            /*  A
            // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
                // transform the integer array resta :
                //  following is js code , that should work if buffer is understood by nodejs 
                    var rl=resta.length;
                    var buffer = new ArrayBuffer(rl*4),int32View = new Int32Array(buffer);
                    if (int32View.length!=rl) {console.log('error on bytewise array of ids ',rl);
                    for (var i = 0; i < int32View.length; i++) {
                          int32View[i] = resta[i];
                    }
            */
    
    
                // B following seems to use nodejs buffer library , see https://allenkim67.github.io/programming/2016/05/17/nodejs-buffer-tutorial.html
                //	and https://www.w3schools.com/nodejs/ref_buffer.asp :
                    const Buffer = require('buffer').Buffer;
                    var rl=resta.length;
    
    
    
                    //DEBUG ::: 
    
                    if(rl>5)rl=5; // debug
                    // create an empty buffer with length of 4 bytes.
                    const 
                    // ASD  buf = new ArrayBuffer(4*rl),
                    rawbuf = Buffer.alloc(4*rl);
                    //  ASD from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays .  readwrite the buffer using data format  int32 
                    // ASD	int32View = new Int32Array(buf);
    
                    console.log('B9 allocated buffer of byte length  ',4*rl);//,' int32View is of length  ',int32View.length);
                    // LAST ERROR :  int32View is not defined
                    // nb rest[i] is alredy a string :   ( rest[i]=ObjectId.valueof(the_id))
                    for (var i = 0; i <rl; i++) {
     
                        // CASE resta[i]  is a string to put in ascii format into the buffer
                        // write the unsigned 32-bit, big-endian number 123 into the buffer starting
                        // at index 0 of the buffer.
                        //buf.writeUInt32BE(resta[i], 4*1);
                        // buf.write(resta[i], 4*i); // no : here will convert the string in a ascii/utf8  format
    
    
                        // CASE resta[i]  is a numer in hex form (objectid is 96 bit hex string )
                        // but resta[i] if objectid is has 12 byte (uint96)
                        //  ( should better  
                        //	- use :https://stackoverflow.com/questions/14730980/nodejs-write-64bit-unsigned-integer-to-buffer
                        // 		 and https://nodejs.org/api/buffer.html 
                        //	- OR USE A HASH TO DESCEASE THE BYTE https://github.com/lovell/highwayhash 
                        //		https://www.scadacore.com/tools/programming-calculators/online-hex-converter/ )
                        // insert the hex var ( string with hex values ) :  
                        // buf1.copy(buf2, 0, buf2.length, 20);buf1=Buffer.from('548e09f70356a1237594fbe489e33684'=resta[i], 'hex');
                        // or just buf.writeUInt32BE('0x548e09f70356a1237594fbe489e33684', shift);
                        // if var numconv=parseInt(objectId.valueOf(), 16);// but it is a uint96!
                        // buf.writeUInt32BE(numconv, 4*i); 
    
                        // case : resta[i] is a int from db numeric key				
                        rawbuf.writeUInt32BE(resta[i], 4*i); 
                        // OR 
                         // ASD int32View[i] = resta[i];
    
    
                        console.log('B9a , resta[i] ',resta[i],
                        // ASD 'int32View[i] ',int32View[i],'\n inserted buf : ',buf,
                        '\n inserted rawbuf : ',rawbuf);
    
                    }
    
    
                // then read in a client like : https://stackoverflow.com/questions/39062510/how-to-return-arraybuffer-to-the-client-by-nodejs
                    //res.set('Content-Type', 'text/html');res.set('Content-Type', 'application/octet-stream');
                    res.send(rawbuf,0);// res.send(rawbuf);
    
                }
    
    
          }else {// err
                 //res.send(JSON.stringify(err), 1);// res.send(JSON.stringify(err), { 'Content-Type': 'application/json'}, 404);
                 res.results(err.toString(),1);
               }
       });// end query.exec()
    console.log('B7 1.1.2  query returned');
    }// end function exec(){} 
    
    let res={// called by  exsec  , will call resolve_
        format:function(jsond){
            //let jsond;
            jsond.json()
            //resolve_(jsond,null)({rows:jsond,reason:'json'});;// null : normal json rows 
    
        },

        // §TODO use send or results , both are confusing !
        send:function(  bytes,code ){// used 
            //let bytes;
            if(code==0)resolve_({rows:bytes,reason:'byte'});
            else if(code==1)resolve_({rows:bytes,reason:'err'});// {rows:err.toString(),reason:'err'}
        },
        results:function(  bytes,code ){// used 
            //let bytes;
            if(code==0)resolve_({rows:bytes,reason:'runned'});
            else if(code==1)resolve_({rows:bytes,reason:'err'});// rows can be array?
        }
    
    
    
    }// end res
    
 
    //prom = new Promise(crun_);// end promise
    
    
    
                    console.log('  start_dynField,  query exec launched on dyn field  ', dynfield1);
    
                } // ends db
                
                else { // AIAX 
                    //  >>> TODO to complete : insert in GET POST all PARAM SET used in db case 
                    // do aiax :
                    // remember dyn tab and dyn params are in session copied in before from dialog
                    // so at the end remember to set session.dyn or the param match that as is just a value
                    // we can fill vars.param and also  session.Match_Param.param because it is the location to see for match entity  .....
                    // but we have convo reference no so do it at return when promise is resolved 
                    // not convo.vars but match so session.Match_Param
    
    
                    if (qs && schema_url) {
                        let method, limit;
                        if (dialog.dynamic[field].method == 'POST') method = 'POST'; else method = 'GET';
                        if (dialog.dynamic[field].limit) limit = dialog.dynamic[field].limit; else limit = 5;
                        // 
                        prom = this.rest(dynfield1, schema_url, qs, method, map, limit);// in bot.js we called  rest(uri, params, method,outmap,limit){
                    }else prom = null;
    
                }// end  do aiax
    
            }// end prefill
    
            //let origProm=prom;
    
            /*
            function fulfHereToo (field, query) {// return promise itself as chained promise , see https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
                let  isParam ;
                if (dialog && dialog.dynamic[field]) {
                     isParam = dialog.dynamic[field].isParam||false;
                    if(isParm)session.Match_Param[field] = convo.vars[field] = query[0][0];
                    else {  dialog.dynamic[field].query = session.Match_Param[field].query =  query;
                            // no more : session.dyn[field] = query;
                    }
                }
                return origPro;// is the same return prom ???.  so next .then will get the fullfill of original  prom again (correct  ?)
            }*/


            function fulfHereToo1 (field, query) {// promise that fullfilled will ends : not used !!
                let  isParam ;
                if (dialog && dialog.dynamic[field]) {
                     isParam = dialog.dynamic[field].isParam||false;
                    if(isParm)session.Match_Param[field] = convo.vars[field] = query[0][0];
                    else {  dialog.dynamic[field].query = session.Match_Param[field].query =  query;
                            // no more : session.dyn[field] = query;
                    }
                }
                //return null so live the thread
            }
            // sulution 0 : fullfill a promise that repropose the same promise that will be returned 
           //  if (prom) prom = prom.then(fulfHereToo); else ;// TODO  return a failed promise 
    
            // better ?
            // sulution 1 : .then 2 times the promise : is just a way to split the thread

            // if (prom) prom.then(fulfHereToo1); else ;// TODO  return a failed promise 
    
    
            // 122019 query is obj array depending from prType set , we'll have use them to set in Match_Par.query__ that will be used 
            //  by user dyn field ctl (like a_onChange_dyn_field) to lauch a Q&A selection that will refine  current dyn and calc a new session.Matc_Parm Status X DYN  FIELD SO CAN GOON TO REFINE OR WE GOTÒ A SUCCESSS DYN MATC 
            // .then(function(dynfield1, dynitemsmatrix_np2 or a sinlgestringmatrix=[['paramvalue']]){ set convo.vars and session ....})
    
    
    
            return prom;
        }// end runquery()
    
},// end onChange_dynField
    
        rest__: async function (entity, uri, params, method, outmap, limit) {// not used now, this rest works with require('response') module 

             // to review , take onChange_dynField as reference api
            // simple rest fw function 
            // outmap must be ['firstprop','secondprop'] or  ['firstprop'] x param ( only first row will be got)
            // return a promise that .then(function(fieldname,([[],,,]  or []) of string){})
    
    
            var is1or2 = 2;
            if (!(isArray(outmap))) return null;
            else { if (outmap.length == 1) is1or2 = 1; else is1or2 = 2; }// 1 if is a param

            let req = {
                uri: host + uri,//+ '?access_token=' + this._config.token,
                headers: {
                    'content-type': 'application/json'
                },
                method: method,
                form: params
            };
            console.log('after ,rest called , uri ', uri);
    
            // var prom=new Promise((resolve, reject) => {
            //   console.log('promise started');
            //     bot.say('I heard: pippo' ).then(function (){console.log('promise res');resolve('pippo');});});
            // bot.say('I heard: pippo2' );resolve('pippo');
    
    
            return new Promise((resolve, reject) => {// same as done in bot.js 
                //request(req, function (err, res, body) {
                this.http(req, function (err, res, body) {
                    if (err) {
                        //debug('Error in Botkit CMS api: ', err);
                        return reject(err);
                    }
                    else {
                        //debug('Raw results from Botkit CMS: ', body);
                        let json = null;
                        try {
                            json = JSON.parse(body);
                        }
                        catch (err) {
                            //  debug('Error parsing JSON from Botkit CMS api: ', err);
                            return reject(err);
                        }
                        if (!json || json == null) {
                            reject(new Error('Botkit CMS API response was empty or invalid JSON'));
                        }
                        else if (json.error) {
                            if (res.statusCode === 401) {
                                console.error(json.error);
                            }
                            reject(json.error);
                        }
                        else {
                            // var jsonr=json[0].id;
                            var jsonr = {}, len;
                            { len = json.length; if (len > limit) len = limit; }
                            for (var i = 0; i < len; i++) {
                                if (is1or2 == 2) { jsonr.push([json[i][outmap[0]], json[i][outmap[1]]]); } else { jsonr.push(json[i][outmap[0]]) };
                            }
                            resolve(entity, jsonr);
                        }
                    }
                });
    
            });
    

    
            //return prom;
            function isArray(a) {
                return (!!a) && (a.constructor === Array);
            }
    
            // now api to aiv4 :
    
        }, //end rest__
        
        run_jrest: async function (uri,formObj, method) {
           let response= run_rest(uri,formObj, method) ;
         if(response)return JSON.parse(response);
            
        },
        run_rest: async function (uri,formObj, method) {// if GET formObj(where clouse literal obj ) can be missing if alredy set into uri qs
            // this rest works with rest.js module :
            // use :
            // response = await jrest("https://postman-echo.com/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new",GET,null)
            //   or  response = await jrest("https://postman-echo.com/integers",GET,{num:1,min:1,max:10,col:11,format:'plain',rnd:'new'})
            // .catch((err) => { console.error(err); });  or  .catch(console.error);
   
            // response = await  jrest("https://postman-echo.com/someendp',POST,{title: "Make a request with Node's http module"})
            // .catch((err) => { console.error(err); });  or  .catch(console.error);
   
            // if(response)data=JSON.parse(response);
            if(!method)method='GET';
   
            let response = await  this.rest(uri, method,formObj) 
             .catch((err) => { console.error(' REST got ERROR : ',err); }); 
   
            if(response)return response;// if curssor should be an array of array of literal/string 
               else;
           },

           intMatch:async function(){// returns entities mostly  resolved ( represented by key/descr/voicename , can be partially inflated expaded in tree for most important sub entities 
            // if returns false the intent was not matched
            // askmatches structure will store the results as the return rows represent a object property nin expected format 
            },

        // 072020 : alredy set in onchange ???
        // ((url,)entity,text=searchterm,wheres,isDb_Aiax,cb)
        dynMatch:async function//helper function , extract the param to fire a 'std' rest to service end point (POST andd GET based , depend from the url formatting get in model.js) 
            // returns entity item(s) in rows : so row fields if not atomic represent the object item  property key/value/name and are not inflated/populated. can be in following query on chained threads  
            //  - if used as entity match : askmatches structure will store the results as the return row represent an entity match
            //  - if used as master query cursor  : askmatches structure will store the results as the return rows represent a  entity query items
            // ONE SHOT  , refine algo need a function to call more times and will provide some old matched wheres that must inserted in entSchema[1-2] of onChange_dynField(entSchema,,,)
            
                                            // put in a sort of interface TO complete in setSetvice , or a default matcher template
                                            // general int :(tomatch,this.id,entity,step.values.excel,step.values.matches[entity],step.values.matches)step.values.direc values.session excel.wheres
                                            (term,cmd,key,entity,step,cb){// call : matchIn(tomatch,this.id,entity,step,(val)=>{res=val;});


            //  RETURNS true/false ( the match) and if true cb will be called with the result cb(result=rows):
             // rows=[modelitem1,,,,] 
             //     - in case of entity match, modelitem  can be set in matches[entity] as:
             //             modelitem={a std model db ob + bl fieldsj} + optional info that will be available if the model was static and declared in excel[entity] like vmatch,notMatPr ...
             //     - so in case of   we can fill askmatches rows/cursor/params in the format expected :
             //             .............

            let vars=step.values;
            let session=vars.session,
                excel=vars.excel,
                direc=vars.direc,
                wheres_,
                dir=step.state.dir;// the loop ctl dyn var
                // comand must be registered in basefw and model defined in excel to find wheres filled by fwbase.find_wheres() :
                //           fills the direc model that depends to where model :  direc.dep_mod.wheres=[where_mod1,where_mod2,,,]   , mod is a model or a static entity 

                if(excel[entity]&&excel[entity].wheres)wheres_=excel[entity].wheres;// the where fields wheres_=['mod_city',,,]
                // no its not a ask ! if(direc[entity]&&direc[entity].wheres)wheres_=direc[entity].wheres;// the where fields wheres_=['mod_city',,,]

                let wheres={},// {mod_city:'rome',,,,}
                wc=0;// 


                if(wheres_)for(wh in wheres_){// fills where dependency resolved by ... in 
                    wc=1;
                    if(vars.matches[wheres_[wh]]&&vars.matches[wheres_[wh]].match)wheres[wheres_[wh]]=vars.matches[wheres_[wh]].match;// a matched where condition
                }
                if(wc==0)wheres=null;



            // isDb_Aiax use local rest db interface ORM , to put in a module 
            // schema_url: the name of entity entry point in rest db interface
            // text = term
            // wheres the col/rel entity to do where/join ( the rest db interface will adapt the query to db schema)
            // cb : will use the json rest result std format to insert the match status in vars.matches[entity]
            // ?? directive.direc[mkey]
            // using directive info run fts using db/http directive.excel[dynMod]
        
            // built using some fw matcher component ( fwHelpers) 
            //      integrated by user cb to custom some part of matching process like service_

            // this.onChange_dynField(req, isDb_Aiax, schema_url, sess_clone, sess_dyn, paramList, prefill, map, afterallDyncalc)
            // res=await this.onChange_dynField(req, isDb_Aiax, schema_url, null, null, wheres, true,null, afterallDyncalc)
            //cb(res);

            // 072020 TODO : 

            // in onchange we can custom this template
            // that is embedded in the implementation of a matcher 
            // schelethon of a matcher :

  //          let dynMatch_=function (){            }

            // example here if url=internal we use the internal adapter to query a db server on schemaurl endpoint 
            //                 else run the post request at external rest data service

            /* *** 092020 primer :
            looking at url in model.excel  can call the interface (data service) pgm  to process the query 
            can be a 
                - properties/wheres rest mapping to a rest external dataservice that will have the schema info ( url and where entity mapping can be recovered in vars.excel...)
                - custom rest caller (can be a service fwCb.model[entity].matcher function) to a non rest style external dataservice that will have the schema info 
                                        ( url and params of caller can be recovered in vars.excel...)

                - internal data service restAdapter2Mongodb() that knowing data structure info ( schema info of wheres param recovered in  vars.excel. ) 
                            can call the db engine manager onChange_dynField()  ( schemaurl to call the db server can be also recovered in vars.js )
                   */
            //let x=''; // find x ****************************************************************+

            // two places to get url : in excel(from model of cmd registered in basefw ) or in state.dir(from cms macro )
            let url='internal';// default  fron url=excel.entity.url   >> entDir.url 

            if(dir&&dir.asks[key]&&dir.asks[key].cond[entity]&&dir.asks[key].cond[entity].url)
                url=dir.asks[key].cond[entity].url;// get url from cms directive put in  macro 
            let entDir=excel[entity];
            if(entDir&&entDir.url)
                url=entDir.url;// get url from excel

            let isGET=false;// from the url format we can tell it, for example we put a ? in get  url :   localhost/echo?
            if(url&&url.slice(-1)=='?')isGET=true;// url end with '?'
            if(url){//&&url.su)
            if(isGET){// 
                
                // fill qs with term and wheres : https://stackoverflow.com/questions/332872/encode-url-in-javascript
                // qs.stringify({a:"1=2", b:"Test 1"}); // gets a=1%3D2&b=Test+1

                let qs_='';
                if(wheres)qs_=qs.stringify(wheres); // gets a=1%3D2&b=Test+1
                if(term)qs_+='&term='+term;

                cb(await run_jrest(url,null,'GET'));// external REST Data Service // TODO .catch .....   !!!!!
                return true;

            }else{// is POST/internal 

            // pass in meta the name of mapping db resource because in debug we pass this data from here instead to let caller to resolve this data layer duty  
            let meta;// as this is an entity matcher the schema is find in escel.model (too hard to put in macro ???)




            if(excel[entity]&&(meta=excel[entity].dbmeta));else return false;
            if(dir&&dir.asks[key]&&dir.asks[key].cond[entity]&&(dbmeta=dir.asks[key].cond[entity].dbmeta));
            else if(excel[entity]&&(meta=excel[entity].dbmeta));else return false;






            let form;
            
            if(url=='internal'){
                form={entity,term,wheres,meta};// excel is debug param, usually is in the service
                let mr;
                let wt=false;// new db service
                if(wt)mr=await this.restAdapter2Mongodb(form);// call specific caller to internal data service adapter that knowing additional scheme cal call a db

                // a service pluging so we put here . if was a custom put in service.js 
                else mr=await this.plugins.dbs.restAdapter2Mongodb_(form);// call specific caller to internal data service adapter that knowing additional scheme cal call a db
                //  // returns  res={rows,reason} reason  'err' or 'runned'
                if(mr.reason=='err')return false;
                else {

                    cb(mr.rows);
                    return true;
                }

                }else if(url.substring(0,6)=='custom'){// put in service.js custom:customservicemethod added  whith this signature call(form) return the same obj 
                form={entity,term,wheres,meta};// excel is debug param, usually is in the service
                let mr,custserv;
                // old mr=await this.restAdapter2Mongodb(form);// call specific caller to internal data service adapter that knowing additional scheme cal call a db
                if(!url.charAt(6)==':')return false;
                custserv=url.substring(7);
                if(this[custserv]){
                   
                // a service pluging so we put here . if was a custom put in service.js 
                mr=await this[custserv](form);// call specific caller to internal data service adapter that knowing additional scheme cal call a db
                //  // returns  res={rows,reason} reason  'err' or 'runned'
                if(mr.reason=='err')return false;
                else {

                    cb(mr.rows);
                    return true;
                }}
                 return false;





            }else if(url.substring(0,7)==':http//'){// just map the post param wheres  if find excel[entity].restmap
            // wheres=rmap(entDir.restmap); functopn rmap(){}

            // std POST REST 

                form={wheres,term};
                cb(await run_jrest(url,form,'POST'));// external REST Data Service // TODO .catch .....   !!!!!
                return true;
            }else{
                                    // look for a custom rest adapter 
                   //  if(fwCb.model[entity].matcher)cb(await fwCb.model[entity].matcher);
                    return false;
            }
            return false;
        }// ends POST
        return false;
        }// end is url
        },

  
        // old INTERNAL DATA SERVICE IMPLEMENTATION : restAdapter2Mongodb and restAdapter2Mongodb should be put in ext module as it is autonomous module
        // meta is scalar !!!
        restAdapter2Mongodb:async function(form){// ONE SHOT , put in a sort of interface TO complete in setSetvice , or a default matcher template
            // >>> meta should be in local service directory to  map entity to find local data description to query  . as here we do not have such a dir we ,for debug, pass that
            // meta : used to resolve db mapping resources :schemaurl
            let {entity,text,wheres,meta}=form;
            // THAT internal REST Data Service  is EQUIVALENT to a external EXPRESS AUTOCOMPLETE CONTROLLER x AIAX BROWSER REST EXPRESS SERVER 
            // ITS a DATA SERVICE END POINT :WILL prepare the query for the local db engine to 
            // to find resources need to map entity into a managed db resource so need  meta , that for semplicity is passed by bot model in model  

            // returns  entity rows : res={rows,reason} reason  'err' or 'runned'
            
            /*  wheres={where1col_ent:'a',,, }*/
            // a adapter template x data service server end point 
            // here route to internal implementation   with schema info from model.js

            // ***************    look schema x entity and wheres[i] in :
            //  TODO >>>>>>>>>>>>>>>>>  add excel VISIBILITY .......

            //  to see if 
            //  - the rel is a join    so fill entSchema
            //  , or 
            //  - a where on some entity col/fields  so fills wheres 

            // exaple are just where on cols with no memory (idspace=null)

            //let x=''; // find x ****************************************************************+


            let schemaurl;
            if(meta)
            {// useless schemaurl=meta.schemaurl;//'Master';// TODO entDir.schemaurl; here  excel.dyn_medicine.schemaurl='Master',
            let entSchema=[ {name:meta,n_m:0}];

            let idspace=null;
            // await 
            return  this.onChange_dynField(entSchema,text,wheres,idspace,true) ;// a promise , Data Service engine processing,  a promise , better  .catch

            // TODO implement .catch !!!!

            // returns  res={rows,reason} reason  'err' or 'runned'

        }
        return {reasor:'err'};
        }
    
    }// end refImplementation

    /*function MatchSt(){// std matcher status constructor 
        // most used :
        this.match='',//thematcheditemname;// if length=1 match ! , list of value col in query 
        this.id=0,// the key id 

        this.vmatch=null;

        this.type='dynMatch',//'the algo type expected to work  on this status',      
        this.idspace=[];
        this.cursor=[];// a matrix
        this.prompt=[];		// dyn only, used instead of entities , a dyn is like a multi value static single entity
         // but match still used to have the list of query pattern items
                 
                 
                 
         this.complete='wait/getting/got';			// the master matching status
       
       

       this.qeAdata=null;// optional session status used by multiturn  qeA matching algo , in base to the status of matching algo 
                   // {
                   //  idspace:null,// [45,77,89]
                   //  lastWhere,// [['city',id=12],,,]// the order match with the where field in rest query qs={where:['city','state']], id only if db see that the where is a relation matching with id=ext key
                   //						id to make easyer to run a new query with old where match 
                   //,} 
       
       this.nMPrompt;//			will be used to insert a .prompt[0], the bot suggested response in order to be set as context x next template by  
       
       
    }*/

