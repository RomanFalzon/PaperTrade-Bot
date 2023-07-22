const candlesToCheck = 2;
let myTradingData = [];

let consecutiveGreenCount = 0;
let consecutiveRedCount = 0;

let isInPosition = false;

let myBALANCE = 20000;
let percentage = 0.10;

let currentOpenPoisitionBalance = 0;

let valueAtEnterPosition = 0;
let valueAtExitPosition = 0;


function checkLoopData(data) {
    //Get open price and close price
    const openPrice = parseFloat(data[1]);
    const closePrice = parseFloat(data[4]);

    //Check candle
    if (openPrice > closePrice) {
        console.log('RED');
        consecutiveRedCount++;
        consecutiveGreenCount = 0;
     } else if (openPrice < closePrice) {
        console.log('GREEN');
        consecutiveGreenCount++;
        consecutiveRedCount = 0;
    } else {
        //console.log('EMPTY');
    }


    //Call positions based on check candle
    if (consecutiveGreenCount === candlesToCheck && !isInPosition) {
        //console.log('Enter signal');
        isInPosition = true;

        //ENTER SINGAL
        enterTrade(openPrice);
        consecutiveGreenCount = 0; //Reset Counter
    }

    if (consecutiveRedCount === candlesToCheck && isInPosition) {
        //console.log('Exit signal');
        isInPosition = false;

        //EXIT SINGAL
        exitTrade(closePrice);
        resetCounters();
        
        consecutiveRedCount = 0; //Reset Counter
    }
}

function resetCounters(){

    consecutiveGreenCount = 0;
    consecutiveRedCount = 0;

    currentOpenPoisitionBalance = 0;

    valueAtEnterPosition = 0;
    valueAtExitPosition = 0;

}


function enterTrade(valueAtEnter){
    const tradeAmount = myBALANCE * percentage;
    currentOpenPoisitionBalance = tradeAmount

    console.log('-----------------')
    console.log('ENTERING TRADE:')
    console.log('BTC VALUE: ', valueAtEnter)

    valueAtEnterPosition = valueAtEnter;
}




function exitTrade(valueAtExit){
    console.log('-----------------')
    console.log('EXITING TRADE:')
    
    //console.log('BALANCE AT ENTER ', myBALANCE)
    valueAtExitPosition = valueAtExit
  
    checkProfitLoss()

    console.log('BALANCE AT EXIT ', myBALANCE)

    //console.log('---')
}

function checkProfitLoss(){
    const oldOpenPosition = valueAtEnterPosition;
    const newClosePosition = valueAtExitPosition;
    
    const myOldBal = currentOpenPoisitionBalance;
    const myNewBal = myOldBal * (newClosePosition / oldOpenPosition);
    
    const profitLoss = myNewBal - myOldBal;
    const percentageChange = ((newClosePosition - oldOpenPosition) / oldOpenPosition) * 100;
    
    if (profitLoss > 0) {
        myBALANCE += profitLoss;
        console.log('PROFIT:', profitLoss);
    } else if (profitLoss < 0) {
        myBALANCE += profitLoss;
        console.log('LOSS:', profitLoss);
    } else {
        console.log('No profit or loss');
    }
    
    console.log(`Percentage Change: ${percentageChange.toFixed(2)}%`);
}





async function doTrades(data) {
    try {
        myTradingData.push(data);
        const lastTwoData = myTradingData.slice(-candlesToCheck); // Get the last two elements
        for (const data of lastTwoData) {
            checkLoopData(data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}



module.exports = { doTrades };

//main();