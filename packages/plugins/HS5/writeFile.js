module.exports = {
  Command: function(input){
    return(`fs.writeFileSync(${input[0]},${input[1]},(${input[2]})=>{${input[3]}});`)
  },
  Dependencies: function(){
    return('let fs = require("fs")')
  }
}