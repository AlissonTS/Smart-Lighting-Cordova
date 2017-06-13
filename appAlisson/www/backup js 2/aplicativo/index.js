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
		document.getElementById("net").innerHTML = "Sem Nenhuma Conexão";
	}
	else{
		document.getElementById("net").innerHTML = states[networkState];

		navigator.geolocation.getCurrentPosition(onSuccess,onError);
	}

}

function onSuccess(position) {

	var distanciaBanco = 0;
	  db.transaction(function(tx) {
		  tx.executeSql('SELECT distancia FROM distancia', [], function (tx, resultado) {
			  var rows = resultado.rows;

			  if(resultado.rows.item(0).distancia.length>0){
				  if(resultado.rows.item(0).distancia>1){
					document.getElementById("dist").innerHTML = resultado.rows.item(0).distancia+" metros";
				  }else if(resultado.rows.item(0).distancia==1){
					document.getElementById("dist").innerHTML = resultado.rows.item(0).distancia+" metro";
				  }else{
					document.getElementById("dist").innerHTML = "No mesmo Ponto";
				  }
				  distanciaBanco = resultado.rows.item(0).distancia;
			  }
			  else{
				document.getElementById("dist").innerHTML = "Nenhuma Distância Setada.";
			  }
		  }, null);
	  });

	var element = document.getElementById('geolocation');

	document.getElementById("lat").innerHTML = position.coords.latitude;

	document.getElementById("lon").innerHTML = position.coords.longitude;

	db.transaction(function(tx) {
		tx.executeSql('SELECT latitude, longitude FROM arduino', [], function (tx, resultado) {
			var rows = resultado.rows;

      if(rows.length>0){
        document.getElementById("latArd").innerHTML = resultado.rows.item(0).latitude;
        document.getElementById("lonArd").innerHTML = resultado.rows.item(0).longitude;
      }else{
        document.getElementById("latArd").innerHTML = "Latitude não Setada";
        document.getElementById("lonArd").innerHTML = "Longitude não Setada";
      }

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

					if(retorno==1){
						document.getElementById("lampada").src = "img/lampLigada.png";
						document.getElementById("lamp").innerHTML = "Lâmpada Ligada";
					}else{
						document.getElementById("lampada").src = "img/lampDesligada.png";
						document.getElementById("lamp").innerHTML = "Lâmpada Desligada";
					}
					comp = 1; // colocar condição se não entrar no comp = 1 é pq não tem conexão com arduino
				}
	  });


      if(distancia<1 && distancia>0){
        document.getElementById("arduino").innerHTML = parseFloat(distancia.toFixed(3))+" metro";
      }else if(distancia>1){
        document.getElementById("arduino").innerHTML = parseFloat(distancia.toFixed(3))+" metros";
      }else{
        document.getElementById("arduino").innerHTML = "No mesmo Ponto";
      }

      window.plugins.toast.show('Atualização de Coordenadas', 'long', 'bottom');

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
/*
  var lat1 = position.coords.latitude;
  var long1 = position.coords.longitude;
  var long2 = -53.8105000;
  var lat2 = -29.6882000;

  var r = 6371.0;

  lat1 = lat1 * 3.14159265359/180;
  lat2 = lat2 * 3.14159265359/180;
  long1 = long1 * 3.14159265359/180;
  long2 = long2 * 3.14159265359/180;

  var lat = lat2 - lat1;
  var long = long2 - long1;

  var a = Math.sin(lat/2)*Math.sin(lat/2)+Math.cos(lat1)*Math.cos(lat2)*Math.sin(long/2)*Math.sin(long/2);
  var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var distancia = Math.round(r*c*1000);

*/
