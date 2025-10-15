import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    linkTo?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, linkTo }) => {
    const content = (
        <div className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-between ${linkTo ? 'transition-all duration-300 hover:shadow-lg hover:scale-105' : ''}`}>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className="text-accent bg-blue-100 p-3 rounded-full">
                {icon}
            </div>
        </div>
    );

    if (linkTo) {
        return (
            <Link to={linkTo} className="block">
                {content}
            </Link>
        );
    }

    return content;
};