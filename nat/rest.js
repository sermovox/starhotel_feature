/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

this rest returns a promise , so
use in async func using await :
var response = await promisedFunction().catch((err) => { console.error(err); });
// response will be undefined if the promise is rejected

  >>>   so the resolve will be called withsome params and the Promise object will call .then registered function with the same param 
        now await will use a .then function  that just returns THE FIRST PARAM ??? as a result 
        >>>>  ifuse await call resolve with just 1 (obj) param !!!
                                
*/



/* using http module 
https://blog.bearer.sh/node-http-request/   or https://nodejs.dev/learn/making-http-requests-with-nodejs
const http = require("http")


// http post 

let body = JSON.stringify({
  title: "Make a request with Node's http module"
})

let options = {
  hostname: "postman-echo.com",
  path: "/post",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  }
}


http
  .request(options, res => {
    let data = ""
    res.on("data", d => {
      data += d
    })
    res.on("end", () => {
      console.log(data)
    })
  })
  .on("error", console.error)
  .end(body)



// http get easier

let options = new URL("https://postman-echo.com/status/200")

let myRequest = http.request(options, res => {
  // Same as previos example
  res.on('data' d=> {
    //...
  })
  //... etc
})

myRequest.on("error", console.error)
myRequest.end()


// http normal get 

let options = new URL("https://postman-echo.com/status/200")

let myRequest = http.request(options, res => {
  // Same as previos example
  res.on('data' d=> {
    //...
  })
  //... etc
})

myRequest.on("error", console.error)
myRequest.end()

  */


  /*
  request get :
  request=require('request')
 let rest_=    function rest(url, params, method,outmap,limit){
    if(!(isArray(outmap)&&outmap.length==2))outmap=null;
    let req = {
        uri: url ,//+ '?access_token=' + this._config.token,
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
         
    
      return new Promise((resolve, reject) => {
        request(req, function (err, res, body) {
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
                   var jsonr={},len;
                  {len=json.length;if(len>limit)len=limit;}
                    for(var i=0;i<len;i++){
                        if(outmap){jsonr.push([json[i][outmap[0]],json[i][outmap[1]]]);}else{jsonr.push(json[i])};
                    }
                    resolve(jsonr);
                }
            }
        });
      
    });
    
    
    
    
    //return prom;
    
    
}
*/
//const URL = require('url');
let http,https,request;
 module.exports ={
     init:function(http_,https_,request_){http=http_;https=https_;request=request_},
     jrest:function(url,method,data,head, urlenc,qs){// data ={prop1:value1,,,}  ,
                                                      //  post only param : qs, urlenc . IF want url encode data we can  provide qs instead of data map obj
         // use :
         // response = await jrest("http://postman-echo.com/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new",GET,null)
         // response = await jrest("http://postman-echo.com/integers",GET,{num:1,min:1,max:10,col:1,base:10,format:'plain',rnd:'new'})
         // response = await jrest("postman-echo.com/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new",GET,null)
         // response = await jrest("https://postman-echo.com/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new",GET,null,{Authorization:'bearer ....'})
                  // response = await  jrest("https://postman-echo.com/someendp',POST,{title: "Make a request with Node's http module"})
         //   NO : or  response = await jrest("https://postman-echo.com/integers",GET,{num:1,min:1,max:10,col:11,format:'plain',rnd:'new'})?? NO
         // .catch((err) => { console.error(err); });  or  .catch(console.error);

         // .catch((err) => { console.error(err); });  or  .catch(console.error);

         // if(response)data=JSON.parse(response);
         let du,h=http;
         if(url.substring(0,4)=='http'){
         if((du=url.charAt(4))==':');else if((du=url.charAt(4))=='s')h=https;
         else return;// or return a rejected promise 
         }else url='http://'+url;

         if(http){if(method=='GET')return new Promise((resolve, reject) => jhttpget(h,url,data,head,resolve,reject));
                 else if(method=='POST')return new Promise((resolve, reject) => jhttppost(h,url,data,head,qs, urlenc,resolve,reject));}
     }
     /*
     ,
     rest:function(url,method,data){// data ={prop1:value1,,,}
     // use :
     // response = await jrest("https://postman-echo.com/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new",GET,null)
     //   or  response = await jrest("https://postman-echo.com/integers",GET,{num:1,min:1,max:10,col:11,format:'plain',rnd:'new'})
     // .catch((err) => { console.error(err); });  or  .catch(console.error);


     // response = await  jrest("https://postman-echo.com/someendp',POST,{title: "Make a request with Node's http module"})
     // .catch((err) => { console.error(err); });  or  .catch(console.error);

     // if(response)data=JSON.parse(response);

     if(http){if(method=='GET')return new Promise((resolve, reject) => httpget(url,data,resolve,reject));
             else if(method=='POST')return new Promise((resolve, reject) => httppost(url,data,resolve,reject));}
     }*/

 }

 function jhttpget(h,url,data,head,resolve,reject){//data not used ,  we can have   url with qs OR  url is host and  data is a literal obj 
// url=:http......


/*
 let options = new URL(url);//url="https://postman-echo.com/status/200" + '?access_token=' + this._config.token&......
 let qs;
 if(data_){
   qs=toParam(data_);
  if(qs){
  options = {
    hostname: url,//'whatever.com', or 'whatever.com/integers'
    // port: 443,
    path: '/?'+qs,//'/todos',// path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new', 
                  //  or '/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    method: 'GET'
  }
}
}
console.log(' REST is request a GET with : ',options);

let myRequest = http.request(options, res => {

  let data = ""
  res.on("data", d => {
    data += d
  })
  res.on("end", () => {
    resolve(data);
  })
});

myRequest.on("error", reject);
myRequest.end();}

*/


// from https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html

/*
const options = {
  hostname: 'httpbin.org',
  path: '/get',   // also '/planetary/apod?api_key=DEMO_KEY' ???
  headers: {
      Authorization: 'authKey'
  }
}*/
// accept data instead of qs 
if(url.indexOf('?')<0&&data)
url+='?'+toParam(data);// should be used : /?


let opt;
if(head)// opt={   eaders: { Authorization: ''}}
opt={headers:head};else opt={};
h.get(url,//'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', 
opt,
(resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log('rest responded ',data);
    resolve(data);
  });

}).on("error", (err) => {
 reject// console.log("Error: " + err.message);
});








 }



