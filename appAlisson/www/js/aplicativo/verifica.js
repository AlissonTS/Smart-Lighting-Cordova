var url = 'http://192.168.90.217:1000';
var comp = 0;
var dado;

window.addEventListener('load', carregado);

var db = window.openDatabase("DBusuarios", "1.0", "base para crud", 2 * 1024 * 1024);

function carregado(){

    // document.getElementById('botaoSalvar').addEventListener('click', setar);

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS arduino (latitude, longitude)");
    });

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS distancia (distancia)");
    });
}

function teste(){

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

	if(states[networkState]=='Nenhuma Conexão'){
		// alert('Sem Conexão de Rede');
		// document.getElementById("net").innerHTML = "Sem Nenhuma Conexão";
	}
	else{
		// document.getElementById("net").innerHTML = states[networkState];

		navigator.geolocation.getCurrentPosition(onSuccess,onError);
	}

}

function onSuccess(position) {

	var distanciaBanco = 0;
	  db.transaction(function(tx) {
		  tx.executeSql('SELECT distancia FROM distancia', [], function (tx, resultado) {
			  var rows = resultado.rows;

			  if(resultado.rows.item(0).distancia.length>0){
				  distanciaBanco = resultado.rows.item(0).distancia;
			  }
		  }, null);
	  });

	var element = document.getElementById('geolocation');

	db.transaction(function(tx) {
		tx.executeSql('SELECT latitude, longitude FROM arduino', [], function (tx, resultado) {
			var rows = resultado.rows;

      var arduino = new google.maps.LatLng(resultado.rows.item(0).latitude, resultado.rows.item(0).longitude);
      var pessoa = new google.maps.LatLng(position.coords.latitude , position.coords.longitude);
      var distancia = google.maps.geometry.spherical.computeDistanceBetween(arduino, pessoa);

      if(distancia<=distanciaBanco){
		      dado = "001";
      }else{
		      dado = "002";
      }

	  $.ajax({
				url: url,
				data: { 'acao': dado},
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: false,
				jsonpCallback: 'dados',

				success: function(data,status,xhr) {
					var retorno = data.rele;

          /*
					if(retorno==1){
						document.getElementById("lampada").src = "img/lampLigada.png";
						document.getElementById("lamp").innerHTML = "Lâmpada Ligada";
					}else{
						document.getElementById("lampada").src = "img/lampDesligada.png";
						document.getElementById("lamp").innerHTML = "Lâmpada Desligada";
					}
					comp = 1; // colocar condição se não entrar no comp = 1 é pq não tem conexão com arduino */
				}
	  });

      // window.plugins.toast.show('Atualização de Coordenadas', 'long', 'bottom');

		}, null);
	});

  // return lamp;
}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}

$(document).ready(function(){
    teste();
});

setInterval("teste()", 10000);
