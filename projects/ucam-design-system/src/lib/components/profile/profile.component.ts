import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UcamUserProfile } from '../../../public-api';

@Component({
  selector: 'ucam-profile',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class UcamProfileComponent {

  @Input()
  userprofile?: UcamUserProfile;

  profileMenuActive = false;

  toggleMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

}
