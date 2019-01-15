import React from 'react';
import { Header, Message } from 'semantic-ui-react';
import autobind from 'autobind-decorator';
import { dismissNotification } from '../../actions/actions';

interface INotificationsProps {
  notifications: Array<any>;
  onNotificationDismiss(): void;
}

export default class NotificationScreen extends React.Component<INotificationsProps, {}> {
  constructor(props: INotificationsProps) {
    super(props);
  }

  @autobind
  private _markAsSeen(id: number) {
    dismissNotification(id).then(() => {
      this.props.onNotificationDismiss();
    })
  }

  public render() {
    const { notifications } = this.props;
    return (
      <div>
        <Header>New notifications</Header>
        {
          notifications.length === 0 &&
          <p>No new notifications</p>
        }
        {
          notifications.map(n => {
            return (
              <Message
                key={n.QuestionId}
                header={n.Question}
                content={n.Answer}
                onDismiss={() => this._markAsSeen(n.QuestionId)}
              />
            );
          })
        }
      </div>
    );
  }
}