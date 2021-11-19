const { v4: uuidv4 } = require('uuid');
module.exports = {
    Command: function(input){
        let uuid = uuidv4(); 
        let Parent = input[0]
        let className = input[1]
        let href = input[2]
        input.splice(0,3)
        let Children = input.join(";")
        let secondPart = ""
        if(Children !== ""){
          secondPart = `((parent) => {${Children}})(InternalUUID)`
        }
        return(`(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',${Parent},parent, InternalUUID, ${className}); let NewElement = ReactfulElement('a',${Parent},parent, "${uuidv4()}", "hidden_tag"); components.push(ElementWeWant); NewElement.Element.href = ${href}; MontiorInputs(InternalUUID, "click", (value) => { if (!(${href} === window.location.pathname)) { history.move(${href});} });; ${secondPart}})();`)
    },
    Dependencies: function(){
      return(false)
    }
  }