var ScriptrDocument = function (change_callback) {
  var self = this

  this.textBox = $("#document-box");
  this.textBoxValue = StripHTML(this.textBox.html());

  this.change_callback

  this.textBox.on('change keyup paste', function (e) {
    if(e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18)
      return

    var raw = self.textBox.html();
    if(StripHTML(raw) === self.textBoxValue)
      return

    var cleaned = CleanHTML(raw);
    if(raw !== cleaned) {
      self.textBox.html(cleaned)
    }


    var changes = self.TextChanged();
    change_callback(changes)

  })

  this.textBox.on('focus', function(e){
  });

};

ScriptrDocument.prototype.PrintDocument = function () {
  console.log(this.textBoxValue);
  console.log(StripHTML(this.textBox.html()));
};

// Takes in normal string, formats to html
ScriptrDocument.prototype.SetText = function (text) {
  this.textBox.html(EmbedHTML(text));
  this.textBoxValue = text;
};

ScriptrDocument.prototype.TextChanged = function () {
  var new_val = StripHTML(this.textBox.html());

  if (new_val === this.textBoxValue)
    return;

  var difference = FindChanges(this.textBoxValue, new_val);
  this.textBoxValue = new_val;

  return difference;
};
