import { initDatePicker } from "./datepicker";

// tslint:disable-next-line:no-namespace
export namespace CommonUtils {

    $(document).ready(() => {
        initDatePicker();
    });

    export function getUserProfile() {
        const userProfileKey = "SCBNO.S24.UserProfile";
        try {
            return JSON.parse($.cookie(userProfileKey));
        } catch (error) {
            console.log(`Cookie doesn't have userProfile`)
        }
        try {
            const salesperson = JSON.parse(localStorage.getItem("ACTIVE_USER"));
            return { ...salesperson, salespersonUserCode: salesperson.competitionId };
        } catch (error) {
            console.log(`Can't find or parse ACTIVE_USER`)
        }
    }

    export function getQueryStringParameterByName(name: string, url?: string) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
        if (!results) { return null; }
        if (!results[2]) { return ""; }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    export function convertDateToJsonDateFormat(date) {
        const arrayDate = (date.indexOf(".") >= 0) ? date.split(".") : date.split("/");
        const dt = new Date(arrayDate[2], arrayDate[1] - 1, arrayDate[0], 0, 0, 0, 0);
        const thisDate = `\/Date(${dt.getTime()}-0000)\/`;
        return thisDate;
    }

    export function convertToStringDate(date) {
        const thisDate = new Date(date);
        const year = thisDate.getFullYear();
        const month = thisDate.getMonth() + 1;
        const day = thisDate.getDate();
        const returnDate = [day < 10 ? "0" + day : day, month < 10 ? "0" + month : month, year].join(".");
        return returnDate;
    }

    export function validateEmail(email) {
        const pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return $.trim(email).match(pattern) ? true : false;
    }

    export function validateDate(date) {
        const pattern = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)\d{2})$|^(?:29(\/|-|\.)02\3(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/;
        return $.trim(date).match(pattern) ? true : false;
    }

    export function validateSpecialCharacters(input: string): boolean {
        const regex = /^[a-zA-Z0-9ÆØÅæøå_\s-]*$/;
        return regex.test(input);
    }

    export function showLoadingElement(elemId) {
        const elem = $(`#${elemId}`);
        if (elem.find("div.loading-indicator").length <= 0) {
            const loadingStr = "<div class='loading-indicator'>" +
                "<div class='loading-indicator__child loading-indicator__item1'></div>" +
                "<div class='loading-indicator__child loading-indicator__item2'></div>" +
                "<div class='loading-indicator__child loading-indicator__item3'></div>" +
                "<div class='loading-indicator__child loading-indicator__item4'></div>" +
                "<div class='loading-indicator__child loading-indicator__item5'></div>" +
                "<div class='loading-indicator__child loading-indicator__item6'></div>" +
                "<div class='loading-indicator__child loading-indicator__item7'></div>" +
                "<div class='loading-indicator__child loading-indicator__item8'></div>" +
                "<div class='loading-indicator__child loading-indicator__item9'></div>" +
                "<div class='loading-indicator__child loading-indicator__item10'></div>" +
                "<div class='loading-indicator__child loading-indicator__item11'></div>" +
                "<div class='loading-indicator__child loading-indicator__item12'></div>" +
                "</div>";
            elem.append($(loadingStr));
        }
    }

    export function hideLoadingElement(elemId) {
        $(`#${elemId}`).hide();
    }
}
