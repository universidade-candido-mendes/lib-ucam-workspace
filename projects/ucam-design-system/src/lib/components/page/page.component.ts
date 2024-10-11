import { Component, Input } from '@angular/core';
import { UcamUserProfile } from '../../ucam-design-system.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';

@Component({
  selector: 'ucam-page',
  standalone: true,
  imports: [
    NavbarComponent,
    SidemenuComponent
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {

  @Input()
  userprofile?: UcamUserProfile;

}
