# Weather App - DataOps

## Description 
is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.


## Installation
- clone this repo
- On your terminal
    - `cd` to root folder 
    - `npm i` to install dependencies 
    - setup `env` with: 
        - `PORT` of your choosing
        - `CITY` of your choosing
        -`API_KEY` from openweather
    - `node fetchWeather.js` to create/update data folder
    - `node app.js` to start server
- Open browser on `PORT` to see weather and graph 

## Using Docker 

- Open your Docker Desktop 
- Make sure you are on same path as Dockerfile
- On your terminal run: 
    - `docker build -t <app-name>:<tage> .` or `build -t weatherappjs:1.0 .` - to build an image based on Dockerfile
    - `docker run -p <local-port>:<container-port><image-name>` or `docker run -p 3000:5000 weatherapp` - to run a container based on an image

## Tests

We have tests to check if files inside the data folder is correct