import { Injectable } from '@angular/core';
import { MenuConfig, UcamUserProfile } from './ucam-design-system.model';

@Injectable({
  providedIn: 'root'
})
export class UcamDesignSystemService {

  userProfile!: UcamUserProfile;
  routes!: MenuConfig;

  constructor() { }

  setProfile(profile: UcamUserProfile) {
    this.userProfile = profile;
  }

  setMenuConfig(menu: MenuConfig) {
    this.routes = menu;
  }
}
