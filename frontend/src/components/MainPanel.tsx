import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { Mode } from '../App';

interface IMainPanelProps {
  mode: Mode;
  onGoBack(): void;
}

export default class MainPanel extends React.Component<IMainPanelProps, {}> {
  constructor(props: IMainPanelProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Button icon labelPosition="left" onClick={this.props.onGoBack}>
          Back<Icon name="arrow left" />
        </Button>
        <p>
          {Mode[this.props.mode]}
        </p>
      </div>
    );
  }
}