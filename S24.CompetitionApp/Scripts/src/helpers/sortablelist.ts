import * as $ from "jquery";
import "jquery-ui/ui/widgets/sortable";

// tslint:disable-next-line:no-namespace
export namespace SortableList {
    export function sortable(idFrom: string, idTo: string, connectWithClass: string): void {
        // Add sortable functionality to list
        $(`#${idFrom}`)
            .add(`#${idTo}`)
            .multisortable({
                selectedClass: "ui-state-custom-selected",
                stop(event, ui) {
                    const toList = ui.item.parents("ul");
                    const thisItemValue = ui.item.attr("data-value");
                    if (toList.length > 0) {
                        const existingItems = toList.find(`li[data-value='${thisItemValue}']`);
                        if (existingItems.length > 1) {
                            existingItems
                                .css("border-color", "red")
                                .animate(
                                    {
                                        borderTopColor: "#c5c5c5",
                                        borderRightColor: "#c5c5c5",
                                        borderBottomColor: "#c5c5c5",
                                        borderLeftColor: "#c5c5c5"
                                    },
                                    2000
                                );
                            $(this).sortable("cancel");
                        }
                    }
                }
            });
        $(`#${idFrom}`)
            .add(`#${idTo}`)
            .sortable({
                connectWith: `.${connectWithClass}`,
                scroll: false,
                delay: 150,
                revert: 0,
                items: "> li:not(.unsortable)",
                update(e, ui) {
                    if (ui.sender) {
                        const startList = ui.sender;
                        const endList = $(this);

                        // add default item to start list in case is empty
                        if (startList.attr("data-defaultvalue") == "true" && startList.find("li").length == 0) {
                            // Add default item
                            const li = $("<li class='ui-state-custom-default unsortable' data-value='-1'>Alle</li>");
                            startList.append(li);
                        }

                        // Add event receivers
                        endList.find("li").each(function () {
                            sortableListItemsDragged(startList, $(this));
                            $(this).removeClass("ui-state-custom-selected");
                        });

                        // remove default item from end list in case is not empty
                        if (endList.attr("data-defaultvalue") == "true") {
                            const li = endList.find("li.unsortable");
                            if (li.length > 0) {
                                li.remove();
                            }
                        }
                    }
                }
            })
            .disableSelection();
    }

    export function sortableListItems(idFrom, idTo) {
        // Add dblclick event handler to items
        const fromItems = $(`#${idFrom}`)
            .find("li")
            .not(".unsortable");
        if (fromItems.length > 0) {
            fromItems.off();
            fromItems.dblclick(function () {
                sortableListItemsDblClick(idTo, $(this));
            });
        }

        const toItems = $(`#${idTo}`)
            .find("li")
            .not(".unsortable");
        if (toItems.length > 0) {
            toItems.off();
            toItems.dblclick(function () {
                sortableListItemsDblClick(idFrom, $(this));
            });
        }
    }

    export function sortableButtons(obj) {
        /*
        obj.listFromId = fromList
        obj.listToId = toList
        obj.buttons = div id containing all buttons
        */

        const listFrom = $(`#${obj.listFromId}`);
        const listTo = $(`#${obj.listToId}`);
        const container = $(`#${obj.buttons}`);

        container.find("input").click(function () {
            const thisInput = $(this);
            const type = thisInput.attr("data-type");
            let items;
            switch (type) {
                case "SomeTo":
                    items = listFrom.find("li.ui-state-custom-selected");
                    items.each(function () {
                        sortableListItemsDblClick(obj.listToId, $(this));
                    });
                    break;
                case "AllTo":
                    items = listFrom.find("li");
                    items.each(function () {
                        sortableListItemsDblClick(obj.listToId, $(this));
                    });
                    break;
                case "SomeFrom":
                    items = listTo.find("li.ui-state-custom-selected");
                    items.each(function () {
                        sortableListItemsDblClick(obj.listFromId, $(this));
                    });
                    break;
                case "AllFrom":
                    items = listTo.find("li");
                    items.each(function () {
                        sortableListItemsDblClick(obj.listFromId, $(this));
                    });
                    break;
                default:
                    // Do nothing
                    break;
            }
        });
    }

