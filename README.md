# Password Cleaner

A secure, client-side web application for cleaning up and managing password exports from Chrome, Brave, Edge and most other Chromium browsers.

![alt text](public/screenshot-homepage.png)
![alt text](public/screenshot-password-list.png)
![alt text](public/screenshot-password-security=dashboard.png)
![alt text](public/screenshot-password-generator.png)

## Features

### Core Features
- Import password exports in CSV format
- Secure, fully-local client-side processing - no data leaves your browser
- Export cleaned password list back to CSV
- Automatic password grouping by domain
- Password strength analysis and visualization
- Auto-hiding of revealed passwords after 30 seconds
- Copy passwords to clipboard with one click
- Modern, responsive UI with smooth animations and transitions

### Password Management
- Mark passwords individually or in bulk as:
  - ✓ Keep
  - ✗ Delete
  - ? Review
- Visit websites directly to test passwords
- View password strength indicators with detailed metrics
- Show/hide password values securely
- Bulk actions for entire domain groups
- Password reveal timeout (30-second auto-hide)
- One-click password copying with visual feedback

### Organization & Sorting
- Sort password groups by:
  - Alphabetical order (A-Z)
  - Number of passwords per domain
  - Last used date
  - Security risk level
- Search functionality for quick access to:
  - Domains
  - Usernames
  - Password patterns
- Filter passwords by:
  - Status (keep/delete/review)
  - Password strength
  - Usage frequency
- Domain-based grouping with collapsible sections
- Visual progress tracking of reviewed passwords

### Security Features
- Fully client-side processing for maximum security
- No data storage - everything stays in memory
- Automatic password hiding after inactivity
- Password strength analysis including:
  - Entropy calculation
  - Character set complexity
  - Length assessment
  - Special character usage
- Identification of duplicate passwords
- Detection of weak or compromised passwords
- Security dashboard with risk assessment

### Password Generator
- Generate strong passwords with customizable options:
  - Length (6-32 characters)
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
- Real-time password strength visualization
- Advanced security metrics:
  - Entropy calculation
  - Number of possible combinations
  - Time-to-crack estimates with humorous descriptions
  - Visual strength indicator
- Copy generated passwords with one click
- Animated password generation effect

### User Interface
- Modern, clean design with gradient accents
- Responsive layout for all screen sizes
- Interactive elements with hover effects
- Progress tracking visualization
- Collapsible password groups
- Smooth transitions and animations
- Visual feedback for all actions
- Domain favicons for easy recognition
- Intuitive status indicators

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pass-cleaner.git
cd pass-cleaner
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Export your passwords from Chrome or Brave:
   - Chrome: chrome://settings/passwords → ⋮ → Export passwords
   - Brave: brave://settings/passwords → ⋮ → Export passwords

2. Click "Upload CSV" in the application and select your exported password file.

3. Review your passwords:
   - Passwords are grouped by domain
   - Use the sort and filter options to organize your review
   - Click on a domain to expand/collapse the password list
   - Use the bulk actions to quickly process similar passwords
   - View password strength indicators to identify weak passwords
   - Copy passwords to clipboard when needed
   - Visit sites directly to verify passwords

4. Track your progress:
   - Use the progress indicator to see how many passwords you've reviewed
   - Filter out reviewed items to focus on remaining work
   - Sort by different criteria to optimize your workflow

5. Click "Export Cleaned CSV" to download your cleaned password list.

## Security

This application processes all data locally in your browser:
- No data is ever sent to any server
- No data is stored in localStorage or cookies
- Memory is cleared when you close the tab
- Passwords are automatically hidden after 30 seconds of being revealed
- All processing happens client-side for maximum security

## License

This project is licensed under the MIT License - see the LICENSE file for details.
