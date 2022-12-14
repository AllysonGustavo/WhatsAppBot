import wa from "@open-wa/wa-automate";
import axios from "axios";

wa.create({
  sessionId: "WPPBOT",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: "PT_BR",
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
  chromiumArgs: 'args'['--no-sandbox','--disable-setuid-sandbox'] // work on heroku
}).then((client) => start(client));


const prefix = "!"; // bot prefix

function start(client) {
  client.onMessage(async (msg) => await handleMessage(client, msg));
}

async function handleMessage(client, msg) {
  // Pega a mensagem enviada, remove qualquer espaço nas pontas .trim
  // e deixa o conteúdo dela em minusculo .toLowerCase
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

    case "habibs": {
      // Let's generate
      // Nome da Conta
      const name = await axios.get('https://geradornv.com.br/wp-json/api/generator-people?sex=x&state=XX')
                              .then(resp => {return resp.data.people})
      // Senha
      const senha = 'zelele123';
      // CPF
      const n1 = Math.round(Math.random() * 9);
      const n2 = Math.round(Math.random() * 9);
      const n3 = Math.round(Math.random() * 9);
      const n4 = Math.round(Math.random() * 9);
      const n5 = Math.round(Math.random() * 9);
      const n6 = Math.round(Math.random() * 9);
      const n7 = Math.round(Math.random() * 9);
      const n8 = Math.round(Math.random() * 9);
      const n9 = Math.round(Math.random() * 6);
      let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
      d1 = 11 - (d1 % 11);
      if (d1 >= 10) {
          d1 = 0;
      }
      let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
      d2 = 11 - (d2 % 11);
      if (d2 >= 10) {
          d2 = 0;
      }
      const cpf = `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
      // Email
      const names = name.split(" ");
      const removeAccents = value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      const firstName = removeAccents(names[0]);
      const lastName = removeAccents(names[names.length - 1]);
      const email = `${firstName}.${lastName}@geradornv.com.br`;
      // Nascimento
      const year = new Date().getFullYear() - Math.floor(Math.random() * 90) - 1;
      const nascimento = `17/10/${year}`;
      // Celular
      const celular = '(11) 98811-1101';
      // Creating account
      const origem = 'bibsfihagratis'
      const conta = {
        origem: origem,
        nome: name,
        senha: senha,
        cpf: cpf,
        email: email,
        data_nascimento: nascimento,
        celular: celular,
        checkbox_regulamento: 'on',
        btn_cadastro: ''
      };

      let formteste = new URLSearchParams();

      for (let chave in conta) { 
        formteste.append(chave, conta[chave]) 
      }

      await axios.post('https://habibs.alphacode.com.br/cadastro1/bibsfihagratis/', formteste)
      //await client.sendText(msg.from, `Email: ${email}`)
      await client.sendText(msg.from, `CPF: ${cpf}`);
      break;
    }

    case "cardapiohabibs":{
      await client.sendImage(msg.from, 'https://i.imgur.com/RA2p0Ln.png', msg.id, 'Cardapiozinho grátis');
      break;
    }

    case "creditos":{
      await client.sendText(msg.from, 'Bot feito por Allyson Gustavo', msg.id);
      break;
    }

    case "comandos": {
      await client.sendText(
          msg.from,
          `🔧Os comandos são:
!comandos - Mostra a lista de comandos
!draco - Mostra informações da moeda Draco(Mir4)
!cardapiohabibs - Mostra os itens habibs com retirada grátis
!habibs - Cria uma conta habibs e retorna o cpf(comida grátis)
!creditos - Exibe os creditos`, msg.id
      )
      break;
    }

    default: {
      return await client.reply(msg.from, "Este comando não existe! \nDigite !comandos para ver os comandos", msg.id);
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