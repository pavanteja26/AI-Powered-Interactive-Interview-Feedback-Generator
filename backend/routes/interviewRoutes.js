const express = require('express');
const router = express.Router();
const { 
  startInterview, 
  evaluateAnswer: oldEvaluate, 
} = require('../controllers/interviewController');
const { 
  generateQuestion, 
  evaluateAnswer, 
} = require('../controllers/interviewSessionController');

router.post('/start', startInterview);
router.post('/evaluate', oldEvaluate);

// New production-level endpoints
router.post('/generate-question', generateQuestion);
router.post('/evaluate-answer', evaluateAnswer);

module.exports = router;
