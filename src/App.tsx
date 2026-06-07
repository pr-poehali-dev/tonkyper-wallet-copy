import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "portfolio" | "send" | "receive" | "staking" | "nft" | "swap" | "history" | "settings";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  usd: string;
  change: number;
  color: string;
  icon: string;
}

interface Transaction {
  id: string;
  type: "send" | "receive" | "swap" | "stake";
  amount: string;
  symbol: string;
  to?: string;
  from?: string;
  date: string;
  status: "confirmed" | "pending";
  usd: string;
}

interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  floor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TOKENS: Token[] = [
  { symbol: "TON", name: "Toncoin", balance: "1 247.83", usd: "6 482.41", change: +5.34, color: "#00d4ff", icon: "💎" },
  { symbol: "USDT", name: "Tether USD", balance: "890.00", usd: "890.00", change: +0.01, color: "#10f97a", icon: "💵" },
  { symbol: "NOT", name: "Notcoin", balance: "45 200", usd: "312.18", change: -2.18, color: "#f72585", icon: "🪙" },
  { symbol: "DOGS", name: "Dogs", balance: "120 000", usd: "148.80", change: +12.4, color: "#ff6b35", icon: "🐾" },
  { symbol: "STON", name: "STON.fi", balance: "320.5", usd: "96.15", change: +3.21, color: "#a78bfa", icon: "⚡" },
];

const TRANSACTIONS: Transaction[] = [
  { id: "1", type: "receive", amount: "+200", symbol: "TON", from: "UQBx...k8Rd", date: "Сегодня, 14:32", status: "confirmed", usd: "+$1040.00" },
  { id: "2", type: "send", amount: "-50", symbol: "TON", to: "EQCz...m3Wp", date: "Сегодня, 11:05", status: "confirmed", usd: "-$260.00" },
  { id: "3", type: "swap", amount: "-100 TON", symbol: "USDT", to: "+520 USDT", date: "Вчера, 20:14", status: "confirmed", usd: "$520.00" },
  { id: "4", type: "stake", amount: "+12.4", symbol: "TON", from: "Стейкинг", date: "Вчера, 09:00", status: "confirmed", usd: "+$64.48" },
  { id: "5", type: "receive", amount: "+45 200", symbol: "NOT", from: "UQKn...8sLp", date: "2 дня назад", status: "confirmed", usd: "+$312.18" },
  { id: "6", type: "send", amount: "-30", symbol: "TON", to: "EQFa...9qWt", date: "3 дня назад", status: "pending", usd: "-$156.00" },
];

const NFTS: NFT[] = [
  { id: "1", name: "TON Punks #4821", collection: "TON Punks", image: "🎭", floor: "45 TON" },
  { id: "2", name: "Getgems #1337", collection: "Getgems OG", image: "💎", floor: "120 TON" },
  { id: "3", name: "Anonymous #8042", collection: "TON Anonymous", image: "👤", floor: "30 TON" },
  { id: "4", name: "DFC Dragon #293", collection: "Dragon Farm", image: "🐉", floor: "8 TON" },
  { id: "5", name: "Notcoin #9999", collection: "Notcoin Vouchers", image: "🪙", floor: "15 TON" },
  { id: "6", name: "TonWallet #571", collection: "TON Wallets", image: "💼", floor: "22 TON" },
];

const WALLET_ADDRESS = "UQBx7kRm9pL2sNwvDqFtXzA3cEoJhYiKdG1mT8nP4sRk8Rd";
const SHORT_ADDRESS = "UQBx...k8Rd";

// ─── Sub-components ───────────────────────────────────────────────────────────

