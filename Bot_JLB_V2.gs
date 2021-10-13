var token = '## TOKEN ##';
var telegramUrl = 'https://api.telegram.org/bot' + token;
var spreadsheetId = '## id hoja sheets ##';

function doGet(e) {
  return HtmlService.createHtmlOutput('Hola');
}

function sendText(id, answer) {
  var url = telegramUrl + '/sendMessage?chat_id=' + id + '&text=' + answer;
  UrlFetchApp.fetch(url);
}

function sendTextWithButtons(id, answer, keyboard) {
  var data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(id),
      text: answer,
      reply_markup: keyboard
    }
  }
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

function sendReplyToCallback(id) {
  var url = telegramUrl + '/answerCallbackQuery?callback_query_id=' + id;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);

  if (contents.message) {
    var text = contents.message.text;
    var id = contents.message.chat.id;
    var name = contents.message.chat.first_name;

    var spreadsheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Mensajes');
    spreadsheet.appendRow([new Date(), id, name, text]);

    switch (text) {
            case '/ayuda':
        var answer = 'Hola! ya estoy activo';
        sendText(id, answer);
        break;
      case '/info':
        var answer = 'Esto es un bot de prueba';
        sendText(id, answer);
        break;
      case '/precio':
        var answer = '$20 cada una';
        sendText(id, answer);
        break;
      case '/enlaces':
        var keyboard = {
          'inline_keyboard': [
            [{
              'text': 'Youtube',
              'url': 'https://youtube.com'
            },{
              'text': 'Google',
              'url': 'https://google.com'
            }]
          ]
        };
        sendTextWithButtons(id, 'Algunos enlaces', JSON.stringify(keyboard));
        break;
      case '/start':
        var keyboard = {
          'inline_keyboard': [
            [{
              'text': 'Telefonos',
              'callback_data': 'Nuestro telefono de contacto es: 11.6266.15554'
            }],
            [{
              'text': 'Direccion',
              'callback_data': 'Nos encontramos en: Calle falsa 123'
            }],
            [{
              'text': 'Acción 3',
              'callback_data': '3'
            }],
            [{
              'text': 'Acción 4',
              'callback_data': '4'
            }],
            [{
              'text': 'Acción 5',
              'callback_data': '5'
            }],
            [{
              'text': 'Acción 6',
              'callback_data': '6'
            }]
          ]
        };
        sendTextWithButtons(id, 'Selecione el dato', JSON.stringify(keyboard));
        break;
      default:
        var answer = 'No te he entendido';
        sendText(id, answer);
        break;
    }
  } else if (contents.callback_query) {
    var id = contents.callback_query.message.chat.id;
    var data = contents.callback_query.data;
    var answer = 'Claro, ' + data;
    sendText(id, answer);
    var callbackId = contents.callback_query.id;
sendReplyToCallback(callbackId);
  }
}
