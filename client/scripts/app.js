// YOUR CODE HERE:

var app = {

  getMessages: function() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'get',
      success: function(data) { _.each(data.results, function(msg) {
        app.displayMessage(msg);
      });
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
  }












};

app.getMessages();
