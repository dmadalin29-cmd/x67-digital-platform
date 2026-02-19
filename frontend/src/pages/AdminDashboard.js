import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  Users,
  ShoppingBag,
  Settings,
  Plus,
  Edit,
  Trash2,
  Award,
  DollarSign,
  Ticket,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { API } from "../App";

const AdminDashboard = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Overview" },
    { path: "/admin/competitions", icon: Trophy, label: "Competitions" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  ];

  return (
    <div className="min-h-screen">
      <div className="section-container py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="glass-card rounded-xl p-4 sticky top-24">
              <h2 className="font-heading text-lg font-bold text-white mb-4 px-2">
                Admin Panel
              </h2>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-gold-500 text-black"
                        : "text-muted-foreground hover:bg-accent hover:text-white"
                    }`}
                    data-testid={`admin-nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="competitions" element={<AdminCompetitions />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

// Admin Overview
const AdminOverview = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    try {
      const response = await fetch(`${API}/seed`, { method: "POST" });
      const data = await response.json();
      toast.success(data.message);
      fetchStats();
    } catch (error) {
      toast.error("Failed to seed data");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Dashboard Overview</h1>
        <Button onClick={seedData} className="btn-secondary" data-testid="seed-data-btn">
          <RefreshCw className="w-4 h-4 mr-2" />
          Seed Demo Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`£${stats?.total_revenue?.toLocaleString() || 0}`}
          color="gold"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.total_users || 0}
          color="cyan"
        />
        <StatCard
          icon={Trophy}
          label="Active Competitions"
          value={stats?.active_competitions || 0}
          color="gold"
        />
        <StatCard
          icon={Ticket}
          label="Tickets Today"
          value={stats?.tickets_sold_today || 0}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats?.total_orders || 0}
          color="gold"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Competitions"
          value={stats?.total_competitions || 0}
          color="cyan"
        />
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card rounded-xl p-6">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        color === "gold" ? "bg-gold-500/20" : "bg-cyan-500/20"
      }`}>
        <Icon className={`w-6 h-6 ${color === "gold" ? "text-gold-500" : "text-cyan-500"}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

