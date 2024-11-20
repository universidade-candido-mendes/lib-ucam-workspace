import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UcamOption, UcamSelectComponent, UcamUserProfile } from '../../../public-api';

@Component({
  selector: 'ucam-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UcamSelectComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class UcamProfileComponent implements AfterViewInit, AfterContentInit {

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
    if (this.userprofile?.unidade) {
      this.form.controls.unidade.setValue(new UcamOption({
        id: this.userprofile.unidade.oid,
        label: this.userprofile.unidade.sigla,
      }));
    }
  }

  ngAfterContentInit(): void {
    if (this.userprofile?.unidade) {
      this.form.controls.unidade.setValue(new UcamOption({
        id: this.userprofile.unidade.oid,
        label: this.userprofile.unidade.sigla,
        value: this.userprofile.unidade
      }));
    }
  }

  ngAfterViewInit(): void {
    if (this.userprofile && this.userprofile.unidades) {
      this.unidadesOption = this.userprofile.unidades.map(u => new UcamOption({
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

}
