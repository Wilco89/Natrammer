const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const fs = require('fs');

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
            case 'nrb':
                bot.sendMessage({
                    to: channelID,
                    message: getHelp(args[0])
                })
            break;
            case 'P.A.L.E.N.':
                bot.sendMessage({
                    to: channelID,
                    message: 'https://drive.google.com/open?id=1ZUFsj2qIsbEJQ19TXJap2LgbgvclQ61a'
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
            case 'cplist':
                bot.sendMessage({
                    to: channelID,
                    message: listCopyPasta()
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
            case 'bee':
              bot.sendMessage({
                to: channelID,
                message: "Ya like jazz? https://giphy.com/gifs/movie-bee-full-rUxSaLgjcQbLO"
              });
            case 'testimg': //This sucks major dingdong. Yes it does
              try{
                bot.uploadFile({
                to: channelID,
                message: "Eindig me",
                file: "pepe.png"
              }, error);
            }
              catch(error){
                bot.sendMessage({
                  to: channelID,
                  message: "error is: " + error
              });
            }
            break;
            // Just add any case commands if you want to..
         }
       }
         resplist = getResponseList();
         for (resp in resplist){
           if (message.toLowerCase().includes(resplist[resp]['name'])){
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
    responses = fs.readFileSync("/home/natrammerbot/botfuckery/Natrammer/responses.json", {"encoding": "utf-8"});	//GEWIJZIGD: absolute bestandslocatie
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
    fs.writeFile("/home/natrammerbot/botfuckery/Natrammer/responses.json", JSON.stringify(responseslist), function (err){
      if (err) throw err;
});
    return `${respname} is added to the response database`;
  }
  catch(e){
    logger.info("error" + e);
    return "er ging iets mis hij is niet toegevoegd";
  }
}

function removeResponse(args){
  try{
    respname = args[0];
    responseslist = getResponseList();

    for (resp in responseslist){
      if (responseslist[resp]['name'] == respname){
        responseslist.pop(responseslist[resp]);
        fs.writeFile("/home/natrammerbot/botfuckery/Natrammer/responses.json", JSON.stringify(responseslist), function (err){
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
    cpPath = `/home/natrammerbot/botfuckery/Natrammer/copypasta/${args}.txt`;
    return fs.readFileSync(cpPath, {"encoding": "utf-8"});
  }
  catch{
    return "copypasta staat nog niet in de lijst"
  }
}

//!cplist
function listCopyPasta(){
  try{
    cpArray = fs.readdirSync("/home/natrammerbot/botfuckery/Natrammer/copypasta", {withFileType: false})
    cpResult = "**Alle pasta die ik heb:**\n";
    cpArray.forEach(item => {
      cpResult = cpResult + item.substring(0, item.length - 4) + "\n";
    });
    return cpResult;
  }
  catch{
    return "Ja maat ik zit te kakken op het moment. Probeer het later ajb";
  }
}

//!addcp
function addCopypasta(args, message){
  try{
    cpname = args[0]
    message=message.slice(7 + cpname.length);
    cpPath = `/home/natrammerbot/botfuckery/Natrammer/copypasta/${cpname}.txt`;
    fs.writeFile(cpPath, message, function (err){
      if (err) throw err;
});
    return `${cpname} is added to the copypasta database`;
  }
  catch{
    return "adding to database failed";
  }
}

//!nrb
function getHelp(args){
  try{
    switch(args){
      case "1":
        return "help1";
      break;
      case "2":
        return "penis";
        break;
      }
      return fs.readFileSync("/home/natrammerbot/botfuckery/Natrammer/help/main.txt", {"encoding": "utf-8"});
    }
    catch{
      return "Als je je eigen hulp page niet kan laden, ben je echt de lul :sad:"
    }
  }
