app.controller("landingPageCtrl", ["$rootScope", function(rootScope) {
	var uid = document.cookie;
	if(uid === "")
		rootScope.userId = 'undefined';
	else
		rootScope.userId = uid;
	
	//set server address
	rootScope.server = 'http://bing-go.us-west-2.elasticbeanstalk.com:8080/';
	rootScope.isProduction = true;
	
	//rootScope.server = 'http://localhost:8080/';
	//rootScope.isProduction = false;
}])

app.controller("logoutCtrl", ["$rootScope", "$location", "$window", "$scope", function(rootScope, location, window, scope) {
	$('#showModal').click();
	
	scope.logoutConfirm = function() {
		document.cookie = "";
		rootScope.userId = "";
		
		if(rootScope.isProduction)
			window.location.href = '/';
		else
			window.location.href = '/BingGoClient/';
	}

	scope.cancelLogout = function() {
		//Go back in history
		window.history.back();
	}
}])

app.controller("loginCtrl", ['$scope', '$http', '$localStorage', '$state', '$location', '$window', '$rootScope', 
						function(scope, http, localStorage, state, location, window, rootScope) {
	scope.communities = "";
	rootScope.errorMessage = "";

	scope.user = {
			userId: "",
			password: "",
			emailId: "",
			firstName: "",
			lastName: "",
			community: "",
			newCommunity: "",
			newCommunityDescription: ""
	};
	
	scope.loginUser = function() {
		var loginUrl = rootScope.server + 'loginuser/';
		
		document.getElementById("loader").style.display = "block";

		http({
			url: loginUrl,
			dataType: "json",
			data: scope.user,
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			document.getElementById("loader").style.display = "none";

			if(response === 'SUCCESS') {
				rootScope.userId = scope.user.userId;
				document.cookie = scope.user.userId;

				if(rootScope.isProduction)
					window.location.href = '/';
				else
					window.location.href = '/BingGoClient/';
			}
			else {
				rootScope.errorMessage = response;
				$('#showLoginModal').click();
			}
			
		}).error(function(error){
			document.getElementById("loader").style.display = "none";

			console.log(error);
			rootScope.errorMessage = "Something went wrong. Please try again.";
			$('#showLoginModal').click();
		});
	}
	
	scope.sendRegistrationRequest = function() {
		var registerUrl = rootScope.server + 'register/';
		document.getElementById("loader").style.display = "block";

		http({
			url: registerUrl,
			dataType: "json",
			data: scope.user,
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			document.getElementById("loader").style.display = "none";

			if(response === 'SUCCESS') {
				rootScope.errorMessage = "Activation link is sent to your email. Please activate account and then log in.";
				scope.user = {
						userId: "",
						password: "",
						emailId: "",
						firstName: "",
						lastName: "",
						community: "",
						newCommunity: "",
						newCommunityDescription: ""
				};
				
			} else {
				rootScope.errorMessage = response;
			}

			$('#showLoginModal').click();
		}).error(function(error){
			document.getElementById("loader").style.display = "none";

			console.log(error);
			rootScope.errorMessage = "Something went wrong. Please try again.";
			$('#showLoginModal').click();
		});
	}
	

	scope.getCommunities = function () {
		var comUrl = rootScope.server + 'bingEntry/';

		http({
	    url: comUrl,
	    dataType: "json",
	    data: '',
	    method: "GET",
	    headers: {
	        "Content-Type": "application/json"
	    }
		}).success(function(response){
			scope.communities = response;
		}).error(function(error){
			scope.error = error;
		});
	}

	scope.getCommunities();
}]);


