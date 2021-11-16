
module.exports = {
    Command: function (input) {
        return `if(typeof useUpdateArray === 'undefined'){console.log('%c[Harv-Script]' + '%c - Failed, incorrect use of hooks, useUpdate can only be used inside a hookFunction!','color:#00B5E2','color:white');logError('Failed, incorrect use of hooks, useUpdate can only be used inside a hookFunction!')}else{useUpdateArray.push(useUpdate(${input[0]},${input[1]}))}`;
    },
    Dependencies: function () {
        return false;
    },
};
