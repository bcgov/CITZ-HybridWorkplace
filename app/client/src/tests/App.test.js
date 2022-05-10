import { Description } from '@mui/icons-material';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import { isElement } from 'react-dom/test-utils';


// //test just to see jest response
// describe('testing jest responses', () => {
//   test('intended to fail for jest testing', () => {
//     expect(3).toEqual(4);
//   });
  
//   test('intended to pass for jest testing', () => {
//     expect(4).toEqual(4); 
//   });  
// });

// test('renders footer with "Accessability" inside', () => {
//   const linkElement = screen.getByText(/Accessability/i);
//   expect(linkElement).toBeInTheDocument();
// });

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


