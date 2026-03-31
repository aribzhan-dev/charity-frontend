import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './Filters.css';

const Filters = ({ filters, setFilters }) => {
  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="filters-card card">
      <div className="filters-grid">
        <div className="filter-group">
          <label>{t('admin.age')}</label>
          <input 
            type="text" 
            name="age" 
            value={filters.age} 
            onChange={handleChange} 
            placeholder="999" 
          />
        </div>
        <div className="filter-group">
          <label>{t('admin.type')}</label>
          <select name="helpType" value={filters.helpType} onChange={handleChange}>
            <option value="">{t('admin.filters')}</option>
            <option value="food">{t('helpTypes.food')}</option>
            <option value="medical">{t('helpTypes.medical')}</option>
            <option value="housing">{t('helpTypes.housing')}</option>
            <option value="education">{t('helpTypes.education')}</option>
            <option value="other">{t('helpTypes.other')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('admin.status')}</label>
          <select name="maritalStatus" value={filters.maritalStatus} onChange={handleChange}>
            <option value="">{t('admin.filters')}</option>
            <option value="single">{t('maritalStatuses.single')}</option>
            <option value="married">{t('maritalStatuses.married')}</option>
            <option value="divorced">{t('maritalStatuses.divorced')}</option>
            <option value="widowed">{t('maritalStatuses.widowed')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
