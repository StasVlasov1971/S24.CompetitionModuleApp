import { CommonUtils } from "./CommonUtils";

export class Validate {

    private errorCtrlSelector = "span.field-validation-error";
    private errorClass = "input-validation-error";
    private errorSpan = "<span class='field-validation-error'>{Message}</span>";
    private errorEmailSpan = "<span class='field-validation-error'>Invalid email!</span>";
    private errorDateSpan = "<span class='field-validation-error'>Invalid date format!</span>";
    private errorNumberRangeSpan = "<span class='field-validation-error'>Invalid range!</span>";
    private errorNumberOrganizationSpan = "<span class='field-validation-error'>Invalid length!</span>";
    private errorMessage = "Required field!";
    private oldErrorObj = null;

    // Example object (errorObj)
    /*
        { id: "", message: ""}

        Or in case the control is under a Tab Control

        { id: "", message: "", tabId: "", tabIndex: "" }
    */

    public validate(errorObj): boolean {
        let ctrlFlag = null;
        let objFlag = null;
        const self = this;

        // Clean old objects
        if (self.oldErrorObj) {
            self.destroy(self.oldErrorObj);
        }

        // Set new objects
        self.oldErrorObj = errorObj;

        try {
            if (errorObj) {
                let currentObj: any = null;

                $(errorObj).each(function() {
                    currentObj = this;

                    if (currentObj.id) {
                        const ctrl = $("#" + currentObj.id);
                        const vFlag = self.validateControl(currentObj, ctrl);

                        if (vFlag && !ctrlFlag) {
                            ctrlFlag = ctrl;
                            objFlag = currentObj;
                        }

                        // When text change event
                        ctrl.on("change keyup paste", (e) => {
                            const ctrlClicked = $(e.currentTarget);
                            const thisObj = $.grep(errorObj, (n: any, i) => {
                                return n.id === ctrlClicked.attr("id");
                            });

                            if (thisObj && thisObj.length > 0) {
                                self.validateControl(thisObj[0], ctrlClicked);
                            }
                        });
                    }
                });

                // Focus
                if (ctrlFlag && objFlag) {
                    if (objFlag.tabId && objFlag.tabIndex) {
                        // Focus tab
                        $("#" + objFlag.tabId).tabs("option", "active", objFlag.tabIndex);
                    }

                    // Focus control
                    ctrlFlag.focus();
                }
            }
        } catch (e) {
            console.log("ERROR - S24_V2_Validate - validate(): " + e.message);
        }

        const returnFlag = (ctrlFlag) ? false : true;

        if (returnFlag) {
            self.destroy(errorObj);
        }
        return returnFlag;
    }

    public removeErrorClass(ctrl) {
        const self = this;
        // Remove error class
        ctrl.removeClass(self.errorClass);
        const ctrlType = ctrl.attr("type");
        let vCtrl = null;
        switch (ctrlType) {
            case "tel":
                vCtrl = ctrl.parent().siblings(self.errorCtrlSelector);
                break;
            default:
                vCtrl = ctrl.siblings(self.errorCtrlSelector);
                break;
        }

        // Hide error span
        if (vCtrl.length > 0) {
            vCtrl.hide();
        }
    }

    private destroy(errorObj): void {
        const self = this;
        let thisObj: any = null;
        $(errorObj).each(function() {
            thisObj = this;
            if (thisObj.id) {
                const ctrl = $("#" + thisObj.id);
                ctrl.off("change keyup paste");
                self.removeErrorClass(ctrl);
            }
        });
    }

    private validateControl(obj: any, ctrl: JQuery): boolean {
        const self = this;
        const returnFlag = false;
        const thisErrorMessage = obj.message ? obj.message : self.errorMessage;
        const thisErrorSpan = self.errorSpan.replace("{Message}", thisErrorMessage);

        if (ctrl.val()) {
            const ctrlType = ctrl.attr("type");

            switch (ctrlType) {
                case "tel":
                    // Check if date control
                    if (ctrl.attr("data-input-format") === "date") {
                        if (!CommonUtils.validateDate(ctrl.val())) {
                            self.addErrorClass(ctrl, obj.message ? thisErrorSpan : self.errorDateSpan);
                            return true;
                        }
                        self.removeErrorClass(ctrl);
                    }
                    break;
                case "email":
                    if (!CommonUtils.validateEmail(ctrl.val())) {
                        self.addErrorClass(ctrl, self.errorEmailSpan);
                        return true;
                    }
                    self.removeErrorClass(ctrl);
                    break;
                case "number":
                    if (ctrl.attr("min") && parseInt(ctrl.val().toString()) < parseInt(ctrl.attr("min"))) {
                        self.addErrorClass(ctrl, self.errorNumberRangeSpan);
                        return true;
                    }
                    if (ctrl.attr("max") && parseInt(ctrl.val().toString()) > parseInt(ctrl.attr("max"))) {
                        self.addErrorClass(ctrl, self.errorNumberRangeSpan);
                        return true;
                    }
                    if (ctrl.attr("name") === "organizationnumber" && ctrl.val().toString().length !== 9) {
                        self.addErrorClass(ctrl, self.errorNumberOrganizationSpan);
                        return true;
                    }
                    self.removeErrorClass(ctrl);
                    break;
                case "text":
                    if (ctrl.attr("id") === "txtRegnr") {
                        if (ctrl.val().toString().length > 7 || ctrl.val().toString().length < 6) {
                            self.addErrorClass(ctrl, thisErrorSpan);
                            return true;
                        }
                    }
                    if (ctrl.attr("id") === "txtName") {
                        if (!CommonUtils.validateSpecialCharacters(ctrl.val().toString())) {
                            const errorSpan = self.errorSpan.replace("{Message}", "Navnet inneholder ugyldige tegn.");
                            self.addErrorClass(ctrl, errorSpan);
                            return true;
                        }
                    }
                    self.removeErrorClass(ctrl);
                    break;
                case "checkbox":
                    if (!ctrl.is(":checked")) {
                        self.addErrorClass(ctrl, thisErrorSpan);
                        return true;
                    }
                    self.removeErrorClass(ctrl);
                    break;
                default:
                    self.removeErrorClass(ctrl);
                    break;
            }
        } else {
            self.addErrorClass(ctrl, thisErrorSpan);
            return true;
        }

        return returnFlag;
    }

    private addErrorClass(ctrl, thisErrorSpan) {
        const self = this;
        // Add error class
        ctrl.addClass(self.errorClass);
        // Insert error span
        const ctrlType = ctrl.attr("type");
        let vCtrl = null;
        switch (ctrlType) {
            case "tel":
                // Check if date control
                if (ctrl.attr("data-input-format") === "date") {
                    vCtrl = ctrl.parent().siblings(self.errorCtrlSelector);
                    if (vCtrl.length > 0) {
                        vCtrl.show();
                    } else {
                        ctrl.parent().after(thisErrorSpan);
                    }
                } else {
                    vCtrl = ctrl.parent().find(self.errorCtrlSelector);
                    if (vCtrl.length > 0) {
                        vCtrl.show();
                    } else {
                        ctrl.parent().append(thisErrorSpan);
                    }
                }
                break;
            default:
                vCtrl = ctrl.parent().find(self.errorCtrlSelector);
                if (vCtrl.length > 0) {
                    const tempElement = $(thisErrorSpan);
                    vCtrl.text(tempElement.text());
                    vCtrl.show();
                } else {
                    ctrl.parent().append(thisErrorSpan);
                }
                break;
        }
    }
}
