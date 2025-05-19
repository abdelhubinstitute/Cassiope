// Simple client-side logic for AI Article Workflow
const state={
  title:null,
  research:null,
  outline:null,
  draft:null,
  critique:null,
  revision:null,
  imageUrl:null,
  html:null,
  topics:[]
};

// NOTE: Do NOT store real API keys in the repository.
// Provide your own keys in a .env file or enter them in the UI.
const GOD_MODE_KEYS = {
  openai: "", // replaced with placeholder
  fal: ""     // replaced with placeholder
};

function useGodKeys() {
  document.getElementById('openaiKey').value = GOD_MODE_KEYS.openai;
  document.getElementById('falKey').value = GOD_MODE_KEYS.fal;
  saveKeys(); 
  // Optionally, provide more immediate feedback if desired, though saveKeys() already gives feedback.
  // For example: document.getElementById('keysSaved').textContent = '✔ Test keys applied and saved!';
  // document.getElementById('keysSaved').style.display = 'inline'; 
}

// Prompt utilities
function getPromptValue(id) {
  const el = document.getElementById(id);
  if (!el) return undefined;
  const val = el.value && el.value.trim();
  return val || el.placeholder || undefined;
}

// Default prompt templates (shown to user if they haven't typed anything yet)
const DEFAULT_PROMPTS = {
  titleSystemPrompt: `Vous êtes un rédacteur senior spécialisé dans les titres percutants. Générez 10 titres créatifs et accrocheurs pour l'article en gardant à l'esprit le public professionnel visé. Retournez la liste numérotée de 1 à 10 sans texte additionnel.`,
  topicsSystemPrompt: `En vous basant sur le titre choisi, proposez cinq sous-thèmes de recherche concis qui aideront à creuser le sujet plus en profondeur. Retournez une liste numérotée.`,
  researchSystemPrompt: `Tu es un assistant de recherche qui effectue des recherches web en direct et résume les résultats avec des citations.\n\nPour chaque sujet sélectionné, tu dois :\n1. Faire une recherche en ligne à jour.\n2. Rédiger un résumé concis (200-300 mots) des informations les plus fiables.\n3. Insérer des citations numérotées entre crochets [1], [2], etc.\n4. Lister les sources (titre + URL) à la fin du résumé.`,
  outlineSystemPrompt: `À partir du titre et des recherches fournies, propose trois plans détaillés différents pour un article. Chaque plan doit comporter des sections et sous-sections claires et couvrir les points clés. Nomme-les \"Option 1\", \"Option 2\" et \"Option 3\".`,
  draftSystemPrompt: `Rédige un brouillon complet en suivant le plan sélectionné. Intègre le contenu de la recherche, adopte un ton clair et engageant, et termine par une conclusion forte.`,
  critiqueSystemPrompt: `Analyse le brouillon et génère trois critiques constructives : points forts, axes d'amélioration et recommandations concrètes.`,
  revisionSystemPrompt: `À partir du brouillon et de la critique choisie, rédige une version révisée nettement améliorée, prête à être publiée.`,
  imageSystemPrompt: `Génère un prompt d'image descriptif, visuellement riche et adapté à l'article, prêt pour un modèle de génération d'images IA.`,
  htmlSystemPrompt: `Convertis l'article final en HTML propre, responsive, en utilisant une structure sémantique. Si une image est fournie, place-la judicieusement.`
};

// Build the collapsable sidebar that aggregates all prompt inputs
(function buildPromptSidebar() {
  const sidebar = document.getElementById('promptSidebar');
  if (!sidebar) return;

  // Mapping of section titles to the input IDs they contain
  const sections = {
    'Titres': ['titleSystemPrompt'],
    'Sujets': ['topicsSystemPrompt'],
    'Recherche': ['researchSystemPrompt'],
    'Plan': ['outlineSystemPrompt'],
    'Brouillon': ['draftSystemPrompt'],
    'Critiques': ['critiqueSystemPrompt'],
    'Révision': ['revisionSystemPrompt'],
    'Image': ['imageSystemPrompt'],
    'HTML': ['htmlSystemPrompt']
  };

  Object.entries(sections).forEach(([sectionTitle, ids]) => {
    const details = document.createElement('details');
    details.className = 'mb-4';

    const summary = document.createElement('summary');
    summary.textContent = sectionTitle;
    summary.className = 'font-heading font-semibold cursor-pointer py-2';
    details.appendChild(summary);

    ids.forEach((id) => {
      const label = document.querySelector(`label[for="${id}"]`);
      const textarea = document.getElementById(id);
      if (!textarea) return;

      // Prefill textarea with default prompt template (if any)
      if (!textarea.value) {
        textarea.value = DEFAULT_PROMPTS[id] || textarea.placeholder || '';
      }

      // Ensure the textarea and label are visible when moved
      if (label) {
        label.style.display = 'block';
        label.classList.add('mt-2');
        details.appendChild(label);
      }
      textarea.style.display = 'block';
      details.appendChild(textarea);
    });

    sidebar.appendChild(details);
  });
})();

