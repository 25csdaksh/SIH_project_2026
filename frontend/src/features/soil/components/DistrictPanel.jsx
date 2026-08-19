import React from 'react';
import { SoilDetails } from './SoilDetails';
import { CropList } from './CropList';
import { APMCInfo } from './APMCInfo';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/common/ErrorMessage';

export const DistrictPanel = ({ districtDetail, crops = [], loading, error }) => {
  if (loading) return <Loader message="Fetching district soil information..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!districtDetail) return null;

  const { districtName, districtCode, region, soilInformation } = districtDetail;

  return (
    <div className="district-detail-panel">
      <div className="panel-badge-row">
        <span className="badge badge-success">{districtCode}</span>
        <span className="badge badge-info">{region}</span>
      </div>

      <h2 className="district-title">{districtName} District Soil Profile</h2>

      {soilInformation && (
        <>
          <SoilDetails soilInfo={soilInformation} />
          <CropList crops={crops} />
          <APMCInfo apmcs={soilInformation.nearbyAPMCMarkets} />
        </>
      )}
    </div>
  );
};
