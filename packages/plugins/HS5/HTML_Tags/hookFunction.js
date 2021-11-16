module.exports = {
    Command: function (input) {
        let propss = [...input]
        propss.forEach((e, i) => {
            if (i + 1 === propss.length) return;
            propss[i] = e.replace('"', "").replace('"', "");
        });
        let last = propss[propss.length - 1];
        propss.splice(propss.length - 1, 1);

        propss.shift()
        return `function ${input[0]
            .replace('"', "")
            .replace('"', "")}(${propss.join(",")}){let useUpdateArray=[];${last}}`;
    },
    Dependencies: function () {
        return false;
    },
};
