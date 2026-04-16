import { useState } from "react";

// DONNÉES MOCK
const RESTAURANTS = [
  { id: 1, nom: "Le Petit Dakar", cuisine: "Sénégalaise", note: 4.8, zone: "Centre", image: "🍲", description: "Spécialités locales authentiques" },
  { id: 2, nom: "Pizza Royale", cuisine: "Italienne", note: 4.5, zone: "Nord", image: "🍕", description: "Pizzas artisanales au feu de bois" },
  { id: 3, nom: "Wok Express", cuisine: "Asiatique", note: 4.3, zone: "Sud", image: "🥡", description: "Cuisine asiatique rapide et savoureuse" },
];

const PLATS = {
  1: [
    { id: 1, nom: "Thiéboudienne", prix: 3500, dispo: true, desc: "Riz au poisson traditionnel" },
    { id: 2, nom: "Yassa Poulet", prix: 2800, dispo: true, desc: "Poulet à la sauce yassa" },
    { id: 3, nom: "Mafé", prix: 2600, dispo: true, desc: "Ragoût à la pâte d'arachide" },
    { id: 4, nom: "Bissap", prix: 500, dispo: true, desc: "Jus d'hibiscus frais" },
  ],
  2: [
    { id: 5, nom: "Margherita", prix: 4200, dispo: true, desc: "Tomate, mozzarella, basilic" },
    { id: 6, nom: "Quatre Fromages", prix: 5500, dispo: true, desc: "Gorgonzola, parmesan, emmental, chèvre" },
    { id: 7, nom: "Calzone", prix: 4800, dispo: false, desc: "Pizza chausson jambon" },
  ],
  3: [
    { id: 8, nom: "Nouilles Sautées", prix: 3200, dispo: true, desc: "Nouilles aux légumes et crevettes" },
    { id: 9, nom: "Riz Cantonnais", prix: 2900, dispo: true, desc: "Riz sauté à l'oeuf" },
    { id: 10, nom: "Nems (6 pcs)", prix: 2200, dispo: true, desc: "Rouleaux frits au porc" },
  ],
};

const COMMANDES_INITIALES = [
  { id: "CMD-001", client: "Fatou Diallo", restaurant: "Le Petit Dakar", plats: ["Thiéboudienne", "Bissap"], total: 4000, statut: "En attente", adresse: "12 Rue des Baobabs", heure: "12:34", livreur: null, zone: "Centre" },
  { id: "CMD-002", client: "Moussa Ndiaye", restaurant: "Pizza Royale", plats: ["Margherita", "Calzone"], total: 9000, statut: "En préparation", adresse: "45 Avenue Léopold", heure: "12:45", livreur: "Ibrahim Seck", zone: "Nord" },
  { id: "CMD-003", client: "Aïssatou Mbaye", restaurant: "Wok Express", plats: ["Nouilles Sautées", "Nems"], total: 5900, statut: "En cours de livraison", adresse: "8 Cité Keur Gorgui", heure: "13:02", livreur: "Cheikh Fall", zone: "Sud" },
  { id: "CMD-004", client: "Omar Sarr", restaurant: "Le Petit Dakar", plats: ["Yassa Poulet"], total: 2800, statut: "Livrée", adresse: "22 Rue Carnot", heure: "11:50", livreur: "Abdou Diop", zone: "Centre" },
  { id: "CMD-005", client: "Mariama Sy", restaurant: "Pizza Royale", plats: ["Quatre Fromages"], total: 5500, statut: "Validée", adresse: "3 Allée des Manguiers", heure: "13:15", livreur: null, zone: "Nord" },
];

const LIVREURS = [
  { id: 1, nom: "Ibrahim Seck", statut: "Disponible", missions: 4, gains: 18500, note: 4.7 },
  { id: 2, nom: "Cheikh Fall", statut: "En livraison", missions: 6, gains: 24000, note: 4.9 },
  { id: 3, nom: "Abdou Diop", statut: "Disponible", missions: 3, gains: 12000, note: 4.5 },
  { id: 4, nom: "Mamadou Koné", statut: "Hors ligne", missions: 0, gains: 0, note: 4.2 },
];

const ZONES = [
  { id: 1, nom: "Centre", tarif: 500 },
  { id: 2, nom: "Nord", tarif: 750 },
  { id: 3, nom: "Sud", tarif: 750 },
  { id: 4, nom: "Est", tarif: 1000 },
  { id: 5, nom: "Périphérie", tarif: 1500 },
];

