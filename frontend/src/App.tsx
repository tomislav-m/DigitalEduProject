import React from 'react';
import MicrosoftLogin from "react-microsoft-login";
import autobind from 'autobind-decorator';
import { Menu, Container, Button, Popup } from 'semantic-ui-react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import MainPanel from './components/MainPanel';
import { getNotifications } from './actions/actions';
import { Question } from './data/DataStructures';

interface IAppState {
  isLoggedIn: boolean;
  task?: Task;
  user?: UserData;
  questions: Array<Question>;
}

export enum Task {
  'FAQ' = 1,
  'AAOEQ' = 2
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
    isLoggedIn: false,
    questions: []
  };

  public componentDidUpdate({ }, prevState: IAppState) {
    if (this.state.user != prevState.user) {
      this._getNotifications();
    }
  }

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
  private _onTaskSet(task: Task) {
    this.setState({ task });
  }

  @autobind
  private _resetTask() {
    if (this.state.task) {
      this.setState({ task: undefined });
    }
  }

  @autobind
  private _getNotifications() {
    this.state.user && getNotifications(this.state.user.mail.toLocaleLowerCase()).then(notifications => {
      this.setState({
        questions: notifications
      });
    });
  }

  @autobind
  private _renderNavigation() {
    const { isLoggedIn, user, questions } = this.state;
    const message = `${questions.length > 0 ? questions.length + " new" : "No new"} answers to your questions`;
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as='a' header onClick={this._resetTask}>
              Dialogflow Project
            </Menu.Item>
            {isLoggedIn && user &&
              <Menu.Item position="right">
                {`Hello ${user.givenName} ${user.surname}`}
                <Popup
                  basic
                  content={message}
                  trigger={
                    <Button className="notification-button">{questions.length}</Button>
                  }
                />
              </Menu.Item>
            }
          </Container>
        </Menu>
      </div>
    );
  }

  render() {
    const { isLoggedIn, task } = this.state;
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
    } else if (task) {
      content =
        <MainPanel onGoBack={this._resetTask} task={task} />;
    } else {
      content =
        <div className="loginButton">
          <Button size="huge" content="FAQ" onClick={() => this._onTaskSet(Task.FAQ)} />
          <Button size="huge" content="AAOEQ" onClick={() => this._onTaskSet(Task.AAOEQ)} />
        </div>
    }

    return (
      <div>
        {this._renderNavigation()}
        <Container className="content-container">
          {content}
        </Container>
      </div>
    );
  }
}

export default App;
