const NLP = require('natural');// npm install natural
const fs = require("fs");
// Create a new classifier to train





var classifier ;//= new NLP.LogisticRegressionClassifier();
/**
 * Function to easily parse a given json file to a JavaScript Object
 * 
 * @param {String} filePath 
 * @returns {Object} Object parsed from json file provided
 */
function parseTrainingData(filePath,cb) {
    if(!filePath)cb(null);
   // return parseTrainingDatasync(filePath,cb);
    return parseTrainingDataasync(filePath,cb);
}
function parseTrainingDatasync(filePath,cb) {
    console.log(' parseTrainingData : file to read:', filePath);
    const trainingFile = fs.readFileSync(filePath);
    console.log(' parseTrainingData : training data  set:', trainingFile);
    cb( JSON.parse(trainingFile));

}
function parseTrainingDataasync(filePath,cb) {
    console.log(' parseTrainingData async : file to read:', filePath);
    fs.readFile(filePath, 'utf8', function(err, contents) { 
        console.log('parseTrainingData async  err',err);
      //  console.log(' parseTrainingData async : training data  set:', contents);

    if(!err){trainingData=JSON.parse(contents);}
    else {
        trainingData=JSON.parse('');
     
    }
    cb(trainingData);
    });
    //fs.readFile('DATA', 'utf8', function(err, contents) { console.log(contents);});
}


// Load our training data
var trainingData = null;


function initNLP(wd){
wd=wd||'ciao';
var natural=NLP;
 var tokenizer = new natural.AggressiveTokenizerIt();// non va 
if(false){
console.log('testing tokenize');

console.log(tokenizer.tokenize("my dog hasn't any fleas."));
console.log(tokenizer.tokenize("sto camminando con i suoni delle seghe , impianti urbani e anche impianti "));


// console.log(natural.PorterStemmer.stem("words"));
natural.PorterStemmerIt.attach();

console.log('testing stemmer');

// natural.PorterStemmer.attach();
console.log("i am waking up to the sounds of chainsaws".tokenizeAndStem());
console.log("i am waking up to the sounds of chainsaws".stem());
console.log("chainsaws".stem());

console.log("sto camminando con i suoni delle seghe".tokenizeAndStem());
console.log("sto camminando con i suoni delle seghe".stem());
console.log("seghe".stem());

console.log("impianti urbani".tokenizeAndStem());
console.log("impianti urbani ".stem());
console.log("impianti urbani e anche impianti ".stem());

console.log(wd.tokenizeAndStem());
console.log(wd.stem());

}

}

/**
 * Will add the phrases to the provided classifier under the given label.
 * 
 * @param {Object} classifier
 * @param {String} label
 * @param {Array.String} phrases
 */
function trainClassifier(classifier, label, phrases) {
    console.log('trainClassifier : Teaching set', label, phrases);

	//initNLP();// check !!!

    phrases.forEach((phrase) => {
//if(phrase=='entrata')




let wor=phrase.toLowerCase().tokenizeAndStem();

//wor=wor.map(function(i,val){if(val=='entrat')return 'entrar';else return val;});
let wor1=wor.map(function(val,i){if(val=='entrat')return 'entrar';else return val;});
        console.log(`Teaching single ${label}: ${phrase}`,' ::: ',wor,' old: ',phrase.toLowerCase(),' ::: ',wor1,);
        //classifier.addDocument(phrase.toLowerCase(), label);
        classifier.addDocument(wor1, label);
    });
}// end trainClassifier