app.controller("communityHomeCtrl", ['$scope', '$http', '$localStorage', '$rootScope',  function(scope, http, localStorage, rootScope) {
	scope.postDesc = "";
	
	/*//For testing purpose set the logged-in userid
	$scope.$storage = $localStorage.$default({
	    loginUID: 'ikhatri1'
	});*/
	
	//Http call to make data request for all posts
	var uId = rootScope.userId;
	var myurl = rootScope.server + 'communityPosts/' + uId;
	scope.getData = function () {
					document.getElementById("loader").style.display = "block";

					http({
					    url: myurl,
					    dataType: "json",
					    data: '',
					    method: "GET",
					    headers: {
					        "Content-Type": "application/json"
					    }
					}).success(function(response){
						document.getElementById("loader").style.display = "none";

						scope.posts = response;
					}).error(function(error){
						document.getElementById("loader").style.display = "none";

					    scope.error = error;
					});
				}

	scope.getData();
	
	//setInterval($scope.getData, 1000);

	//Http call to add new post
	scope.addPost = function() {
		var desc = scope.postDesc;
		var postUrl = rootScope.server + 'addPostInUserCommunity/' + uId;
		
		//Show the loading icon
		document.getElementById("loader").style.display = "block";
    	document.getElementById("accordion").style.display = "none";
    	
		http({
		    url: postUrl,
		    dataType: "json",
		    data: desc,
		    method: "POST",
		    headers: {
		        "Content-Type": "application/json"
		    }
		}).success(function(response){
			//Hide the loading icon
			document.getElementById("loader").style.display = "none";
	    	document.getElementById("accordion").style.display = "block";
	    	
	    	//Clear the fields
			scope.postDesc = "";
			scope.posts = response;
			
			//Close the main div
			$('#mainDiv').click();
			
			rootScope.errorMessage = "You have successfully posted in your community wall.";
			$('#showLoginModal').click();
		}).error(function(error){
			document.getElementById("loader").style.display = "none";
	    	document.getElementById("accordion").style.display = "block";
	    	
		    scope.error = error;
		    
		    rootScope.errorMessage = "Could not send your post. Please retry";
			$('#showLoginModal').click();
		});
	}
	
	//Http call to register like/dislike
	scope.register = function(postId, likeOrDisLike) {
		var pref = "";
		if(likeOrDisLike == "like")
			pref = "addUserLike";
		else if(likeOrDisLike == "disLike")
			pref = "addUserDisLike";
		
		var registerUrl = rootScope.server + pref + '/' + postId + '/' + uId;
		
		http({
			url: registerUrl,
			dataType: "json",
			data: "",
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			scope.getData();
		}).error(function(error){
			console.log(error);
		});
	}
	
	//Http call to de-register like/dislike
	scope.deRegister = function(postId, likeOrDisLike) {
		var pref = "";
		if(likeOrDisLike == "like")
			pref = "removeUserLike";
		else if(likeOrDisLike == "disLike")
			pref = "removeUserDisLike";
		
		var deRegisterUrl = rootScope.server + pref + '/' + postId + '/' + uId;
		
		http({
			url: deRegisterUrl,
			dataType: "json",
			data: "",
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			scope.getData();
		}).error(function(error){
			console.log(error);
		});
	}
	
	//Http call to add comment to post
	scope.addComment = function(postId, commentId) {
		var comment = document.getElementById(commentId).value;
		var commentUrl = rootScope.server + 'addCommentToPost/' + postId + '/' + uId;
		
		http({
			url: commentUrl,
			dataType: "json",
			data: comment,
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			document.getElementById(commentId).value = "";
			scope.getData();
		}).error(function(error){
			console.log(error);
		});
	}
}]);


app.controller("eventCtrl", ['$scope', '$http', '$rootScope', '$window', function(scope, http, rootScope, window) {
	//Code for date picker
	$(document).ready(function(){
	      $('.input-daterange').datepicker({
              todayBtn: 'linked',
              format: 'mm/dd/yyyy',
    		  todayHighlight: true,
    		  autoclose: true,
    		  startDate: new Date()
          });
	    });
	
	scope.upcomingEventCount = 0;
	scope.ongoingEventCount = 0;
	scope.pastEventCount = 0;
	
	scope.newEvent = {
			name : "",
			startDateString : "",
			endDateString : "",
			startHour : "",
			startMin : "",
			endHour : "",
			endMin : "",
			location : "",
			description : ""
	}
	
	scope.postNewEvent = function() {
		//Date format MM/dd/yyyy
		scope.newEvent.startDateString = document.getElementById("sdate").value;
		scope.newEvent.endDateString = document.getElementById("edate").value;
		
		var newEventUrl = rootScope.server + 'addEvent/';
		
		document.getElementById("loader").style.display = "block";
    	document.getElementById("accordion").style.display = "none";
		
		http({
			url: newEventUrl,
			dataType: "json",
			data: scope.newEvent,
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			document.getElementById("loader").style.display = "none";
	    	document.getElementById("accordion").style.display = "block";
	    	
			scope.newEvent = {
					name : "",
					startDateString : "",
					endDateString : "",
					startHour : "",
					startMin : "",
					endHour : "",
					endMin : "",
					location : "",
					description : ""
			}
			
			scope.upcomingEventCount = 0;
			scope.ongoingEventCount = 0;
			scope.pastEventCount = 0;
			
			scope.events = response;
			
			//Close the main div
			$('#mainDiv').click();
			
			rootScope.errorMessage = "Your event was posted successfully";
			$('#showLoginModal').click();
		}).error(function(error){
			document.getElementById("loader").style.display = "none";
	    	document.getElementById("accordion").style.display = "block";
	    	
			console.log(error);

			rootScope.errorMessage = "Could not post your event. Please retry";
			$('#showLoginModal').click();
		});
	}
	
	//Code for loading events
	scope.getAllEvents = function() {
		var allEventsUrl = rootScope.server + 'getAllEvents/';

		http({
			url: allEventsUrl,
			dataType: "json",
			data: '',
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			scope.events = response;
		}).error(function(error){
			alert(error);
		});
	}

	scope.getAllEvents();
	
}]);


