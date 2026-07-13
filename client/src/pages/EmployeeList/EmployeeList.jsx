import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import EmployeeTable from '../../components/EmployeeTable/EmployeeTable';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';
import EmptyState from '../../components/EmptyState/EmptyState';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { PageLoader } from '../../components/LoadingSpinner/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import EmployeeService from '../../api/employeeService';
import { debounce, exportToCSV, formatDate, formatMobile } from '../../utils/helpers';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import './EmployeeList.css';

const PAGE_SIZE_DEFAULT = 10;

export default function EmployeeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const searchInputRef = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [deleteModal, setDeleteModal] = useState({ open: false, employee: null });
  const [deleting, setDeleting] = useState(false);
  const [batchDeleting, setBatchDeleting] = useState(false);
  const [viewModal, setViewModal] = useState({ open: false, employee: null });
  const [viewLoading, setViewLoading] = useState(false);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Use refs to avoid stale closure issues
  const filtersRef = useRef({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || '',
  });
  const pageRef = useRef(1);
  const pageSizeRef = useRef(PAGE_SIZE_DEFAULT);

  const [filters, setFilters] = useState(filtersRef.current);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  // Keep refs in sync with state
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  const loadEmployees = useCallback(async (filtersToApply, pageNum, size) => {
    try {
      setLoading(true);
      const effectiveFilters = filtersToApply || filtersRef.current;
      const currentPage = pageNum || pageRef.current;
      const currentSize = size || pageSizeRef.current;

      const res = await EmployeeService.getAll({
        search: effectiveFilters.search || undefined,
        department: effectiveFilters.department || undefined,
        status: effectiveFilters.status || undefined,
        sort: effectiveFilters.sort || undefined,
        page: currentPage,
        pageSize: currentSize,
      });
      setEmployees(res.data);
      setTotal(res.total || res.count || 0);
      setSelectedIds([]);
    } catch (err) {
      addToast(err.message || 'Failed to load employees', 'error');
      setEmployees([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    loadEmployees(filtersRef.current, 1, PAGE_SIZE_DEFAULT);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync search params to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.department) params.set('department', filters.department);
    if (filters.status) params.set('status', filters.status);
    if (filters.sort) params.set('sort', filters.sort);
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams]);

  // Stable debounced search
  const debouncedSearchRef = useRef(
    debounce((value) => {
      const newFilters = { ...filtersRef.current, search: value };
      filtersRef.current = newFilters;
      setFilters(newFilters);
      setPage(1);
      loadEmployees(newFilters, 1, pageSize);
    }, 400)
  );

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    debouncedSearchRef.current(value);
  };

  const handleDepartmentChange = (value) => {
    const newFilters = { ...filtersRef.current, department: value };
    filtersRef.current = newFilters;
    setFilters(newFilters);
    setPage(1);
    loadEmployees(newFilters, 1, pageSize);
  };

  const handleStatusChange = (value) => {
    const newFilters = { ...filtersRef.current, status: value };
    filtersRef.current = newFilters;
    setFilters(newFilters);
    setPage(1);
    loadEmployees(newFilters, 1, pageSize);
  };

  const handleSortChange = (value) => {
    const newFilters = { ...filtersRef.current, sort: value };
    filtersRef.current = newFilters;
    setFilters(newFilters);
    setPage(1);
    loadEmployees(newFilters, 1, pageSize);
  };

  const handleClearFilters = () => {
    const cleared = { search: '', department: '', status: '', sort: '' };
    filtersRef.current = cleared;
    setFilters(cleared);
    setPage(1);
    loadEmployees(cleared, 1, pageSize);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadEmployees(filtersRef.current, newPage, pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
    loadEmployees(filtersRef.current, 1, newSize);
  };

  // Bulk selection
  const allSelected = employees.length > 0 && selectedIds.length === employees.length;
  const hasSomeSelected = selectedIds.length > 0;

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map(e => e.id));
    }
  }, [allSelected, employees]);

  const handleSelect = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  }, []);

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // View
  const handleView = async (id) => {
    try {
      setViewLoading(true);
      const res = await EmployeeService.getById(id);
      setViewModal({ open: true, employee: res.data });
    } catch (err) {
      addToast(err.message || 'Failed to load employee details', 'error');
    } finally {
      setViewLoading(false);
    }
  };

  // Delete single
  const handleDeleteConfirm = async () => {
    if (!deleteModal.employee) return;
    const deletedEmployee = deleteModal.employee;
    try {
      setDeleting(true);
      await EmployeeService.delete(deletedEmployee.id);
      setDeleteModal({ open: false, employee: null });

      addToast(
        <span>
          "{deletedEmployee.full_name}" deleted.{' '}
          <button
            className="toast__undo-btn"
            onClick={async () => {
              try {
                await EmployeeService.create({
                  full_name: deletedEmployee.full_name,
                  email: deletedEmployee.email,
                  mobile_number: deletedEmployee.mobile_number,
                  department: deletedEmployee.department,
                  designation: deletedEmployee.designation,
                  joining_date: deletedEmployee.joining_date,
                  status: deletedEmployee.status,
                });
                addToast('Employee restored successfully', 'success');
              } catch (err) {
                addToast('Failed to restore employee. Email may already exist.', 'error');
              }
              loadEmployees(filtersRef.current, pageRef.current, pageSizeRef.current);
            }}
          >
            Undo
          </button>
        </span>,
        'success',
        8000
      );

      // Reload current page or go back if last on page
      const newTotal = total - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
      const targetPage = page > maxPage ? maxPage : page;
      if (targetPage !== page) setPage(targetPage);
      loadEmployees(filtersRef.current, targetPage, pageSize);
    } catch (err) {
      addToast(err.message || 'Failed to delete employee', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setBatchDeleting(true);
      const res = await EmployeeService.deleteBatch(selectedIds);
      addToast(res.message || `${selectedIds.length} employee(s) deleted`, 'success');
      setSelectedIds([]);
      setPage(1);
      loadEmployees(filtersRef.current, 1, pageSizeRef.current);
    } catch (err) {
      addToast(err.message || 'Failed to delete employees', 'error');
    } finally {
      setBatchDeleting(false);
    }
  };

  // Export
  const handleExportCSV = () => {
    const columns = [
      { key: 'full_name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobile_number', label: 'Mobile Number' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designation' },
      { key: 'joining_date', label: 'Joining Date' },
      { key: 'status', label: 'Status' },
    ];
    exportToCSV(employees, columns, 'employees-export');
    addToast('Employees exported to CSV', 'success');
  };

  // Socket.IO real-time synchronization
  useEffect(() => {
    let timeoutId;
    
    const handleEmployeeChange = (payload) => {
      // Show toast if from another client
      if (payload && payload.originClientId !== import('../../socket').then(m => m.CLIENT_ID)) {
        // We'll handle toasts centrally, here just reload
      }
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        loadEmployees(filtersRef.current, pageRef.current, pageSizeRef.current, false);
      }, 300);
    };

    import('../../socket').then(({ socket }) => {
      socket.on('employee:created', handleEmployeeChange);
      socket.on('employee:updated', handleEmployeeChange);
      socket.on('employee:deleted', handleEmployeeChange);

      return () => {
        socket.off('employee:created', handleEmployeeChange);
        socket.off('employee:updated', handleEmployeeChange);
        socket.off('employee:deleted', handleEmployeeChange);
        clearTimeout(timeoutId);
      };
    });
  }, [loadEmployees]);

  // Keyboard shortcuts
  const shortcuts = {
    'Ctrl+n': () => navigate('/employees/add'),
    '/': () => {
      const input = document.querySelector('.search-filter__input');
      if (input) {
        input.focus();
        input.select();
      }
    },
    'Escape': () => {
      if (deleteModal.open) setDeleteModal({ open: false, employee: null });
      if (viewModal.open) setViewModal({ open: false, employee: null });
    },
  };
  useKeyboardShortcuts(shortcuts);

  const hasAnyFilter = filters.search || filters.department || filters.status || filters.sort;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      {/* Keyboard shortcut hint */}
      <div className="employee-list__shortcuts-hint">
        <span className="employee-list__shortcut"><kbd>Ctrl+N</kbd> Add</span>
        <span className="employee-list__shortcut"><kbd>/</kbd> Search</span>
      </div>

    <div className="employee-list">
      {/* Bulk action bar */}
      {hasSomeSelected && (
        <div className="employee-list__bulk-bar">
          <div className="employee-list__bulk-info">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span><strong>{selectedIds.length}</strong> employee{selectedIds.length !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="employee-list__bulk-actions">
            <button className="employee-list__bulk-btn employee-list__bulk-btn--clear" onClick={handleClearSelection}>
              Clear Selection
            </button>
            <button
              className="employee-list__bulk-btn employee-list__bulk-btn--delete"
              onClick={handleBatchDelete}
              disabled={batchDeleting}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M4.5 3.5V2a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v1.5M11 5v6.5a1 1 0 01-1 1H4a1 1 0 01-1-1V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {batchDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
            </button>
          </div>
        </div>
      )}

      <div className="employee-list__header">
        <div>
          <h1 className="employee-list__title">Employees</h1>
          <p className="employee-list__subtitle">
            {loading ? 'Loading...' : `${total} employee${total !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div className="employee-list__header-actions">
          <button className="btn btn--secondary" onClick={handleExportCSV} title="Export to CSV">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12v1.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Export
          </button>
          <button className="btn btn--primary" onClick={() => navigate('/employees/add')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      <div className="employee-list__filters">
        <SearchFilter
          search={filters.search}
          onSearchChange={handleSearchChange}
          department={filters.department}
          onDepartmentChange={handleDepartmentChange}
          status={filters.status}
          onStatusChange={handleStatusChange}
          sort={filters.sort}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
        />
      </div>

      {!loading && employees.length === 0 ? (
        <EmptyState
          title={hasAnyFilter ? 'No employees match your filters' : 'No employees yet'}
          description={
            hasAnyFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first employee to the system.'
          }
          action={
            hasAnyFilter ? (
              <button className="btn btn--secondary" onClick={handleClearFilters}>
                Clear Filters
              </button>
            ) : (
              <button className="btn btn--primary" onClick={() => navigate('/employees/add')}>
                Add Employee
              </button>
            )
          }
        />
      ) : (
        <>
          <EmployeeTable
            employees={employees}
            loading={loading}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
            hasSomeSelected={hasSomeSelected}
            onView={handleView}
            onEdit={(id) => navigate(`/employees/edit/${id}`)}
            onDelete={(employee) => setDeleteModal({ open: true, employee })}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, employee: null })}
        title="Employee Details"
        size="md"
      >
        {viewLoading ? (
          <div className="employee-list__modal-loading">
            <PageLoader />
          </div>
        ) : viewModal.employee ? (
          <div className="employee-list__details">
            <div className="employee-list__details-header">
              <div className="employee-list__details-avatar">
                {viewModal.employee.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="employee-list__details-name">{viewModal.employee.full_name}</h3>
                <StatusBadge status={viewModal.employee.status} />
              </div>
            </div>

            <div className="employee-list__details-grid">
              <div className="employee-list__detail-item">
                <span className="employee-list__detail-label">Department</span>
                <span className="employee-list__detail-value">{viewModal.employee.department}</span>
              </div>
              <div className="employee-list__detail-item">
                <span className="employee-list__detail-label">Designation</span>
                <span className="employee-list__detail-value">{viewModal.employee.designation}</span>
              </div>
              <div className="employee-list__detail-item">
                <span className="employee-list__detail-label">Email</span>
                <span className="employee-list__detail-value">{viewModal.employee.email}</span>
              </div>
              <div className="employee-list__detail-item">
                <span className="employee-list__detail-label">Mobile</span>
                <span className="employee-list__detail-value">{formatMobile(viewModal.employee.mobile_number)}</span>
              </div>
              <div className="employee-list__detail-item">
                <span className="employee-list__detail-label">Joining Date</span>
                <span className="employee-list__detail-value">{formatDate(viewModal.employee.joining_date)}</span>
              </div>
              <div className="employee-list__detail-item">
                <span className="employee-list__detail-label">Status</span>
                <span className="employee-list__detail-value">{viewModal.employee.status}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="employee-list__modal-actions">
          <button
            className="btn btn--secondary"
            onClick={() => setViewModal({ open: false, employee: null })}
          >
            Close
          </button>
          <button
            className="btn btn--primary"
            onClick={() => {
              const id = viewModal.employee?.id;
              setViewModal({ open: false, employee: null });
              navigate(`/employees/edit/${id}`);
            }}
          >
            Edit Employee
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => !deleting && setDeleteModal({ open: false, employee: null })}
        title="Delete Employee"
        size="sm"
      >
        <div className="employee-list__delete-content">
          <div className="employee-list__delete-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="employee-list__delete-text">
            Are you sure you want to delete <strong>{deleteModal.employee?.full_name}</strong>?
            This action cannot be undone.
          </p>
        </div>

        <div className="employee-list__modal-actions">
          <button
            className="btn btn--secondary"
            onClick={() => setDeleteModal({ open: false, employee: null })}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn--danger btn"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>
      </Modal>

    </div>
    </>
  );
}
