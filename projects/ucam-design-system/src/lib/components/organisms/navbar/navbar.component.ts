import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UcamUserProfile } from '../../../ucam-design-system.model';
import { UcamDesignSystemService } from '../../../ucam-design-system.service';
import { UcamProfileComponent } from '../profile/profile.component';

@Component({
    selector: 'ucam-navbar',
    imports: [
        UcamProfileComponent
    ],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  userprofile?: UcamUserProfile;

  constructor(service: UcamDesignSystemService) {
    this.userprofile = service.userProfile;
  }

}
