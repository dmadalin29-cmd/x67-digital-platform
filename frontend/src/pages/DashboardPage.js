import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, ShoppingBag, User, Trophy, Clock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { API } from "../App";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [ticketsRes, ordersRes] = await Promise.all([
        fetch(`${API}/tickets/my`, { headers, credentials: "include" }),
        fetch(`${API}/orders/my`, { headers, credentials: "include" }),
      ]);

      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalTickets = tickets.reduce((acc, comp) => acc + comp.tickets.length, 0);
  const activeEntries = tickets.filter((t) => t.status === "live" || t.status === "ending_soon").length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-card border-b border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center">
                <User className="w-8 h-8 text-gold-500" />
              </div>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">
                  {t("welcome")}, {user?.full_name?.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-4">
                <Ticket className="w-5 h-5 text-gold-500 mb-2" />
                <p className="text-2xl font-bold text-white">{totalTickets}</p>
                <p className="text-xs text-muted-foreground">{t("totalTicketsOwned")}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <Trophy className="w-5 h-5 text-cyan-500 mb-2" />
                <p className="text-2xl font-bold text-white">{activeEntries}</p>
                <p className="text-xs text-muted-foreground">{t("activeEntries")}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <ShoppingBag className="w-5 h-5 text-gold-500 mb-2" />
                <p className="text-2xl font-bold text-white">{orders.length}</p>
                <p className="text-xs text-muted-foreground">{t("totalOrders")}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <Clock className="w-5 h-5 text-cyan-500 mb-2" />
                <p className="text-2xl font-bold text-white">
                  {tickets.filter((t) => t.status === "ending_soon").length}
                </p>
                <p className="text-xs text-muted-foreground">{t("endingSoonCount")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="section-container">
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="tickets" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black" data-testid="tab-tickets">
                {t("myTickets")}
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black" data-testid="tab-orders">
                {t("orderHistory")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">{t("noTicketsYet")}</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("enterCompetitionsToGetTickets")}
                  </p>
                  <Link to="/competitions">
                    <Button className="btn-primary" data-testid="browse-competitions">
                      {t("browseCompetitionsBtn")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((entry) => (
                    <TicketCard key={entry.competition_id} entry={entry} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">{t("noOrdersYet")}</p>
                  <p className="text-muted-foreground text-sm">
                    {t("purchaseHistoryHere")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.order_id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

const TicketCard = ({ entry }) => {
  const { t } = useLanguage();
  const statusColors = {
    live: "text-green-500",
    ending_soon: "text-orange-500",
    sold_out: "text-red-500",
    completed: "text-gray-500",
  };

  return (
    <div className="glass-card rounded-xl p-6" data-testid={`ticket-entry-${entry.competition_id}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-white">{entry.competition_title}</h3>
            <span className={`text-xs font-bold uppercase ${statusColors[entry.status]}`}>
              {t(entry.status) || entry.status?.replace("_", " ")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.tickets.map((num) => (
              <span
                key={num}
                className="px-3 py-1 bg-gold-500/20 text-gold-500 text-sm font-mono rounded-full"
              >
                #{num}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{t("drawDate")}</p>
          <p className="text-white font-medium">
            {entry.draw_date
              ? new Date(entry.draw_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "TBD"}
          </p>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {
  const statusColors = {
    pending: "text-yellow-500 bg-yellow-500/20",
    completed: "text-green-500 bg-green-500/20",
    failed: "text-red-500 bg-red-500/20",
    refunded: "text-gray-500 bg-gray-500/20",
  };

  return (
    <div className="glass-card rounded-xl p-6" data-testid={`order-${order.order_id}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm text-muted-foreground font-mono">
              {order.order_id.slice(0, 16)}...
            </p>
            <span
              className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${statusColors[order.payment_status]}`}
            >
              {order.payment_status}
            </span>
          </div>
          <p className="text-white font-medium">
            {order.quantity} ticket{order.quantity > 1 ? "s" : ""} •{" "}
            {order.ticket_numbers?.join(", ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gold-500 font-bold text-lg">£{order.total_price?.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
