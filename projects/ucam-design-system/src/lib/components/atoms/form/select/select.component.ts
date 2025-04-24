import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostBinding, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { UcamOption } from '../../../../ucam-design-system.model';

@Component({
  selector: 'ucam-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
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

  @Input() id: string = (Math.random() + 1).toString(36).substring(7);
  @Input() label?: string;
  @Input() class: string = "";
  @Input() optional = true;
  @Input() search = false;
  @Input() placeholder = "Selecione";

  @Input() label_class?: string;
  @Input() wrapper_class?: string;

  @Input() options: UcamOption[] = [];

  @Input() icon?: string;
  @Input() icon_type = "fa-regular";
  @Input() icon_class?: string;

  private __selecione = new UcamOption({ label: "Selecione", valid: false })

  __innervalue: UcamOption = this.__selecione;
  __disabled = false;

  __currentIndex = -1;
  __dropdownOpen = false;
  __filteredValues: UcamOption[] = [];
  __control!: AbstractControl;

  __view?: any;
  __is_open = false;

  @HostBinding('class')
  __hostClass = '';

  constructor(
    private elem: ElementRef,
    private vcr: ViewContainerRef
  ) { }

  get value(): any {
    return this.__innervalue?.value || this.__innervalue;
  }

  get selectLabel() {
    return this.__innervalue ? this.__innervalue.label : null;
  }

  get dropdownElement(): Element {
    return this.elem.nativeElement.querySelector('.select-menu');
  }

  get inputElement(): HTMLElement {
    return this.elem.nativeElement.querySelector('.select-ucam-class');
  }

  set value(value: any) {
    if (value !== undefined && this.__innervalue !== value) {
      this.__innervalue = value
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
        this.__innervalue = this.options.filter(option => option.value === value || option.id === value)[0];
      }
      this.onTouch();
      this.onChange(this.__innervalue.value);
    } catch {
      this.__innervalue = this.__selecione;
    }
    this.setHostClass();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.__disabled = isDisabled;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.__control = control;
    return (control.value && control.value.valid) || !this.__disabled ? null : { invalid: true };
  }

  setHostClass() {
    this.__hostClass = this.__control?.invalid ? 'invalid' : '';
  }

  ngOnInit() { }

  handleKeyboardEvents($event: KeyboardEvent) {
    if (this.__dropdownOpen) {
      $event.preventDefault();
    } else {
      return;
    }

    switch ($event.code) {
      case 'ArrowUp':
        this.__currentIndex < 0 ? this.__currentIndex = 0 : this.__currentIndex--;
        this.elem.nativeElement.querySelectorAll('li').item(this.__currentIndex).focus();
        break;

      case 'ArrowDown':
        this.__currentIndex < this.options.length - 1 ? this.__currentIndex++ : this.__currentIndex = this.options.length - 1;
        this.elem.nativeElement.querySelectorAll('li').item(this.__currentIndex).focus();
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
    this.dropdownElement ? this.dropdownElement.remove() : null;

    this.__is_open = false;

    this.__dropdownOpen = false;
  }

  selectByIndex(i: number) {
    let value = this.options[i];
    this.selectOption(value);
  }

  selectOption(value: UcamOption) {
    this.onTouch();
    this.onChange(value.value);
    this.__innervalue = value;
    this.closeDropdown();
  }

  toggle(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    this.dropdownElement ? this.closeDropdown() : this.open(dropdownTpl, origin);
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    this.__view = this.vcr.createEmbeddedView(dropdownTpl);

    this.__filteredValues = this.options;

    this.dropdownElement ? this.dropdownElement.remove() : null;

    const element = this.__view.rootNodes[0];

    this.__is_open = true;

    if (!this.dropdownElement && origin.parentElement) {
      origin.parentElement.appendChild(element);
    }

  }

  isActive(option: UcamOption) {
    return this.__innervalue.id == option.id;
  }

  onSearch() {
    this.__filteredValues = this.options.filter(option => option?.label?.includes(this.__innervalue.value), this.options);
  }

  calculateContainerHeight(): string {
    return `${this._calculateContainerHeight()}px`;
  }

  calculateContainerWidth(): string {
    return `${this.elem.nativeElement.offsetWidth}px`;
  }

  calculateContainerTop(): string {
    const bottom = this.inputElement.getBoundingClientRect().bottom;
    const height = 48;
    const outerHeight = this._calculateContainerHeight();
    const winPart = (window.innerHeight / 4);

    if ( bottom > (3 * winPart)){
      return `${bottom - height - outerHeight}px`
    }
    return `${bottom}px`;
  }

  private _calculateContainerHeight(): number {
    const numberOfItems = this.options.length;
    const itemHeight = 40;
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
