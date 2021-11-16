module.exports = {
    Command: function(input){
      return(input.join("+")) // What to return when called
    },
    Dependencies: function(){
      return(false) // No Dependencies
    }
  }