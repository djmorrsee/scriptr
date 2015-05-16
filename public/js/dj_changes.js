function FindChanges(old, _new) {
	var additive = old.length < _new.length;
	
	// Embedded Function for Returning an Object
	var final = function(s, e) {
	
		obj = new Object();
		obj.additive = additive;
		obj.range = [s, e];
		obj.chars = additive ? _new.slice(s, e+1) : old.slice(s, e+1);
		
		return obj;	
	};
	
	// Local Vars
	var start = 0,
		oldend = old.length-1, 
		newend = _new.length-1;
		
	
	// Find Start Index of Change
	for(var i = 0; i < old.length; ++i) {
		if (old[start] !== _new[start])
			break;
		start += 1;
	}
	
	// Change Goes Until the End
	if(start === old.length || start === _new.length) {
		var end = additive ? _new.length - 1 : old.length - 1;
		return final(start, end);
	}
	
	// Find End Index of Change
	for(var i = 0; i < old.length; ++i) {
		if (old[oldend] !== _new[newend]) 
			break;
			
		// One of the strings was fully searched, the unsearched indeces are the changes
		if(start === newend || start === oldend) {
			var end = additive ? newend : oldend;
			return final(start, end-1);
		}

		oldend -= 1;
		newend -= 1;

	}
	
	var end = additive ? newend : oldend;
	return final(start, end);	

}
