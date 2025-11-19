import * as $ from "jquery";
import "../../../node_modules/jquery-bootgrid/dist/jquery.bootgrid.js";
import { CommonUtils } from "../helpers/CommonUtils";
import { TableGenerator } from "../helpers/tablegenerator";
import { CompetitionServiceModel } from "../ServiceModels/competitionServiceModel";
declare function escape(s: string): string;

export class CompetitionDetailsController {
    private readonly competitionServiceModel: CompetitionServiceModel;
    private readonly userProfile;

    constructor() {
        this.competitionServiceModel = new CompetitionServiceModel();
        this.userProfile = CommonUtils.getUserProfile();
    }

    public getCompetitionDetails(thisTableId: string): void {
        const self = this;

        const tableFields = [
            {
                fieldName: "CompetitionRanking_ID",
                fieldDisplayName: "ID",
                identifier: "true",
                visible: "false",
                visibleInSelection: "false",
            },
            { fieldName: "Salesperson_Dealer_Code", fieldDisplayName: "Selgerkode", visible: "false", visibleInSelection: "false" },
            { fieldName: "CurrentRank", fieldDisplayName: "Plassering" },
            { fieldName: "Salesperson_Dealer_Name", fieldDisplayName: "Selger", fieldFormatter: "dealerFormat" },
            { fieldName: "Dealer_Name", fieldDisplayName: "Forhandler" },
            { fieldName: "Points", fieldDisplayName: "Poeng" },
            { fieldName: "Follow", fieldDisplayName: "Følg", fieldFormatter: "followFormat", fieldAlign: "right", fieldHeaderAlign: "right", visibleInSelection: "false", fieldWidth: "15%" }
        ];

        const idItem = CommonUtils.getQueryStringParameterByName("ItemID");
        if (idItem) {
            // Show loading
            CommonUtils.showLoadingElement("loading-pnl");
            self.competitionServiceModel.getDataById("GetCompetitionById", idItem, (competitionData) => {
                if (competitionData) {
                    self.competitionServiceModel.getDataByIdWithParams("GetRankingsForCompetitionWithFollowers", idItem, self.userProfile.salespersonUserCode, (competitionRankingData) => {
                        if (competitionRankingData && competitionRankingData.rankingListWithoutFollowing && competitionRankingData.rankingListWithoutFollowing.length + competitionRankingData.followingRankingList.length > 0) {

                            // Generate competition description, title, image
                            self.setCompetitionInformation(competitionData);

                            // Generate user Information
                            this.generateUserInformation(competitionRankingData, competitionData);

                            // Generate table
                            const tableGenerator = new TableGenerator(thisTableId, competitionRankingData.rankingListWithoutFollowing, tableFields, competitionRankingData.followingRankingList);
                            const table = $(`#${thisTableId}`);
                            tableGenerator.drawTable();
                            table.bootgrid({
                                caseSensitive: false,
                                columnSelection: false,
                                sorting: false,
                                formatters: {
                                    dealerFormat(column, row) {
                                        return `<input type='hidden' value='${row.Salesperson_Dealer_Code}'/>${row.Salesperson_Dealer_Name}`;
                                    },
                                    followFormat(column, row) {
                                        if (!row.CompetitionRanking_ID) {
                                            return "";
                                        }
                                        if (row.Follow === "true") {
                                            return `<span  id="Follow" class="glyphicon glyphicon-star follow-icon" data-row-id='${row.Salesperson_Dealer_Code}' data-row-followed="true"></span>`;
                                        }
                                        return `<span  id="Follow" class="glyphicon glyphicon-star-empty follow-icon" data-row-id='${row.Salesperson_Dealer_Code}' data-row-followed="false"></span>`;
                                    },
                                },
                                labels: {
                                    noResults: "Fant ingen resultater",
                                    search: "Søk",
                                    infos: "Viser {{ctx.start}} til {{ctx.end}} av totalt {{ctx.total}}",
                                },
                            })
                                .on("loaded.rs.jquery.bootgrid", (t: any) => {
                                    // Mark current user
                                    const currentUserRankingsSearch = `tbody tr input[type='hidden'][value='${self.userProfile.salespersonUserCode}']`;
                                    $(t.target).find(currentUserRankingsSearch).closest("tr").css("background-color", "#eee");

                                    self.addClickHandlerToFollowIcon(table);

                                    CommonUtils.hideLoadingElement("loading-pnl");
                                    $("#competitionDetails").show();
                                });
                        } else {
                            const errorTextLineOne = "Beklager, vi finner ingen resultater for denne konkurransen";
                            const errorTextLineTwo = "Enten er salgsdata ikke tilgjengelig for konkurransen enda, eller så ekisterer det ikke data som samsvarer med kriteriene...";
                            const errorText = `<p><span style='color:#ec0000;'>${errorTextLineOne}</span></br ><span>${errorTextLineTwo}</span ></p>`;
                            $("#currentCompetitionEmpty").append(errorText);
                        }
                    });
                } else {
                    CommonUtils.hideLoadingElement("loading-pnl");
                    $("#competitionDetails").show();
                }
            });
        }
    }

