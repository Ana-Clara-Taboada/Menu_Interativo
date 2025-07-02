import inquirer from "inquirer";
import fs from "fs";

interface Perfil{
    name: string;
    music: "Do I Wanna Know" | "505" | "I Wanna be Yours" | "Outra";
    ATmelhor: boolean;
}

function NSperfil(newP: Perfil): void {
  console.log("Estamos verificando os dados, um minuto ...");

  const dbFile: string = `src/database/database.json`;

  let perfisBD: Perfil[] = [];

  try {
    const conteudoDoArquivo = fs.readFileSync(dbFile, "utf-8");
    perfisBD = JSON.parse(conteudoDoArquivo);
  } catch (erro: any) {
    if (erro.code !== "ENOENT") {
      throw erro;
    }
  }

  const perfilExiste = perfisBD.find(
    (perfil) => perfil.name.toLowerCase() === newP.name.toLowerCase()
  );

  if (perfilExiste) {
    throw new Error(`O nome digitado: '${newP.name}',já está cadastrado em outra conta.`);
  }

  perfisBD.push(newP);
  const novoConteudo = JSON.stringify(perfisBD, null, 2);
  fs.writeFileSync(dbFile, novoConteudo, "utf-8");

  console.log(" O Perfil foi inserido com sucesso no nosso sistema!!!");
}




async function run(): Promise<void> {
  try {
    console.log("Seja Bem vindo ao nosso perfil musical!");
    console.log("Nossas perguntas de hoje são sobre a banda Artic Monkeys:");
    const perguntas = [
      {
        type: "input",
        name: "name",
        message: "Qual é o seu nome?",
        validate: (input: string): boolean | string => {
          if (input.trim() === "") {
            return "Por favor, digite um nome.";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "Music",
        message: "Qual a sua música favorita do Artic Monkeys: ",
        choices: ["Do I Wanna Know", "505", "I Wanna be Yours", "Outra"],
      },
      {
        type: "confirm",
        name: "ATmelhor",
        message: "Você acha a banda Artic monkeys uma das melhores da atualidade?",
        default: true,
      },
    ] as const;

    const answers = await inquirer.prompt<Perfil>(perguntas as any);

    console.log("\n--- Perfil Salvo !!! ---");
    console.log(answers);
    console.log("---------------------\n");

     NSperfil(answers);
  } catch (erro: unknown) {
    if (erro instanceof Error) {
      console.error(`Estamos tendo um erro: ${erro.message}`);
    } else {
      console.error("Ocorreu um erro desconhecido:", erro);
    }
  }
}

run();

