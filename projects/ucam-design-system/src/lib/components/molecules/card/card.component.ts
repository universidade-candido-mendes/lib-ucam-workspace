import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ucam-card',
  imports: [],
  template: `
    <div class="ucam-card">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './card.component.scss'
})
export class CardComponent {
}
