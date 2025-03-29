import { TUserGuideData } from "../types";

type TGuides =
  | 'DASHBOARD'
  | 'CM_STATS'
  | 'CM_RECENT_EVENT'
  | 'CM_EVENTS'
  | 'CM_TASKS'
  | 'BS_TRACKER'
  | 'CS_CALENDAR'
  | 'CHATBOT'
  | 'HISTORY'
  | 'H_INFO'
  | 'H_NOTES';

export const USER_GUIDE: Record<TGuides, TUserGuideData> = {
  DASHBOARD: {
    title: 'Dashboard Guide',
    description: 'Learn how to navigate and use the dashboard.',
    slides: [
      {
        explanation:
          'The Dashboard is your central hub for household management. It provides a quick overview of all important information and activities.',
        src: '/images/guides/dashboard/overview.png',
        alt: 'Dashboard overview showing the main interface'
      },
      {
        explanation:
          'Use the navigation buttons at the top of the dashboard to quickly access different sections like Cleanliness, Bills, Calendar, and more.',
        src: '/images/guides/dashboard/shortcuts.png',
        alt: 'Dashboard navigation buttons highlighted'
      },
      {
        explanation:
          'View summaries of recent activities, upcoming tasks, and important notifications directly on your dashboard for quick reference.',
        src: '/images/guides/dashboard/summaries.png',
        alt: 'Dashboard summaries section showing recent activities'
      }
    ]
  },
  CM_STATS: {
    title: 'Cleanliness Stats Guide',
    description: 'Learn how to understand and use the cleanliness statistics dashboard.',
    slides: [
      {
        explanation:
          "The Cleanliness Stats section shows a comprehensive breakdown of everyone's cleaning activities. You can view total tasks completed, assigned, and created by each household member at a glance.",
        src: '/images/guides/cleanliness/overview.png',
        alt: 'Cleanliness stats overview showing total activity'
      },
      {
        explanation:
          'Interactive bar charts allow you to examine each roommate\'s individual contribution. Hover over any bar to see detailed metrics including "Gave out" (tasks assigned to others), "Assigned" (current tasks), and "Completed" (finished tasks).',
        src: '/images/guides/cleanliness/stats.png',
        alt: 'Cleanliness stats bar chart with hover details'
      }
    ]
  },
  CM_RECENT_EVENT: {
    title: 'Recent Cleanliness Events Guide',
    description: 'Learn how to view and interact with the most recent cleanliness events.',
    slides: [
      {
        explanation:
          'The Recent Events section displays the most recent kitchen activity, showing all changes made when someone entered or exited the kitchen. This gives you an immediate overview of the latest cleanliness updates.',
        src: '/images/guides/cleanliness/most-recent.png',
        alt: 'Recent cleanliness event showing kitchen activity changes'
      },
      {
        explanation:
          'Click on any image to expand it for a better view. The expanded view allows you to see more details and examine the cleanliness state more clearly before and after changes were made.',
        src: '/images/guides/cleanliness/image-expand.png',
        alt: 'Expanded view of a cleanliness event image'
      }
    ]
  },
  CM_EVENTS: {
    title: 'Cleanliness Events History Guide',
    description: 'Learn how to navigate and use the cleanliness events history.',
    slides: [
      {
        explanation:
          'The Events History page provides a chronological record of all cleanliness activities in your household. Browse through this comprehensive listing to track changes over time and monitor household cleaning patterns.',
        src: '/images/guides/cleanliness/past-events.png',
        alt: 'Events history page showing past cleanliness activities'
      },
      {
        explanation:
          'For more information about any specific event, click the "View Details" button. This gives you access to complete information including who was involved, when it happened, and what specifically changed.',
        src: '/images/guides/cleanliness/view-details.png',
        alt: 'View details button highlighted on an event card'
      },
      {
        explanation:
          'The detailed event modal displays all associated tasks, before and after images, and activity logs. Use the filtering options to narrow down information by person, date range, or activity type to quickly find what you need.',
        src: '/images/guides/cleanliness/modal.png',
        alt: 'Event details modal with filters and comprehensive information'
      },
      {
        explanation:
          'Save time with Quick Actions in the events list. Select multiple events simultaneously to perform batch operations like assigning similar tasks to roommates or marking several items as complete at once.',
        src: '/images/guides/cleanliness/quick-actions.png',
        alt: 'Quick actions panel for multi-selecting and batch assigning tasks'
      }
    ]
  },
  CM_TASKS: {
    title: 'Tasks Management Guide',
    description: 'Learn how to effectively manage cleaning tasks in your household.',
    slides: [
      {
        explanation:
          'The Tasks section is your central hub for managing all cleaning responsibilities. Here you can view, assign, complete, and track the status of every task in your household.',
        src: '/images/guides/cleanliness/tasks.png',
        alt: 'Tasks management interface showing list of household cleaning tasks'
      },
      {
        explanation:
          'Use the filtering system to quickly find specific tasks. You can filter by assignee, status, date, or priority level to focus on exactly what you need.',
        src: '/images/guides/cleanliness/filter.png',
        alt: 'Task filtering options with various filter criteria expanded'
      },
      {
        explanation:
          'Save time with Quick Filters for common searches like "All Tasks", "Your Tasks", "Pending Tasks", or "History". These preset filters help you access frequently needed information with just one click.',
        src: '/images/guides/cleanliness/quick-filters.png',
        alt: 'Quick filter buttons for common task filtering needs'
      },
      {
        explanation:
          'The Actions menu provides all task management options. You can assign tasks to roommates, mark items as complete, dismiss false detections, delete tasks, or match related tasks quickly.',
        src: '/images/guides/cleanliness/actions.png',
        alt: 'Task action menu showing various options for task management'
      },
      {
        explanation:
          'The Match Existing feature helps you connect related tasks, such as when an item is returned to its place. When you match "pan removed" to a previous "pan added" task, both will be resolved automatically.',
        src: '/images/guides/cleanliness/match-existing.png',
        alt: 'Match existing task interface showing how to connect related tasks'
      },
      {
        explanation:
          'For efficient bulk management, use Multi-Actions to handle several tasks at once. Select multiple items through filtering, then apply the same action to all selected tasks simultaneously.',
        src: '/images/guides/cleanliness/multi-actions.png',
        alt: 'Multi-action interface with multiple tasks selected for bulk processing'
      }
    ]
  },
  BS_TRACKER: {
    title: 'Bill Splitter Guide',
    description: 'Learn how to manage shared expenses with your roommates.',
    slides: [
      {
        explanation:
          "The Outstanding Debts section shows all your current debts to others. You can see the name of each debt, who you owe, the deadline, and the amount due. Click the clipboard icon to mark a debt as paid once you've settled it.",
        src: '/images/guides/billsplitter/outstanding.png',
        alt: 'Outstanding debts screen showing unpaid bills and payment options'
      },
      {
        explanation:
          "The Outstanding Loans section lets you track money you've lent to others. You can monitor the total amount that has been paid back so far and how much you originally paid them.",
        src: '/images/guides/billsplitter/loans.png',
        alt: 'Outstanding loans screen showing money lent and repayment status'
      },
      {
        explanation:
          "The Bill Details view shows who still hasn't paid you and how much they owe. You can easily update the payment status of any individual directly from this screen.",
        src: '/images/guides/billsplitter/details.png',
        alt: 'Bill details showing individual payment statuses and amounts owed'
      },
      {
        explanation:
          'The History tab provides a complete record of all your loans and debts. This gives you a comprehensive overview of all financial transactions within your household over time.',
        src: '/images/guides/billsplitter/history.png',
        alt: 'Bill history showing all past financial transactions'
      },
      {
        explanation:
          'Create new bills by entering the bill name, due date, total amount, and how to split it among roommates. Quick buttons help you easily set splitting arrangements, adjust bill amounts, and set due dates. Save frequently used bills as presets for future use.',
        src: '/images/guides/billsplitter/create.gif',
        alt: 'Bill creation interface with quick buttons and preset options'
      }
    ]
  },
  CS_CALENDAR: {
    title: 'Schedule Management Guide',
    description: 'Learn how to plan and track recurring tasks for your household.',
    slides: [
      {
        explanation:
          'Schedule allows you to plan recurring tasks, assign them to household members, and easily track who is doing what, when, and if they completed their responsibilities.',
        src: '/images/guides/schedule/overview.png',
        alt: 'Schedule overview showing recurring tasks and assignments'
      },
      {
        explanation:
          'You can add a new chore by clicking the Create button. Choose from convenient presets for common household tasks or create your own custom recurring tasks based on your needs.',
        src: '/images/guides/schedule/create.png',
        alt: 'Chore creation interface with preset options and custom creation'
      },
      {
        explanation:
          'Click on any chore to see complete details including who is responsible. Use the toggle switch to mark when you have completed your part. Once all assigned members complete their responsibilities, the chore is automatically marked as done.',
        src: '/images/guides/schedule/details.png',
        alt: 'Chore details showing responsible members and completion toggles'
      }
    ]
  },
  CHATBOT: {
    title: 'Chatbot Guide',
    description: 'Learn how to use the SMS chatbot with your household members.',
    slides: [
      {
        explanation:
          'The chatbot allows you to enable an SMS chatbot to create a groupchat with all the members. The chatbot will send you reminders and messages for chores, bills, and cleanliness tasks.',
        src: '/images/guides/chatbot/overview.png',
        alt: 'Chatbot overview showing SMS groupchat with household members'
      }
    ]
  },
  HISTORY: {
    title: 'Activity History Guide',
    description: 'Learn how to track and review all household activities.',
    slides: [
      {
        explanation:
          'History shows you everything that has happened and by who. This makes sure that everything is documented and that people stay responsible and accountable.',
        src: '/images/guides/history/overview.png',
        alt: 'History overview showing documented household activities'
      }
    ]
  },
  H_INFO: {
    title: 'House Info Guide',
    description: 'Manage your house details, members, and invitations with ease.',
    slides: [
      {
        explanation:
          "The House Info section lets you view and manage your house details including its name and address. You'll also see a summary of features like your house chatbot.",
        src: '/images/guides/house/info.png',
        alt: 'House information page showing name, address, and chatbot details'
      },
      {
        explanation:
          "Click the Edit button to update your house's name or address. Changes are saved instantly and reflect across the app.",
        src: '/images/guides/house/edit.png',
        alt: 'Edit interface showing house name and address fields'
      },
      {
        explanation:
          'Use the Add button to invite new roommates to your house. Enter their email—just make sure they already have an account.',
        src: '/images/guides/house/add.png',
        alt: "Invite interface prompting for a roommate's email address"
      },
      {
        explanation:
          'The Roommates section shows everyone currently in your house. You can view their roles and remove roommates if needed.',
        src: '/images/guides/house/mates.png',
        alt: 'List of current housemates with remove option'
      },
      {
        explanation:
          "Pending shows any invites you've sent that haven't been accepted yet. You can cancel an invite here if needed.",
        src: '/images/guides/house/pending.png',
        alt: 'Pending invitations list with cancel option'
      }
    ]
  },

  H_NOTES: {
    title: 'House Notes Guide',
    description: 'View and create notes to share important information with your house.',
    slides: [
      {
        explanation:
          "The Notes section shows messages and tips left by your current or past roommates. It's a shared feed for everyone in the house to stay informed.",
        src: '/images/guides/house/notes.png',
        alt: 'Notes feed showing posts from roommates'
      },
      {
        explanation:
          'Click Create to write a new note. You can also highlight your note so it stays pinned at the top of the feed for everyone to see.',
        src: '/images/guides/house/create.png',
        alt: 'Create note interface with highlight option'
      }
    ]
  }
};

