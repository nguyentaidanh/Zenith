import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

export const Sidebar: React.FC = () => {
    const { logout, state } = useStore();
    const { user } = state.auth;
    const activeLink = 'flex items-center px-4 py-2 text-white bg-gray-700 rounded-md';
    const defaultLink = 'flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors';

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
    };

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 text-white">
            <Link to="/admin" className="text-2xl font-bold text-white tracking-tight">
                Zenith Admin
            </Link>
            <div className="mt-2 text-sm text-gray-400">Welcome, {user?.name}</div>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <NavLink to="/admin" end className={({isActive}) => isActive ? activeLink : defaultLink}>
                        <HomeIcon />
                        <span className="mx-4 font-medium">Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/products" className={({isActive}) => isActive ? activeLink : defaultLink}>
                        <PackageIcon />
                        <span className="mx-4 font-medium">Products</span>
                    </NavLink>
                    <NavLink to="/admin/orders" className={({isActive}) => isActive ? activeLink : defaultLink}>
                        <ShoppingCartIcon />
                        <span className="mx-4 font-medium">Orders</span>
                    </NavLink>
                     <NavLink to="/admin/sales" className={({isActive}) => isActive ? activeLink : defaultLink}>
                        <TrendingUpIcon />
                        <span className="mx-4 font-medium">Sales</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({isActive}) => isActive ? activeLink : defaultLink}>
                        <UsersIcon />
                        <span className="mx-4 font-medium">Users</span>
                    </NavLink>
                    <NavLink to="/admin/ratings" className={({isActive}) => isActive ? activeLink : defaultLink}>
                        <StarIcon />
                        <span className="mx-4 font-medium">Ratings</span>
                    </NavLink>
                </nav>
                <div>
                     <Link to="/" className={defaultLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        <span className="mx-4 font-medium">View Site</span>
                    </Link>
                    <a href="#" onClick={handleLogout} className={defaultLink}>
                        <LogOutIcon />
                        <span className="mx-4 font-medium">Logout</span>
                    </a>
                </div>
            </div>
        </div>
    );
};