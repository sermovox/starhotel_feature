let mustacheF={ };

// global helper to be run in context of ......  
//mustacheF.nmList=function (map,step,clVars){// map can be the notmatching model list item =[{name:modelx},{}] on ask condition 
mustacheF.nmList=function (mapname,nmp,firstname,retAFunc){

    //can be :
    // firstname= fn  so first call fn='.', following  fn='-'
    // or 

    // firstname= count  so first call  count=1 following   count++


    let count,fnisN= !isNaN(firstname);
    if(fnisN)count=firstname;

    /*cases 

    nb in handlebars {{afunctionfactory }} {afunctionfactory is a factory. here the factory rendQuery is build by factory listAitem1 , 
        so  rendQuery=listAitem1(firstit,col)


            0) : array=[  [id,nome,,,,,]   ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
    {{#mustacheF.out}}$$list& 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches....array}}
             {{mustacheF.rendQuery}} 
          {{#vars.askmatches....array}}
    {{/mustacheF.out}}

    1) : cursor.rows=[  [id,nome,,,,,]   ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
    {{#mustacheF.out}}$$list&5& col 2 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches.dyn_medicine.param.cursor.rows}}
             {{mustacheF.rendQuery}} 
          {{/vars.askmatches.dyn_medicine.param.cursor.rows}}
    {{/mustacheF.out}}

    2a) : cursor.rows=[  [id,nome,,,,,]   ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
    {{#mustacheF.out}}$$list&5& col 2 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches.dyn_medicine.param.cursor.rows}}
             {{#mustacheF.rendQuery}} vorrai prendere la medicina $    {{&&let col;if(vars.matches.mod_wh=='when')col=3;col=col;&&}} 
             {{/mustacheF.rendQuery}}
          {{/vars.askmatches.dyn_medicine.param.cursor.rows}}
    {{/mustacheF.out}}


    2b) : cursor.rows=[  [[id,nome,,,,,]]  ,,,] lista i nomi della col n 2 of  matrix  >  map=nome
            dentro 
        {{#mustacheF.out}}$$list&5& col 2 
        le medicine che devi ancora prendere questa mattina sono :<br>
          {{#vars.askmatches.dyn_medicine.param.cursor.items}}
             {{#mustacheF.rendQuery}} vorrai prendere la medicina $   {{#.}} {{&&let col;if(vars.matches.mod_wh=='when')col=3;col=col;&&}} {{/.}}
             {{/mustacheF.rendQuery}}
          {{/vars.askmatches.dyn_medicine.param.cursor.items}}
    {{/mustacheF.out}}



    TO COMPLETE UPDATE : 
        nb $ means col 2 del iesimo item in cursor.items 
           {{#contextL}}  {{#.}}  // start  iterate uCx the unnamed Context passed , contextL=aobj=[uC1,uC2,,,,] , uCx is not a obj with fields {f1:a,f2:b ..}, ex is a []
                                nb named is  contextL=[{name:{},id:'9'},] so 
                                     {{#contextL}}  {{name}}
                {{5}}  // 
            {{#.}}


    */

/*

>>> nmList returns  the entity/model name  : mapname or, (if mapname is a model defined in excel,) its voice notmatchedprompt npm
                    adding 'a anche' if mapname is different from firstname(in the middle of a father list context = this!)


params :
 // usually  map is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
 // returns the value name of the model ( as specified in $$modelname:) or its voice name if specified in its definition as property of vars.excel

*/

//console.log('   ********** nmList called clVars is ',clVars );console.log('   ********** first name  is ',firstname );
   //  let excel_=step.values.excel;
   let ret;// error 
   let morecompl=retAFunc;// can render a funcion template
    if(mapname){// a notmatched model , look in excel if the model is descibed and get the notMatched prompt if there is 

        let retur;
        if(nmp){// the model notmatched name 
            ret= '  '+nmp;
        }else{
            ret= ' '+mapname;
        }
        // if(clVars.notmatlist[0]==map.name)return ret;// first item

        if(fnisN){

            // firstname is a number count,  so first call  count=1 following   count++
            retur= 'numero '+count;
        }else{    

            // firstname is a string  fn , so first call fn='.', following  fn='-'
            if(firstname=='.'||(firstname!='-')&&firstname==mapname)retur= '';// first item
            else retur= ' inoltre ' ;
        }

        if(!morecompl){// return the value rendered by function using  context (the calling f context)
            return retur+ret;

        }else{// return function(text,render) to be called with text to render 

            return function(text,render) {

                if(text) {// a {{function}} 

                    return retur+render(text).replace('$',mapname);
                }
                else{
                    return retur+ret;
                }
            }

        }


     }
}

