module.exports = {
  Command: function(input){
    return(`setInterval(${input[0]}, ${input[1]})`) // What to return when called
  },
  Dependencies: function(){
    return(false) // No Dependencies
  }
}