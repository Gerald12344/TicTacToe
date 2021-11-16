module.exports = {
  Command: function(input){
    return(`fs.readFileSync(${input[0]},'utf-8')`)
  },
  Dependencies: function(){
    return('let fs = require("fs")')
  }
}