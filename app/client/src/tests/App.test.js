import { render, screen } from '@testing-library/react';
import React from 'react';
import '../index.css';
import App from '../App';
import {BrowserRouter, unmountComponentAtNode} from 'react-router-dom';
import UserEvent from '@testing-library/user-event';

/*
  Setup of DOM container
*/

let container = null;

function containerInit(){
  container = document.createElement("div");
  document.body.appendChild(container);

  render( <React.StrictMode>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
    </React.StrictMode>, container
  );
}

function containerRemove(){
    unmountComponentAtNode(container);
    container.remove();
    container = null;
}



describe('Testing log in, sign up, register front-end behaviours', () => {
  beforeEach(() => {
    containerInit();
  });

  afterEach(() => {
    containerRemove();
  });

  test('clicking log in loads form without sign-up-related fields', () => {
    //identify fields for checking
    let idirInput = screen.queryAllByText(/idir/i);
    let passInput = screen.queryAllByText(/Password/i);
    let emailInput = screen.queryAllByText(/Email/i);
    //check if they're there
    expect(idirInput).toHaveLength(1);
    expect(passInput).toHaveLength(2);
    expect(emailInput).toHaveLength(1);

    //click log in
    UserEvent.click(screen.getByText(/Log In/i));

    //attempt to reaquire input labels
    idirInput = screen.queryAllByText(/idir/i);
    passInput = screen.queryAllByText(/password/i);
    emailInput = screen.queryAllByText(/Email/i);
    //check if they're there
    expect(idirInput).toHaveLength(1);
    expect(passInput).toHaveLength(1);
    expect(emailInput).toHaveLength(0); //should be gone
  });

});

