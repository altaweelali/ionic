(function () {

    var app = angular.module('app');

    app.factory('auth', [function () {

        var username;
        var password;
        var url;
        var rememberMe;


        var login = function (username, password, url, rememberMe) {
           
            var endpoint = '/_api/ProjectServer/Projects'

            var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();


            xhr.open("GET", url + endpoint, true, encodeURIComponent(username), encodeURIComponent(password));
            xhr.setRequestHeader("ACCEPT", "application/json;odata=verbose")
            xhr.send();
            xhr.onload = function () {
                var statusCode = xhr.status;
                if (statusCode == 200) {
                    var response = xhr.responseText;
                    //var res = JSON.parse(response);
                    //alert('cooool')
                }
            };
            xhr.onerror = function (e) {
                alert(e.error);
            };

            xhr.addEventListener("loadend", loadEnd, false);


            //xhr.onreadystatechange = function () {
                
            function loadEnd (e) {
                var status = xhr.status

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






        }

        var getCredentials = function () {

        }

        var removeUser = function () {

        }

        var storeCredentials = function () {

        }

        return {

            login: login,
            getCredentials: getCredentials,
            removeUser: removeUser
        }
    }]
    )

})();