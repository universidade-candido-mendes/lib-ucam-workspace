import { Component, Input } from '@angular/core';
import { UcamUserProfile } from '../../ucam-design-system.model';
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

}
