import { Habit } from '../models/Habit.js';
import { HabitEvent } from '../models/HabitEvent.js';

class StreakService {
  /**
   * Calculate and update streaks for all habits of a user
   */
  static async updateUserStreaks(userId) {
    try {
      const habits = await Habit.find({ userId });
      const updates = [];

      for (const habit of habits) {
        const updatedStreak = await this.calculateCurrentStreak(habit);
        if (updatedStreak !== habit.streak) {
          updates.push({
            habitId: habit._id,
            oldStreak: habit.streak,
            newStreak: updatedStreak,
            completedToday: updatedStreak > 0 ? this.wasCompletedToday(habit) : false
          });
          
          // Update the habit
          habit.streak = updatedStreak;
          habit.completedToday = this.wasCompletedToday(habit);
          habit.prevStreak = habit.prevStreak || habit.streak;
          await habit.save();
        }
      }

      return updates;
    } catch (error) {
      console.error('Error updating user streaks:', error);
      throw error;
    }
  }

  /**
   * Calculate current streak for a specific habit
   */
  static async calculateCurrentStreak(habit) {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Get the last 30 days of completion events to calculate streak
      const thirtyDaysAgo = new Date(startOfToday);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const events = await HabitEvent.find({
        userId: habit.userId,
        habitId: habit._id,
        day: { $gte: thirtyDaysAgo }
      }).sort({ day: -1 });

      if (events.length === 0) {
        return 0;
      }

      let streak = 0;
      let currentDate = new Date(startOfToday);
      
      // Check each day backwards from today
      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const wasCompleted = events.some(event => {
          const eventDateStr = event.day.toISOString().split('T')[0];
          return eventDateStr === dateStr;
        });

        if (wasCompleted) {
          streak++;
        } else {
          // Break the streak if we find a gap
          break;
        }

        // Move to previous day
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  /**
   * Check if habit was completed today
   */
  static wasCompletedToday(habit) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    return habit.lastCompletedAt && 
           habit.lastCompletedAt >= startOfToday && 
           habit.lastCompletedAt < endOfToday;
  }

  /**
   * Reset streaks for all users at midnight
   */
  static async resetDailyStreaks() {
    try {
      console.log('Starting daily streak reset...');
      
      // Get all unique users
      const users = await Habit.distinct('userId');
      let totalUpdates = 0;

      for (const userId of users) {
        const updates = await this.updateUserStreaks(userId);
        totalUpdates += updates.length;
      }

      console.log(`Daily streak reset completed. Updated ${totalUpdates} habits.`);
      return totalUpdates;
    } catch (error) {
      console.error('Error during daily streak reset:', error);
      throw error;
    }
  }

  /**
   * Validate and fix streak inconsistencies
   */
  static async validateStreaks(userId) {
    try {
      const habits = await Habit.find({ userId });
      const inconsistencies = [];

      for (const habit of habits) {
        const calculatedStreak = await this.calculateCurrentStreak(habit);
        const actualStreak = habit.streak || 0;
        
        if (calculatedStreak !== actualStreak) {
          inconsistencies.push({
            habitId: habit._id,
            habitName: habit.name,
            storedStreak: actualStreak,
            calculatedStreak: calculatedStreak,
            difference: calculatedStreak - actualStreak
          });
        }
      }

      return inconsistencies;
    } catch (error) {
      console.error('Error validating streaks:', error);
      throw error;
    }
  }

  /**
   * Get streak statistics for a user
   */
  static async getUserStreakStats(userId) {
    try {
      const habits = await Habit.find({ userId });
      
      const stats = {
        totalHabits: habits.length,
        activeStreaks: 0,
        totalStreakDays: 0,
        longestCurrentStreak: 0,
        averageStreak: 0
      };

      if (habits.length > 0) {
        stats.activeStreaks = habits.filter(h => h.streak > 0).length;
        stats.totalStreakDays = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
        stats.longestCurrentStreak = Math.max(...habits.map(h => h.streak || 0));
        stats.averageStreak = Math.round(stats.totalStreakDays / habits.length * 10) / 10;
      }

      return stats;
    } catch (error) {
      console.error('Error getting streak stats:', error);
      throw error;
    }
  }
}

export default StreakService;
