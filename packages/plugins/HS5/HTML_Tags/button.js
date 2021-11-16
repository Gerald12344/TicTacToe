
module.exports = {
  Command: function (input) {
    let Parent = input[0]
    let className = input[1]
    let clickCallback = input[2]
    input.splice(0, 2)
    input.splice(input.length - 1, 1)
    let Children = input.join(";")
    let secondPart = ""
    if (Children !== "") {
      secondPart = `((parent) => {${Children}})(InternalUUID)`
    }

    return (`(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',${Parent},parent, InternalUUID, ${className}); ${typeof clickCallback !== 'undefined' ? `ElementWeWant.Element.addEventListener("click", function(e) {${clickCallback}; }); ` : ""} components.push(ElementWeWant); ${secondPart}})();`)
  },
  Dependencies: function () {
    return (false)
  }
}