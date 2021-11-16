module.exports = {
  Command: function(input){
    return(`console.log('hello', ${input})`) // What to return when called
  },
  Dependencies: function(){
    return(false) // No Dependencies
  }
}