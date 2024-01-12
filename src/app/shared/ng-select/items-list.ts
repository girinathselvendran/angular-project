import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';
import { NgSelectComponent } from './ng-select.component';
import { isDefined, isFunction, isObject } from './value-utils';
import { newId } from './id';
import { SelectionModel } from './selection-model';

type OptionGroups = Map<string, NgOption[]>;

export class ItemsList {
  private _groups!: OptionGroups;
  public incomingNotFounfTextNgselect: string[] = [];

  constructor(
    private _ngSelect: NgSelectComponent,
    private _selectionModel: SelectionModel
  ) {}

  public _items: NgOption[] = [];

  get items(): NgOption[] {
    return this._items;
  }

  public _filteredItems: NgOption[] = [];

  get filteredItems(): NgOption[] {
    return this._filteredItems;
  }

  private _markedIndex = -1;

  get markedIndex(): number {
    return this._markedIndex;
  }

  get selectedItems() {
    return this._selectionModel.value;
  }

  get markedItem(): NgOption {
    return this._filteredItems[this._markedIndex];
  }

  get noItemsToSelect(): boolean {
    return (
      this._ngSelect.hideSelected &&
      this._items.length === this.selectedItems.length
    );
  }

  get maxItemsSelected(): boolean {
    return (
      this._ngSelect.multiple &&
      this._ngSelect.maxSelectedItems <= this.selectedItems.length
    );
  }

  get lastSelectedItem() {
    return this.selectedItems[this.selectedItems.length - 1];
  }

  setItems(items: any[]) {
    this._items = items.map((item, index) => this.mapItem(item, index));
    if (this._ngSelect.groupBy) {
      this._groups = this._groupBy(this._items, this._ngSelect.groupBy);
      this._items = this._flatten(this._groups);
    } else {
      const DEFAULT_GROUP_KEY = '__default__';
      this._groups = new Map<string, any>();
      this._groups.set(DEFAULT_GROUP_KEY, this._items);
    }
    this._filteredItems = [...this._items];
  }

  select(item: NgOption) {
    if (item.selected || this.maxItemsSelected) {
      return;
    }
    const multiple = this._ngSelect.multiple;
    if (!multiple) {
      this.clearSelected();
    }

    this._selectionModel.select(
      item,
      multiple,
      this._ngSelect.selectableGroupAsModel
    );
    if (this._ngSelect.hideSelected && multiple) {
      this._hideSelected(item);
    }
  }

  unselect(item: NgOption) {
    if (!item.selected) {
      return;
    }
    this._selectionModel.unselect(item, this._ngSelect.multiple);
    if (
      this._ngSelect.hideSelected &&
      isDefined(item.index) &&
      this._ngSelect.multiple
    ) {
      this._showSelected(item);
    }
  }

  findItem(value: any): NgOption | undefined {
    let findBy: (item: NgOption) => boolean;
    if (this._ngSelect.compareWith) {
      findBy = (item) => this._ngSelect.compareWith(item.value, value);
    } else if (this._ngSelect.bindValue) {
      findBy = (item) =>
        !item.children &&
        this.resolveNested(item.value, this._ngSelect.bindValue) === value;
    } else {
      findBy = (item) =>
        Boolean(
          (item && item.value === value) ||
            (!item.children &&
              item.label &&
              item.label ===
                this.resolveNested(value, this._ngSelect.bindLabel))
        );
    }
    return this._items.find((item) => findBy(item));
  }

  addItem(item: any) {
    const option = this.mapItem(item, this._items.length);
    this._items.push(option);
    this._filteredItems.push(option);
    return option;
  }

  clearSelected() {
    this._selectionModel.clear();
    this._items.forEach((item) => {
      item.selected = false;
      item.marked = false;
    });
    // Clear filter value custom  - start
    this._ngSelect.filterValue = '';
    // -end
    if (this._ngSelect.hideSelected) {
      this.resetFilteredItems();
    }
  }

  findByLabel(term: string) {
    term = searchHelper.stripSpecialChars(term).toLocaleLowerCase();
    return this.filteredItems.find((item) => {
      if (item.label) {
        const label = searchHelper
          .stripSpecialChars(item.label)
          .toLocaleLowerCase();
        return label.substr(0, term.length) === term;
      }
      return false; // Return false if item.label is undefined
    });
  }

