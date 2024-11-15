import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UcamUserProfile, Unidade } from '../../ucam-design-system.model';
import { UcamProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'ucam-navbar',
  standalone: true,
  imports: [
    UcamProfileComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input()
  userprofile?: UcamUserProfile;

  @Output()
  unidade = new EventEmitter();

  emitUnidade(unidade: Unidade) {
    this.unidade.emit(unidade);
  }

}
