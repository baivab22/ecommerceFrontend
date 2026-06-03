import React from 'react';
import { useRouter } from 'next/router'

export const StylingGuide = () => {
  const router = useRouter()

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

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '50px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#c2185b',
          marginBottom: '10px'
        }}>
          Jewelry Styling Guide
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666'
        }}>
          Discover the perfect way to style your jewelry for every occasion
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        marginBottom: '50px'
      }}>
        {stylingTips.map((tip, index) => (
          <div key={index} style={{
            flex: '1 1 calc(50% - 15px)',
            minWidth: '280px',
            background: '#fff',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(244, 143, 177, 0.1)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {tip.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  color: '#c2185b',
                  marginBottom: '3px'
                }}>
                  {tip.title}
                </h3>
                <span style={{
                  fontSize: '0.9rem',
                  color: '#f48fb1'
                }}>
                  {tip.description}
                </span>
              </div>
            </div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {tip.tips.map((t, i) => (
                <li key={i} style={{
                  padding: '8px 0',
                  paddingLeft: '20px',
                  position: 'relative',
                  color: '#4a4a4a'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#f48fb1'
                  }}>
                    ✦
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #fce4ec, #fce4ec)',
        borderRadius: '15px',
        padding: '40px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          color: '#c2185b',
          marginBottom: '30px'
        }}>
          Quick Styling Tips
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '25px'
        }}>
          {quickTips.map((tip, index) => (
            <div key={index} style={{
              flex: '1 1 calc(33.333% - 17px)',
              minWidth: '250px'
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                color: '#c2185b',
                marginBottom: '8px'
              }}>
                {tip.title}
              </h4>
              <p style={{
                fontSize: '0.95rem',
                color: '#4a4a4a'
              }}>
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: 'center'
      }}>
        <button
          style={{
            background: 'linear-gradient(135deg, #f48fb1, #c2185b)',
            color: '#fff',
            padding: '15px 40px',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(244, 143, 177, 0.3)'
          }}
          onClick={() => router.push('/products')}
        >
          Explore Our Collection
        </button>
      </div>
    </div>
  );
}