(function () {

    var app = angular.module('app');

    app.factory('auth', [function () {

        var _username;
        var _password;
        var _url;
        var _rememberMe;


        var login = function (username, password, url, rememberMe) {
           
             _username = username;
             _password = password;
             _url = url;
             _rememberMe = rememberMe;

            var endpoint = '/_api/ProjectServer/Projects?$select=Name, Id'

            var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();


            xhr.open("GET", url + endpoint, true, encodeURIComponent(username), encodeURIComponent(password));
            xhr.setRequestHeader("ACCEPT", "application/json;odata=verbose")
            xhr.send();
            xhr.onload = function () {
                var statusCode = xhr.status;
                if (statusCode == 200) {
                    var response = xhr.responseText;
                
                }
            };
            xhr.onerror = function (e) {
                alert(e.error);
            };

            xhr.addEventListener("loadend", loadEnd, false);

   
            function loadEnd(e) {

                var status = xhr.status
                var response = xhr.responseText;

                var result = jQuery.parseJSON(response);

                debugger;
                if (status == 200 || status == 0) {

                    if (result.d.results[0].Name) {
                        alert(result.d.results[0].Name)

                        storeCredentials();
                        //TODO: Report sucess and store credentials 


                    } else {

                        // TODO: check if the user dosent have permisson to see the projects

                    }
                } else {

                    //TODO: report error and tell the user to retry
                    

                }

                switch (status) {
                    case 404:
                        alert(404);
                        break;
                    case 401:
                        alert(401);
                        break;
                    case 500:
                        alert(500);
                        break;
                    case 0:
                        alert(0);
                        break;

                    case 200:
                        alert(200);
                        break;
                    default:
                        alert(status);

                }
            }


            //TODO: set timeout then resolve the promise to get the user to try agian 



        }

        var getCredentials = function () {

            var userName = window.localStorage.getItem("_userName");
            var password = window.localStorage.getItem("_password");
            var url = window.localStorage.getItem("_url");

            return {username: userName, password: password, url: url}
        }

        var removeUser = function () {

            window.localStorage.removeItem("_userName");
            window.localStorage.removeItem("_password");
            window.localStorage.removeItem("_url");

        }

        var storeCredentials = function () {

            window.localStorage.setItem("_userName", _username);
            window.localStorage.setItem("_password", _password);
            window.localStorage.setItem("_url", _url);

        }

        return {

            login: login,
            getCredentials: getCredentials,
            removeUser: removeUser
        }
    }]
    )

})();