mustacheF.qeA=function(qstring){


}







    myBoundF=function (text, render,stepp_) {// {{#vars.excel.out}} staff !
// is clear what is the context ??? mustache will overwrite what we did ?
        // >> to be bound to this=step before returning !
        // calle with : {{#vars.excel.out}}$$xxx&usualhandlebar {{/vars.excel.out}}  
        /// xxx is the param , usualhandlebar is mustache template used here to compose the template 
        //  template is rendered here using render(template)

        // check this 

        // we need to extract steps
        let stepp=stepp_||this.step;// ???? only if is in root ctx this contains step




        let param,param2,param3,param4,template=text,itr1;// the $$xxx& first part of text 
        // text=text.substring(after&);
        let oplength=0;
        if (text.substring(0, 2) == '$$') { // $$param&param2&template
            template=text.substring( 2) ;
            itr1=template.split('&');// 
            oplenght=itr1.length;
            if(itr1.length>4&&template.substring(0, 2) == 'if'){// 4 param only x if 
                param=itr1[0]; param2=itr1[1];param3=itr1[2];param4=itr1[3];
                
                //template=itr1[4];// last is template
                template=text.substring(2+4+param.length+param2.length+param3.length+param4.length);
                oplength=5;
            }else 
            
                // TODO correct the length as in above if 
                if(itr1.length==4&&template.substring(0, 4) == 'miss'&&template.substring(0, 4) == 'list'){// 3 param
                param=itr1[0]; param2=itr1[1];param3=itr1[2];template=itr1[3];// last is template




            }else if(itr1.length==3){// 2 param + template 
                param=itr1[0]; param2=itr1[1];template=itr1[2];// last is template
            }else if(itr1&&itr1[0]&&itr1[1]){// 1 param only
                param=itr1[0];template=itr1[1];
            }
            // template inizia con \n !!???
        }
    if(param){// so found $$ and not null param 

	        if(param=='if'){// 4 param) 

 /*           example of template execution(passing current context )  on askA msg :
            {{#mustacheF.out}}$$if&vars.excel.avar&==&pippo&
                <template >
                </template>
                 {{/mustacheF.out}}

*/ 

// 25032020 : instead of if : TODO idea out can be like in condition pattern a regex or a even a function or a code to eval 

        let value_,vs={vars:stepp.values};
        // can use jVar as in conversation or must chech for eval error (cant find property of undefined !)
        try{
        eval( "value_ = vs." + param2 );// or use the parser in conversation.js, that means jVar ?
        } catch(e){value_=null;}
        if(value_){
        if(param3=='=='){if(value_!=param4)template=null;
        }else if(param3=='!='){if(value_==param4)template=null;
        }else if(param3.charAt(0)=='>'){if(value_<=param4)template=null;
        }else if(param3.charAt(0)=='<'){if(value_>=param4)template=null;
        }
        }else template=null;

        }
        
        else  if(param=='ff'){// 2 param) 

            /*           example of template execution(passing current context )  using eval :
                       {{#mustacheF.out}}$$ff&
                       let iff=true;vars.mod_pippo={};step.goon=5;let out=iff;
                       &
                           <template >
                           </template>
                            {{/mustacheF.out}}

                         example of template execution(passing current context )  using Function
                       {{#mustacheF.out}}$$ff& 
                       let poppo=context.vars.pippo;// or poppo=vars.pippo;
                       if(poppo)return true;
                       &
                           <template >
                           </template>
                            {{/mustacheF.out}}
           
           */ 
           
           // 25032020 : instead of if : TODO idea out can be like in condition pattern a regex or a even a function or a code to eval 
           
                   let value_,context={vars:stepp.values,state:stepp.state},vars=stepp.values;// also 
                   // can use jVar as in conversation or must chech for eval error (cant find property of undefined !)
                   try{
                   value_=eval(  param2 );// use context.vars ( or vars)  or context.state 
                   } catch(e){value_=null;}
                   if(value_){
                    ;
                   }else template=null;
           
                   }
                   
                   else if(param=='list'&&(itr1.length>1)){// > 2-4 param  , its a more complex list display then just std mustache array+ static func

 /*         example of template extract on askA msg :
            .......
              {{#mustacheF.out}}$$list&  + 
                                        col&adyn_ask&   3 param  (itr1.length=4)  obsoleto 
                                        or
                                        col&            2 param ( if string matrix )  ex :  {{#vars.askmatches[adyn_ask].param.itemS}}
                                        or
                                        no param        1 param='list' (itr1.length=2) ( custom string array )
            <template start >
              ** puoi  specificare  {{#vars.excel.queryL}} se vuoi automaticamente listare la colonna col del adyn_ask query cursor loaded by onchange on : vars.askmatches[adyn_ask].param.itemS
                                    o un tuo string matrix o un array string array {{#arr}} ex : {{#vars.askmatches[adyn_ask].param.itemS}}
                                            {{mustacheF.rendQuery}} will list the above
                                    {{/vars.excel.queryL}}
                                    chiudere array {{/arr}}
                oppure continuare o ritornare al menu principale 
            <template end >
            {{/mustacheF.out}}
            ..........

            nb template start and and must not have '&' !!!



            example1 :
             {{#mustacheF.out}}$$list&11&
            {{#vars.askmatches.dyn_rest.param.item.res.item}}
            {{mustacheF.rendQuery}}
            {{/vars.askmatches.dyn_rest.param.item.res.item}}
            {{/mustacheF.out}}
 

            example2
                {{#mustacheF.out}}$$list&5& col 5 
                le medicine che devi ancora prendere questa mattina sono :<br>
                {{#dyn_medicine.param.cursor}}
                 {{mustacheF.rendQuery}}
                {{/dyn_medicine.param.cursor}}
                {{/mustacheF.out}}

*/
            let excel_=stepp.values.excel;
            
            let col,cursor,firstit=null;// you can put in the template any array of string and {{rendQ}} will list the col but if you specify param2 i can customize it and add e in between 


            if(itr1.length==4&&param4){
            if(stepp.values.askmatches[param4]&&stepp.values.askmatches[param4].param&&stepp.values.askmatches[para4].param.itemS)cursor=stepp.values.askmatches[param4].param.itemS;// a dynask query result set by a dym match as :vars.askmatches[adyn_ask].param.itemS
 
                excel_.queryL=cursor;// optional if use ** .  must be available in context to be referencied in template 
                // firstit=cursor[0][param2];
                col=param3;
            }else if(itr1.length==3&&param2){// the col 
                col=param2;
                }

            // now i can use a function factory or just to set a closure param of a static function , start with the factory : 
                mustacheF.rendQuery=listAitem1(firstit,col);// firstit is now useless, param3 is the col , remember to use queryL as context array inside 
            

        }else if(param=='miss') {// render list of a jet not matched model used in dyn ask dyn_rest, 1,2 param 



  /* *****  review 042020  {{#mustacheF.out}}$$miss&.....    **************++

  ricordando che 
	testing a previuos step condition named  askA ,
		if the  condition is a model (start with $$xmodelname:... or $%....) ,it  will be registered if mf=match or mf=nomatch :
		      step.values.askmatches[previous.collect.key][mf].push(modelname)

si costruisce clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]};   po is a modname
	dove notmatlist e' riempito con tutti i model ( condition che hanno pattern starting con $$modname.... o $%...  , 
		condition di askA ask il cui msg template contiene il costrutto (e in futuro) askB, optional parameter 
	che :


        // considerati i model che sono nel pattern $$ e $% di un condition ( di askA, ask in cui nel msg si trova {{#mustacheF.out}}$$miss&...)  e in futuro askB)
        // si riempie clVars.notmatlist con nomi di model che :
        //  - non sono wh model di dyn_ask matchati e
        //  - non matchano secondo matches.model.match
        // quindi si costruisce la funzione mustacheF.rendnotmatch=listAitem() che messa come nel template di un array come notMatchL  lista gli item.name del suo context notMatchL

	TILL NOW ONLY askA is processed !!!!!!
    // TODO : ++ prompt for models on   this step + adds  the interesting goto : param2=some interesting goto collect key
    // so do another loop with if(param2)askname=param2;

****************************
 */



            // problem with length of param just start with no & in followingtemplate 

            /* example :
             {{#mustacheF.out}}$$miss&dyn_rest&
    puoi chiedere  <br> 
x {{vars.matches.mod_Serv.vmatch}}
<br>
          {{#vars.excel.notMatchL}}
             {{mustacheF.rendnotmatch}}
          {{/vars.excel.notMatchL}}
     o continuare <br>
 x o ritornare al menu principale 
{{/mustacheF.out}}

            */

          /*
        miss: BUILD , in its step msg with a askA having some models tested ($$ + $%) with a important goon chained askB  ,
         - a callable rendnotmatch function and 
         - its context notmatchedmodel list , vars.excel.notMatchL,   
         operating on its containing template 

          example of template extract on askA msg :
          {{#mustacheF.out}}$$miss&optionalseconddyn_ingoonchain_askB&
            <template start >
            vuoi  specificare  
          {{#vars.excel.notMatchL}}
             {{mustacheF.rendnotmatch}}
          {{/vars.excel.notMatchL}}
         oppure continuare o ritornare al menu principale 
          <template end >
        {{/mustacheF.out}}

        >>>>  NO '&' on template start and end !!!!!!!!!!




          // format : {{#mustacheF.out}}$$miss&dyn_rest&puoi anche specificare {{#vars.excel.notMatchL}}  e anche  {{mustacheF.rendnotmatch}}
          //          {{/vars.excel.notMatchL}} grazie  {{/mustacheF.out}}
          // ex : {{#mustacheF.out}}$$miss&dyn_rest&template...inside can be called mustacheF.rendnotmatch

           {{#mustacheF.out}}$$miss&dyn_rest& puoi anche specificare  
                {{#vars.excel.notMatchL}}
                    e anche  {{mustacheF.rendnotmatch}}
                {{/vars.excel.notMatchL}}
                grazie
            {{/mustacheF.out}}

          */



          /* so call {{#vars.excel.out}}$$miss&template{{/vars.excel.out}}
          // template=templBeforeList+
          // {{#vars.excel.notMatchL}}
          //    want herereallyreturnfromnmList{rendnotmatch}}
          // {{/vars.excel.notMatchL}}
          // +templAfterList
          // {{/vars.excel.out}}

 */



   //  set a array in mustache context to list 
   let excel_=stepp.values.excel;
   // no will be void when called in next step !! let mustacheF=stepp.values.mustacheF;// insert functions

   let line =stepp.curLine,askname ;
   let clVars={};//clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]};
   // if (line && line.collect&& line.collect.key)askname= line.collect.key;

   //excel_.notmatlist can be found in values.askmatches[askname] that is filled with match and not matced model when a askkey test condition 
   // clVars.notmatlist=stepp.values.askmatches[askname].split('|');
// now sotract askkey model $$ matching request 

// per iniziare dare parametro con nome del askkey da testare (sullo stsso thread?) so would b better to add to values.excel a map : keyname > [modeltotestwith$$|$%]

// instead we are interested on get the list of all condition testing models (regex starting with $$ or $%) on:
// -  current askkey or ( as goon) 
// -  askey next in tree that i want to prompt 1 step before ( as goon will try to match 2 step with same user)


// remember when ask condition find a model to check,it  will be registered if mf=match or mf=nomatch
//      step.values.askmatches[previous.collect.key][mf].push(amatch)

    clVars.notmatlist=[];
    let am,ma,ii,it;
    if (line && line.collect&& line.collect.key)askname= line.collect.key;// this key , should be lastwherein_typeaserv

    // TODO : ++ prompt for models on   this step + adds  the interesting goto : param2=some interesting goto collect key
    // so do another loop with if(param2)askname=param2;
    let vars=stepp.values;
    if(askname){// fills clVars.notmatlist with the near asks models didnot matched jet from matching list askmatches and modellist modsonask[

        //method A old , long :
    am=vars.askmatches[askname];// testing ask  present ask matches status :am={matches:[],match:not$%match,nomatches:[]} , to calc the model still to  match

        ma=vars.modsonask[askname];// models that are testing for get matches in testing ask  ( $$ or $% ), a string array

    
    for(ii=0;ii<ma.length;ii++){// for each model tested in the ask (ma[ii]) find if was already matched



        // in pratica : si scartano i model che sono where di dyn_ask che matchano dyn_ask=excel[modelname].mod_wh_Of 
        //           tra questi si considerano quelli che non matchano ( in matches)



        // old comments 
        // check id the model is alredy matched 
        // still do not match
        let ism=false;// this model (ma[ii]])is not matched and isrequired only as a where join to query the master dyn mod_wh_Of
            if(vars.excel[ma[ii]]&&vars.excel[ma[ii]].mod_wh_Of&&vars.askmatches[vars.excel[ma[ii]].mod_wh_Of] // main=vars.excel[ma[ii]].mod_wh_Of : tell to put the model in nmp notmatchedprompt list only if the main entity is matched
                &&vars.askmatches[vars.excel[ma[ii]].mod_wh_Of].match)    {                 // if mod_wh_Of not exist try to put in nmlPrompt 
                ;}else{
                // method A complicated and long :
                //if(am){ for(it=0;it<am.matches.length;it++){
                //    if(am.matches[it].key==ma[ii]){ ism=true;break;}
                //}else isn=true;

                // method B easy and fast:
                if(vars.matches[ma[ii]]&&!vars.matches[ma[ii]].match)ism=true;

                }


            
        if(!ism)clVars.notmatlist.push(ma[ii]);
    }
    }

   // excel_.notmatlObj=
   clVars.notMatchL=[];//=[{name:thenotmname}] why not simple string array ?
   excel_.notMatchL=clVars.notMatchL;// must be available in context to be referencied in template 
   // excel_.notmatlist.forEach(key => excel_.notmatlObj.push({name:key}));

   // fill notMatchL from notmatlist
   if(clVars.notmatlist)clVars.notmatlist.forEach(key => clVars.notMatchL.push(
                                    {name:key
                                    // some other param to specialize the item renderer function 
                                    })
                        );
//stepp=stepp;

   // rendnotmatch will be called inside the out template ttt usually inside a notmatlist obj (built here)
   //   so with notmatlist obj as this context .it will be passed with the closure var step to an external function nmList 
   //   nmList return a text processing the  notmatlist items and the closures (AAD +myBoundF)calculated text 


    // >>> BUILD the callable {{}} motmatching function displayng 
   // >>>>>  now make available rendnotmatch function (using nmList()) that can be called in template to render in this function out with miss procedure : {{#mustacheF.out}}$$miss&dyn_rest&template...
//   mustacheF.rendnotmatch=listAitem(step,clVars.notmatlist[0]);// in its Array context ( put in  this)
    mustacheF.rendnotmatch=listAitem(stepp,null);// in its Array context ( put in  this)
/*
   mustacheF.rendnotmatch=(function(){// add a rendnotmatch function with last matching  result step  on its enclosure
    
    // PROBABLY NOW WE HAVE STEP JUST IN CONTEXT SO THIS closure is useless 
    

       // the closure AAD
    let step=stepp;// or step_
    // other myBoundF vars
    // anyway make available clVars too 
    return function (){ // nb no text/template to work on , if had a template to work on function(template=text,render)
        // remember functions in mustache :
        // a (rendnotmatch) function will be called with the mustache father context/this , that if it is a #array will be  this=Aarray_item 
        // if it has a template ({{#rendernotmatch}}template{{#rendernotmatch}}) it can be recovered in text param and rendered after filtered with 
        //      render(filter(template));

    // **** usually rendernotmatch is called inside a mustache template of array notMatchL previously prepared, so this is a  notMatchL item 
        console.log('  ***** we are in rendnotmatch and this is : ' ,this);
        // usually  this is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
        //return mustacheF.nmList(this,step,clVars)}// call an external function ( can be put in the same excel obj ? !)
        return mustacheF.nmList(this,step,clVars.notmatlist[0])}// call an external function ( can be put in the same excel obj ? !)
   })();
   */


   // so template , can use excel.nmList(this,step) via excel.rendnotmatch so can be : 
   //   template=' puoi anche aggiungere {{#notmatlObj}} * {{vars.excel.rendnotmatch}} {{#notmatlObj}} grazie'
   // msg='... ora {{#vars.excel.out}}$$miss&template{{/vars.excel.out}}

   /*
   excel.nmList=function (this,step){// this can be the notmatching model list item =[{name:modelx},{}] on ask condition 
   let excel_=step.excel;
    if(this.name){// a notmatched model 
        if(excel_[this.name]&&excel_[this.name].notMatPr){// the model notmatched name 
            return ' , '+excel_[this.name].notMatPr;
        }else{
            return ' '+this.name;
        }


    }

   }*/

   // now 
    // 1: render template that can applay notmatlist obj  to a function that render each not matched model item having the model dir in 
    //          rendnotmatch=function(){this.    }
    //          as the function can see its closure var i will see the model drectives as : ......
    // 2: render template that can applay notmatlist string as {{.}}

        /*
remember mustache npm instructions :

{
  "name": "Tater",
  "bold": function () {
    return function (text, render) {
      return "<b>" + render(text) + "</b>";
    }
  }
}

Template:

{{#bold}}Hi {{name}}.{{/bold}}      // {{#bold}}context = Hi {{name}}.    

so function bold will be called by mustache and if it return a function will be called with ({{#bold}}context )

-------
now :if father was a array of string :

now :if father was a array objs :
 {{#beatles}}   // beatles can be a array of obj or string :


 // if array of jobs, each obj item produces a line where when found {{acontextobj}}:
 {{acontextobj}}
    if acontextobj is a string / template :
            it is rendered ,
    if  acontextobj is a function 
            it was run with this= array current obj item 

 example:* {{name}} {{#func2}}a template tobe rendered by func2 {{name2}}  {{/func2}} 

 //  if array of string, each string item produces a line where the string  are accessible as {{.}} 
example : . {{.}}  {{#func2}}a template tobe rendered by func2 {{.}} {{/func2}} 

{{/beatles}}

      */

      /* // nb this=step , text will be rendered using context_ set in conversation.js, remembering HHJJ  :
      
        
      
        // so 
        //      run a context 
         
        text=' magari puoi darmi qualche missing come 
        {{[mod1,mod2]}}



        - luogo  {{}}



      */

      console.log(' : out$miss is rendering its template in which is abilited mustacheF.rendnotmatch that displays the items of its context (vars.excel.notMatchL), item is the {name:entityname,,,}',
      '\n it passes item to calls mustacheF.nmList that displays the entity name having available in params also  step and \n clVars={notmatlist:[n1,,],notMatchL:[{name:n1},,,]} :',clVars);

       
       
}// end miss out function 
else;

     if(template)return  render(template) ;
    else return


    }// end if param 
    else{// no param found or no $$ found >  render template as is 
        return  render(template) ;
    }


    function listAitem(step,firstname){// case out miss , a function factory, to render the item.name of a father context  askArray =[{name:'amodel/entity_name_testedas_$$_$%_inAsk'},,,] 
        // example msg= .... {{#askArray}}    {{generatedfunction}}{{#askArray}}
        // so :  {{#vars.excel.notMatchL}} {{mustacheF.rendnotmatch}} {{/vars.excel.notMatchL}}

        // returns this.name ( the entity name) (or if exist the notmatched prompt (in the model/entity description) npm=excel[this.name].notMatPr ) preceded by 'e anche' if is different from firstitem 

// PROBABLY NOW WE HAVE STEP JUST IN CONTEXT SO THIS closure is useless 
if(firstname==null)firstname='.';// first
let count=0;

// the closure AAD
//let step=stepp;// or step_
// other myBoundF vars
// anyway make available clVars too 
return function (){ // nb no text/template to work on , if had a template to work on function(template=text,render)
// remember functions in mustache :
// a (rendnotmatch) function will be called with the mustache father context/this , that if it is a #array will be  this=Aarray_item 
// if it has a template ({{#rendernotmatch}}template{{#rendernotmatch}}) it can be recovered in text param and rendered after filtered with 
//      render(filter(template));

// **** usually rendernotmatch is called inside a mustache template of array notMatchL previously prepared, so this is a  notMatchL item 
console.log('  ***** we are in rendnotmatch and this is : ' ,this);
// usually  this is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
//return mustacheF.nmList(this,step,clVars)}// call an external function ( can be put in the same excel obj ? !)
let npm,fn;
if(step.values.excel&&step.values.excel[this.name]&&step.values.excel[this.name].notMatPr)npm=step.values.excel[this.name].notMatPr;
if(firstname=='.'){firstname='-';fn='.';}else fn=firstname;
if(count++<2)return mustacheF.nmList(this.name,npm,fn)}// call an external function ( can be put in the same excel obj ? !)
return null;

}
function listAitem1(firstname,col){// case out list , col is the row column index to display 
    // if inside a string matrix  context :
    //          a function factory, to render the item[col] of a father context   vars.askmatches.dyn_rest.param.itemS =the querred subarray of
    //          dyn_ask  data (rows query cursor)=[ [ '','',''],,,,]

    // if inside a string array  context :
    //       
    //          [ ,,,,,]

                                                                                                                                
// example msg= .... {{#vars.askmatches.dyn_rest.param.itemS}}    {{generatedfunction}} {{#vars.askmatches.dyn_rest.param.itemS}} 
// so :  {{#vars.excel.notMatchL}} {{mustacheF.rendnotmatch}} {{/vars.excel.notMatchL}}

// returns this.name ( the entity name) (or if exist the notmatched prompt (in the model/entity description) npm=excel[this.name].notMatPr ) preceded by 'e anche' if is different from firstitem 

// PROBABLY NOW WE HAVE STEP JUST IN CONTEXT SO THIS closure is useless 


// the closure AAD
if(firstname==null)firstname='.';// first

// 29042020 :
let count=0;


// other myBoundF vars
// anyway make available clVars too 
return function (){ // nb no text/template to work on , if had a template to work on function(template=text,render)
// remember functions in mustache :
// a (rendnotmatch) function will be called with the mustache father context/this , that if it is a #array will be  this=Aarray_item 
// if it has a template ({{#rendernotmatch}}template{{#rendernotmatch}}) it can be recovered in text param and rendered after filtered with 
//      render(filter(template));
let fn,el;
// **** usually rendernotmatch is called inside a mustache template of array notMatchL previously prepared, so this is a  notMatchL item 
console.log('  ***** we are in out list a col of a matrix ({{#mustacheF.out}}$$list&5&...}})  and this is : ' ,this);
// usually  this is a  notMatchL item ,={name:thenotmatchedname},clVars={notmatlist:['po','pi'],notMatchL:[{name:'po'},{name:'pi'}]}; 
//return mustacheF.nmList(this,step,clVars)}// call an external function ( can be put in the same excel obj ? !)

//if(firstname=='.'){firstname='-';fn='.';}else fn=firstname;// first call firstname='.', fn='.', following  firstname='-', fn='-'

// 29042020 :
if(firstname=='.'){firstname='-';fn='.';count=1;}else {fn=firstname;count++;}// first call firstname='.', fn='.', count=1 following  firstname='-', fn='-', count++


if(Array.isArray(this)){el=this[col];
                        if(Array.isArray(el)&&el.length==1&&Array.isArray(el[0]))el=el[0];// 3 dim array is cursor.items case only
                    }
                    else el=this;
//return mustacheF.nmList(el,null,fn,true)}// will add e anche  dopo il primo el . call an external function ( can be put in the same excel obj ? !)

// 29042020 :
return mustacheF.nmList(el,null,count,true)}// will add e anche  dopo il primo el . call an external function ( can be put in the same excel obj ? !)

}
    
    }// end myBoundF=

    mustacheF.out__= function (mystep) {// this=step , bound in conversation.parseTemplatesRecursive() BUT reset by mustache to its context 
        // this function (returning) register a handler function called by mustache when finds {{#out}}ttt{{/out}} 
        //  then moustache call immediately the handler passing (ttt,render) whre render is a cb that will render a template that 
        //  is built filtering ttt 
        //  as we thought mustache do not bind the out function (found in context already bound to step) 
        // we use it to pass step to handler using the out closure var step_ or ........
    
        // here handler=myBooundF , does :
        // myBooundF receives a ttt template that will be transformed in a final template that can be rendered using render(template)
        // as we thought mustache do not bind the myBooundF handler (found in context) we have bound bind out to step
        // so here this should be this=step 
        // when the handler function will be called it will build in excel context some status obj and set new function 
        // to be available to the template ttt ....................
    
        // let step_=this;// can be used in returned function 
        // so :
        let step_=this.step;// is null , try to see what is specifically  this 
        return function(){
        return function (templ,render){



            // can use some obj in scope 
           return  myBoundF.call(this,templ,render,mystep);//.bind(step_);// probably don work and useless so delete it 
        }   }
    
    }

    mustacheF.out_= function () {// this=step , bound in conversation.parseTemplatesRecursive() BUT reset by mustache to its context 
        // this function (returning) register a handler function called by mustache when finds {{#out}}ttt{{/out}} 
        //  then moustache call immediately the handler passing (ttt,render) whre render is a cb that will render a template that 
        //  is built filtering ttt 
        //  as we thought mustache do not bind the out function (found in context already bound to step) 
        // we use it to pass step to handler using the out closure var step_ or ........
    
        // here handler=myBooundF , does :
        // myBooundF receives a ttt template that will be transformed in a final template that can be rendered using render(template)
        // as we thought mustache do not bind the myBooundF handler (found in context) we have bound bind out to step
        // so here this should be this=step 
        // when the handler function will be called it will build in excel context some status obj and set new function 
        // to be available to the template ttt ....................
    
        // let step_=this;// can be used in returned function 
        // so :
        let step_=this.step;// is null , try to see what is specifically  this 
    
// *********************************    check it :

    return myBoundF;//.bind(step_);// probably don work and useless so delete it 
  }// ends out 

