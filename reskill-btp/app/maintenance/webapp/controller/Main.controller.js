sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (Controller, Fragment, Filter, FilterOperator, MessageBox) {
    "use strict";

    return Controller.extend("maintenance.controller.Main", {

        /**
         * Lifecycle hook called when controller is initialized
         */
        onInit: function () {
        },

        // Xử lý sự kiện khi click vào Menu Side Navigation
        onSideNavSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey();
            var oNavContainer = this.byId("idNavContainer");

            switch (sKey) {
                case "orders":
                    oNavContainer.to(this.byId("pageOrders"));
                    break;
                case "dashboard":
                    oNavContainer.to(this.byId("pageDashboard"));
                    break;
                case "equipment":
                    oNavContainer.to(this.byId("pageEquipment"));
                    break;
                case "technicians":
                    oNavContainer.to(this.byId("pageTechnicians"));
                    break;
                case "audit":
                    oNavContainer.to(this.byId("pageAudit"));
                    break;
                default:
                    oNavContainer.to(this.byId("pageOrders"));
                    break;
            }
        },

        onFilterSearch: function () {
            var aFilters = [];

            // 1. Search Text
            var sSearch = this.byId("inpSearch").getValue();
            if (sSearch) {
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.Contains, sSearch),
                        new sap.ui.model.Filter("Equipment", sap.ui.model.FilterOperator.Contains, sSearch),
                        new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sSearch)
                    ],
                    and: false
                }));
            }

            // 2. Equipment Filter
            var sEq = this.byId("selEq").getSelectedKey();
            if (sEq && sEq !== "All") {
                aFilters.push(new sap.ui.model.Filter("Equipment", sap.ui.model.FilterOperator.EQ, sEq));
            }

            // 3. Plant Filter
            var sPlant = this.byId("selPlant").getSelectedKey();
            if (sPlant && sPlant !== "All") {
                aFilters.push(new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, sPlant));
            }

            // 4. Status Filter
            var sStatus = this.byId("selStatus").getSelectedKey();
            if (sStatus && sStatus !== "All") {
                aFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sStatus));
            }

            // 5. Priority Filter
            var sPriority = this.byId("selPriority").getSelectedKey();
            if (sPriority && sPriority !== "All") {
                aFilters.push(new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.EQ, sPriority));
            }

            // 6. Maintenance Type Filter
            var sType = this.byId("selMaintType").getSelectedKey();
            if (sType && sType !== "All") {
                aFilters.push(new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, sType));
            }

            // 7. Planner Filter
            var sPlanner = this.byId("selPlanner").getSelectedKey();
            if (sPlanner && sPlanner !== "All") {
                aFilters.push(new sap.ui.model.Filter("Planner", sap.ui.model.FilterOperator.EQ, sPlanner));
            }

            // Apply Filter sang Binding của Table
            var oTable = this.byId("idOrdersTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onFilterClear: function () {
            this.byId("inpSearch").setValue("");
            this.byId("selEq").setSelectedKey("All");
            this.byId("selPlant").setSelectedKey("All");
            this.byId("selStatus").setSelectedKey("All");
            this.byId("selPriority").setSelectedKey("All");
            this.byId("selMaintType").setSelectedKey("All");
            this.byId("selPlanner").setSelectedKey("All");
            this.byId("dpScheduledDate").setValue("");

            // Clear filter khỏi bảng
            var oTable = this.byId("idOrdersTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([]);
        },

        /**
         * Handles the Assign button press event to open technician selection dialog
         */
        onAssignPress: function () {
            const oTable = this.byId("idOrdersTable");
            const oSelectedItem = oTable.getSelectedItem();

            // Check if user selected a row from the table
            if (!oSelectedItem) {
                MessageBox.warning("Please select a Maintenance Order row first.");
                return;
            }

            const oSelectedContext = oSelectedItem.getBindingContext();
            const sRequiredSkill = oSelectedContext.getProperty("TechnicianSkill");

            // Load and open the Technician Value Help Dialog
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "maintenance.view.TechnicianDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._pDialog.then(function (oDialog) {
                // Filter technicians: Matching Skill AND Available = 'YES'
                const aFilters = [
                    new Filter("Skill", FilterOperator.EQ, sRequiredSkill),
                    new Filter("Available", FilterOperator.EQ, "YES")
                ];

                const oBinding = oDialog.getBinding("items");
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));

                oDialog.open();
            });
        },

        /**
         * Handles search/filter inside the technician dialog
         * @param {sap.ui.base.Event} oEvent The search event
         */
        onDialogSearch: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oTable = this.byId("idOrdersTable");
            const oSelectedContext = oTable.getSelectedItem().getBindingContext();
            const sRequiredSkill = oSelectedContext.getProperty("TechnicianSkill");

            const aFilters = [
                new Filter("Skill", FilterOperator.EQ, sRequiredSkill),
                new Filter("Available", FilterOperator.EQ, "YES")
            ];

            if (sValue) {
                aFilters.push(new Filter("Name", FilterOperator.Contains, sValue));
            }

            const oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        /**
         * Handles selection confirmation in the dialog and updates the assigned technician
         * @param {sap.ui.base.Event} oEvent The confirm event
         */
        onDialogConfirm: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            if (!oSelectedItem) {
                return;
            }

            const oNewTechContext = oSelectedItem.getBindingContext();
            const sNewTechID = oNewTechContext.getProperty("ID");
            const sNewTechName = oNewTechContext.getProperty("Name");

            const oTable = this.byId("idOrdersTable");
            const oOrderContext = oTable.getSelectedItem().getBindingContext();

            // Update property via OData V4 context binding
            oOrderContext.setProperty("technician_ID", sNewTechID);

            MessageBox.success("Technician successfully replaced with: " + sNewTechName);
        },

        /**
         * Handles dialog cancellation
         */
        onDialogCancel: function () {
            // Dialog closes automatically
        }

    });
});