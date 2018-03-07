/*
  gj.app object
    object for holding app spesific values.
 
  USAGE
    1) fetch gj-app-* values from startup GJL DOM node in order to publish values into app
    2) misc values that is natural to think is a "application value"  you want to be available across modules
*/
(function(gj) {

    config = {};
    //find all GJL DOM elements with <attrName> = gj-app-* and add <attrValue> to gj.app.config.<attrName>
    var findAllAppProperties = function() {
        var elm = document.querySelectorAll('div[gjl-id]')[0];
        var attrList = [].filter.call(elm.attributes, function(attribute) {
            return /^gj-app-/.test(attribute.name);
        });

        var elementLength = attrList.length;
        for (var i = 0; i < elementLength; i++) {
            var attrArray = attrList[i].name.match(/gj-app-(.*)$/);
            //console.error('findAllAppProperties ', attrList[i].name, attrArray[1], attrList[i].value);
            if (attrArray && attrArray[1]) {
                setAppProperty(attrArray[1], attrList[i].value);
            }
        }
    };

    var setAppProperty = function(attrName, value) {
        config[attrName] = value;
        return true;
    };

    var getAppProperty = function(attrName) {
        return config[attrName] || undefined;
    };

    gj.app = {
        getAppProperty: getAppProperty,
        setAppProperty: setAppProperty,
        findAllAppProperties: findAllAppProperties,
        config: config
    };
})(window.gj ? window.gj : (window.gj = {}));
