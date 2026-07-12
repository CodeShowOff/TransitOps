import React, { useState, useEffect } from 'react';
import { X, User, Hash, Phone, Mail, MapPin, IdCard, Calendar, ShieldCheck, Settings } from 'lucide-react';

const DriverForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        phone: '',
        email: '',
        address: '',
        licenseNumber: '',
        licenseCategory: 'LMV',
        licenseExpiry: '',
        safetyScore: 100,
        status: 'Available'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                licenseExpiry: initialData.licenseExpiry ? new Date(initialData.licenseExpiry).toISOString().split('T')[0] : ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isEditing = !!initialData;
    const isStatusLocked = initialData?.status === 'On Trip';

    return (
        <div className="modal-overlay">
            <div className="ai-modal-content">
                <div className="ai-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: 'rgba(139, 92, 246, 0.15)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--brand-secondary)',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}>
                            <User size={20} />
                        </div>
                        <div>
                            <h2>{isEditing ? 'Update Driver Profile' : 'Register New Driver'}</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.1rem' }}>
                                {isEditing ? 'Modify existing driver details' : 'Add a new driver to the fleet'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="modal-close" style={{ alignSelf: 'flex-start' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    <div className="ai-modal-body" style={{ flex: 1, overflowY: 'auto' }}>
                        <div className="form-grid">
                            <div className="ai-input-group full-width">
                                <label className="ai-label">Full Name <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        minLength="3"
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">Employee ID <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Hash size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                        required
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="DRV-001"
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">Phone <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="\d{10}"
                                        title="10 digit phone number"
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="1234567890"
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="driver@transitops.com"
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">Address</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <MapPin size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="123 Main St, City"
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">License Number <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <IdCard size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        required
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                        placeholder="DL-123456789"
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">License Category <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                                <select
                                    name="licenseCategory"
                                    value={formData.licenseCategory}
                                    onChange={handleChange}
                                    className="ai-input ai-select"
                                >
                                    <option value="LMV">LMV</option>
                                    <option value="HMV">HMV</option>
                                    <option value="MCWG">MCWG</option>
                                    <option value="Transport">Transport</option>
                                </select>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">License Expiry <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        name="licenseExpiry"
                                        value={formData.licenseExpiry}
                                        onChange={handleChange}
                                        required
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem', colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">Safety Score</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <ShieldCheck size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        name="safetyScore"
                                        value={formData.safetyScore}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className="ai-input"
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>

                            <div className="ai-input-group">
                                <label className="ai-label">Status</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Settings size={18} />
                                    </div>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={isStatusLocked}
                                        className="ai-input ai-select"
                                        style={{
                                            opacity: isStatusLocked ? 0.6 : 1,
                                            paddingLeft: '2.5rem',
                                            cursor: isStatusLocked ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Off Duty">Off Duty</option>
                                        <option value="Suspended">Suspended</option>
                                        {initialData?.status === 'On Trip' && <option value="On Trip">On Trip</option>}
                                    </select>
                                </div>
                                {isStatusLocked && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <span style={{ display: 'inline-block', width: 4, height: 4, background: 'var(--error)', borderRadius: '50%' }}></span>
                                            Status locked while driver is On Trip.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="ai-modal-footer">
                        <button type="button" onClick={onCancel} className="ai-btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="ai-btn-primary">
                            {isEditing ? 'Save Changes' : 'Register Driver'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverForm;