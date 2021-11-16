module.exports = {
  Command: function(input){
    return(`Number(${input[0]})`)
  },
  Dependencies: function(){
    return(false)
  }
}