function BalanceCard({ onSend, onReceive }: { onSend: () => void; onReceive: () => void }) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 animate-fade-in">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(16,249,122,0.08) 100%)",
        }}
      />
      <div className="absolute inset-0 border border-white/10 rounded-2xl" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground font-medium tracking-wide uppercase">Общий баланс</span>
          <button className="p-1.5 rounded-lg btn-ghost" onClick={() => setVisible(!visible)}>
            <Icon name={visible ? "Eye" : "EyeOff"} size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-end gap-3 mb-1">
          <span className="font-display text-4xl font-bold text-white tracking-tight">
            {visible ? "$7 929" : "••••••"}
          </span>
          <span className="text-2xl font-semibold text-muted-foreground mb-0.5">.54</span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <span className="ticker-up text-sm font-medium">▲ +$312.14</span>
          <span className="ticker-up text-sm opacity-70">(+4.1%)</span>
          <span className="text-muted-foreground text-xs">за 24ч</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onSend} className="flex-1 btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
            <Icon name="ArrowUpRight" size={16} />
            Отправить
          </button>
          <button onClick={onReceive} className="flex-1 btn-ghost py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-cyan-400">
            <Icon name="ArrowDownLeft" size={16} />
            Получить
          </button>
          <button className="btn-ghost py-3 px-4 rounded-xl flex items-center justify-center">
            <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TokenRow({ token, index }: { token: Token; index: number }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl card-hover glass cursor-pointer mb-2 animate-fade-in-up stagger-${index + 1}`}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${token.color}20`, border: `1px solid ${token.color}40` }}>
        {token.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">{token.symbol}</span>
          <span className="text-xs text-muted-foreground">{token.name}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{token.balance} {token.symbol}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-white">${token.usd}</div>
        <div className={`text-xs font-medium ${token.change >= 0 ? "ticker-up" : "ticker-down"}`}>
          {token.change >= 0 ? "▲" : "▼"} {Math.abs(token.change)}%
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const typeConfig = {
    send: { icon: "ArrowUpRight", color: "#f72585", label: "Отправлено", bg: "rgba(247,37,133,0.1)" },
    receive: { icon: "ArrowDownLeft", color: "#10f97a", label: "Получено", bg: "rgba(16,249,122,0.1)" },
    swap: { icon: "RefreshCw", color: "#a78bfa", label: "Обмен", bg: "rgba(167,139,250,0.1)" },
    stake: { icon: "Layers", color: "#00d4ff", label: "Стейкинг", bg: "rgba(0,212,255,0.1)" },
  };
  const cfg = typeConfig[tx.type];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl glass card-hover cursor-pointer mb-2">
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
        <Icon name={cfg.icon} fallback="Circle" size={16} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{cfg.label}</span>
          {tx.status === "pending" && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">В ожидании</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-mono truncate block">{tx.from || tx.to || ""} · {tx.date}</span>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold font-mono ${tx.type === "receive" || tx.type === "stake" ? "ticker-up" : "text-white"}`}>
          {tx.amount} {tx.symbol}
        </div>
        <div className="text-xs text-muted-foreground">{tx.usd}</div>
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function PortfolioPage({ onSend, onReceive }: { onSend: () => void; onReceive: () => void }) {
  return (
    <div className="animate-fade-in">
      <BalanceCard onSend={onSend} onReceive={onReceive} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Активы</span>
        <button className="text-xs text-cyan-400 flex items-center gap-1">Все <Icon name="ChevronRight" size={12} /></button>
      </div>
      {TOKENS.map((t, i) => <TokenRow key={t.symbol} token={t} index={i} />)}
    </div>
  );
}

function SendPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("TON");

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-5">Отправить</h2>
      <div className="glass rounded-2xl p-4 mb-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Токен</label>
        <div className="flex gap-2 flex-wrap">
          {TOKENS.slice(0, 4).map(t => (
            <button key={t.symbol} onClick={() => setSelectedToken(t.symbol)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedToken === t.symbol ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40" : "btn-ghost text-muted-foreground"}`}>
              {t.icon} {t.symbol}
            </button>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Адрес получателя</label>
        <div className="flex gap-2">
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="UQ... или ENS адрес"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground font-mono outline-none focus:border-cyan-400/50 transition-colors" />
          <button className="btn-ghost px-3 rounded-xl"><Icon name="Scan" size={16} className="text-cyan-400" /></button>
          <button className="btn-ghost px-3 rounded-xl"><Icon name="Clipboard" size={16} className="text-muted-foreground" /></button>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-4">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Сумма</label>
        <div className="flex items-center gap-3">
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" type="number"
            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/20 font-mono" />
          <span className="text-muted-foreground font-semibold">{selectedToken}</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">≈ $0.00 USD</span>
          <button className="text-xs text-cyan-400 font-medium">Макс.</button>
        </div>
      </div>
      <div className="glass rounded-xl p-3 mb-4 flex items-center gap-3">
        <Icon name="Zap" size={14} className="text-yellow-400 flex-shrink-0" />
        <div><span className="text-xs text-muted-foreground">Комиссия сети: </span><span className="text-xs text-white font-medium font-mono">~0.0055 TON</span></div>
      </div>
      <button className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
        <Icon name="ArrowUpRight" size={18} />Подтвердить отправку
      </button>
      <p className="text-xs text-muted-foreground text-center mt-3">Дважды проверьте адрес — транзакции необратимы</p>
    </div>
  );
}

