import React from "react";
import { scaleRotate as BurgerMenu } from "react-burger-menu";
import { NavLink } from "react-router-dom";
import "./styles/NavBar.scss";

function NavBar() {
  return (
    <header className="NavBar">
      <nav className="desktopNav">
        <NavLink className="logo" activeClassName="active" exact to="/">
          <img className="meexLogo" src="./img/meexLogo.png" alt="" />
        </NavLink>

        <ul className="desktopMenu">
          <li>
            <NavLink
              id="meetings"
              className="menu-item"
              activeClassName="active"
              to="/campaigns"
            >
              Campagnes
            </NavLink>
          </li>

          <li>
            <NavLink
              id="ambassadors"
              className="menu-item"
              activeClassName="active"
              to="/ambassadors"
            >
              Ambassadeurs
            </NavLink>
          </li>

          <li>
            <NavLink
              id="causes"
              className="menu-item"
              activeClassName="active"
              to="/causes"
            >
              Causes soutenues
            </NavLink>
          </li>
        </ul>
      </nav>

      <BurgerMenu width={320}>
        <NavLink
          id="meetings"
          className="menu-item"
          activeClassName="bm-active"
          to="/campaigns"
        >
          Campagnes
        </NavLink>

        <NavLink
          id="ambassadors"
          className="menu-item"
          activeClassName="bm-active"
          to="/ambassadors"
        >
          Ambassadeurs
        </NavLink>

        <NavLink
          id="causes"
          className="menu-item"
          activeClassName="bm-active"
          to="/causes"
        >
          Causes soutenues
        </NavLink>
      </BurgerMenu>
    </header>
  );
}

export default NavBar;
