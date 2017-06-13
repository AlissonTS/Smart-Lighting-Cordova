function teste2(){

  // document.getElementById("net").innerHTML = "Verificando Conexão...";

  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN]  = 'Conexão Desconhecida';
  states[Connection.ETHERNET] = 'Conexão Ethernet';
  states[Connection.WIFI]     = 'Conexão WIFI';
  states[Connection.CELL_2G]  = 'Conexão 2G';
  states[Connection.CELL_3G]  = 'Conexão 3G';
  states[Connection.CELL_4G]  = 'Conexão 4G';
  states[Connection.CELL]     = 'Conexão Genérica';
  states[Connection.NONE]     = 'Nenhuma Conexão';

  document.getElementById("network").innerHTML = "CONEXÃO: "+states[networkState];

  setTimeout("load()", 3000);
}

function load(){
  // document.getElementById("net").innerHTML = "";
  window.plugins.toast.show('Verificando Conexão de Rede', 'long', 'bottom');
}

$(document).ready(function(){
    teste2();
});

setInterval("teste2()", 2000);