function ReceivePage() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in text-center">
      <h2 className="font-display text-xl font-bold text-white mb-2">Получить</h2>
      <p className="text-sm text-muted-foreground mb-6">Отправьте этот адрес или QR-код отправителю</p>
      <div className="flex justify-center mb-6">
        <div className="relative p-5 glass rounded-2xl neon-border-cyan glow-cyan animate-float">
          <div className="w-44 h-44 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1))" }}>
            <div className="w-36 h-36 grid" style={{ gridTemplateColumns: "repeat(9, 1fr)", gap: "2px" }}>
              {Array.from({ length: 81 }).map((_, i) => {
                const pattern = [1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,1,0,1,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,1,0,1,1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,1,1,0];
                return <div key={i} className="rounded-sm" style={{ background: pattern[i] ? "#00d4ff" : "transparent", aspectRatio: "1" }} />;
              })}
            </div>
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-neon-green" style={{ boxShadow: "0 0 10px #10f97a" }} />
        </div>
      </div>
      <div className="glass rounded-xl p-4 mb-3">
        <p className="text-xs text-muted-foreground mb-2">Адрес кошелька TON</p>
        <p className="font-mono text-sm text-white break-all leading-relaxed mb-3">{WALLET_ADDRESS}</p>
        <button onClick={copy}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${copied ? "bg-neon-green/20 text-neon-green border border-neon-green/40" : "btn-primary"}`}>
          <Icon name={copied ? "Check" : "Copy"} size={15} />
          {copied ? "Скопировано!" : "Скопировать адрес"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {["TON", "USDT", "NOT", "DOGS"].map(sym => (
          <button key={sym} className="glass rounded-xl p-3 text-sm font-medium text-muted-foreground btn-ghost flex items-center gap-2">
            <span>{TOKENS.find(t => t.symbol === sym)?.icon}</span>
            <span>Получить {sym}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StakingPage() {
  const pools = [
    { name: "TON Whales", apy: "5.2%", minStake: "50 TON", tvl: "42M TON", badge: "🔒 Безопасный", color: "#00d4ff" },
    { name: "TON Nominators", apy: "4.8%", minStake: "10 001 TON", tvl: "120M TON", badge: "⚡ Максимальный TVL", color: "#a78bfa" },
    { name: "TON Liquid", apy: "6.1%", minStake: "1 TON", tvl: "18M TON", badge: "🔥 Высокий APY", color: "#f72585" },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-1">Стейкинг</h2>
      <p className="text-sm text-muted-foreground mb-5">Зарабатывайте пассивный доход от валидации сети</p>
      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex gap-6">
          <div><p className="text-xs text-muted-foreground mb-1">Застейкано</p><p className="font-display text-2xl font-bold gradient-text">500 TON</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Награды</p><p className="font-display text-2xl font-bold ticker-up">+26 TON</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">APY</p><p className="font-display text-2xl font-bold text-cyan-400">5.2%</p></div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex gap-3">
          <button className="btn-primary flex-1 py-2 rounded-xl text-sm font-semibold">Стейкнуть ещё</button>
          <button className="btn-ghost flex-1 py-2 rounded-xl text-sm font-semibold text-muted-foreground">Вывести</button>
        </div>
      </div>
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Пулы</p>
      {pools.map((pool, i) => (
        <div key={pool.name} className={`glass card-hover rounded-2xl p-4 mb-3 cursor-pointer animate-fade-in-up stagger-${i + 1}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-white">{pool.name}</p>
              <p className="text-xs text-muted-foreground">{pool.badge}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: pool.color }}>{pool.apy}</p>
              <p className="text-xs text-muted-foreground">APY</p>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Мин: <span className="text-white font-mono">{pool.minStake}</span></span>
            <span>TVL: <span className="text-white font-mono">{pool.tvl}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NFTPage() {
  const [selected, setSelected] = useState<NFT | null>(null);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">NFT Коллекция</h2>
        <span className="glass px-3 py-1.5 rounded-full text-xs text-cyan-400 font-mono">{NFTS.length} шт.</span>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-white">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="btn-ghost p-2 rounded-xl">
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="w-full h-48 rounded-2xl flex items-center justify-center text-7xl mb-4"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.15))" }}>
              {selected.image}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass rounded-xl p-3"><p className="text-xs text-muted-foreground mb-1">Коллекция</p><p className="text-sm font-medium text-white">{selected.collection}</p></div>
              <div className="glass rounded-xl p-3"><p className="text-xs text-muted-foreground mb-1">Floor price</p><p className="text-sm font-medium text-cyan-400 font-mono">{selected.floor}</p></div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 btn-primary py-3 rounded-xl font-semibold text-sm">Передать</button>
              <button className="flex-1 btn-ghost py-3 rounded-xl font-semibold text-sm text-muted-foreground">Продать</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {NFTS.map((nft, i) => (
          <div key={nft.id} className={`glass card-hover rounded-2xl p-3 cursor-pointer animate-fade-in-up stagger-${i + 1}`} onClick={() => setSelected(nft)}>
            <div className="w-full aspect-square rounded-xl flex items-center justify-center text-4xl mb-3"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.12))" }}>
              {nft.image}
            </div>
            <p className="text-xs font-semibold text-white truncate">{nft.name}</p>
            <p className="text-xs text-muted-foreground truncate">{nft.collection}</p>
            <p className="text-xs text-cyan-400 font-mono mt-1">{nft.floor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SwapPage() {
  const [fromToken, setFromToken] = useState("TON");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");

  const swapTokens = () => {
    const tmp = fromToken;
    setFromToken(toToken);
    setToToken(tmp);
    setFromAmount("");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">Обмен</h2>
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot" />
          <span className="text-xs text-neon-green font-medium">STON.fi DEX</span>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Отдаю</label>
        <div className="flex items-center gap-3">
          <select value={fromToken} onChange={e => setFromToken(e.target.value)}
            className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm font-semibold outline-none">
            {TOKENS.map(t => <option key={t.symbol} value={t.symbol} style={{ background: "#0d1117" }}>{t.icon} {t.symbol}</option>)}
          </select>
          <input value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0.00" type="number"
            className="flex-1 bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/20 font-mono text-right" />
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">Баланс: 1 247.83 {fromToken}</span>
          <button className="text-xs text-cyan-400 font-medium">Макс.</button>
        </div>
      </div>
      <div className="flex justify-center my-1">
        <button onClick={swapTokens} className="glass-strong p-2.5 rounded-full btn-primary text-black glow-cyan z-10">
          <Icon name="ArrowUpDown" size={18} />
        </button>
      </div>
      <div className="glass rounded-2xl p-4 mb-4">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Получаю</label>
        <div className="flex items-center gap-3">
          <select value={toToken} onChange={e => setToToken(e.target.value)}
            className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm font-semibold outline-none">
            {TOKENS.map(t => <option key={t.symbol} value={t.symbol} style={{ background: "#0d1117" }}>{t.icon} {t.symbol}</option>)}
          </select>
          <div className="flex-1 text-right">
            <span className="text-xl font-bold font-mono text-cyan-400">
              {fromAmount ? (parseFloat(fromAmount) * 5.2).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">1 TON ≈ 5.2 USDT</span>
          <span className="text-xs text-muted-foreground">−0.3% комиссия</span>
        </div>
      </div>
      <div className="glass rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Проскальзывание</span>
          <div className="flex gap-1">
            {["0.1", "0.5", "1.0"].map(v => (
              <button key={v} onClick={() => setSlippage(v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${slippage === v ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40" : "text-muted-foreground btn-ghost"}`}>
                {v}%
              </button>
            ))}
          </div>
        </div>
      </div>
      <button className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
        <Icon name="Zap" size={18} />Обменять через STON.fi
      </button>
    </div>
  );
}

function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "send" | "receive" | "swap" | "stake">("all");
  const filtered = filter === "all" ? TRANSACTIONS : TRANSACTIONS.filter(tx => tx.type === filter);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-4">История</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {([["all", "Все"], ["receive", "Входящие"], ["send", "Исходящие"], ["swap", "Обмены"], ["stake", "Стейкинг"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === key ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40" : "btn-ghost text-muted-foreground"}`}>
            {label}
          </button>
        ))}
      </div>
      {filtered.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Inbox" size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Транзакций нет</p>
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  const [biometric, setBiometric] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [network, setNetwork] = useState("mainnet");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? "bg-cyan-400" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-5">Настройки</h2>
      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-1">Безопасность</p>
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { label: "Face ID / Touch ID", desc: "Биометрическая аутентификация", icon: "Fingerprint", value: biometric, toggle: () => setBiometric(!biometric) },
            { label: "2FA аутентификация", desc: "Двухфакторная защита", icon: "Shield", value: twoFA, toggle: () => setTwoFA(!twoFA) },
            { label: "Уведомления", desc: "Push-уведомления о транзакциях", icon: "Bell", value: notifications, toggle: () => setNotifications(!notifications) },
          ].map((item, i) => (
            <div key={item.label} className={`flex items-center gap-3 p-4 ${i < 2 ? "border-b border-white/5" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} fallback="Circle" size={16} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Toggle value={item.value} onChange={item.toggle} />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-1">Сеть</p>
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { id: "mainnet", label: "Mainnet", desc: "Основная сеть TON", dot: "#10f97a" },
            { id: "testnet", label: "Testnet", desc: "Тестовая сеть", dot: "#f72585" },
          ].map((n, i) => (
            <button key={n.id} onClick={() => setNetwork(n.id)}
              className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${i < 1 ? "border-b border-white/5" : ""} ${network === n.id ? "bg-cyan-400/5" : ""}`}>
              <div className="w-2 h-2 rounded-full" style={{ background: n.dot, boxShadow: `0 0 6px ${n.dot}` }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              {network === n.id && <Icon name="Check" size={16} className="text-cyan-400" />}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-1">Кошелёк</p>
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { icon: "Key", label: "Экспорт приватного ключа", color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { icon: "FileText", label: "Фраза восстановления (24 слова)", color: "text-violet-400", bg: "bg-violet-400/10" },
            { icon: "Link", label: "Подключённые dApps", color: "text-cyan-400", bg: "bg-cyan-400/10" },
          ].map((item, i) => (
            <button key={item.label}
              className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5 ${i < 2 ? "border-b border-white/5" : ""}`}>
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={item.icon} fallback="Circle" size={16} className={item.color} />
              </div>
              <span className="text-sm font-medium text-white flex-1">{item.label}</span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      <button className="w-full btn-ghost py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-destructive border border-destructive/30">
        <Icon name="LogOut" size={16} />Выйти из кошелька
      </button>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "portfolio", icon: "Wallet", label: "Портфель" },
  { id: "history", icon: "Clock", label: "История" },
  { id: "swap", icon: "RefreshCw", label: "Обмен" },
  { id: "nft", icon: "Image", label: "NFT" },
  { id: "staking", icon: "Layers", label: "Стейкинг" },
  { id: "settings", icon: "Settings", label: "Настройки" },
] as const;

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState<Tab>("portfolio");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <div
        className={`w-full max-w-sm flex flex-col transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ minHeight: "100svh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-float flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #00d4ff, #8b5cf6)" }}>
              <span className="text-black font-bold text-base">T</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white leading-none">TonKeeper</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{SHORT_ADDRESS}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 glass px-2.5 py-1.5 rounded-full">
              <span className="pulse-dot" />
              <span className="text-xs font-medium" style={{ color: "#10f97a" }}>Mainnet</span>
            </div>
            <button className="btn-ghost p-2 rounded-xl">
              <Icon name="Bell" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {tab === "portfolio" && <PortfolioPage onSend={() => setTab("send")} onReceive={() => setTab("receive")} />}
          {tab === "send" && <SendPage />}
          {tab === "receive" && <ReceivePage />}
          {tab === "staking" && <StakingPage />}
          {tab === "nft" && <NFTPage />}
          {tab === "swap" && <SwapPage />}
          {tab === "history" && <HistoryPage />}
          {tab === "settings" && <SettingsPage />}
        </div>

        {/* Bottom Nav */}
        <div className="flex-shrink-0 px-4 pb-6 pt-2">
          <div className="glass-strong rounded-2xl p-2">
            <div className="grid grid-cols-6 gap-1">
              {NAV_ITEMS.map(item => {
                const isActive = tab === item.id || (item.id === "portfolio" && (tab === "send" || tab === "receive"));
                return (
                  <button key={item.id} onClick={() => setTab(item.id as Tab)}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 ${isActive ? "nav-item-active" : "hover:bg-white/5"}`}>
                    <Icon name={item.icon} fallback="Circle" size={18} className={isActive ? "text-cyan-400" : "text-muted-foreground"} />
                    <span className={`text-[9px] font-medium leading-none ${isActive ? "text-cyan-400" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}