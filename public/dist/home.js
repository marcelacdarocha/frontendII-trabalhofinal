"use strict";
let modalCriarRecado = new bootstrap.Modal('#modalCriarRecado');
let modaEditarRecado = new bootstrap.Modal('#modalEditarRecado');
let modalApagar = new bootstrap.Modal('#modalApagarRecado');
let codigo = document.getElementById('criarCodigo');
let descricao = document.getElementById('criarDescricao');
let detalhamento = document.getElementById('criarDetalhamento');
let formCriarRecado = document.getElementById('formCriarRecado');
let usuarioLogado = JSON.parse(sessionStorage.getItem("UsuarioLogado") || 'null');
let nomeUsuario = document.getElementById('nomeUsuarioHeader');
document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioLogado) {
        alert("Você precisa estar logado!");
        window.location.href = '../index.html';
        return;
    }
    // aqui só executa se tiver um usuario logado
    carregarDados();
    mudarNomeUsuario();
});
function buscarListaUsuariosNoStorage() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}
function mudarNomeUsuario() {
    let listaUsuarios = buscarListaUsuariosNoStorage();
    let indiceUsuario = listaUsuarios.findIndex((usuario) => {
        return usuario.email === usuarioLogado.email;
    });
    // console.log(listaUsuarios[indiceUsuario]);
    let nomeUsuarioLogado = listaUsuarios[indiceUsuario].nome;
    nomeUsuario.innerHTML = `Olá ${nomeUsuarioLogado}`;
}
formCriarRecado.addEventListener('submit', (e) => {
    e.preventDefault();
    if (descricao.value === "" || detalhamento.value === '' || codigo.value === '') {
        descricao.setAttribute('style', 'background-color: #ff9999'),
            detalhamento.setAttribute('style', 'background-color: #ff9999'),
            codigo.setAttribute('style', 'background-color: #ff9999'),
            codigo.focus();
        return;
    }
    ;
    let listaRecados = pegarRecadosUsuarioLogado();
    let existeCodigo = listaRecados.some((recado) => recado.codigo === codigo.value);
    if (existeCodigo) {
        alert('Já existe um recado com o código informado!');
        return;
    }
    let novoRecado = {
        codigo: codigo.value,
        descricao: descricao.value,
        detalhamento: detalhamento.value
    };
    listaRecados.push(novoRecado);
    console.log(novoRecado);
    modalCriarRecado.hide();
    mostrarNovoRecado(novoRecado);
    salvarNoStorage(listaRecados);
    alert('Recado criado com sucesso!');
});
function mostrarNovoRecado(novoRecado) {
    let espacoListaRecados = document.getElementById('espacoRecados');
    let novoAcordion = document.createElement('div');
    novoAcordion.setAttribute('class', 'accordion-item');
    novoAcordion.setAttribute('id', novoRecado.codigo);
    let tituloAcordion = document.createElement('h2');
    tituloAcordion.setAttribute('class', 'accordion-header');
    tituloAcordion.setAttribute('id', "heading" + `${novoRecado.codigo}`); //resultado = 'heading1234'
    let btnAbrirAcordion = document.createElement('button');
    btnAbrirAcordion.setAttribute('class', 'accordion-button collapsed');
    btnAbrirAcordion.setAttribute('type', 'button');
    btnAbrirAcordion.setAttribute('data-bs-toggle', 'collapse');
    btnAbrirAcordion.setAttribute('data-bs-target', "#collapse" + `${novoRecado.codigo}`);
    btnAbrirAcordion.setAttribute('aria-expanded', 'false');
    btnAbrirAcordion.setAttribute('aria-controls', "#collapse" + `${novoRecado.codigo}`);
    btnAbrirAcordion.innerHTML = `<strong> ${novoRecado.descricao} </strong>`;
    let divDoAcordion = document.createElement('div');
    divDoAcordion.setAttribute('id', "collapse" + `${novoRecado.codigo}`);
    divDoAcordion.setAttribute('class', 'accordion-collapse collapse');
    divDoAcordion.setAttribute('aria-labelledby', "heading" + `${novoRecado.codigo}`);
    let divAcordionBoddy = document.createElement('div');
    divAcordionBoddy.setAttribute('class', 'accordion-body pb-2');
    let textoDoAcordion = document.createElement('p');
    textoDoAcordion.innerHTML = `${novoRecado.detalhamento}`;
    let divDosBotoes = document.createElement('div');
    divDosBotoes.setAttribute('class', "d-flex justify-content-center");
    let botaoEditar = document.createElement('button');
    botaoEditar.setAttribute('class', 'mx-1 btn btn-info');
    botaoEditar.setAttribute('type', 'button');
    botaoEditar.setAttribute('data-bs-toggle', 'modal');
    botaoEditar.setAttribute('data-bs-target', '#modalEditarRecado');
    botaoEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`;
    botaoEditar.addEventListener('click', (e) => {
        e.preventDefault();
        editarRecados(novoRecado);
    });
    let botaoApagar = document.createElement('button');
    botaoApagar.setAttribute('class', 'mx-1 btn btn-danger');
    botaoApagar.setAttribute('type', 'button');
    botaoApagar.setAttribute('data-bs-toggle', 'modal');
    botaoApagar.setAttribute('data-bs-target', '#modalApagarRecado');
    botaoApagar.innerHTML = `<i class="bi bi-trash-fill"></i>`;
    botaoApagar.addEventListener('click', (e) => {
        e.preventDefault();
        apagarRecado(novoRecado);
    });
    divDosBotoes.appendChild(botaoEditar);
    divDosBotoes.appendChild(botaoApagar);
    tituloAcordion.appendChild(btnAbrirAcordion);
    divAcordionBoddy.appendChild(textoDoAcordion);
    divAcordionBoddy.appendChild(divDosBotoes);
    divDoAcordion.appendChild(divAcordionBoddy);
    novoAcordion.appendChild(tituloAcordion);
    novoAcordion.appendChild(divDoAcordion);
    espacoListaRecados.appendChild(novoAcordion);
}
function editarRecados(novoRecado) {
    let formEditar = document.getElementById('formEditarRecado');
    let codigoEdit = document.getElementById('criarCodigoEditar');
    let descricaoEdit = document.getElementById('criarDescricaoEditar');
    let detalhamentoEdit = document.getElementById('criarDetalhamentoEditar');
    codigoEdit.value = novoRecado.codigo;
    descricaoEdit.value = novoRecado.descricao;
    detalhamentoEdit.value = novoRecado.detalhamento;
    let recados = pegarRecadosUsuarioLogado();
    let recadoEdit = recados.findIndex((recado) => recado.codigo === novoRecado.codigo);
    formEditar.addEventListener('submit', () => {
        recados[recadoEdit].descricao = descricaoEdit.value;
        recados[recadoEdit].detalhamento = detalhamentoEdit.value;
        alert('Recado alterado com sucesso!');
        salvarNoStorage(recados);
        modaEditarRecado.hide();
    });
}
function apagarRecado(novoRecado) {
    let recados = pegarRecadosUsuarioLogado();
    let recadoApagar = recados.findIndex((recado) => recado.codigo === novoRecado.codigo);
    console.log(recados);
    let btnApagar = document.getElementById('btnApagar');
    btnApagar.addEventListener('click', () => {
        recados.splice(recadoApagar, 1);
        alert("Recado apagado com sucesso!");
        salvarNoStorage(recados);
        modalApagar.hide;
        window.location.href = "./home.html";
    });
}
function salvarNoStorage(recadosUsuario) {
    let listaUsuarios = buscarListaUsuariosNoStorage();
    let indiceUsuarioLogado = pegarIndiceUsuarioLogado();
    listaUsuarios[indiceUsuarioLogado].recados = recadosUsuario;
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
}
function carregarDados() {
    let recados = pegarRecadosUsuarioLogado();
    for (let recado of recados) {
        mostrarNovoRecado(recado);
    }
}
function pegarIndiceUsuarioLogado() {
    let listaUsuarios = buscarListaUsuariosNoStorage();
    let indiceUsuarioLogado = listaUsuarios.findIndex((usuario) => {
        return usuario.email === usuarioLogado.email;
    });
    return indiceUsuarioLogado;
}
function pegarRecadosUsuarioLogado() {
    let listaUsuarios = buscarListaUsuariosNoStorage();
    let indiceUsuarioLogado = pegarIndiceUsuarioLogado();
    return listaUsuarios[indiceUsuarioLogado].recados;
}
// SAIR DO SISTEMA 
let btnLogOut = document.getElementById('btnLogOut');
console.log(btnLogOut);
btnLogOut.addEventListener('mouseenter', () => {
    btnLogOut.innerHTML = `<i class="bi bi-door-open-fill"></i>`;
});
btnLogOut.addEventListener('mouseout', () => {
    btnLogOut.innerHTML = `<i class="bi bi-door-closed-fill"></i>`;
});
btnLogOut.addEventListener('click', () => {
    sessionStorage.setItem('logIn', 'false');
    let logIn = sessionStorage.getItem('logIn');
    if (logIn === 'false')
        window.location.href = "../index.html";
});
