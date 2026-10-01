import { Component, ChangeDetectionStrategy } from '@angular/core';
import { 
  TableComponent, 
  StatComponent, 
  CardComponent, 
  DescriptionListComponent, 
  UcamDescriptionItem 
} from '@universidade-candido-mendes/ucam-design-system';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TableComponent,
    StatComponent,
    CardComponent,
    DescriptionListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ucam-docs';
  
  docItems: UcamDescriptionItem[] = [
    { label: 'Biblioteca', value: 'ucam-design-system' },
    { label: 'Versão', value: '1.0.0' },
    { label: 'Autor', value: 'Universidade Cândido Mendes', wide: true }
  ];
}
