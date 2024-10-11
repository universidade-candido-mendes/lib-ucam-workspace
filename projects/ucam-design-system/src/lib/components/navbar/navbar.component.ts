import { Component } from '@angular/core';
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

}
