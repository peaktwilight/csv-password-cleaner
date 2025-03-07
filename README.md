# Password Cleaner

A secure, client-side web application for cleaning up and managing password exports from Chrome and Brave browsers.

## Features

### Core Features
- Import password exports in CSV format
- Secure, client-side processing - no data leaves your browser
- Export cleaned password list back to CSV
- Automatic password grouping by domain
- Password strength analysis and visualization
- Auto-hiding of revealed passwords after 30 seconds
- Copy passwords to clipboard with one click

### Password Management
- Group passwords by domain with expandable/collapsible sections
- Mark passwords individually or in bulk as:
  - ✓ Keep
  - ✗ Delete
  - ? Review
- Visit websites directly to test passwords
- View password strength indicators
- Show/hide password values securely

### Organization & Sorting
- Sort password groups by:
  - Alphabetical order (A-Z)
  - Number of passwords per domain
  - Last used date
  - Security risk level
- Search functionality for quick access to specific:
  - Domains
  - Usernames
  - Password patterns
- Filter passwords by:
  - Status (keep/delete/review)
  - Password strength
  - Usage frequency

### Security Features
- Fully client-side processing for maximum security
- No data storage - everything stays in memory
- Automatic password hiding after inactivity
- Password strength analysis
- Identification of duplicate passwords
- Detection of weak or compromised passwords

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
   - Use keyboard shortcuts for faster review

5. Click "Export Cleaned CSV" to download your cleaned password list.

## Security

This application processes all data locally in your browser:
- No data is ever sent to any server
- No data is stored in localStorage or cookies
- Memory is cleared when you close the tab
- Passwords are automatically hidden after 30 seconds of being revealed

## Keyboard Shortcuts

Coming soon:
- `Space`: Expand/collapse current group
- `K`: Mark as keep
- `D`: Mark as delete
- `R`: Mark as review
- `C`: Copy password
- `V`: Visit website
- `→`: Next password
- `←`: Previous password

## License

This project is licensed under the MIT License - see the LICENSE file for details.
