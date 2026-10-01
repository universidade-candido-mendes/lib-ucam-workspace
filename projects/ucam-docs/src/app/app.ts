import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { 
  TableComponent, 
  StatComponent, 
  CardComponent, 
  DescriptionListComponent, 
  UcamDescriptionItem 
} from 'ucam-design-system';

@Component({
  selector: 'app-root',
  imports: [
    TableComponent,
    StatComponent,
    CardComponent,
    DescriptionListComponent
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss'
})
export class App {
  title = signal('ucam-docs');
  
  docItems: UcamDescriptionItem[] = [
    { label: 'Biblioteca', value: 'ucam-design-system' },
    { label: 'Versão', value: '1.0.0' },
    { label: 'Autor', value: 'Universidade Cândido Mendes', wide: true }
  ];
}
