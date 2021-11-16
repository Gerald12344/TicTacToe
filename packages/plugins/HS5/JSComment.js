// A simple way to add js comments
module.exports = {
    Command: function(input){
      return(`/*${input}*/`)
    },
    Dependencies: function(){
      return(false)
    }
  }