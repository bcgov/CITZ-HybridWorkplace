import { Description } from '@mui/icons-material';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import App from '../App';
import {BrowserRouter} from 'react-router-dom';


//Original test case that comes with react-scripts
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


//test just to see jest response
describe('testing jest responses', () => {
  test('intended to fail for jest testing', () => {
    expect(3).toEqual(4);
  });
  
  test('intended to pass for jest testing', () => {
    expect(4).toEqual(4);
  });  
});

//Test to ensure footer contains "Accessability" after initial render
test('renders footer with "Accessability" inside', () => {
  render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  
  const linkElement = screen.getByText(/Accessability/i);
  expect(linkElement).toBeInTheDocument();
});

