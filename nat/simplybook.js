const rest = require('./rest.js').jrest;// module alredy initialized in bot.js , just get the congigured singlethon (called rest as in nlpai, see there hou to call a json get/post)
// Load process.env values from .env file
require('dotenv').config();
const SimplyBook_ = require("simplybook-js-api");

// this library will connect to ext book portal interfacing it with its api. if native simplybook will use its api library SimplyBook_
const interf = 1;// 0 relay to simplybook:SimplyBook_
// 1 bookcms will relay  to a custom book portal with api defined in :
// auth : see prototype.createAuthService 
//          in this impl we interface a bookcms api that uses token. the token is got from a 
const autoRegCMS=true;// in case of interf = 1, associate the proxy to a default bookcms server (dont need to register in bookendpoint[name_] set in .env )

let inst;// simpleBook

// create a custom api obj (inst) (same interface than original SimplyBook_ = require("simplybook-js-api"))
//  the obj can  interface a simply book compliant book server or just be a relay/embed to a simplybook api library( a module to simply connect to simplybook server)
const SimplyBook = function (name_, t1_, t2_, user_, pass_) {// constructor
    /*
    ex: new SimplyBook(// simplybook std app : sermovox entry
        'sermovox', // the book portal resource/site
        '58d46aa077c75410c89b7289816cbd5894d01f7b42c1da142ae62772738270ef',// token that identofy the resources to be auth 
        'be29914b99aa6ce55808c02cae3eccb5e7986c9ff4c230b064e8ff62fa6de5c7',
        'admin',// admin user name  to connect for ask the auth
        'luigiDOluigi');// password , its non correct but we already have the token ! should  correspond



        this proxy , using the same interface of simplybook library will connect the portal name_ to the bot  , managing conection permission 

        from portal name the proxy can tell the portal to connect , recovering some connection info/params (set in bookendpoint)
        in case book cms portal , that is a portal that just give/send info required by the interface to the  portal (2 banks: main and demo)
          and has also managing page to set/update portal data


        */






    this.name = name_; this.t1 = t1_; this.t2 = t2_; this.user = user_; this.pass = pass_;
    if (interf == 0) inst = new SimplyBook_(name_, t1_, t2_, user_, pass_);// create the relayed simplybook server if use that server
    else {
        console.log( ' new create book cms instance  x user: ',this.user,' endpoint name: ',this.name,'  process.env.book_proxy_url: ',process.env.book_proxy_url);
        if (process.env.book_proxy_url&&autoRegCMS

            // GTT      && this.name == 'sermovox'

        ) {// better if the site name compete to bookcms site 


            //bookendpoint = { sermovox: 
                bookendpoint[name_]=

                /*book__proxy_url=https://bot.sermovox.com/bookcms
book_proxy_token=token-123
book_proxy_adminpass=xyz1

                */

               {// for a endpoint named sermovox that are the data to connnect the server: url, the name of admin user and its passord and the token to use book server api
                    url: process.env.book_proxy_url,// main api server domine
                    users: {
                        admin: { pass: process.env.book_proxy_adminpass, token: process.env.book_proxy_token }// token is for api to get services,performers and slot matrix, pass is to connect admin users to set book data for a endpoint (passord put in .env) and get the token

                    }
                }

           // };

        }
    };
    SimplyBook.prototype.createAuthService = function () {
        if (interf) {
            /*
                createAuthService get, from configured data passed on constructor, the params to ask a oauth 2 token, usually needs a user and password to connect to auth server , 
                 the token to identify the resources to ask, and the name of the book site
                 here this library have already got a static token to access to site resources so just check that the user has a credential in site (here user and password can be mapped)
                when calling createPublicService(righttoken), from token, given by the auth server, this code get all the resources (user=usr(token)={url,apitokenOfBookServer})to comnnect the remote book server : {tk,url} tk is the token used by bookcms api and 
            */


            let token,
                eP = bookendpoint[this.name];// recover portal resource connection data , just set a moment ago !!!
            if (eP) {
                let mu, resource;// resource is the book site name : parrucchieri, medici,.....
                // createAuthService will 
                // from config info in the connection request (eP) it 
                //  simulate a ext auth server call (access to bookcms resources info )(need user and credential) that does:
                //  - if the user is registered and check its pass
                //  - build/find  a token to use with our cmsbook server api to give following access to api (users[token_] = { tk:token),,,
                //  - give a library token_ (token_ = 'T.....')to the library user that will be used here  as register entry to give the service on authorized bookcms resources (using token ) when it will send following api request
                //      so if in following api library AAA call , the AAA handlers endpoint (getUnitList,...)  recognize the token_  so  we know the token to use in  bookcms api to get the info available for that token
                //              a token will make available some resouces x the caller ( user that asked acces x some resources in a time slot )
                if ((mu = eP.users[this.user])) {// the user declared to the librry correspond to the user in portal/proxy
                    if (mu.pass == this.pass) {// user password check he simulate a book portal auth rervice call to get the token x the site 

                        token = 'T' + Math.random();// some admin call will get the token (but here we used a previous saved released token ) that access a url server that 1:knowing the token give a specific site data or 2:here we add site to server api 
                        //                   , choose 2 mapping resource name as name , nb should be timed token and will expire !
                        resource = this.name;// the book site name
                        users[token] = { tk: mu.token, url: eP.url, resource };// timetoken can give the long living token to connect user this.user to endPoint of url 
                    }
                }
                console.log( ' createAuthService x user: ',this.user,' endpoint name: ',this.name,' created token: ',token,' for resource: ',resource,' url: ',eP.url)
            }
            return {
                getToken: (function () {
                    return async function () {

                        if (token) return { data: token };// data= {1:{id:'1',,,,,},,,,,}// 1 or '1' ?  , 1 is a string ! ST3


                    }
                })()

            };
        }
        else return inst.createAuthService();
    }

    SimplyBook.prototype.createPublicService = function (token) {// returns publicService={getUnitList,,,,}, can ask book api x the site  using cfg data set in user={} created by createAuthService()={getToken}
        if (interf) {
            let user = usr(token);// {tk:mu.token,url:eP.url,name}// name is the site/resource used as a url param 

            return {// api call obj used to ask service AAA obj 
                getUnitList: (function () {
                    return async function () {
                        let result = await apiRequest(user, 'getunitlist', params = {}, 'GET');
                        if (result) return { success: 'true', data: result };// data= {1:{id:'1',,,,,},,,,,}// 1 or '1' ?  , 1 is a string ! ST3


                    }
                })(),
                getFirstWorkingDay: (function () {
                    return async function (uId) {
                        /*
                        let result = await apiRequest(user, '/api/getfirst', params = { uId }, 'POST');
                        if (result) return { success: 'true', data: result };// data= {1:{id:'1',,,,,},,,,,}// 1 or '1' ?  , 1 is a string ! ST3
                        */
                        return;

                    }
                })(),
                getStartTimeMatrix: (function () {
                    return async function (datefrom, dateto, serviceId, performerId, qty) {
                        let result = await apiRequest(user, 'getstarttimematrix', params = { datefrom, dateto, serviceId, performerId, qty }, 'POST');
                        if (result) return { success: 'true', data: result };// data= {1:{id:'1',,,,,},,,,,}// 1 or '1' ?  , 1 is a string ! ST3
                    }
                })(),
                getEventList: (function () {// ok
                    return async function () {
                        let result = await apiRequest(user,

                            //geteventlist
                            'geteventlist'
                            , params = {}, 'GET');
                        if (result) return { success: 'true', data: result };// data= {1:{id:'1',,,,,},,,,,}// 1 or '1' ?  , 1 is a string ! ST3
                    }
                })()

            };
        } else return inst.createPublicService(token);
    }


    function usr(token) {
        return users[token];// {tk:mu.token,url:eP.url}
    }
}
let users = {};// users tokens users={timetoken:{tk:mu.token,url:eP.url},,,}
let bookendpoint = {// this are the proxy book connection params to the book portal (or bookcms) // >>>>>>>>>  will be overwritten by constructor for the base implementation using .env cfg param
                    // so in baseimplementation there is only one book portal that can give book data about a resource (the site name)
                    // infact api url will be build adding url to /resource+.....

    sermovox: {// for a endpoint named sermovox that are the data to connnect the server: url, the name of admin user and its passord and the token to use book server api
        url: '192.168.1.14:3033',
        users: {
            admin: {
                pass: 'luigixyz',// admon maintenance in portal , not used here
                token: 'token-123'
            }// token is for api to get services,performers and slot matrix, pass is to connect admin users to set book data for a endpoint (passord put in .env) and get the token

        }
    }
    ,    'sermovox_centro servizi speciali': {// for a endpoint named sermovox that are the data to connnect the server: url, the name of admin user and its passord and the token to use book server api
        url: '192.168.1.14:3033',
        users: {
            admin: {
                pass: 'luigixyz',// admon maintenance in portal , not used here
                token: 'token-123'
            }// token is for api to get services,performers and slot matrix, pass is to connect admin users to set book data for a endpoint (passord put in .env) and get the token

        }
    }
    ,    'sermovox_centro-servizi-speciali': {// for a endpoint named sermovox that are the data to connnect the server: url, the name of admin user and its passord and the token to use book server api
        url: '192.168.1.14:3033',
        users: {
            admin: {
                pass: 'luigixyz',// admon maintenance in portal , not used here
                token: 'token-123'
            }// token is for api to get services,performers and slot matrix, pass is to connect admin users to set book data for a endpoint (passord put in .env) and get the token

        }
    }

};

