const express = require('express'); //SERVER
const myAPI = require('./BinanceAPI/binance'); //Binance API
const myBot = require('./backTestingBot') // Trading bot

const app = express();
const port = 3000;  //PORT for Server

let myDate = Date.now(); //BINANCE API DATE ex: '07-21-2023 00:00:00' or UNIX
let myInterval = '1m' //BINANCE API INTERVAL

let dateTracker = 0;

let myFetchedData = [];
let myTotalArray = [];


let botResponse = []

async function fetchData() {
    try {
        //GETS API DATATA
        myFetchedData = await myAPI.getCandles('BTC', myInterval, myDate);
        myAPI.clearCandles()

        //ALWAYS GETS CALLED ON START
        //CHECKS FOR NEW CANDLES (IF last candle CLOSE DATE exists = candle was closed = push to array = push new candle to bot)
        if(getLastStickDate(myFetchedData) !== dateTracker && getLastStickDate(myFetchedData) !== 'PENDING'){ // NEW STICK - UPDATE STUFF

            dateTracker, myDate = getLastStickDate(myFetchedData) //Update new start time //UPDATE DATE for API CALL
        
            //Appends array with new candles
            myTotalArray = [...myTotalArray, ...myFetchedData]

            //Call magic bot
            let myTrades = await myBot.doTrades(passLastCandle(myTotalArray)); //PUSH LAST CANDLE TO BOT

            //console.log(myTotalArray)

            //Pass data for JSON SERVER endpoint
            botResponse = myTrades;
        }

    } catch (error) {
        console.error('Error fetching data:', error.message);
        console.log('NEW STICK STILL NOT CLOSED')
    }
}

//This checks if close date of last array exists. PENDING candles that have not been closed wont have CLOSE TIMESTAMP
//Once a call is done, and there is data, it will push the CLOSETIMESTAMP to be used as a STARTSTAMP to get new candles
//We also get the new closed stick data and store it in fetchDATA (Soon to be  added to LIVE BOT API)
function getLastStickDate(arr){
    const lastItem = arr[arr.length - 1];
    if (lastItem && Array.isArray(lastItem) && lastItem.length > 6) {
        return lastItem[6];
    } else {
        return 'PENDING';
    }
}

//Gets last stick to push to bot
let passLastCandle = (arr) => arr[arr.length-1];




// Initial data fetch
fetchData();

// Schedule data fetch every 10 seconds
const interval = 60000; // 10 seconds in milliseconds
setInterval(fetchData, interval);






// SERVER
app.get('/get-data', (req, res) => {
    res.json( botResponse );
});
  

//JSON ENDPOINT
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});