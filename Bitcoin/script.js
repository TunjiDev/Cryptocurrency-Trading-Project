'use strict';
//REGISTER/SIGN UP FUNCTIONALITY - From line 67
// DISPLAYING THE BALANCE IN THE WALLET - 110
//IMPLEMENTING THE TIMER FUNCTIONALITY - 136
//EVENT HANDLERS - 166
//LOGIN FUNCTIONALITY - 170
//SELLING COINS FUNCTIONALITY - 197
//BUYING COINS FUNCTIONALITY - 222
//LOGGING OUT FUNCTIONALITY - 248
//FETCHING THE PRICES IN DOLLAR & NAIRA FROM API - 261

// Elements
const loginBtn = document.querySelector('#login');
const signupBtn = document.querySelector('#signup');
const requestDiv = document.querySelector('.responsetext');
const welcomeLabel = document.querySelector('.welcomeLogin');
const labelBalance = document.querySelector('.balance__value');
const converted = document.querySelector('.converted');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelTimer = document.querySelector('.timer');

const sectionContainer = document.querySelector('.sectionContainer');
const containerMovements = document.querySelector('.movements');
const currentPrice = document.querySelector('.currentPrice');
const currentPriceNGN = document.querySelector('.currentPriceNGN');
const baseText = document.querySelector('.baseText');
const targetText = document.querySelector('.targetText');
const priceText = document.querySelector('.priceText');
const baseText2 = document.querySelector('.baseText2');
const targetText2 = document.querySelector('.targetText2');
const priceText2 = document.querySelector('.priceText2');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnBuy = document.querySelector('.form__btn--buy');
const btnClose = document.querySelector('.form__btn--close');