//async function apiRequest(uri, params = {}, method = 'GET') {
// async function apiRequest(token, url,uri, params = {}, method ='GET') {// get only?   (user, url, uri, params = {}, method = 'GET')
async function apiRequest(user, uri, params = {}, method = 'GET') {// get only?,   user : connection info to give required request response
    let token = user.tk, url = user.url, resource = user.resource;
    let myurl = url + user.resource + '/' + uri;// ex : https://bot.sermovox.com/bookcms/api/:projects/:resource/geteventlist
    myurl += '?access_token=' + token;//+'&resource='+resource;
    // or 
    //   params.resource=resource;params.token=token;


    /*    let req = {
            uri: this._config.uri + uri + '?access_token=' + this._config.token,
            headers: {
                'content-type': 'application/json'
            },
            method: method,
            form: params
        };
        debug('Make request to Botkit CMS: ', req);
        return new Promise((resolve, reject) => {
            request(req, function (err, res, body) {
                if (err) {
                    debug('Error in Botkit CMS api: ', err);
                    return reject(err);
                }
                else {
                    debug('Raw results from Botkit CMS: ', body);
                    let json = null;
                    try {
                        json = JSON.parse(body);
                    }
                    catch (err) {
                        debug('Error parsing JSON from Botkit CMS api: ', err);
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
                        resolve(json);
                    }
                }
            });
        });*/

    let result;
    //  result= await  rest(myurl,method,{user:null},{"Content-Type": "application/json"}, true,null) // no extra header,true:send urlencoded (calc from map obj data {locale:'it_IT',text:term}, no qs)
    console.log('simplybook  doing a rest method: ', method, ' url: ', myurl, ' param: ', params);
    result = await rest(myurl, method, params, { "Content-Type": "application/json" }, false, null) // no extra header,true:send urlencoded (calc from map obj data {locale:'it_IT',text:term}, no qs)
        .catch((err) => {
            console.error(' REST got ERROR : ', err, ',  so set better param');

        });
    console.log('simplybook  done a rest method: ', method, ' getting: ', result);
    if (result) return JSON.parse(result);
}
module.exports = SimplyBook;
