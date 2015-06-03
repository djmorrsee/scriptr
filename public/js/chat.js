var ChatClient = function () {
  // Close this
  var self = this;

  self.ChatBox = $("#chat-window");
  self.ChatField = $("#chat-input");
  self.NameBox = $('#chat-name');
  self.ThisUser = $('#this-user')
  self.Name


  // Initialize Username
  var _makedigit = function () { return Math.floor(Math.random() * 10).toString() }
  if (self.NameBox.val() === '') {
    self.Name = 'user' +  _makedigit() + _makedigit() + _makedigit() + _makedigit()
    self.NameBox.val(self.Name)
  } else {
    self.Name = self.NameBox.val()
  }

  // Change Username
  var EmbedName = function(name) {
    self.ThisUser.html('- ' + name)
  }
  EmbedName(self.Name);

  self.NameBox.on('change', function () {
    var val = self.NameBox.val()


    // 16 Character Limit
    if (val.length > 16) {
      val = val.slice(0, 16)
      self.NameBox.val(val)
    }
    EmbedName(val)
    self.Name = val

    // Send over Wire
    scriptr.socket.SendNameChange(self.Name);
  })

  // HTML Embedding for Chat Messages
  var MakeMessage = function(user, message) {
    var pre = '<div class="chat-message"><b>' + user + ': </b>'
    var post = '<\/div>'
    user = user + ': '

    self.ChatBox.append(pre + message + post);
  }
  self.MakeMessage = MakeMessage

  // Intercept 'Enter' on Chat Box
  self.ChatField.on('keypress', function (key) {
    if (key.keyCode === 13) {

      // Submit The Chat Message
      var message = self.ChatField.val();

      if (message === '') {
        return;
      }

      scriptr.socket.SendChatMessage(self.Name, message);

      self.ChatField.val('')
      self.ChatField.focus();
    }
  });
};

ChatClient.prototype.EditUserList = function (users) {
  var pre = '<div class="user">- '
  var post = '<\/div>'
  var list = $('#other-users')

  var results = ''
  users.forEach(function (e) {
    results += pre + e + post
  })
  list.html(results);
};

ChatClient.prototype.ReceiveMessage = function (message) {
  // Put Message in Chat
  this.MakeMessage(message.user, message.message);
};
