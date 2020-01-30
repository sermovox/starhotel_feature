/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = function(controller) {

    if (controller.adapter.name === 'Web Adapter') {

        console.log('Loading sample web features...');

        controller.hears(new RegExp('quick'), 'message', async (bot, message) => {

            await bot.reply(message,{
                text: 'Here are some quick replies',
                quick_replies: [
                    {
                        title: 'Foo',
                        payload: 'foo',
                    },
                    {
                        title: 'Bar',
                        payload: 'bar',
                    }
                ]
            });
        });


    }

    async function conductOnboarding(bot, message) {

    await bot.reply(message,'bar');
	/*
      bot.startConversation(message,async function(err, convo) {

        convo.say({
          text: 'Hello human! I am brand new Botkit bot, ready to be customized to your needs!',
          quick_replies: [
            {
              title: 'Help',
              payload: 'help',
            },
          ]
        });
	

      });*/

    }


// new :
   controller.on('hello', conductOnboarding);controller.on('welcome_back', conductOnboarding);
    }



