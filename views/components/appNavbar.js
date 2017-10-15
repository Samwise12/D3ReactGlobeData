import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import ReactBootstrap, { Panel, Tooltip, Navbar, Button, Grid, Row, Col } from 'react-bootstrap';

const AppNavbar = (
  <Navbar inverse staticTop>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json" target="_blank">Meteorite Landings Across the Globe</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Navbar.Form pullRight>
        <Button target="_blank" href="https://www.freecodecamp.org">FreeCodeCamp</Button>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>
);

ReactDOM.render(AppNavbar, document.getElementById('AppNavbar'));

