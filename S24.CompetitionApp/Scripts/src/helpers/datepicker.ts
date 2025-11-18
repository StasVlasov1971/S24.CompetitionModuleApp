import * as Pikaday from "pikaday";

export function initDatePicker() {
    // Init datepicker if it exist on the page
    const datePickers = $("input[id^='datepicker']");
    const allPikadays = [];
    if (datePickers.length > 0) {
        datePickers.each(function() {
            const datepickerElem = this;

            // Limit the date input.
            const maxDate = new Date();
            if ($(datepickerElem).attr("data-datepicker-maxdate") === "") {
                // 1 month from now if attribute is set
                maxDate.setMonth(new Date().getMonth() + 1);
            } else {
                // default 10 years from now
                maxDate.setFullYear(new Date().getFullYear() + 10);
            }

            // default minimum date 1950, today if set
            let minDate = new Date(1950, 1, 1);
            if ($(datepickerElem).attr("data-datepicker-mindate") === "") {
                minDate = new Date();
            }

            const datepickerCont = $(this).nextAll("div#datepicker__container")[0];
            const datepicker = new Pikaday({
                field: datepickerElem,
                bound: true,
                container: datepickerCont,
                format: "DD.MM.YYYY",
                minDate,
                maxDate,
                firstDay: 1,
                toString(date, format) {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                },
                parse(dateString, format) {
                    const parts = dateString.split(".");
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    return new Date(year, month, day);
                },
                i18n: {
                    previousMonth: "Forrige måned",
                    nextMonth: "Neste måned",
                    months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
                    weekdays: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
                    weekdaysShort: ["Søn", "Man", "Tir", "Ons", "Tors", "Fre", "Lør"]
                },
                onSelect(date) {
                    const thisDatePicker = this._o;
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    const formattedDate = [day < 10 ? "0" + day : day, month < 10 ? "0" + month : month, year].join(".");
                    (datepickerElem as HTMLInputElement).value = formattedDate;
                    if (thisDatePicker.endField) {
                        const thisEndPikaday = $.grep(allPikadays, (e) => e._o.field.id === thisDatePicker.endField );
                        if (thisEndPikaday) {
                            const thisEndPikadayDate = thisEndPikaday[0]._o.field.value;
                            const arrayDate = (thisEndPikadayDate.indexOf(".") >= 0) ? thisEndPikadayDate.split(".") : thisEndPikadayDate.split("/");
                            const dt = new Date(arrayDate[2], arrayDate[1] - 1, arrayDate[0], 0, 0, 0, 0);
                            thisEndPikaday[0]._o.minDate = this.getDate();
                            if (dt < date) {
                                thisEndPikaday[0]._o.field.value = (datepickerElem as HTMLInputElement).value;
                            }
                        }
                    }
                },
            });
            allPikadays.push(datepicker);
        });
    }
}
