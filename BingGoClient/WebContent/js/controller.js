app.controller('myCtrl', function($scope) {
		$scope.sections = [{name: "Section 1", desc: "This is section 1"},
							{name: "Section 2", desc: "This is section 2"},
							{name: "Section 3", desc: "This is section 3"},
							{name: "Section 4", desc: "This is section 4"},
							{name: "Section 5", desc: "This is section 5"},
							{name: "Section 6", desc: "This is section 6"}];
});

app.controller('eventCtrl', function($scope) {
		$scope.events = [{name: "Event 1", desc: "This is Event 1"},
							{name: "Event 2", desc: "This is Event 2"},
							{name: "Event 3", desc: "This is Event 3"},
							{name: "Event 4", desc: "This is Event 4"},
							{name: "Event 5", desc: "This is Event 5"},
							{name: "Event 6", desc: "This is Event 6"}];
});