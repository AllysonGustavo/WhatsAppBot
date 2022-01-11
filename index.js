import wa from "@open-wa/wa-automate";
import axios from "axios";

wa.create({
  sessionId: "WPP_BOT",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: "PT_BR",
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
  chromiumArgs: 'args'['--no-sandbox','--disable-setuid-sandbox'] // pra funcionar na Heroku
}).then((client) => start(client));

const prefix = "!"; // prefixo do bot

function start(client) {
  client.onMessage(async (msg) => await handleMessage(client, msg));
}

async function handleMessage(client, msg) {
  // Pega a mensagem enviada, remove qualquer espaço nas pontas
  // e deixa o conteúdo dela em minusculo
  const bodyMsgOla = msg.body.trim().toLowerCase();

  // verifica se a mensagem é "oi" ou "ola"
  if (["oi", "ola"].includes(bodyMsgOla))
    return await client.sendText(msg.from, "👋 Fala mano!");

  // verifica se é um comando, se nao for, ignora o resto do codigo.
  const isCommand = msg.body.startsWith(prefix);
  if (!isCommand) return;

  // pega argumentos
  const args = msg.body.slice(prefix.length).trim().split(/ +/g);
  // pega o comando a partir da array de argumentos acima, remove o primeiro argumento.
  const command = args.shift().toLowerCase();

  switch (command) {
    case "drc":
    case "draco": {
      const { valorAtual, valorAntigo } = await getDraco();
      const porcentagemMudanca =
        ((valorAtual - valorAntigo) / valorAntigo) * 100;
      const mensagem = `Valor Atual: ${valorAtual}
Valor Antigo: ${valorAntigo}
Diferença: ${porcentagemMudanca.toFixed(2)} %`;

      await client.reply(msg.from, mensagem, msg.id);
      break;
    }
    case "comandos": {
      await client.sendText(msg.from, '🔧Os comandos são:');
      await client.sendText(msg.from, '!comandos - Mostra a lista de comandos');
      await client.sendText(msg.from, '!draco - Mostra informações da moeda Draco(Mir4)')
      break;
    }
    default: {
      return await client.reply(msg.from, "Este comando não existe! Digite !comandos para ver os comandos", msg.id);
    }
  }
}

async function getDraco() {
  const { data: dadosResponse } = await axios.post(
    "https://api.mir4global.com/wallet/prices/draco/lastest"
  );

  const { USDDracoRate, USDDracoRatePrev } = dadosResponse.Data;
  return { valorAtual: USDDracoRate, valorAntigo: USDDracoRatePrev };
}
