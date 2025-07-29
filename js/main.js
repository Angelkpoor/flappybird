// Initialize and start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Start the game loop
    game.run();
    
    console.log('Flappy Bird game initialized and running!');
});