const STATUT_COLORS = {
  "En attente": { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Validée": { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "En préparation": { bg: "#FEFCE8", text: "#A16207", dot: "#EAB308" },
  "Assignée": { bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
  "En cours de livraison": { bg: "#F0F9FF", text: "#0C4A6E", dot: "#0EA5E9" },
  "Livrée": { bg: "#F0FDF4", text: "#14532D", dot: "#16A34A" },
  "Annulée": { bg: "#FFF1F2", text: "#9F1239", dot: "#F43F5E" },
  "Incident signalé": { bg: "#FFF1F2", text: "#7F1D1D", dot: "#EF4444" },
};

// COMPOSANTS UTILITAIRES
const Badge = ({ statut }) => {
  const c = STATUT_COLORS[statut] || { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {statut}
    </span>
  );
};

const StarRating = ({ value = 0, onChange }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1,2,3,4,5].map(s => (
      <span key={s} onClick={() => onChange && onChange(s)}
        style={{ fontSize: 22, cursor: onChange ? "pointer" : "default", color: s <= value ? "#F59E0B" : "#D1D5DB" }}>★</span>
    ))}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 20, ...style }}>{children}</div>
);

const Btn = ({ children, onClick, color = "#FF6B35", outline = false, small = false, disabled = false, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : (disabled ? "#D1D5DB" : color),
    color: outline ? color : "#fff",
    border: `2px solid ${disabled ? "#D1D5DB" : color}`,
    borderRadius: 10,
    padding: small ? "6px 14px" : "10px 20px",
    fontSize: small ? 13 : 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
    ...style
  }}>{children}</button>
);

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", background: "#FAFAFA", outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B7280" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ message, type = "success" }) => {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, background: type === "success" ? "#10B981" : "#EF4444", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
};

