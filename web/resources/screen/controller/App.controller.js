/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"teched/odataCreate/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("teched.odataCreate.controller.App", {

		onInit: function() {

			var oConfig = this.getOwnerComponent().getModel("config");
			var userName = oConfig.getProperty("/UserName");

			var urlMulti = "/xsodata/purchaseOrder.xsodata";
			this.getOwnerComponent().getModel().setProperty("/mPath", urlMulti);
			this.getOwnerComponent().getModel().setProperty("/mEntity1", "POHeader");

		},
		callService: function() {
			var oTable = this.getView().byId("tblPOHeader");

			var mPath = this.getOwnerComponent().getModel().getProperty("/mPath");
			var mEntity1 = this.getOwnerComponent().getModel().getProperty("/mEntity1");

			var oParams = {};
			oParams.json = true;
			oParams.useBatch = false;
			var oModel = new sap.ui.model.odata.v2.ODataModel(mPath, oParams);
			oModel.attachEvent("requestFailed", oDataFailed);

			function fnLoadMetadata() {
				oTable.setModel(oModel);
				oTable.setEntitySet(mEntity1);
				var oMeta = oModel.getServiceMetadata();
				var headerFields = "";
				for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
					var property = oMeta.dataServices.schema[0].entityType[0].property[i];
					headerFields += property.name + ",";
				}
				oTable.setInitiallyVisibleFields(headerFields);
			}

			oModel.attachMetadataLoaded(oModel, function() {
				fnLoadMetadata();
			});

			oModel.attachMetadataFailed(oModel, function() {
				sap.m.MessageBox.show("Bad Service Definition", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
			});
		},

		callCreate: function(oEvent) {
			var oTable = this.getView().byId("tblPOHeader");
			var oModel = oTable.getModel();
			//	var result = this.getView().getModel().getData();
			var oEntry = {};
			oEntry.PURCHASEORDERID = "0000000000";
			oEntry.PARTNERID = 100000000;
			oEntry.CURRENCY = "EUR";
			oEntry.GROSSAMOUNT = "1137.64";
			oEntry.NETAMOUNT = "956.00";
			oEntry.TAXAMOUNT = "181.64";
			oEntry.DELIVERYDATE = new Date();
			oEntry.APPROVALSTATUS =  "I";
			oEntry.CONFIRMSTATUS = "I";
			oEntry["HISTORY.CHANGEDAT"] = new Date();
			oEntry["HISTORY.CHANGEDBY"] = "1";
			oEntry["HISTORY.CREATEDAT"] = new Date();
			oEntry["HISTORY.CREATEDBY"] = "1";
			oEntry.INVOICINGSTATUS = "I";
			oEntry.LIFECYCLESTATUS = "N";
			oEntry.NOTEID =	"9000000001";
			oEntry.ORDERINGSTATUS = "I";

			oModel.setHeaders({
				"content-type": "application/json;charset=utf-8"
			});
			var mParams = {};
			mParams.success = function() {
				sap.m.MessageToast.show("Create successful");
			};
			mParams.error = this.onErrorCall;
			var mEntity1 = this.getOwnerComponent().getModel().getProperty("/mEntity1");
			oModel.create("/" + mEntity1, oEntry, mParams);
		},

		callExcel: function(oEvent) {
			//Excel Download
			window.open("/node/products/");
			return;
		},
		
		onErrorCall: function(oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}

		}
	});
});