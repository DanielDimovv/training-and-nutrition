export class EmailAlreadyExistsError extends Error {
    constructor() {
      super("Email already exists");
      this.name = "EmailAlreadyExistsError";
    }
  }
  
  export class UserCreateFailedError extends Error {
    constructor() {
      super("User creation failed");
      this.name = "UserCreateFailedError";
    }
  }