// INTERFACE CLIENT
function ClientApp({ commandes, setCommandes, toast }) {
  const [page, setPage] = useState("accueil");
  const [restaurantId, setRestaurantId] = useState(null);
  const [panier, setPanier] = useState([]);
  const [adresse, setAdresse] = useState("");
  const [zone, setZone] = useState("Centre");
  const [modalPaiement, setModalPaiement] = useState(false);
  const [modalEval, setModalEval] = useState(null);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [modalSignal, setModalSignal] = useState(null);
  const [probleme, setProbleme] = useState("");

  const mesCommandes = commandes.filter(c => ["Fatou Diallo", "Moussa Ndiaye", "Aïssatou Mbaye"].includes(c.client));
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
  const platsResto = restaurantId ? PLATS[restaurantId] : [];
  const fraisLivraison = ZONES.find(z => z.nom === zone)?.tarif || 500;
  const sousTotal = panier.reduce((s, p) => s + p.prix * p.qte, 0);
  const total = sousTotal + fraisLivraison;

  const addToCart = (plat) => {
    setPanier(prev => {
      const existing = prev.find(p => p.id === plat.id);
      if (existing) return prev.map(p => p.id === plat.id ? { ...p, qte: p.qte + 1 } : p);
      return [...prev, { ...plat, qte: 1 }];
    });
  };

  const removeFromCart = (id) => setPanier(prev => {
    const item = prev.find(p => p.id === id);
    if (item.qte === 1) return prev.filter(p => p.id !== id);
    return prev.map(p => p.id === id ? { ...p, qte: p.qte - 1 } : p);
  });

  const passer = () => {
    if (!adresse) return toast("Veuillez entrer une adresse", "error");
    const newCmd = {
      id: `CMD-00${commandes.length + 1}`,
      client: "Fatou Diallo",
      restaurant: restaurant.nom,
      plats: panier.map(p => p.nom),
      total,
      statut: "En attente",
      adresse,
      heure: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
      livreur: null,
      zone,
    };
    setCommandes(prev => [newCmd, ...prev]);
    setPanier([]);
    setModalPaiement(false);
    setAdresse("");
    setPage("commandes");
    toast("Commande passée avec succès !");
  };

  const annuler = (id) => {
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: "Annulée" } : c));
    toast("Commande annulée");
  };

  const evaluer = (cmd) => {
    setCommandes(prev => prev.map(c => c.id === cmd.id ? { ...c, evalDone: true } : c));
    setModalEval(null);
    setNote(0);
    setCommentaire("");
    toast("Merci pour votre évaluation !");
  };

  const signaler = (cmd) => {
    setCommandes(prev => prev.map(c => c.id === cmd.id ? { ...c, statut: "Incident signalé" } : c));
    setModalSignal(null);
    setProbleme("");
    toast("Problème signalé à l'équipe");
  };

  const navItems = [
    { key: "accueil", icon: "🏠", label: "Accueil" },
    { key: "commandes", icon: "📦", label: "Mes commandes" },
    { key: "profil", icon: "👤", label: "Profil" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 420, margin: "0 auto", background: "#F8F7F5", minHeight: "100vh", position: "relative" }}>
      <div style={{ background: "#FF6B35", padding: "20px 20px 16px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>Bonjour 👋</p>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Fatou Diallo</h2>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>
            {panier.reduce((s, p) => s + p.qte, 0) > 0 ? `🛒 ${panier.reduce((s, p) => s + p.qte, 0)}` : "🛒 0"}
          </div>
        </div>
        {page === "accueil" && (
          <div style={{ marginTop: 14, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>🔍</span>
            <span style={{ fontSize: 14, opacity: 0.8 }}>Rechercher un restaurant...</span>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 16px 80px" }}>
        {page === "accueil" && !restaurantId && (
          <>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#1C1917" }}>Restaurants partenaires</h3>
            {RESTAURANTS.map(r => (
              <Card key={r.id} style={{ marginBottom: 12, cursor: "pointer", transition: "transform 0.15s" }}
                onClick={() => { setRestaurantId(r.id); setPage("menu"); }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 40 }}>{r.image}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800 }}>{r.nom}</h4>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B7280" }}>{r.description}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>⭐ {r.note}</span>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>📍 {r.zone}</span>
                    </div>
                  </div>
                  <span style={{ color: "#D1D5DB", fontSize: 20 }}>›</span>
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "menu" && restaurant && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button onClick={() => { setRestaurantId(null); setPage("accueil"); }}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>‹</button>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{restaurant.image} {restaurant.nom}</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{restaurant.cuisine}</p>
              </div>
            </div>
            {platsResto.map(plat => (
              <Card key={plat.id} style={{ marginBottom: 10, opacity: plat.dispo ? 1 : 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700 }}>{plat.nom}</h4>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6B7280" }}>{plat.desc}</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#FF6B35" }}>{plat.prix.toLocaleString()} FCFA</p>
                  </div>
                  {plat.dispo ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {panier.find(p => p.id === plat.id) && (
                        <>
                          <button onClick={() => removeFromCart(plat.id)}
                            style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #FF6B35", background: "#fff", color: "#FF6B35", fontWeight: 800, cursor: "pointer", fontSize: 16 }}>-</button>
                          <span style={{ fontWeight: 700, minWidth: 16, textAlign: "center" }}>{panier.find(p => p.id === plat.id)?.qte}</span>
                        </>
                      )}
                      <button onClick={() => addToCart(plat)}
                        style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#FF6B35", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 18 }}>+</button>
                    </div>
                  ) : <span style={{ fontSize: 12, color: "#9CA3AF" }}>Indisponible</span>}
                </div>
              </Card>
            ))}
            {panier.length > 0 && (
              <div style={{ position: "sticky", bottom: 70, background: "#1C1917", borderRadius: 14, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div>
                  <p style={{ margin: 0, color: "#9CA3AF", fontSize: 12 }}>{panier.reduce((s, p) => s + p.qte, 0)} article(s)</p>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 16 }}>{sousTotal.toLocaleString()} FCFA</p>
                </div>
                <Btn onClick={() => setModalPaiement(true)} color="#FF6B35">Commander →</Btn>
              </div>
            )}
          </>
        )}

        {page === "commandes" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800 }}>Mes commandes</h3>
            {mesCommandes.length === 0 && <p style={{ color: "#9CA3AF", textAlign: "center", marginTop: 40 }}>Aucune commande</p>}
            {mesCommandes.map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                  <Badge statut={cmd.statut} />
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{cmd.restaurant}</p>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9CA3AF" }}>{cmd.plats.join(", ")}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#FF6B35" }}>{cmd.total.toLocaleString()} FCFA</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["En attente", "Validée"].includes(cmd.statut) && (
                      <Btn small outline color="#EF4444" onClick={() => annuler(cmd.id)}>Annuler</Btn>
                    )}
                    {cmd.statut === "Livrée" && !cmd.evalDone && (
                      <Btn small color="#10B981" onClick={() => setModalEval(cmd)}>Évaluer</Btn>
                    )}
                    {["En cours de livraison", "En préparation"].includes(cmd.statut) && (
                      <Btn small outline color="#F97316" onClick={() => setModalSignal(cmd)}>Signaler</Btn>
                    )}
                  </div>
                </div>
                {cmd.livreur && (
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6B7280", background: "#F9FAFB", padding: "6px 10px", borderRadius: 8 }}>
                    🛵 Livreur : <strong>{cmd.livreur}</strong>
                  </p>
                )}
              </Card>
            ))}
          </>
        )}

        {page === "profil" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FF6B35", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: "#fff" }}>FD</div>
              <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>Fatou Diallo</h3>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>fatou.diallo@email.sn</p>
            </div>
            {[{ icon: "📦", label: "Mes commandes", val: mesCommandes.length }, { icon: "⭐", label: "Évaluations données", val: 3 }, { icon: "📍", label: "Adresses sauvegardées", val: 2 }].map((item, i) => (
              <Card key={i} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>{item.icon} {item.label}</span>
                <span style={{ fontWeight: 800, color: "#FF6B35" }}>{item.val}</span>
              </Card>
            ))}
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", padding: "8px 0" }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => { setPage(n.key); if (n.key !== "menu") setRestaurantId(null); }}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0" }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 11, fontWeight: page === n.key ? 800 : 500, color: page === n.key ? "#FF6B35" : "#9CA3AF" }}>{n.label}</span>
          </button>
        ))}
      </div>

      <Modal open={modalPaiement} onClose={() => setModalPaiement(false)} title="Finaliser la commande">
        <Input label="Adresse de livraison" value={adresse} onChange={setAdresse} placeholder="Ex: 12 Rue des Baobabs" />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Zone de livraison</label>
          <select value={zone} onChange={e => setZone(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit", background: "#FAFAFA" }}>
            {ZONES.map(z => <option key={z.id} value={z.nom}>{z.nom} — {z.tarif} FCFA</option>)}
          </select>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Sous-total</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{sousTotal.toLocaleString()} FCFA</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Frais de livraison ({zone})</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{fraisLivraison.toLocaleString()} FCFA</span>
          </div>
          <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 800 }}>Total</span>
            <span style={{ fontWeight: 800, color: "#FF6B35", fontSize: 16 }}>{total.toLocaleString()} FCFA</span>
          </div>
        </div>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#14532D" }}>
          💳 Paiement sécurisé via Stripe — Carte bancaire simulée
        </div>
        <Btn onClick={passer} style={{ width: "100%" }}>✓ Confirmer & Payer {total.toLocaleString()} FCFA</Btn>
      </Modal>

      <Modal open={!!modalEval} onClose={() => setModalEval(null)} title="Évaluer le livreur">
        {modalEval && (
          <>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>Livreur : <strong>{modalEval.livreur}</strong></p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Note (1 à 5 étoiles)</label>
              <StarRating value={note} onChange={setNote} />
            </div>
            <Input label="Commentaire (optionnel)" value={commentaire} onChange={setCommentaire} placeholder="Rapide, ponctuel..." />
            <Btn onClick={() => evaluer(modalEval)} disabled={!note} style={{ width: "100%" }} color="#10B981">Envoyer l'évaluation</Btn>
          </>
        )}
      </Modal>

      <Modal open={!!modalSignal} onClose={() => setModalSignal(null)} title="Signaler un problème">
        {modalSignal && (
          <>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>Commande : <strong>{modalSignal.id}</strong></p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Type de problème</label>
              {["Retard excessif", "Commande incorrecte", "Livreur injoignable", "Autre"].map(p => (
                <div key={p} onClick={() => setProbleme(p)}
                  style={{ marginTop: 8, padding: "10px 14px", borderRadius: 10, border: `2px solid ${probleme === p ? "#FF6B35" : "#E5E7EB"}`, cursor: "pointer", fontSize: 14, fontWeight: probleme === p ? 700 : 400 }}>{p}</div>
              ))}
            </div>
            <Btn onClick={() => signaler(modalSignal)} disabled={!probleme} style={{ width: "100%" }} color="#EF4444">Envoyer le signalement</Btn>
          </>
        )}
      </Modal>
    </div>
  );
}

