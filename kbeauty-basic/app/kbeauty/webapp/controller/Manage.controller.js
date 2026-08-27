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
                    brand_ID: null,       // Truyền null để OData v4 nhận diện đúng khóa ngoại
                    category_ID: null,    // Truyền null
                    expiryMonth: 12,      // Giá trị mặc định cho cột 유통기한
                    description: ""       // Giá trị mặc định cho 상세 설명
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

            if (oModel.hasPendingChanges("myUpdateGroup")) {
                oModel.resetChanges("myUpdateGroup");
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
                        var aPromises = [];
                        aSelectedItems.forEach(function (oItem) {
                            var oContext = oItem.getBindingContext();
                            if (oContext && oContext.delete) {
                                aPromises.push(oContext.delete());
                            }
                        });

                        Promise.all(aPromises).then(function () {
                            oTable.removeSelections();
                            MessageToast.show("Deleted successfully.");
                        }).catch(function (oError) {
                            MessageBox.error("Delete failed: " + (oError.message || oError));
                        });
                    }
                }
            });
        },

        /**
         * Submit all pending batch updates to the backend with confirmation dialog
         */
        onSaveAll: function () {
            var oModel = this.getView().getModel();
            var oRouter = this.getOwnerComponent().getRouter();

<<<<<<< HEAD
            if (!oModel.hasPendingChanges("myUpdateGroup")) {
                MessageToast.show("No changes to save.");
                return;
            }

            var oDialogContent = new VBox({
                items: [
                    new Text({
                        text: "변경 사항을 저장하시겠습니까?"
                    }).addStyleClass("sapUiTinyMarginBottom"),

                    new Text({
                        text: "Are you sure you want to save these changes?"
                    }).addStyleClass("customSubTextItalic")
                ]
            });

            MessageBox.confirm(oDialogContent, {
                title: "Confirm Save",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL], // Đổi SAVE thành OK
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        oModel.submitBatch("myUpdateGroup").then(function () {
                            MessageToast.show("All changes saved successfully!");
                            oModel.resetChanges("myUpdateGroup");
                            oRouter.navTo("RouteMain");
                        }).catch(function (oError) {
                            MessageBox.error("Save failed: " + (oError.message || oError));
                        });
                    }
                }.bind(this)
            });
        }
=======
            oModel.submitBatch("myUpdateGroup").then(function () {
            MessageToast.show("All changes saved successfully!");

            // Refresh toàn bộ Model để hủy cache và load lại toàn bộ Navigation Properties ($expand)
            oModel.refresh();

            // Chuyển hướng về Main View
            oRouter.navTo("RouteMain");
        }.bind(this)).catch(function (oError) {
            MessageBox.error("Save failed: " + (oError.message || oError));
        });
    }
>>>>>>> 1bc7eb22a675ee1e561f02c15651420e446c8a47

    });
});