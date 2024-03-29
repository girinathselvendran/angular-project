export interface ColumnConfigModel {
    field?: string;
    header?: string;
    showHide?: boolean;
    show?: boolean;
    filterType?: string;
    dataType?: string;
    filterRefKey?: string;
    control?: string;
    options?: any[];
    showCustomDateOptions?: boolean;
    showDateRange?: boolean;
    dateRange?: any;
    fromDate?: Date;
    toDate?: Date;
    showName?: boolean;
    selectedDateOptions?: any[];
    filterFromDateKey?: string;
    filterToDateKey?: string;
    hideFilter?: boolean;
    refDownloadField?:string;
    sortRefKey?: string;
    searchValue?: string | boolean;
    matchMode?: string;
    hideSorting?: boolean;
    minWidth?: string;
    isRequired?: boolean;
    filterOptions?: any[];
    optionLabel?: string;
    placeholder?: string;
}
