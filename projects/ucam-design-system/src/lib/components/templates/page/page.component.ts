import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavbarComponent } from '../../organisms/navbar/navbar.component';
import { SidemenuComponent } from '../../organisms/sidemenu/sidemenu.component';
import { UcamDesignSystemService } from '../../../ucam-design-system.service';

@Component({
    selector: 'ucam-page',
    imports: [
        NavbarComponent,
        SidemenuComponent
    ],
    templateUrl: './page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './page.component.scss'
})
export class PageComponent {
    private dsService = inject(UcamDesignSystemService);
    navState = this.dsService.navState;
}
