import "bootstrap";
import * as $ from "jquery";
import "../../../node_modules/jquery-bootgrid/dist/jquery.bootgrid.js";
import { CommonUtils } from "../helpers/CommonUtils";
import { TableGenerator } from "../helpers/tablegenerator";
import { CompetitionServiceModel } from "../ServiceModels/competitionServiceModel";

export class AllCompetitionsController {
    private competitionServiceModel: CompetitionServiceModel;

    private tableFields = [
        { fieldName: "Id", fieldDisplayName: "Id", fieldType: "numeric", fieldOrder: "desc", fieldWidth: "10%" },
        { fieldName: "Name", fieldDisplayName: "Navn", fieldWidth: "35%" },
        { fieldName: "IncludeSalesFromDate", fieldDisplayName: "Salg fra dato", fieldWidth: "20%", fieldFormatter: "Date" },
        { fieldName: "IncludeSalesToDate", fieldDisplayName: "Salg til dato", fieldWidth: "20%", fieldFormatter: "Date" }
    ];

    private adminTableField = { fieldName: "", fieldDisplayName: " ", fieldFormatter: "Commands", fieldWidth: "15%", visibleInSelection: "false", fieldClass: "stop-click-event menu-fields" };

    constructor() {
        this.competitionServiceModel = new CompetitionServiceModel();
    }

    public getAllCompetitions(ctrlId: string, role: string, method: string) {
        CommonUtils.showLoadingElement("loading-pnl");

        const self = this;

        // Add link to create new competition and add command fields
        if (role === "Admin") {
            this.tableFields.push(this.adminTableField);
            const ctrlNewLink = $("#competitionNew");
            if (ctrlNewLink.length > 0) {
                ctrlNewLink.attr("href", window.location.origin + window["baseUrl"] + "Competition");
            }
        }

        // Get data
        self.competitionServiceModel.getData(method, (responseData) => {
            if (responseData) {
                const tableGenerator = new TableGenerator(ctrlId, responseData, self.tableFields);
                tableGenerator.drawTable();

                $("#" + ctrlId).bootgrid({
                        caseSensitive: false,
                        formatters: {
                            Commands(column, row) {
                                return self.competitionMenuFields(row.Id, role);
                            },
                            Date(column, row) {
                                if (column.id === "IncludeSalesFromDate") {
                                    return CommonUtils.convertToStringDate(row.IncludeSalesFromDate);
                                }
                                if (column.id === "IncludeSalesToDate") {
                                    return CommonUtils.convertToStringDate(row.IncludeSalesToDate);
                                }
                            },
                        },
                        labels: {
                            noResults: "Fant ingen resultater",
                            search: "Søk",
                            infos: "Viser {{ctx.start}} til {{ctx.end}} av totalt {{ctx.total}}",
                        },
                    })
                    .on("loaded.rs.jquery.bootgrid",
                        () => {
                            // Get Table
                            const table = $(`#${ctrlId}`);
                            $(".stop-click-event").click(e => {
                                e.preventDefault();
                                e.stopPropagation();
                            });

                            // Add events to command buttons
                            if (table.length > 0 && role === "Admin") {
                                self.addClickHandlerToCtrl("Delete", table);
                                self.addClickHandlerToCtrl("Edit", table, "Competition?ItemID=");
                                self.addClickHandlerToCtrl("Copy", table, "Competition?CopyItemID=");
                            }

                            // Show table
                            CommonUtils.hideLoadingElement("loading-pnl");
                            $(".allCompetitions").show();

                        }).on("click.rs.jquery.bootgrid",
                        (e, columns, row, target) => {
                            var thisId = row.Id;
                            window.location.href =
                                `${window.location.origin}${window["baseUrl"]}CompetitionDetailsAdmin?ItemID=${thisId}`;
                        });
            } else {
                CommonUtils.hideLoadingElement("loading-pnl");
                const errorTextLineOne = "Beklager, noe gikk galt eller så har du ikke tilgang til å se denne listen";
                const errorText = `<p><span style='color:#ec0000;'>${errorTextLineOne}</span></p>`;
                $("#allCompetitionsErrorContainer").append(errorText);
            }
        });
    }

    private addClickHandlerToCtrl(ctrlName, table, url = "") {
        const competitionServiceModel = new CompetitionServiceModel();
        const ctrl = table.find(`.bootgrid-row-command[id='${ctrlName}']`);

        if (ctrl.length > 0) {
            ctrl.on("click", (e) => {
                const $this = $(e.currentTarget);
                const thisId = $this.attr("data-row-id");

                // Delete handler has specific functionality
                if (ctrlName === "Delete") {
                    if (confirm("Er du sikker på at du vil slette konkurransen?") && thisId) {
                        const row = $this.closest("tr");
                        competitionServiceModel.deleteData(thisId, (data) => {
                            data && data === "true" ? row.remove() : alert("Error deleting record");
                        });
                    }
                } else {
                    window.location.href = `${window.location.origin}${window["baseUrl"]}${url}${thisId}`;
                }
            });
        }
    }

    private competitionMenuFields(rowId, role) {
        return `<div class='bootgrid-row-menu'>
                   <div class='col-xs-4 col-sm-4 stop-click-event'>
                       <span id="Edit" title='Endre' class='bootgrid-row-command glyphicon glyphicon-edit' data-row-id='${rowId}'/>
                   </div>
                   <div class='col-xs-4 col-sm-4 stop-click-event'>
                       <span id="Copy" title='Kopier' class='bootgrid-row-command glyphicon glyphicon-duplicate' data-row-id='${rowId}'>
                   </div>
                   <div class='col-xs-4 col-sm-4 stop-click-event'>
                       <span id="Delete" title='Slett' class='bootgrid-row-command glyphicon glyphicon-trash' data-row-id='${rowId}'/>
                   </div>
               </div>`;
    }
}
