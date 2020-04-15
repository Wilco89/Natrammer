
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');


const reddit = require('reddit');

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
            case 'reddit':
            response = redditPost(args)
            bot.sendMessage({
                to: channelID,
                message: response
              });
            break;
            // Just add any case commands if you want to..
         }
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
function redditPost(args) {
  if (args[0]!=null){
    var toppost = reddit.getSubreddit(args[0]);

    return toppost + " is de subreddit"
   }
   return "geef een subreddit aan"
  };
