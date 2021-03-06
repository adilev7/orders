import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import starredService from "../services/starredService";
import userService from "../services/userService";
class Navbar extends Component {
  state = {
    starred: 0,
  };
  component;
  componentDidMount = async () => {
    // Render the number of starred orders in the navbar.
    // Failed to achieve on every change without a global state library.
    const currentUser = userService.getCurrentUser();
    let { data: starred } = await starredService.getStarredByUser(
      currentUser?._id
    );
    starred = starred[0]?.orders.length || 0;
    this.setState({ starred });
  };

  render() {
    const currentUser = userService.getCurrentUser();

    return (
      <nav className='navbar navbar-expand-md navbar-dark sticky-top py-0'>
        <Link className='navbar-brand my-0 mr-5' to='/orders'>
          ORDERIZE
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarsExample04'
          aria-controls='navbarsExample04'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarsExample04'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item mr-4'>
              <NavLink className='nav-link nl' to='/orders'>
                Orders
              </NavLink>
            </li>
            <li className='nav-item mr-4'>
              <NavLink className='nav-link nl' to='/products'>
                Products
              </NavLink>
            </li>
          </ul>
          <ul className='navbar-nav ml-auto mr-4'>
            {currentUser ? (
              <li className='nav-item dropdown nav-user'>
                <span
                  className='nav-link dropdown-toggle cursor-pointer'
                  id='dropdown04'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'>
                  {currentUser.email}
                  {currentUser.admin && (
                    <span className='nav-admin'>ADMIN</span>
                  )}
                  <i className='fas fa-user ml-2'></i>
                </span>
                <span
                  className='dropdown-menu dropdown-menu-right bg-dark'
                  aria-labelledby='dropdown04'>
                  {currentUser.admin && (
                    <NavLink
                      className='dropdown-item text-warning bg-dark'
                      to='/create-user'>
                      <i className='fas fa-user-plus mr-1'></i> Create New User
                    </NavLink>
                  )}
                  <NavLink
                    className='dropdown-item text-warning bg-dark'
                    to='/logout'>
                    <i className='fas fa-sign-out-alt mr-1'></i> Log Out
                  </NavLink>
                </span>
              </li>
            ) : (
              <React.Fragment>
                <li className='nav-item mr-0 ml-auto'>
                  <NavLink className='nav-link' to='/signin'>
                    <i className='fas fa-sign-in-alt mr-1'></i> Log In
                  </NavLink>
                </li>
                <li className='nav-item mr-0 ml-auto'>
                  <NavLink className='nav-link' to='/signup'>
                    <i className='fas fa-user-plus mr-1'></i> Sign Up
                  </NavLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
