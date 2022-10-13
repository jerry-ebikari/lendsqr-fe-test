import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { getUser } from "../services/userInfoService";
import formatNumber from '../utils/numberFormatter';
import "../styles/User.scss";

function User() {
    let { id } = useParams();
    const navigate = useNavigate();
    let [user, setUser] = useState<any>(null);
    let [active, setActive] = useState("general");
    const changeActive = (ev: any) => {
        setActive(ev.target.dataset.tab);
    }
    useEffect(() => {
        getUser(id ? id : "")
        .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data))
            setUser(res.data);
            // console.log(res.data);
        })
    }, [])
    return (
        <div className='user-container'>
            <div className='clickable flex align-center back-to-users' onClick={() => {navigate("/users")}}>
                <img src="/images/icons/back-arrow.svg" alt="" />
                <span>Back to Users</span>
            </div>
            <div className="flex align-center page-title-section">
                <h1 className='page-header'>User Details</h1>
                <div className="flex buttons">
                    <button className='clickable btn blacklist-btn'>Blacklist User</button>
                    <button className='clickable btn activate-btn'>Activate User</button>
                </div>
            </div>
            {user ? (<>
            <div className="flex basic-info">
                <img id="avatar-img" src={user ? user.profile.avatar : "/images/default-avatar.svg"} alt="" />
                <div className="flex personal info align-center">
                    <div className="name-container">
                        <p className='username header-text fw-500'>
                            {user.profile.firstName + " " + user.profile.lastName}
                        </p>
                        <p className='text primary-text fs-14 fw-400'>{user.accountNumber}</p>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="tier info">
                    <p className='primary-text fs-14 fw-500'>User's Tier</p>
                    <div className="flex rating">
                        <img src="/images/icons/filled-star.svg" alt="" />
                        <img src="/images/icons/star.svg" alt="" />
                        <img src="/images/icons/star.svg" alt="" />
                    </div>
                </div>
                <div className="divider"></div>
                <div className="bank info">
                    <p className='header-text fw-500 balance'>₦{formatNumber(Number(user.accountBalance))}</p>
                    <p className='header-text fs-12 fw-400 bank-name'>{user.accountNumber}/Providus Bank</p>
                </div>
                <div className="flex tabs">
                    <p className={'tab' + (active == "general" ? " active" : "")} data-tab="general" onClick={changeActive}>
                        General Details
                    </p>
                    <p className={'tab' + (active == "docs" ? " active" : "")} data-tab="docs" onClick={changeActive}>
                        Documents
                    </p>
                    <p className={'tab' + (active == "bank" ? " active" : "")} data-tab="bank" onClick={changeActive}>
                        Bank Details
                    </p>
                    <p className={'tab' + (active == "loan" ? " active" : "")} data-tab="loan" onClick={changeActive}>
                        Loans
                    </p>
                    <p className={'tab' + (active == "savings" ? " active" : "")} data-tab="savings" onClick={changeActive}>
                        Savings
                    </p>
                    <p className={'tab' + (active == "app" ? " active" : "")} data-tab="app" onClick={changeActive}>
                        App and System
                    </p>
                </div>
            </div>

            {/* DETAILS */}
            <div className="details">
                {/* PERSONAL INFORMATION */}
                <div className="personal section">
                    <h2 className="section-header">Personal Information</h2>
                    <div className="fields">
                        <div className="field">
                            <p className='field-label'>Full Name</p>
                            <p className='field-value'>{user.profile.firstName + " " + user.profile.lastName}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Phone Number</p>
                            <p className='field-value'>{user.profile.phoneNumber}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Email Address</p>
                            <p className='field-value'>{user.email}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>BVN</p>
                            <p className='field-value'>{user.profile.bvn}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Gender</p>
                            <p className='field-value'>{user.profile.gender}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Address</p>
                            <p className='field-value'>{user.profile.address}</p>
                        </div>
                    </div>
                </div>

                {/* EDUCATION AND EMPLOYMENT */}
                <div className="education section">
                    <h2 className="section-header">Education and employment</h2>
                    <div className="fields">
                        <div className="field">
                            <p className='field-label'>Level of Education</p>
                            <p className='field-value'>{user.education.level}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Employment Status</p>
                            <p className='field-value'>{user.education.employmentStatus}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Sector of Employment</p>
                            <p className='field-value'>{user.education.sector}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Duration of Employment</p>
                            <p className='field-value'>{user.education.duration}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Office Email</p>
                            <p className='field-value'>{user.education.officeEmail}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Monthly Income</p>
                            <p className='field-value'>
                                {(() => {
                                    let i = [...user.education.monthlyIncome.sort((a: any, b: any) => Number(a) - Number(b))];
                                    return `₦${i[0]} - ₦${i[1]}`
                                })()}
                            </p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Loan Repayment</p>
                            <p className='field-value'>{user.education.loanRepayment}</p>
                        </div>
                    </div>
                </div>

                {/* SOCIALS */}
                <div className="socials section">
                    <h2 className="section-header">Socials</h2>
                    <div className="fields">
                        {Object.keys(user.socials).map(social => {
                            return (<div className="field">
                                <p className='field-label'>{social}</p>
                                <p className='field-value'>{user.socials[social]}</p>
                            </div>)
                        })}
                    </div>
                </div>

                {/* GUARANTOR */}
                <div className="guarantor section">
                    <h2 className="section-header">Guarantor</h2>
                    <div className="fields">
                        <div className="field">
                            <p className='field-label'>Full Name</p>
                            <p className='field-value'>{user.guarantor.firstName + " " + user.guarantor.lastName}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Phone Number</p>
                            <p className='field-value'>{user.guarantor.phoneNumber}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>Address</p>
                            <p className='field-value'>{user.guarantor.address}</p>
                        </div>
                        <div className="field">
                            <p className='field-label'>GENDER</p>
                            <p className='field-value'>{user.guarantor.gender}</p>
                        </div>
                    </div>
                </div>
            </div>
            </>) : (
            <div className='loading'>
                <CircularProgress />
            </div>)}
        </div>
    )
}

export default User;