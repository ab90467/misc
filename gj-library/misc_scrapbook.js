// https://blog.garstasio.com/you-dont-need-jquery/utils/
// Combine and copy objects

// example use - updates o1 with the content of o2
// extend(o1, o2);

// example use - creates a new object that is the aggregate of o1 & o2
// var newObj = extend(extend({}, o1), o2);

// example use - creates a new object that is a copy of o1
// var copyOfO1 = extend({}, o1);

function extend(first, second) {
    for (var secondProp in second) {
        var secondVal = second[secondProp];
        // Is this value an object?  If so, iterate over its properties, copying them over
        if (secondVal && Object.prototype.toString.call(secondVal) === "[object Object]") {
            first[secondProp] = first[secondProp] || {};
            extend(first[secondProp], secondVal);
        } else {
            first[secondProp] = secondVal;
        }
    }
    return first;
};

//https://blog.garstasio.com/you-dont-need-jquery/events/

var events = (function() {

    // example
    /*
    $('#my-list').on('click', 'BUTTON', function() {
        // button action
    });
    */

    document.getElementById('my-list').addEventListener('click', function(event) {
        var clickedEl = event.target;
        if (clickedEl.tagName === 'BUTTON') {
            // button action
        }
    });
    /*
    $(document).ready(function() {
        // markup is on the page
    });
    */

    document.addEventListener('DOMContentLoaded', function() {
        // markup is on the page
    });

    return {

    };
})();

// jQuery $.data replacer
// var one = document.getElementById('one');
// data.set(one, {testkey: 'testvalue'});
// var value= data.get(one).testkey

var data = (function() {
    var lastId = 0,
        store = {};

    return {
        set: function(element, info) {
            var id;
            if (element.myCustomDataTag === undefined) {
                id = lastId++;
                element.myCustomDataTag = id;
            }
            store[id] = info;
        },

        get: function(element) {
            return store[element.myCustomDataTag];
        }
    };
}());

// jQuery selector replacer
window.select = function(selector) {
    var selectorType = 'querySelectorAll';

    if (selector.indexOf('#') === 0) {
        selectorType = 'getElementById';
        selector = selector.substr(1, selector.length);
    }

    return document[selectorType](selector);
};

// https://blog.garstasio.com/you-dont-need-jquery/dom-manipulation/
var add = (function() {
    var _domAddElmAsString = function(selector, fn, elm) {
        return select(selector).insertAdjacentHTML(fn, elm);
    };
    var _domAddElm = function(selector, fn, elm) {
        return select(selector)[fn](select(elm));
    };
    return {
        append: function(selectorString, elm) {
            if (typeof select(elm) === 'object') {
                return _domAddElm('appendChild', elm);
            }
            return _domAddElmAsString('selectorString', 'beforeend', elm);
        }
    };
})();
