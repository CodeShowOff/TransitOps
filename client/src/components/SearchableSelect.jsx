import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, name, placeholder, required, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="searchable-select" ref={wrapperRef} style={{ position: 'relative' }}>
      <div 
        className="form-input" 
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          userSelect: 'none',
          minHeight: '44px',
          borderColor: isOpen ? 'var(--brand-primary)' : 'var(--border-color)',
          boxShadow: isOpen ? '0 0 0 1px var(--brand-primary)' : 'none',
          paddingRight: '12px',
          ...style
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedOption ? 'inherit' : 'var(--text-muted)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={18} 
          style={{ 
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'none', 
            transition: 'transform 0.2s ease' 
          }} 
        />
      </div>
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: 'calc(100% + 4px)', 
          left: 0, 
          right: 0, 
          zIndex: 50, 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)',
          borderRadius: '8px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '260px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ 
                width: '100%', 
                padding: '8px 12px 8px 36px',
                minHeight: '36px',
                fontSize: '0.9rem'
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                No options found
              </div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt.value} 
                  style={{ 
                    padding: '10px 16px', 
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    background: value === opt.value ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                    color: value === opt.value ? 'var(--brand-primary)' : 'var(--text-primary)',
                    fontWeight: value === opt.value ? '500' : '400',
                    transition: 'background 0.1s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => {
                    onChange({ target: { name, value: opt.value } });
                    setIsOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    if (value !== opt.value) e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (value !== opt.value) e.target.style.background = 'transparent';
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {required && !value && (
        <input 
          type="text" 
          required 
          value=""
          onChange={() => {}}
          style={{ opacity: 0, position: 'absolute', height: 0, width: 0, bottom: 0, left: '50%', pointerEvents: 'none' }} 
        />
      )}
    </div>
  );
};

export default SearchableSelect;
