import { Directive, Input } from '@angular/core';

/**
 * MaskDirective is now mostly a structural decorator as the logic
 * has been merged natively into UcamInputComponent for better stability
 * and Angular compatibility.
 */
@Directive({
  selector: '[mask]',
  standalone: true,
})
export class MaskDirective {
  // O UcamInputComponent agora consome o [mask] nativamente através de suas propriedades.
  @Input() mask!: string;
}