//Bearcats home controller
app.controller("bearcatHomeCtrl", ['$scope', '$http', '$localStorage', '$rootScope',  function(scope, http, localStorage, rootScope) {
	scope.bearcatPostDesc = "";
	
	//Http call to make data request for all posts
	var uId = rootScope.userId;
	var myurl = rootScope.server + 'bingPosts/' + uId;
	scope.getBearcatPosts = function () {
					document.getElementById("loader").style.display = "block";

					http({
					    url: myurl,
					    dataType: "json",
					    data: '',
					    method: "GET",
					    headers: {
					        "Content-Type": "application/json"
					    }
					}).success(function(response){
						document.getElementById("loader").style.display = "none";

						scope.bearcatPosts = response;
					}).error(function(error){
						document.getElementById("loader").style.display = "none";

					    scope.error = error;
					});
				}

	scope.getBearcatPosts();
	
	//Http call to add new post
	scope.bearcatAddPost = function() {
		var desc = scope.bearcatPostDesc;
		var postUrl = rootScope.server + 'addPostInBingCommunity/' + uId;
		
		document.getElementById("loader").style.display = "block";
    	document.getElementById("accordion").style.display = "none";
    	
		http({
		    url: postUrl,
		    dataType: "json",
		    data: desc,
		    method: "POST",
		    headers: {
		        "Content-Type": "application/json"
		    }
		}).success(function(response){
			document.getElementById("loader").style.display = "none";
	    	document.getElementById("accordion").style.display = "block";
	    	
			scope.bearcatPostDesc = "";
			scope.bearcatPosts = response;
			
			//Close the main div
			$('#mainDiv').click();
			
			rootScope.errorMessage = "You have posted successfully in Bearcats wall";
			$('#showLoginModal').click();
		}).error(function(error){
			document.getElementById("loader").style.display = "none";
	    	document.getElementById("accordion").style.display = "block";
	    	
		    scope.error = error;
		    
		    rootScope.errorMessage = "Could not send your post. Please retry";
			$('#showLoginModal').click();
		});
	}
	
	//Http call to register like/dislike
	scope.bearcatRegister = function(postId, likeOrDisLike) {
		var pref = "";
		if(likeOrDisLike == "like")
			pref = "addUserLike";
		else if(likeOrDisLike == "disLike")
			pref = "addUserDisLike";
		
		var registerUrl = rootScope.server + pref + '/' + postId + '/' + uId;
		
		http({
			url: registerUrl,
			dataType: "json",
			data: "",
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			scope.getBearcatPosts();
		}).error(function(error){
			console.log(error);
		});
	}
	
	//Http call to de-register like/dislike
	scope.bearcatDeRegister = function(postId, likeOrDisLike) {
		var pref = "";
		if(likeOrDisLike == "like")
			pref = "removeUserLike";
		else if(likeOrDisLike == "disLike")
			pref = "removeUserDisLike";
		
		var deRegisterUrl = rootScope.server + pref + '/' + postId + '/' + uId;
		
		http({
			url: deRegisterUrl,
			dataType: "json",
			data: "",
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			scope.getBearcatPosts();
		}).error(function(error){
			console.log(error);
		});
	}
	
	//Http call to add comment to post
	scope.bearcatAddComment = function(postId, commentId) {
		var comment = document.getElementById(commentId).value;
		var commentUrl = rootScope.server + 'addCommentToPost/' + postId + '/' + uId;
		
		http({
			url: commentUrl,
			dataType: "json",
			data: comment,
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			document.getElementById(commentId).value = "";
			scope.getBearcatPosts();
		}).error(function(error){
			console.log(error);
		});
	}
}]);

