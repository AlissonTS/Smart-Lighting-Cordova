// var url = 'http://192.168.0.110:1000';
// var comp = 0;

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

  // document.getElementById("network").innerHTML = "CONEXÃO: "+states[networkState];
  // document.getElementById("coord").innerHTML = "Verificando Coordenadas...";

  navigator.geolocation.getCurrentPosition(onSuccess,onError);

}

function onSuccess(position) {
	var element = document.getElementById('geolocation');

	document.getElementById("lat").innerHTML = position.coords.latitude;

	document.getElementById("lon").innerHTML = position.coords.longitude;

	db.transaction(function(tx) {
		tx.executeSql('SELECT latitude, longitude FROM arduino', [], function (tx, resultado) {
			var rows = resultado.rows;
			// document.getElementById("verificador").innerHTML = "LOAD";

			document.getElementById("latArd").innerHTML = resultado.rows.item(0).latitude;

			document.getElementById("lonArd").innerHTML = resultado.rows.item(0).longitude;

      /*
      var lat1 = position.coords.latitude * 3.14159265359/180;
      var long1 = position.coords.longitude * 3.14159265359/180;

      var lat2 = resultado.rows.item(0).latitude * 3.14159265359/180;
      var long2 = resultado.rows.item(0).longitude * 3.14159265359/180;

      var r = 6371.0;

      var lat = lat2 - lat1;
      var long = long2 - long1;

      var a = Math.sin(lat/2)*Math.sin(lat/2)+Math.cos(lat1)*Math.cos(lat2)*Math.sin(long/2)*Math.sin(long/2);
      var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var dist = Math.round(r*c*1000);

      document.getElementById("arduino2").innerHTML = "DISTÂNCIA DO ACIONADOR Fórmula: "+dist;

      */
      var arduino = new google.maps.LatLng(resultado.rows.item(0).latitude, resultado.rows.item(0).longitude);
      var pessoa = new google.maps.LatLng(position.coords.latitude , position.coords.longitude);
      var distancia = google.maps.geometry.spherical.computeDistanceBetween(arduino, pessoa);

      if(distancia<2){
        document.getElementById("lampada").src = "img/lampLigada.png";
        document.getElementById("lamp").innerHTML = "Lâmpada Ligada";
        /*
        $.ajax({
					    url: url,
					    data: { 'acao': dado},
					    dataType: 'jsonp',
					    crossDomain: true,
					    jsonp: false,
					    jsonpCallback: 'dados',

					    success: function(data,status,xhr) {
					    	document.getElementById("disp_texto").innerHTML = statusReturn(data.rele);

							comp = 1;
					    }
			  }); */
      }else{
        document.getElementById("lampada").src = "img/lampDesligada.png";
        document.getElementById("lamp").innerHTML = "Lâmpada Desligada";
      }

      document.getElementById("arduino").innerHTML = distancia;

      window.plugins.toast.show('Atualização de Coordenadas', 'long', 'bottom');

		}, null);
	});

  db.transaction(function(tx) {
      tx.executeSql('SELECT distancia FROM distancia', [], function (tx, resultado) {
          var rows = resultado.rows;
          // document.getElementById("verificador").innerHTML = "LOAD";

          document.getElementById("dist").innerHTML = resultado.rows.item(0).distancia;
      }, null);
  });

	// verificar a distancia
  return lamp;

  // document.getElementById("coord").innerHTML = "";
  // document.getElementById("net").innerHTML = "";
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
