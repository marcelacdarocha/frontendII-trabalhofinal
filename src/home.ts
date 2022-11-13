let modalCriarRecado = new bootstrap.Modal('#modalCriarRecado');
let modaEditarRecado = new bootstrap.Modal('#modalEditarRecado');
let modalApagar = new bootstrap.Modal('#modalApagarRecado');
let codigo = document.getElementById('criarCodigo') as HTMLInputElement;
let descricao = document.getElementById('criarDescricao') as HTMLInputElement;
let detalhamento = document.getElementById('criarDetalhamento') as HTMLInputElement;
let formCriarRecado = document.getElementById('formCriarRecado') as HTMLFormElement;

let usuarioLogado = JSON.parse(sessionStorage.getItem("UsuarioLogado") || 'null');

let nomeUsuario = document.getElementById('nomeUsuarioHeader') as HTMLParagraphElement

document.addEventListener('DOMContentLoaded' , () =>{
    
    if(!usuarioLogado){
        alert("Você precisa estar logado!");
        window.location.href = '../index.html'
        return
    }
    
    // aqui só executa se tiver um usuario logado
    carregarDados();
    mudarNomeUsuario();
});

function buscarListaUsuariosNoStorage(): Usuario[] {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function mudarNomeUsuario() {
    let listaUsuarios: Usuario[] = buscarListaUsuariosNoStorage();

    let indiceUsuario =  listaUsuarios.findIndex((usuario) =>{
        return usuario.email === usuarioLogado.email;
    });

    // console.log(listaUsuarios[indiceUsuario]);
    
    let nomeUsuarioLogado = listaUsuarios[indiceUsuario].nome

    nomeUsuario.innerHTML = `Olá ${nomeUsuarioLogado}`

}

interface Recado {
    codigo: string,
    descricao: string,
    detalhamento: string,
}

formCriarRecado.addEventListener('submit' , (e)=>{
    e.preventDefault()

    if(descricao.value === "" || detalhamento.value === '' || codigo.value === '') {
        descricao.setAttribute('style' , 'background-color: #ff9999'),
        detalhamento.setAttribute('style' , 'background-color: #ff9999'),
        codigo.setAttribute('style' , 'background-color: #ff9999'),
        codigo.focus()
        return
    };

    let listaRecados: Recado[] = pegarRecadosUsuarioLogado();

    let existeCodigo: boolean = listaRecados.some((recado) => recado.codigo === codigo.value);

    if (existeCodigo) {
        alert('Já existe um recado com o código informado!')
        return
    }

    let novoRecado: Recado = {
        codigo: codigo.value,
        descricao: descricao.value,
        detalhamento: detalhamento.value
    }

    listaRecados.push(novoRecado);

    console.log(novoRecado)

    modalCriarRecado.hide();
    mostrarNovoRecado(novoRecado);
    salvarNoStorage(listaRecados);


    alert('Recado criado com sucesso!')
    
});

function mostrarNovoRecado(novoRecado: Recado){

    let espacoListaRecados = document.getElementById('espacoRecados') as HTMLDivElement

    let novoAcordion: HTMLDivElement = document.createElement('div');
    novoAcordion.setAttribute('class' , 'accordion-item');
    novoAcordion.setAttribute('id' , novoRecado.codigo);
    
    let tituloAcordion = document.createElement('h2');
    tituloAcordion.setAttribute('class', 'accordion-header');
    tituloAcordion.setAttribute('id', "heading" + `${novoRecado.codigo}`); //resultado = 'heading1234'
    
    let btnAbrirAcordion = document.createElement('button');
    btnAbrirAcordion.setAttribute('class' , 'accordion-button collapsed');
    btnAbrirAcordion.setAttribute('type' , 'button');
    btnAbrirAcordion.setAttribute('data-bs-toggle' , 'collapse');
    btnAbrirAcordion.setAttribute('data-bs-target' , "#collapse" + `${novoRecado.codigo}`);
    btnAbrirAcordion.setAttribute('aria-expanded' , 'false');
    btnAbrirAcordion.setAttribute('aria-controls' , "#collapse" + `${novoRecado.codigo}`);
    btnAbrirAcordion.innerHTML = `<strong> ${novoRecado.descricao} </strong>`;

    let divDoAcordion = document.createElement('div');
    divDoAcordion.setAttribute('id' , "collapse" + `${novoRecado.codigo}`);
    divDoAcordion.setAttribute('class', 'accordion-collapse collapse');
    divDoAcordion.setAttribute('aria-labelledby', "heading" +`${novoRecado.codigo}`);

    let divAcordionBoddy = document.createElement('div');
    divAcordionBoddy.setAttribute('class' , 'accordion-body pb-2')

    let textoDoAcordion = document.createElement('p');
    textoDoAcordion.innerHTML = `${novoRecado.detalhamento}`;

    let divDosBotoes = document.createElement('div');
    divDosBotoes.setAttribute('class', "d-flex justify-content-center")


    let botaoEditar = document.createElement('button');
    botaoEditar.setAttribute('class' , 'mx-1 btn btn-info');
    botaoEditar.setAttribute('type' , 'button');
    botaoEditar.setAttribute('data-bs-toggle' , 'modal');
    botaoEditar.setAttribute('data-bs-target' , '#modalEditarRecado');
    botaoEditar.innerHTML = `<i class="bi bi-pencil-square"></i>`
    botaoEditar.addEventListener('click' , (e: any)=>{
       e.preventDefault();
       
     editarRecados(novoRecado)
    });

    let botaoApagar = document.createElement('button');
    botaoApagar.setAttribute('class' , 'mx-1 btn btn-danger');
    botaoApagar.setAttribute('type' , 'button');
    botaoApagar.setAttribute('data-bs-toggle' , 'modal');
    botaoApagar.setAttribute('data-bs-target' , '#modalApagarRecado');
    botaoApagar.innerHTML = `<i class="bi bi-trash-fill"></i>`
    botaoApagar.addEventListener('click' , (e: any) =>{
        e.preventDefault();

     apagarRecado(novoRecado)
    })

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

function editarRecados(novoRecado: Recado) {

    let formEditar = document.getElementById('formEditarRecado') as HTMLFormElement;
    let codigoEdit = document.getElementById('criarCodigoEditar') as HTMLInputElement;
    let descricaoEdit = document.getElementById('criarDescricaoEditar') as HTMLInputElement;
    let detalhamentoEdit = document.getElementById('criarDetalhamentoEditar') as HTMLTextAreaElement;

    codigoEdit.value = novoRecado.codigo;
    descricaoEdit.value = novoRecado.descricao;
    detalhamentoEdit.value = novoRecado.detalhamento;

    let recados = pegarRecadosUsuarioLogado()
    let recadoEdit = recados.findIndex((recado) => recado.codigo === novoRecado.codigo)

    formEditar.addEventListener('submit' , ()=>{
        

        recados[recadoEdit].descricao = descricaoEdit.value;
        recados[recadoEdit].detalhamento = detalhamentoEdit.value;
        alert('Recado alterado com sucesso!')
        salvarNoStorage(recados);
        modaEditarRecado.hide()
    })

}



function apagarRecado(novoRecado: Recado) {

    let recados = pegarRecadosUsuarioLogado()
    let recadoApagar = recados.findIndex((recado) => recado.codigo === novoRecado.codigo)
    console.log(recados)

    let btnApagar = document.getElementById('btnApagar') as HTMLButtonElement;

    btnApagar.addEventListener('click' , ()=>{
        recados.splice(recadoApagar , 1);
        alert("Recado apagado com sucesso!");
        salvarNoStorage(recados);
        modalApagar.hide;

        window.location.href = "./home.html"
    })
}

function salvarNoStorage(recadosUsuario: Recado[]) {
    let listaUsuarios = buscarListaUsuariosNoStorage();
    
    let indiceUsuarioLogado = pegarIndiceUsuarioLogado();

    listaUsuarios[indiceUsuarioLogado].recados = recadosUsuario;

    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

}

function carregarDados(){
    let recados = pegarRecadosUsuarioLogado();

    for (let recado of recados) {
        mostrarNovoRecado(recado);
    }
}

function pegarIndiceUsuarioLogado(): number{
    let listaUsuarios = buscarListaUsuariosNoStorage();
    
    let indiceUsuarioLogado = listaUsuarios.findIndex((usuario) => {
        return  usuario.email === usuarioLogado.email
    });

    return indiceUsuarioLogado;
}

function pegarRecadosUsuarioLogado(): Recado[]{
    let listaUsuarios = buscarListaUsuariosNoStorage();
    
    let indiceUsuarioLogado = pegarIndiceUsuarioLogado();

    return listaUsuarios[indiceUsuarioLogado].recados
}

        // SAIR DO SISTEMA 
let btnLogOut = document.getElementById('btnLogOut') as HTMLButtonElement;
console.log(btnLogOut)
btnLogOut.addEventListener('mouseenter' , ()=>{
    btnLogOut.innerHTML = `<i class="bi bi-door-open-fill"></i>`
})

btnLogOut.addEventListener('mouseout' , ()=>{
    btnLogOut.innerHTML = `<i class="bi bi-door-closed-fill"></i>`

})


btnLogOut.addEventListener('click', ()=>{
    sessionStorage.setItem('logIn' , 'false');

    let logIn = sessionStorage.getItem('logIn');
    if (logIn === 'false')
        window.location.href = "../index.html"
})

