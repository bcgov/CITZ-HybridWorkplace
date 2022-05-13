import React from 'react';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {screen} from '@testing-library/dom'
import { act } from "react-dom/test-utils";
import {waitFor} from "@testing-library/react";
import {render, unmountComponentAtNode,} from "react-dom";
import userEvent from '@testing-library/user-event'
let container = null;

function containerInit(){
  container = document.createElement("div");
  document.body.appendChild(container);

    act(() => {
      render( <React.StrictMode>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
        </React.StrictMode>, container
      );
    });
}

function containerRemove(){
    unmountComponentAtNode(container);
    container.remove();
    container = null;
}

describe("Menu Test", () => {
  beforeEach(() => {
    containerInit();
  });
  
  afterEach(() => {
    containerRemove();
  });
  test("The Menu Button exists", () => {
    const menuButtonElement = screen.getByAltText('Profile')

    expect(menuButtonElement.src).toBe('http://localhost/menuLogo.svg')
  });

  test("When Menu is open, the Menu button will open the Menu when pressed",async () => {
    const menuButtonElement =  document.querySelector('#Menu');
    const menuElement =  document.querySelector('#menu');
    act(() => {
      userEvent.click(menuButtonElement);
    });

    await waitFor(() => {
      expect(getComputedStyle(menuElement).width).toBe("250px")
    })
  });

  test("When Menu is open, the Menu button will close the X when pressed",async () => {
    const closeButtonElement =  document.querySelector('.close');
    const menuElement =  document.querySelector('#menu');

    act(() => {
      userEvent.click(closeButtonElement);
    });

    await waitFor(() => {
      expect(getComputedStyle(menuElement).width).toBe("0px")
    })

  });
});

describe("Menu buttons test", () => {

  beforeEach(() => {
    containerInit();
  });
  
  afterEach(() => {
    containerRemove();
  });
  xtest("from Menu, the Home button is directed to the login page", () => {
    const loginElement =  screen.querySelector('.footer');
    expect(loginElement).toHaveTextContent('Home');

  });

  xtest("from Menu, the Profile button is directed to the login page if not signed in", () => {
    const profileElement =   document.querySelector("a[href='/profile/:id']");
    act(() => {
      userEvent.click(profileElement);
    });
    expect(screen.getByText(/Edit Profile/i)).not.toBe(null);
  });

  xtest("from Menu, the Profile button is directed to the profile page if signed in", () => {
    const ProfileElement =  document.querySelector("a[href='/profile/:id']");
    act(() => {
      userEvent.click(ProfileElement);
    });
    expect(screen.getByText(/Edit Profile/i)).not.toBe(null);

  });

  test("from Menu, the Community button is directed to the communtities page", () => {
    const communitiesElement =   document.querySelector("a[href='/communities']");
    act(() => {
      userEvent.click(communitiesElement);
    });
    expect(screen.getByText('Create New Community')).not.toBe(null);
  });

  xtest("from Menu, the Posts button is directed to a posts page", () => {
    const loginElement =  screen.querySelector('.footer');
    expect(loginElement).toHaveTextContent('Home');

  });

  test("from Menu, the About button is direct to the about page", () => {
    const aboutElement =   document.querySelector("a[href='/about']");
    act(() => {
      userEvent.click(aboutElement);
    });
    expect(screen.getByText(/Developed By/)).not.toBe(null);
    expect(screen.getByText(/Platform/)).not.toBe(null);

  });

  xtest("from Menu, the Dark Mode button flips text and background", () => {
    const darkModeElement = screen.getByText('Dark Mode');
    const backgroundElement =  document.getElementsByClassName('MuiPaper-root');

    act(() => {
      userEvent.click(darkModeElement);
    });

    expect(getComputedStyle(backgroundElement[0]).backgroundColor).toBe("#121212");
    expect(getComputedStyle(backgroundElement[0]).color).toBe("#fff");
  });

  xtest("from Menu, the Log off button will bring you to the login page", () => {
    const logOffElement =   document.querySelector("a[href='/login']");
    act(() => {
      userEvent.click(logOffElement);
    });
    expect(screen.getByText(/Login/)).not.toBe(null);
    expect(screen.getByText(/IDIR/)).not.toBe(null);

  });
});