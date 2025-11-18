import * as Awesomplete from "awesomplete";
import { SortableList } from "./sortablelist";

// tslint:disable-next-line:no-namespace
export namespace Awesomeplete {
    // Awesomplete - input field with auto suggestion

    // fire awesomeplete functionality
    export function build(elem, serviceObj) {

        // Init
        const thisElem = elem;
        const thisContainer = thisElem.closest("div.awesomplete__wrap");
        const awesomplete = new Awesomplete(thisElem[0], {minChars: 0});

        // Show list on click
        thisContainer.find(".awesomplete__contacts-button").click(() => {
            if (awesomplete.ul.childNodes.length === 0 && !thisElem.attr("disabled")) {
                awesomplete.minChars = 0;
                awesomplete.evaluate();
                // Set focus in list (for keyboard navigation)
                thisElem.focus();
                thisContainer.find(".awesomplete__close-button").show();
                thisContainer.find(".awesomplete__contacts-button").hide();
            } else if (awesomplete.ul.hasAttribute("hidden") && !thisElem.attr("disabled")) {
                awesomplete.open();
                // Set focus in list (for keyboard navigation)
                thisElem.focus();
                thisContainer.find(".awesomplete__close-button").show();
                thisContainer.find(".awesomplete__contacts-button").hide();
            } else {
                // Close list
                awesomplete.close();
            }
        });

        // If user selects an option - show remove button in field
        thisElem.on("awesomplete-selectcomplete", (e) => {
            // If autocompleted
            if (e.type == "awesomplete-selectcomplete") {

                // Get data-value
                const thisValue = thisElem.val();
                const thisCascadeList = $(thisElem.attr("data-list"));
                const thisLi = thisCascadeList.find("li").filter(function() {
                    return $(this).text().trim() == thisValue;
                });
                const thisLiVal = thisLi.length ? thisLi.attr("data-value").trim() : false;

                // Set element value
                thisElem.attr("data-value", thisLiVal);

                // fill cascade list
                if (thisLiVal && thisElem.attr("data-cascade-list") && thisElem.attr("data-cascade-service")) {
                    const thisCascadeSubList = $(thisElem.attr("data-cascade-list"));
                    let thisCascadeService = thisElem.attr("data-cascade-service");
                    const thisCascadeServiceIdField = thisElem.attr("data-cascade-service-field-id");
                    const thisCascadeServiceNameField = thisElem.attr("data-cascade-service-field-name");

                    // Replace value
                    thisCascadeService = thisCascadeService.replace("{id}", thisLiVal);

                    // Get data
                    serviceObj.getData(thisCascadeService, (tableData) => {
                        if (tableData) {
                            const arrayObjs = SortableList.getArrayItems(tableData, thisCascadeServiceIdField, thisCascadeServiceNameField, null);
                            thisCascadeSubList.empty();
                            thisCascadeSubList.append(arrayObjs.arrayAll.join(""));

                            // Make lists sortable
                            if (thisElem.attr("data-cascade-sorting-list")) {
                                const thisCascadeSortingList = $(thisElem.attr("data-cascade-sorting-list"));
                                if (!thisCascadeSubList.hasClass("ui-sortable")) {
                                    SortableList.sortable(thisCascadeSubList.attr("id"), thisCascadeSortingList.attr("id"), thisCascadeSubList.attr("class"));
                                }
                                SortableList.sortableListItems(thisCascadeSubList.attr("id"), thisCascadeSortingList.attr("id"));
                            }

                            // If cascade input then build awesome
                            if (thisElem.attr("data-cascade-input")) {
                                const thisCascadeElem = $(thisElem.attr("data-cascade-input"));
                                thisCascadeElem.prop("disabled", false);
                                Awesomeplete.destroy(thisCascadeElem);
                                Awesomeplete.build(thisCascadeElem, null);
                            }
                        }
                    });
                }
            }
        });

        // Close button press - remove data
        thisContainer.find(".awesomplete__close-button").click(function() {
            $(this).hide();
            thisContainer.find(".awesomplete__contacts-button").show();
            thisElem.prop("disabled", false).val("");
            thisContainer.find(".awesomplete > ul").empty();

            // Empty and disable child input
            if (thisElem.attr("data-cascade-input")) {
                const thisCascadeElem = $(thisElem.attr("data-cascade-input"));
                const thisCascadeSubList = $(thisElem.attr("data-cascade-list"));
                const thisCascadeContainer = thisCascadeElem.closest("div.awesomplete__wrap");
                thisCascadeElem.prop("disabled", true).val("");
                thisCascadeContainer.find(".awesomplete > ul").empty();
                thisCascadeContainer.find(".awesomplete__close-button").hide();
                thisCascadeContainer.find(".awesomplete__contacts-button").show();
                thisCascadeSubList.empty();

                Awesomplete.all = jQuery.grep(Awesomplete.all, (val: any) => {
                    return val.input.id !== thisCascadeElem.attr("id");
                });
            }
        });
    }

    export function destroy(elem) {
        const container = elem.parents(".awesomplete__wrap");
        const removingPanel = container.find(".awesomplete");
        if (removingPanel.length > 0) {
            const elemCopy = elem;
            removingPanel.remove();
            container.prepend(elemCopy);
        }
    }
}
