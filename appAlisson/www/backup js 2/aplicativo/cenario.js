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

  if(distancia.length>0 && distancia<9999){
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

        if(distancia>1){
          document.getElementById("dist").innerHTML = distancia+" metros";
        }else if(distancia==1){
          document.getElementById("dist").innerHTML = distancia+" metro";
        }
        else{
          document.getElementById("dist").innerHTML = "No mesmo Ponto";
        }

    });
  }
}

// onError Callback receives a PositionError object
//

$(document).ready(function(){
    db.transaction(function(tx) {
        tx.executeSql('SELECT distancia FROM distancia', [], function (tx, resultado) {
            var rows = resultado.rows;
            // document.getElementById("verificador").innerHTML = "LOAD";

            if(resultado.rows.item(0).distancia.length>0){
                if(resultado.rows.item(0).distancia>1){
                  document.getElementById("dist").innerHTML = resultado.rows.item(0).distancia+" metros";
                }else if(resultado.rows.item(0).distancia==1){
                  document.getElementById("dist").innerHTML = resultado.rows.item(0).distancia+" metro";
                }else{
                  document.getElementById("dist").innerHTML = "No mesmo Ponto";
                }
            }
            else{
              document.getElementById("dist").innerHTML = "Nenhuma Distância Setada.";
            }
            // document.getElementById('distancia').value = resultado.rows.item(0).distancia;
        }, null);
    });
});