    public getCompetitionDetailsAdmin(thisTableId: string): void {
        const self = this;

        const tableFields = [
            { fieldName: "CurrentRank", fieldDisplayName: "Posisjon", fieldType: "numeric" },
            { fieldName: "Salesperson_Dealer_Name", fieldDisplayName: "Navn" },
            { fieldName: "Dealer_Name", fieldDisplayName: "Forhandler" },
            { fieldName: "Points", fieldDisplayName: "Poeng", fieldType: "numeric" },
            { fieldName: "Boost_Amount", fieldDisplayName: "Volum", fieldType: "numeric", fieldFormatter: "volumFormat" },
            { fieldName: "Count_Payout", fieldDisplayName: "Utbetaling", fieldType: "numeric" },
            { fieldName: "Count_LBF", fieldDisplayName: "Utvidet Garanti", fieldType: "numeric", fieldFormatter: "CountLBFFormat" }, // previously SAFE
            { fieldName: "Count_Annulled_LBF", fieldDisplayName: "Annullert Utvidet Garanti", fieldType: "numeric" },
            { fieldName: "KAM_Name", fieldDisplayName: "KAM" },
            { fieldName: "PointsCorrection", fieldDisplayName: "Poengkorreksjon", fieldType: "numeric" },
        ];

        const idItem = CommonUtils.getQueryStringParameterByName("ItemID");
        if (idItem) {
            CommonUtils.showLoadingElement("loading-pnl");
            self.competitionServiceModel.getDataById("GetCompetitionById", idItem, (competitionData) => {
                if (competitionData) {

                    // Generate competition title / description / image
                    self.setCompetitionInformation(competitionData);

                    self.competitionServiceModel.getDataById("GetRankingsForCompetition", idItem, (competitionRankingData) => {
                        if (competitionRankingData && competitionRankingData.length > 0) {

                            // Set latest update date
                            const latestDate = CommonUtils.convertToStringDate(competitionRankingData[0].ETL_LoadDate_dat);
                            $("#lblLatestUpdate").text(`Sist oppdatert: ${latestDate}`);

                            // Generate table
                            const tableGenerator = new TableGenerator(thisTableId, competitionRankingData, tableFields);
                            tableGenerator.drawTable();
                            const bootgridTable = $("#" + thisTableId).bootgrid({
                                caseSensitive: false,
                                templates: {
                                    //Add action button for excel export
                                    header: "<div id=\"{{ctx.id}}\" class=\"{{css.header}}\"><div class=\"row\"><div class=\"col-sm-12 actionBar\"><button id=\"exportToExcelButton\" class=\"btn btn-default\">Eksporter til excel</button><p class=\"{{css.search}}\"></p><p class=\"{{css.actions}}\"></p></div></div></div>"
                                },
                                formatters: {
                                    volumFormat(column, row) {
                                        return row.Boost_Amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
                                    },
                                    // update the Count_LBF to include both Utvidet Garanti and Annulled Utvidet Garanti (previously SAFE and Annulled SAFE)
                                    CountLBFFormat(column, row) {
                                        return (row.Count_LBF + row.Count_Annulled_LBF);
                                    },
                                },
                                labels: {
                                    noResults: "Fant ingen resultater",
                                    search: "Søk",
                                    infos: "Viser {{ctx.start}} til {{ctx.end}} av totalt {{ctx.total}}",
                                },
                            })
                                .on("loaded.rs.jquery.bootgrid", (t: any) => {
                                    // Add export to excel functionality
                                    $("#exportToExcelButton").click(() => {
                                        self.exportTableToExcel(bootgridTable);
                                    });

                                    CommonUtils.hideLoadingElement("loading-pnl");
                                    $("#competitionDetails").show();
                                });
                        } else {
                            const errorTextLineOne = "Beklager, vi finner ingen resultater for denne konkurransen";
                            const errorTextLineTwo = "Enten er salgsdata ikke tilgjengelig for konkurransen enda, eller så ekisterer det ikke data som samsvarer med kriteriene...";
                            const errorText = `<p><span style='color:#ec0000;'>${errorTextLineOne}</span></br ><span>${errorTextLineTwo}</span ></p>`;
                            $("#currentCompetitionEmpty").append(errorText);
                        }
                    });
                }
            });
        } else {
            // Hide loading
            CommonUtils.hideLoadingElement("loading-pnl");
            $("#competitionDetails").show();
        }
    }

