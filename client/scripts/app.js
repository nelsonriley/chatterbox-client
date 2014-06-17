// YOUR CODE HERE:

var app = {

  init: function () {
    app.displayUserName();
    setInterval(function() {
      app.fetch();
    }, 2000);
  },

  activeChatRoom: false,

  server: 'https://api.parse.com/1/classes/chatterbox',

  getUserName: function() {
    return window.location.search.split('username=')[1];
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: 'order=-createdAt',
      success: function(data) {
        app.addNewMessages(data.results, 10);
        app.updateChatRooms(data.results);
      },
      error: function() { console.log('errorful'); }
    });
  },

  messageIsClean: function(msg) {
    for (var key in msg) {
      if ( !app.stringIsClean(msg[key]) ) {
        return false;
      }
    }
    return true;
  },

  stringIsClean: function(string) {
    if ( typeof string !== 'string' || (string.indexOf('<') + string.indexOf('>') > -2)) {
      return false;
    }
    return true;
  },

  addMessage: function(messageData) {
    if (app.messageIsClean(messageData)) {
      var user = messageData.username;
      var message = messageData.text;
      var room = messageData.roomname;
      var time = moment(messageData.createdAt).fromNow();
      var $element = $('<div class="chat"></div>');
      $element.append('<span class="username">' + user + '</span><span> </span>');
      $element.append('<span class="time"> ' + time + ' </span>');
      $element.append('<div class="message">' + message + ' </div>');
      $('#chats').append($element);
    }
  },

  addNewMessages: function(messagesData, count) {
    $('.room-title').text(app.activeChatRoom || 'All Rooms');
    app.clearMessages();
    if (!app.activeChatRoom) {
      for (var i = 0 ; i < count ; i++ ) {
        app.addMessage(messagesData[i]);
      }
    } else {
      for (var i = 0 ; i < messagesData.length ; i++) {
        if ( messagesData[i].roomname === app.activeChatRoom ) {
          app.addMessage(messagesData[i]);
        }
      }
    }
    app.highlightFriends();
  },

  displayUserName: function() {
    var userName = app.getUserName();
    $('.current-user-input-container .name').text(userName);
  },

  createMessage: function() {
    var sendMsg = {
      'username': app.getUserName(),
      'text': $('.current-user-input-container #message').val(),
      'roomname': (app.activeChatRoom || 'default room')
    };
    return sendMsg;
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        $('.current-user-input-container #message').val('');
      },
      error: function() {
        throw "Could not send message";
      }
    });
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  addRoom: function(room) {
    var $room = $('<div class="room"><a href="#">' + room + '</a></div>');
    $('#roomSelect').append($room);
  },

  roomList: {},

  friendList: {},

  updateChatRooms: function(allChats) {
    for (var i = 0 ; i < allChats.length ; i++ ) {
      var room = allChats[i].roomname;
      if ( app.roomList[room] === undefined && app.stringIsClean(room) ) {
        app.roomList[room] = true;
        app.addRoom(room);
      }
    }
  },

  addFriend: function(username) {
    if (app.friendList[username] === undefined) {
      var $friend = $('<div class="friend">' + username + '</div>');
      $('#friendSelect').append($friend);
      app.friendList[username] = true;
      app.highlightFriends();
    }
  },

  highlightFriends: function() {
    $('#chats .username').each(function(key, val) {
      for (var friend in app.friendList) {
        if ($(val).text() ===  friend) {
          $(val).addClass('highlight');
        }
      }
    });
  }

};

app.fetch();
$(document).ready(function(){
  app.init();
  $('#send').on('submit', function(e) {
    e.preventDefault();
    app.send(app.createMessage());
  });
  $('body').on('click', '.room', function(e) {
    e.preventDefault();
    var room = $(this).find('a').text();
    room === 'All Rooms' ? (app.activeChatRoom = false) : (app.activeChatRoom = room);
    app.fetch();
  });
  $('#add-room').click(function(e) {
    e.preventDefault();
    var $room = $(this).prev('input');
    app.addRoom($room.val());
    $room.val('');
  });
  $('body').on('click', '.chat .username', function(e) {
    var friend = $(this).text();
    friend =
    app.addFriend(friend);
  });
});
