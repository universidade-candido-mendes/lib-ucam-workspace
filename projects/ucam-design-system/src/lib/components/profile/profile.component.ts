import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  constructor() {
    this.setListener();
    this.updateUnidade();
  }

  ngAfterContentInit(): void {
    this.updateUnidade();

    if (this.userprofile && this.userprofile.unidades) {
      this.unidadesOption = this.getUnidades().map(u => new UcamOption({
        id: u.oidUnidade,
        label: u.sigla,
        value: u
      }));
    }

    this.form.controls.unidade.valueChanges.subscribe(
      (_) => {
        const unidade = this.unidadesOption.filter(u => u.id === this.form.controls.unidade.value)[0];
        if (unidade) {
          this.unidade.emit(unidade.value);
        }
      }
    );
  }

  toggleMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

  private setListener() {
    window.addEventListener("storage", this.updateUnidade, false);
  }

  private updateUnidade() {
    const authState = JSON.parse(localStorage.getItem('AuthState') ?? '');
    if (authState === '') return;

    const unidade = authState.unidadeSelecionada;
    if (!unidade) return;

    this.form.controls.unidade.setValue(new UcamOption({
      id: unidade.oid,
      label: unidade.sigla,
      value: unidade
    }));
  }

  private getUnidades(): any[] {
    const authState = JSON.parse(localStorage.getItem('AuthState') ?? '');
    if (authState === '') {
      const unidades = authState.unidades;
      if (!unidades) return [];

      return unidades
    }

    return [];
  }

}
