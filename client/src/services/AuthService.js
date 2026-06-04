class AuthService {
  login(username, password) {
    console.log("Login:", username);
  }

  register(user) {
    console.log("Register:", user);
  }

  logout() {
    console.log("Logout");
  }
}

export default new AuthService();