import StreakService from './streakService.js';

class SchedulerService {
  constructor() {
    this.intervals = new Map();
    this.isRunning = false;
    this.lastMaintenanceRun = null;
  }

  /**
   * Start the scheduler service
   */
  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting streak maintenance scheduler...');
    this.isRunning = true;

    // Check for missed maintenance and catch up
    this.catchUpMissedMaintenance();
    
    // Schedule daily streak reset at midnight
    this.scheduleDailyStreakReset();
    
    // Schedule hourly streak validation
    this.scheduleHourlyStreakValidation();
    
    // Schedule immediate streak validation for all users
    this.scheduleImmediateValidation();

    console.log('Streak maintenance scheduler started successfully');
  }

  /**
   * Stop the scheduler service
   */
  stop() {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    console.log('Stopping streak maintenance scheduler...');
    this.isRunning = false;

    // Clear all intervals
    for (const [name, interval] of this.intervals) {
      clearInterval(interval);
      console.log(`Cleared interval: ${name}`);
    }
    this.intervals.clear();

    console.log('Streak maintenance scheduler stopped');
  }

  /**
   * Check for missed maintenance and catch up
   */
  async catchUpMissedMaintenance() {
    try {
      console.log('Checking for missed maintenance windows...');
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Check if we missed today's maintenance
      const shouldRunToday = await this.shouldRunMaintenanceToday();
      
      if (shouldRunToday) {
        console.log('Running missed maintenance for today...');
        await this.performDailyStreakReset();
        this.lastMaintenanceRun = startOfToday;
      } else {
        console.log('No missed maintenance detected');
      }
      
      // Always run immediate validation to fix any inconsistencies
      await this.performInitialStreakValidation();
      
    } catch (error) {
      console.error('Error during catch-up maintenance:', error);
    }
  }

  /**
   * Check if maintenance should run today
   */
  async shouldRunMaintenanceToday() {
    try {
      // Check if we have any habits that need maintenance
      const { Habit } = await import('../models/Habit.js');
      const habitCount = await Habit.countDocuments();
      
      if (habitCount === 0) {
        return false; // No habits to maintain
      }
      
      // Check if we've already run maintenance today
      if (this.lastMaintenanceRun) {
        const lastRunDate = new Date(this.lastMaintenanceRun);
        const today = new Date();
        const isSameDay = lastRunDate.toDateString() === today.toDateString();
        
        if (isSameDay) {
          return false; // Already ran today
        }
      }
      
      return true; // Need to run maintenance
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      return true; // Default to running maintenance if we can't check
    }
  }

  /**
   * Schedule daily streak reset at midnight
   */
  scheduleDailyStreakReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Schedule the first reset
    setTimeout(async () => {
      await this.performDailyStreakReset();
      // Then schedule it every 24 hours
      this.intervals.set('dailyReset', setInterval(async () => {
        await this.performDailyStreakReset();
      }, 24 * 60 * 60 * 1000));
    }, timeUntilMidnight);

    console.log(`Daily streak reset scheduled for ${tomorrow.toISOString()}`);
  }

  /**
   * Schedule hourly streak validation
   */
  scheduleHourlyStreakValidation() {
    this.intervals.set('hourlyValidation', setInterval(async () => {
      await this.performHourlyStreakValidation();
    }, 60 * 60 * 1000)); // Every hour

    console.log('Hourly streak validation scheduled');
  }

  /**
   * Schedule immediate validation for all users
   */
  scheduleImmediateValidation() {
    // Run initial validation after 5 seconds to let the server fully start
    setTimeout(async () => {
      await this.performInitialStreakValidation();
    }, 5000);
  }

  /**
   * Perform daily streak reset
   */
  async performDailyStreakReset() {
    try {
      console.log(`[${new Date().toISOString()}] Starting daily streak reset...`);
      const updates = await StreakService.resetDailyStreaks();
      this.lastMaintenanceRun = new Date();
      console.log(`[${new Date().toISOString()}] Daily streak reset completed. Updated ${updates} habits.`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error during daily streak reset:`, error);
    }
  }

  /**
   * Perform hourly streak validation
   */
  async performHourlyStreakValidation() {
    try {
      console.log(`[${new Date().toISOString()}] Starting hourly streak validation...`);
      
      // Get all unique users
      const { Habit } = await import('../models/Habit.js');
      const users = await Habit.distinct('userId');
      
      let totalValidated = 0;
      let totalInconsistencies = 0;

      for (const userId of users) {
        const inconsistencies = await StreakService.validateStreaks(userId);
        if (inconsistencies.length > 0) {
          totalInconsistencies += inconsistencies.length;
          console.log(`User ${userId} has ${inconsistencies.length} streak inconsistencies`);
        }
        totalValidated++;
      }

      console.log(`[${new Date().toISOString()}] Hourly validation completed. Validated ${totalValidated} users, found ${totalInconsistencies} inconsistencies.`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error during hourly streak validation:`, error);
    }
  }

  /**
   * Perform initial streak validation for all users
   */
  async performInitialStreakValidation() {
    try {
      console.log(`[${new Date().toISOString()}] Starting initial streak validation...`);
      
      const { Habit } = await import('../models/Habit.js');
      const users = await Habit.distinct('userId');
      
      let totalValidated = 0;
      let totalFixed = 0;

      for (const userId of users) {
        const inconsistencies = await StreakService.validateStreaks(userId);
        if (inconsistencies.length > 0) {
          // Fix inconsistencies by updating streaks
          await StreakService.updateUserStreaks(userId);
          totalFixed += inconsistencies.length;
          console.log(`Fixed ${inconsistencies.length} streak inconsistencies for user ${userId}`);
        }
        totalValidated++;
      }

      console.log(`[${new Date().toISOString()}] Initial validation completed. Validated ${totalValidated} users, fixed ${totalFixed} inconsistencies.`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error during initial streak validation:`, error);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeIntervals: Array.from(this.intervals.keys()),
      totalIntervals: this.intervals.size,
      lastMaintenanceRun: this.lastMaintenanceRun,
      nextScheduledReset: this.getNextScheduledReset()
    };
  }

  /**
   * Get next scheduled reset time
   */
  getNextScheduledReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  /**
   * Manually trigger streak validation for a specific user
   */
  async validateUserStreaks(userId) {
    try {
      console.log(`[${new Date().toISOString()}] Manually validating streaks for user ${userId}...`);
      const updates = await StreakService.updateUserStreaks(userId);
      console.log(`[${new Date().toISOString()}] Manual validation completed. Updated ${updates.length} habits.`);
      return updates;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error during manual streak validation:`, error);
      throw error;
    }
  }

  /**
   * Force catch-up maintenance
   */
  async forceCatchUp() {
    try {
      console.log('Forcing catch-up maintenance...');
      await this.catchUpMissedMaintenance();
      return { message: 'Catch-up maintenance completed successfully' };
    } catch (error) {
      console.error('Error during forced catch-up:', error);
      throw error;
    }
  }
}

export default SchedulerService;
