module.exports = {
  Command: function(input){
    return(`${input[0]}.addEventListener(${input[1]},${input[2]},false)`)
  },
  Dependencies: function(){
    return(false)
  }
}