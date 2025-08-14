# Real-Time Streak Maintenance System

## Overview

The Momentum app now includes a comprehensive real-time streak maintenance system that automatically handles streak calculations, validations, and updates without requiring manual user intervention.

## Features

### 🚀 Automatic Streak Maintenance
- **Daily Streak Reset**: Automatically resets streaks at midnight
- **Hourly Validation**: Checks for streak inconsistencies every hour
- **Real-time Updates**: Streaks are updated immediately when habits are toggled
- **Background Processing**: All maintenance runs in the background

### 📊 Accurate Streak Calculation
- **Event-Based Logic**: Streaks are calculated based on actual completion events
- **Date Validation**: Proper handling of timezone and date boundaries
- **Gap Detection**: Automatically detects and handles missed days
- **Historical Analysis**: Uses last 30 days of data for accurate calculations

### 🔧 Streak Service API
- **Validation Endpoints**: Check and fix streak inconsistencies
- **Statistics**: Get detailed streak analytics
- **Manual Refresh**: Force streak updates when needed
- **Scheduler Control**: Manage automated maintenance tasks

## Architecture

### Services

#### 1. StreakService (`services/streakService.js`)
- Core streak calculation logic
- User streak updates
- Streak validation and consistency checks
- Statistical analysis

#### 2. SchedulerService (`services/schedulerService.js`)
- Automated task scheduling
- Daily midnight resets
- Hourly validations
- Background processing management

### API Endpoints

#### Streak Management
- `GET /api/streaks/validate` - Validate and fix user streaks
- `GET /api/streaks/stats` - Get user streak statistics
- `POST /api/streaks/refresh` - Manually refresh user streaks

#### Scheduler Control
- `GET /api/streaks/scheduler/status` - Get scheduler status
- `POST /api/streaks/scheduler/start` - Start scheduler
- `POST /api/streaks/scheduler/stop` - Stop scheduler
- `POST /api/streaks/scheduler/validate-all` - Validate all users
- `POST /api/streaks/scheduler/catch-up` - Force catch-up maintenance for missed windows

## How It Works

### 1. Automatic Scheduling
```javascript
// Scheduler starts automatically when server starts
const schedulerService = new SchedulerService();
schedulerService.start();
```

### 2. Catch-Up Mechanism
- **Automatic Recovery**: Detects missed maintenance when server restarts
- **Smart Scheduling**: Runs missed daily resets automatically
- **Gap Detection**: Identifies and fixes inconsistencies from downtime
- **Immediate Validation**: Always validates streaks on server startup

### 3. Server Restart Handling
When the server restarts after being down:

1. **Startup Detection**: Scheduler detects it's a new day or missed maintenance
2. **Automatic Catch-up**: Runs any missed daily resets automatically
3. **Full Validation**: Performs comprehensive streak validation for all users
4. **Smart Scheduling**: Resumes normal maintenance schedule from current time
5. **Inconsistency Fixing**: Automatically corrects any streaks that became inaccurate during downtime

**Example Scenario:**
- Server runs Monday, Tuesday, Wednesday
- Server goes down Thursday night
- Server restarts Friday morning
- Scheduler automatically:
  - Detects missed Thursday maintenance
  - Runs Thursday's streak reset
  - Validates all user streaks
  - Resumes normal Friday schedule

### 3. Daily Streak Reset
- Runs at midnight every day
- Updates all user streaks based on completion events
- Handles timezone differences properly
- **Auto-catch-up**: Runs missed resets when server restarts

### 4. Hourly Validation
- Checks for streak inconsistencies every hour
- Automatically fixes any discrepancies found
- Logs all activities for monitoring
- **Continuous Monitoring**: Maintains consistency even during downtime

### 5. Real-time Updates
- Streaks are updated immediately when habits are toggled
- Uses the StreakService for accurate calculations
- Maintains consistency across all operations
- **Server Restart Safe**: Automatically recovers from downtime

## Streak Calculation Logic

### Current Streak
```javascript
// Calculate streak by checking consecutive days backwards from today
let streak = 0;
let currentDate = new Date(startOfToday);

for (let i = 0; i < 30; i++) {
  const wasCompleted = events.some(event => 
    event.day.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
  );
  
  if (wasCompleted) {
    streak++;
  } else {
    break; // Break streak on first gap
  }
  
  currentDate.setDate(currentDate.getDate() - 1);
}
```

### Streak Validation
- Compares stored streaks with calculated streaks
- Automatically fixes any inconsistencies
- Maintains audit trail of changes

## Benefits

### For Users
- **Accurate Streaks**: No more manual streak management
- **Real-time Updates**: See streak changes immediately
- **Consistent Experience**: Streaks work the same way for everyone
- **Motivation**: Accurate tracking encourages habit formation

### For Developers
- **Maintainable Code**: Centralized streak logic
- **Scalable Architecture**: Easy to extend and modify
- **Monitoring**: Comprehensive logging and status tracking
- **Testing**: Isolated services for easier testing

## Configuration

### Environment Variables
```bash
# Optional: Customize timezone for streak calculations
TZ=Asia/Kolkata  # Default timezone for date calculations
```

### Scheduler Settings
```javascript
// Customize intervals in schedulerService.js
const DAILY_RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const HOURLY_VALIDATION_INTERVAL = 60 * 60 * 1000; // 1 hour
```

## Monitoring

### Logs
The system provides comprehensive logging:
- Daily reset operations
- Hourly validations
- Streak inconsistencies found and fixed
- Scheduler status changes

### Status Endpoints
```bash
# Check scheduler status
GET /api/streaks/scheduler/status

# Response example:
{
  "status": {
    "isRunning": true,
    "activeIntervals": ["dailyReset", "hourlyValidation"],
    "totalIntervals": 2
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Streaks Not Updating
- Check scheduler status: `GET /api/streaks/scheduler/status`
- Manually trigger validation: `POST /api/streaks/refresh`
- Verify database connectivity

#### 2. Scheduler Not Running
- Check server logs for startup messages
- Restart scheduler: `POST /api/streaks/scheduler/start`
- Verify service initialization

#### 3. Inconsistent Streaks
- Run full validation: `POST /api/streaks/scheduler/validate-all`
- Check completion event data integrity
- Verify timezone settings

### Debug Mode
Enable detailed logging by setting environment variable:
```bash
DEBUG=streaks npm run dev
```

## Future Enhancements

### Planned Features
- **WebSocket Integration**: Real-time streak updates to frontend
- **Advanced Analytics**: Streak patterns and insights
- **Custom Schedules**: User-defined streak reset times
- **Streak Challenges**: Social features and competitions
- **Mobile Notifications**: Streak milestone alerts

### Performance Optimizations
- **Caching**: Redis-based streak caching
- **Batch Processing**: Bulk streak updates
- **Database Indexing**: Optimized queries for large datasets
- **Background Workers**: Separate process for heavy operations

## Contributing

When modifying the streak system:
1. Update tests in `test-streaks.js`
2. Document API changes
3. Update this documentation
4. Test with various timezone scenarios
5. Verify streak calculation accuracy

## Support

For issues or questions about the streak maintenance system:
1. Check server logs for error messages
2. Verify scheduler status
3. Test with manual validation endpoints
4. Review this documentation
5. Contact the development team
