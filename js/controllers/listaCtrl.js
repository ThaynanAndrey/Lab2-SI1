angular.module("myApp")

.controller("myController", ['$scope', 'RestService', '$state', '$mdSidenav', function($scope, RestService, $state, $mdSidenav) {

	$scope.novaTarefa = "";
	$scope.progresso = 0;
	$scope.arrayListaDeTarefas = [];
	$scope.listaDeTarefasAtual;
	$scope.tarefas = [];
	$scope.prioridades = ["Alta", "Média", "Baixa"];
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


	var addSubtarefasNasTarefas = function(lista, idTarefa) {

		if(lista.length == 0)
			return

		subtarefa = { 
						"nome": lista[lista.length-1],
						"tarefa": { "id": idTarefa }
					};
		lista.pop();

		RestService.add('http://localhost:8080/subtarefas', subtarefa, function(response) {
			
			addSubtarefasNasTarefas(lista, idTarefa);
		});
	};

	$scope.salvarTarefa = function(tarefa) {
		tarefa.listaDeTarefas = { "id": $scope.listaDeTarefasAtual.id};
		lista = tarefa.subtarefas;
		tarefa.subtarefas = [];

		RestService.add('http://localhost:8080/tarefas', tarefa, function(response) {
			geraListaDeTarefas();
			gerarTarefaNova();
			$scope.addNovaTarefa = false;
			$scope.calculaProgresso();
			addSubtarefasNasTarefas(lista, response.data.id);
		});
	};

	$scope.novaTarefa = function() {
		$scope.addNovaTarefa = true;
	};
	
	$scope.cancelarAdicaoTarefa = function() {
		$scope.addNovaTarefa = false;
		$scope.tarefa = {};
	};

	$scope.removerListaDeTarefas = function(listaDeTarefas) {
		var indice = $scope.arrayListaDeTarefas.indexOf(listaDeTarefas);
		$scope.arrayListaDeTarefas.splice(indice, 1);

		RestService.delete('http://localhost:8080/listaDeTarefas/' + listaDeTarefas.id);
		//geraListaDeTarefas();
	};

	$scope.removerTarefa = function(tarefa) {
		
		var indice = $scope.tarefas.indexOf(tarefa);

		if (indice > -1) {
			$scope.tarefas.splice(indice, 1);
			RestService.delete('http://localhost:8080/tarefas/' + tarefa.id);
			$scope.calculaProgresso();
		}
	};

	$scope.isEditTarefa = false;

	$scope.editarTarefa = function(tarefaSelecionada) {
		$scope.isEditTarefa = true;
		$scope.tarefa = tarefaSelecionada;
		$scope.addNovaTarefa = true;
	};

	$scope.selectEditTarefa = function() {

		RestService.edit('http://localhost:8080/tarefas', $scope.tarefa, function(response) {
			geraListaDeTarefas();
			gerarTarefaNova();
			$scope.isEditTarefa = false;
			$scope.calculaProgresso();
		});

	};

	$scope.removerTodasTarefas = function() {

		for (var i = $scope.tarefas.length - 1; i >= 0; i--) {
			$scope.removerTarefa($scope.tarefas[i]);
		}
	};

	$scope.removerTodasAsListasDeTarefa = function() {
		for (var i = $scope.arrayListaDeTarefas.length - 1; i >= 0; i--) {
			$scope.removerListaDeTarefas($scope.arrayListaDeTarefas[i]);
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
		$scope.subtarefasAtuais = $scope.tarefaSelecionada.subtarefas;
		$mdSidenav('taskInfo').toggle();
	};
}]);