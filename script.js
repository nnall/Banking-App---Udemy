'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-03-15T23:36:17.929Z', //day before yesterday
    '2022-03-20T10:51:36.790Z', // yesterday
  ],
  style: 'currency',
  currency: 'EUR',
  locale: 'pt-PT', //'de-DE',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  style: 'currency',
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const now = new Date();
const optionsDisplay = {
  hour: 'numeric',
  minute: 'numeric',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  weekday: 'long',
};

const optionsToday = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const optionsYesterday = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

// const optionsCurrency = {
//   style: 'currency',
//   currency: `${acc.currency}`,
// };

// const locale = navigator.language;
/*
const month = `${now.getMonth() + 1}`.padStart(2, '0');
const day = `${now.getDate()}`.padStart(2, '0');
const year = now.getFullYear();

const hour = `${now.getHours()}`.padStart(2, '0');
const minutes = `${now.getMinutes()}`.padStart(2, '0').padEnd(2, '0');
*/

const formatCur = (value, locale, currency) =>
  new Intl.NumberFormat(locale, currency).format(value.toFixed(2));

//////////////////////// DISPLAY MOVEMENTS /////////////////////////

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const evenRows = n => n % 2 === 0;

  const origMvmts = acc.movements;

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : origMvmts;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = function (mvmtDate) {
      /*
      const mvmtMonth = `${new Date(mvmtDate).getMonth() + 1}`.padStart(2, '0');
      const mvmtDay = `${new Date(mvmtDate).getDate()}`
        .padStart(2, '0')
        .padEnd(2, '0');
      const mvmtYear = `${new Date(mvmtDate).getFullYear()}`;
      const mvmtHour = `${new Date(mvmtDate).getHours()}`;
      const mvmtMinute = `${new Date(mvmtDate).getMinutes()}`;
      */
      const calcDaysPassed = (date1, date2) =>
        (date2 - date1) / (1000 * 60 * 60 * 24);

      const daysPassed = Math.round(calcDaysPassed(new Date(mvmtDate), now));
      // console.log(daysPassed);

      if (daysPassed < 1) {
        return `Today, at ${
          /*`${new Date().getHours()}`.padStart(
          2,
          '0'
        )}:${new Date().getMinutes()}`
          .padStart(2, '0')
        .padEnd(2, '0');*/
          Intl.DateTimeFormat(acc.locale, optionsToday).format(
            new Date(mvmtDate)
          )
        }`;
      } else if (daysPassed >= 1 && daysPassed < 3) {
        return `Yesterday, ${
          /*mvmtHour}:${mvmtMinute*/ Intl.DateTimeFormat(
            acc.locale,
            optionsYesterday
          ).format(new Date(mvmtDate))
        }`;
      } else
        return `${Intl.DateTimeFormat(acc.locale).format(new Date(mvmtDate))}`;
    };

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      sort ? origMvmts.indexOf(mov) + 1 : i + 1
    } ${type}</div>
        <div class="movements__date">${date(
          sort
            ? acc.movementsDates[origMvmts.indexOf(mov)]
            : acc.movementsDates[i]
        )}</div> 
        
        <div class="movements__value">${formatCur(mov, acc.locale, acc)}</div> 
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

    document.querySelector('.movements__row').style.backgroundColor = evenRows(
      i
    )
      ? '#fff'
      : '#e8e8e8';
  });
};

//////////////////////// SORT BUTTON /////////////////////////

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//////////////////////// DISPLAY BALANCE /////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc);
};

//////////////////////// DISPLAY IN, OUT INTEREST /////////////////////////

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc);
};

//////////////////////// DISPLAY DATE /////////////////////////

const displayDate = function (acc) {
  /*labelDate.textContent = `${month}/${day}/${year} at ${hour}:${minutes}`;*/
  labelDate.textContent = new Intl.DateTimeFormat(
    acc.locale,
    optionsDisplay
  ).format(now);
};
//////////////////////// TIMER /////////////////////////

//////////////////////// BACKEND: CREATE ACCT USERNAMES ////////////////////

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//////////////////////// UPDATE UI /////////////////////////

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  displayDate(acc);
};

///////////////////////////////////////
// Event handlers

//////////////////////// LOGIN BUTTON /////////////////////////

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

    /////////////// AUTO-LOGOUT TIMER //////////////////

    const startLogoutTimer = function () {
      //sett time to 5:00
      //call the timer every second
      //print remaining time to user interface
      //when time expires (0), stop timer and log out user
      const tick = function () {
        let min = Math.trunc(totalTimeSeconds / 60);
        let sec = String(totalTimeSeconds % 60).padStart(2, '0');
        labelTimer.textContent = `${min}:${sec}`;

        if (totalTimeSeconds === 0) {
          clearInterval(timer);

          containerApp.style.opacity = 0;
          labelWelcome.textContent = 'Log in to get started';
        } else {
          totalTimeSeconds--;
        }
      };
      let totalTimeSeconds = 30;

      tick(); // not really a timer, just displays starting time and subtracts 1 second, happpens right away at login..
      timer = setInterval(tick, 1000); //real timer, repeats 'tick' over and over..
      return timer; // returns IntervalID of setInterval(), to know if timer was started
    };

    //////////// CHeck if timer was already running (signing into dif acct) //////////////

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // function checkTimer(){
    //   startLogoutTimer() ? return : startLogoutTimer();
    // }

    // let min2 = `${number2.getMinutes()}`.padStart(2, '0');
    /*
    setInterval(() => {
      labelTimer.textContent = `${minutes}:${seconds}`;
      minutes--;
    }, 60000);

    setInterval(() => {
      labelTimer.textContent = `${minutes}:${seconds}`;
      seconds--;
      seconds = `${seconds}`.padStart(2, '0');
    }, 1000);

    setTimeout(() => {
      // What HAPPENS after 5:00
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }, 30000);
    */
  }
});

//////////////////////// TRANSFER MONEY /////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = ''; //clear the inputs after clicking

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    //push into currentAccount.movementsDates

    // Update UI
    updateUI(currentAccount);

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

//////////////////////// LOAN BUTTON /////////////////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  setTimeout(() => {
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }
  }, 5000);
  inputLoanAmount.value = '';
});

//////////////////////// CLOSE ACCOUNT /////////////////////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

///// Lecture 170 - Numbers

console.log(23 === 23.0);

console.log(0.1 + 0.2);

console.log(0.3);

// Precise number calculations (ex; financial) CANNOT be relied upon with JavaScript, because eventually a false output will result

console.log(0.2 + 0.1 === 0.3); //<-- comes back FALSE even though TRUE

//// Type Coercion

console.log('This is a ' + 23);

console.log(40 + '30');

console.log(40 + +'30');

console.log(40 - '30');
console.log('4030' - '30');

console.log('40' - 10);

//// Parsing

console.log(Number.parseInt('30px'));

console.log(Number.parseInt('px30'));

//// The 'RADIX' parameter - which 'Base' System to reference (10 (default) vs 2)

console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('30px', 2));
console.log(Number.parseInt('1px', 2));

//// Number.parseFloat()

console.log(Number.parseInt('3.5px', 10));
console.log(Number.parseFloat('3.5px', 10));
console.log(Number.parseFloat('3px', 10));

//leading spaces don't affect anything

console.log(Number.parseInt('  35rem', 10));

/// .parseInt() & .parseFloat() are GLOBAL functions

console.log(parseInt('150rem', 10));

//// Number.isNaN()

//tests if the thing inside the parentheses will result in the 'NaN error'

console.log(Number.isNaN(20));
console.log(Number.isNaN('20')); //

console.log(Number.isNaN('20X'));

console.log(Number.isNaN('abc'));

console.log(Number.isNaN(+'abc'));

console.log(Number.isNaN(+'20x'));

//// Number.isFinite()
// tests whether the thing in the parentheses is a Number data-type

console.log(Number.isFinite('20'));

console.log(Number.isFinite(+'20'));

console.log(Number.isFinite(20 / 0));
console.log(Number.isFinite(2 / 3)); //
console.log(Number.isFinite(0.1 + 0.2));

console.log(Number.isFinite(+'20X'));

//// Number.isInteger()
//
console.log(Number.isInteger(2.5));
console.log(Number.isInteger(2 / 3));

//// Lecture 171 - Math and Rounding

// Square Root - Math.sqrt()

console.log(Math.sqrt(25));
//Cubic root or greater
console.log(8 ** (1 / 3)); // 2 * 2 * 2 = 8

// Math.min() /Math.max()

console.log(Math.max(5, 18, '23', 10, 11)); // it coerces but doesn't 'parse'

// Math.PI()
// Calculate Area of a circle with radius (10px)

console.log(Math.PI * Number.parseFloat('10px') ** 2);

//Math.random()
// Random Integer generator function - given a 'bottom' and 'top' number

//Dice Roll

console.log(Math.trunc(Math.random() * 6) + 1);

const dice = () => Math.trunc(Math.random() * 6) + 1;

console.log('Dice roll number is ' + dice());

// Random Number Generator, given specific range of numbers

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

console.log(randomInt(-8, -3));

/// Math.round()
console.log(Math.round(1.23));

// Math.ceil()

console.log(Math.ceil(24.2));

// Math.floor()

console.log(Math.floor(24.9));

console.log(Math.ceil(1));

//// Rounding Decimals - .toFixed()

console.log((2.7).toFixed(0));
console.log((2.345).toFixed(0));

console.log('word'.toUpperCase());

///// Lecture 172 - The Remainder Operator - %

console.log(12 / 7);
console.log(12 % 7);

const isEven = n => n % 2 === 0;

console.log(isEven(26));
console.log(isEven(25));

//// Lecture 173 : Numeric Seperators

const diameter = 287_460_000_000;
console.log(diameter);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

console.log(transferFee1);
console.log(transferFee2);

///// Lecture 174 - .bigInt()

console.log(2 ** 53 - 1);
console.log(2 ** 53);

console.log(1234123412341234123412341234n);
console.log(typeof BigInt('1234123412341234123412341234'));

console.log(typeof 12345n);

///Operations
const huge = 123412341234123412341234n;
const num = 2;
console.log(huge * BigInt(num));

console.log(20n / 2n);
console.log(20n - 5n);

console.log(20n < 40);

console.log(20n <= 20);

console.log(20n == '20');

console.log(huge + ' is a really big number.');

console.log(huge - BigInt(4));

console.log(10 / 3);
console.log(10n / 3n);
console.log(3n / 2n);

//// Dates

const nowThis = new Date();
console.log(nowThis);

/// feed it a portion date string

console.log(new Date('December 25, 1965'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 16, 12, 45, 15));

console.log(new Date(0));

//////
console.log('-------- the .get methods---------');
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());

console.log('------- The ISO format -------');
console.log(future.toISOString());

console.log('------- UTC Time/TimeStamps -------');

console.log(new Date().getTime()); // milliseconds from 1/1/1970 to NOW
console.log(future.getTime()); // milliseconds from 1/1/1970 to 'future'

console.log(new Date(2142278580000));

/// Resetting parameters "properties" (?) of a Date

future.setFullYear(2040);
console.log(future);

const isoString = future.toISOString();
console.log(isoString);

console.log(new Date(future.toISOString()));
console.log(new Date('2040-11-19T21:23:00.000Z').getMonth());

// console.log(future.toISOString().getMonth());

const today = new Date().toISOString();

console.log(today);
// console.log(new Date().toISOString());

// console.log(today === new Date().toISOString());

// console.log(typeof today);

const taday = new Date().toISOString();

// setInterval(() => {
//   console.log(taday);
//   console.log(new Date().toISOString());
// }, 200);

// clearInterval();

///// Lecture 177 - performing Operations with Dates

console.log(new Date().getTime());
console.log(+new Date());
console.log(Number(new Date()));

const calcDaysPassed = (date1, date2) =>
  (date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));

console.log(days1);

//// Lecture 179 - Internationalizing Numbers

const numbr = 3884764.23;

const options = {
  style: 'unit',
  unit: 'mile-per-hour',
};

console.log('US:', new Intl.NumberFormat('en-US').format(numbr));
console.log('Germany:', new Intl.NumberFormat('de-DE').format(numbr));
console.log('Syria:', new Intl.NumberFormat('ar-SY').format(numbr));
console.log('US:', new Intl.NumberFormat('en-US', options).format(numbr));

const numbr2 = 345.67;
const allOptions2 = {
  locale: 'de-DE',
  style: 'currency',
  currency: 'EUR',
  // useGrouping: false,
};

console.log(
  new Intl.NumberFormat(allOptions2.locale, allOptions2).format(numbr2)
);

////Lecture 180n - Timers - .setTimout() and .setInterval()

// setTimeout()

const ingredients = ['olives', 'mushrooms'];
const pizza = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pizza with ${ing1} and ${ing2}!`),
  3000,
  ...ingredients
);
console.log('waiting');

