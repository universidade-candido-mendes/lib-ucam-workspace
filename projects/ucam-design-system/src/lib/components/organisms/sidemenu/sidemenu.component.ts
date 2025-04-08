import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuConfig } from '../../../ucam-design-system.model';

@Component({
  selector: 'ucam-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {

  @Input()
  routes?: MenuConfig;

  isMenuOpen = false;

  constructor(
    private activedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.activedRoute.url.subscribe(url => { });
  }

  onToggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
