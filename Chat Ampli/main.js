var messages = document.getElementById('messages');
var roomNameInput = document.getElementById('roomname-input')
var sendButton = document.getElementById('send-btn');
// По нажатию на кнопку отправить - отправить на сервер nickname:message
sendButton.addEventListener('click', sendUserMessage);
start();
// Каждые 2000 милисекунд забирать сообщения
function start(){
  getMessagesFromServer();
  setInterval(getMessagesFromServer, 2000);
}
var lastMessages = [];

async function getMessagesFromServer() {

  var roomname = roomNameInput.value;

  var response = await fetch(`https://fchatiavi.herokuapp.com/get/${roomname}/?offset=0&limit=1000000`)

  response = await response.json();
  if (response == null) {
    messages.innerHTML = 'No messages';
    return;
  }
  var messagesHTML = fromMessagesHTML(response);

messages.innerHTML = allMessagesHTML;

if (lastMessages.length < response.length){
  scrollToEnd();
}
// Запомнить сообщения
lastMessages = response;
{
// Отправить сообщение
async function sendUserMessage(){
  // Получаем название комнаты
  var roomname = roomNameInput.value;
// Получить что написал пользователь в поле nickname
 var userNickname = document.getElementById('nickname-input').value;
 // Получить что написал пользователь в поле message
 var userMessage = document.getElementById('message-input').value;
 if (userNickname.length === 0) {
  alert("Ты должен ввести имя!");
  return;
 }
 if (userMessage.length === 0) {
  alert("Pls Write message");
  return;
 }
await fetch(`https://fchatiavi.herokuapp.com/send/${roomname}/`,{
 method:'POST',
 body: JSON.stringify({
 Name:  userNickname,
 Message: userMessage
 })
});
 getMessagesFromServer();
 }
 // Сформировать HTML меседжей
 function fromMessagesHTML(messages){
   var allMessagesHTML ='';
   for (var i = 0; i < response.length; i++){
     var messageData = response[i];
     var message = `
     <div class="message">
       <div class="message-nickname"> ${messageData.Name} </div>
       <div class="message-text"> ${messageData.Message} </div>
     </div>`;
     allMessagesHTML = allMessagesHTML + message;
   }
   return allMessagesHTML;
 }
//  Проскролить до конца
function scrollToEnd(){
   messages.scrollTop = messages.scrollHeight;
}
