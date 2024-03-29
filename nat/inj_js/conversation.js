"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialogWrapper_1 = require("./dialogWrapper");
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const mustache = require("mustache");
const debug = require('debug')('botkit:conversation');
// pistola 

const lv=6;// log level 
const console_={log:
function (frst,...args){
    if(Number.isInteger(frst)){
        if(lv>frst)return;

    }else{
        args.unshift(frst);

    }
    console.log(args);

}}
/**
 * An extension on the [BotBuilder Dialog Class](https://docs.microsoft.com/en-us/javascript/api/botbuilder-dialogs/dialog?view=botbuilder-ts-latest) that provides a Botkit-friendly interface for
 * defining and interacting with multi-message dialogs. Dialogs can be constructed using `say()`, `ask()` and other helper methods.
 *
 * ```javascript
 * // define the structure of your dialog...
 * const convo = new BotkitConversation('foo', controller);
 * convo.say('Hello!');
 * convo.ask('What is your name?', async(answer, convo, bot) => {
 *      await bot.say('Your name is ' + answer);
 * });
 * controller.dialogSet.add(convo);
 *
 * // later on, trigger this dialog by its id
 * controller.on('event', async(bot, message) => {
 *  await bot.beginDialog('foo');
 * })
 * ```
 */
class BotkitConversation extends botbuilder_dialogs_1.Dialog {
    /**
     * Create a new BotkitConversation object
     * @param dialogId A unique identifier for this dialog, used to later trigger this dialog
     * @param controller A pointer to the main Botkit controller
     */
    constructor(dialogId, controller) {
        super(dialogId);// .. and surely set this.id=dialogId
        console.log(' botkitconvo requested id ',dialogId);


        this._beforeHooks = {};
        this._afterHooks = [];
        this._changeHooks = {};
        this._changeHooksA = {};// after conditions run
        this.script = {};
        this._controller = controller;

        // se copyright :luigi added let vctl=require('./nat/onChange.js')controller.addPluginExtension('vCtl', vctl);
        this._vcontroller=controller.plugins.vCtl;
        if(this._vcontroller)this.mustacheF=this._vcontroller.mustacheF;// store singleton for mustache function (  cant be set in status (/vars/values) as it wont store/persist functions )


            // DIRECTIVE status under control of loop directive algo
            // TODO basic loop control : count/repeat= loop cont repetition,see runstep() ,condDefInd : the condition to match if maxrep is got , maxnmp : max number of model to put in notmatchedprompt ( see out..miss)
        this.dir={asks:{model:{}},count:0,condDefInd:-1,condDefNam:null,maxrep:10,maxnmp:3};// count used in runstep(),condDefInd used in ask onStep()
                    // nb directives values are get also in ask using custom field started with dir-


        // Make sure there is a prompt we can use.
        // TODO: maybe this ends up being managed by Botkit
        this._prompt = this.id + '_default_prompt';
        this._controller.dialogSet.add(new botbuilder_dialogs_1.TextPrompt(this._prompt));
        return this;
    }
    /**
     * Add a non-interactive message to the default thread.
     * Messages added with `say()` and `addMessage()` will _not_ wait for a response, will be sent one after another without a pause.
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     *
     * ```javascript
     * let conversation = new BotkitConversation('welcome', controller);
     * conversation.say('Hello! Welcome to my app.');
     * conversation.say('Let us get started...');
     * ```
     *
     * @param message Message template to be sent
     */
    say(message) {
        this.addMessage(message, 'default');
        return this;
    }
    /**
     * An an action to the conversation timeline. This can be used to go to switch threads or end the dialog.
     *
     * When provided the name of another thread in the conversation, this will cause the bot to go immediately
     * to that thread.
     *
     * Otherwise, use one of the following keywords:
     * * `stop`
     * * `repeat`
     * * `complete`
     * * `timeout`
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     *
     * ```javascript
     *
     * // go to a thread called "next_thread"
     * convo.addAction('next_thread');
     *
     * // end the conversation and mark as successful
     * convo.addAction('complete');
     * ```
     * @param action An action or thread name
     * @param thread_name The name of the thread to which this action is added.  Defaults to `default`
     */
    addAction(action, thread_name = 'default') {
        this.addMessage({ action: action }, thread_name);
        return this;
    }
    /**
     * Cause the dialog to call a child dialog, wait for it to complete,
     * then store the results in a variable and resume the parent dialog.
     * Use this to [combine multiple dialogs into bigger interactions.](../conversations.md#composing-dialogs)
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     * ```javascript
     * // define a profile collection dialog
     * let profileDialog = new BotkitConversation('PROFILE_DIALOG', controller);
     * profileDialog.ask('What is your name?', async(res, convo, bot) => {}, {key: 'name'});
     * profileDialog.ask('What is your age?', async(res, convo, bot) => {}, {key: 'age'});
     * profileDialog.ask('What is your location?', async(res, convo, bot) => {}, {key: 'location'});
     * controller.addDialog(profileDialog);
     *
     * let onboard = new BotkitConversation('ONBOARDING', controller);
     * onboard.say('Hello! It is time to collect your profile data.');
     * onboard.addChildDialog('PROFILE_DIALOG', 'profile');
     * onboard.say('Hello, {{vars.profile.name}}! Onboarding is complete.');
     * ```
     *
     * @param dialog_id the id of another dialog
     * @param key_name the variable name in which to store the results of the child dialog. if not provided, defaults to dialog_id.
     * @param thread_name the name of a thread to which this call should be added. defaults to 'default'
     */
    // luis 092020 here addQuestion adds a ask with a condition that will have action beginDialog  and a execute specification
    addChildDialog(dialog_id, key_name, thread_name = 'default') {
        this.addQuestion({
            action: 'beginDialog',
            execute: {
                script: dialog_id
            }
        }, [], { key: key_name || dialog_id }, thread_name);
        return this;
    }
    /**
     * Cause the current dialog to handoff to another dialog.
     * The parent dialog will not resume when the child dialog completes. However, the afterDialog event will not fire for the parent dialog until all child dialogs complete.
     * Use this to [combine multiple dialogs into bigger interactions.](../conversations.md#composing-dialogs)
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     * ```javascript
     * let parent = new BotkitConversation('parent', controller);
     * let child = new BotkitConversation('child', controller);
     * parent.say('Moving on....');
     * parent.addGotoDialog('child');
     * ```
     *
     * @param dialog_id the id of another dialog
     * @param thread_name the name of a thread to which this call should be added. defaults to 'default'
     */
    addGotoDialog(dialog_id, thread_name = 'default') {
        this.addMessage({
            action: 'execute_script',
            execute: {
                script: dialog_id
            }
        }, thread_name);
        return this;
    }
    /**
     * Add a message template to a specific thread.
     * Messages added with `say()` and `addMessage()` will be sent one after another without a pause.
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     * ```javascript
     * let conversation = new BotkitConversation('welcome', controller);
     * conversation.say('Hello! Welcome to my app.');
     * conversation.say('Let us get started...');
     * // pass in a message with an action that will cause gotoThread to be called...
     * conversation.addAction('continuation');
     *
     * conversation.addMessage('This is a different thread completely', 'continuation');
     * ```
     *
     * @param message Message template to be sent
     * @param thread_name Name of thread to which message will be added
     */
    addMessage(message, thread_name) {
        if (!thread_name) {
            thread_name = 'default';
        }
        if (!this.script[thread_name]) {
            this.script[thread_name] = [];
        }
        if (typeof (message) === 'string') {
            message = { text: [message] };
        }
        this.script[thread_name].push(message);
        return this;
    }
    /**
     * Add a question to the default thread.
     * In addition to a message template, receives either a single handler function to call when an answer is provided,
     * or an array of handlers paired with trigger patterns. When providing multiple conditions to test, developers may also provide a
     * handler marked as the default choice.
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     * ```javascript
     * // ask a question, handle the response with a function
     * convo.ask('What is your name?', async(response, convo, bot) => {
     *  await bot.say('Oh your name is ' + response);
     * }, {key: 'name'});
     *
     * // ask a question, evaluate answer, take conditional action based on response
     * convo.ask('Do you want to eat a taco?', [
     *  {
     *      pattern: 'yes',
     *      type: 'string',
     *      handler: async(response, convo, bot) => {
     *          return await convo.gotoThread('yes_taco');
     *      }
     *  },
     *  {
     *      pattern: 'no',
     *      type: 'string',
     *      handler: async(response, convo, bot) => {
     *          return await convo.gotoThread('no_taco');
     *      }
     *   },s
     *   {
     *       default: true,
     *       handler: async(response, convo, bot) => {
     *           await bot.say('I do not understand your response!');
     *           // start over!
     *           return await convo.repeat();
     *       }
     *   }
     * ], {key: 'tacos'});
     * ```
     *
     * @param message a message that will be used as the prompt
     * @param handlers one or more handler functions defining possible conditional actions based on the response to the question.
     * @param key name of variable to store response in.
     */
    ask(message, handlers, key) {
        this.addQuestion(message, handlers, key, 'default');
        return this;
    }
    /**
     * Identical to [ask()](#ask), but accepts the name of a thread to which the question is added.
     *
     * [Learn more about building conversations &rarr;](../conversations.md#build-a-conversation)
     * @param message A message that will be used as the prompt
     * @param handlers One or more handler functions defining possible conditional actions based on the response to the question
     * @param key Name of variable to store response in.
     * @param thread_name Name of thread to which message will be added
     */
    addQuestion(message, handlers, key, thread_name) {// ask  handlers = condition matcher  if stringthe handler is the def regex 
        if (!thread_name) {
            thread_name = 'default';
        }
        if (!this.script[thread_name]) {
            this.script[thread_name] = [];
        }
        if (typeof (message) === 'string') {
            message = { text: [message] };
        }
        message.collect = {
            key: typeof (key) === 'string' ? key : key.key
        };
        if (Array.isArray(handlers)) {
            message.collect.options = handlers;
        }
        else if (typeof (handlers) === 'function') {
            message.collect.options = [
                {
                    default: true,
                    handler: handlers
                }
            ];
        }
        // ensure all options have a type field
        message.collect.options.forEach((o) => { if (!o.type) {
            o.type = 'string';
        } });
        this.script[thread_name].push(message);
        return this;
    }
    /**
     * Register a handler function that will fire before a given thread begins.
     * Use this hook to set variables, call APIs, or change the flow of the conversation using `convo.gotoThread`
     *
     * ```javascript
     * convo.addMessage('This is the foo thread: var == {{vars.foo}}', 'foo');
     * convo.before('foo', async(convo, bot) => {
     *  // set a variable here that can be used in the message template
     *  convo.setVar('foo','THIS IS FOO');
     *
     * });
     * ```
     *
     * @param thread_name A valid thread defined in this conversation
     * @param handler A handler function in the form async(convo, bot) => { ... }
     */
    before(thread_name, handler) {
        if (!this._beforeHooks[thread_name]) {
            this._beforeHooks[thread_name] = [];
        }
        this._beforeHooks[thread_name].push(handler);
    }
    /**
     * This private method is called before a thread begins, and causes any bound handler functions to be executed.
     * @param thread_name the thread about to begin
     * @param dc the current DialogContext
     * @param step the current step object
     */
    runBefore(thread_name, dc, step) {
        return __awaiter(this, void 0, void 0, function* () {
            debug(' Before:', this.id, thread_name);
           console.log('starting Before :', this.id, thread_name);
            if (this._beforeHooks[thread_name]) {
                // spawn a bot instance so devs can use API or other stuff as necessary
                const bot = yield this._controller.spawn(dc);
                // create a convo controller object
                const convo = new dialogWrapper_1.BotkitDialogWrapper(dc, step);

                // luigi 052020
                convo.openStep=step;// needs ??,  to set a app wrapper
                
                // to pass script into handler
                convo.script=this.script;

                for (let h = 0; h < this._beforeHooks[thread_name].length; h++) {
                    let handler = this._beforeHooks[thread_name][h];
                    yield handler.call(this, convo, bot);
                }
                // store TEMPORARELY in mustacheF the function loaded in values.mustacheF
                //this.mustacheF=this.mustacheF||step.mustacheF;
               // this.mustacheF=this.mustacheF||this._controller.plugins.vCtl.mustacheF;
            }
        });
    }
    /**
     * Bind a function to run after the dialog has completed.
     * The first parameter to the handler will include a hash of all variables set and values collected from the user during the conversation.
     * The second parameter to the handler is a BotWorker object that can be used to start new dialogs or take other actions.
     *
     * [Learn more about handling end of conversation](../conversations.md#handling-end-of-conversation)
     * ```javascript
     * let convo = new BotkitConversation(MY_CONVO, controller);
     * convo.ask('What is your name?', [], 'name');
     * convo.ask('What is your age?', [], 'age');
     * convo.ask('What is your favorite color?', [], 'color');
     * convo.after(async(results, bot) => {
     *
     *      // handle results.name, results.age, results.color
     *
     * });
     * controller.addDialog(convo);
     * ```
     *
     * @param handler in the form async(results, bot) { ... }
     */
    after(handler) {
        this._afterHooks.push(handler);
    }
    /**
     * This private method is called at the end of the conversation, and causes any bound handler functions to be executed.
     * @param context the current dialog context
     * @param results an object containing the final results of the dialog
     */
    runAfter(context, results) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('After:', this.id);
            if (this._afterHooks.length) {
                const bot = yield this._controller.spawn(context);
                for (let h = 0; h < this._afterHooks.length; h++) {
                    let handler = this._afterHooks[h];
                    yield handler.call(this, results, bot);
                }
            }
        });
    }


        /**
     * Bind a function to run whenever a user answers a specific question.  Can be used to validate input and take conditional actions.
     *
     * ```javascript
     * convo.ask('What is your name?', [], 'name');
     * convo.onChange('name', async(response, convo, bot) {
     *
     *  // user changed their name!
     *  // do something...
     * });
     * 
     * 
     * for a onchange we used a indirect strategy :
     *      in fwbase  we registerd a normal cms onchage ( cms recovers the right convo and register the cb )
     *          that handler was in space of fwspace and calls a cb from the user directive in which it was injected just before        
     *              the injected handler 
     * 
     * 
     * ```
     * @param variable name of the variable to watch for changes
     * @param handler a handler function that will fire whenever a user's response is used to change the value of the watched variable
     */
    /*
    registerFwServiceCb(eventService,variable, handler) {//  fwCb={fWService1:null,askS:{dynMatch},thS:{}};
        if (!this._changeHooks[variable]) {
            this._changeHooks[variable] = [];
        }
        this._changeHooks[variable].push(handler);
    }
    */


    /**
     * Bind a function to run whenever a user answers a specific question.  Can be used to validate input and take conditional actions.
     *
     * ```javascript
     * convo.ask('What is your name?', [], 'name');
     * convo.onChange('name', async(response, convo, bot) {
     *
     *  // user changed their name!
     *  // do something...
     * });
     * 
     * 
     * ```
     * @param variable name of the variable to watch for changes
     * @param handler a handler function that will fire whenever a user's response is used to change the value of the watched variable
     */
    onChange(variable, handler) {
        if (!this._changeHooks[variable]) {
            this._changeHooks[variable] = [];
        }
        this._changeHooks[variable].push(handler);
    }
    onChangeAfterCond(variable, handler) {
        if (!this._changeHooksA[variable]) {
            this._changeHooksA[variable] = [];
        }
        this._changeHooksA[variable].push(handler);
    }
    /**
     * This private method is responsible for firing any bound onChange handlers when a variable changes
     * @param variable the name of the variable that is changing
     * @param value the new value of the variable
     * @param dc the current DialogContext
     * @param step the current step object
     */
    runOnChange(variable, value, dc, step) {

        // trick : if variable is null , means 

        return __awaiter(this, void 0, void 0, function* () {
            debug('OnChange:', this.id, variable);
            console.log(' convo/cmd ', this.id,'  trying to fire registered  OnChange on ask ', variable);// id is the convo id/name ( cmd) 
            if (this._changeHooks[variable] && this._changeHooks[variable].length) {
                // spawn a bot instance so devs can use API or other stuff as necessary
                const bot = yield this._controller.spawn(dc);
                // create a convo controller object
                const convo = new dialogWrapper_1.BotkitDialogWrapper(dc, step);

                // luigi 052020
                convo.openStep=step;// needs ??,  to set a app wrapper

                for (let h = 0; h < this._changeHooks[variable].length; h++) {
                    let handler = this._changeHooks[variable][h];
                    // await handler.call(this, value, convo);
                    yield handler.call(this, value, convo, bot);
                }
            }


        });
    }
    runOnChangeA(variable, value, dc, step) {

        // trick : if variable is null , means 

        return __awaiter(this, void 0, void 0, function* () {
            debug('OnChange:', this.id, variable);
            console.log('OnChange:', this.id, variable);
            if (this._changeHooksA[variable] && this._changeHooksA[variable].length) {
                // spawn a bot instance so devs can use API or other stuff as necessary
                const bot = yield this._controller.spawn(dc);
                // create a convo controller object
                const convo = new dialogWrapper_1.BotkitDialogWrapper(dc, step);

                // luigi 052020
                convo.openStep=step;// needs ??,  to set a app wrapper

                for (let h = 0; h < this._changeHooksA[variable].length; h++) {
                    let handler = this._changeHooksA[variable][h];
                    // await handler.call(this, value, convo);
                    yield handler.call(this, value, convo, bot);
                }
            }


        });
    }
    /**
     * Called automatically when a dialog begins. Do not call this directly!
     * @ignore
     * @param dc the current DialogContext
     * @param options an object containing initialization parameters passed to the dialog. may include `thread` which will cause the dialog to begin with that thread instead of the `default` thread.
     */
    beginDialog(dc, options) {// start the dialog setting the TURN result :is the TURN user text that is the asnwere to bot prompt that triggered this dialog
        // nb se e un child le option sono le vars= step.values del father ma se arrivo qui da un dc.replacedialod allora non ho un father 
        // qundi non volendome mescolate (YYHH) col nuove values del child , sopratutto qulle che si rif allo stato dei ASS :
        //      ASS : le vars.excel direc dir session ... verranno sostituite nel nuovo dialog ma le precedenti le trovo nel ctxVars
        //      e anche nel caso di  dc.replacedialog 
        //  allora gli aggiungo uno stack :ctxVars=[{convoid,level1vars},,,] e il nome del chiamanti
        // le vars.excel direc dir session ... verranno sostituite nel nuovo dialog ma le precedenti le trovo nel ctxVars

// dubbio finale : ma non è che conviene mescolare il tutto come si fa per le vars normali , cosi le variabili di stato dei model mi seguono durante e varie convo ????
//           in altre parole , non mi conviene inizializzare le var fw ASS al solo begin del primo thred e poi laciare che vengano passate automaticamente da convo a convo ??
// il problema e' che dovrei caricare tuttie le dichiarazioni dei convo in model !!!!!!!
// quindi idea : aggiungi in modo incrementale le nuove var al primo begin del thread def in fw base !!!
//          see fwbase.initCmd.controller.plugins.cms.before()

        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the state
            const state = dc.activeDialog.state;
            state.options = options || {};

            state.dir=state.dir||this.dir;// init( x count replay ?)


            state.values = Object.assign({}, options);
            let result,th= state.options.thread || 'default';
            // Run the first step
            console.log('\n ** beginDialog start for cmd ',dc.activeDialog.id,' , calling runStep , if  default thread assign user text in results, user text:',dc.context.activity.text);
            if(th=='default')result=dc.context.activity.text;// set the TURN result :is the TURN user text that is the asnwere to previous bot prompt
           // console.log(' ùùùùùùùùùùùùùùùùùùùù  beginDialog called , id is ' ,dc.activeDialog.id,' state is ',state,' app is : ',state.app);
            //return yield this.runStep(dc, 0,th, botbuilder_dialogs_1.DialogReason.beginCalled);         
            let ret= yield this.runStep(dc, 0,th, botbuilder_dialogs_1.DialogReason.beginCalled,result);
           // console.log(' ùùùùùùùùùùùùùùùùùùùù  beginDialog returned , id is ',dc.activeDialog.id,' state is ',state,' app is : ',state.app);
            return ret;
        });
    }
    /**
     * Called automatically when an already active dialog is continued. Do not call this directly!
     * @ignore
     * @param dc the current DialogContext
     */
    continueDialog(dc) {// continue the dialog setting the TURN result :is the TURN user text that is the asnwere to previous bot prompt from this dialog
        return __awaiter(this, void 0, void 0, function* () {
            // Don't do anything for non-message activities
            if (dc.context.activity.type !== botbuilder_1.ActivityTypes.Message) {
                return botbuilder_dialogs_1.Dialog.EndOfTurn;
            }
            // Run next step with the message text as the result.

            console.log('*** continueDialog called' );

            return yield this.resumeDialog(dc, botbuilder_dialogs_1.DialogReason.continueCalled, dc.context.activity.text);
        });
    }
    /**
     * Called automatically when a dialog moves forward a step. Do not call this directly!
     * @ignore
     * @param dc The current DialogContext
     * @param reason Reason for resuming the dialog
     * @param result Result of previous step
     */
    resumeDialog(dc, reason, result) {// rersult is the child values/vars
        // usually when a prompt dialog ends will resume its father (this convo) on stack !
        return __awaiter(this, void 0, void 0, function* () {
            // Increment step index and run step

            // >>>> RECOVER state from dc.activeDialog.state that can be different from last step ??
            const state = dc.activeDialog.state;
            console.log(' resumeDialog called state is ',state);

            // luis: manage the count on previous step:
            if(state.dir.repeat_)state.dir.repeat_++;// a continuedialog is starting a step whose previous  that was asked to repeate

          //  console.log(' ùùùùùùùùùùùùùùùùùùùù  resumeDialog called , id is ',dc.activeDialog.id,' state is ',state,' app is : ',state.app);
            let ret=yield this.runStep(dc, state.stepIndex + 1, state.thread || 'default', reason, result);
          //  console.log(' ùùùùùùùùùùùùùùùùùùùù  resumeDialog returned, id is ',dc.activeDialog.id,' state is ',state,' app is : ',state.app);
            return ret;
        });
    }
    /**
     * Called automatically to process the turn, interpret the script, and take any necessary actions based on that script. Do not call this directly!
     * @ignore
     * @param dc The current dialog context
     * @param step The current step object
     */
    onStep(dc, step) {
         return __awaiter(this, void 0, void 0, function* () {


          //  return __awaiter(this, void 0, void 0,pippo);pippo= async function* () {


            // Let's interpret the current line of the script.
            const thread = this.script[step.thread];
            // Capture the previous step value if there previous line included a prompt
            var previous = (step.index >= 1) ? thread[step.index - 1] : null;

            let addMatcRes_=this._vcontroller.vfwF.addMatcRes;// run helper ti staff

            /* 
            meanings :
            recLTurn : say that 
                    -the result is text 
                        OR IF index is 0 ( coming from a gotothread ) 
                    -  
            state.goon : state that says to next step what step the result text is referring to 

            msgSent is the index of ask whose msg template the result (user text answere) refears :
                    msgSent=state.goon < index-1 m is coming from a goon in the same thread
                    msgSent=state.goon =index -1 , nornal : is coming from normal previous step msg 
                              ( if previous step is -1 comes from begindialog and it used only in OnBefore) (sure ?)
                    msgSent=-777 , result is not text 
            userTurn contains user text that can be used in following steps (the next step.result) 
            
            cases on step.result :
                - null : when coming from   startdialog, replay
                             normal repeat will have a no result with no goon so no msgSent will be set so current handler will emit msg prompt
                             special repeat UU will have too a no result with also a no  goon 
                             startdialog will have too a no result with also a no  goon 

                - string:                   runStep, continuedialog, is user answer
                - obj=step.values               gotothread (will use goon to recover userturn) , resumedialog ( return from child,)


                so  
                if null msgSent= null
                if string :
                    - set msgSent=step.index-2 : the step before the previous step 
                    - userTurn=step.result
                    if find state.goon :
                        - msgSent=state.goon

                if obj 
                    
                    if((recLTurn||step.index>0)&&(!step.msgSent) // use results in next step if exists (step.msgSent not null ) or 
                                                                 //     if index=0 recLTurn
                            step.state.goon=step.msgSent; 
                            runStep(dc, step.index+1,,,,)  >>>  will call onstep with string=result

                NB  A case  : if condition dont match with msgSent = step before the analizing condition step >>>>>  send a reply request
                                    if msgSend<index-1
            */
            /* Management SUMMARY review 15032020 use before comment than we try just try explain better 
                cases on step.result :

                const recLTurn : true if  in step 0 we got a user answer and put in text result. can be because :
                    - result is text OR
                    - the answer is recovered (from step.state.userTurn , result is received as  obj!) and put in  result recoverED from previous STEP THAT CAME TO THIS THREAD FROM  GOTOTHREAd or ....

                const goonDir flag : say to apply mixinitiative tech :
                                 if, in a ask , - not def conditions are matched ( continue or gototread ) 
                                                - ?? def action do the same only if is continue or .....    
                                                        >>> we use the current text to test the next ask conditions ( instead of respone to its template)


                - null : when coming from   startdialog, or a condition replay action 
                             normal repeat will have a no result with no goon, so no msgSent will be set,  so current step handler will emit msg prompt
                             special repeat UU will have too a no result with also a no  goon 
                             startdialog will have too a no result with also a no  goon 
                                >> question can be null with a goon ??? probably not 

                - string:           can came from :  runStep, continuedialog,begindialog(if is default thread ?)
                                    - if came with a goon from a previous step (>=0 , same thread, using runStep(index+1,,result)) state.goon is the goon step index 
                                        > so set msgSent will qualify if result is text ( the user answer ) and what step contain the msg to which the result is the answer :
                                        msgSent=state.goon < index-1 m is coming from a goon in the same thread
                                        msgSent=state.goon =index -1 , nornal : is coming from normal previous step msg 
                                                                        ( if previous step is -1 comes from begindialog and it used only in OnBefore) (sure ?)
                                        msgSent=-777 , result is not text 

                                    - if come from begindialog (step 0) : todo :
                                        verify that the result is processed only in begin dialog , 
                                        who set the result ? ................ ( std bb or we set it  ?? ) and 
                                        what is result ? ......................... 


                - obj=step.values    can come from :  gotothread (will use goon to recover userturn) , return from child, 
                                                       resumedialog ( will copy its value into result , usually after a child ends  or GotoDialog
                                                        so here we insert that in a values.what specified on addChildDialog , usually the dialog_id of child)


            so  > if null msgSent= null
                > if string :

                    - set msgSent=step.index-2 : the step before the previous step , WHY ???
                    - userTurn=step.result , the user text to test 
                    if find state.goon :
                        - msgSent=state.goon , the index to which the text is referring 

                    in step 0 prepare for goon possibility :
                            recLTurn=true;
                            step.msgSent=-1;, means that the msg trefears to a ask in the coming thread ( the ask fired a goto thread)


                > if obj  , (so gotothread or returning from a child ( replacedialog too ???)
                    in on step 0 , we skip previous handling and do only the current step handling  :
                    if we find in status a not null previous answer (step.state.userTurn) :
                        - set result =step.state.userTurn + set the flag recLTurn=true 
                        - step.msgSent=-1;   // mark that result as the last user answere ( we need  if we'll use goon )
       
                        - prepare for goon possibility :
                            recLTurn=true;
                            step.msgSent=-1;

                    nb  userTurn can be nulled by onchange or if goon is set false in ...direc[thread_name].loopDir.goon
                        todo , now we cant know if state.userTurn is too old and need to be discarded 


                * in current step  handler we goon if :
                    if(goonDir&&(recLTurn||step.index>0)&&(step.msgSent >-2)){// use results in next step if exists (step.msgSent not null, better > -2 ) or 
                                                            // if index=0 recLTurn will decide to goon or not

                             // TT  
                             goon code ...


                       step.state.goon=step.msgSent;  
                    return yield this.runStep(dc, step.index+1, ... // goon 
                }   else 
                    console.log(' > Ending current Step Handling : PROMPTing msg of index  ',step.index,'\n');
                    .....  // usual code to send current step message 



                ?? NB  A case  : if condition dont match with msgSent = step before the analizing condition step >>>>>  send a reply request
                                    if msgSend<index-1
            */

            // if this is index 0 try to process the userturn coming from previous thread 



           // console.log('\n\n ********************************** ONSTEP STARTING  at  index: ',step.index,'  thread : ',step.thread),' appwrapper : ',step.values.app;



            let is_prevCollKey=null,is_prevColl_Opt=null;// conditions
            if(previous&&previous.collect&&previous.collect.key){is_prevCollKey=previous.collect.key;
                if(previous.collect.options)is_prevColl_Opt=previous.collect.options;// must be a key !
            }
            /* put after 
            if(typeof step.result === 'string'){
             console.log('\n\n ***** ONSTEP STARTING  at  index: ',step.index,'  thread : ',step.thread,' cmd : ',dc.activeDialog.id,', text result ',step.result,', coming from previous step/begibDialog :',step.result);
                if(is_prevCollKey)console.log('   and as in previous there are a key ',is_prevCollKey,' registered onchange will be fired on text result '); 
                if(is_prevColl_Opt)console.log('   and registered conditions  conditions will be checked on text result '); 
            }else {console.log('\n\n ***** ONSTEP STARTING  at  index: ',step.index,'  thread : ',step.thread,' , obj result coming from GOTOTHREAD/REPLACEDIALOG or returning from child ');
            if(is_prevCollKey)console.log('   and as previous has a key ',is_prevCollKey,' registered onchange will be fired on result obj result'); 
            if(is_prevColl_Opt)console.log('   and registered  conditions  will be checked on obj result (??) ');       
            }
            if(lv>2)console.log(
            '\n   - vars is , ',step.values
            );*/
             //if(lv>4)console.log(' state vars is : ',step.state.values); 


             //// DIRECTIVE  ger fw directives : see // DIRECTIVE 

            let msgSent=-777,// text result do not available
            state=step.state,
            askmatches=step.values.askmatches;// 
            let goonDir = true,// default : do goon(mixedinitiuative) tech
                            // after will be overwritten by : excel.direc[previous.collect.key].loopDir.goon=false
                goonDir2=true; // after will be overwritten by: excel.direc[previous.collect.key].loopDir.goon2=false






            if(
                step.result&&
                (typeof step.result === 'string' || step.result instanceof String)){// >>>>> register last user turn on status 

             //   console.log(' onStepstarting , found string setting msgSent : ',step.index-1);

                //okok :  can come from a runstep(....result) from a dc begindialog or from a step calling runStep(index+1,,result) but in this case we set goon as msgSent 

            state.userTurn=step.result;// *** if this step will gotothread ( and begindialog,resumedialog ?), receiving step will recover that text .( )
            // >>>> step.state.userTurn can be nulled by onChange !!!!!!
 
            // msgSent=step.index-1;// the
            msgSent=step.index-1;// the
            //else step.state.userTurn=null;// when will i reset that ? never ? 

            // moved from runstep :

            // goon should warn that we goon to next step using a previous msg prompt , 
            // >>>>>>>>>>>>>>>>  so shoud be index-1 otherwise should be index -2 ??
            //if(state.goon||state.goon<=step.index-1){msgSent=state.goon;// usually step run with a user answare to msg of step with index-1 
            if(state.goon!=null&&state.goon<=step.index-1){
                msgSent=state.goon;// usually step run with a user answare to msg of step with index-1 (previous msg)

                /*
                console.log('  result is text with GOON detected : last/previous step fired a runstep() with state.goon (so result , on which we are testing previous step condition, is a speech response of a msg before previous step ), thread: ',step.thread,
                '\n    current index is ' + step.index ,' previous  index ( where we test the condition ) is ' , step.index-1 ,' text is ',step.result,
                '\n   NB user answere referring to a older msg index: ',state.goon,' (setgoon is set in TTT when goon ) , to make it available in case of a gotothread the text was copied to state.userTurn ');
                */

                state.goon=null;// reset
            }
            // else msgSent=state.goon;???????????
            /*
            }if(msgSent> -777){
                  console.log('result is text because msgSent=',msgSent,'> -777 (-777 is obj result, so a goto thread/childreturn-replace...  dialog))  it can be the answer to a msg of a step previous than previous step !');
            }else{  console.log('result is obj because msgSent=',msgSent,'== -777 , so a goto thread or a resume from child/...  dialog))  ');
            */

            console.log('\n\n ***** ONSTEP STARTING  at  index: ',step.index,'  thread : ',step.thread,' cmd : ',dc.activeDialog.id,', text result ',step.result,', coming from previous step(-1=begibDialog) index :',msgSent);
               if(is_prevCollKey)console.log('   On Previous step  ',is_prevCollKey,' registered onchange will be fired on text result '); 
               if(is_prevColl_Opt)console.log('   And registered conditions   will be checked on text result '); 
               if(msgSent<step.index-1)// and > -777
               console.log('  NB  GOON detected : so text result , to test previous step conditions at index: ',step.index-1, ', is the user response to a prompt msg promped at a previous ask index: ',msgSent ); 


            }
            else {// result not string 
                console.log('\n\n ***** ONSTEP STARTING  at  index: ',step.index,'  thread : ',step.thread,' , with a obj result coming from GOTOTHREAD/REPLACEDIALOG ( returning from child). infact msgSent is -777 : ',msgSent == -777);
            if(is_prevCollKey)console.log('   On Previous step  ',is_prevCollKey,' registered onchange will be fired on text result '); 
           if(is_prevColl_Opt)console.log('   and registered  conditions  will be checked on obj result (??) ');       
           }

           if(lv>2)console.log(
           '\n   - vars is , ',step.values
           );
            step.msgSent=msgSent;
            // capture before values , now here not after !
            let index = step.index;
            let thread_name = step.thread;

            if (step.result && previous && previous.collect) {
                if (previous.collect.key) {


                    // capture before values // now done before 
                    // let index = step.index;
                    //let thread_name = step.thread;

                    /* DIR : doing DIRECTIVE  dir={event:function} event={convo,th,step}
                    nb ( custom field on a ask are put in line/previous/current.channelData)   
                    
                    
                    new 01062020
                        when find in custom field we put the field as is in state.dir.step[].custom
                            in begindialog  set also :  session.dir=state.dir



                    directives : question : is it better get a directive from the ask custom field in form of key='dir-th/ask/model-...'  or 
                            get it from excel. ....  ??
                    // state.dir={repeat:0,condDefInd:-1,condDefNam:null,maxrep:10};// put loop var/state in a specific obj : state.dir
                    //  ex : step-maxretry:....   , a general match   , a sentiment qualifier , a speech ... qualifier (group ) 
                    //  ex th-notmatchprompt x all step in a th 
                    // load dir temporarely on session.convo.dir.th/step from meta
                    if(previous.channelData){
                        vars.session.dir.run.curstepdef=-1;
                        // custom fields added in ask cms : copy all the values in channelData fields starting with 'dir-' as dirrective in a array
                        if(!vars.session.dir.step_v[previous])
                        for (var key in previous.channelData) {
                        if(previous.channelData[key].substring(0,4)=='dir-'){
                            vars.session.dir.step=vars.session.dir.step||{};
                            vars.session.dir.step[previous]=vars.session.dir.step[previous]||{};
                            let dir_=previous.channelData[key].substring(4);

                            if(dir_='maxrep'&&previous.channelData['dir-condDefInd']){// set som ctl vars
                                vars.session.dir.run.curstepdef=previous.channelData[key];// convert string to int
                                vars.session.dir.run.condDefInd=previous.channelData['dir-condDefInd'];// convert string to int
                            // todo so get condition index in case of vars.session.dir.step[previous][condDefNam]
                            }else{// just record it 

                                vars.session.dir.step[previous][dir_]=previous.channelData[key];
                            }
                        }
                        }
                    }
                    // ???
                    if(state.dir.repeat!=null)state.dir.repeat++;else state.dir.repeat=1;// ??? se fa runstep non repeat come faccio a capire di resettarlo ?
                    // following when evaluating condition condDefInd match the index 0 (?)
                    */

                    // 01062020  TODO lastly we introduced count so check if state.repeat is still valid 

                    if(previous.channelData){

                        // can also run a micro onchange ??? : if key= run   eval value !!!!

                        // Custom Fields added in ask cms : copy all the values in channelData fields starting with 'dir-' as dirrective in a array
                        // seems ok put all directives in a dir obj 
                        if(!state.dir.asks[previous.collect.key]){
                        let cf=state.dir.asks;//==state.dir.step
                        cf[previous.collect.key]={};
                        for (var key in previous.channelData) {// for each custom field set in previous ask
                            // session.dir=state.dir={asks:{askname:{cf:{cf1:'aval',,,,,}}},,,,}

                            // NB NB NB session.dir=state.dir
                                cf[previous.collect.key].cf={};cf[previous.collect.key].cf[key]=previous.channelData[key];// could be set also from excel....... directives
                            }
                        }


                        for (var key in previous.channelData) {// for each custom field set in previous ask run exec $$$$

                                if(key.substring(0,4)=='$$$$'){

                                    let param={},eret;
                                    eret=looseJsonParse(null, step.values, step,previous.channelData[key],this._vcontroller.service,param);

                                    if(param.sF){// conditon code set a async func service.... its param and a cb to set result in some vars
                                     //  let myf=new Promise(function(resolve){ param.sF(param.sP).then((x)=>resolve(x))});
                                     //let myf=async function(){return param.sF(param.sP);}
                                     //   rv=await myf;
                                     // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
                                     
                                     // param.sF is set to some this._vcontroller.service[x]
                                     let rv=yield param.sF.call(this._vcontroller.service,param.sP);



                                }
                            }
                        }
                        
                    }

                    // old : if(previous.channelData['maxrep'])if(state.count>=previous.channelData['maxrep'])setdef= condDefInd ;
                    


                    //console.log(' +++++++++++  previous ask ',previous.collect.key,' onchange , now vars is : ',step.values);

                    // capture the user input value into the array
                    if (step.values[previous.collect.key] && previous.collect.multiple) {
                        step.values[previous.collect.key] = [step.values[previous.collect.key], step.result].join('\n');
                    }
                    else {
                        step.values[previous.collect.key] = step.result;// here step.result can be   text or obj (if returning from child :rusult=step.values filled by child)
                    }


                    // run onChange handlers
                    yield this.runOnChange(previous.collect.key, step.result, dc, step);// can set askmatches[previous.collect.key].param and .complete
                    // console.log(' +++++++++++ thread ',thread_name,', step ,',index,' is testing user answere on previous ask  ',previous.collect.key,' , onchange runned and  now vars is :\n ',step.values);
                    // did we just change threads ? if so, restart this turn
                    if (index !== step.index || thread_name !== step.thread) {
                        return yield this.runStep(dc, step.index, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.values);
                    }
                }
                // handle conditions of previous step 

                // logging 
                function ttest(tomatch,test){
                    console.log(' conversation ttest() is trying matching text ',tomatch,' with regex patt ',test);
                    // evermatch : set pattern=[\s\S]+ or :
                    if(test.charAt(0)=='*')return tomatch;

// todo  handle a invalid regular expression (UnhandledPromiseRejectionWarning: SyntaxError)  , see https://thecodebarbarian.com/unhandled-promise-rejections-in-node.js.html


                    return tomatch.match(new RegExp(test, 'i'));// test='stay*\w*\s(\w*)' will return rematch=[],  in rematch[1] is the word after stay*
                }


                if (previous.collect.options) {
                    var paths = previous.collect.options.filter((option) => { return !option.default === true; });
                    var default_path = previous.collect.options.filter((option) => { return option.default === true; })[0];
                    var path = null;


                    //// 052020 TRR : candidate to be executed on fw like :
                    // fwctl.f1();??? or can only be exported some functions ?

                    /// *****    TODO  TODO  TODO 
                    // check if this convo has fw support or not ( avoid check fw vars !!!!!!!)
                    /* example 
                    instead of :
                    if(askmatches[previous.collect.key]&&askmatches[previous.collect.key].param)
                    askmatches[previous.collect.key]={param:askmatches[previous.collect.key].param,complete:askmatches[previous.collect.key].complete}
                    else askmatches[previous.collect.key]=null;
                    put :
                    fwctl.addaskmatches(askmatches,previous);// reset all match key fields but not param (set by onchange) at start conditions loop p
                    ......
                    
                    */
                   // step.values.askmatches[previous.collect.key]=null;// reset all match key fields but not param (set by onchange) at start conditions loop p
                   
                    if(askmatches[previous.collect.key]&&askmatches[previous.collect.key].param)
                    askmatches[previous.collect.key]={param:askmatches[previous.collect.key].param,complete:askmatches[previous.collect.key].complete}
                    else askmatches[previous.collect.key]=null;

                    function setAskDir(entity,previous,condition,state){

                        /* 092020 *** MANAGEMENT SUMMARY ON MATCHING and ROUTINGS 

                        macro conditions will set :
                         - directive in state.dir.asks[previous.collect.key].cond[Entity] , the Json in  macro field in a ask model condition ($xEntity:.....) ,
                                >> now state.dir.cond[Entity] 
                         if a model is many times called , only first occurence will set macro 
                         - return the  matchername  if found as directive in Json matcher property  or in model.js step.values.excel[entity].matcher
                              matcher will be fired, on MFM code section , that  ACCORDING to  condition.type will :
                                  - search in (onchange.js)_vcontroller.fwCb.askS[matcher] + _vcontroller.service[matcher];
                                  - fire the matcher 
                                  - store the REST dyn RESULT (Management) 
                                        (in in addMatcRes() ) in vars.askmatches and matches 
                                        >>>>  ACCORDING to  condition.type (cms if) request macro......  distinguish from :
                                        
                                                 
                                                      - a ask query,                          > store in askmatches structure 
                                                      - ask testing a intent resolution        > askmatches structure set in way like a dynquery are storen in a onchange 
                                                      - or a simple model match               > matches structure     set in way like a intent are storen in a onchange 
                                                 
                                                 
                          NB macro condition type is used to get a Matching Result 
                            a) match a entity  ( set result in matches) or 
                            b) resolve a intent ( so get its entities ) (set result in askmatches )
                                then if the Matching Result returns true ( a) ever ) we can ROUTE ( no continue or $% ) so  fire 
                                    - a microintent a)  or 
                                    - a macro intent b)

                            IF the Matching Result needs more TURNS a child will do that . 
                                so the condition needs to relay to it with a goto cmd dialog ( EXECUTE SCRIPT ) to fire the _Child with name starting with '_'
                                - a EXECUTE SCRIPT routing is transformed into a StartDilaog by cms system if the cmd name starts with '_'
                          
                          if the turn will not change we cn store the result in the same ask , otherwise a child will manage the turns needed
                        */

                        if(condition.type.substring(0,5) === 'macro') {
                            // fills directive field 
                                                       // session.dir=state.dir={asks:{ 
                                                        //                              askname:{cf:{cf1:'aval',,,,,},// custom feld
                                                        //                                       >> WAS cond:{askconditionmodelname:condition.macro,,,},
                                                        //                                      },
                                                        //                                ,,,},
                                                        //                      NOW >> cond:{modelname:condition.macro,,,},
                                                        //                      }
                            if(!state.dir)return;
                            // let keyDir=state.dir.asks[previous.collect.key]=state.dir.asks[previous.collect.key]||{};
                            let mfound=false, keyDir=state.dir;//=state.dir||{};
                            
                            if(!((keyDir.cond)&&keyDir.cond[entity])&&condition.macro){// add this directive only if is void or add staff also  was not void ??
                                keyDir.cond=keyDir.cond||{};
                                //var str = '{ "name": "John Doe", "age": 42 }';var obj = JSON.parse(str);
                                if(condition.macro)keyDir.cond[entity]= JSON.parse(condition.macro);// load macro if found, overwritten, , cmsmacrojsonstring={ "matcher": "dynMatch" }'
                                console.log(' in previous mngment ,try matching condition on ask ',previous.collect.key,', found (in first if many) ',entity,' model json macro directive : ', condition.macro,' so : obj=',keyDir.cond[entity]);
                                }
                                if(keyDir.cond[entity]&&keyDir.cond[entity].matcher){return keyDir.cond[entity].matcher;mfound=true;}// state.dir.asks[previous.collect.key].cond[entity].matcher="dynMatch"
                             if(!mfound&&step.values.excel[entity]&&step.values.excel[entity].matcher) return step.values.excel[entity].matcher;// try in excel x the matcher,will be called on MFM
                        }
                    }// end setAskDir()

                    


                    for (let p = 0; p < paths.length; p++) {// start CONDITION SCAN

                        let matcher=null;// standard matcher is ttest , in this case matcher=null

                        let condition = paths[p];
                        if(lv>2)console.log('\n - CONDITION MATCHING  on thread: ',thread_name,' ,on PREVIOUS step index: ', step.index,', ask: ',is_prevCollKey,'  try matching condition  number ',p,'\n     condition patt: ', condition.pattern,' condition obj : ', condition);
                        let test;
                        let notest = false;
                        let patt;
                        let tomatch = step.result, 
                        storemat = null,storeVal;// storemat is the item name (or model value) for menu model(static model in excel) 
                                                //  OR 'value' if is an  integer or string entered /date  .... (match > storeVal) ex : user say 'il 3 ottobre' so storeval='03102020', storemat='value'  

                        if (condition.type === 'string') {
                           // test = new RegExp(condition.pattern, 'i');

                            if (ttest(tomatch,condition.pattern)) {
                                console.log('\n MATCH Detected : string condition ( number ',p,')matched at step index ', step.index,', condition : ', condition);
                                path = condition;
                                break;
                            }
                        }
                        else if (condition.type === 'regex'||condition.type.substring(0,5) === 'macro') {// REGEX_MACRO
                            console.log('condition matching debug : $$ case pattern is  ', condition.pattern
                            ,'\n vars is : ',step.values
                            );

                            /* in cms server public/js/section/...incoming..html : 
                            
                            <select class="ng-class: {invalid: option.invalid}; option-type conditional_select"  ng-change="makeDirty()" ng-model="option.type">
                        <option value="string">exact match</option>
                        <option value="regex">matches the regex</option>
			            <option value="macro_a">voice macro a</option>
			            <option value="macro_b">voice macro b</option>
			            <option value="macro_intent">voice intent</option>
			            <option value="macro_entity">voice entity</option>
			            <option value="macro_qs">voice querystring</option>
                        <option value="utterance">is a variation of</option>
                        </select>

                            */

                                        /* moved to ext func 
                                            function looseJsonParse(templ,vars){//extract in cond string a vars . format  xxxx&&vars.excel.....&&yyyy
                                            // see evalmozilla.js, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
                                            // call  ftempl=looseJsonParse(template,Object.assign({},context.vars,{aa}));
                                            // template= "some text{{&&let kk="5";vars["colore"];&&}}"// last js expression in &&....&& is calculated

                                                // usually used in case we want to generate same text without use a onchange 
                                                // or also when in a msg we want to use a {{}} a context var depending from past status  
                                                // or in a condition we want to test not the user speech but the passed var got 

                                             let ioa = templ.indexOf('&&'),fcorpus,fc;
                                              let templP=templ.split('&&');

                                               //      console.log('looseJsonParse : templP is :',templP);
                                             //if (ioa > 0){let ioa1 = templ.indexOf('&&',ioa+3);
                                              //  if(ioa1>0)fcorpus = templ.substring(ioa+2, ioa1);}

                                              if(templP.length==3){
                                              // evaluate fcorpus in context 
                                                fc=templP[1];
                                                console.log('looseJsonParse : fc is :',fc);
                                                let myf='"use strict";' + fc;
                                                 let calc;
                                                // calc=Function(myf)();
                                                //calc=Function('"use strict";' + fc)();
                                                 //calc=Function( fc).call(vars);
                                                //calc=Function( fc).call(vars);
                                                calc=eval( fc);
                                                // OK calc=eval(myf);
                                                //   console.log('looseJsonParse  calc :',calc);
                                                if(calc)return templP[0]+calc+templP[2];
                                          
                                              }
                                              return templ
                                                                                  
                                             // return Function('"use strict";return (' + obj + ')')();
                                            }*/
                                        

                           function jVar(cod,vars){// returns the value of a cod vars . 2 formats ,1  cod='avarwithnopoint' returns vars.matches[cod].match ,2  return   a vars obj cod=vars.......)
                            /*if(!cod)return rr, where rr is :
                            
 
                            condition regex patt example : $$mod_wh:where-dove|che posto|luogo&how-come|modo|devo|fare&when-quando|ora|orario|mattina|pomeriggio|sera|mattina
                                > will be cod='mod_wh'
                            
                                so, 
                                do case on regex patt in a ask condition :
                                1: if cod start with : $$ or $% or $$$    followed by xx&yy  :
                                    patt : $$cod&yy 
                                    >   cod is a model name(usually 'mod' followed by no points), jVar  returns : vars.matches[cod] (see addMatcRes for matches format )
                                2: if cod start with : $$ or $% or $$$    followed by vars.a.b.c&yy 
                                    >  cod=vars.a.b.c  is a obj name , jVar  returns : vars.a.b.c 

                            */
                               let qobj=cod.split('.');
                               if(qobj.length<2){// case 1 , cod is a model name so returns vars.matches[cod]
                                   
                                if(vars.matches[cod])return vars.matches[cod].match;// (see addMatcRes , model case ,  for matches format )
                               else return null;
                            }else{

                                return getCodedVar(vars,qobj);
                               }
                               function getCodedVar(vars,qobj){return iterdepl(vars,qobj,qobj.length)}
                               function iterdepl(vars,namwp,pos){// pos=point position,'vars.askmodel.match.pippo' >  namwp= ['vars','askmodel','match','pippo'] initial pos=namwp.length 
                               // will return vars obj as required by literal string namwp
                               let ll=namwp.length,step=ll-pos;// step =0 ... ll-1     max :  ll-1=step=ll-pos  >> pos=1
                               if(step==0){if(namwp[step]=='vars')  vars=vars;// must start with vars.
                                            else return null;}
                                else{
                                    vars=vars[namwp[step]];
                                    if(vars);else return null;
                                }

                                if(pos<2){// at the end 
                                        return vars;
                                }else{
                                    pos--;
                                        // here pos>=1
                                        return iterdepl(vars,namwp,pos);
                                }

                               }



                           }


 // ******* model matching section 




let mgot=false;

if(condition.type.substring(0,5) === 'macro') {// macro only 

}// end  macro only


                        if(!mgot){//  hyt

                            if (condition.pattern.substring(0, 2) == '$$' || condition.pattern.substring(0, 2) == '$%') {// $xy cases : todo add a $% that means try match , register , but no stop current condition testing
                                //  console.log(' condition matching : $$ case pattern is  ',condition.pattern, ' patt is : ',condition.pattern.substring(2,condition.pattern.length));
                                let linematch = condition.pattern.substring(0, 2) == '$$';// if model matched match the line if not previously done, then if matched route ($$ case)  otherwise goon to test all other conditions

                                //052020
                                let itr = condition.pattern.indexOf(':'),//  : position , example in '$%entityname:....'    itr=12
                                entity;// put after     entity = condition.pattern.substring(2 + sk_, itr);// mod_loc   $$mod_loc::   means look in model definition. see excel .....


                                // do a version x  if(condition.pattern.substring(0,3)=='$$%')// recover the value values[ioafild].match
                                if (condition.pattern.substring(0, 3) == '$$$')// recover the value  values.matches[ioafild]
                                {// start $$$ case 
                                    if (condition.pattern.charAt(3) != '$') {// regex: '$$$location&gigi||luigi  patt='gigi||luigi'   ioafild='location'
                                        let ioa = condition.pattern.indexOf('&');// & or : ???
                                        if (ioa < 0) ioa = condition.pattern.indexOf(':');// & or : ???
                                        if (ioa > 0) {
                                            patt = condition.pattern.substring(ioa + 1, condition.pattern.length);
                                            let ioafild;// &&&
                                            ioafild = condition.pattern.substring(3, ioa);
                                            //tomatch = step.values.matches[ioafild];// to test if tomatch  match with pattern patt  
                                            tomatch = jVar(ioafild, step.values);//ioafild is the model name , to match  is a string ,the item value/key , not the voice name 
                                            console.log(' try matching condition  :  $$$amodel:pattern . model: ', ioafild, ' item ', tomatch, '  pattern ', patt);
                                            if (!tomatch) notest = true;
                                        } else notest = true;




                                        //test = new RegExp(patt, 'i');



                                        if (!notest && ttest(tomatch, patt)) {
                                            console.log('\n  MATCH Detected : $$$ condition  ( number ', p, ') matched  at step index ', step.index, ', condition : ', condition);
                                            path = condition;
                                            break;
                                        }


                                    } else { // $$$$ case is a js function returning tru if condition matches 
                                        // TODO: Allow functions to be passed in as patterns
                                        // ie async(test) => Promise<boolean> x promise use of async helper func passed as vars.helper see :
                                        //      cms_onchange_function_andasync.js

                                        // example :
                                        // $$$$let out, geta=vars.results.match(new RegExp('collect*\w*\s(\w*)', 'i'));if(geta){vars.getta=geta;out=true;}else out= false;  // test='stay*\w*\s(\w*)' will return rematch=[]

                                        // add text to vars as vars.result:
                                        step.values.result = tomatch;// step.values=vars=Object.assign({},step.values,{result:tomatch}) not necessary to clone
                                        let param={},eret;
                                        eret=looseJsonParse(null, step.values, step,condition.pattern.substring(4),this._vcontroller.service,param);

                                        if(param.sF&&param.sP&&param.cb){// conditon code set a async func service.... its param and a cb to set result in some vars
                                         //  let myf=new Promise(function(resolve){ param.sF(param.sP).then((x)=>resolve(x))});
                                         //let myf=async function(){return param.sF(param.sP);}
                                         //   rv=await myf;
                                         // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
                                         
                                         // param.sF is set to some this._vcontroller.service[x]
                                         let rv=yield param.sF.call(this._vcontroller.service,param.sP);

                                            // matcher caller must comply param to service call (interface def)
                                            // can be :
                                            // - sF=rest_run that do same job as def matcher service , dynmatch, but is called with different param :
                                            //      infact we dont have to match some entyty with some dependings where model but provide the rest qs !!!!!
                                            // 



                                           if(rv){ param.cb(rv);

                                            // >>>>>  nb remember that run_jrest generally returns {reason,rows} and run_rest returns a string 

                                            console.log(' $$$$ function condition requested a SERVICE function: ', param.sF.name,' and succeeded , result: ',rv);
                                            
                                           }else console.log(' $$$$ function condition requested a SERVICE function: ', param.sF.name,' and dont succeeded ');
                                        }
                                        if (eret) { // a function as tostring
                                            console.log('\n  MATCH Detected : $$$$ function condition with vars.text in scope  ( number ', p, ') matched  at step index ', step.index, ', condition : ', condition);
                                            path = condition;
                                            break;
                                        }
                                    }// ends $$$$ case


                                }// ends $$$ case 
                                else {// $x case can be $$ (test and condition route ) or $% (test and not condition route ) or $$% $%% (% in 3rd position means to test anyway )
                                    // add a $$mario-mario*&second item ....
                                    // for   {nextitem=condition.pattern.indexOf('&');  No ?  just one item x condition ?!!!

                                    // >> better put the matched result in a dedicated value.matches.entity
                                    // the match can be done in many condition or just one :
                                    // $$entity_name:ma-mario*&gi-giovanni :
                                    // entity='ma' or 'gi'

                                    // a json format can be used !
                                    // $$entity_name:pattArray     so :

                                    // $$dyn_medicine:itemnam1-pattern1&itemname2-pattern2......  OR get model  $$dyn_medicine:: OR select adynquery   $$dyn_medicine:>
                                    let 
                                    //itr = condition.pattern.indexOf(':'), 
                                    pattArray, pArray;//  pattArray='item1-pippo!poppo*&item2-parerino&..',pArray={item1:{patt:'pippo!poppo*',,,},item2:{patt:'parerino',,},,}

                                    let sk_ = 1, retest, chmatch,
                                        prevMat;
                                    let desiredE, cursor, param;// a desire ask query result field , in case a selection will be required by some condition :$$desire_ask:; 
                                    if ((retest = condition.pattern.charAt(2) == '%'));// overwrite test
                                    else if (chmatch = condition.pattern.charAt(2) == '§') {
                                        //prevMat=step.values.matches[entity]
                                        ;
                                    }// check if matched changed , to do , usefull ??? , only if  $%§ : if dont match leve previous !
                                    else sk_ = 0;// no third ctl char

                                    if (itr > 0) {// start case model match with a $X(Z) case : start $  then % or$ then optional % or § :
                                                // and < 20  , a model match with entity name (<entityname>) declared : $X(Z)<entityname>:...  Z can be % or § ,  X can be $ or % 
                                        

                                        if (condition.pattern.charAt(itr + 1) == ':') {// &%%mod_Serv:: , second ':'  means look in model definition. see excel .....
                                            // case  $$mod_Serv::   >>>   excel declaration : of entity mod_Serv

                                            //  in cms condition :        '$$mod_Serv::' as regex type

                                            // in excel , def will be in (dejson from a string ):

                                            //  excel:{,,,,
                                            //      mod_Serv:{
                                            //          ,,,,

                                            //         model:{bar:{// a instance of the model
                                            //                      patt:ristorant*|pranzo|cena|trattoria',
                                            //                      ai_url:'',
                                            //                      vname:'',,,}
                                            //                  ,,
                                            //          },
                                            //          ,,,
                                            //      },,,
                                            //  }



                                            //052020
                                            entity = condition.pattern.substring(2+sk_, itr);// mod_loc   $$mod_loc::   means look in model definition. see excel .....
                                            // model:'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast'

                                            // model definition is get from excel[entity].model :
                                            if (step.values.excel[entity] && step.values.excel[entity].model) pattArray = step.values.excel[entity].model;// get voice entity name from excel
                                            // matcher=// no custom matcher needed
                                            setAskDir(entity,previous,condition,state);// get macro to set session.dir run time directive but not use the matcher setting , we use std REGEX matcher 
                                            //if(state.dir.asks[previous.collect.key].cond[entity]= JSON.parse(condition.macro))

                                        } else if (condition.pattern.charAt(itr + 1) == '>') {// $$dyn_medicine:>
                                            /* **** this condition,
                                                  supposing the user knows the pattern to get a match on some item of the query result cursor got in its step.values.askmatches[desiredE] onchange(),

                                                    TRY TO  DO   selection on a ask desiredE ($$desiredE:>) cursor : step.values.askmatches[desiredE].param.cursor ( many rows results )
                                                    >> so create on fly a matching model as :  pArray=cursor.resModel, named entity=askname!!!!!
                                                        then , if a match has got at index i=blRes in pArray, in addMatcRes()  we set  :

                                                         - step.values.askmatches[desiredE].param.group.sel=   
                                                                ={item:mydata[blRes],index:blRes};// (can be default if no selection done ( in this case mydyn.param.group.def is null)
                                                         - temporely add also (to distiguish a query with 1 row and a query selected by some other ask):
                                                           step.values.askmatches[desiredE].param.selmatched=
                                                                =previous.collect.key // the .sel is set by a other ask selecting  a cursor with many rows 


                                                    **** question : these are set also by this selecting ask ,not only by desiredE query if lenght =1  ??????????
                                                            param.match=blResNam;//=blResItem[1];//  cursor matched item name ( and item copied to .sel)
                                                            param.vmatch=blResItem[12];//   cursor matched item vname ( and item copied to .sel)
                                                    ..... and other details see addMatcRes() 
            
                                            */



                                            // example $$dyn_rest:>  > will select on the query result  in vars.askmatches.dyn_rest.param.cursor.rows ( a array)
                                            //          nb the normal  ask containing this '$$desiredE:>' resolver condition will be preeceeded by a msg 
                                            /*  prompting user to select from a voice item list :

                                            {{#mustacheF.out}}$$list&12& 
                                            le medicine che devi ancora prendere questa mattina sono :<br>
                                            {{#dyn_medicine.param.cursor.rows}}
                                             {{mustacheF.rendQuery}}
                                            {{/dyn_medicine.param.cursor.rows}}
                                            {{/mustacheF.out}}
                                            */


                                            /* OLD STAFF , TO LEAVE OR TOREVIEW ::
                                            // so
                                            // the case ':>' instead of '::' will : 
                                            //     In case is a cursor on a data desired entity associate with a key=dyn_rest we build the model on data matrix 
                                            //          data = desire entity with bl data and inflacted with join where

                                            // let previous key=collect.key=CK 

                                            //  - the cursor is a array with 0/1 param.match... ( non just param.def and param.sel ) (the entity instance matching  called group)
                                            //    - the selection is a vars.askmatches.CK.param.group.sel ( a bl map of a entity instance as usual in colazione ) 
                                            //  - the model is a projection of the bl matrix on the patt col

                                            // so that means we consider a model named mod_CK got as the col_i of the entyty associated with 
                                            //  the desidere ask( the dyn_rest )
                                            // KKJJ
                                            // after as usual   ... got the match we fill a usual desire selection entity setting :
                                            //  >  vars.askmatches.CK.param.group.sel=dataof_dyn_rest[indexmatched] and used in template as would be the vars.askmatches.dyn_ask.param.group.sel
                                            //  excel:{,,,,
                                            //  }
                                            */


                                            cursor = null;// calclate param from desire ask onchange()
                                            entity = previous.collect.key;// on running generated modell (same name of the ask !!!!!!!!!!)
                                            // reset the entity just in case alredy matched in past 
                                            if (step.values.matches[entity]) {
                                                step.values.matches[entity].match = null;
                                                // needs ? step.values.matches[entity].mid=-1;
                                            }
                                            desiredE = condition.pattern.substring(2 + sk_, itr);// mod_loc
                                            // model:'bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast'
                                            // mydyn.param.cursor={matches,patt}
                                            let des = askmatches[desiredE];
                                            if (des && des.param.cursor && des.param.cursor.resModel) {// the query has many rows
                                                param = des.param; cursor = param.cursor;// des.param.cursor={rows:res.rows,resModel:{}}
                                                /*
                                                     resModel={val1:{
                                                                     patt:regexstr,
                                                                    vname:'pippo'
                                                                     }
                                                    }*/
                                                pArray = cursor.resModel;// the model to select an item
                                                // 12042020 , did ok . 
                                                // old , discard 
                                                //  TODO check if KKJJ would work 
                                                // (the view just chech if there is a single selection ...param.group.sel or manyrows in cursor )or instead do as following :
                                                // IF MATCHES   WILL can set a model refearring to the name/id of the master query so we can run the query so will got a single row
                                                // so group view will show params ( mod_wh ) for a single row !!!





                                            }
                                            // like in onchange runQuery we define a param result (passed to addMatcRes()) of  a query ask match:
                                            // mydyn=askmatches[entity]={matched:null,complete:'fail'};





                                        }// end $$adynaskquery:>
                                        else {// condition in line declaration >  $$entityname: or $$%entityname: or $%entityname: or $%%entityname:

                                            // a MODEL/Entity FOUND to MATCH (no Excel (model.js)  Model definition ) so can be :
                                            //     -  std Inline Regex Matcher 
                                            //      or can be a 
                                            //     - Matcher service

                                            //   condition declaration :
                                            //          $$mod_Serv:bar-bar&rest-ristorant*|pranzo|cena|trattoria&port-portin*|recept&pisc-piscina&lav-lava*puli*&col-colaz*|brekfast


                                            pattArray = condition.pattern.substring(itr + 1, condition.pattern.length);//substring(itr,nextitem-1)
                                            entity = condition.pattern.substring(2 + sk_, itr);
                                           
                                           // 
                                            matcher=
                                            setAskDir(entity,previous,condition,state);

                                        }

                                    } // ends case model match

                                    else { // match text against single condition pattern, not a model with many entities . seems an error / not possible 
                                        // TODO : better exclude this case 
                                        // WARNING here we have $$....................     with no :   so ERROR 
                                        console.error('probably ERROR in pattern format , cant be $$ without :')
                                        entity = previous.collect.key;// WHY ???????? what to do with this entity ????
                                        pattArray = condition.pattern;
                                    }
                                    // pattArray='ma-mario&lu-luigi|gigi'



                                    // todo if $% and alredy matched we dint need to retry matching !!!!!!!!!!
                                    let matched = false,// matched before or in this test 

                                        rematch;// the regex extraction ( due to ()) used in  addMatcRes , bad name !!

                                    // gives error : if(chkMatcRes(entity)==null){ //  if didnt match do it 
                                    // so :
                                    if (!retest && chkMatcRes(entity)) {
                                        //  it already matched , so if is $$ we must stop testing the loop and route

                                        //  if chmatch true : store previous past match. if exists past match  and we dont match current restore past match
                                        if (chmatch) prevMat = step.values.matches[entity];// is also :matched=false
                                        else {
                                            matched = true;

                                            if (linematch) path = condition;// do not route if is $%  0503
                                        }

                                    }

                                    // DO MATCHING PHASE

                                    if (!matched) {// start  if didnt match do it  , or retest , or chmatch to do , do it 
                                        step.values.matches[entity] = null;// reset previous match 

                                        matched = false;
                                        let itemb;
                                        let ii = 0;


                                        if(!matcher){// special matcher is missing , so  a std matcher regex
                                        let  itr1;// when 0 stop while

                                    /* no good :
                                    // pattern description x regex entity
                                    // base format pattArray={itema-regexa&itemb-regexb&.......}
                                    // if firse 4 char is : {xy}, take x instead of - and y instead of &
                                    let itemSep='&',nameSep='-';
                                    if(pattArray.length>7&&pattArray.charAt(0)=='{'&&pattArray.charAt(3)=='}'){// set x,y
                                        itemSep=pattArray.charAt(2);nameSep=pattArray.charAt(1);
                                        pattArray=pattArray.substring(4);
                                    }

                                    if(pArray)itr1=Object.getOwnPropertyNames(pArray);
                                    else {
                                        // TODO TODO todo : do the same on mod_feature branch
                                        if(pattArray.length>7&&pattArray.charAt(0)=='{'&&pattArray.charAt(3)=='}'){// set x,y
                                            itemSep=pattArray.charAt(2);nameSep=pattArray.charAt(1);
                                            pattArray=pattArray.substring(4);
                                        }
                                        itr1=pattArray.split(itemSep);
                                    }
                                    for(ii=0;ii<itr1.length;ii++){// gh for all item in model test it 


                                    if(pArray){
                                        patt = pArray[itr1[ii]].patt;
                                        storemat = itr1[ii];
                                        console.log(' condition try matching : $$ case , ii: ',ii,' storemat(matched item value/name)  is  ', storemat, ' patt is : ', patt);
                                    }else{
                                    let sar=itr1[ii].split(nameSep);//itr1[ii].indexOf('-');
                                    if (sar.length > 1) {
                                        patt = sar[1];
                                        storemat = sar[0];
                                        console.log(' condition try matching : $$ case , ii: ',ii,' storemat(matched item value/name)  is  ', storemat, ' patt is : ', patt);

                                    } else notest = true;
                                    // end for 
                                    }*/



                                    // 072020
                                    // pattern description x regex entity
                                    // base format pattArray={itema-regexa&itemb-regexb&.......}
                                    // if firse 4 char is : {xy}, take x instead of - and y instead of &
                                    let itemSep='&',nameSep='-';



                                    
                                        if (pArray) itr1 = Object.getOwnPropertyNames(pArray);
                                        else {
                                            // TODO TODO todo : do the same on mod_feature branch
                                            if(pattArray.length>7&&pattArray.charAt(0)=='{'&&pattArray.charAt(3)=='}'){// set x,y
                                                itemSep=pattArray.charAt(2);nameSep=pattArray.charAt(1);
                                                pattArray=pattArray.substring(4);
                                            }
                                            itr1=pattArray.split(itemSep);
                                        }

                                        for (ii = 0; ii < itr1.length; ii++) {// gh for all item in model test it 
                                            // start  condition try matching 


                                            // TESTING from the declared entity in excel :  
                                            //                                      if the entity is described in excel ( in excel every item has a name and a patt and a vname , and can have description and some bl values )
                                            //                                              we test its item :
                                            //                                              itemname storemat with pattern patt  
                                            //                                     if the entity is described in excel just with the entity name and the algo/external REST url that will resolve
                                            //                                               we call the name resolved by external algo 'value' and the resolved  matching entity ( atomic or obj ) are put in storeval
                                            if (pArray) {
                                                patt = pArray[itr1[ii]].patt;
                                                storemat = itr1[ii];
                                                console.log(' condition try matching : $$ case , ii: ', ii, ' item (storemat) :  ', storemat, ' on patt : ', patt);
                                            } else {
                                                let sar;//=itr1[ii].split('-');//better as the regex can contains '-' , so itr1[ii].indexOf('-');
                                                //sar = itr1[ii].indexOf('-');
                                                sar = itr1[ii].indexOf(nameSep);
                                                if (sar >= 0 && sar < itr1[ii].length + 2) {// >1 2 ?

                                                    storemat = itr1[ii].substring(0, sar);
                                                    patt = itr1[ii].substring(sar + 1);
                                                    console.log(' condition try matching : $$ case , ii: ', ii, ' item (storemat) :   ', storemat, ' on patt : ', patt);

                                                } else notest = true;
                                                // end for 
                                            
                                            }
                                            

                                            // test = new RegExp(patt, 'i');


                                            // TODO: Allow functions to be passed in as patterns
                                            // ie async(test) => Promise<boolean>

                                            // *** TRY MATCHING iesimo item in Entity Model
                                            if (!notest && (rematch = ttest(tomatch, patt))) {// rematch means 'match result'. match if ttest returns a not null rematch. rematch[1]>matches.entity.
                                                // ok : 
                                                console.log(' \n * MATCH Detected on MODEL :$$ or $% condition, at thread ', thread_name, ',step ', step.index, ' ,previous ask key ', previous.collect.key, ' ,ask condition index ', p, '\n  model  ', entity, ', matched model item : ', storemat, ', model index : ', ii, ', extracts: ', rematch);
                                                step.values.__conf = step.values.__conf || '';// confirm  the user matched something 
                                                //if(data !== null && data !== ''  && data!==undefined) {}  You can use below simple code
                                                // if(Boolean(value)){ 
                                                if (rematch.length > 1 && Boolean(rematch[1]) && storemat == 'value') {// manage a value :the 'item name' is 'value' , it assumes the matched val that must be first group

                                                    storeVal = rematch[1];

                                                    // step.values.excel[entity].vmatches.value;// is not used 
                                                    step.values.__conf += storeVal;
                                                } else {// manage a entity item name : recover the vname from excel model 
                                                    storeVal = null;
                                                    // recover vmatch if present on model
                                                    if (step.values.excel[entity] && step.values.excel[entity].vmatches) step.values.__conf += step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                                                    else step.values.__conf += storemat;
                                                }

                                                if (linematch) path = condition;// do not route if is $%
                                                /* put in addMatcRes :
                                                if(mydyn){// a cursor selection case ii is the matched index 
                                                        mydyn.param.group.sel=step.values.askmatches[desiredE].cursor.data[ii];
                                                        //todocheckvname vmatches; now we can find in data[][]=mydyn.param.group.sel[12];
                                                        //=mydyn.param.group.sel[12];
            
                                                }*/

                                                matched = true; break;// break ii loop, (loop: in a $xy condition for all item in model test it )
                                            } else {// 
                                                //  addMatcRes(false,entity);
                                            }


                                        }//  end condition try matching. gh  end ii for , test item in model
                                    }else{// a not std matcher (regex)

                                        // ****  MFM code section : fire a matcher and insert the result depending on the request type ( usually looking at condition.type  )
                                        //      see :  setAskDir()

                                        // get the matcher named 'matcher' in this._vcontroller.fwCb.askS . usually can use matcher='dynMatch'

                                        let matchTyp=0,// entity ,  that is got looking at condition.type : if(condition.type.subString(0.x)='macro...')
                                            mT;// the matching type to set in obj result can be  Ent/Int/Cur


                                            // **** result storemat MUST extend a std model + type field to be managed by addMatcRes() !!!
                                            // storemat={value,type,descr,,,,+blfields}


                                        if(matchTyp==0){

                                            // > ENTITY MATCH MATCHER case (matchTyp=0):
                                            mT='Ent';

                                            if(state.dir){// state.dir.asks.....  must have been declared as directive !  , the matcher directive  , usually set in macro condition , must have an entry in 


                                            

                                            // nb are there differences beetween    step.values.excel.direc[previous.collect.key] and  state.dir.asks[previous.collect.key]  , are they congruent/copied ??
 
 
                                            // nb we have alredy pattArray = step.values.excel[entity].model
                                           // async
                                            let matchIn,matched_=false,res=null // a obj , x example :{match,rows:[[vmatch,id,rowspatt,shortD,bldata1,bldata2,,,],,],type='dynEnt/dynCursor,,,,,}

                                            // find matcher/agent schemaurl must be in model
                                            // >>>>>>    MUST BE SAME INTERFACE AS : _vcontroller.service.dynMatch

                                            if(this._vcontroller.fwCb.askS[matcher]){// TODO test this way 
                                              // old run without set service context :  matchIn=this._vcontroller.fwCb.askS[matcher];

                                              // run with context this._vcontroller.service ???????
                                              matched_=yield this._vcontroller.fwCb.askS[matcher].call(this._vcontroller.service,tomatch,this.id,previous.collect.key,entity,step,(val)=>{res=val[0];});// a cb to set vars in template js code .general int , returns a match obj , see dynMatch in onchange.js
 
                                            }
                                            else if(this._vcontroller.service[matcher]){
                                                // matchIn=this._vcontroller.service[matcher];
                                                //  matched_=await // on *function you yeld not await !!!! 
                                                // run matcher on its service context this
                                             matched_=yield this._vcontroller.service[matcher](tomatch,this.id,previous.collect.key,entity,step,(val)=>{
                                                
                                                 if(Array.isArray(val))res=val[0];else res=val;
                                                 if(res&&res._doc)res=res._doc;// if a db mongo query better take row._doc as row . take that as  db cursor fields
                                                // >>>>>>>>>>><   a row  should be a std format : {value,patt,data,descr,+bl } so at least value ( is the voice name ) and patt
                                                // so as in case of static match we will fill the matchers[entity] looking for item description in excel ( )
                                                //  ........................................



                                            });// a cb to set vars in template js code .general int , returns a match obj , see dynMatch in onchange.js
                                            }else;//  matched=false , dont match 

                                            // useless if(matchIn){// see comment in 
                                                // start GHTR  

                                            
                                           // out int : + std dialogflow like  intent format, like askmatches :
                                            // nb notmatched prompt default is in state.dir.asks[previous.collect.key].cond[entity].notMatchPrompt
                                            // so you can overwrite that
                                           // state.dir.asks[previous.collect.key].cond[entity].notMatchPrompt=matched_.nmp;

                                            if(matched_&&res){ 
                                                if (linematch) path = condition;// do not route if is $%

                                                // store the RESULT (Management)
                                                // the dyn result can be ( depend from TYPE of the condition )
                                                //      - a ask query cursor ,                          > store in askmatches structure 
                                                //      - ask testing a intent resolution        > askmatches structure set in way like a dynquery are storen in a onchange 
                                                //      - or a simple model match               > matches structure     set in way like a intent are storen in a onchange 
                                                // if the turn will not change we cn store the result in the same ask , otherwise a child will manage the turns needed

                                                // HERE ARE CODED THE TYPE macro entity match !!!!!


                                                    // here the item matched cols is a like a static model item as in excel definition , so have value, patt, descr and some bl fileds 
                                                    // IF they will be used after we can store the match item fields in xcel as a model matched item

                                                    // if the result is a master row or a intent it will be attached to the ask in askmatches structure and used by following conditions WITH THE SAME user text ( TURM)
                                                    // in case the rest call do not change the TURN (usual) we can store the intent on the same ask if not alredy used  
                                                    // >> in case of a child , there can be user turns and the child resolved intent/master will be attached in a next ask askmatches !!!!!!!!!!!!!!!!!

                                                let vmatch,descr;
                                                // get surely known filed , other can be retrived in template by vars.matches:

                                                // match can be the same as vmatch
                                                if(res){

                                                  
                                                    

 
                                                // add fields so that addMatcRes() knows the type of result to insert 
                                                res.type=mT;// storemat.value must exists !!!!
                                                // do after : storematch.vmatch=storematch.match=rows[value];// NOT STRING so addMatcRes() wil set vars.matchers[entity]=storematch

                                                step.values.__conf +=res;// toString() ??  // if(matched_.vmatch)step.values.__conf +=matched_.vmatch;
                                                storemat=res;// OR a object ??? 072020 matching in a not standard matcher ( static model enitity described in excel ) is a obj with .match and .type
                                                matched=matched_;// true
                                                }

                                            }else;// matched=false 


                                            // } // END  GHTR
                                            // else;// matched=false 

                                        }

                                        }else if(matchTyp=1){
                                            // if(match intent or get query master curson .....)
                                            mT='Int';
                                            // ...............
                                        }else if(matchTyp=2){
                                            // if(match intent or get query master curson .....)
                                            mT='Cur';
                                            // ...............
                                        }




                                    }// a not std matcher ends
                                

                                        /* 
                                        function addMatcRes(mat,entity,storemat){// register last turn match asked with $$ or $% result 
                                            // mat      : true if entity is matched
                                            // entity   : model name ($$ case) otherwise condition  index 
                                            // storemat : matched item value 
            
                                            // so matches can be available in out as step=this ,this.values.askmatches[thisaskmatchesname].match/nomatch='entity1|entity2'
                                            let mf;
                                            if(mat)mf='match';else mf='nomatch';
            
                                            // register only model matches : 
                                            if(mat)step.values.matches[entity] = storemat;// register under values.matches.entity=itemvalue
             
                                            step.values.askmatches[previous.collect.key]=step.values.askmatches[previous.collect.key]||{match:[],nomatch:[]};
                                            // if(step.values.askmatches[previous.collect.key][mf])
                                                step.values.askmatches[previous.collect.key][mf].push({key:entity});
                                            // else step.values.askmatches[previous.collect.key][mf] = {key:entity};// first value
                                            //step.values.askmatches[previous.collect.key].match += entity;// += '|'+entity in case of multimatch. register too the step was  matched in favor of entity 
                                       
                                        }*/



                                        /* mng summary : register the match/no match :
                                            - if matches register the ask matches 
                                                and the 
                                        */

                                        // ******* Register the match/no match
                                        if (matched) {
                                            if (storemat) {// if there is the entity value , so in case of $$ , a model match or a integer/string got (itemname=value)
                                                /*
                                                step.values.matches[entity] = storemat;// register under values.matches.entity
                                                step.values.askmatches[previous.collect.key]=step.values.askmatches[previous.collect.key]||{};
                                                if(step.values.askmatches[previous.collect.key].match)step.values.askmatches[previous.collect.key].match='|'+entity;
                                                else step.values.askmatches[previous.collect.key].match = entity;
                                                //step.values.askmatches[previous.collect.key].match += entity;// += '|'+entity in case of multimatch. register too the step was  matched in favor of entity 
                                                */

                                                let ssm=matcher==null;// stdStaticmodel with regex model
                                                // if(prevMat);// if there was a previous match to check and matches:  rebuild matching status , as was matched from new
                                                if (chmatch) {// xy§ ex $$§ : also here do routing to new match also if was the same as before
                                                    if (linematch) path = condition;// do not route if is $%  0503
                                                    addMatcRes(true, entity, storemat, ii, linematch, rematch, null, param, storeVal,ssm);// rebuild anyway

                                                }
                                                else addMatcRes(true, entity, storemat, ii, linematch, rematch, null, param, storeVal,ssm);// linematch means to route on this condition , if maches
                                            } else addMatcRes(false, entity, null, ii, linematch);
                                        } else {// not matched
                                            if (prevMat) {
                                                // if there was a previous match to check leave the previous matching status , but do not consider matched now this condition
                                                console.log('  check MATCH: no new match so just leave previous match status,  at step index ', step.index, ' condition : ', condition);
                                                // if chmatch store previous, if exists and we dont match current restore past match
                                                step.values.matches[entity] = prevMat;//  restore previous, do nothing
                                            }
                                            else addMatcRes(false, entity, null, ii, linematch);

                                        }
                                         // ******* ends Register the match/no match

                                    }// end  if didnt match do it

                                    if (linematch && matched) break;// dont break in $% case (linematch is false). break condition loop  for (p= ....)

                                }// end $$ case

                            } // end $xy cases 

                            else {// no $$$ , no $$ ,no $% case

                                patt = condition.pattern;

                                //test = new RegExp(patt, 'i');

                                // TODO: Allow functions to be passed in as patterns
                                // ie async(test) => Promise<boolean>
                                if (!notest && ttest(tomatch, patt)) {// no model, just test tomatch (text or a var) against patt
                                    console.log('\n  MATCH Detected : regex condition matched  at step index ', step.index, ' condition : ', condition);
                                    /*if (storemat) {
                                        step.values.matches[entity] = storemat;// register under values.matches.entity

                                        step.values.askmatches[previous.collect.key].match = entity;// += '|'+entity in case of multimatch. register too the step was  matched in favor of entity 
                                    }*/

                                    addMatcRes(true, null, null, p, true,true);// if a condition with no model matches we register a match {ind:4} and not {key:value}


                                    path = condition;
                                    break;// break p index
                                }

                            }// end no $$$ , no $$ ,no $% case
                        }// end hyt
        // ******* model matching section ends 


                            // STARTING MOOVING FUNCTIONS ON vCtl :
                            // put on top of this function let addMatcRes=this._vcontroller.vfwF.addMatcRes;
                            function addMatcRes(mat,// true : matched
                                entity,
                                storemat, // a string for simple static model match , a obj if we matched a entity , intent , or a query result 
                                        // storematch='thematchedvalue'
                                        // storematch={type:'Ent'/'Int'/'Cur',.....}
                                
                                // WARNING pay attention that the model name can be called in different condition also with a different inline matching definition
                                // so in this case we must known which model definition we applyed when , here, registerd the match  !!!!
                                storeMId // storemat isthe value/name matched,  storeMId is the index p 
                                ,routing// routing=linematch is true if not $% case ( not routing case ) so this condition will stop the cond loop
                                ,rematch// the regex matched extraction (....)
                                ,reset// reset matches ???? never called !!!!!!!!!!!!!!!
                                ,param,// not nul if this is a resolver selection ask
                                storeVal// a integer or string to get from user 
                                ){
                                    addMatcRes_(mat,// true : matched
                                        entity,storemat,storeMId // storemat isthe value/name matched,  storeMId is the index p 
                                        ,routing// routing=linematch is true if not $% case ( not routing case ) so this condition will stop the cond loop
                                        ,rematch// the regex matched extraction (....)
                                        ,reset// reset matches ???? never called !!!!!!!!!!!!!!!
                                        ,param,// not nul if this is a resolver selection ask
                                        storeVal// a integer or string to get from user 
                                        ,step,previous
                                        )

                                }

//////////////////////////////////////////    put in onchange !!!!!

                            function _addMatcRes(mat,// true : matched
                                        entity,storemat,storeMId // storemat isthe value/name matched,  storeMId is the index p 
                                        ,routing// routing=linematch is true if not $% case ( not routing case ) so this condition will stop the cond loop
                                        ,rematch// the regex matched extraction (....)
                                        ,reset// reset matches ???? never called !!!!!!!!!!!!!!!
                                        ,param,// not nul if this is a resolver selection ask
                                        storeVal// a integer or string to get from user 
                                        ){// register model/entity match, last turn match asked with $$ or $% result 

                                /* if condition with entity ( $$ or $% case )  we register  a model match ( entity instance  = itemname) :
                                      adding  {key:entity} to  values.askmatches.askname.match array (  values.askmatches.askname={match:[{},,,,],nomatch:[]} )
                                      + setting                         values.matches.entity={match:itemvalue}
                                                 if exist def in excel : values.matches.entity={match:itemvalue,vmatch:vars.excel.entity.vmatch,data:rematch[1]=matches.entity} 



                                      or not matched :
                                      adding {key:entity} to  values.askmatches.askname.nomatch array (  values.askmatches.askname={match:[{},,,,],nomatch:[]} )

                                 if a condition with no model matches we register a match {ind:4} (and not {key:value})
                                    adding {ind:4} to  values.askmatches.askname.match array (  values.askmatches.askname={match:[{},,,,],nomatch:[]} )
                                    if do not match ,do nothing  

                                */

                                // mat      : true if entity is matched, false 
                                // entity   : model name ($$ case) otherwise null condition  index 
                                // storematch, storeMId is 
                                //              if condition is $$ $% ( model match) : the name/value matched () entity not null),
                                //              storeMId is the id of matching condition 
                                
                                /*  *******    master/desire entity simple relation with ask conditional described as $$ 

                                          the entity/model should be  is defined somewhere (in excel ...)
                                          in this very simple implementation the view is not bind to the model ( id/name/voicepattern/shortdescriptio)
                                          but just set by $$ condition munually copyng the name/pattern field
                                          in future (DONE !)  we should do $$mod:areference on the model description file set somewhere in 
                                              the model/field dialog description bind to a static (file) descriptio or to a dyn db schema
                                          here the where model are just the space of a relational where entity put directly in a col of master entity ( desire entity)
                                              whith its id or name ( both are key)
                                          so to make sintetic : $$....reflect the name-voicepattern of a implicit model whose id/name is put in a where field of the related master desire entity
                                    ******
                                */



                                // storemat : matched model item name/value ($$ case), otherwise condition  index

                                // old : so matches can be available in out as step=this ,this.values.askmatches[thisaskmatchesname].match/nomatch='entity1|entity2'
  
/*
                                                        askmatches=convo.vars.askmatches,/* askmatches={aask:{

                                                                match:'aval',
                                                                matches:[{key:'aval'},{key/ind:oneindex?},,],// models matches  , one routing (std, $$,$$$, no $%) index 
                                                                nomatches:[{key:'aval'},,,],// only models
                                                                ... some onchange added fields , ex : matched complete desire param ...
                                                            }}
                                                    modmatches=convo.vars.matches.amodel={match:itemvalue-key,vmatch:voicenameofitem,data:xqea}

*/


                                console.log(' ** addMatcRes called to set matching result  ,mat: ',mat,',entity: ',entity,',storemat: ',storemat,', routing: ',routing);


                                if(reset){


                                    if(entity)step.values.matches[entity]=null;
                                        askmatches[previous.collect.key]=null;

                                     return;
                                }

                                let mf,amatch,amatchId;
                                if(mat)mf='matches';else mf='nomatches';
                                if(entity)amatch={key:entity};// the model/entity name matched/not matched
                                amatchId={id:storeMId};// normal condition match with no model 


                                // do in main p loop if(storeMId==0)step.values.askmatches[previous.collect.key];// reset if start conditions loopif(reset){

                                // nb step.values.askmatches[previous.collect.key] can be alredy filled with short bl status (like qs in reload after a web form)
                                askmatches[previous.collect.key]=askmatches[previous.collect.key]||{matches:[],// [mod_ent1,mod_ent5,,] also condition with $%
                                                                                                                            match:null,// {key:'mod_ent5}condition not $% (so routing)
                                                                                                                            mId:null,// {id:5} // present also in no proper entity
                                                                                                                            nomatches:[]};//  [mod_ent2,mod_ent3,,]adds only $% or $$  case
                                askmatches[previous.collect.key].matches=askmatches[previous.collect.key].matches||[];
                                askmatches[previous.collect.key].nomatches=askmatches[previous.collect.key].nomatches||[];
                                
                                // if(askmatches[previous.collect.key][mf])
                                    if(entity)askmatches[previous.collect.key][mf].push(amatch);

                                    //             FIXED   ERROR  
                                    // when a past alreday ask matched we need to unmatch when testing again tll get a new match
                                    //  >>> so to make easy unmatch at any unmatched condition. the ask match only at last routing condition 
                                    //   DEFALUT THREAD EXCLUDED !!!!! 
                                    askmatches[previous.collect.key].match=null;  

                                    if(routing){ askmatches[previous.collect.key].match=amatch;// stop condition routing
                                                    askmatches[previous.collect.key].mId=amatchId;}// 

                                    //                ERROR  
                                    // when a past alreday ask matched we need to unmatch when testing again tll get a new match
                                    //  >>> so to make easy unmatch at any unmatched condition. the ask match only at last routing condition 
                                    //   DEFALUT THREAD EXCLUDED !!!!! 


                                // else askmatches[previous.collect.key][mf] = {key:entity};// first value
                                //askmatches[previous.collect.key].match += entity;// += '|'+entity in case of multimatch. register too the step was  matched in favor of entity 
  


                                // model settings in this normal ask (no queryask/desidereask )
                                // model can be 
                                // - defined in condition patt line ( $$entity:.....) or 
                                // - in excel  ( $$entity::) or 
                                //  - defined on run  ( $$desidereAsk:;) in a CONDITION that  resolve a selection of a desire onchangequery ask, the name is entity='mod_'+previous.collect.key
                                //      in this care storemat is the selected/matched item name/value
                                // register only model matches ( not register model notmatching in nomatches field, if dont match match=null !):

                                if(entity){// in this condition we  manage matching (vars.matches/askmatches) on model and value entity/value ($$,,)


                                    let rT;
                                    if(typeof storemat === 'string' || step.result instanceof String) rT=0;
                                    else if(storemat == 'Ent' )rT=1;
                                    else if(storemat == 'Int' )rT=2;
                                    else if(storemat == 'Cur' )rT=3;

                                    let isVal=storeVal&&rT==0&&storemat=='value',// a model whose values are generated by the regex group match 
                                                                                //  ( example the user say a number 
                                                                                //   or also a entity got from a ai model ? ), 
                                                                                // not the item name declared in excel in a static model
                                        mv=step.values.matches[entity];
                                        
                                    if(mat){// matches

                                        if(rT=0){
  


                                        if(isVal){// the entity is a value ( item is the regex match value)
                                        mv ={match: storeVal};// register under values.matches.entity=itemvalue
                                        mv.mid=1;// dont use this, usable to see if is match is good 
                                        }else{// a finit dimension entity like store in excel/condition

                                            // get   the type of match :
                                            // string : normal entity value
                                            // obj  : 
                                            //      can be a dyn model match 
                                            //      a dyn master query will have storematch.type=query
                                            //      a intent  will have storematch.type=intent

                                            // GET the result Type 

 
                                            mv ={match: storemat};// register under values.matches.entity=itemvalue
                                            mv.mid=storeMId;



                                        }


                                            }else if(rT=1){// a std model selected/matched entity item row {value,descr,,,,,, + bl fields }
                                                mv =storemat;storemat.vmatch=storemat.match=storemat.value;// bl fields can be recovered by vars.matches[].someblfiled
                                            }else if(rT=3){// query cursor
                                                mv ={match: null};
                                            }else if(rT=3){// query cursor
                                                mv ={match: null};
                                            }else mv ={match: null};// do no set matchers
                                        
                                    }else mv ={match: null};// tested but not matched // so not matched is matches[entity]=null???

                                    if(isVal){// anyway

                                    if(param&&param.group) {// this condition is selecting on cursor param set by a desiredE dyn ask : param=step.values.askmatches[desiredE].param
                                                            // the model that matches the cursor has the same  name as this desiredE ask :
                                                            // NB in this case the model that matches is 'created' here: entity =previous.collect.key , the name of this ask in testing
                                                            //      so is not the name of a declared model in excel ! or in line condition : &&model:....

                /* remember what said in bot.js onchange :
                the cursor can be passed to a resolver ak that will find a single match , so will complete the setting of :

                param.group.sel={item:mydata[blRes],index:blRes};// can be default if no selection done ( in this case mydyn.param.group.def is null)
                param.match=blResNam;//=blResItem[1];//  name  ex 'caffe top'
                param.vmatch=blResItem[12];// voice name 
                */



                                        // entity is the on running generated model by the condition resolver with same name as the ask !
                                       //  step.values.matches[entity]={match: storemat};// alredy done 
                                       // adds matched item copyng from desidere ask :
                                       // param=step.values.askmatches[desiredE].param

                                       // UPdate the desire query param ( so add a match and a sel)


                                       param.group.sel={item:param.cursor.rows[storeMId]
                                        //,index:blRes
                                       };// index storeMId refears to cursor.rows index not to table/data index !! so take care ! 



                                       param.match=storemat;// ?? touch the desire ask result ?
                                       param.vmatch=param.cursor.resModel[storemat].vname;// ?? touch the desire ask result ?
                                       param.selmatched=entity;// a way to see in param  if the match is a single row cursor or a following selection match,
                                                                // entity=previous.collect.key 

                                       // now the generated mode . should i add  param ??? on model or on ask ? both ? 
                                       //step.values.matches[entity].vmatch=step.values.askmatches[desiredE].param.group.sel[12];
                                       mv.vmatch=param.vmatch ;// pass in param ??

                                        // attach param to model ( AND to this normal ask ? )
                                        mv.param=param;
                                        askmatches[previous.collect.key].param=param;
                                       


 

                                    }else{

                                        if(isVal){
                                            mv.vmatch=step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                                       }else{// recover voice name  if there is registered  in excel :
                                        if(step.values.excel[entity]&&step.values.excel[entity].vmatches)mv.vmatch=step.values.excel[entity].vmatches[storemat];// get voice entity name from excel
                                        }
                                    // leave previous matches if '§' nb cant be used in vuluetype model !!
                                    if(rematch&&rematch[1])mv.data=rematch[1];// see ttest() return ( returns regex catch () ) ,store matched data to run on a routed displayng dyn key onchange (the thread msg on a $$ condition gotothread )
                                         }
                                        }// end if isVal

  

                                 }



                                /* *** askmatches mng OVERVIEW
                                    usually this are the vars used 

                                    - in desire ask that do onchange trying to resolve a single match of a single item:
                                      >in template :

                                        {{vars.askmatches.dyn_rest.param.......}} 
                                            example {{vars.askmatches.dyn_rest.param.match}}
                                                    {{vars.askmatches.dyn_rest.param.vmatch}}
                                        
                                        and 
                                                {{vars.askmatches.dyn_rest.param.group.....}} the group class view attributes( class_/resourcetype group view of item) of matching item/instance
                                                    example {{vars.askmatches.dyn_rest.param.group.name}}
                                                            {{vars.askmatches.dyn_rest.param.group.vname}}

                                                         nb in this implemtation of item cols (bl attributes)
                                                            {{vars.askmatches.dyn_rest.param.group.sel.item[1]}}==
                                                             {{vars.askmatches.dyn_rest.param.match}}, 

                                                             {{vars.askmatches.dyn_rest.param.group.sel.item[12]}}==
                                                             {{vars.askmatches.dyn_rest.param.vmatch}}
 
                                                {{/vars.askmatches.dyn_rest.param.group.sel.....}}// the matched model item view attributes 



                                                example : the matched model value/name {{vars.askmatches.dyn_rest.param.group.name}}
                                                        the matched model vname {{vars.askmatches.dyn_rest.param.group.vname}} ( = {{vars.matches.mod_Serv.vmatch}} 

                                     > in condition:

                                        {{vars.askmatches.dyn_rest.complete}} the onchange query matching process result 

                                    - in resolver  CONDITION  trying to resolve a single match of a desire ask multi results we set and use :

                                             IN NEXT ROUTED (by resolver condition )  MSG we can use in template :

                                                {{vars.askmatches.dyn_rest.param.group.sel.item...}} ( so as we routed from a resolver query ) 

                                                    nb desire ask multi results store rows setting  :
                                                            mydyn.param.match=mydyn.param.vmatch=null;// nb different from a non dyn ask !!!
                                                            mydyn.param.cursor={rows:res.rows,resModel:{},data,param} 

                                                and as previous, select a item  setting :

                                                    {{vars.askmatches.dyn_rest.param.match}} and 
                                                    {{vars.askmatches.dyn_rest.param.vmatch}}
                                        
                                                but dont change .group staff that was set in desire ask onchange :
                                                            example :

                                                                param.group.name=gr[1];// example col or rest 
                                                                param.group.vname=gr[5];// example colazione or ristorante
 
                                    - in normal ask 
                                      >in template :


                                                        {{vars.askmatches.akey.match}}  the condition model that caused not default routing  

                                                        used only by algo : entity={{vars.askmatches.akey.matches[i].key}} say that a condition, of key=akey, matched on that entity 
                                                        used only by algo : entity={{vars.askmatches.akey.matches[i].key}} say that a condition, of key=akey, dont matched on that entity 






                                   *** model matches mng OVERVIEW
                                     in template :
                                         {{vars.matches.mod_Serv.match}} and {{vars.matches.mod_Serv.vmatch}} 

                                     in condition:
                                                    .................



                                */
                                
                                // if(mydynParam) we have the resolver section to complete :
                                    /* 
                                    
                                    a) set model build on this resolver that is entity  

                                    mydyn=step.values.askmatches[previous.collect.key]
                                    if(mydynParam){// a cursor selection case ii is the matched index 
                                            mydyn.param.group.sel=step.values.askmatches[desiredE].cursor.data[ii];

                                            // no : 
                                            //todocheckvname vmatches; now we can find in data[][]=mydyn.param.group.sel[12];
                                            //=mydyn.param.group.sel[12];

                                        }
                                    b) add/complete/review  param selection also in  desiredE
                                        >>> todo check out if the matches in desiredE.match and in desiredE.param.group  ......
                                        
                                    */




                            }// ends addMatchRes() 

//////////////////////////////////////////    end put in onchange !!!!!


                            function chkMatcRes(entity){// check if model entity matched, usefull in $$ and  $%  
                                // entity   : model name ($$ case) otherwise null condition  index 
                                // returns matched model item name/value ($$ case), otherwise null

                                // debug 
                                if(step.values.matches);
                                else  console.error('  ERR   chkMatcRes cant find values.matches !!! on entity  ', entity);


                                if(entity)if(step.values.matches[entity]&&step.values.matches[entity].match) {// register under values.matches.entity=itemvalue
                                    if(lv>3)console.log(3,'chkMatcRes : (testing a condition $xyEntity )the Entity: ' , entity,' already matched item: ', step.values.matches[entity]);
                                    return step.values.matches[entity];

                                }
                                return null;
                            }




                        }// ends  REGEX_MACRO

                    }// end CONDITION SCAN
                    // take default path if one is set

                    // ****************  step.msgSent null ??????????????????????
                    console.log('\n\n  *** FINISHED MATCHING CONDITION ON key: ' , previous.collect.key,'  found MATCH = ', path != null);
                    console.log('  at index ', step.index,', on user answere :',step.result,' to msg at index :', step.msgSent, ' \ncondition matched :  ' , path, ' , default_path=   ', default_path);



                    // run onChangeAfterCondition Matchers  handlers
                    // usually dont change route, just calc dyn that is available after condition testing matches
                    // let index/curIndex=step.index ;// already done before 
                    let onChangeAfter=false;// when is true ???  , do we have to run also the normal onchange ( but is the same ?!!)
                    if(onChangeAfter){
                    yield this.runOnChange(previous.collect.key, step.result, dc, step);// can set askmatches[previous.collect.key].param and .complete
                    //console.log(' +++++++++++ thread ',thread_name,', step ,',index,' is testing user answere on previous ask  ',previous.collect.key,' , onchange runned and  now vars is :\n ',step.values);
                    // did we just change threads ? if so, restart this turn
                    // if (curIndex !== step.index || thread_name !== step.thread) {
                    if (index !== step.index || thread_name !== step.thread) {
                        return yield this.runStep(dc, step.index, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.values);
                    }}





                    if (!path) {// start !PATH , previous  conditions dont matched

                        console.log(' so previous  conditions dont matched,   msg was sent before this condition test step msg : ', step.msgSent < step.index - 1);// sent if msgSent=1 index=2, msgSent=1 index=3

                        // no :  better after this {}, so anywhere both match or not match , if next (continue) 
                        // >>> A case : se non ho un match condition col msg previous we mast sent the msg prompt

                        // >>> todo  if(step.msgSent means msgSent is set ???
                        //  AND add a flag to decide if do or not do the retry

                        // recover excel directive x this step ask 


                        /* TODO  TODO now askmatches are in .direc. !!!!!

                        if (step.values.excel && step.values.excel[previous.collect.key]
                            && !step.values.excel[previous.collect.key].goon) goonDir = false;
                            */
                           if (step.values.direc &&step.values.direc[previous.collect.key] && step.values.direc[previous.collect.key].loopDir
                            && step.values.direc[previous.collect.key].loopDir.goon==false) goonDir = false;

                        // if (goonDir && default_path.action == 'next' && step.msgSent && step.msgSent < step.index - 1) {// in case of defaultpath is 'continue' if dont match with old text we want also to test also this msg prompt
                        // if (goonDir && default_path.action != 'repeat' && step.msgSent && step.msgSent < step.index - 1) {// in case of defaultpath is 'continue' if dont match with old text we want also to test also this msg prompt


			// if (goonDir && default_path.action == 'next' && step.msgSent < step.index - 1) {// in case of defaultpath is 'continue' if dont match with old text we want also to test also this msg prompt
            //27042020
            if (goonDir && default_path.action != 'repeat' && step.msgSent < step.index - 1){// in case of defaultpath is 'continue' if dont match with old text we want also to test also this msg prompt

	/*DO GOON ( do a chance to condition to match also the previous step user answere ) Management :

    
	fase : durante il process di un step B faccio testing del  previous step A
	se , durante il testing dei condition di un previous step A su answere del msg del previous msg A o un answere precedente passato durante precedente  current process dello step A
	if a user answere massage is passed to a step ( also in index 0 , anyway will be tested as previous in next step) (result or recovering a goto passing message or begindialog )and is  :
		During the previous step testing A ( current is step+1)
		-  too old (step.msgSent < step.index - 1)   .   NBNB : if it were too old  should not  be tested conditions ????
		- conditions  didnt match or is null set
		- default set to continue ( so of is a goto we dont goto if we didnt match on a previous step answere , we also must dont match with present step answere !)


    > force default to replay ( To test condition on user answere to its proper step  msg )
    
update :

 in a previous step A we see if 


	*/

                            /*
                            console.log('  (a default apply because none of previous  condition at prevIndex ', step.index - 1, ' matched  \n  as : \n - direc[previous.collect.key].loopDir.goon==false , \n - the def condition is next/continue AND \n - we tested condition on user answer to a msg emitted before the prevIndex msg   (msg index is ', step.msgSent, ' ) \n > we retry the step at index ', step.index - 1
                                , ' coming from a reply the runstep will be called with a null result so wiil emit the previous  msg prompt'
                                + ' also gotothread will call runstep with a null result ( and index =0 )but as we find  like a gotothread  with a null result ');
                            */
                           // better and easy
                           console.log('   none conditions matched on user answer to a msg emitted before the prevIndex msg ! so we need user to answere to previous msg and force REPEAT '+
                            ' \n ...  ?? coming from a reply the runstep will be called with a null result so wiil emit the previous  msg prompt'
                           + ' also gotothread will call runstep with a null result ( and index =0 )but as we find  like a gotothread  with a null result ');
         
         
                                //path =default_path;

                            // >>>>>>>   ERROR we cant change default_path.action because will be permanent !!!!!
                            // try correct with peach RE
                            // default_path.action='repeat';

                            // clone values , dc.activeDialog.state different from step.state ?
                            path = Object.assign({}, dc.activeDialog.state.values);
                            path.action = 'repeat';

                            // OKOK this is a special repeat UU : msgSent dont match so ask normal step msg 
                            // normal repeat will have a no result with no goon so no msgSent will be set so current handler will emit msg prompt
                            // special repeat will have a no result with also a no  goon 

                            //  step.state.goon=step.index-3;//useless as next step will be called with result=null to issue the index-1 msg 
                            // normal repeat step.msgSent=step.index-1;

                        }

                        else path = default_path;// peach RE
                    }// ends !PATH
                    if (path) {//  start PATH   : it matches or default , !! ok

                        if (path.action !== 'wait' && previous.collect && previous.collect.multiple) {
                            // TODO: remove the final line of input
                            // since this would represent the "end" message and probably not part of the input

                        }

                        console.log(' convo after got a path to go exec handleAction with path :',path);
                        var res = yield this.handleAction(path, dc, step);
                        if (res !== false) {




// *******************************************************    also in all returns ?????????????????????
                        //    step.values.app=null;//19052020  without go in error : json circular structure 





                            console.log(' convo after executed handleAction  returned not false so return ');
                            return res;
                        }
                        console.log(' convo after executed handleAction  returned  false so goon with current handler  ');
                    }//  ends PATH
                }
            
            }
            // ****  Handle the current step

// hotel customization 
         
           //  when receiving text (user answere put in userTurn , that can be used in onStep usually at index 0 )
           // >>>>>  better set status.userTurn in caller  dc.xxxDialog()
           // if(Object.prototype.toString.call(myVar) === "[object String]")

           // add a check from  a description flag : if(dynfield.getprevious turn on entering a new thread)
            
            /*
           console.log(', ** setting last user turn , index: ',step.index, ' result : ',step.result ,' condition ',typeof step.result === 'string',step.result instanceof String);

                if(typeof step.result === 'string' || step.result instanceof String){// register last user turn on status 
                step.state.userTurn=step.result;
                }else step.state.userTurn=null;
            */
            let recLTurn=false;// some text recoverED from previous STEP THAT CAME TO THIS THREAD FROM A BEGINDIALOG OR GOTOTHREAD,  turn status step.state.userTurn
            if(goonDir&&step.index==0



		){// in starting a new thread (after a goto) if we have some condition try to recover last user turn answere in the current cmd to test condition also with previous user answere

                // at index 0 we can have null if retrying or a beging dialog  (must not recover) or object  if coming from a goto thread (should try to recover)
   
   //             console.log(', ** this previous step of index 0, recovering last user turn : with isstringresult =',typeof step.result == 'string',' isresultNull: ',step.result ==null);//,' . String: ',!step.result instanceof String);

   console.log('convo onstep NOW Handle CURRENT STEP: ' , step.index ,' of ', thread.length,'steps on thread ',step.thread);

                if(step.result !=null&&typeof step.result != 'string' ){
                    // so is obj , coming from gotothread ( also  coming from a child or resumedialog ? ), 

                    // todo verify that begindialog and replacedialog do not se step.result as a obj . we will manage that case differently 
                    //          >>>>>>>>>>>>>>>> in future we can have begindialog with string result
                    // coming from gotothread is obj , 
                    // problem both coming from begindialog(todo : change relaying the last user turn) and retry , both are null  null 
                    console.log('\n **  RESULT is OBJ so RECOVERING  TEXT FROM state.userTurn, (set by jumping  GOTOTHREAD (or REPLACEDIALOG (?)) or returning from Child ,so recovered_text=state.userTurn: ',step.state.userTurn);
                    // useless : console.log(' OR this is a index 0 current handler , with obj result (so gotothread or returning from a child ( replacedialog too ???) )\n  so ( SETting recLTurn=true ) recovering last previous (before this stepindex = 0 ) user turn  text from state.userturn :',step.state.userTurn);
 
                    // now (after done previous collect match) we can change the result : 
                    if(step.state.userTurn){// do that only in goto case and userTurn is set 
                    step.result=step.state.userTurn;
                    step.state.userTurn=null;// reset ?
                    // >>>>>>>>>>>
                    // alredy set step.msgSent=0;// as came from this msg so chain next step 

                    recLTurn=true;
                    step.msgSent=-1;// added 03022020
                }
                }//else state.userTurn=null;
                else if(typeof step.result == 'string'){// is a begin dialog with string result : can forward too
                    recLTurn=true;
                    step.msgSent=-1;// added 03022020, means the user answere step.result cames from a prompt issued by a step before step 0 
                } 
                // else is null ( probably just a repeat, result is null  )
            }

            if (step.index < thread.length) {
                let line = thread[step.index];
                //console.log('convo onstep Handle the current step ,step is ' + JSON.stringify(step, null, 4) ,' text is ',step.result);



                // ******************+  step.msgSent and step.result  are undefined 

                //console.log('convo onstep Handle the current step ' + step.index ,' of ', thread.length,'steps on thread ',step.thread,' , recovered a user answere :',step.result,' to msg  of index ',step.msgSent,' ( if smaller (',recLTurn,') is a older step msg answare !) ');
               // console.log('convo onstep NOW Handle CURRENT STEP: ' , step.index ,' of ', thread.length,'steps on thread ',step.thread);
                if(step.index>0)console.log('    after tested  condition on previous step ',step.index-1,' with a user answere :',step.result,' to msg  of index ',step.msgSent,' ( if smaller (',recLTurn,') is a older msg then the tested condition !) ');
                else console.log('  step 0  may have recovered a  user answer to a previous step in another thread :',step.result,' to a msg  of index <0 : ',step.msgSent);


                // 062019 goon trying to match more ask with a single user utterance 
                step.state.goon=null;// 
                // if(step.values.goon&&step.values.goon==true&&step.index>0)

                /*  ????
                 todo if recLTurn we can goon if there is condition to valuate !!!!!!!!!!!!
                    verify also there is a next step 
                    > are there some cond on next step ? thread[step.index+1].collect.options/key
                */
                let curkey;
                if(thread[step.index].collect&&thread[step.index].collect.key)curkey=thread[step.index].collect.key;
               if (step.values.direc &&step.values.direc[curkey] && step.values.direc[curkey].loopDir
                && step.values.direc[curkey].loopDir.goon2==false) goonDir2 = false;
                if(goonDir2&&(recLTurn||step.index>0)&&(step.msgSent >-2// use results in next step if exists (step.msgSent not null, better > -2 ) or 
                                                            // if index=0 recLTurn will decide to goon or not

                   // useless  ||step.msgSent>=step.index-1

		&&curkey // and we have some condition to test also on previous user answere
                    
                    ))// if index > 0 do not send msg, it will be sent as repeat next step if dont match
                { // TTT


/*
 ***************************  GOON mng summary  ( TO review if is begindialog or resumedilog or returning after a child) 

DO GOON ( do a chance to condition to match also the previous step user answere ) if

- step with index >0 :

    if a step.result is not nulled string after onchange we test condition
    - there is some condition to test
    AND
    - the action selected was continue (so also after a check for at least one condition matched , otherwise we force a default with repeat)
    we came to manage current handler and we goto next step with present step.result  without prompting step msg for a new user answere
    
    IF  step.result is obj with index >0 ( a resume or a child return )
    after onchange we CANT do test condition 
    so ( to complte this comment )
    .........   ( seems we must do standard msg prompt to the user )
                    

    ( old comment :
	we didnd force default replay on condition 
		- a default continue   after 
        -  none condition was matched on a not null condition set 
    )


- step 0 
         we dont do any previous testing 
         when the thread was called (after begin cb) 
                by a gotothread ( or return from a child)  ( step.result is obj) with a previous step user answere put in step.state.userTurn
                OR
                by  begindialog with a previous step user answere put as string in step.result

                    - if this index 0 step has conditions to test 
                            >> we  can recover previous user answere put in step.state.userTurn ( and so set  recLTurn=true and GOON to test condition  ) 
                    -else we issue the step 0 msg in order to test condition with user answere to msg




*/



                       console.log(' > Ending current Step ' + step.index ,' Handling without prompting current msg, but GOON/passing a previous answer to next Step  ',step.index+1);
                       //console.log('  because we do not retrying because of A ,\n A means :we dont match the condition on a step of index ',step.index-1 , ' on  msg of index ',step.msgSent,' that was a msg of a step before \n');
                       if(step.index >0)console.log('  because we  matched a non def  condition on a step of index ',step.index-1 , ' on  msg of index ',step.msgSent,' that was a msg of some step before \n',
                         ' >> otherwise we retry/replay the step prompting its msg' );
                      else console.log('  in a step 0 we could recover a previous user msg (step ',step.msgSent,' <0)  answer and with this (goon ) answer we are going to test step 0 condition \n the user answer is :  ',step.result);

                       step.state.goon=step.msgSent;  // okok:
                                                    // inform following calling runstep ( the (current) index in runstep is this index +1) that :
                                                    //  - the msg/prompt the user answered (msgSent=currrentindex-2)was not previous=current_index-1 but  a step before 
                                                    //  - so if the step dont match the previous must replay/retry

                    //return yield this.runStep(dc, step.index+1, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.result);
                    return yield this.runStep(dc, step.index+1, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.result);
                }   else console.log(' > Ending current Step Handling , past user answer allowed on index 0 askname: ',curkey,', goonDir2=',goonDir2,'. PROMPTing msg of index  ',step.index,'\n');
         

                // If a prompt is defined in the script, use dc.prompt to call it.
                // This prompt must be a valid dialog defined somewhere in your code!
                if (line.collect && line.action !== 'beginDialog') {
                    try {
                        // seems will start a begindialog ( will issue a prompt) put on top of stake returning here after received the user answare
                        // so  returning from a begindialog will call dc.endDialog that come back here in resumedialog 
                        return yield dc.prompt(this._prompt, this.makeOutgoing(line, step.values,step));
                    }
                    catch (err) {
                        console.error(err);
                        yield dc.context.sendActivity(`Failed to start prompt ${this._prompt}`);
                        return yield step.next();
                    }
                    // If there's nothing but text, send it!
                    // This could be extended to include cards and other activity attributes.
                }
                else {
                    // if there is text, attachments, or any channel data fields at all...
                    if (line.type || line.text || line.attachments || (line.channelData && Object.keys(line.channelData).length)) {
                        yield dc.context.sendActivity(this.makeOutgoing(line, step.values,step));
                    }
                    else if (!line.action) {
                        console.error('Dialog contains invalid message', line);
                    }
                    if (line.action) {
                        let res = yield this.handleAction(line, dc, step);
                        if (res !== false) {
                            return res;
                        }
                    }
                    return yield step.next();
                }
            }
            else {
                // End of script so just return to parent
                return yield this.end(dc);
            }
        });
    }
    /**
     * Run a dialog step, based on the index and thread_name passed in.
     * @param dc The current DialogContext
     * @param index The index of the current step
     * @param thread_name The name of the current thread
     * @param reason The reason given for running this step
     * @param result The result of the previous turn if any : 
     *              >>>  a string or the values of the switching thread or returning child dialog step.values ( nb: are also in state)
     */
    runStep(dc, index, thread_name, reason, result) {// if coming from gotothread or child dialog is a step.values obj
        return __awaiter(this, void 0, void 0, function* () {

            // Update the step index
            const state = dc.activeDialog.state;// the state of this convo
            state.stepIndex = index;
            state.thread = thread_name;
            // Create step context
            const nextCalled = false;// ?? 

// hotel customization 
            /* moved to conversation :
           //  when receiving text (user answere put in userTurn , that can be used in onStep usually at index 0 )
           // >>>>>  better set state.userTurn in caller  dc.xxxDialog()
           // if(Object.prototype.toString.call(myVar) === "[object String]")
            if(typeof result === 'string' || result instanceof String){
                state.userTurn=result;
            }else state.userTurn=null;
            */

            /* to move to conversation :
            let msgSent;// the
            // goon should warn that we goon to next step using a previous msg prompt , 
            // >>>>>>>>>>>>>>>>  so shoud be index-1 otherwise should be index -2 ??
            if(state.goon||state.goon>=index-1){msgSent=state.goon;// usually step run with a user answare to msg of step with index-1 
                console.log('\n runstep thread: ',thread_name,' index is ' + index ,' setgoon is set in TT when goon with no step msg : ',state.goon,' text is ',result);
            }else msgSent=state.goon;???????????
            state.goon=null;// ???
*/


            const step = {

                //msgSent,// here usually call index with user answere to previous msg 

                index: index,
                thread: thread_name,
                state: state,
                options: state.options,
                reason: reason,
                result: result,
                values: state.values,
                next: (stepResult) => __awaiter(this, void 0, void 0, function* () {
                    if (nextCalled) {
                        throw new Error(`ScriptedStepContext.next(): method already called for dialog and step '${this.id}[${index}]'.`);
                    }
                    return yield this.resumeDialog(dc, botbuilder_dialogs_1.DialogReason.nextCalled, stepResult);
                })
            };


            // already done : step.state.dir=step.state.dir||{};
            // usually when comes here after a replay current replayed onstep will emitt he msg , 
            //  then the user will come back into the active convo (top stack) after a prompt dialog ends with a resume, that will call here
            if(state.dir.repeat&&state.dir.count){
                // a repeat is requested, now send msg, warn continue dialog to check the expecting flag state.dir.repeat_
                state.dir.count++;
                state.dir.repeat_=1;
                state.dir.repeat=false;
            }
            else { if(state.dir.repeat_>1){// check that continuedialog did ++ ( he saw state.dir.repeat_>0)
                    // confirm count , then reset all flags 

                }else{// start counting
                    state.dir.count=1;
                }
                state.dir.repeat=false;//reset all
                state.dir.repeat_=0;
            }

            // did we just start a new thread?
            // if so, run the before stuff.
            if (index === 0) {

                console.log('\n ** start runStep , cmd ',dc.activeDialog.id,' , thread ',thread_name,', step ',index);
                if(step.state.userTurn&&state.values.direc&&state.values.direc[thread_name]&&state.values.direc[thread_name]&&state.values.direc[thread_name].loopDir&&!state.values.direc[thread_name].loopDir.goon)
                step.state.userTurn=null;// msg in step 0 will ever be prompted

                yield this.runBefore(step.thread, dc, step);


                // here the voice convo state.values  ( botkit vars exposed to template system)
                //      has been added ( see fwbase.initCmd that sets onBefore that uses onChange.getappWrap to bind session and app)  :
                //          .session (app state)
                //          .appWrap
                //           now init .dir ( directive state ) too in :
                //          .dir ( bind directive status)
                if(state.values.session)state.values.session.dir=state.dir;



                // did we just change threads? if so, restart
                if (index !== step.index || thread_name !== step.thread) {
                    return yield this.runStep(dc, step.index, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.values);
                }
            }

            //now we have session bind for sure in values.session
            // Execute step

            // debug only just copy count on session 
            // state.values.session.dir=state.dir;

            const res = yield this.onStep(dc, step);
            return res;
        });
    }
    /**
     * Automatically called when the the dialog ends and causes any handlers bound using `after()` to fire. Do not call this directly!
     * @ignore
     * @param dc The current DialogContext
     * @param value The final value collected by the dialog.
     */
    end(dc) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: may have to move these around
            // shallow copy todo: may need deep copy
            const result = Object.assign({}, dc.activeDialog.state.values);
            yield dc.endDialog(result);
            yield this.runAfter(dc, result);
            return botbuilder_dialogs_1.DialogTurnStatus.complete;
        });
    }
    /**
     * Translates a line from the dialog script into an Activity. Responsible for doing token replacement.
     * @param line a message template from the script
     * @param vars an object containing key/value pairs used to do token replacement on fields in the message template
     */
    makeOutgoing(line, vars,step) {// vars=step.values
        let outgoing;
        if (line.quick_replies) {
            outgoing = botbuilder_1.MessageFactory.suggestedActions(line.quick_replies.map((reply) => { return { type: botbuilder_1.ActionTypes.PostBack, title: reply.title, text: reply.payload, displayText: reply.title, value: reply.payload }; }), line.text ? line.text[0] : '');
        }
        else {
            outgoing = botbuilder_1.MessageFactory.text(line.text ? line.text[Math.floor(Math.random() * line.text.length)] : '');
        }
        if (!outgoing.channelData) {
            outgoing.channelData = {};
        }
        // set the type
        if (line.type) {
            outgoing.type = line.type;
        }
        // copy all the values in channelData fields
        for (var key in line.channelData) {
            outgoing.channelData[key] = line.channelData[key];
        }
        // copy all the values in matched 
            let knam;
        if(line.collect&&line.collect.key){

            outgoing.channelData.thread = step.thread;
            outgoing.channelData.key = knam=line.collect.key;
            let outCtx;
            if(line.collect.options){
                outCtx=[];
                line.collect.options.forEach(function(v,i){
                    
                    if(v.pattern&&v.pattern.substring(0, 2) == '$$'&&v.action!='next') {
                        let ext=v.pattern.indexOf(":");
                        if(ext>0)outCtx.push(v.pattern.substring(2,ext)+"/"+v.action);
                    }
                    }
                    );
            if(outCtx.length>0)outgoing.channelData.outCtx = outCtx;
            }

            

            }
        if(vars.matches){
            let matches=[];
            for (var key in vars.matches) {
            if(vars.matches[key]&&vars.matches[key].match)matches.push(key+'='+vars.matches[key].match);
            }
        outgoing.channelData.matches = matches;
        }
        if(vars.askmatches){
            let askmatches=[];
           // console.log(' XXXXXX >>>>>>>>>>  testing in key nam ',knam, ' askmatches: ',vars.askmatches);
            for (var key in vars.askmatches) {
             //   console.log('       >>>>>>>>>>  test key on askmatches ',key, ' obj ',vars.askmatches[key]);
            if(vars.askmatches[key]&&vars.askmatches[key].match)askmatches.push(key);
            }
        outgoing.channelData.askmatches = askmatches;
        }


        let rtext=outgoing.text;
        // Handle template token replacements
        if (outgoing.text) {

            // 'so you just said conf !,....' 
            let context={ vars: vars,conf:step.values.__conf };// can be more articulated.do not pass appstatus , conf is the match the user did in last turn


            
            // add step as closure var in out
            let must_inst=this.mustacheF,
            //let must_inst=this._controller.plugin.vCtl.mustacheF,
            outInst=must_inst.out__; ////////////////////////////////// error:because  must_inst is null 

            let casa=true;
            if(casa){
            // substitute .out(): insert step in out param via a clusure var
            must_inst.out=(function(){
                let myctx=step;

                /*
                //return function(text, render){ outInst.call(this,text,render,myctx)}
                return function(){
                    console.log('mustache meet a function out and asked a handler');


                    return function(text, render){
                        console.log('mustache out  handle called for process inner  template : ',text);
                         outInst.call(this,text,render,myctx)}
                }*/
                console.log('mustache meet a function out and asked a handler');
                return outInst(myctx);
                
                })();
                
            }else this.mustacheF.out=this.mustacheF.out_;


            if(this.mustacheF){context.mustacheF=this.mustacheF;// add function (not saved in state)
            // overwrite by mustache !!if(this.mustacheF.out&&step){this.mustacheF.out.bind(step);}
            // so just insert step into context !
            context.step=step;
            step.curLine=line ;// pass into step the  ask name passing line . uso : ........

            // insert vars calc between &&....&&  example : template= "some text{{&&let kk="5";vars["colore"];&&}}"// last js expression in &&....&& is calculated
            outgoing.text=looseJsonParse(outgoing.text,Object.assign({},context.vars));
            let asknam='NA';if (line.collect&&line.collect.key)asknam=line.collect.key;
    if(lv>4)console.log(' outgoing is rendering msg of msgAsk ',asknam,' context ',context);

            }
            outgoing.text = mustache.render(outgoing.text, context);//{ vars: vars });
            step.values.__conf=null;
            if(lv>5)console.log(' text to render : ',rtext,' \n outgoing has rendered : ',outgoing.text, ' context is ', context);
        }
        // process templates in native botframework attachments
        if (line.attachments) {
            outgoing.attachments = this.parseTemplatesRecursive(line.attachments, vars);
        }
        // process templates in slack attachments
        if (outgoing.channelData.attachments) {
            outgoing.channelData.attachments = this.parseTemplatesRecursive(outgoing.channelData.attachments, vars);
        }
        // process templates in facebook attachments
        if (outgoing.channelData.attachment) {
            outgoing.channelData.attachment = this.parseTemplatesRecursive(outgoing.channelData.attachment, vars);
        }
        return outgoing;
    }
    /**
     * Responsible for doing token replacements recursively in attachments and other multi-field properties of the message.
     * @param attachments some object or array containing values for which token replacements should be made.
     * @param vars an object defining key/value pairs used for the token replacements
     */
    parseTemplatesRecursive(attachments, vars) {
        if (attachments && attachments.length) {
            for (let a = 0; a < attachments.length; a++) {
                for (let key in attachments[a]) {
                    if (typeof (attachments[a][key]) === 'string') {
                        attachments[a][key] = mustache.render(attachments[a][key], { vars: vars });
                    }
                    else {
                        attachments[a][key] = this.parseTemplatesRecursive(attachments[a][key], vars);
                    }
                }
            }
        }
        else {
            for (let x in attachments) {
                if (typeof (attachments[x]) === 'string') {
                    //let context={ vars: vars };// can be more articulated
                    //if(vars.excel.out)vars.excel.out.bound(step);
                    let context={ vars: vars };// can be more articulated
                    attachments[x] = mustache.render(attachments[x], context);
                }
                else {
                    attachments[x] = this.parseTemplatesRecursive(attachments[x], vars);
                }
            }
        }
        return attachments;
    }
    /**
     * Handle the scripted "gotothread" action - requires an additional call to runStep.
     * @param thread The name of the thread to jump to
     * @param dc The current DialogContext
     * @param step The current step object
     */
    gotoThreadAction(thread, dc, step) {
        return __awaiter(this, void 0, void 0, function* () {
            step.thread = thread;
            step.index = 0;
            return yield this.runStep(dc, step.index, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.values);
        });
    }
    /**
     * Accepts a Botkit script action, and performs that action
     * @param path A conditional path in the form {action: 'some action', handler?: some handler function, maybe_other_fields}
     * @param dc The current DialogContext
     * @param step The current stpe object
     */
    handleAction(path, dc, step) {
        // for path ( condition) format see addQuestion(message, handlers, key, thread_name)
        return __awaiter(this, void 0, void 0, function* () {
            if (path.handler) {//
                const index = step.index;
                const thread_name = step.thread;
                // spawn a bot instance so devs can use API or other stuff as necessary
                const bot = yield this._controller.spawn(dc);
                // create a convo controller object
                const convo = new dialogWrapper_1.BotkitDialogWrapper(dc, step);
                yield path.handler.call(this, step.result, convo, bot);
                // did we just change threads? if so, restart this turn
                if (index !== step.index || thread_name !== step.thread) {
                    return yield this.runStep(dc, step.index, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled, step.values);
                }
                return false;
            }
            switch (path.action) {
                case 'next':
                    // noop
                    break;
                case 'complete':
                    step.values._status = 'completed';
                    return yield this.end(dc);
                case 'stop':
                    step.values._status = 'canceled';
                    return yield this.end(dc);
                case 'timeout':
                    step.values._status = 'timeout';
                    return yield this.end(dc);
                case 'execute_script':
                    const ebot = yield this._controller.spawn(dc);
                    console.log(' handleAction : execute script was requested',path);
                    var clonop=Object.assign({ thread: path.execute.thread }, step.values);
                    //072019 anyway rewrite thread
                   clonop.thread=path.execute.thread;
                    return yield ebot.replaceDialog(path.execute.script, clonop);
                case 'beginDialog':
                console.log(' handleAction : begindialog was requested  ',path);
                    let rbot = yield this._controller.spawn(dc);
                    return yield rbot.beginDialog(path.execute.script, Object.assign({ thread: path.execute.thread }, step.values));// il child eredita tutte le vars del father ??? so i nuovi excel ??
                    // il option=step.values di questo father convo si trovano come option in begindialog del convo child ! see it 
                    case 'repeat':

                    step.state.dir.repeat=true;// luis flag to count repeat

                    return yield this.runStep(dc, step.index - 1, step.thread, botbuilder_dialogs_1.DialogReason.nextCalled);
                case 'wait':
                    // reset the state so we're still on this step.
                    step.state.stepIndex = step.index - 1;
                    // send a waiting status
                    return { status: botbuilder_dialogs_1.DialogTurnStatus.waiting };
                default:
                    // the default behavior for unknown action in botkit is to gotothread
                    if (this.script[path.action]) {
                        console.log(' handleAction : gotoThread was requested',path);
                        return yield this.gotoThreadAction(path.action, dc, step);
                    }
                    console.warn('NOT SURE WHAT TO DO WITH THIS!!', path);
                    break;
            }
            return false;
        });
    }
}// ends class BotkitConversation extends botbuilder_dialogs_1.Dialog 
exports.BotkitConversation = BotkitConversation;
//# sourceMappingURL=conversation.js.map

