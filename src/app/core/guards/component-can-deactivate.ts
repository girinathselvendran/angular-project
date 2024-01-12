import { Directive, HostListener } from "@angular/core";
@Directive()
export abstract class ComponentCanDeactivate {
    dirty: any;

    abstract canDeactivate(): boolean;
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.canDeactivate()) {
            $event.returnValue = true;
        }
    }
}
