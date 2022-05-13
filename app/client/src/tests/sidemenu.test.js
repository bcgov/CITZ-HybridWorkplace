import { render, screen } from '@testing-library/react';
import React from 'react';
import '../index.css';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import UserEvent from '@testing-library/user-event';

describe('Test side menu functionality', () => {
    const container = document.createElement('div');
  
    beforeEach(() => {
      render(
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>
      );
    });
  
    test('SideMenu is rendered', () => {
      expect(screen.getByText(/Communities/i)).toBeInTheDocument(); //just looking for anything only rendered in the sidebar
    });
  
    //need more attributes on the menu in order to target
    xtest('menu is closed to begin with', () => {
      expect(screen.getByRole('div', { name: /menu/}).getAttribute('width')).toBe(0);
    });
  
    //need more attributes on the hamburger in order to target
    xtest('menu appears when clicked', () => {
      //click hamburger icon
      //ReactTestUtils.Simulate.click(document.querySelector('img#Menu'));    
      UserEvent.click(screen.getByRole('img', { name: /Menu/}));
    
      expect(screen.getByAltText(/Profile/i).style.width).toBe(250);
    });
  
      //need more attributes on the hamburger in order to target
  
    xtest('menu disappears when clicked again', () => {
      UserEvent.click(screen.getByRole('img', { name: /Menu/})); //click hamburger icon
      expect(document.getElementById('menu').style.width).toBe(0);
    });
  
    //can't open menu yet or target div, so no test
    xtest('menu closes when X is clicked', () => {
      UserEvent.click(screen.getByText(/✖/i));  //click X button in side menu
      //expect($('#menu').width()).toBe(0);
    });
  
    test('Page goes to About when the About link is clicked', () => {
      UserEvent.click(screen.getByText(/About/i));
      expect(screen.getByText(/Developed by/i)).toBeInTheDocument();
    })
  
  });