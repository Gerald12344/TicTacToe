// This basically makes the parent for all the rendering stuff
module.exports = {
  Command: function (input) {
    let parent = input[0]
    input.splice(0, 1)
    let children = input.join(";")
    return (`return (() => {
      /* Basic Component Renderer */
      let parent = ${ parent };
      let components = [];
      /* Function To Remove Component*/
      ${ children };
      return (() => {
        if (typeof useUpdateArray !== 'undefined') {
          removeComponents(components, useUpdateArray)
        } else {
          removeComponents(components)
        }
      })
    })()`.trim().replace(/\n|\r|\t/g, ""))
  },
  Dependencies: function () {
    return (`/* This library uses the new Harv Script Component System */ `)
  }
}
