import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserActive } from "../services/userInfoService";
import { formatDate } from "../utils/dateFormatter";

function checkFirstOrLastCell(index: number, records: any[]) {
    if (index == 0) return 'first ';
    if (index == records.length) return 'last ';
    return '';
}

function UsersTable(props: {headers: any[], records: any[] | null, orgs: any[] | null, filter: any}) {

    const navigate = useNavigate();
    let [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // anchor element for user menu
    let [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);  // anchor element for filter modal
    let [userId, setUserId] = useState<any>(null);
    const open = Boolean(anchorEl);
    const filterOpen = Boolean(filterAnchor);
    let defaultFilterState = {
        organization: "",
        username: "",
        email: "",
        date: "",
        phoneNumber: "",
        status: ""
    }
    let [filterState, setFilterState] = useState(defaultFilterState);

    // OPEN FILTER MODAL
    const showFilter = (ev: React.MouseEvent<HTMLElement>) => {
        setFilterAnchor(ev.currentTarget);
    }

    // OPEN USER MENU MODAL
    const openMenu = (ev: React.MouseEvent<HTMLElement>, user: any) => {
        setAnchorEl(ev.currentTarget);
        setUserId(user.id);
    }

    // CLOSE FILTER AND USER MENUS
    const closeMenu = () => {
        setAnchorEl(null);
        setFilterAnchor(null);
    }

    // ON FILTER FORM INPUT CHANGED
    const handleChange = (ev: any) => {
        setFilterState(prev => {
            return {...prev, [ev.target.name]: ev.target.value}
        });
    }

    // ON FILTER BUTTON CLICKED
    const filter = (ev: any) => {
        ev.preventDefault();
        props.filter(filterState);
        closeMenu();
    }

    // RESET FILTER
    const resetFilter = () => {
        setFilterState(defaultFilterState);
        props.filter(defaultFilterState);
        closeMenu();
    }

    // NAVIGATE TO USER DETAILS PAGE
    const viewUser = () => {
        closeMenu();
        navigate("/user/" + userId);
    }

    const notAvailable = () => {}
    return (
        <>
        <div className="users-table">
            {/* TABLE HEADERS */}
            {props.headers.map((header, i) => (
                <div className={checkFirstOrLastCell(i, props.headers)+ "column header cell"}>
                    <span className="header-column-text">{header.name}</span>
                    <img
                        className="clickable"
                        src="images/icons/filter.svg"
                        alt=""
                        onClick={showFilter}
                    />
                </div>
            ))}

            {/* TABLE BODY */}
            {props.records?.length ?
                // IF THERE ARE RECORDS TO DISPLAY
                props.records?.map((user: any, index: number) => {
                    return (
                        <>
                            {/* COLUMN 1 */}
                            <div
                                className={"first cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}
                            >
                                <span className='cell-text'>{user.orgName}</span>
                            </div>

                            {/* COLUMN 2 */}
                            <div className={"cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{user.userName}</span>
                            </div>

                            {/* COLUMN 3 */}
                            <div className={"cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text email'>{user.email}</span>
                            </div>

                            {/* COLUMN 4 */}
                            <div className={"cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{user.phoneNumber}</span>
                            </div>

                            {/* COLUMN 5 */}
                            <div className={"cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}>
                                <span className='cell-text'>{formatDate(user.createdAt)}</span>
                            </div>

                            {/* COLUMN 6 */}
                            <div className={"cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}>
                                <span
                                    className={'cell-text status ' + (
                                        checkUserActive(user.lastActiveDate) ? "active" : "inactive"
                                    )}
                                >
                                    {checkUserActive(user.lastActiveDate) ? "Active" : "Inactive"}
                                </span>
                            </div>

                            {/* COLUMN 7 */}
                            <div className={"last cell" + ((index == (props.records?.length || 0) - 1) ? " bottom-cell" : "")}>
                                <img
                                    className='clickable'
                                    src="images/icons/vertical-dots.svg"
                                    alt=""
                                    onClick={(ev) => {openMenu(ev, user)}}
                                />
                            </div>
                        </>
                    )
                })
                :
                // IF TABLE IS EMPTY
                (
                    <>
                        {props.headers.map(() => <div className="cell"></div>)}
                    </>
                )}
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
            <form className='filter-form' onSubmit={filter}>
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
                        {props.orgs?.map((org: string) => <option value={org}>{org}</option>)}
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
                    >
                        Filter
                    </button>
                </div>
            </form>
        </Menu>
        </>
    )
}

export default UsersTable;