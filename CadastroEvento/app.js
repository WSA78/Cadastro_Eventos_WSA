const readline = require('readline');

//aquisicao da data
function validarDataEvento(dataEvento) {
    const regexData = /^\d{2}\/\d{2}\/\d{4}$/; 

    if (!regexData.test(dataEvento)) {
        return false;
    }

    const [dia, mes, ano] = dataEvento.split('/').map(Number);
    const eventoData = new Date(ano, mes - 1, dia); 

    if (isNaN(eventoData.getTime())) {
        return false;
    }

    const dataAtual = new Date();
    const hoje = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());

    return eventoData >= hoje;
}

// Cadastra somente se usuario maior de idade
function validarIdade(idade) {
    return idade >= 18;
}

class Evento {
    constructor(nome, data) {
        this.nome = nome;
        this.data = data;
        this.participantes = [];
        this.palestrantes = [];
    }

    adicionarPessoa(nome, idade, tipo) {
        if (this.participantes.length >= 100) {
            console.log("Cadastro não permitido. Limite de participantes excedido.");
            return;
        }

        if (!validarIdade(idade)) {
            console.log("Cadastro não permitido para menores de 18 anos.");
            return;
        }

        if (tipo === "participante") {
            this.participantes.push({ nome, idade });
        } else if (tipo === "palestrante") {
            this.palestrantes.push({ nome, idade });
        }

        console.log(`${nome} foi cadastrado como ${tipo}.`);
    }

    listarPessoas() {
        console.log(`\n--- Evento: ${this.nome} ---`);

        console.log("\n--- Lista de Participantes ---");
        this.participantes.forEach((p, index) => {
            console.log(`${index + 1}. Nome: ${p.nome}, Idade: ${p.idade}`);
        });

        console.log("\n--- Lista de Palestrantes ---");
        this.palestrantes.forEach((p, index) => {
            console.log(`${index + 1}. Nome: ${p.nome}, Idade: ${p.idade}`);
        });
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function aguardarEnter(callback) {
    rl.question("\nPressione ENTER para sair...", () => {
        callback();
    });
}

function cadastroEvento() {
    rl.question('Digite o nome do evento: ', (nomeEvento) => {
        solicitarDataEvento(nomeEvento);
    });
}

function solicitarDataEvento(nomeEvento) {
    rl.question('Digite a data do evento (formato DD/MM/AAAA): ', (dataEvento) => {
        if (!validarDataEvento(dataEvento)) {
            console.log("Data inválida. Por favor, insira uma data no formato DD/MM/AAAA e que seja hoje ou posterior.");
            solicitarDataEvento(nomeEvento); 
        } else {
            const evento = new Evento(nomeEvento, dataEvento);
            cadastrarPessoa(evento); 
        }
    });
}
function cadastrarPessoa(evento) {
    rl.question('Digite o nome do participante/palestrante: ', (nome) => {
        rl.question('Digite a idade: ', (idade) => {
            idade = parseInt(idade);

            if (isNaN(idade) || idade <= 0) {
                console.log("Idade inválida. Digite um número positivo.");
                cadastrarPessoa(evento); 
                return;
            }

            rl.question('Digite o tipo de cadastro (1 para Participante, 2 para Palestrante): ', (tipo) => {
                tipo = parseInt(tipo);

                let tipoCadastro;
                if (tipo === 1) {
                    tipoCadastro = "participante";
                } else if (tipo === 2) {
                    tipoCadastro = "palestrante";
                } else {
                    console.log("Tipo de cadastro inválido. Digite 1 para Participante ou 2 para Palestrante.");
                    cadastrarPessoa(evento); 
                    return;
                }

                if (evento.participantes.length < 100) {
                    evento.adicionarPessoa(nome, idade, tipoCadastro);
                } else {
                    console.log("Cadastro não permitido. Limite de participantes excedido.");
                    aguardarEnter(() => rl.close());
                    return;
                }

                rl.question('Deseja cadastrar outra pessoa? (sim/s/não/n): ', (resposta) => {
                    resposta = resposta.toLowerCase();

                    if (["sim", "s"].includes(resposta)) {
                        cadastrarPessoa(evento);  
                    } else if (["não", "n"].includes(resposta)) {
                        evento.listarPessoas(); 
                        aguardarEnter(() => rl.close()); 
                    } else {
                        console.log("Resposta inválida. Digite 'sim', 's', 'não' ou 'n'.");
                        cadastrarPessoa(evento); 
                    }
                });
            });
        });
    });
}

cadastroEvento();