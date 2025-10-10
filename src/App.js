/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [
      ],
      debitList: [
      ],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  async componentDidMount() {
    try {
      const creditResponse = await fetch('https://johnnylaicode.github.io/api/credits.json');
      const creditData = await creditResponse.json();

      const debitResponse = await fetch('https://johnnylaicode.github.io/api/debits.json');
      const debitData = await debitResponse.json();

      this.setState({
        creditList: [...this.state.creditList, ...creditData],
        debitList: [...this.state.debitList, ...debitData],
      }, () => this.updateAccountBalance()); // Update account balance after all credits and debits are loaded
    }
    catch (error) {
      console.error('Error fetching credit data:', error);
    }
  }

  updateAccountBalance = () => {
    const copyOfCreditList = [...this.state.creditList];
    const creditSum = copyOfCreditList.reduce((total, credit) => total + credit.amount, 0);

    const copyOfDebitList = [...this.state.debitList];
    const debitSum = copyOfDebitList.reduce((total, debit) => total + debit.amount, 0);

    this.setState({
      accountBalance: parseFloat((creditSum - debitSum).toFixed(2))
    });
  }

  addCredit = (e) => {
    e.preventDefault();
    try {
      const description = e.target.description.value.trim();
      const amountInput = e.target.amount.value.trim();

      // Check if amount is a valid number
      const amount = parseFloat(amountInput);
      if (isNaN(amount) || amount < 0) {
        throw new Error("Invalid amount. Please enter a valid positive number.");
      }

      // Check for empty description
      if (!description) {
        throw new Error("Description cannot be empty.");
      }

      const newCredit = {
        description,
        amount: parseFloat(amount.toFixed(2)),
        date: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
      };

      // Update the credit list first
      this.setState(
        { creditList: [...this.state.creditList, newCredit] },
        () => this.updateAccountBalance()
      );

      e.target.reset();
    } catch (error) {
      alert(error.message); 
    }
  };

  addDebit = (e) => {
    e.preventDefault();
    try {
      const description = e.target.description.value.trim();
      const amountInput = e.target.amount.value.trim();

      const amount = parseFloat(amountInput);
      if (isNaN(amount) || amount < 0) {
        throw new Error("Invalid amount. Please enter a valid positive number.");
      }

      if (!description) {
        throw new Error("Description cannot be empty.");
      }

      const newDebit = {
        description,
        amount: parseFloat(amount.toFixed(2)),
        date: new Date().toISOString().split('T')[0],
      };

      this.setState(
        { debitList: [...this.state.debitList, newDebit] },
        () => this.updateAccountBalance()
      );

      e.target.reset();
    } catch (error) {
      alert(error.message);
    }
  };


  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} accountBalance={this.state.accountBalance}/>) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} accountBalance={this.state.accountBalance}/>) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/assignment-3">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;