import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

  async function callAPI(principleId, responseId){
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"principleId":principleId, "responseId":responseId});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
                
    var resBody;
    // make API call with parameters and use promises to get response
    fetch("https://epphgl0p65.execute-api.us-east-1.amazonaws.com/dev", requestOptions)
    .then(res => res.json())
    .then(data => resBody = data)     
    .then(() => document.getElementById('hPrinciple').innerHTML = JSON.parse(resBody.body).principle)
    .then(() => document.getElementById('hDescription').innerHTML = JSON.parse(resBody.body).description)
    .then(() => document.getElementById('pSituation').innerHTML = JSON.parse(resBody.body).situation)
    .then(() => document.getElementById('pTask').innerHTML = JSON.parse(resBody.body).task)
    .then(() => document.getElementById('pAction').innerHTML = JSON.parse(resBody.body).action)
    .then(() => document.getElementById('pResult').innerHTML = JSON.parse(resBody.body).result)
    .then(() => console.log(resBody))       
    .catch(error => console.log('error', error));
  }

  return authState === AuthState.SignedIn && user ? (        
      <div className="App">
          <div>Hello, {user.username}</div>
          <form>
            <label>Principle:</label>
            <select id="sPrinciple" name="principles">
                <option value="customerobsession">Customer Obsession</option>
                <option value="ownership">Ownership</option>
                <option value="invent">Invent and Simplify</option>
                <option value="right">Are Right, A Lot</option>
                <option value="learn">Learn and Be Curious</option>
                <option value="hire">Hire and Develop the Best</option>
                <option value="standards">Insist on the Highest Standards</option>
                <option value="thinkbig">Think Big</option>
                <option value="action">Bias for Action</option>
                <option value="frugality">Frugality</option>
                <option value="trust">Earn Trust</option>
                <option value="deep">Dive Deep</option>
                <option value="backbone">Have Backbone; Disagree and Commit</option>
                <option value="deliver">Deliver Results</option>
                <option value="bestemployer">Strive to be Earth???s Best Employer</option>
                <option value="responsibility">Success and Scale Bring Broad Responsibility</option>
            </select>                    
            <button type="button" onClick={() => callAPI(document.getElementById('sPrinciple').value, '1')}>Get STAR response</button>
          </form>
          <h1 id="hPrinciple"></h1>
          <h2 id="hDescription"></h2>    
          <p id="pSituation"></p>
          <p id="pTask"></p>
          <p id="pAction"></p>
          <p id="pResult"></p>

          <AmplifySignOut />
      </div>
    ) : (
      <AmplifyAuthenticator>
        <AmplifySignIn slot="sign-in" hideSignUp></AmplifySignIn>>
      </AmplifyAuthenticator>
  );
}

export default AuthStateApp;