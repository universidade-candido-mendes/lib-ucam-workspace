import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() icon_type = "fa-regular";
  @Input() icon_class?: string;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  __innervalue: any = null;
  __disabled = false;

  onInputChange: any = () => {
    console.log(this.input, this.input.nativeElement.value);

    this.__innervalue = this.input.nativeElement.value;
  };

  constructor() { }

  get value(): any {
    return this.__innervalue;
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

}