function interpret(phrase,wheres) {// preferred choice based on : wheres={ent1:val1,,,,,};val can be null , 
                                    // means that ent is a where but non matched jet , so can be use to discriminate first and second choice if = prob value !
// returns 2 choices :
//  1: wheres satisfied , best value ,
//  2:  2nd value with  discriminating wheres 

    console.log('interpreting :', phrase,' , so stemmer : ',phrase.toLowerCase().tokenizeAndStem().join(' '));
	let wor=phrase.toLowerCase().tokenizeAndStem();
wor=wor.map(function(val,i){if(val=='entrat')return 'entrar';else return val;});// token not understood by tokenizer/steem
    const guesses = // guesses=[{value,label},,,]
        classifier.getClassifications(wor.join(' '));// guesses=[{value,label},,,]
    console.log(' matching qea natural , intClass, guesses: ', guesses);

    // waiting x SPLIW , just get rid of not where compatible list 

    /* sol a , todo insert reduce into map loop 
    // let reduced;
    guesses=guesses.map(function(val,i){
    for(let e in wheres){
        if(trainingData[val.label]&&!trainingData[val.label][e]==wheres[e]){return false;}// through away non compatible where
    }
    return val;
});*/

// original     const guess = guesses.reduce((x, y) => x && x.value > y.value ? x : y);// scan and take the item with max x.value 
// sol b 
let second;
const guess = guesses.reduce((x, y) => // x is the temporary reduced , y is cur item
    {  let take=true;
        // see if where property (valued) is matched in guesses entities, discard if no  
        //      ex  wheres{color:red}   trainingData[x.label]={,,,,,color:blu,,,}   >  discard
        for(let e in wheres){//use if(take)// if break dont work
        if(trainingData[x.label]&&wheres[e]&&trainingData[x.label][e]!=wheres[e]){
            take= false;break}// through away non compatible where
        }
           // take&&(x && x.value > y.value) ? x : y// scan and take the item with max x.value 
            if(take){if(x && x.value > y.value){ // scan and take the item with max x.value 
                // change reduced , store second choice
                //second=y; 
                if(!second||y.value>second.value) second=y;       
                return x ;// mantain x as partial max 

            }else{   
                return y;}
    }});
    let discr;//=[qeaitem.aprop1,,,,]// usually aprop1 is a meta property
   // for(let e in wheres){// calc what where can discriminate first second choices apart prob value :
    for(let e in trainingData[guess.label]){// calc what where can discriminate first second choices apart prob value :
        if(e != 'questions' && e != 'metadata'&& e != 'answer'&&
            trainingData[guess.label][e]!=trainingData[second.label][e]){
            // add a field 
            discr= discr||[];
            discr.push(e);

        }
    }

    return {
        probabilities: guesses,
        guess: guess.value > (0.7) ? guess.label : null,
        best:guess.label ,score:guess.value,
        second:second ? second.label : null, score2:second.value, discr
    };
}// end interpret
/**
 * Callback function for BotKit to call. Provided are the speech
 * object to reply and the message that was provided as input.
 * Function will take the input message, attempt to label it 
 * using the trained classifier, and return the corresponding
 * answer from the training data set. If no label can be matched
 * with the set confidence interval, it will respond back saying
 * the message was not able to be understood.
 * 
 * @param {Object} speech 
 * @param {Object} message 
 */
function handleMessage(bot, text) {/// text=msg.text,  old 
    var speech=bot;
    const interpretation = interpret(text);
    console.log('QeA IntCass: InternChatBot heard: ', text,'\n InternChatBot interpretation: ', interpretation);

if (interpretation.guess && trainingData[interpretation.guess]) {
        console.log('QeA IntCass: Found response :',trainingData[interpretation.guess]);
        //speech.reply(message, trainingData[interpretation.guess].answer);
        return trainingData[interpretation.guess].answer;
    } else {
        console.log('QeA IntCass: Couldn\'t match phrase')
       // speech.reply(message, 'Sorry, I\'m not sure what you mean');
        return null;
    }
}// end handleMessage

function handleMessageBF(bot, text) {/// text=msg.text
    var speech=bot;
    const interpretation = interpret(text);
    console.log('QeA IntCass: InternChatBot heard: ', text,'\n InternChatBot interpretation: ', interpretation);

if (interpretation.guess && trainingData[interpretation.guess]) {
        console.log('QeA IntCass: Found response :',trainingData[interpretation.guess]);
        //speech.reply(message, trainingData[interpretation.guess].answer);
        return trainingData[interpretation.guess];// like json in trainingData
    } else {
        console.log('QeA IntCass: Couldn\'t match phrase')
       // speech.reply(message, 'Sorry, I\'m not sure what you mean');
        return null;
    }
}// end  handleMessageBF

//function handleMessage1(bot, text) {/// >>>>>  Main interpret resolver , text=msg.text
function handleMessage1(wheres, text) {/// >>>>>  Main interpret resolver , text=msg.text
    // var speech=bot;
    // now bot is a where condition !
    //let wheres=bot;
    const interpretation = interpret(text,wheres);
    /*
    interpretation ={
        probabilities: guesses,
        guess: guess.value > (0.7) ? guess.label : null,
        best:guess.label ,score:guess.value,
        second:second ? second.label : null, score2:second.value, discr
        };
    */
    console.log('QeA IntCass: InternChatBot heard: ', text,' interpretation: ', interpretation);
    
if (interpretation.guess && trainingData[interpretation.guess]) {
        console.log('QeA IntCass: Found response :',trainingData[interpretation.guess]);
        //speech.reply(message, trainingData[interpretation.guess].answer);

        // call in async way ???
        return {data:trainingData,intent:interpretation.guess,intentclass:trainingData[interpretation.guess],answer:trainingData[interpretation.guess].answer,interpretation,score:interpretation.score,
        intent2:interpretation.second,score2:interpretation.score2,discr:interpretation.discr// in case we want to discriminate / refine on wheres not matched yet 
        };
    } else {
        console.log('QeA IntCass: Couldn\'t match phrase')
       // speech.reply(message, 'Sorry, I\'m not sure what you mean');
        return null;
    }
}// end handleMessage1

