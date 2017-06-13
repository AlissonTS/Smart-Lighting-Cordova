function teste(){
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
    var latl = {lat: position.coords.latitude, lng: position.coords.longitude};

    var element = document.getElementById('geolocation');
    var map;
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var options = {maximumAge: 500000, enableHighAccuracy:true, timeout: 5000};
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: position.coords.latitude, lng: position.coords.longitude},
      zoom: 18,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow({
        position: latl,
        map: map,
        content: '<p>Posição Atual</p>'+latlng
	  });

  	var marker = new google.maps.Marker({
  		position: latl,
      map: map,
  		title: "Minha Posição",
  		animation: google.maps.Animation.DROP
  	});
		google.maps.event.addListener(marker, 'click', function() {infowindow.open(map,marker);});
  }

  // setTimeout("load()", 10000);
}
// onError Callback receives a PositionError object
//
function onError(error){

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

// setInterval("teste()", 10000);
