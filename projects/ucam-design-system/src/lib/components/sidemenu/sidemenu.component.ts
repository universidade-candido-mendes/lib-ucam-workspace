import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuConfig } from '../../ucam-design-system.model';

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
  routes!: MenuConfig;

  constructor(
    private activedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    console.log(this.activedRoute.snapshot.url[0]?.path);

    this.activedRoute.url.subscribe(url => {
      console.log(url[0]?.path);
    });
  }
}
