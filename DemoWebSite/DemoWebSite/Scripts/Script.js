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
                controllerAs: "studentsCtrl",
                resolve: {
                    studentsList: function ($http) {
                        return $http.get("StudentService.asmx/GetAllStudents")
                            .then(function (response) {
                                return response.data;
                            })
                    }
                }
            })
            .when("/students/:id", {
                templateUrl: "Templates/studentsDetails.html",
                controller: "studentDetailsController",
                controllerAs: "studentDetailsCtrl"
            })
            .when("/studentsSearch/:name?", {
                templateUrl: "Templates/studentsSearch.html",
                controller: "studentsSearchController",
                controllerAs: "studentsSearchCtrl"
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
    .controller("studentsController", function (studentsList, $route, $location) {
    
    //.controller("studentsController", function (studentsList, $route, $scope, $location) {
        //$scope.$on("$locationChangeStart", function (event, next, current) {
        //    if (!confirm("Are you sure you want to navigate away from this page to "+next)) {
        //        event.preventDefault();
        //    }
        //})

        var vm = this;

        vm.searchStudent = function () {
            if (vm.name) {
                $location.url("/studentsSearch/" + vm.name);
            }
            else {
                $location.url("/studentsSearch");
            }
        }

        vm.reloadData = function () {
            $route.reload();
        }

        vm.students = studentsList;
    })
    .controller("studentDetailsController", function ($http, $routeParams) {
        var vm = this;
        $http({
            url: "StudentService.asmx/GetStudent",
            params: { id: $routeParams.id },
            method: "get"
        })
            .then(function (response) {
                vm.student = response.data;
            })
    })
    .controller("studentsSearchController", function ($http, $routeParams) {
        var vm = this;
        if ($routeParams.name) {
            $http({
                url: "StudentService.asmx/GetStudentsByName",
                params: { name: $routeParams.name },
                method: "get"
            })
            .then(function (response) {
                vm.students = response.data;
            })
        }
        else {

            $http.get("StudentService.asmx/GetAllStudents")
                .then(function (response) {
                    vm.students = response.data;
                })
        }

    })