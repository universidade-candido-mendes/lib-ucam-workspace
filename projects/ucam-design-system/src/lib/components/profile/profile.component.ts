import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UcamOption, UcamUserProfile } from '../../../public-api';

@Component({
  selector: 'ucam-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class UcamProfileComponent implements AfterContentInit {

  @Input()
  userprofile?: UcamUserProfile;

  profileMenuActive = false;
  selectedUnidade!: any;

  unidadesOption: UcamOption[] = [
    new UcamOption({
      id: null,
      label: 'Selecione',
    })
  ];

  form = new FormGroup({
    unidade: new FormControl(),
  });

  @Output()
  unidade = new EventEmitter();

  private subscriber = new Subscription();

  constructor() {
    this.setListener();
    this.updateUnidade();
  }

  ngAfterContentInit(): void {
    this.unidadesOption = this.getUnidades().map(u => new UcamOption({
      id: u.oidUnidade,
      label: u.sigla,
      value: u
    }));

    this.updateUnidade();

    this.setFormListener();
  }

  toggleMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

  private setListener() {
    window.addEventListener("storage", this._callUpdate.bind(this), false);
  }

  private _callUpdate() {
    this.updateUnidade();
  }

  private updateUnidade() {
    const authState = JSON.parse(localStorage.getItem('AuthState') ?? '');
    if (authState === '') return;

    const unidade = authState.unidadeSelecionada;
    if (!unidade) return;

    this.selectedUnidade = unidade;

    let unid = this.unidadesOption.filter(u => (u.id === this.form.controls.unidade.value))[0];

    if (!unid && unidade) unid = this.unidadesOption.filter(u => u.id === unidade.oidUnidade)[0]?.id;

    if (this.form.controls.unidade.value != this.selectedUnidade.oidUnidade) {
      this.form.controls.unidade.setValue(unid);
    }
  }

  private getUnidades(): any[] {
    const authState = JSON.parse(localStorage.getItem('AuthState') ?? '');
    if (authState === '') return [];

    const unidades = authState.unidades;
    if (!unidades) return [];

    return unidades;
  }

  private setFormListener() {
    this.subscriber.add(this.form.controls.unidade.valueChanges.subscribe(
      (_) => {
        const unidade = this.unidadesOption.filter(u => u.id === this.form.controls.unidade.value)[0];
        if (unidade) this.unidade.emit(unidade.value);
      }
    ));
  }

}
