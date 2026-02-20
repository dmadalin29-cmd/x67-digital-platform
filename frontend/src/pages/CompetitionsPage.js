import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Trophy, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useLanguage } from "../context/LanguageContext";
import { API } from "../App";

const CompetitionsPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("ending_soon");

  useEffect(() => {
    fetchCompetitions();
  }, [category]);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API}/competitions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCompetitions(data);
      }
    } catch (error) {
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompetitions = competitions
    .filter((comp) => {
      if (search) {
        return comp.title.toLowerCase().includes(search.toLowerCase()) ||
               comp.description.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "ending_soon":
          return new Date(a.draw_date) - new Date(b.draw_date);
        case "price_low":
          return a.ticket_price - b.ticket_price;
        case "price_high":
          return b.ticket_price - a.ticket_price;
        case "value_high":
          return b.prize_value - a.prize_value;
        default:
          return 0;
      }
    });

  const categories = [
    { value: "all", label: t("allCategories") },
    { value: "cars", label: t("cars") },
    { value: "electronics", label: t("electronics") },
    { value: "cash", label: t("cashPrizes") },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-card border-b border-border">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              {t("allCompetitions").split(" ")[0]} <span className="text-gradient-gold">{t("allCompetitions").split(" ").slice(1).join(" ") || t("competitions")}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("browseCompetitions")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border glass-card sticky top-16 md:top-20 z-40">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("searchCompetitions")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 input-dark"
                data-testid="search-input"
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {/* Category Filter */}
              <Select value={category} onValueChange={(v) => {
                setCategory(v);
                if (v === "all") {
                  searchParams.delete("category");
                } else {
                  searchParams.set("category", v);
                }
                setSearchParams(searchParams);
              }}>
                <SelectTrigger className="w-full md:w-48 input-dark" data-testid="category-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 input-dark" data-testid="sort-filter">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="ending_soon">{t("endingSoon")}</SelectItem>
                  <SelectItem value="price_low">{t("priceLowHigh")}</SelectItem>
                  <SelectItem value="price_high">{t("priceHighLow")}</SelectItem>
                  <SelectItem value="value_high">{t("prizeValueHighLow")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding">
        <div className="section-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-competition h-[400px] animate-pulse bg-muted" />
              ))}
            </div>
          ) : filteredCompetitions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">{t("noCompetitionsFound")}</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-4 text-gold-500"
              >
                {t("clearFilters")}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {filteredCompetitions.length} {t("competitionsFound")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompetitions.map((comp, i) => (
                  <CompetitionCard key={comp.competition_id} competition={comp} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const CompetitionCard = ({ competition, index }) => {
  const { t } = useLanguage();
  const ticketsRemaining = competition.total_tickets - competition.tickets_sold;
  const percentageSold = (competition.tickets_sold / competition.total_tickets) * 100;

  const statusColors = {
    live: "bg-green-500",
    ending_soon: "bg-orange-500",
    sold_out: "bg-red-500",
    completed: "bg-gray-500",
  };

  const getStatusText = (status) => {
    return t(status) || status.replace("_", " ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/competitions/${competition.competition_id}`}
        className="card-competition group block"
        data-testid={`competition-card-${competition.competition_id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={competition.image_url}
            alt={competition.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[competition.status]} text-white`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {getStatusText(competition.status)}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-gold-500 text-black text-xs font-bold rounded-full">
              £{competition.ticket_price}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
            {competition.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gold-500 font-bold flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              £{competition.prize_value?.toLocaleString()}
            </span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <CountdownTimer drawDate={competition.draw_date} />
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                {ticketsRemaining.toLocaleString()} {t("ticketsLeft")}
              </span>
              <span className="text-cyan-500 font-bold">
                {percentageSold.toFixed(0)}% {t("sold")}
              </span>
            </div>
            <Progress value={percentageSold} className="h-2 bg-muted" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CountdownTimer = ({ drawDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(drawDate) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0 };
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);
    return () => clearInterval(timer);
  }, [drawDate]);

  return (
    <span className="font-mono text-xs">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
    </span>
  );
};

export default CompetitionsPage;
