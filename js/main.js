function inicializar() {
  document.getElementById("txtVlrCobranca").value = '';
  document.getElementById("txtVlrCobranca").focus();

  document.getElementById("lblValidacao").value = '';

  document.getElementById("txtVlrBoleto").value = '0,00';
  document.getElementById("fraVlrBoleto").style.display = 'none';

  document.getElementById("txtVlrNF").value = '0,00';
  document.getElementById("fraVlrNF").style.display = 'none';

  document.getElementById("txtVlrINSS").value = '11,00';
  document.getElementById("txtVlrISSQN").value = '2,01';
}

function calcular() {
  var objErro = JSON.parse(validar());

  if (objErro.Numero != '0') {
    document.getElementById("lblValidacao").value = objErro.Descricao;
    document.getElementById(objErro.Objeto).focus();
    return;
  }

  document.getElementById("txtVlrBoleto").value = '12,34';
  document.getElementById("fraVlrBoleto").style.display = 'block';

  document.getElementById("txtVlrNF").value = '56,78';
  document.getElementById("fraVlrNF").style.display = 'block';

  document.getElementById("txtVlrCobranca").focus();
}

function validar() {
  var strJSON;
  var objCampo = document.getElementById("txtVlrCobranca");

  if (objCampo.value == '') {
    strJSON = '{ "Numero":"1" , "Descricao":"O campo valor da cobrança deve ser preenchido." , "Objeto":"txtVlrCobranca" }';
  } else {
    var objErro = JSON.parse(validarFormatoMoeda(objCampo.value));
    switch (objErro.Numero) {
      case '1':
        strJSON = '{ "Numero":"2" , "Descricao":"O campo valor da cobrança deve ser numérico." , "Objeto":"txtVlrCobranca" }';
  
      case '2':
      case '3':
        strJSON = '{ "Numero":"3" , "Descricao":"O campo valor da cobrança não está formatado corretamente." , "Objeto":"txtVlrCobranca" }';
  
      default:
        strJSON = '{ "Numero":"0" , "Descricao":"Não foram detectadas inconsistências." , "Objeto":"Null" }';
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
    strJSON = '{ "Numero":"1" , "Descricao":"Caracteres não numéricos" }';
  } else if (qtdVirgulas > 1) {
      strJSON = '{ "Numero":"2" , "Descricao":"Vírgulas" }';
  } else if (qtdPontos > 0) {
      strJSON = '{ "Numero":"3" , "Descricao":"Pontos" }';
  } else {
      strJSON = '{ "Numero":"0" , "Descricao":"Não há erros de formatação" }';
  }

  return strJSON;
}