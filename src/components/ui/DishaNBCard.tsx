import '../../nb-card.css';

export function DishaNBCard() {
  return (
    <div className="nb-card">
      <div className="nb-card-grid" />

      {/* Dashed border SVG */}
      <div className="bold-pattern" style={{ position:'absolute',top:0,right:0,width:'5em',height:'5em',opacity:0.12,pointerEvents:'none',zIndex:1 }}>
        <svg viewBox="0 0 100 100">
          <path strokeDasharray="15 10" strokeWidth="10" stroke="#000" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z" />
        </svg>
      </div>

      {/* Header */}
      <div className="nb-card-header">
        <span>Disha Jain</span>
        <span className="nb-card-tag">Est. 2024</span>
      </div>

      {/* Body */}
      <div className="nb-card-body">
        <p className="nb-card-desc">
          Brand & UI/UX designer crafting bold visual identities and seamless digital experiences that speak, connect, and leave an impact.
        </p>

        <div className="nb-feature-grid">
          {/* Brand Identity */}
          <div className="nb-feature-item">
            <div className="nb-feature-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="nb-feature-text">Brand Identity</span>
          </div>

          {/* UI/UX Design */}
          <div className="nb-feature-item">
            <div className="nb-feature-icon">
              <svg viewBox="0 0 24 24"><path d="M20,4C21.1,4 22,4.9 22,6V18C22,19.1 21.1,20 20,20H4C2.9,20 2,19.1 2,18V6C2,4.9 2.9,4 4,4H20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z"/></svg>
            </div>
            <span className="nb-feature-text">UI / UX Design</span>
          </div>

          {/* Typography */}
          <div className="nb-feature-item">
            <div className="nb-feature-icon">
              <svg viewBox="0 0 24 24"><path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"/></svg>
            </div>
            <span className="nb-feature-text">Typography</span>
          </div>

          {/* Visual Storytelling */}
          <div className="nb-feature-item">
            <div className="nb-feature-icon">
              <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8L10,17Z"/></svg>
            </div>
            <span className="nb-feature-text">Visual Stories</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="nb-card-footer">
          <a
            href="https://linkedin.com/in/disha-jain-94016b333"
            target="_blank"
            rel="noopener noreferrer"
            className="nb-card-btn"
          >
            Let's Collab ↗
          </a>
        </div>
      </div>

      {/* Dots decoration */}
      <div className="nb-dots-pattern">
        <svg viewBox="0 0 80 40">
          {[10,30,50,70].map(x => <circle key={x+10} fill="#000" r="3" cy="10" cx={x}/>)}
          {[20,40,60].map(x => <circle key={x+20} fill="#000" r="3" cy="20" cx={x}/>)}
          {[10,30,50,70].map(x => <circle key={x+30} fill="#000" r="3" cy="30" cx={x}/>)}
        </svg>
      </div>

      <div className="nb-accent-shape" />
      <div className="nb-corner-slice" />

      <div className="nb-stamp">
        <span className="nb-stamp-text">Design&nbsp;First</span>
      </div>
    </div>
  );
}