app.controller('fileUploadController', ['$scope', '$http', '$rootScope', 'fileUploadService', '$window', function (scope, http, rootScope, fileUploadService, window) {

	scope.myFile = "";
	scope.fileDescription = "";
	scope.files = "";
	
	scope.getFiles = function() {
		var myurl = rootScope.server + 'getfiles/';
		
		document.getElementById("loader").style.display = "block";

		http({
		    url: myurl,
		    dataType: "json",
		    data: '',
		    method: "GET",
		    headers: {
		        "Content-Type": "application/json"
		    }
		}).success(function(response){
			document.getElementById("loader").style.display = "none";

			scope.files = response;
		}).error(function(error){
			document.getElementById("loader").style.display = "none";

		    scope.error = error;
		});
	}
	
	scope.getFiles();
	
	scope.downloadFile = function(file) {
		var downloadUrl = rootScope.server + 'files/' + file.fileName + '/' + file.objectId + '/' + file.contentType + '/archive';
		window.open(downloadUrl, '_blank');
	}
	
    scope.uploadFile = function () {
    	var uploadUrl = rootScope.server + 'uploadfile/';
    	var file = scope.myFile;

    	//Close the main div
    	$('#mainDiv').click();

    	var promise = fileUploadService.uploadFileToUrl(file, uploadUrl, scope.fileDescription, rootScope.userId);
    	
    	//Show the loading icon
    	document.getElementById("loader").style.display = "block";

    	promise.then(function (response) {
    		document.getElementById("loader").style.display = "none";

    		scope.myFile = "";
            scope.fileDescription = "";
            scope.files = response;
            
            rootScope.errorMessage = "Your file was uploaded successfully.";
			$('#showLoginModal').click();
        }, function (response) {
        	document.getElementById("loader").style.display = "none";
            
        	console.log(response)
        	rootScope.errorMessage = "Could not upload your file. Please retry";
			$('#showLoginModal').click();
        })
    	
    }
}]);

app.controller('galleryController', ['$scope', '$http', '$rootScope', 'fileUploadService', '$window', function (scope, http, rootScope, fileUploadService, window) {
	scope.photoFiles = [];
	scope.photosDescription = "";

	scope.uploadedPhotos = "";

	scope.getGalleryPosts = function() {
		//Show the loading icon
		document.getElementById("loader").style.display = "block";
		
		var galleryPostsUrl = rootScope.server + 'galleryposts/';
		
		http({
			url: galleryPostsUrl,
			method: "GET",
			dataType: "json",
			data: '',
			header: {
				"Content-Type": "application/json"
		    }
		}).success(function(response){
			document.getElementById("loader").style.display = "none";
			console.log(response);
			scope.uploadedPhotos = response;
		}).error(function(error){
			document.getElementById("loader").style.display = "none";

		    scope.error = error;
		});
	}
	
	scope.getGalleryPosts();

	scope.uploadPhotos = function() {
		//Close the main div
		$('#mainDiv').click();
		
		//Show the loading icon
		document.getElementById("loader").style.display = "block";

		var photosUploadUrl = rootScope.server + 'uploadPhotos/';
		var photoFiles1 = scope.photoFiles;

		var form = $('#galleryForm')[0];
	    var data = new FormData(form);
	    data.append("userId", rootScope.userId);

	    http({
	    	method: "POST",
			url: photosUploadUrl,
			dataType: "json",
			data: data,
			enctype: 'multipart/form-data',
			transformRequest: angular.identity,
			headers: {
				"Content-Type": undefined
			}
		}).success(function(response){
			document.getElementById("loader").style.display = "none";
            scope.photosDescription = "";
            scope.uploadedPhotos = response;
            rootScope.errorMessage = "Your file was uploaded successfully.";
			$('#showLoginModal').click();
		}).error(function(error){
			document.getElementById("loader").style.display = "none";
        	rootScope.errorMessage = "Could not upload your file. Please retry";
			$('#showLoginModal').click();
		});
		
	}
}]);

app.controller('apartmentsController', ['$scope', '$http', '$rootScope', 'fileUploadService', '$window', function (scope, http, rootScope, fileUploadService, window) {
	
	scope.listings = "";
	
	scope.listing = {
			no: "",
			street: "",
			city: "",
			contactNumber : "",
			description: ""
	}
	
	
	scope.postNewListing = function() {
		var myurl = rootScope.server + 'addnewlisting/' + rootScope.userId;
		var apartment = scope.listing;
		
		document.getElementById("loader").style.display = "block";

		http({
		    url: myurl,
		    dataType: "json",
		    data: apartment,
		    method: "POST",
		    headers: {
		        "Content-Type": "application/json"
		    }
		}).success(function(response){
			document.getElementById("loader").style.display = "none";
			
			//Close the main div
			$('#mainDiv').click();
			
			scope.listing = {
					no: "",
					street: "",
					city: "",
					contactNumber : "",
					description: ""
			}
			
			scope.listings = response;
		}).error(function(error){
			document.getElementById("loader").style.display = "none";
		    scope.error = error;
		});
	}
	
	scope.getListings = function() {
		var myurl = rootScope.server + 'listings/';
		
		document.getElementById("loader").style.display="block";
		
		http({
			url: myurl,
			dataType: "json",
			data: '',
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}).success(function(response){
			document.getElementById("loader").style.display = "none";

			scope.listings = response;
		}).error(function(error){
			document.getElementById("loader").style.display = "none";

		    scope.error = error;
		});
	}
	
	scope.getListings();
}]);