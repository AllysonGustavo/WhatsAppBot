import wa from "@open-wa/wa-automate";
import axios from "axios";
import puppeteer from "puppeteer";

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
  chromiumArgs: 'args'['--no-sandbox','--disable-setuid-sandbox'] // work on heroku
}).then((client) => start(client));

const prefix = "!"; // bot prefix

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

    case "habibs": {
      await client.sendText(msg.from, "Gerando conta..._(leva em torno de 15s)_");
      const browser = await puppeteer.launch({
        headless: false,
      });
      const page = await browser.newPage();
      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);
      // Now let's navigate
      // Generating information
      await page.goto('https://geradornv.com.br/gerador-pessoas/');
      // Account name
      await page.waitForXPath("//*[@id='nv-field-name']/text()");
      let [nome] = await page.$x("//*[@id='nv-field-name']/text()");
      let texto = await nome.getProperty('textContent');
      const name = await texto.jsonValue();
      // Senha
      const senha = 'zelele123'
      // CPF
      await page.waitForXPath("//*[@id='nv-field-cpf']/text()");
      let [nome2] = await page.$x("//*[@id='nv-field-cpf']/text()");
      let texto2 = await nome2.getProperty('textContent');
      const cpf = await texto2.jsonValue();
      // Email
      await page.waitForXPath("//*[@id='nv-field-email']/text()");
      let [nome3] = await page.$x("//*[@id='nv-field-email']/text()");
      let texto3 = await nome3.getProperty('textContent');
      const email = await texto3.jsonValue();
      // Nascimento
      await page.waitForXPath("//*[@id='nv-field-birthday']/text()");
      let [nome4] = await page.$x("//*[@id='nv-field-birthday']/text()");
      let texto4 = await nome4.getProperty('textContent');
      const nascimento = await texto4.jsonValue();
      // Celular
      await page.waitForXPath("//*[@id='nv-field-cellphone']/text()");
      let [nome5] = await page.$x("//*[@id='nv-field-cellphone']/text()");
      let texto5 = await nome5.getProperty('textContent');
      const celular = await texto5.jsonValue();
      
      // Creating account
      await page.goto('https://www.habibers.com.br/cadastro1/bibsfihagratis'); // Go to the target web
      await page.type('#nome', name);
      await page.type('#senha', senha);
      await page.type('#cpf', cpf);
      await page.type('#email', email);
      await page.type('#data_nascimento', nascimento);
      await page.type('#celular', celular);

      // Mark the circle
      await Promise.all([
        await page.click('#desktop > div.div-bg-azul > div > form > div.box-regulamento > label:nth-child(2) > span')
      ]);
      // Click in Continue(pt: continuar)
      await page.keyboard.press('Enter');

      await page.waitForXPath('//*[@id="modal-sucesso"]/div/div/div[1]/h5')
      // Send the information to the user
      await client.sendText(msg.from, "Email:" + " " + email);
      await client.sendText(msg.from, "Senha:" + " "+ senha);
      await client.sendText(msg.from, "Cpf:" + " " + cpf);
      // Close the browser
      await browser.close();
      break;
    }

    case "comandos": {
      await client.sendText(msg.from, '🔧Os comandos são:');
      await client.sendText(msg.from, '!comandos - Mostra a lista de comandos');
      await client.sendText(msg.from, '!draco - Mostra informações da moeda Draco(Mir4)')
      await client.sendText(msg.from, '!habibs - cria uma conta habibs e retorna o email,senha e cpf(comida free)')
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