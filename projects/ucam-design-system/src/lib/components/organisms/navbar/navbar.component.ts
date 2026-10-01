import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { UcamUserProfile } from '../../../ucam-design-system.model';
import { UcamDesignSystemService } from '../../../ucam-design-system.service';
import { UcamProfileComponent } from '../profile/profile.component';

@Component({
    selector: 'ucam-navbar',
    imports: [
        UcamProfileComponent
    ],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private dsService = inject(UcamDesignSystemService);

  userprofile = signal<UcamUserProfile | undefined>(undefined);

  constructor() {
    this.userprofile.set(this.dsService.userProfile);
  }

  toggleNav() {
    this.dsService.toggleNav();
  }
}
