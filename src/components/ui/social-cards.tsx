import React from 'react';

export function SocialCards() {
  return (
    <div className="main select-none pointer-events-auto">
      <style dangerouslySetInnerHTML={{ __html: `
        .main {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .up {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
        }

        .down {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
        }

        .card1 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 90px 5px 5px 5px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .instagram-icon {
          margin-top: 1.2em;
          margin-left: 1.2em;
          fill: #cc39a4;
          transition: fill .2s ease-in-out;
        }

        .card2 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 5px 90px 5px 5px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .linkedin-icon {
          margin-top: 1.2em;
          margin-left: -1.2em;
          fill: #0A66C2;
          transition: fill .2s ease-in-out;
        }

        .card3 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 5px 5px 5px 90px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .github-icon {
          margin-top: -1.2em;
          margin-left: 1.2em;
          fill: #171515;
          transition: fill .2s ease-in-out;
        }

        .card4 {
          width: 90px;
          height: 90px;
          outline: none;
          border: none;
          background: white;
          border-radius: 5px 5px 90px 5px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
          transition: .2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gmail-icon {
          margin-top: -1.2em;
          margin-left: -1.2em;
          fill: #EA4335;
          transition: fill .2s ease-in-out;
        }

        .card1:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #cc39a4;
        }

        .card1:hover .instagram-icon {
          fill: white;
        }

        .card2:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #0A66C2;
        }

        .card2:hover .linkedin-icon {
          fill: white;
        }

        .card3:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: black;
        }

        .card3:hover .github-icon {
          fill: white;
        }

        .card4:hover {
          cursor: pointer;
          scale: 1.1;
          background-color: #EA4335;
        }

        .card4:hover .gmail-icon {
          fill: white;
        }
      `}} />
      <div className="up">
        {/* Instagram (Top-Left) */}
        <a 
          href="https://instagram.com/anii.ssshhh" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="card1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="30px" height="30px" fillRule="nonzero" className="instagram-icon">
            <g fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" style={{ mixBlendMode: "normal" }}>
              <g transform="scale(8,8)">
                <path d="M11.46875,5c-3.55078,0 -6.46875,2.91406 -6.46875,6.46875v9.0625c0,3.55078 2.91406,6.46875 6.46875,6.46875h9.0625c3.55078,0 6.46875,-2.91406 6.46875,-6.46875v-9.0625c0,-3.55078 -2.91406,-6.46875 -6.46875,-6.46875zM11.46875,7h9.0625c2.47266,0 4.46875,1.99609 4.46875,4.46875v9.0625c0,2.47266 -1.99609,4.46875 -4.46875,4.46875h-9.0625c-2.47266,0 -4.46875,-1.99609 -4.46875,-4.46875v-9.0625c0,-2.47266 1.99609,-4.46875 4.46875,-4.46875zM21.90625,9.1875c-0.50391,0 -0.90625,0.40234 -0.90625,0.90625c0,0.50391 0.40234,0.90625 0.90625,0.90625c0.50391,0 0.90625,-0.40234 0.90625,-0.90625c0,-0.50391 -0.40234,-0.90625 -0.90625,-0.90625zM16,10c-3.30078,0 -6,2.69922 -6,6c0,3.30078 2.69922,6 6,6c3.30078,0 6,-2.69922 6,-6c0,-3.30078 -2.69922,-6 -6,-6zM16,12c2.22266,0 4,1.77734 4,4c0,2.22266 -1.77734,4 -4,4c-2.22266,0 -4,-1.77734 -4,-4c0,-2.22266 1.77734,-4 4,-4z"></path>
              </g>
            </g>
          </svg>
        </a>

        {/* LinkedIn (Top-Right - replaces Twitter) */}
        <a 
          href="https://linkedin.com/in/disha-jain-94016b333" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="card2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px" fill="currentColor" className="linkedin-icon">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>

      <div className="down">
        {/* GitHub (Bottom-Left) */}
        <a 
          href="https://github.com/disha-jain" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="card3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px" fill="currentColor" className="github-icon">
            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
          </svg>
        </a>

        {/* Gmail (Bottom-Right - replaces Discord) */}
        <a 
          href="mailto:Jain.disha2712@gmail.com" 
          className="card4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px" fill="currentColor" className="gmail-icon">
            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.866l5.6-6.812zm9.201-1.451l4.623-3.747v9.46l-4.623-5.713z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
