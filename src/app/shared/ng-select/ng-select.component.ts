import {
  Component,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  forwardRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ViewEncapsulation,
  HostListener,
  HostBinding,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  Inject,
  SimpleChanges,
  ContentChildren,
  QueryList,
  InjectionToken,
  Attribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  takeUntil,
  startWith,
  tap,
  debounceTime,
  map,
  filter,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { merge } from 'rxjs';

import {
  NgOptionTemplateDirective,
  NgLabelTemplateDirective,
  NgHeaderTemplateDirective,
  NgFooterTemplateDirective,
  NgOptgroupTemplateDirective,
  NgNotFoundTemplateDirective,
  NgTypeToSearchTemplateDirective,
  NgLoadingTextTemplateDirective,
  NgMultiLabelTemplateDirective,
  NgTagTemplateDirective,
} from './ng-templates.directive';

import { ConsoleService } from './console.service';
import { isDefined, isFunction, isPromise, isObject } from './value-utils';
import { ItemsList } from './items-list';
import { NgOption, KeyCode } from './ng-select.types';
import { newId } from './id';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { SelectionModelFactory } from './selection-model';
import { NgSelectConfig } from './config.service';

export const SELECTION_MODEL_FACTORY =
  new InjectionToken<SelectionModelFactory>('ng-select-selection-model');
export type DropdownPosition = 'bottom' | 'top' | 'auto';
export type AddTagFn = (term: string) => any | Promise<any>;
export type CompareWithFn = (a: any, b: any) => boolean;

@Component({
  selector: 'ng-select',
  templateUrl: './ng-select.component.html',
  styleUrls: ['./ng-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgSelectComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listbox',
    class: 'ng-select',
    '[class.ng-select-single]': '!multiple',
  },
})
export class NgSelectComponent
  implements OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor
{
  // inputs
  @Input() items: any[] = [];
  @Input()
  bindLabel!: string;
  @Input()
  bindValue!: string;
  @Input() clearable = true;
  @Input() markFirst = true;
  @Input()
  placeholder!: string;
  @Input()
  notFoundText!: string;
  public inComingNotFounfText = this.notFoundText;
  @Input()
  typeToSearchText!: string;
  @Input()
  addTagText!: string;
  @Input()
  loadingText!: string;
  @Input()
  clearAllText!: string;
  @Input() dropdownPosition: DropdownPosition = 'auto';
  @Input()
  appendTo!: string;
  @Input() loading = false;
  @Input() closeOnSelect = true;
  @Input() hideSelected = false;
  @Input() selectOnTab = false;
  @Input()
  openOnEnter!: boolean;
  @Input()
  maxSelectedItems!: number;
  @Input()
  groupBy!: string | Function;
  @Input()
  groupValue!: Function;
  @Input() bufferAmount = 4;
  @Input()
  virtualScroll!: boolean;
  @Input() selectableGroup = false;
  @Input() selectableGroupAsModel = true;
  @Input() searchFn = null;
  @Input() clearOnBackspace = true;
  @Input() editMode = false;

  @Input() labelForId = null;
  @Input()
  @HostBinding('class.ng-select-typeahead')
  typeahead!: Subject<string>;
  @Input() @HostBinding('class.ng-select-multiple') multiple = false;
  @Input() @HostBinding('class.ng-select-taggable') addTag: boolean | AddTagFn =
    false;
  @Input() @HostBinding('class.ng-select-searchable') searchable = true;
  @Input() @HostBinding('class.ng-select-opened') isOpen = false;

  @Input()
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: CompareWithFn) {
    if (!isFunction(fn)) {
      throw Error('`compareWith` must be a function.');
    }
    this._compareWith = fn;
  }

  @Input()
  get clearSearchOnAdd() {
    return isDefined(this._clearSearchOnAdd)
      ? this._clearSearchOnAdd
      : this.closeOnSelect;
  }
  set clearSearchOnAdd(value) {
    this._clearSearchOnAdd = value;
  }

  // output events
  @Output('blur') blurEvent = new EventEmitter();
  @Output('focus') focusEvent = new EventEmitter();
  @Output('change') changeEvent = new EventEmitter();
  @Output('open') openEvent = new EventEmitter();
  @Output('close') closeEvent = new EventEmitter();
  @Output('search') searchEvent = new EventEmitter();
  @Output('clear') clearEvent = new EventEmitter();
  @Output('add') addEvent = new EventEmitter();
  @Output('remove') removeEvent = new EventEmitter();
  @Output('scroll') scroll = new EventEmitter<{ start: number; end: number }>();
  @Output('scrollToEnd') scrollToEnd = new EventEmitter<{
    start: number;
    end: number;
  }>();

  // custom templates
  @ContentChild(NgOptionTemplateDirective, { read: TemplateRef })
  optionTemplate!: TemplateRef<any>;
  @ContentChild(NgOptgroupTemplateDirective, { read: TemplateRef })
  optgroupTemplate!: TemplateRef<any>;
  @ContentChild(NgLabelTemplateDirective, { read: TemplateRef })
  labelTemplate!: TemplateRef<any>;
  @ContentChild(NgMultiLabelTemplateDirective, { read: TemplateRef })
  multiLabelTemplate!: TemplateRef<any>;
  @ContentChild(NgHeaderTemplateDirective, { read: TemplateRef })
  headerTemplate!: TemplateRef<any>;
  @ContentChild(NgFooterTemplateDirective, { read: TemplateRef })
  footerTemplate!: TemplateRef<any>;
  @ContentChild(NgNotFoundTemplateDirective, { read: TemplateRef })
  notFoundTemplate!: TemplateRef<any>;
  @ContentChild(NgTypeToSearchTemplateDirective, { read: TemplateRef })
  typeToSearchTemplate!: TemplateRef<any>;
  @ContentChild(NgLoadingTextTemplateDirective, { read: TemplateRef })
  loadingTextTemplate!: TemplateRef<any>;
  @ContentChild(NgTagTemplateDirective, { read: TemplateRef })
  tagTemplate!: TemplateRef<any>;

  @ViewChild(forwardRef(() => NgDropdownPanelComponent))
  dropdownPanel!: NgDropdownPanelComponent;
  @ContentChildren(NgOptionComponent, { descendants: true })
  ngOptions!: QueryList<NgOptionComponent>;
  @ViewChild('filterInput')
  filterInput!: ElementRef;

  @HostBinding('class.ng-select-disabled') disabled = false;
  @HostBinding('class.ng-select-filtered') get filtered() {
    return !!this.filterValue && this.searchable;
  }

  // Custome validator Output
  @Output() customValidator = new EventEmitter<boolean>();
  customValidatorValue: any = false;

  itemsList: ItemsList;
  viewPortItems: NgOption[] = [];
  filterValue: string = '';
  dropdownId = newId();
  selectedItemId = 0;
  element: HTMLElement;
  focused!: boolean;

  private _defaultLabel = 'label';
  private _primitive = true;
  private _manualOpen!: boolean;
  private _pressedKeys: string[] = [];
  private _compareWith!: CompareWithFn;
  private _clearSearchOnAdd!: boolean;

  private readonly _destroy$ = new Subject<void>();
  private readonly _keyPress$ = new Subject<string>();
  private _onChange = (_: NgOption) => {};
  private _onTouched = () => {};

  clearItem = (item: any) => {
    const option = this.selectedItems.find((x) => x.value === item);
    if (option) {
      this.unselect(option);
    }
  };

  constructor(
    @Attribute('class') public classes: string,
    @Attribute('tabindex') public tabIndex: string,
    @Attribute('autofocus') private autoFocus: any,
    config: NgSelectConfig,
    @Inject(SELECTION_MODEL_FACTORY) newSelectionModel: SelectionModelFactory,
    _elementRef: ElementRef,
    private _cd: ChangeDetectorRef,
    private _console: ConsoleService
  ) {
    this._mergeGlobalConfig(config);
    this.itemsList = new ItemsList(this, newSelectionModel());
    this.element = _elementRef.nativeElement;
  }

  get selectedItems(): NgOption[] {
    return this.itemsList.selectedItems;
  }

  get selectedValues() {
    return this.selectedItems.map((x) => x.value);
  }

  get hasValue() {
    return this.selectedItems.length > 0;
  }

  ngOnInit() {
    this._handleKeyPresses();
    this.customShowNoItemsFound();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.editMode) {
      this.filterValue = '';
    }
    if (changes['multiple']) {
      this.itemsList.clearSelected();
    }
    if (changes['items']) {
      this._setItems(changes['items'].currentValue || []);
    }
    if (changes['isOpen']) {
      this._manualOpen = isDefined(changes['isOpen'].currentValue);
    }
  }

  ngAfterViewInit() {
    if (this.items && this.items.length === 0) {
      this._setItemsFromNgOptions();
    }

    if (isDefined(this.autoFocus)) {
      this.focus();
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown($event: KeyboardEvent) {
    if (KeyCode[$event.which]) {
      switch ($event.which) {
        case KeyCode.ArrowDown:
          this._handleArrowDown($event);
          break;
        case KeyCode.ArrowUp:
          this._handleArrowUp($event);
          break;
        case KeyCode.Space:
          this._handleSpace($event);
          break;
        case KeyCode.Enter:
          this._handleEnter($event);
          break;
        case KeyCode.Tab:
          this._handleTab($event);
          break;
        case KeyCode.Esc:
          this.close();
          $event.preventDefault();
          $event.stopPropagation();
          break;
        case KeyCode.Backspace:
          this._handleBackspace();
          break;
      }
    } else if ($event.key && $event.key.length === 1) {
      this._keyPress$.next($event.key.toLocaleLowerCase());
    }
  }

  handleMousedown($event: MouseEvent) {
    const target = $event.target as HTMLElement;
    if (target.tagName !== 'INPUT') {
      $event.preventDefault();
    }
    $event.stopPropagation();

    if (target.classList.contains('ng-clear-wrapper')) {
      this.handleClearClick();
      return;
    }

    if (target.classList.contains('ng-arrow-wrapper')) {
      this.handleArrowClick();
      return;
    }

    if (target.classList.contains('ng-value-icon')) {
      return;
    }

    if (!this.focused) {
      this.focus();
    }

    if (this.searchable) {
      this.open();
    } else {
      this.toggle();
    }
  }

  handleArrowClick() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  handleClearClick() {
    if (this.hasValue) {
      this.clearModel();
    }
    // if(this.filterValue !=null){

    // this.clearModel();

    // }
    this.close();
    this._clearSearch();
    this.focus();
    if (this._isTypeahead) {
      this.typeahead.next('');
    }
    this.clearEvent.emit();
    this.filterInput.nativeElement.value = '';
    this.filterValue = '';
  }

  clearModel() {
    if (!this.clearable) {
      return;
    }
    this.itemsList.clearSelected();
    this._updateNgModel();
  }

  writeValue(value: any | any[]): void {
    this.itemsList.clearSelected();
    this._handleWriteValue(value);
    this._cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cd.markForCheck();
  }

  toggle() {
    if (!this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (
      this.disabled ||
      this.isOpen ||
      this.itemsList.maxItemsSelected ||
      this._manualOpen
    ) {
      return;
    }

    if (!this._isTypeahead && !this.addTag && this.itemsList.noItemsToSelect) {
      return;
    }
    this.isOpen = true;
    if (this.isOpen && this.selectedValues.length <= 0) {
      this.focus();
    }
    this.itemsList.markSelectedOrDefault(this.markFirst);
    this.openEvent.emit();
    if (!this.filterValue) {
      this.focus();
    }
    this.detectChanges();
  }

  close() {
    if (!this.isOpen || this._manualOpen) {
      return;
    }
    this.isOpen = false;
    this._clearSearch();
    this._onTouched();
    this.closeEvent.emit();
    this._cd.markForCheck();
  }

  toggleItem(item: NgOption) {
    if (!item || item.disabled || this.disabled) {
      return;
    }

    if (this.multiple && item.selected) {
      this.unselect(item);
      this.filterValue = '';
      this.filterInput.nativeElement.value = ''; // IIC Changes
      this.itemsList.resetFilteredItems();
    } else {
      this.select(item);
      this.filterValue = '';
      this.filterInput.nativeElement.value = ''; // IIC Changes
      this.itemsList.resetFilteredItems();
    }
  }

  select(item: NgOption) {
    if (!item.selected) {
      this.itemsList.select(item);
      if (this.clearSearchOnAdd) {
        this._clearSearch();
      }

      if (this.multiple) {
        this.addEvent.emit(item.value);
      }
      this._updateNgModel();
    }

    if (this.closeOnSelect || this.itemsList.noItemsToSelect) {
      this.close();
    }
  }

  focus() {
    // Custome focus
    // this.filterValue = null
    if (this.filterValue) {
      // this.filterValue = null;
      this.customShowNoItemsFound();
    }

    this.itemsList.resetFilteredItems();
    this.filterInput.nativeElement.focus();
  }

  unselect(item: NgOption) {
    this.itemsList.unselect(item);
    this.focus();
    this._updateNgModel();
    this.removeEvent.emit(item);
  }

  selectTag() {
    let tag;
    if (isFunction(this.addTag)) {
      tag = (<AddTagFn>this.addTag)(this.filterValue);
    } else {
      tag = this._primitive
        ? this.filterValue
        : { [this.bindLabel]: this.filterValue };
    }

    const handleTag = (item: any) =>
      this._isTypeahead || !this.isOpen
        ? this.itemsList.mapItem(item, 0)
        : this.itemsList.addItem(item);
    if (isPromise(tag)) {
      tag.then((item: any) => this.select(handleTag(item))).catch(() => {});
    } else if (tag) {
      this.select(handleTag(tag));
    }
  }

  showClear() {
    return (
      this.clearable && (this.hasValue || this.filterValue) && !this.disabled
    );
  }

  get showAddTag() {
    if (!this.filterValue) {
      return false;
    }

    const term = this.filterValue.toLowerCase();
    return (
      this.addTag &&
      !this.itemsList.filteredItems.some(
        (x) => x.label && x.label.toLowerCase() === term
      ) &&
      ((!this.hideSelected && this.isOpen) ||
        !this.selectedItems.some(
          (x) => x.label && x.label.toLowerCase() === term
        )) &&
      !this.loading
    );
  }

  showNoItemsFound() {
    const empty = this.itemsList.filteredItems.length === 0;
    return (
      ((empty && !this._isTypeahead && !this.loading) ||
        (empty && this._isTypeahead && this.filterValue && !this.loading)) &&
      !this.showAddTag
    );
  }

  // Custome
  customShowNoItemsFound() {
    this.notFoundText = this.notFoundText;
    this.customValidatorValue = false;
    if (
      this.filterValue !== null &&
      this.filterValue !== '' &&
      this.selectedValues.length <= 0
    ) {
      if (this.itemsList.lastSelectedItem != null) {
        this.unselect(this.itemsList.lastSelectedItem);
      }
      this.customValidatorValue = true;
      this.customValidator.emit(this.customValidatorValue);
      // this.filterValue = null;
      // Filtering List

      // if (this._isTypeahead) {
      //     this.typeahead.next(this.filterValue);
      // } else {
      //     this.itemsList.filter(this.filterValue);
      //     if (this.isOpen) {
      //         this.itemsList.markSelectedOrDefault(this.markFirst);
      //     }
      // }
      return true;
    } else if (
      this.filterValue !== null &&
      this.filterValue !== '' &&
      this.selectedValues.length === 1 &&
      !this.multiple
    ) {
      // IIC Changes
      this.filterValue = '';
      return false;
    } else {
      this.customValidatorValue = false;
      this.customValidator.emit(this.customValidatorValue);
      return false;
    }
  }

  showTypeToSearch() {
    const empty = this.itemsList.filteredItems.length === 0;
    return empty && this._isTypeahead && !this.filterValue && !this.loading;
  }

  filter(term: string) {
    // Custome filter
    if (!this.multiple && this.selectedValues.length > 0) {
      // IIC Changes
      this.itemsList.clearSelected();
    }
    this.filterValue = term;
    this.open();

    if (this._isTypeahead) {
      this.typeahead.next(this.filterValue);
    } else {
      this.itemsList.filter(this.filterValue);
      if (this.isOpen) {
        this.itemsList.markSelectedOrDefault(this.markFirst);
      }
    }

    this.searchEvent.emit(term);
    this.customShowNoItemsFound();
    this.customValidator.emit(this.customValidatorValue);
  }

  onInputFocus($event: any) {
    if (this.focused) {
      return;
    }

    this.element.classList.add('ng-select-focused');
    this.focusEvent.emit($event);
    this.focused = true;
  }

  onInputBlur($event: any) {
    this.element.classList.remove('ng-select-focused');
    this.blurEvent.emit($event);
    if (!this.isOpen && !this.disabled) {
      this._onTouched();
    }
    this.focused = false;
  }

  onItemHover(item: NgOption) {
    if (item.disabled) {
      return;
    }
    this.itemsList.markItem(item);
  }

  detectChanges() {
    if (!(<any>this._cd).destroyed) {
      this._cd.detectChanges();
    }
  }

  updateDropdownPosition() {
    if (this.dropdownPanel) {
      this.dropdownPanel.updateDropdownPosition();
    }
  }
  pasteEvent($event: any) {
    this.customShowNoItemsFound();
  }

  private _setItems(items: any[]) {
    const firstItem = items[0];
    this.bindLabel = this.bindLabel || this._defaultLabel;
    this._primitive = isDefined(firstItem)
      ? !isObject(firstItem)
      : this._primitive;
    this.itemsList.setItems(items);
    if (items.length > 0 && this.hasValue) {
      this.itemsList.mapSelectedItems();
    }
    if (this.isOpen && isDefined(this.filterValue) && !this._isTypeahead) {
      this.itemsList.filter(this.filterValue);
    }
    if (this._isTypeahead || this.isOpen) {
      this.itemsList.markSelectedOrDefault(this.markFirst);
    }
  }

  private _setItemsFromNgOptions() {
    const handleNgOptions = (options: QueryList<NgOptionComponent>) => {
      this.items = options.map((option) => ({
        $ngOptionValue: option.value,
        $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
        disabled: option.disabled,
      }));
      this.itemsList.setItems(this.items);
      if (this.hasValue) {
        this.itemsList.mapSelectedItems();
      }
      this.detectChanges();
    };

    const handleOptionChange = () => {
        const changedOrDestroyed = merge(this.ngOptions.changes, this._destroy$);
        merge(...this.ngOptions.map((option) => option.stateChange$))
          .pipe(takeUntil(changedOrDestroyed))
          .subscribe((option) => {
            const item = this.itemsList.findItem(option.value);
            if (item) {
              item.disabled = option.disabled;
              this._cd.markForCheck();
            }
          });
      };
      

    this.ngOptions.changes
      .pipe(
        startWith(this.ngOptions),
        takeUntil(this._destroy$),
        filter((items: QueryList<any>) => !!items.length)
      )
      .subscribe((options) => {
        this.bindLabel = this._defaultLabel;
        handleNgOptions(options);
        handleOptionChange();
      });
  }

  private _isValidWriteValue(value: any): boolean {
    if (
      !isDefined(value) ||
      (this.multiple && value === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return false;
    }

    const validateBinding = (item: any): boolean => {
      if (!isDefined(this.compareWith) && isObject(item) && this.bindValue) {
        this._console.warn(
          `Binding object(${JSON.stringify(
            item
          )}) with bindValue is not allowed.`
        );
        return false;
      }
      return true;
    };

    if (this.multiple) {
      if (!Array.isArray(value)) {
        this._console.warn('Multiple select ngModel should be array.');
        return false;
      }
      return value.every((item) => validateBinding(item));
    } else {
      return validateBinding(value);
    }
  }

  private _handleWriteValue(ngModel: any | any[]) {
    if (!this._isValidWriteValue(ngModel)) {
      return;
    }

    const select = (val: any) => {
      let item = this.itemsList.findItem(val);
      if (item) {
        this.itemsList.select(item);
      } else {
        const isValObject = isObject(val);
        const isPrimitive = !isValObject && !this.bindValue;
        if (isValObject || isPrimitive) {
          this.itemsList.select(this.itemsList.mapItem(val, 0));
        } else if (this.bindValue) {
          item = {
            [this.bindLabel]: null,
            [this.bindValue]: val,
          };
          this.itemsList.select(this.itemsList.mapItem(item, 0));
        }
      }
    };

    if (this.multiple) {
      (<any[]>ngModel).forEach((item) => select(item));
    } else {
      select(ngModel);
    }
  }

  private _handleKeyPresses() {
    if (this.searchable) {
      return;
    }

    this._keyPress$
      .pipe(
        takeUntil(this._destroy$),
        tap((letter) => this._pressedKeys.push(letter)),
        debounceTime(200),
        filter(() => this._pressedKeys.length > 0),
        map(() => this._pressedKeys.join(''))
      )
      .subscribe((term) => {
        const item = this.itemsList.findByLabel(term);
        if (item) {
          if (this.isOpen) {
            this.itemsList.markItem(item);
            this._cd.markForCheck();
          } else {
            this.select(item);
          }
        }
        this._pressedKeys = [];
      });
  }

  private _updateNgModel() {
    const model = [];
    for (const item of this.selectedItems) {
      if (this.bindValue) {
        let resolvedValue = null;
        if (item.children && typeof item.value === 'object') {
          resolvedValue = (item.value as any)[<string>this.groupBy];
        } else {
          resolvedValue = this.itemsList.resolveNested(
            item.value,
            this.bindValue
          );
        }
        model.push(resolvedValue);
      } else {
        model.push(item.value);
      }
    }

    const selected = this.selectedItems.map((x) => x.value);
    if (this.multiple) {
      this._onChange(model);
      this.changeEvent.emit(selected);
    } else {
      this._onChange(isDefined(model[0]) ? model[0] : null);
      this.changeEvent.emit(selected[0]);
    }

    this._cd.markForCheck();
  }

  private _clearSearch() {
    if (!this.filterValue) {
      // this.itemsList.resetFilteredItems();
      return;
    }
    // Custome clearSearch
    this.filterValue = this.filterValue.toLocaleUpperCase();
    const singleValue = this.itemsList._items.filter(
        (task) => task.label && task.label.toLocaleUpperCase() === this.filterValue
    );
    
    if (singleValue.length === 1) {
      if (this.itemsList.markedItem) {
        this.toggleItem(this.itemsList.markedItem);
        this._handleTabAfterSelect();
      } else if (this.showAddTag) {
        this.selectTag();
      } else {
        this.close();
      }
    }
    if (this.selectedValues.length > 0) {
      this.filterValue = "";
    }
    this.itemsList.resetFilteredItems();
  }

  private _scrollToMarked() {
    if (!this.isOpen || !this.dropdownPanel) {
      return;
    }
    this.dropdownPanel.scrollInto(this.itemsList.markedItem);
  }

  private _scrollToTag() {
    if (!this.isOpen || !this.dropdownPanel) {
      return;
    }
    this.dropdownPanel.scrollIntoTag();
  }

  private _handleTab($event: KeyboardEvent) {
    if (!this.isOpen) {
      return;
    }
    if (this.selectOnTab) {
      if (this.itemsList.markedItem) {
        this._handleTabAfterSelect();
        if (this.isOpen) {
          this.close();
        }
      } else if (this.showAddTag) {
        this.selectTag();
        $event.preventDefault();
      } else {
        this.close();
      }
    } else {
      this.close();
    }
  }

  private _handleTabAfterSelect() {
    if (!this.isOpen) {
      return;
    }
  }

  private _handleEnter($event: KeyboardEvent) {
    if (this.isOpen || this._manualOpen) {
      if (this.itemsList.markedItem) {
        this.toggleItem(this.itemsList.markedItem);
      } else if (this.showAddTag) {
        this.selectTag();
      }
    } else if (this.openOnEnter) {
      this.open();
    } else {
      return;
    }

    $event.preventDefault();
    $event.stopPropagation();
  }

  private _handleSpace($event: KeyboardEvent) {
    if (this.isOpen || this._manualOpen) {
      return;
    }
    this.open();
    $event.preventDefault();
  }

  private _handleArrowDown($event: KeyboardEvent) {
    if (this._nextItemIsTag(+1)) {
      this.itemsList.unmarkItem();
      this._scrollToTag();
    } else {
      this.itemsList.markNextItem();
      this._scrollToMarked();
    }
    this.open();
    $event.preventDefault();
  }

  private _handleArrowUp($event: KeyboardEvent) {
    if (!this.isOpen) {
      return;
    }

    if (this._nextItemIsTag(-1)) {
      this.itemsList.unmarkItem();
      this._scrollToTag();
    } else {
      this.itemsList.markPreviousItem();
      this._scrollToMarked();
    }
    $event.preventDefault();
  }

  private _nextItemIsTag(nextStep: number): boolean {
    const nextIndex = this.itemsList.markedIndex + nextStep;
    return (
        typeof this.addTag === 'boolean' &&
        typeof this.filterValue === 'boolean' &&
        this.itemsList.markedItem &&
        (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length)
    );
}


  private _handleBackspace() {
    if (
      this.filterValue ||
      !this.clearable ||
      !this.clearOnBackspace ||
      !this.hasValue
    ) {
      return;
    }

    if (this.multiple) {
      this.unselect(this.itemsList.lastSelectedItem);
    } else {
      this.clearModel();
    }
  }

  private get _isTypeahead() {
    return this.typeahead && this.typeahead.observers.length > 0;
  }

  private _mergeGlobalConfig(config: NgSelectConfig) {
    this.placeholder = this.placeholder || config.placeholder;
    this.notFoundText = this.notFoundText || config.notFoundText;
    this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
    this.addTagText = this.addTagText || config.addTagText;
    this.loadingText = this.loadingText || config.loadingText;
    this.clearAllText = this.clearAllText || config.clearAllText;
    this.virtualScroll = isDefined(this.virtualScroll)
      ? this.virtualScroll
      : isDefined(config.disableVirtualScroll)
      ? !config.disableVirtualScroll
      : false;
    this.openOnEnter = isDefined(this.openOnEnter)
      ? this.openOnEnter
      : config.openOnEnter;
  }
}
