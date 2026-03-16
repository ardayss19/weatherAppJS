async function loadWeather() {
    try{
        const response = await fetch('/api/weather')
        const weather = await response.json()

        document.getElementById('weather').innerHTML = `
            <h2>${weather.name}</h2>
            <p>Temperature: ${weather.main.temp}C</p>
            <p>Condition: ${weather.weather[0].description} </p>
        `
    }
    catch(error) {
        document.getElementById('weather').innerHTML = '<p>Failed to load weather data</p>'
        console.error(error)
    }
}

async function loadChart () {
    try{
        const response = await fetch ('/api/weather-log')
        const { timestamps, temperatures } = await response.json()

        const trace = { 
            x: timestamps, 
            y: temperatures,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: 'purple',
            }
        }

        const layout = {
            title: 'Temperature Over Time',
            xaxis: {title: 'Date', type: 'date'},
            yaxis: { title: 'Temperature C'},
            legend: {orientation: 'h', x:0, y: 1.1},
        }

        Plotly.newPlot('chart', [trace], layout)
    }
    catch(error) {
        console.error('Failed to load chart', error)
    }
}

loadWeather()
loadChart()