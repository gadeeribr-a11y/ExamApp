import { users } from "../data/mockData";

class AuthService {
  login(email, password) {
    return users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );
  }

  logout() {
    console.log("Logout");
  }
}

export default new AuthService();

