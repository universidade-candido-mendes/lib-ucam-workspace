import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class UcamProfileComponent implements AfterViewInit {

  @Input()
  userprofile?: UcamUserProfile;

  profileMenuActive = false;

  unidadesOption: UcamOption[] = [];

  form = new FormGroup({
    unidade: new FormControl(),
  });

  @Output()
  unidade = new EventEmitter();

  constructor() { }

  ngAfterViewInit(): void {
    if (this.userprofile?.unidade) {
      this.form.controls.unidade.setValue(new UcamOption({
        id: this.userprofile.unidade.oid,
        label: this.userprofile.unidade.sigla,
      }));
    }

    if (this.userprofile && this.userprofile.unidades) {
      this.unidadesOption = this.userprofile.unidades.map(u => new UcamOption({
        id: u.oid,
        label: u.sigla,
      }));

      console.log(this.unidadesOption);

    }

    this.form.controls.unidade.valueChanges.subscribe(
      (_) => {
        const unidade = this.form.controls.unidade.value;
        if (unidade) {
          this.unidade.emit(unidade);
          console.log("UNID: ", unidade);
        }
      }
    );
  }

  toggleMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

}
