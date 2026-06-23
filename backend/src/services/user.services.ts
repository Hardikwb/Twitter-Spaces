import userModel from "../models/user.models.js";
class UserService {
  async findUser(filter: object) {
    const user = await userModel.findOne(filter);
    return user;
  }

  async createUser(filter: object) {
    const user = await userModel.create(filter);
    return user;
  }
}

const userservice = new UserService();

export default userservice;
