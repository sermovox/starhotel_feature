"use strict";
/**
 * @module botkit-plugin-cms
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
const botkit_1 = require("botkit");
const request = require("request");
const debug = require('debug')('botkit:cms');
/**
 * A plugin for Botkit that provides access to an instance of [Botkit CMS](https://github.com/howdyai/botkit-cms), including the ability to load script content into a DialogSet
 * and bind before, after and onChange handlers to those dynamically imported dialogs by name.
 *
 * ```javascript
 * controller.use(new BotkitCMSHelper({
 *      uri: process.env.CMS_URI,
 *      token: process.env.CMS_TOKEN
 * }));
 *
 * // use the cms to test remote triggers
 * controller.on('message', async(bot, message) => {
 *   await controller.plugins.cms.testTrigger(bot, message);
 * });
 * ```
 */

function change2Child(msgs){// added 082019, see howtoinsertagotoachildMess in documents/prove

    msgs.forEach((msg) => {// subsitute in all condition ''execute_script' with 'beginDialog' action
	console.log('*** a msg with text/action : ',msg.text,' , ',msg.action);
        var found=false;
       // if(msg.collect&&msg.collect.key.charAt(0)=='_'){// a vector field/key
       if(msg.collect&&msg.collect.key){// any field/key
            msg.collect.options.forEach((opn) => {
                //if(!found&&opn.action&&opn.action=='execute_script'){//the child dialog
                if(opn.action&&opn.action=='execute_script'){//the child dialog
                    /*found=true;// first option/condition with a execute_script action
                    msg.execute=opn.execute;// also thread ??
                    msg.action='beginDialog';
                    */
                   if(opn.execute&&opn.execute.script&&opn.execute.script.charAt(0)=='_'){
                    // any execute scriot starting with _ is a child so begin_dialog
                    opn.action='beginDialog';
                   }
                }
             });
             if(found)msg.collect.options=[];
         }
    });

}
class BotkitCMSHelper {
    constructor(config) {
        /**
         * Botkit Plugin name
         */
console.log('***** instantiating Botkit CMS');
        this.name = 'Botkit CMS';
        this._config = config;
        if (config.controller) {
            this._controller = this._config.controller;
        }
        if (!this._config.uri) {
            throw new Error('Specify the root url of your Botkit CMS instance as uri');
        }
        if (!this._config.token) {
            throw new Error('Specify a token that matches one configured in your Botkit CMS instance');
        }
    }
    /**
     * Botkit plugin init function
     * Autoloads all scripts into the controller's main dialogSet.
     * @param botkit A Botkit controller object
     */
    init(botkit) {
        this._controller = botkit;
        this._controller.addDep('cms');
        // Extend the controller object with controller.plugins.cms
        botkit.addPluginExtension('cms', this);
        // pre-load all the scripts via the CMS api
        this.loadAllScripts(this._controller).then(() => {// can we load ds x some user space ??
console.log('*** Dialogs loaded from Botkit CMS');
            debug('Dialogs loaded from Botkit CMS');
            this._controller.completeDep('cms');
        });
    }
    apiRequest(uri, params = {}, method = 'GET') {
        return __awaiter(this, void 0, void 0, function* () {
            let req = {
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
            });
        });
    }
    getScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiRequest('/api/v1/commands/list');
        });
    }
    evaluateTrigger(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.apiRequest('/api/v1/commands/triggers', {
                triggers: text
            }, 'POST');
        });
    }
    /**
     * Load all script content from the configured CMS instance into a DialogSet and prepare them to be used.
     * @param dialogSet A DialogSet into which the dialogs should be loaded.  In most cases, this is `controller.dialogSet`, allowing Botkit to access these dialogs through `bot.beginDialog()`.
     */
    loadAllScripts(botkit) {
        return __awaiter(this, void 0, void 0, function* () {
            var scripts = yield this.getScripts();
            scripts.forEach((script) => {// for each cmd
                // map threads from array to object
                let threads = {};
                script.script.forEach((thread) => {
console.log('*** downloading script/thread ', thread.topic);
                    change2Child(thread.script);// added 082019

                    threads[thread.topic] = thread.script.map(this.mapFields);
                });
                let d = new botkit_1.BotkitConversation(script.command, this._controller);// create cmd obj
                d.script = threads;// add threads obj
                botkit.addDialog(d);// add dialog/cmd to dialog set 
            });
        });
    }
    /**
     * Map some less-than-ideal legacy fields to better places
     */
    mapFields(line) {
        // Create the channelData field where any channel-specific stuff goes
        if (!line.channelData) {
            line.channelData = {};
        }
        // TODO: Port over all the other mappings
        // move slack attachments
        if (line.attachments) {
            line.channelData.attachments = line.attachments;
        }
        // we might have a facebook attachment in fb_attachments
        if (line.fb_attachment) {
            let attachment = line.fb_attachment;
            if (attachment.template_type) {
                if (attachment.template_type === 'button') {
                    attachment.text = line.text[0];
                }
                line.channelData.attachment = {
                    type: 'template',
                    payload: attachment
                };
            }
            else if (attachment.type) {
                line.channelData.attachment = attachment;
            }
            // blank text, not allowed with attachment
            line.text = null;
            // remove blank button array if specified
            if (line.channelData.attachment.payload.elements) {
                for (var e = 0; e < line.channelData.attachment.payload.elements.length; e++) {
                    if (!line.channelData.attachment.payload.elements[e].buttons || !line.channelData.attachment.payload.elements[e].buttons.length) {
                        delete (line.channelData.attachment.payload.elements[e].buttons);
                    }
                }
            }
            delete (line.fb_attachment);
        }
        // Copy quick replies to channelData.
        // This gives support for both "native" quick replies AND facebook quick replies
        if (line.quick_replies) {
            line.channelData.quick_replies = line.quick_replies;
        }
        // handle teams attachments
        if (line.platforms && line.platforms.teams) {
            if (line.platforms.teams.attachments) {
                line.attachments = line.platforms.teams.attachments.map((a) => {
                    a.content = Object.assign({}, a);
                    a.contentType = 'application/vnd.microsoft.card.' + a.type;
                    return a;
                });
            }
            delete (line.platforms.teams);
        }
        // handle additional custom fields defined in Botkit-CMS
        if (line.meta) {
            for (var a = 0; a < line.meta.length; a++) {
                line.channelData[line.meta[a].key] = line.meta[a].value;
            }
            delete (line.meta);
        }
        return line;
    }
    /**
     * Uses the Botkit CMS trigger API to test an incoming message against a list of predefined triggers.
     * If a trigger is matched, the appropriate dialog will begin immediately.
     * @param bot The current bot worker instance
     * @param message An incoming message to be interpretted
     * @returns Returns false if a dialog is NOT triggered, otherwise returns void.
     */
    testTrigger(bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('evaluating trigger for ',message);
            const command = yield this.evaluateTrigger(message.text);
           if (command.command) {
            console.log('cms matched trigger for cmd  ',command.command);
                return yield bot.beginDialog(command.command);// without passing message.text ??
            }else  console.log('cms dont matched any trigger  ');
            return false;
        });
    }
    /**
     * Bind a handler function that will fire before a given script and thread begin.
     * Provides a way to use BotkitConversation.before() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.cms.before('my_script','my_thread', async(convo, bot) => {
     *
     *  // do stuff
     *  console.log('starting my_thread as part of my_script');
     *  // other stuff including convo.setVar convo.gotoThread
     *
     * });
     * ```
     *
     * @param script_name The name of the script to bind to
     * @param thread_name The name of a thread within the script to bind to
     * @param handler A handler function in the form async(convo, bot) => {}
     */
    before(script_name, thread_name, handler) {
        let dialog = this._controller.dialogSet.find(script_name);
        if (dialog) {
            dialog.before(thread_name, handler);
        }
        else {
            throw new Error('Could not find dialog: ' + script_name);
        }
    }
    /**
     * Bind a handler function that will fire when a given variable is set within a a given script.
     * Provides a way to use BotkitConversation.onChange() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.plugins.cms.onChange('my_script','my_variable', async(new_value, convo, bot) => {
    *
    * console.log('A new value got set for my_variable inside my_script: ', new_value);
    *
    * });
    * ```
    *
    * @param script_name The name of the script to bind to
    * @param variable_name The name of a variable within the script to bind to
    * @param handler A handler function in the form async(value, convo, bot) => {}
    */
    onChange(script_name, variable_name, handler) {
        let dialog = this._controller.dialogSet.find(script_name);
        if (dialog) {
            dialog.onChange(variable_name, handler);
        }
        else {
            throw new Error('Could not find dialog: ' + script_name);
        }
    }
    /**
    * Bind a handler function that will fire after a given dialog ends.
    * Provides a way to use BotkitConversation.after() on dialogs loaded dynamically via the CMS api instead of being created in code.
    *
    * ```javascript
    * controller.plugins.cms.after('my_script', async(results, bot) => {
    *
    * console.log('my_script just ended! here are the results', results);
    *
    * });
    * ```
    *
    * @param script_name The name of the script to bind to
    * @param handler A handler function in the form async(results, bot) => {}
    */
    after(script_name, handler) {
        let dialog = this._controller.dialogSet.find(script_name);
        if (dialog) {
            dialog.after(handler);
        }
        else {
            throw new Error('Could not find dialog: ' + script_name);
        }
    }
}
exports.BotkitCMSHelper = BotkitCMSHelper;
//# sourceMappingURL=cms.js.map
