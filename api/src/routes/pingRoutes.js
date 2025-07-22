// ===== FILE: routes/pingRoutes.js =====
import express from 'express';

const router = express.Router();

// GET /ping - Simple health check
router.get('/ping', (req, res) => {
    res.json({ 
        success: true,
        message: 'Coffee Shop Finder API is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// GET /health - Detailed health check
router.get('/health', async (req, res) => {
    try {
        // You can add database health check here
        res.json({
            success: true,
            status: 'healthy',
            services: {
                database: 'connected',
                api: 'operational'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

export default router;