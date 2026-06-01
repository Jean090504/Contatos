'use strict'

import { getContatos, postContato, putContato, deleteContato } from "./api.js"

const btnNovoContato = document.getElementById('btnNovoContato');
const modalContato = document.getElementById('modalContato');
const btnCancelar = document.getElementById('btnCancelar');
const formContato = document.getElementById('formContato');
const containerContatos = document.getElementById('containerContatos');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');

const criarCardContato = (contato) => {
    const cartao = document.createElement('div');
    cartao.classList.add('cartao-contato');
    cartao.dataset.id = contato.id;

    // Criando o container de conteúdo
    const conteudoCard = document.createElement('div');
    conteudoCard.classList.add('conteudo-card');

    // Construção segura dos elementos (sem innerHTML)
    const foto = document.createElement('img')
    foto.classList.add('foto-contato')
    foto.src = contato.foto ? contato.foto : './img/avatar.jpg';
    foto.alt = `Foto de ${contato.nome}`;

    const nome = document.createElement('h3');
    nome.textContent = contato.nome;

    const celular = document.createElement('p');
    celular.textContent = `Celular: ${contato.celular || ''}`;

    const email = document.createElement('p');
    email.textContent = `E-mail: ${contato.email || ''}`;

    const endereco = document.createElement('p');
    endereco.textContent = `Endereço: ${contato.endereco || ''}`;

    const cidade = document.createElement('p');
    cidade.textContent = `Cidade: ${contato.cidade || ''}`;

    // Anexando todos os elementos filhos de uma vez (limpo e seguro)
    conteudoCard.append(foto, nome, celular, email, endereco, cidade);

    // Criando o container de ações
    const acoesCard = document.createElement('div');
    acoesCard.classList.add('acoes-card');

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.textContent = 'E';
    btnEditar.title = 'Editar';

    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.textContent = 'D';
    btnExcluir.title = 'Excluir';

    acoesCard.append(btnEditar, btnExcluir);
    cartao.append(conteudoCard, acoesCard);

    // Eventos de clique 
    btnExcluir.addEventListener('click', async () => {
        const confirmar = confirm(`Tem certeza que deseja excluir "${contato.nome}"?`);
        if (confirmar) {
            try {
                await deleteContato(contato.id);
                alert("Excluído com sucesso!");
                carregarContatos();
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Não foi possível excluir.");
            }
        }
    });

    btnEditar.addEventListener('click', () => {
        modalContato.classList.remove('container-escondido');
        modalContato.querySelector('h2').textContent = "Editar Registro";

        // Atribuição segura de valores nos inputs
        document.getElementById('fotoContato').value = contato.foto || '';
        document.getElementById('nomeContato').value = contato.nome || '';
        document.getElementById('telContato').value = contato.celular || '';
        document.getElementById('emailContato').value = contato.email || '';
        document.getElementById('enderecoContato').value = contato.endereco || '';
        document.getElementById('cidadeContato').value = contato.cidade || '';

        formContato.dataset.idEdicao = contato.id;
    });

    containerContatos.appendChild(cartao);
}

const carregarContatos = async () => {
    // Limpeza segura do container
    while (containerContatos.firstChild) {
        containerContatos.removeChild(containerContatos.firstChild);
    }

    try {
        const contatos = await getContatos();
        if (Array.isArray(contatos)) {
            contatos.forEach(criarCardContato);
        }
    } catch (error) {
        console.error("Erro ao listar:", error);
    }
}

btnNovoContato.addEventListener('click', () => {
    modalContato.classList.remove('container-escondido');
    modalContato.querySelector('h2').textContent = "Adicionar Novo Registro";
    delete formContato.dataset.idEdicao;
});

btnCancelar.addEventListener('click', () => {
    modalContato.classList.add('container-escondido');
    formContato.reset();
});

formContato.addEventListener('submit', async (event) => {
    event.preventDefault();

    const idEdicao = formContato.dataset.idEdicao;
    const dadosContato = {
        nome: document.getElementById('nomeContato').value,
        foto: document.getElementById('fotoContato').value,
        celular: document.getElementById('telContato').value,
        email: document.getElementById('emailContato').value,
        endereco: document.getElementById('enderecoContato').value,
        cidade: document.getElementById('cidadeContato').value
    };

    try {
        if (idEdicao) {
            await putContato(idEdicao, dadosContato);
            alert("Atualizado com sucesso!");
        } else {
            await postContato(dadosContato);
            alert("Adicionado com sucesso!");
        }

        modalContato.classList.add('container-escondido');
        formContato.reset();
        carregarContatos();

    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        alert("Ocorreu um erro ao salvar.");
    }
});

const filtrarContatos = () => {
    const termoBusca = inputBuscar.value.toLowerCase();
    const cartoes = document.querySelectorAll('.cartao-contato');

    cartoes.forEach(cartao => {
        // textContent garante que a busca não interaja com tags HTML ocultas
        const conteudoDoCard = cartao.textContent.toLowerCase();
        if (conteudoDoCard.includes(termoBusca)) {
            cartao.style.display = "flex"; 
        } else {
            cartao.style.display = "none";
        }
    });
}

btnBuscar.addEventListener('click', filtrarContatos);
inputBuscar.addEventListener('input', filtrarContatos); 

carregarContatos();

document.querySelector('.logo').addEventListener('click', () => {
    window.location.reload();
});