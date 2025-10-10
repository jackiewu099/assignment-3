/*==================================================
src/components/Credits.js

The Credits component contains information for Credits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import {Link} from 'react-router-dom';

const Credits = (props) => {
  return (
    <div>
      <h1>Credits</h1>
      <br/>
      <h2>Credit Display Area</h2>

      <ul className = "credit-list">
        {props.credits.map((credit) => {
          return (
            <li className='credit-item' key={credit.id}> {credit.description}  |  ${credit.amount}  |  {credit.date}</li>
          )
        })}
      </ul>

      <br/>

      <form onSubmit={props.addCredit}className ="add-credit-form">
        <h3>Add Credit</h3>
        <div className = "add-credit-description">
          <label>Description: </label>
          <input type="text" name="description" />
        </div>
        <div className = "add-credit-amount">
          <label>Amount: </label>
          <input type="text" name="amount" />
        </div>
        <button className = "add-credit-button" type="submit">Add Credit</button>
      </form>

      <br/>

      <h3>Account Balance: ${props.accountBalance}</h3>

      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Credits;