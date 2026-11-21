import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { mockCategories } from '../../data/mockCategories';
import Button from '../common/Button';

const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
const WORKPLACE_TYPES = ['Remote', 'Hybrid', 'Onsite'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Director'];

const FilterSidebar = ({ className = '' }) => {
  const { searchFilters, updateSearchFilters, resetSearchFilters, filteredJobs, jobs } = useJobs();

  const handleJobTypeToggle = (type) => {
    const current = searchFilters.jobTypes;
    const exists = current.includes(type);
    const updated = exists ? current.filter((t) => t !== type) : [...current, type];
    updateSearchFilters({ jobTypes: updated });
  };

  const handleWorkplaceToggle = (wp) => {
    const current = searchFilters.workplaceTypes || [];
    const exists = current.includes(wp);
    const updated = exists ? current.filter((w) => w !== wp) : [...current, wp];
    updateSearchFilters({ workplaceTypes: updated });
  };

  const handleExperienceToggle = (exp) => {
    const current = searchFilters.experienceLevels;
    const exists = current.includes(exp);
    const updated = exists ? current.filter((e) => e !== exp) : [...current, exp];
    updateSearchFilters({ experienceLevels: updated });
  };

  const hasActiveFilters =
    searchFilters.category !== 'all' ||
    searchFilters.jobTypes.length > 0 ||
    (searchFilters.workplaceTypes && searchFilters.workplaceTypes.length > 0) ||
    searchFilters.experienceLevels.length > 0 ||
    searchFilters.minSalary > 0 ||
    searchFilters.keyword !== '' ||
    searchFilters.location !== '';

  return (
    <aside className={`filter-sidebar ${className}`}>
      {/* Header */}
      <div className="filter-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#4f46e5" />
          <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetSearchFilters}
            className="btn btn-ghost btn-sm"
            style={{ color: '#ef4444', fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
          >
            <RotateCcw size={13} style={{ marginRight: '4px' }} />
            Reset All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="filter-group">
        <div className="filter-group-title">Job Category</div>
        <select
          className="form-select"
          value={searchFilters.category}
          onChange={(e) => updateSearchFilters({ category: e.target.value })}
        >
          <option value="all">All Categories ({jobs.length})</option>
          {mockCategories.map((cat) => {
            const count = jobs.filter((j) => j.category === cat.id).length;
            return (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Job Type */}
      <div className="filter-group">
        <div className="filter-group-title">Employment Type</div>
        <div className="filter-options-list">
          {JOB_TYPES.map((type) => {
            const checked = searchFilters.jobTypes.includes(type);
            const count = jobs.filter((j) => j.jobType === type).length;
            return (
              <label key={type} className="filter-checkbox-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={checked}
                    onChange={() => handleJobTypeToggle(type)}
                  />
                  <span>{type}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Workplace Type */}
      <div className="filter-group">
        <div className="filter-group-title">Workplace Setting</div>
        <div className="filter-options-list">
          {WORKPLACE_TYPES.map((wp) => {
            const checked = (searchFilters.workplaceTypes || []).includes(wp);
            const count = jobs.filter((j) => j.workplaceType === wp).length;
            return (
              <label key={wp} className="filter-checkbox-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={checked}
                    onChange={() => handleWorkplaceToggle(wp)}
                  />
                  <span>{wp}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="filter-group">
        <div className="filter-group-title">Experience Level</div>
        <div className="filter-options-list">
          {EXPERIENCE_LEVELS.map((lvl) => {
            const checked = searchFilters.experienceLevels.includes(lvl);
            const count = jobs.filter((j) => j.experience === lvl).length;
            return (
              <label key={lvl} className="filter-checkbox-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={checked}
                    onChange={() => handleExperienceToggle(lvl)}
                  />
                  <span>{lvl}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Salary Filter Slider */}
      <div className="filter-group">
        <div className="filter-group-title">
          <span>Minimum Salary</span>
          <span style={{ color: '#4f46e5' }}>
            ${(searchFilters.minSalary / 1000).toFixed(0)}k/yr
          </span>
        </div>
        <div className="salary-slider-wrapper">
          <input
            type="range"
            min="0"
            max="180000"
            step="10000"
            value={searchFilters.minSalary}
            onChange={(e) => updateSearchFilters({ minSalary: Number(e.target.value) })}
            className="salary-slider"
          />
          <div className="salary-values">
            <span>$0</span>
            <span>$90k</span>
            <span>$180k+</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
