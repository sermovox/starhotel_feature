const intClass = require('./natural/intClass');

// ?? require('dotenv').config();//??



// var myarg=process.argv.slice(2);
var testwd;//=myarg[0];// some text to try 
var clssF ; //the manager 'intent resolver'

module.exports=// copy of db part of  refImplementation 

// todo : give ref that in fwHelpers were found in closure !! : db, rest ....

  function (train_f) {//  nlpai interface , from a std param do call to specific ai service according to url qs  ?agent=order Url:'http://192.168.1.15:8000/parse'

clssF=intClass.create(testwd);
clssF.init(train_f);// the train classes
return clssF;// = require('./natural/intClass').create(testwd)
//console.log('train =', process.env.QeATrain);

  }







// INTENT/CLASS Matching : 
// from keyboard:
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 

   let text=d.toString().trim() ;
   console.log("you entered: [" + text + "]");
///*
            var answ = clssF.answer(text, null);
            if (answ == null) {
                console.log('no answer found ');
              //  bot.say('Sorry, I\'m not sure what you mean');
            }
            else {
                console.log('answer found ', answ);
            }
//*/
  });


 /*
var readline = require('readline');


var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('guess> ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "right") rl.close();
    rl.prompt();


            var answ = clssF.answer(text, null);
            if (answ == null) {
                console.log('no answer found ');
              //  bot.say('Sorry, I\'m not sure what you mean');
            }
            else {
                console.log('answer found ', answ);
            }

}).on('close',function(){
    process.exit(0);
});
*/
// */








