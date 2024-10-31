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

  @Input() mask?: string | RegExp;
  @Input() maskChar: string = '_';

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  __innervalue: any = null;
  __formattedvalue: any = null;
  __disabled = false;

  onInputChange: any = () => {
    const value = this.input.nativeElement.value;
    this.ngZone.run(() => {
      this.__innervalue = value;
      this.applyMask();
    });
  };

  constructor(
    private ngZone: NgZone
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

    if (typeof this.mask === 'string') {
      this.convertToStringRegex(this.mask);
      this.formatRegExpMask();
    } else if (this.mask instanceof RegExp) {
      this.formatRegExpMask();
    }

    console.log(this.__formattedvalue);

  }

  private convertToStringRegex(pattern: string): RegExp {
    const specialChars: { [key: string]: string } = {
      '0': '[0-9]',
      '9': '[0-9]?',
      'A': '[A-Z]',
      'S': '[a-zA-Z]',
      'U': '[A-Z]',
      'L': '[a-z]'
    };

    // Replace special characters with regex equivalents
    let regexPattern = pattern.replace(/[0-9ASUL*]/g, match => specialChars[match] || match);

    // Add start and end anchors if not present
    if (!regexPattern.startsWith('^') && !regexPattern.endsWith('$')) {
      regexPattern = '^' + regexPattern + '$';
    }

    // Create and return the RegExp object
    return new RegExp(regexPattern);
  }

  private formatRegExpMask(): void {
    if (this.mask) {
      const regex = this.mask;
      const formatted = this.__innervalue.replace(regex, () => this.maskChar);
      this.__formattedvalue = formatted;
    }
  }

}
