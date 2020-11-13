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
  var objErro = JSON.parse(validar());
  if (objErro.Numero != 0) {
    document.getElementById("lblValidacao").innerHTML = objErro.Descricao;
    timer = setInterval(LimparValidacao, 3000);
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
  var strJSON = '{ "Numero":0 , "Descricao":"Não foram detectadas inconsistências." , "Objeto":"Nenhum" }';

  if (objCampo.value == '') {
    strJSON = '{ "Numero":1 , "Descricao":"O campo valor da cobrança deve ser preenchido." , "Objeto":"txtVlrBoleto" }';
  }

  return strJSON;
}

function LimparValidacao() {
  clearInterval(timer);
  document.getElementById("lblValidacao").innerHTML = '';
}