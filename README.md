# Password Cleaner

A secure, client-side web application for cleaning up and managing password exports from Chrome and Brave browsers.

## Features

- Import password exports in CSV format
- Group passwords by domain
- Easily identify and manage duplicate passwords
- Mark passwords for keeping, deletion, or review
- Visit websites directly to test passwords
- Export cleaned password list back to CSV
- Fully client-side processing for maximum security

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
   - Click on a domain to expand/collapse the password list
   - Use the buttons to mark passwords as:
     - ✓ Keep
     - ✗ Delete
     - ? Review

4. Click "Export Cleaned CSV" to download your cleaned password list.

## Security

This application processes all data locally in your browser. No data is ever sent to any server or stored anywhere outside your device.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