  filter(term: string): void {
    if (!term) {
      this.resetFilteredItems();
      return;
    }

    this._filteredItems = [];
    term = this._ngSelect.searchFn
      ? term
      : searchHelper.stripSpecialChars(term).toLocaleLowerCase();
    const match = this._ngSelect.searchFn || this._defaultSearchFn;
    const hideSelected = this._ngSelect.hideSelected;

    for (const key of Array.from(this._groups.keys())) {
      const matchedItems = [];
      const itemsForKey = this._groups.get(key);
      if (itemsForKey) {
        for (const item of itemsForKey) {
          if (
            hideSelected &&
            ((item.parent && item.parent.selected) || item.selected)
          ) {
            continue;
          }
          const searchItem = this._ngSelect.searchFn ? item.value as NgOption : item as NgOption;
          if (searchItem && match(term, searchItem)) {
            matchedItems.push(item);
          }
          
          
        }
      }

      if (matchedItems.length > 0) {
        const [last] = matchedItems.slice(-1);
        if (last.parent) {
            const head = this._items.find((x) => x === last.parent);
            if (head) {
              this._filteredItems.push(head);
            }
            
        }
        this._filteredItems.push(...matchedItems);
      }
    }
  }

  resetFilteredItems() {
    this.incomingNotFounfTextNgselect.push(this._ngSelect.notFoundText);
    //Darwin
    if (this._items.length <= 0 && this._ngSelect.filterValue == null) {
      this._ngSelect.notFoundText = 'Record not found';
    } else {
      this._ngSelect.notFoundText = this.incomingNotFounfTextNgselect[0];
    }

    if (this._filteredItems.length === this._items.length) {
      return;
    }

    if (this._ngSelect.hideSelected && this.selectedItems.length > 0) {
      this._filteredItems = this._items.filter((x) => !x.selected);
    } else {
      this._filteredItems = this._items;
    }
  }

  unmarkItem() {
    this._markedIndex = -1;
  }

  markNextItem() {
    this._stepToItem(+1);
  }

  markPreviousItem() {
    this._stepToItem(-1);
  }

  markItem(item: NgOption) {
    this._markedIndex = this._filteredItems.indexOf(item);
  }

  markSelectedOrDefault(markDefault?: boolean) {
    if (this._filteredItems.length === 0) {
      return;
    }
    const indexOfLastSelected = this._ngSelect.hideSelected
      ? -1
      : this._filteredItems.indexOf(this.lastSelectedItem);
    if (this.lastSelectedItem && indexOfLastSelected > -1) {
      this._markedIndex = indexOfLastSelected;
    } else {
      this._markedIndex = markDefault
        ? this.filteredItems.findIndex((x) => !x.disabled)
        : -1;
    }
  }

  resolveNested(option: any, key: string): any {
    if (!isObject(option)) {
      return option;
    }
    if (key.indexOf('.') === -1) {
      return option[key];
    } else {
      let keys: string[] = key.split('.');
      let value = option;
      for (let i = 0, len = keys.length; i < len; ++i) {
        if (value == null) {
          return null;
        }
        value = value[keys[i]];
      }
      return value;
    }
  }

  mapItem(item: any, index: number): NgOption {
    const label = isDefined(item.$ngOptionLabel)
      ? item.$ngOptionLabel
      : this.resolveNested(item, this._ngSelect.bindLabel);
    const value = isDefined(item.$ngOptionValue) ? item.$ngOptionValue : item;
    return {
      index: index,
      label: isDefined(label) ? label.toString() : '',
      value: value,
      disabled: item.disabled,
      htmlId: newId(),
    };
  }

  mapSelectedItems() {
    const multiple = this._ngSelect.multiple;
    for (const selected of this.selectedItems) {
      if (selected.mapped) {
        continue;
      }

      const value = this._ngSelect.bindValue
        ? this.resolveNested(selected.value, this._ngSelect.bindValue)
        : selected.value;
      const item = this.findItem(value);
      if (item) {
        item.mapped = true;
      }
      this._selectionModel.unselect(selected, multiple);
      this._selectionModel.select(
        item || selected,
        multiple,
        this._ngSelect.selectableGroupAsModel
      );
    }

    if (this._ngSelect.hideSelected) {
      this._filteredItems = this.filteredItems.filter(
        (x) => this.selectedItems.indexOf(x) === -1
      );
    }
  }

