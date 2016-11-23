var app = angular.module("myApp", []);

app.controller("myController", function($scope) {

	function Tarefa(nome, data) {
		
		this.nome = nome;
		this.data = new Date();
		this.realizada = false;
	};

	$scope.tarefas = [ new Tarefa("Jogar Bola"),
					   new Tarefa("Comer Cuscuz")
	];
	
	$scope.novaTarefa = "";
	$scope.progresso = 0;
	

	$scope.adicionarTarefa = function(tarefa) {
		$scope.tarefas.push(new Tarefa(tarefa));
		$scope.novaTarefa = "";
		
		$scope.calculaProgresso();
	}
	
	$scope.calculaProgresso = function() {
		
		console.log("chegou nesta porra");
		var total = 0;
		
		for(var i=0; i < $scope.tarefas.length; i++) {
				
			if($scope.tarefas[i].realizada)
				total++;
		}
		
		$scope.progresso = total / $scope.tarefas.length * 100;
	};
});
