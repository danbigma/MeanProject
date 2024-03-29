import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { Observable } from 'rxjs/index';
import { OverviewPage } from '../../shared/interfaces';
import {
  MaterialInstance,
  MaterialService,
} from '../../shared/classes/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css'],
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef!: ElementRef;
  tapTarget!: MaterialInstance;
  data$!: Observable<OverviewPage>;

  yesterday = new Date();

  constructor(private service: AnalyticsService) {}

  ngOnInit() {
    this.data$ = this.service.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit() {
    if (this.tapTarget) {
      this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
    }
  }

  ngOnDestroy() {
    if (this.tapTarget) {
      this.tapTarget.destroy();
    }
  }

  openInfo() {
    if (this.tapTarget) {
      this.tapTarget.open();
    }
  }

  // Asumiendo que 'data' es el objeto que contiene la información que estás mostrando
  getOrderInfoTranslationParams(data: any) {
    return {
      percent: data.orders.percent,
      isHigher: data.orders.isHigher ? 'higher' : 'lower',
      compare: data.orders.compare,
    };
  }
}
