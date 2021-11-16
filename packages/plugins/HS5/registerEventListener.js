module.exports = {
    Command: function(input){
      return(`${input[0]}.registerListener(${input[1]});`)
    },
    Dependencies: function(){
      return(false)
    }
  }