function init(trainF){// train file , see 
// For each of the labels(intent/class) in our training data,
// train and generate the classifier
//trainF='.'+trainF;
console.log('QeA IntCass: init Classifier file in ', trainF);
{trainingData=parseTrainingData(trainF,init1);// pass trainingdata=[ label/intent/class,,,,,] to init1 that will train the classifier using NLP obj

}


console.log('QeA IntCass: init exiting  ');

}// end init 

function init1(trainingData){
    console.log('QeA IntCass: init1  training data is   ', trainingData);
var i = 0;

//italiano ? so :
 var tokenizer = new NLP.AggressiveTokenizerIt();// non va
NLP.PorterStemmerIt.attach();

Object.keys(trainingData).forEach((element, key) => {
    console.log('QeA IntCass: training element  ', element);
    trainClassifier(classifier, element, trainingData[element].questions);
    i++;
    if (i === Object.keys(trainingData).length) {
        classifier.train();
        const filePath = './classifier.json';
        classifier.save(filePath, (err, classifier) => {
            if (err) {
                console.error(err);
            }
            console.log('QeA IntCass: Created a Classifier file in ', filePath);
        });
    }
});
}// end init1

console.log(' IntCass: ciao3');

var mymng={singleton:null};// store the v manager

var createclass=function(cfg){// the closure exposing voiceEnabler functions: do not store app status inside 

 console.log(' IntCass: **** TESTING PORTER ');
	initNLP(cfg);
	 classifier = new NLP.LogisticRegressionClassifier();
	// initNLP();


    console.log('QeA IntCass: createclass : Created a Classifier file , cfg is  ', cfg);
//var handlebars=hbs;// a instance 
	if(mymng.singleton)return mymng.singleton;
	//var 	pages=pagesConfFile,dialogtree=dialogtreeConfFile;

var voiceEnabler ={// voiceEnabler

    init:function(trainF){init(trainF);},// called from rootpage controller // from  file trainF pass recovered   trainingdata=[ label/intent/class,,,,,] to init1 that will train the classifier using NLP obj
        // SPLIW  : better split trained on 10 group based on 10 interval of same dimension of most used where field , so when classify call the group on which fall the where field !
    mystatus:5,
    getStatus:function(){return this.mystatus;},
    interpret:function(text){return interpret(text)},// classify with classifier the stemmed text , then return the choosed guess 
    answer:function(new_value, bot){        // from chhosed guess returns the answer
        return handleMessage(bot, new_value);
        },

    answerBF:function(new_value, wheres){
        return handleMessageBF(bot, new_value);
        },

    // use this :
    // async ??
    answer1:function(new_value, wheres){//  use this ,  from chhosed guess returns the class and other staff 
            return handleMessage1(wheres, new_value);
            }
} // end   voiceEnabler

mymng.singleton=voiceEnabler;
console.log(' IntCass: createclass returning intmng: ',voiceEnabler);
return voiceEnabler;

}	// end voiceEnablerFac
console.log(' IntCass:  ciao2');
//function setmymng(pagesConfFile,dialogtreeConfFile){// inutile
//	return mymng=voiceEnablerFac(pagesConfFile,dialogtreeConfFile);//.init(x,y);}
//module.exports = voiceEnablerFac();// require will put all this code in a closure and return the obj module.export. then it catches this obj to all future require call
module.exports = {cmng:mymng,create:createclass};

/* Configure the bot
// .* means match any message test
// The scopes we pass determine which kinds of messages we consider (in this case only direct message or mentions)
// handleMessage is the function that will run when the bot matches a message based on the text and scope criteria
Bot.hears('.*', scopes, handleMessage);

// Instantiate a chatbot using the previously defined template and API token
// Open a connection to Slack's real time API to start messaging
Bot.spawn({
    token: token
}).startRTM();
*/