function jhttppost(h, url, data_, head, qs, urlenc, resolve, reject) {// data_ is a map obj, qs is query string .
                                                                       //  encJson=true needs data_,
                                                                      //   encJson=false  needs qs or  data_
  let body, head_;


    if (!urlenc) {
      if (!data_) {
        body={};// no data , data cant be provided from qs if we want to encode data with  json format
      } else {// case data_ + json enc :
        body = JSON.stringify(data_);//{    title: "Make a request with Node's http module"  })
        head_= {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        };
      }

    } else {// case encode data as x-www-form-urlencoded
      if (qs) {
        body = qs;

      } else {// get qs from form/data_ map obj 
        if (data_) {
          body = toParam(data_);
        } else {
          body='';// no data_, no qs , so request post with no data 
        }

      }
      head_= {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body)
      };

    }
  
  let options = {
    // xxxxx  hostname: url,//"postman-echo.com",// can i "postman-echo.com/post" ?
    //path: "/post",// port: 443,
    method: "POST",
    headers: head_
  };
  if (head) Object.assign(options.headers, head);
  h.request(
    url,// or in xxxxx
    options, res => {
      let data = ""
      res.on("data", d => {
        data += d
      })
      res.on("end", () => {
        resolve(data);
      })
    })
    .on("error", reject)//console.error)

    
    // .write(body).end(); or : 
    .end(body)// launch on json data
}


  //  see https://stackoverflow.com/questions/27822162/encode-object-literal-as-url-query-string-in-javascript 
  //  http://jsfiddle.net/mg511z7w/

// var data = {"apple": [{"kiwi": "orange"}, {"banana": "lemon"}], "pear": "passion fruit"};

var stringifyParam = function(data, topLevel, keyProp) {
        var string = '';
        for (var key in data) {
            if(keyProp && topLevel[keyProp] ) {
                if ( (topLevel[keyProp] instanceof Array&&topLevel[keyProp].indexOf(data[key])!==0) ) {
                    string += keyProp;
                } else if ( (topLevel[keyProp] instanceof Object&&topLevel[keyProp][key]) ) {
                    string += keyProp;
                }
            }
            if (typeof(topLevel[key])=='undefined') {
                string += '[' + key + ']';
            }
            if (data[key] instanceof Array) {
                string += stringifyParam(data[key], topLevel, key);
            } else if(data[key] instanceof Object){
                string += stringifyParam(data[key], topLevel, key);            
            } else {
                if (typeof(topLevel[key])!='undefined') {
                    string += key;
                }
                string += '=' + data[key];
                string += '&';
            }
        }
        return string;
    },
    toParam = function(data){
        var string = stringifyParam(data,data);
        //return encodeURI(string.substring(0,string.length-1).split(' ').join('+'));// case 1 :  ' '  >  +
        return encodeURI(string.substring(0,string.length-1));// case 2 :   ' ' > %20
    };

//console.log(toParam(data)); //apple%5B0%5D%5Bkiwi%5D=orange&apple%5B1%5D%5Bbanana%5D=lemon&pear=passion+fruit < case 1
//                            "apple%5B0%5D%5Bkiwi%5D=orange&amp;apple%5B1%5D%5Bbanana%5D=lemon&amp;pear=passion%20fruit"  < case 2

