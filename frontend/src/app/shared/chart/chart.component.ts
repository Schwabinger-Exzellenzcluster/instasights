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
    defaultFontFamily: "Roboto",
  }

  chartData: ChartDataSets[] = [];

  dataLoaded = false;

  constructor(private storyService: StoryService) { }

  ngOnInit(): void {
    this.storyItemsSub = this.storyService.getStoryItems().subscribe((storyItems) => {
      this.storyItem = storyItems.find(item => item.uuid === this.storyItemId);
      const data = this.storyItem.data
      console.log(data);
      console.log(data.data);
      const chartData = data.data.map((value) => {
        return {
          x: new Date(value.x),
          y: value.y
        };
      })

      const topic = this.storyItem.topic == "finance" ? "revenue" : this.storyItem.topic.toString()
      this.chartOptions = {
        ...this.chartOptions,
        title: {
          display: true,
          text: this.storyItem.ui_text.map((el) => el.text).join(" "),
        },
        scales: {
          yAxes: [
            {
              id: "value",
              position: "left",
              type: "linear",
              scaleLabel: {
                display: true,
                labelString: topic
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
        }
      }

    this.chartData.push({
        data: chartData,
        yAxisID: "value",
        label: topic.toUpperCase(),
        pointHitRadius: 10,
        spanGaps: true,
        cubicInterpolationMode: "monotone",
        fill: false,
      });

      this.dataLoaded = true;
    });
  }

}
