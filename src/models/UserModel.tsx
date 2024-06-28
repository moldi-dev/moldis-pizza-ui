import ImageModel from "./ImageModel.tsx";

interface UserModel {
    userId: number,
    username: string,
    image: ImageModel,
    firstName: string,
    lastName: string,
    email: string,
    address: string,
}

export default UserModel;