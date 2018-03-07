var ajax = function() {
    // https://blog.garstasio.com/you-dont-need-jquery/ajax/

    var _param = function(object) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    };
    //https://stackoverflow.com/questions/3038901/how-to-get-the-response-of-xmlhttprequest
    var _readBody = function(xhr) {
        var data;
        if (!xhr.responseType || xhr.responseType === "text") {
            data = xhr.responseText;
        } else if (xhr.responseType === "document") {
            data = xhr.responseXML;
        } else {
            data = xhr.response;
        }
        return data;
    };

    _checkResponse = function(resp) {

    };

    //public API
    return {
        get: function(url) {
            var def = new Deferred();
            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (request.readyState === 4) {

                    if (request.status === 200) {
                        bio.innerHTML = request.responseText;
                    } else {
                        bio.innerHTML = 'An error occurred during your request: ' + request.status + ' ' + request.statusText;
                    }
                }
            }
            request.open('GET', url);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send();

            // example 2
            var xhr = new XMLHttpRequest();
            //xhr.addEventListener("progress", updateProgress);
            //xhr.addEventListener("load", transferComplete);
            xhr.addEventListener("error", transferFailed);
            xhr.addEventListener("abort", transferCanceled);

            xhr.open('GET', url);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    alert('User\'s name is ' + xhr.responseText);
                } else {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();


            // example 3
            var xhr = new XMLHttpRequest(),
                method = "GET",
                url = "https://developer.mozilla.org/";

            xhr.open(method, url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send();

            //example 4
            // ....
            xhr.timeout = 2000; // time in milliseconds

            xhr.onload = function() {
                // Request finished. Do processing here.
            };

            xhr.ontimeout = function(e) {
                // XMLHttpRequest timed out. Do something here.
            };

            //example 5
            function sendRequest(url, callback, postData) {
                var req = new XMLHttpRequest();

                var method = (postData) ? "POST" : "GET";
                req.open(method, url, true);
                req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                if (postData)
                    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                req.onreadystatechange = function() {
                    if (req.readyState != 4) return;
                    if (req.status != 200 && req.status != 304) {
                        //			alert('HTTP error ' + req.status);
                        return;
                    }
                    callback(req);
                };
                if (req.readyState == 4) return;
                req.send(postData);
            }

            //example 6
            var request = new XMLHttpRequest();

            request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);
            request.onload = function() {
                // Begin accessing JSON data here
                var data = JSON.parse(this.response);

                if (request.status >= 200 && request.status < 400) {
                    data.forEach(movie => {
                        console.log(movie.title);
                    });
                } else {
                    console.log('error');
                }
            }
            request.send();
        },


        post: function(url, data) {

            var xhr = new XMLHttpRequest();

            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //xhr.setRequestHeader('Content-Type', 'text/plain');
            //xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200 && xhr.responseText !== newName) {
                    alert('Something went wrong.  Name is now ' + readBody(xhr));
                } else if (xhr.status !== 200) {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send(_param(data));
        },

        // put jsondata
        put: function(url, jsondata) {

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var userInfo = JSON.parse(xhr.responseText);
                }
            };
            xhr.send(JSON.stringify(jsondata));
        },

        sendFile: function(url, file, payload) {

            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);

            //var file = document.getElementById(formFileID).files[0];

            xhr.onload = function() {
                if (xhr.status === 200) {
                    var userInfo = JSON.parse(xhr.responseText);
                }
            };

            if (payload === 'file') {
                xhr.setRequestHeader('Content-Type', file.type); //payload of the request
                xhr.send(fileObj);
            } else {
                var formData = new FormData(); //multipart encoded
                formData.append('file', file);
                xhr.send(formData);
            }
        },

        delete: function(url) {

        }
    };


};
