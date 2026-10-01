import { Component, ChangeDetectionStrategy, input, ViewEncapsulation } from '@angular/core';

export interface UcamDescriptionItem {
  label: string;
  value: string;
  wide?: boolean;
}

@Component({
  selector: 'ucam-description-list',
  imports: [],
  template: `
    <dl class="ucam-descricao ucam-descricao--2">
      @for (item of items(); track item.label) {
        <div class="ucam-descricao__par" [class.ucam-descricao__par--largo]="item.wide">
          <dt class="ucam-descricao__rotulo">{{ item.label }}</dt>
          <dd class="ucam-descricao__valor" [innerHTML]="item.value"></dd>
        </div>
      }
    </dl>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './description-list.component.scss'
})
export class DescriptionListComponent {
  items = input.required<UcamDescriptionItem[]>();
}
