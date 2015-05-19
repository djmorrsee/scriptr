var _stripDiv = function (buffer) {
  return buffer.replace(/<\/div>$/, '')
}

var CleanHTML = function (buffer) {
  //// Browser Formats
  // Strip Bold Tags
  buffer = buffer.replace(/<b>/g, '').replace(/<\/b>/g, '')
  return buffer
}

var StripHTML = function (buffer) {

  // Remove Leading Div (fixes off by one with the split)
  buffer = buffer.replace(/<div><\/div>/g, '')
  buffer = buffer.replace(/^<div>/, '')

  // Split At Divs, Remove <br> tags
  buffer = buffer.split('<div>').map(function (line, index){
    return _stripDiv(line).replace(/<br>/g, '')
  })

  // Replace Special Chars
  var stripped = buffer.join('\n').replace(/&nbsp;/g, ' ')
  return stripped
}

var EmbedHTML = function (buffer) {
  var lines = buffer.split('\n')
  // console.log(lines);
  buffer = buffer.split('\n').map (function (line, index) {
    if (line === '')
      line = '<br>'
    return '<div>' + line + '</div>'
  }).join('');
  return buffer
}
