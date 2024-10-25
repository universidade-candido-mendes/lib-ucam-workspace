import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ucam-sidemenu',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {

  constructor(
    private router: Router,
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
