import { Directive, Input, OnInit } from '@angular/core';
import { UcamInputComponent } from '../../../public-api';
import { unmaskValue, valueToFormat } from './mask';

@Directive({
  selector: '[mask]',
})
export class MaskDirective implements OnInit {

  @Input() mask!: string;

  private _lastMaskedValue = '';

  constructor(
    private control: UcamInputComponent
  ) { }

  ngOnInit() {
    if (!this.control || !this.control) {
      return;
    }

    const originalWriteVal = this.control.writeValue.bind(this.control);
    this.control.writeValue = (val: any) => {
      originalWriteVal(this._maskValue(val));
    };

    const originalChange = (<any>this.control)['onChange'].bind(this.control);
    this.control.registerOnChange((val: any) => {
      originalChange(this._unmaskValue(val));
      this.control.value = this._maskValue(val);
      this.control.input.nativeElement.value = this._maskValue(val);
    });

    this._setVal(this._maskValue(this.control.value));
  }

  private _maskValue(val: string): string {
    if (!this.mask || val === this._lastMaskedValue) {
      return val;
    }

    try {
      const maskedVal = this._lastMaskedValue =
        valueToFormat(
          val,
          this.mask, this._lastMaskedValue.length > val.length,
          this._lastMaskedValue);

      return maskedVal;
    } catch (error) {
      return val;
    }
  }

  private _unmaskValue(val: string): string {
    const maskedVal = this._maskValue(val);
    const unmaskedVal = unmaskValue(maskedVal);

    if (maskedVal !== val) {
      this._setVal(maskedVal);
    }

    return maskedVal ? unmaskedVal : '';
  }

  private _setVal(val: string) {
    if (this.control) {
      this.control.value = val;
    }
  }

}