import { ScrollingModule } from '@angular/cdk/scrolling';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, ElementRef, forwardRef, HostBinding, OnInit, TemplateRef, ViewContainerRef, ChangeDetectionStrategy, input, signal, computed, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { UcamOption } from '../../../../ucam-design-system.model';

@Component({
    selector: 'ucam-select',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule,
        OverlayModule
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UcamSelectComponent)
        },
        {
            multi: true,
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => UcamSelectComponent),
        }
    ]
})
export class UcamSelectComponent implements OnInit, Validator, ControlValueAccessor {

  id = input<string>((Math.random() + 1).toString(36).substring(7));
  label = input<string>();
  className = input<string>("", { alias: 'class' });
  optional = input<boolean>(true);
  search = input<boolean>(false);
  placeholder = input<string>("Selecione");

  label_class = input<string>();
  wrapper_class = input<string>();

  options = input<UcamOption[]>([]);

  icon = input<string>();
  icon_type = input<string>("fa-regular");
  icon_class = input<string>();

  private __selecione = new UcamOption({ label: "Selecione", valid: false })

  __innervalue: UcamOption = this.__selecione;
  __disabled = false;

  __currentIndex = -1;
  __dropdownOpen = false;
  __is_open = false;
  
  searchTerm = signal('');

  __filteredValues = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const opts = this.options() || [];
    if (!term) return opts;
    return opts.filter(option => option?.label?.toLowerCase().includes(term));
  });

  __control!: AbstractControl;
  __view?: any;

  @HostBinding('class')
  __hostClass = '';
  
  @ViewChild('select', { static: false }) selectRef!: ElementRef<HTMLInputElement>;

  constructor(
    private elem: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  get value(): any {
    return this.__innervalue?.value || this.__innervalue;
  }

  get selectLabel() {
    return this.__innervalue ? this.__innervalue.label : null;
  }

  get inputElement(): HTMLElement {
    return this.elem.nativeElement.querySelector('.select-ucam-class');
  }

  set value(value: any) {
    if (value !== undefined && this.__innervalue !== value) {
      this.__innervalue = value;
      this.onChange(value.value);
      this.onTouch();
    }
  }

  onChange = (_: any) => {
    this.onTouch();
  }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  writeValue(value: any): void {
    try {
      if (value instanceof UcamOption) {
        this.__innervalue = value;
      } else {
        const match = this.options().find(option => option.value === value || option.id === value);
        if (match) {
           this.__innervalue = match;
        } else {
           this.__innervalue = this.__selecione;
        }
      }
      this.onTouch();
      this.onChange(this.__innervalue.value);
    } catch {
      this.__innervalue = this.__selecione;
    }
    this.setHostClass();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.__disabled = isDisabled;
    this.cdr.markForCheck();
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.__control !== control) {
       this.__control = control;
    }
    this.cdr.markForCheck();
    return null;
  }

  setHostClass() {
    this.__hostClass = this.__control?.invalid ? 'invalid' : '';
    this.cdr.markForCheck();
  }

  ngOnInit() { }

  handleKeyboardEvents($event: KeyboardEvent) {
    if (this.__dropdownOpen) {
      $event.preventDefault();
    } else {
      return;
    }

    const opts = this.options();
    switch ($event.code) {
      case 'ArrowUp':
        this.__currentIndex < 0 ? this.__currentIndex = 0 : this.__currentIndex--;
        this.elem.nativeElement.querySelectorAll('.option').item(this.__currentIndex)?.scrollIntoView();
        break;

      case 'ArrowDown':
        this.__currentIndex < opts.length - 1 ? this.__currentIndex++ : this.__currentIndex = opts.length - 1;
        this.elem.nativeElement.querySelectorAll('.option').item(this.__currentIndex)?.scrollIntoView();
        break;

      case 'Enter':
      case 'NumpadEnter':
        this.selectByIndex(this.__currentIndex);
        break;

      case 'Escape':
        this.closeDropdown();
        break;

      default:
        break;
    }
  }

  closeDropdown() {
    this.__currentIndex = -1;
    this.__is_open = false;
    this.__dropdownOpen = false;
    this.cdr.markForCheck();
  }

  selectByIndex(i: number) {
    const opts = this.options();
    if (i >= 0 && i < opts.length) {
      let value = opts[i];
      this.selectOption(value);
    }
  }

  selectOption(value: UcamOption) {
    this.onTouch();
    this.onChange(value.value);
    this.__innervalue = value;
    if (this.selectRef?.nativeElement) {
      this.selectRef.nativeElement.value = value.label || '';
    }
    this.closeDropdown();
  }

  toggle() {
    this.__is_open ? this.closeDropdown() : this.open();
  }

  open() {
    this.searchTerm.set('');
    this.__is_open = true;
    this.__dropdownOpen = true;
    this.cdr.markForCheck();
  }

  isActive(option: UcamOption) {
    return this.__innervalue && option && this.__innervalue.id == option.id;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  calculateContainerHeight(): number {
    const numberOfItems = this.options().length;
    const itemHeight = 47;
    const visibleItems = 5;
    const marginHeight = 32;

    if (numberOfItems < 2) {
      return itemHeight + marginHeight;
    }

    if (numberOfItems <= visibleItems) {
      return (itemHeight * numberOfItems) + marginHeight;
    }

    return (itemHeight * visibleItems) + marginHeight;
  }

}
