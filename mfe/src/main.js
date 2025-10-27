import axios from 'axios';

const app = document.getElementById('app');
const bff = import.meta.env.VITE_BFF_BASE_URL || 'http://localhost:8080';

async function load() {
  const agg = await axios.get(`${bff}/aggregate`).then(r => r.data).catch(()=>({customers:[],orders:[]}));
  app.innerHTML = `
    <h1>PJBL MFE</h1>
    <h2>Aggregate</h2>
    <pre>${JSON.stringify(agg, null, 2)}</pre>
  `;
}
load();
