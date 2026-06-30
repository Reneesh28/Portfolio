import React from 'react';

/**
 * KineticTitle
 * Renders text with a continuous, bold kinetic glitch — duplicated ghost
 * layers in rose-pink and portal-cyan flicker and clip-jump behind the
 * main text on a loop. This is the "Mumbattan / Miles Morales" intensity
 * version: always-on, not just a one-time scroll reveal (pair with
 * StampReveal for the entrance, KineticTitle for the ongoing energy).
 *
 * Usage:
 *   <KineticTitle as="h1" className="font-display text-7xl">RENEESH</KineticTitle>
 */
const KineticTitle = ({ children, as = 'span', className = '' }) => {
    const Tag = as;
    const text = typeof children === 'string' ? children : '';

    return (
        <Tag className={`glitch-type ${className}`} data-text={text}>
            {children}
        </Tag>
    );
};

export default KineticTitle;