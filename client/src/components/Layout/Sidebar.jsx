import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Map, Wrench, 
  Fuel, BarChart3, Settings, UserPlus, LogOut
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
    { name: 'Fleet', path: '/fleet', icon: Truck, roles: ['Fleet Manager', 'Dispatcher'] },
    { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
    { name: 'Trips', path: '/trips', icon: Map, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer'] },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['Fleet Manager'] },
    { name: 'Fuel & Expenses', path: '/fuel', icon: Fuel, roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
    { name: 'User Management', path: '/users', icon: UserPlus, roles: ['Fleet Manager'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Fleet Manager'] },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/favicon.svg" alt="TransitOps Logo" style={{ width: '28px', height: '28px' }} />
          <h2>TransitOps</h2>
        </Link>
        <span className="role-badge">{role}</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => {
          if (!link.roles.includes(role)) return null;
          
          return (
            <NavLink 
              key={link.name} 
              to={link.path}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              <link.icon className="nav-icon" size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
