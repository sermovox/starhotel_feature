/**
 * 
 */

const { Botkit ,BotkitConversation} =require('botkit');
var fs = require('fs');

module.exports = function(controller) {
/* see web adapter
    controller.middleware.receive.use(function(bot, message, next) {
        
          // do something with bot or message
        
          // always call next, or your bot will freeze!
          var mylog='\n'+new Date().toUTCString()+' middleware.format is sending to cli '+message.user+'  waitEnd '+message.waitEnd+' text : '+message.text;
          fs.appendFile('bot.log', mylog, function (err) {
              if (err) return console.log(err);
            //console.log('Appended!');
           });
          
          next();
         });



}
module.exports = function(controller) {
//return;
    controller.middleware.ingest.use(function(bot, message, next) {
        
          // do something with bot or message
        
          // always call next, or your bot will freeze!
          var mylog='\n'+new Date().toUTCString()+' middleware.format is sending to cli '+message.user+'  waitEnd '+message.waitEnd+' text : '+message.text;
          fs.appendFile('bot.log', mylog, function (err) {
              if (err) return console.log(err);
            //console.log('Appended!');
           }); 
          next();
         });

controller.middleware.send.use(function(bot, message, next) {
    var mylog='\n'+new Date().toUTCString()+' middleware.format is sending to cli '+message.user+'  waitEnd '+message.waitEnd+' text : '+message.text;
   fs.appendFile('bot.log', mylog, function (err) {
       if (err) return console.log(err);
     //console.log('Appended!');
    });
     next();
   });
   */
}
