module.exports = {
  Command: function(input){
    return(`setTimeout(${input[1]},${input[0]})`)
  },
  Dependencies: function(){
    return(false)
  }
}