// Admin Competitions
const AdminCompetitions = () => {
  const { token } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await fetch(`${API}/admin/competitions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setCompetitions(await response.json());
      }
    } catch (error) {
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this competition?")) return;
    try {
      const response = await fetch(`${API}/admin/competitions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Competition deleted");
        fetchCompetitions();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Failed to delete competition");
    }
  };

  const handleDraw = async (id) => {
    if (!confirm("Are you sure you want to draw a winner now?")) return;
    try {
      const response = await fetch(`${API}/admin/competitions/${id}/draw`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(`Winner drawn! Ticket #${data.winner.winning_ticket}`);
        fetchCompetitions();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to draw winner");
      }
    } catch (error) {
      toast.error("Failed to draw winner");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">Competitions</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="btn-primary"
              onClick={() => setEditingComp(null)}
              data-testid="add-competition-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Competition
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-white">
                {editingComp ? "Edit Competition" : "Add Competition"}
              </DialogTitle>
            </DialogHeader>
            <CompetitionForm
              competition={editingComp}
              onSuccess={() => {
                setDialogOpen(false);
                fetchCompetitions();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-xl">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No competitions yet</p>
          <p className="text-muted-foreground text-sm">Create your first competition to get started</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Sold</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((comp) => (
                <TableRow key={comp.competition_id} className="border-border" data-testid={`comp-row-${comp.competition_id}`}>
                  <TableCell className="font-medium text-white">{comp.title}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{comp.category}</TableCell>
                  <TableCell className="text-gold-500">£{comp.ticket_price}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {comp.tickets_sold}/{comp.total_tickets}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      comp.status === "live" ? "bg-green-500/20 text-green-500" :
                      comp.status === "ending_soon" ? "bg-orange-500/20 text-orange-500" :
                      comp.status === "completed" ? "bg-gray-500/20 text-gray-500" :
                      "bg-red-500/20 text-red-500"
                    }`}>
                      {comp.status?.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!comp.winner_id && comp.tickets_sold > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDraw(comp.competition_id)}
                          className="text-cyan-500 hover:text-cyan-400"
                          data-testid={`draw-${comp.competition_id}`}
                        >
                          <Award className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingComp(comp);
                          setDialogOpen(true);
                        }}
                        className="text-muted-foreground hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(comp.competition_id)}
                        className="text-destructive hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

// Competition Form
const CompetitionForm = ({ competition, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: competition?.title || "",
    description: competition?.description || "",
    category: competition?.category || "cars",
    prize_value: competition?.prize_value || "",
    ticket_price: competition?.ticket_price || "",
    total_tickets: competition?.total_tickets || "",
    draw_date: competition?.draw_date?.slice(0, 16) || "",
    image_url: competition?.image_url || "",
    featured: competition?.featured || false,
    auto_draw: competition?.auto_draw ?? true,
    is_visible: competition?.is_visible ?? true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = competition
        ? `${API}/admin/competitions/${competition.competition_id}`
        : `${API}/admin/competitions`;
      
      const response = await fetch(url, {
        method: competition ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          prize_value: parseFloat(formData.prize_value),
          ticket_price: parseFloat(formData.ticket_price),
          total_tickets: parseInt(formData.total_tickets),
          draw_date: new Date(formData.draw_date).toISOString(),
        }),
      });

      if (response.ok) {
        toast.success(competition ? "Competition updated" : "Competition created");
        onSuccess();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Failed to save competition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label className="text-white">Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="input-dark"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Category</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger className="input-dark">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="cars">Cars</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Prize Value (£)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.prize_value}
            onChange={(e) => setFormData({ ...formData, prize_value: e.target.value })}
            required
            className="input-dark"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Ticket Price (£)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.ticket_price}
            onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
            required
            className="input-dark"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Total Tickets</Label>
          <Input
            type="number"
            value={formData.total_tickets}
            onChange={(e) => setFormData({ ...formData, total_tickets: e.target.value })}
            required
            className="input-dark"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label className="text-white">Draw Date</Label>
          <Input
            type="datetime-local"
            value={formData.draw_date}
            onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
            required
            className="input-dark"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label className="text-white">Image URL</Label>
          <Input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            required
            className="input-dark"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label className="text-white">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="input-dark min-h-[100px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-white">Featured</Label>
          <Switch
            checked={formData.featured}
            onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-white">Auto Draw</Label>
          <Switch
            checked={formData.auto_draw}
            onCheckedChange={(v) => setFormData({ ...formData, auto_draw: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-white">Visible</Label>
          <Switch
            checked={formData.is_visible}
            onCheckedChange={(v) => setFormData({ ...formData, is_visible: v })}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving..." : competition ? "Update Competition" : "Create Competition"}
      </Button>
    </form>
  );
};

// Admin Users
const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setUsers(await response.json());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const response = await fetch(`${API}/admin/users/${userId}/role?role=${newRole}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-heading text-2xl font-bold text-white mb-8">Users</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Joined</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id} className="border-border" data-testid={`user-row-${user.user_id}`}>
                  <TableCell className="font-medium text-white">{user.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      user.role === "admin" ? "bg-gold-500/20 text-gold-500" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRole(user.user_id, user.role)}
                      className="text-cyan-500 hover:text-cyan-400"
                    >
                      {user.role === "admin" ? "Demote" : "Promote"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

// Admin Orders
const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setOrders(await response.json());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId) => {
    if (!confirm("Are you sure you want to refund this order?")) return;
    try {
      const response = await fetch(`${API}/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Order refunded");
        fetchOrders();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to refund");
      }
    } catch (error) {
      toast.error("Failed to refund order");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-heading text-2xl font-bold text-white mb-8">Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-xl">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-white font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Tickets</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id} className="border-border" data-testid={`order-row-${order.order_id}`}>
                  <TableCell className="font-mono text-white text-sm">
                    {order.order_id.slice(0, 16)}...
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.quantity}</TableCell>
                  <TableCell className="text-gold-500 font-bold">£{order.total_price?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      order.payment_status === "completed" ? "bg-green-500/20 text-green-500" :
                      order.payment_status === "refunded" ? "bg-gray-500/20 text-gray-400" :
                      order.payment_status === "failed" ? "bg-red-500/20 text-red-500" :
                      "bg-yellow-500/20 text-yellow-500"
                    }`}>
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.payment_status === "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRefund(order.order_id)}
                        className="text-destructive hover:text-red-400"
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
