export const titles = {
  Environment: [
    { minPoints: 0, title: 'Nature Lover' },
    { minPoints: 200, title: 'Eco Friend' },
    { minPoints: 500, title: 'Green Advocate' },
    { minPoints: 800, title: 'Eco Warrior' },
    { minPoints: 1200, title: 'Environmental Guardian' },
    { minPoints: 1600, title: 'Planet Protector' },
    { minPoints: 2000, title: 'Sustainability Champion' },
  ],
  Education: [
    { minPoints: 0, title: 'Learner' },
    { minPoints: 200, title: 'Knowledge Seeker' },
    { minPoints: 500, title: 'Education Supporter' },
    { minPoints: 800, title: 'Teaching Assistant' },
    { minPoints: 1200, title: 'Education Champion' },
    { minPoints: 1600, title: 'Mentor' },
    { minPoints: 2000, title: 'Wisdom Guide' },
  ],
  'Social Work': [
    { minPoints: 0, title: 'Helper' },
    { minPoints: 200, title: 'Community Helper' },
    { minPoints: 500, title: 'Social Worker' },
    { minPoints: 800, title: 'Advocate' },
    { minPoints: 1200, title: 'Community Builder' },
    { minPoints: 1600, title: 'Change Maker' },
    { minPoints: 2000, title: 'Social Justice Warrior' },
  ],
  Healthcare: [
    { minPoints: 0, title: 'Caregiver' },
    { minPoints: 200, title: 'Health Supporter' },
    { minPoints: 500, title: 'Medical Assistant' },
    { minPoints: 800, title: 'Healthcare Hero' },
    { minPoints: 1200, title: 'Wellness Champion' },
    { minPoints: 1600, title: 'Healer' },
    { minPoints: 2000, title: 'Life Saver' },
  ],
  'Animal Welfare': [
    { minPoints: 0, title: 'Animal Lover' },
    { minPoints: 200, title: 'Pet Friend' },
    { minPoints: 500, title: 'Animal Advocate' },
    { minPoints: 800, title: 'Wildlife Protector' },
    { minPoints: 1200, title: 'Animal Rights Champion' },
    { minPoints: 1600, title: 'Compassionate Guardian' },
    { minPoints: 2000, title: 'Beast Master' },
  ],
  'Disaster Relief': [
    { minPoints: 0, title: 'Responder' },
    { minPoints: 200, title: 'Relief Worker' },
    { minPoints: 500, title: 'Emergency Helper' },
    { minPoints: 800, title: 'Crisis Manager' },
    { minPoints: 1200, title: 'Disaster Hero' },
    { minPoints: 1600, title: 'Resilience Builder' },
    { minPoints: 2000, title: 'Hope Restorer' },
  ],
};

