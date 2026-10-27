// LIST + DETAIL assignment: data is loaded from workouts.json.
// The fallback lets the page still work if index.html is opened directly as a file.
const fallbackData = {
  workouts: [
    {id:1,title:'Upper Body Strength',category:'Strength',level:'Beginner',duration:'30 min',tag:'01',description:'Build a strong foundation with simple upper-body exercises. Focus on controlled movements and steady breathing.',exercises:['Push-ups — 3 sets × 8–12 reps','Incline push-ups — 3 sets × 10 reps','Plank — 3 sets × 30 seconds'],equipment:'Exercise mat (optional)',tip:'Keep your body in a straight line during push-ups. Rest 60–90 seconds between sets.'},
    {id:2,title:'Leg Day Essentials',category:'Strength',level:'Intermediate',duration:'40 min',tag:'02',description:'A lower-body session designed to develop strength, balance, and control using basic movements.',exercises:['Bodyweight squats — 3 sets × 12 reps','Reverse lunges — 3 sets × 10 per leg','Glute bridges — 3 sets × 15 reps','Calf raises — 3 sets × 15 reps'],equipment:'No equipment required',tip:'Keep your knees aligned with your toes and use a comfortable range of motion.'},
    {id:3,title:'Cardio Energy Boost',category:'Cardio',level:'Beginner',duration:'20 min',tag:'03',description:'Raise your heart rate with a short cardio circuit. Adjust the pace to your fitness level and take breaks when needed.',exercises:['March or jog in place — 3 minutes','Jumping jacks — 3 sets × 30 seconds','Mountain climbers — 3 sets × 20 seconds','Brisk walk — 5 minutes'],equipment:'Comfortable shoes and water',tip:'Warm up before starting and finish with easy walking to cool down.'}
  ]
};
let workouts = [];
let activeFilter = 'All';
const list = document.getElementById('workoutList');
const modal = document.getElementById('workoutModal');
const detail = document.getElementById('workoutDetail');

async function loadWorkouts() {
  try {
    const response = await fetch('./workouts.json');
    if (!response.ok) throw new Error('Could not load JSON');
    const data = await response.json();
    workouts = data.workouts;
  } catch (error) {
    workouts = fallbackData.workouts;
    console.info('Using built-in data fallback. To load workouts.json, run with VS Code Live Server.');
  }
  renderList();
}

function renderList() {
  const filtered = activeFilter === 'All' ? workouts : workouts.filter(item => item.category === activeFilter);
  document.getElementById('resultCount').textContent = `${activeFilter.toUpperCase()} WORKOUTS · ${filtered.length}`;
  if (!filtered.length) {
    list.innerHTML = '<p class="empty-state">No workouts in this category yet.</p>';
    return;
  }
  list.innerHTML = filtered.map((workout, index) => `
    <article class="workout-card">
      <div class="card-art art-${workout.id}"><span class="card-index">${workout.tag || String(index + 1).padStart(2, '0')}</span><span class="art-word">${workout.category === 'Cardio' ? 'MOVE' : workout.id === 2 ? 'POWER' : 'STRENGTH'}</span><span class="art-circle"></span></div>
      <div class="card-content"><div class="card-meta"><span>${escapeHTML(workout.category)}</span><span>${escapeHTML(workout.duration)}</span></div><h3>${escapeHTML(workout.title)}</h3><p>${escapeHTML(workout.description)}</p><div class="card-bottom"><span class="level"><span class="level-dot"></span>${escapeHTML(workout.level)}</span><button class="detail-btn" data-detail-id="${workout.id}" aria-label="View details for ${escapeHTML(workout.title)}">VIEW DETAILS <span>↗</span></button></div></div>
    </article>`).join('');
}

function showDetail(id) {
  const workout = workouts.find(item => item.id === Number(id));
  if (!workout) return;
  detail.innerHTML = `<p class="eyebrow">WORKOUT DETAILS / ${workout.tag || workout.id}</p><h2 id="detailTitle">${escapeHTML(workout.title)}</h2><p class="detail-description">${escapeHTML(workout.description)}</p><div class="detail-facts"><div><small>DURATION</small><strong>${escapeHTML(workout.duration)}</strong></div><div><small>LEVEL</small><strong>${escapeHTML(workout.level)}</strong></div><div><small>CATEGORY</small><strong>${escapeHTML(workout.category)}</strong></div></div><h3>YOUR EXERCISES</h3><ol class="exercise-list">${workout.exercises.map(exercise => `<li>${escapeHTML(exercise)}</li>`).join('')}</ol><div class="coach-tip"><strong>COACH'S TIP</strong><p>${escapeHTML(workout.tip || 'Focus on good technique and progress at your own pace.')}</p></div><p class="equipment"><strong>Equipment:</strong> ${escapeHTML(workout.equipment || 'No special equipment')}</p><button class="primary-btn modal-done" id="doneBtn">Got it <span>✓</span></button>`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
  document.getElementById('doneBtn').addEventListener('click', closeModal);
  document.getElementById('closeModal').focus();
}
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }

document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  renderList();
});
list.addEventListener('click', event => { const button = event.target.closest('[data-detail-id]'); if (button) showDetail(button.dataset.detailId); });
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target.dataset.close === 'true') closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
loadWorkouts();