    function sortableListItemsDblClick(idTo, thisItem) {
        const listTo = $(`#${idTo}`);
        if (listTo.length > 0) {
            const thisItemValue = thisItem.attr("data-value");
            const thisList = thisItem.closest("ul");
            const thisListId = thisList.attr("id");
            const existingItems = listTo.find(`li[data-value='${thisItemValue}']`);
            if (thisListId && existingItems.length <= 0) {
                // Clone item
                const litem = thisItem.clone();
                // Remove all events
                litem.off();
                // Append item to ToList
                litem.appendTo(listTo);
                // Add dblclick event handler
                litem.dblclick(function () {
                    sortableListItemsDblClick(thisListId, $(this));
                });
                // Remove selected class
                litem.removeClass("ui-state-custom-selected");
                // Remove item from From item
                thisItem.remove();

                // Remove '-1' item if exists in To list
                if (listTo.attr("data-defaultvalue") == "true") {
                    const lidefaultTo = listTo.find("li.unsortable");
                    if (lidefaultTo.length > 0) {
                        lidefaultTo.remove();
                    }
                }
                // Add '-1' Item if From list is empty-cells
                if (thisList.attr("data-defaultvalue") == "true") {
                    const fromItems = thisList.find("li");
                    if (fromItems.length == 0) {
                        thisList.append("<li class='ui-state-custom-default unsortable' data-value='-1'>Alle</li>");
                    }
                }
            } else {
                existingItems
                    .css("border-color", "red")
                    .animate(
                        { borderTopColor: "#c5c5c5", borderRightColor: "#c5c5c5", borderBottomColor: "#c5c5c5", borderLeftColor: "#c5c5c5" },
                        2000
                    );
                thisItem
                    .css("border-color", "red")
                    .animate(
                        { borderTopColor: "#c5c5c5", borderRightColor: "#c5c5c5", borderBottomColor: "#c5c5c5", borderLeftColor: "#c5c5c5" },
                        2000
                    );
            }
        }
    }

    function sortableListItemsDragged(listTo, thisItem) {
        // After items are dragged add dblclick event handler
        if (listTo.length > 0 && thisItem.length > 0 && !thisItem.hasClass("unsortable")) {
            thisItem.off();
            thisItem.dblclick(function () {
                sortableListItemsDblClick(listTo.attr("id"), $(this));
            });
        }
    }

    /** build array of items for given lists id
     *
     * @param obj
     * @param id
     * @param name
     * @param currentObj
     */
    export function getArrayItems(obj, id, name, currentObj) {
        const arrayObjs: any = {};
        arrayObjs.arrayFrom = [];
        arrayObjs.arrayTo = [];
        arrayObjs.arrayAll = [];

        if (currentObj) {
            if (obj) {
                const allObj = obj;
                obj = $.grep(obj, (el) => {
                    for (const item of currentObj) {
                        if (el[id] && item[id]) {
                            if (el[id].toString().trim() === item[id].toString().trim()) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                    return true;
                });

                for (const item of obj) {
                    if (item[id].toString().indexOf("-1") >= 0) {
                        // Skip
                    } else {
                        const listItem = `<li class='ui-state-custom-default' data-value='${item[id].toString().trim()}'>${item[name].toString().trim()}</li>`;
                        arrayObjs.arrayFrom.push(listItem);
                    }
                }
                for (const item of allObj) {
                    if (item[id].toString().indexOf("-1") >= 0) {
                        // Skip
                    } else {
                        const listItem = `<li class='ui-state-custom-default' data-value='${item[id].toString().trim()}'>${item[name].toString().trim()}</li>`;
                        arrayObjs.arrayAll.push(listItem);
                    }
                }
            }
            for (const item of currentObj) {
                if (item[id].toString().indexOf("-1") >= 0) {
                    // Skip
                } else {
                    const listItem = `<li class='ui-state-custom-default' data-value='${item[id].toString().trim()}'>${item[name].toString().trim()}</li>`;
                    arrayObjs.arrayTo.push(listItem);
                }
            }
        } else {
            for (const item of obj) {
                if (item[id].toString().indexOf("-1") >= 0) {
                    // Skip
                } else {
                    const listItem = `<li class='ui-state-custom-default' data-value='${item[id].toString().trim()}'>${item[name].toString().trim()}</li>`;
                    arrayObjs.arrayAll.push(listItem);
                }
            }
        }

        return arrayObjs;
    }
}
