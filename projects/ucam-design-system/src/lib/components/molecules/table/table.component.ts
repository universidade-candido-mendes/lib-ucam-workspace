import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ucam-table',
  imports: [],
  template: `
    <div class="ucam-table-wrap">
      <table class="ucam-table" [class.ucam-table--compact]="compact()">
        <ng-content></ng-content>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './table.component.scss'
})
export class TableComponent {
  compact = input<boolean>(false);
}
