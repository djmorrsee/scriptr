var ScriptrDocument = function (change_callback) {
  var self = this

  this.textBox = $("#document-pane");
  this.textBoxValue = this.textBox.val();

  this.change_callback

  this.textBox.keydown(function(e) {
    if (e.keyCode === 9) {
      var start = this.selectionStart;
      var end = this.selectionEnd;

      var $this = $(this)
      var value = $this.val();

      $this.val(value.substring(0, start) + '\t' + value.substring(end));
      $this.selectionStart = this.selectionEnd = start + 1;

      e.preventDefault();

    }
  })
  this.textBox.on('change keyup paste', function (e) {
    if(e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18)
      return

    var changes = self.TextChanged();
    change_callback(changes)

  })

  this.textBox.on('focus', function(e){
  });

};

ScriptrDocument.prototype.PrintDocument = function () {
  console.log(this.textBoxValue);
  console.log(this.textBox.val());
};

ScriptrDocument.prototype.EditText = function (text) {

  console.log(text);
  var current = this.textBoxValue = this.textBox.val();
  var cursor_pos = this.textBox[0].selectionStart;

  var new_text

  if (text.additive) {
    new_text = current.slice(0, text.position) + text.chars + current.slice(text.position)
  } else {
    new_text = current.slice(0, text.position) + current.slice(text.position + text.count)
  }

  this.SetText(new_text);

  if (cursor_pos < text.position) {
    this.textBox[0].selectionStart = cursor_pos;
    this.textBox[0].selectionEnd = cursor_pos;
  } else {
    this.textBox[0].selectionStart = cursor_pos + text.chars.length;
    this.textBox[0].selectionEnd = cursor_pos + text.chars.length;
  }
}

// Takes in normal string, formats to html
ScriptrDocument.prototype.SetText = function (text) {
  var cursor_pos = this.textBox[0].selectionStart;

  this.textBox.val(text);
  this.textBoxValue = text;

  this.textBox[0].selectionStart = cursor_pos;
  this.textBox[0].selectionEnd = cursor_pos;
};

ScriptrDocument.prototype.TextChanged = function () {
  var new_val = this.textBox.val();

  if (new_val === this.textBoxValue)
    return;

  var difference = FindChanges(this.textBoxValue, new_val);
  this.textBoxValue = new_val;

  return difference;
};
