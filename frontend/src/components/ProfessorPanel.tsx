import React from 'react';
import { Container, List, Segment, Button, Icon } from 'semantic-ui-react';

interface IStudentProps {
  questions: Array<string>;
}

export default class ProfessorPanel extends React.Component<IStudentProps, {}> {
  constructor(props: IStudentProps) {
    super(props);
  }

  public render() {
    const { questions } = this.props;
    return (
      <Container className="question-center">
        {
          questions.map((q, index) => {
            return (
              <Segment key={index} className="question-center" clearing>
                {q}
                <Button floated="right" color="green">
                  <Icon name="exclamation" /> Answer
                </Button>
              </Segment>
            );
          })
        }
      </Container>
    );
  }
}