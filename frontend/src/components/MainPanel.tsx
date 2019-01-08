import React from 'react';
import { Button, Icon, Grid } from 'semantic-ui-react';
import { Mode } from '../App';
import Professor from '../containers/ProfessorPanelContainer';
import Student from '../containers/StudentPanelContainer';

interface IMainPanelProps {
  mode: Mode;
  onGoBack(): void;
}

export default class MainPanel extends React.Component<IMainPanelProps, {}> {
  constructor(props: IMainPanelProps) {
    super(props);
  }

  public render() {
    const { mode } = this.props;

    return (
      <Grid columns="3">
        <Grid.Column width="2">
          <Button icon labelPosition="left" onClick={this.props.onGoBack}>
            Back<Icon name="arrow left" />
          </Button>
        </Grid.Column>
        <Grid.Column width="13" >
          {
            mode === Mode.professors ?
              <Professor /> :
              <Student />
          }
        </Grid.Column>
        <Grid.Column width="1" />
      </Grid>
    );
  }
}