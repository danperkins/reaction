import * as React from 'react'

interface AppProps {
  name: string;
}

function StatelessComponent(props: AppProps) {
  return <div className="stateless">Hello World -- I am a {props.name} Component</div>
}

class ClassComponent extends React.Component<AppProps, any> {
  constructor (props) {
    super();
  }
  render() {
    return (
        <div className="classy">Hello World -- I am a {this.props.name} Component</div>
    );
  }
}

export function TestApp() {
  return (
    <div className="testApp">
      <ClassComponent name="Class" />
      <StatelessComponent name="Stateless" />
    </div>
  );
}

export default TestApp
