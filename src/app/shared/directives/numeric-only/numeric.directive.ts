import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Directive({
    selector: '[numeric]'
})

export class NumericDirective {
    @Input('numericType') numericType: string=' '; // number | decimal
    @Input('scale') scale: number=0; // number | decimal

    private regex = {
        number: new RegExp(/^\d+$/),
        negativenumber2: new RegExp(/^-?\d{0,3}$/),
        decimal4: new RegExp(/^\d*\.?\d{0,4}$/g),
        decimal3: new RegExp(/^\d*\.?\d{0,3}$/g),
        decimal2: new RegExp(/^\d*\.?\d{0,2}$/g),
        decimal1: new RegExp(/^\d*\.?\d{0,1}$/g),
        negativedecimal1: new RegExp(/^[-]\d*\.?\d{0,1}$/g),
        negativedecimal4: new RegExp(/^[-]\d*\.?\d{0,4}$/g),
        negativedecimal3: new RegExp(/^[-]\d*\.?\d{0,3}$/g),
        negativedecimal2: new RegExp(/^[-]\d*\.?\d{0,2}$/g),
    };

    //  private bigInt = require("big-number");
    private BigNumber = require('bignumber.js');

    private specialKeys = ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Control'];

    initialInput:number=0;

    constructor(private el: ElementRef, public notificationService: NotificationService) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (this.specialKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
            (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
            (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
            (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
            (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
            (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
            (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
            (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
            (e.key === 'x' && e.metaKey === true)) {
            return;
        }
        // if (this.specialKeys.indexOf(e.key) === -1 ) {
        //     this.notificationService.smallBox({
        //         title: "Error",
        //         content: "Only numbers were allowed",
        //         color: "#a90329",
        //         timeout: 3000,
        //         icon: "fa fa-times",
        //       });
        //     return;
        // }
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const end = this.el.nativeElement.selectionEnd;
        // const org = current.substring(0, position) + e.key === 'Decimal' ? '.' : e.key + current.substring(end, current.length);
        const nextt: string = current.concat(e.key);
        // const next: string = current.concat(e.key);
        // const next: string = [current.slice(0, position), e.key === 'Decimal' ? '.' : e.key, current.slice(position)].join('');
        if (this.numericType === "number" || this.numericType === "negativenumber2") {
            const next: string = current.concat(e.key);
            if (next && !String(next).match(this.regex[this.numericType])) {
                e.preventDefault();
            }
        } else if (this.numericType === "decimal") {
            // const next: string = [current.slice(0, position), e.key === 'Decimal' ? '.' : e.key, current.slice(position)].join('');
            const next: string = current.substring(0, position) + (e.key === 'Decimal' ? '.' : e.key) + current.substring(end, current.length);
            if (this.scale.toString() === "4") {
                if (next && !String(next).match(this.regex["decimal4"])) {
                    e.preventDefault();
                }
            }
            if (this.scale.toString() === "3") {
                if (next && !String(next).match(this.regex["decimal3"])) {
                    e.preventDefault();
                }
            }
            if (this.scale.toString() === "2") {
                if (next && !String(next).match(this.regex["decimal2"])) {
                    e.preventDefault();
                }
            }
        } else if (this.numericType === "negativeDecimal") {
            const next: string = current.substring(0, position) + (e.key === 'Decimal' ? '.' : e.key) + current.substring(end, current.length);
            // const full: string = current.substring(0, current.length);
            // const fullwithNext: string = current.substring(0, current.length);
            // const next: string = [current.slice(0, position), e.key === 'Decimal' ? '.' : e.key, current.slice(position)].join('');
            if (this.scale.toString() === "1") {
                if (next && (!String(next).match(this.regex["negativedecimal1"]) && !String(next).match(this.regex["decimal1"]))) {
                    e.preventDefault();
                }
            }
            if (this.scale.toString() === "4") {
                if (next && (!String(next).match(this.regex["negativedecimal4"]) && !String(next).match(this.regex["decimal4"]))) {
                    e.preventDefault();
                }
            }
            if (this.scale.toString() === "3") {
                if (next && (!String(next).match(this.regex["negativedecimal3"]) && !String(next).match(this.regex["decimal3"]))) {
                    e.preventDefault();
                }
            }
            if (this.scale.toString() === "2") {
                if (next && (!String(next).match(this.regex["negativedecimal2"]) && !String(next).match(this.regex["decimal2"]))) {
                    e.preventDefault();
                }
            }
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        let pastedInput: string | undefined = undefined; // Initialize as undefined
        if (event.clipboardData) {
        if (this.numericType === "decimal") {
        this.initialInput = isNaN(this.el.nativeElement.value) ?  this.initialInput : this.el.nativeElement.value;
            if (this.scale.toString() === "4") {
                // pastedInput = event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,4})?/) ? event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,4})?/)[0] : "";
                pastedInput = event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,4})?/)?.[0] || '';
            }
            if (this.scale.toString() === "3") {
                // pastedInput = event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,3})?/) ? event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] : "";
                pastedInput = event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,3})?/)?.[0] || "";
            }
            if (this.scale.toString() === "2") {
                // pastedInput = event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,2})?/) ? event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] : ""; 
                pastedInput =  event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,2})?/)?.[0] || ""; 
            }
        }
        if (this.numericType === "number") {
            pastedInput = event?.clipboardData?.getData('text/plain').replace(/\D/g, '');
        }
        if (this.numericType === "negativenumber2") {
            // pastedInput = event?.clipboardData?.getData('text/plain').toString().match(/^-?\d{0,3}$/) ? event?.clipboardData?.getData('text/plain').toString().match(/^-?\d{0,3}$/)[0] : "";
            pastedInput =  event.clipboardData.getData('text/plain').match(/^-?\d{0,3}$/)?.[0] || "";
        }
        if (this.numericType === "negativeDecimal") {
            // pastedInput = event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,4})?/) ? event?.clipboardData?.getData('text/plain').toString().match(/^-?\d+(?:\.\d{0,4})?/)[0] : "";
            pastedInput = event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,4})?/)?.[0] ||"";
            const current = this.el.nativeElement.value.substring(0, this.el.nativeElement.selectionStart) + this.el.nativeElement.value.substring(this.el.nativeElement.selectionEnd, this.el.nativeElement.value.length);
            if (this.scale.toString() === "4") {
                if (((current === "." || current === "-" ||
                    (this.el.nativeElement.selectionStart > 0 && current.toString().match(/^\d+(?:\.\d{0,4})?/))
                    || (current.toString().match(/^-\d+(?:\.\d{0,4})?/))) && event?.clipboardData?.getData('text/plain').toString().match(/^-\d+(?:\.\d{0,4})?/))
                    ||
                    ((current === "." || current === "-" ||
                        (this.el.nativeElement.selectionStart === 0 && this.el.nativeElement.selectionEnd === 0 && current.toString().match(/^-\d+(?:\.\d{0,4})?/))
                        || (this.el.nativeElement.selectionStart === 0 && current.toString().match(/^-\d+(?:\.\d{0,4})?/)))
                        && event?.clipboardData?.getData('text/plain').toString().match(/^\d+(?:\.\d{0,4})?/))) {
                    pastedInput = "";
                } else {
                    pastedInput =  event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,4})?/)?.[0] || "";

                }
            }
            if (this.scale.toString() === "3") {
                if (((current === "." || current === "-" ||
                    (this.el.nativeElement.selectionStart > 0 && current.toString().match(/^\d+(?:\.\d{0,3})?/))
                    || (current.toString().match(/^-\d+(?:\.\d{0,4})?/))) && event?.clipboardData?.getData('text/plain').toString().match(/^-\d+(?:\.\d{0,3})?/)) ||
                    ((current === "." || current === "-" ||
                        (this.el.nativeElement.selectionStart === 0 && this.el.nativeElement.selectionEnd === 0 && current.toString().match(/^-\d+(?:\.\d{0,3})?/))
                        || (this.el.nativeElement.selectionStart === 0 && current.toString().match(/^-\d+(?:\.\d{0,3})?/)))
                        && event?.clipboardData?.getData('text/plain').toString().match(/^\d+(?:\.\d{0,3})?/))) {
                    pastedInput = "";
                } else {
                    pastedInput = event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,3})?/)?.[0] || "";

                }
            }
            if (this.scale.toString() === "2") {
                if (((current === "." || current === "-" ||
                    (this.el.nativeElement.selectionStart > 0 && current.toString().match(/^\d+(?:\.\d{0,2})?/))
                    || (current.toString().match(/^-\d+(?:\.\d{0,2})?/))) && event?.clipboardData?.getData('text/plain').toString().match(/^-\d+(?:\.\d{0,2})?/)) ||
                    ((current === "." || current === "-" ||
                        (this.el.nativeElement.selectionStart === 0 && this.el.nativeElement.selectionEnd === 0 && current.toString().match(/^-\d+(?:\.\d{0,2})?/))
                        || (this.el.nativeElement.selectionStart === 0 && current.toString().match(/^-\d+(?:\.\d{0,2})?/)))
                        && event?.clipboardData?.getData('text/plain').toString().match(/^\d+(?:\.\d{0,2})?/))) {
                    pastedInput = "";
                } else {
                    pastedInput = event.clipboardData.getData('text/plain').match(/^-?\d+(?:\.\d{0,2})?/)?.[0] || "";

                }
            }
        }

        document.execCommand('insertText', false, pastedInput);
    }
    }
    @HostListener('change') onChange() {
        if (this.numericType === "decimal") {
            if (this.el.nativeElement.value !== null && this.el.nativeElement.value !== "" && this.el.nativeElement.value !== undefined && this.el.nativeElement.value !== ".") {
                // commented for decimal issue
                // if (this.el.nativeElement.value.length <= 11) {
                //  this.el.nativeElement.value = this.BigNumber(this.el.nativeElement.value).toFixed(this.scale);
                // this.el.nativeElement.value = parseFloat(this.el.nativeElement.value).toFixed(this.scale);

                // this.scale = Number(this.scale);  //existing Code 
                // this.el.nativeElement.value = this.BigNumber(this.el.nativeElement.value).toFixed(this.scale); //existing Code 

                // to resolve NaN value
                this.scale = Number(this.scale);
                this.el.nativeElement.value = isNaN(this.el.nativeElement.value) 
                                              ? this.BigNumber(this.initialInput).toFixed(this.scale)
                                              : this.BigNumber(this.el.nativeElement.value).toFixed(this.scale); // If the pasted Input is not a number then return initial value

                // }
            } else if (this.el.nativeElement.value === ".") {
                this.el.nativeElement.value = parseFloat("0").toFixed(this.scale);
            }
        } else if (this.numericType === "negativeDecimal") {
            if (this.el.nativeElement.value !== null && this.el.nativeElement.value !== "" && this.el.nativeElement.value !== undefined && this.el.nativeElement.value !== "-" && this.el.nativeElement.value !== "." && this.el.nativeElement.value !== "-.") {
                // if (this.el.nativeElement.value.length <= 11) {
                // this.el.nativeElement.value = parseFloat(this.el.nativeElement.value).toFixed(this.scale);
                // }
                this.scale = Number(this.scale);
                this.el.nativeElement.value = this.BigNumber(this.el.nativeElement.value).toFixed(this.scale);
            } else if (this.el.nativeElement.value === "-") {
                this.el.nativeElement.value = parseFloat("0").toFixed(this.scale);
            } else if (this.el.nativeElement.value === ".") {
                this.el.nativeElement.value = parseFloat("0").toFixed(this.scale);
            } else if (this.el.nativeElement.value === "-.") {
                this.el.nativeElement.value = parseFloat("0").toFixed(this.scale);
            }
        }
    }
}
