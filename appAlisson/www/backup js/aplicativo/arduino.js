window.addEventListener('load', carregado);

var db = window.openDatabase("DBusuarios", "1.0", "base para crud", 2 * 1024 * 1024);

function carregado(){

    document.getElementById('botaoSalvar').addEventListener('click', setar);

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS arduino (latitude, longitude)");
    });
}

function setar(){

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
        window.plugins.toast.show('Sem Conexão de Rede', 'long', 'bottom');
    }
    else{
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }
}

function onSuccess(position) {
    var element = document.getElementById('geolocation');
    var rows;

    console.log(position.coords.latitude+", "+position.coords.longitude);

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM arduino', [], function (tx, resultado) {
            rows = resultado.rows;
        }, null);
    });

    db.transaction(function(tx) {
        if(rows.length>0){
            tx.executeSql('UPDATE arduino SET latitude=?, longitude=?', [position.coords.latitude, position.coords.longitude], null);
            navigator.vibrate(500);
            // console.log("UPDATE");
            // document.getElementById("verificador").innerHTML = "UPDATE: "+rows.length;

            // alert('Coordenadas Atualizadas');
            window.plugins.toast.show('Coordenadas Atualizadas', 'long', 'bottom');
        }else{
            tx.executeSql('INSERT INTO arduino (latitude, longitude) VALUES (?, ?)', [position.coords.latitude, position.coords.longitude]);
            navigator.vibrate(500);
            // console.log("Insert");
            // document.getElementById("verificador").innerHTML = "INSERT";
            // alert('Coordenadas Cadastradas');
            window.plugins.toast.show('Coordenadas Cadastradas', 'long', 'bottom');
        }
        document.getElementById("lat").innerHTML = position.coords.latitude;

        document.getElementById("lon").innerHTML = position.coords.longitude;
    });
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}

$(document).ready(function(){
    db.transaction(function(tx) {
        tx.executeSql('SELECT latitude, longitude FROM arduino', [], function (tx, resultado) {
            var rows = resultado.rows;
            // document.getElementById("verificador").innerHTML = "LOAD";

            document.getElementById("lat").innerHTML = resultado.rows.item(0).latitude;

            document.getElementById("lon").innerHTML = resultado.rows.item(0).longitude;
        }, null);
    });
});
