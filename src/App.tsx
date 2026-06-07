import { useState, useEffect, useCallback } from "react";

// ─── localStorage hook ────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });
  const save = useCallback((v: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch (e) { console.warn(e); }
      return next;
    });
  }, [key]);
  return [state, save];
}
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "portfolio" | "send" | "receive" | "staking" | "nft" | "swap" | "history" | "settings";

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdRate: number;
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

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_TOKENS: Token[] = [
  { symbol: "TON", name: "Toncoin", balance: 1247.83, usdRate: 5.2, change: +5.34, color: "#00d4ff", icon: "💎" },
  { symbol: "USDT", name: "Tether USD", balance: 890.0, usdRate: 1.0, change: +0.01, color: "#10f97a", icon: "💵" },
  { symbol: "NOT", name: "Notcoin", balance: 45200, usdRate: 0.0069, change: -2.18, color: "#f72585", icon: "🪙" },
  { symbol: "DOGS", name: "Dogs", balance: 120000, usdRate: 0.00124, change: +12.4, color: "#ff6b35", icon: "🐾" },
  { symbol: "STON", name: "STON.fi", balance: 320.5, usdRate: 0.3, change: +3.21, color: "#a78bfa", icon: "⚡" },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "receive", amount: "+200", symbol: "TON", from: "UQBx...k8Rd", date: "Сегодня, 14:32", status: "confirmed", usd: "+$1040.00" },
  { id: "2", type: "send", amount: "-50", symbol: "TON", to: "EQCz...m3Wp", date: "Сегодня, 11:05", status: "confirmed", usd: "-$260.00" },
  { id: "3", type: "swap", amount: "-100 TON", symbol: "USDT", to: "+520 USDT", date: "Вчера, 20:14", status: "confirmed", usd: "$520.00" },
  { id: "4", type: "stake", amount: "+12.4", symbol: "TON", from: "Стейкинг", date: "Вчера, 09:00", status: "confirmed", usd: "+$64.48" },
  { id: "5", type: "receive", amount: "+45 200", symbol: "NOT", from: "UQKn...8sLp", date: "2 дня назад", status: "confirmed", usd: "+$312.18" },
  { id: "6", type: "send", amount: "-30", symbol: "TON", to: "EQFa...9qWt", date: "3 дня назад", status: "pending", usd: "-$156.00" },
];

const INITIAL_NFTS: NFT[] = [
  { id: "1", name: "TON Punks #4821", collection: "TON Punks", image: "🎭", floor: "45 TON" },
  { id: "2", name: "Getgems #1337", collection: "Getgems OG", image: "💎", floor: "120 TON" },
  { id: "3", name: "Anonymous #8042", collection: "TON Anonymous", image: "👤", floor: "30 TON" },
  { id: "4", name: "DFC Dragon #293", collection: "Dragon Farm", image: "🐉", floor: "8 TON" },
  { id: "5", name: "Notcoin #9999", collection: "Notcoin Vouchers", image: "🪙", floor: "15 TON" },
  { id: "6", name: "TonWallet #571", collection: "TON Wallets", image: "💼", floor: "22 TON" },
];

const WALLET_ADDRESS = "UQBx7kRm9pL2sNwvDqFtXzA3cEoJhYiKdG1mT8nP4sRk8Rd";
const SHORT_ADDRESS = "UQBx...k8Rd";

const RATES: Record<string, number> = { TON: 5.2, USDT: 1, NOT: 0.0069, DOGS: 0.00124, STON: 0.3 };

