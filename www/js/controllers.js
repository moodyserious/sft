angular.module('starter.controllers', ['firebase'])


    .controller('RegistrationCtrl', function($scope, RegistrationService){
        $scope.registerUser = function(email, password)
        {
            RegistrationService.registerUser(email,password);  // register the user and takes back to login page

        }

    })

    .controller('LoginCtrl' , function($scope,$cordovaDialogs, $cordovaToast, $cordovaNetwork, LoginService){
        document.addEventListener("deviceready", function () {
            var isOffline = $cordovaNetwork.isOffline()

            if(isOffline)
            {
               $cordovaDialogs.alert('You cannot login. Please check your network settings and try again.', 'Unable to connect', 'OK')
                .then(function() {
                    // callback success
                });
            }

        }, false);

        $scope.login= function(email, password){
            LoginService.login(email,password).then(function(data){
                if(data == "success")
                {    
                     $cordovaToast
			           .show('Login Succeed!', 'short', 'center')
			           .then(function(success) {
			             // success
			           }, function (error) {
			             // error
			          });
                } 
                else if (data == "error"){
                     $cordovaToast
                       .show('Login Failed!', 'short', 'center')
                       .then(function(success) {
                         // success
                       }, function (error) {
                         // error
                      });
                }
            });
         }   

    })


     .controller('TipsCtrl' , function($scope, TipsService){
            $scope.database = TipsService.databaseArray;
        })


    .controller('FeaturesCtrl', function($scope, $cordovaDialogs, $cordovaVibration, $state, $ionicListDelegate,$ionicHistory,  LoginService, $firebaseArray, DataService, UserDatabaseService, BudgetEntryService) {

        $scope.goTracker= function(){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("app.tracker");
        }

        $scope.goComparison= function(){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("app.comparison");
        }

        $scope.goTips= function(){
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go("app.tips");
        }

        $scope.storage = [];
        $scope.Database = UserDatabaseService.Database;

        $scope.logout= function(){
            DataService.database.unauth();
            $state.go("login");
        }

        $scope.addTerm = function(semester, year){
            BudgetEntryService.addTerm(semester, year);
        }

        $scope.removeTerm = function(item)
        {
            BudgetEntryService.removeTerm(item);
            var index =  $scope.Database.indexOf(item);
            $scope.storage.splice(index, 1);


        }

        $scope.CallEdit = function(item)
        {
            BudgetEntryService.CallEdit(item);
            $ionicListDelegate.closeOptionButtons(true);

        }


        $scope.AddeditTerm = function(semester, year)
        {
            BudgetEntryService.AddeditTerm(semester, year);
        }


        $scope.AddeditIncome = function(amount)
        {
            BudgetEntryService.AddeditIncome(amount);
        }

        $scope.addExpenses = function(row){
            BudgetEntryService.addExpenses(row);
        }

        $scope.CallEditExpenses = function(item, item1)
        {
            BudgetEntryService.CallEditExpenses(item, item1);
            $ionicListDelegate.closeOptionButtons(true);

        }

        $scope.AddeditExpenses = function(category, amount)
        {
            BudgetEntryService.AddeditExpenses(category, amount);
        }


        $scope.plotPie = function(item)
        {

            $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    x: function(d){return d.key;},
                    y: function(d){return d.y;},
                    showLabels: true,
                    transitionDuration: 500,
                    labelThreshold: 0.01,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

            $scope.data = [];

            var expAmount =[];
            var expCategory = [];
            var total = parseInt(item.incomeAmount);
            var expensesTotal = 0;
            var saving = 0;

             if(item.incomeAmount == 0)
	            {
	                $cordovaVibration.vibrate(300);
	                 $cordovaDialogs.alert('Please enter the income amount', 'Ugh!', 'OK')
	                 .then(function() {
	                    $state.go('app.budgetEntry.income');
	                 });
	            } 


            for(var i=0; i<item.expenses.length; i++)
            {

            	if(item.expenses[i].expensesAmount == 0)
            	{
            		 $cordovaVibration.vibrate(300);
	                 $cordovaDialogs.alert('Please enter the expenses amount', 'Ugh!', 'OK')
	                 .then(function() {
	                    $state.go('app.budgetEntry.expenses');
	                 });

            	}
                expAmount[i] = (parseInt(item.expenses[i].expensesAmount) / total) * 360;
                expCategory[i] = item.expenses[i].expensesCategory;
                expensesTotal += parseInt( item.expenses[i].expensesAmount);

                $scope.data.push({
                    key: expCategory[i],
                    y: expAmount[i]
                })
            }

            saving = ((total - expensesTotal)/total) * 360;
            $scope.data.push({
                key: "Saving",
                y: saving
            })

        }




        $scope.checkbox = [];

        $scope.selectedSemesters= function(index, item){

            if($scope.checkbox[index]) {
                $scope.storage.push(item);
            }

            else{
                var index1 = $scope.storage.indexOf(item);
                $scope.storage.splice(index1, 1);

            }

        }


        $scope.plotbar = function(){

            $scope.optionscompare = {
                chart: {
                    type: 'multiBarChart',
                    height: 450,
                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    }

                }
            };
            $scope.incomes = [];
            $scope.expenses = [];

            $scope.incomebar =[];
            $scope.expensesbar =[];

            var expensesTotal;
            for(var j=0 ; j<$scope.storage.length; j++)
            {
                expensesTotal=0;
                $scope.incomes.push(parseInt($scope.storage[j].incomeAmount));
                for(y=0; y<$scope.storage[j].expenses.length; y++)
                {
                    expensesTotal += parseInt($scope.storage[j].expenses[y].expensesAmount);
                }
                $scope.expenses.push(expensesTotal);
            }

            for(var i=0; i<$scope.storage.length; i++){

                $scope.incomebar.push({
                    "label": $scope.storage[i].semester + ", "+ $scope.storage[i].year,
                    "value": $scope.incomes[i]
                })

                $scope.expensesbar.push({
                    "label": $scope.storage[i].semester+ ", " + $scope.storage[i].year,
                    "value": $scope.expenses[i]
                })

            }

            $scope.dataset = [
                {
                    "key" : "Income",
                    "values" : $scope.incomebar
                },

                {
                    "key" : "Expenses",
                    "values" : $scope.expensesbar
                }
            ];
        }


    })