function modsOnAsk(script) {// from a conversation script create a map : ask > list of model tested in ask
    // we  want to know what model will be tested on script asks on all threads
    // in onchange  main dyn_ask will test major models gathered by y many asks that are visited in the dialog
    // so in a ask we'll find the models that we test fox matching in the ask and the most important goon ask in its condition routing 


// **************************    // seems modsOnAsk do not give right ouput !!!


    let modsOnAsk_ = {
        //aask:[model1,model2]
    };
    console.log(' modsOnAsk *** script is : ', script)

    for (var thread in script) {// thread is a name 
        if (script.hasOwnProperty(thread)) {

            // thread is a []
            let thread_ins = script[thread];// a array 

            for (let p = 0; p < thread_ins.length; p++) {// line: a step in thread
                let mods = [];
                let line = thread_ins[p], name;// name is a askvar
                if (line.collect && line.collect.options)// line has a key to collect
                // 
                {
                    let paths = line.collect.options;
                    name = line.collect.key;// line key name


                    for (let pp = 0; pp < paths.length; pp++) {// a condition on step  ( compreso default)
                        let condition = paths[pp];

                        if (condition.type && condition.type === 'regex') {
                            if (condition.pattern.substring(0, 2) == '$$' || condition.pattern.substring(0, 2) == '$%') {
                                let itr = condition.pattern.indexOf(':');

                                if (itr > 0) {
                                    entity = condition.pattern.substring(2, itr);
                                    mods.push(entity);
                                }

                            }
                            //if(entity){// a condition in line will test a model=entity
                            //	mods.push(entity);}

                            // console.log('** modsOnAsk( , evaluating ask ',name,' model test : ',mods); 

                            // if(mods.length>0)modsOnAsk[name]=mods;


                        }


                    }
                    console.log('** modsOnAsk , in thread ', thread, ' evaluating ask step ', p, '  with collect var  ', name, ' testing model : ', mods);
                    if (mods.length > 0) modsOnAsk_[name] = mods;

                }// a step with ask
            }// end a step
        }// thread
    }
    return modsOnAsk_;
    
}// ends modsOnAsk
module.exports ={ mustacheF,modsOnAsk};