/**
 * SGRO HOMES — Coming Soon Landing Page Interaction Script
 * Minimal, lightweight Vanilla JavaScript for ambient depth micro-interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    const applianceStage = document.getElementById('applianceStage');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Parallax configuration
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId = null;
    const lerpFactor = 0.06; // Smoothness factor
    const maxMovement = 18;  // Maximum pixel offset range

    /**
     * Check if parallax micro-interaction should be active
     */
    function isParallaxAllowed() {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        const isSmallScreen = window.innerWidth <= 768;
        return !isTouchDevice && !isSmallScreen && !prefersReducedMotion.matches;
    }

    /**
     * Mouse move event handler
     */
    function handleMouseMove(e) {
        if (!isParallaxAllowed()) return;

        // Normalize coordinates relative to window center (-1 to +1)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        mouseX = (e.clientX - centerX) / centerX;
        mouseY = (e.clientY - centerY) / centerY;
    }

    /**
     * Smooth Linear Interpolation Animation Loop (60fps)
     */
    function updateParallax() {
        if (isParallaxAllowed() && applianceStage) {
            const targetX = mouseX * maxMovement;
            const targetY = mouseY * maxMovement;

            currentX += (targetX - currentX) * lerpFactor;
            currentY += (targetY - currentY) * lerpFactor;

            const rotateY = currentX * 0.15;
            const rotateX = -currentY * 0.15;

            applianceStage.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        } else if (applianceStage) {
            applianceStage.style.transform = '';
        }

        animationFrameId = requestAnimationFrame(updateParallax);
    }

    /**
     * Handle Window Resize
     */
    function handleResize() {
        if (!isParallaxAllowed() && applianceStage) {
            applianceStage.style.transform = '';
        }
    }

    // Initialize event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Start smooth animation loop
    animationFrameId = requestAnimationFrame(updateParallax);

    // Add loaded class to body for state handling
    document.body.classList.add('js-loaded');
});
