"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('UserCommentsApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'C3PGrwyqCnJRWnL0AsZy1hKEnBSrUsMRc3XiqKAD';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'TvdhV2Hf1G1Tmt9jkNUP8anXOnC6vNLEipMNndsg';
    })
    .controller('CommentsController', function($scope, $http, $window){
        var commentsUrl = 'https://api.parse.com/1/classes/comments';
        $scope.loading = true;
        $http.get(commentsUrl)
            .success(function (data) {
                $scope.comments = data.results;
                $scope.sortComments();
            })
            .error(function (err) {
                $scope.errorMessage = err;
            })
            .finally(function() {
                $scope.loading = false;
            });
        $scope.newComment = {score: 0};
        $scope.addComment = function () {
            $scope.inserting = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0};
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.inserting = false;
                });
        };
        $scope.deleteComment = function (comment) {
             $scope.updating = true;
            $http.delete(commentsUrl + '/' + comment.objectId, comment)
                .success(function () {
                    var index = $scope.comments.indexOf(comment);
                    $scope.comments.splice(index, 1)
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.updating = false;
                })
        };//end of deleteComment

        $scope.sortComments = function() {
            $scope.comments = $scope.comments.sort(function(comment1 ,comment2) {return comment2.score - comment1.score})
        };

        $scope.incrementScore = function (comment, amount) {
            $scope.changing = true;
            $http.put(commentsUrl + '/' + comment.objectId,
                {score: {
                    __op: 'Increment',
                    amount: amount
                }
                })
                .success(function (responseData) {
                    comment.score = responseData.score;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                })
                .finally(function () {
                    $scope.changing = false;
                })
        }; //end of incrementScore
    })