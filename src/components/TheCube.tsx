import React, { useEffect, useRef } from 'react';
// @ts-ignore
import { initGame } from './TheCubeGame.js';
import './TheCube.css';

export function TheCube() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    try {
      initGame();
    } catch (e: any) {
      console.error(e);
    }

    // Direct mousedown/touchstart listeners on .ui__game container to prevent click swallowing by drag controls
    const gameContainer = document.querySelector('.ui__game');
    if (gameContainer) {
      const handleStart = (e: Event) => {
        const gameInstance = (window as any).game;
        if (gameInstance && gameInstance.state === 0) {
          gameInstance.game(true);
        }
      };

      gameContainer.addEventListener('mousedown', handleStart);
      gameContainer.addEventListener('touchstart', handleStart);

      return () => {
        gameContainer.removeEventListener('mousedown', handleStart);
        gameContainer.removeEventListener('touchstart', handleStart);
      };
    }
  }, []);

  return (
    <div className="the-cube-game w-[320px] h-[320px] relative overflow-hidden flex flex-col justify-between select-none pointer-events-auto cursor-pointer">
      <div className="ui">
        <div className="ui__background"></div>
        <div className="ui__game"></div>

        <div className="ui__texts">
          <h1 className="text text--title">
            <span>THE</span>
            <span>CUBE</span>
          </h1>
          <div className="text text--note">
            Click to start
          </div>
          <div className="text text--timer">
            0:00
          </div>
          <div className="text text--complete">
            <span>Complete!</span>
          </div>
          <div className="text text--best-time">
            <span>Best Time!</span>
          </div>
        </div>

        {/* Pre-render range divs directly so React does not get out of sync with DOM replacements */}
        <div className="ui__prefs">
          <div {...{ className: "range", name: "size" } as any}>
            <div className="range__label">Cube Size</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list">
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
            </div>
          </div>

          <div {...{ className: "range", name: "flip" } as any}>
            <div className="range__label">Flip Type</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list">
              <div>Swift&nbsp;</div>
              <div>Smooth</div>
              <div>Bounce</div>
            </div>
          </div>

          <div {...{ className: "range", name: "scramble" } as any}>
            <div className="range__label">Scramble Length</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list">
              <div>20</div>
              <div>25</div>
              <div>30</div>
            </div>
          </div>

          <div {...{ className: "range", name: "fov" } as any}>
            <div className="range__label">Camera Angle</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list">
              <div>Ortographic</div>
              <div>Perspective</div>
            </div>
          </div>

          <div {...{ className: "range", name: "theme" } as any}>
            <div className="range__label">Color Scheme</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list">
              <div>Cube</div>
              <div>Erno</div>
              <div>Dust</div>
              <div>Camo</div>
              <div>Rain</div>
            </div>
          </div>
        </div>

        <div className="ui__theme">
          <div {...{ className: "range range--type-color range--color-hue", name: "hue" } as any}>
            <div className="range__label">Hue</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list"></div>
          </div>

          <div {...{ className: "range range--type-color range--color-saturation", name: "saturation" } as any}>
            <div className="range__label">Saturation</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list"></div>
          </div>

          <div {...{ className: "range range--type-color range--color-lightness", name: "lightness" } as any}>
            <div className="range__label">Lightness</div>
            <div className="range__track">
              <div className="range__track-line"></div>
              <div className="range__handle"><div></div></div>
            </div>
            <div className="range__list"></div>
          </div>
        </div>

        <div className="ui__stats">
          <div {...{ className: "stats", name: "cube-size" } as any}>
            <i>Cube:</i><b>3x3x3</b>
          </div>
          <div {...{ className: "stats", name: "total-solves" } as any}>
            <i>Total solves:</i><b>-</b>
          </div>
          <div {...{ className: "stats", name: "best-time" } as any}>
            <i>Best time:</i><b>-</b>
          </div>
          <div {...{ className: "stats", name: "worst-time" } as any}>
            <i>Worst time:</i><b>-</b>
          </div>
          <div {...{ className: "stats", name: "average-5" } as any}>
            <i>Average of 5:</i><b>-</b>
          </div>
          <div {...{ className: "stats", name: "average-12" } as any}>
            <i>Average of 12:</i><b>-</b>
          </div>
          <div {...{ className: "stats", name: "average-25" } as any}>
            <i>Average of 25:</i><b>-</b>
          </div>
        </div>

        <div className="ui__buttons">
          <button className="btn btn--bl btn--stats"></button>
          <button className="btn btn--br btn--prefs"></button>
          <button className="btn btn--bl btn--back"></button>
          <button className="btn btn--br btn--theme"></button>
          <button className="btn btn--br btn--reset"></button>
        </div>
      </div>
    </div>
  );
}
