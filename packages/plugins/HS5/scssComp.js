const sass = require('sass');

module.exports = {
    Command: function (input) {
        let result = sass.renderSync({
            data:`${input[0]}`,
            indentType: "space",
            indentWidth: 1
        });
        return `"${(result.css.toString()).replace(/\n/g, "")}"`;
    },
    Dependencies: function () {
        return(false);
    },
};
