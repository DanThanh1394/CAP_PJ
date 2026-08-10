sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("kbeauty.controller.Detail", {
        /**
         * Called when the controller is instantiated.
         * Attaches route pattern matched event listener.
         */
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Binds the view element to the target entity using OData V4 binding path.
         * @param {sap.ui.base.Event} oEvent - Pattern matched event object
         * @private
         */
        _onObjectMatched: function (oEvent) {
            var sProductId = oEvent.getParameter("arguments").productId;
            var oView = this.getView();

            // Construct proper OData V4 element path with key predicate
            // var sPath = "/Products('" + sProductId + sProductId + "')"; //`${}`
            var sPath = `/Products('${sProductId}')`

            // Unbind previous context to clean up resources before re-binding
            oView.unbindElement();

            // Bind element with standard OData V4 parameters
            oView.bindElement({
                path: sPath,
                parameters: {
                    $expand: "brand,category"
                },
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function (oData) {
                        oView.setBusy(false);
                        if (oData.getParameter("error")) {
                            // Log error if OData call fails
                            console.error("Failed to fetch product detail:", oData.getParameter("error"));
                        }
                    }
                }
            });
        },

        /**
         * Navigates back to the main list or previous browser history state.
         */
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash === undefined) {
                // window.history.go(-1);
                 var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetail", { productId: 'P005'});
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain", {}, true);
            }
        }
    });
});