window.addEventListener('load', carregado);

var db = window.openDatabase("DBusuarios", "1.0", "base para crud", 2 * 1024 * 1024);

function carregado(){

    document.getElementById('botaoSalvar').addEventListener('click', setar);

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS distancia (distancia)");
    });
}

function setar(){

  var distancia = document.getElementById("distancia").value;

  db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM distancia', [], function (tx, resultado) {
          rows = resultado.rows;
      }, null);
  });

  db.transaction(function(tx) {
      if(rows.length>0){
          tx.executeSql('UPDATE distancia SET distancia=?', [distancia], null);
          navigator.vibrate(500);
          // console.log("UPDATE");
          // document.getElementById("verificador").innerHTML = "UPDATE: "+rows.length;

          // alert('Coordenadas Atualizadas');
          window.plugins.toast.show('Distância Atualizada', 'long', 'bottom');
      }else{
          tx.executeSql('INSERT INTO distancia (distancia) VALUES (?)', [distancia]);
          navigator.vibrate(500);
          // console.log("Insert");
          // document.getElementById("verificador").innerHTML = "INSERT";
          // alert('Coordenadas Cadastradas');
          window.plugins.toast.show('Distância Cadastrada', 'long', 'bottom');
      }
      document.getElementById("dist").innerHTML = "Distância: "+distancia;
  });
}

// onError Callback receives a PositionError object
//

$(document).ready(function(){
    db.transaction(function(tx) {
        tx.executeSql('SELECT distancia FROM distancia', [], function (tx, resultado) {
            var rows = resultado.rows;
            // document.getElementById("verificador").innerHTML = "LOAD";

            document.getElementById("dist").innerHTML = "Distância: "+resultado.rows.item(0).distancia;
        }, null);
    });
});
