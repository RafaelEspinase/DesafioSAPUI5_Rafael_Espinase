sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("desafio.l4e.app.controller.ConsultaPlataformas", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaPlataformas").attachPatternMatched(this.handleRouteMatched, this);
            },
            handleRouteMatched: async function(){
                var that=this;
                $.ajax({
                    "url":"/api/plataformas",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Plataformas");
                        
                    },
                    error(){
                    }
                })
                
            },
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('listItem').getBindingContext("Plataformas").getObject().id;
                this.getView().setBusy(true);

                await
                $.ajax({
                        "url":`/api/plataformas/${id}`,
                        "method": "DELETE",
                        success(data){
                            MessageBox.success("Excluido com sucesso!")
                        },
                        error(){
                            MessageBox.error("Não foi possível excluir a Plataforma")
                        }

                })
                await this.handleRouteMatched();
                this.getView().setBusy(false);
            },
            onNavEditarPlataforma: function(oEvent){
                var plataformaId = oEvent.getSource().getBindingContext("Plataformas").getObject().id;
                this.getRouter().navTo("EditarPlataformas", {id: plataformaId});
            },
            onSearch: function(oEvent){
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = [new Filter("nome", FilterOperator.Contains, sQuery),
                                new Filter("id", FilterOperator.EQ, sQuery)];
                }

                aFilters = new Filter({
                filters: filter,
                    and: false
                })

                var oList = this.byId("tablePlataformas");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
                
            }
        });
         
    });