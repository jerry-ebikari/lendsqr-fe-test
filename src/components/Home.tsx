import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Home.scss';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { customers, businesses, settings } from '../utils/NavItems'

let mobileWidth = 992; // Change sidebar type at this width
function Home() {
  let [sidebarType, setSidebarType] = useState("side");
  let [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let pathName = location.pathname.replace("/", "");
  useEffect(() => {
    setSidebarType(window.innerWidth < mobileWidth ? "overlay" : "side");
    window.addEventListener("resize", () => {
      setSidebarType(window.innerWidth < mobileWidth ? "overlay" : "side");
    })

    return () => {
      window.removeEventListener("resize", () => {})
    }
  })
  const closeSidebarOv = (ev: any) => {
    if (sidebarOpen) {
      ev.stopPropagation();
      setSidebarOpen(false);
    }
  }
  const closeSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  return (
      <div className='home-container'>
        {/* MENU ICON */}
        <div className={'clickable menu-icon ' + sidebarType} onClick={toggleSidebar}>
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </div>

        {/* HEADER */}
        <header className={"top-nav " + sidebarType + (sidebarOpen ? " overlayed" : "")} onClick={closeSidebarOv}>
          <img src="images/logo.svg" alt="logo" className='header-logo' />
          <div className={"search-field " + sidebarType}>
            <input type="text" name='search' placeholder='Search for anything'/>
            <div className="clickable search-icon-container">
              <img src="images/icons/search.svg" alt="" />
            </div>
          </div>
          <div className={"header-profile-section " + sidebarType}>
            <span className='clickable docs'>Docs</span>
            <img src="images/icons/notification.svg" className='clickable notification-icon' alt="" />
            <div className="profile-image-container">
              <img src="images/profile.svg" className='clickable' alt="" />
            </div>
            <div className='clickable username'>
              <span>Adedeji</span>
              <img src="images/icons/arrow-down.svg" alt="" />
            </div>
          </div>
        </header>

        {/* SIDEBAR */}
        <div className={"sidebar " + sidebarType + " " + (sidebarOpen ? "open" : "close")}>
          <div className="navigation">
            <div className="clickable navlink organization" onClick={closeSidebar}>
              <img src="images/icons/organization.svg" alt="" className='nav-icon' />
              <div className="dropdown-text">
                <span className='navitem-title'>Switch Organization</span>
                <img src="images/icons/arrow-down-outline.svg" alt="" />
              </div>
            </div>
            <div className={"clickable navlink dashboard" + (pathName == "" ? " active" : "")} onClick={() => {
              closeSidebar();
              navigate('/');
            }}>
              <img src="images/icons/home.svg" alt="" className='nav-icon' />
              <div className="dropdown-text">
                <span className='navitem-title'>Dashboard</span>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="navlinks">
              <p className="nav-category">customer</p>
              {customers.map((customer: any) => {
                return (
                  <div
                    className={"clickable navlink" + (pathName == customer.route ? " active" : "")}
                    onClick={() => {
                      closeSidebar();
                      navigate(customer.route);
                    }}
                    key={customer.displayText}
                  >
                    <img src={"images/icons/" + customer.iconName + ".svg"} alt="" className='nav-icon' />
                    <div className="dropdown-text">
                      <span className='navitem-title'>{customer.displayText}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* BUSINESSES */}
            <div className="navlinks">
              <p className="nav-category">businesses</p>
              {businesses.map((business: any) => {
                return (
                  <div
                    className={"clickable navlink" + (pathName == business.route ? " active" : "")}
                    onClick={() => {
                      closeSidebar();
                      navigate(business.route);
                    }}
                    key={business.displayText}
                  >
                    <img src={"images/icons/" + business.iconName + ".svg"} alt="" className='nav-icon' />
                    <div className="dropdown-text">
                      <span className='navitem-title'>{business.displayText}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* SETTINGS */}
            <div className="navlinks">
              <p className="nav-category">settings</p>
              {settings.map((setting: any) => {
                return (
                  <div
                    className={"clickable navlink" + (pathName == setting.route ? " active" : "")}
                    onClick={() => {
                      closeSidebar();
                      navigate(setting.route);
                    }}
                    key={setting.displayText}
                  >
                    <img src={"images/icons/" + setting.iconName + ".svg"} alt="" className='nav-icon' />
                    <div className="dropdown-text">
                      <span className='navitem-title'>{setting.displayText}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* DYNAMIC CONTENT */}
        <div className={"content " + sidebarType + (sidebarOpen ? " overlayed" : "")} onClick={closeSidebarOv}>
          <Outlet />
        </div>
      </div>
  )
}

export default Home