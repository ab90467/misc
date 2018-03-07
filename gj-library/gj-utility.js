(function(gj) {

    // take a namespace string (example: GJ widget ID string)
    // and give back the function (or whatevever 'string' point to in scope) in window|scope if exist
    //
    var getFunctionFromString = function(string, scope) {
        scope = scope || window;
        if (!string || typeof string !== 'string') {
            return false;
        }
        var scopeSplit = string.split('.');
        var key = false;
        var i = 0;

        for (i = 0; i < scopeSplit.length - 1; i++) {
            key = scopeSplit[i];
            var oldScope = scope;

            var index = false;

            if (key.match(/\[(\d.*)\]/)) { //support string width 'arrayref' in
                var arr = key.match(/^(.*)\[(\d.*)\]/);
                key = arr[1];
                index = arr[2];
            }

            scope = scope[key];

            if (index) {
                scope = scope[index];
            }

            if (scope === undefined) { //try next obj ref before giving up
                i++;
                key = scopeSplit[i];
                scope = oldScope[key];
                if (scope === undefined) {
                    //console.error('gj.utility.getFunctionFromString():: ERROR, unable to resolve anything from string "' + string +'"');
                    return;
                }
            }
        }
        key = scopeSplit[scopeSplit.length - 1];
        // if try next was done just return scope
        var retObj = (i === scopeSplit.length) ? scope : scope[key];

        return retObj;
    };


    // public API
    gj.utility = {
        getFunctionFromString: getFunctionFromString
    };
})((window.gj = window.gj || {}));
