angular.module("myApp")

.controller("myController", ['$scope', 'RestService', '$state', '$mdSidenav', function($scope, RestService, $state, $mdSidenav) {

	$scope.tarefas = [];
	$scope.tarefa = {};

	RestService.find('http://localhost:8080/tarefas', function(response) {
		$scope.tarefas = response.data;
		$scope.calculaProgresso();
	});

	$scope.novaTarefa = "";
	$scope.progresso = 0;
	
	var reestruturarPrioridade = function() {

		for (var i = 0; i < $scope.tarefas.length; i++) {
			tranformaPrioridadeObjeto($scope.tarefas[i]);
		}
	};

	var tranformaPrioridadeObjeto = function(tarefa) {
		
		var nivel;

		if(tarefa.prioridade === "Alto")
			nivel = 1;

		else if(tarefa.prioridade === "Medio")
			nivel = 2;

		else
			nivel = 3;

		tarefa.prioridade = {
								"tipo": prioridade,
								"nivel": nivel
							}
	};

	$scope.salvarTarefa = function(tarefa) {
		RestService.add('http://localhost:8080/tarefas', tarefa, function(response) {
			$scope.tarefas = response.data;
			$scope.tarefa = {};
			$scope.calculaProgresso();
			$state.go('home');
		});
	};

	$scope.novaTarefa = function() {
		$state.go('adicionarTarefa');
	};
	
	$scope.cancelarAdicaoTarefa = function() {
		$state.go('home');
		$scope.tarefa = {};
	};

	$scope.removerTarefa = function(tarefa) {
		
		var indice = $scope.tarefas.indexOf(tarefa);

		if (indice > -1) {
 		   $scope.tarefas.splice(indice, 1);
 		   RestService.delete('http://localhost:8080/tarefas/' + tarefa.id);
 		   $scope.calculaProgresso();
		}
	};
	

	$scope.removerTodasTarefas = function() {

		for (var i = $scope.tarefas.length - 1; i >= 0; i--) {
			$scope.removerTarefa($scope.tarefas[i]);
		}
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
	
	$scope.ordenarPor = function(ordenacao) {
		$scope.tipoDeordenacao = ordenacao;
	};

	function isDecimal(numero) {

		if(isNaN(numero)) 
			return false;
		
		return parseInt(numero) != parseFloat(numero);
	};

	$scope.apresentarSideNav = function(tarefa) {
      return function() {
        $mdSidenav("left").toggle();
      }
    };

}]);