import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Ticket, Trophy, Shield, Users, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { API } from "../App";

const HomePage = () => {
  const [featuredComps, setFeaturedComps] = useState([]);
  const [allComps, setAllComps] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, compsRes, winnersRes] = await Promise.all([
        fetch(`${API}/competitions/featured`),
        fetch(`${API}/competitions`),
        fetch(`${API}/winners`),
      ]);

      if (featuredRes.ok) setFeaturedComps(await featuredRes.json());
      if (compsRes.ok) setAllComps(await compsRes.json());
      if (winnersRes.ok) setWinners(await winnersRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const heroComp = featuredComps.find(c => c.category === "cars") || featuredComps[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroComp?.image_url || "https://images.unsplash.com/photo-1765461734605-34657fa04db2?w=1600"}
            alt="Featured Car"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="section-container relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/50 rounded-full text-gold-500 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3" />
                Featured Competition
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-none mb-6"
            >
              WIN A<br />
              <span className="text-gradient-gold">{heroComp?.title || "LUXURY CAR"}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
            >
              {heroComp?.description?.slice(0, 150) || "Enter now for your chance to win incredible prizes. Verified draws, guaranteed winners."}...
            </motion.p>

            {heroComp && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                <div className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5 text-gold-500" />
                  <span className="font-bold">£{heroComp.prize_value?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Ticket className="w-5 h-5 text-cyan-500" />
                  <span>From £{heroComp.ticket_price}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-cyan-500" />
                  <CountdownTimer drawDate={heroComp.draw_date} />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={heroComp ? `/competitions/${heroComp.competition_id}` : "/competitions"}>
                <Button className="btn-primary h-14 px-8 text-base" data-testid="hero-cta">
                  Enter Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/competitions">
                <Button variant="outline" className="btn-secondary h-14 px-8 text-base" data-testid="hero-view-all">
                  View All Competitions
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-card border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: "SSL Secured", value: "256-bit Encryption" },
              { icon: Trophy, label: "Winners", value: "100+ Verified" },
              { icon: Users, label: "Members", value: "50,000+" },
              { icon: Ticket, label: "Prizes Awarded", value: "£2M+" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
                  <p className="text-white font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Competitions */}
      <section className="section-padding">
        <div className="section-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                Live <span className="text-gradient-gold">Competitions</span>
              </h2>
              <p className="text-muted-foreground">Enter now before they sell out</p>
            </div>
            <Link to="/competitions">
              <Button variant="ghost" className="text-gold-500 hover:text-gold-400" data-testid="view-all-comps">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-competition h-[400px] animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allComps.slice(0, 6).map((comp, i) => (
                <CompetitionCard key={comp.competition_id} competition={comp} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Winners */}
      {winners.length > 0 && (
        <section className="section-padding bg-card">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                Recent <span className="text-gradient-cyan">Winners</span>
              </h2>
              <p className="text-muted-foreground">Real people, real prizes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {winners.slice(0, 2).map((winner) => (
                <div key={winner.winner_id} className="glass-card rounded-xl p-6 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{winner.user_name}</p>
                    <p className="text-gold-500 font-medium">Won {winner.competition_title}</p>
                    <p className="text-muted-foreground text-sm">Prize: £{winner.prize_value?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/winners">
                <Button variant="outline" className="btn-secondary" data-testid="view-all-winners">
                  View All Winners
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-cyan-500/10" />
        <div className="section-container relative z-10 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to <span className="text-gradient-gold">Win Big?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of winners. Enter our competitions today and you could be driving away in your dream car.
          </p>
          <Link to="/register">
            <Button className="btn-primary h-14 px-10 text-base" data-testid="cta-register">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

// Competition Card Component
const CompetitionCard = ({ competition, index }) => {
  const ticketsRemaining = competition.total_tickets - competition.tickets_sold;
  const percentageSold = (competition.tickets_sold / competition.total_tickets) * 100;

  const statusColors = {
    live: "bg-green-500",
    ending_soon: "bg-orange-500",
    sold_out: "bg-red-500",
    completed: "bg-gray-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/competitions/${competition.competition_id}`}
        className="card-competition group block"
        data-testid={`competition-card-${competition.competition_id}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={competition.image_url}
            alt={competition.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[competition.status]} text-white`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {competition.status.replace("_", " ")}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-gold-500 text-black text-xs font-bold rounded-full">
              £{competition.ticket_price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
            {competition.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gold-500 font-bold">
              Worth £{competition.prize_value?.toLocaleString()}
            </span>
            <CountdownTimer drawDate={competition.draw_date} small />
          </div>

          {/* Tickets Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {ticketsRemaining.toLocaleString()} tickets left
              </span>
              <span className="text-cyan-500 font-bold">
                {percentageSold.toFixed(0)}% sold
              </span>
            </div>
            <Progress value={percentageSold} className="h-2 bg-muted" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ drawDate, small = false }) => {
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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [drawDate]);

  if (small) {
    return (
      <span className="text-muted-foreground">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  return (
    <span className="font-mono">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
    </span>
  );
};

export default HomePage;
