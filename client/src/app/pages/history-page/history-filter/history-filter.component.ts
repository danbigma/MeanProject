import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  MaterialDatepicker,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { Filter } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css'],
})
export class HistoryFilterComponent {
  @Output() onFilter = new EventEmitter<Filter>();
  @ViewChild('start') startRef!: ElementRef;
  @ViewChild('end') endRef!: ElementRef;

  start!: MaterialDatepicker;
  end!: MaterialDatepicker;

  order!: number;

  isValid = true;

  sumbitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }
    if (this.start.date) {
      filter.start = this.start.date;
    }
    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(
      this.startRef,
      this.validate.bind(this)
    );
    this.end = MaterialService.initDatepicker(
      this.endRef,
      this.validate.bind(this)
    );
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return
    }

    this.isValid = this.start.date < this.end.date;
  }

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }
}