// Hook up the sidebar toggle if not already (safety)
const _toggleBtn = document.getElementById('sidebarToggleBtn');
const _sidebar = document.getElementById('promptSidebar');
const _closeBtn = document.getElementById('sidebarCloseBtn');
if (_toggleBtn && _sidebar) {
  _toggleBtn.addEventListener('click', () => {
    // Debug: log state before toggle
    console.log('Sidebar toggle clicked. Current classes:', _sidebar.className);
    const isHidden = _sidebar.classList.contains('translate-x-full');
    if (isHidden) {
      _sidebar.classList.remove('translate-x-full');
      _sidebar.classList.add('translate-x-0');
    } else {
      _sidebar.classList.add('translate-x-full');
      _sidebar.classList.remove('translate-x-0');
    }
  });
}

// Close button hides the sidebar
if (_closeBtn && _sidebar) {
  _closeBtn.addEventListener('click', () => {
    _sidebar.classList.add('translate-x-full');
    _sidebar.classList.remove('translate-x-0');
  });
}

// Utilities
function getKeys(){
  return {
    openai:localStorage.getItem('openaiKey')||document.getElementById('openaiKey').value.trim(),
    fal:localStorage.getItem('falKey')||document.getElementById('falKey').value.trim()
  };}

function saveKeys(){
  const key=document.getElementById('openaiKey').value.trim();
  const fal=document.getElementById('falKey').value.trim();
  if(!key){alert('Entrez la clé OpenAI');return;}
  localStorage.setItem('openaiKey',key);
  if(fal){localStorage.setItem('falKey',fal);}
  // validate key via backend
  fetch('/api/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiKey:key})})
    .then(r=>r.json())
    .then(d=>{
      if(d.ok){
        document.getElementById('keysSaved').style.display='inline';
        document.getElementById('keysSaved').style.color='green';
        document.getElementById('keysSaved').textContent='✔ Clé valide enregistrée';
        // Reveal the first workflow step
        show('step-topic');
        // Scroll to it for convenience
        document.getElementById('step-topic').scrollIntoView({ behavior: 'smooth' });
      }else{
        document.getElementById('keysSaved').style.display='inline';
        document.getElementById('keysSaved').style.color='red';
        document.getElementById('keysSaved').textContent='Clé API invalide';
      }
    }).catch(()=>{
      document.getElementById('keysSaved').style.display='inline';
      document.getElementById('keysSaved').style.color='red';
      document.getElementById('keysSaved').textContent='Vérification de la clé échouée';
    });
}

function show(id){document.getElementById(id).classList.remove('hidden');}
function hide(id){document.getElementById(id).classList.add('hidden');}
function clearList(el){while(el.firstChild)el.removeChild(el.firstChild);} 

// Global loading overlay
const loader=document.createElement('div');
loader.id='globalLoader';
loader.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center text-white text-xl font-semibold z-[9999] hidden';
loader.innerHTML = `<div class="flex flex-col items-center">
  <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  <span>Chargement...</span>
</div>`;
document.body.appendChild(loader);
function showLoader(){loader.classList.remove('hidden');}
function hideLoader(){loader.classList.add('hidden');}

// Wrap fetch helper to show loader
async function doFetch(url,options){
  try{showLoader();return await fetch(url,options);}finally{hideLoader();}
}

// Step 1: Titles
async function generateTitles(){
  const theme=document.getElementById('theme').value.trim();
  const {openai}=getKeys();
  if(!theme||!openai){alert('Sujet et clé OpenAI nécessaires');return;}
  const systemPrompt=getPromptValue('titleSystemPrompt');
  const res=await doFetch('/api/title',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme,apiKey:openai,systemPrompt})});
  const data=await res.json();
  const list=document.getElementById('titleList');
  clearList(list);
  const selectedClasses = ['bg-primary-accent', 'bg-opacity-10', 'text-primary-accent', 'font-semibold', 'border-primary-accent'];
  const generalLiClasses = ['font-sans', 'cursor-pointer', 'hover:bg-grey-light', 'hover:bg-opacity-40', 'p-2', 'rounded-md', 'mb-1', 'border', 'border-grey-light', 'hover:border-secondary-accent'];

  data.titles.forEach(t=>{
    const li=document.createElement('li');
    li.textContent=t;
    li.classList.add(...generalLiClasses);
    li.onclick=()=>{
      state.title=t;
      [...list.children].forEach(x=>{
        x.classList.remove(...selectedClasses);
        x.classList.add(...generalLiClasses.filter(cls => !selectedClasses.includes(cls) && !x.classList.contains(cls)));
      });
      li.classList.add(...selectedClasses);
      show('step-topics');
    };
    list.appendChild(li);
  });
}

