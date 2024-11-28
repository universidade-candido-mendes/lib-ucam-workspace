import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EmbeddedViewRef, forwardRef, Input, NgZone, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { UcamOption } from '../../../public-api';

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
  @Input() maskChar: string = '';

  @Input() datalist!: UcamOption[];

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  __innervalue: any = null;
  __originalvalue: any = null;
  __formattedvalue: any = null;
  __disabled = false;
  __view!: EmbeddedViewRef<any>;

  __specialChars: { [key: string]: string } = {
    '0': '[0-9]',
    '9': '[0-9]?',
    'A': '[A-Z]',
    'S': '[a-zA-Z]',
    'U': '[A-Z]',
    'L': '[a-z]',
  };

  onInputChange: any = () => {
    const value = this.input.nativeElement.value;
    this.__originalvalue = value;
    this.ngZone.run(() => {
      this.__innervalue = this.clearInput(value);
      this.applyMask();
      this.writeValue(this.__formattedvalue || this.__innervalue);
    });
  };

  constructor(
    private ngZone: NgZone,
    private elem: ElementRef,
    private vcr: ViewContainerRef
  ) { }

  get value(): any {
    return this.__formattedvalue || this.__innervalue;
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
    return this.elem.nativeElement.querySelector('.input-ucam');
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
      this.onChange(this.__innervalue);
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
    this.__formattedvalue = value.label;
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
    const numberOfItems = this.datalist.length;
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

  private applyMask(): void {
    if (!this.mask || !this.__innervalue) {
      this.__formattedvalue = this.__innervalue;
      return;
    }

    this.formatRegExpMask();
  }

  private formatRegExpMask(): void {
    if (this.mask) {
      const formatted: any[] = [];
      const maskArray = this.mask.substring(0, this.__innervalue.length).split('');

      let valueIdx = 0
      for (let idx = 0; idx < maskArray.length; idx++) {
        let val = '';
        const value = this.mask[idx];
        if (!Object.keys(this.__specialChars).includes(value)) {
          formatted.push(this.mask?.split('')[idx]);
        } else {
          const rgx = new RegExp(this.__specialChars[value]);
          val = rgx.test(this.__innervalue[valueIdx]) ? this.__innervalue[valueIdx] : value;
          formatted.push(val);
          valueIdx++;
        }
      };

      this.__formattedvalue = formatted.join('').substring(0, Math.min(this.__innervalue.length, this.mask.length)+1);
    }
  }

  private clearInput(v: string) {

    if (this.mask) {
      let idx = 0;
      let val = '';
      const formatted = this.mask.split('').map((value) => {
        if (!(value in this.__specialChars)) {
          return;
        }
        val = v[idx];
        idx++;
        return val;
      });

      return formatted.join('').substring(0, Math.min(v.length, this.mask.length)+1);
    }
    return v;
  }

}
