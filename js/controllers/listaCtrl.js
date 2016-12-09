angular.module("myApp")

.controller("myController", function($scope) {

	function Tarefa(nome, data) {
		
		this.nome = nome;
		this.data = new Date();
		this.realizada = false;
	};

	$scope.tarefas = [ new Tarefa("Jogar Bola"),
					   new Tarefa("Comer Cuscuz"),
					   new Tarefa("Treinar para a maratona")
	];
	
	$scope.novaTarefa = "";
	$scope.progresso = 0;
	

	$scope.adicionarTarefa = function(tarefa) {
		$scope.tarefas.push(new Tarefa(tarefa));
		$scope.novaTarefa = "";
		$scope.calculaProgresso();
		
		delete $scope.tarefa;
	};
	
	$scope.removerTarefa = function(tarefa) {
		
		var indice = $scope.tarefas.indexOf(tarefa);

		if (indice > -1) {
 		   $scope.tarefas.splice(indice, 1);
		}

		$scope.calculaProgresso();
	};
	
	$scope.calculaProgresso = function() {

		var total = 0;
		
		for(var i=0; i < $scope.tarefas.length; i++) {
				
			if($scope.tarefas[i].realizada)
				total++;
		}
		
		tamanho = 0;
		for(var i=0; i < $scope.tarefas.length; i++) {
			if(!$scope.tarefas[i].apagada)
				tamanho++;
		}
		
		$scope.progresso = (total / tamanho * 100);
		
		if(isDecimal($scope.progresso)) {
			$scope.progresso = $scope.progresso.toFixed(2);
		}
	};
	
	function isDecimal(numero) {

		if(isNaN(numero)) 
			return false;
		
		return parseInt(numero) != parseFloat(numero);
	};
	
});
