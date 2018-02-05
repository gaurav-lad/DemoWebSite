/// <reference path="angular.min.js"/>

var app = angular.module("Demo", ["ngRoute"])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.caseInsensitiveMatch = true;
        $routeProvider
            .when("/home", {
            templateUrl: "Templates/home.html",
            controller: "homeController",
            controllerAs: "homeCtrl",
            })
            .when("/courses", {
                templateUrl: "Templates/courses.html",
                controller: "coursesController",
                controllerAs: "coursesCtrl"
            })
            .when("/students", {
                templateUrl: "Templates/students.html",
                controller: "studentsController",
                controllerAs: "studentsCtrl"
            })
            .when("/students/:id", {
                templateUrl: "Templates/studentsDetails.html",
                controller: "studentDetailsController",
                controllerAs: "studentDetailsCtrl"
            })
            .otherwise({
                redirectTo:"/home"
            })
        $locationProvider.html5Mode(true);
    })
    .controller("homeController", function () {
        this.message = "Home Page";
    })
    .controller("coursesController", function () {
        this.courses = ["C#", "JAVA", "Angular", "MySQL"];
    })
    .controller("studentsController", function ($http, $route, $scope) {
        $scope.$on("$locationChangeStart", function (event, next, current) {
            if (!confirm("Are you sure you want to navigate away from this page to "+next)) {
                event.preventDefault();
            }
        })
        var vm = this;
        vm.reloadData = function () {
            $route.reload();
        }
        $http.get("StudentService.asmx/GetAllStudents")
            .then(function (response) {
                vm.students = response.data;
            })
    })
    .controller("studentDetailsController", function ($http, $routeParams) {
        var vm = this;
        $http({
            url:"StudentService.asmx/GetStudent",
            params:{id:$routeParams.id},
            method:"get"
        })
        .then(function (response) {
            vm.student = response.data;
        })
    })