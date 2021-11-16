module.exports = {
    Command: function(input){
      return(`"${input[0].replace(/\r?\n|\r/g, "")}"`)
    },
    Dependencies: function(){
      return(false)
    }
  }