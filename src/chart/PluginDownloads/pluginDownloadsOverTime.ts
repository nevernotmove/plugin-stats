import type {ChartData} from 'chart.js/dist/types';
import {Chart} from 'chart.js';
import 'chartjs-adapter-luxon';
import type {ChartDefaults} from '../ChartDefaults';

const prepareData = (json: object, pluginName: string, defaults: ChartDefaults): ChartData => {
    const labels = [];
    const data = [];
    for (const entry of Object.entries(json)) {
        const time = parseInt(entry[0] + "000");
        const downloads = entry[1];
        labels.push(time);
        data.push(downloads);
    }
    const label = "# of downloads for " + pluginName;
    const datasets = [{
        label: label,
        data: data,
        borderWidth: defaults.borderWidth,
        backgroundColor: defaults.backgroundColor,
        borderColor: defaults.borderColor,
        hoverBackgroundColor: defaults.hoverBackgroundColor,
        pointStyle: true,
        pointRadius: 0,
        pointHoverRadius: 10,
        fill: true,
    }];
    const res = {
        labels: labels,
        datasets: datasets
    };
    return res as ChartData;
};

const displayChart = (data: ChartData) => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    type: 'time', 
                    time: {
                        unit: "day"
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#3F3F3F',
                    }
                }
            }
        }
    });
};

export default function pluginDownloadsOverTime(json: object, pluginName: string, chartDefaults: ChartDefaults): void {
    const lineChartData: ChartData = prepareData(json, pluginName, chartDefaults);
    displayChart(lineChartData);
}