http://localhost:3000/auth/register (.POST)
http://localhost:3000/auth/login (.POST)

{
"name":"Ferreira",
"phone":"913245787",
"email":"COLOQUE AQUI O SEU EMAIL",
"password":"12345",
"userType":"DEFAULT"
}

http://localhost:3000/auth/passwordReset (.POST)

<<<<<VERIFICAR A CAIXA DE MENSAGENS NO SPAM>>>>>

{
"email":"COLOQUE AQUI O SEU EMAIL"
}

LINK QUE FOI ENVIADO PARA O EMAIL (.POST)

{
"password":"1234"
}

FAZER LOGIN NOVAMENTE PARA VERIFICAR QUE A PASSWORD REALMENTE FOI ALTERADA.


http://localhost:3000/quartos/quarto (.POST) 

TEM QUE ESTAR AUTENTICADO COM UM UTILIZADOR DO TIPO ADMIN PARA FAZER O POST DO QUARTO

{
"number":"123",
"type":"single",
"bedroomsNumber":"1",
"capacity":"1",
"information":"quarto com varanda, vista para o mar, cinzeiro e jaccuzzi",
"valueNight":"150",
"image":"imagem1"
}

>>>QUALQUER UM DOS COMANDOS A BAIXO REFERIDOS SÓ PODEM SER UTILIZADOS POR USER ADMIN<<<

http://localhost:3000/quartos/quarto/{quartoId} (.GET)
(PARA IR BUSCAR UM QUARTO PELO ID)

http://localhost:3000/quartos/quarto/{quartoId} (.PUT)
(PARA ALTERAR UM QUARTO PELO ID)

http://localhost:3000/quartos/quarto/{quartoId} (.DELETE)
(PARA APAGAR UM QUARTO PELO ID)


>>>QUALQUER USER PODE UTILIZAR O COMANDO A BAIXO REFERIDO PARA CONSULTAR OS QUARTOS EXISTENTES<<<
http://localhost:3000/quartos/quarto (.GET)
