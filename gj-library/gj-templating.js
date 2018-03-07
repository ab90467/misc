/*
   contains all the template functions we ever need :)
   replace()
      take a template and a config and merge them. return template with data
      If values in template not correspond to keys in config the value in template will be used.
      Ex: {{My value not in config obj}} -> in DOM will be: My value not in config obj
      replace also filter template trough createVnodeTemplate() to make sure vnode
      elements in template will be taken care of

   setupAndplaceTemplate()
      has $el as input as well as config and template. optional JQplaceFunc as param
      default: Merged template and config will replace content of $el, but JQplaceFunc as input can override
      default jQurey replaceWith() func with any valid 'placefunction' (append, prepend etc)
      Function returns a promise with new template DOM element when done placing template in DOM.
      Last option input is a callbackfunction, that will be executed after template is placed in DOM.

      Finaly function will run gj.store.updateDOMinScope($html) where $html is DOM element of template
      in order to make sure DOM element gets updated with GJ.STORE values if needed.

   template:
      {{<my value>}}  Will fist be parsed against config object. If it does not exist there GJ will try to parse it
      against language object. If no luck there either the value will be returned back into template.
      tips: Use it to set correct laguage on labels without configurate other than the english lang-obj

      Supports looping within template
      example: config.info =[{key : onekey, data : mydata}]
      '{{STARTLOOPDATA = config.info}}' +
          '<DATA_EN>{{key}}</DATA_EN> <DATA_TO>{{data}}</DATA_TO>' +
      '{{ENDLOOPDATA}}'

      IF conditions within template is also supported:
      Just use any of the values in config obj. Ordinary javascript if evaluation
      '{{IF:testval}}' +
          '<div>JUHU testval er {{testval}}</div>' +
      '{{ENDIF:testval}}' +

*/

