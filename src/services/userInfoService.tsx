import axios from "axios";

const getAllUsers = () => {
    return axios.get("https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users");
}

export { getAllUsers }