function now() {
  const d = new Date();
  return `Сегодня, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`glass-strong rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in pointer-events-auto
            ${t.type === "success" ? "border border-neon-green/30" : t.type === "error" ? "border border-red-500/30" : "border border-cyan-400/30"}`}>
          <span className="text-lg flex-shrink-0">
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </span>
          <span className="text-sm text-white flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-muted-foreground hover:text-white">
            <Icon name="X" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Balance Card ─────────────────────────────────────────────────────────────

function BalanceCard({
  tokens, onSend, onReceive, onRefresh
}: {
  tokens: Token[];
  onSend: () => void;
  onReceive: () => void;
  onRefresh: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const total = tokens.reduce((s, t) => s + t.balance * t.usdRate, 0);

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh();
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 animate-fade-in">
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(16,249,122,0.08) 100%)" }} />
      <div className="absolute inset-0 border border-white/10 rounded-2xl" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground font-medium tracking-wide uppercase">Общий баланс</span>
          <button className="p-1.5 rounded-lg btn-ghost" onClick={() => setVisible(!visible)}>
            <Icon name={visible ? "Eye" : "EyeOff"} size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-end gap-1 mb-1">
          <span className="font-display text-4xl font-bold text-white tracking-tight">
            {visible ? `$${Math.floor(total).toLocaleString("ru")}` : "••••••"}
          </span>
          <span className="text-2xl font-semibold text-muted-foreground mb-0.5">
            {visible ? `.${(total % 1).toFixed(2).slice(2)}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <span className="ticker-up text-sm font-medium">▲ +$312.14</span>
          <span className="ticker-up text-sm opacity-70">(+4.1%)</span>
          <span className="text-muted-foreground text-xs">за 24ч</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onSend} className="flex-1 btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
            <Icon name="ArrowUpRight" size={16} />Отправить
          </button>
          <button onClick={onReceive} className="flex-1 btn-ghost py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-cyan-400">
            <Icon name="ArrowDownLeft" size={16} />Получить
          </button>
          <button onClick={handleRefresh} className="btn-ghost py-3 px-4 rounded-xl flex items-center justify-center">
            <Icon name="RefreshCw" size={16} className={`text-muted-foreground transition-transform duration-700 ${spinning ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Token Row ────────────────────────────────────────────────────────────────

function TokenRow({ token, index, onSend }: { token: Token; index: number; onSend: (sym: string) => void }) {
  const usd = (token.balance * token.usdRate).toFixed(2);
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl card-hover glass cursor-pointer mb-2 animate-fade-in-up stagger-${index + 1}`}
      onClick={() => onSend(token.symbol)}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${token.color}20`, border: `1px solid ${token.color}40` }}>
        {token.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">{token.symbol}</span>
          <span className="text-xs text-muted-foreground">{token.name}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {token.balance.toLocaleString("ru")} {token.symbol}
        </span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-white">${parseFloat(usd).toLocaleString("en")}</div>
        <div className={`text-xs font-medium ${token.change >= 0 ? "ticker-up" : "ticker-down"}`}>
          {token.change >= 0 ? "▲" : "▼"} {Math.abs(token.change)}%
        </div>
      </div>
    </div>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────

function TransactionRow({ tx, onClick }: { tx: Transaction; onClick: () => void }) {
  const typeConfig = {
    send: { icon: "ArrowUpRight", color: "#f72585", label: "Отправлено", bg: "rgba(247,37,133,0.1)" },
    receive: { icon: "ArrowDownLeft", color: "#10f97a", label: "Получено", bg: "rgba(16,249,122,0.1)" },
    swap: { icon: "RefreshCw", color: "#a78bfa", label: "Обмен", bg: "rgba(167,139,250,0.1)" },
    stake: { icon: "Layers", color: "#00d4ff", label: "Стейкинг", bg: "rgba(0,212,255,0.1)" },
  };
  const cfg = typeConfig[tx.type];
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl glass card-hover cursor-pointer mb-2" onClick={onClick}>
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

// ─── Portfolio Page ───────────────────────────────────────────────────────────

function PortfolioPage({ tokens, onSend, onReceive, onRefresh, onSendToken }:
  { tokens: Token[]; onSend: () => void; onReceive: () => void; onRefresh: () => void; onSendToken: (sym: string) => void }) {
  return (
    <div className="animate-fade-in">
      <BalanceCard tokens={tokens} onSend={onSend} onReceive={onReceive} onRefresh={onRefresh} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Активы</span>
        <span className="text-xs text-cyan-400 font-mono">{tokens.length} токенов</span>
      </div>
      {tokens.map((t, i) => <TokenRow key={t.symbol} token={t} index={i} onSend={onSendToken} />)}
    </div>
  );
}

// ─── Send Page ────────────────────────────────────────────────────────────────

function SendPage({ tokens, addTx, toast, initialToken }: {
  tokens: Token[];
  addTx: (tx: Transaction) => void;
  toast: (msg: string, type?: Toast["type"]) => void;
  initialToken?: string;
}) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(initialToken || "TON");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const token = tokens.find(t => t.symbol === selectedToken)!;
  const usdValue = amount ? (parseFloat(amount) * (RATES[selectedToken] || 1)).toFixed(2) : "0.00";

  const setMax = () => setAmount(token.balance.toString());

  const pasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
      toast("Адрес вставлен из буфера", "success");
    } catch {
      toast("Нет доступа к буферу обмена", "error");
    }
  };

  const handleSend = () => {
    if (!address.trim()) { toast("Введите адрес получателя", "error"); return; }
    if (!amount || parseFloat(amount) <= 0) { toast("Введите сумму", "error"); return; }
    if (parseFloat(amount) > token.balance) { toast("Недостаточно средств", "error"); return; }
    if (address.length < 10) { toast("Некорректный адрес", "error"); return; }

    setLoading(true);
    setTimeout(() => {
      addTx({
        id: Date.now().toString(),
        type: "send",
        amount: `-${amount}`,
        symbol: selectedToken,
        to: address.slice(0, 8) + "..." + address.slice(-4),
        date: now(),
        status: "pending",
        usd: `-$${usdValue}`,
      });
      setLoading(false);
      setSent(true);
      toast(`Отправлено ${amount} ${selectedToken}`, "success");
      setTimeout(() => { setSent(false); setAddress(""); setAmount(""); }, 2500);
    }, 1500);
  };

  if (sent) return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: "rgba(16,249,122,0.1)", border: "2px solid rgba(16,249,122,0.4)" }}>✅</div>
      <p className="font-display text-xl font-bold text-white">Транзакция отправлена!</p>
      <p className="text-sm text-muted-foreground text-center">
        {amount} {selectedToken} → {address.slice(0, 8)}...
      </p>
      <p className="text-xs text-yellow-400">Ожидает подтверждения сети</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-5">Отправить</h2>
      <div className="glass rounded-2xl p-4 mb-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Токен</label>
        <div className="flex gap-2 flex-wrap">
          {tokens.map(t => (
            <button key={t.symbol} onClick={() => { setSelectedToken(t.symbol); setAmount(""); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedToken === t.symbol ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40" : "btn-ghost text-muted-foreground"}`}>
              {t.icon} {t.symbol}
            </button>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-3">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Адрес получателя</label>
        <div className="flex gap-2">
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="UQ... или TON-адрес"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground font-mono outline-none focus:border-cyan-400/50 transition-colors" />
          <button className="btn-ghost px-3 rounded-xl" title="Сканировать QR">
            <Icon name="Scan" size={16} className="text-cyan-400" />
          </button>
          <button className="btn-ghost px-3 rounded-xl" onClick={pasteAddress} title="Вставить из буфера">
            <Icon name="Clipboard" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 mb-4">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Сумма</label>
        <div className="flex items-center gap-3">
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" type="number" min="0"
            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/20 font-mono" />
          <span className="text-muted-foreground font-semibold">{selectedToken}</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">≈ ${usdValue} USD</span>
          <button className="text-xs text-cyan-400 font-medium" onClick={setMax}>Макс. {token.balance.toLocaleString("ru")}</button>
        </div>
      </div>
      <div className="glass rounded-xl p-3 mb-4 flex items-center gap-3">
        <Icon name="Zap" size={14} className="text-yellow-400 flex-shrink-0" />
        <div><span className="text-xs text-muted-foreground">Комиссия сети: </span><span className="text-xs text-white font-medium font-mono">~0.0055 TON</span></div>
      </div>
      <button onClick={handleSend} disabled={loading}
        className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
        {loading
          ? <><Icon name="Loader" size={18} className="animate-spin" />Отправляем...</>
          : <><Icon name="ArrowUpRight" size={18} />Подтвердить отправку</>}
      </button>
      <p className="text-xs text-muted-foreground text-center mt-3">Дважды проверьте адрес — транзакции необратимы</p>
    </div>
  );
}

