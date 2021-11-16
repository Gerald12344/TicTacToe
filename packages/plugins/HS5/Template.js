
module.exports = {
    Command: function (input) {
        return `generateModernTemplate(${input[0]}).aInternal`;
    },
    Dependencies: function () {
        return(false);
    },
};
