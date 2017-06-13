var markersData;
var latitude;
var longitude;

var db = window.openDatabase("DBusuarios", "1.0", "base para crud", 2 * 1024 * 1024);

window.addEventListener('load', carregado);

function carregado(){

    document.getElementById('botaoSalvar').addEventListener('click', teste);

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS arduino (latitude, longitude)");
    });

    teste();
}

function teste(){

  db.transaction(function(tx) {
    tx.executeSql('SELECT latitude, longitude FROM arduino', [], function (tx, resultado) {
      var rows = resultado.rows;
      // document.getElementById("verificador").innerHTML = "LOAD"
      latitude = resultado.rows.item(0).latitude;

      longitude = resultado.rows.item(0).longitude;

    }, null);
  });

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
        markersData = [
           {
              lat: latitude,
              lng: longitude,
              nome: "Localização do Acionador"
           }
        ];
        // document.getElementById("obs").innerHTML = "Sem Conexão de Rede - Coordenadas não podem ser Verificadas";
  }
  else{
    markersData = [
       {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          nome: "Minha Localização"
       },
       {
          lat: latitude,
          lng: longitude,
          nome: "Localização do Acionador"
       }
    ];
  }
  initialize();
// setTimeout("load()", 10000);
}
  // onError Callback receives a PositionError object
  //
function onError(error){

alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');
}

var map;
var infoWindow;

// A variável markersData guarda a informação necessária a cada marcador
// Para utilizar este código basta alterar a informação contida nesta variável

function initialize() {
   var mapOptions = {
      center: new google.maps.LatLng(-29.666684699999994,-53.8175293),
      zoom: 15,
      // mapTypeId: google.maps.MapTypeId.HYBRID
      // mapTypeId: google.maps.MapTypeId.SATELLITE
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };

   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

   // cria a nova Info Window com referência à variável infowindow
   // o conteúdo da Info Window será atribuído mais tarde
   infoWindow = new google.maps.InfoWindow();

   // evento que fecha a infoWindow com click no mapa
   google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
   });

   // Chamada para a função que vai percorrer a informação
   // contida na variável markersData e criar os marcadores a mostrar no mapa
   displayMarkers();
}

// Esta função vai percorrer a informação contida na variável markersData
// e cria os marcadores através da função createMarker
function displayMarkers(){

   // esta variável vai definir a área de mapa a abranger e o nível do zoom
   // de acordo com as posições dos marcadores
   var bounds = new google.maps.LatLngBounds();

   // Loop que vai estruturar a informação contida em markersData
   // para que a função createMarker possa criar os marcadores
   for (var i = 0; i < markersData.length; i++){

      var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
      var nome = markersData[i].nome;

      createMarker(latlng, nome);

      // Os valores de latitude e longitude do marcador são adicionados à
      // variável bounds
      bounds.extend(latlng);
   }

   // Depois de criados todos os marcadores
   // a API através da sua função fitBounds vai redefinir o nível do zoom
   // e consequentemente a área do mapa abrangida.
   map.fitBounds(bounds);
}

// Função que cria os marcadores e define o conteúdo de cada Info Window.
function createMarker(latlng, nome){
   var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      title: nome
   });

   // Evento que dá instrução à API para estar alerta ao click no marcador.
   // Define o conteúdo e abre a Info Window.
   google.maps.event.addListener(marker, 'click', function() {

      // Variável que define a estrutura do HTML a inserir na Info Window.
      var iwContent = '<div id="iw_container">' +
            '<div class="iw_title">' + nome + '</div>' +
         '</div>';

      // O conteúdo da variável iwContent é inserido na Info Window.
      infoWindow.setContent(iwContent);

      // A Info Window é aberta.
      infoWindow.open(map, marker);
   });
}
