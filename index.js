require('dotenv').config();
const fs=require('fs');const readline=require('readline');const chalk=require('chalk');const pino=require('pino');
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason,delay}=require('@whiskeysockets/baileys');
const config=require('./config');const {ensureFolders,loadJson,saveJson}=require('./lib/database');
const logger=pino({level:'silent'});ensureFolders();
let db=loadJson('settings.json',{owners:[]});
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const question=(t)=>new Promise(r=>rl.question(t,r));
async function startBot(){
  console.log(chalk.bgBlack.red(` VENOM BOT v${config.version} - ${config.creator} `));
  const {state,saveCreds}=await useMultiFileAuthState(config.sessionFolder);
  const sock=makeWASocket({auth:state,logger,browser:["VENOM BOT","Chrome","1.0.0"]});
  if(!sock.authState.creds.registered){
    let phone=process.env.OWNER_NUMBER||await question("Numero ex 2250700000000 sans +: ");
    phone=phone.replace(/[^0-9]/g,'');
    try{await delay(2000);const code=await sock.requestPairingCode(phone);console.log(chalk.bgGreen.black(` CODE: ${code} `));console.log("WhatsApp > Appareils lies > Lier avec numero");}catch(e){console.log("Erreur code:",e.message);}
  }
  sock.ev.on('creds.update',saveCreds);
  sock.ev.on('connection.update',async(u)=>{if(u.connection==='close'){await delay(5000);startBot();}else if(u.connection==='open'){console.log("VENOM CONNECTE 🕷️");}});
  sock.ev.on('messages.upsert',async({messages})=>{const m=messages[0];if(!m.message||m.key.fromMe)return;const chatId=m.key.remoteJid;let body=m.message.conversation||m.message.extendedTextMessage?.text||"";if(!body.startsWith(config.prefix))return;const args=body.slice(1).trim().split(/ +/);const cmd=args.shift().toLowerCase();if(cmd==='menu')await sock.sendMessage(chatId,{text:"🕷️ VENOM BOT\n.allmenu pour 180 commandes\n.ping .owner .tagall .sticker"});if(cmd==='allmenu')await sock.sendMessage(chatId,{text:"180 COMMANDES - menu, ping, owner, tagall, hidetag, groupinfo, admins, linkgroup, antilink, sticker, toimg, ai, play, etc"});if(cmd==='ping')await sock.sendMessage(chatId,{text:`Pong ${Date.now()%1000}ms`});});
}
startBot();
