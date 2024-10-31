import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'ucam-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  __originalvalue: any = null;
  __innervalue: any = null;
  __formattedvalue: any = null;
  __disabled = false;

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
    this.ngZone.run(() => {
      this.__innervalue = this.clearInput(value);
      this.applyMask();
    });
  };

  constructor(
    private ngZone: NgZone
  ) { }

  get value(): any {
    console.log(this.__formattedvalue, this.__innervalue);

    return this.__formattedvalue || this.__innervalue;
  }

  set value(value: any) {
    if (value !== undefined && this.__innervalue !== value) {
      this.__innervalue = value
      this.onChange(this.__innervalue);
      this.onTouch();
    }
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

  private applyMask(): void {
    if (!this.mask || !this.__innervalue) {
      this.__formattedvalue = this.__innervalue;
      return;
    }

    this.formatRegExpMask();
  }

  private formatRegExpMask(): void {
    if (this.mask) {
      let idx = 0;
      const formatted = this.mask.split('').map((value) => {
        if (value in this.__specialChars) {
          const rgx = new RegExp(this.__specialChars[value]);
          let val = rgx.test(this.__innervalue[idx]) ? this.__innervalue[idx] : this.maskChar;
          idx++;
          return val;
        }
        return value;
      });

      this.__formattedvalue = formatted.join('').substring(0, this.__innervalue.length);
    }
  }

  private clearInput(v: string) {
    if (this.mask) {
      const formatted = this.mask.split('').map((value, idx) => {
        if (value in this.__specialChars) {
          const rgx = new RegExp(this.__specialChars[value]);
          let val = rgx.test(v[idx]) ? v[idx] : this.maskChar;
          return val;
        }
        return '';
      });

      return formatted.join('').substring(0, v.length);
    }
    return v;
  }

}
