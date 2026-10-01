import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuConfig } from '../../../ucam-design-system.model';
import { UcamDesignSystemService } from '../../../ucam-design-system.service';

@Component({
    selector: 'ucam-sidemenu',
    imports: [
        CommonModule,
        RouterModule,
    ],
    templateUrl: './sidemenu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  private dsService = inject(UcamDesignSystemService);

  routes = signal<MenuConfig | undefined>(undefined);
  openState = signal<Record<string, boolean>>({});

  constructor() {
    this.routes.set(this.dsService.routes);
  }

  toggleNav() {
    this.dsService.toggleNav();
  }

  closeNav() {
    this.dsService.closeNav();
  }

  toggleBranch(label: string) {
    this.openState.update(state => ({
      ...state,
      [label]: !state[label]
    }));
  }
}
