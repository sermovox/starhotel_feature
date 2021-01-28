#!/bin/sh
# ./link_save_master_files1.sh mybot_v2_03_12_18
MD="/home/luigi/Documents/save/$1"
if [ -d $MD ] 
then
    echo "Directory $MD exists !" 

else
    echo "ok: Directory  $MD created "
	mkdir -p $MD
	cp ./bot.js $MD
	cp -r ./features $MD
	cp -r ./nat $MD
#	cp -r ./skill $MD
	cp -r ./save $MD

#	now we save the added git tracked on masked ( compilated ) node_modules 
#	as, after a install on a local node_modules , the fw bb obj are set by trached git files , we store these file also in /nat/inj_js 
#		that because when clone the repo the node_modules file will be compiled with not upgraded bb files , and will overwrite the fw js file 
#		so we need to discard thore compiled file and take the upstream fw files just resetting all changes in  node_modules .
#			probably just clone , install/compile and reset all changes ( that should be only in node_modules )
#				doing so the  /nat/inj_js will be just a save in case we modify by error those files !! 
#	 nb ./node_modules/botkit/libwas configured in .gitignore
	cp ./node_modules/botkit/lib/core.js $MD
	cp ./node_modules/botbuilder-adapter-web/lib/web_adapter.js $MD
#  	bot in onchange is istance of .....    : we changed something ???
	cp ./node_modules/botkit/lib/botworker.js $MD
	cp ./node_modules/botkit/lib/dialogWrapper.js $MD
	cp ./node_modules/botkit/lib/conversation.js $MD

#	file added to be tracked git add ....
#  	really we do not use ./node_modules/botkit/lib/cms.js , sure? so why we inserted change2child() in mybot_v1 ./node_modules/botkit/lib/cms.js ?
	cp ./node_modules/botkit-plugin-cms/lib/cms.js $MD

	# these file are not git tracked at 12/2020 . because only  was configured in .gitignore
	# so all repo will diverge on these files , and any implemented working tree will be different . 
	# >	compare the most important local working tree before decide tracking these files !!  !!!
	# 	actually now just diverge by comments 
	cp ./node_modules/botbuilder-dialogs/lib/dialogSet.js $MD
	cp ./node_modules/botbuilder-dialogs/lib/dialogContext.js $MD
	cp ./node_modules/botbuilder-core/lib/turnContext.js $MD
	# new , added ds info x associate a channel connection with specific dialogset (to use in multiDS branch )
	cp ./node_modules/botbuilder-adapter-web/lib/web_adapter.js $MD

	file="./bot.js"
	if [ -f "$file" ]
	then
		cp $file $MD
	else
		echo "$file not found."
	fi

fi

# attenzione che se faccio clone da source e poi devo installare (ricompilando) e quindi  cancellero i .../lib che qui salvo . questi vanno ripristinati dopo da questo ultimo save



