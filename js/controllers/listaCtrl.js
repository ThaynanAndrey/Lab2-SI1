angular.module("myApp")

.controller("myController", function($scope) {

	function Tarefa(nome, data) {
		
		this.nome = nome;
		this.data = new Date();
		this.realizada = false;
		this.apagada = false;
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
		
		delete $scope.tarefa;
	};
	
	$scope.removerTarefa = function(tarefa) {
		
		tarefa.apagada = true;
		tarefa.realizada = false;
		
		console.log(tarefa);
		
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
