import { Order } from './../../shared/interfaces';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent {

  @Input() orders!:  Order[];

}
