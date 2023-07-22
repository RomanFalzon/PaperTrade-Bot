const express = require('express'); //SERVER
const myAPI = require('./BinanceAPI/binance'); //Binance API


const app = express();
const port = 3000;  //PORT for Server


let myDate = Date.now() -100000; //BINANCE API DATE ex: '07-21-2023 00:00:00' or UNIX
let myInterval = '1m' //BINANCE API INTERVAL


let dateTracker = 0;

let myFetchedData = [];
let myTotalArray = [];

async function fetchData() {
    try {
        myFetchedData = await myAPI.getCandles('BTC', myInterval, myDate);
        myAPI.clearCandles()

        console.log('CHECKING CANDLES---')
        console.log('PREVIOUS STICK DATE: ', dateTracker)
        console.log('CURRENT STICK DATE: ', getLastStickDate(myFetchedData))


        //THIS GETS ALWAYS CALLED ON FIRST RUN
        //THEN the time tracker gets updated and this is only called when a new stick is made ---
        if(getLastStickDate(myFetchedData) !== dateTracker){ // NEW STICK - UPDATE STUFF

            dateTracker = getLastStickDate(myFetchedData) //Update time

            console.log('***CHANGE OF DATE: NEW STICK MADE***')

            myDate = getLastStickDate(myFetchedData); //UPDATE DATE for API CALL
            myTotalArray = [...myTotalArray, ...myFetchedData]

            console.log(myTotalArray)
            console.log('MY TOTAL ARR COUNT: ', myTotalArray.length)
        }

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


function getLastStickDate(arr){
    return arr[arr.length-1][0]
}


// Initial data fetch
fetchData();

// Schedule data fetch every 10 seconds
const interval = 5000; // 10 seconds in milliseconds
setInterval(fetchData, interval);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});