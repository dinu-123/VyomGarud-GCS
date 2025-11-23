 🛩️ VyomGarud – Ground Control Station (GCS)

VyomGarud GCS is a full-stack drone operations dashboard that provides:

✔ Live drone tracking  
✔ Real-time telemetry  
✔ Flight history & reports  
✔ Drone management  
✔ Pilot & project management  
✔ Integrated LiveTrack modal with video + map  
✔ Interactive charts for flight analytics  

---

 📁 Project Structure

vyomgarud-gcs/
│── backend/ # FastAPI / Python backend
│ ├── app/
│ ├── requirements.txt
│ └── README.md (optional)
│
│── frontend/ # React + Vite + TypeScript frontend
│ ├── src/
│ ├── public/
│ │ └── demo-flight.mp4 # Demo live-stream video
│ └── package.json
│
└── README.md (this file)


---

 🚀 Tech Stack

Frontend
- React (Vite + TS)
- Recharts (graphs)
- Leaflet Maps
- Tailwind CSS
- Axios

Backend
- FastAPI
- Python
- Redis (optional, for live updates)
- Uvicorn

---

 🛠️ Installation & Setup

1️⃣ Clone the repository
bash
git clone https://github.com/YOUR_USERNAME/vyomgarud-gcs.git
cd vyomgarud-gcs

Backend Setup (FastAPI)
Install dependencies

cd backend
pip install -r requirements.txt

Run backend server

Run backend server

uvicorn app.main:app --reload

Backend runs at:

http://localhost:8000


🎨 Frontend Setup (React + Vite)
Install dependencies

cd frontend
npm install


Run frontend

npm run dev

Frontend runs at:

http://localhost:5173

🎥 Live Drone View (Demo)

The project includes a demo drone video:

frontend/public/demo-flight.mp4


Features Overview :

1. DASHBOARD

Live flights overview

Drone list

Pilot overview

Quick actions

Graphs & stats

2. FLIGHT DETAILS

Flight path visualization

Altitude graph

Speed graph

Battery stats

3. LIVE TRACKING

Live drone video

Moving map marker

Telemetry in real time

Mini-map overlay

4. Management Modules

Drones

Pilots

Projects

Flights

Calendar view


📸 Screenshots :


LOGIN PAGE :

<img width="1913" height="930" alt="Screenshot (1285)" src="https://github.com/user-attachments/assets/729c159e-5de7-4de2-825b-02248981cbb1" />

DASHBOARD :

<img width="1891" height="926" alt="Screenshot (1286)" src="https://github.com/user-attachments/assets/b72d927c-ae6f-4bb4-8582-5c5accc250c7" />

<img width="1897" height="927" alt="Screenshot (1287)" src="https://github.com/user-attachments/assets/71673eb5-3c45-4983-b497-4bc7cf1da4ae" />

LIVE DRONE PAGE :

<img width="1901" height="921" alt="Screenshot (1288)" src="https://github.com/user-attachments/assets/babe5bb0-8d61-4b95-8481-3dd41aa2fcac" />

<img width="1864" height="832" alt="Screenshot (1289)" src="https://github.com/user-attachments/assets/71c854fb-31a1-4432-818f-5e7fc38de6e5" />

DRONES PAGE :

<img width="1895" height="924" alt="Screenshot (1290)" src="https://github.com/user-attachments/assets/e2f1f950-4497-429a-8663-0ddeeec5a4cf" />

<img width="1897" height="925" alt="Screenshot (1291)" src="https://github.com/user-attachments/assets/3876a280-42b8-4557-912f-b019c87fef36" />

FLIGHT DETAILS PAGE :

<img width="1905" height="927" alt="Screenshot (1292)" src="https://github.com/user-attachments/assets/208d1a91-c49b-4844-a809-4271955ac578" />

<img width="1899" height="931" alt="Screenshot (1293)" src="https://github.com/user-attachments/assets/36db5995-d18a-4e07-914d-79026760eeec" />

FLIGHTS PAGE :

<img width="1899" height="928" alt="Screenshot (1294)" src="https://github.com/user-attachments/assets/0cdbae34-cb1e-4ca7-a42c-3125be871b79" />

PILOTS PAGE :

<img width="1900" height="923" alt="Screenshot (1295)" src="https://github.com/user-attachments/assets/533564f4-935a-4b37-9d7f-9307c5fe558a" />

PROJECTS PAGE :

<img width="1897" height="922" alt="Screenshot (1296)" src="https://github.com/user-attachments/assets/b426d0f7-f11e-4cfb-86a4-0ab7f9026c97" />

OPERATION CALENDAR :

<img width="1907" height="925" alt="Screenshot (1297)" src="https://github.com/user-attachments/assets/895342b3-4ded-415e-9128-086cf357230e" />

INSPECTION PAGE :

<img width="1890" height="924" alt="Screenshot (1298)" src="https://github.com/user-attachments/assets/55228bcb-ad1e-47d2-acfe-e2f12f14fe8e" />

INCIDENTS PAGE :

<img width="1902" height="926" alt="Screenshot (1299)" src="https://github.com/user-attachments/assets/d88a1f61-0334-46cc-8416-a1d9a61f72ba" />

GENERATE REPORTS PAGE :

<img width="1901" height="920" alt="Screenshot (1300)" src="https://github.com/user-attachments/assets/9778a065-547a-430d-be71-d19f59af8118" />

SETTINGS PAGE :

<img width="1893" height="926" alt="Screenshot (1301)" src="https://github.com/user-attachments/assets/e247c8b7-fdc1-425a-9962-1f7f26d6dfd1" />















