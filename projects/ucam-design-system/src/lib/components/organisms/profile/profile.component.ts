import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { ChangeUnidadeListener, UcamOption, UcamUserProfile, Unidade } from '../../../../public-api';

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
  selectedUnidade?: any;

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
    ChangeUnidadeListener.getInstance()
      .addListener((u: Unidade) => this.setUnidade(u));
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

    this.setUnidade(unidade);
  }

  private getUnidades(): Unidade[] {
    const authState = JSON.parse(localStorage.getItem('AuthState') ?? '');
    if (authState === '') return [];

    const unidades = authState.unidades;
    if (!unidades) return [];

    return unidades;
  }

  private setFormListener() {
    this.subscriber.add(
      this.form.controls.unidade.valueChanges.pipe(
        tap((unidade: String) => {
          ChangeUnidadeListener.getInstance()
            .emit(this.getUnidades()
              .filter((u: Unidade) => u.oid === unidade)[0]);
        })
      ).subscribe()
    );
  }

  private setUnidade(unidade: Unidade) {
    this.selectedUnidade = unidade;

    let unid = this.unidadesOption.filter(u => (u.id === this.form.controls.unidade.value))[0];
    if (!unid && unidade) unid = this.unidadesOption.filter(u => u.id === (unidade.oidUnidade || unidade.oid))[0]?.id;

    if (this.form.controls.unidade.value != this.selectedUnidade.oidUnidade) {
      this.form.controls.unidade.setValue(unid);
    }
  }

}
