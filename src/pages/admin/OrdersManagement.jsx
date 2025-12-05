import React, { useState, useEffect } from 'react';

import DataTable from '../../components/Admins/DataTable';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Notification from '../../components/UI/Notification';

// Mock data - replace with actual API calls
const mockOrders = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    user: { name: 'John Doe', email: 'john@example.com' },
    items: [
      { product: { name: 'Wireless Earbuds' }, quantity: 2, price: 49.99 },
      { product: { name: 'Phone Case' }, quantity: 1, price: 15.99 }
    ],
    totalAmount: 115.97,
    status: 'pending',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    items: [
      { product: { name: 'Smart Watch' }, quantity: 1, price: 199.99 }
    ],
    totalAmount: 199.99,
    status: 'processing',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  }
];

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await ordersAPI.getAll();
        // setOrders(response.data);
        
        // Using mock data for now
        setOrders(mockOrders);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Replace with actual API call
      // await ordersAPI.updateStatus(orderId, { status: newStatus });
      
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      
      setNotification({
        show: true,
        message: `Order status updated to ${newStatus}`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        show: true,
        message: 'Failed to update order status',
        type: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      sortable: true
    },
    {
      key: 'user',
      header: 'Customer',
      render: (value, item) => {
        const order = item || value;
        if (!order) return null;
        return (
          <div>
            <div className="font-medium">{order.user.name}</div>
            <div className="text-sm text-gray-500">{order.user.email}</div>
          </div>
        );
      }
    },
    {
      key: 'items',
      header: 'Items',
      render: (value, item) => {
        const order = item || value;
        if (!order) return null;
        return (
          <div>
            {order.items.slice(0, 2).map((orderItem, index) => (
              <div key={index} className="text-sm">
                {orderItem.product.name} × {orderItem.quantity}
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-sm text-gray-500">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (item) => `$${item.totalAmount.toFixed(2)}`,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) => updateOrderStatus(item._id, e.target.value)}
          className={`px-2 py-1 text-xs rounded border-0 ${getStatusColor(item.status)} focus:ring-2 focus:ring-blue-500`}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (item) => (
        <span className={`px-2 py-1 text-xs rounded ${getPaymentStatusColor(item.paymentStatus)}`}>
          {item.paymentStatus}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Order Date',
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              setSelectedOrder(item);
              setShowOrderModal(true);
            }}
          >
            View
          </Button>
        </div>
      )
    }
  ];

  if (loading) return <div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
            <p className="text-sm text-gray-600">Manage customer orders and track fulfillment</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <Notification
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}
          
          {notification.show && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex-1">
                <Input
                  placeholder="Search orders..."
                  className="max-w-md"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>

        <DataTable
          data={filteredOrders}
          columns={columns}
          searchable
          searchFields={['orderNumber', 'user.name', 'user.email']}
          itemsPerPage={10}
        />
      </main>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        size="large"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Order Date:</span>{' '}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Order Status:</span>{' '}
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>{' '}
                  {selectedOrder.paymentMethod}
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>{' '}
                  <span className={`px-2 py-1 text-xs rounded ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Name:</div>
                  <div>{selectedOrder.user.name}</div>
                </div>
                <div>
                  <div className="font-medium">Email:</div>
                  <div>{selectedOrder.user.email}</div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
              <div className="text-sm">
                <div>{selectedOrder.shippingAddress.street}</div>
                <div>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                </div>
                <div>{selectedOrder.shippingAddress.country}</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-gray-600">${item.price} each</div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t font-bold">
                  <div>Total Amount:</div>
                  <div>${selectedOrder.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Update Order Status</h3>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  updateOrderStatus(selectedOrder._id, e.target.value);
                  setSelectedOrder({
                    ...selectedOrder,
                    status: e.target.value
                  });
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersManagement;