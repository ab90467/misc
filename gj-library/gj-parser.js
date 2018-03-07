(function(gj) {
    gj.parser = {

        start: function(scopeID) {

            var scope = scopeID ? document.querySelector("#" + scopeID) : document;
            if (!scope) {
                console.error("gj-parser:: ERROR: parser scope is wrong " + scopeID);
                return false;
            }
            var list = scope.querySelectorAll('div[gjl-id]');
            var elementLength = list.length;
            for (var i = 0; i < elementLength; i++) {

                var element = list[i];
                var gjlID = element.getAttribute('gjl-id');
                element.removeAttribute('gjl-id');
                var json = element.getAttribute('gjl-config');
                element.removeAttribute('gjl-config');
                element.setAttribute('gj-loading', gjlID);
                var orgJson = json;
                if (json && json !== "") {
                    try {
                        json = json.replace(/\'/g, '"');
                        json = json.replace(/\\"/g, '\''); // upps!! escaped ' become escaped ", reverse this again before
                        json = JSON.parse(json); // create js obj and send config into widgets init()
                    } catch (e) {
                        console.error("gj-parser:: ERROR: '" + json.id + "': json parsing of config:\n\n" + orgJson + " \n\nwith error: ", e);
                        json = {};
                    }
                } else {
                    json = {};
                }

                json.id = element.getAttribute('id') || undefined;
                json.class = element.getAttribute('class') || undefined;
                //console.log(element, json.id, json.class, json);

                var gjLIB = gj.utility.getFunctionFromString(gjlID) || false;
                if (!gjLIB || typeof gjLIB.init !== "function") {
                    console.error("gj-parser:: ERROR: object '" + gjlID + "' is not defined in page -need to include a js file?");
                    continue;
                }
                if (typeof gj.lifecycleManager === 'object') {
                    gj.lifecycleManager.checkForLifeCycleFunctions(json.id, element, gjLIB);
                }
                if (window.jQuery) {
                    element = $(element);
                }
                gjLIB.init(element, json, json.id);
            }
        }
    };
    //startup parser!
    (function() {
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof gj.event === "object") {
                gj.event.autoSetup();
            }
            if (typeof gj.form === "object") {
                gj.form.autoSetup();
            }
            if (typeof gj.app === "object") {
                gj.app.findAllAppProperties();
            }
            gj.parser.start();
        });
    })();
})(window.gj = window.gj || {});
