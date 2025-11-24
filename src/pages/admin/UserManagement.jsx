import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Eye, Plus, Search, Download, RefreshCw, User, ShoppingCart, Mail, Calendar } from 'lucide-react';

import DataTable from '../../components/Admins/DataTable';
import AdminSidebar from '../../components/Admins/AdminSidebar';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Notification from '../../components/UI/Notification';
import useNotification from '../../hooks/useNotification';
import { adminAPI, authAPI } from '../../services/api';

const UserManagement = () => {
  const { addNotification } = useNotification();
  
  // States following AdminDashboard pattern
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states - same as AdminDashboard
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // React Hook Form - same as AdminDashboard
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users'
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data - same as AdminDashboard
  const refreshData = async () => {
    try {
      setSubmitting(true);
      await loadData();
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Data refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to refresh data',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open modals - same pattern as AdminDashboard
  const openUserModal = (user = null) => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('role', user.role || 'customer');
      setValue('isActive', user.isActive !== false);
    } else {
      reset({
        name: '',
        email: '',
        role: 'customer',
        password: '',
        confirmPassword: '',
        isActive: true
      });
    }
    setUserModalOpen(true);
  };

  const openViewModal = (user) => {
    setViewModal({ open: true, item: user });
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ open: true, type: 'user', item: user });
  };

  const openCreateModal = () => {
    reset({
      name: '',
      email: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
      isActive: true
    });
    setCreateModalOpen(true);
  };

  // Close modals - same as AdminDashboard
  const closeModals = () => {
    setUserModalOpen(false);
    setCreateModalOpen(false);
    setViewModal({ open: false, item: null });
    setDeleteModal({ open: false, type: '', item: null });
    
    reset({
      name: '',
      email: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
      isActive: true
    });
  };

  // Form submission for updating user
  const handleUpdateUser = async (data) => {
    try {
      setSubmitting(true);
      
      const userData = {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive
      };

      await adminAPI.updateUser(deleteModal.item?._id, userData);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'User updated successfully' 
      });

      closeModals();
      await refreshData();
    } catch (error) {
      console.error('User update error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Update failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Form submission for creating user
  const handleCreateUser = async (data) => {
    if (data.password !== data.confirmPassword) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Passwords do not match' 
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const userData = {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
        isActive: data.isActive
      };

      await adminAPI.createUser(userData);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'User created successfully' 
      });

      closeModals();
      await refreshData();
    } catch (error) {
      console.error('User creation error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Creation failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete operation - same pattern as AdminDashboard
  const handleDelete = async () => {
    if (!deleteModal.item) return;

    // Prevent deleting your own account
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (deleteModal.item._id === currentUser._id) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'You cannot delete your own account' 
      });
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.deleteUser(deleteModal.item._id);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'User deleted successfully' 
      });
      
      setDeleteModal({ open: false, type: '', item: null });
      await refreshData();
    } catch (error) {
      console.error('Delete operation error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Delete failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (user) => {
    try {
      setSubmitting(true);
      
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: !user.isActive
      };

      await adminAPI.updateUser(user._id, userData);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: `User ${!user.isActive ? 'activated' : 'deactivated'} successfully` 
      });
      
      await refreshData();
    } catch (error) {
      console.error('Status toggle error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Status update failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle sort - same as AdminDashboard
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort users
  const getFilteredAndSortedUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  // Export users
  const exportUsers = () => {
    const data = getFilteredAndSortedUsers();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Role,Status,Orders,Total Spent,Last Login,Created\n"
      + data.map(user => 
          `"${user.name}","${user.email}","${user.role}","${user.isActive ? 'Active' : 'Inactive'}","${user.ordersCount || 0}","${user.totalSpent || 0}","${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}","${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Users exported successfully'
    });
  };

  // Helper functions
  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      customer: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (value, user) => {
        const row = user || value;
        if (!row) return null;
        return (
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        );
      }
    },
    {
      key: 'role',
      header: 'Role',
      render: (value, user) => {
        const row = user || value;
        if (!row) return null;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(row.role)}`}>
            {row.role?.charAt(0).toUpperCase() + row.role?.slice(1)}
          </span>
        );
      }
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (value, user) => {
        const row = user || value;
        if (!row) return null;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(row.isActive)}`}>
            {row.isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: 'ordersCount',
      header: 'Orders',
      sortable: true,
      render: (value, user) => {
        const row = user || value;
        return row ? row.ordersCount || 0 : 0;
      }
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: (value, user) => {
        const row = user || value;
        return row ? formatCurrency(row.totalSpent) : formatCurrency(0);
      }
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      render: (value, user) => {
        const row = user || value;
        return row ? (row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never') : 'Never';
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, user) => {
        const row = user || value;
        if (!row) return null;
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="small"
              onClick={() => openViewModal(row)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => openUserModal(row)}
              disabled={submitting}
              title="Edit User"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant={row.isActive ? "outline" : "primary"}
              size="small"
              onClick={() => toggleUserStatus(row)}
              disabled={submitting}
              title={row.isActive ? "Deactivate" : "Activate"}
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => openDeleteModal(row)}
              disabled={submitting || row.role === 'admin'}
              title={row.role === 'admin' ? "Cannot delete admin" : "Delete User"}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const filteredUsers = getFilteredAndSortedUsers();

  // Calculate statistics
  const stats = {
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.isActive).length,
    totalRevenue: users.reduce((sum, user) => sum + (user.totalSpent || 0), 0),
    totalOrders: users.reduce((sum, user) => sum + (user.ordersCount || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" text="Loading users..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage system users and their permissions
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={refreshData}
                  disabled={submitting}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  <span>{submitting ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
                <Button
                  onClick={exportUsers}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Button
                  onClick={openCreateModal}
                  disabled={submitting}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.customers}</div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.admins}</div>
                  <div className="text-sm text-gray-600">Admins</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="text-sm text-gray-600">
                Total Revenue: {formatCurrency(stats.totalRevenue)} • Total Orders: {stats.totalOrders}
              </div>
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'No users match your search criteria.' 
                  : 'Get started by creating your first user.'
                }
              </p>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Create First User
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <DataTable
                data={filteredUsers}
                columns={columns}
                searchable={false}
                itemsPerPage={10}
                loading={loading}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>
          )}
        </main>
      </div>

      {/* Edit User Modal */}
      <Modal 
        isOpen={userModalOpen} 
        onClose={closeModals} 
        title="Edit User" 
        size="medium"
      >
        <form onSubmit={handleSubmit(handleUpdateUser)} className="p-4 sm:p-6 space-y-4">
          <Input 
            label="Name" 
            {...register('name', { required: 'Name is required' })} 
            error={errors.name} 
          />
          <Input 
            label="Email" 
            type="email"
            {...register('email', { required: 'Email is required' })} 
            error={errors.email} 
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select 
              {...register('role', { required: 'Role is required' })} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active User
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeModals}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create User Modal */}
      <Modal 
        isOpen={createModalOpen} 
        onClose={closeModals} 
        title="Create New User" 
        size="medium"
      >
        <form onSubmit={handleSubmit(handleCreateUser)} className="p-4 sm:p-6 space-y-4">
          <Input 
            label="Name" 
            {...register('name', { required: 'Name is required' })} 
            error={errors.name} 
          />
          <Input 
            label="Email" 
            type="email"
            {...register('email', { required: 'Email is required' })} 
            error={errors.email} 
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select 
              {...register('role', { required: 'Role is required' })} 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          
          <Input 
            label="Password" 
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })} 
            error={errors.password} 
          />
          
          <Input 
            label="Confirm Password" 
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm password'
            })} 
            error={errors.confirmPassword} 
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="createIsActive"
              {...register('isActive')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="createIsActive" className="ml-2 text-sm text-gray-700">
              Active User
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeModals}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        title="User Details"
        size="large"
      >
        {viewModal.item && (
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="mt-1 text-gray-900">{viewModal.item.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="mt-1 text-gray-900">{viewModal.item.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Role:</span>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(viewModal.item.role)}`}>
                      {viewModal.item.role?.charAt(0).toUpperCase() + viewModal.item.role?.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(viewModal.item.isActive)}`}>
                      {viewModal.item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{viewModal.item.ordersCount || 0}</div>
                  <div className="text-sm text-gray-600">Orders</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(viewModal.item.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">
                    {viewModal.item.ordersCount > 0 
                      ? formatCurrency((viewModal.item.totalSpent || 0) / viewModal.item.ordersCount)
                      : formatCurrency(0)
                    }
                  </div>
                  <div className="text-sm text-gray-600">Avg. Order</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900">
                    {viewModal.item.lastLogin 
                      ? new Date(viewModal.item.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Last Login</div>
                </div>
              </div>
            </div>

            {/* Account History */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Account History</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Member since:</span>
                  <span className="text-gray-900">
                    {viewModal.item.createdAt ? new Date(viewModal.item.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Last login:</span>
                  <span className="text-gray-900">
                    {viewModal.item.lastLogin 
                      ? new Date(viewModal.item.lastLogin).toLocaleString()
                      : 'Never logged in'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setViewModal({ open: false, item: null })}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewModal({ open: false, item: null });
                  openUserModal(viewModal.item);
                }}
              >
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModal.open} 
        onClose={() => setDeleteModal({ open: false, type: '', item: null })} 
        title={`Delete ${deleteModal.type}`} 
        size="small"
      >
        <div className="p-4 sm:p-6">
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            Are you sure you want to delete the user <strong>"{deleteModal.item?.name}"</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, type: '', item: null })}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;