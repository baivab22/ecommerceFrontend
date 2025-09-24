// StylingGuide.jsx
import React, { useState } from 'react';

export const StylingGuide = () => {
  const [activeSection, setActiveSection] = useState('layering');

  const sections = [
    { id: 'layering', title: 'Necklace Layering', icon: '📿' },
    { id: 'stacking', title: 'Ring Stacking', icon: '💍' },
    { id: 'earrings', title: 'Earring Selection', icon: '👂' },
    { id: 'occasions', title: 'Occasion Styling', icon: '✨' },
    { id: 'mixing', title: 'Metal Mixing', icon: '🏆' },
    // { id: 'care', title: 'Care & Storage', icon: '🧼' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Jewelry Styling Guide</h1>
        <p>Expert tips and tricks to help you style your jewelry like a professional</p>
      </div>
      
      <div className="page-content">
        {/* Navigation */}
        <div className="guide-navigation">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-title">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="guide-content">
          {/* Necklace Layering */}
          {activeSection === 'layering' && (
            <section className="guide-section">
              <h2>🔗 Master the Art of Necklace Layering</h2>
              
              <div className="styling-tips">
                <div className="tip-card featured">
                  <h3>The Golden Rule of Three</h3>
                  <p>Layer necklaces in groups of 3 with varying lengths: choker (14-16"), princess (18"), and matinee (20-24"). This creates perfect visual balance and prevents tangling.</p>
                </div>

                <div className="tips-grid">
                  <div className="tip-card">
                    <h3>Length Guidelines</h3>
                    <ul>
                      <li><strong>Choker:</strong> 14-16" - sits at the base of neck</li>
                      <li><strong>Princess:</strong> 18" - falls at the collarbone</li>
                      <li><strong>Matinee:</strong> 20-24" - reaches the bust</li>
                      <li><strong>Opera:</strong> 28-32" - falls below the bust</li>
                    </ul>
                  </div>

                  <div className="tip-card">
                    <h3>Mixing Textures</h3>
                    <p>Combine different chain styles:</p>
                    <ul>
                      <li>Delicate cable chain</li>
                      <li>Bold curb chain</li>
                      <li>Textured rope chain</li>
                      <li>Beaded chain</li>
                    </ul>
                  </div>

                  <div className="tip-card">
                    <h3>Pendant Pairing</h3>
                    <p>Mix pendant sizes and shapes:</p>
                    <ul>
                      <li>Start with your statement piece</li>
                      <li>Add smaller complementary pendants</li>
                      <li>Include one simple chain without pendant</li>
                      <li>Vary pendant shapes for interest</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pro-tips">
                <h3>Pro Tips for Perfect Layering</h3>
                <div className="pro-tips-list">
                  <div className="pro-tip">
                    <span className="tip-number">1</span>
                    <p><strong>Start with your focal piece:</strong> Choose one statement necklace as your centerpiece, then build around it.</p>
                  </div>
                  <div className="pro-tip">
                    <span className="tip-number">2</span>
                    <p><strong>Maintain 2-inch spacing:</strong> Keep at least 2 inches between each layer to prevent tangling.</p>
                  </div>
                  <div className="pro-tip">
                    <span className="tip-number">3</span>
                    <p><strong>Consider your neckline:</strong> V-necks work with longer pieces, crew necks with shorter layers.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Ring Stacking */}
          {activeSection === 'stacking' && (
            <section className="guide-section">
              <h2>💍 Ring Stacking Mastery</h2>
              
              <div className="styling-tips">
                <div className="tip-card featured">
                  <h3>The Art of Balance</h3>
                  <p>Mix thin and thick rings, but avoid overcrowding. The key is to create visual interest while maintaining elegance. Leave some fingers bare for balance.</p>
                </div>

                <div className="tips-grid">
                  <div className="tip-card">
                    <h3>Stacking Formulas</h3>
                    <ul>
                      <li><strong>Classic Stack:</strong> 1 statement + 2 thin bands</li>
                      <li><strong>Minimalist Stack:</strong> 3 similar thin bands</li>
                      <li><strong>Mixed Stack:</strong> Different metals and textures</li>
                      <li><strong>Gemstone Stack:</strong> Varying gemstone colors</li>
                    </ul>
                  </div>

                  <div className="tip-card">
                    <h3>Finger Placement</h3>
                    <p>Strategic ring placement:</p>
                    <ul>
                      <li>Index finger: Bold statement rings</li>
                      <li>Middle finger: Largest finger, can handle big rings</li>
                      <li>Ring finger: Traditional for engagement/wedding</li>
                      <li>Pinky finger: Delicate rings or signets</li>
                    </ul>
                  </div>

                  <div className="tip-card">
                    <h3>Texture Mixing</h3>
                    <p>Combine different finishes:</p>
                    <ul>
                      <li>Polished and matte finishes</li>
                      <li>Smooth and textured bands</li>
                      <li>Plain and gemstone rings</li>
                      <li>Thin and chunky styles</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="size-guide">
                <h3>Ring Sizing Tips</h3>
                <p>For comfortable stacking:</p>
                <ul>
                  <li>Size up by 1/4 size when stacking 3+ rings</li>
                  <li>Consider knuckle size for comfort</li>
                  <li>Account for seasonal finger swelling</li>
                  <li>Test comfort throughout the day</li>
                </ul>
              </div>
            </section>
          )}

          {/* Earring Selection */}
          {activeSection === 'earrings' && (
            <section className="guide-section">
              <h2>👂 Perfect Earring Selection</h2>
              
              <div className="face-shape-guide">
                <h3>Choose Based on Your Face Shape</h3>
                <div className="face-shapes-grid">
                  <div className="face-shape-card">
                    <h4>Round Face</h4>
                    <p><strong>Best:</strong> Angular shapes, long drops, linear designs</p>
                    <p><strong>Avoid:</strong> Large hoops, round studs</p>
                    <p><strong>Goal:</strong> Elongate and add angles</p>
                  </div>
                  
                  <div className="face-shape-card">
                    <h4>Square Face</h4>
                    <p><strong>Best:</strong> Curved shapes, hoops, soft designs</p>
                    <p><strong>Avoid:</strong> Geometric, angular styles</p>
                    <p><strong>Goal:</strong> Soften strong jawlines</p>
                  </div>
                  
                  <div className="face-shape-card">
                    <h4>Oval Face</h4>
                    <p><strong>Best:</strong> Almost any style works!</p>
                    <p><strong>Especially good:</strong> Studs, hoops, drops</p>
                    <p><strong>Goal:</strong> Maintain natural balance</p>
                  </div>
                  
                  <div className="face-shape-card">
                    <h4>Heart-Shaped Face</h4>
                    <p><strong>Best:</strong> Teardrops, chandeliers, wider bottoms</p>
                    <p><strong>Avoid:</strong> Top-heavy designs</p>
                    <p><strong>Goal:</strong> Balance narrow chin</p>
                  </div>
                </div>
              </div>

              <div className="hair-considerations">
                <h3>Hair Style Considerations</h3>
                <div className="tips-grid">
                  <div className="tip-card">
                    <h3>Short Hair</h3>
                    <p>Perfect opportunity for statement earrings. Try bold hoops, dramatic drops, or sculptural designs.</p>
                  </div>
                  
                  <div className="tip-card">
                    <h3>Long Hair</h3>
                    <p>Choose earrings that won't get lost. Opt for larger studs, hoops that peek through, or ear climbers.</p>
                  </div>
                  
                  <div className="tip-card">
                    <h3>Updos</h3>
                    <p>Showcase dramatic earrings. This is the time for chandeliers, long drops, or bold statement pieces.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Occasion Styling */}
          {activeSection === 'occasions' && (
            <section className="guide-section">
              <h2>✨ Occasion-Perfect Styling</h2>
              
              <div className="occasions-grid">
                <div className="occasion-card">
                  <h3>💼 Professional/Work</h3>
                  <div className="occasion-content">
                    <p><strong>Philosophy:</strong> Polished, understated elegance</p>
                    <ul>
                      <li>Small to medium stud earrings</li>
                      <li>Delicate chain necklaces</li>
                      <li>Classic watch</li>
                      <li>Simple ring stack (2-3 rings max)</li>
                    </ul>
                    <p className="styling-note"><strong>Tip:</strong> Stick to one metal family for cohesion</p>
                  </div>
                </div>

                <div className="occasion-card">
                  <h3>☀️ Casual Day Out</h3>
                  <div className="occasion-content">
                    <p><strong>Philosophy:</strong> Relaxed, personal expression</p>
                    <ul>
                      <li>Layered necklaces (2-3 pieces)</li>
                      <li>Mixed metal jewelry</li>
                      <li>Fun ring combinations</li>
                      <li>Comfortable hoop earrings</li>
                    </ul>
                    <p className="styling-note"><strong>Tip:</strong> Perfect time to experiment with trends</p>
                  </div>
                </div>

                <div className="occasion-card">
                  <h3>🌃 Evening/Formal</h3>
                  <div className="occasion-content">
                    <p><strong>Philosophy:</strong> One statement piece as focal point</p>
                    <ul>
                      <li>Choose: Statement necklace OR dramatic earrings</li>
                      <li>Elegant tennis bracelet</li>
                      <li>Classic rings (wedding/engagement)</li>
                      <li>Consider dress neckline</li>
                    </ul>
                    <p className="styling-note"><strong>Tip:</strong> Less is more - don't compete with formal wear</p>
                  </div>
                </div>

                <div className="occasion-card">
                  <h3>💕 Date Night</h3>
                  <div className="occasion-content">
                    <p><strong>Philosophy:</strong> Romantic, personal touches</p>
                    <ul>
                      <li>Feminine details like pearls</li>
                      <li>Rose gold accents</li>
                      <li>Pieces with personal meaning</li>
                      <li>Subtle sparkle and shine</li>
                    </ul>
                    <p className="styling-note"><strong>Tip:</strong> Wear something that makes you feel confident</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Metal Mixing */}
          {activeSection === 'mixing' && (
            <section className="guide-section">
              <h2>🏆 Master Metal Mixing</h2>
              
              <div className="metal-guide">
                <div className="tip-card featured">
                  <h3>The Modern Approach</h3>
                  <p>Gone are the days of matching everything! Modern jewelry styling embraces mixing metals for a personalized, collected-over-time look.</p>
                </div>

                <div className="metal-combinations">
                  <h3>Winning Metal Combinations</h3>
                  <div className="combinations-grid">
                    <div className="combo-card">
                      <h4>🥇 Gold + Silver</h4>
                      <p>The classic mix. Start with one dominant metal (60-70%) and use the other as accent (30-40%).</p>
                    </div>
                    
                    <div className="combo-card">
                      <h4>🌹 Rose Gold + Yellow Gold</h4>
                      <p>Warm and harmonious. Perfect for creating a romantic, vintage-inspired look.</p>
                    </div>
                    
                    <div className="combo-card">
                      <h4>⚪ White Gold + Silver</h4>
                      <p>Subtle sophistication. These cool tones work seamlessly together.</p>
                    </div>
                    
                    <div className="combo-card">
                      <h4>🌈 Triple Mix</h4>
                      <p>Advanced styling: Combine all three metals with one dominant tone.</p>
                    </div>
                  </div>
                </div>

                <div className="mixing-rules">
                  <h3>Rules for Successful Metal Mixing</h3>
                  <div className="rules-list">
                    <div className="rule-item">
                      <span className="rule-number">1</span>
                      <p><strong>Choose a dominant metal:</strong> Let one metal make up 60-70% of your look</p>
                    </div>
                    <div className="rule-item">
                      <span className="rule-number">2</span>
                      <p><strong>Bridge with two-tone pieces:</strong> Use jewelry that combines metals as connectors</p>
                    </div>
                    <div className="rule-item">
                      <span className="rule-number">3</span>
                      <p><strong>Consider your skin tone:</strong> Warm undertones favor gold, cool favor silver</p>
                    </div>
                    <div className="rule-item">
                      <span className="rule-number">4</span>
                      <p><strong>Match your hardware:</strong> Coordinate with watch, belt buckle, or bag hardware</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}


        </div>

        {/* Quick Reference Section */}
        <div className="quick-reference">
          <h2>Quick Styling Reference</h2>
          <div className="reference-grid">
            <div className="reference-card">
              <h3>🎯 Golden Rules</h3>
              <ul>
                <li>One statement piece per outfit</li>
                <li>Match metals to outfit hardware</li>
                <li>Consider your neckline</li>
                <li>Leave some space - avoid overcrowding</li>
              </ul>
            </div>
            
            <div className="reference-card">
              <h3>📏 Proportion Guide</h3>
              <ul>
                <li>Petite frame: Delicate, smaller pieces</li>
                <li>Average frame: Most styles work</li>
                <li>Plus size: Bold, statement pieces</li>
                <li>Tall frame: Longer necklaces, larger earrings</li>
              </ul>
            </div>
            
            <div className="reference-card">
              <h3>🎨 Color Coordination</h3>
              <ul>
                <li>Match cool gemstones with cool metals</li>
                <li>Warm stones with warm metals</li>
                <li>Neutral stones work with any metal</li>
                <li>Consider outfit color palette</li>
              </ul>
            </div>
            
            <div className="reference-card">
              <h3>⏰ Time-Saving Tips</h3>
              <ul>
                <li>Pre-plan jewelry for special events</li>
                <li>Keep go-to combinations ready</li>
                <li>Organize by metal or occasion</li>
                <li>Have backup pieces for broken jewelry</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="styling-cta">
          <h2>Need Personal Styling Help?</h2>
          <p>Our jewelry experts are here to help you create the perfect look. Book a complimentary styling consultation to discover what works best for your style, lifestyle, and budget.</p>
          <button className="cta-button">Schedule Consultation</button>
        </div> */}
      </div>
    </div>
  );
};