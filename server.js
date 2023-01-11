//Поключение библиотеки для работы с websocket
const WebSocket = require('ws');

//Экземпляр класса WebSocket, с указанием порта на котором будет запущен WebSocket-сервер
const wsServer = new WebSocket.Server({
    port: 9000
});

//Обработчик подключения - onConnect
wsServer.on('connection', onConnect);


//echo-запрос, в ответ на который сервер отправит содержимое data
//ping, в ответ сервер отправит pong
//Если команда не известна, сервер выведет в консоль уведомление "Неизвестная команда"
function onConnect(wsClient) {
    console.log('Новый пользователь');
    //Отправка приветственного сообщения клиенту
    wsClient.send('Привет');

    wsClient.on('close', function() {
        console.log('Пользователь отключился');
    });

    wsClient.on('message', function(message) {
        console.log(message);
        try {
            const jsonMessage = JSON.parse(message);
            switch(jsonMessage.action) {
                case 'ECHO':
                    wsClient.send(jsonMessage.data);
                    break;
                case 'PING':
                    setTimeout(function() {
                        wsClient.send('PONG');
                    }, 2000);
                    break;
                default:
                    console.log('Неизвестная команда');
                    break;
            }
        } catch(error) {
            console.log('Ошибка', error);
        }
    });
}

console.log('Сервер запущен на 9000 порту');