if (ingredients.includes('mushrooms')) clearTimeout(pizza);

// setInterval()
/*
setInterval(() => {
  const now = new Date();

  console.log(now);
}, 1000);
*/
///// Buld a clock challenge

// const time = new Date();

// setInterval(() => {
//   console.log(
//     `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
//   );
// }, 1000);

//// Lecture 181 - Building the Bank App 'timer' auto-logout

// getting seconds to go backwards instead of forwards
// setting a fixed time to work from (5:00, instead of just 'new Date()')
// //

// let number = 100;
// setInterval(() => {
//   console.log(number);
//   number -= 1;
// }, 1000);

let number2 = new Date(0, 0, 0, 4, 2);
let hour2 = `${number2.getHours()}`.padStart(2, '0');
let min2 = `${number2.getMinutes()}`.padStart(2, '0');

console.log(`${hour2}:${min2}`);

// const consoleThis = setInterval(() => console.log('This'), 1000);

const consoleTheVariable = function () {
  console.log(theVariable);
};

const theVariable = 'a word';

consoleTheVariable();

const thisOne = setInterval(console.log('hey there'), 1000);

let timey;

const housingFunction = function () {
  timey = setInterval(console.log('timey'), 1000);
  return timey;
};

console.log(housingFunction());

const setIntervalFunc = function () {
  const timey2 = setInterval(console.log('hello'), 1000);
  return timey2;
};

console.log(setIntervalFunc());

const itsAFunction = function () {
  console.log('function executed');
};

const writeSomething = function () {
  console.log('something');
};

const varForAFunction = itsAFunction();

const var2ForAFunction = writeSomething();
