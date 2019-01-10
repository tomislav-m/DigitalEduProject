import React from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import Professor from '../containers/FAQ/ProfessorPanelContainer';
import Student from '../containers/FAQ/StudentPanelContainer';
import { Task } from '../App';
import FAQ from './FAQ/FAQ';
import autobind from 'autobind-decorator';

interface IMainPanelProps {
  task: Task;
  onGoBack(): void;
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
                <div></div> :
                <div></div>
              )
          }
        </Grid.Column>
        <Grid.Column width="1" />
      </Grid>
    );
  }
}