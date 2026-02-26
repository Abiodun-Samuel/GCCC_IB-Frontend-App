import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * ConfettiShower Component
 * 
 * A celebration confetti animation that automatically dismisses after a specified duration.
 * 
 * @param {Object} props
 * @param {number} props.duration - Duration in seconds for confetti display (default: 5)
 * @param {number} props.pieceCount - Number of confetti pieces (default: 100)
 * @param {string[]} props.colors - Custom color palette (optional)
 * @param {Function} props.onComplete - Callback fired when confetti animation completes
 */
const ConfettiShower = ({
    duration = 5,
    pieceCount = 150,
    colors,
    onComplete
}) => {
    const [isVisible, setIsVisible] = useState(true);

    // Default color palette
    const DEFAULT_COLORS = [
        '#FDC44C', // Gold
        '#1F7A8C', // Teal
        '#C44D58', // Rose
        '#2A9D8F', // Emerald
        '#6A0DAD', // Purple
        '#000000', // Black
        '#00f123', // Green
        '#00f'     // Blue
    ];

    const colorPalette = colors || DEFAULT_COLORS;

    // Memoize confetti pieces array for performance
    const confettiPieces = useMemo(
        () => Array.from({ length: pieceCount }),
        [pieceCount]
    );

    // Auto-dismiss confetti after duration
    useEffect(() => {
        if (duration <= 0) return;

        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, duration * 1000);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    // Generate unique styles for each confetti piece
    const confettiStyles = useMemo(() => {
        return confettiPieces.map((_, index) => {
            const delay = Math.random() * 2; // 0-2s stagger
            const fallDuration = 2 + Math.random() * 2; // 2-4s fall time
            const leftPosition = Math.random() * 100; // 0-100% horizontal
            const size = 5 + Math.random() * 5; // 5-10px size
            const rotation = Math.random() * 360; // Initial rotation

            return {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: colorPalette[index % colorPalette.length],
                opacity: 0.9,
                left: `${leftPosition}vw`,
                animation: `confetti-fall ${fallDuration}s linear ${delay}s infinite`,
                borderRadius: '2px',
                transform: `rotate(${rotation}deg)`,
                willChange: 'transform, opacity'
            };
        });
    }, [confettiPieces, colorPalette]);

    if (!isVisible) return null;

    return (
        <>
            <style>
                {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-50vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(150vh) rotate(720deg);
              opacity: 0.5;
            }
          }
          
          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            pointer-events: none;
            z-index: 9999;
          }
          
          .confetti-piece {
            position: absolute;
          }
        `}
            </style>

            <div className="confetti-container" role="presentation" aria-hidden="true">
                {confettiPieces.map((_, index) => (
                    <div
                        key={`confetti-${index}`}
                        className="confetti-piece"
                        style={confettiStyles[index]}
                    />
                ))}
            </div>
        </>
    );
};

ConfettiShower.propTypes = {
    duration: PropTypes.number,
    pieceCount: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    onComplete: PropTypes.func
};

export default ConfettiShower;