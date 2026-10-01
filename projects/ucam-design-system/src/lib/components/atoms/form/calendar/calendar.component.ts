import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from "@angular/common";
import { Component, forwardRef, ChangeDetectionStrategy, input, model, signal, computed, effect, ChangeDetectorRef } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";

@Component({
    selector: 'ucam-calendar',
    imports: [
        CommonModule,
        OverlayModule
    ],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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

  layers = {
    "year": { view: "PERIOD", format: 'YYYY' },
    "month": { view: "YEAR", format: 'MM/YYYY' },
    "date": { view: "MONTH", format: 'dd/MM/YYYY' }
  }

  date = input<Date>(new Date(Date.now()));
  format = input<string>();
  type = input<'year' | 'month' | 'date'>("date");
  
  selected = model<Date>();
  
  resolvedFormat = computed(() => {
    return this.format() || this.layers[this.type()].format;
  });

  open = signal<boolean>(false);

  __disabled = false;
  __control!: AbstractControl;

  currentViewDate = signal<Date>(new Date());
  view = signal<string>('MONTH');
  
  today = new Date(Date.now());
  
  calendarState = computed(() => {
    const cd = this.currentViewDate();
    const day = cd.getDate();
    const month = cd.getMonth();
    const year = cd.getFullYear();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const length = end.getDate();

    const offset = {
      start: start.getDay(),
      end: 7 - end.getDay(),
    };

    const before = new Date(year, month, 0).getDate();

    const buildArray = (size: number) => Array(...Array(size));
    const monthSize = new Date(year, month + 1, 0).getDate();

    const monthOffsetStart = buildArray(offset.start).map((_, i) => new Date(year, month - 1, before - i) ).reverse();
    const monthDays = buildArray(monthSize).map((_, i) => new Date(year, month, i + 1) );
    const monthOffsetEnd = buildArray(offset.end - 1).map((_, i) => new Date(year, month + 1, i + 1) );

    const days = [...monthOffsetStart, ...monthDays, ...monthOffsetEnd];

    const calendar = [];
    for (let i = 0; i <= offset.start + days.length + offset.end; i += 7) {
      if (days.slice(i, i + 7).length > 0) {
        calendar.push(days.slice(i, i + 7));
      }
    }

    const years = Array.from({length: 12}, (_, i) => i + 1 + (year - 6));
    
    return { day, month, year, calendar, years };
  });

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      this.currentViewDate.set(new Date(this.date().getTime()));
    }, { allowSignalWrites: true });
    
    effect(() => {
      this.view.set(this.layers[this.type()].view);
    }, { allowSignalWrites: true });
  }

  onInputChange: any = () => {
    this.writeValue(this.selected());
  };

  onChange = (_: any) => {
    this.onTouch();
  }

  onTouch = () => { }

  onValidationChange = (_: any) => { }

  writeValue(value: any): void {
    if (value) {
      this.selected.set(value);
      this.currentViewDate.set(new Date(value.getTime()));
    }
    this.onTouch();
    this.onChange(this.selected());
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

  hasError(errorType: string): boolean {
    return !!this.__control?.invalid && this.__control?.hasError(errorType);
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

  dateEquals(day: Date, reference: Date | undefined) {
    if (!day || !reference) return false;
    return reference.getDate() === day.getDate() &&
           reference.getMonth() === day.getMonth() &&
           reference.getFullYear() === day.getFullYear();
  }

  private updateMonth(ammount: number) {
    const next = new Date(this.currentViewDate().getTime());
    next.setMonth(next.getMonth() + ammount);
    this.currentViewDate.set(next);
  }

  private updateYear(ammount: number) {
    const next = new Date(this.currentViewDate().getTime());
    next.setFullYear(next.getFullYear() + ammount);
    this.currentViewDate.set(next);
  }

  selectDay(day: Date) {
    this.selected.set(day);
    this.onChange(day);
    this.onTouch();
    this.open.set(false);
  }

  selectMonth(month: any) {
    const m = this.months.findIndex(v => v.acronym === month.acronym);
    const next = new Date(this.currentViewDate().getTime());
    next.setMonth(m);
    this.currentViewDate.set(next);
    this.changeView('MONTH');
  }

  selectYear(year: any) {
    const next = new Date(this.currentViewDate().getTime());
    next.setFullYear(year);
    this.currentViewDate.set(next);
    this.changeView('YEAR');
  }

  changeView(view: string) {
    const type = this.type();
    const limit = Object.keys(this.layers).indexOf(type);
    const current = Object.values(this.layers).findIndex(v => v.view === view);

    this.view.set(view);

    if (current > limit) {
      const cd = this.currentViewDate();
      const s = new Date(cd.getFullYear(), cd.getMonth(), 1);
      this.selectDay(s);
      this.view.set(this.layers[type].view);
      this.open.set(false);
    }
  }
}