const username = document.getElementById('username');
const password = document.getElementById('password');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputBuyAmount = document.querySelector('.form__input--buy-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePassword = document.querySelector('.form__input--pin');

// Data
const user1 = {
  owner: 'tunji',
  transactions: [0.01, 0.02, -1.00, 1.90, -0.50, -1.00, 0.19, 1.12],
  password: 'tunji1111',
};

const user2 = {
  owner: 'divine',
  transactions: [1.80, 1.10, -1.50, -1.09, 1.11, -1.04, 1.01, 0.09],
  password: 'divine2222',
};

const user3 = {
  owner: 'daniel',
  transactions: [1.10, -2.01, 1.04, -1.00, -1.27, 1.09, 1.05, 1.00],
  password: 'daniel3333',
};

const users = [user1, user2, user3];

//Register/Signup functionality
const signup = function() {
    let registerUser = document.getElementById('newUser').value;
    let registerPassword = document.getElementById('newPassword').value;
    let newUser = {
        owner: registerUser,
        password: registerPassword,
        transactions: [4000, 2400, -250, -990, -1210, -8000, 7500, -10],
    };

    for (let i = 0; i < users.length; i++) {
        if (registerUser === users[i].owner) {
            alert('That username is already taken, please choose another');
            return;
        } else if (registerPassword.length < 8) {
            alert('That password is too short, include 8 or more characters');
            return;
        }
    }
    users.push(newUser);
    alert('Registration Successful!');
    console.log(users);
};

const displayMovements = function(transactions, sort = false) {
    containerMovements.innerHTML = '';

    const trans = (sort) ? transactions.slice().sort((a, b) => a - b) : transactions;

    trans.forEach(function(tran, i) {
        const type = tran > 0 ? 'buy' : 'sell';

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${tran} BTC</div>
        </div>
        `;

        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

//Displaying the Balance the users have in their Wallet
const calcDisplayBalance = function(acc) {
    acc.balance = acc.transactions.reduce((acc, tran) => acc + tran, 0);
    labelBalance.textContent = `${acc.balance.toFixed(2)} BTC`;
};

//Displaying the Total Income & Outcome of the User's account
const calcDisplaySummary = function(transactions) {
    const incomes = transactions.filter(tran => tran > 0).reduce((acc, tran) => acc + tran, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)} BTC`;

    const outcomes = transactions.filter(tran => tran < 0).reduce((acc, tran) => acc + tran, 0);
    labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))} BTC`;
};

const updateUI = function(acc) {
     //Display transactions
     displayMovements(acc.transactions);

     //Display balance
     calcDisplayBalance(acc);

     //Display summary
     calcDisplaySummary(acc.transactions);
}

//Implmenting the Timer functionality
const startLogOutTimer = function() {
    const tick = function() {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        //In each call, print the remaining time to the UI
        labelTimer.textContent = `${min}:${sec}`;

        //When 0 seconds, stop timer and log out user
        if (time === 0) {
            clearInterval(timer);
            welcomeLabel.textContent = 'Login to get started';
            sectionContainer.style.opacity = 0;
        }

        //Decrease 1 second every second
        time--;
    };

    //Set time to 5 minutes
    let time = 300;

    //Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    
    return timer;
};

//EVENT HANDLERS
let currentUser, timer;
signupBtn.addEventListener('click', signup);

//Implementing the Login functionality
loginBtn.addEventListener('click', function() {
    currentUser = users.find(user => user.owner === username.value);
    console.log(currentUser);

    if (currentUser && currentUser.password === password.value) {
     //Display UI and message
     welcomeLabel.textContent = `Welcome, ${currentUser.owner}`;
     sectionContainer.style.opacity = 100;

     //Clear input fields
     username.value = password.value = '';

     //Timer
     if (timer) {
        clearInterval(timer);
     }
     timer = startLogOutTimer();

     //Update UI
     updateUI(currentUser);
    }
    else {
        alert('Incorrect Username or Password OR the account may have been deleted');
    }
});

//Selling bitcoin functionality
btnTransfer.addEventListener('click', function(e) {
    // Prevent form from submitting
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = users.find(acc => acc.owner === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';

    //This is to ensure that we can't transfer negative values to other users
    //and to also ensure that the balance from the users' wallet needs to be greater or equal the amount that we're trying to transfer
    //and also to ensure that we cannot transfer bitcoins to our own account.
    if (amount > 0 && receiverAcc && currentUser.balance >= amount && receiverAcc.owner !== currentUser.owner) {
        //Doing the transfer
        currentUser.transactions.push(-amount);
        receiverAcc.transactions.push(amount);

        //Update UI
        updateUI(currentUser);

        //Reset the timer
        clearInterval(timer);
        timer = startLogOutTimer();
    }
});

//Buying bitcoin functionality
btnBuy.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = Number(inputBuyAmount.value);

    if (amount > 0 && currentUser.balance >= amount) {

        //Add transactions
        currentUser.transactions.push(amount);

        //Update UI
        updateUI(currentUser);
    }
    if (amount > 0 && currentUser.balance < amount) {
        alert('Insufficient Coins');
    }
    
    //Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();

    //Clear input field
    inputBuyAmount.value = '';
});

//Logging Out functionality
btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    if(inputCloseUsername.value === currentUser.owner && inputClosePassword.value === currentUser.password) {

        //Logout the user by hiding the UI
        sectionContainer.style.opacity = 0;
        welcomeLabel.textContent = 'Log in to get started';
    }
    inputCloseUsername.value = inputClosePassword.value = '';
});

////GETTING THE PRICES OF BITCOIN IN DOLLARS AND NAIRA
//American Price
const request = new XMLHttpRequest();
request.open('GET', 'https://api.cryptonator.com/api/full/btc-usd');
request.send();

request.addEventListener('load', function() {
    const data = JSON.parse(this.responseText);
    currentPrice.textContent = data.ticker.price;
    const { ticker } = data;
    baseText.textContent = ticker.base;
    targetText.textContent = ticker.target;
    priceText.textContent = ticker.price;
    // console.log(data);
});
//Nigerian Price
const requestNGN = new XMLHttpRequest();
requestNGN.open('GET', 'https://api.cryptonator.com/api/full/btc-ngn');
requestNGN.send();

requestNGN.addEventListener('load', function() {
    const data = JSON.parse(this.responseText);
    currentPriceNGN.textContent = data.ticker.price;
    const { ticker } = data;
    baseText2.textContent = ticker.base;
    targetText2.textContent = ticker.target;
    priceText2.textContent = ticker.price;
    //Converting the coins the naira and displaying it in the users wallet
    setInterval(() => {
        converted.textContent = `₦${(Number(currentPriceNGN.textContent) * Number.parseFloat(labelBalance.textContent)).toFixed(2)}`;
        // console.log(converted.textContent);
    }, 5000);
    // console.log(data);
});