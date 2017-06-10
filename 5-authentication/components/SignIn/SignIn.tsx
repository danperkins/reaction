import * as React from 'react';
import { getUserData, signIn, signOut } from '../../services/auth';
import './SignIn.less';

export class SignIn extends React.Component<any, any> {
    private signIn: () => void;
    private signOut: () => void;
    private googleAuthWindow = null;

    constructor(props) {
        super(props);

        this.signIn = () => {
            signIn().then(() => this.forceUpdate()).catch(() => this.forceUpdate());
        };
        this.signOut = () => {
            signOut().then(() => this.forceUpdate()).catch(() => this.forceUpdate());
        }
    }

    render() {
        let userData = getUserData();
        if (!userData) {
            return <button className='signIn' onClick={this.signIn}>Sign In</button>
        }

        return (
            <div className='signIn'>
                <span>{userData.name ? userData.name : ''}</span>
                <img src={userData.picture ? userData.picture : ''} />
            </div>
        );
    }

}