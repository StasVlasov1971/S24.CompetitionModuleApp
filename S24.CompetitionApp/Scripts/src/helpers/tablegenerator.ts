export class TableGenerator {

    public TableId: string;
    public Data;
    public followerData;
    public Fields;

    constructor(tableId: string, data, fields, followerData?) {
        this.TableId = tableId;
        this.Data = data;
        this.Fields = fields;
        this.followerData = followerData;
    }

    public drawTable() {
        // Draw header
        this.drawHeader();

        // Draw rows
        if (this.followerData) {
            this.drawRowsWithFollowedRankings(this.Data, this.followerData);
        } else {
            this.drawRows(this.Data);
        }
    }

    private drawHeader() {
        // Create header row
        const headerRow = $("<tr />");

        // Add header row to table
        $(`#${this.TableId}`).find("thead").append(headerRow);

        // Loop and build header
        let headerHtml = "";
        for (const field of this.Fields) {
            let params = "";
            params += (field.visible) ? ` data-visible='${field.visible}'` : "";
            params += (field.visibleInSelection) ? ` data-visible-in-selection='${field.visibleInSelection}'` : "";
            params += (field.identifier) ? ` data-identifier='${field.identifier}'` : "";
            params += (field.fieldType) ? ` data-type='${field.fieldType}'` : "";
            params += (field.fieldOrder) ? ` data-order='${field.fieldOrder}'` : "";
            params += (field.fieldWidth) ? ` data-width='${field.fieldWidth}'` : "";
            params += (field.fieldSortable) ? ` data-sortable='${field.fieldSortable}'` : "";
            params += (field.fieldFormatter) ? ` data-formatter='${field.fieldFormatter}'` : "";
            params += (field.fieldAlign) ? ` data-align='${field.fieldAlign}'` : "";
            params += (field.fieldHeaderAlign) ? ` data-header-align='${field.fieldHeaderAlign}'` : "";
            params += (field.fieldClass) ? ` data-css-class='${field.fieldClass}'` : "";

            headerHtml += `<th data-column-id='${field.fieldName}' ${params}>${field.fieldDisplayName}</th>`;
        }
        headerRow.append(headerHtml);
    }

    private drawRows(Data) {
        const rows = [];
        for (const rowData of Data) {

            let rowHtml = "";
            for (const field of this.Fields) {
                const rowValue = rowData[field.fieldName] ? rowData[field.fieldName].toString().trim() : "";
                rowHtml += `<td>${rowValue}</td>`;
            }
            rows.push(`<tr>${rowHtml}</tr>`);
        }
        $(`#${this.TableId}`).find("tbody").append(rows.join(""));
    }

    private drawRowsWithFollowedRankings(rankingsNotFollowed, followedRankings) {
        const rows = [];

        if (followedRankings && followedRankings.length > 0) {
            for (const rowData of followedRankings) {

                let rowHtml = "";
                for (const field of this.Fields) {
                    if (field.fieldName === "Follow") {
                        rowHtml += `<td>true</td>`;
                    } else {
                        const rowValue = rowData[field.fieldName] ? rowData[field.fieldName].toString().trim() : "";
                        rowHtml += `<td>${rowValue}</td>`;
                    }
                }
                rows.push(`<tr>${rowHtml}</tr>`);
            }
            rows.push(`<tr></tr>`);
        }

        for (const rowData of rankingsNotFollowed) {

            let rowHtml = "";
            for (const field of this.Fields) {
                const rowValue = rowData[field.fieldName] ? rowData[field.fieldName].toString().trim() : "";
                rowHtml += `<td>${rowValue}</td>`;
            }
            rows.push(`<tr>${rowHtml}</tr>`);
        }
        $(`#${this.TableId}`).find("tbody").append(rows.join(""));
    }
}
