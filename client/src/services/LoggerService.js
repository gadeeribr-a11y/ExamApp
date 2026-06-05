class LoggerService {
  log(message) {
    console.log(message);
  }

  error(message) {
    console.error(message);
  }
}

export default new LoggerService();
