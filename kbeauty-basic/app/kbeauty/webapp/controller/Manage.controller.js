sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/VBox",
    "sap/m/Text"
], function (Controller, History, MessageToast, MessageBox, VBox, Text) {
    "use strict";

    return Controller.extend("kbeauty.controller.Manage", {

        /**
         * Navigation handler to return to the previous page or Main view
         */
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteMain", {}, true);
            }
        },

        /**
         * Create a new empty product row at the top of the table using OData v4 binding
         */
        onAddRow: function () {
            var oTable = this.byId("tableManageProducts");
            var oListBinding = oTable.getBinding("items");

            if (oListBinding) {
                // Insert a new entry at the beginning (unshift)
                var oNewContext = oListBinding.create({
                    ID: "",
                    name: "",
                    price: 0,
                    stock: 0,
                    brand_ID: "",
                    category_ID: ""
                }, true);

                // Focus on the table after creation
                oTable.focus();
            }
        },

        /**
         * Cancel pending changes and revert new rows/edits
         */
        onCancel: function () {
            var oModel = this.getView().getModel();
            
            // Check for uncommitted changes in the OData model
            if (oModel.hasPendingChanges()) {
                oModel.resetChanges();
                MessageToast.show("Changes cancelled.");
            } else {
                MessageToast.show("No pending changes to cancel.");
            }
        },

        /**
         * Delete all selected rows in the MultiSelect table with confirmation dialog
         */
        onDeleteSelected: function () {
            var oTable = this.byId("tableManageProducts");
            var aSelectedItems = oTable.getSelectedItems();

            // Check if user has selected any row
            if (aSelectedItems.length === 0) {
                MessageToast.show("Please select at least one row to delete.");
                return;
            }

            // Create bilingual confirmation dialog content (Korean & English)
            var oDialogContent = new VBox({
                items: [
                    new Text({
                        text: "선택한 항목을 삭제하시겠습니까?" // Korean: Are you sure you want to delete selected items?
                    }).addStyleClass("sapUiTinyMarginBottom"),
                    
                    new Text({
                        text: "Are you sure you want to delete the selected item(s)?" // Italic English subtitle
                    }).addStyleClass("customSubTextItalic")
                ]
            });

            // Prompt confirmation dialog before executing deletion
            MessageBox.confirm(oDialogContent, {
                title: "Confirm Delete",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.NO,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Delete all selected contexts
                        aSelectedItems.forEach(function (oItem) {
                            var oContext = oItem.getBindingContext();
                            if (oContext && oContext.delete) {
                                oContext.delete();
                            }
                        });

                        // Clear table selection states and notify user
                        oTable.removeSelections();
                        MessageToast.show("Deleted successfully.");
                    }
                }
            });
        },

        /**
         * Submit all pending batch updates to the backend
         */
        onSaveAll: function () {
            var oModel = this.getView().getModel();

            if (oModel.hasPendingChanges()) {
                oModel.submitBatch("$auto").then(function () {
                    MessageToast.show("All changes saved!");
                }).catch(function (oError) {
                    MessageToast.show("Save failed: " + oError.message);
                });
            } else {
                MessageToast.show("No changes to save.");
            }
        }

    });
});