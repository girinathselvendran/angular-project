import { Injectable } from '@angular/core';

@Injectable()
export class NgSelectConfig {
    placeholder: string;
    notFoundText = 'No items found';
    typeToSearchText = 'Type to search';
    addTagText = 'Add item';
    loadingText = 'Loading...';
    clearAllText = 'Clear all';
    disableVirtualScroll = true;
    openOnEnter = true;

    constructor() {
        // Assign values to properties in the constructor
        this.placeholder = 'Select an option'; // Provide the appropriate value
    }
}
