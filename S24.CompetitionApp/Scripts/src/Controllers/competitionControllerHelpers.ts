import { Awesomeplete } from "../helpers/awesomeplete";
import { SortableList } from "../helpers/sortablelist";
import { CompetitionServiceModel } from "../ServiceModels/competitionServiceModel";

// tslint:disable-next-line:no-namespace
export namespace CompetitionControllerHelpers {
    export function fillAllLists(tableData) {
        // Fill all lists
        tableData = tableData ? tableData : {};

        // Add agreement data
        const agreementObj = {
            serviceName: "GetAllAgreements",
            listFromId: "sortableListAgreementFrom",
            listToId: "sortableListAgreementTo",
            listConnection: "sortableListAgreement",
            tableDataId: "PVProductAgreementId",
            tableDataName: "PVProductAgreementName",
            buttons: "sortableListAgreementButtons"
        };

        buildSortableList(agreementObj, tableData.PVProductAgreementSet);
        SortableList.sortableButtons(agreementObj);

        // Add region data
        const regionObj = {
            serviceName: "GetAllRegions",
            listFromId: "sortableListRegionFrom",
            listToId: "sortableListRegionTo",
            listConnection: "sortableListRegion",
            tableDataId: "SantanderRegionID",
            tableDataName: "SantanderRegion",
            buttons: "sortableListRegionButtons"
        };

        buildSortableList(regionObj, tableData.SantanderRegionSet);
        SortableList.sortableButtons(regionObj);

        // Add district data
        const districtObj = {
            serviceName: "GetAllDistricts",
            listFromId: "sortableListDistrictFrom",
            listToId: "sortableListDistrictTo",
            listConnection: "sortableListDistrict",
            tableDataId: "SantanderDistrictID",
            tableDataName: "SantanderDistrict",
            buttons: "sortableListDistrictButtons"
        };

        buildSortableList(districtObj, tableData.SantanderDistrictSet);
        SortableList.sortableButtons(districtObj);

        // Add key account manager data
        const keyAccountManagerObj = {
            serviceName: "GetAllKeyAccountManagers",
            listFromId: "sortableListResponsibleFrom",
            listToId: "sortableListResponsibleTo",
            listConnection: "sortableListResponsible",
            tableDataId: "PVKeyAccountManagerId",
            tableDataName: "PVKeyAccountManagerName",
            buttons: "sortableListResponsibleButtons"
        };

        buildSortableList(keyAccountManagerObj, tableData.PVKeyAccountManagerSet);
        SortableList.sortableButtons(keyAccountManagerObj);

        // Add dealers data
        const dealerObj = {
            serviceName: "GetAllDealers",
            listFromId: "sortableListDealerFrom",
            listToId: "sortableListDealerTo",
            hiddenListId: "awesomplete__listChooseDealer",
            hiddenList2Id: "awesomplete__listSearchDealer",
            awesomeInputId: "txtChooseDealer",
            awesomeInput2Id: "txtSearchDealer",
            listConnection: "sortableListDealer",
            tableDataId: "PVDealerId",
            tableDataName: "PVDealerName",
            buttons: "sortableListDealerButtons"
        };

        buildSortableList(dealerObj, tableData.PVDealerSet);
        SortableList.sortableButtons(dealerObj);

        // Add override dealers data
        const OverrideDealerObj = {
            serviceName: "GetAllDealers",
            listFromId: "sortableListOverrideDealerFrom",
            listToId: "sortableListOverrideDealerTo",
            listConnection: "sortableListOverrideDealer",
            tableDataId: "PVDealerId",
            tableDataName: "PVDealerName",
            buttons: "sortableListOverrideDealerButtons"
        };

        buildSortableList(OverrideDealerObj, tableData.PVDealerOverrideSet);
        SortableList.sortableButtons(OverrideDealerObj);

        // Add dealer groups data
        const dealerGroupObj = {
            serviceName: "GetAllDealerGroups",
            listFromId: "sortableListDealerGroupFrom",
            listToId: "sortableListDealerGroupTo",
            listConnection: "sortableListDealerGroup",
            tableDataId: "PVDealerGroupId",
            tableDataName: "PVDealerGroupName",
            buttons: "sortableListDealerGroupButtons"
        };

        buildSortableList(dealerGroupObj, tableData.PVDealerGroupSet);
        SortableList.sortableButtons(dealerGroupObj);

        // Add make data
        const makeObj = {
            serviceName: "GetAllObjectMake",
            listFromId: "sortableListMakeFrom",
            listToId: "sortableListMakeTo",
            hiddenListId: "awesomplete__listChooseCarMake",
            awesomeInputId: "txtChooseCarMake",
            listConnection: "sortableListMake",
            tableDataId: "PVObjectMakeId",
            tableDataName: "PVObjectMakeName",
            buttons: "sortableListMakeButtons",
        };

        buildSortableList(makeObj, tableData.PVObjectMakeSet);
        SortableList.sortableButtons(makeObj);

        // Exclude Seller
        const excludeSellerObj = {
            listFromId: "sortableListExcludeSellerFrom",
            listToId: "sortableListExcludeSellerTo",
            listConnection: "sortableListExcludeSeller",
            tableDataId: "PVSalespersonDealerId",
            tableDataName: "PVSalespersonDealerName",
            buttons: "sortableListExcludeSellerButtons",
        };

        buildSortableList(excludeSellerObj, tableData.PVSalespersonDealerSet);
        SortableList.sortableButtons(excludeSellerObj);

        // Models
        const modelObj = {
            listFromId: "sortableListModelFrom",
            listToId: "sortableListModelTo",
            listConnection: "sortableListModel",
            tableDataId: "PVObjectModelId",
            tableDataName: "PVObjectModelName",
            buttons: "sortableListModelButtons",
        };

        buildSortableList(modelObj, tableData.PVObjectModelSet);
        SortableList.sortableButtons(modelObj);
    }

