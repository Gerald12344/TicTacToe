module.exports = {
    Command: function (input) {
        return `ReactFulVariableMaker(${input[0]})`;
    },
    Dependencies: function () {
        return `let ReactFulVariableMaker = (interal, moreData, extraData) => { return { acompanyingData: moreData, eventMoreData: extraData, aInternal: interal, hooks: {}, aListener: function (val) {}, set update(val) { this.aInternal = val; Object.entries(this.hooks).forEach( ([key, value]) => { value(val); } ); this.aListener(val); }, get update() { return this.aInternal; }, registerListener: function (listener) { this.aListener = listener; }, addListener: function (listener) { let uuid = uuidv4(); this.hooks[uuid] = listener; return uuid; }, removeListener: function (listener) { delete this.hooks[listener]; }, }; };`;
    },
};

