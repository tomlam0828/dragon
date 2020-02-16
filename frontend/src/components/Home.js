import React, { Component } from 'react';
import Generation from './Generation';
import Dragon from './Dragon';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logout } from '../actions/account';
import AccountDragons from './AccountDragons';

class Home extends Component {
    render() {
        return (
            <div>
                <Button className="logout-button" onClick={this.props.logout}>Logout</Button>
                <h2>Dragon Stack</h2>
                <Generation />
                <Dragon />
                <br />
                <AccountDragons />
            </div>
        );
    }
}

export default connect(null, { logout })(Home);