    export function setListValues(listIdFrom, listIdTo, itemPropId, itemPropName) {
        // list
        const thisPropObj: any = { propId: itemPropId, propName: itemPropName };
        const thisListTo = $("#" + listIdTo);
        const thisObjList = [];
        let thisObj = {};
        const thisList = thisListTo;

        // Go trough list items
        thisList.find("li").each(function() {
            thisObj = {};
            thisObj[thisPropObj.propId] = $(this).attr("data-value");
            thisObj[thisPropObj.propName] = $(this).attr("data-value") == "-1" ? "Alle" : $(this).text();
            thisObjList.push(thisObj);
        });

        return thisObjList;
    }

    export function buildSortableList(obj, currentObj) {
        const competitionServiceModel: CompetitionServiceModel = new CompetitionServiceModel();
        if (obj) {
            const thisCurrentObj = currentObj;
            if (obj.serviceName) {
                competitionServiceModel.getData(obj.serviceName, (tableData) => {
                    if (tableData) {
                        // Vars
                        const listFromId = obj.listFromId;
                        const listToId = obj.listToId;
                        const hiddenListId = obj.hiddenListId;
                        const hiddenList2Id = obj.hiddenList2Id;
                        const awesomeInputId = obj.awesomeInputId;
                        const awesomeInput2Id = obj.awesomeInput2Id;
                        const listConnection = obj.listConnection;
                        const tableDataId = obj.tableDataId;
                        const tableDataName = obj.tableDataName;

                        // Jquery controls
                        const listFrom = $(`#${listFromId}`);
                        const listTo = $(`#${listToId}`);
                        let hiddenList = null;
                        let hiddenList2 = null;
                        if (hiddenListId) {
                            hiddenList = $(`#${hiddenListId}`);
                        }
                        if (hiddenList2Id) {
                            hiddenList2 = $(`#${hiddenList2Id}`);
                        }

                        // Make list sortable
                        SortableList.sortable(listFromId, listToId, listConnection);

                        // Loop
                        const arrayObjs = SortableList.getArrayItems(tableData, tableDataId, tableDataName, thisCurrentObj);

                        if (arrayObjs.arrayTo.length > 0) {
                            listFrom.append(arrayObjs.arrayFrom.join(""));
                            listTo.append(arrayObjs.arrayTo.join(""));
                        } else {
                            listFrom.append(arrayObjs.arrayAll.join(""));
                        }

                        if (hiddenList) {
                            hiddenList.append(arrayObjs.arrayAll.join(""));
                        }
                        if (hiddenList2) {
                            hiddenList2.append(arrayObjs.arrayAll.join(""));
                        }

                        // Fire awesomelist
                        if (awesomeInputId) {
                            const awesomeInput = $("#" + awesomeInputId);
                            Awesomeplete.build(awesomeInput, competitionServiceModel);
                        }
                        if (awesomeInput2Id) {
                            const awesomeInput2 = $("#" + awesomeInput2Id);
                            Awesomeplete.build(awesomeInput2, competitionServiceModel);
                        }

                        // Add default item
                        if (listTo.attr("data-defaultvalue") == "true" && listTo.find("li").length <= 0) {
                            listTo.append("<li class='ui-state-custom-default unsortable' data-value='-1'>Alle</li>");
                        }

                        // Add event handlers
                        SortableList.sortableListItems(listFromId, listToId);
                    }
                });
            } else {
                const listToId = obj.listToId;

                // Jquery controls
                const listTo = $(`#${listToId}`);

                if (thisCurrentObj) {
                    // Vars
                    const listFromId = obj.listFromId;
                    const listConnection = obj.listConnection;
                    const tableDataId = obj.tableDataId;
                    const tableDataName = obj.tableDataName;

                    // Make list sortable
                    SortableList.sortable(listFromId, listToId, listConnection);

                    // Loop
                    const arrayObjs = SortableList.getArrayItems(null, tableDataId, tableDataName, thisCurrentObj);

                    if (arrayObjs.arrayTo.length > 0) {
                        listTo.append(arrayObjs.arrayTo.join(""));
                    }

                    // Add event handlers
                    SortableList.sortableListItems(listFromId, listToId);
                }

                // Add default item
                if (listTo.attr("data-defaultvalue") == "true" && listTo.find("li").length <= 0) {
                    listTo.append("<li class='ui-state-custom-default unsortable' data-value='-1'>Alle</li>");
                }
            }
        }
    }