// ─── Receive Page ─────────────────────────────────────────────────────────────

function ReceivePage({ toast }: { toast: (msg: string, type?: Toast["type"]) => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS).then(() => {
      setCopied(true);
      toast("Адрес скопирован в буфер обмена", "success");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareAddress = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Мой TON адрес", text: WALLET_ADDRESS });
    } else {
      copy();
    }
  };

  return (
    <div className="animate-fade-in text-center">
      <h2 className="font-display text-xl font-bold text-white mb-2">Получить</h2>
      <p className="text-sm text-muted-foreground mb-6">Отправьте адрес или QR-код отправителю</p>
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
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full" style={{ background: "#10f97a", boxShadow: "0 0 10px #10f97a" }} />
        </div>
      </div>
      <div className="glass rounded-xl p-4 mb-3">
        <p className="text-xs text-muted-foreground mb-2">Адрес кошелька TON</p>
        <p className="font-mono text-sm text-white break-all leading-relaxed mb-3">{WALLET_ADDRESS}</p>
        <div className="flex gap-2">
          <button onClick={copy}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${copied ? "bg-neon-green/20 text-neon-green border border-neon-green/40" : "btn-primary"}`}>
            <Icon name={copied ? "Check" : "Copy"} size={15} />
            {copied ? "Скопировано!" : "Копировать"}
          </button>
          <button onClick={shareAddress} className="btn-ghost px-4 rounded-xl flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Share2" size={15} />
            Поделиться
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {["TON", "USDT", "NOT", "DOGS"].map(sym => (
          <button key={sym} onClick={() => { navigator.clipboard.writeText(WALLET_ADDRESS); toast(`Адрес для ${sym} скопирован`, "success"); }}
            className="glass rounded-xl p-3 text-sm font-medium text-muted-foreground btn-ghost flex items-center gap-2">
            <span>{INITIAL_TOKENS.find(t => t.symbol === sym)?.icon}</span>
            <span>Получить {sym}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Staking Page ─────────────────────────────────────────────────────────────

function StakingPage({ toast }: { toast: (msg: string, type?: Toast["type"]) => void }) {
  const [staked, setStaked] = useState(500);
  const [rewards, setRewards] = useState(26);
  const [stakeInput, setStakeInput] = useState("");
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const pools = [
    { name: "TON Whales", apy: "5.2%", minStake: "50 TON", tvl: "42M TON", badge: "🔒 Безопасный", color: "#00d4ff" },
    { name: "TON Nominators", apy: "4.8%", minStake: "10 001 TON", tvl: "120M TON", badge: "⚡ Максимальный TVL", color: "#a78bfa" },
    { name: "TON Liquid", apy: "6.1%", minStake: "1 TON", tvl: "18M TON", badge: "🔥 Высокий APY", color: "#f72585" },
  ];

  const handleStake = () => {
    const val = parseFloat(stakeInput);
    if (!val || val <= 0) { toast("Введите сумму стейкинга", "error"); return; }
    if (val < 50) { toast("Минимум 50 TON для стейкинга", "error"); return; }
    setStaked(s => s + val);
    toast(`+${val} TON застейкано`, "success");
    setStakeInput(""); setShowStakeModal(false);
  };

  const handleWithdraw = () => {
    if (rewards <= 0) { toast("Нет наград для вывода", "error"); return; }
    setWithdrawing(true);
    setTimeout(() => {
      toast(`+${rewards} TON награды выведены в кошелёк`, "success");
      setRewards(0);
      setWithdrawing(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-1">Стейкинг</h2>
      <p className="text-sm text-muted-foreground mb-5">Зарабатывайте пассивный доход от валидации сети</p>

      {showStakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 animate-scale-in">
            <h3 className="font-display text-lg font-bold text-white mb-4">Застейкать TON</h3>
            <div className="glass rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <input value={stakeInput} onChange={e => setStakeInput(e.target.value)} placeholder="0.00" type="number"
                  className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/20 font-mono" autoFocus />
                <span className="text-muted-foreground font-semibold">TON</span>
              </div>
              <button className="text-xs text-cyan-400 mt-2" onClick={() => setStakeInput("1247.83")}>Макс. 1 247.83</button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowStakeModal(false)} className="flex-1 btn-ghost py-3 rounded-xl text-sm font-semibold text-muted-foreground">Отмена</button>
              <button onClick={handleStake} className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">Застейкать</button>
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex gap-6">
          <div><p className="text-xs text-muted-foreground mb-1">Застейкано</p><p className="font-display text-2xl font-bold gradient-text">{staked} TON</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Награды</p><p className="font-display text-2xl font-bold ticker-up">+{rewards} TON</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">APY</p><p className="font-display text-2xl font-bold text-cyan-400">5.2%</p></div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex gap-3">
          <button onClick={() => setShowStakeModal(true)} className="btn-primary flex-1 py-2 rounded-xl text-sm font-semibold">Стейкнуть ещё</button>
          <button onClick={handleWithdraw} disabled={withdrawing || rewards === 0}
            className="btn-ghost flex-1 py-2 rounded-xl text-sm font-semibold text-muted-foreground disabled:opacity-40">
            {withdrawing ? "Вывод..." : `Забрать ${rewards} TON`}
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Пулы</p>
      {pools.map((pool, i) => (
        <div key={pool.name} onClick={() => toast(`Стейкинг в ${pool.name}: APY ${pool.apy}. Минимум ${pool.minStake}`, "info")}
          className={`glass card-hover rounded-2xl p-4 mb-3 cursor-pointer animate-fade-in-up stagger-${i + 1}`}>
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

// ─── NFT Page ─────────────────────────────────────────────────────────────────

function NFTPage({ nfts, setNfts, toast }: {
  nfts: NFT[];
  setNfts: (nfts: NFT[]) => void;
  toast: (msg: string, type?: Toast["type"]) => void;
}) {
  const [selected, setSelected] = useState<NFT | null>(null);
  const [transferAddr, setTransferAddr] = useState("");
  const [transferMode, setTransferMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTransfer = () => {
    if (!transferAddr.trim() || transferAddr.length < 8) { toast("Введите адрес получателя", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      setNfts(nfts.filter(n => n.id !== selected!.id));
      toast(`NFT "${selected!.name}" передан`, "success");
      setSelected(null); setTransferAddr(""); setTransferMode(false); setLoading(false);
    }, 1500);
  };

  const handleSell = () => {
    toast(`Открываем "${selected!.name}" на Getgems.io...`, "info");
    setSelected(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">NFT Коллекция</h2>
        <span className="glass px-3 py-1.5 rounded-full text-xs text-cyan-400 font-mono">{nfts.length} шт.</span>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-white">{selected.name}</h3>
              <button onClick={() => { setSelected(null); setTransferMode(false); setTransferAddr(""); }} className="btn-ghost p-2 rounded-xl">
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
            {transferMode ? (
              <div className="mb-4">
                <input value={transferAddr} onChange={e => setTransferAddr(e.target.value)} placeholder="Адрес получателя UQ..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground font-mono outline-none focus:border-cyan-400/50 mb-3" autoFocus />
                <div className="flex gap-3">
                  <button onClick={() => { setTransferMode(false); setTransferAddr(""); }} className="flex-1 btn-ghost py-3 rounded-xl text-sm text-muted-foreground">Отмена</button>
                  <button onClick={handleTransfer} disabled={loading} className="flex-1 btn-primary py-3 rounded-xl font-semibold text-sm">
                    {loading ? "Передаём..." : "Передать"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setTransferMode(true)} className="flex-1 btn-primary py-3 rounded-xl font-semibold text-sm">Передать</button>
                <button onClick={handleSell} className="flex-1 btn-ghost py-3 rounded-xl font-semibold text-sm text-muted-foreground">Продать</button>
              </div>
            )}
          </div>
        </div>
      )}

      {nfts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-sm">NFT коллекция пуста</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {nfts.map((nft, i) => (
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
      )}
    </div>
  );
}

// ─── Swap Page ────────────────────────────────────────────────────────────────

function SwapPage({ tokens, addTx, toast }: {
  tokens: Token[];
  addTx: (tx: Transaction) => void;
  toast: (msg: string, type?: Toast["type"]) => void;
}) {
  const [fromToken, setFromToken] = useState("TON");
  const [toToken, setToToken] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [loading, setLoading] = useState(false);

  const fromT = tokens.find(t => t.symbol === fromToken)!;
  const toT = tokens.find(t => t.symbol === toToken)!;
  const rate = fromT && toT ? fromT.usdRate / toT.usdRate : 1;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate * 0.997).toFixed(4) : "0.00";

  const swapTokens = () => {
    const tmp = fromToken;
    setFromToken(toToken);
    setToToken(tmp);
    setFromAmount("");
  };

  const setMax = () => setFromAmount(fromT.balance.toString());

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) { toast("Введите сумму обмена", "error"); return; }
    if (parseFloat(fromAmount) > fromT.balance) { toast("Недостаточно средств", "error"); return; }
    if (fromToken === toToken) { toast("Выберите разные токены", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      addTx({
        id: Date.now().toString(),
        type: "swap",
        amount: `-${fromAmount} ${fromToken}`,
        symbol: toToken,
        to: `+${toAmount} ${toToken}`,
        date: now(),
        status: "confirmed",
        usd: `$${(parseFloat(fromAmount) * fromT.usdRate).toFixed(2)}`,
      });
      toast(`Обменяно ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`, "success");
      setFromAmount("");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-bold text-white">Обмен</h2>
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot" />
          <span className="text-xs font-medium" style={{ color: "#10f97a" }}>STON.fi DEX</span>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 mb-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Отдаю</label>
        <div className="flex items-center gap-3">
          <select value={fromToken} onChange={e => { setFromToken(e.target.value); setFromAmount(""); }}
            className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white text-sm font-semibold outline-none">
            {tokens.map(t => <option key={t.symbol} value={t.symbol} style={{ background: "#0d1117" }}>{t.icon} {t.symbol}</option>)}
          </select>
          <input value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0.00" type="number"
            className="flex-1 bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/20 font-mono text-right" />
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">
            Баланс: {fromT?.balance.toLocaleString("ru")} {fromToken}
          </span>
          <button className="text-xs text-cyan-400 font-medium" onClick={setMax}>Макс.</button>
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
            {tokens.map(t => <option key={t.symbol} value={t.symbol} style={{ background: "#0d1117" }}>{t.icon} {t.symbol}</option>)}
          </select>
          <div className="flex-1 text-right">
            <span className="text-xl font-bold font-mono text-cyan-400">{toAmount}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">
            1 {fromToken} ≈ {rate.toFixed(4)} {toToken}
          </span>
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

      <button onClick={handleSwap} disabled={loading}
        className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
        {loading
          ? <><Icon name="Loader" size={18} className="animate-spin" />Обмениваем...</>
          : <><Icon name="Zap" size={18} />Обменять через STON.fi</>}
      </button>
    </div>
  );
}

// ─── History Page ─────────────────────────────────────────────────────────────

function HistoryPage({ transactions, toast }: {
  transactions: Transaction[];
  toast: (msg: string, type?: Toast["type"]) => void;
}) {
  const [filter, setFilter] = useState<"all" | "send" | "receive" | "swap" | "stake">("all");
  const [detail, setDetail] = useState<Transaction | null>(null);
  const filtered = filter === "all" ? transactions : transactions.filter(tx => tx.type === filter);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-4">История</h2>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-white">Детали транзакции</h3>
              <button onClick={() => setDetail(null)} className="btn-ghost p-2 rounded-xl">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ["Тип", detail.type === "send" ? "Отправка" : detail.type === "receive" ? "Получение" : detail.type === "swap" ? "Обмен" : "Стейкинг"],
                ["Сумма", `${detail.amount} ${detail.symbol}`],
                ["USD", detail.usd],
                ["Статус", detail.status === "confirmed" ? "✅ Подтверждено" : "⏳ Ожидание"],
                ["Дата", detail.date],
                ...(detail.to ? [["Получатель", detail.to]] : []),
                ...(detail.from ? [["Отправитель", detail.from]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start glass rounded-xl p-3">
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="text-xs text-white font-mono text-right max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(detail.id); toast("ID скопирован", "success"); }}
              className="w-full btn-ghost py-2.5 rounded-xl text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <Icon name="Copy" size={13} />Скопировать ID транзакции
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {([["all", "Все"], ["receive", "Входящие"], ["send", "Исходящие"], ["swap", "Обмены"], ["stake", "Стейкинг"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === key ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40" : "btn-ghost text-muted-foreground"}`}>
            {label}
          </button>
        ))}
      </div>
      {filtered.map(tx => <TransactionRow key={tx.id} tx={tx} onClick={() => setDetail(tx)} />)}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="Inbox" size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Транзакций нет</p>
        </div>
      )}
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage({ toast, onReset }: { toast: (msg: string, type?: Toast["type"]) => void; onReset: () => void }) {
  const [biometric, setBiometric] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [network, setNetwork] = useState("mainnet");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPhraseModal, setShowPhraseModal] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? "bg-cyan-400" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  const verifyPin = (onSuccess: () => void) => {
    if (pinInput === "1234") { onSuccess(); setPinInput(""); }
    else { toast("Неверный PIN-код", "error"); setPinInput(""); }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-white mb-5">Настройки</h2>

      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 animate-scale-in">
            <h3 className="font-display text-lg font-bold text-white mb-2">Двухфакторная аутентификация</h3>
            <p className="text-sm text-muted-foreground mb-4">{twoFA ? "Отключить 2FA?" : "Включить 2FA?"} Введите PIN: <span className="text-white font-mono">1234</span></p>
            <input value={pinInput} onChange={e => setPinInput(e.target.value)} placeholder="PIN-код" type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-cyan-400/50 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setShow2FAModal(false); setPinInput(""); }} className="flex-1 btn-ghost py-3 rounded-xl text-sm text-muted-foreground">Отмена</button>
              <button onClick={() => verifyPin(() => { setTwoFA(!twoFA); setShow2FAModal(false); toast(`2FA ${twoFA ? "отключена" : "включена"}`, "success"); })}
                className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold">Подтвердить</button>
            </div>
          </div>
        </div>
      )}

      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 animate-scale-in">
            <h3 className="font-display text-lg font-bold text-white mb-2">Приватный ключ</h3>
            <div className="glass rounded-xl p-3 mb-4">
              <p className="font-mono text-xs text-yellow-400 break-all">3a8f9d2e1b4c7f6a0e5d8c3b2a1f4e7d9c6b3a0f5e2d8c1b4a7f0e3d6c9b2a5f8</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { navigator.clipboard.writeText("3a8f9d2e1b4c7f6a0e5d8c3b2a1f4e7d9c6b3a0f5e2d8c1b4a7f0e3d6c9b2a5f8"); toast("Ключ скопирован", "success"); }}
                className="flex-1 btn-ghost py-2.5 rounded-xl text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Icon name="Copy" size={14} />Скопировать
              </button>
              <button onClick={() => setShowKeyModal(false)} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {showPhraseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 animate-scale-in">
            <h3 className="font-display text-lg font-bold text-white mb-4">Сид-фраза (24 слова)</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {["apple","zebra","ocean","flame","castle","dragon","mirror","thunder","crystal","shadow","volcano","river","forest","desert","mountain","cloud","lightning","stone","valley","bridge","garden","tower","moon","star"].map((w, i) => (
                <div key={i} className="glass rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground w-4 text-right">{i+1}.</span>
                  <span className="text-xs text-white font-mono">{w}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPhraseModal(false)} className="w-full btn-primary py-3 rounded-xl text-sm font-semibold">Записал, закрыть</button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-1">Безопасность</p>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Fingerprint" fallback="Circle" size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Face ID / Touch ID</p>
              <p className="text-xs text-muted-foreground">Биометрическая аутентификация</p>
            </div>
            <Toggle value={biometric} onChange={() => { setBiometric(!biometric); toast(`Биометрия ${!biometric ? "включена" : "отключена"}`, "success"); }} />
          </div>
          <div className="flex items-center gap-3 p-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" fallback="Circle" size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">2FA аутентификация</p>
              <p className="text-xs text-muted-foreground">Двухфакторная защита</p>
            </div>
            <Toggle value={twoFA} onChange={() => setShow2FAModal(true)} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Bell" fallback="Circle" size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Уведомления</p>
              <p className="text-xs text-muted-foreground">Push-уведомления о транзакциях</p>
            </div>
            <Toggle value={notifications} onChange={() => { setNotifications(!notifications); toast(`Уведомления ${!notifications ? "включены" : "отключены"}`, "info"); }} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-1">Сеть</p>
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { id: "mainnet", label: "Mainnet", desc: "Основная сеть TON", dot: "#10f97a" },
            { id: "testnet", label: "Testnet", desc: "Тестовая сеть", dot: "#f72585" },
          ].map((n, i) => (
            <button key={n.id} onClick={() => { setNetwork(n.id); toast(`Переключено на ${n.label}`, "info"); }}
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
          <button onClick={() => setShowKeyModal(true)}
            className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Key" fallback="Circle" size={16} className="text-yellow-400" />
            </div>
            <span className="text-sm font-medium text-white flex-1">Экспорт приватного ключа</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
          <button onClick={() => setShowPhraseModal(true)}
            className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-violet-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="FileText" fallback="Circle" size={16} className="text-violet-400" />
            </div>
            <span className="text-sm font-medium text-white flex-1">Фраза восстановления (24 слова)</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
          <button onClick={() => toast("Управление dApps — скоро", "info")}
            className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Link" fallback="Circle" size={16} className="text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-white flex-1">Подключённые dApps</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 px-1">Данные</p>
        <div className="glass rounded-2xl overflow-hidden">
          <button onClick={() => { onReset(); toast("Данные сброшены до начальных", "info"); }}
            className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5">
            <div className="w-9 h-9 rounded-xl bg-orange-400/10 flex items-center justify-center flex-shrink-0">
              <Icon name="RotateCcw" fallback="Circle" size={16} className="text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Сбросить данные</p>
              <p className="text-xs text-muted-foreground">Вернуть демо-состояние кошелька</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <button onClick={() => toast("Вы вышли из кошелька (демо)", "info")}
        className="w-full btn-ghost py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-destructive border border-destructive/30">
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
  const [tab, setTab] = useLocalStorage<Tab>("tk_tab", "portfolio");
  const [loaded, setLoaded] = useState(false);
  const [tokens, setTokens] = useLocalStorage<Token[]>("tk_tokens", INITIAL_TOKENS);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("tk_txs", INITIAL_TRANSACTIONS);
  const [nfts, setNfts] = useLocalStorage<NFT[]>("tk_nfts", INITIAL_NFTS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sendToken, setSendToken] = useState<string | undefined>();
  const [showNotifs, setShowNotifs] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Метка "сохранено" при каждом изменении данных
  useEffect(() => {
    if (!loaded) return;
    setLastSaved(new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }));
  }, [tokens, transactions, nfts, loaded]);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const addTx = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);

  const handleRefresh = () => {
    toast("Баланс обновлён ✓", "success");
  };

  const handleReset = () => {
    setTokens(INITIAL_TOKENS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNfts(INITIAL_NFTS);
    setTab("portfolio");
  };

  const handleSendToken = (sym: string) => {
    setSendToken(sym);
    setTab("send");
  };

  const unread = transactions.filter(t => t.status === "pending").length;

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className={`w-full max-w-sm flex flex-col transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ minHeight: "100svh" }}>

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
            {lastSaved && (
              <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                <Icon name="Save" size={10} className="text-cyan-400/60" />
                {lastSaved}
              </span>
            )}
            <div className="flex items-center gap-1.5 glass px-2.5 py-1.5 rounded-full">
              <span className="pulse-dot" />
              <span className="text-xs font-medium" style={{ color: "#10f97a" }}>Mainnet</span>
            </div>
            <button className="btn-ghost p-2 rounded-xl relative" onClick={() => { setShowNotifs(!showNotifs); }}>
              <Icon name="Bell" size={16} className={unread > 0 ? "text-cyan-400" : "text-muted-foreground"} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#f72585" }} />
              )}
            </button>
          </div>
        </div>

        {showNotifs && (
          <div className="mx-4 mb-3 glass-strong rounded-2xl p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Уведомления</span>
              <button onClick={() => setShowNotifs(false)}><Icon name="X" size={14} className="text-muted-foreground" /></button>
            </div>
            {transactions.filter(t => t.status === "pending").length > 0
              ? transactions.filter(t => t.status === "pending").map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <span className="text-yellow-400 text-sm">⏳</span>
                  <span className="text-xs text-white">{t.amount} {t.symbol} — ожидает подтверждения</span>
                </div>
              ))
              : <p className="text-xs text-muted-foreground">Нет новых уведомлений</p>
            }
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {tab === "portfolio" && (
            <PortfolioPage tokens={tokens} onSend={() => setTab("send")} onReceive={() => setTab("receive")}
              onRefresh={handleRefresh} onSendToken={handleSendToken} />
          )}
          {tab === "send" && (
            <SendPage tokens={tokens} addTx={addTx} toast={toast} initialToken={sendToken} />
          )}
          {tab === "receive" && <ReceivePage toast={toast} />}
          {tab === "staking" && <StakingPage toast={toast} />}
          {tab === "nft" && <NFTPage nfts={nfts} setNfts={setNfts} toast={toast} />}
          {tab === "swap" && <SwapPage tokens={tokens} addTx={addTx} toast={toast} />}
          {tab === "history" && <HistoryPage transactions={transactions} toast={toast} />}
          {tab === "settings" && <SettingsPage toast={toast} onReset={handleReset} />}
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