// Combination-based titles using the user's top 3 tracks.
// Key format: track names sorted alphabetically and joined with ' | '
// Example key: 'Education | Environment | Social Work'
const combinationTitles = {
  // Environment + Education + Social Work
  'Education | Environment | Social Work': [
    { minPoints: 0, title: 'Everyday Community Learner' },
    { minPoints: 600, title: 'Neighborhood Knowledge Builder' },
    { minPoints: 1200, title: 'Grassroots Change Scholar' },
    { minPoints: 2000, title: 'Community Wisdom Weaver' },
  ],
  // Environment + Education + Healthcare
  'Education | Environment | Healthcare': [
    { minPoints: 0, title: 'Wellness Learning Companion' },
    { minPoints: 600, title: 'Healthy Futures Guide' },
    { minPoints: 1200, title: 'Holistic Care Educator' },
    { minPoints: 2000, title: 'Community Wellbeing Steward' },
  ],
  // Environment + Education + Animal Welfare
  'Animal Welfare | Education | Environment': [
    { minPoints: 0, title: 'Curious Creature Caretaker' },
    { minPoints: 600, title: 'Nature & Pawprints Guide' },
    { minPoints: 1200, title: 'Wildlife Learning Guardian' },
    { minPoints: 2000, title: 'Earth & Animal Storykeeper' },
  ],
  // Environment + Education + Disaster Relief
  'Disaster Relief | Education | Environment': [
    { minPoints: 0, title: 'Resilient Futures Learner' },
    { minPoints: 600, title: 'Preparedness Educator' },
    { minPoints: 1200, title: 'Resilience Classroom Champion' },
    { minPoints: 2000, title: 'Community Recovery Mentor' },
  ],
  // Environment + Social Work + Healthcare
  'Environment | Healthcare | Social Work': [
    { minPoints: 0, title: 'Care In Every Corner' },
    { minPoints: 600, title: 'Neighborhood Wellness Ally' },
    { minPoints: 1200, title: 'Community Care Connector' },
    { minPoints: 2000, title: 'Holistic Healing Neighbor' },
  ],
  // Environment + Social Work + Animal Welfare
  'Animal Welfare | Environment | Social Work': [
    { minPoints: 0, title: 'Street & Shelter Friend' },
    { minPoints: 600, title: 'Compassionate Community Guardian' },
    { minPoints: 1200, title: 'Voices for People & Paws' },
    { minPoints: 2000, title: 'Shared Planet Care Steward' },
  ],
  // Environment + Social Work + Disaster Relief
  'Disaster Relief | Environment | Social Work': [
    { minPoints: 0, title: 'First To Show Up' },
    { minPoints: 600, title: 'Neighborhood Response Anchor' },
    { minPoints: 1200, title: 'Community Crisis Companion' },
    { minPoints: 2000, title: 'Everyday Recovery Beacon' },
  ],
  // Environment + Healthcare + Animal Welfare
  'Animal Welfare | Environment | Healthcare': [
    { minPoints: 0, title: 'Gentle Care Companion' },
    { minPoints: 600, title: 'Wellbeing For All Species' },
    { minPoints: 1200, title: 'Circle of Care Guardian' },
    { minPoints: 2000, title: 'Healing Hands & Hearts' },
  ],
  // Environment + Healthcare + Disaster Relief
  'Disaster Relief | Environment | Healthcare': [
    { minPoints: 0, title: 'Steady Support Responder' },
    { minPoints: 600, title: 'Frontline Wellbeing Ally' },
    { minPoints: 1200, title: 'Community Calm Keeper' },
    { minPoints: 2000, title: 'Resilient Care Champion' },
  ],
  // Environment + Animal Welfare + Disaster Relief
  'Animal Welfare | Disaster Relief | Environment': [
    { minPoints: 0, title: 'Storm & Shelter Friend' },
    { minPoints: 600, title: 'Rescue & Refuge Ally' },
    { minPoints: 1200, title: 'Disaster-Safe Haven Keeper' },
    { minPoints: 2000, title: 'Lifeline for Every Living Being' },
  ],
  // Education + Social Work + Healthcare
  'Education | Healthcare | Social Work': [
    { minPoints: 0, title: 'Kindness Classroom Companion' },
    { minPoints: 600, title: 'Everyday Wellness Educator' },
    { minPoints: 1200, title: 'Care & Learning Guide' },
    { minPoints: 2000, title: 'Community Healing Mentor' },
  ],
  // Education + Social Work + Animal Welfare
  'Animal Welfare | Education | Social Work': [
    { minPoints: 0, title: 'Voices for Kindness Learner' },
    { minPoints: 600, title: 'Community Compassion Educator' },
    { minPoints: 1200, title: 'Hearts & Pawprints Advocate' },
    { minPoints: 2000, title: 'Circle of Care Storyteller' },
  ],
  // Education + Social Work + Disaster Relief
  'Disaster Relief | Education | Social Work': [
    { minPoints: 0, title: 'Resilience Story Learner' },
    { minPoints: 600, title: 'Preparedness Community Guide' },
    { minPoints: 1200, title: 'Recovery Together Educator' },
    { minPoints: 2000, title: 'Neighborhood Resilience Keeper' },
  ],
  // Education + Healthcare + Animal Welfare
  'Animal Welfare | Education | Healthcare': [
    { minPoints: 0, title: 'Everyday Gentle Teacher' },
    { minPoints: 600, title: 'Compassion & Care Guide' },
    { minPoints: 1200, title: 'Wellbeing For All Advocate' },
    { minPoints: 2000, title: 'Healing & Harmony Steward' },
  ],
  // Education + Healthcare + Disaster Relief
  'Disaster Relief | Education | Healthcare': [
    { minPoints: 0, title: 'Calm & Care Learner' },
    { minPoints: 600, title: 'Preparedness Health Educator' },
    { minPoints: 1200, title: 'Recovery & Wellness Guide' },
    { minPoints: 2000, title: 'Community Healing Anchor' },
  ],
  // Education + Animal Welfare + Disaster Relief
  'Animal Welfare | Disaster Relief | Education': [
    { minPoints: 0, title: 'Gentle Responder in Training' },
    { minPoints: 600, title: 'Rescue Stories Educator' },
    { minPoints: 1200, title: 'Safe Havens Storykeeper' },
    { minPoints: 2000, title: 'Guardian of Second Chances' },
  ],
  // Social Work + Healthcare + Animal Welfare
  'Animal Welfare | Healthcare | Social Work': [
    { minPoints: 0, title: 'Compassion in Every Direction' },
    { minPoints: 600, title: 'Neighborhood Care & Comfort' },
    { minPoints: 1200, title: 'Kindness Across Species' },
    { minPoints: 2000, title: 'Heartwide Healing Guardian' },
  ],
  // Social Work + Healthcare + Disaster Relief
  'Disaster Relief | Healthcare | Social Work': [
    { minPoints: 0, title: 'Steady Hands in Hard Times' },
    { minPoints: 600, title: 'Calm in the Storm Companion' },
    { minPoints: 1200, title: 'Recovery Care Advocate' },
    { minPoints: 2000, title: 'Resilient Community Healer' },
  ],
  // Social Work + Animal Welfare + Disaster Relief
  'Animal Welfare | Disaster Relief | Social Work': [
    { minPoints: 0, title: 'Responder With a Gentle Heart' },
    { minPoints: 600, title: 'Shelter & Support Ally' },
    { minPoints: 1200, title: 'Hope For Streets & Shelters' },
    { minPoints: 2000, title: 'Compassion in Every Crisis' },
  ],
  // Healthcare + Animal Welfare + Disaster Relief
  'Animal Welfare | Disaster Relief | Healthcare': [
    { minPoints: 0, title: 'Calm Care Companion' },
    { minPoints: 600, title: 'Lifeline in Tough Moments' },
    { minPoints: 1200, title: 'Rescue & Recovery Healer' },
    { minPoints: 2000, title: 'Guardian of Fragile Lives' },
  ],
};

