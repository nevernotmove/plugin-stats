import type {ActiveElement, ChartData, ChartEvent} from 'chart.js/dist/types';
import {Chart} from 'chart.js';
import type {ChartDefaults} from '../ChartDefaults';
import {navigate} from 'svelte-navigator';

const prepareData = (json: object, defaults: ChartDefaults): ChartData => {
    const labels: string[] = [];
    const data = [];
    const sortable = Object.entries(json)
        .sort(([, a], [, b]) => b - a)
    const max = 20;
    for (let i = 0; i < sortable.length && i < max; i++) {
        labels.push(sortable[i][0]);
        data.push(sortable[i][1]);
    }
    const label = "# of downloads";
    const datasets = [{
        label: label,
        data: data,
        borderWidth: defaults.borderWidth,
        borderColor: defaults.borderColor,
        borderRadius: 2,
        backgroundColor: defaults.backgroundColor,
        hoverBackgroundColor: defaults.hoverBackgroundColor,
    }];
    const res = {
        labels: labels,
        datasets: datasets
    };
    return res as ChartData;
};

const handleClickOnChart = (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        if (elements.length === 0) return;
        const index = elements[0].index;
        const label = chart.data.labels[index];
        navigate('plugin-downloads/' + label);
}

const displayChart = (data: ChartData, defaults: ChartDefaults) => {
    
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    let highlighted = false; 
    
    const onHover = (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        if (elements.length === 0) {
            if (!highlighted) return;
            chart.config.options.scales.x.ticks.color = defaults.fontColor;
            ctx.style.cursor = 'default';
            chart.update();
            highlighted = false;
            return;
        }

        if (highlighted) return;
        
        ctx.style.cursor = 'pointer'
        const numBars = chart.data.datasets[0].data.length;
        const colors: string[] = new Array<string>(numBars);
        colors.fill(defaults.fontColor);
        const index = elements[0].index;
        colors[index] = defaults.backgroundColor;
        chart.config.options.scales.x.ticks.color = colors;
        chart.update();
        highlighted = true;
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            onHover: onHover,
            onClick: handleClickOnChart,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                     ticks: {
                         color: defaults.fontColor,
                     }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: defaults.fontColor,
                    },
                    grid: {
                        color: '#3F3F3F',
                    }
                }
            }
        }
    });
};

export default function mostDownloadedPlugins(json: object, chartDefaults: ChartDefaults): void {
    const barChartData: ChartData = prepareData(json, chartDefaults);
    displayChart(barChartData, chartDefaults);
}