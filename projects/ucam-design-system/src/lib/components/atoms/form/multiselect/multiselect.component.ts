import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from "@angular/common";
import { Component, forwardRef, ChangeDetectionStrategy, input, signal, computed, effect, ChangeDetectorRef } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from "@angular/forms";
import { UcamOption } from "../../../../ucam-design-system.model";

@Component({
    selector: 'ucam-multiselect',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        OverlayModule
    ],
    templateUrl: './multiselect.component.html',
    styleUrl: './multiselect.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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

  id = input<string>((Math.random() + 1).toString(36).substring(7));
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

  type = input<'select' | 'multiselect'>('select');

  __selecione = new UcamOption({ label: "Selecione", valid: false });

  __innervalue = signal<UcamOption[]>([]);
  __disabled = false;

  __currentIndex = -1;
  __dropdownOpen = signal<boolean>(false);
  
  searchTerm = signal('');

  __filteredValues = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const opts = this.options() || [];
    if (!term) return opts;
    return opts.filter(option => option.label?.toLowerCase().includes(term));
  });

  __control!: AbstractControl;

  __form = new FormGroup({
    search: new FormControl('')
  })

  constructor(private cdr: ChangeDetectorRef) {
    this.__form.controls.search.valueChanges.subscribe((value: string | null) => {
      this.searchTerm.set(value || '');
    });
  }

  __label = computed(() => {
    const selection = this.__innervalue();
    const selectionLenth = selection.length;
    const opts = this.options() || [];

    if (selectionLenth > 0 && selectionLenth <= 2) {
      return selection.map(value => value.label).join(', ');
    } else if (selectionLenth > 2 && selectionLenth < opts.length) {
      return `${ selectionLenth } itens selecionados`;
    } else if (selectionLenth > 0 && selectionLenth === opts.length) {
      return 'Todos itens selecionados';
    }

    return this.placeholder();
  });

  get __open() {
    return this.__dropdownOpen();
  }

  __toggleOpen(evt?: Event) {
    if (evt) evt.stopPropagation();
    if (this.__disabled) return;
    if (this.__dropdownOpen()) {
      this.__setClose();
    } else {
      this.searchTerm.set(this.__form.controls.search.value || '');
      this.__dropdownOpen.set(true);
    }
  }

  __setClose() {
    this.__form.controls.search.setValue('');
    this.__dropdownOpen.set(false);
  }

  __isActive(option: UcamOption) {
    return this.__innervalue().filter(value => value.id === option.id || value == option.id).length > 0;
  }

  __selectOption(value: UcamOption) {
    const current = [...this.__innervalue()];
    const isMultiselect = this.type() === 'multiselect';
    
    if (isMultiselect) {
      if (this.__isActive(value)) {
        current.splice(current.findIndex(v => v.id === value.id), 1);
      } else {
        current.push(value);
      }
      this.__innervalue.set(current);
    } else {
      this.__innervalue.set([value]);
      this.__setClose();
    }
    this.onTouch();
    this.onChange(isMultiselect ? this.__innervalue().map(op => op.id || op.value) : this.__innervalue()[0].id || this.__innervalue()[0].value);
  }

  __filterInputValue() {
    this.searchTerm.set(this.__form.controls.search.value || '');
  }

  __isAllActive() {
    const selectionLenth = this.__innervalue().length;
    const filteredLenth = this.__filteredValues().length;
    const optsLength = this.options().length;
    return selectionLenth > 0 && (selectionLenth === filteredLenth || selectionLenth === optsLength);
  }

  __isSomeActive() {
    const selectionLenth = this.__innervalue().length;
    return selectionLenth > 0 && selectionLenth < this.__filteredValues().length;
  }

  __toggleAll() {
    let opts: any[];
    const current = this.__innervalue();
    if (this.__isAllActive()) {
      opts = [];
    } else {
      const notSelected = (this.__filteredValues() || this.options()).filter(option => !this.__isActive(option));
      opts = [...current.filter(value => value.id), ...notSelected];
    }
    this.__innervalue.set(opts);
    this.onTouch();
    this.onChange(this.type() === 'multiselect' ? this.__innervalue().map(op => op.id || op.value) : this.__innervalue()[0].id || this.__innervalue()[0].value);
  }

  onChange = (_: any) => { this.onTouch(); }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  writeValue(obj: any): void {
    const current = [...this.__innervalue()];
    try {
      if (obj instanceof UcamOption) {
        current.push(obj);
      } else {
        current.push(...this.options().filter(option => option.value === obj || option.id === obj));
      }
      this.__innervalue.set(current);
      this.onTouch();
    } catch {
      if (this.type() == 'select') {
        current.push(this.__selecione);
        this.__innervalue.set(current);
      }
    }
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

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.__control !== control) {
       this.__control = control;
    }
    this.cdr.markForCheck();
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

}
