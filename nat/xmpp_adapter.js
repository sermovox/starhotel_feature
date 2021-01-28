"use strict";
/**
 * @module 
 */
/**
 * a similar interface was  Copyright (c) Microsoft Corporation. All rights reserved.
 * * customization : Copyright (c)Sermovox / luigi marson. All rights reserved.
 * Licensed under the MIT License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const botbuilder_1 = require("botbuilder");
const Debug = require("debug");
const WebSocket = require("ws");
const debug = Debug('botkit:web');
const clients = {};
/**
 * Connect [Botkit](https://www.npmjs.com/package/botkit) or [BotBuilder](https://www.npmjs.com/package/botbuilder) to the actions.

 */
class ActionsAdapter  extends botbuilder_1.BotAdapter // needs? yes x middleware

    {
    /**
     * Create an adapter to handle incoming messages from a websocket and/or webhook and translate them into a standard format for processing by your bot.
     *
     * To use with Botkit:
     * ```javascript
     * const adapter = new WebAdapter();
     * const controller = new Botkit({
     *      adapter: adapter,
     *      // other options
     * });
     * ```
     *

     * ```
     *
     * @param socketServerOptions an optional object containing parameters to send to a call to [WebSocket.server](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback).
     */
    constructor(Options) {
        super();
        /**
         * Name used to register this adapter with Botkit.
         * @ignore
         */
        this.name = 'Xmpp Adapter';
        this.Options = Options || null;
    }
    /**
     * Botkit-only: Initialization function called automatically when used with Botkit.
     *      * Calls createSocketServer to bind a websocket listener to Botkit's pre-existing webserver.
     * @param botkit
     */
    init(botkit) {
        // when the bot is ready ?? or at plugin registration ???, register the webhook subscription with the Webex API
        botkit.ready(() => {// when the bot is ready 
            console.log('in init of actions adapter: ') ;
           // this.createSocketServer(botkit.http, this.socketServerOptions, botkit.handleTurn.bind(botkit));
        });
    }
    /**
     * Bind a websocket listener to an existing webserver object.
     * Note: Create the server using Node's http.createServer
     * @param server an http server
     * @param socketOptions additional options passed when creating the websocket server with [WebSocket.server](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback)
     * @param logic a turn handler function in the form `async(context)=>{ ... }` that will handle the bot's logic.
     */

    /**
     * Caste a message to the simple format used by the websocket client
     * @param activity
     * @returns a message ready to send back to the websocket client.
     */
    activityToMessage(activity) {
        let message = {
            type: activity.type,
            text: activity.text
        };
        // if channelData is specified, overwrite any fields in message object
        if (activity.channelData) {
            Object.keys(activity.channelData).forEach(function (key) {
                message[key] = activity.channelData[key];
            });
        }
        debug('OUTGOING > ', message);
        return message;
    }
    /**
     * Standard BotBuilder adapter method to send a message from the bot to the messaging API.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#sendactivities).
     * @param context A TurnContext representing the current incoming message and environment. (not used)
     * @param activities An array of outgoing activities to be sent back to the messaging API.
     */
    sendActivities(context, activities) {// called by logic ? so when middleware run before or after ? 
        return __awaiter(this, void 0, void 0, function* () {
            const responses = [];
            for (var a = 0; a < activities.length; a++) {
                const activity = activities[a];
                console.log('actions_adapter sending a activity back to user , activity: ',activity);//.channelData);
                let message = this.activityToMessage(activity);
                const channel = context.activity.channelId;
                if (channel === 'actions') {// 'webhook') {
                    // if this turn originated with a webhook event, enqueue the response to be sent via the http response
                    let outbound = context.turnState.get('httpBody');
                    if (!outbound) {
                        outbound = [];
                    }

                    console.log(' actions_adapter, bot has a partial say : ',message,'\n text is ',message.text);
                    // leave <> from text :
                    if(message.text)message.text=message.text.replace(/<.*?>/g,'');//Regex.Replace(mesage.text,"<.*?>",string.Empty);
                    console.log(' actions_adapter bot has a partial revised say : ',message,'\n text is ',message.text);



                    outbound.push(message);
                    context.turnState.set('httpBody', outbound);
                }
            }
            return responses;
        });
    }
    /**
     * Web adapter does not support updateActivity.
     * @ignore
     */
    // eslint-disable-next-line
    updateActivity(context, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Web adapter does not support updateActivity.');
        });
    }
    /**
     * Web adapter does not support updateActivity.
     * @ignore
     */
    // eslint-disable-next-line
    deleteActivity(context, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Web adapter does not support deleteActivity.');
        });
    }
    /**
     * Standard BotBuilder adapter method for continuing an existing conversation based on a conversation reference.
     * [BotBuilder reference docs](https://docs.microsoft.com/en-us/javascript/api/botbuilder-core/botadapter?view=botbuilder-ts-latest#continueconversation)
     * @param reference A conversation reference to be applied to future messages.
     * @param logic A bot logic function that will perform continuing action in the form `async(context) => { ... }`
     */
    continueConversation(reference, logic) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = botbuilder_1.TurnContext.applyConversationReference({ type: 'event', name: 'continueConversation' }, reference, true);
            const context = new botbuilder_1.TurnContext(this, request);
            return this.runMiddleware(context, logic)
                .catch((err) => { console.error(err.toString()); });
        });
    }
    /**
     * Accept an incoming webhook request and convert it into a TurnContext which can be processed by the bot's logic.
     * @param req A request object from Restify or Express
     * @param res A response object from Restify or Express
     * @param logic A bot logic function in the form `async(context) => { ... }`
     */
    processActivity(req, res, logic) {// json message must have message.user, message.text,message.type

//    engage with: 
//  ok google  Parla con voice enable 
//  ok google  Parla con aladino 


        return __awaiter(this, void 0, void 0, function* () {
            console.log(' user say msg : ',req);
            const message = req.body;// json parser webserver.use(bodyParser.json() ?
            const activity = {
                timestamp: new Date(),
                channelId: 'actions',//same process actions and xmpp
                conversation: {
                    id: message.user
                },
                from: {
                    id: message.user
                },
                recipient: {
                    id: 'bot'
                },
                channelData: message,
                text: message.text,
                type: message.type === 'message' ? botbuilder_1.ActivityTypes.Message : botbuilder_1.ActivityTypes.Event
            };
            console.log(' user activity : ',activity);
            // set botkit's event type
            if (activity.type !== botbuilder_1.ActivityTypes.Message) {
                activity.channelData.botkitEventType = message.type;
            }
            // create a conversation reference context to read back the bot answers/newprompt
            const context = new botbuilder_1.TurnContext(this, activity);
            context.turnState.set('httpStatus', 200);
            yield this.runMiddleware(context, logic);
            // send http response back after middlewarefinished 
            //if(res.status)res.status(context.turnState.get('httpStatus'));

            let botansw=context.turnState.get('httpBody');// get context new bot  prompt 
            console.log(' bot is answering back : ',botansw);
            if (botansw) {// a text array , if there is a httpbody filled by  sendActivities,    send it as bot answer
                if(botansw.length>1){ console.error(' bot is answering back  multiple answers,tobe managed');
                                        // .....   consolidate array ....
                }

                // now we extract from array the obj to pass to  conv.ask() > now the simple last text 
                let resp=botansw[botansw.length-1];
                console.log(' bot pass text x user : ',resp.text);
                // dont work :
                // let user=resp.recipient.id;// resp.conversation.id  or  resp.recipient.id  or  context.activity.from.id;
                // pass/relay the user info into the answere 
                let user=message.user;//




                res.send(resp,context.turnState.get('httpStatus'),user);//res.send(textARR[textARR.length-1]);// will be conv.ask()
                // better: return textARR : use promise instead to cb a function in param
            }
            else {
                res.send(' ',context.turnState.get('httpStatus'),user);//end(); ''  or ' ' ?
            }
        });
    }
    /**
     * Is given user currently connected? Use this to test the websocket connection
     * between the bot and a given user before sending messages,
     * particularly in cases where a long period of time may have passed.
     *
     * Example: `bot.controller.adapter.isConnected(message.user)`
     * @param user the id of a user, typically from `message.user`
     */
    isConnected(user) {
        return typeof clients[user] !== 'undefined';
    }
    /**
     * Returns websocket connection of given user
     * Example: `if (message.action === 'disconnect') bot.controller.adapter.getConnection(message.user).terminate()`
     * @param user
     */
    getConnection(user) {
        if (!this.isConnected(user)) {
            throw new Error('User ' + user + ' is not connected');
        }
        return clients[user];
    }
}
exports.XmppAdapter = ActionsAdapter;
