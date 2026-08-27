sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("kbeauty.controller.Main", {

        /* =========================================================== */
        /* Lifecycle Methods                                           */
        /* =========================================================== */

        /**
         * Called when the controller is instantiated.
         * Attaches route matched handler to refresh table binding on navigation back.
         */
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            // Lắng nghe mọi route nhảy về Main View (RouteMain)
            oRouter.getRoute("RouteMain").attachPatternMatched(this._onRouteMatched, this);
        },

        /* =========================================================== */
        /* Event Handlers                                              */
        /* =========================================================== */

        /**
         * Handles search event from FilterBar and applies filters to the table rows.
         */
        onFilterSearch: function (oEvent) {
            const oTable = this.byId("productTable");
            const oFilterBar = this.byId("filterbar");
            
            if (!oTable || !oFilterBar) {
                return;
            }

            const oBinding = oTable.getBinding("rows");
            if (!oBinding) {
                return;
            }

            const mConditions = oFilterBar.getConditions();
            const aFilters = [];

            const fnBuildFilters = function (sFieldPath, aConds, sOperator) {
                if (Array.isArray(aConds) && aConds.length > 0) {
                    const aSubFilters = [];
                    aConds.forEach(function (oCond) {
                        if (oCond && oCond.values && oCond.values.length > 0) {
                            aSubFilters.push(new Filter({
                                path: sFieldPath,
                                operator: sOperator || FilterOperator.EQ,
                                value1: oCond.values[0]
                            }));
                        }
                    });

                    if (aSubFilters.length > 0) {
                        aFilters.push(new Filter({
                            filters: aSubFilters,
                            and: false
                        }));
                    }
                }
            };

            // 1. Basic Search ($search or name)
            let sSearchVal = "";
            const aSearchConds = mConditions.$search;
            
            if (Array.isArray(aSearchConds) && aSearchConds.length > 0 && aSearchConds[0].values && aSearchConds[0].values.length > 0) {
                sSearchVal = aSearchConds[0].values[0];
            } else if (typeof oFilterBar.getSearch === "function") {
                sSearchVal = oFilterBar.getSearch();
            }

            if (sSearchVal) {
                aFilters.push(new Filter({
                    path: "name",
                    operator: FilterOperator.Contains,
                    value1: sSearchVal,
                    caseSensitive: false
                }));
            }

            // 2. Filter Brand & Category
            fnBuildFilters("brand_ID", mConditions["brand/name"], FilterOperator.EQ);
            fnBuildFilters("category_ID", mConditions["category/name"], FilterOperator.EQ);

            oBinding.filter(aFilters);
        },

        /**
         * Navigates to Detail view.
         */
        onRowNavigationPress: function (oEvent) {
            const oRow = oEvent.getSource().getParent();
            const oBindingContext = oRow.getBindingContext();
            
            if (!oBindingContext) {
                return;
            }

            const sProductId = oBindingContext.getProperty("ID");
            const oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.navTo("RouteDetail", {
                productId: sProductId
            });
        },

        /**
         * Navigates to Manage view.
         */
        onAddProductPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteManage");
        },

        /* =========================================================== */
        /* Private / Internal Methods                                  */
        /* =========================================================== */

        /**
         * Executes every time user navigates back to Main View.
         * Refreshes the table row binding to pull the newest records and expanded properties.
         * 
         * @private
         */
        // _onRouteMatched: function () {
        //     const oTable = this.byId("productTable");
        //     if (oTable) {
        //         const oBinding = oTable.getBinding("rows");
        //         if (oBinding) {
        //             // Force refresh dữ liệu OData V4 từ Server
        //             oBinding.refresh();

        //             if (oBinding.getHeaderContext()) {
        //                 oBinding.getHeaderContext().requestRefresh();
        //             }
        //         }
        //     }
        // }
        _onRouteMatched: function () {
            const oTable = this.byId("productTable");
            if (oTable) {
                const oBinding = oTable.getBinding("rows");
                if (oBinding) {
                    oTable.bindRows({
                        path: "/Products",
                        parameters: {
                            $expand: "brand,category"
                        }
                    });
                }
            }
        }
    });
});