export function getTitleForTrack(trackName, points) {
  const trackTitles = titles[trackName];
  if (!trackTitles) return 'Contributor';
  
  // Find the highest title the user qualifies for
  for (let i = trackTitles.length - 1; i >= 0; i--) {
    if (points >= trackTitles[i].minPoints) {
      return trackTitles[i].title;
    }
  }
  return trackTitles[0].title;
}

export function getCurrentTitle(tracks) {
  if (!tracks || tracks.length === 0) return 'Newcomer';

  // Sort tracks by points (desc) and pick the top 3
  const topTracks = [...tracks]
    .filter(t => typeof t.points === 'number')
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  // If we don't have at least one valid track, fallback
  if (topTracks.length === 0) return 'Newcomer';

  // Build combination key from the top 3 track names (sorted alphabetically)
  const comboKey = topTracks
    .map(t => t.name)
    .filter(Boolean)
    .sort()
    .join(' | ');

  const totalPoints = topTracks.reduce((sum, t) => sum + (t.points || 0), 0);

  // If we have a combination-based title, use it
  const comboList = combinationTitles[comboKey];
  if (comboList) {
    for (let i = comboList.length - 1; i >= 0; i--) {
      if (totalPoints >= comboList[i].minPoints) {
        return comboList[i].title;
      }
    }
    return comboList[0].title;
  }

  // Fallback: use single-track title based on the top track only
  const topTrack = topTracks[0];
  return getTitleForTrack(topTrack.name, topTrack.points);
}