# Smart Sachivalayam Portal

A complete, responsive website for citizens to access Sachivalayam services and for authorized staff to manage notices and announcements.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Features

### Citizen Portal
- **Home Page** — Hero section, quick service cards, latest announcements
- **About Sachivalayam** — Objectives, benefits, and services overview
- **Citizen Services** — Certificates, pension, ration card, grievance services, downloadable forms
- **Notice Board** — Searchable list of notices with title, description, and date
- **Contact Page** — Contact form with validation, office details, map placeholder

### Staff Portal
- **Staff Login** — Username/password validation
- **Dashboard** — Add, edit, delete notices; manage announcements; view statistics

### Additional
- Fully responsive (mobile, tablet, desktop)
- Smooth scrolling navigation
- Local storage for notices persistence
- Loading animations and back-to-top button
- Modern government-themed UI

## Project Structure

```
csp/
├── index.html          # Home page
├── about.html          # About Sachivalayam
├── services.html       # Citizen services
├── notices.html        # Public notice board
├── login.html          # Staff login
├── dashboard.html      # Staff dashboard
├── contact.html        # Contact page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── script.js       # Shared utilities & public pages
│   ├── login.js        # Authentication
│   └── dashboard.js    # Notice CRUD operations
├── assets/
│   ├── images/         # Image assets
│   └── icons/          # Icon assets
└── README.md
```

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No build tools or server required

Alternatively, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`

### Staff Login Credentials (Demo)

| Field    | Value              |
|----------|--------------------|
| Username | `admin`            |
| Password | `Sachivalayam@2024`|

> **Note:** This is a front-end demo. For production, replace with secure server-side authentication.

## GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`

All project files are already at the repository root (`csp/`), so no extra folder setup is needed.

## Usage Guide

### For Citizens
1. Browse services on the **Services** page
2. Check **Notices** for latest announcements
3. Use the **Contact** form for inquiries
4. Download forms from the Services page

### For Staff
1. Go to **Staff Login**
2. Enter credentials and access the **Dashboard**
3. **Add Notice** — Fill title, description, date, and type
4. **Manage Notices** — Edit or delete existing entries
5. Changes appear instantly on the public Notice Board (stored in browser localStorage)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- Vanilla JavaScript (ES6+)
- Local Storage API

## License

This project is open source and available for educational and demonstration purposes.

---

**Smart Sachivalayam Portal** — Government services at your doorstep.
