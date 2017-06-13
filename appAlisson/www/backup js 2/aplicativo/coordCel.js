function teste(){
  // document.getElementById("coord").innerHTML = "Verificando Coordenadas";
  // window.plugins.toast.show('Verificando Coordenadas', 'long', 'bottom');

  document.getElementById("lat").innerHTML = "";

  document.getElementById("lon").innerHTML = "";

  navigator.geolocation.getCurrentPosition(onSuccess,onError);
}

function onSuccess(position) {

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

  if(states[networkState]=='Nenhuma Conexão'){
        // document.getElementById("coord").innerHTML = "Verificando Coordenadas";
        window.plugins.toast.show('Sem Conexão de Rede', 'long', 'bottom');
        // document.getElementById("obs").innerHTML = "Sem Conexão de Rede - Coordenadas não podem ser Verificadas";
  }
  else{
    var element = document.getElementById('geolocation');

    document.getElementById("lat").innerHTML = "LATITUDE: "+position.coords.latitude;

    document.getElementById("lon").innerHTML = "LONGITUDE: "+position.coords.longitude;

    // document.getElementById("obs").innerHTML = "";
  }

  setTimeout("load()", 5000);
}

// onError Callback receives a PositionError object
//
function onError(error) {

  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}

function load(){
    // document.getElementById("coord").innerHTML = "Verificando Coordenadas...";
    window.plugins.toast.show('Verificando Coordenadas', 'long', 'bottom');
}

$(document).ready(function(){
    teste();
});

setInterval("teste()", 5000);
