import { Component } from '@angular/core';
import { NavbarComponent } from '../../organisms/navbar/navbar.component';
import { SidemenuComponent } from '../../organisms/sidemenu/sidemenu.component';

@Component({
    selector: 'ucam-page',
    imports: [
        NavbarComponent,
        SidemenuComponent
    ],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss'
})
export class PageComponent {

}
