
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    try{
      if(userID!=bot.id){
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'F':
                bot.sendMessage({
                    to: channelID,
                    message: 'F'
                });
            break;
            case 'cp':
                bot.sendMessage({
                    to: channelID,
                    message: getCopypasta(args[0])
                });
            break;
            case 'addcp':
                bot.sendMessage({
                    to: channelID,
                    message: addCopypasta(args, message)
                });
            break;
            // Just add any case commands if you want to..
         }
       }

       resp = checkIfResponse(message);
       if checkIfResponse(message)){
         bot.sendMessage({
             to: channelID,
             message: respond(resp)
         });

       }



       if(message.includes("unit")){
         bot.sendMessage({
             to: channelID,
             message: user + ' HAHAHAHAHAHAHA zei je dat nou echt? GENIAAL U N I T, unit'
           })
         }
       }
     }
     catch(e){
       bot.sendMessage({
         to:channelID,
         message: e
       });
     }
});
function checkIfResponse(args){
  try{
    var files = fs.readdirSync('/assets/photos/');
    forEach((item, files) => {
      if (message.includes(item)){
        return item;
      }
    });
    return false;
  }
  catch{
    return false;
  }
}

function respond(item){
  try{
    respPath = `responses/${args}.txt`;
    return fs.readFileSync(respPath, {"encoding": "utf-8"});
  }
  catch {return "error in responding"}
}


//!addresp
function addResponse(args, message){
  try{
    respname = args[0]
    message=message.slice(9 + cpname.length);
    respPath = `responses/${cpname}.txt`;
    fs.writeFile(respPath, message, function (err){
      if (err) throw err;
});
    return `${respname} is added to the response database`;
  }
  catch{
    return "adding to database failed";
  }
}




//!cp
function getCopypasta(args){
  try{
    cpPath = `copypasta/${args}.txt`;
    return fs.readFileSync(cpPath, {"encoding": "utf-8"});
  }
  catch{
    return "copypasta staat nog niet in de lijst"
  }
}

//!addcp
function addCopypasta(args, message){
  try{
    cpname = args[0]
    message=message.slice(7 + cpname.length);
    cpPath = `copypasta/${cpname}.txt`;
    fs.writeFile(cpPath, message, function (err){
      if (err) throw err;
});
    return `${cpname} is added to the copypasta database`;
  }
  catch{
    return "adding to database failed";
  }
}
