import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Users.scss";
import { getAllUsers, checkUserActive } from '../services/userInfoService';
import { formatDate } from '../utils/dateFormatter';
import compareDates from "../utils/compareDates";


function Users() {
    const navigate = useNavigate();
    let [users, setUsers] = useState<any[] | null>(null); // all users
    let [failedToFetchUsers, setFailedToFetchUsers] = useState(false);
    let [numberOfRecords, setNumberOfRecords] = useState(10);
    let [numberOfRecordsToDisplay, setNumberOfRecordsToDisplay] = useState(10);
    let [recordsToDisplay, setRecordsToDisplay] = useState<any[] | null>(null);
    let [numPages, setNumPages] = useState(1);
    let [page, setPage] = useState(1);
    let [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // anchor element for user menu
    let [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);  // anchor element for filter modal
    let [userId, setUserId] = useState<any>(null);
    let [orgs, setOrgs] = useState<any>(null);
    let [filterState, setFilterState] = useState({
        organization: "",
        username: "",
        email: "",
        date: "",
        phoneNumber: "",
        status: ""
    });
    let [isFilterApplied, setFilterApplied] = useState<Boolean>(false);
    let [filteredRecords, setFilteredRecords] = useState<any>(null);
    const open = Boolean(anchorEl);
    const filterOpen = Boolean(filterAnchor);

    // OPEN USER MENU
    const openMenu = (ev: React.MouseEvent<HTMLElement>, user: any) => {
        setAnchorEl(ev.currentTarget);
        setUserId(user.id);
    }

    // OPEN FILTER MODAL
    const showFilter = (ev: React.MouseEvent<HTMLElement>) => {
        setFilterAnchor(ev.currentTarget);
    }

    // CLOSE FILTER AND USER MENUS
    const closeMenu = () => {
        setAnchorEl(null);
        setFilterAnchor(null);
    }

    // UPDATE NUMBER OF RECORDS TO DISPLAY
    const updateNumberOfRecordsToDisplay = (ev: any) => {
        setNumberOfRecordsToDisplay(ev.target.value);
        setPage(1);
        updateRecordsDisplayed(ev.target.value);
    }

    // UPDATE THE DISPLAYED RECORDS
    const updateRecordsDisplayed = (value: number) => {
        let startIndex = page * value - value;
        let endIndex = page * value;
        let newRecords = (isFilterApplied ? filteredRecords : users).slice(startIndex, endIndex);
        setRecordsToDisplay(newRecords);
    }

    // UPDATE PAGE NUMBER
    const updatePage = (ev: any, value: number) => setPage(value);

    // NAVIGATE TO USER DETAILS PAGE
    const viewUser = () => {
        closeMenu();
        navigate("/user/" + userId);
    }

    // FILTER BUTTON CLICKED
    const filter = (ev: any) => {
        ev.preventDefault();
        setFilteredRecords(users?.filter((user: any) => {
            return (
                (filterState.organization ? (user.orgName == filterState.organization) : true) &&
                (filterState.username ? user.userName.toLowerCase().includes(filterState.username.toLowerCase()) : true) &&
                (filterState.email ? user.email.toLowerCase().includes(filterState.email.toLowerCase()) : true) && 
                (filterState.status ? ((checkUserActive(user.lastActiveDate) ? "active" : "inactive") == filterState.status) : true) &&
                (filterState.phoneNumber ? user.phoneNumber.toLowerCase().includes(filterState.phoneNumber.toLowerCase()) : true) && 
                (filterState.date ? compareDates(filterState.date, user.createdAt) : true)
            )
        }));
        setFilterApplied(true);
    }

    // RESET FILTER
    const resetFilter = () => {
        setFilterState({
            organization: "",
            username: "",
            email: "",
            date: "",
            phoneNumber: "",
            status: ""
        });
        setPage(1);
        setFilterApplied(false);
        closeMenu();
    }

    // ON FILTER FORM INPUT CHANGED
    const handleChange = (ev: any) => {
        setFilterState(prev => {
            return {...prev, [ev.target.name]: ev.target.value}
        });
    }

    // SHOW NOT AVAILABLE MESSAGE
    const notAvailable = () => {
        toast.error("Not available", {
            autoClose: 2000,
            pauseOnFocusLoss: false
        });
    }

    // GET USER DATA
    const getUserData = () => {
        setFailedToFetchUsers(false);
        getAllUsers()
        .then((res: any) => {
            let allUsers: any[] = res.data;
            allUsers.sort((a: any, b: any) => {
                return a.userName.toLowerCase() > b.userName.toLowerCase() ? 1 : -1;
            });
            setUsers([...allUsers]);
            setNumberOfRecords(allUsers.length);
            setRecordsToDisplay(allUsers.slice(0, numberOfRecordsToDisplay));
            setNumPages(Math.ceil(allUsers.length / numberOfRecordsToDisplay));
            setOrgs(() => {
                let orgNames: any = [];
                allUsers.forEach((user: any) => orgNames.push(user.orgName));
                return Array.from(new Set(orgNames.sort()));
            })
        })
        .catch((err: any) => {
            setFailedToFetchUsers(true);
        })
    }

    // ON FIRST LOAD
    useEffect(() => {
        getUserData()
    }, []);

    // ON FILTER APPLY
    useEffect(() => {
        if (users) {
            setPage(1);
            updateRecordsDisplayed(numberOfRecordsToDisplay);
            closeMenu();
        }
    }, [filteredRecords, isFilterApplied]);

    // ON PAGE CHANGE
    useEffect(() => {
        if (users) {
            let startIndex = page * numberOfRecordsToDisplay - numberOfRecordsToDisplay;
            let endIndex = page * numberOfRecordsToDisplay;
            let newRecords = (isFilterApplied ? filteredRecords : users).slice(startIndex, endIndex)
            setRecordsToDisplay(newRecords);
        }
    }, [page])

    // WHEN RECORDS TO DISPLAY CHANGES
    useEffect(() => {
        if (users) {
            setNumPages(Math.ceil((isFilterApplied ? filteredRecords : users).length / numberOfRecordsToDisplay))
        }
    }, [recordsToDisplay])

    return (
        <div className='users-container'>
            <h1 className='page-header'>Users</h1>

            {users ? (<>
                {/* USER STATS */}
                <div className="stats">
                    <div className="stat">
                        <img src={"images/icons/users-dashboard.svg"} alt="" />
                        <p className='stat-title'>Users</p>
                        <p className='stat-number'>{users.length}</p>
                    </div>
                    <div className="stat">
                        <img src={"images/icons/active-users-dashboard.svg"} alt="" />
                        <p className='stat-title'>Active Users</p>
                        <p className='stat-number'>
                            {users.filter((user: any) => checkUserActive(user.lastActiveDate)).length}
                        </p>
                    </div>
                    <div className="stat">
                        <img src={"images/icons/users-with-loans.svg"} alt="" />
                        <p className='stat-title'>Users with Loans</p>
                        <p className='stat-number'>
                            {users.filter((user: any) => Number(user.education.loanRepayment) > 0).length}
                        </p>
                    </div>
                    <div className="stat">
                        <img src={"images/icons/users-with-savings.svg"} alt="" />
                        <p className='stat-title'>Users with Savings</p>
                        <p className='stat-number'>
                            {users.filter((user: any) => Number(user.accountBalance) > 0).length}
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="users-table">
                    {/* TABLE HEADERS */}
                    {/* HEADER COLUMN 1 */}
                    <div className="first column header cell">
                        <span className='header-column-text'>Organization</span>
                        <img
                            className="clickable"
                            src="images/icons/filter.svg"
                            alt=""
                            onClick={showFilter}
                        />
                    </div>
                    {/* HEADER COLUMN 2 */}
                    <div className="column header cell">
                        <span className='header-column-text'>Username</span>
                        <img
                            className="clickable"
                            src="images/icons/filter.svg"
                            alt=""
                            onClick={showFilter}
                        />
                    </div>
                    {/* HEADER COLUMN 3 */}
                    <div className="column header cell">
                        <span className='header-column-text'>Email</span>
                        <img
                            className="clickable"
                            src="images/icons/filter.svg"
                            alt=""
                            onClick={showFilter}
                        />
                    </div>
                    {/* HEADER COLUMN 4 */}
                    <div className="column header cell phone">
                        <span className='header-column-text'>Phone number</span>
                        <img
                            className="clickable"
                            src="images/icons/filter.svg"
                            alt=""
                            onClick={showFilter}
                        />
                    </div>
                    {/* HEADER COLUMN 5 */}
                    <div className="column header cell date-joined">
                        <span className='header-column-text'>Date joined</span>
                        <img
                            className="clickable"
                            src="images/icons/filter.svg"
                            alt=""
                            onClick={showFilter}
                        />
                    </div>
                    {/* HEADER COLUMN 6 */}
                    <div className="column header cell">
                        <span className='header-column-text'>Status</span>
                        <img
                            className="clickable"
                            src="images/icons/filter.svg"
                            alt=""
                            onClick={showFilter}
                        />
                    </div>
                    {/* HEADER COLUMN 7 */}
                    <div className="column header cell last"></div>

                    {/* TABLE BODY */}
                    {recordsToDisplay ?
                    (recordsToDisplay.length ?
                        // IF THERE ARE RECORDS TO DISPLAY
                        recordsToDisplay.map((user: any, index: number) => {
                        return (
                            <>
                                {/* COLUMN 1 */}
                                <div
                                    className={"first cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}
                                >
                                    <span className='cell-text'>{user.orgName}</span>
                                </div>

                                {/* COLUMN 2 */}
                                <div className={"cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}>
                                    <span className='cell-text'>{user.userName}</span>
                                </div>

                                {/* COLUMN 3 */}
                                <div className={"cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}>
                                    <span className='cell-text email'>{user.email}</span>
                                </div>

                                {/* COLUMN 4 */}
                                <div className={"cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}>
                                    <span className='cell-text'>{user.phoneNumber}</span>
                                </div>

                                {/* COLUMN 5 */}
                                <div className={"cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}>
                                    <span className='cell-text'>{formatDate(user.createdAt)}</span>
                                </div>

                                {/* COLUMN 6 */}
                                <div className={"cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}>
                                    <span
                                        className={'cell-text status ' + (
                                            checkUserActive(user.lastActiveDate) ? "active" : "inactive"
                                        )}
                                    >
                                        {checkUserActive(user.lastActiveDate) ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* COLUMN 7 */}
                                <div className={"last cell" + ((index == (recordsToDisplay?.length || 0) - 1) ? " bottom-cell" : "")}>
                                    <img
                                        className='clickable'
                                        src="images/icons/vertical-dots.svg"
                                        alt=""
                                        onClick={(ev) => {openMenu(ev, user)}}
                                    />
                                </div>
                            </>
                        )
                    }) : (
                    // IF TABLE IS EMPTY
                    <>
                        <div className="cell"></div>
                        <div className="cell"></div>
                        <div className="cell"></div>
                        <div className="cell"></div>
                        <div className="cell"></div>
                        <div className="cell"></div>
                        <div className="cell"></div>
                    </>
                    )) : 
                    // WHILE DATA IS LOADING
                    <></>
                    }
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
                    <MenuItem onClick={() => {
                        closeMenu();
                        notAvailable();
                    }}>
                        <div className='user-menu-item'>
                            <img src="images/icons/blacklist.svg" alt="" />
                            <p>Blacklist User</p>
                        </div>
                    </MenuItem>
                    {
                        
                    }
                    <MenuItem onClick={() => {
                        closeMenu();
                        notAvailable();
                    }}>
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
                            <select
                                className='custom-select'
                                name="organization"
                                id="organization"
                                value={filterState.organization}
                                onChange={handleChange}
                            >
                                <option disabled value="">Select Organization</option>
                                {orgs.map((org: string) => <option value={org}>{org}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder='User'
                                onInput={handleChange}
                                value={filterState.username}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Email'
                                onInput={handleChange}
                                value={filterState.email}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="date">Date</label>
                            {/* <label htmlFor="date" className='date-label'>Date</label> */}
                            <input
                                type="date"
                                id="date"
                                name='date'
                                onInput={handleChange}
                                value={filterState.date}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name='phoneNumber'
                                placeholder='Phone Number'
                                value={filterState.phoneNumber}
                                onInput={handleChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <select
                                className='custom-select'
                                name="status"
                                id="status"
                                value={filterState.status}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="buttons">
                            <button className="clickable btn reset-btn" type='reset' onClick={resetFilter}>
                                Reset
                            </button>
                            <button
                                className="clickable btn filter-btn"
                                type='submit'
                                onClick={filter}
                            >
                                Filter
                            </button>
                        </div>
                    </form>
                </Menu>  
            </>) : (
                // WHEN THERE IS AN ISSUE GETTING USER DATA
                <div className='loading'>
                    {
                        failedToFetchUsers ?
                        (<p className='retry-prompt'>
                            Failed to fetch data, click
                            <span className='clickable retry' onClick={getUserData}>here</span>
                            to retry
                        </p>) :
                        <CircularProgress />
                    }
                </div>
            )}
            
            {/* TOAST CONTAINER */}
            <ToastContainer transition={Slide} />
        </div>
    )
}

export default Users