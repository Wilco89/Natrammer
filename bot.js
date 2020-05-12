const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const fs = require('fs');
//const Canvas = require('canvas');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client();

bot.login(auth.token);

logger.info(bot);

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.tag);
});
/*
bot.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
	if (!channel) return;

  // Set a new canvas to the dimensions of 700x250 pixels
	const canvas = Canvas.createCanvas(700, 250);
	// ctx (context) will be used to modify a lot of the canvas

  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://discordjs.guide/assets/img/8CQvVRV.cced9193.png');

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Use helpful Attachment class structure to process the file for you
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	bot.send(`Welcome to the server, ${member}!`, attachment);
});
*/


bot.on('message', message => {
    try{
      if (message.author.bot) return;

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send("Pong!");
            break;
            case 'nrb':
              message.channel.send(getHelp(args[0]));
            break;
            case 'P.A.L.E.N.':
                message.channel.send('https://drive.google.com/open?id=1ZUFsj2qIsbEJQ19TXJap2LgbgvclQ61a');
            break;
            case 'F':
              message.channel.send("F");
            break;
            case 'cp':
              message.channel.send(getCopypasta(args[0]));
            break;
            case 'cplist':
              message.channel.send(createCpEmbed());
            break;
            case 'addcp':
              message.channel.send(addCopypasta(args, message.content));
            break;
            case 'addresp':
              message.channel.send(addResponse(args, message.content, message.client));
            break;
            case 'imgresp':
              message.channel.send(addImgResponse(args, message.content, message.client));
            break;
            case 'remresp':
                message.channel.send(removeResponse(args));
            break;
            case 'bee':
              beeCut().forEach(scene => message.channel.send(scene));
              message.channel.send("I had virtually no rehearsal for that.", {files: ["./home/natrammerbot/botfuckery/Natrammer/misc/bee.gif"]});
            break;
            case 'testimg':
              message.channel.send("ayy lmao", {files: ["./home/natrammerbot/botfuckery/Natrammer/misc/pepe.png"]});
            break;
            case 'reload':
              return bot.destroy();
            break;
            case 'join':
              client.emit('guildMemberAdd', message.member);
            break;
            // Just add any case commands if you want to..
         }
       }
         resplist = getResponseList("responses");
         for (resp in resplist){
           if (message.content.toLowerCase().includes(resplist[resp]['name'])){
             message.channel.send(resplist[resp]['text']);
             //message.channel.send(resplist[resp]['text'], {files: [resplist[resp]['img']]} - Deze line gebruiken wanneer imgresponses weer werken.
           }
        }
        resplist = getResponseList("imgrespons");
        for (resp in resplist){
          if (message.content.toLowerCase().includes(resplist[resp]['name'])){
            message.channel.send({files: [resplist[resp]['img']]});
            //message.channel.send(resplist[resp]['text'], {files: [resplist[resp]['img']]} - Deze line gebruiken wanneer imgresponses weer werken.
          }
       }





     }
     catch(e){
       logger.info("error" + e);
     }
});

function getResponseList(soort){
  try{
    responses = fs.readFileSync(`/home/natrammerbot/botfuckery/Natrammer/${soort}.json`, {"encoding": "utf-8"});
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
    responseslist = getResponseList("responses");

    //check if already defineddddd
    for (resp in responseslist){
      if (responseslist[resp]['name'] == respname){
        return respname + ' is reeds gedefinieerd, onze welgemeende excuses voor dit onplezierige ongemakje.';
      }
    }

    bericht = message.slice(10 + respname.length);
    new_response = JSON.parse(`{"name" : "${respname}", "text" : "${bericht}", "creator" :" ${user.user}"}`);
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

function addImgResponse(args, message, user){
  try{
    respname = args[0];
    responseslist = getResponseList("imgrespons");

    //check if already definedd
    for (resp in responseslist){
      if (responseslist[resp]['name'] == respname){
        return respname + ' is reeds gedefinieerd, onze welgemeende excuses voor dit onplezierige ongemakje.';
      }
    }

    img = args[1];
    if(img.slice(-4) != ".jpg" && img.slice(-4) != ".png" && img.slice(-4) != ".gif"){
      return "Alleen .jpg, .png en .gif zijn toegestaan!";
      logger.info("Someone wanted to add something other than an image. Fucking idiots!");
    }

    bericht = message.slice(10 + respname.length);
    new_response = JSON.parse(`{"name" : "${respname}", "img" : "${img}"}`);
    responseslist.push(new_response);
    fs.writeFile("/home/natrammerbot/botfuckery/Natrammer/imgrespons.json", JSON.stringify(responseslist), function (err){
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
    switch(args[0]){
      case 'img':
        resptype = "imgrespons";
      break;
      case 'txt':
        resptype = "responses";
      break;
      default:
        return "Oeps! Probeer het opnieuw met !remresp [txt/img] [naam]. Kan gewoon. Helemaal gratis *wanneer je een premiumgebruiker bent*";
      break;
    }
    respname = args[1];
    logger.info(resptype);
    logger.info(respname);
    responseslist = getResponseList(resptype);
    //logger.info(responseslist);
    for (resp in responseslist){
      if (responseslist[resp]['name'] == respname){
        responseslist.splice(resp, 1);
        fs.writeFile(`/home/natrammerbot/botfuckery/Natrammer/${resptype}.json`, JSON.stringify(responseslist), function (err){
          if (err) return 'err in het schrijven + ' + err;
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
    cpResult = "";
    cpArray.forEach(item => {
      cpResult = cpResult + item.substring(0, item.length - 4) + "\n";
    });
    return cpResult;
  }
  catch{
    return "Ja maat ik zit te kakken op het moment. Probeer het later ajb";
  }
}

function createCpEmbed(){
  const cpEmbed = new Discord.MessageEmbed()
    .setTitle('Beschikbare pasta')
    .setColor(0xffbe30)
    .setDescription('Een lijst met alle copypastas.')
    .addFields(
      { name: 'Gebruik met !cp [titel].', value: listCopyPasta() },
    );
    return cpEmbed;
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

  //!bee
  function beeCut(){
    var beeCount = 1;
    var beeMayhem = new Array();

    while (beeCount < 31) {
      beePath = `/home/natrammerbot/botfuckery/Natrammer/misc/bee/bee${beeCount}.txt`;
      beeMayhem.push(fs.readFileSync(beePath, {"encoding": "utf-8"}));
      beeCount++;
    }
    return beeMayhem;
  }
