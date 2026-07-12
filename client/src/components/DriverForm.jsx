import React, { useState, useEffect } from 'react';

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

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
                <label>Name *: </label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required minLength="3" />
            </div>
            <div>
                <label>Employee ID *: </label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone *: </label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required pattern="\d{10}" title="10 digit phone number" />
            </div>
            <div>
                <label>Email: </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label>Address: </label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div>
                <label>License Number *: </label>
                <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
            </div>
            <div>
                <label>License Category *: </label>
                <select name="licenseCategory" value={formData.licenseCategory} onChange={handleChange}>
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                    <option value="MCWG">MCWG</option>
                    <option value="Transport">Transport</option>
                </select>
            </div>
            <div>
                <label>License Expiry *: </label>
                <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} required />
            </div>
            <div>
                <label>Safety Score: </label>
                <input type="number" name="safetyScore" value={formData.safetyScore} onChange={handleChange} min="0" max="100" />
            </div>
            <div>
                <label>Status: </label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>

            <div style={{ marginTop: '10px' }}>
                <button type="submit">Save Driver</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
        </form>
    );
};

export default DriverForm;