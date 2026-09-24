const API_ROOT = '/api/v1';
const SVG_NS = 'http://www.w3.org/2000/svg';

const state = {
  history: [],
  lastAnswer: '',
  audioUrl: '',
  graph: null,
  requestController: null,
};

const $ = (selector) => document.querySelector(selector);
const questionInput = $('#question');
const askForm = $('#ask-form');
const askButton = $('#ask-button');
const askStatus = $('#ask-status');
const graphCard = $('#graph-card');
const sourcesCard = $('#sources-card');
const answerCard = $('#answer-card');
const uploadInput = $('#course-file');
const uploadButton = $('#upload-button');
const uploadStatus = $('#upload-status');
const fileList = $('#file-list');
const serviceKeyInput = $('#service-key');
const audio = $('#answer-audio');
const speakButton = $('#speak-button');

function setStatus(element, message = '', kind = '') {
  element.textContent = message;
  element.classList.remove('status-error', 'status-success', 'status-loading');
  if (kind) element.classList.add(`status-${kind}`);
}

function apiHeaders(json = false) {
  const headers = {};
  const key = serviceKeyInput?.value.trim();
  if (key) headers['X-RAG-API-Key'] = key;
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...apiHeaders(Boolean(options.body && typeof options.body === 'string')), ...(options.headers || {}) },
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }
  if (!response.ok) {
    throw new Error(typeof payload.detail === 'string' ? payload.detail : payload.message || `Request failed (${response.status}).`);
  }
  return payload;
}

function setLoading(button, loading, loadingLabel = 'Traitement…') {
  if (!button) return;
  if (loading) {
    button.dataset.originalLabel = button.innerHTML;
    button.textContent = loadingLabel;
    button.disabled = true;
  } else {
    if (button.dataset.originalLabel) button.innerHTML = button.dataset.originalLabel;
    button.disabled = false;
  }
}

function showCard(card) {
  card.hidden = false;
  $('#empty-state').hidden = true;
}

function modeLabel(mode) {
  return { explain: 'Explication', summarize: 'Résumé', quiz: 'Quiz', plan: 'Plan d’étude' }[mode] || mode;
}

function renderAnswer(text) {
  const container = $('#answer-content');
  container.replaceChildren();
  String(text || '').split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      container.append(document.createElement('br'));
      return;
    }
    if (trimmed.startsWith('### ')) {
      const heading = document.createElement('h3');
      heading.textContent = trimmed.slice(4);
      container.append(heading);
      return;
    }
    const paragraph = document.createElement('p');
    if (/^[-*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      paragraph.className = 'bullet';
      paragraph.textContent = trimmed.replace(/^[-*]\s+|^\d+[.)]\s+/, '');
    } else {
      paragraph.textContent = trimmed;
    }
    container.append(paragraph);
  });
}

function renderSources(sources) {
  const list = $('#sources-list');
  list.replaceChildren();
  $('#source-count').textContent = String(sources.length);
  sources.forEach((source) => {
    const item = document.createElement('article');
    item.className = 'source-item';
    const meta = document.createElement('div');
    meta.className = 'source-meta';
    const title = document.createElement('span');
    title.textContent = source.title || source.source || 'Source';
    const score = document.createElement('span');
    score.textContent = source.score == null ? source.source || '' : `${source.source || ''} · ${Number(source.score).toFixed(2)}`;
    meta.append(title, score);
    const snippet = document.createElement('p');
    snippet.textContent = source.snippet || 'No snippet returned.';
    item.append(meta, snippet);
    list.append(item);
  });
}

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
}

function graphNodeColor(kind) {
  return { topic: '#fdc500', practice: '#62e5a5', resource: '#c08cff' }[kind] || '#66dcff';
}

