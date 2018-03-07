/*
jQuery lookalike helping functions to GJ {}

*/
(function(gj) {

    gj._ = function(selector) {
        gj._.files = [];

        if (typeof selector === 'object') { //just sending element trough so that we get access to extend object
            gj._.files = selector;
            return gj._;
        }

        var selectorType = 'querySelectorAll';
        /*if (selector.indexOf('#') === 0) {
            selectorType = 'getElementById';
            selector = selector.substr(1, selector.length);
        }*/

        var selectResult = document[selectorType](selector);

        if (selectResult === null) {
            gj._.files = [];
            return gj._;
        }
        // console.error(typeof selectResult, selectResult, selectResult.length, 'selector: ', selectorType, selector);

        if (typeof selectResult === "object" && !selectResult.length) {
            gj._.files = [selectResult];
        } else {
            gj._.files = selectResult;
        }
        return gj._;
    };

    gj._._classReg = function(className) {
        return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    };
    gj._.hasClass = function(elem, c) {
        return gj._._classReg(c).test(elem.className);
    };


    gj._.removeClass = function(c, elm) {

        if (elm) {
            if (gj._.hasClass(elm, c)) {
                elm.className = elm.className.replace(gj._._classReg(c), ' ');
            }
            return;
        };

        var elementLength = gj._.files.length;
        for (var i = 0; i < elementLength; i++) {
            var elm = gj._.files[i];
            if (gj._.hasClass(elm, c)) {
                elm.className = elm.className.replace(gj._._classReg(c), ' ');
            }
        }
    };
    gj._.addClass = function(c, elm) {

        if (elm) {
            if (!gj._.hasClass(elm, c)) {
                elm.className = elm.className + ' ' + c;
            }
            return;
        };

        var elementLength = gj._.files.length;
        for (var i = 0; i < elementLength; i++) {
            var elm = gj._.files[i];
            if (!gj._.hasClass(elm, c)) {
                elm.className = elm.className + ' ' + c;
            }
        }
    };

    gj._.toggleClass = function(c) {
        var elementLength = gj._.files.length;
        for (var i = 0; i < elementLength; i++) {
            var elem = gj._.files[i];
            var fn = gj._.hasClass(elem, c) ? gj._.removeClass : gj._.addClass;
            fn(c, elem);
        }
    };
    gj._._createNodeAndAddToDOM = function(newElement, elem, fnName) {

        var newHTMLElement = newElement;
        if (typeof newElement === "string") {

            tempDiv = document.createElement('div');
            tempDiv.innerHTML = newElement;
            newHTMLElement = tempDiv.childNodes[0];
        }
        console.error('_createNodeAndAddToDOM :: ' + fnName, 'newHTMLElement: ' + newHTMLElement, ' elem: ' + elem)
        var runFunction = function(elem) {
            var parent = elem.parentNode;
            if (fnName === 'appendChild' || fnName === 'insertBefore') {
                console.error('ELEMENT IS ALSO PARENT ');
                parent = elem;
            }
            console.error('test ', newElement, 'fnName ' + fnName, 'parent :' + parent, 'elm ' + elem);
            if (!parent) return;
            parent[fnName](newHTMLElement, fnName === 'insertBefore' ? elem.childNodes[0] : elem);
        };


        if (elem) {
            runFunction(elem);

        } else {
            var elementLength = gj._.files.length;
            for (var i = 0; i < elementLength; i++) {
                var el = gj._.files[i];
                console.error(i + ') elm ', el, typeof el, 'parent :', el.parentNode, fnName);
                runFunction(el);
            }
        }
        return true;
    };


    gj._.replace = function(newElement, elem) {
        return gj._._createNodeAndAddToDOM(newElement, elem, 'replaceChild');
    };


    gj._.append = function(newElement, elem) {
        return gj._._createNodeAndAddToDOM(newElement, elem, 'appendChild');
    };


    gj._.prepend = function(newElement, elem) {
        return gj._._createNodeAndAddToDOM(newElement, elem, 'insertBefore');
    };


    gj._.empty = function(elem) {
        var cNode;
        //return gj._;
        if (elem) {
            cNode = elem.cloneNode(false);
            elem.parentNode.replaceChild(cNode, elem); //empty container

        } else {
            var elementLength = gj._.files.length;
            for (var i = 0; i < elementLength; i++) {
                var el = gj._.files[i];
                cNode = el.cloneNode(false);
                cNode.parentNode = el.parentNode;
                el.parentNode.replaceChild(cNode, el); //empty container
                gj._.files[i] = cNode;
            }
        }
        return gj._;
        //return this;
    };

    // status funker ikke helt
    gj._.emptyElementAndAppend = function(newElement, elem) {
        gj._.empty(elem);
        gj._.append(newElement, elem);
    };

})((window.gj = window.gj || {}));