    private generateUserInformation(competitionRankingData: any, competitionData: any) {
        const self = this;

        // Check if current user in the rankingList
        const currentUserRankings = $.grep(competitionRankingData.rankingListWithoutFollowing, (item: any) => {
            return item.Salesperson_Dealer_Code
                ? item.Salesperson_Dealer_Code.trim() === self.userProfile.salespersonUserCode
                : false;
        });

        // Check if current user in the followed list
        const currentUserRankingsInFollowing = $.grep(competitionRankingData.followingRankingList, (item: any) => {
            return item.Salesperson_Dealer_Code
                ? item.Salesperson_Dealer_Code.trim() === self.userProfile.salespersonUserCode
                : false;
        });

        currentUserRankings.concat(currentUserRankingsInFollowing);

        if ((currentUserRankings && currentUserRankings.length > 0)) {
            const currentUserRanking = currentUserRankings[0];

            const $currentCompRank = $("#competitionRanking");
            $currentCompRank.show();

            const totalLbf = currentUserRanking.Count_LBF * competitionData.PointsPerLBF;
            $currentCompRank.find("#ccrTotalLbf").text(totalLbf);

            const totalPaidCases = currentUserRanking.Count_Payout * competitionData.PointsPerPaidCase;
            $currentCompRank.find("#ccrTotalPaidCases").text(totalPaidCases);

            const totalVolume = currentUserRanking.Points - totalLbf - totalPaidCases - currentUserRanking.PointsCorrection;
            $currentCompRank.find("#ccrTotalVolume").text(totalVolume);

            $currentCompRank.find("#ccrRankingSpot").text(currentUserRanking.CurrentRank);
            $currentCompRank.find("#ccrRankingTotal").text(competitionRankingData.followingRankingList.length + competitionRankingData.rankingListWithoutFollowing.length);
            $currentCompRank.find("#ccrCountPayout").text(currentUserRanking.Count_Payout);
            $currentCompRank.find("#ccrCountLBF").text(currentUserRanking.Count_LBF);
            $currentCompRank.find("#ccrTotalAnnulled").text(currentUserRanking.Count_Annulled_LBF);
            if (currentUserRanking.PointsCorrection !== 0) {
                $currentCompRank.find("#ccrTotalCorrection").text(currentUserRanking.PointsCorrection);
                $("#pointCorrectionSection").show();
            }
            $currentCompRank.find("#ccrTotalPoints").text(currentUserRanking.Points);
        }
    }

    private exportTableToExcel(bootgridTable) {
        const rows = bootgridTable.data(".rs.jquery.bootgrid").rows;
        const columns = bootgridTable.data(".rs.jquery.bootgrid").columns;

        let headerText = "";
        for (const column of columns) {
            headerText += `<td>${column.text}</td>`;
        }

        let rowsText = "";
        for (const row of rows) {
            for (const column of columns) {
                rowsText += `<td>${row[column.id]}</td>`;
            }
            rowsText += "</tr>";
        }

        const tableText = `<table border='2px'><tr bgcolor='#87AFC6'>${headerText}</tr>${rowsText}</table>`;
        return window.open("data:application/vnd.ms-excel;charset=UTF-8," + escape(tableText));
    }

    private addClickHandlerToFollowIcon(table) {
        const self = this;
        const ctrl = table.find(`.follow-icon[id='Follow']`);

        if (ctrl.length > 0) {
            ctrl.on("click", (e) => {
                const $this = $(e.currentTarget);
                const thisId = $this.attr("data-row-id");
                const followStatus = $this.attr("data-row-followed");

                if (followStatus === "true") {
                    self.competitionServiceModel.deleteFollower(self.userProfile.salespersonUserCode, thisId, response => {
                        if (response) {
                            $this.toggleClass("glyphicon-star-empty glyphicon-star");
                            $this.attr("data-row-followed", "false");
                        }
                    });
                } else {
                    self.competitionServiceModel.addFollower(self.userProfile.salespersonUserCode, thisId, response => {
                        if (response) {
                            $this.toggleClass("glyphicon-star glyphicon-star-empty");
                            $this.attr("data-row-followed", "true");
                        }
                    });
                }
            });
        }
    }

    private setCompetitionInformation(competitionData) {
        const self = this;
        $("#competitionTitle").append(competitionData.DisplayName);
        if (competitionData.DisplayDescription === "") {
            $("#competitionImagePanel").removeClass("col-sm-6");
            $("#competitionImagePanel").css("text-align", "center");
            $("#competitionDescription").hide();
        } else {
            $("#competitionDescription").append(competitionData.DisplayDescription);
        }
        self.setImage(competitionData.DisplayImageUrl);
    }

    private setImage(imageId) {
        const self = this;
        if (imageId !== "") {
            self.competitionServiceModel.getImageById(imageId, (imageBase64) => {
                if (imageBase64 !== null) {
                    $("#competitionImagePanel").show();
                    $("#competitionImage").attr("src", imageBase64);
                }
            });
        }
    }
}
