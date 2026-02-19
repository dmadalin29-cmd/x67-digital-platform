import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Trophy, Ticket, Shield, Minus, Plus, ArrowLeft, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { API } from "../App";

const CompetitionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchCompetition();
  }, [id]);

  const fetchCompetition = async () => {
    try {
      const response = await fetch(`${API}/competitions/${id}`);
      if (response.ok) {
        setCompetition(await response.json());
      } else {
        navigate("/competitions");
      }
    } catch (error) {
      console.error("Error fetching competition:", error);
      navigate("/competitions");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase tickets");
      navigate("/login", { state: { from: { pathname: `/competitions/${id}` } } });
      return;
    }

    setPurchasing(true);
    try {
      // Create order
      const orderResponse = await fetch(`${API}/tickets/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          competition_id: id,
          quantity,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.detail || "Failed to create order");
      }

      const order = await orderResponse.json();

      // Confirm order (MOCKED payment)
      const confirmResponse = await fetch(`${API}/orders/${order.order_id}/confirm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!confirmResponse.ok) {
        throw new Error("Payment confirmation failed");
      }

      toast.success(
        <div>
          <p className="font-bold">Purchase Successful!</p>
          <p className="text-sm">You got tickets: {order.ticket_numbers.join(", ")}</p>
        </div>
      );

      // Refresh competition data
      fetchCompetition();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!competition) return null;

  const ticketsRemaining = competition.total_tickets - competition.tickets_sold;
  const percentageSold = (competition.tickets_sold / competition.total_tickets) * 100;
  const totalPrice = quantity * competition.ticket_price;
  const canPurchase = competition.status === "live" || competition.status === "ending_soon";

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="section-container py-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/competitions")}
          className="text-muted-foreground hover:text-white"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Competitions
        </Button>
      </div>

      <div className="section-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={competition.image_url}
                alt={competition.title}
                className="w-full aspect-[4/3] object-cover"
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <StatusBadge status={competition.status} />
              </div>
            </div>

            {/* Prize Details */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Prize Value</p>
                <p className="text-white font-bold text-lg">£{competition.prize_value?.toLocaleString()}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Ticket className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Tickets</p>
                <p className="text-white font-bold text-lg">{competition.total_tickets?.toLocaleString()}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Draw Date</p>
                <p className="text-white font-bold text-sm">
                  {new Date(competition.draw_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-500 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                {competition.category}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                {competition.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {competition.description}
              </p>
            </div>

            {/* Countdown */}
            <div className="glass-card rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-3">Draw ends in:</p>
              <CountdownTimer drawDate={competition.draw_date} />
            </div>

            {/* Tickets Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">
                  {ticketsRemaining.toLocaleString()} tickets remaining
                </span>
                <span className="text-cyan-500 font-bold">
                  {percentageSold.toFixed(0)}% sold
                </span>
              </div>
              <Progress value={percentageSold} className="h-3 bg-muted" />
            </div>

            {/* Purchase Section */}
            {canPurchase ? (
              <div className="glass-card rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Price</p>
                    <p className="text-3xl font-bold text-gold-500">£{competition.ticket_price}</p>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="border-border"
                      data-testid="decrease-quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(ticketsRemaining, quantity + 1))}
                      disabled={quantity >= ticketsRemaining || quantity >= 100}
                      className="border-border"
                      data-testid="increase-quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="text-2xl font-bold text-white">£{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="btn-primary w-full h-14 text-lg"
                    data-testid="purchase-button"
                  >
                    {purchasing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Ticket className="w-5 h-5" />
                        Buy {quantity} Ticket{quantity > 1 ? "s" : ""}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Instant Entry</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-lg font-bold text-white mb-2">
                  {competition.status === "sold_out" ? "Sold Out!" : "Competition Ended"}
                </p>
                <p className="text-muted-foreground">
                  {competition.winner_id
                    ? "Winner has been drawn."
                    : "This competition is no longer accepting entries."}
                </p>
              </div>
            )}

            {/* Winner Info */}
            {competition.winner_id && (
              <div className="glass-card rounded-xl p-6 border-gold-500/50">
                <p className="text-gold-500 font-bold text-center">
                  🎉 Winning Ticket: #{competition.winner_ticket}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    live: "bg-green-500",
    ending_soon: "bg-orange-500",
    sold_out: "bg-red-500",
    completed: "bg-gray-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold uppercase ${colors[status]} text-white`}>
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      {status.replace("_", " ")}
    </span>
  );
};

const CountdownTimer = ({ drawDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(drawDate) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [drawDate]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="bg-background rounded-lg p-3">
            <span className="text-2xl md:text-3xl font-bold text-cyan-500 font-mono">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide mt-2 block">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CompetitionDetailPage;
