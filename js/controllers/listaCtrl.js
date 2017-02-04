angular.module("myApp")

.controller("myController", ['$scope', 'RestService', '$state', '$mdSidenav', function($scope, RestService, $state, $mdSidenav) {

	$scope.novaTarefa = "";
	$scope.progresso = 0;
	$scope.arrayListaDeTarefas = [];
	$scope.listaDeTarefasAtual;
	$scope.tarefas = [];
	$scope.tarefa = {};
	$scope.tarefaSelecionada;
	gerarTarefaNova();
	geraListaDeTarefas();
	$scope.apresentarListaDeTarefas = true;
	$scope.addNovaTarefa = false;

	function gerarTarefaNova() {
		$scope.tarefa = {
			nome: undefined,
			categoria: undefined,
			subTarefa: [],
			prioridade: undefined,
			realizada: undefined,
			descricao: undefined
		}
	};
	
	function geraListaDeTarefas() {
		RestService.find('http://localhost:8080/listaDeTarefas', function(response) {
			$scope.arrayListaDeTarefas = response.data;

			if($scope.arrayListaDeTarefas.length > 0) {
				$scope.tarefas = $scope.arrayListaDeTarefas[0].tarefas;
				$scope.listaDeTarefasAtual = $scope.arrayListaDeTarefas[0];
				$scope.calculaProgresso();
			}
			else {
				$scope.tarefas = [];
			}
		});
	};
	
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

	$scope.caregarTarefasDaListaEspecifica = function(listaDeTarefa) {
		$scope.listaDeTarefasAtual = listaDeTarefa;
		$scope.tarefas = listaDeTarefa.tarefas;
		$scope.calculaProgresso();
	};

	$scope.criarNovaListaDeTarefa = function() {
		$scope.apresentarListaDeTarefas = false;
	};

	$scope.cancelarCiracaoNovaListaDeTarefa = function() {
		$scope.apresentarListaDeTarefas = true;
	};

	$scope.salvarListaDeTarefa = function(novaListaDeTarefas) {

		RestService.add('http://localhost:8080/listaDeTarefas', novaListaDeTarefas, function(response) {
			geraListaDeTarefas();
			$scope.novaListaDeTarefas = {};
			$scope.apresentarListaDeTarefas = true;	
			$scope.calculaProgresso();
		});
	};

	$scope.salvarTarefa = function(tarefa) {
		tarefa.listaDeTarefas = { "id": $scope.listaDeTarefasAtual.id};

		RestService.add('http://localhost:8080/tarefas', tarefa, function(response) {
			geraListaDeTarefas();
			$scope.tarefa = {};
			$scope.addNovaTarefa = false;
			$scope.calculaProgresso();
		});
	};

	$scope.novaTarefa = function() {
		$scope.addNovaTarefa = true;
		//$state.go('adicionarTarefa');
	};
	
	$scope.cancelarAdicaoTarefa = function() {
		//$state.go('home');
		$scope.addNovaTarefa = false;
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

	$scope.editarTarefa = function(tarefaSelecionada) {
		$scope.tarefa = tarefaSelecionada;
		$scope.addNovaTarefa = true;
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
		$scope.tarefaSelecionada = tarefa;
		$mdSidenav('taskInfo').toggle();
	};
}]);