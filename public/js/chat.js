var ChatClient = function () {
  var self = this;

  this.ChatBox = $("#chat-window");
  this.ChatField = $("#chat-input");
  this.NameBox = $('#chat-name');
  this.Name

  var _makedigit = function () { return Math.floor(Math.random() * 10).toString() }
  if (this.NameBox.val() === '') {
    self.Name = 'user' +  _makedigit() + _makedigit() + _makedigit() + _makedigit()
    self.NameBox.val(self.Name)
  } else {
    self.Name = self.NameBox.val()
  }
  self.NameBox.on('change', function () {
    var val = self.NameBox.val()
    console.log(val.length)
    if (val.length > 16) {
      val = val.slice(0, 16)
      self.NameBox.val(val)
    }
    self.Name = val
  })



  var MakeMessage = function(user, message) {
    var pre = '<div class="chat-message"><b>' + user + ': </b>'
    var post = '<\/div>'
    user = user + ': '

    self.ChatBox.append(pre + message + post);
  }
  this.MakeMessage = MakeMessage


  this.ChatField.on('keypress', function (key) {
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

ChatClient.prototype.ReceiveMessage = function (message) {
  // Put Message in Chat
  this.MakeMessage(message.user, message.message);
};
