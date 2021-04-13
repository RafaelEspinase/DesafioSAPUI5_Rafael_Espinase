sap.ui.define([
		"./BaseController"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController) {
		"use strict";

		return BaseController.extend("desafio.l4e.app.controller.Menu", {
			onInit: function () {

            },
            onNavConsultaParceiros: function(){
                this.getRouter().navTo("ConsultaParceiros");
            },
            onNavCadastroParceiros: function(){
                this.getRouter().navTo("CadastroParceiros");
            },
            onItemSelect: function(oEvent){ 
                var item = oEvent.getParameter('item');
                this.getRouter().navTo(item.getKey());
            }
		});
	});