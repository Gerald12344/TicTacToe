module.exports = {
  Command: function(input){
    return(`while(${input[0]}){${input[1]}}`)
  },
  Dependencies: function(){
    return(false)
  }
}