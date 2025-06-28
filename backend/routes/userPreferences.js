import express from 'express';
import { runQuery, runStatement } from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user preferences
router.get('/', async (req, res) => {
  try {
    const { preference_type } = req.query;
    
    if (!preference_type) {
      return res.status(400).json({ error: 'Preference type is required' });
    }
    
    const userId = req.user.id;
    
    const preferences = await runQuery(
      'SELECT preference_data FROM user_preferences WHERE user_id = ? AND preference_type = ?',
      [userId, preference_type]
    );
    
    if (preferences.length === 0) {
      return res.json({ success: true, columns: null });
    }
    
    res.json({ 
      success: true, 
      columns: preferences[0].preference_data 
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
});

// Save user preferences
router.post('/', async (req, res) => {
  try {
    const { preference_type, preference_data } = req.body;
    
    if (!preference_type || !preference_data) {
      return res.status(400).json({ error: 'Preference type and data are required' });
    }
    
    const userId = req.user.id;
    
    // Check if preference exists
    const existingPrefs = await runQuery(
      'SELECT id FROM user_preferences WHERE user_id = ? AND preference_type = ?',
      [userId, preference_type]
    );
    
    if (existingPrefs.length > 0) {
      // Update existing preference
      await runStatement(
        'UPDATE user_preferences SET preference_data = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND preference_type = ?',
        [preference_data, userId, preference_type]
      );
    } else {
      // Insert new preference
      await runStatement(
        'INSERT INTO user_preferences (user_id, preference_type, preference_data) VALUES (?, ?, ?)',
        [userId, preference_type, preference_data]
      );
    }
    
    res.json({ success: true, message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ error: 'Failed to save user preferences' });
  }
});

export default router;