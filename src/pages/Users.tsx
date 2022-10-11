import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import "../styles/Users.scss";
import { getAllUsers } from '../services/userInfoService';


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

function formatNumber(num: number) {
    if (num < 1000) return num;
    let numAsString = String(num);
    let numberOfDigits = numAsString.length;
    let left = "";
    let right = "";
    let numberOfLeftCharacters = numberOfDigits % 3 == 0 ? 3 : numberOfDigits % 3;
    left = numAsString.slice(0, numberOfLeftCharacters);
    right = numAsString.slice(numberOfLeftCharacters);
    right = right.replace(/(.{3})/g, "$1,")
    let result = left + "," + right;
    return result.replace(/,$/, "");
}

interface UserData {
    data: any
}


function Users() {
    let [users, setUsers] = useState<UserData>({data: null});
    let [dataFetched, setDataFetched] = useState(false);
    let [numberOfRecords, setNumberOfRecords] = useState(10);
    let [numberOfRecordsToDisplay, setNumberOfRecordsToDisplay] = useState(10);
    let [recordsToDisplay, setRecordsToDisplay] = useState<UserData>({data: null});
    let [numPages, setNumPages] = useState(1);
    let [page, setPage] = useState(1);
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
    useEffect(() => {}, [recordsToDisplay.data])
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
                    <img className="clickable" src="images/icons/filter.svg" alt="" />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Username</span>
                    <img className="clickable" src="images/icons/filter.svg" alt="" />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Email</span>
                    <img className="clickable" src="images/icons/filter.svg" alt="" />
                </div>
                <div className="column header cell phone">
                    <span className='header-column-text'>Phone number</span>
                    <img className="clickable" src="images/icons/filter.svg" alt="" />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Date joined</span>
                    <img className="clickable" src="images/icons/filter.svg" alt="" />
                </div>
                <div className="column header cell">
                    <span className='header-column-text'>Status</span>
                    <img className="clickable" src="images/icons/filter.svg" alt="" />
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
                                <span className='cell-text'>Active</span>
                            </div>
                            <div className={"last cell" + ((index == recordsToDisplay.data.length - 1) ? " bottom-cell" : "")}>
                                <img className='clickable' src="images/icons/vertical-dots.svg" alt="" />
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
        </div>
    )
}

export default Users