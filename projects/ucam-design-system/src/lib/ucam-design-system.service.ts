import { Injectable, signal } from '@angular/core';
import { ChangeProfileListener } from '../public-api';
import { MenuConfig, UcamUserProfile } from './ucam-design-system.model';

@Injectable({
  providedIn: 'root'
})
export class UcamDesignSystemService {

  userProfile!: UcamUserProfile;
  routes!: MenuConfig;
  
  readonly navState = signal<'open' | 'closed'>('closed');

  constructor() { }

  setProfile(profile: UcamUserProfile) {
    this.userProfile = profile;
    ChangeProfileListener.getInstance().emit(profile);
  }

  setMenuConfig(menu: MenuConfig) {
    this.routes = menu;
  }
  
  toggleNav() {
    this.navState.update(s => s === 'open' ? 'closed' : 'open');
  }
  
  closeNav() {
    this.navState.set('closed');
  }
}

