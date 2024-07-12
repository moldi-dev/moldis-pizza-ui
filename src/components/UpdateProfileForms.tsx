import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar.tsx";
import {Button} from "./ui/button.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Textarea} from "./ui/textarea.tsx";
import UserModel from '../models/UserModel.tsx';
import axios from "axios";
import StorageAPI from "../apis/StorageAPI.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert.tsx";
import {AlertCircle, Eye, EyeOff} from "lucide-react";

interface UpdateProfileFormProps {
    loggedInUser: UserModel | undefined;
    loggedInUserProfilePicture: string;
    updateLoggedInUserData: (updateLoggedInUserData: UserModel | undefined) => void;
    updateLoggedInUserProfilePicture: (updateLoggedInUserProfilePicture: string) => void;
}

const UpdateProfileForms: React.FC<UpdateProfileFormProps> = ({ loggedInUser, loggedInUserProfilePicture, updateLoggedInUserData, updateLoggedInUserProfilePicture }) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [validationErrors2, setValidationErrors2] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [successMessage2, setSuccessMessage2] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [user, setUser] = useState<UserModel | undefined>(loggedInUser);
    const [image, setImage] = useState<string>(loggedInUserProfilePicture);

    useEffect(() => {
        if (loggedInUser) {
            setUsername(loggedInUser.username);
            setEmail(loggedInUser.email);
            setUser(loggedInUser);
            setFirstName(loggedInUser.firstName);
            setLastName(loggedInUser.lastName);
            setAddress(loggedInUser.address);
            setImage(loggedInUserProfilePicture);
        }
    }, [loggedInUser, loggedInUserProfilePicture]);

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    }

    const handleChangePassword = async (e: {preventDefault: () => void; }) => {
        e.preventDefault();
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/users/change-password/id=${loggedInUser?.userId}`, {
                currentPassword,
                newPassword,
                confirmNewPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setSuccessMessage2(response.data.message);

            setTimeout(() => {
                setSuccessMessage2('');
            }, 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors2(error.response.data.data.validationErrors);
            }

            else if (error.response) {
                setErrorMessage2(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage2('');
                setValidationErrors2([]);
            }, 4000);
        }
    }

    const handleDeleteProfilePicture = async () => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/users/remove-image/id=${user?.userId}`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setSuccessMessage('Successfully removed your profile picture');
            setImage('');
            updateLoggedInUserProfilePicture('');

            setTimeout(() => setSuccessMessage(''), 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            }

            else if (error.response) {
                setErrorMessage('An unexpected error has occurred. Please try again later!');
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    const handleUpdateProfilePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            try {
                let formData = new FormData();
                formData.append('image', file);

                const response = await axios.post("http://localhost:8080/api/v1/images",
                    formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                const response2 = await axios.patch(`http://localhost:8080/api/v1/users/set-image/id=${user?.userId}/image-id=${response.data.data.imageDTO.imageId}`, null, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                const response3 = await axios.get(`http://localhost:8080/api/v1/images/id=${response2.data.data.userDTO.image.imageId}`)

                updateLoggedInUserProfilePicture(response3.data.data.base64EncodedImage);
                setImage(response3.data.data.base64EncodedImage);

                setSuccessMessage('Successfully updated your profile picture');

                setTimeout(() => setSuccessMessage(''), 4000);
            }

            catch (error) {
                console.log(error);

                if (error.response && error.response.status == 400) {
                    setValidationErrors(error.response.data.data.validationErrors);
                }

                else if (error.response) {
                    setErrorMessage('An unexpected error has occurred. Please try again later!');
                }

                setTimeout(() => {
                    setErrorMessage('');
                    setValidationErrors([]);
                }, 4000);
            }
        }
    }

    const handleUpdateProfileDetails = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/users/id=${loggedInUser?.userId}`, {
                username,
                firstName,
                lastName,
                email,
                address,
                password
            }, {
                headers: { Authorization: `Bearer ${accessToken}`}
            })

            setSuccessMessage('Successfully updated your profile');

            updateLoggedInUserData(response.data.data.userDTO);
            setUser(response.data.data.userDTO);

            setTimeout(() => setSuccessMessage(''), 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    return (
        <>
            {user &&
                <div className="max-w-3xl mx-auto p-6 sm:p-8 md:p-10 mt-10 mb-10">
                    <Card className="mb-10">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-center">Your profile</CardTitle>
                            <CardDescription className="text-center">Update your profile information</CardDescription>
                            {validationErrors.length > 0 && validationErrors.map((error, index) => (
                                <AlertDestructive
                                    key={index}
                                    title="Error"
                                    description={error}
                                />
                            ))}
                            {successMessage && (
                                <Alert variant="default">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            )}
                            {errorMessage && (
                                <AlertDestructive description={errorMessage} title="Error" />
                            )}
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-6">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={`data:image/jpeg;base64,${loggedInUserProfilePicture}`} />
                                    <AvatarFallback>{user.lastName.charAt(0).concat(user.firstName.charAt(0)).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Label htmlFor="picture">Change your profile picture</Label>
                                <Input id="picture"
                                       type="file"
                                       onChange={handleUpdateProfilePicture}/>
                                {image !== '' &&
                                    <Button onClick={handleDeleteProfilePicture}>Delete profile picture</Button>
                                }
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={user.username}
                                        disabled/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            placeholder="Enter your first name"
                                            defaultValue={user.firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Enter your last name"
                                            defaultValue={user.lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea id="address"
                                              rows={3}
                                              placeholder="Enter your address"
                                              defaultValue={user.address}
                                              onChange={e => setAddress(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user.email}
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password to confirm changes"
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <span onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showPassword ? <Eye /> : <EyeOff />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto" onClick={handleUpdateProfileDetails}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                    <Card className="mb-10">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-center">Change your password</CardTitle>
                            <CardDescription className="text-center">Enter your current password and your new password below to update your account's password</CardDescription>
                            {successMessage2 && (
                                <Alert variant="default">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{successMessage2}</AlertDescription>
                                </Alert>
                            )}
                            {errorMessage2 && (
                                <AlertDestructive description={errorMessage2} title="Error" />
                            )}
                            {validationErrors2.length > 0 && validationErrors2.map((error, index) => (
                                <AlertDestructive
                                    key={index}
                                    title="Error"
                                    description={error}
                                />
                            ))}
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter your current password"
                                        onChange={e => setCurrentPassword(e.target.value)}
                                    />
                                    <span onClick={toggleCurrentPasswordVisibility}
                                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showCurrentPassword ? <Eye/> : <EyeOff/>}
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter your new password"
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                    <span onClick={toggleNewPasswordVisibility}
                                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showNewPassword ? <Eye/> : <EyeOff/>}
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmNewPassword"
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        placeholder="Confirm your new password"
                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                    />
                                    <span onClick={toggleConfirmNewPasswordVisibility}
                                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showConfirmNewPassword ? <Eye/> : <EyeOff/>}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="ml-auto" onClick={handleChangePassword}>Change your password</Button>
                        </CardFooter>
                    </Card>
                </div>
            }
        </>
    );
};

export default UpdateProfileForms;