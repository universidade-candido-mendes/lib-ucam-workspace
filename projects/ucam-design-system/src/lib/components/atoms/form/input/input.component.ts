import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EmbeddedViewRef, forwardRef, Input, NgZone, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { UcamOption } from '../../../../../public-api';

@Component({
  selector: 'ucam-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UcamInputComponent)
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UcamInputComponent),
    }
  ]
})
export class UcamInputComponent implements OnInit, Validator, ControlValueAccessor  {

  @Input() id: string = (Math.random() + 1).toString(36).substring(7);
  @Input() label?: string;
  @Input() class: string = "";
  @Input() optional = true;
  @Input() placeholder = "Selecione";

  @Input() label_class?: string;
  @Input() wrapper_class?: string;

  @Input() icon?: string;
  @Input() icon_type = "";
  @Input() icon_class?: string;

  @Input() mask?: string;

  @ViewChild('dropdown', { static: true }) dropdown!: TemplateRef<any>;

  @Input() set datalist(value: UcamOption[]) {
    this.open(this.dropdown, this.input.nativeElement);
    this.__datalist = value;
  }

  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;

  __innervalue: any = null;
  __disabled = false;
  __view!: EmbeddedViewRef<any>;
  __datalist: UcamOption[] = [];

  onInputChange: any = () => {
    const value = this.input.nativeElement.value || null;
    this.writeValue(value);
  };

  constructor(
    private ngZone: NgZone,
    private elem: ElementRef,
    private vcr: ViewContainerRef
  ) {
    this.closeDropdown();
  }

  get value(): any {
    return this.__innervalue;
  }

  set value(value: any) {
    if (value !== undefined && this.__innervalue !== value) {
      this.__innervalue = value
      this.onChange(this.__innervalue);
      this.onTouch();
    }
  }

  get dropdownElement(): Element {
    return this.elem.nativeElement.querySelector('.select-menu');
  }

  get inputElement(): HTMLElement {
    return this.input.nativeElement;
  }

  get datalist() {
    return this.__datalist;
  }

  onChange = (_: any) => {
    this.onTouch();
  }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  writeValue(value: any): void {
    if (value) {
      this.__innervalue = value;
      this.onTouch();
      this.onChange(this.__innervalue?.value || this.__innervalue);
    } else {
      this.__innervalue = null;
    }
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
    return (control.value && control.value.valid) || !this.__disabled ? null : { invalid: true };
  }

  ngOnInit() { }

  hasError(errorType: string): boolean {
    return this.__innervalue === '' && errorType === 'required';
  }

  closeDropdown() {
    this.dropdownElement ? this.dropdownElement.remove() : null;
  }

  selectByIndex(i: number) {
    let value = this.datalist[i];
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

    this.dropdownElement ? this.dropdownElement.remove() : null;

    const element = this.__view.rootNodes[0];

    if (!this.dropdownElement && origin.parentElement) {
      origin.parentElement.appendChild(element);
    }

  }

  isActive(option: UcamOption) {
    return this.__innervalue.id == option.id;
  }

  calculateContainerHeight(): string {
    return `${this._calculateContainerHeight()}px`;
  }

  calculateContainerWidth(): string {
    return `${this.elem.nativeElement.offsetWidth}px`;
  }

  calculateContainerTop(): string {
    const bottom = this.inputElement?.getBoundingClientRect().bottom || 0;
    const height = 48;
    const outerHeight = this._calculateContainerHeight();
    const winPart = (window.innerHeight / 4);

    if ( bottom > (3 * winPart)){
      return `${bottom - height - outerHeight}px`
    }
    return `${bottom}px`;
  }

  private _calculateContainerHeight(): number {
    const numberOfItems = this.datalist?.length || 0;
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
