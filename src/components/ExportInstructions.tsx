'use client';

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const browsers = [
  {
    name: 'Google Chrome',
    steps: [
      'Open Chrome Settings (⋮ menu → Settings)',
      'Click on "Autofill" in the left sidebar',
      'Select "Password Manager"',
      'Click the ⋮ menu next to "Saved Passwords"',
      'Select "Export passwords"',
      'Confirm with your computer\'s password if prompted'
    ]
  },
  {
    name: 'Brave',
    steps: [
      'Open Brave Settings (☰ menu → Settings)',
      'Click on "Autofill" in the left sidebar',
      'Select "Password manager"',
      'Click the ⋮ menu next to "Saved passwords"',
      'Select "Export passwords"',
      'Confirm with your computer\'s password if prompted'
    ]
  },
  {
    name: 'Microsoft Edge',
    steps: [
      'Open Edge Settings (⋯ menu → Settings)',
      'Click on "Passwords"',
      'Click the ⋯ menu next to "Saved passwords"',
      'Select "Export passwords"',
      'Confirm with your computer\'s password if prompted'
    ]
  }
];

export default function ExportInstructions() {
  return (
    <div className="space-y-6">
      {browsers.map((browser) => (
        <div key={browser.name} className="space-y-2">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            {browser.name}
          </h3>
          <ol className="space-y-1.5 text-sm text-gray-600 ml-4">
            {browser.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
        <strong>Security Note:</strong> Your browser may ask for your system password to export passwords. 
        This is a security measure to protect your data.
      </div>
    </div>
  );
} 