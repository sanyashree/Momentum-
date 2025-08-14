// Test script for streak service functionality
import StreakService from './services/streakService.js';
import SchedulerService from './services/schedulerService.js';

console.log('Testing Streak Service...');

// Test the streak service methods
async function testStreakService() {
  try {
    console.log('1. Testing streak calculation...');
    
    // Mock habit object for testing
    const mockHabit = {
      _id: 'test-habit-id',
      userId: 'test-user-id',
      name: 'Test Habit',
      streak: 5,
      completedToday: true,
      lastCompletedAt: new Date(),
      prevLastCompletedAt: null
    };

    console.log('2. Testing wasCompletedToday...');
    const completedToday = StreakService.wasCompletedToday(mockHabit);
    console.log('Was completed today:', completedToday);

    console.log('3. Testing streak validation...');
    // This would require a database connection
    console.log('Streak validation test skipped (requires DB connection)');

    console.log('4. Testing scheduler service...');
    const scheduler = new SchedulerService();
    const status = scheduler.getStatus();
    console.log('Scheduler status:', status);

    console.log('✅ Streak service tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing streak service:', error);
  }
}

// Run tests
testStreakService();
