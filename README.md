PaperTrade bot.
    Uses my BinanceAPI JS https://github.com/RomanFalzon/BinanceAPI


Once new candle is detected, it updates the dates to check for new candle, pushes to array

backTestingLive.js
    LIVE bot has the interval and is a server. Does not trade, only checks candles, stores data, passes data to bot

backTestingBot.js
    Logic of bot.

NOTE: As a server, the variables need to be cleared such as in the API on each call. The data should be stored in the BOT variable for checking. (TODO)

TO DO:
    -   Add a function that gets the last candle from the array
        Pass that candle to the trading bot for logic check

        ALT SOLUTION: Instead of passing the .length-1 of the full array, can just pass the return data of the lass API call ONCE new candle been detected(Close Value finished)

    -   Additional optimizataion to BOT and API