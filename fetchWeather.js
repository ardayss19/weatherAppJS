// this part of thecode is preparing Node.js app to work with files, folders, and environment variables.
import {pathToFileURL} from "url"
import fs from 'fs' // Load Node.js’s file system tool so we can read or write files
import path from 'path' // Load a helper that safely works with file and folder paths - path helps you build file locations correctly across operating systems
import dotenv from 'dotenv' 


dotenv.config() // Read the .env file and make its values available to the program

const DATA_DIR = path.join (import.meta.dirname, 'data') // we want to create a folder called data and the 'import.meta.dirname' creates the folder 'data' in this location
if(!fs.existsSync(DATA_DIR)) { // if the data_dir does not exist
    fs.mkdirSync(DATA_DIR) // create the folder data_dir
}

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json') // path to the weather.json file 
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') // path to the csv file

//This code is creating a function that prepares a request to get weather data from an online weather service (Make a tool that knows how to ask a weather website for the current weather)
export async function fetchWeather() { // Create a function called fetchWeather, and allow other files to use it(=export)
    const apiKey = process.env.WEATHER_API_KEY // Get my secret weather API key from environment variables - process.env = where Node.js stores environment settings and WEATHER_API_KEY comes from your .env file
    const city = process.env.CITY || 'London' // Use the city from settings — but if none is provided, use London
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric` // Build the web address needed to request weather data

//Get weather data from the internet, save it to files, log it, and handle errors safely.
    try { // attempt code
        const response = await fetch(url) // Send a request to the weather website and wait for the reply
        if (!response.ok) { // If the website says something went wrong, create an error.
            throw new Error(`HTTP error! Status ${response.status}`);
        }

        const data = await response.json() // Turn the server’s reply into a JavaScript object. 
        const nowUTC = new Date().toISOString() // Record the exact time we fetched this weather
        data._last_update_utc = nowUTC
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2)) // Save the weather data into a file (weather_log.csv) - (null,2) = nicely formatted (pretty printed)

        const header = 'timestamp,city,temperature,description\n' // Define column titles for a spreadsheet file - This creates a CSV header. : CSV = opens in Excel / Google Sheets
        // “If the log file isn’t created yet, create it and add headers
        if(!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, header)

        } else {
            const firstLine = fs.readFileSync(LOG_FILE, 'utf8').split('\n')[0] // “Read the first line of the file
            if(firstLine !== 'timestamp,city,temperature,description') { //“If headers are wrong, fix them
                fs.writeFileSync(LOG_FILE, header + fs.readFileSync(LOG_FILE,'utf8')) // Add correct headers at the top
            }
        }
        const logEntry = `${nowUTC},${city},${data.main.temp}, ${data.weather[0].description}\n` //Create one row of weather history
        fs.appendFileSync(LOG_FILE, logEntry) //Add this new row to the end of the log file

        console.log(`Weather data updated for ${city} at ${nowUTC}`) //Print a confirmation message in the terminal
    }
    //If anything failed, show an error message instead of crashing
    catch(error) {
        console.log('Error fecthing weather:', err)
    }
}
//Only run this function if this file is executed directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    fetchWeather();
}
