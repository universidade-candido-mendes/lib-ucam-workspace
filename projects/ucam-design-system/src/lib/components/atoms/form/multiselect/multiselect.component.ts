import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input, ChangeDetectionStrategy } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from "@angular/forms";
import { UcamOption } from "../../../../ucam-design-system.model";


/**
 * @description This is a ucam multiselect component.
 * @selector ucam-multiselect
 * @templateUrl ./multiselect.component.html
 * @styleUrls ./multiselect.component.scss
 */
@Component({
    selector: 'ucam-multiselect',
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './multiselect.component.html',
    styleUrl: './multiselect.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectComponent)
        },
        {
            multi: true,
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => MultiSelectComponent),
        }
    ]
})
export class MultiSelectComponent implements Validator, ControlValueAccessor {

  /**
   * @description Input property for a message.
   * @type {string}
   */
  @Input() id: string = (Math.random() + 1).toString(36).substring(7);
  @Input() class: string = "";
  @Input() optional = true;
  @Input() search = false;
  @Input() placeholder = "Selecione";

  @Input() label_class?: string;
  @Input() wrapper_class?: string;

  /**
   * @description Input property for a message.
   * @type {string}
   */
  @Input() options: UcamOption[] = [];

  @Input() icon?: string;
  @Input() icon_type = "fa-regular";
  @Input() icon_class?: string;

  @Input() type: 'select' | 'multiselect' = 'select';

  __selecione = new UcamOption({ label: "Selecione", valid: false });

  __innervalue: UcamOption[] = [];
  __disabled = false;

  __currentIndex = -1;
  __dropdownOpen = false;
  __filteredValues: UcamOption[] = [];
  __control!: AbstractControl;

  __form = new FormGroup({
    search: new FormControl('')
  })

  constructor() {
    this.__form.controls.search.valueChanges.subscribe((value: string | null) => {
      if (value) {
        this.__filterValues(value);
      }
    });
  }

  get __label() {
    const selectionLenth = this.__innervalue.length;

    if (selectionLenth > 0 && selectionLenth <= 2) {
      return this.__innervalue.map(value => value.label).join(', ');
    } else if (selectionLenth > 2 && selectionLenth < this.options.length) {
      return `${ this.__innervalue.length } itens selecionados`;
    } else if (selectionLenth > 0 && selectionLenth === this.options?.length) {
      return 'Todos itens selecionados';
    }

    return this.placeholder;
  }

  get __open() {
    return this.__dropdownOpen;
  }

  __setOpen(evt: Event) {
    evt.stopPropagation();
    if (this.__disabled) return;
    this.__filterValues(this.__form.controls.search.value || '');
    this.__dropdownOpen = true;
  }

  __setClose() {
    this.__form.controls.search.setValue('');
    this.__dropdownOpen = false;
  }

  __isActive(option: UcamOption) {
    return this.__innervalue.filter(value => value.id === option.id || value == option.id).length > 0;
  }

  __selectOption(value: UcamOption) {
    if (this.type === 'multiselect') {
      this.__isActive(value) ? this.__innervalue.splice(this.__innervalue.indexOf(value), 1) : this.__innervalue.push(value);
    } else {
      this.__innervalue = [value];
      this.__setClose();
    }
    this.onTouch();
    this.onChange(this.type === 'multiselect' ? this.__innervalue.map(op => op.id || op.value) : this.__innervalue[0].id || this.__innervalue[0].value);
  }

  __filterValues(value: string) {
    if (value != '') {
      this.__filteredValues = this.options.filter(option => option.label?.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.__filteredValues = this.options;
    }
  }

  __filterInputValue() {
    this.__filterValues(this.__form.controls.search.value || '');
  }

  __isAllActive() {
    const selectionLenth = this.__innervalue.length;
    return selectionLenth > 0 && (selectionLenth === this.__filteredValues.length || selectionLenth === this.options.length);
  }

  __isSomeActive() {
    return this.__innervalue.length > 0 && this.__innervalue.length < this.__filteredValues.length;
  }

  __toggleAll() {
    let opts: any[];
    if (this.__isAllActive()) {
      opts = [];
    } else {
      const notSelected = (this.__filteredValues || this.options).filter(option => !this.__isActive(option));
      opts = [...this.__innervalue.filter(value => value.id), ...notSelected];
    }
    this.__innervalue = opts;
    this.onTouch();
    this.onChange(this.type === 'multiselect' ? this.__innervalue.map(op => op.id || op.value) : this.__innervalue[0].id || this.__innervalue[0].value);
  }

  // Utility Functions
  onChange = (_: any) => { this.onTouch(); }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  //  Controll Access Value
  writeValue(obj: any): void {
    try {
      if (obj instanceof UcamOption) {
        this.__innervalue.push(obj);
      } else {
        this.__innervalue.push(...this.options.filter(option => option.value === obj || option.id === obj));
      }
      this.onTouch();
      this.onChange(this.type === 'multiselect' ? this.__innervalue.map(op => op.id || op.value) : this.__innervalue[0].id || this.__innervalue[0].value);
    } catch {
      if (this.type ==  'select') {
        this.__innervalue.push(this.__selecione);
      }
    }
    // this.__setHostClass();
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

  // Validator
  validate(control: AbstractControl): ValidationErrors | null {
    this.__control = control;
    return (control.value && control.value.valid) || !this.__disabled ? null : { invalid: true };
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

}