    export function getTrendClass(trend: number) {
        return trend > 0 ? " trending-up" : trend < 0 ? " trending-down" : " trending-unchanged";
    }

    export function tabButtons(ctrl) {
        const btnNext = $("#btnNext");
        const btnPrevious = $("#btnPrevious");
        let currenttab: number = $("#competitionTabs").tabs("option", "active");
        const numberTabs = $("#competitionTabs ul").children("li.ui-tabs-tab").length - 1;
        if (ctrl) {
            // Check current tab and assign the new one in case is valid
            if (ctrl.attr("id") == "btnNext") {
                if (currenttab < numberTabs) {
                    currenttab++;
                    $("#competitionTabs").tabs("option", "active", currenttab);
                    if (currenttab >= numberTabs) {
                        ctrl.prop("disabled", true);
                    }
                    btnPrevious.prop("disabled", false);
                }
            } else {
                if (currenttab > 0) {
                    currenttab--;
                    $("#competitionTabs").tabs("option", "active", currenttab);
                    if (currenttab <= 0) {
                        ctrl.prop("disabled", true);
                    }
                    btnNext.prop("disabled", false);
                }
            }

            // Set current tab
            $("#competitionTabs").tabs("option", "active", currenttab);
            // Focus current tab
            $("#competitionTabs ul li")[currenttab].focus();
        } else {
            switch (currenttab) {
                case 0:
                    btnPrevious.prop("disabled", true);
                    btnNext.prop("disabled", false);
                    break;

                case numberTabs:
                    btnPrevious.prop("disabled", false);
                    btnNext.prop("disabled", true);
                    break;

                default:
                    btnPrevious.prop("disabled", false);
                    btnNext.prop("disabled", false);
                    break;
            }
        }
    }
}
