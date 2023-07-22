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

        console.log('PREVIOUS STICK CLOSE DATE: ', dateTracker)
        console.log('CURRENT STICK CLOSE DATE: ', getLastStickDate(myFetchedData))

        if(getLastStickDate(myFetchedData) !== dateTracker && getLastStickDate(myFetchedData) !== 'PENDING'){ // NEW STICK - UPDATE STUFF
            dateTracker = getLastStickDate(myFetchedData) //Update new start time
            myDate = getLastStickDate(myFetchedData); //UPDATE DATE for API CALL

            console.log('***CHANGE OF DATE: NEW STICK MADE***')

            myTotalArray = [...myTotalArray, ...myFetchedData]

            console.log(myTotalArray)
            console.log('MY TOTAL ARR COUNT: ', myTotalArray.length)
        }

    } catch (error) {
        console.error('Error fetching data:', error.message);
        console.log('NEW STICK STILL NOT CLOSED')
    }
}

function getLastStickDate(arr){
    const lastItem = arr[arr.length - 1];
    if (lastItem && Array.isArray(lastItem) && lastItem.length > 6) {
        return lastItem[6];
    } else {
        return 'PENDING';
    }
}

// Initial data fetch
fetchData();

// Schedule data fetch every 10 seconds
const interval = 60000; // 10 seconds in milliseconds
setInterval(fetchData, interval);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});