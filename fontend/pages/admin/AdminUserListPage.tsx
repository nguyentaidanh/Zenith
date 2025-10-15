import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Button } from '../../components/Button';
import { useStore } from '../../context/StoreContext';
import * as api from '../../utils/api';
import { Spinner } from '../../components/Spinner';

export const AdminUserListPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { state } = useStore();
    const { user: currentUser } = state.auth;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await api.getAdminUsers();
                setUsers(data);
            } catch (err) {
                setError("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleResetPassword = async (user: User) => {
        if (window.confirm(`Are you sure you want to reset the password for ${user.name}?`)) {
            try {
                await api.resetUserPassword(user.id);
                alert(`Password for ${user.name} has been reset.`);
            } catch (err: any) {
                alert(`Failed to reset password: ${err.message}`);
            }
        }
    };
    
    const renderTableBody = () => {
        if (loading) return <tr><td colSpan={5} className="text-center py-8"><Spinner /></td></tr>;
        if (error) return <tr><td colSpan={5} className="text-center py-8 text-red-500">{error}</td></tr>;
        if (users.length === 0) return <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>;
        
        return users.map(user => (
            <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-gray-200 text-gray-800'}`}>
                        {user.role}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.orders.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                        variant="secondary"
                        className="!py-1 !px-3 !text-xs"
                        onClick={() => handleResetPassword(user)}
                        disabled={user.id === currentUser?.id}
                        title={user.id === currentUser?.id ? "You cannot reset your own password." : "Reset user's password"}
                    >
                        Reset Password
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderTableBody()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
