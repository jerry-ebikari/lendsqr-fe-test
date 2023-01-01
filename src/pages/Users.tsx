import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Users.scss";
import { getAllUsers, checkUserActive } from '../services/userInfoService';
import compareDates from "../utils/compareDates";
import UsersTable from '../components/Users/UsersTable';
import tableHeaders from '../services/tableHeaders';
import UsersTableFooter from '../components/Users/UsersTableFooter';


function Users() {
    let [users, setUsers] = useState<any[] | null>(null); // all users
    let [failedToFetchUsers, setFailedToFetchUsers] = useState(false);
    let [numberOfRecords, setNumberOfRecords] = useState(10);
    let [numberOfRecordsToDisplay, setNumberOfRecordsToDisplay] = useState(10);
    let [recordsToDisplay, setRecordsToDisplay] = useState<any[] | null>(null);
    let [numPages, setNumPages] = useState(1);
    let [page, setPage] = useState(1);
    let [orgs, setOrgs] = useState<any>(null);
    let [isFilterApplied, setFilterApplied] = useState<Boolean>(false);
    let [filteredRecords, setFilteredRecords] = useState<any>(null);
    let headers = tableHeaders;

    // UPDATE NUMBER OF RECORDS TO DISPLAY
    const updateNumberOfRecordsToDisplay = (value: number) => {
        setNumberOfRecordsToDisplay(value);
        setPage(1);
        updateRecordsDisplayed(value);
    }

    // UPDATE THE DISPLAYED RECORDS
    const updateRecordsDisplayed = (value: number) => {
        let startIndex = page * value - value;
        let endIndex = page * value;
        let newRecords = (isFilterApplied ? filteredRecords : users).slice(startIndex, endIndex);
        setRecordsToDisplay(newRecords);
    }

    // UPDATE PAGE NUMBER
    const updatePage = (value: number) => setPage(value);

    // FILTER BUTTON CLICKED
    const filterUsers = (filterState: any) => {
        let filteredRecords = users?.filter((user: any) => (
                (filterState.organization ? (user.orgName == filterState.organization) : true) &&
                (filterState.username ? user.userName.toLowerCase().includes(filterState.username.toLowerCase()) : true) &&
                (filterState.email ? user.email.toLowerCase().includes(filterState.email.toLowerCase()) : true) && 
                (filterState.status ? ((checkUserActive(user.lastActiveDate) ? "active" : "inactive") == filterState.status) : true) &&
                (filterState.phoneNumber ? user.phoneNumber.toLowerCase().includes(filterState.phoneNumber.toLowerCase()) : true) && 
                (filterState.date ? compareDates(filterState.date, user.createdAt) : true)
            )
        )
        setFilteredRecords(filteredRecords);
        setNumberOfRecords(filteredRecords?.length || 0);
        setFilterApplied(true);
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
                <UsersTable
                    headers={headers}
                    records={recordsToDisplay}
                    orgs={orgs}
                    filter={filterUsers}
                    showError={notAvailable}
                />

                <UsersTableFooter
                    numberOfRecordsToDisplay={numberOfRecordsToDisplay}
                    totalNumberOfRecords={numberOfRecords}
                    page={page}
                    numPages={numPages}
                    updateRecordsDisplayed={updateNumberOfRecordsToDisplay}
                    updatePage={updatePage}
                />
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