

if (!window.console) {
    window.console = {
        log: function () {},
        warn: function () {},
        error: function () {}
    };
}

(function (angular) {
    'use strict';

    var list = [];
    angular.module('myServices', []).service('messageService', messsageService);
    return;

    function messsageService($http) {
        this.list = list;
        this.totalAmount = null;
        this.totalUnread = null;
        this.loadData = loadData;
        this.openMsg = openMsg;
        this.cleanData = cleanData;
        return this;

        function loadData() {

            console.log("load data...");

            var self = this;
            var apiUrl = "data/messageList.json";

            $http.get(apiUrl).success(function (data) {
                // can't change reference, so use old way
                self.list.length = 0;
                for (var i = 0; i < data.length; i++) {
                    self.list.push(data[i]);
                }
                //self.list = data;
                console.log("loading data..." + self.list.length);
                self.totalAmount = self.list.length;
                var totalUnread = 0;
                for (var i = 0; i < self.list.length; i++) {
                    if (self.list[i].unread) {
                        totalUnread++;
                    }
                }
                self.totalUnread = totalUnread;
            });

        }

        function openMsg(id) {
            this.current = null;
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].ID == id) {
                    if (this.list[i].unread) {
                        this.totalUnread--;
                        this.list[i].unread = false;
                    }
                    this.current = this.list[i];
                    return this.current;
                }
            }

        }

        function cleanData() {
            this.totalUnread = 0;
            this.totalAmount = 0;
            this.current = null;

            this.list.length = 0;
        }
    }
    ;


})(angular);     