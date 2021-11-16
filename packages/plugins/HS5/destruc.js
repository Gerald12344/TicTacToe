module.exports = {
    Command: function(input){
      return(`[${input.join(",")}]`)
    },
    Dependencies: function(){
      return(false)
    }
  }