function graphLayout(nodes) {
  const width = 760;
  const height = 360;
  const center = { x: width / 2, y: height / 2 };
  const positions = new Map();
  if (nodes.length === 1) {
    positions.set(nodes[0].id, center);
    return { width, height, positions };
  }
  const topicNodes = nodes.filter((node) => node.kind === 'topic');
  const topic = topicNodes[0] || nodes[0];
  positions.set(topic.id, center);
  const others = nodes.filter((node) => node.id !== topic.id);
  const radiusX = Math.min(275, 125 + others.length * 8);
  const radiusY = Math.min(132, 78 + others.length * 3);
  others.forEach((node, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / others.length;
    positions.set(node.id, { x: center.x + Math.cos(angle) * radiusX, y: center.y + Math.sin(angle) * radiusY });
  });
  return { width, height, positions };
}

function renderGraph(graph) {
  const canvas = $('#graph-canvas');
  canvas.replaceChildren();
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  if (!nodes.length) {
    const empty = document.createElement('p');
    empty.className = 'inline-status';
    empty.textContent = 'No graph nodes returned.';
    canvas.append(empty);
    return;
  }

  const { width, height, positions } = graphLayout(nodes);
  const svg = createSvgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': graph.title || 'Concept map' });
  const defs = createSvgElement('defs');
  const marker = createSvgElement('marker', { id: 'graph-arrow', markerWidth: 7, markerHeight: 7, refX: 6, refY: 3.5, orient: 'auto' });
  marker.append(createSvgElement('path', { d: 'M0,0 L7,3.5 L0,7 z', fill: '#4b8199' }));
  defs.append(marker);
  svg.append(defs);

  const edgeLayer = createSvgElement('g', { class: 'graph-edges' });
  edges.forEach((edge) => {
    const from = positions.get(edge.source);
    const to = positions.get(edge.target);
    if (!from || !to) return;
    const line = createSvgElement('line', { x1: from.x, y1: from.y, x2: to.x, y2: to.y, stroke: '#3b7187', 'stroke-width': 1.2, 'stroke-opacity': .65, 'marker-end': 'url(#graph-arrow)' });
    edgeLayer.append(line);
  });
  svg.append(edgeLayer);

  nodes.forEach((node) => {
    const point = positions.get(node.id);
    if (!point) return;
    const group = createSvgElement('g', { class: 'graph-node' });
    const isTopic = node.kind === 'topic';
    const circle = createSvgElement('ellipse', {
      cx: point.x,
      cy: point.y,
      rx: isTopic ? 72 : 57,
      ry: isTopic ? 28 : 23,
      fill: isTopic ? 'rgba(253,197,0,.16)' : 'rgba(0,173,238,.12)',
      stroke: graphNodeColor(node.kind),
      'stroke-width': isTopic ? 1.8 : 1.1,
      'stroke-opacity': .85,
    });
    const label = createSvgElement('text', {
      x: point.x,
      y: point.y + 4,
      fill: graphNodeColor(node.kind),
      'font-family': 'Manrope, Arial, sans-serif',
      'font-size': isTopic ? 12 : 10,
      'font-weight': isTopic ? 700 : 500,
      'text-anchor': 'middle',
    });
    const text = String(node.label || node.id);
    label.textContent = text.length > 22 ? `${text.slice(0, 21)}…` : text;
    group.append(circle, label);
    svg.append(group);
  });
  canvas.append(svg);
  $('#graph-title').textContent = graph.title || 'Carte de compréhension';
  $('#graph-count').textContent = `${nodes.length} nœuds`;
}

function clearAudio() {
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
  audio.hidden = true;
  speakButton.hidden = true;
  if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
  state.audioUrl = '';
}

async function loadHealth() {
  const status = $('#service-status');
  try {
    const data = await requestJson('/health');
    const ready = data.status === 'ok' && data.database === 'ready';
    status.classList.remove('status-loading', 'status-ready', 'status-degraded', 'status-error');
    status.classList.add(ready ? 'status-ready' : 'status-degraded');
    if (data.ingesting) status.textContent = 'Indexation…';
    else if (ready) status.textContent = 'Service prêt';
    else status.textContent = 'Mode dégradé';
    $('#upload-limit').textContent = `${data.max_upload_mb || 20} MB`;
  } catch (error) {
    status.classList.remove('status-loading', 'status-ready', 'status-degraded');
    status.classList.add('status-error');
    status.textContent = 'API indisponible';
    setStatus(askStatus, error.message, 'error');
  }
}

