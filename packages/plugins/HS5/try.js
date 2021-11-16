module.exports = {
    Command: function(input){
      return(`try{${input[0]}}catch(error){${input[1]}}`)
    },
    Dependencies: function(){
      return(false)
    }
  }