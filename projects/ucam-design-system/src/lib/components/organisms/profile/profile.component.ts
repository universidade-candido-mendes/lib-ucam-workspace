import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { ChangeProfileListener, ChangeUnidadeListener, ExitListener, UcamOption, UcamUserProfile, Unidade } from '../../../../public-api';

@Component({
    selector: 'ucam-profile',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './profile.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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

  selectorOpen = false;

  @Output()
  unidade = new EventEmitter();

  private subscriber = new Subscription();

  constructor() {
    this.setListener();
    this.updateUnidade();
    ChangeUnidadeListener.getInstance()
      .addListener((u: Unidade) => this.setUnidade(u));
    ChangeProfileListener.getInstance()
      .addListener((p: UcamUserProfile) => this.userprofile = p);
  }

  ngAfterContentInit(): void {
    this.startSelectedUnidade();

    this.unidadesOption = this.getUnidades().map(u => new UcamOption({
      id: u.oidUnidade,
      label: u.sigla,
      value: u
    }));

    this.updateUnidade();

    this.setFormListener();
  }

  toggleMenu() {
    if (this.profileMenuActive) {
      this.selectorOpen = false;
    }

    this.profileMenuActive = !this.profileMenuActive;
  }

  toggleUnidadeSelect() {
    this.selectorOpen = !this.selectorOpen;
  }

  onExit() {
    ExitListener.getInstance().emit();
  }

  onSetUnidade(unidade: Unidade) {
    this.setUnidade(unidade);
    ChangeUnidadeListener.getInstance().emit(unidade);
    this.toggleUnidadeSelect();
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
              .filter((u: Unidade) => u.oidUnidade === unidade)[0]);
        })
      ).subscribe()
    );
  }

  private setUnidade(unidade: Unidade) {
    this.selectedUnidade = unidade;

    this.updateSelectedUnidade(unidade);

    let unid = this.unidadesOption.filter(u => (u.id === this.form.controls.unidade.value))[0];
    if (!unid && unidade) unid = this.unidadesOption.filter(u => u.id === (unidade.oidUnidade || unidade.oid))[0]?.id;

    if (this.selectedUnidade && this.form.controls.unidade.value != this.selectedUnidade.oidUnidade) {
      this.form.controls.unidade.setValue(unid);
    }
  }

  private updateSelectedUnidade(unidade: Unidade) {
    const authStateString = localStorage.getItem('AuthState');

    if (!authStateString) return ;

    const authState = JSON.parse(authStateString);

    authState.unidadeSelecionada = unidade;

    localStorage.setItem('AuthState', JSON.stringify(authState));
  }

  private startSelectedUnidade() {
    const authStateString = localStorage.getItem('AuthState');

    if (!authStateString) return ;

    const authState = JSON.parse(authStateString);
    const unidadeSelecionada = authState.unidadeSelecionada;

    ChangeUnidadeListener.getInstance()
            .emit(unidadeSelecionada);
  }

}