async function loadFiles() {
  try {
    const data = await requestJson(`${API_ROOT}/knowledge/files`);
    const files = Array.isArray(data.files) ? data.files : [];
    fileList.replaceChildren();
    if (!files.length) {
      const empty = document.createElement('p');
      empty.className = 'inline-status';
      empty.textContent = 'Aucun support ajouté pour le moment.';
      fileList.append(empty);
      return;
    }
    files.forEach((file) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      const info = document.createElement('div');
      info.className = 'file-info';
      const name = document.createElement('strong');
      name.textContent = file.name;
      const details = document.createElement('small');
      details.textContent = `${String(file.extension || '').toUpperCase()} · ${formatBytes(file.size_bytes)} · ${formatDate(file.modified_at)}`;
      info.append(name, details);
      const remove = document.createElement('button');
      remove.className = 'file-delete';
      remove.type = 'button';
      remove.title = `Supprimer ${file.name}`;
      remove.setAttribute('aria-label', `Supprimer ${file.name}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => deleteFile(file.name, remove));
      item.append(info, remove);
      fileList.append(item);
    });
  } catch (error) {
    setStatus(uploadStatus, error.message, 'error');
  }
}

function formatBytes(value) {
  const bytes = Number(value) || 0;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return 'date inconnue';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'date inconnue' : date.toLocaleDateString('fr-FR');
}

async function deleteFile(filename, button) {
  if (!window.confirm(`Supprimer ${filename} de la base de connaissances ?`)) return;
  button.disabled = true;
  try {
    await requestJson(`${API_ROOT}/knowledge/files/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    setStatus(uploadStatus, `${filename} supprimé.`, 'success');
    await loadFiles();
  } catch (error) {
    button.disabled = false;
    setStatus(uploadStatus, error.message, 'error');
  }
}

async function askQuestion(event) {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!question) return;
  if (state.requestController) state.requestController.abort();
  state.requestController = new AbortController();
  setLoading(askButton, true, 'Recherche…');
  setStatus(askStatus, 'Recherche des passages et préparation de la réponse…', 'loading');
  try {
    const payload = {
      question,
      mode: $('#mode').value,
      level: $('#level').value,
      subject: $('#subject').value.trim() || null,
      include_graph: $('#graph-toggle').checked,
      history: state.history.slice(-8),
    };
    const data = await requestJson(`${API_ROOT}/ask`, {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: state.requestController.signal,
    });
    const answer = typeof data.answer === 'string' ? data.answer : data.reply || '';
    state.lastAnswer = answer;
    renderAnswer(answer);
    $('#answer-mode').textContent = `${modeLabel(data.mode)} · ${data.llm_used ? 'LLM' : 'fallback local'}`;
    $('#answer-runtime').textContent = data.vector_store_used ? 'pgvector' : 'keyword fallback';
    showCard(answerCard);
    clearAudio();
    speakButton.hidden = !data.voice_available;
    if (data.voice_available) {
      speakButton.textContent = 'Écouter ↗';
    }
    const sources = Array.isArray(data.sources) ? data.sources : [];
    if (sources.length) {
      renderSources(sources);
      sourcesCard.hidden = false;
    } else {
      sourcesCard.hidden = true;
    }
    if (data.graph) {
      state.graph = data.graph;
      renderGraph(data.graph);
      graphCard.hidden = false;
    } else {
      state.graph = null;
      graphCard.hidden = true;
    }
    state.history = [...state.history, { role: 'user', content: question }, { role: 'assistant', content: answer }].slice(-8);
    setStatus(askStatus, data.degraded ? 'Réponse dégradée : vérifie les sources et les capacités du service.' : 'Réponse prête.', data.degraded ? 'loading' : 'success');
  } catch (error) {
    if (error.name !== 'AbortError') setStatus(askStatus, error.message, 'error');
  } finally {
    setLoading(askButton, false);
    state.requestController = null;
  }
}

async function uploadFile() {
  const file = uploadInput.files?.[0];
  if (!file) return;
  setLoading(uploadButton, true, 'Indexation…');
  setStatus(uploadStatus, `Lecture de ${file.name}…`, 'loading');
  const body = new FormData();
  body.append('file', file, file.name);
  try {
    const response = await fetch(`${API_ROOT}/knowledge/upload`, { method: 'POST', headers: apiHeaders(), body });
    let payload = {};
    try { payload = await response.json(); } catch { payload = {}; }
    if (!response.ok) throw new Error(payload.detail || payload.message || `Upload failed (${response.status}).`);
    setStatus(uploadStatus, `${payload.filename} ajouté · ${payload.indexed_chunks} chunks indexés.`, 'success');
    uploadInput.value = '';
    uploadButton.disabled = true;
    await loadFiles();
    await loadHealth();
  } catch (error) {
    setStatus(uploadStatus, error.message, 'error');
  } finally {
    setLoading(uploadButton, false);
    uploadButton.disabled = !uploadInput.files?.[0];
  }
}

async function reindex() {
  const button = $('#reindex-button');
  setLoading(button, true, 'Réindexation…');
  setStatus(uploadStatus, 'Reconstruction de l’index pgvector…', 'loading');
  try {
    const data = await requestJson(`${API_ROOT}/knowledge/reindex`, { method: 'POST' });
    setStatus(uploadStatus, `${data.chunks} chunks dans ${data.files} fichiers.`, 'success');
    await loadHealth();
  } catch (error) {
    setStatus(uploadStatus, error.message, 'error');
  } finally {
    setLoading(button, false);
  }
}

async function speakAnswer() {
  if (!state.lastAnswer) return;
  setLoading(speakButton, true, 'Génération…');
  setStatus(askStatus, 'Génération de la voix ElevenLabs…', 'loading');
  try {
    const data = await requestJson(`${API_ROOT}/tts`, { method: 'POST', body: JSON.stringify({ text: state.lastAnswer }) });
    if (typeof data.audio_base64 !== 'string') throw new Error('Audio response is empty.');
    const binary = window.atob(data.audio_base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    const blob = new Blob([bytes], { type: data.mime_type || 'audio/mpeg' });
    if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
    state.audioUrl = URL.createObjectURL(blob);
    audio.src = state.audioUrl;
    audio.hidden = false;
    await audio.play();
    setStatus(askStatus, 'Lecture de la réponse démarrée.', 'success');
  } catch (error) {
    setStatus(askStatus, error.message, 'error');
  } finally {
    setLoading(speakButton, false);
  }
}

askForm.addEventListener('submit', askQuestion);
uploadButton.addEventListener('click', uploadFile);
$('#reindex-button').addEventListener('click', reindex);
speakButton.addEventListener('click', speakAnswer);
serviceKeyInput.addEventListener('change', () => {
  loadFiles();
  loadHealth();
});

document.querySelectorAll('[data-question]').forEach((button) => {
  button.addEventListener('click', () => {
    questionInput.value = button.dataset.question || '';
    questionInput.focus();
  });
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files?.[0];
  uploadButton.disabled = !file;
  setStatus(uploadStatus, file ? `${file.name} sélectionné (${formatBytes(file.size)}).` : '', file ? 'loading' : '');
});

const dropZone = $('#drop-zone');
['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  });
});
['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
  });
});
dropZone.addEventListener('drop', (event) => {
  const files = event.dataTransfer?.files;
  if (!files?.length) return;
  const transfer = new DataTransfer();
  transfer.items.add(files[0]);
  uploadInput.files = transfer.files;
  uploadInput.dispatchEvent(new Event('change'));
});

window.addEventListener('beforeunload', () => {
  if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
});

loadHealth();
loadFiles();
