module.exports=//
function(wserv){
if(wserv){
wserv.get('/someuri', (req, res) => {
    // Allow the Botbuilder middleware to fire.
    // this middleware is responsible for turning the incoming payload into a BotBuilder Activity
    // which we can then use to turn into a BotkitMessage
    res.send('someuri wellcome');
});
}
}