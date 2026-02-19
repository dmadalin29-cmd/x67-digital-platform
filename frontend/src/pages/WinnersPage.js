import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar } from "lucide-react";
import { API } from "../App";

const WinnersPage = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const response = await fetch(`${API}/winners`);
      if (response.ok) {
        setWinners(await response.json());
      }
    } catch (error) {
      console.error("Error fetching winners:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-card border-b border-border">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Trophy className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-gradient-gold">Winners</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real people winning real prizes. Every winner is verified and celebrated.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Winners Grid */}
      <section className="section-padding">
        <div className="section-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : winners.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-white font-medium text-lg mb-2">No winners yet</p>
              <p className="text-muted-foreground">
                Be the first to win! Check out our live competitions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winners.map((winner, index) => (
                <WinnerCard key={winner.winner_id} winner={winner} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="section-container text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            You Could Be Next!
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Every ticket is a chance to win. Enter our competitions today and join our winners' circle.
          </p>
          <a
            href="/competitions"
            className="inline-flex items-center gap-2 btn-primary px-8 py-4 rounded-none text-base font-bold uppercase tracking-wide"
            data-testid="winners-cta"
          >
            <Trophy className="w-5 h-5" />
            View Competitions
          </a>
        </div>
      </section>
    </div>
  );
};

const WinnerCard = ({ winner, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-xl p-6 hover:border-gold-500/50 transition-all"
      data-testid={`winner-${winner.winner_id}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
          <Trophy className="w-7 h-7 text-gold-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg truncate">{winner.user_name}</h3>
          <p className="text-gold-500 font-medium text-sm mb-2">{winner.competition_title}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(winner.drawn_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-cyan-500 font-mono">Ticket #{winner.winning_ticket}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Prize Value</p>
        <p className="text-2xl font-bold text-gradient-gold">
          £{winner.prize_value?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default WinnersPage;
