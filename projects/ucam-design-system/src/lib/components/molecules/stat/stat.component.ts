import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ucam-stat',
  imports: [],
  template: `
    <div class="ucam-stat" [class]="tone() !== 'default' ? 'ucam-stat--' + tone() : ''">
      <span class="ucam-stat__label">{{ label() }}</span>
      <span class="ucam-stat__value">{{ value() }}</span>
      @if (meta()) {
        <span class="ucam-stat__meta">{{ meta() }}</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './stat.component.scss'
})
export class StatComponent {
  label = input.required<string>();
  value = input.required<string>();
  meta = input<string>();
  tone = input<'default' | 'success' | 'warning' | 'danger'>('default');
}
