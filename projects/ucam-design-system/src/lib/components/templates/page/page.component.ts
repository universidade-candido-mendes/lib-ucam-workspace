import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeUnidadeListener } from '../../../ucam-design-system.events';
import { MenuConfig, UcamUserProfile } from '../../../ucam-design-system.model';
import { NavbarComponent } from '../../organisms/navbar/navbar.component';
import { SidemenuComponent } from '../../organisms/sidemenu/sidemenu.component';

@Component({
  selector: 'ucam-page',
  standalone: true,
  imports: [
    NavbarComponent,
    SidemenuComponent
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {

  @Input()
  userprofile?: UcamUserProfile;

  @Input()
  routes!: MenuConfig;

  @Output()
  unidade = new EventEmitter();

  emitUnidade(unidade: any) {
    this.unidade.emit(unidade);
    ChangeUnidadeListener.getInstance().emit(unidade);
  }

}