// INTERFACE GÉRANT
function GerantApp({ commandes, setCommandes, toast }) {
  const [page, setPage] = useState("dashboard");
  const [modalAssign, setModalAssign] = useState(null);
  const [livreurChoisi, setLivreurChoisi] = useState(null);

  const cmdRestaurant = commandes.filter(c => c.restaurant === "Le Petit Dakar");
  const pending = cmdRestaurant.filter(c => c.statut === "En attente").length;
  const enCours = cmdRestaurant.filter(c => ["Validée", "En préparation", "Assignée", "En cours de livraison"].includes(c.statut)).length;

  const action = (id, newStatut) => {
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: newStatut } : c));
    toast(`Statut mis à jour : ${newStatut}`);
  };

  const assigner = (cmd) => {
    if (!livreurChoisi) return toast("Sélectionnez un livreur", "error");
    const lv = LIVREURS.find(l => l.id === livreurChoisi);
    setCommandes(prev => prev.map(c => c.id === cmd.id ? { ...c, statut: "Assignée", livreur: lv.nom } : c));
    setModalAssign(null);
    setLivreurChoisi(null);
    toast(`Commande assignée à ${lv.nom}`);
  };

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "commandes", icon: "📋", label: "Commandes" },
    { key: "historique", icon: "🕓", label: "Historique" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 800, margin: "0 auto", background: "#F8F7F5", minHeight: "100vh" }}>
      <div style={{ background: "#1C1917", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#A78BFA", fontWeight: 600 }}>ESPACE GÉRANT</p>
          <h2 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 800 }}>🍲 Le Petit Dakar</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {pending > 0 && (
            <span style={{ background: "#EF4444", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
              {pending} nouvelle{pending > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)}
            style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === n.key ? 800 : 500, color: page === n.key ? "#1C1917" : "#9CA3AF", borderBottom: `3px solid ${page === n.key ? "#FF6B35" : "transparent"}` }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {page === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "En attente", val: pending, color: "#F97316", icon: "⏳" },
                { label: "En cours", val: enCours, color: "#3B82F6", icon: "🔄" },
                { label: "Livrées auj.", val: cmdRestaurant.filter(c => c.statut === "Livrée").length, color: "#10B981", icon: "✅" },
              ].map((s, i) => (
                <Card key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                  <p style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{s.label}</p>
                </Card>
              ))}
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 800 }}>Nouvelles commandes</h3>
            {cmdRestaurant.filter(c => c.statut === "En attente").length === 0 && (
              <p style={{ color: "#9CA3AF", textAlign: "center", padding: 20 }}>Aucune nouvelle commande</p>
            )}
            {cmdRestaurant.filter(c => c.statut === "En attente").map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>👤 {cmd.client} — {cmd.heure}</p>
                    <p style={{ margin: "2px 0", fontSize: 13 }}>{cmd.plats.join(", ")}</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 800, color: "#FF6B35" }}>{cmd.total.toLocaleString()} FCFA</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Btn small color="#10B981" onClick={() => action(cmd.id, "Validée")}>✓ Valider</Btn>
                    <Btn small outline color="#EF4444" onClick={() => action(cmd.id, "Annulée")}>✕ Refuser</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "commandes" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Gestion des commandes</h3>
            {cmdRestaurant.filter(c => !["Livrée", "Annulée"].includes(c.statut)).map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800 }}>{cmd.id}</span>
                  <Badge statut={cmd.statut} />
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 13, color: "#374151" }}>👤 {cmd.client} — 📍 {cmd.adresse}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6B7280" }}>{cmd.plats.join(", ")}</p>
                {cmd.livreur && <p style={{ margin: "0 0 8px", fontSize: 13, background: "#F0FDF4", padding: "6px 10px", borderRadius: 8, color: "#166534" }}>🛵 {cmd.livreur}</p>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cmd.statut === "Validée" && <Btn small color="#F97316" onClick={() => action(cmd.id, "En préparation")}>Confirmer prépa</Btn>}
                  {cmd.statut === "En préparation" && <Btn small color="#3B82F6" onClick={() => setModalAssign(cmd)}>Assigner livreur</Btn>}
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "historique" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Historique complet</h3>
            {cmdRestaurant.map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>{cmd.client} — {cmd.heure}</p>
                    <p style={{ margin: "2px 0 0", fontWeight: 700, color: "#FF6B35" }}>{cmd.total.toLocaleString()} FCFA</p>
                  </div>
                  <Badge statut={cmd.statut} />
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal open={!!modalAssign} onClose={() => setModalAssign(null)} title="Assigner un livreur">
        {modalAssign && (
          <>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>Commande {modalAssign.id} — {modalAssign.adresse}</p>
            {LIVREURS.filter(l => l.statut === "Disponible").map(lv => (
              <div key={lv.id} onClick={() => setLivreurChoisi(lv.id)}
                style={{ padding: "12px 14px", borderRadius: 12, border: `2px solid ${livreurChoisi === lv.id ? "#FF6B35" : "#E5E7EB"}`, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>🛵 {lv.nom}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>⭐ {lv.note} — {lv.missions} missions</p>
                </div>
                <span style={{ fontSize: 12, background: "#F0FDF4", color: "#166534", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{lv.statut}</span>
              </div>
            ))}
            {LIVREURS.filter(l => l.statut === "Disponible").length === 0 && (
              <p style={{ color: "#9CA3AF", textAlign: "center" }}>Aucun livreur disponible</p>
            )}
            <Btn onClick={() => assigner(modalAssign)} disabled={!livreurChoisi} style={{ width: "100%", marginTop: 8 }}>Confirmer l'assignation</Btn>
          </>
        )}
      </Modal>
    </div>
  );
}

// INTERFACE LIVREUR

// INTERFACE LIVREUR
function LivreurApp({ commandes, setCommandes, toast }) {
  const [page, setPage] = useState("missions");
  const [modalIncident, setModalIncident] = useState(null);
  const [incident, setIncident] = useState("");

  const mesMissions = commandes.filter(c => c.livreur === "Ibrahim Seck");
  const actives = mesMissions.filter(c => ["Assignée", "En cours de livraison"].includes(c.statut));
  const terminees = mesMissions.filter(c => c.statut === "Livrée");

  const updateStatut = (id, s) => {
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: s } : c));
    toast(`Statut mis à jour : ${s}`);
  };

  const signalerIncident = (cmd) => {
    setCommandes(prev => prev.map(c => c.id === cmd.id ? { ...c, statut: "Incident signalé" } : c));
    setModalIncident(null);
    setIncident("");
    toast("Incident signalé au gérant");
  };

  const gains = terminees.length * 1500;

  const navItems = [
    { key: "missions", icon: "🛵", label: "Missions" },
    { key: "historique", icon: "📋", label: "Historique" },
    { key: "gains", icon: "💰", label: "Gains" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 480, margin: "0 auto", background: "#F8F7F5", minHeight: "100vh" }}>
      <div style={{ background: "#0F172A", padding: "20px 20px 16px", color: "#fff" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#38BDF8", fontWeight: 600 }}>ESPACE LIVREUR</p>
        <h2 style={{ margin: "2px 0 0", fontSize: 19, fontWeight: 800 }}>Ibrahim Seck</h2>
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <span style={{ background: "#10B981", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>● Disponible</span>
          <span style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12 }}>⭐ 4.7</span>
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)}
            style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: page === n.key ? 800 : 500, color: page === n.key ? "#0F172A" : "#9CA3AF", borderBottom: `3px solid ${page === n.key ? "#38BDF8" : "transparent"}` }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {page === "missions" && (
          <>
            {actives.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
                <div style={{ fontSize: 48 }}>🛵</div>
                <p>En attente de missions...</p>
              </div>
            )}
            {actives.map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 12, border: "2px solid #38BDF8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontWeight: 800 }}>{cmd.id}</span>
                  <Badge statut={cmd.statut} />
                </div>
                <div style={{ background: "#F0F9FF", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700 }}>📦 Récupérer chez : {cmd.restaurant}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 13 }}>📍 Livrer à : {cmd.adresse}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Zone : {cmd.zone}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {cmd.statut === "Assignée" && (
                    <>
                      <Btn small color="#38BDF8" onClick={() => updateStatut(cmd.id, "En cours de livraison")}>▶ Démarrer</Btn>
                      <Btn small outline color="#EF4444" onClick={() => updateStatut(cmd.id, "Annulée")}>Refuser</Btn>
                    </>
                  )}
                  {cmd.statut === "En cours de livraison" && (
                    <>
                      <Btn small color="#10B981" onClick={() => updateStatut(cmd.id, "Livrée")}>✓ Livré</Btn>
                      <Btn small outline color="#EF4444" onClick={() => setModalIncident(cmd)}>⚠ Incident</Btn>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "historique" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Mes missions terminées</h3>
            {terminees.length === 0 && <p style={{ color: "#9CA3AF", textAlign: "center", padding: 20 }}>Aucune mission terminée</p>}
            {terminees.map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>{cmd.adresse}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#10B981" }}>+1 500 FCFA</p>
                  </div>
                  <Badge statut={cmd.statut} />
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "gains" && (
          <>
            <Card style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)", color: "#fff", marginBottom: 16, textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#94A3B8" }}>Gains du mois</p>
              <p style={{ margin: "0 0 4px", fontSize: 36, fontWeight: 900 }}>{gains.toLocaleString()}</p>
              <p style={{ margin: 0, color: "#38BDF8", fontWeight: 600 }}>FCFA</p>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Missions totales", val: mesMissions.length, icon: "🛵" },
                { label: "Livrées", val: terminees.length, icon: "✅" },
                { label: "Note moyenne", val: "4.7 ⭐", icon: "⭐" },
                { label: "Km parcourus", val: "42 km", icon: "📍" },
              ].map((s, i) => (
                <Card key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <p style={{ margin: "4px 0 2px", fontWeight: 800, fontSize: 16 }}>{s.val}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{s.label}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={!!modalIncident} onClose={() => setModalIncident(null)} title="Signaler un incident">
        {modalIncident && (
          <>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>Commande : <strong>{modalIncident.id}</strong></p>
            {["Adresse introuvable", "Client absent", "Accident de parcours", "Colis endommagé", "Autre"].map(p => (
              <div key={p} onClick={() => setIncident(p)}
                style={{ padding: "10px 14px", borderRadius: 10, border: `2px solid ${incident === p ? "#EF4444" : "#E5E7EB"}`, marginBottom: 8, cursor: "pointer", fontSize: 14, fontWeight: incident === p ? 700 : 400 }}>{p}</div>
            ))}
            <Btn onClick={() => signalerIncident(modalIncident)} disabled={!incident} style={{ width: "100%", marginTop: 8 }} color="#EF4444">Envoyer le signalement</Btn>
          </>
        )}
      </Modal>
    </div>
  );
}
// INTERFACE ADMINISTRATEUR
function AdminApp({ commandes, setCommandes, toast }) {
  const [page, setPage] = useState("stats");
  const [modalZone, setModalZone] = useState(false);
  const [newZone, setNewZone] = useState({ nom: "", tarif: "" });
  const [zones, setZones] = useState(ZONES);
  const [livreurs, setLivreurs] = useState(LIVREURS);

  const totalCA = commandes.filter(c => c.statut === "Livrée").reduce((s, c) => s + c.total, 0);

  const toggleLivreur = (id) => {
    setLivreurs(prev => prev.map(l => l.id === id ? { ...l, statut: l.statut === "Hors ligne" ? "Disponible" : "Hors ligne" } : l));
    toast("Statut livreur mis à jour");
  };

  const addZone = () => {
    if (!newZone.nom || !newZone.tarif) return toast("Remplissez tous les champs", "error");
    setZones(prev => [...prev, { id: prev.length + 1, nom: newZone.nom, tarif: parseInt(newZone.tarif) }]);
    setNewZone({ nom: "", tarif: "" });
    setModalZone(false);
    toast("Zone ajoutée");
  };

  const navItems = [
    { key: "stats", icon: "📊", label: "Stats" },
    { key: "livreurs", icon: "🛵", label: "Livreurs" },
    { key: "commandes", icon: "📋", label: "Commandes" },
    { key: "zones", icon: "📍", label: "Zones" },
  ];

  const stats = [
    { label: "Total commandes", val: commandes.length, icon: "📦", color: "#6366F1" },
    { label: "Livrées", val: commandes.filter(c => c.statut === "Livrée").length, icon: "✅", color: "#10B981" },
    { label: "CA total", val: `${totalCA.toLocaleString()} F`, icon: "💰", color: "#F59E0B" },
    { label: "Incidents", val: commandes.filter(c => c.statut === "Incident signalé").length, icon: "⚠️", color: "#EF4444" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 900, margin: "0 auto", background: "#F1F5F9", minHeight: "100vh" }}>
      <div style={{ background: "#4F46E5", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#A5B4FC", fontWeight: 600 }}>PANNEAU ADMINISTRATEUR</p>
          <h2 style={{ margin: 0, color: "#fff", fontSize: 19, fontWeight: 800 }}>🏛️ LivraisonLocale — Admin</h2>
        </div>
        <span style={{ background: "#E0E7FF", color: "#4F46E5", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>Super Admin</span>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "2px solid #E5E7EB", overflowX: "auto" }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)}
            style={{ flex: 1, minWidth: 80, padding: "14px 8px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === n.key ? 800 : 500, color: page === n.key ? "#4F46E5" : "#9CA3AF", borderBottom: `3px solid ${page === n.key ? "#4F46E5" : "transparent"}` }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        {page === "stats" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
              {stats.map((s, i) => (
                <Card key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{s.label}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card>
              <h4 style={{ margin: "0 0 14px", fontWeight: 800 }}>Répartition des statuts</h4>
              {Object.keys(STATUT_COLORS).map(s => {
                const count = commandes.filter(c => c.statut === s).length;
                const pct = commandes.length > 0 ? (count / commandes.length) * 100 : 0;
                if (count === 0) return null;
                return (
                  <div key={s} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                      <span>{s}</span><strong>{count}</strong>
                    </div>
                    <div style={{ background: "#F3F4F6", borderRadius: 10, height: 8 }}>
                      <div style={{ width: `${pct}%`, background: STATUT_COLORS[s].dot, height: "100%", borderRadius: 10, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {page === "livreurs" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Gestion des livreurs</h3>
            {livreurs.map(lv => (
              <Card key={lv.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#4F46E5" }}>
                      {lv.nom.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{lv.nom}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>⭐ {lv.note} — {lv.missions} missions — {lv.gains.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                      background: lv.statut === "Disponible" ? "#F0FDF4" : lv.statut === "En livraison" ? "#EFF6FF" : "#F3F4F6",
                      color: lv.statut === "Disponible" ? "#166534" : lv.statut === "En livraison" ? "#1D4ED8" : "#6B7280" }}>
                      {lv.statut}
                    </span>
                    <Btn small outline color={lv.statut === "Hors ligne" ? "#10B981" : "#EF4444"}
                      onClick={() => toggleLivreur(lv.id)}>
                      {lv.statut === "Hors ligne" ? "Activer" : "Suspendre"}
                    </Btn>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "commandes" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>Toutes les commandes ({commandes.length})</h3>
            {commandes.map(cmd => (
              <Card key={cmd.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>👤 {cmd.client} · 🍽️ {cmd.restaurant}</p>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>📍 {cmd.adresse} · ⏰ {cmd.heure}</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 800, color: "#4F46E5" }}>{cmd.total.toLocaleString()} FCFA</p>
                  </div>
                  <Badge statut={cmd.statut} />
                </div>
              </Card>
            ))}
          </>
        )}

        {page === "zones" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Zones de livraison</h3>
              <Btn small color="#4F46E5" onClick={() => setModalZone(true)}>+ Ajouter</Btn>
            </div>
            {zones.map(z => (
              <Card key={z.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>📍 {z.nom}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>{commandes.filter(c => c.zone === z.nom).length} commandes</p>
                </div>
                <span style={{ fontWeight: 800, color: "#4F46E5", fontSize: 15 }}>{z.tarif.toLocaleString()} FCFA</span>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal open={modalZone} onClose={() => setModalZone(false)} title="Ajouter une zone">
        <Input label="Nom de la zone" value={newZone.nom} onChange={v => setNewZone(p => ({ ...p, nom: v }))} placeholder="Ex: Ouest" />
        <Input label="Tarif de livraison (FCFA)" type="number" value={newZone.tarif} onChange={v => setNewZone(p => ({ ...p, tarif: v }))} placeholder="Ex: 800" />
        <Btn onClick={addZone} style={{ width: "100%" }} color="#4F46E5">Ajouter la zone</Btn>
      </Modal>
    </div>
  );
}

// APP PRINCIPALE
export default function App() {
  const [role, setRole] = useState(null);
  const [commandes, setCommandes] = useState(COMMANDES_INITIALES);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const toast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const ROLES = [
    { key: "client", label: "Client", icon: "🧑", desc: "Commander des repas", color: "#FF6B35" },
    { key: "gerant", label: "Gérant", icon: "👨‍🍳", desc: "Gérer les commandes", color: "#8B5CF6" },
    { key: "livreur", label: "Livreur", icon: "🛵", desc: "Gérer mes missions", color: "#0EA5E9" },
    { key: "admin", label: "Administrateur", icon: "🏛️", desc: "Tableau de bord global", color: "#4F46E5" },
  ];

  if (!role) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 440, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🍽️</div>
            <h1 style={{ margin: 0, color: "#fff", fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px" }}>LivraisonLocale</h1>
            <p style={{ margin: "8px 0 0", color: "#A8A29E", fontSize: 15 }}>Plateforme de livraison de repas</p>
            <p style={{ margin: "12px 0 0", color: "#78716C", fontSize: 13 }}>Choisissez votre espace pour commencer</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ROLES.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)}
                style={{ background: "#fff", border: "none", borderRadius: 16, padding: "20px 16px", cursor: "pointer", textAlign: "center", transition: "transform 0.15s", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <div style={{ fontSize: 34, marginBottom: 8 }}>{r.icon}</div>
                <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 15, color: "#1C1917" }}>{r.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{r.desc}</p>
                <div style={{ marginTop: 10, background: r.color, borderRadius: 8, padding: "5px 0", color: "#fff", fontSize: 12, fontWeight: 700 }}>Accéder →</div>
              </button>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 20, color: "#57534E", fontSize: 12 }}>
            Version 1.0 · Laravel · SQLite · Stripe · Avril 2026
          </p>
        </div>
        <Toast message={toastMsg} type={toastType} />
      </div>
    );
  }

  return (
    <>
      <div style={{ position: "fixed", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", gap: 6 }}>
        <button onClick={() => setRole(null)}
          style={{ background: "rgba(0,0,0,0.75)", color: "#fff", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, backdropFilter: "blur(8px)" }}>
          ← Changer de rôle
        </button>
      </div>
      {role === "client" && <ClientApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      {role === "gerant" && <GerantApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      {role === "livreur" && <LivreurApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      {role === "admin" && <AdminApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      <Toast message={toastMsg} type={toastType} />
    </>
  );
}