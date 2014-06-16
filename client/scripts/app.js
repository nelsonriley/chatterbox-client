// YOUR CODE HERE:

var app = {

  init: function () {
    app.fetch();
    setInterval(function() {
      app.fetch();
    }, 2000);
  },

  server: 'https://api.parse.com/1/classes/chatterbox',

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        app.displayNewMessages(data.results, 10);
        console.log("hi");
      },
      error: function() { console.log('errorful'); }
    });
  },

  messageIsClean: function(msg) {
    for (var key in msg) {
      if ( msg[key].indexOf("<") + msg[key].indexOf(">") > -2) {
        return false;
      }
    }
    return true;
  },

  displayMessage: function(messageData) {
    if (app.messageIsClean(messageData)) {
      var user = messageData.username;
      var message = messageData.text;
      var room = messageData.roomname;
      var time = messageData.createdAt;
      var element = $('<div class="message"></div>');
      element.append('<span class="username">' + user + ': </span>');
      element.append('<span class="time">' + time + ' </span>');
      element.append('<div class="message">' + message + ' </div>');
      $('.messages').append(element);
    } else {
      console.log('Attack message: ' , messageData);
    }
  },

  displayNewMessages: function(messagesData, count) {
    $('.messages').children().remove();
    for (var i = messagesData.length - 1 ; i > messagesData.length - 1 - count ; i-- ) {
      app.displayMessage(messagesData[i]);
    }
  }












};

app.init();
