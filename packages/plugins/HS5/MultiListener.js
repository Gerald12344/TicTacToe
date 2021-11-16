module.exports = {
    Command: function(input){
      return(`${input[0]}.addListener(${input[1]});`)
    },
    Dependencies: function(){
      return(false)
    }
  }