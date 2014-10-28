/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\jquery-2.1.1.js" />
/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\jquery-2.1.1.min.js" />
/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\q.js" />
/// <reference path="../common/app.common.js" />
/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\angular.js" />
/// <reference path="c:\project insight\sp app with breeze\spa with angular\spa with angular\scripts\angular.min.js" />
(function () {
    'use strict';

    // Data service

    var serviceId = 'datacontext';

    var myApp = angular.module('app');
    myApp.factory(serviceId, ['$rootScope', '$http', '$q', 'breeze', 'auth', datacontext]);
 

    // create factory

    function datacontext($rootScope, $http, $q, breeze, auth ) {

        var serviceUrl = auth.getAppServiceUrl();
        serviceUrl = serviceUrl + '/_api/ProjectData/'
        var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

        // set fixed headers
        ajaxAdapter.defaultSettings = {
            headers: {
                "ACCEPT": "application/json;odata=verbose"
            },
        };

        var dataService = new breeze.DataService({
            serviceName: serviceUrl,

            hasServerMetadata: false
        });

        var manager = new breeze.EntityManager({
            dataService: dataService
        });

        function get(resource, query) {
            var d = $.Deferred();

            var dataResults = [];

            manager.executeQuery(query)
                .then(successCallback)
            .catch(failCallback);

            function successCallback(data) {

                console.log(data); //remove

                var results = data.results[0].d.results;

                dataResults = dataResults.concat(results)
                var next = data.results[0].d.__next;

                if (next) {
                    getNext(resource, next);
                } else {
                    d.resolve(dataResults)
                }

            }
            function failCallback(e) { };
            
            function getNext(resource, next) {
                var queryString = next.substring(next.indexOf('?'));
                var query = resource + queryString;
                manager.executeQuery(query)
                    .then(successCallback)
                .catch(failCallback)
            }

            return d;
        }

        function getCustomFields() {

            var d = $.Deferred();

            var dataResults = [];

            var projectServerServiceUrl = auth.getAppServiceUrl();
            projectServerServiceUrl = projectServerServiceUrl + '/_api/ProjectServer/'

            var resource = 'CustomFields'

            var _dataService = new breeze.DataService({
                serviceName: projectServerServiceUrl,

                hasServerMetadata: false
            });

            var _manager = new breeze.EntityManager({
                dataService: _dataService
            });


            var _query = new breeze.EntityQuery()
                .from(resource)
                .select('Name,FieldType,LookupEntries,EntityType');
            

            

           _manager.executeQuery(_query)
                .then(successCallback)
            .catch(failCallback);

            function successCallback(data) {
                console.log(data); //remove later

                var results = data.results[0].d.results;

                dataResults = dataResults.concat(results)
                var next = data.results[0].d.__next;

                if (next) {
                    getNext(resource, next);
                } else {


                  
                    getLookupTables()

                }

            }

            function failCallback(e) {

                //TODO: Error handler 
                console.log(e)
            }

            function getNext(resource, next) {
                var queryString = next.substring(next.indexOf('?'));
                var query = resource + queryString;
                _manager.executeQuery(query)
                    .then(successCallback)
                .catch(failCallback);
            }

        
            function getLookupTables() {

                $.each(dataResults, function (i, r) {
                    var url = r.LookupEntries.__deferred.uri;
                    var queryString = url.substring(url.indexOf('('));
                    var query = resource + queryString;
                   
                    _manager.executeQuery(query)
                   .then(addLookups)
               .catch(failCallback);

                    function addLookups(data) {
                        var results = data.results[0].d.results;
                        dataResults[i]["lookups"] = results;

                        if (i >= dataResults.length - 1) {
                            getCustomeFieldsEntityType()
                        }
                    }


                })

            }


            function getCustomeFieldsEntityType() {

                $.each(dataResults, function (i, r) {

                    var _CFName = r.Name.replace(/[^A-Z0-9]/ig, ""); // fix CF name to OData name

                    r.ODataName = _CFName

                    var url = r.EntityType.__deferred.uri;
                    var queryString = url.substring(url.indexOf('('));
                    var query = resource + queryString + '?$select=Name';

                    _manager.executeQuery(query)
                   .then(addEntityType)
               .catch(failCallback);

                    function addEntityType(data) {
                        var results = data.results[0].d.Name;
                        dataResults[i]["Type"] = results;

                        if (i >= dataResults.length - 1) {
                            d.resolve(dataResults)
                        }
                    }


                })

            }


            return d;



        }

        function getProjectList() {

            var d = $.Deferred();

            var dataResults = [];

            var projectServerServiceUrl = appCommon.getCustomFieldsServiceUrl();

            var resource = 'Projects'

            var _dataService = new breeze.DataService({
                serviceName: projectServerServiceUrl,

                hasServerMetadata: false
            });

            var _manager = new breeze.EntityManager({
                dataService: _dataService
            });


            var _query = new breeze.EntityQuery()
                .from(resource)
                .select('Name, Id, CreatedDate, LastPublishedDate, LastSavedDate');




            _manager.executeQuery(_query)
                 .then(successCallback)
             .catch(failCallback);

            function successCallback(data) {
                console.log(data); //remove later

                var results = data.results[0].d.results;

                dataResults = dataResults.concat(results)
                var next = data.results[0].d.__next;

                if (next) {
                    getNext(resource, next);
                } else {



                    d.resolve(dataResults)

                }

            }

            function failCallback(e) {

                //TODO: Error handler 
                console.log(e)
            }

            function getNext(resource, next) {
                var queryString = next.substring(next.indexOf('?'));
                var query = resource + queryString;
                _manager.executeQuery(query)
                    .then(successCallback)
                .catch(failCallback);
            }





            return d;



        }

        function getMetadata() {

            var d = $.Deferred();


            var serviceUrl = appCommon.getAppServiceUrl();
            var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

            // set fixed headers
            ajaxAdapter.defaultSettings = {
                headers: {
                    "ACCEPT": " application/xml;charset=utf-8"
                },
            };

            var projectServerServiceUrl = appCommon.getAppServiceUrl();

            var resource = '$metadata'

            var _dataService = new breeze.DataService({
                serviceName: projectServerServiceUrl,

                hasServerMetadata: false
            });

            var _manager = new breeze.EntityManager({
                dataService: _dataService
            });



            _manager.executeQuery(resource)
                 .then(successHandler)
             .catch(failCallback);

            ajaxAdapter.defaultSettings = {
                headers: {
                    "ACCEPT": "application/json;odata=verbose"
                },
            };
            function failCallback(e) {

                //TODO: Error handler 
                console.log(e)
            }


         

            var _dataEdmDef = [];

            function successHandler(data) {
              var   xmlDoc = $.parseXML(data.results[0])
            var     $xml = $(xmlDoc);
    var  $title = $xml.find("EntityType").each(function () {
         var entityType = $(this).attr('Name');
         var properties = $(this).find('Property')
         if (entityType == 'Project') {
             properties.each(function (i, e) {
                 var name = $(e).attr('Name');
                 var type = $(e).attr('Type');

                 var dataDef = {
                     Name: name,
                     Type: type
                 }

                 _dataEdmDef.push(dataDef)
             })
         }
     })

                var _dataDefinition = new Object();

                _dataDefinition.Measures = [];
                _dataDefinition.Dimensions = [];
                _dataDefinition.Time = [];

                $.each(_dataEdmDef, function (i, r) {
                    if (r.Type == 'Edm.String' || r.Type == 'Edm.Boolean') {
                        _dataDefinition.Dimensions.push(r.Name)
                    }
                    if (r.Type == 'Edm.Decimal' || r.Type == 'Edm.Int32' || r.Type == 'Edm.Int16') {
                        _dataDefinition.Measures.push(r.Name)
                    }

                    if (r.Type == 'Edm.DateTime') {
                        _dataDefinition.Time.push(r.Name)
                    }
                })

                d.resolve(_dataDefinition)
            }

            return d.promise();
        }

        var service = {
            get: get,
            getCustomFields: getCustomFields,
            getMetadata: getMetadata,
            getProjectList: getProjectList

        };

        // service signature

        return service;
    }
})();