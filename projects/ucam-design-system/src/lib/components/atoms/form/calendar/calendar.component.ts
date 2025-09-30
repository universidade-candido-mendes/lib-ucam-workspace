import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";

@Component({
  selector: 'ucam-calendar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent)
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CalendarComponent),
    }
  ]
})
export class CalendarComponent implements Validator, ControlValueAccessor {

  weekdays = [
    {  acronym: 'Dom', label: 'Domingo', letter: 'D' },
    {  acronym: 'Seg', label: 'Segunda', letter: 'S' },
    {  acronym: 'Ter', label: 'Terça',   letter: 'T' },
    {  acronym: 'Qua', label: 'Quarta',  letter: 'Q' },
    {  acronym: 'Qui', label: 'Quinta',  letter: 'Q' },
    {  acronym: 'Sex', label: 'Sexta',   letter: 'S' },
    {  acronym: 'Sab', label: 'Sábado',  letter: 'S' },
  ]

  months = [
    {  acronym: 'Jan', label: 'January' },
    {  acronym: 'Fev', label: 'Fevereiro' },
    {  acronym: 'Mar', label: 'Março' },
    {  acronym: 'Abr', label: 'Abril' },
    {  acronym: 'Mai', label: 'Maio' },
    {  acronym: 'Jun', label: 'Junho' },
    {  acronym: 'Jul', label: 'Julho' },
    {  acronym: 'Ago', label: 'Agosto' },
    {  acronym: 'Set', label: 'Setembro' },
    {  acronym: 'Out', label: 'Outubro' },
    {  acronym: 'Nov', label: 'Novembro' },
    {  acronym: 'Dez', label: 'Dezembro' },
  ]

  @Input()
  date = new Date(Date.now());

  @Input()
  format = 'dd/MM/yyyy';

  @Input()
  selected!: Date;

  @Output()
  selectedChange = new EventEmitter<Date>();

  open = false;

  __disabled = false;
  __control!: AbstractControl;

  day = this.date.getDate();
  month = this.date.getMonth();
  year = this.date.getFullYear();

  start = new Date(this.year, this.month, 1);
  end = new Date(this.year, this.month + 1, 0);

  length = this.end.getDate();

  today = new Date(Date.now());

  offset = {
    start: this.start.getDay(),
    end: 7 - this.end.getDay(),
  };

  before = new Date(this.year, this.month, 0).getDate();

  days!: Date[];
  calendar!: any[];

  view: String = 'MONTH';

  years = Array.from({length: 12}, (_, i) => i + 1 + (this.year - 6));

  ngOnInit(): void {
    this.update();
  }

  onInputChange: any = () => {
    this.writeValue(this.selected);
  };

  onChange = (_: any) => {
    this.onTouch();
  }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  writeValue(value: any): void {
    this.selected = value;
    this.onTouch();
    this.onChange(this.selected);
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

  hasError(errorType: string): boolean {
    return this.__control.value.invalid && this.__control.hasError(errorType);
  }

  minusYear(ammount = -1) {
    this.updateYear(ammount);
  }

  plusYear(ammount = 1) {
    this.updateYear(ammount);
  }

  minusMonth(ammount = -1) {
    this.updateMonth(ammount);
  }

  plusMonth(ammount = 1) {
    this.updateMonth(ammount);
  }

  dateEquals(day: Date, reference: Date) {
    if (!day || !reference) return false;

    return reference.getDate() === day.getDate() &&
           reference.getMonth() === day.getMonth() &&
           reference.getFullYear() === day.getFullYear();
  }

  private updateMonth(ammount: number) {
    this.date.setMonth(this.date.getMonth() + ammount);
    this.update();
  }

  private updateYear(ammount: number) {
    this.date.setFullYear(this.date.getFullYear() + ammount);
    this.update();
  }

  private update() {
    this.day = this.date.getDate();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();

    this.start = new Date(this.year, this.month, 1);
    this.end = new Date(this.year, this.month + 1, 0);

    length = this.end.getDate();

    this.offset = {
      start: this.start.getDay(),
      end: 7 - this.end.getDay(),
    };

    this.before = new Date(this.year, this.month, 0).getDate();

    const buildArray = (size: number) => Array(...Array(size));
    const monthSize = new Date(this.year, this.month + 1, 0).getDate();

    const monthOffsetStart = buildArray(this.offset.start).map((_, i) => new Date(this.year, this.month - 1, this.before - i) ).reverse();
    const monthDays = buildArray(monthSize).map((_, i) => new Date(this.year, this.month, i + 1) );
    const monthOffsetEnd = buildArray(this.offset.end - 1).map((_, i) => new Date(this.year, this.month + 1, i + 1) );

    this.days = [...monthOffsetStart, ...monthDays, ...monthOffsetEnd];

    this.calendar = [];

    this.splitDates();

    this.years = Array.from({length: 12}, (_, i) => i + 1 + (this.year - 6))
  }

  private splitDates() {
    for (let i = 0; i <= this.offset.start + this.days.length + this.offset.end; i += 7) {
      this.calendar.push(this.days.slice(i, i + 7));
    }
  }

  @Input()
  selectDay(day: Date) {
    this.selected = day;
    this.selectedChange.emit(day);
    this.onChange(day);
    this.onTouch();
    this.open = false;
  }

  @Input()
  selectMonth(month: any) {
    this.month = this.months.findIndex(v => v.acronym === month.acronym);
    this.date.setMonth(this.month);
    this.update();
    this.changeView('MONTH');
  }

  @Input()
  selectYear(year: any) {
    this.month = year;
    this.date.setFullYear(year);
    this.update();
    this.changeView('YEAR');
  }

  @Input()
  changeView(view: String) {
    this.view = view;
  }

}
