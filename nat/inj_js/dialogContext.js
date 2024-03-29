"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_1 = require("./dialog");
/**
 * A context object used to manipulate a dialog stack.
 *
 * @remarks
 * This is typically created through a call to `DialogSet.createContext()` and is then passed
 * through to all of the bots dialogs and waterfall steps.
 *
 * ```JavaScript
 * const dc = await dialogs.createContext(turnContext);
 * ```
 */
class DialogContext {
    /**
      * Creates a new DialogContext instance.
      * @param dialogs Parent dialog set.
      * @param context Context for the current turn of conversation with the user.
      * @param state State object being used to persist the dialog stack.
      */
    constructor(dialogs, context, state) {
        if (!Array.isArray(state.dialogStack)) {
            state.dialogStack = [];
        }
        this.dialogs = dialogs;
        this.context = context;
        this.stack = state.dialogStack;
    }
    /**
     * Returns the persisted instance of the active dialog on the top of the stack or `undefined` if
     * the stack is empty.
     *
     * @remarks
     * Dialogs can use this to persist custom state in between conversation turns:
     *
     * ```JavaScript
     * dc.activeDialog.state = { someFlag: true };
     * ```
     */
    get activeDialog() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }
    /**
     * Pushes a new dialog onto the dialog stack.
     *
     * @remarks
     * If there's already an active dialog on the stack, that dialog will be paused until the new
     * dialog calls [endDialog()](#enddialog).
     *
     * ```JavaScript
     * return await dc.beginDialog('greeting', { name: user.name });
     * ```
     *
     * The `DialogTurnResult.status` returned can be:
     * - `DialogTurnStatus.active` if the dialog started was a multi-turn dialog.
     * - `DialogTurnStatus.completed` if the dialog started was a single-turn dialog.
     * @param dialogId ID of the dialog to start.
     * @param options (Optional) additional argument(s) to pass to the dialog being started.
     */


     
    async beginDialog(dialogId, options) {
        // Lookup dialog
        const dialog = this.findDialog(dialogId);
        if (!dialog) {
            throw new Error(`DialogContext.beginDialog(): A dialog with an id of '${dialogId}' wasn't found.`);
        }
        // Push new instance onto stack.
        const instance = {
            id: dialogId,
            state: {}
        };
        this.stack.push(instance);
        // Call dialogs begin() method.
        return await dialog.beginDialog(this, options);
    }
    /**
     * Cancels any dialogs on the stack resulting in an empty stack.
     *
     * @remarks
     * The dialogs being cancelled will have their `Dialog.endDialog()` method called before being
     * removed from the stack.
     *
     * ```JavaScript
     * await dc.cancelAllDialogs();
     * return await dc.beginDialog('bookFlight');
     * ```
     *
     * The `DialogTurnResult.status` returned can be:
     * - `DialogTurnStatus.cancelled` if one or more dialogs were cancelled.
     * - `DialogTurnStatus.empty` if the stack was empty.
     */
    async cancelAllDialogs() {
        if (this.stack.length > 0) {
            while (this.stack.length > 0) {
                await this.endActiveDialog(dialog_1.DialogReason.cancelCalled);
            }
            return { status: dialog_1.DialogTurnStatus.cancelled };
        }
        else {
            return { status: dialog_1.DialogTurnStatus.empty };
        }
    }
    /**
     * Searches for a dialog with a given ID.
     *
     * @remarks
     * If the dialog cannot be found within the current `DialogSet`, the parent `DialogContext`
     * will be searched if there is one.
     * @param dialogId ID of the dialog to search for.
     */
    findDialog(dialogId) {
        let dialog = this.dialogs.find(dialogId);
        if (!dialog && this.parent) {
            dialog = this.parent.findDialog(dialogId);
        }
        return dialog;
    }
    async prompt(dialogId, promptOrOptions, choices) {
        let options;
        if ((typeof promptOrOptions === 'object' &&
            promptOrOptions.type !== undefined) ||
            typeof promptOrOptions === 'string') {
            options = { prompt: promptOrOptions };
        }
        else {
            options = { ...promptOrOptions };
        }
        if (choices) {
            options.choices = choices;
        }
        return this.beginDialog(dialogId, options);
    }
    /**
     * Continues execution of the active multi-turn dialog, if there is one.
     *
     * @remarks
     * The stack will be inspected and the active dialog will be retrieved using `DialogSet.find()`.
     * The dialog will then have its `Dialog.continueDialog()` method called.
     *
     * ```JavaScript
     * const result = await dc.continueDialog();
     * if (result.status == DialogTurnStatus.empty && dc.context.activity.type == ActivityTypes.message) {
     *     // Send fallback message
     *     await dc.context.sendActivity(`I'm sorry. I didn't understand.`);
     * }
     * ```
     *
     * The `DialogTurnResult.status` returned can be:
     * - `DialogTurnStatus.active` if there's still one or more dialogs on the stack.
     * - `DialogTurnStatus.completed` if the last dialog on the stack just ended.
     * - `DialogTurnStatus.empty` if the stack was empty.
     */
    async continueDialog() {
        // Check for a dialog on the stack
        const instance = this.activeDialog;
        if (instance) {
            // Lookup dialog
            const dialog = this.findDialog(instance.id);
            if (!dialog) {
                throw new Error(`DialogContext.continue(): Can't continue dialog. A dialog with an id of '${instance.id}' wasn't found.`);
            }
            // Continue execution of dialog
            return await dialog.continueDialog(this);// !!! is not calling conversation.continuedialog is botbuilder-dialogs/lib/prompts/prompt.continuedialog !!!
        }
        else {
            return { status: dialog_1.DialogTurnStatus.empty };
        }
    }
    /**
     * Ends a dialog by popping it off the stack and returns an optional result to the dialogs
     * parent.
     *
     * @remarks
     * The parent dialog is the dialog the started the one being ended via a call to either
     * [beginDialog()](#begindialog) or [prompt()](#prompt). The parent dialog will have its
     * `Dialog.resumeDialog()` method called with any returned `result`. If there is no parent
     * dialog then turn will end and the result will be passed to the bot via
     * `DialogTurnResult.result`.
     *
     * ```JavaScript
     * return await dc.endDialog();
     * ```
     *
     * The `DialogTurnResult.status` returned can be:
     * - `DialogTurnStatus.active` the parent dialog was resumed and is still active.
     * - `DialogTurnStatus.completed` the parent dialog completed or there was no parent dialog to resume.
     * @param result (Optional) result to pass to the parent dialogs `Dialog.resume()` method.
     */
    async endDialog(result) {
        // End the active dialog
        await this.endActiveDialog(dialog_1.DialogReason.endCalled);
        // Resume parent dialog
        const instance = this.activeDialog;
        if (instance) {
            // Lookup dialog
            const dialog = this.findDialog(instance.id);
            if (!dialog) {
                throw new Error(`DialogContext.end(): Can't resume previous dialog. A dialog with an id of '${instance.id}' wasn't found.`);
            }
            // Return result to previous dialog
            return await dialog.resumeDialog(this, dialog_1.DialogReason.endCalled, result);
        }
        else {
            // Signal completion
            return { status: dialog_1.DialogTurnStatus.complete, result: result };
        }
    }
    /**
     * Ends the active dialog and starts a new dialog in its place.
     *
     * @remarks
     * This method is conceptually equivalent to calling [endDialog()](#enddialog) and then
     * immediately calling [beginDialog()](#begindialog). The difference is that the parent
     * dialog is not resumed or otherwise notified that the dialog it started has been replaced.
     *
     * This method is particularly useful for creating conversational loops within your bot:
     *
     * ```JavaScript
     * this.addDialog(new WaterfallDialog('randomNumber', [
     *     async (step) => {
     *         const { min, max } = step.options;
     *         const num = min + Math.floor((max - min) * Math.random());
     *         return await step.prompt('continuePrompt', `Here's a number between ${min} and ${max}: ${num}. Should I pick another one?`);
     *     },
     *     async (step) {
     *         if (step.result) {
     *             return await step.replaceDialog(this.id, step.options);
     *         } else {
     *             return await step.endDialog();
     *         }
     *     }
     * ]));
     *
     * this.addDialog(new ConfirmPrompt('continuePrompt'));
     * ```
     * @param dialogId ID of the new dialog to start.
     * @param options (Optional) additional argument(s) to pass to the new dialog.
     */
    async replaceDialog(dialogId, options) {// todo error 072019 
        // End the active dialog
        await this.endActiveDialog(dialog_1.DialogReason.replaceCalled);
        // Start replacement dialog
        console.log(' replace dialog in dc , options: ',options);
        return await this.beginDialog(dialogId, options);
    }
    /**
     * Requests the [activeDialog](#activeDialog) to re-prompt the user for input.
     *
     * @remarks
     * The active dialogs `Dialog.repromptDialog()` method will be called.
     *
     * ```JavaScript
     * await dc.repromptDialog();
     * ```
     */
    async repromptDialog() {
        // Check for a dialog on the stack
        const instance = this.activeDialog;
        if (instance) {
            // Lookup dialog
            const dialog = this.findDialog(instance.id);
            if (!dialog) {
                throw new Error(`DialogSet.reprompt(): Can't find A dialog with an id of '${instance.id}'.`);
            }
            // Ask dialog to re-prompt if supported
            await dialog.repromptDialog(this.context, instance);
        }
    }
    async endActiveDialog(reason) {
        const instance = this.activeDialog;
        if (instance) {
            // Lookup dialog
            const dialog = this.findDialog(instance.id);
            if (dialog) {
                // Notify dialog of end
                await dialog.endDialog(this.context, instance, reason);
            }
            // Pop dialog off stack
            this.stack.pop();
        }
    }
}
exports.DialogContext = DialogContext;
//# sourceMappingURL=dialogContext.js.map