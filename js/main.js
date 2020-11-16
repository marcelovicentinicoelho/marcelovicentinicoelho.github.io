// Constantes utilizadas para referenciar os dados lidos do JSON
const cstParametros = 0;
const cstINSS = 0;
const cstISSQN = 1;

// Tipo de dado utilizado como objeto para troca de mensagens entre funções
var objMensagem = {
  Numero : 0,
  Descricao : "Descrição",
  Objeto : "Objeto",

  gerarJSON : 
  function () {
              strJSON = '{';
    strJSON = strJSON + ' "Numero" : ' + this.Numero + ' , ';
    strJSON = strJSON + ' "Descricao" : "' + this.Descricao + '" , ';
    strJSON = strJSON + ' "Objeto" : "' + this.Objeto + '" ';
    strJSON = strJSON + '}';
    return strJSON;
  }
}

function inicializar() {
  var strRequestURL = 'https://marcelovicentinicoelho.github.io/json/database.json';
  var objRequest = new XMLHttpRequest();

  document.getElementById("txtVlrBoleto").value = '';
  document.getElementById("txtVlrBoleto").focus();

  document.getElementById("lblValidacao").innerHTML = '';

  document.getElementById("txtVlrNF").value = '0,00';
  document.getElementById("fraVlrNF").style.display = 'none';

  objRequest.open('GET', strRequestURL);
  objRequest.responseType = 'json';
  objRequest.send();
  objRequest.onload = function() {
    var objJSON = objRequest.response;
    carregarImpostos(objJSON);
  }

}

function carregarImpostos(objDB) {
  document.getElementById("txtVlrINSS").value = objDB.Tabelas[cstParametros].Impostos[cstINSS].Porcentagem.toFixed(2);
  document.getElementById("txtVlrISSQN").value = objDB.Tabelas[cstParametros].Impostos[cstISSQN].Porcentagem.toFixed(2);
}

function calcular() {
  var objErro = JSON.parse(validar());

  if (objErro.Numero != 0) {
    document.getElementById("lblValidacao").innerHTML = objErro.Descricao;
    timer = setInterval(LimparValidacao(), 3000);
    document.getElementById(objErro.Objeto).focus();
    return;
  }

  document.getElementById("txtVlrNF").value = calcularValorNF().toFixed(2);
  document.getElementById("fraVlrNF").style.display = 'block';
  document.getElementById("txtVlrBoleto").focus();
}

function calcularValorNF() {
  var dblVlrBoleto = parseFloat(document.getElementById("txtVlrBoleto").value.replace(',', '.'));
  var strTomadorPrestador = document.getElementById("cmbRetencao").value.substr(0, 1).toUpperCase();
  var dblVlrINSS  = parseFloat(document.getElementById("txtVlrINSS").value.replace(',', '.'));
  var dblVlrISSQN = parseFloat(document.getElementById("txtVlrISSQN").value.replace(',', '.'));

  var dblVlrImpostos = 0;
  if (strTomadorPrestador == 'T') {
    dblVlrImpostos = dblVlrISSQN;  
  }
  dblVlrImpostos += dblVlrINSS;

  var dblVlrNF = dblVlrBoleto / (1 - (dblVlrImpostos / 100));
  return dblVlrNF;
}

function validar() {
  var objCampo = document.getElementById("txtVlrBoleto");

  objMensagem.Numero = 0;
  objMensagem.Descricao = 'Não foram detectadas inconsistências.';
  objMensagem.Objeto = 'Nenhum';

  if (objCampo.value == '') {
    objMensagem.Numero = 1;
    objMensagem.Descricao = 'O campo valor da cobrança deve ser preenchido.';
    objMensagem.Objeto = 'txtVlrBoleto';
  }

  return objMensagem.gerarJSON();
}

function LimparValidacao() {
  clearInterval(timer);
  document.getElementById("lblValidacao").innerHTML = '';
}