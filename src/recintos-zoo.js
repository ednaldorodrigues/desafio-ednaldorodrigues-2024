const recintos = [
    {
        numero: 1,
        bioma: ["savana"],
        tamanhoTotal: 10,
        animaisExistentes: [
            {
                especie: "MACACO",
                bioma: ["savana", "floresta"],
                tamanho: 1,
                carnivoro: false
            },

            {
                especie: "MACACO",
                bioma: ["savana", "floresta"],
                tamanho: 1,
                carnivoro: false

            },

            {
                especie: "MACACO",
                bioma: ["savana", "floresta"],
                tamanho: 1,
                carnivoro: false

            }
        ],
    },

    {
        numero: 2,
        bioma: ["floresta"],
        tamanhoTotal: 5,
        animaisExistentes: [],
    },

    {
        numero: 3,
        bioma: ["savana","rio"],
        tamanhoTotal: 7,
        animaisExistentes: [
            {
                especie: "GAZELA",
                bioma: ["savana"],
                tamanho: 2,  
                carnivoro: false

            }
        ],
    },

    {
        numero: 4,
        bioma: ["rio"],
        tamanhoTotal: 8,
        animaisExistentes: [],
    },

    {
        numero: 5,
        bioma: ["savana"],
        tamanhoTotal: 9,
        animaisExistentes: [
            {
                especie: "LEAO",
                bioma: ["savana"],
                tamanho: 3,
                carnivoro: true
            }
        ],
    }
]

const animais = [
    {
        especie: "LEAO",
        bioma: ["savana"],
        tamanho: 3,
        carnivoro: true
    },

    {
        especie: "LEOPARDO",
        bioma: ["savana"],
        tamanho: 2,
        carnivoro: true
    },

    {
        especie: "CROCODILO",
        bioma: ["rio"],
        tamanho: 3,
        carnivoro: true
    },

    {
        especie: "MACACO",
        bioma: ["savana", "floresta"],
        tamanho: 1,
        carnivoro: false
    },
    
    {
        especie: "HIPOPOTAMO",
        bioma: ["savana", "rio"],
        tamanho: 4,  
        carnivoro: false
    },

    {
        especie: "GAZELA",
        bioma: ["savana"],
        tamanho: 2, 
        carnivoro: false
    }
]


class RecintosZoo {

    verificarSeAnimalExiste(especie) {
        const animal = animais.find(animal => animal.especie === especie)
        if(animal) {
            return animal;
        }

        return null;
    }

    verificarCompatibilidade(animalExistente, recintoDisponivel, quantidade) {

    
        if(animalExistente.carnivoro) {
            
            const recintoParaCarnivoro = recintoDisponivel.filter((recinto) => {
                const biomaCompativel = recinto.animaisExistentes.every((animal) => animal.carnivoro && animal.especie === animalExistente.especie)
                if(biomaCompativel) {
                    return recinto;
                }
            })
            return recintoParaCarnivoro;
        }

        const recintoCompativel = recintoDisponivel.filter((recinto) => {
            const biomaCompativel = recinto.animaisExistentes.every((animal) => !animal.carnivoro)
            if(biomaCompativel) {
                return recinto;
            }
        })
        
        if(animalExistente.especie === "MACACO"  && quantidade === 1) {
            return recintoCompativel.filter((recinto) => recinto.animaisExistentes.length !== 0)
        }

        if(animalExistente.especie === "HIPOPOTAMO") {
           return recintoCompativel.filter((recinto) => recinto.animaisExistentes.length === 0 || (recinto.bioma.includes("savana") && recinto.bioma.includes("rio")))
        }

        return recintoCompativel;
    }

    calculaTamanhoDisponivel(animalExistente, quantidade) {

        const recintosDisponiveis = recintos.filter((recinto) => {
            const recintoTemBioma = recinto.bioma.some((bioma) => animalExistente.bioma.includes(bioma))
            if(recintoTemBioma) {
                return recinto;
            }
        })

        const tamanhoSerOcupado = animalExistente.tamanho * quantidade

        const biomaComEspacoSuficiente = []
         recintosDisponiveis.forEach((recinto) => {
            const temMesmaEspecie = recinto.animaisExistentes.every((animal) => animal.especie === animalExistente.especie)
            const tamanhoExtra = temMesmaEspecie ? 0 : 1
            const tamanhoDisponivel = recinto.animaisExistentes.reduce((acc, animal) => {
                return acc - animal.tamanho
            }, recinto.tamanhoTotal)
            if(tamanhoDisponivel >= (tamanhoSerOcupado + tamanhoExtra)) {
                console.log(tamanhoDisponivel - (tamanhoSerOcupado + tamanhoExtra))
                biomaComEspacoSuficiente.push({
                    ...recinto,
                    espacoLivre: tamanhoDisponivel - (tamanhoSerOcupado + tamanhoExtra)
                }) 
            }
            
        })
        return biomaComEspacoSuficiente;
    }

    analisaRecintos(animal, quantidade) {

        if(quantidade <= 0) {
            return {
                erro: "Quantidade inválida"
            }
        }

        const animalExiste = this.verificarSeAnimalExiste(animal)
        if(!animalExiste) {
            return {
                erro: "Animal inválido",
                recintosViaveis: false
            }
        }

        const recintosAdequados = this.calculaTamanhoDisponivel(animalExiste, quantidade)
        if(recintosAdequados.length === 0) {
            return {
                erro: "Não há recinto viável",
                recintosViaveis: false
            }
        }
    
        
        const recintosViaveis = this.verificarCompatibilidade(animalExiste, recintosAdequados, quantidade)
        if(recintosViaveis.length === 0) {
            return {
                erro: "Não há recinto viável",
                recintosViaveis: false
            }
    
        }

        const resultadoFormatado = recintosViaveis.map((recinto) => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`)

        return {
            erro: false,
            recintosViaveis: resultadoFormatado
        }
    }


}
console.log(new RecintosZoo().analisaRecintos('GAZELA', 2));

export { RecintosZoo as RecintosZoo };
