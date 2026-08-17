import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuConfig } from '../../../ucam-design-system.model';
import { UcamDesignSystemService } from '../../../ucam-design-system.service';

@Component({
    selector: 'ucam-sidemenu',
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './sidemenu.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {

  routes?: MenuConfig;

  isMenuOpen = false;

  constructor(
    private activedRoute: ActivatedRoute,
    private service: UcamDesignSystemService
  ) {
    this.routes = this.service.routes;
  }

  ngOnInit() {
    this.activedRoute.url.subscribe(url => { });
  }

  onToggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
