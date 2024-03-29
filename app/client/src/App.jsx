//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */

import "./App.css";
import "@bcgov/bc-sans/css/BCSans.css";

import Routes from "./Routes";
import Container from "@mui/material/Container";

import { Provider } from "react-redux";
import store from "./store";

import Footer from "./layout/Footer";
import Header from "./layout/Header";

import Paper from "@mui/material/Paper";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AlertList from "./components/AlertList";

import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ minHeight: "100vh" }} sx={{ boxShadow: 0 }}>
        <Provider store={store}>
          <div>
            <Header />
            <div className="App">
              <Container>
                <Routes />
                <AlertList />
              </Container>
            </div>
            <Footer />
          </div>
        </Provider>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
