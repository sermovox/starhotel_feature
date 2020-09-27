/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function

https://stackoverflow.com/questions/4442752/how-do-i-convert-a-json-string-to-a-function-in-javascript?noredirect=1&lq=1
https://stackoverflow.com/questions/57147270/how-to-return-a-javascript-function-in-an-api
https://stackoverflow.com/questions/5415886/load-js-from-external-site-on-fly
How do you dynamically load a javascript file from different domain?
Load js from external site on fly
valid nodejs code in string to javascript object
How can I require a dynamically generated module from a string?
Load node.js module from string in memory
https://coderwall.com/p/cmz24w/node-js-code-snippet-dynamically-load-all-javascript-in-a-folder
https://javascript.info/modules-dynamic-imports
https://stackoverflow.com/questions/14911684/how-to-dynamically-load-a-script-node-js







*/

console.log('pescato');
let context='palla';
let ocb={};
function looseJsonParse(obj){
    return Function('"use strict";let contextc=7;return (' + obj + ')')();// return a function with its 'lexical string ' closure and in global context
}
console.log(looseJsonParse(
   "{a:(4-1), b:function(){}, c:new Date()}"
));


// init carica nel bank le funzioni definite in diversi modi.
//  noi siamo interessati a caricare le Function(myftext1) dove myftext1 è f con parametri : 
//	- di botkit onchange 
//	 + i parametri del voice framework : esempio : dyn_medi_f.call(this,new_value, convo, bot,script,ask), this is the directive obj 

(function init(){// a closure
  context1=10;// attention is a global var (better declare in close as var context1=10;
  let contextc=2;// a closure var
  let myf=function myf(conv,text){// myf has a closure scope
    conv.log(text+context1+contextc);
    conv.log(this);
  }
  ronchange('pippo',myf);// registerOnchange
    let myftext='function myf(conv,text){    conv.log(text+context1+contextc);    conv.log(this);}';
  let myftext1='  arguments[1].log(arguments[0]+context1);    conv.log(this);';
    ronchange('poppo',looseJsonParse(myftext));
  ronchange('pappu',Function(myftext1));// mancano la def dei parametri della funzione 

})();

let lo={log:function(t){console.log(t);}};
lo.log('pesca');

function ronchange(nam,myf){myf.bind(context);ocb[nam]=myf;}// register a function on bank ocb
 function rtime(a){let af=ocb['pippo'];af(a,'poppo');// run registered af on global context
                   ocb['pippo'](a,'poppo');// run registered func on ocb context
                  ocb['poppo'](a,'pistola');// run registered func on ocb context
                  // ocb['pappu'](a,'pistolino');// Error: arguments[1].log is not a function
                  }
  rtime(lo);// run runtime

   
/*

console.log('pescato');
let context='palla';
let ocb={};
function looseJsonParse(obj){
    return Function('"use strict";return (' + obj + ')')();
}
console.log(looseJsonParse(
   "{a:(4-1), b:function(){}, c:new Date()}"
));
(function init(){
  context1=10;
  let myf=function myf(conv,text){
    conv.log(text+context1);
    conv.log(this);
  }
  ronchange('pippo',myf);
    let myftext='function myf(conv,text){    conv.log(text+context1);    conv.log(this);}';
  let myftext1='  arguments[1].log(arguments[0]+context1);    conv.log(this);';
    ronchange('poppo',looseJsonParse(myftext));
  ronchange('pappu',Function(myftext1));// mancano parametri

})();

let lo={log:function(t){console.log(t);}};
lo.log('pesca');
function ronchange(nam,myf){myf.bind(context);ocb[nam]=myf;}
 function rtime(a){let af=ocb['pippo'];af(a,'poppo');
                   ocb['pippo'](a,'poppo');
                  ocb['poppo'](a,'pistola');
                   ocb['pappu'](a,'pistolino');
                  }
  rtime(lo);
*/
   