// Step 2: Generate Search Topics
async function generateTopics(){
  const {openai}=getKeys();
  if(!state.title||!openai){alert('Titre et clé OpenAI nécessaires');return;}
  const systemPrompt=getPromptValue('topicsSystemPrompt');
  const res=await doFetch('/api/topics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,apiKey:openai,systemPrompt})});
  const data=await res.json();
  state.topics=data.topics;
  renderTopics();
  show('step-topics');
}

function renderTopics(){
  const list=document.getElementById('topicsList');
  clearList(list);
  const selectedClasses = ['bg-primary-accent', 'bg-opacity-10', 'text-primary-accent', 'font-semibold', 'border-primary-accent'];
  const generalLiClasses = ['font-sans', 'cursor-pointer', 'hover:bg-grey-light', 'hover:bg-opacity-40', 'p-2', 'rounded-md', 'mb-1', 'border', 'border-grey-light', 'hover:border-secondary-accent'];

  state.topics.forEach((topic,idx)=>{
    const li=document.createElement('li');
    li.textContent=topic;
    li.classList.add(...generalLiClasses);
    li.onclick=()=>{
        selectedClasses.forEach(cls => li.classList.toggle(cls));
    };
    list.appendChild(li);
  });
}

function addCustomTopic(){
  const input=document.getElementById('customTopic');
  const val=input.value.trim();
  if(val){state.topics.push(val);renderTopics();input.value='';}
}

// Step 3: Research using selected topics
async function generateResearch(){
  const {openai}=getKeys();
  const systemPrompt=getPromptValue('researchSystemPrompt');
  const selected=[...document.querySelectorAll('#topicsList li.bg-primary-accent')].map(li=>li.textContent.trim());
  const topicsArr=selected.length?selected:state.topics;
  if(topicsArr.length===0){alert('Sélectionnez au moins un sujet ou ajoutez-en pour la recherche.');return;}
  const btn=document.getElementById('generateResearchBtn');
  btn.disabled=true;btn.textContent='Traitement...';
  const res=await doFetch('/api/research',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topics:topicsArr,apiKey:openai,systemPrompt})});
  const data=await res.json();
  state.research=data.research;
  document.getElementById('researchOut').textContent=data.research;
  btn.disabled=false;btn.textContent='Générer la recherche';
  show('step-outline');
}

// Step 4: Outlines
async function generateOutlines(){
  const {openai}=getKeys();
  if(!state.title||!state.research||!openai){alert('Étapes précédentes requises');return;}
  const systemPrompt=getPromptValue('outlineSystemPrompt');
  const res=await doFetch('/api/outline',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,research:state.research,apiKey:openai,systemPrompt})});
  const data=await res.json();
  const list=document.getElementById('outlineList');clearList(list);
  const selectedClasses = ['bg-primary-accent', 'bg-opacity-10', 'text-primary-accent', 'font-semibold', 'border-primary-accent'];
  const generalLiClasses = ['font-sans', 'cursor-pointer', 'hover:bg-grey-light', 'hover:bg-opacity-40', 'p-2', 'rounded-md', 'mb-1', 'border', 'border-grey-light', 'hover:border-secondary-accent'];

  data.outlines.forEach(o=>{
    const li=document.createElement('li');
    li.textContent=o;
    li.classList.add(...generalLiClasses);
    li.onclick=()=>{
      state.outline=o;
      [...list.children].forEach(x=>{
        x.classList.remove(...selectedClasses);
        x.classList.add(...generalLiClasses.filter(cls => !selectedClasses.includes(cls) && !x.classList.contains(cls)));
      });
      li.classList.add(...selectedClasses);
      show('step-draft');
    };
    list.appendChild(li);
  });
    btn.disabled=false;btn.textContent='Générer les plans';
}

