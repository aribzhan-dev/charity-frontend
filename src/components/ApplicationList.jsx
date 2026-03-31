import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import './ApplicationList.css';

const ApplicationList = ({ applications }) => {
  const { t } = useLanguage();

  if (applications.length === 0) {
    return <div className="no-data">{t('admin.noData')}</div>;
  }

  return (
    <div className="table-container">
      <table className="app-table">
        <thead>
          <tr>
            <th>{t('form.fullName')}</th>
            <th>{t('form.age')}</th>
            <th>{t('form.phone')}</th>
            <th>{t('form.helpType')}</th>
            <th>{t('form.maritalStatus')}</th>
            <th>{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={index}>
              <td>{app.fullName}</td>
              <td>{app.age}</td>
              <td>{app.phone}</td>
              <td>{app.helpType === 'other' ? app.otherHelp : t(`helpTypes.${app.helpType}`)}</td>
              <td>{t(`maritalStatuses.${app.maritalStatus}`)}</td>
              <td className="actions">
                <button className="btn btn-outline btn-sm">{t('admin.view')}</button>
                {app.files && app.files.length > 0 && (
                  <button className="btn btn-outline btn-sm">{t('admin.download')}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
