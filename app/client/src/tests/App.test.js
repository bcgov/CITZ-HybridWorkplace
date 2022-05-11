import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import '../index.css';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import $ from 'jquery';

//Test to ensure footer contains "Accessability" after initial render 
describe('Testing that elements rendered', () => {
  beforeAll(() => {
    render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  });

  test('footer rendered fully', () => {
    const footer = document.querySelector('.footer');
    // const homeLink = screen.getByText(/Home/i);
    const disclaimerLink = screen.getByText(/Disclaimer/i);
    const privacyLink = screen.getByText(/Privacy/i);
    const accessLink = screen.getByText(/Accessability/i);
    const copyrightLink = screen.getByText(/Copyright/i);

    expect(footer.className).toBe('footer');  //this is redundant... if you got footer from above, then of course it does.
    // expect(homeLink).toBeTruthy();
    expect(disclaimerLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(accessLink).toBeInTheDocument();
    expect(copyrightLink).toBeInTheDocument();
  });
});

describe('Test side menu functionality', () => {
  const menuIsVisible = () => {
    if ($('#menu').width() == '0')
      return false; //not visible
    else 
      return true; //visible
    };

  test('menu appears when clicked', () => {
    $('#Menu').trigger('click'); //click hamburger icon
    ReactTestUtils.Simulate.click($('#Menu'));    
    expect(menuIsVisible()).toBe(true);
  });

  test('menu disappears when clicked again', () => {
    $('#Menu').trigger('click'); //click hamburger icon
    expect(menuIsVisible()).toBe(false);
  });

  test('menu closes when X is clicked', () => {
    $('#Menu').trigger('click'); //click hamburger icon
    $('a.close').trigger('click'); //click X button in side menu
    expect(menuIsVisible()).toBe(false);
  });


});


