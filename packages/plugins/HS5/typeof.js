module.exports = {
    Command: function(input){
      return(`typeof ${input[0]}`)
    },
    Dependencies: function(){
      return(false)
    }
  }