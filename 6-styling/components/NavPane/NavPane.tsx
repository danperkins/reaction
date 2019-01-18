import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dumbbell from '../../customElements/Dumbbell';
import './NavPane.less';

export var NavRef = null;

var navObservable = null;

function registerPortalObserver(f) {
    navObservable = f;
}

export class NavPane extends React.Component<any, any>{

    bindNavRef = (el) => {
        NavRef = el;
        if (navObservable) {
            navObservable();
        }
    }

    render() {
        return (
            <div className='leftNav'>
                <div className='toggleArea'>
                    <Dumbbell />
                    <span className='appTitle'>Workout Planner</span>
                </div>
                <div className='viewSelector'>
                    <button className="appViewSwitch" onClick={this.props.setFinderView}>Exercise Finder</button>
                    <button className="appViewSwitch" onClick={this.props.setHistoryView}>Workout History</button>
                </div>
                <div className='navPortal' ref={this.bindNavRef}>
                </div>
            </div>
        );
    }
}

export class NavPanePortal extends React.Component<any, any> {
    constructor(props) {
        super(props);
        registerPortalObserver(() => this.forceUpdate());
    }

    render() {
        if (!NavRef) {
            return null;
        }
        return ReactDOM.createPortal(this.props.children, NavRef);
    }
}