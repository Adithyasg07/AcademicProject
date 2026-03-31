import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../api/apiService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState("dashboard");

  // ================= STATE =================
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ TotalProducts: 0, TotalOrders: 0, TotalStock: 0, TotalUsers: 0, TotalRevenue: 0 });
  const [orderItems, setOrderItems] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: 0 });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    imageFile: null
  });

  const categories = [
    "Combos & Deals",
    "Flours & Suji",
    "Rice & Rice Products",
    "Pulses & Dal",
    "Oil & Ghee",
    "Salts, Sugar & Jaggery",
    "Spices & Masalas",
    "Dry Fruits & Nuts",
    "Health Foods",
    "Teas & Coffee",
  ];

  // ================= LOAD DATA =================
  const fetchData = async () => {
    try {
      const [productsData, statsData, ordersData, usersData, recentData] = await Promise.all([
        apiService.get("/Products"),
        apiService.get("/Admin/stats"),
        apiService.get("/Orders/all"),
        apiService.get("/Admin/users"),
        apiService.get("/Admin/recent-orders")
      ]);
      
      // Map to lowercase keys for frontend consistency
      setProducts((productsData || []).map(p => ({
        id: p.ID,
        name: p.NAME,
        price: p.PRICE,
        stock: p.STOCK,
        category: p.CATEGORY,
        image: p.imageUrl ? `http://localhost:5249${p.imageUrl}` : null
      })));
      
      setStats(statsData || { TotalProducts: 0, TotalOrders: 0, TotalStock: 0, TotalUsers: 0, TotalRevenue: 0 });
      setRecentOrders(recentData || []);
      
      setOrders((ordersData || []).map(o => ({
        id: o.Id,
        customer: o.CustomerName,
        total: o.TotalAmount,
        status: o.Status,
        date: o.CreatedAt
      })));

      setUsers((usersData || []).map(u => ({
        id: u.Id,
        name: u.Name,
        email: u.Email,
        phone: u.Phone,
        status: u.Status
      })));

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddOrEditProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", newProduct.name);
      formData.append("Price", Number(newProduct.price) || 0);
      formData.append("Stock", Number(newProduct.stock) || 0);
      formData.append("Category", newProduct.category);
      if (newProduct.imageFile) formData.append("imageFile", newProduct.imageFile);

      if (editingId) {
        formData.append("Id", editingId);
        await apiService.putFormData(`/Products/${editingId}`, formData);
      } else {
        await apiService.postFormData("/Products", formData);
      }

      setNewProduct({ name: "", price: "", stock: "", category: "", imageFile: null });
      setEditingId(null);
      setShowModal(false);
      fetchData(); // reload
    } catch (error) {
      console.error("Error saving product", error);
      alert("Failed to save product: " + (error.message || "Unknown error occurred."));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await apiService.delete(`/Products/${id}`);
        fetchData();
      } catch (e) {
        console.error("Delete error", e);
      }
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await apiService.put(`/Orders/${id}/status`, { status: newStatus });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await apiService.put(`/Admin/users/${id}/status`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = async () => {
    try {
      await apiService.post("/Admin/users", newUser);
      setShowUserModal(false);
      setNewUser({ name: "", email: "", password: "", role: 0 });
      fetchData();
    } catch (e) {
      alert("Failed to create user: " + (e.message || "Email may already exist"));
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-green-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Organic Admin</h1>

        {["dashboard", "products", "orders", "users"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-3 mb-3 rounded cursor-pointer capitalize ${
              activeTab === tab
                ? "bg-white text-green-800 font-semibold"
                : "hover:bg-green-700"
            }`}
          >
            {tab}
          </div>
        ))}

        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full text-left p-3 hover:bg-green-700 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded shadow border-l-4 border-green-600">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Products</h3>
                <p className="text-3xl font-bold">{stats.TotalProducts}</p>
              </div>
              <div className="bg-white p-6 rounded shadow border-l-4 border-blue-600">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Stock</h3>
                <p className="text-3xl font-bold">{stats.TotalStock}</p>
              </div>
              <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-600">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Orders</h3>
                <p className="text-3xl font-bold">{stats.TotalOrders}</p>
              </div>
              <div className="bg-white p-6 rounded shadow border-l-4 border-purple-600">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Users</h3>
                <p className="text-3xl font-bold">{stats.TotalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded shadow border-l-4 border-red-600">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-700">₹{stats.TotalRevenue}</p>
              </div>
            </div>

            <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-h-[450px] overflow-y-auto hide-scrollbar">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Recent Orders</h3>
              <table className="w-full text-left border-collapse">
                 <thead className="sticky top-0 bg-green-700 text-white uppercase text-xs font-bold tracking-widest z-10 shadow-sm border-b">
                   <tr>
                     <th className="p-5 bg-green-700">ID</th>
                     <th className="p-5 bg-green-700">Customer</th>
                     <th className="p-5 bg-green-700">Total</th>
                     <th className="p-5 bg-green-700">Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {recentOrders.map(o => (
                     <tr key={o.Id} className="border-b hover:bg-gray-50 transition-colors">
                       <td className="p-5 text-gray-400 font-bold">#{o.Id}</td>
                       <td className="p-5 font-semibold text-gray-800">{o.CustomerName}</td>
                       <td className="p-5 font-bold text-green-700">₹{o.TotalAmount}</td>
                       <td className="p-5"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-black uppercase tracking-wider">{o.Status}</span></td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Products</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border p-2 rounded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  onClick={() => {
                    setShowModal(true);
                    setEditingId(null);
                    setNewProduct({ name: "", price: "", stock: "", category: "", imageFile: null });
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  + Add Product
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-gray-100 rounded-2xl shadow-sm hide-scrollbar">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-green-700 text-white uppercase text-xs font-bold tracking-widest sticky top-0 z-10 shadow-sm border-b">
                  <tr>
                    <th className="p-5 text-left bg-green-700">ID</th>
                    <th className="p-5 text-left bg-green-700">Name</th>
                    <th className="p-5 text-left bg-green-700">Price</th>
                    <th className="p-5 text-left bg-green-700">Stock</th>
                    <th className="p-5 text-left bg-green-700">Category</th>
                    <th className="p-5 text-left bg-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-green-50/30 transition-colors">
                      <td className="p-5 text-gray-400 font-bold">#{p.id}</td>
                      <td className="p-5 font-semibold text-gray-800">{p.name}</td>
                      <td className="p-5 font-bold text-green-700">₹{p.price}</td>
                      <td className="p-5 text-gray-600 font-medium">{p.stock}</td>
                      <td className="p-5 text-gray-500">{p.category}</td>
                      <td className="p-5 space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setNewProduct({ ...p, imageFile: null }); // Spread existing values
                            setShowModal(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-3xl font-bold mb-6">Orders</h2>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-gray-100 rounded-2xl shadow-sm hide-scrollbar">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-green-700 text-white uppercase text-xs font-bold tracking-widest sticky top-0 z-10 shadow-sm border-b">
                  <tr>
                    <th className="p-5 text-left bg-green-700">Order ID</th>
                    <th className="p-5 text-left bg-green-700">Customer</th>
                    <th className="p-5 text-left bg-green-700">Total</th>
                    <th className="p-5 text-left bg-green-700">Status</th>
                    <th className="p-5 text-left bg-green-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-green-50/30 transition-colors">
                      <td className="p-5 text-gray-400 font-bold">#{order.id}</td>
                      <td className="p-5 font-semibold text-gray-800">{order.customer}</td>
                      <td className="p-5 font-bold text-green-700">₹{order.total}</td>
                      <td className="p-5">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="border px-2 py-1 rounded"
                        >
                          <option>Pending</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button 
                          onClick={async () => {
                            const items = await apiService.get(`/Orders/${order.id}/items`);
                            setOrderItems(items || []);
                            setSelectedOrder(order);
                            setShowItemsModal(true);
                          }}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          View Items
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Users</h2>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-gray-100 rounded-2xl shadow-sm hide-scrollbar">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-green-700 text-white uppercase text-xs font-bold tracking-widest sticky top-0 z-10 shadow-sm border-b">
                  <tr>
                    <th className="p-5 text-left bg-green-700">ID</th>
                    <th className="p-5 text-left bg-green-700">Name</th>
                    <th className="p-5 text-left bg-green-700">Email</th>
                    <th className="p-5 text-left bg-green-700">Phone</th>
                    <th className="p-5 text-left bg-green-700">Status</th>
                    <th className="p-5 text-left bg-green-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-green-50/30 transition-colors">
                      <td className="p-5 text-gray-400 font-bold">#{user.id}</td>
                      <td className="p-5 font-semibold text-gray-800">{user.name}</td>
                      <td className="p-5 text-gray-600">{user.email}</td>
                      <td className="p-5 text-gray-500">{user.phone}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-4 py-2 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg active:scale-95 ${
                            user.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {user.status === "Active" ? "Block" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCT MODAL */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "Edit" : "Add"} Product
              </h3>

              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 mb-2 rounded"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border p-2 mb-2 rounded"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Stock"
                className="w-full border p-2 mb-2 rounded"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
              />

              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 mb-2 rounded text-sm"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
                }
              />

              {/* CATEGORY DROPDOWN */}
              <select
                className="w-full border p-2 mb-4 rounded"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrEditProduct}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ORDER ITEMS MODAL */}
      {showItemsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-2xl w-[500px] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Order #{selectedOrder?.id} Details</h3>
              <button 
                onClick={() => setShowItemsModal(false)}
                className="text-gray-400 hover:text-black transition text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-2 border">
              <p className="flex justify-between">
                <span className="text-gray-500 uppercase text-xs font-bold">Customer</span>
                <span className="font-semibold">{selectedOrder?.customer}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 uppercase text-xs font-bold">Total Amount</span>
                <span className="text-green-700 font-black">₹{selectedOrder?.total}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 uppercase text-xs font-bold">Status</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-bold uppercase">{selectedOrder?.status}</span>
              </p>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6 shadow-sm max-h-[300px] overflow-y-auto hide-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-700 text-white uppercase text-xs font-bold tracking-widest sticky top-0 z-10 shadow-sm border-b">
                  <tr>
                    <th className="p-5 bg-green-700">Product</th>
                    <th className="p-5 bg-green-700">Qty</th>
                    <th className="p-5 bg-green-700">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-green-50/30 transition-colors">
                      <td className="p-5 text-sm">
                        <div className="font-bold text-gray-800">{item.ProductName}</div>
                        <div className="text-[10px] text-green-600 font-black uppercase tracking-wider">{item.Size}</div>
                      </td>
                      <td className="p-5 text-sm text-gray-600 font-medium">{item.Quantity}</td>
                      <td className="p-5 text-sm font-black text-green-700">₹{item.Price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              onClick={() => setShowItemsModal(false)}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-black hover:bg-green-700 transition shadow-lg transform active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-green-800">Add New User</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 mb-2 rounded"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border p-2 mb-2 rounded"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Initial Password"
              className="w-full border p-2 mb-2 rounded"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            />
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase px-1">Role</label>
              <select 
                className="w-full border p-2 rounded bg-gray-50"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: parseInt(e.target.value)})}
              >
                <option value={0}>Standard Customer</option>
                <option value={1}>Administrator</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2 text-gray-500 hover:text-black">Cancel</button>
              <button onClick={handleAddUser} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">Create Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}