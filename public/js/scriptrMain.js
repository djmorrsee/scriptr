
var oldVal = $(scriptBox).val();

$(scriptBox).on('change keyup paste', function() {
	var newVal = $(scriptBox).val();
	if (newVal == oldVal) {
		return;
	}
	
	var changes = FindChanges(oldVal, newVal)
	SendMessage(changes.range[0], changes.additive, changes.range[1] - changes.range[0] + 1, changes.chars, '');
	//~ var oldString = oldVal.split('');
	//~ var newString = newVal.split('');
	//~ 
	//~ var isDelete = false;
	//~ 
	//~ var shortString = oldString;
	//~ var longString = newString;
	//~ 
	//~ if (oldString.length > newString.length) {
	//~ 	isDelete = true
	//~ 	shortString = newString;
	//~ 	longString = oldString;
	//~ }
	//~ 
	//~ var i = 0;
	//~ for (i = 0; i < shortString.length; i++) {
	//~ 	if (longString[i] != shortString[i]) {
	//~	 		break;
	//~ 	}
	//~ }
	//~ var changeStart = i;
	//~ var changeEnd = 0;
	//~ for (var x = 0; x < longString.length; x++) {
	//~ 	if (longString[longString.length-x] != shortString[shortString.length-x]) {
	//~ 		changeEnd = (longString.length-x)+1;
	//~ 		break;
	//~ 	}
	//~ }
	//~ 
	//~ if (changeStart > changeEnd) {
	//~ 	var temp = changeStart;
	//~ 	changeStart = changeEnd;
	//~ 	changeEnd = temp;
	//~ }
	//~ if (changeEnd == changeStart)
	//~ 	changeEnd++;
	//~ 
	//~ var finalArray = longString.slice(changeStart, changeEnd);
	//~ var changed = finalArray.join('');
	//~ if (finalArray[0] == " " && finalArray[finalArray.length-1] != " " && changed.charAt(0) != " ")
	//~ 	changed = " " + changed;
	//~ else if (finalArray[finalArray.length-1] == " " && finalArray[0] != " " && changed.charAt(finalArray.length-1) != " ")
	//~ 	changed = changed + " ";
	//~ 
	//~ debug (changed, changeStart, changeEnd, isDelete);
	//~ 
	//~ receiveChange(changed, changeStart, changeEnd, isDelete);
	//~ 
	oldVal = newVal;
	
});

function debug (text, start, end, isDelete) {
		if (!isDelete) {
			//document.getElementById("scriptBox2").value = "added: " + changed;
			console.log("added:" + text);
		}
		else {
			//document.getElementById("scriptBox2").value = "deleted: " + changed;
			console.log("deleted:" + text);
		}

		//console.log(changeStart);
		//console.log(changeEnd);
}

function test () {
	console.log('woo')
}
	
function receiveChange(changedString, start, end, isDelete) {
	var current = $(scriptBox2).val();
	var finalText = "";
	if (!isDelete) {
		finalText = current.slice(0, start) + changedString + current.slice(start);
	} else {
		finalText = current.slice(0, start) + current.slice(end);
	}
	document.getElementById("scriptBox2").value = finalText;
}
