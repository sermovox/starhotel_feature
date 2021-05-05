const fs = require('fs');



// luigi 032020 + 032021
// see https://stackoverflow.com/questions/8393636/node-log-in-a-file-instead-of-the-console
let cfg,logsF='app.log',CATEGORY='DEF';
logs=function(text){// unused ??
    if(!text)return;
    let x='\n\n'+new Date().toUTCString()+'\n'+text
    ;//,fn=logs;
    fs.appendFile(logsF, x, function (err) {
        if (err) return console.log(err);
      //console.log('Appended!');
     });

}
 /**
 * Configurations of logger.
 */
const winston = require('winston');//npm install winston --save
const winstonRotator = require('winston-daily-rotate-file');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;




// see also 
//    https://coralogix.com/log-analytics-blog/complete-winston-logger-guide-with-hands-on-examples/
//    https://developer.ibm.com/tutorials/learn-nodejs-winston/  (section)

/* // see https://stackoverflow.com/questions/8393636/node-log-in-a-file-instead-of-the-console

const consoleConfig = [
  new winston.transports.Console({
    'colorize': true
  })
];

const createLogger = new winston.Logger({
  'transports': consoleConfig
});

const successLogger = createLogger;
successLogger.add(winstonRotator, {
  'name': 'access-file',
  'level': 'info',
  'filename': './logs/access.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});

const errorLogger = createLogger;
errorLogger.add(winstonRotator, {
  'name': 'error-file',
  'level': 'error',
  'filename': './logs/error.log',
  'json': false,
  'datePattern': 'yyyy-MM-dd-',
  'prepend': true
});
module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger
};
use :
const errorLog = require('../util/logger').errorlog;
const successlog = require('../util/logger').successlog;

*/


// https://www.npmjs.com/package/winston
/*
const logger1 = winston.createLogger({
    level: 'info',
    //format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' })
     //  new winston.transports.File({ filename: 'combined.log' }),
    ]
    ,
  format: format.combine(// see https://stackoverflow.com/questions/55387738/how-to-make-winston-logging-library-work-like-console-log
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    utilFormatter(),     // <-- this is what changed
    format.colorize(),
    format.printf(({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`),
  ),
  });*/

  


  const logger = winston.createLogger({
    level: 'info',
    //format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' })
     //  new winston.transports.File({ filename: 'combined.log' }),
    ]/*
    , format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple()
    )*/
    ,
  format: format.combine(// see https://stackoverflow.com/questions/55387738/how-to-make-winston-logging-library-work-like-console-log
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    format.label({
                   label: CATEGORY
               }),
  // utilFormatter(),     // <-- this is what changed
   // format.colorize(),
    format.printf(({level, message, label, timestamp}) => `${timestamp} ${label || '-'} ${level}: ${message}`),
  ),
  });



  
  logger.add( new winston.transports.File({ filename: 'combined.log' }));
  logger.add( new winston.transports.File({ 
    format:format.printf(({level, message, label, pgm,timestamp}) => `${timestamp} ${label || '-'} ${pgm || 'pgm?'} ${level}: ${message}`),
    filename: 'combFormat.log' }));


  let mode='debug';//process.env.NODE_ENV
  if (mode !== 'production') {// https://github.com/winstonjs/winston
    console.log(' logs: activated winston console ');
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

  const util = require('util');

function transform(info, opts) {// returns transformed info 
  const args = info[Symbol.for('splat')];
  if (args) { info.message = util.format(info.message, ...args); }
  return info;
}

function utilFormatter() { return {transform}; }// return  {transform:function (info,optn){}}// see 

module.exports = {
  logger:function(env_){cfg=env_;if(cfg.CATEGORY){CATEGORY=cfg.CATEGORY;};
  console.log('logs: returning logger: ',logger)
  return logger;}
};

/* use 
const logs = require('../helper/logs').logger;

Then you can log as:
{ 
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6 
}

logger.log('info', "127.0.0.1 - there's no place like home","caio");
logger.info("127.0.0.1 - there's no place like home");

*/






/*or better just in a file
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// custom simple logger
const logger = new Console(output, errorOutput);
// use it like console
//const count = 5;
//logger.log('count: %d', count);
// in stdout.log: count 5

or :
var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

*/
/* see https://techsparx.com/nodejs/howto/console.log.html
to override console in a module can do like :
console.log=(function() {
  var orig=console.log;
  return function() {
    try {
      var tmp=process.stdout;
      process.stdout=process.stderr;
      orig.apply(console, arguments);
    } finally {
      process.stdout=tmp;
    }
  };
})();  

*/
