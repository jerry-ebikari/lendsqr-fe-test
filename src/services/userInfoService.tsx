import axios from "axios";

const getAllUsers = () => {
    return axios.get("https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users");
}

const getUser = (id: string) => {
    return axios.get("https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users/" + id);
}

const checkUserActive = (lastActiveDate: any) => {
    let lastActive = new Date(lastActiveDate);
    let today = new Date();
    if (lastActive.getFullYear() > today.getFullYear()) return true;
    let differenceInDays = (today.getTime() - lastActive.getTime()) / 1000 / 60 / 60 / 24;
    return differenceInDays < 10;
}

export { getAllUsers, getUser, checkUserActive }