import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, MapPin, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/jobs/JobCard';
import FilterSidebar from '../components/jobs/FilterSidebar';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const JOBS_PER_PAGE = 6;

const JobsPage = () => {
  const [searchParams] = useSearchParams();
  const { filteredJobs, searchFilters, updateSearchFilters, resetSearchFilters, jobs } = useJobs();

  const [layoutView, setLayoutView] = useState('grid'); // 'grid' | 'list'
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category param from URL if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      updateSearchFilters({ category: catParam });
    }
  }, [searchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(JOBS_PER_PAGE);
  }, [searchFilters]);

  const displayedJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + JOBS_PER_PAGE);
  };

  // Check active filter chips
  const activeChips = [];
  if (searchFilters.keyword) {
    activeChips.push({ key: 'keyword', label: `Search: "${searchFilters.keyword}"`, clear: () => updateSearchFilters({ keyword: '' }) });
  }
  if (searchFilters.location) {
    activeChips.push({ key: 'location', label: `Location: "${searchFilters.location}"`, clear: () => updateSearchFilters({ location: '' }) });
  }
  if (searchFilters.category !== 'all') {
    activeChips.push({ key: 'category', label: `Category: ${searchFilters.category}`, clear: () => updateSearchFilters({ category: 'all' }) });
  }
  searchFilters.jobTypes.forEach((type) => {
    activeChips.push({
      key: `type-${type}`,
      label: type,
      clear: () => updateSearchFilters({ jobTypes: searchFilters.jobTypes.filter((t) => t !== type) })
    });
  });
  (searchFilters.workplaceTypes || []).forEach((wp) => {
    activeChips.push({
      key: `wp-${wp}`,
      label: wp,
      clear: () => updateSearchFilters({ workplaceTypes: searchFilters.workplaceTypes.filter((w) => w !== wp) })
    });
  });
  searchFilters.experienceLevels.forEach((exp) => {
    activeChips.push({
      key: `exp-${exp}`,
      label: exp,
      clear: () => updateSearchFilters({ experienceLevels: searchFilters.experienceLevels.filter((e) => e !== exp) })
    });
  });
  if (searchFilters.minSalary > 0) {
    activeChips.push({
      key: 'salary',
      label: `Min $${(searchFilters.minSalary / 1000).toFixed(0)}k`,
      clear: () => updateSearchFilters({ minSalary: 0 })
    });
  }

  return (
    <div>
      {/* Top Banner Search */}
      <section className="jobs-page-header">
        <div className="container">
          <div style={{ maxWidth: '780px', margin: '0 auto 1.5rem auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
              Find Your Next Role
            </h1>
            <p style={{ color: '#64748b' }}>
              Browse {jobs.length} open opportunities at world-class companies. Filter by role, location, salary, and experience.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              maxWidth: '850px',
              margin: '0 auto',
              background: '#ffffff',
              padding: '0.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem' }}>
              <Search size={18} color="#4f46e5" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchFilters.keyword}
                onChange={(e) => updateSearchFilters({ keyword: e.target.value })}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderLeft: '1px solid #e2e8f0' }}>
              <MapPin size={18} color="#4f46e5" />
              <input
                type="text"
                placeholder="Location or 'Remote'..."
                value={searchFilters.location}
                onChange={(e) => updateSearchFilters({ location: e.target.value })}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              style={{ display: 'none' }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        <div className="jobs-page-grid">
          {/* Left Column: Filter Sidebar */}
          <FilterSidebar className={mobileFilterOpen ? 'mobile-visible' : ''} />

          {/* Right Column: Jobs List & Controls */}
          <div>
            {/* Active Chips */}
            {activeChips.length > 0 && (
              <div className="active-filters-bar">
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Active filters:</span>
                {activeChips.map((chip) => (
                  <span key={chip.key} className="filter-chip">
                    {chip.label}
                    <button onClick={chip.clear} className="filter-chip-remove" aria-label="Remove filter">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={resetSearchFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Controls Bar (Results count, Sort, View Toggle) */}
            <div className="jobs-controls-bar">
              <div className="jobs-count-text">
                Showing <span className="jobs-count-number">{filteredJobs.length}</span> jobs matching your criteria
              </div>

              <div className="jobs-sort-views">
                {/* Sort Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowUpDown size={15} className="text-muted" />
                  <select
                    className="form-select"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.875rem', width: 'auto' }}
                    value={searchFilters.sortBy}
                    onChange={(e) => updateSearchFilters({ sortBy: e.target.value })}
                  >
                    <option value="newest">Newest First</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Grid vs List View */}
                <div className="view-toggle-btns">
                  <button
                    className={`view-btn ${layoutView === 'grid' ? 'active' : ''}`}
                    onClick={() => setLayoutView('grid')}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    className={`view-btn ${layoutView === 'list' ? 'active' : ''}`}
                    onClick={() => setLayoutView('list')}
                    title="List View"
                    aria-label="List View"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs Display List */}
            {filteredJobs.length === 0 ? (
              <EmptyState
                title="No matching job listings"
                description="Try tweaking your keyword, broadening your location, or clearing specific filters."
                actionText="Reset All Filters"
                onAction={resetSearchFilters}
              />
            ) : (
              <>
                <div className={layoutView === 'grid' ? 'jobs-layout-grid' : 'jobs-layout-list'}>
                  {displayedJobs.map((job) => (
                    <JobCard key={job.id} job={job} layout={layoutView} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Button variant="outline" size="lg" onClick={handleLoadMore}>
                      Load More Jobs ({filteredJobs.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
