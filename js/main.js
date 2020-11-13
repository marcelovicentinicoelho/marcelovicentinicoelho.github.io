function inicializar() {
  document.getElementById("txtVlrBoleto").value = '';
  document.getElementById("txtVlrBoleto").focus();

  document.getElementById("lblValidacao").innerHTML = '';

  document.getElementById("txtVlrNF").value = '0,00';
  document.getElementById("fraVlrNF").style.display = 'none';

  document.getElementById("txtVlrINSS").value = '11,00';
  document.getElementById("txtVlrISSQN").value = '2,01';
}

function calcular() {
  var dblVlrNF;
  var dblVlrBoleto;
  var strTomadorPrestador;
  var dblVlrINSS;
  var dblVlrISSQN;
  var dblVlrImpostos;
  var objErro = JSON.parse(validar());

  if (objErro.Numero != 0) {
    document.getElementById("lblValidacao").innerHTML = objErro.Descricao;
    timer = setInterval(LimparValidacao, 3000);
    document.getElementById(objErro.Objeto).focus();
    return;
  }

  dblVlrBoleto = parseFloat(document.getElementById("txtVlrBoleto").value.replace(',', '.'));
  strTomadorPrestador = document.getElementById("cmbRetencao").value.substr(0, 1).toUpperCase();  
  dblVlrINSS = parseFloat(document.getElementById("txtVlrINSS").value.replace(',', '.'));
  dblVlrISSQN = parseFloat(document.getElementById("txtVlrISSQN").value.replace(',', '.'));

  dblVlrImpostos = 0;
  if (strTomadorPrestador == 'T') {
    dblVlrImpostos = dblVlrISSQN;  
  }
  dblVlrImpostos += dblVlrINSS;
  dblVlrNF = dblVlrBoleto / (1 - (dblVlrImpostos / 100));

  document.getElementById("txtVlrNF").value = dblVlrNF.toFixed(2);
  document.getElementById("fraVlrNF").style.display = 'block';
  document.getElementById("txtVlrBoleto").focus();
}

function validar() {
  var strJSON;
  var objCampo = document.getElementById("txtVlrBoleto");

  if (objCampo.value == '') {

    strJSON = '{ "Numero":1 , "Descricao":"O campo valor da cobrança deve ser preenchido." , "Objeto":"txtVlrBoleto" }';

  } else {
    
    var objErro = JSON.parse(validarFormatoMoeda(objCampo.value));
    
    switch (objErro.Numero) {
      case 1:
        strJSON = '{ "Numero":2 , "Descricao":"O campo valor da cobrança deve ser numérico." , "Objeto":"txtVlrBoleto" }';
        break;

      case 2:
      case 3:
        strJSON = '{ "Numero":3 , "Descricao":"O campo valor da cobrança não está formatado corretamente." , "Objeto":"txtVlrBoleto" }';
        break;

      default:
        strJSON = '{ "Numero":0 , "Descricao":"Não foram detectadas inconsistências." , "Objeto":"Null" }';
    }  
  }

  return strJSON;
}

function validarFormatoMoeda(pCampo) {
  var strCaracter;
  var strJSON;
  var intCont;
  var qtdDigitos = 0;
  var qtdPontos = 0;
  var qtdVirgulas = 0;
  var qtdOutros = 0;

  for (intCont = 0; intCont < pCampo.length; intCont++) {
    strCaracter = pCampo.substr(intCont, 1);
    if (strCaracter == '0' || strCaracter == '1' || strCaracter == '2' || strCaracter == '3' || strCaracter == '4' ||
        strCaracter == '5' || strCaracter == '6' || strCaracter == '7' || strCaracter == '8' || strCaracter == '9') {
      qtdDigitos++;
    } else if (strCaracter == '.') {
        qtdPontos++;
    } else if (strCaracter == ',') {
        qtdVirgulas++;
    } else {
        qtdOutros++;
    }
  }

  if (qtdOutros > 0) {
    strJSON = '{ "Numero":1 , "Descricao":"Caracteres não numéricos" }';
  } else if (qtdVirgulas > 1) {
      strJSON = '{ "Numero":2 , "Descricao":"Vírgulas" }';
  } else if (qtdPontos > 0) {
      strJSON = '{ "Numero":3 , "Descricao":"Pontos" }';
  } else {
      strJSON = '{ "Numero":0 , "Descricao":"Não há erros de formatação" }';
  }

  return strJSON;
}

function LimparValidacao() {
  clearInterval(timer);
  document.getElementById("lblValidacao").innerHTML = '';
}