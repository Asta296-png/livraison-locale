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

// INTERFACE CLIENT COMPLÈTE
function ClientApp({ commandes, setCommandes, toast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);
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
  const [searchTerm, setSearchTerm] = useState("");

  const restaurantsFiltres = RESTAURANTS.filter(r => 
    r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mesCommandes = commandes.filter(c => c.client === userName || c.client === "Fatou Diallo");
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
  const platsResto = restaurantId ? PLATS[restaurantId] : [];
  const fraisLivraison = ZONES.find(z => z.nom === zone)?.tarif || 500;
  const sousTotal = panier.reduce((s, p) => s + p.prix * p.qte, 0);
  const total = sousTotal + fraisLivraison;

  const handleRegister = () => {
    if (!registerName || !registerEmail || !registerPassword) {
      toast("Veuillez remplir tous les champs", "error");
      return;
    }
    setUserName(registerName);
    setUserEmail(registerEmail);
    setIsAuthenticated(true);
    toast(`Bienvenue ${registerName} !`);
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast("Veuillez remplir tous les champs", "error");
      return;
    }
    setUserName(loginEmail.split("@")[0]);
    setUserEmail(loginEmail);
    setIsAuthenticated(true);
    toast(`Bonjour ${loginEmail.split("@")[0]} !`);
  };

  const addToCart = (plat) => {
    setPanier(prev => {
      const existing = prev.find(p => p.id === plat.id);
      if (existing) {
        return prev.map(p => p.id === plat.id ? { ...p, qte: p.qte + 1 } : p);
      }
      return [...prev, { ...plat, qte: 1 }];
    });
    toast(`${plat.nom} ajouté au panier !`);
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
      client: userName,
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

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 24, padding: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <h2 style={{ margin: 0, color: "#1C1917" }}>LivraisonLocale</h2>
            <p style={{ color: "#6B7280", fontSize: 14 }}>{showLogin ? "Connectez-vous" : "Créez un compte"}</p>
          </div>
          {showLogin ? (
            <>
              <Input label="Email" value={loginEmail} onChange={setLoginEmail} type="email" placeholder="exemple@email.com" />
              <Input label="Mot de passe" value={loginPassword} onChange={setLoginPassword} type="password" placeholder="••••••••" />
              <Btn onClick={handleLogin} style={{ width: "100%", marginTop: 16 }}>Se connecter</Btn>
              <p style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
                Pas de compte ?{" "}
                <button onClick={() => setShowLogin(false)} style={{ background: "none", border: "none", color: "#FF6B35", fontWeight: 700, cursor: "pointer" }}>
                  S'inscrire
                </button>
              </p>
            </>
          ) : (
            <>
              <Input label="Nom complet" value={registerName} onChange={setRegisterName} placeholder="Jean Dupont" />
              <Input label="Email" value={registerEmail} onChange={setRegisterEmail} type="email" placeholder="exemple@email.com" />
              <Input label="Mot de passe" value={registerPassword} onChange={setRegisterPassword} type="password" placeholder="••••••••" />
              <Btn onClick={handleRegister} style={{ width: "100%", marginTop: 16 }}>S'inscrire</Btn>
              <p style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
                Déjà un compte ?{" "}
                <button onClick={() => setShowLogin(true)} style={{ background: "none", border: "none", color: "#FF6B35", fontWeight: 700, cursor: "pointer" }}>
                  Se connecter
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 420, margin: "0 auto", background: "#F8F7F5", minHeight: "100vh", position: "relative" }}>
      <div style={{ background: "#FF6B35", padding: "20px 20px 16px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>Bonjour 👋</p>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{userName}</h2>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>
            {panier.reduce((s, p) => s + p.qte, 0) > 0 ? `🛒 ${panier.reduce((s, p) => s + p.qte, 0)}` : "🛒 0"}
          </div>
        </div>
        {page === "accueil" && (
          <div style={{ marginTop: 14, background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher un restaurant..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#fff", fontSize: 14, width: "100%", outline: "none" }}
            />
          </div>
        )}
      </div>

      <div style={{ padding: "16px 16px 80px" }}>
        {/* AFFICHAGE DES RESTAURANTS */}
        {page === "accueil" && !restaurantId && (
          <>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#1C1917" }}>
              {searchTerm ? "Résultats de recherche" : "Restaurants partenaires"}
            </h3>
            {restaurantsFiltres.length === 0 && (
              <p style={{ textAlign: "center", color: "#9CA3AF", marginTop: 40 }}>Aucun restaurant trouvé</p>
            )}
            {restaurantsFiltres.map(r => (
              <div 
                key={r.id} 
                onClick={() => {
                  console.log("🖱️ CLIC sur", r.nom);
                  setRestaurantId(r.id);
                  setPage("menu");
                }}
                style={{ 
                  cursor: "pointer", 
                  background: "#fff", 
                  borderRadius: 16, 
                  border: "1px solid #E5E7EB", 
                  padding: 20, 
                  marginBottom: 12,
                  transition: "transform 0.15s"
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 48 }}>{r.image}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800 }}>{r.nom}</h4>
                    <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B7280" }}>{r.description}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>⭐ {r.note}</span>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>📍 {r.zone}</span>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>🍽️ {r.cuisine}</span>
                    </div>
                  </div>
                  <span style={{ color: "#D1D5DB", fontSize: 20 }}>›</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* AFFICHAGE DU MENU QUAND ON CLIQUE SUR UN RESTAURANT */}
        {page === "menu" && restaurant && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button 
                onClick={() => { 
                  console.log("◀️ Retour à l'accueil");
                  setRestaurantId(null); 
                  setPage("accueil"); 
                  setSearchTerm(""); 
                }}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}
              >
                ‹
              </button>
              <div>
                <div style={{ fontSize: 48 }}>{restaurant.image}</div>
                <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 800 }}>{restaurant.nom}</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{restaurant.cuisine} • ⭐ {restaurant.note}</p>
              </div>
            </div>

            <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>🍽️ Menu du jour</h4>
            {platsResto.map(plat => (
              <div key={plat.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 20, marginBottom: 12, opacity: plat.dispo ? 1 : 0.5 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ fontSize: 48, background: "#F3F4F6", borderRadius: 12, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {plat.nom === "Thiéboudienne" && "🍲"}
                    {plat.nom === "Yassa Poulet" && "🍗"}
                    {plat.nom === "Mafé" && "🥜"}
                    {plat.nom === "Bissap" && "🥤"}
                    {plat.nom === "Margherita" && "🍕"}
                    {plat.nom === "Quatre Fromages" && "🧀"}
                    {plat.nom === "Calzone" && "🥟"}
                    {plat.nom === "Nouilles Sautées" && "🍜"}
                    {plat.nom === "Riz Cantonnais" && "🍚"}
                    {plat.nom === "Nems (6 pcs)" && "🥠"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700 }}>{plat.nom}</h4>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#FF6B35" }}>{plat.prix.toLocaleString()} FCFA</p>
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6B7280" }}>{plat.desc}</p>
                    {plat.dispo ? (
                      <button onClick={() => addToCart(plat)} style={{ background: "#FF6B35", color: "#fff", border: "none", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        + Ajouter au panier
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: "#EF4444" }}>⚠️ Indisponible</span>
                    )}
                  </div>
                </div>
              </div>
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

        {/* MES COMMANDES */}
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

        {/* PROFIL */}
        {page === "profil" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FF6B35", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: "#fff" }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>{userName}</h3>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>{userEmail}</p>
            </div>
            {[{ icon: "📦", label: "Mes commandes", val: mesCommandes.length }, { icon: "⭐", label: "Évaluations données", val: mesCommandes.filter(c => c.evalDone).length }, { icon: "📍", label: "Adresses sauvegardées", val: 2 }].map((item, i) => (
              <Card key={i} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>{item.icon} {item.label}</span>
                <span style={{ fontWeight: 800, color: "#FF6B35" }}>{item.val}</span>
              </Card>
            ))}
            <Btn onClick={() => { setIsAuthenticated(false); setPanier([]); }} outline color="#EF4444" style={{ width: "100%", marginTop: 16 }}>Se déconnecter</Btn>
          </>
        )}
      </div>

      {/* Navigation Basse */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", padding: "8px 0" }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => { setPage(n.key); if (n.key !== "menu") setRestaurantId(null); }}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0" }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 11, fontWeight: page === n.key ? 800 : 500, color: page === n.key ? "#FF6B35" : "#9CA3AF" }}>{n.label}</span>
          </button>
        ))}
      </div>

      {/* Modales */}
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
// INTERFACE GÉRANT COMPLÈTE AVEC AUTHENTIFICATION
function GerantApp({ commandes, setCommandes, toast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentGerant, setCurrentGerant] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [modalAssign, setModalAssign] = useState(null);
  const [livreurChoisi, setLivreurChoisi] = useState(null);

  // Liste des gérants avec leurs identifiants
  const GERANTS_CREDENTIALS = [
    { id: 1, email: "gerant@petitdakar.sn", password: "gerant123", nom: "Mamadou Diallo", restaurant: "Le Petit Dakar", telephone: "77 111 22 33" },
    { id: 2, email: "gerant@pizzaroyale.sn", password: "pizza123", nom: "Alioune Sarr", restaurant: "Pizza Royale", telephone: "77 222 33 44" },
    { id: 3, email: "gerant@wokexpress.sn", password: "wok123", nom: "Fatou Ndiaye", restaurant: "Wok Express", telephone: "77 333 44 55" },
  ];

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }
    
    const gerant = GERANTS_CREDENTIALS.find(
      g => g.email === loginEmail && g.password === loginPassword
    );
    
    if (gerant) {
      setCurrentGerant(gerant);
      setIsAuthenticated(true);
      setLoginError("");
      toast(`Bienvenue ${gerant.nom} !`);
    } else {
      setLoginError("Email ou mot de passe incorrect");
    }
  };

  // Filtrer les commandes du restaurant du gérant connecté
  const cmdRestaurant = commandes.filter(c => c.restaurant === currentGerant?.restaurant);
  const pending = cmdRestaurant.filter(c => c.statut === "En attente").length;
  const enCours = cmdRestaurant.filter(c => ["Validée", "En préparation", "Assignée", "En cours de livraison"].includes(c.statut)).length;
  const livrees = cmdRestaurant.filter(c => c.statut === "Livrée").length;
  const chiffreAffaires = cmdRestaurant.filter(c => c.statut === "Livrée").reduce((sum, c) => sum + c.total, 0);

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
    { key: "profil", icon: "👤", label: "Profil" },
  ];

  // Page d'authentification
  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🍳</div>
            <h2 style={{ margin: 0, color: "#1C1917" }}>Espace Gérant</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginTop: 8 }}>Connectez-vous pour gérer votre restaurant</p>
          </div>

          <Input 
            label="Email" 
            value={loginEmail} 
            onChange={setLoginEmail} 
            type="email" 
            placeholder="gerant@restaurant.sn" 
          />
          <Input 
            label="Mot de passe" 
            value={loginPassword} 
            onChange={setLoginPassword} 
            type="password" 
            placeholder="••••••••" 
          />
          
          {loginError && (
            <p style={{ color: "#EF4444", fontSize: 13, marginTop: 8, marginBottom: 0 }}>{loginError}</p>
          )}
          
          <Btn onClick={handleLogin} style={{ width: "100%", marginTop: 20 }} color="#8B5CF6">
            Se connecter
          </Btn>
          
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              🔐 Comptes de démonstration :<br/>
              <span style={{ fontSize: 11 }}>gerant@petitdakar.sn / gerant123 (Le Petit Dakar)</span><br/>
              <span style={{ fontSize: 11 }}>gerant@pizzaroyale.sn / pizza123 (Pizza Royale)</span><br/>
              <span style={{ fontSize: 11 }}>gerant@wokexpress.sn / wok123 (Wok Express)</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 800, margin: "0 auto", background: "#F8F7F5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#1C1917", padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#A78BFA", fontWeight: 600 }}>ESPACE GÉRANT</p>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>🍲 {currentGerant?.restaurant}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.7 }}>Bonjour {currentGerant?.nom}</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {pending > 0 && (
              <span style={{ background: "#EF4444", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                {pending} commande{pending > 1 ? "s" : ""} en attente
              </span>
            )}
            <button 
              onClick={() => { setIsAuthenticated(false); setCurrentGerant(null); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 12, cursor: "pointer" }}
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Sub Nav */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)}
            style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === n.key ? 800 : 500, color: page === n.key ? "#1C1917" : "#9CA3AF", borderBottom: `3px solid ${page === n.key ? "#FF6B35" : "transparent"}` }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            {/* Cartes de statistiques */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 24 }}>⏳</div>
                <p style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 900, color: "#F97316" }}>{pending}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>En attente</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 24 }}>🔄</div>
                <p style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 900, color: "#3B82F6" }}>{enCours}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>En cours</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 24 }}>✅</div>
                <p style={{ margin: "4px 0 2px", fontSize: 22, fontWeight: 900, color: "#10B981" }}>{livrees}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Livrées</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 24 }}>💰</div>
                <p style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 900, color: "#8B5CF6" }}>{chiffreAffaires.toLocaleString()} F</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>Chiffre d'affaires</p>
              </div>
            </div>

            <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 800 }}>📋 Nouvelles commandes</h3>
            {cmdRestaurant.filter(c => c.statut === "En attente").length === 0 && (
              <p style={{ color: "#9CA3AF", textAlign: "center", padding: 20 }}>Aucune nouvelle commande</p>
            )}
            {cmdRestaurant.filter(c => c.statut === "En attente").map(cmd => (
              <div key={cmd.id} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>👤 {cmd.client} — {cmd.heure}</p>
                    <p style={{ margin: "2px 0", fontSize: 13 }}>📦 {cmd.plats.join(", ")}</p>
                    <p style={{ margin: "4px 0 0", fontWeight: 800, color: "#FF6B35" }}>{cmd.total.toLocaleString()} FCFA</p>
                    <p style={{ margin: "2px 0", fontSize: 12, color: "#6B7280" }}>📍 {cmd.adresse} ({cmd.zone})</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Btn small color="#10B981" onClick={() => action(cmd.id, "Validée")}>✓ Valider la commande</Btn>
                    <Btn small outline color="#EF4444" onClick={() => action(cmd.id, "Annulée")}>✕ Refuser</Btn>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* COMMANDES */}
        {page === "commandes" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>📋 Gestion des commandes</h3>
            {cmdRestaurant.filter(c => !["Livrée", "Annulée"].includes(c.statut)).map(cmd => (
              <div key={cmd.id} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800 }}>{cmd.id}</span>
                  <Badge statut={cmd.statut} />
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 13, color: "#374151" }}>👤 {cmd.client} — 📍 {cmd.adresse}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6B7280" }}>📦 {cmd.plats.join(", ")}</p>
                <p style={{ margin: "0 0 8px", fontWeight: 600 }}>💰 {cmd.total.toLocaleString()} FCFA</p>
                {cmd.livreur && <p style={{ margin: "0 0 8px", fontSize: 13, background: "#F0FDF4", padding: "6px 10px", borderRadius: 8, color: "#166534" }}>🛵 Livreur : {cmd.livreur}</p>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cmd.statut === "Validée" && <Btn small color="#F97316" onClick={() => action(cmd.id, "En préparation")}>👨‍🍳 Confirmer la préparation</Btn>}
                  {cmd.statut === "En préparation" && <Btn small color="#3B82F6" onClick={() => setModalAssign(cmd)}>🛵 Assigner un livreur</Btn>}
                  {cmd.statut === "Assignée" && <Btn small outline color="#0EA5E9" disabled>⌛ En attente du livreur</Btn>}
                </div>
              </div>
            ))}
            {cmdRestaurant.filter(c => !["Livrée", "Annulée"].includes(c.statut)).length === 0 && (
              <p style={{ color: "#9CA3AF", textAlign: "center", padding: 20 }}>Aucune commande en cours</p>
            )}
          </>
        )}

        {/* HISTORIQUE */}
        {page === "historique" && (
          <>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800 }}>🕓 Historique complet des commandes</h3>
            {cmdRestaurant.map(cmd => (
              <div key={cmd.id} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                      <Badge statut={cmd.statut} />
                    </div>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>👤 {cmd.client} — {cmd.heure}</p>
                    <p style={{ margin: "2px 0", fontSize: 13 }}>📦 {cmd.plats.join(", ")}</p>
                    <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 700, color: "#FF6B35" }}>{cmd.total.toLocaleString()} FCFA</p>
                  </div>
                  {cmd.livreur && (
                    <div style={{ fontSize: 12, background: "#F3F4F6", padding: "4px 10px", borderRadius: 20 }}>
                      🛵 {cmd.livreur}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* PROFIL GÉRANT */}
        {page === "profil" && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#8B5CF6", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff" }}>
                {currentGerant?.nom.charAt(0)}
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{currentGerant?.nom}</h3>
              <p style={{ margin: 0, color: "#6B7280" }}>Gérant de {currentGerant?.restaurant}</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <h4 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>📞 Informations du restaurant</h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#6B7280" }}>Restaurant</span>
                <span style={{ fontWeight: 600 }}>{currentGerant?.restaurant}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#6B7280" }}>Gérant</span>
                <span style={{ fontWeight: 600 }}>{currentGerant?.nom}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#6B7280" }}>Email</span>
                <span style={{ fontWeight: 600 }}>{currentGerant?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Téléphone</span>
                <span style={{ fontWeight: 600 }}>{currentGerant?.telephone}</span>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12 }}>
              <h4 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>📊 Statistiques du restaurant</h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#6B7280" }}>Total commandes</span>
                <span style={{ fontWeight: 600 }}>{cmdRestaurant.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#6B7280" }}>Commandes livrées</span>
                <span style={{ fontWeight: 600, color: "#10B981" }}>{livrees}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "#6B7280" }}>En attente</span>
                <span style={{ fontWeight: 600, color: "#F97316" }}>{pending}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Chiffre d'affaires</span>
                <span style={{ fontWeight: 600, color: "#8B5CF6" }}>{chiffreAffaires.toLocaleString()} FCFA</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Assignation Livreur */}
      <Modal open={!!modalAssign} onClose={() => setModalAssign(null)} title="🛵 Assigner un livreur">
        {modalAssign && (
          <>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>Commande {modalAssign.id} — {modalAssign.adresse}</p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Choisissez un livreur</label>
              {LIVREURS.filter(l => l.statut === "Disponible").map(lv => (
                <div key={lv.id} onClick={() => setLivreurChoisi(lv.id)}
                  style={{ padding: "12px 14px", borderRadius: 12, border: `2px solid ${livreurChoisi === lv.id ? "#FF6B35" : "#E5E7EB"}`, marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>🛵 {lv.nom}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>⭐ {lv.note} — {lv.missions} missions</p>
                  </div>
                  <span style={{ fontSize: 12, background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{lv.statut}</span>
                </div>
              ))}
              {LIVREURS.filter(l => l.statut === "Disponible").length === 0 && (
                <p style={{ color: "#9CA3AF", textAlign: "center", padding: 20 }}>Aucun livreur disponible</p>
              )}
            </div>
            <Btn onClick={() => assigner(modalAssign)} disabled={!livreurChoisi} style={{ width: "100%" }} color="#FF6B35">
              ✓ Confirmer l'assignation
            </Btn>
          </>
        )}
      </Modal>
    </div>
  );
}

// INTERFACE LIVREUR
// INTERFACE LIVREUR COMPLÈTE AVEC AUTHENTIFICATION
function LivreurApp({ commandes, setCommandes, toast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentLivreur, setCurrentLivreur] = useState(null);
  const [page, setPage] = useState("missions");
  const [modalIncident, setModalIncident] = useState(null);
  const [incident, setIncident] = useState("");
  const [showHistorique, setShowHistorique] = useState(false);

  // Liste des livreurs avec leurs identifiants
  const LIVREURS_CREDENTIALS = [
    { id: 1, email: "ibrahim.seck@livreur.sn", password: "ibrahim123", nom: "Ibrahim Seck", note: 4.7, telephone: "77 123 45 67", vehicule: "Moto - Honda" },
    { id: 2, email: "cheikh.fall@livreur.sn", password: "cheikh123", nom: "Cheikh Fall", note: 4.9, telephone: "77 234 56 78", vehicule: "Moto - Yamaha" },
    { id: 3, email: "abdou.diop@livreur.sn", password: "abdou123", nom: "Abdou Diop", note: 4.5, telephone: "77 345 67 89", vehicule: "Vélo électrique" },
    { id: 4, email: "mamadou.kone@livreur.sn", password: "mamadou123", nom: "Mamadou Koné", note: 4.2, telephone: "77 456 78 90", vehicule: "Moto - Bajaj" },
  ];

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }
    
    const livreur = LIVREURS_CREDENTIALS.find(
      l => l.email === loginEmail && l.password === loginPassword
    );
    
    if (livreur) {
      setCurrentLivreur(livreur);
      setIsAuthenticated(true);
      setLoginError("");
      toast(`Bienvenue ${livreur.nom} !`);
    } else {
      setLoginError("Email ou mot de passe incorrect");
    }
  };

  // Récupérer les missions du livreur connecté
  const mesMissions = commandes.filter(c => c.livreur === currentLivreur?.nom && !["Livrée", "Annulée"].includes(c.statut));
  const missionsTerminees = commandes.filter(c => c.livreur === currentLivreur?.nom && c.statut === "Livrée");
  const missionsEnCours = mesMissions.filter(c => c.statut === "En cours de livraison");
  const missionsAssignees = mesMissions.filter(c => c.statut === "Assignée");
  
  const gainsTotal = missionsTerminees.length * 1500;
  const gainsMois = gainsTotal;
  const noteMoyenne = currentLivreur?.note || 4.5;
  const kmParcourus = missionsTerminees.length * 8;

  const updateStatut = (id, s) => {
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: s } : c));
    toast(`Statut mis à jour : ${s}`);
    if (s === "Livrée") {
      toast(`+1500 FCFA ajoutés à vos gains !`);
    }
  };

  const signalerIncident = (cmd) => {
    setCommandes(prev => prev.map(c => c.id === cmd.id ? { ...c, statut: "Incident signalé" } : c));
    setModalIncident(null);
    setIncident("");
    toast("Incident signalé au gérant");
  };

  // Page d'authentification
  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛵</div>
            <h2 style={{ margin: 0, color: "#1C1917" }}>Espace Livreur</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginTop: 8 }}>Connectez-vous pour gérer vos livraisons</p>
          </div>

          <Input 
            label="Email" 
            value={loginEmail} 
            onChange={setLoginEmail} 
            type="email" 
            placeholder="exemple@livreur.sn" 
          />
          <Input 
            label="Mot de passe" 
            value={loginPassword} 
            onChange={setLoginPassword} 
            type="password" 
            placeholder="••••••••" 
          />
          
          {loginError && (
            <p style={{ color: "#EF4444", fontSize: 13, marginTop: 8, marginBottom: 0 }}>{loginError}</p>
          )}
          
          <Btn onClick={handleLogin} style={{ width: "100%", marginTop: 20 }} color="#0EA5E9">
            Se connecter
          </Btn>
          
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              🔐 Comptes de démonstration :<br/>
              <span style={{ fontSize: 11 }}>ibrahim.seck@livreur.sn / ibrahim123</span><br/>
              <span style={{ fontSize: 11 }}>cheikh.fall@livreur.sn / cheikh123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 480, margin: "0 auto", background: "#F8F7F5", minHeight: "100vh" }}>
      {/* Header avec photo et infos */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", padding: "24px 20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>ESPACE LIVREUR</p>
            <h2 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800 }}>{currentLivreur?.nom}</h2>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span style={{ background: "#10B981", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                ● Disponible
              </span>
              <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>
                ⭐ {noteMoyenne}
              </span>
              <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>
                📞 {currentLivreur?.telephone}
              </span>
            </div>
          </div>
          <button 
            onClick={() => { setIsAuthenticated(false); setCurrentLivreur(null); }}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "6px 12px", color: "#fff", fontSize: 12, cursor: "pointer" }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 16px" }}>
        <button 
          onClick={() => setPage("missions")} 
          style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === "missions" ? 700 : 500, color: page === "missions" ? "#0EA5E9" : "#6B7280", borderBottom: page === "missions" ? "3px solid #0EA5E9" : "3px solid transparent" }}
        >
          🛵 Missions
        </button>
        <button 
          onClick={() => setPage("historique")} 
          style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === "historique" ? 700 : 500, color: page === "historique" ? "#0EA5E9" : "#6B7280", borderBottom: page === "historique" ? "3px solid #0EA5E9" : "3px solid transparent" }}
        >
          📋 Historique
        </button>
        <button 
          onClick={() => setPage("gains")} 
          style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === "gains" ? 700 : 500, color: page === "gains" ? "#0EA5E9" : "#6B7280", borderBottom: page === "gains" ? "3px solid #0EA5E9" : "3px solid transparent" }}
        >
          💰 Gains
        </button>
        <button 
          onClick={() => setPage("profil")} 
          style={{ flex: 1, padding: "14px 0", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: page === "profil" ? 700 : 500, color: page === "profil" ? "#0EA5E9" : "#6B7280", borderBottom: page === "profil" ? "3px solid #0EA5E9" : "3px solid transparent" }}
        >
          👤 Profil
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {/* PAGE MISSIONS */}
        {page === "missions" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "#E0F2FE", borderRadius: 12, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>📦</div>
                <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 800 }}>{mesMissions.length}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#0369A1" }}>Missions en cours</p>
              </div>
              <div style={{ background: "#D1FAE5", borderRadius: 12, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>✅</div>
                <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 800 }}>{missionsTerminees.length}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#065F46" }}>Livraisons effectuées</p>
              </div>
            </div>

            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>🛵 Missions actives</h3>
            
            {mesMissions.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛵</div>
                <p style={{ margin: 0, color: "#6B7280" }}>Aucune mission pour le moment</p>
                <p style={{ margin: "8px 0 0", fontSize: 12, color: "#9CA3AF" }}>Les commandes vous seront assignées par le gérant</p>
              </div>
            )}

            {mesMissions.map(cmd => (
              <div key={cmd.id} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, overflow: "hidden", border: cmd.statut === "En cours de livraison" ? "2px solid #0EA5E9" : "1px solid #E5E7EB" }}>
                <div style={{ background: cmd.statut === "En cours de livraison" ? "#F0F9FF" : "#F8F7F5", padding: 12, borderBottom: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                    <Badge statut={cmd.statut} />
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 32 }}>🍽️</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{cmd.restaurant}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>📦 {cmd.plats.join(", ")}</p>
                    </div>
                  </div>
                  
                  <div style={{ background: "#F3F4F6", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600 }}>📍 Adresse de livraison</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>{cmd.adresse}</p>
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6B7280" }}>Zone : {cmd.zone}</p>
                  </div>
                  
                  <div style={{ display: "flex", gap: 8 }}>
                    {cmd.statut === "Assignée" && (
                      <>
                        <Btn small color="#0EA5E9" onClick={() => updateStatut(cmd.id, "En cours de livraison")}>
                          ▶️ Démarrer la livraison
                        </Btn>
                        <Btn small outline color="#EF4444" onClick={() => updateStatut(cmd.id, "Annulée")}>
                          ❌ Refuser
                        </Btn>
                      </>
                    )}
                    {cmd.statut === "En cours de livraison" && (
                      <>
                        <Btn small color="#10B981" onClick={() => updateStatut(cmd.id, "Livrée")}>
                          ✓ Livraison effectuée
                        </Btn>
                        <Btn small outline color="#EF4444" onClick={() => setModalIncident(cmd)}>
                          ⚠ Signaler un incident
                        </Btn>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* PAGE HISTORIQUE */}
        {page === "historique" && (
          <>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>📋 Historique des livraisons</h3>
            {missionsTerminees.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p style={{ margin: 0, color: "#6B7280" }}>Aucune livraison terminée</p>
              </div>
            )}
            {missionsTerminees.map(cmd => (
              <div key={cmd.id} style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, border: "1px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.id}</span>
                      <Badge statut={cmd.statut} />
                    </div>
                    <p style={{ margin: "2px 0", fontSize: 13 }}>🍽️ {cmd.restaurant}</p>
                    <p style={{ margin: "2px 0", fontSize: 13, color: "#6B7280" }}>📍 {cmd.adresse}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#10B981", fontWeight: 600 }}>💰 +1 500 FCFA</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{cmd.heure}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* PAGE GAINS */}
        {page === "gains" && (
          <>
            <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderRadius: 20, padding: 24, marginBottom: 16, textAlign: "center", color: "#fff" }}>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>Gains totaux</p>
              <p style={{ margin: "8px 0 4px", fontSize: 42, fontWeight: 900 }}>{gainsTotal.toLocaleString()} FCFA</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>~ {Math.floor(gainsTotal / 650)} €</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📦</div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{missionsTerminees.length}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Livraisons effectuées</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⭐</div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{noteMoyenne}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Note moyenne</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🛵</div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{kmParcourus} km</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Kilomètres parcourus</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💰</div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>1500 FCFA</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Par livraison</p>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E5E7EB" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>📊 Détail des gains</h4>
              {missionsTerminees.map((cmd, idx) => (
                <div key={cmd.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: idx !== missionsTerminees.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                  <span style={{ fontSize: 13 }}>{cmd.id} - {cmd.heure}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>+1500 FCFA</span>
                </div>
              ))}
              {missionsTerminees.length === 0 && (
                <p style={{ textAlign: "center", color: "#9CA3AF", margin: 0 }}>Aucun gain pour le moment</p>
              )}
            </div>
          </>
        )}

        {/* PAGE PROFIL */}
        {page === "profil" && (
          <>
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#0EA5E9", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff" }}>
                {currentLivreur?.nom.charAt(0)}
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>{currentLivreur?.nom}</h3>
              <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>{currentLivreur?.email}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12 }}>
                <span style={{ background: "#D1FAE5", color: "#065F46", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>⭐ {noteMoyenne}</span>
                <span style={{ background: "#E0F2FE", color: "#0369A1", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{missionsTerminees.length} livraisons</span>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>📞 Informations de contact</h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#6B7280" }}>Téléphone</span>
                <span style={{ fontWeight: 500 }}>{currentLivreur?.telephone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#6B7280" }}>Email</span>
                <span style={{ fontWeight: 500 }}>{currentLivreur?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Véhicule</span>
                <span style={{ fontWeight: 500 }}>{currentLivreur?.vehicule}</span>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>📊 Statistiques</h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#6B7280" }}>Total livraisons</span>
                <span style={{ fontWeight: 600 }}>{missionsTerminees.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#6B7280" }}>Gains totaux</span>
                <span style={{ fontWeight: 600, color: "#10B981" }}>{gainsTotal.toLocaleString()} FCFA</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Kilomètres parcourus</span>
                <span style={{ fontWeight: 600 }}>{kmParcourus} km</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Signalement d'incident */}
      <Modal open={!!modalIncident} onClose={() => setModalIncident(null)} title="⚠️ Signaler un incident">
        {modalIncident && (
          <>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>Commande : <strong>{modalIncident.id}</strong></p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Type de problème</label>
              {["Adresse introuvable", "Client absent", "Accident de parcours", "Colis endommagé", "Autre"].map(p => (
                <div key={p} onClick={() => setIncident(p)}
                  style={{ marginTop: 8, padding: "10px 14px", borderRadius: 10, border: `2px solid ${incident === p ? "#EF4444" : "#E5E7EB"}`, cursor: "pointer", fontSize: 14, fontWeight: incident === p ? 700 : 400 }}>
                  {p}
                </div>
              ))}
            </div>
            <Btn onClick={() => signalerIncident(modalIncident)} disabled={!incident} style={{ width: "100%" }} color="#EF4444">
              Envoyer le signalement
            </Btn>
          </>
        )}
      </Modal>
    </div>
  );
}

// INTERFACE ADMIN
// INTERFACE ADMIN COMPLÈTE AVEC AUTHENTIFICATION
function AdminApp({ commandes, setCommandes, toast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [page, setPage] = useState("stats");
  const [modalZone, setModalZone] = useState(false);
  const [newZone, setNewZone] = useState({ nom: "", tarif: "" });
  const [zones, setZones] = useState(ZONES);
  const [livreurs, setLivreurs] = useState(LIVREURS);
  const [modalLivreur, setModalLivreur] = useState(null);
  const [editLivreur, setEditLivreur] = useState(null);

  // Identifiants admin (dans une vraie app, ce serait en base de données)
  const ADMIN_CREDENTIALS = {
    email: "admin@livraisonlocale.sn",
    password: "admin123"
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }
    if (loginEmail === ADMIN_CREDENTIALS.email && loginPassword === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setLoginError("");
      toast("Bienvenue Administrateur !");
    } else {
      setLoginError("Email ou mot de passe incorrect");
    }
  };

  const totalCA = commandes.filter(c => c.statut === "Livrée").reduce((s, c) => s + c.total, 0);
  const totalCommandes = commandes.length;
  const totalLivrees = commandes.filter(c => c.statut === "Livrée").length;
  const totalIncidents = commandes.filter(c => c.statut === "Incident signalé").length;
  const totalEnAttente = commandes.filter(c => c.statut === "En attente").length;

  // Gestion des livreurs
  const toggleLivreur = (id) => {
    setLivreurs(prev => prev.map(l => l.id === id ? { ...l, statut: l.statut === "Hors ligne" ? "Disponible" : "Hors ligne" } : l));
    toast(`Statut livreur mis à jour`);
  };

  const ajouterLivreur = (nouveauLivreur) => {
    if (!nouveauLivreur.nom) {
      toast("Veuillez entrer un nom", "error");
      return;
    }
    const newId = livreurs.length + 1;
    setLivreurs(prev => [...prev, { ...nouveauLivreur, id: newId, statut: "Disponible", missions: 0, gains: 0 }]);
    toast(`Livreur ${nouveauLivreur.nom} ajouté !`);
    setModalLivreur(null);
  };

  const modifierLivreur = (livreur) => {
    setLivreurs(prev => prev.map(l => l.id === livreur.id ? livreur : l));
    toast(`Livreur ${livreur.nom} modifié !`);
    setEditLivreur(null);
  };

  // Gestion des zones
  const addZone = () => {
    if (!newZone.nom || !newZone.tarif) return toast("Remplissez tous les champs", "error");
    setZones(prev => [...prev, { id: prev.length + 1, nom: newZone.nom, tarif: parseInt(newZone.tarif) }]);
    setNewZone({ nom: "", tarif: "" });
    setModalZone(false);
    toast(`Zone ${newZone.nom} ajoutée !`);
  };

  const supprimerZone = (id) => {
    setZones(prev => prev.filter(z => z.id !== id));
    toast("Zone supprimée");
  };

  // Gestion des commandes
  const annulerCommande = (id) => {
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: "Annulée" } : c));
    toast(`Commande ${id} annulée`);
  };

  const reattribuerLivreur = (cmdId, nouveauLivreurId) => {
    const livreur = livreurs.find(l => l.id === nouveauLivreurId);
    setCommandes(prev => prev.map(c => c.id === cmdId ? { ...c, livreur: livreur.nom, statut: "Assignée" } : c));
    toast(`Commande ${cmdId} réassignée à ${livreur.nom}`);
  };

  const stats = [
    { label: "Total commandes", val: totalCommandes, icon: "📦", color: "#6366F1", bg: "#E0E7FF" },
    { label: "Commandes livrées", val: totalLivrees, icon: "✅", color: "#10B981", bg: "#D1FAE5" },
    { label: "En attente", val: totalEnAttente, icon: "⏳", color: "#F59E0B", bg: "#FEF3C7" },
    { label: "Chiffre d'affaires", val: `${totalCA.toLocaleString()} F`, icon: "💰", color: "#8B5CF6", bg: "#EDE9FE" },
    { label: "Incidents", val: totalIncidents, icon: "⚠️", color: "#EF4444", bg: "#FEE2E2" },
    { label: "Livreurs actifs", val: livreurs.filter(l => l.statut !== "Hors ligne").length, icon: "🛵", color: "#06B6D4", bg: "#CFFAFE" },
  ];

  const navItems = [
    { key: "stats", icon: "📊", label: "Statistiques" },
    { key: "commandes", icon: "📋", label: "Commandes" },
    { key: "livreurs", icon: "🛵", label: "Livreurs" },
    { key: "zones", icon: "📍", label: "Zones" },
  ];

  // Écran d'authentification
  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
            <h2 style={{ margin: 0, color: "#1C1917" }}>Administration</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginTop: 8 }}>Accès réservé aux administrateurs</p>
          </div>

          <Input 
            label="Email administrateur" 
            value={loginEmail} 
            onChange={setLoginEmail} 
            type="email" 
            placeholder="admin@livraisonlocale.sn" 
          />
          <Input 
            label="Mot de passe" 
            value={loginPassword} 
            onChange={setLoginPassword} 
            type="password" 
            placeholder="••••••••" 
          />
          
          {loginError && (
            <p style={{ color: "#EF4444", fontSize: 13, marginTop: 8, marginBottom: 0 }}>{loginError}</p>
          )}
          
          <Btn onClick={handleLogin} style={{ width: "100%", marginTop: 20 }} color="#4F46E5">
            Se connecter
          </Btn>
          
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              🔐 Accès sécurisé<br/>
              <span style={{ fontSize: 11 }}>Contactez le support si vous avez oublié vos identifiants</span>
            </p>
          </div>
        </div>
        <Toast message={toast?.message} type={toast?.type} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#F3F4F6" }}>
      {/* Header */}
      <div style={{ background: "#4F46E5", padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>PANEL ADMINISTRATEUR</p>
            <h2 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800 }}>🏛️ LivraisonLocale</h2>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>
              Super Admin
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 500 }}
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 20px", gap: 8 }}>
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            style={{
              padding: "12px 20px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: page === item.key ? 700 : 500,
              color: page === item.key ? "#4F46E5" : "#6B7280",
              borderBottom: page === item.key ? "3px solid #4F46E5" : "3px solid transparent",
              transition: "all 0.15s"
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {/* PAGE STATISTIQUES */}
        {page === "stats" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{s.icon}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphique des statuts */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>📈 Répartition des commandes par statut</h3>
              {Object.keys(STATUT_COLORS).map(statut => {
                const count = commandes.filter(c => c.statut === statut).length;
                const pourcentage = totalCommandes > 0 ? (count / totalCommandes) * 100 : 0;
                if (count === 0) return null;
                return (
                  <div key={statut} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{statut}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{count} ({pourcentage.toFixed(0)}%)</span>
                    </div>
                    <div style={{ background: "#E5E7EB", borderRadius: 10, height: 8, overflow: "hidden" }}>
                      <div style={{ width: `${pourcentage}%`, background: STATUT_COLORS[statut].dot, height: "100%", borderRadius: 10 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chiffres clés supplémentaires */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 20 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>💰 Revenus par zone</h3>
                {ZONES.map(zone => {
                  const revenusZone = commandes.filter(c => c.zone === zone.nom && c.statut === "Livrée").reduce((s, c) => s + c.total, 0);
                  return (
                    <div key={zone.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span>📍 {zone.nom}</span>
                      <span style={{ fontWeight: 600 }}>{revenusZone.toLocaleString()} FCFA</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 20 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>🍽️ Commandes par restaurant</h3>
                {RESTAURANTS.map(resto => {
                  const nbCommandes = commandes.filter(c => c.restaurant === resto.nom).length;
                  return (
                    <div key={resto.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span>{resto.image} {resto.nom}</span>
                      <span style={{ fontWeight: 600 }}>{nbCommandes} commandes</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* PAGE COMMANDES */}
        {page === "commandes" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>📋 Toutes les commandes ({commandes.length})</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {commandes.map(cmd => (
                <div key={cmd.id} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 15 }}>{cmd.id}</span>
                        <Badge statut={cmd.statut} />
                      </div>
                      <p style={{ margin: "4px 0", fontSize: 13 }}>👤 {cmd.client}</p>
                      <p style={{ margin: "4px 0", fontSize: 13 }}>🍽️ {cmd.restaurant}</p>
                      <p style={{ margin: "4px 0", fontSize: 13, color: "#6B7280" }}>📦 {cmd.plats.join(", ")}</p>
                      <p style={{ margin: "4px 0", fontSize: 13 }}>📍 {cmd.adresse} • {cmd.zone}</p>
                      <p style={{ margin: "4px 0", fontSize: 13 }}>⏰ {cmd.heure}</p>
                      {cmd.livreur && <p style={{ margin: "4px 0", fontSize: 13 }}>🛵 Livreur : {cmd.livreur}</p>}
                    </div>
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#4F46E5" }}>{cmd.total.toLocaleString()} FCFA</p>
                      {!["Livrée", "Annulée"].includes(cmd.statut) && (
                        <Btn small outline color="#EF4444" onClick={() => annulerCommande(cmd.id)}>Annuler la commande</Btn>
                      )}
                      {cmd.livreur && (
                        <select 
                          onChange={(e) => reattribuerLivreur(cmd.id, parseInt(e.target.value))}
                          style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, width: "100%" }}
                        >
                          <option value="">Changer de livreur</option>
                          {livreurs.filter(l => l.statut !== "Hors ligne").map(l => (
                            <option key={l.id} value={l.id}>{l.nom}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGE LIVREURS */}
        {page === "livreurs" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>🛵 Gestion des livreurs</h3>
              <Btn small color="#4F46E5" onClick={() => setModalLivreur({ type: "add" })}>+ Ajouter un livreur</Btn>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {livreurs.map(lv => (
                <div key={lv.id} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E0E7FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#4F46E5" }}>
                        {lv.nom.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{lv.nom}</h4>
                        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                          <span style={{ fontSize: 12, color: "#F59E0B" }}>⭐ {lv.note}</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>{lv.missions} missions</span>
                          <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>{lv.gains.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontWeight: 600,
                        background: lv.statut === "Disponible" ? "#D1FAE5" : lv.statut === "En livraison" ? "#DBEAFE" : "#FEE2E2",
                        color: lv.statut === "Disponible" ? "#065F46" : lv.statut === "En livraison" ? "#1E40AF" : "#991B1B"
                      }}>
                        {lv.statut}
                      </span>
                      <Btn small outline color={lv.statut === "Hors ligne" ? "#10B981" : "#EF4444"} onClick={() => toggleLivreur(lv.id)}>
                        {lv.statut === "Hors ligne" ? "Activer" : "Suspendre"}
                      </Btn>
                      <Btn small outline color="#3B82F6" onClick={() => setEditLivreur(lv)}>✏️ Modifier</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGE ZONES */}
        {page === "zones" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>📍 Zones de livraison</h3>
              <Btn small color="#4F46E5" onClick={() => setModalZone(true)}>+ Ajouter une zone</Btn>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {zones.map(z => {
                const nbCommandes = commandes.filter(c => c.zone === z.nom).length;
                const revenus = commandes.filter(c => c.zone === z.nom && c.statut === "Livrée").reduce((s, c) => s + c.total, 0);
                return (
                  <div key={z.id} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>📍 {z.nom}</h4>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>
                        {nbCommandes} commandes • {revenus.toLocaleString()} FCFA générés
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#4F46E5" }}>{z.tarif.toLocaleString()} FCFA</span>
                      <Btn small outline color="#EF4444" onClick={() => supprimerZone(z.id)}>🗑️ Supprimer</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal Ajouter Zone */}
      <Modal open={modalZone} onClose={() => setModalZone(false)} title="➕ Ajouter une zone">
        <Input label="Nom de la zone" value={newZone.nom} onChange={v => setNewZone(p => ({ ...p, nom: v }))} placeholder="Ex: Ouest" />
        <Input label="Tarif de livraison (FCFA)" type="number" value={newZone.tarif} onChange={v => setNewZone(p => ({ ...p, tarif: v }))} placeholder="Ex: 800" />
        <Btn onClick={addZone} style={{ width: "100%", marginTop: 16 }} color="#4F46E5">Ajouter la zone</Btn>
      </Modal>

      {/* Modal Ajouter Livreur */}
      <Modal open={modalLivreur?.type === "add"} onClose={() => setModalLivreur(null)} title="➕ Ajouter un livreur">
        <Input label="Nom complet" value={modalLivreur?.nom || ""} onChange={v => setModalLivreur({ type: "add", nom: v, note: 4.5 })} placeholder="Ex: Alioune Diop" />
        <Input label="Note (1-5)" type="number" value={modalLivreur?.note || 4.5} onChange={v => setModalLivreur(prev => ({ ...prev, note: parseFloat(v) }))} placeholder="4.5" />
        <Btn onClick={() => ajouterLivreur({ nom: modalLivreur?.nom, note: modalLivreur?.note || 4.5, missions: 0, gains: 0 })} style={{ width: "100%", marginTop: 16 }} color="#4F46E5">Ajouter le livreur</Btn>
      </Modal>

      {/* Modal Modifier Livreur */}
      <Modal open={!!editLivreur} onClose={() => setEditLivreur(null)} title="✏️ Modifier le livreur">
        <Input label="Nom complet" value={editLivreur?.nom || ""} onChange={v => setEditLivreur(prev => ({ ...prev, nom: v }))} />
        <Input label="Note (1-5)" type="number" value={editLivreur?.note || 0} onChange={v => setEditLivreur(prev => ({ ...prev, note: parseFloat(v) }))} />
        <Input label="Nombre de missions" type="number" value={editLivreur?.missions || 0} onChange={v => setEditLivreur(prev => ({ ...prev, missions: parseInt(v) }))} />
        <Input label="Gains (FCFA)" type="number" value={editLivreur?.gains || 0} onChange={v => setEditLivreur(prev => ({ ...prev, gains: parseInt(v) }))} />
        <Btn onClick={() => modifierLivreur(editLivreur)} style={{ width: "100%", marginTop: 16 }} color="#4F46E5">Enregistrer les modifications</Btn>
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
      <div style={{ 
        fontFamily: "'Poppins', 'Outfit', sans-serif", 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: 20 
      }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          {/* Logo et titre */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ 
              fontSize: 64, 
              marginBottom: 16, 
              background: "rgba(255,255,255,0.2)", 
              display: "inline-block", 
              padding: "20px", 
              borderRadius: "50%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}>
              🍕🍔🍜
            </div>
            <h1 style={{ 
              margin: "16px 0 8px", 
              color: "#fff", 
              fontSize: 32, 
              fontWeight: 800, 
              letterSpacing: "-0.5px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
            }}>
              Livraison<span style={{ color: "#FFD700" }}>Locale</span>
            </h1>
            <p style={{ 
              margin: "8px 0 0", 
              color: "rgba(255,255,255,0.85)", 
              fontSize: 15,
              fontWeight: 500
            }}>
              La livraison de repas à Dakar
            </p>
          </div>

          {/* Cartes des rôles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Client */}
            <button 
              onClick={() => setRole("client")}
              style={{ 
                background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)", 
                border: "none", 
                borderRadius: 20, 
                padding: "24px 16px", 
                cursor: "pointer", 
                textAlign: "center", 
                transition: "transform 0.2s, box-shadow 0.2s",
                color: "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)"; }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>🧑‍🍳</div>
              <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 18 }}>Client</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>Commandez vos plats préférés</p>
            </button>

            {/* Gérant */}
            <button 
              onClick={() => setRole("gerant")}
              style={{ 
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", 
                border: "none", 
                borderRadius: 20, 
                padding: "24px 16px", 
                cursor: "pointer", 
                textAlign: "center", 
                transition: "transform 0.2s, box-shadow 0.2s",
                color: "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)"; }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>👨‍🍳</div>
              <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 18 }}>Gérant</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>Gérez votre restaurant</p>
            </button>

            {/* Livreur */}
            <button 
              onClick={() => setRole("livreur")}
              style={{ 
                background: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)", 
                border: "none", 
                borderRadius: 20, 
                padding: "24px 16px", 
                cursor: "pointer", 
                textAlign: "center", 
                transition: "transform 0.2s, box-shadow 0.2s",
                color: "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)"; }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>🛵</div>
              <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 18 }}>Livreur</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>Gérez vos livraisons</p>
            </button>

            {/* Admin */}
            <button 
              onClick={() => setRole("admin")}
              style={{ 
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", 
                border: "none", 
                borderRadius: 20, 
                padding: "24px 16px", 
                cursor: "pointer", 
                textAlign: "center", 
                transition: "transform 0.2s, box-shadow 0.2s",
                color: "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)"; }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>🏛️</div>
              <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 18 }}>Administrateur</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.9 }}>Supervision globale</p>
            </button>
          </div>

          {/* Footer */}
          <p style={{ 
            textAlign: "center", 
            marginTop: 32, 
            color: "rgba(255,255,255,0.7)", 
            fontSize: 11,
            fontWeight: 500
          }}>
            🍽️ Plateforme de livraison de repas — Version 1.0
          </p>
        </div>
        <Toast message={toastMsg} type={toastType} />
      </div>
    );
  }

  return (
    <>
      <div style={{ position: "fixed", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 999 }}>
        <button onClick={() => setRole(null)} style={{ background: "rgba(0,0,0,0.75)", color: "#fff", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>← Changer de rôle</button>
      </div>
      {role === "client" && <ClientApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      {role === "gerant" && <GerantApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      {role === "livreur" && <LivreurApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      {role === "admin" && <AdminApp commandes={commandes} setCommandes={setCommandes} toast={toast} />}
      <Toast message={toastMsg} type={toastType} />
    </>
  );
}