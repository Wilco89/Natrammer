
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
            case 'addresp':
                bot.sendMessage({
                    to: channelID,
                    message: addResponse(args, message, user)
                });
            break;
            case 'remresp':
                bot.sendMessage({
                    to: channelID,
                    message: removeResponse(args)
                });
            break;
            // Just add any case commands if you want to..
         }
       }
         resplist = getResponseList();
         for (resp in resplist){
           if (message.includes(resplist[resp]['name'])){
             bot.sendMessage({
                 to: channelID,
                 message: resplist[resp]['text']
               })
           }
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

function getResponseList(){
  try{
    responses = fs.readFileSync("./responses.json", {"encoding": "utf-8"});
  return JSON.parse(responses);
}
  catch(e){
    logger.info("error :" + e);
  }
}

//!addresp
function addResponse(args, message, user){
  try{
    respname = args[0];
    responseslist = getResponseList();

    //check if already defineddddd
    for (resp in responseslist){
      if (responseslist[resp]['name'] == respname){
        return respname + ' is reeds gedefinieerd, onze welgemeende excuses voor dit onplezierige ongemakje.';
      }
    }

    bericht = message.slice(10 + respname.length);
    new_response = JSON.parse(`{"name" : "${respname}", "text" : "${bericht}", "creator" :" ${user}"}`);
    responseslist.push(new_response);
    fs.writeFile("responses.json", JSON.stringify(responseslist), function (err){
      if (err) throw err;
});
    return `${respname} is added to the response database`;
  }
  catch(e){
    return e;
  }
}

function removeResponse(args){
  try{
    respname = args[0];
    responseslist = getResponseList();

    for (resp in responseslist){
      if (responseslist[resp]['name'] == respname){
        responseslist.pop(responseslist[resp]);
        fs.writeFile("responses.json", JSON.stringify(responseslist), function (err){
          if (err) throw err;
        });
        return respname + ' is verwijderd';
      }
    }
    return respname + ' was niet gedefinieerd.';
  }
  catch(e){
    logger.info('error: ',e);
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
