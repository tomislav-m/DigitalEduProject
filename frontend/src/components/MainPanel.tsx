import React from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import Professor from '../containers/FAQ/ProfessorPanelContainer';
import Student from '../containers/FAQ/StudentPanelContainer';
import { Task } from '../App';
import FAQ from './FAQ/FAQ';
import autobind from 'autobind-decorator';
import AAOEQ from './AAOEQ/AAOEQ';
import { Question } from '../data/DataStructures';
import NotificationScreen from './FAQ/NotificationScreen';

interface IMainPanelProps {
  task: Task;
  notifications: Array<any>;
  onGoBack(): void;
  onNotificationDismiss(): void;
}

export default class MainPanel extends React.Component<IMainPanelProps, {}> {
  constructor(props: IMainPanelProps) {
    super(props);
  }

  public render() {
    const { task } = this.props;

    return (
      <Grid columns="3">
        <Grid.Column width="2">
          <Button icon labelPosition="left" onClick={this.props.onGoBack}>
            Back<Icon name="arrow left" />
          </Button>
        </Grid.Column>
        <Grid.Column width="13" >
          {
            task === Task.FAQ ?
              <FAQ /> :
              (task === Task.AAOEQ ?
                <AAOEQ /> :
                <NotificationScreen notifications={this.props.notifications} onNotificationDismiss={this.props.onNotificationDismiss} />
              )
          }
        </Grid.Column>
        <Grid.Column width="1" />
      </Grid>
    );
  }
}