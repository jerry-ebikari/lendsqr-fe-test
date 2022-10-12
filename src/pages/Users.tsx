import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "../styles/Users.scss";
import { getAllUsers, checkUserActive } from '../services/userInfoService';
import formatNumber from '../utils/currencyFormatter';


const statInfo: {title: string, number: number, iconName: string}[] = [
    {
        title: "Users",
        number: 2453,
        iconName: "users-dashboard"
    },
    {
        title: "Active users",
        number: 2453,
        iconName: "active-users-dashboard"
    },
    {
        title: "Users with loans",
        number: 12453,
        iconName: "users-with-loans"
    },
    {
        title: "Users with savings",
        number: 102453,
        iconName: "users-with-savings"
    }
]

interface UserData {
    data: any
}


function Users() {
    const navigate = useNavigate();
    let [users, setUsers] = useState<UserData>({data: null});
    let [numberOfRecords, setNumberOfRecords] = useState(10);
    let [numberOfRecordsToDisplay, setNumberOfRecordsToDisplay] = useState(10);
    let [recordsToDisplay, setRecordsToDisplay] = useState<UserData>({data: null});
    let [numPages, setNumPages] = useState(1);
    let [page, setPage] = useState(1);
    let [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    let [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
    let [userId, setUserId] = useState<null | any>(null);
    const open = Boolean(anchorEl);
    const filterOpen = Boolean(filterAnchor);
    const openMenu = (ev: React.MouseEvent<HTMLElement>, id: any) => {
        setAnchorEl(ev.currentTarget);
        setUserId(id);
    }
    const showFilter = (ev: React.MouseEvent<HTMLElement>) => {
        setFilterAnchor(ev.currentTarget);
    }
    const closeMenu = () => {
        setAnchorEl(null);
        setFilterAnchor(null);
    }

    // FUNCTIONS
    const updateNumberOfRecordsToDisplay = (ev: any) => {
        setNumberOfRecordsToDisplay(ev.target.value);
        setNumPages(Math.ceil(users.data.length / ev.target.value));
        updateRecordsDisplayed(ev.target.value);
    }
    const updateRecordsDisplayed = (value: number) => {
        let startIndex = page * value - value;
        let endIndex = page * value;
        let newRecords = users.data.slice(startIndex, endIndex)
        setRecordsToDisplay({data: newRecords});
    }
    const updatePage = (ev: any, value: number) => {
        setPage(value);
        let startIndex = value * numberOfRecordsToDisplay - numberOfRecordsToDisplay;
        let endIndex = value * numberOfRecordsToDisplay;
        let newRecords = users.data.slice(startIndex, endIndex)
        setRecordsToDisplay({data: newRecords});
    }
    const viewUser = () => {
        closeMenu();
        navigate("/user/" + userId);
    }
    // USE EFFECT
    useEffect(() => {
        getAllUsers()
        .then((res) => {
            setUsers({data: [...res.data]});
            setNumberOfRecords(res.data.length);
            setRecordsToDisplay({data: res.data.slice(0, numberOfRecordsToDisplay)});
            setNumPages(Math.ceil(res.data.length / numberOfRecordsToDisplay));
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div className='users-container'>
            <h1 className='page-header'>Users</h1>

            {/* STATS */}
            <div className="stats">
                {statInfo.map(stat => {
                    return (
                        <div className="stat" key={stat.title}>
                            <img src={"images/icons/" + stat.iconName + ".svg"} alt="" />
                            <p className='stat-title'>{stat.title}</p>
                            <p className='stat-number'>{formatNumber(stat.number)}</p>
                        </div>
                    )
                })}
            </div>

            {/* TABLE */}
            <div className="users-table">
                {/* TABLE HEADERS */}
                <div className="first column header cell">
                    <span className='header-column-text'>Organization</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Username</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Email</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
                <div className="column header cell phone">
                    <span className='header-column-text'>Phone number</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Date joined</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Status</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
                <div className="column header cell last"></div>

                {/* TABLE BODY */}
                {recordsToDisplay.data ? recordsToDisplay.data.map((user: any, index: number) => {
                    return (
                        <>
                            <div className={"first cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{user.orgName}</span>
                            </div>
                            <div className={"cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{user.userName}</span>
                            </div>
                            <div className={"cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text email'>{user.email}</span>
                            </div>
                            <div className={"cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{user.phoneNumber}</span>
                            </div>
                            <div className={"cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{user.createdAt}</span>
                            </div>
                            <div className={"cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <span
                                    className={'cell-text status ' + (
                                        checkUserActive(user.createdAt) ? "active" : "inactive"
                                    )}
                                >
                                    {checkUserActive(user.createdAt) ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className={"last cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <img
                                    className='clickable'
                                    src="images/icons/vertical-dots.svg"
                                    alt=""
                                    onClick={(ev) => {openMenu(ev, user.id)}}
                                />
                            </div>
                        </>
                    )
                }) : <></>}
            </div>
            <div className="table-footer">
                <div className="num-records">
                    <span>Showing </span>
                    <select name="numRecordsToDisplay" value={numberOfRecordsToDisplay} onChange={updateNumberOfRecordsToDisplay}>
                        <option value="10">10</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span> out of {numberOfRecords}</span>
                </div>
                {numPages > 1 ? <Pagination count={numPages} page={page} onChange={updatePage} shape="rounded" /> : <></>}
            </div>
            {/* USERS MENU */}
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={viewUser}>
                    <div className='user-menu-item'>
                        <img src="images/icons/eye.svg" alt="" />
                        <p>View Details</p>
                    </div>
                </MenuItem>
                <MenuItem onClick={closeMenu}>
                    <div className='user-menu-item'>
                        <img src="images/icons/blacklist.svg" alt="" />
                        <p>Blacklist User</p>
                    </div>
                </MenuItem>
                <MenuItem onClick={closeMenu}>
                    <div className='user-menu-item'>
                        <img src="images/icons/activate.svg" alt="" />
                        <p>Activate User</p>
                    </div>
                </MenuItem>
            </Menu>

            {/* FILTER */}
            <Menu
                id="filter"
                anchorEl={filterAnchor}
                open={filterOpen}
                onClose={closeMenu}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <form className='filter-form'>
                    <div className="field">
                        <label htmlFor="organization">Organization</label>
                        <select className='custom-select' name="organization" id="organization">
                            <option value="">10</option>
                            <option value="">20</option>
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder='User' />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder='Email' />
                    </div>
                    <div className="field">
                        <label htmlFor="date">Date</label>
                        {/* <label htmlFor="date" className='date-label'>Date</label> */}
                        {/* <Calendar></Calendar> */}
                        <input type="date" id="date" />
                    </div>
                    <div className="field">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" placeholder='Phone Number' />
                    </div>
                    <div className="field">
                        <label htmlFor="status">Status</label>
                        <select className='custom-select' name="status" id="status">
                            <option value="">10</option>
                            <option value="">20</option>
                        </select>
                    </div>
                    <div className="buttons">
                        <button className="clickable btn reset-btn" type='reset'>Reset</button>
                        <button className="clickable btn filter-btn" type='submit'>Filter</button>
                    </div>
                </form>
            </Menu>
        </div>
    )
}

export default Users