function indOf(key,matr,col){
    let ism=false,it;
    if(matr&&key)
for(it=0;it<matr.length;it++){
        if(matr[it][col]==key){ ism=true;break;}
    }
    if(ism)return it;else return -1;
}


function looseJsonParse(templ,vars,step,jsfunc,service,par){
    
    
    // RETURNS :
    //  - if templ :
    //       extract in TEMPL  string a vars . format  xxxx&&vars.excel.....&&yyyy
    //  - IF templ is null , evaluate fcfunc in scope of this function ( param vars and step are in scope !!)


    // see evalmozilla.js, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
    // call  ftempl=looseJsonParse(template,Object.assign({},context.vars,{aa}));
    // template= "some text{{&&let kk="5";vars["colore"];&&}}"// last js expression in &&....&& is calculated

        // usually used in case we want to generate same text (substituing the &&x&& x with the out calc) without use a onchange 
        // or also when in a msg we want to use a {{y}} a context var y ( calc as before)  depending from past status  
        // or 
        //  - in a condition we want to test not the user speech but the passed var got 
        //      in this case we ca call :
        //          looseJsonParse(null,vars=Object.assign({},context.vars,{text}),conditionStringasFunctionjscode) 
        //          so in js code we can access  in js code to vars and also to user text as vars.text 

     let ioa,templP,fc,calc;
      if(!jsfunc&&templ){// // work on template nòly
        ioa = templ.indexOf('&&');
        templP=templ.split('&&');

      

       //      console.log('looseJsonParse : templP is :',templP);
     //if (ioa > 0){let ioa1 = templ.indexOf('&&',ioa+3);
      //  if(ioa1>0)fcorpus = templ.substring(ioa+2, ioa1);}

      // max 2 substitution 
      let ret;

      if(templP.length==3||templP.length==5){
      // evaluate fcorpus in context 
        fc=templP[1];
        console.log('looseJsonParse in ...&&fc&&... evaluating fc js code , fc is :',fc);
        let myf='"use strict";' + fc;
        // calc=Function(myf)();
        //calc=Function('"use strict";' + fc)();
         //calc=Function( fc).call(vars);
        //calc=Function( fc).call(vars);

        calc=eval( fc);// eval has this scope to work with ! so also vars

        // OK calc=eval(myf);
        //   console.log('looseJsonParse  calc :',calc);
        if(calc)ret=templP[0].concat(calc).concat(templP[2]);else ret=templP[0].concat(templP[2]);
      }else return templ;
      if(templP.length==5){
        // evaluate fcorpus in context 
          fc=templP[3];
          console.log('looseJsonParse : fc is :',fc);
          let myf='"use strict";' + fc;
          // calc=Function(myf)();
          //calc=Function('"use strict";' + fc)();
           //calc=Function( fc).call(vars);
          //calc=Function( fc).call(vars);
          calc=eval( fc);
          // OK calc=eval(myf);
          //   console.log('looseJsonParse  calc :',calc);
          if(calc!=null)ret=ret.concat(calc).concat(templP[4]);else ret=ret.concat(templP[4]);
        }else return ret;

      if(ret){
          console.log(' && case transformer text is ret= ',ret);return ret;}else return templ;
                                          
     // return Function('"use strict";return (' + obj + ')')();
      }else{// jsfunc case , we dont need template, just eval jsfunc
        fc=jsfunc;
        console.log('looseJsonParse : evaluate a boolean fc condition function :',fc);
        let myf='"use strict";' + fc;
        calc=eval( fc);// fc has in scope  vars, and vars.text , return the last expression evaluated ( interessa vedere se e' false o no )

        if(calc)return true;else return false;

      }
    }
