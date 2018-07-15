// this page initially is supposed to hold just content that describes the project
// however, having trouble using signing in and out modals so I added them to the
// "log in/sign up" link using props. so if the user clicks that link while on the home page
// the "Sign Up" or "Sign In" modals will display. they can also sign out from this page if they are initially logged in

import React from 'react';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';
import Firebase from '../config/firebase';
import landingPage from '../images/landingPage.jpeg';
import workingIcon from '../images/icons8-work-light-100.png'
import handIcon from '../images/icons8-handshake-100.png'
import workerIcon from '../images/icons8-workers-100.png'
import serviceImage from '../images/pexels-photo-580613.jpeg'
import Navbar from './Navbar';

/* Modals */
let loginStatus;
let errorMessage;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: '50%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
  },
};

Modal.setAppElement('#root');



/* we can use default props to set the initial value of the jobs that load when the page opens */
/* Pages */

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      signInModalIsOpen: false,
      signOutModalIsOpen: false,
      // loginStatus: false,
      email: '',
      password: '',
      reenterPassword: '',
      passwordMisMatch: false,
      error: null,
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  openModal() {
    if (loginStatus) {
      this.setState({ signOutModalIsOpen: true });
    } else {
      this.setState({ modalIsOpen: true });
    }
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.setState({ signInModalIsOpen: true });
  }

  closeSignInModal() {
    this.setState({
      signInModalIsOpen: false,
      modalIsOpen: true,
    });
  }

  handleSignUp() {
    // var email ="asa@yahoo.com";
    // var password = "12345678";

    this.state.email === ''
      ? this.setState({ error: 'email field cannot be empty' })
      : this.state.password === this.state.reenterPassword
        ? Firebase.auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((user) => {
            console.log(user);
            browserHistory.push('/signup');
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            errorMessage = error.message;

            console.log(errorCode, errorMessage);
            // ...
          }) &&
        // cant setState within the catch function so I did it outside
        this.setState({
          error: errorMessage,
        })
        : this.setState({
          passwordMisMatch: true,
        });
  }

  handleSignIn() {
    Firebase.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        loginStatus = true;
        browserHistory.push('/categories');
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        // var errorMessage = error.message;
        errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ...
      });
    this.setState({
      error: errorMessage,
    });
  }

  handleSignOut() {
    Firebase.auth().signOut();
    browserHistory.push('/');
  }

  handleInput(event) {
    if (event.target.placeholder === 'email') {
      this.setState({
        email: event.target.value,
      });
    } else if (event.target.placeholder === 'password') {
      this.setState({
        password: event.target.value,
        passwordMisMatch: false,
      });
    } else if (event.target.placeholder === 're-enter password') {
      this.setState({
        reenterPassword: event.target.value,
        passwordMisMatch: false,
      });
    }
  }

  render() {
    return (
      <div>
        <div id="home">
          <Navbar title="Home" action={this.openModal} />
          {/* <SignUp Modal /> */}

          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal">
            <button onClick={this.closeModal}>close</button>

            <h2 ref={subtitle => (this.subtitle = subtitle)}>Sign Up</h2>

            <form>
              <div className="col mb-3">
                <input
                  type="email"
                  value={this.state.email}
                  onChange={this.handleInput}
                  className="form-control"
                  required
                  placeholder="email"
                />
              </div>
              <div className="col mb-3">
                <input
                  type="text"
                  value={this.state.password}
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="password"
                />
              </div>
              <div className="col  mb-3">
                <input
                  type="text"
                  value={this.state.reenterPassword}
                  onChange={this.handleInput}
                  className="form-control"
                  placeholder="re-enter password"
                />

                {this.state.passwordMisMatch ? (
                  <p style={{ color: 'red' }}>passwords did not match</p>
                ) : null}
                {this.state.error ? <p style={{ color: 'red' }}>{this.state.error}</p> : null}
              </div>
            </form>
            <div className="align-right">
              <button className="md-3" type="submit" onClick={this.handleSignUp}>
                Sign Up
              </button>
            </div>
            <div>
              If you already have an account, you can{' '}
              <button color="secondary" onClick={this.closeModal}>
                Sign In
              </button>
            </div>
          </Modal>
          {/* Sign In Modal */}
          <Modal isOpen={this.state.signInModalIsOpen} style={customStyles}>
            <div>
              <h2>Sign In</h2>
              <form>
                <div className="col mb-3">
                  <input
                    type="email"
                    value={this.state.email}
                    onChange={this.handleInput}
                    className="form-control"
                    required
                    placeholder="email"
                  />
                </div>
                <div className="col mb-4">
                  <input
                    type="text"
                    value={this.state.password}
                    onChange={this.handleInput}
                    className="form-control"
                    placeholder="password"
                  />
                </div>
                {this.state.error ? <p style={{ color: 'red' }}>{this.state.error}</p> : null}
              </form>
              <div className="md-3 align-right">
                <button type="submit" onClick={this.handleSignIn}>
                  Sign In
                </button>
              </div>
              <div>
                Don't have an account? You can{' '}
                <button color="secondary" onClick={this.closeSignInModal}>
                  Sign Up
                </button>
              </div>
            </div>
          </Modal>
          {/* Sign Out Modal */}
          <Modal isOpen={this.state.signOutModalIsOpen} style={customStyles}>
            Sign Out ? <button onClick={this.handleSignOut}>Yes</button>
          </Modal>

          <div>
            <img
              src={landingPage} // style={{width:"1520px"}}
              className={'img-fluid'}
              alt="landing page"
            />
          </div>
          <div className="container">
            {/* How it Works section */}
            <div className="mt-5 flex mb-5" style={{ textAlign: 'center' }}>
              <h3 className="titles">How It Works</h3>
              <div className="row d-flex justify-content-between">
                <div className="col-4">
                  <img src={workingIcon} />
                  <div className="card mt-3">
                    <h5 className="card-title mt-3">I want to get hired</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum
                </p>
                  </div>
                </div>
                <div className=" col-4 ">
                  <img src={workerIcon} />
                  <div className='card mt-3'>
                    <h5 className="card-title mt-3">I want to hire someone</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                </p>
                  </div>
                </div>

                <div className="col-4">
                  <img src={handIcon} />
                  <div className="card mt-3">
                    <h5 className="card-title mt-3">I want to be a Partner</h5>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* About */}
            <div className="row">
              <div className="col-6">
                <h3>About</h3>
                <p>Fixer or Fixer App is an online platform that links people to electricians, mechanics, maids, carpenters and plumbers. We call them, Fixers, that is, people who can fix things or handymen. The idea of Fixer was first made known to the public in November 2014 at Startup Weekend Lusaka. <br /><br />The original team members at that event were Jacob Mutale, Mumamba Mwansa, and Zipani Sinkala.
                 Fixer App Zambia Limited was registered as a private company limited by shares in September 2015. Currently, we are working to scale up our operations to ensure we provide high quality services to our vendors and customers.
              </p>
              </div>
              <div className="col-6">
                <img style={{ width: 500, heigh: 300 }} src={serviceImage} />
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default Home;
