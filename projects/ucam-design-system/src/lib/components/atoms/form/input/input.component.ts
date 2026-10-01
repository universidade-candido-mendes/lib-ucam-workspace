import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, ElementRef, EmbeddedViewRef, forwardRef, HostBinding, OnInit, TemplateRef, ViewChild, ViewContainerRef, ChangeDetectionStrategy, input, effect, computed, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { UcamOption } from '../../../../../public-api';
import { unmaskValue, valueToFormat } from '../../../../directives/form/mask';

@Component({
    selector: 'ucam-input',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule
    ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
export class UcamInputComponent implements OnInit, Validator, ControlValueAccessor {

  id = input<string>((Math.random() + 1).toString(36).substring(7));
  label = input<string>();
  className = input<string>("", { alias: 'class' });
  optional = input<boolean>(true);
  placeholder = input<string>("Selecione");

  label_class = input<string>();
  wrapper_class = input<string>();

  icon = input<string>();
  icon_type = input<string>("");
  icon_class = input<string>();

  mask = input<string>();

  datalist = input<UcamOption[]>([]);

  @ViewChild('dropdown', { static: true }) dropdown!: TemplateRef<any>;
  @ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  __innervalue: any = null;
  __disabled = false;
  __view!: EmbeddedViewRef<any>;
  __control!: AbstractControl;

  @HostBinding('class')
  __hostClass = '';

  constructor(
    private elem: ElementRef,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {
    this.closeDropdown();
    
    // Watch for datalist changes and open dropdown if needed
    effect(() => {
      const list = this.datalist();
      if (list && list.length > 0) {
        this.open(this.dropdown, this.inputRef.nativeElement);
      } else {
        this.closeDropdown();
      }
    });
  }

  onInputChange: any = () => {
    let rawValue = this.inputRef.nativeElement.value;
    
    // Apply mask logic on input
    const maskFormat = this.mask();
    if (maskFormat) {
       const unmasked = unmaskValue(rawValue);
       const masked = valueToFormat(unmasked, maskFormat, false, this.__innervalue || '');
       this.inputRef.nativeElement.value = masked;
       this.__innervalue = masked;
       this.onChange(unmasked);
    } else {
       this.__innervalue = rawValue;
       this.onChange(rawValue);
    }
    
    this.setHostClass();
  };

  get dropdownElement(): Element {
    return this.elem.nativeElement.querySelector('.select-menu');
  }

  onChange = (_: any) => {
    this.onTouch();
  }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  writeValue(value: any): void {
    const maskFormat = this.mask();
    if (maskFormat && value) {
      this.__innervalue = valueToFormat(value.toString(), maskFormat, false, '');
    } else {
      this.__innervalue = value;
    }
    
    if (this.inputRef?.nativeElement) {
       this.inputRef.nativeElement.value = this.__innervalue || '';
    }
    
    this.onTouch();
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

  hasError(errorType: string): boolean {
    return !!this.__control?.invalid && this.__control?.hasError(errorType);
  }

  closeDropdown() {
    this.dropdownElement ? this.dropdownElement.remove() : null;
  }

  selectByIndex(i: number) {
    const list = this.datalist();
    if (list && list.length > i) {
      let value = list[i];
      this.selectOption(value);
    }
  }

  selectOption(value: UcamOption) {
    this.onTouch();
    this.onChange(value.value);
    this.__innervalue = value;
    if (this.inputRef?.nativeElement) {
      this.inputRef.nativeElement.value = value.label || value.value || '';
    }
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
    return this.__innervalue && option && this.__innervalue.id == option.id;
  }

  calculateContainerHeight(): string {
    return `${this._calculateContainerHeight()}px`;
  }

  calculateContainerWidth(): string {
    return `${this.elem.nativeElement.offsetWidth}px`;
  }

  calculateContainerTop(): string {
    const bottom = this.inputRef?.nativeElement?.getBoundingClientRect().bottom || 0;
    const height = 48;
    const outerHeight = this._calculateContainerHeight();
    const winPart = (window.innerHeight / 4);

    if ( bottom > (3 * winPart)){
      return `${bottom - height - outerHeight}px`
    }
    return `${bottom}px`;
  }

  private _calculateContainerHeight(): number {
    const list = this.datalist();
    const numberOfItems = list?.length || 0;
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
