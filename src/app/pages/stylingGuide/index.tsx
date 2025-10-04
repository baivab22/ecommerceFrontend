import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StylingGuide=()=> {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      // padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    title: {
      fontSize: '2.5rem',
      color: '#c2185b',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666'
    },
    cardsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '30px',
      marginBottom: '50px'
    },
    card: {
      flex: '1 1 calc(50% - 15px)',
      minWidth: '280px',
      background: '#fff',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(244, 143, 177, 0.1)',
      transition: 'transform 0.3s ease'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px'
    },
    icon: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      flexShrink: 0
    },
    cardTitle: {
      fontSize: '1.3rem',
      color: '#c2185b',
      marginBottom: '3px'
    },
    cardSubtitle: {
      fontSize: '0.9rem',
      color: '#f48fb1'
    },
    tipsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    tipItem: {
      padding: '8px 0',
      paddingLeft: '20px',
      position: 'relative',
      color: '#4a4a4a'
    },
    quickTips: {
      background: 'linear-gradient(135deg, #fce4ec, #fce4ec)',
      borderRadius: '15px',
      padding: '40px',
      marginBottom: '40px'
    },
    quickTitle: {
      textAlign: 'center',
      fontSize: '2rem',
      color: '#c2185b',
      marginBottom: '30px'
    },
    tipsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '25px'
    },
    tipBox: {
      flex: '1 1 calc(33.333% - 17px)',
      minWidth: '250px'
    },
    tipBoxTitle: {
      fontSize: '1.1rem',
      color: '#c2185b',
      marginBottom: '8px'
    },
    tipBoxText: {
      fontSize: '0.95rem',
      color: '#4a4a4a'
    },
    ctaSection: {
      textAlign: 'center'
    },
    button: {
      background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
      color: '#fff',
      padding: '15px 40px',
      border: 'none',
      borderRadius: '30px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(244, 143, 177, 0.3)'
    }
  };

  const stylingTips = [
    {
      icon: "👑",
      title: "Traditional Occasions",
      description: "Weddings & Festivals",
      tips: [
        "Pair heavy necklaces with matching earrings",
        "Choose gold for traditional ceremonies",
        "Layer bangles for a classic look"
      ]
    },
    {
      icon: "✨",
      title: "Office & Daily Wear",
      description: "Professional Settings",
      tips: [
        "Opt for simple studs or small hoops",
        "Wear delicate chains with pendants",
        "Keep it minimal and elegant"
      ]
    },
    {
      icon: "💎",
      title: "Casual Outings",
      description: "Everyday Style",
      tips: [
        "Mix and match different metals",
        "Try stackable rings and bracelets",
        "Experiment with contemporary designs"
      ]
    },
    {
      icon: "⭐",
      title: "Party & Events",
      description: "Evening Glamour",
      tips: [
        "Make a statement with bold pieces",
        "Choose pieces with stones and crystals",
        "Balance - if wearing heavy necklace, keep earrings simple"
      ]
    }
  ];

  const quickTips = [
    {
      title: "Mix Metals",
      description: "Don't be afraid to combine gold, silver, and rose gold for a modern look"
    },
    {
      title: "Less is More",
      description: "Choose one statement piece and keep other jewelry minimal"
    },
    {
      title: "Match Your Neckline",
      description: "V-necks pair well with pendants, high necks with statement earrings"
    }
  ];

  const navigate=useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Jewelry Styling Guide</h1>
        <p style={styles.subtitle}>Discover the perfect way to style your jewelry for every occasion</p>
      </div>

      <div style={styles.cardsContainer}>
        {stylingTips.map((tip, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.icon}>{tip.icon}</div>
              <div>
                <h3 style={styles.cardTitle}>{tip.title}</h3>
                <span style={styles.cardSubtitle}>{tip.description}</span>
              </div>
            </div>
            <ul style={styles.tipsList}>
              {tip.tips.map((t, i) => (
                <li key={i} style={styles.tipItem}>
                  <span style={{position: 'absolute', left: 0, color: '#f48fb1'}}>✦</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={styles.quickTips}>
        <h2 style={styles.quickTitle}>Quick Styling Tips</h2>
        <div style={styles.tipsGrid}>
          {quickTips.map((tip, index) => (
            <div key={index} style={styles.tipBox}>
              <h4 style={styles.tipBoxTitle}>{tip.title}</h4>
              <p style={styles.tipBoxText}>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.ctaSection}>
        <button style={styles.button}
        onClick={() =>navigate('/products')}
        >
          Explore Our Collection
        </button>
      </div>
    </div>
  );
}