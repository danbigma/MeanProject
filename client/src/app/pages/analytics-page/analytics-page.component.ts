import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core'
import {AnalyticsService} from '../../shared/services/analytics.service'
import {AnalyticsPage} from '../../shared/interfaces'
import {Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} from "chart.js";
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef

  aSub!: Subscription
  average!: number
  pending = true

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit() {
    const gainConfig:IConfig = {
      label: 'Выручка',
      color: 'rgb(255,99,132)',
      labels: [],
      data : []
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // **** Gain ****
      // gainConfig.labels.push('08.05.2018')
      // gainConfig.labels.push('09.05.2018')
      // gainConfig.data.push(1500)
      // gainConfig.data.push(700)
      // **** /Gain ****

      // **** Order ****
      // orderConfig.labels.push('08.05.2018')
      // orderConfig.labels.push('09.05.2018')
      // orderConfig.data.push(8)
      // orderConfig.data.push(2)
      // **** /Order ****

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig(config:IConfig):ChartConfiguration {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels:config.labels,
      datasets: [
        {
          label:config.label,
          data:config.data,
          borderColor: config.color,
          stepped: false,
          fill: false
        }
      ]
    }
  }
}

interface IConfig {
  labels:string[],
  data:number[],
  label:string,
  color:string
}
