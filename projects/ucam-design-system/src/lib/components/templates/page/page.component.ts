import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from '../../organisms/navbar/navbar.component';
import { SidemenuComponent } from '../../organisms/sidemenu/sidemenu.component';

@Component({
    selector: 'ucam-page',
    imports: [
        NavbarComponent,
        SidemenuComponent
    ],
    templateUrl: './page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './page.component.scss'
})
export class PageComponent {

}
