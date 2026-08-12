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
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Binds the view element to the target entity using OData V4 binding path.
         * @param {sap.ui.base.Event} oEvent Pattern matched event object
         * @private
         */
        _onObjectMatched: function (oEvent) {
            const sProductId = oEvent.getParameter("arguments").productId;
            const oView = this.getView();
            const sPath = `/Products('${sProductId}')`;

            oView.unbindElement();

            oView.bindElement({
                path: sPath,
                parameters: {
                    $expand: "brand,category"
                },
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },

        /**
         * Navigates back to the main list or previous browser history state.
         */
        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            const oRouter = this.getOwnerComponent().getRouter();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                oRouter.navTo("RouteMain", {}, true);
            }
        }
    });
});