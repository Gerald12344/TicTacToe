
module.exports = {
    Command: function (input) {
        return `booleanComponentRendering(${input[0]}, ${input[1]}, ${input[2]})`;
    },
    Dependencies: function () {
        return false;
    },
};
