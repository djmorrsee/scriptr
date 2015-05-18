var ScriptrDocument = function (change_callback) {
  this.textBox = $("#input-box");

  this.textBoxValue = this.textBox.val();
  this.change_callback

  var self = this
  this.textBox.on('change keyup paste', function () {
    var changes = self.TextChanged();
    change_callback(changes)

  })

};

ScriptrDocument.prototype.PrintDocument = function () {
  console.log(this.textBoxValue);
  console.log(this.textBox.val());
};

ScriptrDocument.prototype.SetText = function (text) {
  this.textBox.val(text);
  this.textBoxValue = text;
};

ScriptrDocument.prototype.TextChanged = function () {
  var new_val = this.textBox.val();
  if (new_val === this.textBoxValue)
    return;

  var difference = FindChanges(this.textBoxValue, new_val);
  this.textBoxValue = new_val;

  return difference;
};
