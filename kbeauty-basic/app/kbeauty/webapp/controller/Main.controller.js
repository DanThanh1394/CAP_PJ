sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, Filter, FilterOperator, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("kbeauty.controller.Main", {
        /**
         * Called when the controller is instantiated.
         * Used for view initialization logic.
         */
        onInit: function () {
        },

        /**
         * Handles the search event triggered by the FilterBar (Go button click or Enter key press).
         * Extracts active conditions from the MDC FilterBar, builds UI5 Filter objects,
         * and applies them to the table's row binding.
         * 
         * @param {sap.ui.base.Event} oEvent Event object triggered by the FilterBar search action
         */
        onFilterSearch: function (oEvent) {
            const oTable = this.byId("productTable");
            const oFilterBar = this.byId("filterbar");
            
            // Guard clause: ensure view controls are instantiated
            if (!oTable || !oFilterBar) {
                return;
            }

            // Retrieve the table's row binding context
            const oBinding = oTable.getBinding("rows");
            if (!oBinding) {
                return;
            }

            // Retrieve all active filter conditions from the FilterBar
            const mConditions = oFilterBar.getConditions();
            const aFilters = [];

            /**
             * Helper function to extract conditions for a specific field and construct multi-value OR filters.
             * 
             * @param {string} sFieldPath The property key in the OData entity (e.g., "brand_ID")
             * @param {Array<object>} aConds MDC condition objects retrieved from mConditions
             * @param {string} [sOperator] Filter operator (defaults to FilterOperator.EQ)
             */
            const fnBuildFilters = function (sFieldPath, aConds, sOperator) {
                if (Array.isArray(aConds) && aConds.length > 0) {
                    const aSubFilters = [];
                    aConds.forEach(function (oCond) {
                        if (oCond && oCond.values && oCond.values.length > 0) {
                            // Extract key value (e.g., "B003", "C002")
                            aSubFilters.push(new Filter({
                                path: sFieldPath,
                                operator: sOperator || FilterOperator.EQ,
                                value1: oCond.values[0]
                            }));
                        }
                    });

                    // Combine multiple tokens for the same field with logical OR (and = false)
                    if (aSubFilters.length > 0) {
                        aFilters.push(new Filter({
                            filters: aSubFilters,
                            and: false
                        }));
                    }
                }
            };

            // 1. Process Basic Search field condition ($search or filterbar search property)
            let sSearchVal = "";
            const aSearchConds = mConditions.$search;
            
            if (Array.isArray(aSearchConds) && aSearchConds.length > 0 && aSearchConds[0].values && aSearchConds[0].values.length > 0) {
                sSearchVal = aSearchConds[0].values[0];
            } else if (typeof oFilterBar.getSearch === "function") {
                sSearchVal = oFilterBar.getSearch();
            }

            if (sSearchVal) {
                // Ignore case sensitivity so "green" matches "Green Tea Serum"
                aFilters.push(new Filter({
                    path: "name",
                    operator: FilterOperator.Contains,
                    value1: sSearchVal,
                    caseSensitive: false
                }));
            }

            // 2. Process Brand filter field condition
            fnBuildFilters("brand_ID", mConditions["brand/name"], FilterOperator.EQ);

            // 3. Process Category filter field condition
            fnBuildFilters("category_ID", mConditions["category/name"], FilterOperator.EQ);

            // Apply the aggregated filters array to the table's row binding
            oBinding.filter(aFilters);
        },

        /**
         * Handles row navigation events when the navigation arrow in a table row is pressed.
         * Extracts the product ID from the row context and navigates to the detail route.
         * 
         * @param {sap.ui.base.Event} oEvent Event object triggered by the RowActionItem
         */
        onRowNavigationPress: function (oEvent) {
            const oRow = oEvent.getSource().getParent();
            const oBindingContext = oRow.getBindingContext();
            
            // Guard clause: ensure binding context exists
            if (!oBindingContext) {
                return;
            }

            // Extract key property and trigger routing
            const sProductId = oBindingContext.getProperty("ID");
            const oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.navTo("RouteDetail", {
                productId: sProductId
            });
        },

        /**
         * Handles the press event of the "Add Product" button.
         * Loads and opens the Add Product dialog fragment lazily.
         */
        onAddProductPress: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteManage");
        },

        /**
         * Handles the save action triggered from the Add Product dialog.
         * Validates inputs, creates a new product record, and updates the local model payload.
         */
        onSaveProduct: function () {
            // Retrieve values from input fields and ComboBoxes
            const sId = this.byId("inpAddId").getValue();
            const sName = this.byId("inpAddName").getValue();
            const sPrice = this.byId("inpAddPrice").getValue();
            const sStock = this.byId("inpAddStock").getValue();
            const sStatus = this.byId("cmbAddStatus").getValue();
            const sExpiry = this.byId("cmbAddExpiry").getValue();
            const sBrand = this.byId("cmbAddBrand").getValue();
            const sCategory = this.byId("cmbAddCategory").getValue();

            // Validate mandatory fields
            if (!sId || !sName) {
                MessageToast.show("Please enter both Product ID and Name.");
                return;
            }

            const oTable = this.byId("productTable");
            const oModel = oTable.getModel();

            // Append new record with all attributes to JSON Model payload
            const aProducts = oModel.getProperty("/Products") || [];
            aProducts.push({
                ID: sId,
                name: sName,
                price: parseFloat(sPrice) || 0,
                stock: parseInt(sStock, 10) || 0,
                status: sStatus || "Available",
                expiryMonths: parseInt(sExpiry, 10) || 24,
                brand: { name: sBrand },
                category: { name: sCategory },
                currency: "KRW"
            });

            oModel.setProperty("/Products", aProducts);
            MessageToast.show("Product added successfully!");

            // Reset inputs and close dialog
            this.onCloseAddDialog();
        },

        /**
         * Closes the Add Product dialog instance if open.
         */
        onCloseAddDialog: function () {
            if (this._oAddDialog) {
                this._oAddDialog.close();
            }
        }
    });
});