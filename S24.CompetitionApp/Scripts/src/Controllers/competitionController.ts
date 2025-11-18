import * as $ from "jquery";
import "jquery-ui/";
import "jquery-ui/ui/disable-selection";
import "jquery-ui/ui/widgets/tabs";
import "../../../node_modules/jquery-ui/themes/base/all.css";
import "../libs/cleditor1_4_5/jquery-cleditor.js";
import "../libs/jquery-multisortable.js";
import { CommonUtils } from "../helpers/CommonUtils";
import { Validate } from "../helpers/validate";
import { CompetitionServiceModel } from "../ServiceModels/competitionServiceModel";
import { CompetitionControllerHelpers } from "./competitionControllerHelpers";

export class CompetitionController {
    private iscompetitionPagePostBack: boolean = false;
    private competitionServiceModel: CompetitionServiceModel;

    constructor() {
        this.competitionServiceModel = new CompetitionServiceModel();
    }

    public competition(): void {
        // Self
        const self = this;

        // Validate leaving page (warning save?)
        window.onbeforeunload = () => {
            if (self.iscompetitionPagePostBack === false) {
                return "Are you sure you want to leave the page without saving changes?";
            }
        };

        // Generate tabs
        $("#competitionTabs").tabs({
            activate(event, ui) {
                CompetitionControllerHelpers.tabButtons(null);
            },
        });

        // Set button tabs
        $("#btnPrevious, #btnNext").click(function() {
            CompetitionControllerHelpers.tabButtons($(this));
        });

        // TAB2
        // Get competition item
        const competitionServiceModel = new CompetitionServiceModel();

        const idItem = CommonUtils.getQueryStringParameterByName("ItemID")
            ? CommonUtils.getQueryStringParameterByName("ItemID")
            : CommonUtils.getQueryStringParameterByName("CopyItemID");
        if (idItem) {
            competitionServiceModel.getDataById("GetCompetitionById", idItem, (comp) => {
                if (comp) {
                    // Fill simple field
                    // Tab1
                    $("#txtName").val(comp.Name);
                    $("#ddlCompetitionType").val(comp.CompetitionType);
                    $("#datepickerStartDate").val(CommonUtils.convertToStringDate(comp.IncludeSalesFromDate));
                    $("#datepickerEndDate").val(CommonUtils.convertToStringDate(comp.IncludeSalesToDate));
                    $("#chkBoxPosition").prop("checked", comp.DisplayMyRanking);
                    $("#chkBoxHideSellers").prop("checked", comp.DisplaySalespersonsWithZeroPoints);
                    $("#txtSellersCount").val(comp.DisplayNumberOfHighlighedSellers);
                    $("#txtDisplayTitle").val(comp.DisplayName);
                    $("#datepickerStartDateDisplay").val(CommonUtils.convertToStringDate(comp.DisplayDateStart));
                    $("#datepickerEndDateDisplay").val(CommonUtils.convertToStringDate(comp.DisplayDateEnd));
                    $("#txtDescription").val(comp.DisplayDescription);
                    $("textarea#txtDescription").cleditor({
                        fonts: "KievitMedium, KievitRegular, KievitBold"
                    });
                    $("#txtImageUrl").val(comp.DisplayImageUrl);
                    if (comp.DisplayImageUrl) {
                        self.competitionServiceModel.getImageById(comp.DisplayImageUrl, (imageBase64) => {
                            if (imageBase64 !== null) {
                                $("#imagePreview").attr("src", imageBase64);
                            }
                        });
                    } else {
                        $("#imagePreview").hide();
                    }

                    // Tab2
                    $("#chkBoxIncludeOnlySLB").prop("checked", comp.IncludeLBFSalespersonsOnly);
                    // Tab3
                    $("#ddlObjectStatus").val(comp.PVObjectStateSet[0].Id.toString().trim());
                    // Tab4
                    $("#txtSoldInsurancePoints").val(comp.PointsPerLBF);
                    $("#txtTotalCasePoints").val(comp.PointsPerPaidCase);
                    $("#txtPaidAmountInterval").val(comp.PointsBoostAmount);
                    $("#txtTotalPaidPoints").val(comp.PointsPerBoostAmount);

                    // Fill lists
                    CompetitionControllerHelpers.fillAllLists(comp);
                    // Fill grid
                    // Do not fill pointCorrectionIfCopy
                    if (CommonUtils.getQueryStringParameterByName("ItemID")) {
                        self.getPointsCorrection(comp.SalespersonPointCorrectionSet);
                    }
                }
            });
        } else {
            CompetitionControllerHelpers.fillAllLists(null);

            // TAB1
            $("textarea#txtDescription").cleditor({
                fonts: "KievitMedium, KievitRegular, KievitBold"
            });
        }

        $("#competitionImage").change(function() {
            self.updateImagePreview(this);
        });

        // TAB3
        // Get controls
        const ctrlPointsCorrection = $("#txtPointsCorrection").length > 0 ? $("#txtPointsCorrection") : null;
        const ctrlPointsCorrectionDealer = $("#txtSearchDealer").length > 0 ? $("#txtSearchDealer") : null;
        const ctrlPointsCorrectionSeller = $("#txtSearchSeller").length > 0 ? $("#txtSearchSeller") : null;

        // CLICK EVENTS
        // Add points correction
        $("#btnPointsCorrectionAdd").click(() => {
            // Get values
            const pointsCorrection = ctrlPointsCorrection.val();
            const pointsCorrectionSellerId = ctrlPointsCorrectionSeller.attr("data-value");
            const pointsCorrectionSeller = ctrlPointsCorrectionSeller.val();

            self.addPointsCorrection(pointsCorrection, pointsCorrectionSellerId, pointsCorrectionSeller);
        });

        // Update data event
        $("#btnPointsCorrectionUpdate").click(function() {
            // Get current row
            const currentRowId = $(this).attr("data-value");

            if (currentRowId) {
                // Get values
                const currentRow = $("#pointsCorrectionDataTable").find(`tr[data-value='${currentRowId}']`);
                const pointsCorrection = ctrlPointsCorrection.val().toString();
                const pointsCorrectionSellerId = ctrlPointsCorrectionSeller.attr("data-value");
                const pointsCorrectionSeller = ctrlPointsCorrectionSeller.val().toString();

                if (pointsCorrection && pointsCorrectionSeller && currentRow.length > 0) {
                    $(currentRow.find("td")[3]).text(pointsCorrection);
                    $(currentRow.find("td")[1])
                        .contents()
                        .filter(function() {
                            return this.nodeType == Node.TEXT_NODE;
                        })[0].nodeValue = pointsCorrectionSellerId;
                    currentRow.attr("data-value", pointsCorrectionSellerId);
                    $(currentRow.find("td")[2]).text(pointsCorrectionSeller);

                    // Clean controls
                    ctrlPointsCorrection.val("");
                    ctrlPointsCorrectionDealer.closest("div.awesomplete__wrap").find(".awesomplete__close-button").trigger("click");
                    ctrlPointsCorrectionSeller.attr("data-value", "");
                    ctrlPointsCorrectionSeller.val("");
                    $(this).removeAttr("data-value");

                    // Show hide panels
                    $("#pnlPointsCorrectionUpdate").hide();
                    $("#pnlPointsCorrectionAdd").show();
                }
            }
        });

        // Cancel points correction data event
        $("#btnPointsCorrectionCancel").click(() => {
            // Clean controls
            ctrlPointsCorrection.val("");
            ctrlPointsCorrectionDealer.val("");
            ctrlPointsCorrectionSeller.attr("data-value", "");
            ctrlPointsCorrectionSeller.val("");
            $("#btnPointsCorrectionUpdate").removeAttr("data-value");

            // Show hide panels
            $("#pnlPointsCorrectionUpdate").hide();
            $("#pnlPointsCorrectionAdd").show();
        });

        // Save Data
        $("#btnSubmit").click(() => {
            const validationObj = [
                { id: "txtName", message: "Navn er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "datepickerStartDate", message: "Startdato er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "datepickerEndDate", message: "Sluttdato er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "txtSellersCount", message: "Antall selgere i toppliste som vises er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "txtDisplayTitle", message: "Visningstittel er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "datepickerStartDateDisplay", message: "Visning startdato er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "datepickerEndDateDisplay", message: "Visning sluttdato er påkrevd.", tabId: "competitionTabs", tabIndex: "0" },
                { id: "txtTotalCasePoints", message: "X antall poeng per utbetalte sak er påkrevd.", tabId: "competitionTabs", tabIndex: "3" },
                { id: "txtPaidAmountInterval", message: "Intervall utbetalt beløp er påkrevd.", tabId: "competitionTabs", tabIndex: "3" },
                { id: "txtTotalPaidPoints", message: "X antall poeng per utbetalt beløp er påkrevd.", tabId: "competitionTabs", tabIndex: "3" },
                {
                    id: "txtSoldInsurancePoints",
                    message: "X antall poeng per solgt forsikring er påkrevd.",
                    tabId: "competitionTabs",
                    tabIndex: "3",
                },
            ];

            const validate = new Validate();

            if (validate.validate(validationObj)) {
                // Vars
                const comp: any = {};

                // Tab 1
                comp.Name = $("#txtName").val();
                comp.CompetitionType = $("#ddlCompetitionType").val();
                comp.IncludeSalesFromDate = CommonUtils.convertDateToJsonDateFormat($("#datepickerStartDate").val());
                comp.IncludeSalesToDate = CommonUtils.convertDateToJsonDateFormat($("#datepickerEndDate").val());
                comp.DisplayMyRanking = $("#chkBoxPosition").prop("checked");
                comp.DisplaySalespersonsWithZeroPoints = $("#chkBoxHideSellers").prop("checked");
                comp.DisplayNumberOfHighlighedSellers = $("#txtSellersCount").val();
                comp.DisplayName = $("#txtDisplayTitle").val();
                comp.DisplayDateStart = CommonUtils.convertDateToJsonDateFormat($("#datepickerStartDateDisplay").val());
                comp.DisplayDateEnd = CommonUtils.convertDateToJsonDateFormat($("#datepickerEndDateDisplay").val());
                comp.DisplayDescription = $("#txtDescription").val();
                comp.DisplayImageUrl = $("#txtImageUrl").val();

                // Tab2
                comp.IncludeLBFSalespersonsOnly = $("#chkBoxIncludeOnlySLB").prop("checked");

                // Agreement list
                const thisAgreementList = CompetitionControllerHelpers.setListValues(
                    "sortableListAgreementFrom",
                    "sortableListAgreementTo",
                    "PVProductAgreementId",
                    "PVProductAgreementName",
                );
                // Set List to property
                comp.PVProductAgreementSet = thisAgreementList;

                // Region list
                const thisRegionList = CompetitionControllerHelpers.setListValues(
                    "sortableListRegionFrom",
                    "sortableListRegionTo",
                    "SantanderRegionID",
                    "SantanderRegion",
                );
                // Set List to property
                comp.SantanderRegionSet = thisRegionList;

                // District list
                const thisDistrictList = CompetitionControllerHelpers.setListValues(
                    "sortableListDistrictFrom",
                    "sortableListDistrictTo",
                    "SantanderDistrictID",
                    "SantanderDistrict",
                );
                // Set List to property
                comp.SantanderDistrictSet = thisDistrictList;

                // KeyAccountManager list
                const thisKeyAccountManagerList = CompetitionControllerHelpers.setListValues(
                    "sortableListResponsibleFrom",
                    "sortableListResponsibleTo",
                    "PVKeyAccountManagerId",
                    "PVKeyAccountManagerName",
                );
                // Set List to property
                comp.PVKeyAccountManagerSet = thisKeyAccountManagerList;

                // dealer list
                const thisDealerList = CompetitionControllerHelpers.setListValues(
                    "sortableListDealerFrom",
                    "sortableListDealerTo",
                    "PVDealerId",
                    "PVDealerName",
                );
                // Set List to property
                comp.PVDealerSet = thisDealerList;

                // override dealer list
                const thisOverrideDealerList = CompetitionControllerHelpers.setListValues(
                    "sortableListOverrideDealerFrom",
                    "sortableListOverrideDealerTo",
                    "PVDealerId",
                    "PVDealerName",
                );
                // Set List to property
                comp.PVDealerOverrideSet = thisOverrideDealerList;

                // Sales dealer list
                const thisSalesDealerList = CompetitionControllerHelpers.setListValues(
                    "sortableListExcludeSellerFrom",
                    "sortableListExcludeSellerTo",
                    "PVSalespersonDealerId",
                    "PVSalespersonDealerName",
                );
                // Set List to property
                comp.PVSalespersonDealerSet = thisSalesDealerList;

                // Tab3
                comp.PVObjectStateSet = [];
                comp.PVObjectStateSet.push({ Id: $("#ddlObjectStatus").val(), Name: $("#ddlObjectStatus option:selected").text() });

                // Dealer group list
                const thisDealerGroupList = CompetitionControllerHelpers.setListValues(
                    "sortableListDealerGroupFrom",
                    "sortableListDealerGroupTo",
                    "PVDealerGroupId",
                    "PVDealerGroupName",
                );
                // Set List to property
                comp.PVDealerGroupSet = thisDealerGroupList;

                // Make list
                const thisMakeList = CompetitionControllerHelpers.setListValues(
                    "sortableListMakeFrom",
                    "sortableListMakeTo",
                    "PVObjectMakeId",
                    "PVObjectMakeName",
                );
                // Set List to property
                comp.PVObjectMakeSet = thisMakeList;

                // Sales dealer list
                const thisModelList = CompetitionControllerHelpers.setListValues(
                    "sortableListModelFrom",
                    "sortableListModelTo",
                    "PVObjectModelId",
                    "PVObjectModelName",
                );
                // Set List to property
                comp.PVObjectModelSet = thisModelList;

                // Tab4
                comp.PointsPerLBF = $("#txtSoldInsurancePoints").val();
                comp.PointsPerPaidCase = $("#txtTotalCasePoints").val();
                comp.PointsBoostAmount = $("#txtPaidAmountInterval").val();
                comp.PointsPerBoostAmount = $("#txtTotalPaidPoints").val();

                // Get data from gridview
                const pcList = [];
                let pcObj = {};
                $("#pointsCorrectionDataTable")
                    .find("tbody tr")
                    .each(function() {
                        pcObj = { PVSalesperson_PVSalespersonId: $(this).attr("data-value"), PointsCorrection: $($(this).find("td")[3]).text() };
                        pcList.push(pcObj);
                    });
                comp.SalespersonPointCorrectionSet = pcList;

                // Saving loading...
                const thisDialog = {
                    close: (a: any) => null,
                };

                const itemId = CommonUtils.getQueryStringParameterByName("ItemID");
                const addedFile = $("#competitionImage").prop("files")[0];

                if (itemId) {
                    comp.Id = itemId;
                    if (addedFile) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            comp.ImageBase64 = reader.result;
                            self.requestUpdate(thisDialog, comp);
                        };
                        reader.readAsDataURL($("#competitionImage").prop("files")[0]);
                    } else {
                        self.requestUpdate(thisDialog, comp);
                    }
                } else {
                    if (addedFile) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            comp.ImageBase64 = reader.result;
                            self.requestInsert(thisDialog, comp);
                        };
                        reader.readAsDataURL($("#competitionImage").prop("files")[0]);
                    } else {
                        self.requestInsert(thisDialog, comp);
                    }
                }
            }
        });

        // Cancel Data
        $("#btnCancel").click(() => {
            window.location.href = window.location.origin + window["baseUrl"] + "AllCompetitions";
        });
    }

    private updateImagePreview(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                $("#imagePreview").attr("src", e.target.result).show();
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    private requestUpdate(dialog, competition) {
        const self = this;
        self.competitionServiceModel.updateData(competition, (id) => {
            if (id) {
                // Redirect to all competitions
                dialog.close(null);
                self.iscompetitionPagePostBack = true;
                window.location.href = window.location.origin + window["baseUrl"] + "Allcompetitions";
            } else {
                dialog.close(null);
            }
        });
    }

    private requestInsert(dialog, competition) {
        const self = this;
        self.competitionServiceModel.insertData(competition, (id) => {
            if (id) {
                // Redirect to all competitions
                dialog.close(null);
                self.iscompetitionPagePostBack = true;
                window.location.href = window.location.origin + window["baseUrl"] + "AllCompetitions";
            } else {
                dialog.close(null);
            }
        });
    }

    private addPointsCorrection(pointsCorrection, pointsCorrectionSellerId, pointsCorrectionSeller) {
        // Controls
        const ctrlPointsCorrection = $("#txtPointsCorrection").length > 0 ? $("#txtPointsCorrection") : null;
        const ctrlPointsCorrectionDealer = $("#txtSearchDealer").length > 0 ? $("#txtSearchDealer") : null;
        const ctrlPointsCorrectionSeller = $("#txtSearchSeller").length > 0 ? $("#txtSearchSeller") : null;

        const pointsCorrectionDataTable = $("#pointsCorrectionDataTable");
        const pointsCorrectionDealerExists = pointsCorrectionDataTable.find("tr[data-value='" + pointsCorrectionSellerId + "']");

        // Validate
        if (pointsCorrection && pointsCorrectionSeller && pointsCorrectionDealerExists.length <= 0) {
            const row = $(`<tr data-value='${pointsCorrectionSellerId}'/>`);
            pointsCorrectionDataTable.find("tbody").append(row);
            const dataRowActions =
                `<div class='bootgrid-row-menu' data-row-position='true' data-value='' >
                    <div class='col-xs-6'>
                        <span title='Delete' class='bootgrid-row-command glyphicon glyphicon-trash' data-row-id='${pointsCorrectionSellerId}'>
                    </div>
                    <div class='col-xs-6'>
                        <span title='Edit' class='bootgrid-row-command glyphicon glyphicon-edit' data-row-id='${pointsCorrectionSellerId}'>
                    </div>
                </div>`;
            let dataRow = `<td>${dataRowActions}</td>
                            <td>${pointsCorrectionSellerId}</td>
                            <td>${pointsCorrectionSeller}</td>
                            <td>${pointsCorrection}</td>`;
            row.append(dataRow);

            // Clean controls
            ctrlPointsCorrection.val("");
            ctrlPointsCorrectionDealer
                .closest("div.awesomplete__wrap")
                .find(".awesomplete__close-button")
                .trigger("click");
            ctrlPointsCorrectionSeller.attr("data-value", "");
            ctrlPointsCorrectionSeller.val("");

            // Add button events
            row.find(".bootgrid-row-command[title='Delete']").on("click", (e) => {
                const r = confirm("Delete record?");
                if (r) {
                    const thisId = $(e.currentTarget).attr("data-row-id");
                    if (thisId) {
                        $(e.currentTarget).closest("tr").remove();
                    }
                }
            });
            row.find(".bootgrid-row-command[title='Edit']").on("click", (e) => {
                const currentRow = $(e.currentTarget).closest("tr");
                const thisPointsCorrection = $(currentRow.find("td")[3]).text();
                const thisPointsCorrectionSellerId = currentRow.attr("data-value");
                const thisPointsCorrectionSeller = $(currentRow.find("td")[2]).text();

                // Assign values to controls
                ctrlPointsCorrection.val(thisPointsCorrection);
                ctrlPointsCorrectionSeller.attr("data-value", thisPointsCorrectionSellerId);
                ctrlPointsCorrectionSeller.val(thisPointsCorrectionSeller);
                $("#btnPointsCorrectionUpdate").attr("data-value", thisPointsCorrectionSellerId);

                // Set values to child cascading controls
                ctrlPointsCorrectionDealer.trigger("awesomplete-selectcomplete");

                // Show hide panels
                $("#pnlPointsCorrectionUpdate").show();
                $("#pnlPointsCorrectionAdd").hide();
            });
        }
    }

    private getPointsCorrection(currentObject) {
        const self = this;
        for (let i = 0; i < currentObject.length; i++) {
            // Get values
            const pointsCorrection = currentObject[i].PointsCorrection;
            const pointsCorrectionSellerId = currentObject[i].PVSalespersonDealerSet.PVSalespersonDealerId;
            const pointsCorrectionSeller = currentObject[i].PVSalespersonDealerSet.PVSalespersonDealerName;

            self.addPointsCorrection(pointsCorrection, pointsCorrectionSellerId, pointsCorrectionSeller);
        }
    }
}
