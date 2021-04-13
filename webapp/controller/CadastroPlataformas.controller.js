sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel,MessageBox) {
		"use strict";

		return BaseController.extend("desafio.l4e.app.controller.CadastroPlataformas", {
			onInit: function () {
                //rodad e cadastro
                this.getRouter().getRoute("CadastroPlataformas").attachPatternMatched(this.handleRouteMatched, this);
                //rota de edição
                this.getRouter().getRoute("EditarPlataformas").attachPatternMatched(this.handleRouteMatchedEditarPlataforma, this);
            },
            handleRouteMatched: function(){
                
                this.getView().setModel(new JSONModel({
                    "status": "A"
                }), "Plataforma");

            },

            handleRouteMatchedEditarPlataforma: async function(){

                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);

                // Faz a chamada na API para pegar o plataforma selecionado na tabela.
                // Precisamos passar o ID na url para a API retornar apenas os dados do item selecionado.
                await $.ajax({
                    "url": `/api/plataformas/${id}`, // concatena a URL com o ID
                    "method": "GET",
                    success(data) {
                        that.getView().setModel(new JSONModel(data), "Plataforma"); // salva o retorno da API (data) em um Model chamado 'Plataforma'
                    },
                    error() {
                        MessageBox.error("Não foi possível buscar as Plataformas.") //Se der erro de API, exibe uma mensagem ao usuário
                    }
                });

            this.getView().setBusy(false);
            },

            onChangeSwitch: function(oEvent){
                this.getView.getModel("Plataforma").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I");
            },

            onSelectRadioButton: function (oEvent) {
                var oRadioButton = oEvent.getSource(),
                    sValueSelect = oRadioButton.getValueState();
                
                var oModelPlataforma = this.getView().getModel("Plataforma");
                
                if(sValueSelect === 'Success') {
                    oModelPlataforma.setProperty("/status", "A");
                    
                } else {
                    oModelPlataforma.setProperty("/status", "I");
                    
                }
                
                
            },

            onConfirmar: async function(){
                var oPlataforma = this.getView().getModel("Plataforma").getData();
                console.log(oPlataforma);
                var that = this;
                if(this.getRouter().getHashChanger().getHash().search("EditarPlataformas") === 0){
                   
                    this.getView().setBusy(true);

                    await $.ajax(`/api/plataformas/${oPlataforma.id}`, { // Concatena o ID do plataforma selecionado na url
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        // Cria a estrutura dos dados para enviar para API
                        data: JSON.stringify({
                            "nome": oPlataforma.nome,
                            "tipo": oPlataforma.tipo,
                            "status": oPlataforma.status
                        }),
                    
                        success() {
                            // Se a api retornar sucesso, exibe uma mensagem para o usuário e navega para a tela de "ConsultaPlataforma"
                        
                            MessageBox.success("Editado com sucesso!", {
                                onClose: function() {
                                    that.getRouter().navTo("ConsultaPlataformas");
                                    that.getView().setBusy(false);
                                    }
                            });

                        },

                        error() {

                            //Se a api retornar erro, exibe uma mensagem ao usuário
                            
                            MessageBox.error("Não foi possível editar a plataforma.");
                            that.getView().setBusy(false);
                            
                        }

                    });
                }
                else{

                this.getView().setBusy(true);

                await $.ajax("/api/Plataformas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(oPlataforma),
                    
                    success(){
                        
                        MessageBox.success("Salvo com sucesso")
                        that.getView().setBusy(false); 
                    },
                    error(){
                        
                        MessageBox.error("Não foi possível salvar")
                        that.getView().setBusy(false); 
                    }
                })
                
            }
               
            },
            // Função do botão Cancelar
            onCancelar: function(){
                // Se a rota for a de "EditarPlataformas", navega para a tela de Consuta
                // Senão, limpa o model 'Plataforma'
                if(this.getRouter().getHashChanger().getHash().search("EditarPlataformas") === 0){
                    this.getRouter().navTo("ConsultaPlataformas");
                }else{
                    this.getView().setModel(new JSONModel(), "Plataforma")
                }
            }
		});
	});