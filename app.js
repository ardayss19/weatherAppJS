import express from 'express' // run web app
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import csv from 'csv-parser'//Load a tool that can read CSV files and turn them into usable JavaScript data

dotenv.config()

const app = express()

const port = process.env.PORT|| 5000

const DATA_DIR = path.join(import.meta.dirname, 'data')
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv')

app.use(express.static(path.join(import.meta.dirname, 'public'))) // 

app.get('/api/weather', (request,response) => {
    if (!fs.existsSync(WEATHER_FILE)) {
        return response.status(404).json({error: 'No weather available'})
    }

    try{
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, 'utf-8'))
        response.json(weatherData)
    }

    catch(error) {
        console.log('Error reading weather.json', error)
        response.status(500),json({error: 'Failed to read weather data' })
    }
})

app.get('/api/weather-log', (request, response) => {
    if(!fs.existsSync(LOG_FILE)) {
        return response.status(404).json({error: 'No weather log available'})
    }

    const timestamps = []
    const temperatures = []

    fs.createReadStream(LOG_FILE) // open csv file so we can read line by line 
        .pipe(csv())
        .on('data', row => {
            if (row.timestamp && row.temperature) {
                timestamps.push(row.timestamp)
                temperatures.push(parseFloat(row.temperature))
            }
        })
        .on('end', () => response.json({timestamps, temperatures}))
        .on('error', error => {
            console.log('Error reading CSV', error)
            response.status(500).json({error: 'Failed to read log'})
        })
})

app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`)
})