(function(gj) {
    // take a js object and transform it to text. Then we can use it in the DOM in the HTML page and
    // let the parser read it and use it
    var configObjToString = function(obj, elm) {
        if (typeof obj == "object") {
            try {
                obj = JSON.stringify(obj);
                obj = obj.replace(/\'/g, "\\\'"); //escape ' if it is a part of the string
                obj = obj.replace(/\"/g, "'");
                return obj;

            } catch (e) {
                console.error('ERROR gj.templating.configObjToString(): ' + e + '\nID:' + _temp.data.id + '\n\n' + gj.utility.objectTodebugString(_temp));
            }
        }
        return obj;
    };

    var doTheLoopingInTemplate = function(template, config) {
        //console.error('template', template);
        if (template && !template.match(/STARTLOOPDATA/)) {
            return template;
        }

        template = template.replace(/(\{\{STARTLOOPDATA.*?ENDLOOPDATA\}\})/g, function(match) {
            var loopTemplate = /STARTLOOPDATA(.*?)\{\{ENDLOOPDATA/g.exec(match);
            var listTemplate;

            if (loopTemplate && loopTemplate.length > 1) {
                for (var i = 1; i < loopTemplate.length; i++) {
                    var arr = /\=(.*?)\}\}(.*)/.exec(loopTemplate[i]);
                    var dataStringRef = arr[1];
                    listTemplate = arr[2];
                    var templateConfig = gj.utility.getFunctionFromString(dataStringRef, config);

                    listTemplate = loopData(listTemplate, templateConfig);
                }
                return listTemplate;
            }
            return " ";
        });

        return template;

    };

    var loopData = function(template, data) {
        var _temp = " ";
        for (var key in data) {
            _temp += replace(template, data[key]);
        }
        return _temp;
    };

    var evalValueInTemplate = function(template, data) {

        if (template && !template.match(/\{\{ENDIF/)) {
            return template;
        }

        template = template.replace(/(\{\{IF.*?ENDIF.*?\}\})/g, function(_string) {
            var arr = /IF\:(.*?)\}\}(.*?)\{\{ENDIF/g.exec(_string);
            var key = gj.utility.removingStartingAndTrailingSpace(arr[1]);

            if (key && data[key]) {
                return arr[2];
            } else {
                return "";
            }
        });
        return template;
    };

    // replace variable reference in template string with matching values in data OR from language object
    // returns populated template string
    var replace = function(template, data) {

        template = evalValueInTemplate(template, data);
        template = doTheLoopingInTemplate(template, data);


        var retTemplate = template.replace(/{{(.*?)}}/g, function(match, variable) {

            if (data && (data[variable] || data[variable] === 0)) {
                return configObjToString(data[variable]);

            } else {
                return gj.lang._(variable);
            }
        });

        if (gj.vdom) {
            retTemplate = gj.vdom.createVnodeTemplate(retTemplate);
        }

        //in some cases we want to keep everything of spaces etc 
        if (data.templateConfig && data.templateConfig === 'ignorespaces') return retTemplate

        retTemplate = retTemplate.replace(/\s+/g, " "); //cleanup spaces
        retTemplate = retTemplate.replace(/\s\"/g, "\""); //cleanup spaces II

        return retTemplate;
    };

    // main func taking config obj with JQ element, data, template and jQuery place function(optional)
    var setupAndplaceTemplate_OLDOLD = function(configObj, callbackfunction) {
        var deferred = $.Deferred();

        if (typeof configObj !== 'object' || !configObj.DOMelm.length || !(configObj.DOMelm instanceof jQuery) || !configObj.template) {
            var error = "gj.templating. setupAndplaceTemplate() :: error in config: " + JSON.stringify(configObj, false, 3);
            console.error(error);
            return deferred.reject(error);
        }
        var $html = $(replace(configObj.template, configObj.data));
        /*
        //TESTING!
        if(configObj.template.match(/taxupload_module/i)){
           console.error(replace(configObj.template,configObj.data));
           console.error($html.find('[gjl-id]').length);
        }*/

        var ret = false;
        if (configObj.JQplaceFunc && typeof configObj.JQplaceFunc === 'string') {
            try {
                ret = configObj.DOMelm[configObj.JQplaceFunc]($html);
                configObj.DOMelm.removeAttr('gj-loading');
            } catch (e) {
                console.error('gj.templating.setupAndplaceTemplate() :: ERROR: custom function \'' + configObj.JQplaceFunc + '\' throws error: ' + e);
                return deferred.reject(error);
            }
        } else if (configObj.DOMelmUsage && typeof configObj.DOMelmUsage === 'string') {
            if (configObj.DOMelmUsage === 'replace') {
                ret = configObj.DOMelm.replaceWith($html);
            } else if (configObj.DOMelmUsage === 'container') {
                ret = configObj.DOMelm.off().empty().append($html);
            } else {
                console.error('gj.templating.setupAndplaceTemplate() :: ERROR: No valid "DOMelmUsage" value:' + configObj.DOMelmUsage);
                return deferred.reject(error);
            }
        } else { //default
            ret = configObj.DOMelm.replaceWith($html);
        }


        setTimeout(function() {
            // DOM updated, run gj parser to find new GJL modules!
            // NB, elements on root in $html wll not be parsed since using find() ...
            if ($html.find('[gjl-id]').length) {
                gj.parser($html);
            }

            // callbacks to run after place new GJL module in DOM ?
            if (callbackfunction && typeof callbackfunction == "function") {
                try {
                    setTimeout(function() {
                        callbackfunction($html);
                    }, 0);
                } catch (e) {
                    console.error("ERROR: callback gj.templating.setupAndplaceTemplate() failes: " + e);
                }
            }
            // check if we have gj.store elements that need to get data populated into
            if (typeof gj.store === 'object' && gj.store.hasActiveStore() && gj.store.updateDOMinScope) {
                gj.store.updateDOMinScope($html);
            }
            if ($html.find('input').length) {
                $html.find('input[gj-form-format]').each(function() {
                    gj.form.postProcessInputValue($(this));
                });
            }

            setTimeout(function() {
                deferred.resolve($html);
            }, 0);
        }, 0);
        return deferred;
    };
    var setupAndplaceTemplate = function() {

    };
    // public api
    gj.templating = {
        configObjToString: configObjToString,
        replace: replace,
        setupAndplaceTemplate: setupAndplaceTemplate
    };
})(window.gj ? window.gj : {});
