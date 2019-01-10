import React from 'react';
import { Grid, Button, Icon } from 'semantic-ui-react';
import ProfessorPanelContainer from '../../containers/FAQ/ProfessorPanelContainer';
import StudentPanelContainer from '../../containers/FAQ/StudentPanelContainer';
import autobind from 'autobind-decorator';

export enum FAQMode {
  'professors' = 1,
  'students' = 2
}

interface IFAQProps {
  //onGoBack(): void;
}

interface IFAQState {
  mode?: FAQMode;
}

export default class FAQ extends React.Component<IFAQProps, IFAQState> {
  constructor(props: IFAQProps) {
    super(props);

    this.state = {
      mode: undefined
    }
  }

  @autobind
  private _onModeSet(mode: FAQMode) {
    this.setState({ mode });
  }

  @autobind
  private _resetMode() {
    if (this.state.mode) {
      this.setState({ mode: undefined });
    }
  }

  public render() {
    const { mode } = this.state;

    return (
      <Grid columns="2">
        <Grid.Column width="15" >
          {
            mode && (mode === FAQMode.professors ?
              <ProfessorPanelContainer /> :
              <StudentPanelContainer />)
          }
          {
            !mode &&
            <div className="loginButton">
              <Button size="huge" content="Professors" onClick={() => this._onModeSet(FAQMode.professors)} />
              <Button size="huge" content="Students" onClick={() => this._onModeSet(FAQMode.students)} />
            </div>
          }
        </Grid.Column>
        <Grid.Column width="1" />
      </Grid>
    );
  }
}