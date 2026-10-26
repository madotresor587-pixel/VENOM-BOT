require('dotenv').config();
module.exports={botName:"VENOM BOT",creator:"MADO",version:"1.0.0",prefix:process.env.PREFIX||".",ownerNumbers:(process.env.OWNER_NUMBER||"").split(",").filter(Boolean),sessionFolder:"session",databaseFolder:"database",publicMode:true};
