var app = angular.module("myApp", ["ngRoute", "ngStorage", "ui.router"]);

app.config(function($routeProvider, $locationProvider) {
	
	$routeProvider
	.when("/communityhome", {
		templateUrl : "view/communityhome.html",
		controller : "communityHomeCtrl"
	})
	.when("/events", {
		templateUrl : "view/events.html",
		controller : "eventCtrl"
	})
	.when("/apartments", {
		templateUrl : "view/apartments.html",
		controller : "apartmentsController"
	})
	.when("/archive", {
		templateUrl : "view/filearchive.html",
		controller : "fileUploadController"
	})
	.when("/gallery", {
		templateUrl : "view/gallery.html",
		controller : "galleryController"
	})
	.when("/bearcathome", {
		templateUrl: "view/bearcathome.html",
		controller: "bearcatHomeCtrl"
	})
	.when("/logout", {
		templateUrl: "view/logout.html",
		controller: "logoutCtrl"
	})
});

/*
A directive to enable two way binding of file field
*/
app.directive('fileModel', function ($parse) {
   return {
       restrict: 'A', //the directive can be used as an attribute only

       /*
        link is a function that defines functionality of directive
        scope: scope associated with the element
        element: element on which this directive used
        attrs: key value pair of element attributes
        */
       link: function (scope, element, attrs) {
           var model = $parse(attrs.fileModel);
           var isMultiple = attrs.multiple;
           var modelSetter = model.assign; //define a setter for fileModel

           //Bind change event on the element
           element.bind('change', function () {
               //Call apply on scope, it checks for value changes and reflect them on UI
               scope.$apply(function () {
                   //set the model value
            	   if (isMultiple) {
            		   angular.forEach(element[0].files, function(item) {
            			   
            		   })
            		   modelSetter(scope, element[0].files);
                   } else {
                       modelSetter(scope, element[0].files[0]);
                   }
               });
           });
       }
   };
});

app.service('fileUploadService', function ($http, $q) {
	 
    this.uploadFileToUrl = function (file, uploadUrl, desc, userId) {
        //FormData, object of key/value pair for form fields and values
        var fileFormData = new FormData();
        fileFormData.append('file', file);
        fileFormData.append('desc', desc);
        fileFormData.append('uploadedBy', userId);
        
        var deffered = $q.defer();
        $http.post(uploadUrl, fileFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}

        }).success(function (response) {
        	deffered.resolve(response);
        }).error(function (response) {
        	deffered.reject(response);
        });

        return deffered.promise;
    }
});


/*app.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].photoFiles, function (item) {
                    var value = {
                       // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                	modelSetter(scope, element[0].files);
                    if (isMultiple) {
                    } else {
                        modelSetter(scope, element[0].files[0]);
                    }
                });
            });
        }
    };
}]);

app.service('multipleFileUploadService', function ($http, $q) {
	 
    this.uploadFileToUrl = function (file, uploadUrl, desc, userId) {
        //FormData, object of key/value pair for form fields and values
        var fileFormData = new FormData();
        console.log(file);
        
        fileFormData.append('fileArray', file);
        fileFormData.append('desc', desc);
        fileFormData.append('uploadedBy', userId);
        
        var deffered = $q.defer();
        $http.post(uploadUrl, fileFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}

        }).success(function (response) {
        	deffered.resolve(response);
        }).error(function (response) {
        	deffered.reject(response);
        });

        return deffered.promise;
    }
});*/