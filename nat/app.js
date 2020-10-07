let rest,cfg,application;

module.exports =
function init(db_,rest_,appcfg,session,appid){// consider only rest_,appcfg .

// 08102020 a spa ctl factory bank , the ctl can call external express ctl 
                    // when app intent is got onbegin will call this init(null,rest_,appcfg,null,appid) :
                    // so the factory[appid] is called , it  will put the init cfg in closure and returns the ctl  function 



    // can we build fwAskOnChange automatically from models.js ???
    
        // db=db_; 
           rest=rest_;// they will be propagated into service and fwHelper via fwbase

        // old : 
        // application=fsmfactory(appcfg);// init default application ctl
        // service and fwCb will be added later soon !!!!
        // they can be said injected in sense that they are instantiated outside the fw by user configuration code and registered on fw 
        //  ( that in service obj , that is the same as startup in .net, , or using some registration call to (service.js).register(servicename,func), 
        // than called in user cb ( onchange()) by name service.somaregisterd injected service)
        // ALL will be in context/scope of user onchange convo cbs !

    if(!appid)appid='def';
        if(fsmfactory[appid])return fsmfactory[appid](appcfg);
    }

let fsmfactory = {
    
    
    def:function (cfg_) {// a fsm initilized / a rest server access point 
    let cfg = cfg_;
    let botstatus = { processing: 0, log: [] };
    return {// application

        exprCtl:async function(){// calledby some post
           if(cfg&&cfg.url) return await rest(cfg.url);
        },

        begin_def: function (cmd, request) {
            // old :
            // new user comes in ( comes out after a time lag cause channel reset )
            // the dialogstack active dialogid is cmd
            // to see if it was a new dialogstack we must have beginDialog info flag ( todo) , or observ that session is a void obj
            let log_='begin-'+cmd+'-'+JSON.stringify(request);
            botstatus.log.push(log_);
            //logger({user:'',text:log_},'event','');
            console.log('application endpoint begin_def called. def thread called for cmd : ', cmd,', request: ', request);

        },
        post:function(action, vars, session, request) {// request is a qs : ?ask=pippo&colore=giallo  (actionurl,convovars,session,req);
            let log_='post-action:'+action+'-request:'+JSON.stringify(request)+'-session:'+JSON.stringify(session);
            botstatus.log.push(log_);
            //logger({user:session.user,text:log_},'post','');
            transaction(action, vars, session, request);
            console.log('application endpoint post called. session : ', session, '\n vars ', vars);

        },
        post_aiax_fw_chain:function(action, vars, session, request) {
            // here we implement a middleware organized by rooting level (ctl/app routing) and adapter to interface ext service (ve)
            // that will receive and respond data in model format to onchange that use model and directive fw support 

            console.log('appserver post_aiax_fw_chain called session : ', session, '\n vars ', vars);

        }
    }
}
}
function transaction(action, vars, session, request) {// web server routing sys session = app user status; vars=app user view status
    // will work on session and less on vars (i/o)

    if (action.length > 5 && action.substring(0, 4) == 'tour') {
        let action_ = action.substring(5);
        if (action_ == 'start') {// action='tour-start'
            // we got in new path so rest appstate to 
            session.curprocess = 'path';// cultural or storico is state contained in convo.vars ...
            // .....  access and updates app status session + convo status vars



        } else if (action_ == 'reset') {
            // we got in new path so rest appstate to 
            session.curprocess = null;// cultural or storico is state contained in convo.vars ...
            // .....  access and updates app status session + convo status vars
        } else if (action_ == 'set') {
            session.path = request.path;
        } else if (action_ == 'book') {// action tour-book
            session.booked = request.book;// request={book:res};
           // logger({user:session.user,text:session.booked},'book','');

        } else if (action_ == 'next') {
            if (session.curprocess == 'path') ;//  ?????   session.path++;
        } else;
    } else if (action == 'register') {
        // call server to get user data 
        // await user=get()
        console.log('application endpoint post called. def thread triggered/replay for service/cmd : ', request.service,'\n session: ', session, '\n vars ', vars);
        let user = request.user;// from convo.vars.user
        session.user = user;// will be available as vars.appWrap.session.user
        session.vuser='luigi';
        session.processing=request.service;// from userbefore()
        let log_='app-register-on-session';
        // botstatus.log.push(log_);
       // logger({user:session.user,text:log_},'app','');

        ;
    }
   
}