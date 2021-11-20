import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from "chart.js";
import { Subscription } from 'rxjs';
import { InsightData, StoryItem } from 'src/app/services/story/story.model';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() storyItemId: string;

  storyItem: StoryItem;
  storyItemsSub: Subscription;

  chartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    zoom: {
      enabled: true,
      mode: "xy",
    },
    title: {
      display: false,
      text: "",
    },
    defaultFontFamily: "Roboto",
  }

  chartData: ChartDataSets[] = [];

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.storyItemsSub = this.storyService.getStoryItems().subscribe((storyItems) => {
      this.storyItem = storyItems.find(item => item.uuid === this.storyItemId);
      const data = this.storyItem.data
      this.chartOptions = {
        ...this.chartOptions,
        yAxes: [
          {
            id: data.xLabel,
            position: "left",
            type: "linear",
            scaleLabel: {
              display: true,
              labelString: data.yLabel
            }
          }
        ],
        xAxes: [
          {
            type: "time",
            distribution: "linear",
            bounds: "ticks",
            ticks: {
              source: "auto",
              minRotation: 25,
              maxRotation: 25,
              autoSkip: true
            },
          }
        ]
      };
      this.chartData = [{
        data: data.chartData,
        yAxisID: data.yLabel,
        label: this.storyItem.ui_text.map((el) => el.text).join(" "),
        pointHitRadius: 10,
        spanGaps: true,
        cubicInterpolationMode: "monotone",
        fill: false,
      }];
    });
  }

}
