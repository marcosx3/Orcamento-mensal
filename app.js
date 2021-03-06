class Despesa { // construct for the object
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDespesa() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }




}
// this class is for conecting with db
class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }
    
	gravar(d) {
		let id = this.getNextId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

    getNextId() {
        let nextID = localStorage.getItem('id')
        return parseInt(nextID) + 1
    }

    recuperarDados() {
        let despesas = Array()
        let id = localStorage.getItem('id')
        // recuperar despesas  
        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i)) // convertendo de json para objeto literal
            // se e nulo, passa para a proxima iteracao
            if (despesa === null) {
                continue
            } 
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesaFiltrada = Array()
        despesaFiltrada = this.recuperarDados()
        //filtragem
        
        if (despesa.ano != '') {
            despesaFiltrada =  despesaFiltrada.filter(d => d.ano == despesa.ano)
            console.log('deu')
        }
        if (despesa.mes != '') {
            despesaFiltrada =  despesaFiltrada.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            despesaFiltrada =   despesaFiltrada.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            despesaFiltrada =   despesaFiltrada.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesaFiltrada =   despesaFiltrada.filter(d => d.descricao == despesa.descricao)
        }
        return despesaFiltrada
        
    }

    remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa() {

   

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value)


    if (despesa.validarDespesa()) {
        bd.gravar(despesa)
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {

        document.getElementById('modal_titulo').innerHTML = 'Erro na inclus??o do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na grava????o, verifique se todos os campos foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        //dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }
}

function carregarListaDespesa(despesas = Array(), filtro = false) {
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarDados()
    }
  
   
    //tabela
    var listaDespesa = document.getElementById('listaDespesa')
    listaDespesa.innerHTML = ''
    despesas.forEach(function (d) {

        //criando linha(tr)
        let linha = listaDespesa.insertRow()

        //criar colunas
        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano }`

        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimenta????o'
                break
            case '2':
                d.tipo = 'Educa????o'
                break;
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Sa??de'
                break
            case '5':
                d.tipo = 'Transporte'
                break


        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
       
        //botao pra excluir;
        let btn = document.createElement("button");
		    btn.className = 'btn btn-danger'
		    btn.innerHTML = '<i class="fa fa-times"></i>'
            btn.id = `id_despesa_${d.id}`
            btn.onclick = function (){
                //remove despesa
                let id = this.id.replace('id_despesa_','')
                bd.remover(id)
                window.location.reload()
            }
		   
        linha.insertCell(4).append(btn)
    
     })   
}

function consultarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesasPesquisada =  bd.pesquisar(despesa)

    carregarListaDespesa(despesasPesquisada, true)
    
}