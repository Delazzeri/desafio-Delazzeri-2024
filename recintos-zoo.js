class Animal {
    constructor(nome, tamanho, biomas, carnivoro) {
        this.nome = nome;
        this.tamanho = tamanho;
        this.biomas = biomas;
        this.carnivoro = carnivoro;
    }

    podeHabitarBioma(bioma) {
        return this.biomas.includes(bioma);
    }
}

class Recinto {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes = {}) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes; // Ex: { macaco: 3 }
    }

    espacoOcupado(animais) {
        return Object.keys(this.animaisExistentes).reduce((total, nomeAnimal) => {
            return total + (animais[nomeAnimal].tamanho * this.animaisExistentes[nomeAnimal]);
        }, 0);
    }

    temCarnivoro(animais) {
        return Object.keys(this.animaisExistentes).some(nomeAnimal => animais[nomeAnimal].carnivoro);
    }

    adicionaEspacoExtraSeNecessario(tipoAnimal) {
        return Object.keys(this.animaisExistentes).length > 0 && !this.animaisExistentes.hasOwnProperty(tipoAnimal) ? 1 : 0;
    }
}

class Zoologico {
    constructor() {
        this.animais = this.inicializaAnimais();
        this.recintos = this.inicializaRecintos();
    }

    inicializaAnimais() {
        return {
            leao: new Animal("leao", 3, ["savana"], true),
            leopardo: new Animal("leopardo", 2, ["savana"], true),
            crocodilo: new Animal("crocodilo", 3, ["rio"], true),
            macaco: new Animal("macaco", 1, ["savana", "floresta"], false),
            gazela: new Animal("gazela", 2, ["savana"], false),
            hipopotamo: new Animal("hipopotamo", 4, ["savana", "rio"], false)
        };
    }

    inicializaRecintos() {
        return [
            new Recinto(1, "savana", 10, { macaco: 3 }),
            new Recinto(2, "floresta", 5),
            new Recinto(3, "savana e rio", 7, { gazela: 1 }),
            new Recinto(4, "rio", 8),
            new Recinto(5, "savana", 9, { leao: 1 })
        ];
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais.hasOwnProperty(tipoAnimal)) {
            return "Animal inválido";
        }

        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return "Quantidade inválida";
        }

        const animal = this.animais[tipoAnimal];
        const tamanhoNecessario = animal.tamanho * quantidade;
        const recintosViaveis = [];

        this.recintos.forEach(recinto => {
            if (!animal.podeHabitarBioma(recinto.bioma)) {
                return;
            }

            let espacoOcupado = recinto.espacoOcupado(this.animais);
            espacoOcupado += recinto.adicionaEspacoExtraSeNecessario(tipoAnimal);

            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

            if (espacoLivre < tamanhoNecessario) {
                return;
            }

            if (animal.carnivoro && recinto.temCarnivoro(this.animais) && !recinto.animaisExistentes.hasOwnProperty(tipoAnimal)) {
                return;
            }

            if (tipoAnimal === "hipopotamo" && recinto.bioma !== "savana e rio") {
                return;
            }

            if (tipoAnimal === "macaco" && Object.keys(recinto.animaisExistentes).length === 0) {
                return;
            }

            recintosViaveis.push(`Recinto nro ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
        });

        if (recintosViaveis.length === 0) {
            return "Não há recinto viável";
        }

        return recintosViaveis;
    }
}

const zoologico = new Zoologico();
console.log(zoologico.analisaRecintos("leao", 1));
console.log(zoologico.analisaRecintos("hipopotamo", 2));
console.log(zoologico.analisaRecintos("macaco", 1));
