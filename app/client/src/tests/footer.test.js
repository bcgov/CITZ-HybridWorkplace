import { render, screen } from '@testing-library/react';
import React from 'react';
import '../index.css';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';
import UserEvent from '@testing-library/user-event';

//Test to ensure footer contains "Accessability" after initial render 
describe('Testing footer elements', () => {
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
      const homeLink = screen.queryAllByText(/Home/i);
      const disclaimerLink = screen.getByText(/Disclaimer/i);
      const privacyLink = screen.getByText(/Privacy/i);
      const accessLink = screen.getByText(/Accessability/i);
      const copyrightLink = screen.getByText(/Copyright/i);
  
      expect(footer.className).toBe('footer');  //this is redundant... if you got footer from above, then of course it does.
      expect(homeLink).toHaveLength(2); //1 from footer, one from sidebar
      expect(disclaimerLink).toBeInTheDocument();
      expect(privacyLink).toBeInTheDocument();
      expect(accessLink).toBeInTheDocument();
      expect(copyrightLink).toBeInTheDocument();
    });
  });