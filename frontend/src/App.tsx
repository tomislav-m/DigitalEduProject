import React from 'react';
import MicrosoftLogin from "react-microsoft-login";
import autobind from 'autobind-decorator';
import { Menu, Container } from 'semantic-ui-react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

interface IAppState {
  isLoggedIn: boolean;
  user?: UserData;
}

interface UserData {
  id: string;
  givenName: string;
  surname: string;
  mail: string;
  userPrincipalName: string;
  accessToken: string;
}

class App extends React.Component<{}, IAppState> {
  public state: IAppState = {
    isLoggedIn: false
  };

  @autobind
  private _onLogin(error: any, authData: any) {
    console.log(authData);
    if (error) {
      console.log(error);
    } else if (authData) {
      this.setState({
        isLoggedIn: true,
        user: authData
      });
    }
  }

  @autobind
  private _renderNavigation() {
    const { isLoggedIn, user } = this.state;
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as='a' header>
              Dialogflow Project
            </Menu.Item>
            {isLoggedIn && user &&
              <Menu.Item position="right">
                {`Hello ${user.givenName} ${user.surname}`}
              </Menu.Item>
            }
          </Container>
        </Menu>
      </div>
    );
  }

  render() {
    const { isLoggedIn } = this.state;
    let content: any;

    if (!isLoggedIn) {
      content =
        <div className="loginButton">
          <MicrosoftLogin
            clientId="8379d8d0-fcb2-45b2-ae72-d8802552374d"
            authCallback={this._onLogin}
            withUserData={true}
          />
        </div>
    }

    return (
      <div>
        {this._renderNavigation()}
        <Container style={{ marginTop: '7em' }}>
          {content}
        </Container>
      </div>
    );
  }
}

export default App;
