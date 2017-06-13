#include <SPI.h> //Inclui a biblioteca SPI.h
// #include <Ethernet.h> //Inclui a biblioteca Ethernet.h
#include <Ethernet2.h>

#define rele 7

// Configurações para o Ethernet Shield
// byte mac[] = { 0x90, 0xA2, 0xDA, 0x0E, 0x0C, 0xF1 };
byte mac[] = { 0x90, 0xA2, 0xDA, 0x10, 0x6D, 0x9D };

IPAddress ip(192,168,90,217); // Configure um IP válido 
byte gateway[] = { 192 , 168, 80, 1 }; //Entre com o IP do Computador onde a Câmera esta instalada
byte subnet[] = { 255, 255, 240, 0 }; //Entre com a Máskara de Subrede
EthernetServer server(1000); //Inicializa a biblioteca EthernetServer com os valores de IP acima citados e configura a porta de acesso(80)

int val = 0;

// http://192.168.90.217:1000/?acao=002

void setup()
{ 
  Serial.begin(9600);
  Serial.println("Iniciando o Programa :) ... ");
  Ethernet.begin(mac, ip);// Inicializa o Server com o IP e Mac atribuido acima
  Serial.print("Server Ativo no IP: ");
  Serial.println(Ethernet.localIP());
  server.begin();

  pinMode(rele, OUTPUT); //define porta como saida
  digitalWrite(rele, LOW);  //define inicio como nivel logico baixo
}

void loop()
{
  EthernetClient client = server.available();// Verifica se tem alguém conectado

  if (client)
  {

    boolean continua = true; // A requisição HTTP termina com uma linha em branco Indica o fim da linha
    String linha;

    while (client.connected())
    {

      if (client.available())
      {

        char c = client.read(); //Variável para armazenar os caracteres que forem recebidos
        linha.concat(c); // Pega os valor após o IP do navegador ex: 192.168.1.2/0001        
        
        if (c == '\n' && continua)
        {Serial.println("if da pagina ");
                            client.println("HTTP/1.1 200 OK");

                            // IMPORTANTE, ISSO FAZ O ARDUINO RECEBER REQUISIÇÃO AJAX DE OUTRO SERVIDOR E NÃO APENAS LOCAL.
                            client.println("Content-Type: text/javascript");
                            client.println("Access-Control-Allow-Origin: *");
                            client.println();

                            int iniciofrente = linha.indexOf("?");

                            if(iniciofrente>-1){ //verifica se existe comando

                              iniciofrente  = iniciofrente+6; // pega o caracter seguinte
                              int fimfrente = iniciofrente+3; //espera 3 caracteres
                              String acao   = linha.substring(iniciofrente,fimfrente);//pega o valor do comando

                              if(acao == "001"){ digitalWrite(rele, HIGH);val=1;}
                              else
                              if(acao == "002"){ digitalWrite(rele, LOW);val=0;}
                              else{}

                              Serial.print("rele: ");
                              Serial.println(rele);
                              Serial.print("val: ");
                              Serial.println(val);
                              
                              client.print("dados({ ");
                              client.print(" rele : ");
                              client.print(val);
                              client.print(" })");
                              }
                            break;
                            
        } //Fecha if (c == '\n' && continua)

         if(c == '\n'){
                        continua = true;
                      }else
                      if(c != '\r'){
                        continua = false;
                      }
        
      } //Fecha if (client.available())
      
    } //Fecha While (client.connected())
    
    delay(1);// Espera um tempo para o navegador receber os dados
    client.stop(); // Fecha a conexão
    
  } //Fecha if(client)
  delay(2000);
} //Fecha loop