// Step 5: Draft
async function generateDraft(){
  const {openai}=getKeys();
  if(!state.title||!state.research||!state.outline){alert('Étapes précédentes requises');return;}
  const systemPrompt=getPromptValue('draftSystemPrompt');
  const res=await doFetch('/api/draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,research:state.research,outline:state.outline,apiKey:openai,systemPrompt})});
  const data=await res.json();
  state.draft=data.draft;
  document.getElementById('draftOut').textContent=data.draft;
    btn.disabled=false;btn.textContent='Générer le brouillon';
}

// Step 6: Critiques
async function generateCritiques(){
  const {openai}=getKeys();
  const feedback=document.getElementById('userFeedback').value.trim();
  const systemPrompt=getPromptValue('critiqueSystemPrompt');
  if(!state.draft){alert('Générez d\'abord le brouillon');return;}
  const btn=event.target;btn.disabled=true;btn.textContent='Traitement...';
  const res=await doFetch('/api/critique',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({draft:state.draft,userFeedback:feedback||'Aucun retour fourni',apiKey:openai,systemPrompt})});
  const data=await res.json();
  const list=document.getElementById('critiqueList');clearList(list);
  const selectedClasses = ['bg-primary-accent', 'bg-opacity-10', 'text-primary-accent', 'font-semibold', 'border-primary-accent'];
  const generalLiClasses = ['font-sans', 'cursor-pointer', 'hover:bg-grey-light', 'hover:bg-opacity-40', 'p-2', 'rounded-md', 'mb-1', 'border', 'border-grey-light', 'hover:border-secondary-accent'];

  data.critiques.forEach(c=>{
    const li=document.createElement('li');
    li.textContent=c;
    li.classList.add(...generalLiClasses);
    li.onclick=()=>{
      state.critique=c;
      [...list.children].forEach(x=>{
        x.classList.remove(...selectedClasses);
        x.classList.add(...generalLiClasses.filter(cls => !selectedClasses.includes(cls) && !x.classList.contains(cls)));
      });
      li.classList.add(...selectedClasses);
      show('step-revision');
    };
    list.appendChild(li);
  });
    btn.disabled=false;btn.textContent='Générer les critiques';
  show('step-critique');
}

// Step 7: Revision
async function generateRevision(){
  const {openai}=getKeys();
  if(!state.critique){alert('Sélectionnez une critique');return;}
  const systemPrompt=getPromptValue('revisionSystemPrompt');
  const res=await doFetch('/api/revision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,research:state.research,outline:state.outline,draft:state.draft,critique:state.critique,apiKey:openai,systemPrompt})});
  const data=await res.json();
  state.revision=data.revision;
  document.getElementById('revisionOut').textContent=data.revision;
  btn.disabled=false;btn.textContent="Générer l'article final";
  show('step-image');
}

// Step 8: Image
async function generateImage(){
  const {openai}=getKeys();
  if(!state.revision){alert('Générez d\'abord l\'article révisé');return;}
  const systemPrompt=getPromptValue('imageSystemPrompt');
  const res=await doFetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({article:state.revision,apiKey:openai,falKey:getKeys().fal,systemPrompt})});
  const data=await res.json();
  state.imageUrl=data.imageUrl;
  document.getElementById('featuredImg').src=data.imageUrl;
  document.getElementById('featuredImg').style.display='block';
  document.getElementById('downloadImageBtn').classList.remove('hidden');
  document.getElementById('imagePromptOut').textContent=data.imagePrompt;
  btn.disabled=false;btn.textContent='Générer l\'image';
  show('step-html');
}

// Step 9: HTML
async function generateHTML(){
  const {openai}=getKeys();
  if(!state.revision||!state.imageUrl){alert('Article et image requis');return;}
  const systemPrompt=getPromptValue('htmlSystemPrompt');
  const payload={article:state.revision,apiKey:openai,systemPrompt};
  if(state.imageUrl && !state.imageUrl.startsWith('data:')){payload.imageUrl=state.imageUrl;}
  const res=await doFetch('/api/html',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await res.json();
  state.html=data.html;
  document.getElementById('htmlOut').value=data.html;
  btn.disabled=false;btn.textContent='Générer le HTML';
  show('downloadHtmlBtn');
}

function downloadHTML(){
  if(!state.html){alert('Aucun HTML généré');return;}
  const blob=new Blob([state.html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='article.html';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadImage(){
  if(!state.imageUrl){alert('Pas encore d\'image');return;}
  const link=document.createElement('a');
  link.href=state.imageUrl;
  link.download='featured.png';
  link.click();
} 