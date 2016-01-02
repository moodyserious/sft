angular.module("Myservices", ['firebase'])

    .factory("DataService", [function () {
        var dataObj = {};

        dataObj.database = new Firebase('https://glowing-fire-9917.firebaseio.com/StudentFinance');

        return dataObj;
    }])


    .factory("TipsService", ["$firebaseArray" , function($firebaseArray) {
         var obj = {};
         obj.database = new Firebase('https://glowing-fire-9917.firebaseio.com/Tips');
         obj.databaseArray = $firebaseArray(obj.database);
        return obj;
    }])


    .factory("RegistrationService", ['DataService', '$state', function (DataService, $state) {
        var registObj = {};

        registObj.registerUser = function(email, password) {
            var database1 = DataService.database;   // get the data from dataservice
            database1.createUser({
                email: email,
                password: password
            }, function (error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    $state.go("login");
                }
            });
        }

        return registObj;
    }])


    .factory("LoginService", ['DataService', '$state', '$q', function (DataService, $state, $q) {
        var loginObj = {};
        var status = null;
        var w = $q.defer();
        loginObj.login= function(email, password){
            var database = DataService.database;   // get the data from dataservice


            database.authWithPassword({
                email    : email,
                password : password
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                    status = "error";
                    w.resolve(status);
                } else {

                    console.log("Authenticated successfully with payload:", authData.toString());
                    loginObj.userId=authData.uid;
                    status = "success";
                    w.resolve(status);

                    $state.go('app');

                }
            });
            return w.promise;
        }

        return loginObj;
    }])


    .factory("UserDatabaseService", ['LoginService', '$firebaseArray', function (LoginService, $firebaseArray) {
        var userDatabase = {};

        var database = new Firebase('https://glowing-fire-9917.firebaseio.com/StudentFinance/' + LoginService.userId);
        userDatabase.Database = $firebaseArray(database);

        return userDatabase;
    }])



    .factory("BudgetEntryService", ['UserDatabaseService', '$state', function(UserDatabaseService,$state ){

        var obj ={};
        obj.storage = [];
        obj.editObj = {};

        obj.addTerm = function(semester, year){
            var data = ({
                semester: semester,
                year: year,
                incomeAmount: 0,
                expenses:[
                    { expensesCategory: "",  expensesAmount: 0}
                ]

            })

            UserDatabaseService.Database.$add(data);   // create the object in Database; CREATE operation
            $state.go("app.budgetEntry.term")

        }

        obj.removeTerm = function(item)
        {
            UserDatabaseService.Database.$remove(item);


        }

        obj.CallEdit = function(item)
        {
            obj.editObj = item;

        }


        obj.AddeditTerm = function(semester, year)
        {
            obj.editObj.semester= semester;
            obj.editObj.year = year;
            UserDatabaseService.Database.$save(obj.editObj);
            $state.go("app.budgetEntry.term")
        }



        obj.AddeditIncome = function(amount)
        {
            obj.editObj.incomeAmount= amount;
            UserDatabaseService.Database.$save(obj.editObj);
            $state.go("app.budgetEntry.income")

        }


        obj.addExpenses = function(row){
            var index = UserDatabaseService.Database.indexOf(row);
            var expensesObj =  ({
                expensesCategory: "",
                expensesAmount: 0
            })

            UserDatabaseService.Database[index].expenses.push(expensesObj);

        }


        obj.CallEditExpenses = function(item, item1)
        {
            obj.editObj = item;
            obj.expensesIndex = obj.editObj.expenses.indexOf(item1);

        }

        obj.AddeditExpenses = function(category, amount)
        {
            obj.editObj.expenses[obj.expensesIndex].expensesCategory= category;
            obj.editObj.expenses[obj.expensesIndex].expensesAmount= amount;
            UserDatabaseService.Database.$save(obj.editObj);
            $state.go("app.budgetEntry.expenses")
        }


        return obj;
    }])