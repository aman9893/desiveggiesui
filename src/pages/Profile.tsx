import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";
import { LogOut, Edit2, Save, X, ArrowLeft } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPasswordMode, setIsPasswordMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Name and email are required");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.put("/users/profile", formData);
            toast.success("Profile updated successfully");
            setIsEditMode(false);
            // Update local state
            setFormData({
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone || "",
            });
            // Update AuthContext
            updateUser(data.user);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await api.put("/users/update-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password updated successfully");
            setIsPasswordMode(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.success("Logged out successfully");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{user.name}</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm"
                        >
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                            Logout
                        </button>
                    </div>

                    {/* User Avatar and Email Info */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Email</p>
                            <p className="text-xs sm:text-sm text-gray-900 font-medium">{user.email}</p>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="text-xs sm:text-sm text-gray-500 border-t pt-4">
                        <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Edit Profile Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h2>
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                            {isEditMode ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                            {isEditMode ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    {isEditMode ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateProfile();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600">Full Name</label>
                                <p className="text-xs sm:text-sm text-gray-900 font-medium">{formData.name}</p>
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600">Email Address</label>
                                <p className="text-xs sm:text-sm text-gray-900 font-medium">{formData.email}</p>
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm text-gray-600">Phone Number</label>
                                <p className="text-xs sm:text-sm text-gray-900 font-medium">{formData.phone || "Not provided"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Change Password</h2>
                        <button
                            onClick={() => setIsPasswordMode(!isPasswordMode)}
                            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                            {isPasswordMode ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                            {isPasswordMode ? "Cancel" : "Change"}
                        </button>
                    </div>

                    {isPasswordMode ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdatePassword();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    ) : (
                        <p className="text-xs sm:text-sm text-gray-600">
                            Keep your account secure by changing your password regularly.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
