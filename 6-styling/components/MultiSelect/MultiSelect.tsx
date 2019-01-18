import * as React from 'react';
import axios from 'axios';

import './MultiSelect.less';

export class MultiSelect extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggleOpen = () => {
      this.setState({
          open: !this.state.open
      });
  };

  onItemToggled(item) {
      this.props.onItemToggled(item);
  }

  render() {
    let items = null;
    if (this.props.items && this.state.open) {
        items = this.props.items.map(i => (
            <div className={`item ${i.selected ? 'toggled' : ''}`} key={name} onClick={() => this.onItemToggled(i)}>
                {`${i.name}`}
            </div>
        ));
    }

  
    return (
      <div className='multiSelect'>
          <div className='toggle' onClick={this.toggleOpen}></div>
          {
            items
            ? <div className='flyout'>
                { items }
              </div>
            : null
          }

      </div>

    );
  }
}
