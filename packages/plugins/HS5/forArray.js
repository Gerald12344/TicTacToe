module.exports = {
    Command: function (input) {
        return `${input[0]}.forEach(${input[1]})`;
    },
    Dependencies: function () {
        return(false);
    },
};