sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("kbeauty.controller.Main", {
        onInit: function () {
        },

        /**
         * Navigation press handler for table rows
         * @param {sap.ui.base.Event} oEvent 
         */
        onRowNavigationPress: function (oEvent) {
            // 1. Get the current row control
            var oRow = oEvent.getSource().getParent();
            
            // 2. Get binding context of the row
            var oBindingContext = oRow.getBindingContext();
            if (!oBindingContext) {
                return;
            }

            // 3. Extract the ID parameter (cuid from schema.cds)
            var sProductId = oBindingContext.getProperty("ID");

            // 4. Navigate via Router
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDetail", {
                productId: sProductId
            });
        }
    });
});