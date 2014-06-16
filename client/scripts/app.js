// YOUR CODE HERE:

var app = {

  init: function () {
    app.displayUserName();
    setInterval(function() {
      app.fetch();
    }, 2000);
  },

  server: 'https://api.parse.com/1/classes/chatterbox',

  getUserName: function() {
    return window.location.search.split("username=")[1];
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        app.displayNewMessages(data.results, 10);
      },
      error: function() { console.log('errorful'); }
    });
  },

  messageIsClean: function(msg) {
    for (var key in msg) {
      if ( msg[key].indexOf('<') + msg[key].indexOf('>') > -2) {
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
      var element = $('<div class="message-container"></div>');
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
  },

  displayUserName: function() {
    var userName = app.getUserName();
    $('.current-user-input-container .name').text(userName);
  },

  createMessage: function() {
    var sendMsg = {
      'username': app.getUserName(),
      'text': $('.current-user-input-container .message').val(),
      'roomname': 'daveNelson'
    };
    return sendMsg;
  },

  send: function(message) {
    console.dir(JSON.stringify(message));
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        $('.current-user-input-container .message').val('');
      },
      error: function() {
        throw "Could not send message";
      }
    });
  }



};

app.fetch();
$(document).ready(function(){
  app.init();
  $('.current-user-input-container .submit').click(function() {
    app.send(app.createMessage());
  });
});
