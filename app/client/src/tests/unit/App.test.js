import { render, screen } from '@testing-library/react';
import React from 'react';
import '../index.css';
import App from '../../App';
import {BrowserRouter} from 'react-router-dom';
import UserEvent from '@testing-library/user-event';
import { unmountComponentAtNode } from 'react-dom';

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

  test('sign up page loads with all four fields and four labels', () => {
    expect(screen.getByText('IDIR:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ID')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Re-Enter Password:')).toBeInTheDocument();
    expect(screen.queryAllByPlaceholderText('Password')).toHaveLength(2); //one per password field
  });

  test('entering bad passwords should open warning window', () => {
    const passwordField = document.getElementById('psw');
    //elements for password messages
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');

    UserEvent.type(passwordField, 'password');
    expect(letter.className).toBe('valid');
    expect(capital.className).toBe('invalid');
    expect(number.className).toBe('invalid');
    expect(length.className).toBe('valid');
    UserEvent.clear(passwordField);

    UserEvent.type(passwordField, 'password1');
    expect(letter.className).toBe('valid');
    expect(capital.className).toBe('invalid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('valid');
    UserEvent.clear(passwordField);

    UserEvent.type(passwordField, '3333333');
    expect(letter.className).toBe('invalid');
    expect(capital.className).toBe('invalid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('invalid');
    UserEvent.clear(passwordField);

    UserEvent.type(passwordField, 'Hi1');
    expect(letter.className).toBe('valid');
    expect(capital.className).toBe('valid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('invalid');
    UserEvent.clear(passwordField);

    UserEvent.type(passwordField, 'HHHHHHHHH33');
    expect(letter.className).toBe('invalid');
    expect(capital.className).toBe('valid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('valid');
    UserEvent.clear(passwordField);
  });

  test('entering a good password should keep warning window hidden', () => {
    const passwordField = document.getElementById('psw');
    //elements for password messages
    const letter = document.getElementById('letter');
    const capital = document.getElementById('capital');
    const number = document.getElementById('number');
    const length = document.getElementById('length');

    UserEvent.type(passwordField, 'Password123');
    expect(letter.className).toBe('valid');
    expect(capital.className).toBe('valid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('valid');
    UserEvent.clear(passwordField);

    UserEvent.type(passwordField, 'H1m4l4y4');
    expect(letter.className).toBe('valid');
    expect(capital.className).toBe('valid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('valid');
    UserEvent.clear(passwordField);

    UserEvent.type(passwordField, '68967896DSFdshjklwehjksdf');
    expect(letter.className).toBe('valid');
    expect(capital.className).toBe('valid');
    expect(number.className).toBe('valid');
    expect(length.className).toBe('valid');
    UserEvent.clear(passwordField);
  });

  test('clicking log in loads form without sign-up-related fields', () => {
    //identify fields for checking
    let idirInput = screen.queryAllByText(/idir/i);
    let passInput = screen.queryAllByText(/Password:/i);
    let emailInput = screen.queryAllByText(/Email/i);
    //check if they're there
    expect(idirInput).toHaveLength(1);
    expect(passInput).toHaveLength(2); // one for Password: and one for Re-enter Password:
    expect(emailInput).toHaveLength(1);

    //click log in
    UserEvent.click(screen.getByText(/Log In/i));

    //attempt to reaquire input labels
    idirInput = screen.queryAllByText(/idir/i);
    passInput = screen.queryAllByText(/password:/i);
    emailInput = screen.queryAllByText(/Email/i);
    //check if they're there
    expect(idirInput).toHaveLength(1);
    expect(passInput).toHaveLength(1); // only one for Password: now
    expect(emailInput).toHaveLength(0); //should be gone
  });

});

