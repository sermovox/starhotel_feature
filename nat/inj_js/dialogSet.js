"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_1 = require("./dialog");
const dialogContext_1 = require("./dialogContext");
/**
 * A related set of dialogs that can all call each other.
 *
 * @remarks
 * The constructor for the dialog set should be passed a state property that will be used to
 * persist the dialog stack for the set:
 *
 * ```JavaScript
 * const { ConversationState, MemoryStorage, ActivityTypes } = require('botbuilder');
 * const { DialogSet, Dialog, DialogTurnStatus } = require('botbuilder-dialogs');
 *
 * const convoState = new ConversationState(new MemoryStorage());
 * const dialogState = convoState.createProperty('dialogState');
 * const dialogs = new DialogSet(dialogState);
 * ```
 *
 * The bot can add dialogs or prompts to the set using the [add()](#add) method:
 *
 * ```JavaScript
 * class GreetingDialog extends Dialog {
 *     async beginDialog(dc, options) {
 *         await dc.context.sendActivity(`Hi! I'm a bot.`);
 *         return await dc.endDialog();
 *     }
 * }
 *
 * dialogs.add(new GreetingDialog('greeting'));
 * ```
 *
 * To interact with the sets dialogs you can call [createContext()](#createcontext) with the
 * current `TurnContext`. That will create a `DialogContext` that can be used to start or continue
 * execution of the sets dialogs:
 *
 * ```JavaScript
 * // Create DialogContext for the current turn
 * const dc = await dialogs.createContext(turnContext);
 *
 * // Try to continue executing an active multi-turn dialog
 * const result = await dc.continueDialog();
 *
 * // Send greeting if no other dialogs active
 * if (result.status == DialogTurnStatus.empty && dc.context.activity.type == ActivityTypes.Message) {
 *     await dc.beginDialog('greeting');
 * }
 * ```
 */
class DialogSet {
    /**
     * Creates a new DialogSet instance.
     *
     * @remarks
     * If the `dialogState` property is not passed in, calls to [createContext()](#createcontext)
     * will return an error.  You will need to create a `DialogContext` for the set manually and
     * pass in your own state object for persisting the sets dialog stack:
     *
     * ```JavaScript
     * const dc = new DialogContext(dialogs, turnContext, state);
     * ```
     * @param dialogState (Optional) state property used to persist the sets dialog stack.
     */
    constructor(dialogState) {
        this.dialogs = {};
        this.dialogState = dialogState;
    }
    /**
     * Adds a new dialog or prompt to the set.
     *
     * @remarks
     * The `Dialog.id` of all dialogs or prompts added to the set need to be unique within the set.
     * @param dialog The dialog or prompt to add.
     * If a telemetryClient is present on the dialog set, it will be added to each dialog.
     */
    add(dialog) {
        if (!(dialog instanceof dialog_1.Dialog)) {
            throw new Error(`DialogSet.add(): Invalid dialog being added.`);
        }
        if (typeof dialog.id !== 'string' || dialog.id.length === 0) {
            throw new Error(`DialogSet.add(): Dialog being added is missing its 'id'.`);
        }
        if (this.dialogs.hasOwnProperty(dialog.id)) {
            throw new Error(`DialogSet.add(): A dialog with an id of '${dialog.id}' already added.`);
        }
        // If a telemetry client has already been set on this dialogSet, also set it on new dialogs as they are added.
        if (this._telemetryClient) {
            dialog.telemetryClient = this._telemetryClient;
        }
        this.dialogs[dialog.id] = dialog;
        return this;
    }
    /**
     * Creates a dialog context which can be used to work with the dialogs in the set.
     * @param context Context for the current turn of conversation with the user.
     */
    async createContext(context) {
        if (!this.dialogState) {
            throw new Error(`DialogSet.createContextAsync(): the dialog set was not bound to a stateProperty when constructed.`);
        }
        const state = await this.dialogState.get(context, { dialogStack: [] });
        return new dialogContext_1.DialogContext(this, context, state);
    }
    /**
     * Finds a dialog that was previously added to the set using [add()](#add).
     *
     * @remarks
     * This example finds a dialog named "greeting":
     *
     * ```JavaScript
     * const dialog = dialogs.find('greeting');
     * ```
     * @param dialogId ID of the dialog or prompt to lookup.
     */
    find(dialogId) {
        return this.dialogs.hasOwnProperty(dialogId) ? this.dialogs[dialogId] : undefined;
    }
    /**
     * Set the telemetry client for this dialog set and apply it to all current dialogs.
     */
    get telemetryClient() {
        return this._telemetryClient;
    }
    /**
     * Set the telemetry client for this dialog set and apply it to all current dialogs.
     * Future dialogs added to the set will also inherit this client.
     */
    set telemetryClient(client) {
        this._telemetryClient = client;
        for (let key in this.dialogs) {
            this.dialogs[key].telemetryClient = this._telemetryClient;
        }
    }
}
exports.DialogSet = DialogSet;
//# sourceMappingURL=dialogSet.js.map