
module.exports = {
    Command: function (input) {
        return `useHook(${input[0]})`;
    },
    Dependencies: function () {
        return false;
    },
};
