var ScriptrDocument = function (change_callback) {
  var self = this
  var selection, range

  this.textBox = $("#document-box");
  this.textBoxElement = document.getElementById('document-box')
  this.textSelection

  this.textBoxValue = StripHTML(this.textBox.html());
  this.change_callback

  var captureSelection = function(e) {
    // Don't capture selection outside editable region

     var isOrContainsAnchor = false,
         isOrContainsFocus = false,
         sel = window.getSelection(),
         parentAnchor = sel.anchorNode,
         parentFocus = sel.focusNode;

     while(parentAnchor && parentAnchor != document.documentElement) {
         if(parentAnchor == self.textBoxElement) {
             isOrContainsAnchor = true;
         }
         parentAnchor = parentAnchor.parentNode;
     }

     while(parentFocus && parentFocus != document.documentElement) {
         if(parentFocus == self.textBoxElement) {
             isOrContainsFocus = true;
         }
         parentFocus = parentFocus.parentNode;
     }

     if(!isOrContainsAnchor || !isOrContainsFocus) {
         return;
     }
     selection = window.getSelection();

     // Get range (standards)
     if(selection.getRangeAt !== undefined) {
         range = selection.getRangeAt(0);

     // Get range (Safari 2)
     } else if(
         document.createRange &&
         selection.anchorNode &&
         selection.anchorOffset &&
         selection.focusNode &&
         selection.focusOffset
     ) {
         range = document.createRange();
         range.setStart(selection.anchorNode, selection.anchorOffset);
         range.setEnd(selection.focusNode, selection.focusOffset);
     } else {
         // Failure here, not handled by the rest of the script.
         // Probably IE or some older browser
     }

  };


  var save_cursor = function () {
    var user_cursor = document.createElement('span')
    user_cursor.id = 'user_cursor'
    user_cursor.appendChild(document.createTextNode('%'))

    range.insertNode(user_cursor)
  }

  var replace_cursor = function () {
    var user_cursor = document.getElementById('user_cursor')
    if(user_cursor) {
      captureSelection();

      var range = document.createRange();
      range.selectNode(user_cursor)
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('delete', false, null)

    }

  }

  this.textBox.on('change keyup paste', function (e) {
    if(e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18)
      return
    console.log(e.keyCode)

    captureSelection();
    var raw = self.textBox.html();
    var cleaned = CleanHTML(raw);
    if(raw !== cleaned) {
      save_cursor()
      self.textBox.html(cleaned)
      replace_cursor()
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
