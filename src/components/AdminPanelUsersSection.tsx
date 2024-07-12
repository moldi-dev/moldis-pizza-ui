import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table.tsx";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./ui/dropdown-menu.tsx";
import {Button} from "./ui/button.tsx";
import {MoveHorizontalIcon} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "./ui/pagination.tsx";
import UserModel from "../models/UserModel.tsx";
import axios from "axios";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar.tsx";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "./ui/dialog.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import StorageAPI from "../apis/StorageAPI.tsx";

interface AdminPanelUsersSectionProps {
    users: UserModel[];
    page: number;
    numberOfPages: number;
    updatePage: (page: number) => void;
}

const AdminPanelUsersSection: React.FC<AdminPanelUsersSectionProps> = ({ users, page, numberOfPages, updatePage }) => {

    const [usersImages, setUsersImages] = useState<string[]>([]);
    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<UserModel | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserModel | null>(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    const openUpdateDialog = (user: UserModel) => {
        setEditingUser(user);
        setUsername(user.username);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setAddress(user.address);
    }

    const closeUpdateDialog = () => {
        setEditingUser(null);
        setUsername('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setAddress('');
    }

    const openAddDialog = () => {
        setIsOpenAddDialog(true);
        setUsername('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setAddress('');
        setPassword('');
    }

    const closeAddDialog = () => {
        setIsOpenAddDialog(false);
        setUsername('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setAddress('');
        setPassword('');
    }

    const openDeleteDialog = (user: UserModel) => {
        setDeletingUser(user);
    }

    const closeDeleteDialog = () => {
        setDeletingUser(null);
    }

    const handleAddUser = async () => {
        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/users', {
                username,
                firstName,
                lastName,
                email,
                address,
                password
            }, {
                headers: { Authorization: `Bearer ${accessToken}`}
            });

            window.location.reload();
            closeAddDialog();
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

    const handleUpdateUser = async (userId: number) => {
        if (!editingUser) return;

        const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

        try {
            const updatedUser = { ...editingUser, username, email, firstName, lastName, address };

            const response = await axios.patch(`http://localhost:8080/api/v1/users/admin/id=${userId}`, {
                username,
                firstName,
                lastName,
                email,
                address,
            }, {
                headers: { Authorization: `Bearer ${accessToken}`}
            });

            window.location.reload();
            closeUpdateDialog();
        }

        catch (error) {
            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!deletingUser) return;

        try {
            const accessToken = await StorageAPI.getAccessTokenFromLocalStorage();

            const response = await axios.delete(`http://localhost:8080/api/v1/users/id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            window.location.reload();
            closeDeleteDialog();
        }

        catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < numberOfPages) {
            updatePage(newPage);
        }
    };

    useEffect(() => {
        async function fetchUsersImages() {
            const fetchedImages = new Array(users.length).fill('');

            const imagePromises = users.map(async (user, index) => {
                const imageDataResponse = await axios.get(`http://localhost:8080/api/v1/images/id=${user.image.imageId}`);

                fetchedImages[index] = imageDataResponse.data.data.base64EncodedImage;
            });

            await Promise.all(imagePromises);

            setUsersImages(fetchedImages);
        }

        fetchUsersImages();
    }, []);

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage the users and their details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Last name</TableHead>
                                    <TableHead>First name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 && users.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{user.userId}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.lastName}</TableCell>
                                            <TableCell>{user.firstName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.address}</TableCell>
                                            <TableCell>
                                                <Avatar className="h-12 w-12 border-2 border-white">
                                                    <AvatarImage src={`data:image/jpeg;base64,${usersImages[index]}`} alt="user avatar" />
                                                    <AvatarFallback>{user.lastName.charAt(0).concat(user.firstName.charAt(0)).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoveHorizontalIcon className="w-4 h-4" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openUpdateDialog(user)}>Update</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteDialog(user)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Pagination>
                            <PaginationContent>
                                {page > 0 && (
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                                </PaginationItem>
                                {page < numberOfPages - 1 && (
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(page + 1)} />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                        <Button onClick={openAddDialog}>Add a new user</Button>
                        <Dialog open={isOpenAddDialog} onOpenChange={setIsOpenAddDialog}>
                            <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                                <DialogHeader>
                                    <DialogTitle>Add a new user</DialogTitle>
                                    {validationErrors.length > 0 && validationErrors.map((error, index) => (
                                        <AlertDestructive
                                            key={index}
                                            title="Error"
                                            description={error}
                                        />
                                    ))}
                                    {errorMessage && (
                                        <AlertDestructive description={errorMessage} title="Error" />
                                    )}
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">Username</Label>
                                        <Input id="username" className="col-span-3" onChange={e => setUsername(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lastName" className="text-right">Last name</Label>
                                        <Input id="lastName" onChange={e => setLastName(e.target.value)} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="firstName" className="text-right">First name</Label>
                                        <Input id="firstName" onChange={e => setFirstName(e.target.value)} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input id="email" className="col-span-3" onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="address" className="text-right">Address</Label>
                                        <Input id="address" onChange={e => setAddress(e.target.value)} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">Password</Label>
                                        <Input id="password" onChange={e => setPassword(e.target.value)} className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddUser}>Add a new user</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            </main>

            {/* Update Dialog */}
            {editingUser && (
                <Dialog open={!!editingUser} onOpenChange={closeUpdateDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Edit user profile</DialogTitle>
                        </DialogHeader>
                        {validationErrors.length > 0 && validationErrors.map((error, index) => (
                            <AlertDestructive
                                key={index}
                                title="Error"
                                description={error}
                            />
                        ))}
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error" />
                        )}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Username</Label>
                                <Input id="username" defaultValue={editingUser.username} className="col-span-3" disabled/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lastName" className="text-right">Last name</Label>
                                <Input id="lastName" onChange={e => setLastName(e.target.value)} defaultValue={editingUser.lastName} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="firstName" className="text-right">First name</Label>
                                <Input id="firstName" onChange={e => setFirstName(e.target.value)} defaultValue={editingUser.firstName} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" defaultValue={editingUser.email} className="col-span-3" disabled />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Address</Label>
                                <Input id="address" onChange={e => setAddress(e.target.value)} defaultValue={editingUser.address} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => handleUpdateUser(editingUser?.userId)}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Dialog */}
            {deletingUser && (
                <Dialog open={!!deletingUser} onOpenChange={closeDeleteDialog}>
                    <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-scroll" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Delete user</DialogTitle>
                            <DialogDescription>
                                Are you sure that you want to delete the user '{deletingUser.username}'? This operation will also delete its
                                associated basket and orders. This operation cannot be undone!
                            </DialogDescription>
                        </DialogHeader>
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error" />
                        )}
                        <DialogFooter>
                            <Button onClick={() => handleDeleteUser(deletingUser?.userId)}>Delete user</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default AdminPanelUsersSection;