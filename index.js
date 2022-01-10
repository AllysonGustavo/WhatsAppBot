import fetch from 'node-fetch';
import wa from '@open-wa/wa-automate';

wa.create({
  sessionId: "WPP_BOT",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
  client.onMessage(async message => {
    if (message.body == 'oi') {
      await client.sendText(message.from, '👋 Fala mano!');
    }
    if (message.body === '!comandos') {
      await client.sendText(message.from, '🔧Os comandos são:');
      await client.sendText(message.from, '!comandos - Mostra a lista de comandos');
      await client.sendText(message.from, '!draco - Mostra informações da moeda Draco(Mir4)')
    }
    if (message.body === '!draco'){
      async function getDraco () {
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
        }
    
        return fetch('https://api.mir4global.com/wallet/prices/draco/lastest', options).then(data => data.json())
      }
    
      const dados = await getDraco()
      const valorMudanca = (dados.Data.USDDracoRate-dados.Data.USDDracoRatePrev)/dados.Data.USDDracoRatePrev*100
      const dracoInfo = `Valor atual: U$${dados.Data.USDDracoRate}
Valor anterior: U$${dados.Data.USDDracoRatePrev}
Mudança: ${valorMudanca.toFixed(2)}%`

      client.sendText(message.from, dracoInfo);
    }
  });
}