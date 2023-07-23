//Last X candled
const candlesToCheck = 2;
let myTradingData = [];
let tableData = [];

//Counter to check candles in a row
let consecutiveGreenCount = 0;
let consecutiveRedCount = 0;

let isInPosition = false;

let myBALANCE = 100000;

let currentOpenPoisitionBalance = 0;
let BTCExitValueAtStart = 0; //Enter trade last candle value
let BTCExitValueAtExit = 0; //Exit trade last candle value

let tradesMade = 0

function checkLoopData(data) {



    //Get open price and close price
    const openPrice = parseFloat(data[1]);
    const closePrice = parseFloat(data[4]);
    //console.log('Close price:', closePrice)
    const myTimeStamp = data[6];

    checkArrows(openPrice, closePrice, myTimeStamp); //Counter for last X candles and output arrow COLOR
    tradeMgmt(closePrice); //checks checkArrows setters, once conditions met, call open/close trades
}

function tradeMgmt(closePrice){
    //Call positions based on check candle
    if (consecutiveGreenCount === candlesToCheck && !isInPosition) {
        //console.log('Enter signal');
        isInPosition = true;

        //ENTER SINGAL
        enterTrade(closePrice);
        consecutiveGreenCount = 0; //Reset Counter
    }

    if (consecutiveRedCount === candlesToCheck && isInPosition) {
        //console.log('Exit signal');
        isInPosition = false;

        //EXIT SINGAL
        exitTrade(closePrice);
        consecutiveRedCount = 0; //Reset Counter
        resetCounters() //Reset
    }
}


function checkArrows(openPrice, closePrice, myTimeStamp){

    //Check candle
    if (openPrice > closePrice) {

        const data = {
            Color: 'RED',
            Stamp: myTimeStamp,
            Price: closePrice,
            Balance: myBALANCE
        };

        tableData.push(data);

        console.table(tableData[tableData.length-1]);

        consecutiveRedCount++;
        consecutiveGreenCount = 0;


        //console.log(tableData)
        
    } else if (openPrice < closePrice) {
        const data = {
            Color: 'GREEN',
            Stamp: myTimeStamp,
            Price: closePrice,
            Balance: myBALANCE
        };
        tableData.push(data);

        console.table(tableData[tableData.length-1]);

        consecutiveGreenCount++;
        consecutiveRedCount = 0;

        //console.log(tableData)
    } else {
        //console.log('EMPTY');
    }
}




let resetCounters = () => { currentOpenPoisitionBalance, BTCExitValueAtStart, BTCExitValueAtExit = 0; }




//SET ENTER TRADE DETAILS BEFORE EXIT------
//This gets called once, EXIT trade does the logic
function enterTrade(val){
    const tradeAmount = myBALANCE; //WAS const tradeAmount = myBALANCE * percentage; before
    currentOpenPoisitionBalance = tradeAmount

    console.log('-----------------')
    console.log('ENTERING TRADE WITH $', currentOpenPoisitionBalance)
    console.log('BTC VALUE: ', val, 'CURRENT BALANCE: ', myBALANCE)

    BTCExitValueAtStart = val;
}




function exitTrade(val){
    console.log('-----------------')
    console.log('EXITING TRADE:')
    
    BTCExitValueAtExit = val
  
    checkProfitLoss();

    console.log('BTC VALUE WHEN OPENED: ', BTCExitValueAtStart);
    console.log('BTC VALUE WHEN CLSOED: ', BTCExitValueAtExit);
    console.log('BALANCE AT EXIT ', myBALANCE)

    tradesMade++;
}





function checkProfitLoss(){

    const oldOpenPosition = BTCExitValueAtStart;
    const newClosePosition = BTCExitValueAtExit;
  
    const myOldBal = currentOpenPoisitionBalance;
    const myNewBal = myOldBal * (newClosePosition / oldOpenPosition);
  
    const profitLoss = myNewBal - myOldBal;
    const percentageChange = (profitLoss / myOldBal) * 100; // Calculate percentage change based on profit or loss
  
    if (profitLoss > 0) {
      myBALANCE += profitLoss;
      console.log('PROFIT:', profitLoss.toFixed(8)); // Round the profit to a fixed number of decimal places
    } else if (profitLoss < 0) {
      myBALANCE += profitLoss;
      console.log('LOSS:', profitLoss.toFixed(8)); // Round the loss to a fixed number of decimal places
    } else {
      console.log('No profit or loss');
    }
  
    console.log(`Percentage Change: ${percentageChange.toFixed(2)}%`);
}





async function doTrades(data) {
    try {
        myTradingData.push(data);
       

        checkLoopData(myTradingData[myTradingData.length - 1]);

        //THIS IS BEST FOR HISTORICAL

        //const lastTwoData = myTradingData.slice(-candlesToCheck); // Get the last two elements
        /*
        for (const data of lastTwoData) {
            checkLoopData(data);
        }
        */

        //-------------
        
        // Prepare the information to be returned
        const tradeInfo = {
            inTrade: isInPosition,
            btcOnEnter: BTCExitValueAtStart,
            btcAfterExit: BTCExitValueAtExit,
            balance: myBALANCE,
            tradesMade: tradesMade
        };
        
                return tradeInfo;
    } catch (error) {
        console.error('Error:', error.message);
    }
}



module.exports = { doTrades };

//main();