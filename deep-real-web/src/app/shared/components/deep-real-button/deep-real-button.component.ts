import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'deep-real-button',
  imports: [CommonModule],
  templateUrl: './deep-real-button.component.html',
  styleUrl: './deep-real-button.component.scss'
})
export class DeepRealButtonComponent {
  
  @Input()
  public text: string = '';
  
  @Input()
  public disabled: boolean = false;
  
  @Input()
  public icon: string = '';
  
  @Input()
  public type: 'round' | 'flat' = 'round';

  @Output()
  public onClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  public handleClick = (): void => this.onClick.emit();

  public getIconName = (): string => `./../../../../assets/icons/${this.icon}.svg`;
}