  private _showSelected(item: NgOption) {
    this._filteredItems.push(item);
    if (item.parent) {
      const parent = item.parent;
      const parentExists = this._filteredItems.find((x) => x === parent);
      if (!parentExists) {
        this._filteredItems.push(parent);
      }
    } else if (item.children) {
      for (const child of item.children) {
        child.selected = false;
        this._filteredItems.push(child);
      }
    }
    this._filteredItems = [
        ...this._filteredItems.sort((a, b) => {
          if (a.index !== undefined && b.index !== undefined) {
            return a.index - b.index;
          }
          // Handle the case when either a.index or b.index is undefined
          // For example, you might choose to put the undefined value last
          if (a.index === undefined && b.index !== undefined) {
            return 1; // a should come after b
          }
          if (a.index !== undefined && b.index === undefined) {
            return -1; // a should come before b
          }
          return 0; // both indices are undefined, order doesn't matter
        }),
      ];
      
  }

  private _hideSelected(item: NgOption) {
    this._filteredItems = this._filteredItems.filter((x) => x !== item);
    if (item.parent) {
      const children = item.parent.children;
      if (children && children.every((x) => x.selected)) {
        this._filteredItems = this._filteredItems.filter(
          (x) => x !== item.parent
        );
      }
    } else if (item.children) {
      this._filteredItems = this.filteredItems.filter((x) => x.parent !== item);
    }
  }
  

  private _defaultSearchFn(search: string, opt: NgOption) {
    if (opt.label) {
      const label = searchHelper.stripSpecialChars(opt.label).toLocaleLowerCase();
      return label.indexOf(search) > -1;
    }
    return false; // Handle the case when opt.label is undefined
  }
  

  private _getNextItemIndex(steps: number) {
    if (steps > 0) {
      return this._markedIndex === this._filteredItems.length - 1
        ? 0
        : this._markedIndex + 1;
    }
    return this._markedIndex <= 0
      ? this._filteredItems.length - 1
      : this._markedIndex - 1;
  }

  private _stepToItem(steps: number) {
    if (
      this._filteredItems.length === 0 ||
      this._filteredItems.every((x) => x.disabled)
    ) {
      return;
    }

    this._markedIndex = this._getNextItemIndex(steps);
    if (this.markedItem.disabled) {
      this._stepToItem(steps);
    }
  }

  private _groupBy(items: NgOption[], prop: string | Function): OptionGroups {
    const isFn = isFunction(this._ngSelect.groupBy);
    const groups = new Map<string | undefined, NgOption[]>();
    for (const item of items) {
      let key: string | undefined;
  
      if (isFn) {
        key = (<Function>prop)(item.value);
      } else if (typeof prop === 'string') {
        if (typeof item.value === 'object' && item.value !== null) {
          key = (item.value as { [key: string]: string })[prop];
        }
      }
  
      const group = groups.get(key);
      if (group) {
        group.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return groups as OptionGroups;
  }
  
  

  private _flatten(groups: OptionGroups) {
    const isFn = isFunction(this._ngSelect.groupBy);
    const items: NgOption[] = [];
    const withoutGroup: NgOption[] = groups.get('') || []; // Use null for items without a group
    items.push(...withoutGroup);
    let i = withoutGroup.length;
  
    for (const key of Array.from(groups.keys())) {
      if (!isDefined(key)) {
        continue;
      }
      const parent: NgOption = {
        label: key,
        children: undefined,
        parent: undefined, // Change null to undefined
        index: i++,
        disabled: !this._ngSelect.selectableGroup,
        htmlId: newId(),
      };
      const groupKey = isFn
        ? this._ngSelect.bindLabel
        : <string>this._ngSelect.groupBy;
      const groupValue =
        this._ngSelect.groupValue || (() => ({ [groupKey]: key }));
  
      const children = groups.get(key)?.map((x) => { // Add safe navigation operator '?'
        x.parent = parent;
        x.children = undefined;
        x.index = i++;
        return x;
      }) || [];
  
      parent.children = children;
      parent.value = groupValue(
        key,
        children.map((x) => x.value)
      );
      items.push(parent);
      items.push(...children);
    }
  
    return items;
  }
  
}
